/* Interactive counter prototype — presentation only, native station owns actions. */
(function(w){
'use strict';
const shell=document.getElementById('cp177-workshop'),bridge=w.BPVQCookingBridge,station=w.BPVQCookingStation;
if(!shell||!bridge||!station)return;
const q=s=>shell.querySelector(s),hero=q('.cp179-hero'),bench=q('.cp177-workbench'),order=q('.cp177-order'),ingredients=q('.cp177-ingredients'),options=q('.cp177-options'),actions=q('.cp177-actions');
if(!hero||!bench||!order||!ingredients||!options||!actions)return;
shell.dataset.interactive='1';
const equipment=document.createElement('section');equipment.className='cp180-equipment';equipment.setAttribute('aria-label','Thiết bị pha chế');
const size=q('.cp178-size-slot'),pour=q('#cp177-pour-object');
equipment.append(size,pour);
const cap=document.createElement('button');cap.type='button';cap.className='cp180-cap';cap.textContent='▣ Máy dập nắp';equipment.append(cap);
cap.addEventListener('click',()=>{const b=document.getElementById('cs20-primary');if(b&&!b.disabled&&['cap-start','cap-hit'].includes(b.dataset.act))b.click();});
hero.before(equipment);
const receipt=document.createElement('div');receipt.className='cp180-receipt';order.prepend(receipt);
const applied=document.createElement('div');applied.className='cp180-applied';bench.append(applied);
const lower=document.createElement('div');lower.className='cp180-lower-title';lower.textContent='Đường và đá · Chạm để thêm';options.prepend(lower);
const pantryTitle=document.createElement('div');pantryTitle.className='cp180-pantry-title';pantryTitle.textContent='Khay nguyên liệu · Chọn cốt trà / topping & siro';ingredients.prepend(pantryTitle);
const label=(s,id)=>s.label?.[id]||id||'Chưa chọn';
const pct=n=>n==null?'Chưa thêm':n+'%';
const cup=id=>({cup_m:'M',cup_l:'L',cup_xl:'XL'}[id]||'Chưa chọn');
const portions=(s,d)=>Object.entries(d.toppingPortions||{}).filter(([,n])=>n>0).map(([id,n])=>label(s,id)+' ×'+n).join(' · ')||'Không có';
let last='';
function render(){
 const s=bridge.snapshot();if(s.career!=='boba')return;
 const st=station.status(),d=station.presentation?.().dish||s.dish||{},r=s.customer?.order;
 const primary=document.getElementById('cs20-primary');
 cap.disabled=!primary||primary.disabled||!['cap-start','cap-hit'].includes(primary.dataset.act);
 cap.textContent=primary?.dataset.act==='cap-hit'?'▣ Dập nắp ngay!':'▣ Máy dập nắp';
 cap.classList.toggle('active',primary?.dataset.act==='cap-hit');
 const stamp=JSON.stringify([r,s.customer?.name,Math.ceil(s.customer?.patience||0),d,st.practice]);
 if(stamp===last)return;last=stamp;
 receipt.replaceChildren();
 const title=document.createElement('b');title.textContent=st.practice?'Luyện tập · Không tính Xu':r?'Đơn khách: '+s.customer.name+' · '+Math.ceil(s.customer.patience)+'s':'Chưa có đơn khách';receipt.append(title);
 if(r&&!st.practice){const info=document.createElement('div');info.textContent='Ly '+cup(r.container)+' · '+label(s,r.base)+' | Đường '+pct(r.sugar)+' · Đá '+pct(r.ice);receipt.append(info);const toppings=document.createElement('div');toppings.textContent='Topping: '+portions(s,{toppingPortions:r.toppingPortions||Object.fromEntries((r.toppings||[]).map(id=>[id,1]))});receipt.append(toppings);}
 applied.textContent='Ly đang pha: '+cup(d.container)+' · Cốt chọn: '+label(s,d.selectedBase)+' · Đã rót: '+Math.round(d.pourAmount||0)+'% · Đường '+pct(d.sugar)+' · Đá '+pct(d.ice);
}
render();w.setInterval(render,200);
})(window);
