/* BPVQ v88.17.1.7 - A real counter, not a CSS skin on the old card grid.
 * Native cooking nodes are MOVED (not copied). Bridge still owns every coin,
 * order, rating, ingredient, cap result and save. Only the boba career mounts.
 */
(function(w){
'use strict';
const scene=document.getElementById('v88-live-scene');
const station=document.getElementById('cs20-station');
const bridge=w.BPVQCookingBridge;
if(!scene||!station||!bridge||!w.BPVQCookingStation)return;
const $=id=>document.getElementById(id);
const prefix='assets/images/v88/cute-premium/';
const shell=document.createElement('section');shell.id='cp177-workshop';
shell.setAttribute('aria-label','Quầy trà sữa Cute Premium tương tác');
shell.innerHTML=`
 <header class="cp177-top"><div class="cp177-top-left"></div><span class="cp177-top-caption">Quầy trà sữa</span><span class="cp177-day-status"></span></header>
 <div class="cp177-upper">
  <div class="cp177-order"><div class="cp177-order-slot"></div></div>
  <div class="cp177-result" role="status" aria-live="polite"><div class="cp177-result-image"></div><div class="cp177-result-desc"></div><button type="button" class="cp177-take-cup" hidden>🥤 Cầm ly</button></div>
 </div>
 <div class="cp177-workbench" aria-label="Bàn pha chế">
  <div class="cp177-backbar-art" aria-hidden="true"></div>
  <div class="cp178-size-slot" aria-label="Chọn cỡ ly"></div>
  <button type="button" id="cp177-pour-object" class="cp177-pour-object" aria-label="Chạm bình để rót hoặc dừng trà">
   <img src="${prefix}tea_dispenser.webp" alt="" draggable="false"/><span class="cp177-pour-tag">Rót</span>
  </button>
  <div class="cp177-cup-place"></div>
  <div class="cp177-active-items" aria-label="Nguyên liệu đã chọn"></div>
 </div>
 <div class="cp177-options"><div class="cp177-meters-slot"></div><div class="cp178-meter-slot"></div><span class="cp177-progress-hint" hidden></span></div>
 <div class="cp177-ingredients"><div class="cp177-pantry-slot"></div></div>
 <footer class="cp177-actions"><div class="cp177-actions-slot"></div></footer>
 <div class="cp177-empty" hidden><span>Chưa có đơn · Quầy sẵn sàng</span><button type="button" class="cp177-practice" title="Tập pha chế" aria-label="Luyện tập pha chế">🎓</button></div>
 `;
scene.append(shell);
const moves=[
 ['#us21-exit-kitchen','.cp177-top-left'],
 ['.cs20-price','.cp177-order-slot'],
 // Meter is inside stage in the original native DOM: move it FIRST.
 ['#cs26-meters','.cp177-meters-slot'],
 // Nested controls must leave the native stage BEFORE the stage is moved.
 ['#cs27-containers','.cp178-size-slot'],
 ['.cs20-field','.cp178-meter-slot'],
 ['.cs20-stage','.cp177-cup-place'],
 ['.cs20-pantry','.cp177-pantry-slot'],
 ['.cs20-actions','.cp177-actions-slot']
];
const carried=[];
let mounted=false, lastPreviewStamp='', lastResult='', lastStrip='', oldCareer='';
function mount(){if(mounted)return;
 for(const [selector,slot] of moves){
  const el=station.querySelector(selector);if(!el)continue;
  const marker=document.createComment('cp177-return '+selector);el.parentNode.insertBefore(marker,el);
  shell.querySelector(slot).appendChild(el);carried.push({el,marker});
 }
 mounted=true;station.classList.add('cp177-native-host');
}
function unmount(){if(!mounted)return;
 for(const {el,marker} of carried){marker.parentNode?.insertBefore(el,marker);marker.remove();}
 carried.length=0;mounted=false;station.classList.remove('cp177-native-host');
}
function snapshot(){try{return bridge.snapshot()}catch{return null;}}
function human(id,s){return s.label?.[id]||id?.replace(/^topping_/,'').replaceAll('_',' ')||'';}
function included(s){
 const d=s.dish||{},keys=new Set([...(d.toppings||[]),...Object.keys(d.toppingPortions||{})]);
 return [...keys].filter(id=>{let q=Object.prototype.hasOwnProperty.call(d.toppingPortions||{},id)?Number(d.toppingPortions[id]):1;return q>0;}).map(id=>({id,qty:Number(d.toppingPortions?.[id]??1),name:human(id,s)}));
}
const selectedArt={
 topping_boba:'topping_boba-ai-tray.webp',topping_white_boba:'topping_white_boba-ai-tray.webp',
 topping_peach:'topping_peach-ai-tray.webp',topping_jelly:'topping_jelly-ai-tray.webp',
 topping_pudding:'topping_pudding-ai-tray.webp',topping_crystal:'topping_crystal-ai-tray.webp',
 topping_grass_jelly:'topping_grass_jelly-ai-tray.webp',topping_aloe:'topping_aloe-ai-tray.webp'
};
const imgFallback={topping_cheese_foam:'069_topping-cheese-foam_0190b7ff02.webp',topping_lychee:'070_topping-lychee_b30470ed21.webp',topping_cookie:'071_topping-cookie_9b347a4826.webp',topping_redbean:'074_topping-redbean_416456d0bc.webp'};
const imgSrc=id=>selectedArt[id]?prefix+selectedArt[id]:imgFallback[id]?'assets/images/'+imgFallback[id]:'';
function updateItems(s){
 const parts=included(s);const stamp=JSON.stringify(parts);
 if(stamp===lastStrip)return;
 lastStrip=stamp;
 const holder=shell.querySelector('.cp177-active-items');holder.replaceChildren();
 for(const part of parts){
  const chip=document.createElement('div');chip.className='cp177-used-item';
  const src=imgSrc(part.id);
  if(src){const im=document.createElement('img');im.src=src;im.alt='';chip.append(im);}
  else {const v=document.createElement('span');v.textContent='🍡';chip.append(v);}
  const title=document.createElement('span');title.textContent=part.name+' ×'+part.qty;chip.append(title);holder.append(chip);
 }
 // Empty glass needs no extra instructional banner covering the workbench.
}
function cloneFinishedCup(){
 const svg=$('cs20-visual')?.querySelector('svg');if(!svg)return null;
 const copy=svg.cloneNode(true);
 // SVG references are id scoped to DOM, so they must not collide with source.
 for(const x of copy.querySelectorAll('[id]'))x.id='cp177-preview-'+x.id;
 for(const x of copy.querySelectorAll('*'))for(const a of ['clip-path','fill','stroke','filter']){
  const v=x.getAttribute(a);if(v&&v.includes('url(#'))x.setAttribute(a,v.replaceAll('url(#cs20-','url(#cp177-preview-cs20-').replaceAll('url(#cs28-','url(#cp177-preview-cs28-'));
 }
 copy.removeAttribute('tabindex');copy.setAttribute('aria-hidden','true');return copy;
}
function updatePreview(s,status){
 const d=s.dish||{},ready=(!!s.customer&&!!d.isShaken)||(status.practice&&status.stage==='done');
 const stamp=JSON.stringify([s.customer?.key,s.practice,ready,status.stage,d.base,d.container,d.ice,d.toppings,d.toppingPortions]);
 if(stamp===lastPreviewStamp)return;
 lastPreviewStamp=stamp;
 const holder=shell.querySelector('.cp177-result-image');
 const desc=shell.querySelector('.cp177-result-desc');
 if(ready){
  const cup=cloneFinishedCup();if(cup){holder.replaceChildren(cup);desc.textContent=(s.label?.[d.base]||'Trà sữa')+' · '+included(s).map(x=>x.name+' ×'+x.qty).join(', ');}
 }else{
  holder.replaceChildren();const img=document.createElement('img');img.src=prefix+(String(d.base||'').includes('matcha')?'cup_matcha.webp':String(d.base||'').includes('strawberry')?'cup_strawberry.webp':'cup_empty_M.webp');img.alt='Ly trống';img.style.opacity='.45';holder.append(img);
  desc.textContent='';
 }
}
function refresh(){
 const s=snapshot();if(!s)return;
 const c=s.career||'boba';oldCareer=c;const should=c==='boba';if(should!==mounted){if(should)mount();else unmount();}
 if(!should)return;
 const state=w.BPVQCookingStation.status();
 shell.dataset.state=state.practice?'practice':s.customer?'order':'idle';
 shell.dataset.stage=state.stage||'choose';
 shell.classList.toggle('cp177-pouring',state.stage==='pour');
 shell.querySelector('.cp177-day-status').textContent=state.practice?'Luyện tập':s.phase==='open'?'Đang bán':'Nghỉ ca';
 const actuator=$('cp177-pour-object'),primary=$('cs20-primary'),topUp=$('cs20-top-up');
 const mainAct=primary?.dataset.act||'';
 // The tea dispenser IS the pour control: never draw a second visible pour button.
 const canPour=!!primary&&!primary.disabled&&!s.pause&&(mainAct==='pour'||(mainAct==='cap-start'&&!topUp?.disabled));
 actuator.disabled=!canPour;
 actuator.setAttribute('aria-label',state.stage==='pour'?'Dừng rót trà':'Rót trà từ bình vào ly');
 actuator.querySelector('.cp177-pour-tag').textContent=state.stage==='pour'?'Dừng':mainAct==='cap-start'&&canPour?'Rót thêm':'Rót';
 const progress=shell.querySelector('.cp177-progress-hint');
 const timing=state.stage==='capping'||state.stage==='timing';
 progress.hidden=!timing;
 progress.textContent=timing?'Vàng = Perfect':'';
 const isDone=(!!s.customer&&!!s.dish?.isShaken)||(state.practice&&state.stage==='done');
 const held=!!state.handoffHeld;
 shell.dataset.handoff=held?'held':isDone?'ready':'none';
 const takeCup=shell.querySelector('.cp177-take-cup');
 takeCup.hidden=!isDone||held||!!state.practice;
 takeCup.disabled=!isDone||held||!!state.practice;
 takeCup.textContent=held?'✓ Đang cầm ly':'🥤 Cầm ly';
 shell.dataset.finished=String(isDone);
 shell.querySelector('.cp177-empty').hidden=!!s.customer||!!state.practice;
 shell.classList.toggle('cp177-idle-mode',!s.customer&&!state.practice);
 if(!state.practice)updateItems(s);else {const holder=shell.querySelector('.cp177-active-items'); if(!holder.dataset.practice){holder.textContent='🎓 Luyện tập · topping theo lựa chọn';holder.dataset.practice='1';}}
 if(!state.practice)delete shell.querySelector('.cp177-active-items').dataset.practice;
 updatePreview(s,state);
}
const dispenser=$('cp177-pour-object');
dispenser.addEventListener('click',()=>{
 if(dispenser.disabled)return;
 const action=$('cs20-primary')?.dataset.act;
 if(action==='pour')$('cs20-primary')?.click();
 else if(action==='cap-start'&&!$('cs20-top-up')?.disabled)$('cs20-top-up')?.click();
 refresh();
});
shell.querySelector('.cp177-practice').addEventListener('click',()=>{if(w.BPVQCookingStation.startPractice()){w.BPVQUnifiedShop?.update?.();refresh();}});
shell.querySelector('.cp177-take-cup').addEventListener('click',()=>{const action=$('cs20-primary');if(action?.dataset.act==='take'&&!action.disabled){action.click();refresh();}});
// Mouse/keyboard/click all use the original action handlers; no second settlement path.
const obs=new MutationObserver(()=>refresh());
obs.observe(station,{attributes:true,attributeFilter:['data-career','data-state','data-pantry-open']});
refresh();w.setInterval(refresh,480);
w.BPVQCounterRemake177=Object.freeze({status:()=>({mounted,state:shell.dataset.state,career:oldCareer}),refresh});
})(window);