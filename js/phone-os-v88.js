/* Phone OS Core v88 preview: one lifecycle event bus for legacy-compatible modules.
 * Replaces nine separately loaded phone scripts, preserving their order.
 * Game economy, saves and customer-pause behavior stay in js/game.js.
 */
(function(w){
  "use strict";
  const subscriptions=new Map();
  const on=(name,listener)=>{
    if(typeof listener!=='function')throw new TypeError('Phone OS listener must be a function');
    const listeners=subscriptions.get(name)||new Set();
    listeners.add(listener);subscriptions.set(name,listeners);
    return ()=>listeners.delete(listener);
  };
  const emit=(name,...args)=>{
    for(const listener of subscriptions.get(name)||[]){
      try{listener(...args)}catch(error){console.error('[Phone OS v88]',name,error)}
    }
  };
  w.BPVQPhoneLifecycle=Object.freeze({on,emit});
})(window);

/* ===== Original component: js/v8772-thitran-os.js (consolidated) ===== */
/* Thị Trấn OS 2.0 | v87.7.2 | navigation/registry/settings only.
   All shop/economy/save gameplay still belongs to game.js. */
(function(){
 'use strict';
 const $=sel=>document.querySelector(sel);
 const byId=id=>document.getElementById(id);
 const modal=byId('modal-smartphone');
 const container=byId('phone-app-container');
 const title=byId('phone-current-app-title');
 const origGrid=byId('papp-btn-delivery')?.parentElement;
 if(!modal||!container||!origGrid)return;
 const originalSwitch=window.switchPhoneApp;
 const originalOpen=window.openSmartPhoneModal;
 const originalClose=window.closeSmartPhoneModal;
 if(typeof originalSwitch!=='function'||typeof originalOpen!=='function')return;
 const apps=new Map();
 const wallpapers=[
  {id:'village',name:'Làng chiều',url:'assets/images/phone/wallpapers/village.webp',position:'center center'},
  {id:'night',name:'Đêm dịu',url:'assets/images/phone/wallpapers/night.webp',position:'center center'},
  {id:'rice',name:'Nông trại',url:'assets/images/phone/wallpapers/rice.webp',position:'center center'},
  {id:'market',name:'Phố chợ',url:'assets/images/phone/wallpapers/market.webp',position:'center center'},
  {id:'festival',name:'Lễ hội',url:'assets/images/phone/wallpapers/festival.webp',position:'center center'},
  {id:'gradient',name:'Gradient',url:'assets/images/phone/wallpapers/gradient.webp',position:'center center'}
 ];
 const milestones=Array.isArray(window.VillageOSReleases) ? window.VillageOSReleases.map(x=>[x.version,x.summary]) : [
  ['Khởi đầu','Mô phỏng bán đồ ăn, nhận đơn và quản lý quầy hàng.'],
  ['v33','Mở rộng nhiều cơ chế kinh doanh và khu vực khám phá.'],
  ['v87.5.3.2','Nhân viên, hoạt động Làng và vận hành quán sâu hơn.'],
  ['v87.6','Tách hình ảnh, CSS, JavaScript để đưa lên GitHub Pages.'],
  ['v87.6.1','Rà soát và sửa hình nguyên liệu của ba nghề.'],
  ['v87.7','Kho tổng hợp và hệ thống hướng dẫn Mika 2.0.'],
  ['v87.7.1','Cốt truyện rời phố, chọn nghề với Mika, hướng dẫn người mới.'],
  ['v87.7.2','Thị Trấn OS: Home, hình nền, Cài đặt và điều hướng mở rộng.']
 ];
 const globalKey='bpvq:v8772:device-settings';
 const profileKey=()=>`bpvq:v8772:profile:${(typeof activeProfileId!=='undefined'&&activeProfileId)||'guest'}`;
 const defaults={sound:true,volume:80,reducedMotion:false,wallpaper:'village',layoutMode:'swipe',backgroundEffects:true,mikaMode:'explore',largeText:false};
 function read(key){try{const v=JSON.parse(localStorage.getItem(key)||'null');return v&&typeof v==='object'&&!Array.isArray(v)?v:{}}catch(e){return {}}}
 function getSettings(){
  const st={...defaults,...read(globalKey),...read(profileKey())};
  // Legacy wallpaper IDs are mapped without destroying historical save data.
  if(st.wallpaper==='hill')st.wallpaper='village';
  if(st.wallpaper==='river')st.wallpaper='rice';
  return st;
 }
 function setSetting(name,value){
  const scope=['sound','volume','reducedMotion','largeText'].includes(name)?globalKey:profileKey();
  const obj=read(scope);obj[name]=value;
  try{localStorage.setItem(scope,JSON.stringify(obj))}catch(e){console.warn('[TownOS] Cannot save preference',e)}
  applySettings();if(current==='settings')renderSettings();window.BPVQPhoneLifecycle.emit('setting',name,value);
 }
 function applySettings(){
  const st=getSettings();
  modal.classList.toggle('v8772-reduce-motion',!!st.reducedMotion);
  modal.classList.toggle('v8772-large-text',!!st.largeText);
  modal.classList.toggle('v8777-layout-list',st.layoutMode==='list');
  modal.classList.toggle('v8777-effects-off',st.backgroundEffects===false);
  const wallpaper=wallpapers.find(w=>w.id===st.wallpaper)||wallpapers[0];
  const home=byId('phone-app-home');if(home){home.style.setProperty('--v8772-wallpaper',`url("${wallpaper.url}")`);home.style.setProperty('--v8772-wallpaper-position',wallpaper.position);}
 }
 // Preserve Tone.js and existing SFX code; never control the user's phone volume.
 const originalSound=window.playSound;
 if(typeof originalSound==='function')window.playSound=function(type){
  const settings=getSettings();if(!settings.sound||Number(settings.volume)===0)return;
  try{if(window.Tone?.Destination?.volume){window.Tone.Destination.volume.value= -24*(1-Math.max(0,Math.min(100,Number(settings.volume)))/100)}}catch(e){}
  return originalSound.call(this,type);
 };
 // Give smartphone open button a stable ID for Mika target highlighting.
 const phoneOpener=$('[onclick="openSmartPhoneModal()"]');if(phoneOpener)phoneOpener.id='v8772-phone-opener';
 const closeButton=$('#modal-smartphone button[onclick="closeSmartPhoneModal()"]');
 if(closeButton){closeButton.classList.add('v8772-close');closeButton.textContent='×';closeButton.title='Đóng điện thoại';closeButton.setAttribute('aria-label','Đóng điện thoại');}
 const launcher=origGrid;
 launcher.id='v8772-app-launcher';launcher.classList.add('v8772-app-launcher');
 // Move the original app buttons rather than duplicating links/handlers.
 const home=document.createElement('section');home.id='phone-app-home';home.className='v8772-home hidden';
 home.innerHTML='<div class="v8772-home-intro"><span>🌾 THỊ TRẤN OS</span><b>Về quê, mình có nhau.</b><small>Chạm một ứng dụng để bắt đầu nhé!</small></div>';
 home.appendChild(launcher);
 const homeBottom=document.createElement('div');homeBottom.className='v8772-home-hint';homeBottom.textContent='✿ Một ngày bình yên ở quê ✿';home.appendChild(homeBottom);
 container.prepend(home);
 const settingsPanel=document.createElement('section');settingsPanel.id='phone-app-settings';settingsPanel.className='v8772-settings hidden';container.appendChild(settingsPanel);
 const nav=document.createElement('div');nav.id='v8772-phone-nav';nav.className='v8772-phone-nav';nav.innerHTML='<button type="button" class="v8772-home-button" onclick="VillageOS.home()" aria-label="Về màn hình chính">⌂ <span>Home</span></button><button type="button" class="v8772-back-button" onclick="VillageOS.back()" aria-label="Quay lại">‹ <span>Quay lại</span></button>';
 const homeIndicator=$('#modal-smartphone .phone-home-indicator');if(homeIndicator)homeIndicator.before(nav);else modal.querySelector('.phone-shell')?.appendChild(nav);
 let current='home';let inSettings='root';let navigation=['home'];
 function iconButton(app){
  const el=document.createElement('button');el.type='button';el.id=`papp-btn-${app.id}`;el.className='v8772-app';
  el.innerHTML=`<span class="phone-app-icon">${app.icon||'📱'}</span><span></span>`;
  el.lastElementChild.textContent=app.label;el.setAttribute('aria-label',`Mở ${app.label}`);
  el.onclick=()=>window.switchPhoneApp(app.id);return el;
 }
 function registerApp(app){
  if(!app||typeof app.id!=='string'||!/^[-a-z0-9]+$/.test(app.id)||!app.label)return false;
  apps.set(app.id,Object.freeze({...app}));
  if(app.onHome!==false&&!byId(`papp-btn-${app.id}`))launcher.appendChild(iconButton(app));
  return true;
 }
 const initial=[['delivery','Ship','🛵'],['soppi','Soppi','🛒'],['social','Cư dân','👥'],['progress','Phát triển','🏗️'],['utility','Tiện ích','🧰'],['games','Game','🎮'],['bank','Ví/Vay','🏦'],['auction','Đấu giá','🔨']];
 initial.forEach(([id,label,icon])=>registerApp({id,label,icon,legacy:true}));
 registerApp({id:'effects',label:'Sổ Hiệu Ứng',icon:'📊',legacy:true,onHome:false});
 registerApp({id:'settings',label:'Cài đặt',icon:'⚙️',onHome:true,render:()=>renderSettings()});
 // Normalize original buttons once. No changes to the 8 original app functions.
 launcher.querySelectorAll('button[id^="papp-btn-"]').forEach(btn=>{btn.classList.add('v8772-app');const span=btn.querySelectorAll('span');if(span.length)span[span.length-1].classList.add('v8772-label')});
 function hideViews(){container.querySelectorAll('[id^="phone-app-"]').forEach(el=>{
  if(el.id!=='phone-app-container')el.classList.add('hidden');
 });}
 function homeScreen(reset=true){
  if(reset)navigation=['home'];current='home';inSettings='root';hideViews();home.classList.remove('hidden');
  title.textContent='Màn Hình Chính';nav.classList.add('v8772-is-home');
  launcher.querySelectorAll('button').forEach(b=>b.classList.remove('v8772-selected'));
  applySettings();window.BPVQPhoneLifecycle.emit('home');return true;
 }
 function openApp(id,record=true){
  if(id==='progress')id='character';if(id==='home')return homeScreen();
  const app=apps.get(id);
  if(!app){if(typeof originalSwitch==='function')return originalSwitch(id);return false;}
  if(app.unlocked && !app.unlocked()){try{showToast('Ứng dụng chưa mở khóa!','🔒')}catch(e){}return false;}
  if(record&&navigation[navigation.length-1]!==id)navigation.push(id);
  current=id;hideViews();home.classList.add('hidden');nav.classList.remove('v8772-is-home');
  if(app.legacy){originalSwitch(id);launcher.querySelectorAll('button').forEach(b=>b.classList.add('v8772-app'));}
  else {byId(`phone-app-${id}`)?.classList.remove('hidden');app.render?.();}
  title.textContent=app.label;
  launcher.querySelectorAll('button').forEach(b=>b.classList.toggle('v8772-selected',b.id===`papp-btn-${id}`));
  return true;
 }
 function back(){
  if(current==='settings'&&inSettings!=='root'){inSettings='root';renderSettings();return;}
  if(navigation.length>1)navigation.pop();const to=navigation[navigation.length-1]||'home';
  if(to==='home')homeScreen(false);else openApp(to,false);
 }
 window.switchPhoneApp=function(id){return openApp(id)};
 window.openSmartPhoneModal=function(...args){const result=originalOpen.apply(this,args);homeScreen();window.BPVQPhoneLifecycle.emit('open');return result;};
 if(typeof originalClose==='function')window.closeSmartPhoneModal=function(...args){navigation=['home'];current='home';return originalClose.apply(this,args)};
 // One shared adapter for any future app - registerApp({id,label,icon,render,unlocked}).
 window.VillageOS={registerApp,open:openApp,home:homeScreen,back,close:()=>window.closeSmartPhoneModal(),getSettings,setSetting,listApps:()=>[...apps.values()]};
 function row(icon,label,desc,inner){return `<div class="v8772-setting-row"><span class="v8772-setting-icon">${icon}</span><span class="v8772-setting-copy"><b>${label}</b><small>${desc}</small></span>${inner||''}</div>`}
 function esc(txt){return String(txt||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));}
 function btn(id,emoji,titleText,desc){return `<button class="v8772-setting-category" onclick="VillageOS.settings('${id}')"><span>${emoji}</span><span><b>${titleText}</b><small>${desc}</small></span><span>›</span></button>`;}
 function renderSettings(){
  const s=getSettings();const view=inSettings;
  if(view==='root')settingsPanel.innerHTML=`<div class="v8772-settings-title">⚙️ Cài đặt <small>Tùy chỉnh chiếc điện thoại của bạn</small></div>${btn('appearance','🎨','Giao diện','6 hình nền · vuốt ngang · hiệu ứng')}${btn('audio','🔊','Âm thanh','Bật/tắt hiệu ứng · âm lượng')}${btn('performance','✨','Hiệu năng','Giảm chuyển động')}${btn('mika','🌸','Mika','Hướng dẫn người mới')}${btn('data','💾','Dữ liệu','Save và sao lưu')}${btn('about','📖','Về Game','Tác giả · phiên bản · lịch sử cập nhật')}`;
  else {
   let content='';
   if(view==='appearance'){
    content=`<h3>🌄 Bộ sưu tập hình nền</h3><div class="v8772-wallpapers">${wallpapers.map(w=>`<button class="v8772-wallpaper-option ${s.wallpaper===w.id?'selected':''}" onclick="VillageOS.setSetting('wallpaper','${w.id}')" aria-label="Chọn ${w.name}"><img loading="lazy" src="${w.url}" alt=""><span>${w.name}</span><em>${s.wallpaper===w.id?'✓':''}</em></button>`).join('')}</div>`;
    content+=`<h3>📱 Bố cục Home</h3><div class="v8777-layout-choices" role="group" aria-label="Bố cục điện thoại"><button type="button" class="${s.layoutMode!=='list'?'selected':''}" onclick="VillageOS.setSetting('layoutMode','swipe')">↔ Vuốt ngang</button><button type="button" class="${s.layoutMode==='list'?'selected':''}" onclick="VillageOS.setSetting('layoutMode','list')">↕ Cuộn dọc</button></div>`;
    content+=row('✨','Hiệu ứng nền nhẹ','Tắt khi muốn tiết kiệm tài nguyên',`<input type="checkbox" aria-label="Hiệu ứng nền" ${s.backgroundEffects!==false?'checked':''} onchange="VillageOS.setSetting('backgroundEffects',this.checked)">`);
    content+=row('🔤','Chữ lớn','Tăng cỡ chữ trong ứng dụng',`<input type="checkbox" aria-label="Chữ lớn" ${s.largeText?'checked':''} onchange="VillageOS.setSetting('largeText',this.checked)">`);
    content+=`<button type="button" class="v8777-reset-button" onclick="VillageOS.resetPhoneAppearance()">↺ Đặt lại giao diện điện thoại</button>`;
   }
   if(view==='audio'){
    content=row('🔊','Hiệu ứng âm thanh','Chạm để bật hoặc tắt âm trong game',`<input type="checkbox" aria-label="Bật âm thanh" ${s.sound?'checked':''} onchange="VillageOS.setSetting('sound',this.checked)">`);
    content+=`<div class="v8772-slider-row"><label for="v8772-volume">Âm lượng hiệu ứng <b id="v8772-volume-label">${s.volume}%</b></label><input id="v8772-volume" type="range" min="0" max="100" step="5" value="${Number(s.volume)||0}" oninput="document.getElementById('v8772-volume-label').textContent=this.value+'%'" onchange="VillageOS.setSetting('volume',Number(this.value))"></div><p class="v8772-note">Nhạc nền: game chưa có bộ nhạc riêng. Tùy chỉnh này chỉ điều khiển âm thanh trong game, không đổi âm lượng điện thoại.</p>`;
   }
   if(view==='performance')content=row('🌿','Giảm chuyển động','Hạn chế hiệu ứng không thiết yếu',`<input type="checkbox" aria-label="Giảm chuyển động" ${s.reducedMotion?'checked':''} onchange="VillageOS.setSetting('reducedMotion',this.checked)">`);
   if(view==='mika')content=`<h3>🌸 Mika đồng hành</h3><div class="v8772-mika-modes">${[['new','Hướng dẫn từng bước'],['explore','Tự khám phá'],['off','Tắt nhắc']].map(([id,l])=>`<button class="${gameState?.mikaGuide?.mode===id?'selected':''}" onclick="VillageOS.mikaMode('${id}')">${l}</button>`).join('')}</div><button class="v8772-action" onclick="VillageOS.resumeMika()">🌱 Bắt đầu / tiếp tục bài học</button>`;
   if(view==='data')content=`<h3>💾 Dữ liệu trò chơi</h3><p class="v8772-note">Dữ liệu game được lưu theo hồ sơ trên trình duyệt này. Hãy xuất mã save để dự phòng trước khi đổi thiết bị.</p><button class="v8772-action" onclick="VillageOS.saveNow()">💾 Lưu ngay</button><button class="v8772-action" onclick="VillageOS.backup()">📤 Sao chép mã save</button><p class="v8772-note">Để nhập mã save, dùng chức năng lưu trữ gốc của trò chơi. Không xóa dữ liệu trình duyệt nếu chưa sao lưu.</p>`;
   if(view==='about')content=`<h3>🌾 Bỏ Phố Về Quê</h3><p class="v8772-note">Game 2D mô phỏng kinh doanh và cuộc sống làng quê · Phiên bản v87.8.0.1 · Phone OS v88 Preview</p><h4>Ghi công</h4><p class="v8772-note"><b>Chủ dự án, ý tưởng và định hướng:</b> Người sáng tạo Bỏ Phố Về Quê (chưa chốt tên hiển thị).<br><b>Hỗ trợ thiết kế và lập trình:</b> ChatGPT (OpenAI); các công cụ khác sẽ được bổ sung sau khi xác nhận.</p><h4>Nhật ký phát triển</h4><div class="v8772-history">${milestones.map(([version,desc])=>`<div><b>${esc(version)}</b><span>${esc(desc)}</span></div>`).join('')}</div><p class="v8772-note">Mỗi bản cập nhật chỉ cần thêm một mốc vào danh mục lịch sử; các bản tương lai chưa phát hành không được ghi là đã có.</p>`;
   settingsPanel.innerHTML=`<div class="v8772-subheader"><button onclick="VillageOS.settings('root')">‹</button><b>${({appearance:'Giao diện',audio:'Âm thanh',performance:'Hiệu năng',mika:'Mika',data:'Dữ liệu',about:'Về Game'})[view]}</b></div><div class="v8772-subcontent">${content}</div>`;
  }
  applySettings();
 }
 function settings(id){inSettings=id;renderSettings();}
 Object.assign(window.VillageOS,{
  settings,
  resetPhoneAppearance(){
   // Keep sound, Mika, save data, accessibility and game preferences unchanged.
   for(const [k,v] of Object.entries({wallpaper:'village',layoutMode:'swipe',backgroundEffects:true,theme:'warm'}))setSetting(k,v);
   renderSettings();
  },
  mikaMode(mode){window.v877MikaSetMode?.(mode);setSetting('mikaMode',mode);},
  resumeMika(){window.closeSmartPhoneModal();window.v8771ResumeGuide?.();},
  saveNow(){try{saveGameToStorage(false);showToast('Đã lưu game.','💾')}catch(e){showToast('Không thể lưu.','⚠️')}},
  backup(){try{exportSaveCode()}catch(e){showToast('Bạn có thể xuất save trong mục Lưu game.','💾')}}
 });
 // Dynamic version history registry for future updates without touching UI.
 window.VillageOS.addRelease=(version,summary)=>{if(!version||!summary)return false;milestones.push([String(version),String(summary)]);if(current==='settings'&&inSettings==='about')renderSettings();return true;};
 homeScreen();
})();



