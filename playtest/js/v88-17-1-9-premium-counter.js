/* BPVQ v88.17.1.9 — premium physical counter layout.
 * Presentation only: move existing native nodes, never duplicate orders or settlement.
 * The original station owns recipe, inventory, grade, training and payments.
 */
(function(w){
'use strict';
const shell=document.getElementById('cp177-workshop');
const scene=document.getElementById('v88-live-scene');
const bridge=w.BPVQCookingBridge;
const station=w.BPVQCookingStation;
if(!shell||!scene||!bridge||!station||shell.dataset.premium==='1')return;
shell.dataset.premium='1';
const $=q=>shell.querySelector(q);
const top=$('.cp177-top'), upper=$('.cp177-upper'), bench=$('.cp177-workbench');
const hero=document.createElement('div');hero.className='cp179-hero';hero.setAttribute('aria-label','Đơn khách, bàn pha chế và khay thành phẩm');
shell.insertBefore(hero,upper);hero.append(upper,bench);
const brand=document.createElement('div');brand.className='cp179-brand';
brand.innerHTML='<span class="cp179-brand-mascot" aria-hidden="true">🐱</span><span><b>Tiệm trà sữa</b><small>Pha bằng cả trái tim ♡</small></span>';
top.prepend(brand);
// The only training control stays in the header, not as a separate full-width card.
const train=$('.cp177-empty');if(train)top.append(train);
const ticket=$('.cp177-order');
const ticketHead=document.createElement('div');ticketHead.className='cp179-ticket-head';
ticketHead.innerHTML='<span>🧾 Đơn hàng</span><span class="cp179-guest-name"></span>';
ticket.prepend(ticketHead);
const guest=document.createElement('img');guest.className='cp179-guest';guest.alt='Ảnh khách đặt hàng';guest.hidden=true;
ticket.append(guest);
const waiting=document.createElement('p');waiting.className='cp179-waiting';waiting.textContent='Chưa có đơn · Quầy đã sẵn sàng';
ticket.append(waiting);
const result=$('.cp177-result');
const resultHead=document.createElement('strong');resultHead.className='cp179-result-head';resultHead.textContent='✨ Thành phẩm';
result.prepend(resultHead);
const resultHint=document.createElement('div');resultHint.className='cp179-result-hint';
result.append(resultHint);
const categories=[
 ['topping','🧋 Topping','topping'],
 ['base','🍃 Cốt trà','base'],
 ['syrup','🥛 Sữa & siro','topping'],
 ['fruit','🍓 Trái cây','topping'],
 ['other','🍮 Khác','topping']
];
const nav=document.createElement('nav');nav.className='cp179-categories';nav.setAttribute('aria-label','Danh mục nguyên liệu');
const nativeGroups=document.getElementById('cs20-groups');
const shelf=document.getElementById('cs20-shelf');
let activeCat='topping';
for(const [kind,title] of categories){
 const btn=document.createElement('button');btn.type='button';btn.className='cp179-cat';btn.dataset.cat=kind;btn.textContent=title;
 btn.addEventListener('click',()=>{
  if(btn.disabled)return;
  activeCat=kind;
  const real=kind==='base'?'base':'topping';
  const orig=nativeGroups?.querySelector('[data-group="'+real+'"]');
  if(orig&&!orig.classList.contains('selected'))orig.click();
  renderCategories();
 });
 nav.append(btn);
}
$('.cp177-ingredients').prepend(nav);
const taste=document.createElement('div');taste.className='cp179-taste';taste.setAttribute('aria-label','Điều chỉnh độ ngọt và đá');
const selections=[
 {key:'sugar',title:'🍯 Độ ngọt',options:[['30%','Ít'],['70%','Vừa'],['100%','Ngọt']]},
 {key:'ice',title:'🧊 Đá',options:[['0%','Không'],['50%','Ít'],['100%','Nhiều']]}
];
for(const group of selections){
 const field=document.createElement('div');field.className='cp179-taste-field';
 const label=document.createElement('strong');label.textContent=group.title;field.append(label);
 const pills=document.createElement('div');pills.className='cp179-taste-pills';
 group.options.forEach(([value,name],i)=>{
  const btn=document.createElement('button');btn.type='button';btn.className='cp179-taste-choice';
  btn.dataset.meter=group.key;btn.dataset.index=String(i);btn.textContent=name+' '+value;
  btn.addEventListener('click',()=>{
   const input=document.querySelector('#cs26-meters .cs26-meter.'+group.key+' input');
   if(!input||input.disabled)return;
   input.value=String(i);input.dispatchEvent(new Event('input',{bubbles:true}));
   input.dispatchEvent(new Event('change',{bubbles:true}));
   refreshTaste();
  });
  pills.append(btn);
 });
 field.append(pills);taste.append(field);
}
$('.cp177-options').prepend(taste);
const actionFooter=$('.cp177-actions');
const help=document.createElement('button');help.type='button';help.className='cp179-help';
help.textContent='❔ Hướng dẫn';
help.addEventListener('click',()=>{
 const target=document.querySelector('#cs20-station .cs33-help summary, #cp177-workshop .cs33-help summary');
 if(target)target.click();
});
actionFooter.prepend(help);
const statusLine=document.createElement('div');statusLine.className='cp179-live-status';
statusLine.setAttribute('role','status');statusLine.setAttribute('aria-live','polite');
$('.cp177-workbench').append(statusLine);
function filterCat(id,cat){
 if(cat==='topping'||cat==='base')return true;
 if(cat==='syrup')return /syrup|milk|cream|cheese|foam/i.test(id);
 if(cat==='fruit')return /peach|lychee|aloe|strawberry|fruit|mango|berry/i.test(id);
 if(cat==='other')return /pudding|redbean|mochi|cookie|crystal|grass|jelly/i.test(id);
 return true;
}
function renderCategories(){
 const selected=activeCat;
 const real=selected==='base'?'base':'topping';
 const current=nativeGroups?.querySelector('.cs20-group.selected')?.dataset.group;
 if(current&&current!==real){
  const orig=nativeGroups.querySelector('[data-group="'+real+'"]');
  if(orig)orig.click();
 }
 const all=shelf?.querySelectorAll('.cs20-item')||[];
 let shown=0;
 all.forEach(el=>{
  const ok=filterCat(el.dataset.item||'',selected);
  el.hidden=!ok;if(ok)shown++;
 });
 nav.dataset.empty=String(shown===0);
 nav.querySelectorAll('button').forEach(b=>{
  b.classList.toggle('selected',b.dataset.cat===selected);
  b.setAttribute('aria-pressed',String(b.dataset.cat===selected));
 });
}
function refreshTaste(){
 for(const btn of taste.querySelectorAll('button')){
  const input=document.querySelector('#cs26-meters .cs26-meter.'+btn.dataset.meter+' input');
  const selected=input?.value===btn.dataset.index;
  btn.classList.toggle('selected',!!selected);
  btn.setAttribute('aria-pressed',String(!!selected));
  btn.disabled=!input||!!input.disabled;
 }
}
let lastKey='',lastStage='',lastCat='',lastItems='';
function refresh(){
 let s;try{s=bridge.snapshot()}catch{return}
 if(!s||s.career!=='boba')return;
 const st=station.status?.()||{};
 const ready=!!(s.dish?.isShaken||st.practice&&st.stage==='done');
 const held=!!st.handoffHeld;
 const key=String(s.customer?.key||'idle')+'|'+String(st.practice||false);
 const fullStage=ready?(held?'held':'ready'):String(st.stage||'choose');
 if(key!==lastKey||fullStage!==lastStage){
  lastKey=key;lastStage=fullStage;
  shell.dataset.cp179Stage=fullStage;
  resultHint.textContent=ready?(held?'✓ Đã cầm ly — hãy giao khách':'Chạm Cầm ly để mang cho khách'):'Pha xong, ly sẽ đặt ở đây';
  statusLine.textContent=st.practice?'🎓 Luyện tập · Không nhận Xu hoặc XP':
    ready?(held?'🥤 Ly đã được cầm — sẵn sàng giao!':'✨ Ly đã hoàn tất! Nhận ly trên khay') :
    st.stage==='pour'?'🫖 Đang rót trà vào ly...':
    st.stage==='capping'?'🎯 Canh vùng Perfect để dập nắp':'🍃 Chọn nguyên liệu và pha theo đơn khách';
 }
 const name=s.customer?.name||'';
 const nameEl=$('.cp179-guest-name');if(nameEl.textContent!==name)nameEl.textContent=name;
 waiting.hidden=!!s.customer||!!st.practice;
 const art=s.customer?.art||'';
 if(art&&guest.src!==new URL(art,document.baseURI).href)guest.src=art;
 guest.hidden=!art||!!st.practice;
 const items=(s.catalog||[]).map(x=>x.id).join('|');
 const nativeSelected=nativeGroups?.querySelector('.cs20-group.selected')?.dataset.group;
 if(items!==lastItems||lastCat!==activeCat||(nativeSelected&&nativeSelected!==(activeCat==='base'?'base':'topping'))){
   lastItems=items;lastCat=activeCat;renderCategories();
 }else {
   // Native shelf can be rebuilt after a customer changes without changing catalog IDs.
   for(const el of shelf?.querySelectorAll('.cs20-item')||[])el.hidden=!filterCat(el.dataset.item||'',activeCat);
 }
 refreshTaste();
 const practice=$('.cp177-practice');if(practice)practice.title='Luyện tập không tốn nguyên liệu';
}
refresh();
w.setInterval(refresh,550);
w.BPVQPremiumCounter179=Object.freeze({refresh});
})(window);
