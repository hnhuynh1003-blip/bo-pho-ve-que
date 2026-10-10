/* v87.8.0: Source-of-materials ledger (read-only). Existing item IDs and inventory never mutate. */
(function () {
  'use strict';
  // Crop / animal product mappings are DESIGN DIRECTIONS, not executable recipes.
  // A mapped output must already exist in ITEM_DICTIONARY. No conversion cost is assumed.
  const SOURCE_ROUTES = Object.freeze([
    {source:'farm',id:'crop_wheat',icon:'🌾',level:1,targets:[],detail:'Lúa mì hiện dùng làm thức ăn cho gà, bò và vịt.'},
    {source:'farm',id:'crop_tea',icon:'🍃',level:3,targets:['tea_black','tea_green'],detail:'Dự kiến ủ/sấy lá trà thành trà dùng cho quầy.'},
    {source:'farm',id:'crop_strawberry',icon:'🍓',level:6,targets:['tea_strawberry'],detail:'Dự kiến sơ chế dâu để pha trà dâu.'},
    {source:'farm',id:'crop_chili',icon:'🌶️',level:10,targets:['sauce_satay','broth_mala'],detail:'Dự kiến xay ớt, nấu sốt cay hoặc nước cốt.'},
    {source:'farm',id:'crop_corn',icon:'🌽',level:18,targets:['ntop_corn','skewer_corn'],detail:'Đồng thời là thức ăn cho dê; dự kiến sơ chế thành topping.'},
    {source:'farm',id:'crop_taro',icon:'🍠',level:28,targets:['tea_taro'],detail:'Dự kiến hấp và xay khoai môn dùng ở quầy trà sữa.'},
    {source:'barn',id:'egg',icon:'🥚',level:2,targets:['ntop_egg'],detail:'Dự kiến sơ chế trứng để dùng với mì cay.'},
    {source:'barn',id:'milk',icon:'🥛',level:6,targets:['milk_fresh'],detail:'Dự kiến xử lý sữa tươi thành nguyên liệu quầy trà sữa.'},
    {source:'barn',id:'duck_egg',icon:'🥚',level:14,targets:[],detail:'Trứng vịt đang là nông sản; món sử dụng trực tiếp chưa được duyệt.'},
    {source:'barn',id:'goat_milk',icon:'🍼',level:24,targets:[],detail:'Sữa dê đang là nông sản; công thức chế biến cần thiết kế sau.'},
    {source:'barn',id:'honey',icon:'🍯',level:40,targets:['tea_honey','sauce_honey_mustard'],detail:'Dự kiến làm siro cho trà hoặc sốt mật ong.'}
  ].map(x=>Object.freeze({...x,targets:Object.freeze(x.targets)})));
  let selection = 'all';
  const panel = document.getElementById('v8780-source-panel');
  const toggle = document.getElementById('v8780-source-toggle');
  const listing = document.getElementById('v8780-source-list');
  if(!panel || !toggle || !listing) return;
  const esc = value => String(value??'').replace(/[&<>"']/g, ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const qty = id => {
    const x = Number(typeof gameState==='object' && gameState ? gameState.inventory?.[id] : 0);
    return Number.isFinite(x) && x > 0 ? Math.floor(x) : 0;
  };
  const label = id => (typeof ITEM_DICTIONARY === 'object' && ITEM_DICTIONARY[id]?.name) || id;
  function render(){
    if(panel.hidden)return;
    const visible=SOURCE_ROUTES.filter(r=>selection==='all' || (selection==='owned' ? qty(r.id)>0 : r.source===selection));
    listing.innerHTML=visible.length?visible.map(r=>{
      const destination=r.targets.length?`<div class="v8780-source-path">↳ Dự kiến: ${r.targets.map(id=>`${esc(label(id))} <small>(đang có ${qty(id)})</small>`).join(' · ')}</div>`:`<div class="v8780-source-path">↳ Chưa có công thức chế biến được duyệt</div>`;
      return `<article class="v8780-source-item"><div class="v8780-source-head"><span class="emoji" aria-hidden="true">${r.icon}</span><strong>${esc(label(r.id))}</strong></div><span class="v8780-source-level">${r.source==='farm'?'🌱 Từ Vườn':'🐄 Từ Chuồng'} • Mở nguồn từ Lv.${r.level}</span><div class="v8780-source-amount">📦 Nguyên liệu thô: ${qty(r.id)}</div>${destination}<div class="v8780-source-tip">${esc(r.detail)}</div></article>`;
    }).join(''):'<p class="v8780-source-empty">Chưa có nông sản trong Kho. Trồng cây hoặc thu hoạch ở Chuồng để bắt đầu nhé!</p>';
  }
  toggle.addEventListener('click',()=>{
    panel.hidden=!panel.hidden;
    toggle.setAttribute('aria-expanded',String(!panel.hidden));
    toggle.innerHTML=panel.hidden?'Xem nguồn <span aria-hidden="true">⌄</span>':'Thu gọn <span aria-hidden="true">⌃</span>';
    if(!panel.hidden)render();
  });
  panel.querySelectorAll('[data-v8780-filter]').forEach(btn=>btn.addEventListener('click',()=>{
    selection=btn.getAttribute('data-v8780-filter')||'all';
    panel.querySelectorAll('[data-v8780-filter]').forEach(b=>{
      const active=b===btn;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));
    });
    render();
  }));
  document.getElementById('v8780-source-refresh')?.addEventListener('click',render);
  // Read-only public inspector for regression checks, no mutable references.
  window.bpvqMaterialSourceSummary=function(){
    return SOURCE_ROUTES.map(r=>({source:r.source,id:r.id,owned:qty(r.id),targets:r.targets.map(id=>({id,owned:qty(id)}))}));
  };
})();