/* ===== Original component: js/v8773-anime-signature.js (consolidated) ===== */
/* v87.7.3 Anime Signature Edition. Only decorates VillageOS 2.0; never modifies gameplay. */
(function(){'use strict';
 const modal=document.getElementById('modal-smartphone');
 const home=document.getElementById('phone-app-home');
 const launcher=document.getElementById('v8772-app-launcher');
 const settings=document.getElementById('phone-app-settings');
 const OS=window.VillageOS;
 if(!modal||!home||!launcher||!OS)return;
 modal.classList.add('v8773-premium');
 const navBar=document.getElementById('phone-current-app-title')?.parentElement?.parentElement;
 if(navBar)navBar.classList.add('v8773-appbar');
 const hero=document.createElement('div');hero.className='v8773-hero';
 hero.innerHTML='<div class="v8773-hero-copy"><span class="v8773-hero-tag">🌾 THỊ TRẤN OS</span><span class="v8773-hero-day" id="v8773-day">Một ngày ở quê</span><strong class="v8773-hero-time" id="v8773-time">09:41</strong><p class="v8773-hero-greeting">Một ngày bình yên đang chờ bạn khám phá! 🌿</p></div><img class="v8773-hero-mika" src="assets/images/178_mika_65bf2ec97b.webp" alt="Mika" loading="lazy">';
 home.prepend(hero);
 const dock=document.createElement('div');dock.className='v8773-dock';dock.setAttribute('aria-label','Ứng dụng thường dùng');
 for(const id of ['delivery','soppi','settings']){
  const button=document.getElementById('papp-btn-'+id);
  if(button)dock.appendChild(button);
 }
 home.insertBefore(dock,home.querySelector('.v8772-home-hint'));
 const pager=document.createElement('div');pager.className='v8773-pager';pager.textContent='●  ○  ○';pager.setAttribute('aria-hidden','true');home.appendChild(pager);
 const art=['delivery','soppi','social','progress','utility','games','bank','auction','settings'];
 function enhanceIcons(){art.forEach((id,index)=>{const icon=document.querySelector('#papp-btn-'+id+' .phone-app-icon');if(icon){icon.classList.add('v8773-art-icon');icon.style.setProperty('--v8773-icon-x',index*12.5+'%');}});}
 function updateHero(){
  const now=document.getElementById('phone-clock')?.textContent?.trim()||'09:41';
  const time=document.getElementById('v8773-time');if(time)time.textContent=now;
  const day=document.getElementById('v8773-day');
  if(day){let label='CHÀO MỪNG VỀ QUÊ';try{if(typeof gameState!=='undefined'&&gameState&&Number.isFinite(Number(gameState.day)))label='NGÀY '+gameState.day+'  ·  BỎ PHỐ VỀ QUÊ';}catch(_){}day.textContent=label;}
  modal.classList.toggle('v8773-at-home',!home.classList.contains('hidden'));
 }
 enhanceIcons();updateHero();
 // Single Phone OS core owns settings writes.
 function applyTheme(){
  const isNight=OS.getSettings().theme==='night';
  modal.classList.toggle('v8773-night',isNight);
  settings?.querySelectorAll('[data-v8773-theme]').forEach(btn=>btn.classList.toggle('selected',btn.dataset.v8773Theme===(isNight?'night':'warm')));
 }
 window.BPVQPhoneLifecycle.on('setting',applyTheme);
 applyTheme();
 const homeObserver=new MutationObserver(()=>updateHero());homeObserver.observe(home,{attributes:true,attributeFilter:['class']});
 const clock=document.getElementById('phone-clock');if(clock)new MutationObserver(()=>updateHero()).observe(clock,{childList:true,characterData:true,subtree:true});
 if(settings){
  const attachBanner=()=>{
   if(settings.classList.contains('hidden'))return;
   if(!settings.querySelector('.v8773-settings-banner')){
    const banner=document.createElement('div');banner.className='v8773-settings-banner';
    banner.innerHTML='<div><b>⚙️ Cài đặt</b><small>Thị Trấn OS · Tùy chỉnh theo ý bạn</small></div><img src="assets/images/178_mika_65bf2ec97b.webp" alt="Mika" loading="lazy">';
    settings.prepend(banner);
   }
   const wallpapers=settings.querySelector('.v8772-wallpapers');
   if(wallpapers&&!settings.querySelector('.v8773-theme-picker')){
    const picker=document.createElement('section');picker.className='v8773-theme-picker';
    picker.innerHTML=`<h4>🌤️ Chế độ giao diện</h4><div class="v8773-theme-choices"><button type="button" data-v8773-theme="warm" onclick="VillageOS.setSetting('theme','warm')"><span>☀️</span><b>Sáng Ấm</b></button><button type="button" data-v8773-theme="night" onclick="VillageOS.setSetting('theme','night')"><span>🌙</span><b>Đêm Sao</b></button></div>`;
    wallpapers.after(picker);
   }
   applyTheme();
  };
  new MutationObserver(attachBanner).observe(settings,{childList:true,attributes:true,attributeFilter:['class']});
 }
 // The registry remains the source of truth; new apps receive the existing fallback icon.
 OS.addRelease?.('v87.7.3','Anime Signature Edition: giao diện Home, bộ icon và Cài đặt mới.');
})();



