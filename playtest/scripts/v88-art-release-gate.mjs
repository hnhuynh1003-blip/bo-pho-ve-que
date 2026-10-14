#!/usr/bin/env node
/**
 * v88 art release gate. Node-only, read-only.
 * This does NOT certify visual quality: manual art approval remains mandatory.
 * A valid runtime manifest is not evidence that the actual image exists.
 */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import process from 'node:process';
import {fileURLToPath} from 'node:url';

const CAREERS=['boba','noodle','streetfood'];
const STAGE_SLOTS={S1:1,S2:2,S3:3,S4:4,S5:1,S6:1,S7:2,S8:1,S9:2,S10:4,
 S11:1,S12:4,S13:6,S14:1,S15:3,S16:5,S17:7,S18:5,S19:6,S20:7,S21:8,S22:8,S23:9,S24:9};
const PAINT_ZONES={
 canopy:{min:1,max:2},sign:{min:1,max:9},roof:{min:3,max:8},
 wall:{min:3,max:9},wood:{min:5,max:9},light:{min:5,max:9}
};
export const slotsFor=tier=>Object.entries(STAGE_SLOTS).filter(([,min])=>min<=tier).map(([id])=>id);
export const paintFor=tier=>Object.entries(PAINT_ZONES).filter(([,req])=>tier>=req.min&&tier<=req.max).map(([key])=>key);
function inRepo(root,rel){
 if(typeof rel!=='string'||rel.startsWith('/')||rel.includes('\\'))return false;
 if(rel.split('/').some(p=>p==='..'||p==='.'||p===''))return false;
 const abs=path.resolve(root,rel);
 return abs.startsWith(path.resolve(root)+path.sep);
}
function fileInRepo(root,rel){
 if(!inRepo(root,rel))return null;
 const abs=path.resolve(root,rel);
 try{
  if(!fs.lstatSync(abs).isFile())return null;
  if(!fs.realpathSync(abs).startsWith(fs.realpathSync(root)+path.sep))return null;
  return abs;
 }catch{return null}
}
// Structural parsing only. It is NOT an image decoder and cannot detect visual defects.
function dimensions(file){
 if(!file)return null;
 const b=fs.readFileSync(file);
 if(b.length<4096)return null;
 if(b.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]))){
  if(b.subarray(12,16).toString('ascii')!=='IHDR')return null;
  return {w:b.readUInt32BE(16),h:b.readUInt32BE(20),type:'png'};
 }
 if(b.toString('ascii',0,4)!=='RIFF'||b.toString('ascii',8,12)!=='WEBP')return null;
 const format=b.toString('ascii',12,16);
 let w=0,h=0;
 if(format==='VP8X'){w=1+b[24]+(b[25]<<8)+(b[26]<<16);h=1+b[27]+(b[28]<<8)+(b[29]<<16);}
 else if(format==='VP8L'&&b[20]===0x2f){w=1+b[21]+((b[22]&0x3f)<<8);h=1+(b[22]>>6)+(b[23]<<2)+((b[24]&0xf)<<10);}
 else if(format==='VP8 '&&b[23]===0x9d&&b[24]===1&&b[25]===0x2a){w=b.readUInt16LE(26)&0x3fff;h=b.readUInt16LE(28)&0x3fff;}
 return w>0&&h>0?{w,h,type:'webp'}:null;
}
// A record that proposes art metadata is not a blank draft: audit it even without an image path.
const isCandidate=r=>r?.approved===true||r?.artReview==='approved'||!!r?.artwork
 ||!!r?.sourceKind||!!r?.assetType||!!r?.artApproval
 ||Object.keys(r?.anchors||{}).length>0||Object.keys(r?.paintLayers||{}).length>0;
