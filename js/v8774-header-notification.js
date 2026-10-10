/* v87.7.4: Header popover for live notifications and utilities; no new save schema. */
(function(){
'use strict';
const bell=document.getElementById('v8774-bell-panel');
const menu=document.getElementById('v8774-menu-panel');
const bellBtn=document.getElementById('v8774-bell-btn');
const menuBtn=document.getElementById('v8774-menu-btn');
if(!bell||!menu||!bellBtn||!menuBtn)return;
let active='';
const getNotices=()=>Array.isArray(window.gameState?.notifications)?window.gameState.notifications:typeof gameState!=='undefined'&&Array.isArray(gameState?.notifications)?gameState.notifications:[];
const countUnread=()=>getNotices().filter(n=>!n.read).length;
const buildEl=(tag,cls,txt)=>{const el=document.createElement(tag);if(cls)el.className=cls;if(txt!==undefined)el.textContent=txt;return el;};
function drawBell(){
  bell.replaceChildren();
  const notices=getNotices();
  const head=buildEl('div','v8774-popover-heading');
  head.appendChild(buildEl('strong','','🔔 Thông báo mới'));
  head.appendChild(buildEl('span','',countUnread()+' chưa đọc'));
  bell.appendChild(head);
  const newest=notices.slice(0,3);
  if(!newest.length) bell.appendChild(buildEl('div','v8774-empty','🌼 Chưa có thông báo.'));
  newest.forEach(n=>{
    const b=buildEl('button','v8774-notif-preview'+(n.read?' is-read':''));b.type='button';
    b.appendChild(buildEl('span','v8774-preview-icon',n.icon||'🔔'));
    const info=buildEl('span');info.appendChild(buildEl('strong','',n.title||'Thông báo'));
    info.appendChild(buildEl('small','',n.body||''));b.appendChild(info);
    if(!n.read)b.appendChild(buildEl('i','v8774-dot'));
    b.addEventListener('click',()=>{
      close();
      if(typeof window.bpvqReadGameNotification==='function')window.bpvqReadGameNotification(n.id);
      openAll();
    });
    bell.appendChild(b);
  });
  const all=buildEl('button','v8774-panel-footer','📱 Xem tất cả trong điện thoại →');all.type='button';all.addEventListener('click',()=>{close();openAll();});bell.appendChild(all);
}
function openAll(){
  if(typeof window.openSmartPhoneModal==='function'&&document.getElementById('modal-smartphone')?.classList.contains('hidden'))window.openSmartPhoneModal();
  if(typeof window.openNotificationsModal==='function')window.openNotificationsModal();
}
function close(){active='';bell.classList.add('hidden');menu.classList.add('hidden');bellBtn.setAttribute('aria-expanded','false');menuBtn.setAttribute('aria-expanded','false');}
function toggle(panel){if(active===panel){close();return;}close();active=panel;if(panel==='bell'){drawBell();bell.classList.remove('hidden');bellBtn.setAttribute('aria-expanded','true');}else if(panel==='menu'){menu.classList.remove('hidden');menuBtn.setAttribute('aria-expanded','true');}}
document.addEventListener('click',e=>{if(active&&!e.target.closest('.v8774-header'))close();});
document.addEventListener('keydown',e=>{if(e.key==='Escape')close();});
window.BPVQHeader={toggle,close,refresh:()=>{if(active==='bell')drawBell();}};
// Log v87.7.4 in the phone's About screen without changing existing release history.
if(window.VillageOS && typeof window.VillageOS.addRelease === 'function'){window.VillageOS.addRelease('v87.7.4','Header Cute Premium cố định, chuông nhanh, trung tâm thông báo phân loại và đánh dấu đã đọc chính xác.');}
// Synchronize initially for the player's currently loaded profile, without changing its save.
if(typeof window.renderNotificationBadge==='function'){try{window.renderNotificationBadge();}catch(e){console.warn('[Header] Notification badge unavailable yet',e)}}
})();
