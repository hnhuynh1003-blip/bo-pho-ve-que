/* Bỏ Phố Về Quê v87.7.7 — Phone UI Premium
 * Presentation and device-preference layer; no gameplay or save payload changes.
 * Each icon is mapped by stable app ID, never by position in Home/dock.
 */
(function(){
 'use strict';
 const modal=document.getElementById('modal-smartphone');
 const home=document.getElementById('phone-app-home');
 const launcher=document.getElementById('v8772-app-launcher');
 const os=window.VillageOS;
 if(!modal||!home||!launcher||!os)return;
 modal.classList.add('v8777-premium');
 const ids=['delivery','soppi','social','progress','utility','games','bank','auction','settings',
  'character','construction','staff','journal','notifications','effects','admin'];
 const iconSet=new Set(ids);
 let scheduled=false;
 function refreshIcons(){
  scheduled=false;
  const list=home.querySelectorAll('[id^="papp-btn-"]');
  list.forEach(btn=>{
   const id=btn.id.slice('papp-btn-'.length);
   if(!iconSet.has(id))return;
   const icon=btn.querySelector('.phone-app-icon');
   if(!icon)return;
   icon.classList.remove('v8773-art-icon');
   icon.classList.add('v8777-app-icon');
   icon.style.setProperty('--v8777-app-art',`url("assets/images/phone/icons/${id}.webp")`);
  });
  // Admin button is injected only after the TEST profile becomes active.
  const admin=document.getElementById('papp-btn-admin');
  if(admin&&!admin.querySelector('.v8777-app-icon')){
   const icon=admin.querySelector('.phone-app-icon');
   if(icon){icon.classList.remove('v8773-art-icon');icon.classList.add('v8777-app-icon');icon.style.setProperty('--v8777-app-art','url("assets/images/phone/icons/admin.webp")');}
  }
 }
 function queueIcons(){if(scheduled)return;scheduled=true;queueMicrotask(refreshIcons)}
 refreshIcons();
 new MutationObserver(queueIcons).observe(home,{childList:true,subtree:true});
 // Add wallpaper options without replacing any game or OS notification event listeners.
 const originalOpen=window.openSmartPhoneModal;
 if(typeof originalOpen==='function')window.openSmartPhoneModal=function(...args){
  const result=originalOpen.apply(this,args);
  queueIcons();return result;
 };
 os.addRelease?.('v87.7.7','Phone UI Premium: bộ icon minh họa đồng bộ, 6 hình nền, lựa chọn vuốt ngang/cuộn dọc và hiệu ứng nền trong Cài đặt.');
 window.BPVQPhonePremium={refreshIcons,icons:[...iconSet]};
})();
