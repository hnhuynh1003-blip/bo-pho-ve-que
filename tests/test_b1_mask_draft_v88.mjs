// QA-only B1 masks: ensure review draft cannot be mistaken for game-ready artwork.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const read=f=>fs.readFileSync(new URL('../'+f,import.meta.url),'utf8');
const draft=JSON.parse(read('docs/v88_DOT7A_B1_MAT_NA_NHAP.json'));
const sceneContext={window:{}};vm.runInNewContext(read('js/v88-shop-scenes.js'),sceneContext);
const api=sceneContext.window.BPVQShopScenesV88;
const paintContext={window:{}};vm.runInNewContext(read('js/v88-shop-paint.js'),paintContext);
const paint=paintContext.window.BPVQShopPaintV88;
assert.equal(draft.id,'boba-b1');
assert.equal(draft.source,'TRA_SUA_B01_PREVIEW.webp');
assert.equal(draft.productionReady,false);
assert.equal(draft.assetsUploadedToGitHub,false);
assert.equal(draft.sourceFileChecks.allRemovalsCompleted,false);
assert.equal(draft.regions.purchasableDecor.physicallyRemoved,false);
assert.equal(draft.regions.canopy.awaitingEdgeRetouch,true);
assert.equal(draft.regions.sign.needsArtistApproval,true);
assert.equal(draft.regions.sign.textFromPlayerShopName,true);
assert.equal(draft.canvas.width,1200);
assert.equal(draft.canvas.height,900);
assert.deepEqual([...draft.acceptedRemoveCandidates].sort(),['R1','R2','R3','R4','R5','R6','R7']);
const slots=Array.from(api.stageSlots(1)).sort();
assert.deepEqual(Object.keys(draft.anchors).sort(),slots,'B1 draft must include exactly the six stage-1 IDs');
for(const [id,p] of Object.entries(draft.anchors)){
 assert.ok(p.x>0&&p.x<1&&p.y>0&&p.y<1&&Number.isInteger(p.layer)&&p.layer>=0,'bad coordinate '+id);
}
const canopy=Array.from(paint.regions()).find(r=>r.id==='canopy');
assert.deepEqual(Array.from(draft.regions.canopy.baseGreenTintCandidates).sort(),Array.from(canopy.options).sort(),'mask QA color targets must match paint whitelist');
assert.equal(api.get('boba',1).isReady,false,'draft must not activate production shell');
assert.equal(api.diagnostics().ready,0,'draft must not activate any of 27 unreviewed shells');
console.log('B1 CANOPY REVIEW: source, 7 removable-prop areas, 6 preview anchors, 5 allowed paint colors, no production unlock PASS');