/* ===== Original component: js/v8774-header-notification.js (consolidated) ===== */
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



/* ===== Original component: js/v8775-os-reborn.js (consolidated) ===== */
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
 tab=tab==='decor'?'shop':tab;
 if(!['stage','layout','inventory','shop','paint'].includes(tab))tab='stage';
 buildTab=tab;const s=state();if(!s)return;
 const stage=(Number(s.shopStage)||0)+1,project=s.shopConstruction;
 if(s.decorV88&&Number(s.decorV88.lastStage)<stage)window.BPVQDecorV88?.reconcileStage?.();
 const stageCaption=project?`🏗️ Đang thi công · dự kiến ngày ${project.finishDay}`:`Bậc ${stage}/9 · ${fmt(s.coins)} Xu`;
 for(const x of [story,decor])if(x?.parentElement===views.construction)views.construction.removeChild(x);
 const pages=[['stage','🏗️ Mở rộng'],['layout','🪑 Bố trí'],['inventory','📦 Kho nội thất'],['shop','🛍️ Cửa hàng'],['paint','🎨 Sơn Màu']];
 views.construction.innerHTML=pfx('🏗️','Xây Quán','Mở rộng · Kho Nội Thất · Bố trí theo bậc')+
 `<div class="v8775-info">${stageCaption}${project?`<br>📅 Từ ngày ${project.startedDay} tới ngày ${project.finishDay} · đã trả ${fmt(project.cost)} Xu`:''}<br>Trang trí và đặt đồ không thay đổi phí xây, Xu hoặc bonus sở hữu.</div>`+
 `<div class="v8775-tabs v88-decor-tabs">${pages.map(([id,label])=>`<button data-on="${tab===id}" onclick="BPVQReborn.constructionTab('${id}')">${label}</button>`).join('')}</div><div id="v8775-construction-content"></div>`;
 const content=$('v8775-construction-content');
 if(tab==='stage'&&story){content.appendChild(story);showGrowth('story');content.insertAdjacentHTML('afterbegin','<section id="v88-architecture-preview" class="v88-arch-preview" aria-label="Bản vẽ kiến trúc theo nghề và bậc"></section>');window.BPVQArchitectureV88?.render(document.getElementById('v88-architecture-preview'));content.insertAdjacentHTML('beforeend','<p class="v8775-help">Thuê thợ và tiến độ khánh thành dùng luật 1–3 ngày game hiện có. Bậc và +1 SP chỉ nhận khi qua đủ ngày.</p>');}
 else if(tab==='shop'&&decor){content.appendChild(decor);showGrowth('decor');}
 else if(tab==='layout'||tab==='inventory'){window.BPVQDecorV88?.render(tab,content);}
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
/* Legacy route progress -> character is now resolved centrally in openApp(). */

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



