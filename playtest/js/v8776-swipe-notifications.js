/* Bỏ Phố Về Quê — v87.7.6 · Horizontal phone launcher + in-phone notification inbox.
   Presentation-only: reads gameState.notifications, reuses v87.7.4 read/save functions.
   No gameplay progression, rewards, XP, Xu, loans, quests or save schema changes. */
(function(){
'use strict';
const modal=document.getElementById('modal-smartphone');
const os=window.VillageOS;
const home=document.getElementById('phone-app-home');
const grid=document.getElementById('v8772-app-launcher');
const container=document.getElementById('phone-app-container');
const legacy=document.getElementById('modal-notifications');
if(!modal||!os||!home||!grid||!container)return;
modal.classList.add('v8776-mobile');
const $=id=>document.getElementById(id);
const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const notices=()=>{try{return Array.isArray(gameState?.notifications)?gameState.notifications:[]}catch(e){return []}};
const unread=()=>notices().filter(n=>!n.read).length;
const group=n=>{const type=String(n?.type||'').toLowerCase();return type==='weather'?'weather':['event','incident','festival','market','world','special','npc'].includes(type)?'event':'other'};
// Home always uses a single small bell in the top phone bar. No embedded notification cards.
const bulky=$('v8775-home-notices');if(bulky)bulky.remove();
const oldHint=home.querySelector('.v8772-home-hint');if(oldHint)oldHint.remove();
const homeIntro=home.querySelector('.v8772-home-intro');if(homeIntro)homeIntro.remove();
// One notification app, in the phone's own viewport (never a separate full-screen overlay).
const view=document.createElement('section');
view.id='phone-app-notifications';view.className='v8775-app-panel v8776-inbox hidden';
view.setAttribute('aria-label','Trung tâm thông báo');
container.appendChild(view);
let selectedGroup='all';
const filters=[['all','Tất cả'],['weather','Thời tiết'],['event','Sự kiện'],['other','Khác']];
function renderInbox(){
 const items=notices();
 const visible=items.map((n,i)=>({n,i})).filter(({n})=>selectedGroup==='all'||group(n)===selectedGroup);
 const total=unread();
 view.innerHTML=`<header class="v8776-inbox-top"><div class="v8776-inbox-emblem">🔔</div><div class="v8776-inbox-title"><b>Trung tâm thông báo</b><small>${total?`${total} thông báo chưa đọc`:'Bạn đã xem hết thông báo'}</small></div><button type="button" class="v8776-readall" ${total?'':'disabled'} data-v8776-action="read-all">Đọc tất cả</button></header>`+
 `<div class="v8776-filters" role="tablist" aria-label="Phân loại thông báo">${filters.map(([id,title])=>`<button type="button" role="tab" aria-selected="${id===selectedGroup}" data-v8776-filter="${id}">${title}</button>`).join('')}</div>`+
 `<div class="v8776-list" aria-live="polite">${visible.length?visible.map(({n,i})=>`<button type="button" class="v8776-message ${n.read?'is-read':'is-unread'}" data-v8776-item="${i}" aria-label="${escape(n.title||'Thông báo')}, ${n.read?'đã đọc':'chưa đọc'}"><span class="v8776-message-icon">${escape(n.icon||'🔔')}</span><span class="v8776-message-main"><b>${escape(n.title||'Thông báo')}</b><span>${escape(n.body||'')}</span><small>📅 Ngày ${Number(n.day)||1} · ${n.read?'Đã đọc':'Chưa đọc'}</small></span>${n.read?'':'<i class="v8776-message-dot"></i>'}</button>`).join(''):'<div class="v8776-empty">🌼<b>Không có thông báo</b><span>Thông tin mới sẽ xuất hiện tại đây.</span></div>'}</div>`+
 `<p class="v8776-inbox-footnote">Thông báo thời tiết, lễ hội, NPC và kinh doanh được đồng bộ với chuông trên thanh quán.</p>`;
}
view.addEventListener('click',e=>{
 const filter=e.target.closest('[data-v8776-filter]');
 if(filter){selectedGroup=filter.dataset.v8776Filter;renderInbox();return;}
 if(e.target.closest('[data-v8776-action="read-all"]')){if(typeof window.bpvqReadAllNotifications==='function')window.bpvqReadAllNotifications();renderInbox();return;}
 const btn=e.target.closest('[data-v8776-item]');if(!btn)return;
 const n=notices()[Number(btn.dataset.v8776Item)];
 if(n&&typeof window.bpvqReadGameNotification==='function')window.bpvqReadGameNotification(n.id);
 renderInbox();
});
os.registerApp({id:'notifications',label:'Thông báo',icon:'🔔',render:renderInbox});
const inboxIcon=$('papp-btn-notifications');
if(inboxIcon)inboxIcon.classList.add('v8776-notification-icon');
const oldOpen=window.openNotificationsModal,oldClose=window.closeNotificationsModal;
function openInbox(){
 if(legacy)legacy.classList.add('hidden');
 if(modal.classList.contains('hidden')&&typeof window.openSmartPhoneModal==='function')window.openSmartPhoneModal();
 os.open('notifications');renderInbox();
}
// All historic paths now enter the same embedded phone app.
window.openNotificationsModal=openInbox;
window.closeNotificationsModal=function(){if(legacy)legacy.classList.add('hidden');if(!view.classList.contains('hidden'))os.home();else if(typeof oldClose==='function')oldClose();};
if(legacy)legacy.classList.add('hidden');
// Remove the obsolete Home-preview toggle from Settings, which no longer controls a Home card.
const settings=$('phone-app-settings');
function removeObsoleteSetting(){
 if(!settings)return;
 settings.querySelectorAll('.v8775-notification-options label').forEach(label=>{
  const control=label.querySelector('input');if(control?.getAttribute('onchange')?.includes('notifyHome'))label.remove();
 });
}
if(settings)new MutationObserver(removeObsoleteSetting).observe(settings,{childList:true,subtree:false});
// True horizontal launcher pages: max 6 icons / page, native touch swipe, stable dock.
const pageTitle=document.createElement('div');pageTitle.id='v8776-page-title';pageTitle.className='v8776-page-title';
const pager=document.createElement('div');pager.id='v8776-pager';pager.className='v8776-page-dots';pager.setAttribute('aria-label','Chuyển trang ứng dụng');
const hero=home.querySelector('.v8773-hero');
if(hero)hero.after(pageTitle);else home.prepend(pageTitle);
if(grid.nextSibling)grid.after(pager);else home.appendChild(pager);
const groups=[
 {name:'Hằng ngày',ids:['notifications','social','utility','games','bank','auction']},
 {name:'Quản lý',ids:['character','construction','staff','settings','admin','effects']},
];
let activePage=0,pages=[];
function orderedButtons(){
 const buttons=[...grid.querySelectorAll('button[id^="papp-btn-"]')].filter(btn=>btn.closest('.v8773-dock')===null);
 return buttons;
}
function regroup(){
 let direct=[...grid.children].filter(el=>el.matches?.('button[id^="papp-btn-"]'));
 if(!pages.length){
  pages=groups.map((g,i)=>{
   const p=document.createElement('div');p.className='v8776-home-page';p.setAttribute('role','group');p.setAttribute('aria-label',g.name);p.dataset.page=String(i);grid.appendChild(p);return p;
  });
 }
 if(direct.length){
  const byName=new Map(groups.flatMap((g,i)=>g.ids.map(id=>[id,i])));
  direct.forEach(btn=>pages[byName.get(btn.id.replace('papp-btn-',''))??(pages.length-1)].appendChild(btn));
 }
 // Bound the page size: if a category acquires >6 apps, distribute overflow dynamically.
 pages.forEach((page,index)=>{
  while(page.children.length>6){
   const extra=page.lastElementChild;
   let next=pages[index+1];if(!next){next=document.createElement('div');next.className='v8776-home-page';next.dataset.page=String(pages.length);next.setAttribute('role','group');next.setAttribute('aria-label','Ứng dụng khác');pages.push(next);grid.appendChild(next);}
   next.prepend(extra);
  }
 });
 pager.innerHTML=pages.map((p,i)=>`<button type="button" class="${i===activePage?'active':''}" data-v8776-page="${i}" aria-label="Trang ${i+1}/${pages.length}" aria-current="${i===activePage?'page':'false'}"></button>`).join('');
 setPage(activePage,false);
}
function setPage(index,scroll=true){
 activePage=Math.max(0,Math.min(pages.length-1,Number(index)||0));
 const p=pages[activePage];if(!p)return;
 pageTitle.textContent=groups[activePage]?.name||'Ứng dụng khác';
 pager.querySelectorAll('button').forEach((b,i)=>{b.classList.toggle('active',i===activePage);b.setAttribute('aria-current',i===activePage?'page':'false')});
 if(scroll)grid.scrollTo({left:activePage*grid.clientWidth,behavior:modal.classList.contains('v8772-reduce-motion')?'instant':'smooth'});
}
const routeObserver=new MutationObserver(()=>{
 if([...grid.children].some(el=>el.matches?.('button[id^="papp-btn-"]')))regroup();
});
regroup();routeObserver.observe(grid,{childList:true});
pager.addEventListener('click',e=>{const btn=e.target.closest('[data-v8776-page]');if(btn)setPage(Number(btn.dataset.v8776Page))});
let scrollRAF=0;
grid.addEventListener('scroll',()=>{
 if(scrollRAF)cancelAnimationFrame(scrollRAF);
 scrollRAF=requestAnimationFrame(()=>setPage(Math.round(grid.scrollLeft/Math.max(1,grid.clientWidth)),false));
},{passive:true});
// Buttons support swipe without interfering with vertical scrolling in opened apps.
let touchStart=null;
grid.addEventListener('touchstart',e=>{if(e.touches.length===1)touchStart={x:e.touches[0].clientX,y:e.touches[0].clientY};},{passive:true});
grid.addEventListener('touchend',e=>{
 if(!touchStart)return;
 const x=(e.changedTouches[0]?.clientX??touchStart.x)-touchStart.x;
 const y=(e.changedTouches[0]?.clientY??touchStart.y)-touchStart.y;
 touchStart=null;
 if(Math.abs(x)>48&&Math.abs(x)>Math.abs(y)*1.25)setPage(activePage+(x<0?1:-1));
},{passive:true});
function updateMode(){
 const homeActive=!modal.classList.contains('hidden')&&!home.classList.contains('hidden');
 modal.classList.toggle('v8776-home-active',homeActive);
 if(homeActive){setPage(activePage,false);if(grid.scrollLeft!==activePage*grid.clientWidth)grid.scrollLeft=activePage*grid.clientWidth;}
 else if(!view.classList.contains('hidden'))renderInbox();
}
new MutationObserver(updateMode).observe(home,{attributes:true,attributeFilter:['class']});
new MutationObserver(updateMode).observe(modal,{attributes:true,attributeFilter:['class']});
// React to notifications from gameplay, while never modifying them implicitly.
for(const id of ['header-notif-badge','phone-notification-count']){
 const b=$(id);if(b)new MutationObserver(()=>{
  if(!view.classList.contains('hidden'))renderInbox();
 }).observe(b,{attributes:true,childList:true,characterData:true,subtree:true,attributeFilter:['class']});
}
// Keyboard support for desktop testing: arrows change Home page, only when the phone is visible.
document.addEventListener('keydown',e=>{
 if(!modal.classList.contains('hidden')&&modal.classList.contains('v8776-home-active')&&!e.target.closest('input,textarea,select')){
  if(e.key==='ArrowRight'){setPage(activePage+1);e.preventDefault();}
  if(e.key==='ArrowLeft'){setPage(activePage-1);e.preventDefault();}
 }
});
window.BPVQSwipeOS={openInbox,renderInbox,setPage,getPage:()=>activePage,getTotalPages:()=>pages.length};
os.addRelease?.('v87.7.6','Thông báo nằm trong app điện thoại; Home chỉ có chuông và lưới ứng dụng vuốt ngang theo trang.');
updateMode();
})();
