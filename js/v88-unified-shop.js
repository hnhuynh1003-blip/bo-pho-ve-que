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
frame.append(customer); // keeps btn-toggle-shop/cust-avatar/order legacy IDs working as before
scene.append(cook);    // one shop scene, not 3 unrelated cards
const others=document.getElementById('v88-live-other-career');
if(others)frame.append(others);
const status=document.createElement('div');status.className='us21-status';status.setAttribute('aria-live','off');frame.prepend(status);
const practiceStart=document.createElement('button');
practiceStart.className='us21-train-start';practiceStart.type='button';practiceStart.textContent='🎓 Tập chế biến';
practiceStart.setAttribute('aria-label','Luyện nấu ăn không mất nguyên liệu khi nghỉ ca');
const practiceExit=document.createElement('button');
practiceExit.className='us21-train-exit';practiceExit.type='button';practiceExit.textContent='✕ Thoát luyện tập';practiceExit.hidden=true;
const practiceNote=document.createElement('div');practiceNote.className='us21-train-note';practiceNote.hidden=true;
practiceNote.textContent='👩‍🍳 Đang luyện tay nghề · Không trừ nguyên liệu, không cộng Xu';
frame.append(practiceStart,practiceExit,practiceNote);
practiceStart.addEventListener('click',()=>{w.BPVQCookingStation?.startPractice?.();update();});
practiceExit.addEventListener('click',()=>{w.BPVQCookingStation?.stopPractice?.();update();});
function safeSnapshot(){try{return bridge.snapshot()}catch(e){return null;}}
let lastKey='',lastPhase='',lastCareer='';
function update(){
 const s=safeSnapshot(); if(!s)return;
 const career=s.career||'boba',hasOrder=!!s.customer,phase=s.phase||'preparing';
 const practice=!!w.BPVQCookingStation?.status?.()?.practice;
 let tier=0;try{tier=Number(gameState?.shopStage||0)}catch{}
 const artReadyForPreview=career==='boba'&&tier===0;
 scene.dataset.career=career;
 scene.classList.toggle('us21-serving',hasOrder||practice);
 scene.classList.toggle('us21-practicing',practice);
 practiceStart.hidden=phase==='open'||hasOrder||practice||!s.started;
 practiceExit.hidden=!practice;
 practiceNote.hidden=!practice;
 scene.dataset.unavailable=String(!artReadyForPreview);
 const label=hasOrder?'🍀 Khách đang gọi món':practice?'🎓 Đang luyện tay nghề':phase==='open'?'🟢 Quán đang mở':'🌿 Quán đang nghỉ';
 if(status.textContent!==label)status.textContent=label;
 if(lastCareer!==career){lastCareer=career;}
 w.document.body.classList.toggle('us21-has-sign',artReadyForPreview);
 const supported=document.getElementById('v88-live-supported');if(supported)supported.hidden=false;
 if(others)others.hidden=artReadyForPreview;
 if(artReadyForPreview){
   const head=window.document.getElementById('v88-live-shop-sign');if(head)head.hidden=false;
 }else{
   const head=window.document.getElementById('v88-live-shop-sign');if(head)head.hidden=true;
 }
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
