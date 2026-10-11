// Catalog invariants for the 27 approved architecture concepts — NO image/asset generation.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const code=fs.readFileSync(new URL('../js/phone-os-v88.js',import.meta.url),'utf8');
const marker='// === DUDU v88: data-driven architecture catalog';
const index=code.lastIndexOf(marker);
assert.ok(index>0,'27-shell module not found in unified Phone OS');
let s={currentCareer:'boba',shopStage:0,coins:27500,sp:2,decorations:['welcome_sign'],inventory:{tea_black:24}};
let saved=0;
const holder={innerHTML:''};
const win={BPVQDecorV88:{slots:()=>Array.from({length:24},(_,i)=>({tier:i<6?1:Math.min(9,Math.floor(i/3)+2),kind:i<2?'system':'counter'}))}};
const sandbox={window:win,get gameState(){return s;},document:{getElementById:id=>id==='v88-architecture-preview'?holder:null}};
vm.runInNewContext(code.slice(index),sandbox,{filename:'architecture-v88.js'});
const a=win.BPVQArchitectureV88;
assert.ok(a,'catalog API missing');
assert.deepEqual(Array.from(a.careers()),['boba','noodle','streetfood']);
assert.equal(a.all().length,27,'three professions must have nine shells');
assert.equal(new Set(a.all().map(x=>x.id)).size,27,'shell IDs must be unique');
assert.equal(a.stages().length,9);
for(const profession of a.careers()){
 assert.equal(a.all().filter(x=>x.career===profession).length,9,'missing career '+profession);
 for(let tier=1;tier<=9;tier++){
  const item=a.get(profession,tier);
  assert.ok(item?.shape&&item?.roof&&item?.yard&&item?.feature&&item?.notes,'incomplete shell '+profession+' '+tier);
  assert.equal(item.stage,tier);
  assert.equal(item.assetStatus,'pending-approved-art','must not claim 27 ready art assets');
 }
}
assert.ok(a.get('boba',1).notes.includes('Không được dựng nhà'),'B1 is a cart, not a house');
assert.ok(a.get('boba',5).roof.includes('ngói đỏ'),'B5 one-floor country roof');
assert.ok(a.get('boba',6).notes.includes('gác lửng'),'B6 partial mezzanine');
assert.ok(a.get('boba',7).notes.includes('MỘT nhà chính'),'B7 single main house');
assert.ok(a.get('boba',7).notes.includes('S20'),'B7 lights on beam, not balcony');
assert.ok(a.get('boba',8).notes.includes('BA công trình'),'B8 must have three buildings');
assert.ok(a.get('boba',9).notes.includes('Không thiết kế lại'),'B9 design locked');
assert.equal(a.get('boba',9).sign,'TRÀ SỮA Đặc Sản');
assert.equal(a.get('noodle',9).sign,'MÌ CAY Đặc Sản');
assert.equal(a.get('streetfood',9).sign,'XIÊN QUE Đặc Sản');
for(const career of a.careers()){
 s.currentCareer=career;s.shopStage=0;
 const before=JSON.stringify(s);
 assert.equal(a.render(holder),true,'cannot render '+career);
 assert.ok(holder.innerHTML.includes('Bản vẽ quán theo nghề'));
 assert.ok(holder.innerHTML.includes(career==='boba'?'Trà Sữa':career==='noodle'?'Mì Cay':'Xiên Que'));
 assert.equal(JSON.stringify(s),before,'preview must not change save');
 for(const tier of [1,5,7,8,9]){
  assert.equal(a.select(tier),true,'cannot select B'+tier);
  assert.ok(holder.innerHTML.includes(a.get(career,tier).title),'wrong blueprint shown');
  assert.equal(JSON.stringify(s),before,'tier preview changed save');
 }
}
assert.equal(saved,0);
console.log('ARCHITECTURE 27 CONCEPTS + 3 CAREERS + B1–B9 LOCKED DESIGN PASS');
