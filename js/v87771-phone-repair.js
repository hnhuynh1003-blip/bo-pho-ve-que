/* v87.7.7.1 — Phone home recovery: resilient art / no gameplay changes. */
(function(){
 'use strict';
 const modal=document.getElementById('modal-smartphone');
 const home=document.getElementById('phone-app-home');
 if(!modal||!home)return;
 modal.classList.add('v87771-fixed');
 const images=new Map(),status=new Map();
 const path=id=>'assets/images/phone/icons/'+id+'.webp';
 const known=new Set(['delivery','soppi','social','progress','utility','games','bank','auction','settings','character','construction','staff','journal','notifications','effects','admin']);
 let scheduled=false;
 function decorate(){
  scheduled=false;
  home.querySelectorAll('button[id^="papp-btn-"]').forEach(btn=>{
   const id=btn.id.slice('papp-btn-'.length);
   if(!known.has(id))return;
   const icon=btn.querySelector('.phone-app-icon');
   if(!icon||icon.dataset.v87771Ready==='1')return;
   icon.dataset.v87771Ready='1';
   icon.classList.add('v87771-icon');
   icon.setAttribute('aria-hidden','true');
   // The original emoji is retained as a fallback if the illustration is missing.
   const im=document.createElement('img');
   im.className='v87771-art-image';
   im.alt='';im.decoding='async';im.loading='eager';
   im.onload=()=>{icon.classList.add('v87771-loaded');icon.classList.remove('v87771-broken');status.set(id,'loaded');};
   im.onerror=()=>{icon.classList.add('v87771-broken');icon.classList.remove('v87771-loaded');status.set(id,'fallback');};
   // Force old background sprites off; the real image is used instead.
   icon.style.setProperty('background-image','none','important');
   im.src=path(id);
   icon.appendChild(im);
   images.set(id,im);
  });
 }
 function schedule(){if(scheduled)return;scheduled=true;queueMicrotask(decorate);}
 decorate();
 new MutationObserver(schedule).observe(home,{childList:true,subtree:true});
 // Diagnose wallpaper failures without touching saved wallpaper preferences.
 let currentWall='';
 function checkWallpaper(){
  const css=home.style.getPropertyValue('--v8772-wallpaper');
  const match=css.match(/url\(["']?([^"')]+)["']?\)/);
  const src=match?.[1]||'';
  if(src===currentWall)return;
  currentWall=src;
  if(!src){home.classList.add('v87771-no-wallpaper');return;}
  const im=new Image();
  im.onload=()=>{if(currentWall===src)home.classList.remove('v87771-no-wallpaper');};
  im.onerror=()=>{if(currentWall===src)home.classList.add('v87771-no-wallpaper');};
  im.src=src;
 }
 checkWallpaper();
 new MutationObserver(checkWallpaper).observe(home,{attributes:true,attributeFilter:['style']});
 const oldOpen=window.openSmartPhoneModal;
 if(typeof oldOpen==='function')window.openSmartPhoneModal=function(...args){
  const v=oldOpen.apply(this,args);schedule();checkWallpaper();return v;
 };
 window.BPVQPhoneRepair={getStatus:()=>Object.fromEntries(status),check:()=>{decorate();checkWallpaper();}};
})();