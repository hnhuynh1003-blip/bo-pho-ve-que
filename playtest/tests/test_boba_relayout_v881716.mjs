import assert from 'node:assert/strict';
import fs from 'node:fs';
const html=fs.readFileSync('index.html','utf8');
const css=fs.readFileSync('css/v88-17-1-6-boba-relayout.css','utf8');
const shop=fs.readFileSync('js/v88-unified-shop.js','utf8');
const kitchen=fs.readFileSync('js/v88-cooking-station.js','utf8');
assert.ok(html.includes('v88-17-1-6-boba-relayout.css'), 'new layout load');
assert.ok(html.indexOf('v88-17-1-6-boba-relayout.css')>html.indexOf('v88-17-1-5-yard-kitchen.css'),'load order');
assert.ok(css.includes('grid-template-areas:"back" "price" "stage" "pantry" "actions"'));
assert.ok(css.includes('grid-template-rows:repeat(2,138px)'),'two real ingredient rows');
assert.ok(css.includes('grid-auto-columns:calc((100% - 10px)/2)'),'not 5 minuscule cards');
assert.ok(css.includes('font-size:12px!important'),'legible labels');
assert.ok(css.includes('data-state="idle"'),'idle station accessible');
assert.ok(!shop.includes('if(lastKey&&!hasOrder&&kitchenView&&!practice)setKitchenView(false,true)'),'no auto-return');
assert.ok(shop.includes('enterKitchen.hidden=!s.started'),'access even without orders');
assert.ok(html.includes('id="cp176-start-practice"'),'practice accessible inside idle kitchen');
assert.ok(shop.includes('practiceInside?.addEventListener'),'idle practice wired');
const selected=['topping_boba','topping_white_boba','topping_peach','topping_jelly','topping_pudding','topping_crystal','topping_grass_jelly','topping_aloe'];
for(const id of selected){
  assert.ok(kitchen.includes(id+":'v88/cute-premium/"+id+"-ai-tray.webp'"),'mapped '+id);
  assert.ok(fs.existsSync(`assets/images/v88/cute-premium/${id}-ai-tray.webp`),'existing sprite '+id);
}
for(const id of ['cs20-primary','cs20-sale-price','cs20-gauge','cs20-visual','cs20-shelf','cs20-groups']) assert.ok(html.includes('id="'+id+'"'));
assert.ok(!/BPVQCookingBridge\s*=/.test(shop),'no duplicate settlement');
console.log('PASS v88.17.1.6 large spatial boba layout, 8 AI ingredient sprites, persistent kitchen and native IDs');