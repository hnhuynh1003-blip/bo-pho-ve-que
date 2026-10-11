// Ensure the scene art gate rejects mistaken approvals, missing binary and draft sources.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {auditRecord,runAudit,slotsFor,paintFor} from '../scripts/v88-art-release-gate.mjs';
const root=path.resolve('.');
const summary=runAudit(root);
assert.equal(summary.total,27);
assert.equal(summary.pending,27,'all unreviewed scenes must remain pending');
assert.equal(summary.valid,0,'no clean production assets are yet present');
assert.equal(summary.invalid,0,'all untouched drafts should be pending, not release proposals');
assert.deepEqual([1,2,3,5,7,9].map(n=>slotsFor(n).length),[6,9,11,16,20,24]);
assert.deepEqual(paintFor(1),['canopy','sign']);
assert.deepEqual(paintFor(2),['canopy','sign']);
assert.deepEqual(paintFor(3),['sign','roof','wall']);
assert.deepEqual(paintFor(5),['sign','roof','wall','wood','light']);
assert.ok(paintFor(9).includes('sign')&&!paintFor(9).includes('roof'),'B9 blue roof remains locked');
const fakeAnchors=Object.fromEntries(slotsFor(1).map(s=>[s,{x:0.5,y:0.5,layer:2}]));
const proposed={
 id:'boba-b1',career:'boba',tier:1,artReview:'approved',approved:true,
 sourceKind:'standalone-clean-shell',
 artApproval:{decision:'approved',reviewer:'project-owner',reference:'docs/v88_DOT7B_B1_CLEANPASS_DRAFT3.md'},
 artwork:'assets/images/v88/shops/boba-b1.webp',
 anchors:fakeAnchors,
 paintLayers:{canopy:{type:'mask',path:'assets/images/v88/masks/boba-b1-canopy.png'},sign:{type:'dynamic-overlay'}}
};
let result=auditRecord(proposed,root);
assert.equal(result.valid,false,'missing actual scene and color mask cannot ship');
assert.ok(result.reason.some(x=>x.includes('Production image does not exist')));
assert.ok(result.reason.some(x=>x.includes('Missing or mismatched PNG color mask canopy')));
result=auditRecord({...proposed,sourceKind:'infographic-crop',assetType:'infographic-crop'},root);
assert.ok(result.reason.some(x=>x.includes('standalone clean shell')));
assert.ok(result.reason.some(x=>x.includes('Unapproved reference art type')));
result=auditRecord({...proposed,artApproval:undefined},root);
assert.ok(result.reason.some(x=>x.includes('Explicit owner art approval')));
result=auditRecord({...proposed,anchors:{S1:fakeAnchors.S1}},root);
assert.ok(result.reason.some(x=>x.includes('Missing or invalid tier slot set')));
result=auditRecord({...proposed,artwork:'../../etc/passwd'},root);
assert.ok(result.reason.some(x=>x.includes('Expected canonical game asset')));
assert.ok(result.reason.some(x=>x.includes('Production image does not exist')));
result=auditRecord({...proposed,artwork:null,approved:false,artReview:'pending',anchors:{}},root);
assert.equal(result.pending,true);
assert.equal(result.valid,false);
console.log('ART RELEASE V88: 27 draft scenes remain locked; CI denies missing art/masks, concept crops, absent approval and incomplete anchors PASS');
