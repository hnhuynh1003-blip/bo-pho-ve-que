// v88 Paint MVP: deterministic preset, career palette, unlock and save rollback.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const source=fs.readFileSync(new URL('../js/v88-shop-paint.js',import.meta.url),'utf8');
let state={currentCareer:'boba',shopStage:0,coins:450,sp:0,decorations:['welcome_sign'],shopConstruction:null,shopName:'Trà Sữa Bé Thỏ'};
let fail=false,writeCount=0;
const messages=[];
const ui={innerHTML:''};
const window={};
const sandbox={window,
 get gameState(){return state},
 saveGameToStorage(){writeCount++;return !fail},
 showToast(message){messages.push(message)},
 document:{getElementById:id=>id==='v8775-construction-content'?ui:null}
};
vm.runInNewContext(source,sandbox,{filename:'v88-shop-paint.js'});
const api=window.BPVQShopPaintV88;
assert.ok(api,'paint API missing');
assert.equal(api.presets().length,8);
assert.equal(api.regions().length,6);
assert.equal(api.preview().tier,1);
assert.equal(api.preview().presetId,'original');
assert.equal(api.preview().career,'boba');
assert.equal(api.preview().colors.canopy,'cream');
assert.equal(api.preview().colors.sign,'tea_rose');
assert.deepEqual(Array.from(api.preview().unlocked),['canopy','sign']);
const before=JSON.stringify(state);
assert.equal(api.render(ui),true);
assert.equal(JSON.stringify(state),before,'render must never mutate an old save');
assert.equal(writeCount,0,'mere preview cannot autosave');
assert.ok(ui.innerHTML.includes('Sơn Màu Quán'));
assert.ok(ui.innerHTML.includes('KHÔNG PHẢI ẢNH SHELL'));
assert.ok(ui.innerHTML.includes('Chọn màu sẽ được lưu sẵn'));
assert.equal(api.choosePreset('warm_evening').ok,false,'must reject B5 preset at B1');
assert.equal(api.chooseRegion('roof','tile_red').ok,false,'must reject roof before B3');
assert.equal(api.chooseRegion('sign','#ff00ff').ok,false,'must reject arbitrary injection colors');
assert.equal(writeCount,0,'rejected choices cannot save or spend');
let result=api.choosePreset('milk_cream');
assert.equal(result.ok,true);
assert.equal(state.shopAppearanceV88.schema,1);
assert.equal(state.shopAppearanceV88.presetId,'milk_cream');
assert.equal(state.coins,450);
assert.equal(state.sp,0);
assert.equal(state.decorations.length,1);
assert.equal(writeCount,1);
assert.equal(api.chooseRegion('sign','walnut').ok,true);
assert.equal(api.preview().colors.sign,'walnut');
assert.equal(state.shopAppearanceV88.overrides.sign,'walnut');
const saved=JSON.stringify(state.shopAppearanceV88);
assert.ok(JSON.parse(saved).overrides.sign==='walnut');
state.shopStage=2; // B3 unlocks wall and roof
assert.ok(api.preview().unlocked.includes('roof'));
assert.equal(api.chooseRegion('wall','sage').ok,true);
assert.equal(api.chooseRegion('canopy','cream').ok,false,'canopy only exists at B1/2');
assert.equal(api.chooseRegion('wood','oak').ok,false,'wood is locked until B5');
assert.equal(api.choosePreset('red_tile').ok,true,'B3 preset should unlock at B3');
state.shopStage=4; // B5
assert.equal(api.choosePreset('warm_evening').ok,true);
assert.equal(api.chooseRegion('light','gold').ok,true);
assert.equal(api.preview().colors.light,'gold');
state.shopStage=6; // B7
assert.equal(api.choosePreset('garden_premium').ok,true);
state.shopStage=8; // B9 locked navy
assert.equal(api.choosePreset('flagship_navy').ok,true);
assert.equal(api.preview().hex.roof,'#263B53');
assert.equal(api.chooseRegion('roof','tile_red').ok,false,'B9 roof must stay locked');
assert.equal(api.preview().hex.roof,'#263B53');
assert.ok(ui.innerHTML.includes('Mái B9 giữ xanh than'));
const stored=JSON.stringify(state.shopAppearanceV88);
state.shopStage=0; // legacy reset/downgrade: must not apply locked palette
assert.equal(api.preview().presetId,'original');
assert.equal(api.preview().colors.roof,'terracotta');
assert.equal(JSON.stringify(state.shopAppearanceV88),stored,'read should not rewrite locked preset');
state.shopStage=8;
fail=true;
const lockedOld=JSON.stringify(state.shopAppearanceV88);
assert.equal(api.choosePreset('milk_cream').ok,false,'failed save should refuse paint change');
assert.equal(JSON.stringify(state.shopAppearanceV88),lockedOld,'failed save should rollback');
assert.equal(api.reset().ok,false,'failed reset should rollback');
assert.equal(JSON.stringify(state.shopAppearanceV88),lockedOld);
fail=false;
assert.equal(api.reset().ok,true);
assert.equal('shopAppearanceV88' in state,false,'reset should restore original save shape');
assert.equal(api.preview().presetId,'original');
assert.equal(state.coins,450);
assert.equal(state.sp,0);
assert.equal(state.shopConstruction,null);
for(const c of ['boba','noodle','streetfood']){
 state={currentCareer:c,shopStage:0,coins:450,sp:0,decorations:[],shopName:'Quán '+c};
 assert.equal(api.preview().career,c);
 assert.equal(api.render(ui),true);
 assert.equal(api.choosePreset('rustic_wood').ok,true);
 assert.equal(state.currentCareer,c,'never change profession');
 assert.equal(state.coins,450);
 assert.equal(state.sp,0);
 assert.equal(api.preview().presetId,'rustic_wood');
}
// Malformed past saves must render safely and not execute injected CSS/HTML.
state={currentCareer:'boba',shopStage:0,shopName:'<img src=x onerror=alert(1)>',
 shopAppearanceV88:{schema:1,presetId:'evil<script>',overrides:{sign:'javascript:alert(1)',__proto__:{foo:'evil'}}}};
const migrated=api.preview();
assert.equal(migrated.presetId,'original');
assert.equal(migrated.colors.sign,'tea_rose');
api.render(ui);
assert.ok(!ui.innerHTML.includes('<img src=x onerror=alert(1)>'),'shop name must be HTML-escaped');
assert.ok(!ui.innerHTML.includes('javascript:alert(1)'),'invalid CSS color must not leak to preview');
assert.ok(ui.innerHTML.includes('&lt;img'),'escaped name missing');
console.log('PAINT V88: 8 presets, 3 careers, 9 stages, save rollback, malformed migration and locked B9 roof PASS');
