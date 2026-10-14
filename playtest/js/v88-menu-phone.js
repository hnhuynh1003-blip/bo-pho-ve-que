/* v88.16.13.2 • Đợt 2: UI Menu in existing VillageOS (not a second economy/recipe system). */
(function(){
  'use strict';
  const os=window.VillageOS, core=window.BPVQMenuV88, holder=document.getElementById('phone-app-container');
  if(!os||!core||!holder){console.warn('[v88 menu] Phone OS / core chưa sẵn sàng');return;}
  const section=document.createElement('section');
  section.id='phone-app-menu';section.className='v88-menu-app hidden';holder.appendChild(section);
  const escape=s=>String(s??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const price=v=>`${Number(v||0).toLocaleString('vi-VN')} Xu`;
  const size=id=>({cup_m:'Ly M',cup_l:'Ly L',cup_xl:'Ly XL',bowl_m:'Thố M',bowl_l:'Thố L',bowl_xl:'Thố XL',plate:'Đĩa',basket:'Mẹt',box:'Hộp'})[id]||id;
  let filter='all';
  function render(){
    const st=core.getView();
    const pending=st.pendingDay;
    const editableNow=!st.firstOpenDone&&st.day===1;
    const rows=st.recipes.filter(r=>filter==='all'||filter==='selling'?(filter==='all'||r.active.enabled):r.unlocked);
    section.innerHTML=`
      <header class="v88-menu-head"><span>📋 QUẢN LÝ QUÁN · MENU</span><h3>Thực đơn hôm nay</h3>
        <p>Giá mỗi công thức đã gồm nguyên liệu mặc định. Phần thêm được báo trước trong đơn khách.</p></header>
      <div class="v88-menu-status"><b>Ngày ${st.day} · Menu #${st.activeVersion}</b><span>${pending?`🕘 Thay đổi sẽ áp dụng từ ngày ${pending}`:editableNow?'✨ Chưa mở quán: có thể cài giá ngay':'✅ Giá hôm nay đã cố định'}</span></div>
      <div class="v88-menu-filter" role="group" aria-label="Lọc món"><button data-filter="all" ${filter==='all'?'aria-pressed="true"':''}>Tất cả</button><button data-filter="selling" ${filter==='selling'?'aria-pressed="true"':''}>Đang bán</button><button data-filter="unlocked" ${filter==='unlocked'?'aria-pressed="true"':''}>Đã mở</button></div>
      <div class="v88-menu-list">${rows.map(r=>{
        const next=r.pending||r.active;
        const locked=!r.unlocked;
        const draft=!!pending&&(r.pending?.price!==r.active.price||r.pending?.enabled!==r.active.enabled);
        const suggested=Number(r.suggested)||35;
        const minimum=Math.max(Math.ceil((Number(r.cost)||0)/5)*5,Math.floor(suggested*.9/5)*5);
        const maximum=Math.ceil(suggested*1.8/5)*5;
        return `<article class="v88-menu-item ${locked?'is-locked':''}">
          <div class="v88-menu-item-top"><div><b>${escape(r.name)}</b><small>${escape(size(r.size))} · Vốn chuẩn ~${price(r.cost)}</small></div>
          <span class="v88-menu-chip ${r.active.enabled?'on':''}">${locked?'🔒 Chưa mở':r.active.enabled?'Đang bán':'Tạm nghỉ'}</span></div>
          <div class="v88-menu-numbers"><span>Hôm nay <b>${price(r.active.price)}</b></span><span>Vốn <b>${price(r.cost)}</b></span><span>Lãi ước tính <b>${price(r.active.price-r.cost)}</b></span></div>
          <small class="v88-menu-included">Đã gồm: ${r.included.length?r.included.map(i=>`${escape(i.name)} ×${i.qty}`).join(' · '):'không topping / xiên'}. Chỉ phần gọi thêm mới phụ thu.</small>
          ${locked?'<p class="v88-menu-muted">Mở khóa công thức trong tiến trình/sổ công thức trước khi định giá.</p>':
          `<div class="v88-menu-controls">
             <label>Giá ${editableNow?'hiện tại':'ngày sau'} <input type="number" min="${minimum}" max="${maximum}" step="5" data-price="${escape(r.id)}" value="${Number(next.price)}" aria-label="Giá ${escape(r.name)}"/></label>
             <button type="button" data-save-price="${escape(r.id)}">Lưu giá</button>
             <button type="button" data-toggle="${escape(r.id)}" aria-pressed="${!!next.enabled}">${next.enabled?'Ẩn khỏi menu':'Bật bán món'}</button>
          </div><small class="v88-menu-range">Giá hợp lệ ${price(minimum)}–${price(maximum)}, bước 5 Xu.</small>
          ${draft?`<p class="v88-menu-future">🕘 Chờ ngày ${pending}: ${price(next.price)} · ${next.enabled?'Bán':'Tạm nghỉ'}</p>`:''}`}
        </article>`;
      }).join('')||'<p class="v88-menu-muted">Không có món trong bộ lọc này.</p>'}</div>
      <details class="v88-extra-section"><summary>🍡 Giá topping / xiên thêm <span>(${st.extras.length} loại) ▾</span></summary>
        <p class="v88-menu-muted">Giá dưới đây chỉ tính cho mỗi phần vượt số lượng đã gồm trong công thức. Đơn đã nhận vẫn giữ giá cũ.</p>
        <div class="v88-extra-list">${st.extras.map(e=>{
          const next=e.pending||e.active;
          const min=Math.max(5,Math.ceil(e.cost/5)*5),max=Math.max(min,Math.ceil(e.cost*2.5/5)*5);
          const waiting=!!pending&&e.pending&&e.pending.price!==e.active.price;
          return `<article class="v88-extra-row"><div class="v88-extra-label"><b>${escape(e.name)}</b><small>${e.unlocked?'Mỗi phần thêm':'🔒 Chưa mở khóa'} · Vốn ${price(e.cost)}</small></div>
            <div class="v88-extra-prices"><b>${price(e.active.price)}</b>${waiting?`<small>→ ${price(next.price)} từ ngày ${pending}</small>`:''}</div>
            ${e.unlocked?`<div class="v88-extra-edit"><input type="number" min="${min}" max="${max}" step="5" data-extra-price="${escape(e.id)}" value="${Number(next.price)}" aria-label="Phụ thu ${escape(e.name)}"/><button type="button" data-save-extra="${escape(e.id)}">Lưu</button></div>`:''}
          </article>`;
        }).join('')}</div></details>
      <p class="v88-menu-help">ⓘ Thay đổi sau khi quán mở chỉ có hiệu lực khi bạn sang ngày mới. Đơn đã nhận giữ nguyên báo giá. Giá vốn không tự đổi giá bán. Nhân viên dùng cùng báo giá; ship vẫn theo hợp đồng giao hàng cũ.</p>`;
  }
  section.addEventListener('click',e=>{
    const btn=e.target.closest('button');if(!btn)return;
    if(btn.dataset.filter){filter=btn.dataset.filter;render();return;}
    if(btn.dataset.saveExtra){
      const id=btn.dataset.saveExtra;
      const input=Array.from(section.querySelectorAll('input[data-extra-price]')).find(i=>i.dataset.extraPrice===id);
      const result=core.editExtra(id,Number(input?.value));
      if(!result.ok){window.showToast?.(result.error||'Không sửa được giá topping.','⚠️');return;}
      window.showToast?.(`Đã lưu phụ thu${result.effectiveDay>core.getView().day?` • áp dụng ngày ${result.effectiveDay}`:''}`,'🍡');
      const wasOpen=section.querySelector('.v88-extra-section')?.open;render();
      if(wasOpen)section.querySelector('.v88-extra-section').open=true;
      return;
    }
    const id=btn.dataset.savePrice||btn.dataset.toggle;if(!id)return;
    const st=core.getView(),row=st.recipes.find(r=>r.id===id);if(!row)return;
    const next=row.pending||row.active;
    let result;
    if(btn.dataset.savePrice){const input=Array.from(section.querySelectorAll('input[data-price]')).find(i=>i.dataset.price===id);result=core.edit(id,'price',Number(input?.value));}
    else result=core.edit(id,'enabled',!next.enabled);
    if(!result.ok){window.showToast?.(result.error||'Không sửa được menu.','⚠️');return;}
    window.showToast?.(`Đã lưu thực đơn${result.effectiveDay>st.day?` • áp dụng ngày ${result.effectiveDay}`:''}`,'📋');render();
  });
  window.addEventListener('bpvq:menu-updated',()=>{if(!section.classList.contains('hidden'))render();});
  os.registerApp({id:'menu',label:'Menu Quán',icon:'📋',render});
})();
