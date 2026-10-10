/* Bỏ Phố Về Quê v87.7 — Kho thống nhất & Mika hướng dẫn.
 * Cập nhật giao diện bằng cách đọc nguồn thật; không tự tạo/tiêu thụ vật phẩm.
 * Tương thích với v87.6.1b; giữ nguyên game.js và khóa save v13.
 */
(function () {
  'use strict';
  const warehouseLegacy = window.renderWarehouseUI;
  const switchTabLegacy = window.switchTab;
  const gameGuideTopics = [
    {id:'MK01',icon:'🛒',name:'Chọn nghề',keywords:'nghề đổi nghề khởi đầu trà sữa mì cay xiên que',text:()=>`Bạn đang chơi nghề ${({boba:'Trà Sữa',noodle:'Mì Cay',streetfood:'Xiên Que'})[gameState.currentCareer]||'hiện tại'}. Nghề được khóa trong lượt khởi nghiệp này. Chỉ chọn lại sau khi bắt đầu lượt mới.`,target:'shop'},
    {id:'MK02',icon:'🏪',name:'Mở quán và đóng ca',keywords:'mở quán đóng ca bán hàng',text:()=> 'Vào Quán để chuẩn bị nguyên liệu rồi mở ca. Khi muốn kết thúc, hãy đóng ca; sang ngày mới là một xác nhận riêng.',target:'shop'},
    {id:'MK03',icon:'🍽️',name:'Làm món đầu tiên',keywords:'làm món pha chế nấu ăn nhận đơn khách',text:()=> 'Đọc yêu cầu của khách trong Quán, chọn đúng khay/ly/thố, nguyên liệu và thao tác theo nghề; kiểm tra món trước khi giao. Làm sai có thể bị khách từ chối.',target:'shop'},
    {id:'MK04',icon:'📦',name:'Thiếu nguyên liệu',keywords:'thiếu nguyên liệu mua hàng kho chợ soppi',text:()=> 'Vào Kho để kiểm tra số lượng còn lại. Mua nguyên liệu ở Chợ hoặc Soppi; nguyên liệu nông nghiệp chỉ trồng/nuôi được sau khi mở khóa.',target:'warehouse'},
    {id:'MK05',icon:'🌾',name:'Vườn và Chuồng',keywords:'vườn chuồng trồng cây chăn nuôi hạt giống sữa trứng',text:()=> 'Vườn dùng hạt giống để gieo trồng và thu hoạch. Chuồng nuôi vật nuôi đã mở khóa, cần chăm sóc và đợi chu kỳ; không thể thu hoạch ngay.',target:'farm'},
    {id:'MK06',icon:'🎟️',name:'Nhận Vé Số',keywords:'vé số cào vé nhặt được xổ số',text:()=> `Bạn hiện có ${Math.max(0,Number(gameState.lotteryTickets)||0)} vé. Xem tại Kho → Vật Phẩm, sau đó vào Điện thoại → Góc Giải Trí → Vé Số Cào để sử dụng.`,target:'games'},
    {id:'MK07',icon:'🎁',name:'Nhận Túi Mù',keywords:'túi mù hộp mù nhặt được khui hộp',text:()=> `Bạn có ${Math.max(0,Number(gameState.blindBagTokens)||0)} Túi Mù. Xem tại Kho → Vật Phẩm; khui ở Điện thoại → Góc Giải Trí. Hộp quà thường là vật phẩm khác.`,target:'games'},
    {id:'MK08',icon:'🧩',name:'Săn Mảnh Công Thức',keywords:'mảnh công thức săn mảnh hộp công thức soppi',text:()=> 'Mảnh công thức được ghi theo món riêng. Xem tại Kho → Vật Phẩm; đến Điện thoại → Soppi → Công thức để săn tiếp (75 Xu/lượt, tối đa 3 lượt/ngày). Cần đủ 2 mảnh đúng món.',target:'recipe'},
    {id:'MK09',icon:'🗺️',name:'Khám phá Làng cùng Bé Bơ',keywords:'làng npc bé bơ thể lực khám phá bản đồ nhiệm vụ',text:()=> 'Bé Bơ thích khám phá Làng. Khi đi giữa các khu vực, chú ý thể lực và cấp mở khóa; nói chuyện NPC để tìm nhiệm vụ, quà và dấu ấn địa phương.',target:'village'},
    {id:'MK10',icon:'🌙',name:'Đóng ca và sang ngày',keywords:'đóng ca ngày mới kết thúc ca ngủ nghỉ',text:()=> 'Đóng ca chỉ dừng hoạt động kinh doanh. Để chuyển sang ngày tiếp theo, cần xác nhận riêng trong phần kết thúc ngày; Mika sẽ không nhấn thay bạn.',target:'shop'},
    {id:'MK11',icon:'👩‍🍳',name:'Tuyển và quản lý nhân viên',keywords:'nhân viên tự động phục vụ tuyển người tiền lương lan khoa',text:()=> 'Các vị trí nhân viên mở theo bậc quán, có chi phí tuyển và lương. Trợ lý tự động ở Quán khác với Mika: hãy kiểm tra giới hạn phục vụ, nguyên liệu và báo cáo ca.',target:'shop'},
    {id:'MK12',icon:'🏦',name:'Vay vốn và phá sản',keywords:'vay tiền nợ ngân hàng phá sản thế chấp lãi',text:()=> `Khoản nợ hiện tại: ${Math.max(0,Number(gameState.debt)||0).toLocaleString('vi-VN')} Xu. Trước khi vay hoặc thế chấp, xem điều kiện, lãi và khả năng trả trong Điện thoại → Ngân Hàng. Hệ thống Vận Mệnh chưa ra mắt.`,target:'bank'}
  ];
  const beginnerSteps = ['MK01','MK02','MK03','MK04','MK09'];
  const escapeText = value => String(value??'').replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const amount = n => Math.max(0, Number.isFinite(Number(n)) ? Math.floor(Number(n)) : 0);
  const owned = (id) => amount((gameState.inventory||{})[id]);
  let warehouseCategory = 'all';
  let guideTopic = 'MK01';
  function ensureGuide() {
    if (!gameState || typeof gameState!=='object') return null;
    let s = gameState.mikaGuide;
    if (!s || typeof s!=='object' || Array.isArray(s)) s = gameState.mikaGuide = {};
    s.schemaVersion=1;
    if (!['new','explore','off'].includes(s.mode)) s.mode = (gameState.hasStarted && Number(gameState.level)>1) ? 'explore':'new';
    for (const field of ['completed','skipped','muted']) if(!s[field]||typeof s[field]!=='object'||Array.isArray(s[field]))s[field]={};
    if (!Number.isInteger(s.onboardStep)||s.onboardStep<0||s.onboardStep>beginnerSteps.length)s.onboardStep=0;
    if (!Number.isInteger(s.hintDay))s.hintDay=-1;
    if (!Number.isInteger(s.hintCount)||s.hintCount<0)s.hintCount=0;
    if(typeof s.invited!=='boolean') s.invited=false;
    return s;
  }
  const saveGuide = () => {if (typeof activeProfileId!=='undefined' && activeProfileId && typeof saveGameToStorage==='function') saveGameToStorage(false);};
  function itemCard(icon,name,sub,buttonLabel='',action='',note='') {
    return `<div class="v877-item"><span class="v877-item-icon">${icon}</span><b>${escapeText(name)}</b><small>${escapeText(sub)}</small>${note?`<em>${escapeText(note)}</em>`:''}${buttonLabel&&action?`<button type="button" onclick="${action}">${escapeText(buttonLabel)}</button>`:''}</div>`;
  }
  function heading(title,desc='') {return `<div class="v877-section">${title}${desc?`<small>${desc}</small>`:''}</div>`;}
  function fromInventory(categories, includeMisc=false) {
    const all=Object.entries(gameState.inventory||{}).filter(([id,n])=>amount(n)>0);
    return all.filter(([id])=> includeMisc ? !!V8731_ITEMS[id] : !V8731_ITEMS[id] && (categories===null || categories.includes((ITEM_DICTIONARY[id]||{}).cat||'craft')) );
  }
  function ingredientHtml(entries) {
    return entries.map(([id,n])=>{
      const item=ITEM_DICTIONARY[id]||{name:id,icon:'📦',basePrice:0};
      const price=Math.max(0,Number(item.basePrice)||0);
      return itemCard(item.icon||'📦',item.name||id,`Trong kho ×${amount(n)}`,'','',price?`~${Math.round(price*amount(n)).toLocaleString('vi-VN')} Xu`: '');
    }).join('');
  }
  function specialHtml(){
    let html=heading('🎟️ Vé và Túi Mù','Số lượng lấy trực tiếp từ hệ thống minigame.');
    html+=itemCard('🎟️','Vé Số Cào',`Đang có ×${amount(gameState.lotteryTickets)}`,'Đến Góc Giải Trí',"v877Go('games')");
    html+=itemCard('🎁','Túi Mù',`Đang có ×${amount(gameState.blindBagTokens)}`,'Đến Góc Giải Trí',"v877Go('games')");
    const recipes=Object.values(RECIPE_BOOK||{}).flat().filter(r=>r.v8743Discover);
    const thisCareer=gameState.currentCareer;
    const inCareer=(RECIPE_BOOK[thisCareer]||[]).filter(r=>r.v8743Discover);
    html+=heading('🧩 Săn Mảnh Công Thức','Mỗi nghề có mảnh riêng; chỉ hiện tên món của nghề đang chơi.');
    if(inCareer.length){
      for(const recipe of inCareer){
        const fragments=Math.min(2,amount(gameState.v8743RecipeFragments?.[recipe.id]));
        const eligible=(Number(gameState.level)||1)>=(recipe.reqLevel||1)&&(Number(gameState.shopStage)||0)>=(recipe.reqStage||0);
        if(!eligible&&fragments===0){html+=itemCard('🔒','Công thức chưa mở','Tiếp tục lên cấp và phát triển quán.');continue;}
        html+=itemCard('🧩',recipe.name,fragments===2?'2/2 mảnh • Đã học công thức':`${fragments}/2 mảnh • Cần thêm ${2-fragments}`,'Sổ Công Thức',"v877Go('recipe')");
      }
    }else html+=`<p class="v877-empty">Nghề hiện tại chưa có công thức săn mảnh.</p>`;
    const offCareer=recipes.filter(r=>!inCareer.includes(r)&&amount(gameState.v8743RecipeFragments?.[r.id])>0);
    if(offCareer.length)html+=`<p class="v877-info">📚 Có ${offCareer.length} công thức thuộc nghề khác đã lưu tiến độ; chỉ xem chi tiết khi chọn đúng nghề.</p>`;
    return html;
  }
  function miscHtml(){
    const list=fromInventory(null,true);
    let html=heading('🎀 Đồ Linh Tinh và hộp quà','Hộp quà thường khác với Túi Mù của minigame.');
    if(!list.length)return html+'<p class="v877-empty">Chưa có đồ linh tinh. Bạn có thể tìm ở Làng hoặc Chợ.</p>';
    return html+list.map(([id,n])=>{
      const x=V8731_ITEMS[id];return itemCard(x.icon,x.name,`Đang có ×${amount(n)} • ${x.kind==='box'?'Chưa bóc':x.kind==='toy'?'Đồ chơi':x.kind==='gift'?'Quà tặng':'Vật nhặt được'}`,x.kind==='box'?'🎁 Bóc một gói':'',x.kind==='box'?`v877OpenBox('${id}')`:'',x.desc||'');
    }).join('');
  }
  function assetsHtml(){
    let html='';
    const inventoryOwned=new Set(Array.isArray(gameState.utilityOwned)?gameState.utilityOwned:[]);
    if(inventoryOwned.size){
      html+=heading('🧭 Trang bị & Tiện ích','Tài sản sở hữu, không cộng Xu định giá nguyên liệu.');
      for(const id of inventoryOwned){
        const x=(typeof CHARACTER_GEAR_CONFIG!=='undefined'&&CHARACTER_GEAR_CONFIG[id])||(typeof UTILITY_BUFF_CONFIG!=='undefined'&&UTILITY_BUFF_CONFIG[id])||{name:id,icon:'🎒'};
        const equipped=Object.values(gameState.equippedGear||{}).includes(id);
        html+=itemCard(x.icon||'🎒',x.name||id,equipped?'Đang trang bị':'Đã sở hữu','Quản lý trang bị',"v877Go('utility')");
      }
    }
    if(Array.isArray(gameState.decorations)&&gameState.decorations.length){
      html+=heading('🏡 Trang trí quán','Đồ đã mua, không kích hoạt buff thêm trong Kho.');
      for(const id of new Set(gameState.decorations)){
        const x=(typeof SHOP_DECOR_CONFIG!=='undefined'&&SHOP_DECOR_CONFIG[id])||{icon:'🪴',name:id};
        html+=itemCard(x.icon||'🪴',x.name||id,'Đã sở hữu','Xem Phát Triển',"v877Go('progress')");
      }
    }
    return html;
  }
  function souvenirOwnedHtml(){
    const entries=Object.entries(gameState.souvenirs||{}).filter(([id,n])=>amount(n)>0 && SOUVENIR_CONFIG[id]);
    if(!entries.length)return '';
    return heading('🏆 Lưu niệm đã sưu tầm','Xem đầy đủ trong thẻ Lưu Niệm; không cộng vào định giá nguyên liệu.') + entries.map(([id,n])=>itemCard(SOUVENIR_CONFIG[id].icon,SOUVENIR_CONFIG[id].name,`Sở hữu ×${amount(n)}`,'Xem Lưu Niệm',"filterWarehouseCategory('souvenir')")).join('');
  }
  function currentValue(){
    return Object.entries(gameState.inventory||{}).reduce((v,[id,n])=>{
      const x=ITEM_DICTIONARY[id];return v+(amount(n)>0 && x&&!V8731_ITEMS[id]?amount(n)*Math.max(0,Number(x.basePrice)||0):0);
    },0);
  }
  function newWarehouse(){
    const grid=document.getElementById('warehouse-items-grid'),label=document.getElementById('warehouse-valuation-text');
    if(!grid)return;
    if(warehouseCategory==='souvenir'){
      currentWarehouseCategory='souvenir'; warehouseLegacy(); markActive(); return;
    }
    grid.className='v877-grid';
    const craft=fromInventory(['craft']);
    const seeds=fromInventory(['seed']);
    const crops=fromInventory(['farm']);
    const milk=fromInventory(['dairy']);
    const others=fromInventory(null).filter(([id])=>!['craft','seed','farm','dairy'].includes((ITEM_DICTIONARY[id]||{}).cat));
    const total=Object.values(gameState.inventory||{}).reduce((n,x)=>n+amount(x),0);
    let html='';
    if(warehouseCategory==='all'||warehouseCategory==='craft'){
      html+=heading('🍽️ Nguyên liệu chế biến',`${craft.length} loại đang có`)+ (craft.length?ingredientHtml(craft):'<p class="v877-empty">Chưa có nguyên liệu chế biến.</p>');
      if(others.length)html+=heading('📦 Nguyên liệu khác')+ingredientHtml(others);
    }
    if(warehouseCategory==='all'||warehouseCategory==='farm'){
      html+=heading('🌱 Hạt giống')+(seeds.length?ingredientHtml(seeds):'<p class="v877-empty">Chưa có hạt giống.</p>');
      html+=heading('🌾 Thu hoạch')+(crops.length?ingredientHtml(crops):'<p class="v877-empty">Chưa có nông sản thu hoạch.</p>');
      html+=heading('🥛 Chăn nuôi')+(milk.length?ingredientHtml(milk):'<p class="v877-empty">Chưa có sản phẩm chăn nuôi.</p>');
    }
    if(warehouseCategory==='all'||warehouseCategory==='special'){
      html+=specialHtml()+miscHtml()+assetsHtml();
      if(warehouseCategory==='all')html+=souvenirOwnedHtml();
    }
    grid.innerHTML=html;
    if(label)label.textContent=`📦 ${total.toLocaleString('vi-VN')} đơn vị trong kho • Nguyên liệu ~${Math.round(currentValue()).toLocaleString('vi-VN')} Xu • Vé ${amount(gameState.lotteryTickets)} • Túi ${amount(gameState.blindBagTokens)}`;
    markActive();
  }
  function markActive(){document.querySelectorAll('[data-v877-filter]').forEach(b=>b.classList.toggle('active',b.dataset.v877Filter===warehouseCategory));}
  window.filterWarehouseCategory=function(category){if(['misc'].includes(category))category='special';if(['dairy','seed'].includes(category))category='farm';warehouseCategory=['all','craft','farm','special','souvenir'].includes(category)?category:'all';currentWarehouseCategory=warehouseCategory;newWarehouse();};
  window.renderWarehouseUI=newWarehouse;
  window.v877Go=function(target){
    if(['warehouse','shop','farm','barn','village'].includes(target)){ if(target==='warehouse')warehouseCategory='all';switchTab(target);return;}
    if(['games','recipe','bank','utility','progress'].includes(target)){
      openSmartPhoneModal();const app=target==='recipe'?'soppi':target;
      switchPhoneApp(app);if(target==='recipe')v8743SelectTab('recipe');
      return;
    }
  };
  window.v877OpenBox=function(id){
    if(typeof V8731_ITEMS==='undefined'||V8731_ITEMS[id]?.kind!=='box'||owned(id)<1)return;
    v8731OpenBox(id);
    if(!document.getElementById('tab-warehouse')?.classList.contains('hidden'))newWarehouse();
  };
  // Đảm bảo thẻ Kho cập nhật khi quay trở lại, không ghi dữ liệu vào inventory.
  window.switchTab=function(tab){switchTabLegacy(tab); if(tab==='warehouse')newWarehouse(); if(tab==='village')maybeNudge('MK09'); else if(tab==='farm'||tab==='barn')maybeNudge('MK05');else if(tab==='shop')maybeNudge('MK02');};
  function stateful(){return typeof sessionGameActive!=='undefined' && sessionGameActive && gameState && gameState.hasStarted;}
  function maybeNudge(id){
    if(!stateful())return;
    const s=ensureGuide();if(!s||s.mode!=='new'||s.muted[id]||s.completed[id]||s.skipped[id])return;
    if(s.hintDay!==gameState.day){s.hintDay=gameState.day;s.hintCount=0;}
    if(s.hintCount>=2||s.lastHint===id)return;
    const visibleModal=Array.from(document.querySelectorAll('[id^="modal-"]')).some(el=>!el.classList.contains('hidden'));
    if(visibleModal)return;
    s.hintCount++;s.lastHint=id;
    const toast=document.getElementById('v877-mika-nudge');if(!toast)return;
    toast.textContent=`🌸 Mika: ${gameGuideTopics.find(x=>x.id===id)?.name||'Có gợi ý mới'} — nhấn Mika nếu cần nhé!`;
    toast.classList.add('show');window.clearTimeout(window._v877NudgeTimeout);window._v877NudgeTimeout=window.setTimeout(()=>toast.classList.remove('show'),4300);
  }
  function showGuide(id){guideTopic=id||guideTopic;document.getElementById('v877-mika-panel')?.classList.remove('hidden');mikaRender();}
  window.v877MikaOpen=()=>showGuide(guideTopic);
  window.v877MikaClose=()=>document.getElementById('v877-mika-panel')?.classList.add('hidden');
  window.v877MikaSetMode=function(mode){if(!['new','explore','off'].includes(mode))return;const g=ensureGuide();g.mode=mode;g.invited=true;saveGuide();mikaRender();};
  window.v877MikaSelect=function(id){if(!gameGuideTopics.some(x=>x.id===id))return;guideTopic=id;mikaRender();};
  window.v877MikaSearch=function(q){const v=String(q||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('vi');
    document.querySelectorAll('.v877-topic').forEach(el=>{const t=gameGuideTopics.find(x=>x.id===el.dataset.topic);el.classList.toggle('hidden',!!v&&!String(t?.name+' '+t?.keywords).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('vi').includes(v));});
    const no=document.getElementById('v877-empty-search');if(no)no.classList.toggle('hidden',!v||Array.from(document.querySelectorAll('.v877-topic')).some(e=>!e.classList.contains('hidden')));
  };
  window.v877MikaDo=function(action){
    const s=ensureGuide();if(!s)return;
    if(action==='done'||action==='skip'||action==='mute'){
      s[action==='done'?'completed':action==='skip'?'skipped':'muted'][guideTopic]=true;
      if(beginnerSteps[s.onboardStep]===guideTopic)s.onboardStep=Math.min(beginnerSteps.length,s.onboardStep+1);
      saveGuide();
      if(s.mode==='new' && s.onboardStep<beginnerSteps.length && action!=='mute'){guideTopic=beginnerSteps[s.onboardStep];}else if(action==='mute'){s.mode='explore';saveGuide();}
      mikaRender();return;
    }
    if(action==='go'){const topic=gameGuideTopics.find(x=>x.id===guideTopic);window.v877MikaClose();if(topic)v877Go(topic.target);}
  };
  function mikaRender(){
    const s=ensureGuide();if(!s)return;
    const selected=gameGuideTopics.find(t=>t.id===guideTopic)||gameGuideTopics[0];
    const face=document.getElementById('v877-current-guide');if(!face)return;
    face.innerHTML=`<strong>${selected.icon} ${escapeText(selected.name)}</strong><p>${escapeText(selected.text())}</p>${s.completed[selected.id]?'<small>✅ Đã học chủ đề này</small>':''}<div class="v877-actions"><button type="button" onclick="v877MikaDo('go')">📍 Chỉ cho tôi</button><button type="button" onclick="v877MikaDo('done')">✅ Đã hiểu</button><button type="button" onclick="v877MikaDo('skip')">Bỏ qua</button><button type="button" onclick="v877MikaDo('mute')">Không nhắc lại</button></div>`;
    document.querySelectorAll('.v877-topic').forEach(b=>b.classList.toggle('active',b.dataset.topic===guideTopic));
    document.querySelectorAll('[data-v877-mode]').forEach(b=>b.classList.toggle('active',b.dataset.v877Mode===s.mode));
    const counter=document.getElementById('v877-progress');if(counter)counter.textContent=`${s.mode==='new' && s.onboardStep<beginnerSteps.length ? `Hướng dẫn nhập môn: ${s.onboardStep+1}/${beginnerSteps.length} • ` : ''}Đã biết ${Object.keys(s.completed).length}/${gameGuideTopics.length} chủ đề • Chế độ ${s.mode==='new'?'Người mới':s.mode==='explore'?'Tự khám phá':'Tắt nhắc'}`;
  }
  // Thêm nút trợ lý tách biệt nút auto của Quán.
  const mika=document.createElement('div');mika.id='v877-mika-ui';
  mika.innerHTML=`<button id="v877-mika-launch" type="button" aria-label="Mở Mika hướng dẫn" onclick="v877MikaOpen()"><img src="assets/images/117_mika_6fcbe1c0ec.webp" alt="Mika" loading="lazy"/><span>Hỏi Mika</span></button><div id="v877-mika-nudge" aria-live="polite"></div><div id="v877-mika-panel" class="v877-overlay hidden" role="dialog" aria-modal="true" aria-label="Mika hướng dẫn" onclick="if(event.target===this)v877MikaClose()"><section class="v877-dialog"><header><img src="assets/images/117_mika_6fcbe1c0ec.webp" alt="Mika"/><div><b>🌸 Mika • Sổ tay khởi nghiệp</b><small>Trợ lý trong game • không cần API</small></div><button type="button" onclick="v877MikaClose()" aria-label="Đóng trợ lý">✕</button></header><div class="v877-modal-body"><div class="v877-modes"><button data-v877-mode="new" onclick="v877MikaSetMode('new')">Người mới</button><button data-v877-mode="explore" onclick="v877MikaSetMode('explore')">Tự khám phá</button><button data-v877-mode="off" onclick="v877MikaSetMode('off')">Tắt nhắc</button></div><p class="v877-info" id="v877-progress"></p><label class="v877-search-label" for="v877-mika-search">Hỏi Mika về tính năng</label><input id="v877-mika-search" type="search" placeholder="VD: túi mù, nợ, công thức..." oninput="v877MikaSearch(this.value)"/><div class="v877-topic-list">${gameGuideTopics.map(t=>`<button type="button" class="v877-topic" data-topic="${t.id}" onclick="v877MikaSelect('${t.id}')">${t.icon} ${escapeText(t.name)}</button>`).join('')}</div><p id="v877-empty-search" class="v877-info hidden">Mika chưa có hướng dẫn cho câu này. Thử từ khóa khác nhé.</p><article id="v877-current-guide"></article><small class="v877-privacy">Mika chỉ đọc thông tin game. Không tự làm đơn, tiêu Xu hay gửi dữ liệu ra mạng.</small></div></section></div>`;
  document.body.appendChild(mika);
  // Phục hồi thẻ hiển thị đã có, không đổi thông tin người chơi.
  if(typeof currentWarehouseCategory!=='undefined')warehouseCategory=['all','craft','farm','special','souvenir'].includes(currentWarehouseCategory)?currentWarehouseCategory:'all';
  // Chỉ làm mới phần nhìn sau khi đóng minigame; không thay đổi luật nhận/thưởng.
  ['closeLotteryModal','closeBlindBagModal','closeSmartPhoneModal','v8743BuyRecipeBox'].forEach(name=>{
    const original=window[name];if(typeof original!=='function')return;
    window[name]=function(...args){
      const result=original.apply(this,args);
      if(!document.getElementById('tab-warehouse')?.classList.contains('hidden'))newWarehouse();
      return result;
    };
  });
  document.addEventListener('click', () => {
    if(!stateful())return;
    const s=ensureGuide();
    if(!s || s.invited || s.mode!=='new')return;
    if(!document.getElementById('v877-mika-panel')?.classList.contains('hidden'))return;
    s.invited=true;saveGuide();
    const n=document.getElementById('v877-mika-nudge');
    if(n){n.textContent='🌸 Mika có thể hướng dẫn bạn chơi từng bước. Nhấn “Hỏi Mika” nếu cần!'; n.classList.add('show');setTimeout(()=>n.classList.remove('show'),6500);}
  });
  window.__v877Test={ensureGuide, specialHtml, assetsHtml, newWarehouse, gameGuideTopics, owned};
})();
