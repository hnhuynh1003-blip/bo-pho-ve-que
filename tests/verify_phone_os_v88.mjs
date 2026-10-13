// Phone OS v88 preview - dependency-free structural smoke test.
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=file=>fs.readFileSync(new URL('../'+file,import.meta.url),'utf8');
const html=read('index.html'),js=read('js/phone-os-v88.js'),css=read('css/phone-os-v88.css'),game=read('js/game.js');
const count=(s,r)=>(s.match(r)||[]).length;
assert.equal(count(html,/src="js\/phone-os-v88\.js\?/g),1,'phone OS must load once');
assert.equal(count(html,/href="css\/phone-os-v88\.css\?/g),1,'phone CSS must load once');
for(const name of ["v8772-thitran-os","v8773-anime-signature","v8774-header-notification","v8775-os-reborn","v87751-admin-test","v8776-swipe-notifications","v8777-phone-premium","v87771-phone-repair","v87772-phone-weather-wallpaper"]) {
  assert.ok(!html.includes('src="js/'+name+'.js'),name+' is still loaded separately');
  assert.ok(!html.includes('href="css/'+name+'.css'),name+' CSS is still loaded separately');
  assert.ok(js.includes('Original component: js/'+name+'.js'),'missing '+name+' module');
  assert.ok(css.includes('Original component: css/'+name+'.css'),'missing '+name+' styles');
}
assert.equal(count(js,/window\.openSmartPhoneModal=function/g),1,'only one open wrapper');
assert.equal(count(js,/window\.closeSmartPhoneModal=function/g),1,'only one close wrapper');
assert.equal(count(js,/window\.switchPhoneApp=function/g),1,'only one app router');
assert.ok(js.includes("if(id==='progress')id='character'"),'legacy progress route');
assert.ok(js.includes("BPVQPhoneLifecycle.on('open',sync)"),'admin test open listener');
assert.ok(js.includes("BPVQPhoneLifecycle.on('home',sync)"),'weather/home listener');
assert.ok(js.includes("BPVQPhoneLifecycle.on('open',queueIcons)"),'premium icon listener');
assert.ok(js.includes("BPVQPhoneLifecycle.on('setting',applyTheme)"),'theme listener');
const gameAt=html.search(/src="js\/game\.js(?:\?[^\"]*)?"/);
const phoneAt=html.indexOf('src="js/phone-os-v88.js?');
const ledgerAt=html.indexOf('src="js/v8780-source-ledger.js?');
assert.ok(gameAt!==-1&&phoneAt>gameAt&&ledgerAt>phoneAt,'invalid script order');
assert.ok(html.indexOf('src="js/v88-kitchen-play.js?')<gameAt,'kitchen rules load before the native bridge');
assert.ok(game.includes('phonePauseActive = true')&&game.includes('phonePauseActive = false'),'native pause logic');
assert.ok(html.includes('id="modal-smartphone"')&&html.includes('id="phone-app-container"'),'phone shell');
console.log('Phone OS v88 structural checks: PASS');
