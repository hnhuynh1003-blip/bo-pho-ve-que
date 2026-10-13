/* BPVQ v88 Cooking Station 2.0: portrait-first gameplay controls.
   Core game keeps all order settlement, inventory and save ownership. */
(function(w){
'use strict';
const food=w.BPVQFoodArt;
const bridge=w.BPVQCookingBridge, root=document.getElementById('cs20-station');
if(!bridge||!root)return;
const fields=new Map();
const $=id=>{if(!fields.has(id))fields.set(id,document.getElementById(id));return fields.get(id);};
const groups={
 boba:[['base','Cốt trà'],['topping','Topping & siro']],
 noodle:[['base','Nước cốt'],['topping','Topping'],['flavor','Cấp cay']],
 streetfood:[['skewer','Chọn xiên'],['sauce','Nước sốt']]
};
let ui={key:'',career:'',group:'',page:0,stage:'choose',pour:0,poured:false,heat:0,hold:0,flip:false,sauce:false,stir:0,craft:0,notice:'',lastTick:0,started:0,painted:'',active:false,delivering:false};
let current=null;
// Training is ephemeral and never calls native inventory / payment / save mutators.
let practiceDish=null,practicePerson=null,practiceNumber=0;
const clone=o=>JSON.parse(JSON.stringify(o));
const practiceKitchen=w.BPVQKitchenPlay.create({
 context:()=>({career:current?.career,person:practiceDish?practicePerson:null,dish:practiceDish,phase:'open',patience:90,paused:bridge.isPaused(),hidden:document.visibilityState==='hidden'}),
 onBegin(){practiceDish.isCooked=false;practiceDish.fryState='unfried';practiceDish.fryProgress=0;},
 onFinish(grade,play){if(current.career==='boba')practiceDish.isShaken=true;else if(current.career==='noodle')practiceDish.isCooked=true;else{practiceDish.fryState=grade==='bad'?'burnt':grade;practiceDish.fryProgress=100;}}
});
function kitchenView(){return practiceDish?practiceKitchen.snapshot():bridge.kitchenStatus();}
function kitchenAction(kind,value){const ok=practiceDish?practiceKitchen.action(kind,value):bridge.kitchenAction(kind,value);const play=kitchenView();ui.kitchen=play;ui.stage=play.stage;if(play.hint||play.notice)setNotice(play.hint||play.notice);refresh(true);return ok;}
function view(){
 const live=bridge.snapshot();
 if(practiceDish && (live.customer || live.phase==='open'))practiceDish=null;
 if(practiceDish){return {...live,phase:'open',practice:true,customer:practicePerson,dish:practiceDish,kitchen:practiceKitchen.snapshot(),cost:0,stockStamp:'practice:'+JSON.stringify(practiceDish)};}
 return live;
}
function practiceSelect(group,key,delta){
 if(practiceKitchen.snapshot().stage!=='choose')return false;
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
  else { const m={...Object.fromEntries(d.toppings.map(k=>[k,1])),...(d.toppingPortions||{})};const n=Object.prototype.hasOwnProperty.call(m,key)?Number(m[key]):0;const q=clamp(n+Math.sign(delta),0,3);m[key]=q;d.toppingPortions=m;d.toppings=Object.keys(m).filter(k=>m[k]>0);}
 }
 d.isShaken=false;d.isCooked=false;d.fryState='unfried';d.fryProgress=0;
 return true;
}

const tabs=$('cs20-groups'),shelf=$('cs20-shelf'),stage=root.querySelector('.cs20-stage'),primary=$('cs20-primary');
// Hai popover không chồng nhau khi người chơi xem đơn và hướng dẫn.
const orderDetails=root.querySelector('.cs33-order-ticket'),helpDetails=root.querySelector('.cs33-help');
orderDetails?.addEventListener('toggle',()=>{if(orderDetails.open&&helpDetails)helpDetails.open=false;});
helpDetails?.addEventListener('toggle',()=>{if(helpDetails.open&&orderDetails)orderDetails.open=false;});
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
function safe(t){return String(t==null?'':t)}
function textField(id,value){const el=$(id),v=String(value);if(el&&el.textContent!==v)el.textContent=v;}
function attr(el,name,value){const v=String(value);if(el.getAttribute(name)!==v)el.setAttribute(name,v);}
function disable(el,value){if(el.disabled!==!!value)el.disabled=!!value;}
function hide(el,value){if(el.hidden!==!!value)el.hidden=!!value;}
function setNotice(s){
 // Hướng dẫn thao tác mặc định nằm trong nút ?, thông báo tức thời vẫn hiện khi cần.
 const value=String(s||'');
 const tutorial=/^(Chọn nguyên liệu|Chọn xiên rồi|Đã chọn nguyên liệu|Đã đổi thành phần|Đã giữ lượng trà|Đã thêm nguyên liệu|Rót trà khi sẵn sàng)/i.test(value);
 ui.notice=value;textField('cs20-feedback',tutorial?'':value);
}
function touchMotion(el,frames,duration=180){if(!el||w.matchMedia('(prefers-reduced-motion: reduce)').matches)return;el.getAnimations().forEach(a=>a.cancel());el.animate(frames,{duration,easing:'ease-out'});}
function reset(key,career){
 const sameCareer=career===ui.career,group=sameCareer?ui.group:career==='boba'?'topping':groups[career]?.[0][0]||'size',page=sameCareer?ui.page:0;
 ui={key,career,group,page,stage:'choose',pour:0,poured:false,heat:0,hold:0,flip:false,sauce:false,stir:0,craft:0,notice:'Chọn nguyên liệu rồi thao tác trực tiếp với món nhé!',lastTick:performance.now(),started:0,painted:'',active:false,delivering:false};
 lastPortionKey='';
 setNotice(career==='boba'?'Chọn nguyên liệu → rót trà → dập nắp.':career==='noodle'?'Chọn nguyên liệu rồi canh lửa nấu mì.':'Chọn xiên rồi lật, quét sốt và canh độ chín.');
 renderGroups();
}
function itemsFor(s,group){
 const catalog=s.catalog || [];
 if(group==='size')return catalog.filter(x=>x.group==='container');
 if(group==='base')return catalog.filter(x=>x.group==='base');
 if(group==='topping')return catalog.filter(x=>x.group==='topping');
 if(group==='syrup')return catalog.filter(x=>x.group==='topping'&&x.id==='syrup_rainbow');
 if(group==='sauce')return catalog.filter(x=>x.group==='sauce');
 if(group==='skewer')return catalog.filter(x=>x.group==='topping');
 return [];
}
function portionCount(d,key){const m=d.toppingPortions||{};return Object.prototype.hasOwnProperty.call(m,key)?Number(m[key]):(d.toppings||[]).includes(key)?1:0;}
function selected(s,x){
 const d=s.dish;
 if(x.group==='container')return d.container===x.id || ({plate:'tray_plate',basket:'tray_basket',box:'tray_box'}[d.tray]===x.id);
 if(x.group==='base')return d.base===x.id;
 if(x.group==='sauce')return d.sauce===x.id;
 if(x.group==='topping')return s.career==='streetfood'?Number(d.skewerCounts[x.id]||0)>0:portionCount(d,x.id)>0;
 return false;
}
let groupCareer='';
function renderGroups(){
 if(groupCareer!==ui.career){
  groupCareer=ui.career;tabs.replaceChildren();
  (groups[ui.career]||[]).forEach(([key,label])=>{
   const b=document.createElement('button');b.type='button';b.className='cs20-group';b.dataset.group=key;b.textContent=label;
   b.addEventListener('click',()=>{ui.group=key;ui.page=0;renderGroups();renderShelf();});tabs.append(b);
  });
 }
 for(const b of tabs.children){b.classList.toggle('selected',ui.group===b.dataset.group);attr(b,'aria-pressed',ui.group===b.dataset.group);}
}
function emitSelection(x,delta){
 if(!current)return;
 if(x.group==='topping' && delta>0)lastPortionKey=x.id;
 if(practiceDish){if(!x.unlocked||practiceKitchen.snapshot().stage!=='choose')return;practiceSelect(x.group,x.id,delta);}else{if(!bridge.choose(x.group,x.id,delta))return;}
 ui.page=Math.max(0,ui.page||0);
 afterIngredientEdit();
 touchMotion($('cs20-visual').querySelector('svg'),[{transform:'translateY(0)'},{transform:'translateY(-3px)'},{transform:'translateY(0)'}]);
 refresh(true);
}
function afterIngredientEdit(){
 if(ui.career==='boba'){
  // Edits invalidate the native lid/tip, but never empty a cup already poured.
  // A running pour keeps running; stopped pours return directly to capping.
  const running=ui.active&&ui.stage==='pour';
  ui.stage=running?'pour':ui.poured?'mix':'choose';
  ui.active=running;ui.capElapsed=0;ui.capPosition=0;
  ui.craft=ui.poured ? .55*clamp(1-Math.abs(ui.pour-72)/50,0,1):0;
  setNotice(ui.poured?'Đã giữ lượng trà. Canh dập nắp lại để giao món.':running?'Đã thêm nguyên liệu, trà vẫn đang rót.':'Đã chọn nguyên liệu. Rót trà khi sẵn sàng.');
 }else{
  if(practiceDish)practiceKitchen.reset();
  ui.stage='choose';ui.active=false;ui.pour=0;ui.hold=0;ui.heat=0;ui.flip=false;ui.sauce=false;ui.stir=0;ui.craft=0;
  setNotice('Đã đổi thành phần. Chế biến lại để món đạt chuẩn.');
 }
}
// Existing asset mapping only; no newly minted item IDs or repainted source art.
const INGREDIENT_ART=Object.fromEntries(Object.keys({tea_black:1,tea_green:1,tea_oolong:1,tea_jasmine:1,tea_honey:1,tea_strawberry:1,tea_taro:1,topping_boba:1,topping_white_boba:1,topping_pudding:1,topping_jelly:1,topping_cheese_foam:1,topping_lychee:1,topping_cookie:1,topping_aloe:1,topping_grass_jelly:1,topping_redbean:1,topping_crystal:1,topping_mochi:1}).map(id=>[id,{
tea_black:'057_tea-black_8c43c9fdf1.webp',tea_green:'058_tea-green_c593521943.webp',tea_oolong:'059_tea-oolong_76378ca6ec.webp',tea_jasmine:'060_tea-jasmine_6eb0f1a20e.webp',tea_honey:'062_tea-honey_c540b7e03e.webp',tea_strawberry:'063_tea-strawberry_e9002fe325.webp',tea_taro:'064_tea-taro_f92cdc8eba.webp',topping_boba:'065_topping-boba_50721c0e58.webp',topping_white_boba:'066_topping-white-boba_665b19cd9f.webp',topping_pudding:'067_topping-pudding_33e17cfd13.webp',topping_jelly:'068_topping-jelly_61dbd58c82.webp',topping_cheese_foam:'069_topping-cheese-foam_0190b7ff02.webp',topping_lychee:'070_topping-lychee_b30470ed21.webp',topping_cookie:'071_topping-cookie_9b347a4826.webp',topping_aloe:'072_topping-aloe_a17bf92f08.webp',topping_grass_jelly:'073_topping-grass-jelly_d917e5f37f.webp',topping_redbean:'074_topping-redbean_416456d0bc.webp',topping_crystal:'075_topping-crystal_e2ce5320db.webp',topping_mochi:'076_topping-mochi_5c7b9aa32e.webp'
}[id]]));
const cs26Pager=document.createElement('nav');cs26Pager.id='cs26-pager';cs26Pager.setAttribute('aria-label','Trang nguyên liệu');shelf.after(cs26Pager);
const cs27Containers=document.createElement('div');cs27Containers.id='cs27-containers';cs27Containers.setAttribute('role','group');
const caption=stage.querySelector('figcaption');if(caption)caption.querySelector('#cs20-dish-name').after(cs27Containers);
// Status belongs to the installed preparation surface, not an empty strip below.
if(caption)caption.append($('cs20-feedback'));
const pantryBar=document.createElement('div');pantryBar.className='cs30-pantry-bar';
tabs.before(pantryBar);pantryBar.append(tabs,cs26Pager);
const previous=document.createElement('button'),next=document.createElement('button');
previous.type=next.type='button';previous.textContent='‹';next.textContent='›';
previous.setAttribute('aria-label','Nguyên liệu trước');next.setAttribute('aria-label','Nguyên liệu tiếp theo');
cs26Pager.append(previous,next);
function shiftShelf(direction){shelf.scrollBy({left:direction*Math.max(1,shelf.clientWidth*.8),behavior:w.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});}
previous.addEventListener('click',()=>shiftShelf(-1));next.addEventListener('click',()=>shiftShelf(1));
function updateRail(){
 const overflow=shelf.scrollWidth>shelf.clientWidth+1;
 hide(cs26Pager,!overflow);
 disable(previous,shelf.scrollLeft<2);disable(next,shelf.scrollLeft+shelf.clientWidth>=shelf.scrollWidth-2);
}
shelf.addEventListener('scroll',updateRail,{passive:true});

const cs26Meters=document.createElement('div');cs26Meters.id='cs26-meters';$('cs20-visual').after(cs26Meters);
const teaColors={tea_black:'#a57042',tea_green:'#83a35a',tea_strawberry:'#e993a7',tea_taro:'#b299c9',milk_fresh:'#ffefcc',tea_honey:'#e7b461',tea_oolong:'#b78550',tea_jasmine:'#b4be80',tea_matcha:'#72a76c'};
const meterViews=[],containerViews=[];
let containerStamp='',shelfStamp='',shelfViews=[];
function chooseFlavor(kind,n){
 if(practiceDish){if(practiceKitchen.snapshot().stage!=='choose')return;practiceSelect(kind,n,1);}else if(!bridge.choose(kind,n))return;
 afterIngredientEdit();refresh(true);
}
function renderMiniMeters(){
 hide(cs26Meters,ui.career!=='boba');
 if(ui.career!=='boba')return;
 if(!meterViews.length){
 for(const [title,kind,vals] of [['Đường','sugar',[30,70,100]],['Đá','ice',[0,50,100]]]){
  const wrap=document.createElement('label');wrap.className='cs26-meter '+kind;
  const text=document.createElement('span');text.textContent=title;
  const values=vals;const value=Number(current.dish[kind]);
  const slide=document.createElement('input');slide.type='range';slide.className='cs26-range';slide.min=0;slide.max=vals.length-1;slide.step=1;slide.value=String(Math.max(0,vals.indexOf(value)));
  slide.setAttribute('aria-label',title+' trong món');
  const number=document.createElement('strong');number.textContent=value+'%';
  slide.addEventListener('input',()=>{number.textContent=values[Number(slide.value)]+'%';slide.style.setProperty('--fill',((Number(slide.value)/(vals.length-1))*100)+'%');});
  slide.addEventListener('change',()=>chooseFlavor(kind,values[Number(slide.value)]));
  slide.style.setProperty('--fill',((Number(slide.value)/(vals.length-1))*100)+'%');
  wrap.append(text,slide,number);cs26Meters.append(wrap);meterViews.push({kind,vals,slide,number});
 }
 }
 for(const m of meterViews){const value=Number(current.dish[m.kind]),index=Math.max(0,m.vals.indexOf(value));
  if(document.activeElement!==m.slide){if(m.slide.value!==String(index))m.slide.value=String(index);const fill=((index/(m.vals.length-1))*100)+'%';if(m.slide.style.getPropertyValue('--fill')!==fill)m.slide.style.setProperty('--fill',fill);}
  if(m.number.textContent!==value+'%')m.number.textContent=value+'%';
 }
}
function renderContainers(){
 attr(cs27Containers,'aria-label',ui.career==='boba'?'Chọn size ly':ui.career==='noodle'?'Chọn size thố':'Chọn khay');
 const labels={cup_m:'M',cup_l:'L',cup_xl:'XL',bowl_m:'M',bowl_l:'L',bowl_xl:'XL',tray_plate:'Đĩa',tray_basket:'Giỏ',tray_box:'Hộp'};
 const data=itemsFor(current,'size'),stamp=ui.career+':'+data.map(x=>x.id).join(',');
 if(containerStamp!==stamp){
 containerStamp=stamp;containerViews.length=0;cs27Containers.replaceChildren();
 for(const x of data){
  const b=document.createElement('button');b.type='button';b.className='cs27-container';
  const stack=document.createElement('span');stack.className='cs28-cup-stack';stack.setAttribute('aria-hidden','true');
  const label=document.createElement('span');label.textContent=labels[x.id]||x.name;b.append(stack,label);
  b.addEventListener('click',()=>emitSelection(current.catalog.find(y=>y.id===x.id)||x,1));cs27Containers.append(b);
  containerViews.push({id:x.id,b});
 }
 }
 for(const v of containerViews){const x=data.find(x=>x.id===v.id);disable(v.b,!x.unlocked);v.b.classList.toggle('picked',selected(current,x));
  const label=x.name+(x.unlocked?' · Kho '+x.stock:' · Chưa mở khóa');if(v.b.title!==label)v.b.title=label;attr(v.b,'aria-label',label);attr(v.b,'aria-pressed',selected(current,x));
 }
}
function renderShelf(){
 if(!current)return;
 attr(shelf,'data-layout',ui.group==='flavor'?'flavor':'ingredients');
 renderContainers();renderMiniMeters();
 if(ui.group==='flavor'){
  if(shelfStamp===ui.career+':flavor'){for(const b of shelf.querySelectorAll('[data-spice]'))b.classList.toggle('picked',Number(current.dish.spicyLevel)===Number(b.dataset.spice));return;}
  shelfStamp=ui.career+':flavor';shelf.replaceChildren();shelfViews=[];hide(cs26Pager,true);
  if(ui.career==='boba'){const p=document.createElement('p');p.className='cs26-flavor-help';p.textContent='🍯 Đường và 🧊 Đá chỉnh tại hai ống bên ly nhé!';shelf.append(p);return;}
  const box=document.createElement('div');box.className='cs20-flavor';
  for(let i=0;i<=7;i++){const b=document.createElement('button');b.className='cs20-pill'+(Number(current.dish.spicyLevel)===i?' picked':'');b.dataset.spice=i;b.textContent='🌶️ '+i;b.addEventListener('click',()=>chooseFlavor('spice',i));box.append(b)}shelf.append(box);return;
 }
 const data=itemsFor(current,ui.group);
 // An installed horizontal shelf has no reserved second row or short last page.
 const visible=data;
 const stamp=JSON.stringify([ui.career,ui.group,visible.map(x=>x.id)]);
 if(shelfStamp!==stamp){
 shelfStamp=stamp;shelf.replaceChildren();shelfViews=[];shelf.scrollLeft=0;
 for(const x of visible){
  const b=document.createElement('button');b.type='button';b.className='cs20-item cs26-jar';b.dataset.item=x.id;
  const art=document.createElement('span');art.className='cs26-jar-image';
  const src=INGREDIENT_ART[x.id]||food.images[x.id]||({'tea_matcha':'v8761_tea_matcha.svg','topping_peach':'v8761_topping_peach.svg','topping_brown_boba':'v8761_topping_brown_boba.svg','topping_salted_cream':'v8761_topping_salted_cream.svg','syrup_rainbow':'v8761_syrup_rainbow.svg'}[x.id]);
  if(ui.career==='boba'&&x.group==='base'){
   art.classList.add('cs28-dispenser');
   const jar=document.createElement('img');jar.src='assets/images/v88/counter/tea-dispenser.webp';jar.alt='';jar.className='cs28-jar-shell';
   const tea=document.createElement('span');tea.className='cs28-tea-fill';tea.style.background=teaColors[x.id]||'#c59b68';art.append(jar,tea);
   if(src){const tag=document.createElement('img');tag.src='assets/images/'+src;tag.alt='';tag.className='cs28-jar-tag';art.append(tag);}
  }else if(ui.career==='boba'&&x.group==='topping'){
   art.classList.add('cs28-tray');const food=document.createElement('span');food.className='cs28-tray-food';
   if(src){const im=document.createElement('img');im.src='assets/images/'+src;im.alt='';food.append(im);}else food.textContent=x.icon||'✨';
   const rim=document.createElement('img');rim.src='assets/images/v88/counter/topping-tray.webp';rim.alt='';rim.className='cs28-tray-rim';art.append(food,rim);
  }else if(src){const im=document.createElement('img');im.src='assets/images/'+src;im.alt='';art.append(im);}else art.textContent=x.icon||'✨';
  const name=document.createElement('span');name.className='cs20-item-name';name.textContent=x.name;
  const count=document.createElement('span');count.className='cs26-jar-stock';
  const q=document.createElement('span');q.className='cs26-jar-portion';q.hidden=true;b.append(q);
  b.append(art,name,count);
  const delta=x.group==='topping'?1:1;
  b.addEventListener('click',()=>{emitSelection(current.catalog.find(y=>y.id===x.id)||x,delta);touchMotion(art,[{transform:'scale(1)'},{transform:'scale(.94)'},{transform:'scale(1)'}]);});
  shelf.append(b);shelfViews.push({id:x.id,b,count,q});
 }
 }
 updateRail();
 for(const v of shelfViews){const x=visible.find(x=>x.id===v.id);if(!x)continue;
  disable(v.b,!x.unlocked);v.b.classList.toggle('picked',selected(current,x));attr(v.b,'aria-pressed',selected(current,x));
  const title=x.name+(x.unlocked?' · Tồn kho '+x.stock:' · Chưa mở khóa');if(v.b.title!==title)v.b.title=title;
  const stock=x.unlocked?String(x.stock):'🔒';if(v.count.textContent!==stock)v.count.textContent=stock;
  const qty=ui.career==='streetfood'?Number(current.dish.skewerCounts[x.id]||0):x.group==='topping'?portionCount(current.dish,x.id):0;
  hide(v.q,qty===0);if(v.q.textContent!=='×'+qty)v.q.textContent='×'+qty;
 }
}
// Tapping the visible drink removes one portion of the most recently selected topping.
let lastPortionKey='';
$('cs20-visual').addEventListener('click',()=>{
 if(!current||!['boba','noodle'].includes(ui.career)||!lastPortionKey||current.pause||(ui.career==='noodle'&&ui.stage!=='choose'))return;
 if(portionCount(current.dish,lastPortionKey)>0){emitSelection({group:'topping',id:lastPortionKey,unlocked:true},-1);setNotice('Đã lấy bớt một phần topping khỏi món.');}
});

// Vessel nodes are installed once per career. Pouring updates attributes only.
let visualCareer='',visualRefs=null;
function buildVisual(s){
 let content='';
 if(s.career==='boba'){
  const pearls=Array.from({length:36},(_,j)=>`<circle data-pearl cx="${67+(j%7)*11}" cy="${147-Math.floor(j/7)*10}" r="4.5" fill="#553c30" opacity="0" stroke="#b49265" stroke-width=".6"/>`).join('');
  const ice=Array.from({length:8},(_,j)=>`<rect data-ice x="${67+(j%4)*18}" y="${66+Math.floor(j/4)*25}" width="13" height="17" rx="4" fill="#f5fbff" fill-opacity=".6" stroke="#fcffff" stroke-opacity=".7" opacity="0" transform="rotate(${j%2?12:-9} ${73+(j%4)*18} ${75+Math.floor(j/4)*25})"/>`).join('');
  content=`<defs><clipPath id="cs20-cup-clip"><path d="M52 35 Q100 29 148 35 L138 156 Q100 170 62 156 Z"/></clipPath><linearGradient id="cs28-glass" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#fffef0" stop-opacity=".86"/><stop offset=".5" stop-color="#fff4d6" stop-opacity=".28"/><stop offset="1" stop-color="#fffef0" stop-opacity=".8"/></linearGradient></defs>
  <path data-pour-stream d="M150 6 Q132 12 119 48" stroke="#bf8c55" stroke-width="5" stroke-linecap="round" fill="none" opacity="0"/><ellipse cx="101" cy="170" rx="58" ry="7" fill="#996837" opacity=".15"/>
  <path d="M52 35 Q100 29 148 35 L138 156 Q100 170 62 156 Z" fill="url(#cs28-glass)" stroke="#8f684b" stroke-width="2.8"/>
  <g clip-path="url(#cs20-cup-clip)"><rect data-tea x="47" y="148" width="107" height="170" fill="#bc9463"/><path data-wave d="M52 150 Q80 146 110 151 T148 150" stroke="#fff8df" opacity=".55" stroke-width="3" fill="none"/>${pearls}${ice}<path d="M65 44 Q57 96 72 148" stroke="#fff" stroke-width="6" opacity=".46" fill="none" stroke-linecap="round"/></g>
  <path d="M132 37 L146 12" stroke="#86a57d" stroke-width="7" stroke-linecap="round"/><ellipse data-lid cx="100" cy="35" rx="49" ry="6" fill="#fff2d6" stroke="#936c4a" stroke-width="2.5" opacity=".65"/>
  <ellipse cx="101" cy="102" rx="24" ry="19" fill="#fff6df" fill-opacity=".78" stroke="#bca078" stroke-width="1"/><path d="M93 111 Q86 89 108 91 Q113 108 93 111 M96 107 L105 96" stroke="#729875" stroke-width="2.5" fill="#b5c99a" stroke-linecap="round"/>`;
 }else if(s.career==='noodle'){
  const tokens=Array.from({length:24},()=>`<g data-food-slot opacity="0"><title></title><path data-food-shape d="M-8-6H8V6H-8Z" stroke="#805d3d" stroke-width=".8"/><path d="M-5-2L3-3" stroke="#fff5da" stroke-width="1.2" opacity=".6"/><text data-food-count x="7" y="9" font-size="11" font-weight="800" fill="#61442f" stroke="#fff2d8" stroke-width=".6" paint-order="stroke"></text></g>`).join('');
  content=`<g data-pot><ellipse cx="101" cy="164" rx="70" ry="8" fill="#a76f45" opacity=".15"/><path d="M38 67 Q100 43 162 67 L149 145 Q101 173 50 145 Z" fill="#b17d61" stroke="#80513f" stroke-width="3"/><ellipse cx="100" cy="75" rx="65" ry="25" fill="#603b2d" stroke="#b87a4d" stroke-width="4"/><ellipse data-soup cx="100" cy="76" rx="55" ry="18" fill="#dd9c59"/>
  <path data-noodle-strands d="M62 71Q78 58 91 72T119 72T141 72M58 81Q73 69 89 81T118 81T140 81" stroke="#f2d690" stroke-width="3" fill="none" opacity=".2"/>
  <g data-noodle-food>${tokens}</g><path data-steam d="M58 45 Q44 27 57 14 M102 41 Q87 24 102 11 M145 43 Q131 25 145 13" stroke="#aebbb5" stroke-width="4" opacity=".15" fill="none" stroke-linecap="round"/><path data-flame d="M55 161 L71 172 L128 172 L145 161" stroke="#e79743" stroke-width="5" stroke-linecap="round" opacity="0"/>
  <path data-overflow d="M43 78Q30 92 45 115M155 77Q169 96 151 116" stroke="#d89355" stroke-width="6" fill="none" opacity="0"/></g>`;
 }else{
  const skewers=Array.from({length:24},()=>`<g data-skewer-slot opacity="0"><title></title><line x1="0" y1="0" x2="130" y2="0" stroke="#c9a66a" stroke-width="3" stroke-linecap="round"/>${Array.from({length:4},(_,j)=>`<path data-skewer-piece transform="translate(${19+j*28} 0)" d="M-8-6H8V6H-8Z" fill="#d7a26e" stroke="#805437" stroke-width="1"/>`).join('')}<path data-sauce-stroke d="M13-3Q24 4 36-3T62-3T89-3T115-3" stroke-width="3" fill="none" opacity="0"/><text data-skewer-count x="126" y="5" font-size="12" font-weight="900" fill="#fff2cd" stroke="#573c2a" stroke-width="1" paint-order="stroke"></text></g>`).join('');
  content=`<g data-plated-tray opacity="0"><ellipse data-plate cx="100" cy="99" rx="87" ry="57" fill="#fff3d7" stroke="#b39368" stroke-width="4"/><g data-basket><rect x="15" y="42" width="170" height="111" rx="28" fill="#ddba76" stroke="#9c7544" stroke-width="4"/>${Array.from({length:9},(_,i)=>`<path d="M${26+i*18} 48v99" stroke="#ba935b" stroke-width="2"/>`).join('')}<path d="M21 65h158M17 85h166M17 105h166M21 125h158" stroke="#efd49d" stroke-width="3"/></g><rect data-box x="16" y="42" width="168" height="111" rx="9" fill="#ead5b3" stroke="#ac8658" stroke-width="4"/></g><g data-grill-base><rect x="19" y="40" width="162" height="116" rx="15" fill="#8b8071" stroke="#51473e" stroke-width="5"/><rect x="29" y="49" width="142" height="97" rx="8" fill="#493d36"/>${Array.from({length:7},(_,i)=>`<line x1="${36+i*21}" y1="50" x2="${36+i*21}" y2="147" stroke="#99897a" stroke-width="2"/>`).join('')}<path data-grill-fire d="M35 145 Q52 132 67 143 T105 143 T145 143" stroke="#f49d52" stroke-width="5" fill="none" opacity=".2"/></g>${skewers}
  <text x="29" y="174" font-size="11" fill="#5b4030">A</text><rect x="41" y="166" width="57" height="6" rx="3" fill="#c9b895"/><rect data-side-a x="41" y="166" width="0" height="6" rx="3" fill="#bd9a51"/>
  <text x="107" y="174" font-size="11" fill="#5b4030">B</text><rect x="119" y="166" width="57" height="6" rx="3" fill="#c9b895"/><rect data-side-b x="119" y="166" width="0" height="6" rx="3" fill="#bd9a51"/>`;
 }
 return `<svg viewBox="0 0 200 180" role="img" aria-label="Món ${s.career==='boba'?'trà sữa':s.career==='noodle'?'mì cay':'xiên que'} đang chế biến">${content}</svg>`;
}
function mixColor(a,b,t){const rgb=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));const x=rgb(a),y=rgb(b);return '#'+x.map((v,i)=>Math.round(v+(y[i]-v)*t).toString(16).padStart(2,'0')).join('');}
function paintVessel(s){
 const visual=$('cs20-visual'),d=s.dish;
 if(visualCareer!==s.career){
  visualCareer=s.career;visual.innerHTML=buildVisual(s);
  const one=q=>visual.querySelector(q),all=q=>[...visual.querySelectorAll(q)];
  visualRefs={svg:one('svg'),pot:one('[data-pot]'),grill:one('[data-grill-base]'),tray:one('[data-plated-tray]'),plate:one('[data-plate]'),basket:one('[data-basket]'),box:one('[data-box]'),stream:one('[data-pour-stream]'),tea:one('[data-tea]'),wave:one('[data-wave]'),lid:one('[data-lid]'),pearls:all('[data-pearl]'),ice:all('[data-ice]'),food:all('[data-food-slot]').map(g=>({g,shape:g.querySelector('[data-food-shape]'),count:g.querySelector('[data-food-count]'),name:g.querySelector('title')})),strands:one('[data-noodle-strands]'),overflow:one('[data-overflow]'),soup:one('[data-soup]'),steam:one('[data-steam]'),flame:one('[data-flame]'),rows:all('[data-skewer-slot]').map(g=>({g,pieces:[...g.querySelectorAll('[data-skewer-piece]')],sauce:g.querySelector('[data-sauce-stroke]'),count:g.querySelector('[data-skewer-count]'),name:g.querySelector('title')})),fire:one('[data-grill-fire]'),sideA:one('[data-side-a]'),sideB:one('[data-side-b]')};
 }
 const v=visualRefs;
 attr(v.svg,'data-off-heat',!!s.kitchen?.offHeat);
 if(s.career!=='boba')attr(v.svg,'aria-label',s.career==='noodle'?(s.kitchen.offHeat?'Nồi mì đã nhấc khỏi bếp':'Nồi mì đang trên bếp'):(s.kitchen.offHeat?'Xiên đã gắp ra '+({plate:'đĩa',basket:'mẹt tre',box:'hộp mang đi'}[d.tray]||'đĩa'):'Xiên đang trên vỉ nướng'));
 if(s.career==='boba'){
  attr(v.stream,'opacity',ui.active?'.75':'0');
  const fill=ui.pour>0?Math.max(3,Math.round(ui.pour)):d.isShaken?78:8,y=153-fill*1.1;
  attr(v.tea,'y',y.toFixed(1));attr(v.tea,'fill',teaColors[d.base]||'#bb9163');
  attr(v.wave,'d',`M52 ${y+4} Q80 ${y-1} 110 ${y+4} T148 ${y+4}`);attr(v.lid,'opacity',d.isShaken?'1':'.65');
  const dots=(d.toppings||[]).flatMap(key=>Array.from({length:Math.min(3,portionCount(d,key))*4},()=>key)).slice(0,36);
  v.pearls.forEach((el,i)=>{const key=dots[i];attr(el,'opacity',key?'1':'0');if(key){attr(el,'fill',key.includes('boba')?'#49312c':key.includes('jelly')?'#b3d79a':key.includes('redbean')?'#965b49':key.includes('peach')?'#e5a785':'#f8dca5');attr(el,'r',key.includes('boba')?4.5:4);}});
  const iceCount=Number(d.ice)===100?8:Number(d.ice)===50?4:0;v.ice.forEach((el,i)=>attr(el,'opacity',i<iceCount&&fill>25?'1':'0'));
 }else if(s.career==='noodle'){
  attr(v.pot,'transform',s.kitchen.offHeat?'translate(0 -7)':'translate(0 0)');
  const play=s.kitchen,selected=(d.toppings||[]).filter(id=>portionCount(d,id)>0),columns=selected.length<=6?3:5;
  v.food.forEach((node,i)=>{
   const id=selected[i];attr(node.g,'opacity',id?((play.stage==='heating'||play.stage==='held'&&play.restStage==='heating')?'0':play.stage==='choose'?'.75':'1'):'0');
   if(!id)return;const style=food.styles[id]||{shape:'round',color:'#d7c596'},qty=portionCount(d,id);
   attr(node.g,'data-ingredient',id);attr(node.g,'data-quantity',qty);attr(node.g,'transform',`translate(${columns===3?72+(i%3)*28:59+(i%5)*20} ${selected.length<=6?68+Math.floor(i/3)*17:61+Math.floor(i/5)*10})`);
   attr(node.shape,'d',food.shapes[style.shape]);attr(node.shape,'fill',style.color);attr(node.shape,'data-color',style.color);
   const amount=qty>1?'×'+qty:'';if(node.count.textContent!==amount)node.count.textContent=amount;
   const label=(s.label[id]||id)+' ×'+qty;if(node.name.textContent!==label)node.name.textContent=label;
  });
  const color=food.broths[d.base]||'#c7a471';attr(v.soup,'fill',color);attr(v.overflow,'stroke',color);attr(v.overflow,'opacity',Math.min(.9,(play.overflow||0)/100));
  attr(v.strands,'opacity',(['simmer','done','failed'].includes(play.stage)||play.stage==='held'&&play.restStage==='simmer')?'1':'.2');
  attr(v.steam,'opacity',Math.max(.08,Math.min(.8,(play.heat||20)/130)));attr(v.flame,'opacity',['heating','simmer'].includes(play.stage)?String(play.flame/3):'0');
 }else{
  const off=s.kitchen.offHeat;attr(v.grill,'opacity',off?'0':'1');attr(v.tray,'opacity',off?'1':'0');attr(v.plate,'opacity',d.tray==='plate'?'1':'0');attr(v.basket,'opacity',d.tray==='basket'?'1':'0');attr(v.box,'opacity',d.tray==='box'?'1':'0');
  const play=s.kitchen,entries=Object.entries(d.skewerCounts||{}).filter(x=>x[1]>0),total=entries.reduce((n,x)=>n+Number(x[1]),0);
  const tokens=total<=24?entries.flatMap(([id,qty])=>Array.from({length:Number(qty)},()=>({id,qty:1}))):entries.map(([id,qty])=>({id,qty}));
  const cols=tokens.length<=5?1:2,rows=Math.ceil(tokens.length/cols),step=Math.min(18,84/Math.max(1,rows));
  v.rows.forEach((row,i)=>{
   const token=tokens[i];attr(row.g,'opacity',token?'1':'0');if(!token)return;
   const style=food.styles[token.id]||{shape:'round',color:'#d7c596'};
   attr(row.g,'transform',`translate(${cols===1?34:30+(i%2)*78} ${57+Math.floor(i/cols)*step}) scale(${cols===1?1:.51} ${Math.min(1,step/17)})`);
   attr(row.g,'data-ingredient',token.id);attr(row.g,'data-quantity',token.qty);
   const amount=token.qty>1?'×'+token.qty:'';if(row.count.textContent!==amount)row.count.textContent=amount;
   const label=(s.label[token.id]||token.id)+' ×'+token.qty;if(row.name.textContent!==label)row.name.textContent=label;
   const amountCooked=play.side==='b'?play.b:play.a;
   const color=mixColor(style.color,amountCooked>105?'#58372a':'#bc853f',Math.min(.7,(amountCooked||0)/145));
   row.pieces.forEach(el=>{attr(el,'d',food.shapes[style.shape]);attr(el,'fill',color);attr(el,'data-color',style.color);});
   attr(row.sauce,'stroke',food.sauces[d.sauce]||'#ae6944');attr(row.sauce,'opacity',play.sauced?'.85':'0');
  });
  attr(v.sideA,'width',clamp(play.a||0,0,100)*.57);attr(v.sideB,'width',clamp(play.b||0,0,100)*.57);
  attr(v.sideA,'fill',play.a>105?'#9d5636':'#889850');attr(v.sideB,'fill',play.b>105?'#9d5636':'#889850');
  attr(v.fire,'opacity',play.stage==='grilling'?String(play.flame/3):'.1');
 }

}
function renderDish(){
 if(!current)return;
 const s=current,d=s.dish;
 textField('cs20-dish-name',s.career==='boba'?'Ly trà đang pha':s.career==='noodle'?(s.kitchen.offHeat?'Nồi mì đã nhấc khỏi bếp':'Thố mì đang nấu'):(s.kitchen.offHeat?'Xiên trên '+({plate:'đĩa',basket:'mẹt tre',box:'hộp mang đi'}[d.tray]||'đĩa'):'Vỉ xiên đang nướng'));
 const mat=s.career==='streetfood'?Object.values(d.skewerCounts).reduce((a,b)=>a+Number(b||0),0)+' xiên · '+(s.label[d.sauce]||'Sốt'):(s.label[d.base]||'Nước cốt')+' · '+Object.values(Object.fromEntries(d.toppings.map(k=>[k,portionCount(d,k)]))).reduce((a,b)=>a+b,0)+' phần topping';
 textField('cs20-dish-detail',mat);paintVessel(s);
 textField('cs20-sale-price',s.practice?'Luyện tập':`${s.customer?.order?.quotedTotal??d.listedPrice} Xu`);
 const play=s.kitchen||{};
 const progress=Math.round(s.career==='boba'?ui.pour:s.career==='noodle'?(play.stage==='heating'?play.heat:play.cook):(Number(play.a||0)+Number(play.b||0))/2),width=clamp(progress,0,100)+'%';
 if($('cs20-gauge').style.width!==width)$('cs20-gauge').style.width=width;
 textField('cs20-gauge-label',s.career==='boba'?`Lượng rót ${Math.round(ui.pour)}%`:s.career==='noodle'?`Nhiệt ${Math.round(play.heat||0)}% · Mì ${Math.round(play.cook||0)}%`:`A ${Math.round(play.a||0)}% · B ${Math.round(play.b||0)}%`);
 textField('cs20-craft',ui.craft>0?`Dấu ấn ${Math.round(ui.craft*100)}% (hiển thị)`:'Pha một ly theo ý bạn');
 const capping=['capping','timing'].includes(play.stage);
 const meter=$('cs20-gauge').parentElement;meter.classList.toggle('cs29-cap-meter',capping);
 root.classList.toggle('cs29-timing-active',capping);
 meter.setAttribute('role','img');
 meter.setAttribute('aria-label',capping?'Thanh nhịp: vùng xanh Good từ 28 đến 72 phần trăm, vùng vàng Perfect từ 44 đến 56 phần trăm. Nhấn lúc kim vào vùng mục tiêu.':'Tiến độ chế biến');
 if(capping){
  const p=play.position;
  if(p!==null){ui.capPosition=p;meter.style.setProperty('--cap-position',p+'%');}
  textField('cs20-gauge-label',s.career==='boba'?'Canh vùng sáng • Dập nắp!':s.career==='noodle'?'Canh vùng sáng • Nhấc nồi!':`Mặt ${play.round===1?'A':'B'} • Canh vùng sáng!`);
  textField('cs20-craft','Xanh: đạt · Vàng giữa: Perfect');
 }
}
function renderAction(){
 const ready=ui.career==='boba'?current?.dish?.isShaken:current?.kitchen?.ready||(!practiceDish&&bridge.kitchenReady());
 const d=current?.dish||{};
 let label='',secondary='',disabled=false;
 if(!current?.customer){label=current?.phase==='open'?'Đang chờ khách…':'Mở quán để đón khách';disabled=true;}
 else if(ready){label=safe(current?.practice?'✨ Hoàn thành bài luyện':'✨ Giao món cho khách');secondary='send';}
 else if(ui.career==='boba'){
  if(ui.stage==='choose'||ui.stage==='pour'){label=ui.active?'⏹ Dừng rót':'🫖 Rót trà vào ly';secondary='pour';}
  else if(ui.stage==='mix'){label='🥤 Canh nhịp dập nắp';secondary='cap-start';}
  else if(ui.stage==='capping'){label='✦ Dập nắp ngay!';secondary='cap-hit';}
  else {label='Đang dập nắp…';disabled=true;}
 } else {
  const play=current.kitchen;
  if(ui.stage==='choose'){label=ui.career==='noodle'?'🔥 Nấu mì & topping':'🔥 Đặt xiên lên vỉ';secondary='kitchen-begin';}
  else if(ui.stage==='warming'){label=play.round===2?'Đang nướng mặt B…':'Đang làm nóng bếp…';disabled=true;}
  else if(ui.stage==='timing'){label=ui.career==='noodle'?'✦ Nhấc nồi đúng nhịp!':play.round===1?'✦ Canh nhịp lật mặt!':'✦ Canh nhịp mặt B!';secondary='kitchen-hit';}
  else if(ui.stage==='plating'){label='🥢 Gắp ra để giao';secondary='kitchen-lift';}
  else {label='Món đang được giữ';disabled=true;}
 }
 textField('cs20-primary',label);disable(primary,disabled||!!current?.pause);attr(primary,'data-act',secondary);
 const paused=!!current?.pause;
 hide($('cs20-fire'),true);hide($('cs20-flip'),true);
 hide($('cs20-sauce'),ui.career!=='streetfood');hide($('cs20-lift'),true);
 disable($('cs20-sauce'),ui.stage!=='plating'||!!current?.kitchen?.sauced||paused);
 disable($('cs20-undo'),!current?.customer||ui.delivering||!!current?.pause);
 hide($('cs20-top-up'),ui.career!=='boba');
 disable($('cs20-top-up'),!current?.customer||!ui.poured||ui.stage!=='mix'||ui.active||ui.pour>=100||ready||ui.delivering||!!current?.pause);
 // Đợt 2: không tồn tại nút chỉnh giá từng đơn; giá giữ theo Menu.
}
function endPour(){
 if(!ui.active)return;
 ui.active=false;ui.poured=true;ui.stage='mix';if(!practiceDish)bridge.setPresentation({pour:ui.pour,poured:true});ui.craft=.55*clamp(1-Math.abs(ui.pour-72)/50,0,1);
 setNotice('Đã rót trà. Bấm canh nhịp, rồi dập nắp khi kim vào vùng giữa.');
 renderDish();renderAction();
}
function pour(){
 if(!current?.customer||current.pause||ui.delivering)return;
 if(ui.active){endPour();return;}
 if(!['choose','mix'].includes(ui.stage))return;
 if(ui.pour>=100){setNotice('Ly đã đầy 100%. Canh dập nắp rồi giao món nhé.');return;}
 ui.stage='pour';ui.active=true;ui.lastTick=performance.now();setNotice('Nhấn Dừng rót khi nước gần vạch 72%. Có thể chạm giữ nút.');renderAction();ensureAnimation();
}
function primaryAction(){
 if(!current?.customer||ui.delivering)return;
 const a=primary.dataset.act;
 if(a==='send'){
  if(practiceDish){practiceDish=null;practiceKitchen.reset();ui.delivering=false;refresh(true);return;}
  // Native settlement is single source of truth; this session never changes economy directly.
  if(ui.delivering)return;ui.delivering=true;
  const ok=bridge.deliver(); if(!ok){ui.delivering=false;setNotice('Vui lòng kiểm tra tồn kho và đúng trạng thái đơn trước khi giao.');}
  else {setNotice('Đã giao món — đang chờ khách tiếp theo.');}
  refresh(true);return;
 }
 if(a==='pour'){pour();return;}
 if(a.startsWith('kitchen-')){
  if(a==='kitchen-redo'){$('cs20-undo').click();return;}
  const ok=kitchenAction(a.slice(8));
  if(ok&&a==='kitchen-drop')touchMotion($('cs20-visual').querySelector('[data-noodle-food]'),[{transform:'translateY(-12px)',opacity:.2},{transform:'translateY(0)',opacity:1}],350);
  return;
 }
 if(a==='cap-start'){
  if(!(practiceDish?practiceKitchen.action('begin'):bridge.beginCap()))return;
  ui.stage='capping';ui.capElapsed=0;ui.capPosition=0;ui.lastTick=performance.now();
  setNotice('Kim chạy qua lại. Nhấn khi kim ở vùng xanh; giữa màu vàng là Perfect!');renderDish();renderAction();ensureAnimation();return;
 }
 if(a==='cap-hit'){
  let result;
  if(practiceDish){if(!practiceKitchen.action('hit'))return;result=practiceKitchen.snapshot().grade;}
  else result=bridge.hitCap();
  if(!result)return;
  {
   ui.stage='done';ui.craft=result==='perfect'?1:.75;
   if(practiceDish)practiceDish.isShaken=true;
   touchMotion($('cs20-visual').querySelector('svg'),[{transform:'translateY(-5px)'},{transform:'translateY(3px)'},{transform:'translateY(0)'}],230);
   setNotice(result==='perfect'?(practiceDish?'Perfect! Luyện tập không cộng Xu.':'Perfect! Giao món được nhận để có tip biểu diễn 10%, tối đa 8 Xu.'):result==='bad'?'Hụt nhịp. Vẫn có thể giao để khách đánh giá, hoặc chọn làm lại.':'Good! Nắp đã kín, sẵn sàng giao món.');
  }
  refresh(true);return;
 }

}
let holdTimer=0, suppressClick=false;
primary.addEventListener('click',e=>{if(suppressClick){suppressClick=false;return;}primaryAction();});
$('cs20-top-up').addEventListener('click',()=>{if(!$('cs20-top-up').disabled)pour();});
primary.addEventListener('pointerdown',e=>{if(primary.dataset.act!=='pour'||primary.disabled)return;
  // Native pointer events enable hold to pour; touch tap also works using click fallback.
  if(ui.active)endPour();else pour();holdTimer=performance.now();suppressClick=true;
});
primary.addEventListener('pointerup',()=>{if(!holdTimer)return;const t=performance.now()-holdTimer;if(t>240&&ui.active)endPour();holdTimer=0;});
$('cs20-fire').addEventListener('click',()=>{if(!$('cs20-fire').disabled)kitchenAction('flame');});
$('cs20-flip').addEventListener('click',()=>{if(!$('cs20-flip').disabled)kitchenAction(ui.career==='noodle'?'stir':'flip');});
$('cs20-sauce').addEventListener('click',()=>{if(!$('cs20-sauce').disabled)kitchenAction('sauce');});
$('cs20-lift').addEventListener('click',()=>{if(!$('cs20-lift').disabled)kitchenAction('lift');});
$('cs20-undo').addEventListener('click',()=>{if(ui.delivering||current?.pause)return;if(practiceDish){practiceKitchen.reset();practiceDish.isShaken=false;practiceDish.isCooked=false;practiceDish.fryState='unfried';}else bridge.reset();reset(ui.key,ui.career);refresh(true);});
function refresh(force=false){
 const s=view();current=s;
 const key=s.customer?.key||`idle:${s.phase}:${s.career}`;
 if(key!==ui.key||s.career!==ui.career){reset(key,s.career);if(s.presentation&&s.career==='boba'){ui.pour=Number(s.presentation.pour)||0;ui.poured=!!s.presentation.poured;}force=true;}
 if(s.career!=='boba'||s.kitchen.stage!=='choose'){ui.kitchen=s.kitchen;ui.stage=s.kitchen.stage;const note=s.kitchen.hint||s.kitchen.notice;if(note&&ui.notice!==note)setNotice(note);}
 const hasOrder=!!s.customer;
 attr(root,'data-state',s.practice?'practice':hasOrder?'order':'idle');attr(root,'data-career',s.career);root.closest('#tab-shop')?.classList.toggle('cs20-active-order',hasOrder&&!s.practice);const courtyard=document.getElementById('v88-live-scene');if(courtyard)attr(courtyard,'data-cs20-compact',hasOrder?'true':'false');
 textField('cs20-customer-name',hasOrder?s.customer.name:s.phase==='open'?'Đang đợi khách ghé quán':'Quán đang nghỉ ca');
 const req=s.customer?.order;
 const career=s.career;
 const casual=career==='boba'?'Cho mình ly nước mát mát nha!':career==='noodle'?'Cho mình một thố mì ấm bụng nha!':'Cho mình vài xiên nóng hổi nha!';
 const rawSpeech=String(s.customer?.speech||'').trim().replace(/^[“"']|[”"']$/g,'');
 // Không lặp chi tiết đơn ở bong bóng; NPC vẫn được nói lời riêng nếu câu đủ gọn.
 textField('cs20-order-text',hasOrder?(rawSpeech&&rawSpeech.length<=72?`“${rawSpeech}”`:`“${casual}”`):s.phase==='open'?'Đang đợi khách…':'Quán nghỉ ca.');
 textField('cs20-order-time',hasOrder?(s.pause?'⏸':`${Math.ceil(s.customer.patience)}s`):'—');
 const label=id=>s.label?.[id]||id||'—';
 const portions=o=>{
   const keys=new Set([...(o?.toppings||[]),...Object.keys(o?.toppingPortions||{})]);
   return [...keys].map(id=>[id,Object.prototype.hasOwnProperty.call(o.toppingPortions||{},id)?Number(o.toppingPortions[id]):1]).filter(([id,n])=>n>0).map(([id,n])=>`${label(id)} ×${n}`);
 };
 let name='',pieces=[];
 if(req){
   if(career==='streetfood'){
     name=req.recipeName||'Xiên nướng';
     pieces=[({plate:'Đĩa',basket:'Mẹt',box:'Hộp'}[req.tray]||'Khay'),
       ...Object.entries(req.skewerCounts||{}).filter(([,n])=>Number(n)>0).map(([id,n])=>`${label(id)} ×${n}`),`Sốt ${label(req.sauce)}`];
   }else{
     name=req.recipeName||label(req.base);
     pieces=[({cup_m:'Ly M',cup_l:'Ly L',cup_xl:'Ly XL',bowl_m:'Thố M',bowl_l:'Thố L',bowl_xl:'Thố XL'}[req.container]||req.container),label(req.base),...portions(req)];
     if(career==='boba')pieces.push(`Đường ${req.sugar??100}%`,`Đá ${req.ice??100}%`);
     if(career==='noodle')pieces.push(`Cay cấp ${req.spicyLevel??1}`);
   }
 }
 const brief=pieces.join(' · ');
 textField('cs33-order-title',hasOrder?name:'Chưa có đơn');
 textField('cs33-order-summary',hasOrder?brief:'');
 const extras=(req?.quotedExtras||[]).map(e=>`${label(e.id)} thêm ×${e.qty}: ${e.subtotal} Xu`);
 const full=hasOrder?[`Khách: ${s.customer.name}`,`Món: ${name}`,...pieces,
   ...(extras.length?['Phụ thu: '+extras.join(' · ')]:[]),`GIÁ ĐÃ CHỐT: ${req?.quotedTotal??req?.maxPrice??'—'} Xu`].join('\n'):'Không có đơn đang chờ.';
 textField('cs33-order-detail',full);
 textField('cs33-help-body',career==='boba'?'Chọn ly, cốt trà và topping. Rót trà → canh vùng xanh/vàng → dập nắp → giao món.':career==='noodle'?'Chọn thố, nước cốt và topping. Bắt đầu → canh vùng sáng → nhấc nồi → giao món.':'Chọn khay, xiên và sốt. Canh hai mặt (tự lật) → quét sốt → gắp ra → giao món.');
 const paintStamp=JSON.stringify([s.career,s.dish,s.customer?.key,s.stockStamp,ui.group,s.catalog.map(x=>x.unlocked)]);
 if(force || ui.painted!==paintStamp){
   ui.painted=paintStamp;renderShelf();
 }
 if(s.career==='boba'&&s.dish.isShaken&&ui.stage==='finishing')setNotice('Ly đã dập nắp. Sẵn sàng giao món!');
 if(s.career==='noodle'&&s.dish.isCooked&&ui.stage==='heating')setNotice('Thố mì đã chín. Sẵn sàng giao!');
 if(s.career==='streetfood'&&ui.stage==='grilling'&&s.dish.fryState==='burnt')setNotice('Xiên đã bị cháy — làm lại hoặc giao món chất lượng thấp.');
 renderDish();renderAction();ensureAnimation();
}
let animationId=0,lastVisualFrame=0;
function needsMotion(){return !!current&&!current.pause&&document.visibilityState!=='hidden'&&current.phase==='open'&&!!current.customer&&current.customer.patience>0&&(ui.active||ui.stage==='capping'||['warming','timing'].includes(ui.stage));}
function ensureAnimation(){
 if(!needsMotion()){if(animationId)w.cancelAnimationFrame(animationId);animationId=0;return;}
 if(!animationId){ui.lastTick=performance.now();animationId=w.requestAnimationFrame(animate);}
}
function animate(t){
 animationId=0;
 const dt=Math.min(.07,(t-(ui.lastTick||t))/1000);ui.lastTick=t;
 if(!needsMotion())return;
 if(!ui.active){
  const play=kitchenView();ui.kitchen=play;ui.stage=play.stage;current.kitchen=play;
  const note=play.hint||play.notice;if(note&&note!==ui.notice)setNotice(note);
  if(t-lastVisualFrame>=33){lastVisualFrame=t;renderDish();renderAction();}
  if(needsMotion())animationId=w.requestAnimationFrame(animate);
  return;
 }
 if(ui.active){ui.pour=clamp(ui.pour+dt*35,0,100);if(ui.pour>=100)endPour();}
 if(ui.stage==='capping'){
  // Native clock owns real scoring; practice uses an isolated, ephemeral clock.
  if(practiceDish){ui.capPosition=practiceKitchen.snapshot().position;}
  else {const p=bridge.capPosition();if(p===null){ui.stage='choose';refresh(true);return;}ui.capPosition=p;}
 }
 if(t-lastVisualFrame>=33){lastVisualFrame=t;renderDish();renderAction();}
 if(needsMotion()&&!animationId)animationId=w.requestAnimationFrame(animate);
}
root.hidden=false;root.closest('#tab-shop')?.classList.add('cs20-enabled');setNotice(ui.notice);refresh(true);
w.setInterval(()=>refresh(false),550);
w.addEventListener('resize',()=>{if(current){renderShelf();updateRail();}},{passive:true});
w.BPVQCookingStation=Object.freeze({
 isActive:()=>!!root&&!root.hidden,
 startPractice:()=>{
  const s=bridge.snapshot();
  if(!s.started||s.phase==='open'||s.customer)return false;
  practiceDish=clone(s.dish);practiceDish.isShaken=false;practiceDish.isCooked=false;practiceDish.fryState='unfried';practiceDish.fryProgress=0;
  ++practiceNumber;practicePerson={key:'practice:'+practiceNumber,name:'Tập chế biến',description:'Thử chế biến tự do, không nhận thưởng',patience:90,maxPatience:90};practiceKitchen.reset();refresh(true);
  // Keep the player's scroll position unchanged when entering practice.
  return true;
 },
 stopPractice:()=>{if(!practiceDish)return false;practiceDish=null;practiceKitchen.reset();refresh(true);return true;},
 status:()=>({career:ui.career,stage:ui.stage,key:ui.key,craft:ui.craft,pour:ui.pour,poured:!!ui.poured,capPosition:ui.capPosition,kitchen:ui.kitchen,practice:!!practiceDish,animating:!!animationId,previewOnly:false})
});
})(window);
