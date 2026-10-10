/* Bỏ Phố Về Quê v87.7.5 — Thị Trấn OS Reborn.
   Keep gameState as the sole source of truth. New UI must never duplicate rewards/XP/Xu.
   Classic (non-module) script loaded after game.js and VillageOS. */
(function(){
'use strict';
const os=window.VillageOS, modal=document.getElementById('modal-smartphone');
const home=document.getElementById('phone-app-home'), grid=document.getElementById('v8772-app-launcher');
const shell=document.getElementById('phone-app-container');
if(!os||!modal||!home||!grid||!shell)return;
modal.classList.add('v8775-reborn');
const $=id=>document.getElementById(id);
const state=()=>{try{return typeof gameState==='object'&&gameState?gameState:null}catch(e){return null}};
const fmt=n=>(Number(n)||0).toLocaleString('vi-VN');
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const notices=()=>Array.isArray(state()?.notifications)?state().notifications:[];
const unread=()=>notices().filter(n=>!n.read).length;
const readonly='<small class="v8775-disclaimer">Tổng hợp từ dữ liệu hiện tại; nhận thưởng và hoàn thành nhiệm vụ vẫn ở chức năng gốc.</small>';

// APP-REGISTRY: physical panels and launcher buttons are generated from one data model.
function panel(id){const el=document.createElement('section');el.id=`phone-app-${id}`;el.className='v8775-app-panel hidden';shell.appendChild(el);return el;}
const views={character:panel('character'),construction:panel('construction'),staff:panel('staff'),journal:panel('journal')};
// Preserve original rendering IDs, so gameplay math and handlers remain unchanged.
const skill=$('growth-panel-skills'),decor=$('growth-panel-decor'),staff=$('growth-panel-staff'),story=$('growth-panel-story');
for(const x of [skill,decor,staff,story])if(x)x.classList.add('v8775-growth-panel');
if(skill)views.character.appendChild(skill);
if(decor)views.construction.appendChild(decor);
if(story)views.construction.appendChild(story);
if(staff)views.staff.appendChild(staff);
// Legacy progress view stays registered as an adapter for old callbacks; not a Home icon.
$('papp-btn-progress')?.remove();
// Move Settings to the grid, and put the universal Journal in the dock.
const dock=home.querySelector('.v8773-dock');
const settingsButton=$('papp-btn-settings');if(settingsButton)grid.appendChild(settingsButton);

function pfx(icon,title,caption){return `<div class="v8775-app-heading"><span>${icon}</span><div><b>${title}</b><small>${caption}</small></div></div>`;}
function safeSection(fn){try{fn()}catch(e){console.warn('[OS Reborn] legacy growth panel',e)}}
function showGrowth(section){safeSection(()=>switchGrowthSection(section));}
const chibis=[{id:'male',title:'Chibi Nam',image:'assets/images/259_js-283_3b3f2f21bc.webp'},
 {id:'female',title:'Chibi Nữ',image:'assets/images/260_js-284_e859d7af0a.webp'}];
// Separate future-asset registry; do not switch to IDs unsupported by legacy renderer.
const extraChibis=[];
window.BPVQChibiCollection={register(info){
 if(!info||!/^[-a-z0-9]+$/.test(info.id||'')||!info.title||!info.image)return false;
 if(chibis.some(c=>c.id===info.id)||extraChibis.some(c=>c.id===info.id))return false;
 extraChibis.push(Object.freeze({...info}));return true;
}, list:()=>[...chibis,...extraChibis]};
function pickChibi(id){
 const s=state();if(!s||!chibis.some(c=>c.id===id))return;
 s.playerChibi=id;
 try{saveGameToStorage(false)}catch(e){}
 try{updatePlayerChibiPickers()}catch(e){}
 try{renderVillageUI()}catch(e){}
 try{renderAccountScreen()}catch(e){}
 renderCharacter('chibi');
 try{showToast('Đã thay Chibi, giữ nguyên nghề và tiến độ!','✨')}catch(e){}
}
let charTab='chibi', buildTab='stage';
function renderCharacter(view=charTab){
 charTab=view;const s=state();if(!s){views.character.innerHTML=pfx('👤','Nhân Vật','Hãy vào hồ sơ game để bắt đầu.');return}
 const level=Number(s.level)||1, gender=s.playerChibi==='female'?'female':'male';
 const heading=pfx('👤','Hồ sơ nhân vật',`${esc(s.playerName||'Người chơi')} · Lv.${level} · ${fmt(s.sp)} SP`);
 const tabs='<div class="v8775-tabs"><button data-on="'+(view==='chibi')+'" onclick="BPVQReborn.characterTab(\'chibi\')">🎭 Chibi</button><button data-on="'+(view==='skills')+'" onclick="BPVQReborn.characterTab(\'skills\')">⚡ Kỹ năng</button><button data-on="'+(view==='journey')+'" onclick="BPVQReborn.characterTab(\'journey\')">🧭 Hành trình</button></div>';
 // Keep original growth-panel DOM, which is shared by core renderer.
 let content='';
 if(view==='chibi'){
  content='<p class="v8775-help">Đổi ngoại hình bất cứ lúc nào, không mất Xu, SP hay nghề nghiệp.</p><div class="v8775-chibi-grid">'+chibis.map(c=>`<button class="v8775-chibi-card ${gender===c.id?'selected':''}" onclick="BPVQReborn.chooseChibi('${c.id}')"><img src="${c.image}" alt="${esc(c.title)}"><b>${esc(c.title)}</b><small>${gender===c.id?'✓ Đang sử dụng':'Chạm để đổi'}</small></button>`).join('')+extraChibis.map(c=>`<div class="v8775-chibi-card locked"><img src="${esc(c.image)}" alt=""><b>${esc(c.title)}</b><small>🔒 ${esc(c.unlockLabel||'Chưa mở khóa')}</small></div>`).join('')+'</div><div class="v8775-info">🌸 Kho Chibi sẵn sàng mở rộng. Các nhân vật tương lai chỉ được thêm khi có ảnh và điều kiện mở khóa đã duyệt.</div>';
 }else if(view==='skills'){
  content=`<div class="v8775-info">⚡ Điểm kỹ năng: <b>${fmt(s.sp)} SP</b> · Đang chơi: ${esc(({boba:'Trà Sữa',noodle:'Mì Cay',skewer:'Xiên Que'})[s.currentCareer]||s.currentCareer)}</div>`;
 }else{
  content=`<div class="v8775-info"><b>🏪 Nghề hiện tại:</b> ${esc(({boba:'Trà Sữa',noodle:'Mì Cay',skewer:'Xiên Que'})[s.currentCareer]||s.currentCareer)}<br><b>📅 Ngày:</b> ${fmt(s.day)} · <b>🏆 Bậc quán:</b> ${fmt((Number(s.shopStage)||0)+1)}</div><button class="v8775-primary" onclick="BPVQReborn.accounts()">👥 Tạo / chuyển hồ sơ để thử nghề khác</button><button class="v8775-action-danger" onclick="BPVQReborn.restart()">💥 Đổi nghề / bắt đầu lại (theo luật hiện tại)</button><p class="v8775-help">⚠️ Nút đổi nghề hiện dùng quy trình cũ: đặt lại cấp, Xu, kho và nhiều tiến trình. Hãy xuất save trước. Quy trình quyết toán, di sản và cứu quán sẽ được thiết kế riêng, chưa tự động chuyển nghề.</p>`;
 }
 // Clear only wrappers; preserve skill panel before replaceChildren or it is destroyed.
 if(skill&&skill.parentElement===views.character)views.character.removeChild(skill);
 views.character.innerHTML=heading+tabs+`<div id="v8775-character-content">${content}</div>`;
 if(view==='skills'&&skill){$('v8775-character-content').appendChild(skill);showGrowth('skills');}
}
function renderConstruction(tab=buildTab){
 buildTab=tab;const s=state();if(!s)return;
 const stage=(Number(s.shopStage)||0)+1,project=s.shopConstruction;
 const count=9;
 const stageCaption=project?`🏗️ Đang thi công · dự kiến ngày ${project.finishDay}`:`Bậc ${stage}/${count} · ${fmt(s.coins)} Xu`;
 for(const x of [story,decor])if(x?.parentElement===views.construction)views.construction.removeChild(x);
 views.construction.innerHTML=pfx('🏗️','Xây Quán','Thuê thợ · Mở rộng · Trang trí')+
 `<div class="v8775-info">${stageCaption}${project?`<br>📅 Từ ngày ${project.startedDay} tới ngày ${project.finishDay} · đã trả ${fmt(project.cost)} Xu`:''}<br>Chi phí thi công dùng đúng bảng giá nâng bậc cũ, không thu thêm phí thuê thợ.</div>`+
 `<div class="v8775-tabs"><button data-on="${tab==='stage'}" onclick="BPVQReborn.constructionTab('stage')">🏗️ Mở rộng</button><button data-on="${tab==='decor'}" onclick="BPVQReborn.constructionTab('decor')">🪴 Trang trí</button></div><div id="v8775-construction-content"></div>`;
 const curr=tab==='stage'?story:decor;
 if(curr){$('v8775-construction-content').appendChild(curr);showGrowth(tab==='stage'?'story':'decor');}
 if(tab==='stage')$('v8775-construction-content')?.insertAdjacentHTML('beforeend','<p class="v8775-help">Hợp đồng trọn gói chỉ bắt đầu sau khi bạn xác nhận. Công trình hoàn tất khi chủ động qua đủ ngày trong game; bậc, SP và mở khóa chỉ thay đổi lúc khánh thành.</p>');
}
function renderStaff(){
 const s=state();if(!s)return;
 if(staff?.parentElement===views.staff)views.staff.removeChild(staff);
 views.staff.innerHTML=pfx('👥','Nhân Sự','Tuyển người · Lương · Chăm sóc đội ngũ')+
 `<div class="v8775-info">👩‍🍳 Nhân viên hiện tại: <b>${(s.staff||[]).length}</b> · Lương tồn: <b>${fmt(s.staffHR?.arrears)} Xu</b><br>Đội thợ xây dựng là nhà thầu, không sử dụng suất nhân viên quán.</div><div id="v8775-staff-content"></div>`;
 if(staff){$('v8775-staff-content').appendChild(staff);showGrowth('staff');}
}
function journalList(s){
 const total=Number(s.dailyStats?.counterServed||0)+Number(s.dailyStats?.deliveryServed||0);
 const visitors=s.dailyVillageVisitors||{}, done=Array.isArray(visitors.completedIds)?visitors.completedIds.length:0, all=Array.isArray(visitors.ids)?visitors.ids.length:0;
 const chapters=Object.entries(s.villageStoryFlags||{}).filter(([k,v])=>/^v84_.*_stage$/.test(k)&&Number(v)>0).length;
 const festivals=Object.values(s.v8752Festivals?.events||{});
 const endedFestivals=festivals.filter(f=>Number(f.stage)>=3).length;
 const stamps=Object.values(s.v8751Town?.stamps||{}).filter(Boolean).length;
 const construction=s.shopConstruction;
 return [
  {cat:'shop',icon:'🏪',name:'Quán · hoạt động trong ngày',body:`Đã phục vụ ${total} lượt; doanh thu ca ${fmt((Number(s.dailyStats?.counterRev)||0)+(Number(s.dailyStats?.deliveryRev)||0))} Xu.`,tab:'shop'},
  {cat:'village',icon:'🏡',name:'Làng · gặp gỡ hôm nay',body:`Đã hoàn thành ${done}/${all} lượt gặp cư dân được lên lịch.`,tab:'village'},
  {cat:'npc',icon:'💌',name:'Cư dân · cốt truyện',body:`Đã ghi tiến trình ở ${chapters} tuyến NPC. Xem chi tiết trong app Cư Dân.`,app:'social'},
  {cat:'village',icon:'🎫',name:'Hoạt động thị trấn',body:`Đã thu ${stamps}/5 dấu ấn các khu vực. Việc hôm nay cần làm trực tiếp tại Làng.`,tab:'village'},
  {cat:'event',icon:'🎪',name:'Lễ hội · các chặng',body:`Hoàn thành ${endedFestivals}/${festivals.length} lễ hội đã ghi nhận. Chạm vào Làng để xem các chặng còn lại.`,tab:'village'},
  {cat:'farm',icon:'🌾',name:'Nông trại · hôm nay',body:`Vườn ${s.farmPlots?.filter(p=>p.unlocked).length||0} thửa mở, Chuồng ${Object.values(s.animals||{}).filter(a=>a.unlocked).length} loại vật nuôi.`,tab:'farm'},
  {cat:'shop',icon:'🏗️',name:'Công trình quán',body:construction?`Đang thi công, khánh thành ngày ${construction.finishDay}.`:`Bậc ${Number(s.shopStage||0)+1}; hiện chưa thuê đội thợ.`,app:'construction'},
  {cat:'other',icon:'🌸',name:'Mika · hướng dẫn',body:s.mikaGuide?.completed?'Đã hoàn thành hướng dẫn hiện tại.':'Mở hướng dẫn Mika từ Cài đặt → Mika để tiếp tục.',app:'settings'}
 ];
}
let journalTab='all';
function renderJournal(tab=journalTab){journalTab=tab;const s=state();if(!s)return;
 const filters=[['all','Tất cả'],['shop','Quán'],['village','Làng'],['npc','NPC'],['farm','Nông trại'],['event','Lễ hội']];
 views.journal.innerHTML=pfx('📜','Nhật Ký Khởi Nghiệp','Tiến độ các khu vực · Không nhận thưởng trùng')+
 `<div class="v8775-tabs v8775-journal-tabs">${filters.map(([id,n])=>`<button data-on="${tab===id}" onclick="BPVQReborn.journalTab('${id}')">${n}</button>`).join('')}</div>`+
 journalList(s).filter(item=>tab==='all'||item.cat===tab).map(x=>`<article class="v8775-task"><div class="v8775-task-icon">${x.icon}</div><div><b>${x.name}</b><p>${esc(x.body)}</p><button onclick="BPVQReborn.jump('${x.tab||''}','${x.app||''}')">Đi đến ${x.app?'ứng dụng':'khu vực'} →</button></div></article>`).join('')+
 `<p class="v8775-help">Nhật Ký tổng hợp tiến độ có thật từ Quán, Làng, NPC, Vườn và Xây Quán. Nhiệm vụ riêng của lễ hội vẫn được nhận/trả trong hệ thống gốc cho đến khi kiểm thử tích hợp hoàn chỉnh.</p>${readonly}`;
}
for(const a of [
 {id:'character',label:'Nhân Vật',icon:'👤',render:()=>renderCharacter()},
 {id:'construction',label:'Xây Quán',icon:'🏗️',render:()=>renderConstruction()},
 {id:'staff',label:'Nhân Sự',icon:'👥',render:renderStaff},
 {id:'journal',label:'Nhật Ký',icon:'📜',render:()=>renderJournal()}
])os.registerApp(a);
const journalButton=$('papp-btn-journal');if(dock&&journalButton)dock.appendChild(journalButton);
const oldPager=home.querySelector('.v8773-pager');if(oldPager)oldPager.remove(); // no misleading fake-page indicator
// Explanations in existing apps: keep every old handler and save field unchanged.
const helperDefs={
 delivery:'Đơn online bắt đầu khi quán mở cửa. Đóng gói kịp giờ; bộ đếm tạm dừng khi bạn dùng điện thoại.',
 soppi:'Mua hàng online sẽ giao sau; Chợ trực tiếp và mua nguyên liệu được giữ trong Mua sắm.',
 social:'Sổ Tay Cư Dân lưu quan hệ và ký ức. Nhật Ký chỉ tổng hợp, không nhận thưởng thay NPC.',
 utility:'Trang bị nhân vật và vật phẩm trợ lực của Quán, Vườn, Chuồng, Làng nằm tại đây. SP nâng trong Nhân Vật.',
 games:'Thưởng, vé và vật phẩm được xử lý tại minigame gốc; không phát thêm từ Nhật Ký.',
 auction:'Chú ý tiền giữ chỗ, ngày chốt và lịch sử giao dịch trước khi đặt giá.',
 bank:'Lưu ý cơ chế vay cũ: khi vay, nợ cộng 15% phí; qua ngày hiện tính lãi 5% trên dư nợ, có thể vừa trừ Xu vừa tăng số nợ. Luật vay mới đang chờ cân bằng; hãy cân nhắc trước khi vay.'
};
Object.entries(helperDefs).forEach(([id,copy])=>{
 const view=$('phone-app-'+id);if(!view||view.querySelector('.v8775-app-helper'))return;
 const note=document.createElement('div');note.className='v8775-app-helper'+(id==='bank'?' v8775-bank-warning':'');note.textContent=copy;view.prepend(note);
});

// Compatibility adapter for the many old deep links that used 'progress'.
const originalSwitch=window.switchPhoneApp;
const originalOpen=os.open.bind(os);
window.switchPhoneApp=function(id){return originalSwitch(id==='progress'?'character':id)};
os.open=function(id){return originalOpen(id==='progress'?'character':id)};

// NATIVE PHONE NOTIFICATIONS: home previews, full inbox, and top-edge downward swipe.
const box=document.createElement('section');box.className='v8775-notices';box.id='v8775-home-notices';
const hero=home.querySelector('.v8773-hero');
if(hero)hero.after(box);else home.prepend(box);
let expanded=false;
function showNotifications(){try{window.openNotificationsModal?.()}catch(e){console.warn('[OS Reborn] open inbox',e)}}
function notificationCard(n){
 const icon=esc(n.icon||'🔔'),title=esc(n.title||'Thông báo'),description=esc(n.body||'');
 return `<button class="v8775-notice ${n.read?'read':''}" onclick="BPVQReborn.readNotice('${esc(n.id)}')"><span>${icon}</span><span><b>${title}</b><small>${description}</small></span>${n.read?'':'<i aria-label="Chưa đọc"></i>'}</button>`;
}
function renderHomeNotifications(){
 const settings=os.getSettings();const s=state();const all=notices();const visible=all.filter(n=>{
  const type=String(n.type||'').toLowerCase();
  return type==='weather'?settings.notifyWeather!==false: ['event','incident','festival','market','world','npc'].includes(type)?settings.notifyEvents!==false:true;
 });
 const pending=visible.filter(n=>!n.read), latest=pending.length?pending:visible;
 const count=unread();
 box.classList.toggle('hidden',settings.notifyHome===false);
 if(settings.notifyHome===false)return;
 const display=latest.slice(0,expanded?5:2);
 box.innerHTML=`<div class="v8775-notice-header"><button type="button" onclick="BPVQReborn.togglePreview()"><span>🔔 Thông báo ${count?`<em>${count>9?'9+':count} mới</em>`:''}</span><small>${expanded?'Thu gọn ▲':'Xem nhanh ▼'}</small></button><button class="v8775-see-all" onclick="BPVQReborn.allNotifications()">Tất cả →</button></div>`+
 (display.length?`<div class="v8775-notice-feed">${display.map(notificationCard).join('')}</div>`:'<p class="v8775-notice-empty">🌼 Chưa có tin nào. Một ngày bình yên!</p>');
}
const badge=$('header-notif-badge');
if(badge)new MutationObserver(()=>{if(!home.classList.contains('hidden'))renderHomeNotifications()}).observe(badge,{childList:true,characterData:true,attributes:true,attributeFilter:['class']});
// Home visible listener also responds to VillageOS.home() and the phone open wrapper.
new MutationObserver(()=>{if(!home.classList.contains('hidden'))renderHomeNotifications()}).observe(home,{attributes:true,attributeFilter:['class']});
// Touch only in the hero itself: normal scroll inside app is not hijacked.
let touchY=null;
home.addEventListener('touchstart',ev=>{touchY=ev.touches.length===1&&ev.target.closest('.v8773-hero')?ev.touches[0].clientY:null},{passive:true});
home.addEventListener('touchend',ev=>{if(touchY===null)return;const diff=(ev.changedTouches[0]?.clientY||touchY)-touchY;touchY=null;if(diff>55)showNotifications()},{passive:true});

// Settings gets lightweight controls for notification previews without mutating game event creation.
const settingsPanel=$('phone-app-settings');
function decorateSettings(){
 if(!settingsPanel||settingsPanel.classList.contains('hidden'))return;
 const categories=settingsPanel.querySelectorAll('.v8772-setting-category');
 if(!categories.length||settingsPanel.querySelector('.v8775-notification-settings'))return;
 const btn=document.createElement('button');btn.className='v8772-setting-category v8775-notification-settings';
 btn.innerHTML='<span>🔔</span><span><b>Thông báo</b><small>Hiện tin mới trên Home · thời tiết · sự kiện</small></span><span>›</span>';
 btn.addEventListener('click',()=>showNotificationSettings());
 const target=[...categories].find(x=>/Cài đặt|Giao diện/.test(x.textContent||''));if(target)target.after(btn);else settingsPanel.appendChild(btn);
}
function showNotificationSettings(){
 if(!settingsPanel)return;
 const s=os.getSettings();
 settingsPanel.innerHTML=`<div class="v8772-subheader"><button type="button" onclick="BPVQReborn.settingsBack()">‹</button><b>🔔 Thông báo</b></div><div class="v8775-notification-options">${[
  ['notifyHome','Hiển thị trên Home','Hiện tối đa hai tin mới ngay khi mở điện thoại'],
  ['notifyWeather','Hiển thị thời tiết','Không ẩn khỏi lịch sử thông báo'],
  ['notifyEvents','Hiển thị sự kiện','Chỉ điều chỉnh bản xem trước ở Home']
 ].map(([id,name,detail])=>`<label><span><b>${name}</b><small>${detail}</small></span><input type="checkbox" ${s[id]!==false?'checked':''} onchange="BPVQReborn.preference('${id}',this.checked)"></label>`).join('')}</div><p class="v8775-help">Các tùy chọn chỉ ẩn/hiện trên Home, không xóa sự kiện hoặc lịch sử của hồ sơ.</p>`;
}
if(settingsPanel)new MutationObserver(()=>decorateSettings()).observe(settingsPanel,{childList:true,attributes:true,attributeFilter:['class']});
// Character progression should never mutate during notification preview or UI mounting.
window.BPVQReborn={
 characterTab:renderCharacter,constructionTab:renderConstruction,journalTab:renderJournal,chooseChibi:pickChibi,
 togglePreview(){expanded=!expanded;renderHomeNotifications()},allNotifications:showNotifications,
 readNotice(id){try{window.bpvqReadGameNotification?.(id)}catch(e){console.warn(e)}renderHomeNotifications();showNotifications()},
 settingsBack(){os.settings('root')},
 preference(id,value){os.setSetting(id,value);renderHomeNotifications();},
 accounts(){window.closeSmartPhoneModal?.();window.openAccountScreen?.()},
 restart(){window.closeSmartPhoneModal?.();window.openBankruptcyModal?.()},
 jump(tab,app){if(app){os.open(app);return;}window.closeSmartPhoneModal?.();try{window.switchTab?.(tab)}catch(e){console.warn(e)}},
 refresh:renderHomeNotifications
};
// Support future releases that register app icons after OS init; no fixed art sprite indices.
const launcherObserver=new MutationObserver(()=>{grid.querySelectorAll('.v8772-app:not(.v8773-art-icon)').forEach(btn=>{btn.title=btn.getAttribute('aria-label')||btn.textContent.trim()})});
launcherObserver.observe(grid,{childList:true});
os.addRelease?.('v87.7.5','Thị Trấn OS Reborn: thông báo ngay Home, 12 app, Nhân Vật/Chibi, Xây Quán có thời gian thuê thợ, Nhân Sự và Nhật Ký liên thông.');
renderHomeNotifications();
})();
