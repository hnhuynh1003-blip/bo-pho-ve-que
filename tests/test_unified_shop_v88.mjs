import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const html=read('index.html'),js=read('js/v88-unified-shop.js'),css=read('css/v88-unified-shop.css');
const phone=read('js/phone-os-v88.js'),art=read('js/v88-live-scene-qa.js'),core=read('js/game.js');
for(const id of ['customer-booth-card','cust-avatar','cust-name','cust-order-quote','btn-toggle-shop','v88-live-frame','v88-live-shop-sign','cs20-station','cs20-primary']){
 assert.equal(html.split(`id="${id}"`).length-1,1,`preserve native ID for ${id}`);
}
assert.match(js,/frame\.append\(customer\)/,'native customer moved into scene');
assert.match(js,/scene\.append\(cook\)/,'native cooking moved into same scene');
assert.match(js,/bridge\.snapshot\(\)/,'read real customer and phase');
assert.match(js,/live\.setColor\(id\)/,'palette in construction');
assert.match(phone,/BPVQUnifiedShop\?\.renderCustomizer\(content\)/,'paint controls in Xây Quán');
assert.match(css,/\.v88-live-controls,#v88-live-scene\.us21-unified \.v88-live-actions/,'no paint/decor controls on main');
assert.match(css,/#cs20-station\[data-state="idle"\]\{display:none!important\}/,'no empty idle kitchen');
assert.match(css,/#v88-live-scene\.us21-unified\.us21-serving/,'scene changes on active order');
assert.match(art,/!supported&&!w\.BPVQUnifiedShop/,'fallback for other careers');
assert.match(core,/const cfg=CAREER_WORKBENCH_KEYS\[c\]/,'same ingredient catalog for orders and cooking station');
assert.ok(!/gameState\.coins\s*\+\+|gameState\.inventory\s*=/.test(js),'no economy fork');
assert.match(html,/js\/v88-unified-shop\.js/);assert.match(html,/css\/v88-unified-shop\.css/);
console.log('Unified Quán v88.14.1: native customer + cooking are one scene, paint in Xây Quán: PASS');