/* ===== Original component: js/v87751-admin-test.js (consolidated) ===== */
/* v87.7.5.1 — Admin Test Mode. No gameplay writes outside sandbox bridge. */
(function(){
'use strict';
const os=window.VillageOS,bridge=window.BPVQAdminBridge;
const modal=document.getElementById('modal-smartphone');
const settings=document.getElementById('phone-app-settings');
const shell=document.getElementById('phone-app-container');
const grid=document.getElementById('v8772-app-launcher');
if(!os||!bridge||!modal||!settings||!shell||!grid)return;
const PIN='VEQUE-ADMIN-2026'; // Front-end PIN is not server-side authentication.
const AUTH='bpvq:admin:authorized:';
const $=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const grants=new Set();
const validAuth=()=>{const s=bridge.info();if(!s.isTest)return false;try{return grants.has(s.profileId)||sessionStorage.getItem(AUTH+s.profileId)==='1'}catch(_){return grants.has(s.profileId)}};
const storeAuth=id=>{grants.add(id);try{sessionStorage.setItem(AUTH+id,'1')}catch(e){console.warn('[ADMIN] session storage unavailable',e)}};
let installed=false,message='';
const view=document.createElement('section');view.id='phone-app-admin';view.className='v8775-app-panel bpvq-admin-panel hidden';shell.appendChild(view);
function note(msg){message=msg;const el=$('bpvq-admin-result');if(el)el.textContent=msg;}
function installApp(){
 if(!validAuth())return;
 if(!installed){os.registerApp({id:'admin',label:'Phòng Thử Nghiệm',icon:'🧪',onHome:false,render:render});installed=true;}
 if(!$('papp-btn-admin')){
  const b=document.createElement('button');b.type='button';b.id='papp-btn-admin';b.className='v8772-app bpvq-admin-launcher';
  b.setAttribute('aria-label','Mở Phòng Thử Nghiệm');
  b.innerHTML='<span class="phone-app-icon">🧪</span><span>Thử nghiệm</span>';
  b.addEventListener('click',()=>{if(validAuth())os.open('admin')});grid.appendChild(b);
 }
}
function sync(){
 const authorized=validAuth();
 document.body.classList.toggle('bpvq-admin-test',bridge.info().isTest);
 const btn=$('papp-btn-admin');if(btn)btn.classList.toggle('hidden',!authorized);
 if(authorized)installApp();
 if(!bridge.info().isTest&&view&&!view.classList.contains('hidden'))os.home();
}
function injectCodeInput(){
 if(settings.classList.contains('hidden'))return;
 const about=settings.querySelector('.v8772-subcontent');
 if(!about||!about.textContent?.includes('Bỏ Phố Về Quê')||about.querySelector('#bpvq-admin-entry'))return;
 const card=document.createElement('section');card.id='bpvq-admin-entry';card.className='bpvq-admin-entry';
 card.innerHTML='<h4>🧪 Chế độ Admin / Test</h4><p>Nhập mã để tạo bản sao hồ sơ phục vụ kiểm thử. Mã chỉ là công cụ tiện lợi, không phải khóa bảo mật trên GitHub Pages.</p><form id="bpvq-admin-form"><label for="bpvq-admin-pin">Mã thử nghiệm</label><input id="bpvq-admin-pin" type="password" autocomplete="off" placeholder="Nhập mã Admin" required><button type="submit">Kích hoạt Phòng Thử Nghiệm</button></form><small>Hồ sơ gốc sẽ được lưu trước khi sao chép. Không tăng Xu hoặc mở khóa trong save chính.</small>';
 about.appendChild(card);
 card.querySelector('form').addEventListener('submit',ev=>{
  ev.preventDefault();const pin=$('bpvq-admin-pin');const code=pin?.value?.trim()||'';if(pin)pin.value='';
  if(code!==PIN){noteAbout('Mã chưa đúng. Vui lòng kiểm tra lại.');return;}
  const info=bridge.info();
  if(info.isTest){storeAuth(info.profileId);sync();os.open('admin');return;}
  const result=bridge.create();
  if(!result.ok){noteAbout(result.reason||'Không thể tạo hồ sơ thử nghiệm.');return;}
  storeAuth(result.id);
  if(!bridge.enter(result.id)){noteAbout('Đã tạo bản sao, nhưng không mở được. Hãy thử vào hồ sơ TEST trên màn tài khoản.');return;}
  window.closeSmartPhoneModal?.();window.openSmartPhoneModal?.();sync();os.open('admin');
 });
}
function noteAbout(text){const card=$('bpvq-admin-entry');if(!card)return;let el=card.querySelector('.bpvq-admin-error');if(!el){el=document.createElement('div');el.className='bpvq-admin-error';card.appendChild(el)}el.textContent=text;}
new MutationObserver(injectCodeInput).observe(settings,{childList:true,subtree:false,attributes:true,attributeFilter:['class']});
function btn(label,cmd,cls=''){return `<button type="button" class="bpvq-admin-action ${cls}" data-admin-command="${cmd}">${label}</button>`;}
function option(k,v,label){return `<option value="${esc(v)}" ${String(k)===String(v)?'selected':''}>${esc(label)}</option>`;}
function render(){
 sync();if(!validAuth()){view.innerHTML='<p>Vui lòng nhập mã trong Cài đặt → Về Game trước khi sử dụng.</p>';return;}
 const info=bridge.info();
 view.innerHTML=`<div class="v8775-app-heading"><span>🧪</span><div><b>Phòng Thử Nghiệm</b><small>v87.7.5.1 · Hồ sơ TEST riêng biệt</small></div></div>
 <div class="bpvq-admin-alert"><b>🔐 ĐANG DÙNG BẢN SAO SAVE</b><span>Mọi thay đổi chỉ lưu ở hồ sơ TEST <code>${esc(info.profileId)}</code>. Không có hiệu lực trên hồ sơ chính.</span></div>
 <div class="bpvq-admin-stats"><span>🎮 Lv.${info.level}</span><span>🏗️ Bậc ${info.stage}/9</span><span>🪙 ${info.coins.toLocaleString('vi-VN')}</span><span>⚡ ${info.sp} SP</span><span>📅 Ngày ${info.day}</span></div>
 <section class="bpvq-admin-group"><h3>🎮 Cấp độ & tài nguyên</h3>
 <div class="bpvq-admin-field"><label for="bpvq-admin-level">Level (1–100)</label><input id="bpvq-admin-level" inputmode="numeric" type="number" min="1" max="100" step="1" value="${info.level}">${btn('Áp dụng Level','level')}</div>
 <div class="bpvq-admin-field"><label for="bpvq-admin-stage">Bậc quán thử</label><select id="bpvq-admin-stage">${Array.from({length:9},(_,i)=>option(info.stage,String(i+1),'Bậc '+(i+1))).join('')}</select>${btn('Xem bậc này','stage')}</div>
 <div class="bpvq-admin-field"><label for="bpvq-admin-coins">Xu thử</label><input id="bpvq-admin-coins" inputmode="numeric" type="number" min="0" max="5000000" step="1000" value="${info.coins}">${btn('Cập nhật Xu','coins')}</div>
 <div class="bpvq-admin-field"><label for="bpvq-admin-sp">Điểm SP</label><input id="bpvq-admin-sp" inputmode="numeric" type="number" min="0" max="999" value="${info.sp}">${btn('Cập nhật SP','sp')}</div>
 <div class="bpvq-admin-buttons">${btn('⭐ Đánh giá 5 sao','rating')}${btn('📦 Cấp nguyên liệu ×99','inventory')}${btn('🎓 Đủ 30 đơn/3 nghề','skills')}</div></section>
 <section class="bpvq-admin-group"><h3>🔓 Nội dung đang khóa</h3><p class="bpvq-admin-hint">Chỉ vượt qua điều kiện trong hồ sơ thử; không tạo tài nguyên hoặc nhân vật chưa được lập trình.</p>
 <label class="bpvq-admin-toggle"><span><b>🍽️ Công thức và nguyên liệu</b><small>Mở công thức của nghề hiện tại, gồm công thức săn mảnh, chỉ trong TEST</small></span><input type="checkbox" data-admin-toggle="recipes" ${info.recipes?'checked':''}></label>
 <label class="bpvq-admin-toggle"><span><b>🗺️ Map Làng</b><small>Bỏ điều kiện cấp/bậc của bản đồ; câu chuyện NPC vẫn có điều kiện riêng</small></span><input type="checkbox" data-admin-toggle="maps" ${info.maps?'checked':''}></label>
 <div class="bpvq-admin-buttons">${btn('🌾 Mở đất trồng','farm')}${btn('🐄 Mở vật nuôi','barn')}</div></section>
 <section class="bpvq-admin-group"><h3>🧋 Kiểm tra ba nghề</h3>
 <div class="bpvq-admin-careers">${[['boba','🧋 Trà Sữa'],['noodle','🍜 Mì Cay'],['streetfood','🍢 Xiên Que']].map(([id,label])=>btn(label,'career:'+id,id===info.career?'selected':'')).join('')}</div><p class="bpvq-admin-hint">Chuyển nghề chỉ trong TEST; đơn đang làm bị hủy trong bản sao. Nghề hồ sơ gốc không đổi.</p></section>
 <section class="bpvq-admin-group"><h3>🕒 Thử các kịch bản</h3>${btn('🌙 Qua ngày bằng cơ chế gốc','nextday')}<p class="bpvq-admin-hint">Đi tới xác nhận Qua Ngày của game để tiền lương, công trình, thời tiết và sự kiện được xử lý đúng luật.</p></section>
 <section class="bpvq-admin-group bpvq-admin-bottom"><h3>🛡️ Quản lý hồ sơ TEST</h3>${btn('↩ Quay về hồ sơ chính','leave','primary')}${btn('⟲ Khôi phục TEST lúc mới sao chép','reset','danger')}<p class="bpvq-admin-hint">Khôi phục chỉ đặt lại bản TEST. Hồ sơ chính không bị ghi đè. Có thể xóa TEST tại màn danh sách tài khoản.</p></section>
 <div id="bpvq-admin-result" role="status" aria-live="polite">${esc(message)}</div>`;
}
view.addEventListener('change',ev=>{
 const kind=ev.target?.dataset?.adminToggle;
 if(!['recipes','maps'].includes(kind))return;
 const result=bridge.apply(kind,ev.target.checked);
 if(!result.ok){ev.target.checked=!ev.target.checked;note(result.reason||'Không thể áp dụng');return;}
 message=result.message;render();
});
view.addEventListener('click',ev=>{
 const command=ev.target.closest('[data-admin-command]')?.dataset.adminCommand;
 if(!command)return;
 if(!validAuth()){note('Bạn chưa kích hoạt mã Admin cho hồ sơ TEST này.');return;}
 if(command==='leave'){
  if(!window.confirm('Quay về hồ sơ gốc? Mọi thay đổi thử nghiệm vẫn nằm trong hồ sơ TEST riêng.'))return;
  if(!bridge.leave()){note('Không thể quay lại hồ sơ gốc. Hãy mở danh sách tài khoản để kiểm tra.');return;}
  window.closeSmartPhoneModal?.();sync();return;
 }
 if(command==='reset'){
  if(!window.confirm('Khôi phục toàn bộ hồ sơ TEST về đúng thời điểm vừa sao chép? Mọi tiến độ thử nghiệm trong TEST sẽ bị mất.'))return;
  if(!bridge.reset()){note('Không khôi phục được. Hồ sơ TEST ban đầu có thể đã bị xóa.');return;}
  window.closeSmartPhoneModal?.();window.openSmartPhoneModal?.();sync();os.open('admin');note('Đã khôi phục bản TEST.');return;
 }
 if(command==='nextday'){
  window.closeSmartPhoneModal?.();window.openEndDayModal?.();return;
 }
 let kind=command,value;
 if(command.startsWith('career:')){kind='career';value=command.slice(7)}
 else if(['level','stage','coins','sp'].includes(command))value=$('bpvq-admin-'+command)?.value;
 else value=true;
 if(kind==='career'&&!window.confirm('Thử đổi nghề trong hồ sơ TEST? Đơn đang thực hiện sẽ được xóa trong bản sao.'))return;
 if(kind==='stage'&&!window.confirm('Mô phỏng bậc quán trực tiếp trên TEST? Bỏ qua thi công, phí và thưởng SP để kiểm tra tính năng khóa.'))return;
 const result=bridge.apply(kind,value);
 if(!result.ok){note(result.reason||'Lệnh không thành công');return}
 message=result.message;render();
});
window.BPVQPhoneLifecycle.on('open',sync);
if(bridge.info().isTest)sync();
os.addRelease?.('v87.7.5.1','Phòng Thử Nghiệm có mã kích hoạt, tạo bản sao hồ sơ, chỉnh cấp/SP/Xu/bậc và mô phỏng nội dung khóa mà không sửa save chính.');
})();



