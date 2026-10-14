/* v88.14.1 / One Quán -- single shop scene and native cooking station.
   Moves existing REAL customer/recipe DOM; does not fork saves/economy or approve draft art. */
(function(w){
'use strict';
const shop=document.getElementById('tab-shop');
const scene=document.getElementById('v88-live-scene');
const frame=document.getElementById('v88-live-frame');
const customer=document.getElementById('customer-booth-card');
const cook=document.getElementById('cs20-station');
const live=w.BPVQLiveSceneQA, bridge=w.BPVQCookingBridge;
if(!shop||!scene||!frame||!customer||!cook||!live||!bridge)return;
shop.classList.add('us21-enabled');scene.classList.add('us21-unified');
frame.append(customer); // hidden legacy fields retain their IDs for native renderers
scene.append(cook);    // one shop scene, not 3 unrelated cards
const others=document.getElementById('v88-live-other-career');
if(others)frame.append(others);
const controls=document.createElement('div');controls.className='cs27-shop-controls';scene.prepend(controls);
const status=document.createElement('div');status.className='us21-status';status.setAttribute('aria-live','off');controls.append(status);
// v88.17.1.5: real yard ⇄ kitchen views. DOM, customer and settlement stay shared.
// The buttons are part of gameplay UI; the background image never contains fake buttons.
let kitchenView=false;
const enterKitchen=document.createElement('button');
enterKitchen.type='button';enterKitchen.id='us21-enter-kitchen';
enterKitchen.textContent='🧋 Vào quầy pha chế';
enterKitchen.setAttribute('aria-label','Mở khu pha chế của quán');
frame.append(enterKitchen);
const exitKitchen=document.createElement('button');
exitKitchen.type='button';exitKitchen.id='us21-exit-kitchen';
exitKitchen.textContent='← Trở về sân quán';
exitKitchen.setAttribute('aria-label','Trở về sân quán, giữ nguyên món đang pha');
cook.prepend(exitKitchen);
function setKitchenView(next,fromUser=false){
 kitchenView=!!next;
 scene.classList.toggle('us21-kitchen-view',kitchenView);
 scene.dataset.view=kitchenView?'kitchen':'yard';
 enterKitchen.setAttribute('aria-expanded',String(kitchenView));
 exitKitchen.hidden=!kitchenView;
 if(fromUser){
  // The boba cooking surface is a NEW SIBLING of the native station. Scrolling
  // to the hidden native #cs20-station made the first entry feel like a no-op.
  update();
  w.BPVQCounterRemake177?.refresh?.();
  const target=kitchenView&&scene.dataset.career==='boba'
   ?document.getElementById('cp177-workshop'):(kitchenView?cook:scene);
  const reduced=w.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
  w.requestAnimationFrame(()=>target?.scrollIntoView?.({block:'start',behavior:reduced?'auto':'smooth'}));
 }
}
enterKitchen.addEventListener('click',()=>setKitchenView(true,true));
exitKitchen.addEventListener('click',()=>setKitchenView(false,true));
// Outdoor artwork doubles as a large hit target, but must not hijack controls.
frame.addEventListener('click',e=>{
 if(e.target.closest('button,a,summary,input,select,textarea,[role="button"]'))return;
 // The yard art remains a safe place to admire decor; entry uses the clear button.
});
setKitchenView(false);
const toggle=document.getElementById('btn-toggle-shop');if(toggle)controls.append(toggle);
// One visible order ticket, with native customer metadata; no duplicate name/quote.
const ticket=cook.querySelector('.cs20-ticket'),head=cook.querySelector('.cs20-ticket-head');
const avatar=document.getElementById('cust-avatar');if(avatar&&head)head.prepend(avatar);
const metadata=document.createElement('div');metadata.className='cs27-customer-meta';
for(const id of ['cust-strict-badge','cust-budget']){const el=document.getElementById(id);if(el)metadata.append(el);}
if(ticket&&head)head.after(metadata);
// Reuse the one order DOM in the courtyard. It never occupies counter space.
if(ticket){frame.append(ticket);ticket.classList.add('cs29-speech');ticket.hidden=true;ticket.setAttribute('aria-label','Khách gọi món trong sân quán');}
const guest=document.createElement('img');guest.id='cs29-guest';guest.alt='';guest.hidden=true;guest.decoding='async';frame.append(guest);
const practiceStart=document.createElement('button');
practiceStart.className='us21-train-start';practiceStart.type='button';practiceStart.textContent='🎓 Tập chế biến';
practiceStart.setAttribute('aria-label','Luyện nấu ăn không mất nguyên liệu khi nghỉ ca');
const practiceExit=document.createElement('button');
practiceExit.className='us21-train-exit';practiceExit.type='button';practiceExit.textContent='✕ Thoát luyện tập';practiceExit.hidden=true;
const practiceNote=document.createElement('div');practiceNote.className='us21-train-note';practiceNote.hidden=true;
practiceNote.textContent='👩‍🍳 Đang luyện tay nghề · Không trừ nguyên liệu, không cộng Xu';
controls.append(practiceStart,practiceExit);frame.append(practiceNote);
practiceStart.addEventListener('click',()=>{if(w.BPVQCookingStation?.startPractice?.())setKitchenView(true,true);update();});
const practiceInside=document.getElementById('cp176-start-practice');
practiceInside?.addEventListener('click',()=>{if(!practiceStart.hidden)practiceStart.click();});
practiceExit.addEventListener('click',()=>{w.BPVQCookingStation?.stopPractice?.();update();});
function safeSnapshot(){try{return bridge.snapshot()}catch(e){return null;}}
let lastKey='',lastPhase='',lastCareer='';
function update(){
 const s=safeSnapshot(); if(!s)return;
 const career=s.career||'boba',hasOrder=!!s.customer,phase=s.phase||'preparing';
 const practice=!!w.BPVQCookingStation?.status?.()?.practice;
 // Remain at the cooking station after a cancellation, timeout or delivery.
 // The explicit Back button alone changes this view, so no bounce after an order.
 enterKitchen.hidden=!s.started;
 enterKitchen.textContent=practice?'🧑‍🍳 Vào bếp luyện tập':'🧋 Vào quầy pha chế';
 exitKitchen.hidden=!kitchenView;

 if(ticket)ticket.hidden=!hasOrder;
 guest.hidden=!hasOrder;
 if(hasOrder&&lastKey!==s.customer.key){
  guest.src=s.customer.art;guest.alt=s.customer.name;
  // One brief arrival per actual order, not a repeating animation or DOM insertion.
  guest.getAnimations().forEach(a=>a.cancel());
  if(!w.matchMedia('(prefers-reduced-motion: reduce)').matches)guest.animate([{transform:'translateX(-70px)',opacity:0},{transform:'translateX(0)',opacity:1}],{duration:650,easing:'ease-out'});
 }
 let tier=0;try{tier=Number(gameState?.shopStage||0)}catch{}
 const artReadyForPreview=['boba','noodle','streetfood'].includes(career)&&tier===0;
 live.update();
 scene.dataset.career=career;
 scene.classList.toggle('us21-serving',hasOrder||practice);
 scene.classList.toggle('us21-practicing',practice);
 practiceStart.hidden=phase==='open'||hasOrder||practice||!s.started;
 practiceExit.hidden=!practice;
 practiceNote.hidden=!practice;
 scene.dataset.unavailable=String(!artReadyForPreview);
 const label=practice?'🎓 Luyện tập':phase==='open'?'🟢 Đang mở':'🌿 Nghỉ ca';
 if(status.textContent!==label)status.textContent=label;
 if(lastCareer!==career){lastCareer=career;}
 w.document.body.classList.toggle('us21-has-sign',false);
 const supported=document.getElementById('v88-live-supported');if(supported)supported.hidden=false;
 if(others)others.hidden=artReadyForPreview;
 const sign=w.document.getElementById('v88-live-shop-sign');if(sign)sign.hidden=true;
 // No synthetic customers: the original game updates actual #cust-* and order quote.
 // Cooking controls are provided only on active orders, never a disconnected idle card.
 lastKey=s.customer?.key||''; lastPhase=phase;
}
function renderCustomizer(container){
 if(!container||container.querySelector('#us21-color-customizer'))return;
 const s=safeSnapshot();if(s?.career!=='boba')return;
 const wrap=document.createElement('section');wrap.className='us21-construction-palette';wrap.id='us21-color-customizer';
 const h=document.createElement('h4');h.textContent='🎨 Ngoại thất xe Trà Sữa B1';
 const p=document.createElement('p');p.textContent='Xem thử sáu màu dù trong Xây Quán. Đây là bản QA: chưa trừ Xu và chưa cấp quyền sở hữu màu.';
 const bar=document.createElement('div');bar.className='us21-palette-swatches';
 const colors=[['original','Gốc','#72906d'],['cream','Kem','#f4ead2'],['vanilla','Trắng','#fff4de'],['rose','Hồng','#d6a6a1'],['sage','Xanh','#87a886'],['honey','Mật','#dfa956']];
 function paint(active){bar.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.color===active)));}
 for(const [id,label,hex] of colors){
  const b=document.createElement('button');b.type='button';b.dataset.color=id;b.setAttribute('aria-label','Xem thử màu dù '+label);
  const dot=document.createElement('span');dot.className='us21-swatch-dot';dot.style.backgroundColor=hex;b.append(dot,document.createTextNode(label));
  b.addEventListener('click',()=>{live.setColor(id);paint(id)});bar.append(b);
 }
 wrap.append(h,p,bar);container.append(wrap);
 const active=live.status()?.color||'original';paint(active);
}
w.BPVQUnifiedShop=Object.freeze({update,renderCustomizer,status:()=>({active:true,career:lastCareer,phase:lastPhase,order:lastKey})});
update();w.setInterval(update,750);
})(window);