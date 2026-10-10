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
 const nativeSetSetting=OS.setSetting.bind(OS);
 function applyTheme(){
  const isNight=OS.getSettings().theme==='night';
  modal.classList.toggle('v8773-night',isNight);
  settings?.querySelectorAll('[data-v8773-theme]').forEach(btn=>btn.classList.toggle('selected',btn.dataset.v8773Theme===(isNight?'night':'warm')));
 }
 OS.setSetting=function(key,value){nativeSetSetting(key,value);applyTheme();};
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
