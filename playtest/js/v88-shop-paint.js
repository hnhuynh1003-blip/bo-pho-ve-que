/* Bỏ Phố Về Quê v88 — Sơn Màu Quán, Phase 1: safe color preferences.
 * Preview is CSS illustration only. Existing flat concept images MUST NOT be recolored.
 * No economy, construction, decor-slot or career side effects.
 */
(function(w){
 'use strict';
 const COLOR=Object.freeze({
  cream:Object.freeze({label:'Kem sữa',hex:'#F6E7BE'}),
  vanilla:Object.freeze({label:'Trắng kem',hex:'#FFF2DE'}),
  tea_rose:Object.freeze({label:'Hồng trà',hex:'#C98179'}),
  terracotta:Object.freeze({label:'Đất nung',hex:'#B9674D'}),
  tile_red:Object.freeze({label:'Ngói đỏ',hex:'#A54B3D'}),
  honey:Object.freeze({label:'Mật ong',hex:'#DEA66C'}),
  oak:Object.freeze({label:'Gỗ sồi',hex:'#9E6A42'}),
  walnut:Object.freeze({label:'Gỗ óc chó',hex:'#5F4031'}),
  sage:Object.freeze({label:'Xanh lá quê',hex:'#779A79'}),
  jade:Object.freeze({label:'Xanh ngọc',hex:'#6EAC91'}),
  midnight:Object.freeze({label:'Xanh than',hex:'#263B53'}),
  gold:Object.freeze({label:'Vàng đồng',hex:'#CFB26A'}),
  lantern:Object.freeze({label:'Đèn vàng ấm',hex:'#F5BB66'}),
  pearl:Object.freeze({label:'Ngọc trai',hex:'#D4DCDD'})
 });
 const REGIONS=Object.freeze([
  Object.freeze({id:'canopy',name:'Mái dù / bạt che',min:1,max:2,options:Object.freeze(['cream','vanilla','tea_rose','sage','honey'])}),
  Object.freeze({id:'sign',name:'Biển hiệu',min:1,max:9,options:Object.freeze(['tea_rose','cream','tile_red','sage','walnut','midnight','gold'])}),
  Object.freeze({id:'roof',name:'Mái công trình',min:3,max:8,options:Object.freeze(['tile_red','terracotta','walnut','sage','midnight'])}),
  Object.freeze({id:'wall',name:'Tường / vách',min:3,max:9,options:Object.freeze(['cream','vanilla','honey','sage','pearl'])}),
  Object.freeze({id:'wood',name:'Khung gỗ',min:5,max:9,options:Object.freeze(['oak','walnut','honey','terracotta'])}),
  Object.freeze({id:'light',name:'Ánh đèn',min:5,max:9,options:Object.freeze(['lantern','honey','vanilla','gold','tea_rose'])})
 ]);
 const REGION=Object.freeze(Object.fromEntries(REGIONS.map(r=>[r.id,r])));
 const PRESETS=Object.freeze([
  Object.freeze({id:'original',name:'Mặc định',emoji:'🏡',tier:1,colors:Object.freeze({})}),
  Object.freeze({id:'milk_cream',name:'Kem Sữa',emoji:'🥛',tier:1,colors:Object.freeze({canopy:'cream',sign:'tea_rose',wall:'vanilla',wood:'oak',light:'lantern'})}),
  Object.freeze({id:'rustic_wood',name:'Mộc Quê',emoji:'🪵',tier:1,colors:Object.freeze({canopy:'honey',sign:'walnut',roof:'terracotta',wall:'cream',wood:'walnut',light:'lantern'})}),
  Object.freeze({id:'countryside_green',name:'Xanh Vườn',emoji:'🌿',tier:3,colors:Object.freeze({canopy:'sage',sign:'sage',roof:'sage',wall:'vanilla',wood:'oak',light:'lantern'})}),
  Object.freeze({id:'red_tile',name:'Đỏ Ngói',emoji:'🧱',tier:3,colors:Object.freeze({sign:'tile_red',roof:'tile_red',wall:'cream',wood:'oak',light:'honey'})}),
  Object.freeze({id:'warm_evening',name:'Đêm Quê',emoji:'🏮',tier:5,colors:Object.freeze({sign:'gold',roof:'walnut',wall:'honey',wood:'walnut',light:'lantern'})}),
  Object.freeze({id:'garden_premium',name:'Vườn Cao Cấp',emoji:'🌸',tier:7,colors:Object.freeze({sign:'jade',roof:'midnight',wall:'vanilla',wood:'oak',light:'gold'})}),
  Object.freeze({id:'flagship_navy',name:'Đặc Sản Xanh Than',emoji:'👑',tier:9,colors:Object.freeze({sign:'gold',roof:'midnight',wall:'vanilla',wood:'walnut',light:'lantern'})})
 ]);
 const PRESET=Object.freeze(Object.fromEntries(PRESETS.map(x=>[x.id,x])));
 const CAREERS=Object.freeze({
  boba:Object.freeze({name:'Trà Sữa',icon:'🧋',sign:'tea_rose'}),
  noodle:Object.freeze({name:'Mì Cay',icon:'🍜',sign:'tile_red'}),
  streetfood:Object.freeze({name:'Xiên Que',icon:'🍢',sign:'honey'})
 });
 const esc=x=>String(x??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
 const current=()=>typeof gameState==='object'&&gameState?gameState:null;
 const tierOf=s=>Math.max(1,Math.min(9,Math.floor(Number(s?.shopStage)||0)+1));
 const careerOf=s=>CAREERS[s?.currentCareer]?s.currentCareer:'boba';
 const eligible=(region,tier)=>!!region&&tier>=region.min&&tier<=region.max;
 // Baseline depends on real construction stage and vocation, without changing architecture.
 function defaults(s){
  const t=tierOf(s),name=careerOf(s);
  return {
   canopy:'cream',sign:CAREERS[name].sign,roof:t>=9?'midnight':t>=5?'tile_red':'terracotta',
   wall:'cream',wood:'oak',light:'lantern'
  };
 }
 function read(s=current()){
  const t=tierOf(s),v=s?.shopAppearanceV88;
  const obj=v&&typeof v==='object'&&!Array.isArray(v)&&v.schema===1?v:null;
  const selected=obj&&PRESET[obj.presetId]&&PRESET[obj.presetId].tier<=t?obj.presetId:'original';
  const overrides={};
  if(obj?.overrides&&typeof obj.overrides==='object'&&!Array.isArray(obj.overrides)){
   for(const [part,colorId] of Object.entries(obj.overrides)){
    if(eligible(REGION[part],t)&&REGION[part].options.includes(colorId))overrides[part]=colorId;
   }
  }
  const baseline=defaults(s);
  const colors={...baseline};
  for(const [part,colorId] of Object.entries(PRESET[selected].colors)){
   if(eligible(REGION[part],t)&&REGION[part].options.includes(colorId))colors[part]=colorId;
  }
  Object.assign(colors,overrides);
  // B9 locked-roof geometry and dark-blue color from the approved flagship reference.
  if(t===9)colors.roof='midnight';
  const rendered=Object.fromEntries(Object.entries(colors).map(([part,id])=>[part,COLOR[id]?.hex||COLOR.cream.hex]));
  return {tier:t,career:careerOf(s),presetId:selected,overrides,colors,hex:rendered,
   stored:!!obj,unlocked:REGIONS.filter(r=>eligible(r,t)).map(x=>x.id)};
 }
 function persist(s,next){
  const had=Object.prototype.hasOwnProperty.call(s,'shopAppearanceV88');
  const old=s.shopAppearanceV88;
  if(next===null)delete s.shopAppearanceV88;
  else s.shopAppearanceV88=next;
  try{
   if(typeof saveGameToStorage!=='function'||saveGameToStorage(false)!==true)throw Error('Không lưu được hồ sơ.');
  }catch(error){
   if(had)s.shopAppearanceV88=old;else delete s.shopAppearanceV88;
   return {ok:false,message:'Không thể lưu màu quán. Vui lòng kiểm tra bộ nhớ.'};
  }
  return {ok:true};
 }
 function notify(result){
  try{if(typeof showToast==='function')showToast(result.ok?'Đã lưu màu quán!':result.message,result.ok?'🎨':'⚠️')}catch(e){}
  return result;
 }
 function choosePreset(id){
  const s=current(),p=PRESET[id],tier=tierOf(s);
  if(!s||!p)return {ok:false,message:'Bảng màu không tồn tại.'};
  if(p.tier>tier)return {ok:false,message:'Bảng màu cần quán đạt B'+p.tier+'.'};
  const result=persist(s,id==='original'?null:{schema:1,presetId:id,overrides:{}});
  if(result.ok)render();
  return notify(result);
 }
 function chooseRegion(part,colorId){
  const s=current(),r=REGION[part],t=tierOf(s);
  if(!s||!r||!eligible(r,t))return {ok:false,message:'Vùng sơn chưa mở khóa ở bậc này.'};
  if(!r.options.includes(colorId)||!COLOR[colorId])return {ok:false,message:'Màu sơn không hợp lệ.'};
  const before=read(s);
  const overrides={...before.overrides,[part]:colorId};
  const result=persist(s,{schema:1,presetId:before.presetId,overrides});
  if(result.ok)render();
  return notify(result);
 }
 function reset(){
  const s=current();if(!s)return {ok:false,message:'Chưa có hồ sơ chơi.'};
  const result=persist(s,null);if(result.ok)render();return notify(result);
 }
 function sceneMarkup(preview,s){
  const x=preview.hex,t=preview.tier,career=CAREERS[preview.career];
  const style=`--paint-canopy:${x.canopy};--paint-sign:${x.sign};--paint-roof:${x.roof};--paint-wall:${x.wall};--paint-wood:${x.wood};--paint-light:${x.light}`;
  return `<div class="v88-paint-scene ${t<=2?'cart':t<=4?'stall':t===8?'courtyard':t===9?'flagship':'house'}" style="${style}" role="img" aria-label="Mô phỏng phối màu ${esc(career.name)} bậc ${t}">
    <div class="v88-paint-sky"></div><div class="v88-paint-land"></div>
    <div class="v88-paint-building"><div class="v88-paint-roof"></div><div class="v88-paint-wall"></div><div class="v88-paint-wood"></div>
    <div class="v88-paint-sign">${esc(s?.shopName||career.name)}</div>
    <div class="v88-paint-canopy"></div><div class="v88-paint-wheel left"></div><div class="v88-paint-wheel right"></div>
    <div class="v88-paint-lamp left">✦</div><div class="v88-paint-lamp right">✦</div></div>
    <span class="v88-paint-preview-watermark">MINH HỌA MÀU — KHÔNG PHẢI ẢNH SHELL</span>
   </div>`;
 }
 function render(target){
  const host=target||document.getElementById('v8775-construction-content');
  const s=current();if(!host||!s)return false;
  const p=read(s);
  const presets=PRESETS.map(item=>{
   const locked=item.tier>p.tier;
   return `<button type="button" class="v88-paint-preset ${p.presetId===item.id?'selected':''}" aria-pressed="${p.presetId===item.id}" ${locked?'disabled':''} onclick="BPVQShopPaintV88.choosePreset('${item.id}')"><span>${item.emoji}</span><b>${esc(item.name)}</b><small>${locked?'🔒 B'+item.tier:p.presetId===item.id?'✓ Đang chọn':'Chạm để chọn'}</small></button>`;
  }).join('');
  const regions=REGIONS.map(part=>{
   const open=eligible(part,p.tier);
   const lockReason=part.id==='roof'&&p.tier===9?'🔒 Mái B9 giữ xanh than':p.tier<part.min?'🔒 Mở B'+part.min:p.tier>part.max?'Chỉ có ở B'+part.max+' trở xuống':'';
   const colors=open?part.options.map(key=>`<button type="button" class="v88-paint-color ${p.colors[part.id]===key?'selected':''}" title="${esc(COLOR[key].label)}" aria-label="${esc(part.name)}: ${esc(COLOR[key].label)}" aria-pressed="${p.colors[part.id]===key}" onclick="BPVQShopPaintV88.chooseRegion('${part.id}','${key}')"><span style="background:${COLOR[key].hex}"></span><small>${esc(COLOR[key].label)}</small></button>`).join(''):'';
   return `<section class="v88-paint-region ${open?'':'locked'}"><div class="v88-paint-region-title"><b>${esc(part.name)}</b>${open?`<small>Đang dùng: ${esc(COLOR[p.colors[part.id]]?.label||'Mặc định')}</small>`:`<small>${lockReason}</small>`}</div>${open?`<div class="v88-paint-colors">${colors}</div>`:''}</section>`;
  }).join('');
  host.innerHTML=`<div class="v88-paint-panel">
   <div class="v88-paint-heading"><b>🎨 Sơn Màu Quán</b><small>${esc(CAREERS[p.career].icon)} ${esc(CAREERS[p.career].name)} · Bậc ${p.tier}/9 · Không tốn Xu</small></div>
   ${sceneMarkup(p,s)}
   <p class="v88-paint-disclaimer">Đây là <b>mô phỏng màu kiến trúc</b>. Ảnh quán B1–B9 hiện là concept phẳng; chưa thể sơn riêng mái, tường hay gỗ trên ảnh thật trước khi có lớp mask đã duyệt. Chọn màu sẽ được lưu sẵn vào hồ sơ để dùng khi hoàn thiện shell.</p>
   <h4>🎨 Phối màu có sẵn</h4><div class="v88-paint-presets">${presets}</div>
   <h4>🖌️ Tùy chỉnh từng bộ phận</h4><div class="v88-paint-regions">${regions}</div>
   <button type="button" class="v88-paint-reset" onclick="BPVQShopPaintV88.reset()">↻ Khôi phục màu mặc định</button>
   <p class="v88-paint-footnote">Không chiếm ô nội thất S1–S24, không thay nghề, Xu, SP, thưởng decor hay tiến trình thi công. Mái B9 luôn xanh than theo thiết kế đã duyệt.</p>
  </div>`;
  return true;
 }
 w.BPVQShopPaintV88=Object.freeze({
  presets:()=>PRESETS.slice(),regions:()=>REGIONS.slice(),colors:()=>({...COLOR}),
  preview:()=>read(),read,choosePreset,chooseRegion,reset,render
 });
})(window);