/* ===== Original component: js/v8776-swipe-notifications.js (consolidated) ===== */
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



/* ===== Original component: js/v8777-phone-premium.js (consolidated) ===== */
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
 window.BPVQPhoneLifecycle.on('open',queueIcons);
 os.addRelease?.('v87.7.7','Phone UI Premium: bộ icon minh họa đồng bộ, 6 hình nền, lựa chọn vuốt ngang/cuộn dọc và hiệu ứng nền trong Cài đặt.');
 window.BPVQPhonePremium={refreshIcons,icons:[...iconSet]};
})();



/* ===== Original component: js/v87771-phone-repair.js (consolidated) ===== */
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
 window.BPVQPhoneLifecycle.on('open',()=>{schedule();checkWallpaper();});
 window.BPVQPhoneRepair={getStatus:()=>Object.fromEntries(status),check:()=>{decorate();checkWallpaper();}};
})();


/* ===== Original component: js/v87772-phone-weather-wallpaper.js (consolidated) ===== */
/* Bỏ Phố Về Quê v87.7.7.2 — Phone Home polish.
 * Presentation only: weather comes from the existing dailyWorldEvent; no game state changes.
 * A foreground wallpaper DOM layer works around z-index:-1 pseudo-element masking.
 */
(function(){
 'use strict';
 const modal=document.getElementById('modal-smartphone');
 const home=document.getElementById('phone-app-home');
 const os=window.VillageOS;
 if(!modal||!home||!os)return;
 modal.classList.add('v87772-home-polish');
 const wallpaperFiles=new Set(['village','night','rice','market','festival','gradient']);
 const layer=document.createElement('div');
 layer.className='v87772-wallpaper-layer';layer.setAttribute('aria-hidden','true');
 home.insertBefore(layer,home.firstChild);
 let desiredWallpaper='',loadEpoch=0;
 const wallpaperGradient='linear-gradient(180deg,rgba(9,23,28,.13) 0%,rgba(9,23,28,.18) 37%,rgba(8,24,30,.52) 100%)';
 function showWallpaper(){
  let requested='village';
  try{requested=os.getSettings()?.wallpaper||'village';}catch(e){/* storage unavailable: use safe default */}
  const id=wallpaperFiles.has(requested)?requested:'village';
  if(desiredWallpaper===id)return;
  desiredWallpaper=id;
  const myEpoch=++loadEpoch;
  const src=`assets/images/phone/wallpapers/${id}.webp`;
  const probe=new Image();
  probe.onload=()=>{
   if(myEpoch!==loadEpoch)return;
   layer.style.backgroundImage=`${wallpaperGradient},url("${src}")`;
   layer.classList.add('v87772-wallpaper-loaded');
   layer.classList.remove('v87772-wallpaper-error');
   home.dataset.v87772Wallpaper=id;
  };
  probe.onerror=()=>{
   if(myEpoch!==loadEpoch)return;
   layer.style.backgroundImage='';
   layer.classList.remove('v87772-wallpaper-loaded');
   layer.classList.add('v87772-wallpaper-error');
   home.dataset.v87772Wallpaper='fallback';
  };
  probe.src=src;
 }
 // Day-specific original verses: deliberately not presented as traditional folk citations.
 const weatherVerses={
  sunny_day:{label:'Nắng đẹp',icon:'☀️',verses:[
   'Nắng hong mái ngói đầu làng, một ngày buôn bán rộn ràng tiếng vui.',
   'Nắng vàng trải nhẹ sân quê, mở hàng một sớm, lòng nghe an lành.',
   'Trời quang, gió mát hiên nhà, đường làng thêm bước, quán ta thêm cười.']},
  hot_day:{label:'Nắng nóng',icon:'🌞',verses:[
   'Nắng lên rực cả vườn nhà, nhớ ly nước mát, ghé qua nghỉ hè.',
   'Giữa trưa nắng đậu đầu thềm, bát chè mát lạnh dịu êm một ngày.',
   'Nắng hong con ngõ vàng ươm, tìm nơi bóng mát, nghe hương quê nhà.']},
  light_rain:{label:'Mưa nhẹ',icon:'🌦️',verses:[
   'Mưa giăng lất phất hiên nhà, ấm trà vừa rót, chuyện xa hóa gần.',
   'Mưa rơi nhẹ khắp lối quê, ghé hiên một chút, nghe về chuyện xưa.',
   'Hạt mưa tưới mát vườn rau, quán quê thơm bếp, bên nhau ấm lòng.']},
  heavy_rain:{label:'Mưa lớn',icon:'🌧️',verses:[
   'Mưa đầy mái lá ngoài sân, bếp hồng hong ấm những lần ghé qua.',
   'Mưa rào gõ cửa thật mau, vào hiên trú một lát, chờ trời lại trong.',
   'Ngoài trời mưa đổ trắng sân, bên hiên quán nhỏ vẫn gần tiếng vui.']},
  storm_day:{label:'Mưa giông',icon:'⛈️',verses:[
   'Giông về lay ngọn tre non, khép hiên giữ ấm, đợi cơn mưa tàn.',
   'Gió đưa mây xám qua làng, trong nhà nhóm bếp, nhẹ nhàng đợi yên.',
   'Trời giông rồi cũng sẽ qua, mai xanh nắng mới, vườn nhà lại vui.']},
  cold_day:{label:'Trở lạnh',icon:'🍃',verses:[
   'Gió về se sắt hàng cau, món ngon còn nóng, mời nhau ghé ngồi.',
   'Trời se bên mái hiên quê, chén canh ấm bụng, lối về bớt xa.',
   'Gió len qua ngõ chiều sang, bếp thơm một góc, lòng càng thấy vui.']},
  cloudy_day:{label:'Nhiều mây',icon:'☁️',verses:[
   'Mây qua đỉnh núi la đà, bình yên ở lại trong nhà, ngoài sân.',
   'Mây che nắng gắt ngoài đồng, thảnh thơi một chút, nghe lòng nhẹ tênh.',
   'Mây trôi chầm chậm ngang trời, quán quê cứ thế đón người ghé thăm.']}
 };
 const unknownWeather={label:'Đang chờ dự báo',icon:'🌿',verses:['Mỗi ngày một chút an nhiên, chờ trời lên tiếng, chờ miền quê vui.']};
 const card=document.createElement('section');
 card.id='v87772-weather-card';card.className='v87772-weather-card';
 card.setAttribute('aria-label','Dự báo hôm nay');
 card.innerHTML='<span class="v87772-weather-sprig" aria-hidden="true">❀</span><div class="v87772-weather-top"><span class="v87772-weather-icon" aria-hidden="true">🌿</span><div class="v87772-weather-meta"><span class="v87772-weather-eyebrow">DỰ BÁO HÔM NAY</span><b class="v87772-weather-label">Đang chờ dự báo</b></div><span class="v87772-weather-leaf" aria-hidden="true">✿</span></div><p class="v87772-weather-verse"></p>';
 const title=document.getElementById('v8776-page-title');
 if(title&&title.parentElement===home)title.after(card);
 else home.querySelector('.v8773-hero')?.after(card);
 let lastWeatherKey='';
 function getDayWeather(){
  try{
   const state=(typeof gameState==='object'&&gameState)||null;
   const day=Number(state?.day)||1;
   const event=state?.dailyWorldEvent;
   const id=event&&Number(event.day)===day?String(event.id||''):'';
   return {day,id};
  }catch(e){return {day:1,id:''}}
 }
 function refreshWeather(){
  const {day,id}=getDayWeather();
  const key=day+'|'+id;
  if(key!==lastWeatherKey){
   lastWeatherKey=key;
   const data=weatherVerses[id]||unknownWeather;
   card.querySelector('.v87772-weather-icon').textContent=data.icon;
   card.querySelector('.v87772-weather-label').textContent=data.label;
   card.querySelector('.v87772-weather-verse').textContent=data.verses[(Math.max(1,day)-1)%data.verses.length];
  }
  const page=window.BPVQSwipeOS?.getPage?.()??0;
  card.classList.toggle('hidden',page!==0);
 }
 function sync(){showWallpaper();refreshWeather()}
 window.BPVQPhoneLifecycle.on('setting',(key)=>{if(key==='wallpaper')showWallpaper();});
 window.BPVQPhoneLifecycle.on('home',sync);
 if(title)new MutationObserver(refreshWeather).observe(title,{childList:true,characterData:true,subtree:true});
 const dayTag=document.getElementById('header-day-tag');
 if(dayTag)new MutationObserver(refreshWeather).observe(dayTag,{childList:true,characterData:true,subtree:true});
 // Game sometimes sets daily weather before or after day label; refreshing on focus avoids stale copy.
 modal.addEventListener('pointerdown',refreshWeather,{passive:true});
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)sync()});
 sync();
 window.BPVQPhoneWeatherV87772={sync,getWeather:()=>({ ...getDayWeather(), label:card.querySelector('.v87772-weather-label').textContent,verse:card.querySelector('.v87772-weather-verse').textContent }),getWallpaper:()=>home.dataset.v87772Wallpaper};
 os.addRelease?.('v87.7.7.2','Sửa lớp hình nền Home, đồng bộ dock và thêm thẻ dự báo thời tiết với câu thơ nông thôn ngắn.');
})();


