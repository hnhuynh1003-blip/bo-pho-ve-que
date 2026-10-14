#!/usr/bin/env node
/**
 * v88 art-batch QA: 3 careers × B1–B9.
 * Safely COPIES recovered concept WebP images for review only.
 * Never generates, cleans, approves, or installs production shells.
 *
 * node scripts/v88-batch-art.mjs --source-dir "/path/to/unzipped/ZIP" --out-dir ./artifacts/v88-batch
 */
import {createHash} from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const CAREERS=Object.freeze([
  {id:'boba',name:'Trà Sữa',filePrefix:'TRA_SUA'},
  {id:'noodle',name:'Mì Cay',filePrefix:'MI_CAY'},
  {id:'streetfood',name:'Xiên Que',filePrefix:'XIEN_QUE'}
]);
const BATCHES=Object.freeze(['A','B','C']);
const STAGE_SLOTS=Object.freeze([6,9,11,14,16,18,20,22,24]);
const REVIEW_NOTES=Object.freeze({
  'boba-b1':'Xe đẩy hai bánh và dù kem. Đã có clean-pass DRAFT 3, chưa retouch/duyệt.',
  'boba-b2':'Điều chỉnh mái/đèn để không vượt xa bậc.',
  'boba-b3':'Phân cấp hình khối tiệm gỗ rõ hơn B2.',
  'boba-b4':'Loại bỏ nội thất phải mua trước khi xuất shell.',
  'boba-b5':'Giữ quán một tầng, mái ngói đỏ, có hiên.',
  'boba-b6':'Ảnh cũ giống hai tầng hoàn chỉnh; phải sửa thành gác lửng một phần.',
  'boba-b7':'Một nhà chính hai tầng, thang ngoài; bảo toàn S17/S20.',
  'boba-b8':'Ba khối nhà ôm sân chữ U; đối chiếu concept đã duyệt.',
  'boba-b9':'CONCEPT CŨ MÁI ĐỎ: không thay B9 mới mái xanh than, hai cánh và quảng trường nước.'
});
const HTML_ESCAPE=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const args=process.argv.slice(2);
function arg(key,fallback){
 const i=args.indexOf('--'+key);
 if(i<0)return fallback;
 if(!args[i+1]||args[i+1].startsWith('--'))throw Error('Missing value for --'+key);
 return args[i+1];
}
const input=path.resolve(arg('source-dir','.'));
const output=path.resolve(arg('out-dir','artifacts/v88-batch'));
if(input===output||output.startsWith(input+path.sep))throw Error('Output must not be inside input (avoid recursive self-copy)');
if(path.resolve(output)===path.resolve(process.cwd()))throw Error('Output must be a dedicated review directory');
function searchFiles(base,wanted){
 if(!fs.existsSync(base))return [];
 const found=[];
 const pending=[{dir:base,depth:0}];
 while(pending.length){
  const {dir,depth}=pending.pop();
  for(const ent of fs.readdirSync(dir,{withFileTypes:true})){
    const abs=path.join(dir,ent.name);
    if(ent.isDirectory()&&depth<3&&!ent.name.startsWith('.'))pending.push({dir:abs,depth:depth+1});
    else if(ent.isFile()&&ent.name.toLowerCase()===wanted.toLowerCase())found.push(abs);
  }
 }
 return found.sort();
}
function webpDimensions(buf){
 if(buf.length<30||buf.toString('ascii',0,4)!=='RIFF'||buf.toString('ascii',8,12)!=='WEBP')return null;
 const format=buf.toString('ascii',12,16);
 let w=0,h=0;
 if(format==='VP8X'){w=1+buf[24]+(buf[25]<<8)+(buf[26]<<16);h=1+buf[27]+(buf[28]<<8)+(buf[29]<<16);}
 else if(format==='VP8L'&&buf[20]===0x2f){w=1+buf[21]+((buf[22]&0x3f)<<8);h=1+(buf[22]>>6)+(buf[23]<<2)+((buf[24]&0xf)<<10);}
 else if(format==='VP8 '&&buf[23]===0x9d&&buf[24]===1&&buf[25]===0x2a){w=buf.readUInt16LE(26)&0x3fff;h=buf.readUInt16LE(28)&0x3fff;}
 if(w<1||h<1||w>16383||h>16383)return null;
 return {width:w,height:h,container:format};
}
fs.mkdirSync(path.join(output,'concepts'),{recursive:true});
const entries=[];
for(const career of CAREERS){
 for(let tier=1;tier<=9;tier++){
  const id=career.id+'-b'+tier;
  const filename=career.filePrefix+'_B'+String(tier).padStart(2,'0')+'_PREVIEW.webp';
  const sources=searchFiles(input,filename);
  const batch=BATCHES[Math.floor((tier-1)/3)];
  let source=null,sha256=null,dimensions=null,issue=null,bytes=0,preview=null;
  if(sources.length>1)issue='Trùng tên nguồn ở nhiều thư mục, cần xác minh ZIP nào chính xác.';
  else if(sources.length===1){
   const buf=fs.readFileSync(sources[0]),dims=webpDimensions(buf);
   if(!dims)issue='File không phải WebP hợp lệ theo header hoặc thiếu thông số kích thước.';
   else {
    source=path.relative(input,sources[0]).replaceAll(path.sep,'/');
    sha256=createHash('sha256').update(buf).digest('hex');
    dimensions=dims;bytes=buf.length;
    preview='concepts/'+id+'-concept.webp';
    fs.copyFileSync(sources[0],path.join(output,preview));
   }
  }
  const status=preview?'concept-only':issue?'invalid-input':'missing';
  const note=REVIEW_NOTES[id]||'Chưa có nguồn concept cho nghề này; cần ảnh riêng theo nghề/bậc.';
  entries.push({id,career:career.id,careerLabel:career.name,tier,batch,expectedFile:filename,
   source,preview,sha256,bytes,dimensions,status,issues:issue?[issue]:[],
   slotCount:STAGE_SLOTS[tier-1],reviewNote:note,
   approval:'pending',productionReady:false,
   nextAction:status==='concept-only'?'Clean-pass, kiểm tra bố cục, duyệt art, đo đủ anchors.':'Cung cấp ảnh công trình thật theo nghề và bậc rồi kiểm duyệt.'});
 }
}
const summary={
 total:entries.length,found:entries.filter(x=>x.status==='concept-only').length,
 missing:entries.filter(x=>x.status==='missing').length,
 invalid:entries.filter(x=>x.status==='invalid-input').length,
 productionReady:0,sourceInput:input,reviewOnly:true,
 stageSlotCounts:STAGE_SLOTS,
 batches:BATCHES.map(batch=>({batch,range:batch==='A'?'B1–B3':batch==='B'?'B4–B6':'B7–B9',
  found:entries.filter(x=>x.batch===batch&&x.preview).length,total:9}))
};
fs.writeFileSync(path.join(output,'qa_manifest.json'),JSON.stringify({summary,entries},null,2)+'\n');
const cols=['id','career','tier','batch','status','expectedFile','source','preview','slotCount','productionReady','reviewNote'];
const csvVal=v=>'"'+String(v??'').replaceAll('"','""')+'"';
fs.writeFileSync(path.join(output,'qa_board.csv'),'\ufeff'+cols.join(',')+'\n'+entries.map(x=>cols.map(k=>csvVal(x[k])).join(',')).join('\n')+'\n');
const grouped=CAREERS.map(c=>{
 const cards=entries.filter(x=>x.career===c.id).map(x=>{
  const img=x.preview?'<img src="'+HTML_ESCAPE(x.preview)+'" alt="Concept '+HTML_ESCAPE(x.id)+'">':'<div class="empty">CHƯA CÓ ẢNH</div>';
  const warning=x.id==='boba-b9'?'<strong class="danger">Ảnh B9 cũ không phải thiết kế mới!</strong>':'';
  return '<article><div class="photo">'+img+'</div><h3>'+HTML_ESCAPE(x.id.toUpperCase())+' · '+HTML_ESCAPE(x.status)+'</h3><p>'+HTML_ESCAPE(x.reviewNote)+'</p>'+warning+'<small>Batch '+x.batch+' · '+x.slotCount+' slot · CHƯA DUYỆT</small></article>';
 }).join('');
 return '<section><h2>'+HTML_ESCAPE(c.name)+' · 9 bậc</h2><div class="grid">'+cards+'</div></section>';
}).join('');
const html='<!DOCTYPE html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>v88 · Kiểm duyệt 27 công trình</title>'+
'<style>body{margin:0;background:#f5eddf;color:#26383a;font:15px system-ui}header{padding:20px;background:#263c43;color:#fff}main{max-width:1200px;margin:auto;padding:16px}h1{font-size:23px;margin:0 0 8px}h2{margin:26px 0 12px}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(205px,1fr));gap:13px}article{background:white;border-radius:12px;border:1px solid #d3c7b1;padding:9px;box-shadow:0 2px 8px #1231}.photo{aspect-ratio:4/3;display:grid;place-items:center;overflow:hidden;background:#eee3d0;border-radius:8px}.photo img{width:100%;height:100%;object-fit:contain}h3{font-size:13px}article p{min-height:56px;font-size:12px}small{display:block;color:#96572b;font-weight:700}.danger{display:block;color:#bb2525;font-size:12px}.empty{color:#666;font-weight:700}footer{text-align:center;padding:25px;color:#666}</style></head><body><header><h1>BỎ PHỐ VỀ QUÊ v88 · Bảng kiểm 27 công trình</h1><div>Ảnh nguồn tìm thấy: '+summary.found+'/27 · Chưa có: '+summary.missing+' · Không hợp lệ: '+summary.invalid+' · Shell sản xuất được duyệt: <strong>0</strong></div><p>Chỉ dùng để duyệt, không phải bản phát hành. B1 cần clean-pass; B6 cần sửa gác lửng; B9 cũ không thay B9 mới.</p></header><main>'+grouped+'</main><footer>Không tự tạo ảnh hay mở khóa, không ghi save, không merge main.</footer></body></html>';
fs.writeFileSync(path.join(output,'index.html'),html);
console.log(JSON.stringify({summary,output},null,2));
