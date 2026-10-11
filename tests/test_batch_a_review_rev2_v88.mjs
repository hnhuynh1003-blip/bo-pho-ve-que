// v88 Lô A revision 2: source provenance is a release gate, never an approval.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');
const review=JSON.parse(read('docs/v88_BATCH_A_REVIEW_REV2.json'));
const spec=JSON.parse(read('docs/v88_BATCH_A_9_SCENES_SPEC.json'));
assert.equal(review.schema,1);
assert.equal(review.records.length,9);
assert.equal(review.statusCounts.standaloneLegacyConcepts,3);
assert.equal(review.statusCounts.infographicCrops,6);
assert.equal(review.statusCounts.approvedShells,0);
assert.equal(new Set(review.records.map(x=>x.id)).size,9);
assert.deepEqual(review.stageRange,[1,2,3]);
assert.equal(spec.scenes.length,9);
const byId=new Map(spec.scenes.map(x=>[x.id,x]));
for(const row of review.records){
 const master=byId.get(row.id);
 assert.ok(master, 'No master design '+row.id);
 assert.equal(row.tier,master.tier);
 assert.equal(row.career,master.career);
 assert.equal(row.approved,false);
 assert.equal(row.productionArt,null);
 assert.equal(row.measuredAnchorsReady,false);
 assert.equal(row.maskReady,false);
 assert.equal(master.approvedProductionAsset,null);
 assert.equal(master.ready,false);
 if(row.career==='boba'){
  assert.equal(row.sourceType,'standalone-recovered-concept');
  assert.equal(row.filename,'TRA_SUA_B'+String(row.tier).padStart(2,'0')+'_PREVIEW.webp');
  assert.ok(row.qaReferencePath.startsWith('tra_sua_concept/'));
 }else{
  assert.equal(row.sourceType,'infographic-crop-reference','No counterfeit Mì Cay / Xiên Que standalone art');
  assert.equal(row.filename,null);
  assert.ok(row.qaReferencePath.startsWith('tham_khao_info/'));
  assert.ok(row.qaReferencePath.endsWith('_TRICH_BANG_KHONG_DUNG_LAM_SHELL.png'));
  assert.ok(row.issues.some(x=>x.includes('reference only')));
 }
}
assert.ok(review.productionRules.copyReferenceToProduction===false);
assert.ok(review.productionRules.userApprovalRequired===true);
assert.ok(review.productionRules.decorMayNotBeBaked===true);
assert.ok(review.records.find(x=>x.id==='boba-b2').issues.some(x=>x.includes('cart wheels')));
const sandbox={window:{}};
vm.runInNewContext(read('js/v88-shop-scenes.js'),sandbox);
assert.equal(sandbox.window.BPVQShopScenesV88.diagnostics().ready,0,'Review art cannot silently activate any game shell');
console.log('BATCH A REVIEW REV2: 3 recovered scene concepts + 6 labeled infographic crops, 0 game shells PASS');
