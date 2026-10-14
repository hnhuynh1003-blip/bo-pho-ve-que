// Batch A: validate art-production spec against actual scene and paint contracts.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');
const plan=JSON.parse(read('docs/v88_BATCH_A_9_SCENES_SPEC.json'));
const sceneHost={window:{}};
vm.runInNewContext(read('js/v88-shop-scenes.js'),sceneHost,{filename:'v88-shop-scenes.js'});
const paintHost={window:{}};
vm.runInNewContext(read('js/v88-shop-paint.js'),paintHost,{filename:'v88-shop-paint.js'});
const scenes=sceneHost.window.BPVQShopScenesV88,paint=paintHost.window.BPVQShopPaintV88;
assert.equal(plan.batch,'A');
assert.equal(plan.summary.total,9);
assert.equal(plan.scenes.length,9);
assert.equal(new Set(plan.scenes.map(x=>x.id)).size,9);
assert.deepEqual(Array.from(new Set(plan.scenes.map(x=>x.career))),['boba','noodle','streetfood']);
assert.equal(plan.summary.gameReady,0);
assert.equal(plan.designDecision?.status,'approved-art-direction-only');
assert.equal(plan.designDecision?.productionScenesApproved,0);
assert.ok(plan.designDecision?.doesNotApprove?.length>=4);
assert.equal(plan.scenes.filter(x=>x.ready).length,0,'Art direction approval must not promote production scenes');
assert.equal(plan.summary.recoveredIndividualConcepts,3);
assert.equal(plan.summary.compositeReferenceOnly,6);
assert.equal(plan.summary.otherCareersStandaloneScenes,0);
const stageShapes=new Map([[1,'Xe gỗ hai bánh'],[2,'Quầy hàng cố định'],[3,'Tiệm gỗ mặt tiền']]);
const byCareer=new Map(plan.careers.map(x=>[x.id,x]));
const sceneIds=new Set();
for(const row of plan.scenes){
 assert.ok(!sceneIds.has(row.id));sceneIds.add(row.id);
 assert.ok(row.ready===false&&row.reviewStatus==='pending','no silent approvals');
 assert.equal(row.approvedProductionAsset,null,'production binary must not be guessed');
 assert.equal(row.approvedAnchorMap,null,'draft anchors must not be treated as measured');
 assert.equal(row.batch,'A');
 assert.ok([1,2,3].includes(row.tier));
 const career=byCareer.get(row.career);assert.ok(career);
 assert.equal(row.id,row.career+'-b'+row.tier);
 assert.equal(row.signText,career.signText||career.sign,'sign text must match vocation');
 assert.equal(row.slotIds.length,[6,9,11][row.tier-1]);
 assert.deepEqual([...row.slotIds].sort(),Array.from(scenes.stageSlots(row.tier)).sort(),'slot IDs disagree with existing game');
 const paintUnlocked=paint.regions().filter(zone=>row.tier>=zone.min&&row.tier<=zone.max).map(zone=>zone.id);
 assert.deepEqual([...row.paintZones].sort(),Array.from(paintUnlocked).sort(),'paint zones violate existing restrictions');
 assert.ok(row.approvedGeometry.includes(stageShapes.get(row.tier)),'missing locked structural stage shape');
 assert.ok(row.qualityGates.length>=6);
 if(row.career==='boba'){
  assert.equal(row.previewSource,'TRA_SUA_B'+String(row.tier).padStart(2,'0')+'_PREVIEW.webp');
  assert.equal(row.sourceStatus,'recovered-boba-concept');
 }else{
  assert.equal(row.previewSource,null,'cannot claim standalone art exists in old Trà Sữa pack');
  assert.equal(row.sourceStatus,'composite-moodboard-only');
 }
 assert.equal(scenes.get(row.career,row.tier).isReady,false,'Batch A must not implicitly activate scenes');
}
assert.ok(plan.scenes.find(x=>x.id==='boba-b2').specialNotes.includes('QUẦY CỐ ĐỊNH'),'must correct old B2 wheeled concept');
assert.ok(!plan.scenes.find(x=>x.id==='boba-b1').approvedProductionAsset,'B1 draft is not production');
assert.ok(plan.productionContract.approvalRequired);
assert.ok(plan.productionContract.doNotMerge);
console.log('BATCH A 9 SCENES: distinct vocation, B1 cart/B2 fixed kiosk/B3 wood shop, slots, paint, zero approvals PASS');
