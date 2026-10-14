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
const originalPhoneOpen=window.openSmartPhoneModal;
if(typeof originalPhoneOpen==='function')window.openSmartPhoneModal=function(...args){const result=originalPhoneOpen.apply(this,args);sync();return result};
if(bridge.info().isTest)sync();
os.addRelease?.('v87.7.5.1','Phòng Thử Nghiệm có mã kích hoạt, tạo bản sao hồ sơ, chỉnh cấp/SP/Xu/bậc và mô phỏng nội dung khóa mà không sửa save chính.');
})();
