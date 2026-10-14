// V88 approved visual asset contract. No binary art is uploaded until user approval.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const source=fs.readFileSync(new URL('../js/v88-shop-scenes.js',import.meta.url),'utf8');
const window={};vm.runInNewContext(source,{window},{filename:'v88-shop-scenes.js'});
const api=window.BPVQShopScenesV88;
assert.ok(api,'scene manifest must publish a read-only resolver');
const diagnostic=api.diagnostics();
assert.equal(diagnostic.total,27);
assert.equal(diagnostic.ready,0,'no unapproved asset may be reported as ready');
assert.equal(diagnostic.pending,27);
assert.deepEqual(Array.from(diagnostic.careers),['boba','noodle','streetfood']);
assert.deepEqual(Array.from(diagnostic.lockedB9),['boba-b9','noodle-b9','streetfood-b9']);
assert.equal(api.catalog().length,27);
assert.equal(new Set(api.catalog().map(x=>x.id)).size,27);
for(const career of diagnostic.careers){
 for(let tier=1;tier<=9;tier++){
   const item=api.get(career,tier);
   assert.ok(item,'missing scene '+career+' tier '+tier);
   assert.equal(item.isReady,false,'missing shell must never load');
   assert.equal(item.artwork,null,'no fabricated broken URL');
   assert.equal(item.anchors,null,'unmeasured anchors must not ship');
   assert.equal(item.lockedDesign,tier===9);
 }
}
const cumulative=[6,9,11,14,16,18,20,22,24];
for(let tier=1;tier<=9;tier++){
 const unlocked=api.stageSlots(tier);
 assert.equal(unlocked.length,cumulative[tier-1],'wrong unlock count at B'+tier);
 assert.ok(unlocked.includes('S1'),'shop sign always present');
 if(tier<2)assert.ok(!unlocked.includes('S2'),'B1 badge is system-locked');
}
assert.deepEqual(Array.from(api.stageSlots(0)),[]);
assert.deepEqual(Array.from(api.stageSlots(10)),[]);
const base=api.catalog().find(x=>x.id==='boba-b1');
assert.equal(base.artReview,'pending');
assert.equal(api.validate(base).ready,false,'pending art must not be accepted');
const allPins=Object.fromEntries(api.stageSlots(1).map((id,i)=>[id,{x:.1+i*.1,y:.12+i*.08,layer:2}]));
const accepted={...base,artReview:'approved',approved:true,artwork:'assets/images/v88/shops/boba-b1.webp',anchors:allPins};
assert.equal(api.validate(accepted).ready,true,'schema should accept a fully approved local shell with all measured anchors');
const missingPins={...accepted,anchors:{S1:allPins.S1}};
assert.equal(api.validate(missingPins).ready,false,'reject partially anchored shells');
const remote={...accepted,artwork:'https://evil.example/boba-b1.webp'};
assert.equal(api.validate(remote).ready,false,'remote image source is not allowed');
const traversal={...accepted,artwork:'../assets/images/v88/shops/boba-b1.webp'};
assert.equal(api.validate(traversal).ready,false,'directory traversal not allowed');
const invalid={...accepted,anchors:{...allPins,S24:{x:.9,y:.9,layer:3}}};
assert.equal(api.validate(invalid).ready,false,'B1 may not include locked S24');
const badCoordinate={...accepted,anchors:{...allPins,S1:{x:1.1,y:.2,layer:2}}};
assert.equal(api.validate(badCoordinate).ready,false,'normalized coordinates must lie inside 0..1');
const corrupt={...accepted,id:'boba-b9'};
assert.equal(api.validate(corrupt).ready,false,'id and tier cannot disagree');
const refs=api.conceptReferences();
assert.equal(refs.length,9,'previously created Trà Sữa concepts must be registered');
for(let n=1;n<=9;n++){
  const x=api.getConcept('boba',n);
  assert.ok(x,'missing historical preview '+n);
  assert.equal(x.sceneId,'boba-b'+n);
  assert.equal(x.sourceFile,'TRA_SUA_B'+String(n).padStart(2,'0')+'_PREVIEW.webp');
  assert.equal(x.proposedPreviewPath,'assets/images/v88/concepts/boba-b'+n+'-concept.webp');
  assert.equal(x.isProductionShell,false,'a concept is not an approved clean scene');
  assert.equal(x.inRepository,false,'binary previews have not been committed through the text-only GitHub connection');
  assert.equal(api.get('boba',n).isReady,false,'concept must never bypass approved shell checks');
}
assert.equal(api.getConcept('boba',9).supersededByLaterApprovedB9,true,'historical red-roof B9 is not the new locked blue-roof B9');
assert.equal(api.getConcept('noodle',1),null,'do not invent Mì Cay concepts from Trà Sữa artwork');
assert.equal(api.getConcept('streetfood',1),null,'do not invent Xiên Que concepts from Trà Sữa artwork');
console.log('V88: 27 pending safe manifests, per-tier slot contract and approved local shell validation PASS');
