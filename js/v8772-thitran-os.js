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
  {id:'village',name:'Làng quê bình minh',url:'assets/images/171_district_c9caae315d.webp',position:'center center'},
  {id:'rice',name:'Cánh đồng lúa',url:'assets/images/164_ricefield_8ead750201.webp',position:'center center'},
  {id:'hill',name:'Đồi Sim chiều tà',url:'assets/images/169_hill_cf71b959cf.webp',position:'center center'},
  {id:'night',name:'Phố Đèn về đêm',url:'assets/images/170_nightmarket_af737a4f0a.webp',position:'center center'},
  {id:'river',name:'Bến sông bình yên',url:'assets/images/165_riverside_a3cec0c03c.webp',position:'center center'}
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
 const defaults={sound:true,volume:80,reducedMotion:false,wallpaper:'village',mikaMode:'explore',largeText:false};
 function read(key){try{const v=JSON.parse(localStorage.getItem(key)||'null');return v&&typeof v==='object'&&!Array.isArray(v)?v:{}}catch(e){return {}}}
 function getSettings(){return {...defaults,...read(globalKey),...read(profileKey())};}
 function setSetting(name,value){
  const scope=['sound','volume','reducedMotion','largeText'].includes(name)?globalKey:profileKey();
  const obj=read(scope);obj[name]=value;
  try{localStorage.setItem(scope,JSON.stringify(obj))}catch(e){console.warn('[TownOS] Cannot save preference',e)}
  applySettings();if(current==='settings')renderSettings();
 }
 function applySettings(){
  const st=getSettings();
  modal.classList.toggle('v8772-reduce-motion',!!st.reducedMotion);
  modal.classList.toggle('v8772-large-text',!!st.largeText);
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
  applySettings();return true;
 }
 function openApp(id,record=true){
  if(id==='home')return homeScreen();
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
 window.openSmartPhoneModal=function(...args){const result=originalOpen.apply(this,args);homeScreen();return result;};
 if(typeof originalClose==='function')window.closeSmartPhoneModal=function(...args){navigation=['home'];current='home';return originalClose.apply(this,args)};
 // One shared adapter for any future app - registerApp({id,label,icon,render,unlocked}).
 window.VillageOS={registerApp,open:openApp,home:homeScreen,back,close:()=>window.closeSmartPhoneModal(),getSettings,setSetting,listApps:()=>[...apps.values()]};
 function row(icon,label,desc,inner){return `<div class="v8772-setting-row"><span class="v8772-setting-icon">${icon}</span><span class="v8772-setting-copy"><b>${label}</b><small>${desc}</small></span>${inner||''}</div>`}
 function esc(txt){return String(txt||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));}
 function btn(id,emoji,titleText,desc){return `<button class="v8772-setting-category" onclick="VillageOS.settings('${id}')"><span>${emoji}</span><span><b>${titleText}</b><small>${desc}</small></span><span>›</span></button>`;}
 function renderSettings(){
  const s=getSettings();const view=inSettings;
  if(view==='root')settingsPanel.innerHTML=`<div class="v8772-settings-title">⚙️ Cài đặt <small>Tùy chỉnh chiếc điện thoại của bạn</small></div>${btn('appearance','🎨','Giao diện','5 hình nền · cỡ chữ')}${btn('audio','🔊','Âm thanh','Bật/tắt hiệu ứng · âm lượng')}${btn('performance','✨','Hiệu năng','Giảm chuyển động')}${btn('mika','🌸','Mika','Hướng dẫn người mới')}${btn('data','💾','Dữ liệu','Save và sao lưu')}${btn('about','📖','Về Game','Tác giả · phiên bản · lịch sử cập nhật')}`;
  else {
   let content='';
   if(view==='appearance'){
    content=`<h3>🌄 Bộ sưu tập hình nền</h3><div class="v8772-wallpapers">${wallpapers.map(w=>`<button class="v8772-wallpaper-option ${s.wallpaper===w.id?'selected':''}" onclick="VillageOS.setSetting('wallpaper','${w.id}')" aria-label="Chọn ${w.name}"><img loading="lazy" src="${w.url}" alt=""><span>${w.name}</span><em>${s.wallpaper===w.id?'✓':''}</em></button>`).join('')}</div>`;
    content+=row('🔤','Chữ lớn','Tăng cỡ chữ trong ứng dụng',`<input type="checkbox" aria-label="Chữ lớn" ${s.largeText?'checked':''} onchange="VillageOS.setSetting('largeText',this.checked)">`);
   }
   if(view==='audio'){
    content=row('🔊','Hiệu ứng âm thanh','Chạm để bật hoặc tắt âm trong game',`<input type="checkbox" aria-label="Bật âm thanh" ${s.sound?'checked':''} onchange="VillageOS.setSetting('sound',this.checked)">`);
    content+=`<div class="v8772-slider-row"><label for="v8772-volume">Âm lượng hiệu ứng <b id="v8772-volume-label">${s.volume}%</b></label><input id="v8772-volume" type="range" min="0" max="100" step="5" value="${Number(s.volume)||0}" oninput="document.getElementById('v8772-volume-label').textContent=this.value+'%'" onchange="VillageOS.setSetting('volume',Number(this.value))"></div><p class="v8772-note">Nhạc nền: game chưa có bộ nhạc riêng. Tùy chỉnh này chỉ điều khiển âm thanh trong game, không đổi âm lượng điện thoại.</p>`;
   }
   if(view==='performance')content=row('🌿','Giảm chuyển động','Hạn chế hiệu ứng không thiết yếu',`<input type="checkbox" aria-label="Giảm chuyển động" ${s.reducedMotion?'checked':''} onchange="VillageOS.setSetting('reducedMotion',this.checked)">`);
   if(view==='mika')content=`<h3>🌸 Mika đồng hành</h3><div class="v8772-mika-modes">${[['new','Hướng dẫn từng bước'],['explore','Tự khám phá'],['off','Tắt nhắc']].map(([id,l])=>`<button class="${gameState?.mikaGuide?.mode===id?'selected':''}" onclick="VillageOS.mikaMode('${id}')">${l}</button>`).join('')}</div><button class="v8772-action" onclick="VillageOS.resumeMika()">🌱 Bắt đầu / tiếp tục bài học</button>`;
   if(view==='data')content=`<h3>💾 Dữ liệu trò chơi</h3><p class="v8772-note">Dữ liệu game được lưu theo hồ sơ trên trình duyệt này. Hãy xuất mã save để dự phòng trước khi đổi thiết bị.</p><button class="v8772-action" onclick="VillageOS.saveNow()">💾 Lưu ngay</button><button class="v8772-action" onclick="VillageOS.backup()">📤 Sao chép mã save</button><p class="v8772-note">Để nhập mã save, dùng chức năng lưu trữ gốc của trò chơi. Không xóa dữ liệu trình duyệt nếu chưa sao lưu.</p>`;
   if(view==='about')content=`<h3>🌾 Bỏ Phố Về Quê</h3><p class="v8772-note">Game 2D mô phỏng kinh doanh và cuộc sống làng quê · Phiên bản v87.7.5</p><h4>Ghi công</h4><p class="v8772-note"><b>Chủ dự án, ý tưởng và định hướng:</b> Người sáng tạo Bỏ Phố Về Quê (chưa chốt tên hiển thị).<br><b>Hỗ trợ thiết kế và lập trình:</b> ChatGPT (OpenAI); các công cụ khác sẽ được bổ sung sau khi xác nhận.</p><h4>Nhật ký phát triển</h4><div class="v8772-history">${milestones.map(([version,desc])=>`<div><b>${esc(version)}</b><span>${esc(desc)}</span></div>`).join('')}</div><p class="v8772-note">Mỗi bản cập nhật chỉ cần thêm một mốc vào danh mục lịch sử; các bản tương lai chưa phát hành không được ghi là đã có.</p>`;
   settingsPanel.innerHTML=`<div class="v8772-subheader"><button onclick="VillageOS.settings('root')">‹</button><b>${({appearance:'Giao diện',audio:'Âm thanh',performance:'Hiệu năng',mika:'Mika',data:'Dữ liệu',about:'Về Game'})[view]}</b></div><div class="v8772-subcontent">${content}</div>`;
  }
  applySettings();
 }
 function settings(id){inSettings=id;renderSettings();}
 Object.assign(window.VillageOS,{
  settings,
  mikaMode(mode){window.v877MikaSetMode?.(mode);setSetting('mikaMode',mode);},
  resumeMika(){window.closeSmartPhoneModal();window.v8771ResumeGuide?.();},
  saveNow(){try{saveGameToStorage(false);showToast('Đã lưu game.','💾')}catch(e){showToast('Không thể lưu.','⚠️')}},
  backup(){try{exportSaveCode()}catch(e){showToast('Bạn có thể xuất save trong mục Lưu game.','💾')}}
 });
 // Dynamic version history registry for future updates without touching UI.
 window.VillageOS.addRelease=(version,summary)=>{if(!version||!summary)return false;milestones.push([String(version),String(summary)]);if(current==='settings'&&inSettings==='about')renderSettings();return true;};
 homeScreen();
})();
