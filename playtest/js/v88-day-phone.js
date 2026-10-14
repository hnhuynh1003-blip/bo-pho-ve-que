/* v88.16.13.4 - Sổ kinh doanh: read-only dashboard, one explicit repay action. */
(function(){
  'use strict';
  const os=window.VillageOS, api=window.BPVQDayV88,holder=document.getElementById('phone-app-container');
  if(!os||!api||!holder)return;
  const app=document.createElement('section');app.id='phone-app-daybook';app.className='hidden v88-daybook-app';
  holder.appendChild(app);
  const fmt=n=>Math.max(0,Math.round(Number(n)||0)).toLocaleString('vi-VN');
  function render(){
    const s=api.summary();
    const labels={counter:'Tại quầy',delivery:'Online'};
    app.innerHTML=`<div class="v88-daybook-head"><small>📅 QUẢN LÝ QUÁN</small><h3>Sổ kinh doanh · Ngày ${s.day}</h3><p>Bậc ${s.stage} · ${s.phase==='open'?'Đang mở bán':s.phase==='closed'?'Đã đóng ca':'Đang chuẩn bị'}</p></div>
      <div class="v88-daybook-grid">
        <article><span>🙋 Lượt khách quầy</span><strong>${s.counterRemaining}/${s.counterCap}</strong><small>Đã phát ${s.issuedCounter} lượt</small></article>
        <article><span>🛵 Đơn ship</span><strong>${s.deliveryRemaining}/${s.deliveryCap}</strong><small>Đã phát ${s.issuedDelivery} lượt</small></article>
      </div>
      <p class="v88-daybook-hint">Khách xem giá rồi bỏ đi hoặc hết giờ vẫn dùng một lượt. Giá Menu, độ nổi tiếng và sự kiện ảnh hưởng khả năng mua; không sinh khách vượt giới hạn. Dự kiến ${s.demandPct}% khách cân nhắc đặt món theo giá hiện tại.</p>
      <div class="v88-daybook-finance"><h4>📒 Tổng quan cuối ngày</h4>
        <div><span>Doanh thu đã ghi</span><b>+${fmt(s.income)} Xu</b></div>
        <div><span>Phí vận hành (đã gồm lương)</span><b>${fmt(s.opCosts)} Xu</b></div>
        <div><span>Trong đó lương</span><b>${fmt(s.wages)} Xu</b></div>
        <div><span>Lãi vay ước tính</span><b>${fmt(s.interest)} Xu</b></div>
        <div><span>Nợ lương cũ</span><b>${fmt(s.oldWageArrears)} Xu</b></div>
        <div><span>Nợ vận hành chưa thanh toán</span><b>${fmt(s.operatingArrears)} Xu</b></div>
      </div>
      ${s.operatingArrears?'<button type="button" id="v88-daybook-repay">💰 Trả khoản phí vận hành đang nợ</button>':''}
      <details class="v88-daybook-history"><summary>📖 Lịch sử quyết toán</summary>${s.history.length?s.history.map(h=>`<div>Ngày ${h.day}: Đã thanh toán ${fmt(h.paid)} Xu · thiếu phí ${fmt(h.unpaidOperating)} Xu · thiếu lương ${fmt(h.unpaidWages)} Xu</div>`).join(''):'<p>Chưa có ngày nào được quyết toán ở bản này.</p>'}</details>
      <button type="button" id="v88-daybook-refresh">↻ Cập nhật thông tin</button>`;
    app.querySelector('#v88-daybook-refresh')?.addEventListener('click',render);
    app.querySelector('#v88-daybook-repay')?.addEventListener('click',()=>{
      const result=api.payOperatingArrears();
      window.showToast?.(result.ok?`Đã trả ${fmt(result.paid)} Xu công nợ.`:result.error,result.ok?'✅':'⚠️');render();
    });
  }
  os.registerApp({id:'daybook',label:'Sổ Kinh Doanh',icon:'📒',render});
  window.addEventListener('bpvq:menu-updated',()=>{if(!app.classList.contains('hidden'))render()});
})();
