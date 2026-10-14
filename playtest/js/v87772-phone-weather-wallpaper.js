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
 const oldSet=os.setSetting.bind(os);
 os.setSetting=function(...args){const result=oldSet(...args);if(args[0]==='wallpaper')showWallpaper();return result;};
 const oldPhoneOpen=window.openSmartPhoneModal;
 if(typeof oldPhoneOpen==='function')window.openSmartPhoneModal=function(...args){const result=oldPhoneOpen.apply(this,args);sync();return result;};
 const oldHome=os.home.bind(os);
 os.home=function(...args){const result=oldHome(...args);sync();return result;};
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