/* === BPVQ v88 / Xây Quán 2.0: owned decor inventory + slot placement ===
 * No new merchandise and no modification to existing decoration bonuses.
 * Source of truth for ownership remains gameState.decorations.
 * S1/S2 are system slots; 22 other slots are player-customizable.
 */
(function(w){
 'use strict';
 const SLOT_SPEC=[
  ['S1','Biển tên quán',1,'system'],['S2','Huy hiệu quán',2,'system'],
  ['S3','Biển phía trước',3,'banner'],['S4','Bảng mái trang trí',4,'banner'],
  ['S5','Quầy chính',1,'counter'],['S6','Kệ trên quầy',1,'counter'],
  ['S7','Góc quầy',2,'counter'],['S8','Kệ treo trên',1,'shelf-top'],
  ['S9','Kệ trưng bày',2,'shelf-top'],['S10','Kệ trên mở rộng',4,'shelf-top'],
  ['S11','Kệ dưới',1,'shelf-low'],['S12','Góc kệ dưới',4,'shelf-low'],
  ['S13','Kệ dưới mở rộng',6,'shelf-low'],['S14','Góc sân',1,'ground'],
  ['S15','Lối vào',3,'ground'],['S16','Sân vườn',5,'ground'],
  ['S17','Góc tiểu cảnh',7,'ground'],['S18','Bàn ghế khách',5,'seating'],
  ['S19','Bàn ghế mở rộng',6,'seating'],['S20','Đèn sân vườn',7,'lamp'],
  ['S21','Khu VIP',8,'vip'],['S22','Tường thành tựu',8,'display'],
  ['S23','Linh vật cao cấp',9,'mascot'],['S24','Cổng lễ hội',9,'festival']
 ].map(([id,name,tier,kind])=>Object.freeze({id,name,tier,kind}));
 const SPEC=Object.freeze(Object.fromEntries(SLOT_SPEC.map(x=>[x.id,x])));
 const ALLOW=Object.freeze({
   welcome_sign:['S5','S6','S3','S4'],
   flower_corner:['S14','S15','S16','S17'],
   warm_lights:['S8','S9','S20','S24'],
   lucky_bamboo:['S11','S12','S14','S15'],
   menu_board:['S5','S7','S9','S3'],
   cat:['S11','S12','S13'],
   music_corner:['S6','S7','S9'],
   neon_sign:['S3','S4'],
   aquarium:['S12','S13','S16'],
   wood_furniture:['S18','S19'],
   koi_corner:['S16','S17'],
   stone_counter:['S5'],
   vip_room:['S21'],
   heritage_wall:['S22']
 });
 // Counter stone is one purchased item occupying 3 adjacent logical slots.
 const FOOTPRINT=Object.freeze({stone_counter:['S5','S6','S7']});
 const esc=v=>String(v??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
 const state=()=>typeof gameState==='object'&&gameState?gameState:null;
 const catalog=()=>typeof SHOP_DECOR_CONFIG==='object'?SHOP_DECOR_CONFIG:{};
 const level=s=>Math.max(1,Math.min(9,Math.floor(Number(s?.shopStage)||0)+1));
 const owned=s=>new Set(Array.isArray(s?.decorations)?s.decorations.filter(x=>typeof x==='string'&&catalog()[x]):[]);
 const raw=s=>(s?.decorV88?.placements&&typeof s.decorV88.placements==='object'&&!Array.isArray(s.decorV88.placements))?s.decorV88.placements:{};
 const footprint=(id,slot)=>FOOTPRINT[id]||[slot];
 function project(s){
   const entries=Object.entries(raw(s));const items=owned(s);
   const active={},occupied={},stored=new Set(items);
   // Preserve earlier valid assignments by canonical order. No duplicate, phantom or bonus mutation.
   for(const [slot,id] of entries){
     if(!SPEC[slot]||!items.has(id)||!ALLOW[id]?.includes(slot)||stored.has(id)===false)continue;
     const footprintSlots=footprint(id,slot);
     if(footprintSlots.some(k=>SPEC[k].tier>level(s)||occupied[k]))continue;
     active[slot]=id;
     for(const k of footprintSlots)occupied[k]=slot;
     stored.delete(id);
   }
   return {active,occupied,stored:[...stored],tier:level(s)};
 }
 function persist(s,next){
   const old=s.decorV88;
   s.decorV88={schema:1,placements:next,lastStage:level(s)};
   try {
     if(typeof saveGameToStorage!=='function'||saveGameToStorage(false)!==true){
       if(old===undefined)delete s.decorV88;else s.decorV88=old;
       return {ok:false,message:'Không thể lưu vị trí. Vui lòng kiểm tra hồ sơ và bộ nhớ.'};
     }
   }catch(e){if(old===undefined)delete s.decorV88;else s.decorV88=old;return {ok:false,message:'Lỗi lưu vị trí: '+String(e.message||e)}}
   return {ok:true};
 }
 function place(s,id,slot){
   if(!s||!catalog()[id]||!SPEC[slot])return {ok:false,message:'Vật phẩm hoặc ô không hợp lệ.'};
   if(!owned(s).has(id))return {ok:false,message:'Bạn chưa sở hữu nội thất này.'};
   if(SPEC[slot].kind==='system'||SPEC[slot].tier>level(s))return {ok:false,message:'Ô này chưa mở hoặc thuộc hệ thống.'};
   if(!ALLOW[id]?.includes(slot))return {ok:false,message:'Món này không phù hợp vị trí đã chọn.'};
   const before=project(s),next={...raw(s)};
   // A purchased ID represents exactly one owned piece across all slots.
   for(const [oldSlot,oldId] of Object.entries(next))if(oldId===id)delete next[oldSlot];
   const footprints=footprint(id,slot);
   for(const k of footprints){
     if(SPEC[k].tier>level(s))return {ok:false,message:'Cần nâng bậc để đặt trọn bộ nội thất.'};
     const occupyingAnchor=before.occupied[k];
     if(occupyingAnchor&&raw(s)[occupyingAnchor]!==id)return {ok:false,message:'Ô '+k+' đã có nội thất. Hãy cất món đó trước.'};
   }
   if(next[slot]&&next[slot]!==id)return {ok:false,message:'Ô này đang có món khác.'};
   next[slot]=id;
   return persist(s,next);
 }
 function store(s,slot){
   if(!s||!Object.hasOwn(raw(s),slot))return {ok:false,message:'Ô này không có đồ cần cất.'};
   const next={...raw(s)};delete next[slot];
   return persist(s,next);
 }
 function transfer(s){
   if(!s)return {ok:false};
   // Tier upgrades preserve every valid logical slot. Layout is normalized only
   // when a conflict is encountered; no silent overwrite of historic mappings.
   const placed=project(s),orig=raw(s);
   const unchanged=Object.keys(orig).length===Object.keys(placed.active).length&&
     Object.entries(orig).every(([k,v])=>placed.active[k]===v);
   if(unchanged){
     if(s.decorV88&&Number(s.decorV88.lastStage)!==level(s)){
       const result=persist(s,{...orig});return {...result,changed:false};
     }
     return {ok:true,changed:false};
   }
   const next={...placed.active},busy=new Set(Object.keys(placed.occupied));
   const preserve=[...new Set(Object.values(orig).filter(x=>owned(s).has(x)))];
   for(const id of preserve){
     if(Object.values(next).includes(id))continue;
     const candidate=(ALLOW[id]||[]).find(slot=>{
       if(SPEC[slot].tier>level(s)||SPEC[slot].kind==='system')return false;
       return footprint(id,slot).every(k=>!busy.has(k)&&SPEC[k].tier<=level(s));
     });
     if(candidate){next[candidate]=id;for(const k of footprint(id,candidate))busy.add(k)}
   }
   // Invalid entries remain stored as ownership, never deleted from decorations.
   const result=persist(s,next);
   return {...result,changed:result.ok};
 }
 let selected='';
 let view='layout';
 const notify=(msg,success)=>{if(typeof showToast==='function')showToast(msg,success?'🪴':'⚠️')};
 function rerender(){const host=document.getElementById('v8775-construction-content');if(host)render(view,host)}
 const api={
  slots:()=>SLOT_SPEC.slice(),compatibility:id=>(ALLOW[id]||[]).slice(),snapshot:()=>{const s=state();return s?project(s):null},
  place:(id,slot)=>place(state(),id,slot),store:slot=>store(state(),slot),
  reconcileStage:()=>transfer(state()),
  choose(id){const s=state();if(!s||!owned(s).has(id))return notify('Chưa sở hữu món này.',false);
   selected=id;w.BPVQReborn?.constructionTab('layout');},
  chooseSlot(slot){
   const s=state();if(!s)return;
   if(!selected)return notify('Hãy chọn một món từ Kho Nội Thất trước.',false);
   const result=place(s,selected,slot);
   notify(result.ok?'Đã đặt nội thất vào '+slot+'.':result.message,result.ok);
   if(result.ok){selected='';rerender();}
  },
  putAway(slot){const result=store(state(),slot);notify(result.ok?'Đã cất nội thất vào Kho.':result.message,result.ok);if(result.ok)rerender()},
  showShop(){w.BPVQReborn?.constructionTab('shop')},
  render(which,host){
   const s=state();if(!s||!host)return;
   view=which;const data=project(s),ownedIds=owned(s),conf=catalog();
   const current=level(s),filled=Object.keys(data.active).length,unlocked=SLOT_SPEC.filter(v=>v.tier<=current);
   if(which==='inventory'){
    const ids=Object.keys(ALLOW);host.innerHTML=
    `<div class="v88-decor-summary">📦 <b>Kho Nội Thất</b> · ${ownedIds.size}/14 món sở hữu<br><small>Đồ cất vẫn giữ buff theo quyền sở hữu như game hiện tại.</small></div>`+
    `<div class="v88-decor-items">`+ids.map(id=>{
      const c=conf[id],have=ownedIds.has(id),anchor=Object.entries(data.active).find(([,i])=>i===id)?.[0];
      const unlockedItem=current>=((Number(c.reqStage)||0)+1)&&(Number(s.level)||1)>=(Number(c.reqLevel)||1);
      const status=have?(anchor?'Đang dùng · '+anchor:'Đã sở hữu · Đang cất'):(unlockedItem?'Chưa mua':'Chưa mở');
      return `<div class="v88-decor-item ${have?'v88-owned':''}"><span class="v88-decor-icon">${esc(c.icon)}</span><div><b>${esc(c.name)}</b><small>${esc(status)}</small><small>${esc(c.desc||'')}</small></div><button type="button" ${have?'':'disabled'} onclick="BPVQDecorV88.choose('${id}')">${have?'Bố trí':'🔒'}</button></div>`;
    }).join('')+`</div><button type="button" class="v88-decor-footer" onclick="BPVQDecorV88.showShop()">🛍️ Tới cửa hàng trang trí</button>`;
   }else{
    const selectedLabel=selected&&conf[selected]?conf[selected].name:'Chưa chọn món nào';
    host.innerHTML=`<div class="v88-decor-summary"><b>🏠 Bố trí Bậc ${current}/9</b> · ${unlocked.length}/24 ô mở · ${filled} món đang trưng bày<br><small>${selected?'Đang chọn: '+esc(selectedLabel)+' — chạm một ô phù hợp để đặt':'Chọn món trong Kho rồi chạm vào ô muốn đặt'}</small></div>`+
    `<div class="v88-decor-action-row"><button type="button" onclick="BPVQReborn.constructionTab('inventory')">📦 Chọn nội thất</button><button type="button" onclick="BPVQDecorV88.realign()">↻ Kiểm tra chuyển đồ</button></div>`+
    `<div class="v88-decor-slots">`+SLOT_SPEC.map(slot=>{
      const open=slot.tier<=current,id=data.active[slot.id],reserved=data.occupied[slot.id]&&!id,sys=slot.kind==='system';
      const icon=sys?(slot.id==='S1'?'🪧':'🏅'):id?conf[id]?.icon||'🪑':reserved?'💎':open?'＋':'🔒';
      const contents=sys?(slot.id==='S1'?(s.shopName||'Tên quán'):('Huy hiệu · '+(s.shopAvatar||'quán'))) : id?conf[id]?.name : reserved?'Thuộc bộ quầy đá':open?'Ô trống':'Mở ở bậc '+slot.tier;
      const canTarget=!!selected&&open&&!sys&&!reserved&&ALLOW[selected]?.includes(slot.id);
      return `<div class="v88-decor-slot ${!open?'v88-locked':''} ${sys?'v88-system':''} ${id?'v88-filled':''} ${canTarget?'v88-target':''}">
       <button type="button" ${!canTarget?'disabled':''} onclick="BPVQDecorV88.chooseSlot('${slot.id}')"><b>${slot.id}</b><span>${esc(icon)}</span><small>${esc(slot.name)}</small><em>${esc(contents)}</em></button>
       ${id?`<button class="v88-decor-store" type="button" onclick="BPVQDecorV88.putAway('${slot.id}')">Cất vào kho</button>`:''}
      </div>`;
    }).join('')+`</div><div class="v88-decor-hint">S1–S2 là hệ thống. S4 là bảng mái, không phải vị trí đặt bàn. Quầy Đá chiếm S5–S7. Hình slot hiện là sơ đồ tương tác; sprite và điểm neo theo 27 công trình sẽ tích hợp ở đợt mỹ thuật.</div>`;
   }
  },
  realign(){const result=transfer(state());notify(result.ok?(result.changed?'Đã chuyển các món phù hợp, phần còn lại trong Kho.':'Bố trí đang hợp lệ, không mất món nào.'):result.message,result.ok);if(result.ok)rerender()}
 };
 w.BPVQDecorV88=Object.freeze(api);
})(window);

// === DUDU v88: data-driven architecture catalog — 3 careers × 9 stages (27 shells).
// Reference-blueprint descriptions only. Approved art/architecture is NOT regenerated,
// and all 24 decor slot IDs retain their original contracts. No save/economy mutation.
(function(w){
 'use strict';
 const CAREERS=Object.freeze({
  boba:Object.freeze({name:'Trà Sữa',icon:'🧋',color:'trà sữa',area:'Khu lắc trà · kệ topping · quầy giao ly',
   signs:Object.freeze(['TRÀ SỮA Nhà Mình','TRÀ SỮA Đặc Sản'])}),
  noodle:Object.freeze({name:'Mì Cay',icon:'🍜',color:'gạch đỏ và gỗ ấm',area:'Trạm nước cốt · nồi mì · quầy topping',
   signs:Object.freeze(['MÌ CAY Nhà Mình','MÌ CAY Đặc Sản'])}),
  streetfood:Object.freeze({name:'Xiên Que',icon:'🍢',color:'tre và đèn hội chợ',area:'Bếp nướng · kệ xiên · bàn nước chấm',
   signs:Object.freeze(['XIÊN QUE Nhà Mình','XIÊN QUE Đặc Sản'])})
 });
 const TIERS=Object.freeze([
  {name:'Quầy Khởi Nghiệp',shape:'Xe đẩy hai bánh, dù màu kem',roof:'Dù vải, không có nhà xây',yard:'Góc sân nhỏ sát quầy',notes:'Giữ dáng xe đẩy 2 bánh. Không được dựng nhà ở B1.'},
  {name:'Quán Nhỏ Có Mái',shape:'Quầy cố định có mái che',roof:'Mái nhỏ một tầng',yard:'Lối khách đứng chờ',notes:'Chuyển từ xe đẩy sang quầy cố định; chưa phải nhà hàng.'},
  {name:'Tiệm Đông Khách',shape:'Tiệm gỗ mở mặt tiền',roof:'Mái tiệm gỗ đơn',yard:'Góc biển hiệu và chậu cây',notes:'Thêm mặt tiền, biển hiệu nhưng không làm hai tầng.'},
  {name:'Quán Ăn Gia Đình',shape:'Quán một phòng ấm cúng',roof:'Mái một tầng đơn giản',yard:'Góc bàn gia đình',notes:'Giữ cảm giác quán gia đình gần gũi.'},
  {name:'Nhà Hàng Làng Quê',shape:'Nhà hàng một tầng mở rộng, có hiên',roof:'Mái ngói đỏ làng quê',yard:'Sân trước và hiên rộng',notes:'Không biến B5 thành nhà hai tầng; có sân và mái đỏ.'},
  {name:'Nhà Hàng Phố Huyện',shape:'Tiệm phố huyện có gác lửng một phần',roof:'Phố huyện, gác lửng không phủ kín',yard:'Lối khách thị trấn',notes:'Chỉ gác lửng một phần, chưa phải nhà hai tầng hoàn chỉnh.'},
  {name:'Nhà Hàng Sân Vườn',shape:'Một nhà chính hai tầng, cầu thang bên ngoài',roof:'Mái nhà chính hai tầng và ban công',yard:'Vườn rộng quanh nhà và lối lên tầng',notes:'B7 chỉ có MỘT nhà chính; S17 tránh cầu thang, S20 gắn dầm, không đặt đèn lên ban công.'},
  {name:'Trung Tâm Ẩm Thực Quê',shape:'Ba khối nhà tạo sân mở hình chữ U',roof:'Mái ba khối riêng ôm sân trung tâm',yard:'Sân U; cánh trái VIP và tường thành tựu trung tâm',notes:'B8 có BA công trình ôm sân chữ U, quy mô vừa, nhỏ hơn rõ rệt so với B9.'},
  {name:'Thương Hiệu Đặc Sản',shape:'Công trình hoành tráng cân xứng: sảnh giữa và hai cánh',roof:'Mái xanh than/xanh đen theo hình B9 đã duyệt',yard:'Quảng trường nước, đèn lồng và ánh hoàng hôn',notes:'Bảo toàn kiến trúc B9 đã duyệt: hai cánh cân xứng, khối trung tâm, quảng trường nước. Không thiết kế lại.'}
 ].map((item,index)=>Object.freeze({...item,tier:index+1})));
 const CAREER_FEATURES=Object.freeze({
  boba:Object.freeze([
   'Xe trà sữa, thùng đá và ly mang đi','Kệ trân châu dưới mái mới','Biển trà sữa và góc pha lắc','Bàn uống trà cùng gia đình','Hiên trà sữa, góc bánh và topping','Quầy thức uống nhìn xuống phố','Quầy trà sữa ở tầng trệt; ban công dành khách','Cánh khu trải nghiệm trà và góc check-in','Sảnh trà sữa trung tâm, biển “TRÀ SỮA Đặc Sản”']),
  noodle:Object.freeze([
   'Xe mì cay với nồi nước cốt','Quầy mì, hơi nước dưới mái che','Tủ topping nấm, cá và thịt','Góc ăn mì cay gia đình','Hiên ăn mì và bàn gia vị','Trạm nước cốt lớn cạnh gác lửng','Bếp mì tầng trệt; ban công khách nhìn vườn','Cánh nồi lẩu và gian gia vị; sân U thoáng','Sảnh Mì Cay Đặc Sản giữ nguyên tỷ lệ kiến trúc B9']),
  streetfood:Object.freeze([
   'Xe xiên que với vỉ nướng nhỏ','Mái quầy nướng và hộp nước chấm','Kệ xiên, than và bàn gọi món','Góc ăn xiên của cả nhà','Hiên nướng và bàn khách ngoài sân','Quầy nướng phố huyện dưới gác lửng','Bếp xiên tầng trệt, vườn ăn tối','Ba gian: vỉ nướng, quầy sốt, sân thưởng thức','Sảnh Xiên Que Đặc Sản giữ nguyên tỷ lệ kiến trúc B9'])
 });
 const ALL=Object.freeze(Object.keys(CAREERS).flatMap(career=>TIERS.map((tier,index)=>Object.freeze({
  id:career+'-b'+(index+1),career,stage:index+1,title:tier.name,shape:tier.shape,roof:tier.roof,
  yard:tier.yard,notes:tier.notes,feature:CAREER_FEATURES[career][index],
  sign:index===8?CAREERS[career].signs[1]:CAREERS[career].signs[0],
  assetStatus:'pending-approved-art'
 }))));
 const INDEX=new Map(ALL.map(item=>[item.id,item]));
 const esc=x=>String(x??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
 const find=(career,stage)=>INDEX.get(career+'-b'+stage)||null;
 let selected=0; // 0 = current tier; never stored in game save.
 const current=()=>typeof gameState==='object'&&gameState?gameState:null;
 function render(target){
  const root=target||document.getElementById('v88-architecture-preview');
  const s=current();if(!root||!s)return false;
  const career=CAREERS[s.currentCareer]?s.currentCareer:'boba';
  const tier=Math.max(1,Math.min(9,Math.floor(Number(s.shopStage)||0)+1));
  const chosen=Math.max(1,Math.min(9,selected||tier));
  const item=find(career,chosen),meta=CAREERS[career];
  if(!item)return false;
  const slots=typeof w.BPVQDecorV88?.slots==='function'?w.BPVQDecorV88.slots().filter(x=>x.tier<=chosen):[];
  const customizable=slots.filter(x=>x.kind!=='system').length;
  // The scene registry is data-only and refuses to display unapproved/missing artwork.
  const scene=w.BPVQShopScenesV88?.get(career,chosen);
  const artProgress=w.BPVQShopScenesV88?.diagnostics?.();
  const placed=w.BPVQDecorV88?.snapshot?.()?.active||{};
  const sceneMarkup=scene?.isReady
    ? `<figure class="v88-arch-scene"><img src="${esc(scene.artwork)}" alt="Kiến trúc ${esc(item.title)} · ${esc(meta.name)}" loading="lazy">${Object.entries(scene.anchors).map(([slot,pin])=>`<span class="v88-arch-anchor ${chosen===tier&&placed[slot]?'v88-arch-occupied':''}" title="${esc(slot)}" style="left:${pin.x*100}%;top:${pin.y*100}%;z-index:${pin.layer}">${esc(slot)}</span>`).join('')}<figcaption>Ảnh shell đã duyệt · anchor đo riêng cho B${chosen}</figcaption></figure>`
    : `<div class="v88-arch-art-pending" role="status">🖼️ Chưa có ảnh shell sạch được duyệt cho ${esc(meta.name)} B${chosen}<small>${artProgress?.ready||0}/27 ảnh đạt hợp đồng xuất bản · Không lấy ảnh cắt từ concept làm nền</small></div>`;
  root.innerHTML=`<details class="v88-arch-fold">
    <summary><span>🏡 Bản vẽ quán theo nghề</span><small>${esc(meta.icon)} ${esc(meta.name)} · B${tier}/9 · 27 mẫu kế hoạch</small></summary>
    <div class="v88-arch-body">
      <p class="v88-arch-hint">Bản vẽ tham chiếu trước khi gắn ảnh. Chỉ xem kiến trúc — không mở khóa, mua hay thay đổi save.</p>
      <div class="v88-arch-tiers" role="group" aria-label="Xem bản vẽ bậc quán">${TIERS.map(t=>`<button type="button" class="${t.tier===chosen?'active':''}" aria-pressed="${t.tier===chosen}" onclick="BPVQArchitectureV88.select(${t.tier})">B${t.tier}${t.tier>tier?' 🔒':''}</button>`).join('')}</div>
      <article class="v88-arch-card">
        <b>${esc(meta.icon)} ${esc(item.title)} — ${esc(meta.name)}</b>
        ${sceneMarkup}
        <p>${esc(item.feature)}</p>
        <dl><div><dt>Kiến trúc</dt><dd>${esc(item.shape)}</dd></div><div><dt>Mái</dt><dd>${esc(item.roof)}</dd></div><div><dt>Sân / ngoại cảnh</dt><dd>${esc(item.yard)}</dd></div><div><dt>Quầy nghề</dt><dd>${esc(meta.area)}</dd></div><div><dt>Vị trí decor</dt><dd>${slots.length} slot đã mở ở B${chosen}, ${customizable} slot tùy biến</dd></div></dl>
        <p class="v88-arch-note">⚠️ ${esc(item.notes)}</p><small>${scene?.isReady?'Điểm neo hiển thị theo shell đã duyệt.':'Ảnh công trình và điểm neo sprite chưa tích hợp.'} Không thay thế thiết kế B9 đã duyệt.</small>
      </article>
    </div></details>`;
  return true;
 }
 w.BPVQArchitectureV88=Object.freeze({
  all:()=>ALL.slice(),
  get:(career,stage)=>find(career,stage),
  careers:()=>Object.keys(CAREERS),
  stages:()=>TIERS.slice(),
  render,
  select(stage){const n=Number(stage);if(!Number.isInteger(n)||n<1||n>9)return false;selected=n;
   const root=document.getElementById('v88-architecture-preview');const wasOpen=!!root?.querySelector('details')?.open;
   const result=render(root);const fold=root?.querySelector('details');if(fold)fold.open=wasOpen;return result;},
  reset(){selected=0}
 });
})(window);