export function auditRecord(record,root){
 const reasons=[];
 const id=record?.id||'unknown';
 const tier=record?.tier;
 if(!CAREERS.includes(record?.career)||!Number.isInteger(tier)||tier<1||tier>9||id!==record.career+'-b'+tier)
  return {id,valid:false,reason:['Invalid career, tier or scene id']};
 if(!isCandidate(record))return {id,valid:false,pending:true,reason:['Not proposed for production']};
 if(record.artReview!=='approved'||record.approved!==true)reasons.push('Owner-approved art record required');
 if(record.sourceKind!=='standalone-clean-shell')reasons.push('Scene must be a standalone clean shell, not concept or infographic crop');
 if(record?.artApproval?.decision!=='approved'||record?.artApproval?.reviewer!=='project-owner'
 ||typeof record?.artApproval?.reference!=='string'||!record.artApproval.reference.trim())
  reasons.push('Explicit owner art approval reference required');
 const fileRel='assets/images/v88/shops/'+id+'.webp';
 if(record.artwork!==fileRel)reasons.push('Expected canonical game asset '+fileRel);
 const sceneFile=fileInRepo(root,record.artwork);
 const info=dimensions(sceneFile);
 if(!info)reasons.push('Production image does not exist or fails header check');
 else if(info.w<1200||info.h<900||Math.abs(info.w/info.h-4/3)>0.05)reasons.push('Shell must be >=1200×900, 4:3 aspect');
 const required=slotsFor(tier),provided=Object.keys(record.anchors||{});
 if(required.some(s=>!provided.includes(s))||provided.some(s=>!required.includes(s)))reasons.push('Missing or invalid tier slot set');
 for(const s of required){
  const a=record?.anchors?.[s];
  if(!a||![a.x,a.y].every(v=>typeof v==='number'&&Number.isFinite(v)&&v>=0&&v<=1)||!Number.isInteger(a.layer)||a.layer<0||a.layer>20)
   reasons.push('Bad measured anchor '+s);
 }
 const zones=paintFor(tier),layers=record.paintLayers||{};
 // Reject forbidden or premature color regions (notably the locked B9 roof).
 for(const z of Object.keys(layers)){
  if(!zones.includes(z))reasons.push('Unexpected or locked paint layer '+z);
 }
 for(const z of zones){
  const layer=layers[z];
  if(!layer){reasons.push('Missing paint layer '+z);continue}
  if(z==='sign'){
   if(layer.type!=='dynamic-overlay')reasons.push('Sign must use dynamic overlay');
  }else{
   if(layer.type!=='mask')reasons.push('Paint '+z+' requires color mask');
   const maskFile='assets/images/v88/masks/'+id+'-'+z+'.png';
   if(layer.path!==maskFile)reasons.push('Invalid mask path '+z);
   const maskInfo=dimensions(fileInRepo(root,layer.path));
   if(!maskInfo||maskInfo.type!=='png'||!info||maskInfo.w!==info.w||maskInfo.h!==info.h)
    reasons.push('Missing or mismatched PNG color mask '+z);
  }
 }
 if(record?.assetType==='infographic-crop'||record?.assetType==='concept-preview')reasons.push('Unapproved reference art type');
 return {id,valid:reasons.length===0,pending:false,dimensions:info,reason:reasons};
}
export function runAudit(root){
 const script=fs.readFileSync(path.join(root,'js/v88-shop-scenes.js'),'utf8');
 const ctx={window:{}};vm.runInNewContext(script,ctx,{timeout:3000,filename:'v88-shop-scenes.js'});
 const api=ctx.window.BPVQShopScenesV88;
 if(!api||api.catalog().length!==27)throw Error('Missing 27-scene registry');
 const reports=Array.from(api.catalog()).map(r=>auditRecord(r,root));
 return {total:reports.length,pending:reports.filter(x=>x.pending).length,
  valid:reports.filter(x=>x.valid).length,invalid:reports.filter(x=>!x.pending&&!x.valid).length,
  reports};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const root=path.resolve(process.argv[2]||'.');
 const report=runAudit(root);
 console.log(JSON.stringify({total:report.total,pending:report.pending,valid:report.valid,invalid:report.invalid},null,2));
 if(report.invalid)for(const r of report.reports.filter(x=>!x.valid&&!x.pending))console.error(r.id+': '+r.reason.join('; '));
 process.exitCode=report.invalid?1:0;
}
