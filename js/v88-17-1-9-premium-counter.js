/* BPVQ v88.17.1.9 polish — layout adapter, no gameplay or save mutations.
 * The native cooking station owns recipe, inventory, sugar/ice, grades and delivery.
 */
(function (w) {
'use strict';
const shell = document.getElementById('cp177-workshop');
const scene = document.getElementById('v88-live-scene');
const bridge = w.BPVQCookingBridge;
const station = w.BPVQCookingStation;
if (!shell || !scene || !bridge || !station || shell.dataset.premium === '1') return;
const $ = selector => shell.querySelector(selector);
const top = $('.cp177-top'), upper = $('.cp177-upper'), bench = $('.cp177-workbench');
if (!top || !upper || !bench) return;
shell.dataset.premium = '1';

// Move existing receipt and fully interactive preparation stage; never clone a control.
const stage = document.createElement('div');
stage.className = 'cp179-hero';
stage.setAttribute('aria-label', 'Phiếu đơn và bàn pha chế trà sữa');
shell.insertBefore(stage, upper);
stage.append(upper, bench);
// Topping is the physical work drawer; flavor/ice and timing controls follow it.
const originalOptions = $('.cp177-options');
const nativeActions = $('.cp177-actions');
if (originalOptions && nativeActions) shell.insertBefore(originalOptions, nativeActions);

const brand = document.createElement('div');
brand.className = 'cp179-brand';
brand.innerHTML = '<span class="cp179-brand-mascot" aria-hidden="true">🐱</span>' +
  '<span><b>Quầy Trà Sữa</b><small>Chế biến & phục vụ</small></span>';
top.prepend(brand);

// Reuse the single training button; the empty-state box is now just a small icon.
const train = $('.cp177-empty');
if (train) {
 top.append(train);
 const button = train.querySelector('.cp177-practice');
 if (button) {
   button.textContent = '🎓';
   button.setAttribute('aria-label','Tập pha chế');
   button.title = 'Tập pha chế (không tiêu hao nguyên liệu)';
 }
}

// Exactly one order heading; no duplicate large sign above the receipt.
const ticket = $('.cp177-order');
if (ticket) {
 const header = document.createElement('div');
 header.className = 'cp179-ticket-head';
 header.textContent = '🧾 Đơn hàng';
 ticket.prepend(header);
}
// Completed drink stays in the live center glass, not in an extra product card.
const status = document.createElement('div');
status.className = 'cp179-live-status';
status.setAttribute('role', 'status');
status.setAttribute('aria-live', 'polite');
bench.append(status);

let last = '';
function refresh() {
 let s;
 try { s = bridge.snapshot(); } catch { return; }
 if (!s || s.career !== 'boba') return;
 const st = station.status?.() || {};
 const done = !!s.dish?.isShaken || !!st.practice && st.stage === 'done';
 const held = !!st.handoffHeld;
 const mode = done ? (held ? 'held' : 'ready') : (st.stage || 'choose');
 const state = [s.customer?.key || '', !!st.practice, mode, s.phase].join('|');
 if (state !== last) {
  last = state;
  shell.dataset.cp179Stage = mode;
  status.textContent = st.practice ? '🎓 Đang luyện tập · Không nhận Xu' :
   done ? (held ? '✓ Đã cầm ly · Giao cho khách ở nút bên dưới' :
     '🥤 Ly đã hoàn thành · Nhấn Cầm ly bên dưới') :
   st.stage === 'pour' ? '🫖 Chạm bình để rót hoặc dừng' :
   st.stage === 'capping' ? '🎯 Canh vùng Perfect để dập nắp' :
   s.customer ? '🧋 Chọn nguyên liệu, cỡ ly và bắt đầu pha' :
   '🫖 Quầy đã sẵn sàng';
 }
}
refresh();
w.setInterval(refresh, 650);
w.BPVQPremiumCounter179 = Object.freeze({ refresh });
})(window);
