/* Bỏ Phố Về Quê v87.7.1 — câu chuyện mở đầu, Mika dẫn thao tác.
 * Không đổi gameState nghiệp vụ / nghề / tiền / kho / save key.
 * Được chạy sau game.js và v877-warehouse-mika.js.
 */
(function(){
 'use strict';
 const $=(s)=>document.querySelector(s);
 const byId=(s)=>document.getElementById(s);
 const MIKA='assets/images/117_mika_6fcbe1c0ec.webp';
 const playerPic=()=> {try{return getPlayerChibiSource(gameState.playerChibi||'male')}catch(e){return ''}};
 const safe=(s)=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const started=()=>typeof gameState!=='undefined' && Boolean(gameState?.hasStarted) && typeof sessionGameActive!=='undefined' && sessionGameActive;
 const onboard=()=>{if(!gameState.v8771Onboarding || typeof gameState.v8771Onboarding!=='object')gameState.v8771Onboarding={};return gameState.v8771Onboarding};
 const guidance=()=>{if(!gameState.v8771Guide || typeof gameState.v8771Guide!=='object')gameState.v8771Guide={step:0,active:false,done:false};return gameState.v8771Guide};
 const save=()=>{try{if(typeof activeProfileId!=='undefined'&&activeProfileId && typeof saveGameToStorage==='function')saveGameToStorage(false)}catch(e){console.warn('[v87.7.1] save',e)}};
 const careers={boba:{name:'Tiệm Trà Sữa',icon:'🧋',hint:'Pha trà, phối topping và điều chỉnh vị ngọt.'},noodle:{name:'Quán Mì Cay',icon:'🍜',hint:'Chọn nước cốt, cấp cay và nguyên liệu món nóng.'},streetfood:{name:'Quầy Xiên Que',icon:'🍢',hint:'Phối các loại xiên, chọn sốt và chế biến món ăn vặt.'}};
 const chapters=[
  {k:'city',tag:'CHƯƠNG 0 · RỜI PHỐ',title:'Tạm Biệt Phố Thị',icon:'🌆',text:'Một ngày dài nữa khép lại giữa tiếng xe và những tòa nhà cao tầng. Công việc lặp đi lặp lại khiến bạn tự hỏi: “Mình có muốn sống mãi như thế này không?”',quote:'“Mình muốn thử một cuộc sống bình yên hơn… và gây dựng thứ gì đó của riêng mình.”',button:'🧳 Xếp vali rời thành phố'},
  {k:'bus',tag:'CHƯƠNG 0 · HÀNH TRÌNH',title:'Chuyến Xe Về Quê',icon:'🚌',text:'Bạn kéo chiếc vali nhỏ lên xe. Qua ô cửa, phố xá lùi dần, nhường chỗ cho cánh đồng, mái nhà và con đường quen thuộc. Trong túi chỉ có một số vốn khởi nghiệp khiêm tốn.',quote:'“Không biết mình sẽ làm được đến đâu, nhưng lần này mình muốn tự quyết định.”',button:'🌾 Bước xuống thị trấn'},
  {k:'mika',tag:'CHƯƠNG 0 · NGƯỜI BẠN MỚI',title:'Mika Chào Đón Bạn',icon:'🌸',text:'“A, bạn vừa trở về từ thành phố phải không? Mình là Mika! Ở đây tuy nhỏ nhưng nhiều thứ thú vị lắm. Nghe nói bạn định mở một quán ăn?”',quote:'“Để mình giới thiệu những nghề có thể bắt đầu ở quê nhé!”',button:'🏪 Mika ơi, giới thiệu quán đi!'}
 ];
 const steps=[
  {id:'prep',title:'Nhìn qua quầy chế biến',body:'Mỗi nghề dùng khay hoặc ly/thố khác nhau. Bạn hãy xem khu chế biến phía dưới để biết nguyên liệu ban đầu; chỉ bấm Đã xem khi bạn đã sẵn sàng.',target:'#workbench-focus-copy',nav:'shop',manual:true},
  {id:'open',title:'Mở quán đón khách',body:'Nhấn nút Mở Quán để nhận đơn đầu tiên. Mika sẽ tự nhận biết khi bạn mở thành công.',target:'#btn-toggle-shop',nav:'shop',check:()=>gameState.phase==='open'},
  {id:'serve',title:'Làm và giao món đầu tiên',body:'Đọc yêu cầu khách, chọn nguyên liệu, chế biến và bấm GIAO MÓN CHO KHÁCH. Mika chỉ đánh dấu hoàn thành sau khi game ghi nhận một đơn.',target:'#customer-booth-card',nav:'shop',check:(g)=>Number(gameState.dailyStats?.counterServed||0)+Number(gameState.dailyStats?.deliveryServed||0)>Number(g.serveBefore||0)},
  {id:'phone',title:'Khám phá điện thoại',body:'Bấm biểu tượng điện thoại để xem đơn giao, Soppi, minigame và các ứng dụng khác.',target:'[onclick="openSmartPhoneModal()"]',check:()=>!byId('modal-smartphone')?.classList.contains('hidden')},
  {id:'stock',title:'Kiểm tra Kho',body:'Mở Kho để xem nguyên liệu, hạt giống, Túi Mù, Vé Số và tiến độ Mảnh Công Thức.',target:'#nav-btn-warehouse',nav:'warehouse',check:()=>!byId('tab-warehouse')?.classList.contains('hidden')},
  {id:'farm',title:'Vườn và trồng trọt',body:'Vào Vườn để xem ô đất, hạt giống và cách thu hoạch.',target:'#nav-btn-farm',nav:'farm',check:()=>!byId('tab-farm')?.classList.contains('hidden')},
  {id:'barn',title:'Chuồng và vật nuôi',body:'Vào Chuồng để xem các con vật cùng nguyên liệu chăn nuôi.',target:'#nav-btn-barn',nav:'barn',check:()=>!byId('tab-barn')?.classList.contains('hidden')},
  {id:'village',title:'Khám phá Làng cùng Bé Bơ',body:'Vào Làng để gặp cư dân, khám phá các khu vực và làm nhiệm vụ NPC. Bé Bơ sẽ giúp bạn quen với nơi này.',target:'#nav-btn-village',nav:'village',check:()=>!byId('tab-village')?.classList.contains('hidden')},
  {id:'npc',title:'Gặp NPC và làm nhiệm vụ',body:'Hãy xem các cư dân và nhiệm vụ trong Làng. Chạm nhân vật để trò chuyện hoặc nhận việc. Có thể quay lại làm sau khi đã mở khóa.',target:'#tab-village',nav:'village',manual:true},
  {id:'upgrade',title:'Nâng bậc quán',body:'Bấm Bậc quán phía trên để xem điều kiện nâng cấp. Bạn không cần mua ngay, chỉ cần mở và xem.',target:'.v72-shop-stage-btn',check:()=>!byId('modal-shop-stage-quick')?.classList.contains('hidden')},
  {id:'skill',title:'Nâng cấp kỹ năng nhân vật',body:'Mở Điện thoại → Phát triển → Kỹ năng. Điểm kỹ năng sẽ giúp bạn cải thiện hoạt động kinh doanh.',target:'#papp-btn-progress',check:()=>!byId('phone-app-progress')?.classList.contains('hidden')},
  {id:'sale',title:'Săn sale và công thức',body:'Vào Điện thoại → Soppi để xem Săn Sale và mục Công Thức. Không cần mua hàng để hoàn thành bài học.',target:'#papp-btn-soppi',check:()=>!byId('phone-app-soppi')?.classList.contains('hidden')}
 ];
 let storyVisible=false;let storyReplay=false;let replayIndex=0;let lastHighlights=[];
 function markPlaying(){document.body.classList.toggle('v8771-playing',started()&&byId('screen-account')?.classList.contains('hidden')&&byId('screen-intro')?.classList.contains('hidden'));}
 function syncAccount(){const nameBlock=byId('account-new-shop-name')?.closest('label')||null;const inp=byId('account-new-shop-name');if(inp){inp.previousElementSibling?.classList.add('v8771-account-hidden');inp.classList.add('v8771-account-hidden');}const chooser=$('#screen-account .avatar-picker-summary');if(chooser){chooser.previousElementSibling?.classList.add('v8771-account-hidden');chooser.classList.add('v8771-account-hidden');}const btn=$('#screen-account button[onclick="createLocalAccount()"]');if(btn)btn.textContent='🧳 Tạo nhân vật & bắt đầu hành trình';const h=$('#screen-account h1');if(h)h.textContent='TẠO NHÂN VẬT & HỒ SƠ';if(nameBlock)nameBlock.classList.add('v8771-account-hidden');}
 function syncIntro(){
  const intro=byId('screen-intro');if(!intro)return;
  const player=byId('intro-player-name');const pBlock=player?.parentElement;if(pBlock)pBlock.classList.add('v8771-account-hidden');
  const parent=byId('intro-shop-name')?.parentElement?.parentElement?.parentElement;
  const careerGroup=byId('intro-card-boba')?.parentElement;
  if(parent&&careerGroup&&parent!==careerGroup)careerGroup.insertAdjacentElement('afterend',parent);
  if(parent&&parent.querySelector('h2'))parent.querySelector('h2').textContent='2. Đặt Tên & Hình Đại Diện Quán';
  const careerHeading=careerGroup?.querySelector('h2');if(careerHeading)careerHeading.textContent='1. Chọn Nghề Khởi Nghiệp';
  const container=byId('intro-shop-name')?.parentElement;
  if(container && !byId('v8771-intro-avatar')){
    const section=document.createElement('div');section.id='v8771-intro-avatar';section.innerHTML='<span class="v8771-field-label">Hình đại diện quán</span><button type="button" class="v8771-avatar-choice" onclick="openShopAvatarGallery(\'header\')"><span id="v8771-avatar-image">🐰</span><span><b>Chọn hình đại diện quán</b><small>Chạm để đổi linh vật hoặc khung cảnh</small></span><span>›</span></button>';
    container.insertAdjacentElement('afterend',section);
  }
  if(!byId('v8771-career-mika')){
    const after=byId('intro-card-boba')?.parentElement;
    const banner=document.createElement('div');banner.id='v8771-career-mika';banner.className='v8771-mika-note';banner.innerHTML=`<img src="${MIKA}" alt="Mika"><div><b>Mika • Chọn con đường của bạn</b><p>“Bạn thích pha trà, nấu mì cay hay bán xiên que? Chọn nghề rồi đặt tên quán nhé. Nghề sẽ khóa trong lượt chơi này đó!”</p></div>`;
    after?.parentElement?.insertBefore(banner,after);
  }
  const shopName=byId('intro-shop-name');if(shopName)shopName.placeholder='Ví dụ: Tiệm Mây Nhỏ';
  updateIntroAvatar();
 }
 function updateIntroAvatar(){const avatar=byId('v8771-avatar-image');if(!avatar)return;try{const src=getShopAvatarSource(getCurrentShopAvatar());avatar.innerHTML=src?`<img alt="Đại diện quán" src="${safe(src)}">`:'🏪'}catch(e){avatar.textContent='🏪'}}
 const overlay=document.createElement('section');overlay.id='v8771-story';overlay.className='v8771-story hidden';overlay.setAttribute('role','dialog');overlay.setAttribute('aria-modal','true');overlay.setAttribute('aria-label','Câu chuyện về quê');overlay.innerHTML='<div class="v8771-story-card" id="v8771-story-card"></div>';document.body.appendChild(overlay);
 function drawStory(){const s=onboard();const idx=Math.max(0,Math.min(chapters.length-1,storyReplay?replayIndex:(Number(s.introStep)||0)));const c=chapters[idx];overlay.classList.remove('hidden');storyVisible=true;markPlaying();const pic=idx===2?MIKA:playerPic();byId('v8771-story-card').innerHTML=`<div class="v8771-story-tag">${c.tag}</div><div class="v8771-scene ${c.k}"><div class="v8771-scene-symbol">${c.icon}</div>${pic?`<img class="v8771-character" src="${safe(pic)}" alt="${idx===2?'Mika':'Người chơi'}">`:''}<div class="v8771-scene-caption">${safe(c.title)}</div></div><h2>${safe(c.title)}</h2><p>${safe(c.text)}</p><blockquote>${safe(c.quote)}</blockquote><div class="v8771-story-actions"><button class="v8771-skip" onclick="v8771SkipStory()">Bỏ qua truyện</button><button class="v8771-next" onclick="v8771StoryNext()">${safe(c.button)} →</button></div><div class="v8771-dots">${chapters.map((_,i)=>`<span class="${i===idx?'selected':''}"></span>`).join('')}</div>`;}
 function finishStory(){const s=onboard();s.introStep=chapters.length;s.introCompleted=true;storyVisible=false;overlay.classList.add('hidden');syncIntro();markPlaying();save();}
 function finishReplay(){storyReplay=false;storyVisible=false;overlay.classList.add('hidden');markPlaying();}
 window.v8771ReplayStory=()=>{if(!started())return;storyReplay=true;replayIndex=0;window.v877MikaClose?.();drawStory();};
 window.v8771StoryNext=()=>{if(storyReplay){replayIndex++;if(replayIndex>=chapters.length)finishReplay();else drawStory();return;}const s=onboard();s.introStep=(Number(s.introStep)||0)+1;if(s.introStep>=chapters.length)finishStory();else {save();drawStory()}};
 window.v8771SkipStory=()=>storyReplay?finishReplay():finishStory();
 const popup=document.createElement('section');popup.id='v8771-welcome';popup.className='v8771-welcome hidden';popup.setAttribute('role','dialog');popup.setAttribute('aria-modal','true');popup.setAttribute('aria-label','Mika hỏi hướng dẫn');popup.innerHTML=`<div class="v8771-welcome-card"><img src="${MIKA}" alt="Mika"><b>🌸 Mika • Người bạn đồng hành</b><p>“Quán mới đã sẵn sàng! Bạn có muốn mình chỉ từng bước mở quán, giao món rồi khám phá điện thoại, Kho, Vườn, Chuồng và Làng không?”</p><button type="button" onclick="v8771ChooseHelp('new')">🌱 Có, chỉ mình với!</button><button type="button" onclick="v8771ChooseHelp('explore')">🧭 Mình muốn tự khám phá</button><button type="button" onclick="v8771ChooseHelp('off')">✨ Mình đã biết chơi rồi</button></div>`;document.body.appendChild(popup);
 const coach=document.createElement('section');coach.id='v8771-coach';coach.className='v8771-coach hidden';coach.setAttribute('aria-live','polite');document.body.appendChild(coach);
 function unmark(){lastHighlights.forEach(el=>el.classList.remove('v8771-spotlight'));lastHighlights=[]}
 function targetFor(step){return step.target?$(step.target):null}
 function renderCoach(){const g=guidance();unmark();if(!started()||!g.active||g.done){coach.classList.add('hidden');return;}const step=steps[Math.min(g.step,steps.length-1)];if(!step){g.active=false;g.done=true;save();coach.classList.add('hidden');return;}coach.classList.remove('hidden');coach.innerHTML=`<div class="v8771-coach-head"><img src="${MIKA}" alt=""><div><b>Mika hướng dẫn (${g.step+1}/${steps.length})</b><small>${safe(step.title)}</small></div><button onclick="v8771PauseGuide()" title="Tạm dừng">✕</button></div><p>${safe(step.body)}</p><div class="v8771-coach-actions"><button onclick="v8771PointGuide()">📍 Chỉ vị trí</button>${step.manual?'<button onclick="v8771NextGuide()">✅ Đã xem</button>':''}<button onclick="v8771NextGuide()">Bỏ qua ›</button></div>`}
 function moveNext(){const g=guidance();g.step=Math.min(steps.length,g.step+1);if(g.step>=steps.length){g.done=true;g.active=false;coach.classList.add('hidden');try{showToast('Mika: Bạn đã biết những thao tác chính rồi! 🌸','✅')}catch(e){}}else if(steps[g.step].id==='serve'){g.serveBefore=(gameState.dailyStats?.counterServed||0)+(gameState.dailyStats?.deliveryServed||0);}unmark();save();renderCoach()}
 window.v8771NextGuide=()=>moveNext();
 window.v8771PauseGuide=()=>{guidance().active=false;unmark();coach.classList.add('hidden');save();};
 window.v8771ResumeGuide=()=>{const g=guidance();g.active=true;g.done=false;save();renderCoach();};
 window.v8771PointGuide=()=>{const g=guidance(),step=steps[g.step];if(!step)return; if(step.nav && byId(`tab-${step.nav}`)?.classList.contains('hidden')){switchTab(step.nav)}const target=targetFor(step);if(target){target.classList.add('v8771-spotlight');lastHighlights.push(target);target.scrollIntoView({block:'center',behavior:'smooth'});}else{try{showToast('Mika: Mở tính năng theo hướng dẫn nhé!','🌸')}catch(e){}}};
 window.v8771ChooseHelp=(mode)=>{const state=onboard();state.asked=true;state.introCompleted=true;popup.classList.add('hidden');if(typeof v877MikaSetMode==='function')v877MikaSetMode(mode);const g=guidance();g.active=mode==='new';if(mode==='new'){g.step=0;g.done=false;g.serveBefore=0;}else g.active=false;save();renderCoach()};
 function showWelcome(){if(!started())return;const state=onboard();if(state.asked)return;state.asked=false;popup.classList.remove('hidden');coach.classList.add('hidden');markPlaying()}
 function synchronize(){markPlaying();if(!started())return;const g=guidance();if(g.active && onboard().asked)renderCoach();}
 // Hook chỉ tại các ranh giới tạo lượt; không thay đổi xử lý tài chính, kho, nghề.
 const nativeFresh=window.startFreshRunForActiveProfile;
 if(typeof nativeFresh==='function')window.startFreshRunForActiveProfile=function(...args){const result=nativeFresh.apply(this,args);const shopField=byId('intro-shop-name');if(shopField)shopField.value='';const s=onboard();s.introStep=0;s.introCompleted=false;s.asked=false;syncIntro();save();drawStory();return result;};
 const nativeContinue=window.continueLocalAccount;
 if(typeof nativeContinue==='function')window.continueLocalAccount=function(...args){const result=nativeContinue.apply(this,args);if(!gameState.hasStarted){const shopField=byId('intro-shop-name');if(shopField)shopField.value='';}syncIntro();markPlaying();const s=onboard();if(!gameState.hasStarted&&s.introCompleted===false){drawStory()}else if(started()&&s.asked){synchronize()}return result;};
 const nativeConfirm=window.confirmStartGameFromIntro;
 if(typeof nativeConfirm==='function')window.confirmStartGameFromIntro=function(...args){const name=byId('intro-shop-name')?.value.trim();if(!name){try{showToast('Bạn hãy đặt tên quán trước nhé!','🏪')}catch(e){}return;}const result=nativeConfirm.apply(this,args);if(started()){const s=onboard();s.introCompleted=true;s.introStep=chapters.length;markPlaying();save();window.setTimeout(showWelcome,180)}return result;};
 const nativeAvatar=window.confirmShopAvatarGallery;
 if(typeof nativeAvatar==='function')window.confirmShopAvatarGallery=function(...args){const res=nativeAvatar.apply(this,args);updateIntroAvatar();return res;};
 const nativeSelectCareer=window.selectIntroCareer;
 if(typeof nativeSelectCareer==='function')window.selectIntroCareer=function(key){const res=nativeSelectCareer.call(this,key);const c=careers[key];const hint=byId('v8771-career-mika')?.querySelector('p');if(c&&hint)hint.textContent=`“${c.icon} ${c.name}: ${c.hint} Nghề sẽ khóa trong lượt chơi này, bạn cứ chọn theo sở thích nhé!”`;return res;};
 const nativeAccount=window.openAccountScreen;
 if(typeof nativeAccount==='function')window.openAccountScreen=function(...args){const res=nativeAccount.apply(this,args);popup.classList.add('hidden');overlay.classList.add('hidden');coach.classList.add('hidden');unmark();storyVisible=false;markPlaying();return res;};
 const nativeLoaded=window.enterLoadedGame;
 if(typeof nativeLoaded==='function')window.enterLoadedGame=function(...args){const res=nativeLoaded.apply(this,args);popup.classList.add('hidden');overlay.classList.add('hidden');storyVisible=false;synchronize();const s=onboard();if(s.introCompleted===true&&s.asked===false)window.setTimeout(showWelcome,220);return res;};
 // Khôi phục hướng dẫn khi người chơi mở Mika (không trùng chức năng tự động hóa ở Quán).
 const nativeMikaOpen=window.v877MikaOpen;
 if(typeof nativeMikaOpen==='function')window.v877MikaOpen=function(...args){const res=nativeMikaOpen.apply(this,args);const dialog=byId('v877-mika-panel')?.querySelector('.v877-modal-body');if(dialog&&!byId('v8771-resume')){const btn=document.createElement('button');btn.id='v8771-resume';btn.className='v8771-resume';btn.textContent='🌱 Bắt đầu / tiếp tục hướng dẫn thao tác';btn.onclick=()=>{window.v877MikaClose();window.v8771ResumeGuide()};const replayBtn=document.createElement('button');replayBtn.id='v8771-replay';replayBtn.className='v8771-resume';replayBtn.textContent='📖 Xem lại câu chuyện rời phố';replayBtn.onclick=()=>window.v8771ReplayStory();dialog.prepend(replayBtn);dialog.prepend(btn)}return res;};
 // Theo dõi thao tác thật và tiến triển; không tự tiêu tài nguyên hoặc bấm thay người chơi.
 function checkGuide(){const g=guidance();if(!started()||!g.active||g.done)return;const step=steps[g.step];if(step&&step.check&&step.check(g))moveNext();}
 document.addEventListener('click',()=>{window.setTimeout(checkGuide,120)},true);
 window.setInterval(()=>{if(started()&&guidance().active)checkGuide();},1400);
 syncAccount();const initialShopField=byId('intro-shop-name');if(initialShopField)initialShopField.value='';syncIntro();markPlaying();
 window.__v8771Test={chapters,steps,onboard,guidance,checkGuide,careers};
})();
