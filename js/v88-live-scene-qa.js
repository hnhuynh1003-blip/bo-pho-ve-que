/* Bỏ Phố Về Quê v88.12.1 — in-game B1 art QA.
 * A standalone, non-economic read-only scene, visible in the main Quán tab.
 * It does not mark the art as approved, change any gameState field or save.
 */
(function(w){
  'use strict';
  const KEY='BPVQ_V88_B1_SCENE_QA_COLOR_ONLY_v1';
  const base='assets/images/v88/qa/boba-b1-';
  const COLORS=Object.freeze([
    {id:'original',label:'Gốc',hex:'#72906d'},
    {id:'cream',label:'Kem',hex:'#f4ead2'},
    {id:'vanilla',label:'Trắng',hex:'#fff4de'},
    {id:'rose',label:'Hồng',hex:'#d6a6a1'},
    {id:'sage',label:'Xanh',hex:'#87a886'},
    {id:'honey',label:'Mật',hex:'#dfa956'}
  ]);
  const SLOTS=Object.freeze({
    S5:{x:.322,y:.557}, S6:{x:.612,y:.557}, S8:{x:.298,y:.448},
    S11:{x:.242,y:.706},S14:{x:.172,y:.836}
  });
  const $=id=>document.getElementById(id);
  const root=$('v88-live-scene');
  if(!root)return;
  const frame=$('v88-live-frame'),photo=$('v88-live-image'),palette=$('v88-live-palette');
  const title=$('v88-live-shop-sign'),markers=$('v88-live-markers');
  let color='original',showSlots=false,compact=false,lastFingerprint='';
  try{const stored=w.sessionStorage.getItem(KEY);if(COLORS.some(c=>c.id===stored))color=stored;}catch{}
  const choices=COLORS.map(c=>{const btn=document.createElement('button');btn.type='button';btn.dataset.color=c.id;
    btn.setAttribute('aria-label','Dù màu '+c.label);const dot=document.createElement('span');dot.className='v88-live-dot';dot.style.background=c.hex;
    btn.append(dot,document.createTextNode(c.label));btn.addEventListener('click',()=>setColor(c.id));palette.append(btn);return btn;});
  function setColor(id){
    if(!COLORS.some(c=>c.id===id))return;
    color=id; photo.src=base+id+'.webp';
    choices.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.color===id)));
    try{w.sessionStorage.setItem(KEY,id)}catch{}
  }
  function safeState(){try{return typeof gameState==='object'&&gameState?gameState:null}catch{return null}}
  function shopName(s){const name=String(s?.shopName||'Trà Sữa Nhà Mình').replace(/[\u0000-\u001f\u007f]/g,' ').trim();return name.slice(0,32)||'Trà Sữa Nhà Mình';}
  function renderMarkers(){
    markers.replaceChildren();if(!showSlots)return;
    const active=w.BPVQDecorV88?.snapshot?.()?.active||{};
    for(const [key,p] of Object.entries(SLOTS)){
      const el=document.createElement('span');el.className='v88-live-marker'+(active[key]?' v88-filled':'');
      el.textContent=active[key]?'★ '+key:key;
      el.title=active[key]?key+' — '+String(active[key]):key+' — Chưa bố trí';
      el.style.left=p.x*100+'%';el.style.top=p.y*100+'%';markers.append(el);
    }
  }
  function update(){
    const s=safeState(); const current=String(s?.currentCareer||'');
    const supported=current==='boba';
    $('v88-live-supported').hidden=!supported&&!w.BPVQUnifiedShop;
    $('v88-live-other-career').hidden=supported;
    const name=shopName(s);
    if(title.textContent!==name)title.textContent=name;
    if(supported){
      const stamp=JSON.stringify([s?.shopName,s?.decorV88?.placements,s?.decorations,s?.shopStage]);
      if(stamp!==lastFingerprint){lastFingerprint=stamp;renderMarkers();}
    }
  }
  $('v88-live-toggle-slots').addEventListener('click',()=>{
    showSlots=!showSlots;const b=$('v88-live-toggle-slots');b.setAttribute('aria-pressed',String(showSlots));b.textContent=showSlots?'◉ Ẩn vị trí':'◎ Xem 6 vị trí';renderMarkers();
  });
  $('v88-live-go-decor').addEventListener('click',()=>{
    if(typeof w.openSmartPhoneModal==='function')w.openSmartPhoneModal();
    if(typeof w.VillageOS?.open==='function')w.VillageOS.open('construction');
    if(typeof w.BPVQReborn?.constructionTab==='function')w.BPVQReborn.constructionTab('layout');
  });
  $('v88-live-hide').addEventListener('click',()=>{
    compact=!compact;root.classList.toggle('v88-compact',compact);
    $('v88-live-hide').textContent=compact?'🌿 Xem sân quán ▼':'Thu gọn ▲';
  });
  photo.addEventListener('error',()=>{photo.alt='Chưa nạp ảnh B1 Draft 5 trong gói này';frame.classList.add('v88-image-unavailable')});
  photo.addEventListener('load',()=>frame.classList.remove('v88-image-unavailable'));
  setColor(color);update();
  w.setInterval(update,1800);
  w.BPVQLiveSceneQA=Object.freeze({update,setColor,colors:()=>COLORS.map(c=>c.id),status:()=>({color,showSlots,compact,previewOnly:true})});
})(window);
