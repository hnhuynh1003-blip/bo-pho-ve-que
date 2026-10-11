// BPVQ v88 decor: executable regression tests without DOM/network dependencies.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const src=fs.readFileSync(new URL('../js/phone-os-v88.js',import.meta.url),'utf8');
const pos=src.lastIndexOf('/* === BPVQ v88 / Xây Quán 2.0:');
assert.ok(pos>0,'decor subsystem must be embedded inside unified phone core');
const decorSrc=src.slice(pos);
const catalog=Object.fromEntries([
 'welcome_sign','flower_corner','warm_lights','lucky_bamboo','menu_board','cat','music_corner','neon_sign',
 'aquarium','wood_furniture','koi_corner','stone_counter','vip_room','heritage_wall'
].map(id=>[id,{name:id,icon:'🪑',reqStage:0,reqLevel:1,cost:123,desc:'original buff preserved'}]));
let s=null, writes=0, failSave=false;
const win={};const sandbox={
 window:win,SHOP_DECOR_CONFIG:catalog,
 saveGameToStorage:()=>{writes++;return !failSave;},
 showToast:()=>{},
 get gameState(){return s;},
 document:{getElementById:()=>null}
};
vm.runInNewContext(decorSrc,sandbox,{filename:'phone-os-v88-decor.js'});
const a=win.BPVQDecorV88;
assert.ok(a,'module exports decor interface');
assert.equal(a.slots().length,24);
assert.equal(a.slots().filter(x=>x.kind==='system').length,2);
assert.deepEqual(Array.from(a.slots().filter(x=>x.tier<=1).map(x=>x.id)),['S1','S5','S6','S8','S11','S14']);
for(const [tier,expected] of [[1,6],[2,9],[3,11],[4,14],[5,16],[6,18],[7,20],[8,22],[9,24]]) {
 assert.equal(a.slots().filter(x=>x.tier<=tier).length,expected,'tier '+tier);
}
assert.equal(Object.keys(catalog).filter(x=>a.compatibility(x).length).length,14,'14 legacy items');
s={shopStage:0,level:1,coins:99999,decorations:['welcome_sign','flower_corner'],inventory:{tea_black:10},shopConstruction:null};
const before=JSON.stringify(s);
assert.equal(a.snapshot().stored.length,2);
assert.equal(JSON.stringify(s),before,'reading must not change old save');
assert.equal(a.place('welcome_sign','S1').ok,false,'no custom sign slot');
assert.equal(a.place('welcome_sign','S4').ok,false,'roof banner locked at tier 1');
assert.equal(a.place('wood_furniture','S5').ok,false,'cannot place unowned item');
assert.equal(a.place('welcome_sign','S5').ok,true);
assert.equal(a.snapshot().active.S5,'welcome_sign');
assert.equal(s.decorations.length,2,'ownership unchanged');
assert.equal(s.coins,99999,'no placement charge');
assert.equal(s.inventory.tea_black,10,'do not touch material inventory');
assert.equal(a.place('welcome_sign','S6').ok,true,'move existing owned item');
assert.equal(Object.values(a.snapshot().active).filter(x=>x==='welcome_sign').length,1,'no duplicate placements');
assert.equal(a.snapshot().active.S5,undefined);
assert.equal(a.place('flower_corner','S14').ok,true);
assert.equal(a.place('welcome_sign','S14').ok,false,'occupied slot');
assert.equal(a.store('S6').ok,true,'put furniture in storage');
assert.equal(a.snapshot().stored.includes('welcome_sign'),true);
assert.equal(s.decorations.includes('welcome_sign'),true,'stored still owned');
assert.equal(a.store('S6').ok,false,'no double store rewards');
assert.equal(s.shopConstruction,null,'do not alter construction');
failSave=true;
const last=JSON.stringify(s.decorV88);
assert.equal(a.place('welcome_sign','S5').ok,false,'save failure should reject');
assert.equal(JSON.stringify(s.decorV88),last,'save failure rolls back layout');
failSave=false;
s.shopStage=6;s.decorations=[...Object.keys(catalog)];s.decorV88={schema:1,placements:{}};
assert.equal(a.place('warm_lights','S8').ok,true);
assert.equal(a.place('stone_counter','S5').ok,true,'stone counter now tier 7');
assert.equal(a.snapshot().occupied.S6,'S5','counter reserves S6');
assert.equal(a.snapshot().occupied.S7,'S5','counter reserves S7');
assert.equal(a.place('menu_board','S6').ok,false,'cannot collide with counter footprint');
assert.equal(a.place('wood_furniture','S4').ok,false,'table must never occupy roof banner S4');
assert.equal(a.place('wood_furniture','S18').ok,true,'seating in tier 7');
assert.equal(a.snapshot().active.S18,'wood_furniture');
s.shopStage=7;
assert.equal(a.reconcileStage().ok,true,'upgrade transfer');
assert.equal(a.snapshot().active.S5,'stone_counter','counter survives upgrade');
assert.equal(a.snapshot().active.S18,'wood_furniture','seating survives upgrade');
s.shopStage=2;
assert.equal(a.snapshot().active.S18,undefined,'locked seating hidden on lower stage');
assert.equal(s.decorations.includes('wood_furniture'),true,'downgrade never deletes ownership');
s.shopStage=7;
assert.equal(a.snapshot().active.S18,'wood_furniture','existing layout reappears when stage is restored');
s.decorV88={schema:1,placements:{S3:'neon_sign',S4:'wood_furniture',S5:'neon_sign',S21:'vip_room'}};
assert.equal(a.reconcileStage().ok,true,'repair corrupted layout');
assert.ok(Object.values(a.snapshot().active).filter(x=>x==='neon_sign').length<=1,'deduplicate phantom placements');
assert.equal(a.snapshot().active.S4,undefined,'invalid roof furniture cleaned');
assert.equal(s.decorations.length,14,'cleaning layout cannot destroy existing ownership');
s.decorV88={schema:1,placements:{}};s.shopStage=0;s.decorations=['flower_corner'];
const box={innerHTML:''};a.render('layout',box);
assert.equal((box.innerHTML.match(/class="v88-decor-slot /g)||[]).length,24,'24 slot elements rendered');
assert.ok(box.innerHTML.includes('Bảng mái trang trí'),'S4 display identifies banner');
assert.ok(box.innerHTML.includes('6/24 ô mở'),'tier 1 slot count');
a.render('inventory',box);
assert.ok(box.innerHTML.includes('Đã sở hữu · Đang cất'),'ownership and storage distinct');
assert.ok(writes>0);
console.log('Decor v88 migration/placement/stage/save/economy regression: PASS');
