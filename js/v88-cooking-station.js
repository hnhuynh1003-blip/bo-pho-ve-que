/* BPVQ v88 Cooking Station 2.0: portrait-first gameplay controls.
   Core game keeps all order settlement, inventory and save ownership. */
(function(w){
'use strict';
const bridge=w.BPVQCookingBridge, root=document.getElementById('cs20-station');
if(!bridge||!root)return;
const $=id=>root.querySelector('#'+id);
const groups={
 boba:[['size','Chọn ly'],['base','Cốt trà'],['topping','Topping'],['flavor','Điều vị']],
 noodle:[['size','Chọn thố'],['base','Nước cốt'],['topping','Topping'],['flavor','Cấp cay']],
 streetfood:[['size','Chọn khay'],['skewer','Chọn xiên'],['sauce','Nước sốt']]
};
let ui={key:'',career:'',group:'',stage:'choose',pour:0,heat:0,hold:0,flip:false,sauce:false,stir:0,craft:0,notice:'',lastTick:0,started:0,painted:'',active:false,delivering:false};
let current=null;
// Training is ephemeral and never calls native inventory / payment / save mutators.
let practiceDish=null,practiceNumber=0;
const clone=o=>JSON.parse(JSON.stringify(o));
function view(){
 const live=bridge.snapshot();
 if(practiceDish && (live.customer || live.phase==='open'))practiceDish=null;
 if(practiceDish){return {...live,phase:'open',pause:false,practice:true,customer:{key:'practice:'+practiceNumber,name:'Tập chế biến',description:'Thử chế biến tự do, không nhận thưởng',patience:90,maxPatience:90},dish:practiceDish,cost:0,stockStamp:'practice:'+JSON.stringify(practiceDish)};}
 return live;
}
function practiceSelect(group,key,delta){
 const d=practiceDish;if(!d)return false;
 const kind=current.career;
 if(group==='sugar'&&kind==='boba')d.sugar=Number(key);
 else if(group==='ice'&&kind==='boba')d.ice=Number(key);
 else if(group==='spice'&&kind==='noodle')d.spicyLevel=Number(key);
 else if(group==='container'){
  if(kind==='streetfood')d.tray=({tray_plate:'plate',tray_basket:'basket',tray_box:'box'}[key])||'plate';
  else d.container=key;
 }else if(group==='base')d.base=key;
 else if(group==='sauce')d.sauce=key;
 else if(group==='topping'){
  if(kind==='streetfood')d.skewerCounts[key]=Math.max(0,Number(d.skewerCounts[key]||0)+Math.sign(delta||1));
  else {const n=d.toppings.indexOf(key);if(n>=0)d.toppings.splice(n,1);else d.toppings.push(key);}
 }
 d.isShaken=false;d.isCooked=false;d.fryState='unfried';d.fryProgress=0;
 return true;
}

const tabs=$('cs20-groups'),shelf=$('cs20-shelf'),stage=$('cs20-stage'),primary=$('cs20-primary');
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
function safe(t){return String(t==null?'':t)}
function setNotice(s){ui.notice=s;const n=$('cs20-feedback'); if(n)n.textContent=s;}
function reset(key,career){
 ui={key,career,group:groups[career]?.[0][0]||'size',stage:'choose',pour:0,heat:0,hold:0,flip:false,sauce:false,stir:0,craft:0,notice:'Chọn nguyên liệu rồi thao tác trực tiếp với món nhé!',lastTick:performance.now(),started:0,painted:'',active:false,delivering:false};
 renderGroups();
}
function itemsFor(s,group){
 const catalog=s.catalog || [];
 if(group==='size')return catalog.filter(x=>x.group==='container');
 if(group==='base')return catalog.filter(x=>x.group==='base');
 if(group==='topping')return catalog.filter(x=>x.group==='topping');
 if(group==='sauce')return catalog.filter(x=>x.group==='sauce');
 if(group==='skewer')return catalog.filter(x=>x.group==='topping');
 return [];
}
function selected(s,x){
 const d=s.dish;
 if(x.group==='container')return d.container===x.id || ({plate:'tray_plate',basket:'tray_basket',box:'tray_box'}[d.tray]===x.id);
 if(x.group==='base')return d.base===x.id;
 if(x.group==='sauce')return d.sauce===x.id;
 if(x.group==='topping')return s.career==='streetfood'?Number(d.skewerCounts[x.id]||0)>0:d.toppings.includes(x.id);
 return false;
}
function renderGroups(){ tabs.replaceChildren(); (groups[ui.career]||[]).forEach(([key,label])=>{
 const b=document.createElement('button');b.type='button';b.className='cs20-group'+(ui.group===key?' selected':'');b.textContent=label;b.setAttribute('aria-pressed',ui.group===key?'true':'false');b.addEventListener('click',()=>{ui.group=key;renderGroups();renderShelf();});tabs.append(b);
 }); }
function emitSelection(x,delta){
 if(!current)return;
 if(practiceDish){if(!x.unlocked)return;practiceSelect(x.group,x.id,delta);}else{if(!bridge.choose(x.group,x.id,delta))return;}
 ui.stage='choose';ui.pour=0;ui.hold=0;ui.heat=0;ui.flip=false;ui.sauce=false;ui.stir=0;ui.craft=0;
 setNotice('Đã đổi thành phần. Chế biến lại để món đạt chuẩn.');
 refresh(true);
}
function renderShelf(){
 if(!current)return;
 shelf.replaceChildren();
 if(ui.group==='flavor'){
   const isB=ui.career==='boba';const options=isB?[['Đường','sugar',[30,70,100],'%'],['Đá','ice',[0,50,100],'%']]:[['Cấp cay','spice',[0,1,2,3,4,5,6,7],'']];
   options.forEach(([label,kind,values,suffix])=>{const box=document.createElement('div');box.className='cs20-flavor';const heading=document.createElement('span');heading.textContent=label;box.append(heading);values.forEach(v=>{const b=document.createElement('button');b.type='button';b.className='cs20-pill'+((kind==='spice'?current.dish.spicyLevel:current.dish[kind])===v?' picked':'');b.textContent=v+suffix;b.addEventListener('click',()=>{if(practiceDish)practiceSelect(kind,v,1);else bridge.choose(kind,v);ui.stage='choose';ui.heat=0;ui.pour=0;ui.hold=0;ui.stir=0;refresh(true);});box.append(b)});shelf.append(box)});return;
 }
 const data=itemsFor(current,ui.group);
 data.forEach(x=>{
  const b=document.createElement('button');b.type='button';b.className='cs20-item'+(selected(current,x)?' picked':'');b.disabled=!x.unlocked;b.title=x.name+(x.unlocked?' · Còn '+x.stock:' · Chưa mở khóa');
  const emoji=document.createElement('span');emoji.className='cs20-item-icon';emoji.textContent=x.icon||({container:'🥣',base:'🫖',topping:'✨',sauce:'🥣'}[x.group]);
  const name=document.createElement('span');name.className='cs20-item-name';name.textContent=x.name;
  const count=document.createElement('span');count.className='cs20-item-stock';count.textContent=x.unlocked?'📦 '+x.stock:'🔒';b.append(emoji,name,count);
  b.addEventListener('click',()=>emitSelection(x,1));shelf.append(b);
  if(ui.career==='streetfood'&&ui.group==='skewer'&&current.dish.skewerCounts[x.id]){
   const qty=document.createElement('button');qty.type='button';qty.className='cs20-qty';qty.textContent='− 1';qty.setAttribute('aria-label','Bớt một '+x.name);qty.addEventListener('click',()=>emitSelection(x,-1));shelf.append(qty);
  }
 });
}
function buildVisual(s){
 const d=s.dish;
 let svg='';
 if(s.career==='boba'){
   const baseColor={'tea_black':'#a86d3e','tea_green':'#9eae72','tea_strawberry':'#df88a1','tea_taro':'#ac93bd','milk_fresh':'#e8dcc7','tea_honey':'#d3a45a'}[d.base]||'#ac8a5d';
   const fill=ui.pour>0?Math.max(3,ui.pour):d.isShaken?78:8;
   const y=153-fill*1.1;
   const circles=(d.toppings||[]).slice(0,5).map((t,i)=>`<circle cx="${68+(i%3)*24}" cy="${137-Math.floor(i/3)*17}" r="${t.includes('boba')?8:6}" fill="${t.includes('boba')?'#49312c':'#f8e7be'}" stroke="#c9ac80" stroke-width="1"/>`).join('');
   svg=`<defs><clipPath id="cs20-cup-clip"><path d="M50 32 H150 L140 157 Q100 169 60 157 Z"/></clipPath></defs><ellipse cx="101" cy="169" rx="62" ry="7" fill="#aa8c5e" opacity=".22"/><path d="M50 32 H150 L140 157 Q100 169 60 157 Z" fill="#fff5df" fill-opacity=".7" stroke="#b69060" stroke-width="3"/><g clip-path="url(#cs20-cup-clip)"><rect x="46" y="${y}" width="110" height="165" fill="${baseColor}"/><path d="M55 ${y+4} Q85 ${y-8} 113 ${y+5} T149 ${y+4}" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="4"/>${circles}</g><path d="M49 32 H151" stroke="#a77744" stroke-width="5" stroke-linecap="round"/><path d="M60 59 Q52 108 68 143" stroke="#fff" stroke-width="7" fill="none" opacity=".45" stroke-linecap="round"/><path d="M131 30 L157 8" stroke="#689477" stroke-width="7" stroke-linecap="round"/>`;
 }else if(s.career==='noodle'){
   const bubbles=Array.from({length:Math.floor(ui.heat/14)},(_,i)=>`<circle cx="${62+(i%4)*24}" cy="${107-(i%3)*15}" r="${3+(i%3)*2}" fill="#fff4cf" opacity=".8"/>`).join('');
   const tops=d.toppings.slice(0,7).map((t,i)=>`<ellipse cx="${67+(i%4)*20}" cy="${103+Math.floor(i/4)*16}" rx="9" ry="5" fill="${['#7caa57','#eedc9a','#c88462','#9fca86'][i%4]}"/>`).join('');
   svg=`<ellipse cx="101" cy="164" rx="75" ry="10" fill="#a76f45" opacity=".18"/><path d="M38 67 Q100 43 162 67 L149 145 Q101 173 50 145 Z" fill="#a9654c" stroke="#7c4035" stroke-width="4"/><ellipse cx="100" cy="75" rx="65" ry="25" fill="#603b2d" stroke="#b87a4d" stroke-width="5"/><ellipse cx="100" cy="76" rx="55" ry="18" fill="${ui.heat>80?'#e67a31':'#dd9c59'}"/>${tops}${bubbles}<path d="M58 45 Q44 27 57 14 M102 41 Q87 24 102 11 M145 43 Q131 25 145 13" stroke="#b6bdbe" stroke-width="5" opacity="${ui.heat>45?.75:.15}" fill="none" stroke-linecap="round"/><path d="M55 161 L71 172 L128 172 L145 161" stroke="#e79743" stroke-width="5" stroke-linecap="round" opacity="${ui.heat>20?.8:0}"/>`;
 }else{
   let rows='';const entries=Object.entries(d.skewerCounts||{}).filter(x=>x[1]>0).slice(0,4);
   entries.forEach(([key,n],i)=>{ const yy=64+i*25; rows+=`<line x1="33" y1="${yy}" x2="165" y2="${yy}" stroke="#c9a66a" stroke-width="5" stroke-linecap="round"/>`;
     for(let j=0;j<Math.min(n,5);j++)rows+=`<rect x="${49+j*19}" y="${yy-9}" width="14" height="18" rx="5" fill="${d.fryState==='perfect'?'#c57f3a':ui.flip?'#d28a4a':'#d7a26e'}" stroke="#8d5438" stroke-width="1"/>`;
   });
   svg=`<rect x="19" y="43" width="162" height="117" rx="15" fill="#6d6660" stroke="#51473e" stroke-width="6"/><rect x="29" y="52" width="142" height="97" rx="8" fill="#493d36"/>${Array.from({length:7},(_,i)=>`<line x1="${36+i*21}" y1="53" x2="${36+i*21}" y2="147" stroke="#99897a" stroke-width="2"/>`).join('')}<path d="M35 145 Q52 132 67 143 T105 143 T145 143" stroke="#f49d52" stroke-width="5" fill="none" opacity="${ui.stage==='grilling'?.9:.2}"/>${rows}`;
 }
 return `<svg viewBox="0 0 200 180" role="img" aria-label="Món ${s.career==='boba'?'trà sữa':s.career==='noodle'?'mì cay':'xiên que'} đang chế biến">${svg}</svg>`;
}
function renderDish(){
 if(!current)return;
 const s=current,d=s.dish;
 const name=s.career==='boba'?'Ly trà đang pha':s.career==='noodle'?'Thố mì đang nấu':'Vỉ xiên đang nướng';
 $('cs20-dish-name').textContent=name;
 const mat=s.career==='streetfood'?Object.values(d.skewerCounts).reduce((a,b)=>a+Number(b||0),0)+' xiên · '+(s.label[d.sauce]||'Sốt'):(s.label[d.base]||'Nước cốt')+' · '+d.toppings.length+' topping';
 $('cs20-dish-detail').textContent=mat;
 const visual=$('cs20-visual'); visual.innerHTML=buildVisual(s);
 $('cs20-valuation').textContent=s.practice?'🎓 Luyện tập · Kho và Xu không đổi':`Vốn ${s.cost} Xu`;
 $('cs20-profit').textContent=`Lãi dự kiến ${Math.round(Number(d.listedPrice)-Number(s.cost))} Xu`;
 $('cs20-sale-price').textContent=`${d.listedPrice} Xu`;
 const progress=s.career==='boba'?(ui.pour?ui.pour:0):s.career==='noodle'?ui.heat:d.fryProgress;
 $('cs20-gauge').style.width=clamp(progress,0,100)+'%';
 $('cs20-gauge-label').textContent=s.career==='boba'?`Lượng rót ${Math.round(ui.pour)}%`:s.career==='noodle'?`Nhiệt ${Math.round(ui.heat)}% · Giữ nhịp ${ui.hold.toFixed(1)}s`:`Độ chín ${Math.round(d.fryProgress||0)}%`;
 $('cs20-craft').textContent=ui.craft>0?`✨ Dấu ấn ${Math.round(ui.craft*100)}% (chỉ hiển thị)`:'✨ Tạo dấu ấn món của riêng bạn';
}
function renderAction(){
 const ready=current?.dish?.isShaken||current?.dish?.isCooked||current?.dish?.fryState==='perfect';
 const d=current?.dish||{};
 let label='',secondary='',disabled=false;
 if(!current?.customer){label=current?.phase==='open'?'Đang chờ khách…':'Mở quán để đón khách';disabled=true;}
 else if(ready){label=safe(current?.practice?'✨ Hoàn thành bài luyện':'✨ Giao món cho khách');secondary='send';}
 else if(ui.career==='boba'){
  if(ui.stage==='choose'||ui.stage==='pour'){label=ui.active?'⏹ Dừng rót':'🫖 Rót trà vào ly';secondary='pour';}
  else if(ui.stage==='mix'){label=`🥤 Lắc hòa vị · ${ui.stir}/3`;secondary='mix';}
  else {label='Đang dập nắp…';disabled=true;}
 } else if(ui.career==='noodle'){
  label=ui.stage==='cook'?'🔥 Tăng lửa / Giữ nhiệt':ui.stage==='heating'?'Đang bày món…':'🔥 Bắt đầu nấu';secondary='heat';disabled=ui.stage==='heating';
 }else{
  if(ui.stage==='choose'){label='🔥 Đặt xiên lên vỉ';secondary='grill';}
  else if(ui.stage==='grilling'){
   label=d.fryProgress>=65&&d.fryProgress<=90?'🥢 Vớt mẻ xiên':'🔥 Đang nướng — canh nhiệt';secondary=d.fryProgress>=65&&d.fryProgress<=90?'pull':'watch';disabled=secondary==='watch';
  }else{label='Đang hoàn thiện…';disabled=true;}
 }
 primary.textContent=label;primary.disabled=disabled;primary.dataset.act=secondary;
 $('cs20-flip').hidden=!(ui.career==='streetfood'&&ui.stage==='grilling');
 $('cs20-sauce').hidden=!(ui.career==='streetfood'&&ui.stage==='grilling');
 $('cs20-flip').disabled=ui.flip; $('cs20-sauce').disabled=ui.sauce;
 $('cs20-undo').disabled=!current?.customer||ui.delivering;
}
function endPour(){
 if(!ui.active)return;
 ui.active=false;ui.stage='mix';ui.craft=.55*clamp(1-Math.abs(ui.pour-72)/50,0,1);
 setNotice(ui.pour>=48&&ui.pour<=92?'Dòng trà đã đều! Hãy lắc hòa vị 3 nhịp.':'Ly hơi lệch vạch, vẫn có thể phục vụ. Thử rót chuẩn hơn ở đơn sau.');
 renderDish();renderAction();
}
function pour(){
 if(ui.active){endPour();return;}
 if(ui.stage==='mix')return;
 ui.stage='pour';ui.active=true;ui.lastTick=performance.now();setNotice('Nhấn Dừng rót khi nước gần vạch 72%. Có thể chạm giữ nút.');renderAction();
}
function markReady(){
 if(ui.career==='boba'){ui.stage='finishing';if(practiceDish)practiceDish.isShaken=true;else bridge.complete('boba');}
 else if(ui.career==='noodle'){ui.stage='heating';if(practiceDish)practiceDish.isCooked=true;else bridge.complete('noodle');}
 else if(ui.career==='streetfood'){ui.stage='done';if(practiceDish)practiceDish.fryState=practiceDish.fryProgress>=65&&practiceDish.fryProgress<=90?'perfect':'burnt';else bridge.complete('streetfood');}
}
function primaryAction(){
 if(!current?.customer||ui.delivering)return;
 const a=primary.dataset.act;
 if(a==='send'){
  if(practiceDish){practiceDish=null;ui.delivering=false;refresh(true);return;}
  // Native settlement is single source of truth; this session never changes economy directly.
  if(ui.delivering)return;ui.delivering=true;
  const ok=bridge.deliver(); if(!ok){ui.delivering=false;setNotice('Vui lòng kiểm tra tồn kho và đúng trạng thái đơn trước khi giao.');}
  else {setNotice('Đã giao món — đang chờ khách tiếp theo.');}
  refresh(true);return;
 }
 if(a==='pour'){pour();return;}
 if(a==='mix'){
  ui.stir++; setNotice(`Lắc nhịp ${ui.stir}/3 — phần thưởng là sự khéo léo, không tự cộng Xu.`);
  if(ui.stir>=3){ui.craft=clamp(ui.craft+.45,0,1);markReady();}
  renderAction();return;
 }
 if(a==='heat'){
  if(ui.stage==='choose'){ui.stage='cook';ui.heat=25;ui.hold=0;ui.lastTick=performance.now();setNotice('Chạm tăng lửa, giữ nhiệt ổn định trong vùng 58–82%.');}
  else if(ui.stage==='cook'){ui.heat=clamp(ui.heat+23,0,100);}
  renderAction();return;
 }
 if(a==='grill'){
  if(Object.values(current.dish.skewerCounts).reduce((a,b)=>a+Number(b),0)<1){setNotice('Chọn ít nhất một que xiên trước khi nướng.');return;}
  ui.stage='grilling';ui.flip=false;ui.sauce=false;ui.lastTick=performance.now();if(practiceDish){practiceDish.fryProgress=0;practiceDish.fryState='unfried';}else bridge.complete('startGrill');setNotice('Lật xiên, quét sốt và vớt khi độ chín xanh.');renderAction();return;
 }
 if(a==='pull'){
  if(practiceDish){practiceDish.fryState='perfect';}else bridge.complete('streetfood');ui.stage='done';ui.craft=clamp((ui.flip?.5:0)+(ui.sauce?.5:0),0,1);
  setNotice('Mẻ xiên đã ra vỉ. Có thể giao khi đã chín đạt.');refresh(true);return;
 }
}
let holdTimer=0, suppressClick=false;
primary.addEventListener('click',e=>{if(suppressClick){suppressClick=false;return;}primaryAction();});
primary.addEventListener('pointerdown',e=>{if(primary.dataset.act!=='pour'||primary.disabled)return;
  // Native pointer events enable hold to pour; touch tap also works using click fallback.
  if(ui.active)endPour();else pour();holdTimer=performance.now();suppressClick=true;
});
primary.addEventListener('pointerup',()=>{if(!holdTimer)return;const t=performance.now()-holdTimer;if(t>240&&ui.active)endPour();holdTimer=0;});
$('cs20-flip').addEventListener('click',()=>{if(ui.stage!=='grilling')return;ui.flip=true;setNotice('Đã trở xiên đều mặt.');renderAction();});
$('cs20-sauce').addEventListener('click',()=>{if(ui.stage!=='grilling')return;ui.sauce=true;setNotice('Đã phủ sốt! Canh vớt khi vàng đều.');renderAction();});
$('cs20-price-down').addEventListener('click',()=>{if(!practiceDish)bridge.adjustPrice(-5);refresh(true);});
$('cs20-price-up').addEventListener('click',()=>{if(!practiceDish)bridge.adjustPrice(5);refresh(true);});
$('cs20-undo').addEventListener('click',()=>{if(ui.delivering)return;if(practiceDish)practiceDish=clone(bridge.snapshot().dish);else bridge.reset();reset(ui.key,ui.career);refresh(true);});
function refresh(force=false){
 const s=view();current=s;
 const key=s.customer?.key||`idle:${s.phase}:${s.career}`;
 if(key!==ui.key||s.career!==ui.career){reset(key,s.career);force=true;}
 const hasOrder=!!s.customer;
 root.dataset.state=s.practice?'practice':hasOrder?'order':'idle';root.dataset.career=s.career;root.closest('#tab-shop')?.classList.toggle('cs20-active-order',hasOrder&&!s.practice);const courtyard=document.getElementById('v88-live-scene');if(courtyard)courtyard.dataset.cs20Compact=hasOrder?'true':'false';
 $('cs20-customer-name').textContent=hasOrder?s.customer.name:s.phase==='open'?'Đang đợi khách ghé quán':'Quán đang nghỉ ca';
 $('cs20-order-text').textContent=hasOrder?s.customer.description:'Mở Quán ở phía trên để nhận đơn. Quầy chế biến sẽ sẵn sàng khi khách đến.';
 $('cs20-order-time').textContent=hasOrder?`${Math.ceil(s.customer.patience)}s`:'—';
 if(force || ui.painted!==JSON.stringify([s.career,s.dish,s.customer?.key,s.stockStamp,ui.group])){
   ui.painted=JSON.stringify([s.career,s.dish,s.customer?.key,s.stockStamp,ui.group]);renderShelf();
 }
 if(s.career==='boba'&&s.dish.isShaken&&ui.stage==='finishing')setNotice('Ly đã dập nắp. Sẵn sàng giao món!');
 if(s.career==='noodle'&&s.dish.isCooked&&ui.stage==='heating')setNotice('Thố mì đã chín. Sẵn sàng giao!');
 if(s.career==='streetfood'&&ui.stage==='grilling'&&s.dish.fryState==='burnt')setNotice('Xiên đã bị cháy — làm lại hoặc giao món chất lượng thấp.');
 renderDish();renderAction();
}
function animate(t){
 const dt=Math.min(.07,(t-(ui.lastTick||t))/1000);ui.lastTick=t;
 if(current?.pause || current?.phase!=='open' || !current?.customer || current?.customer?.patience<=0){w.requestAnimationFrame(animate);return;}
 if(ui.active){ui.pour=clamp(ui.pour+dt*35,0,100);if(ui.pour>=100)endPour();}
 if(ui.stage==='cook'){
   ui.heat=clamp(ui.heat-dt*7,0,100);
   if(ui.heat>58&&ui.heat<82)ui.hold+=dt;else ui.hold=Math.max(0,ui.hold-dt*1.6);
   if(ui.heat>97){ui.heat=29;ui.hold=0;setNotice('Nước sôi quá mạnh, hạ lửa để lấy lại nhịp!');}
   if(ui.hold>=1.0){ui.craft=clamp(1-Math.abs(ui.heat-70)/50,0,1);markReady();setNotice('Nhịp lửa chuẩn! Thố mì đang hoàn thiện.');}
 }
 if(practiceDish&&ui.stage==='grilling'){
    practiceDish.fryProgress=clamp(Number(practiceDish.fryProgress||0)+dt*25,0,100);
    if(practiceDish.fryProgress>=100)practiceDish.fryState='burnt';
 }
 if(ui.stage==='grilling'&&!practiceDish && (t-(ui.grillSyncedAt||0))>100){ui.grillSyncedAt=t;refresh(false);}
 else if(ui.active||ui.stage==='cook'||(practiceDish&&ui.stage==='grilling')){renderDish();renderAction();}
 w.requestAnimationFrame(animate);
}
root.hidden=false;root.closest('#tab-shop')?.classList.add('cs20-enabled');setNotice(ui.notice);refresh(true);w.requestAnimationFrame(animate);
w.setInterval(()=>refresh(false),550);
w.BPVQCookingStation=Object.freeze({
 isActive:()=>!!root&&!root.hidden,
 startPractice:()=>{
  const s=bridge.snapshot();
  if(!s.started||s.phase==='open'||s.customer)return false;
  practiceDish=clone(s.dish);practiceDish.isShaken=false;practiceDish.isCooked=false;practiceDish.fryState='unfried';practiceDish.fryProgress=0;
  ++practiceNumber;refresh(true);
  w.requestAnimationFrame(()=>root.scrollIntoView({block:'start',behavior:'smooth'}));
  return true;
 },
 stopPractice:()=>{if(!practiceDish)return false;practiceDish=null;refresh(true);return true;},
 status:()=>({career:ui.career,stage:ui.stage,key:ui.key,craft:ui.craft,practice:!!practiceDish,previewOnly:false})
});
})(window);
