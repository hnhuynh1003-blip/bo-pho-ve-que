/* BPVQ v88 Cooking Station 2.0: portrait-first gameplay controls.
   Core game keeps all order settlement, inventory and save ownership. */
(function(w){
'use strict';
const bridge=w.BPVQCookingBridge, root=document.getElementById('cs20-station');
if(!bridge||!root)return;
const fields=new Map();
const $=id=>{if(!fields.has(id))fields.set(id,document.getElementById(id));return fields.get(id);};
const groups={
 boba:[['base','Cốt trà'],['topping','Topping & siro']],
 noodle:[['base','Nước cốt'],['topping','Topping'],['flavor','Cấp cay']],
 streetfood:[['skewer','Chọn xiên'],['sauce','Nước sốt']]
};
let ui={key:'',career:'',group:'',page:0,stage:'choose',pour:0,heat:0,hold:0,flip:false,sauce:false,stir:0,craft:0,notice:'',lastTick:0,started:0,painted:'',active:false,delivering:false};
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
  else { const m={...Object.fromEntries(d.toppings.map(k=>[k,1])),...(d.toppingPortions||{})};const n=Object.prototype.hasOwnProperty.call(m,key)?Number(m[key]):0;const q=clamp(n+Math.sign(delta),0,3);m[key]=q;d.toppingPortions=m;d.toppings=Object.keys(m).filter(k=>m[k]>0);}
 }
 d.isShaken=false;d.isCooked=false;d.fryState='unfried';d.fryProgress=0;
 return true;
}

const tabs=$('cs20-groups'),shelf=$('cs20-shelf'),stage=root.querySelector('.cs20-stage'),primary=$('cs20-primary');
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
function safe(t){return String(t==null?'':t)}
function textField(id,value){const el=$(id),v=String(value);if(el&&el.textContent!==v)el.textContent=v;}
function attr(el,name,value){const v=String(value);if(el.getAttribute(name)!==v)el.setAttribute(name,v);}
function disable(el,value){if(el.disabled!==!!value)el.disabled=!!value;}
function hide(el,value){if(el.hidden!==!!value)el.hidden=!!value;}
function setNotice(s){ui.notice=s;textField('cs20-feedback',s);}
function touchMotion(el,frames,duration=180){if(!el||w.matchMedia('(prefers-reduced-motion: reduce)').matches)return;el.getAnimations().forEach(a=>a.cancel());el.animate(frames,{duration,easing:'ease-out'});}
function reset(key,career){
 const sameCareer=career===ui.career,group=sameCareer?ui.group:career==='boba'?'topping':groups[career]?.[0][0]||'size',page=sameCareer?ui.page:0;
 ui={key,career,group,page,stage:'choose',pour:0,heat:0,hold:0,flip:false,sauce:false,stir:0,craft:0,notice:'Chọn nguyên liệu rồi thao tác trực tiếp với món nhé!',lastTick:performance.now(),started:0,painted:'',active:false,delivering:false};
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
 if(practiceDish){if(!x.unlocked)return;practiceSelect(x.group,x.id,delta);}else{if(!bridge.choose(x.group,x.id,delta))return;}
 ui.page=Math.max(0,ui.page||0);
 ui.stage='choose';ui.active=false;ui.pour=0;ui.hold=0;ui.heat=0;ui.flip=false;ui.sauce=false;ui.stir=0;ui.craft=0;
 setNotice('Đã đổi thành phần. Chế biến lại để món đạt chuẩn.');
 touchMotion($('cs20-visual').querySelector('svg'),[{transform:'translateY(0)'},{transform:'translateY(-3px)'},{transform:'translateY(0)'}]);
 refresh(true);
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
 if(practiceDish)practiceSelect(kind,n,1);else if(!bridge.choose(kind,n))return;
 ui.stage='choose';ui.active=false;ui.heat=0;ui.pour=0;ui.hold=0;ui.stir=0;ui.craft=0;refresh(true);
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
  const src=INGREDIENT_ART[x.id]||({'tea_matcha':'v8761_tea_matcha.svg','topping_peach':'v8761_topping_peach.svg','topping_brown_boba':'v8761_topping_brown_boba.svg','topping_salted_cream':'v8761_topping_salted_cream.svg','syrup_rainbow':'v8761_syrup_rainbow.svg'}[x.id]);
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
 if(!current||!['boba','noodle'].includes(ui.career)||!lastPortionKey)return;
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
  const tops=Array.from({length:7},(_,i)=>`<ellipse data-noodle-top cx="${67+(i%4)*20}" cy="${101+Math.floor(i/4)*15}" rx="9" ry="5" fill="#c88765" opacity="0"/>`).join('');
  const bubbles=Array.from({length:7},(_,i)=>`<circle data-bubble cx="${62+(i%4)*24}" cy="${99-(i%3)*15}" r="${3+(i%3)*2}" fill="#fff4cf" opacity="0"/>`).join('');
  content=`<ellipse cx="101" cy="164" rx="70" ry="8" fill="#a76f45" opacity=".15"/><path d="M38 67 Q100 43 162 67 L149 145 Q101 173 50 145 Z" fill="#b17d61" stroke="#80513f" stroke-width="3"/><ellipse cx="100" cy="75" rx="65" ry="25" fill="#603b2d" stroke="#b87a4d" stroke-width="4"/><ellipse data-soup cx="100" cy="76" rx="55" ry="18" fill="#dd9c59"/>${tops}${bubbles}<path data-steam d="M58 45 Q44 27 57 14 M102 41 Q87 24 102 11 M145 43 Q131 25 145 13" stroke="#aebbb5" stroke-width="4" opacity=".15" fill="none" stroke-linecap="round"/><path data-flame d="M55 161 L71 172 L128 172 L145 161" stroke="#e79743" stroke-width="5" stroke-linecap="round" opacity="0"/>`;
 }else{
  const skewers=Array.from({length:4},(_,i)=>`<g data-skewer-row opacity="0"><line x1="33" y1="${64+i*25}" x2="165" y2="${64+i*25}" stroke="#c9a66a" stroke-width="4" stroke-linecap="round"/>${Array.from({length:5},(_,j)=>`<rect data-skewer-piece x="${49+j*19}" y="${55+i*25}" width="14" height="18" rx="5" fill="#d7a26e" stroke="#8d5438" stroke-width="1" opacity="0"/>`).join('')}</g>`).join('');
  content=`<rect x="19" y="43" width="162" height="117" rx="15" fill="#8b8071" stroke="#51473e" stroke-width="5"/><rect x="29" y="52" width="142" height="97" rx="8" fill="#493d36"/>${Array.from({length:7},(_,i)=>`<line x1="${36+i*21}" y1="53" x2="${36+i*21}" y2="147" stroke="#99897a" stroke-width="2"/>`).join('')}<path data-grill-fire d="M35 145 Q52 132 67 143 T105 143 T145 143" stroke="#f49d52" stroke-width="5" fill="none" opacity=".2"/>${skewers}`;
 }
 return `<svg viewBox="0 0 200 180" role="img" aria-label="Món ${s.career==='boba'?'trà sữa':s.career==='noodle'?'mì cay':'xiên que'} đang chế biến">${content}</svg>`;
}
function paintVessel(s){
 const visual=$('cs20-visual'),d=s.dish;
 if(visualCareer!==s.career){
  visualCareer=s.career;visual.innerHTML=buildVisual(s);
  const one=q=>visual.querySelector(q),all=q=>[...visual.querySelectorAll(q)];
  visualRefs={stream:one('[data-pour-stream]'),tea:one('[data-tea]'),wave:one('[data-wave]'),lid:one('[data-lid]'),pearls:all('[data-pearl]'),ice:all('[data-ice]'),tops:all('[data-noodle-top]'),bubbles:all('[data-bubble]'),soup:one('[data-soup]'),steam:one('[data-steam]'),flame:one('[data-flame]'),rows:all('[data-skewer-row]'),fire:one('[data-grill-fire]')};
 }
 const v=visualRefs;
 if(s.career==='boba'){
  attr(v.stream,'opacity',ui.active?'.75':'0');
  const fill=ui.pour>0?Math.max(3,Math.round(ui.pour)):d.isShaken?78:8,y=153-fill*1.1;
  attr(v.tea,'y',y.toFixed(1));attr(v.tea,'fill',teaColors[d.base]||'#bb9163');
  attr(v.wave,'d',`M52 ${y+4} Q80 ${y-1} 110 ${y+4} T148 ${y+4}`);attr(v.lid,'opacity',d.isShaken?'1':'.65');
  const dots=(d.toppings||[]).flatMap(key=>Array.from({length:Math.min(3,portionCount(d,key))*4},()=>key)).slice(0,36);
  v.pearls.forEach((el,i)=>{const key=dots[i];attr(el,'opacity',key?'1':'0');if(key){attr(el,'fill',key.includes('boba')?'#49312c':key.includes('jelly')?'#b3d79a':key.includes('redbean')?'#965b49':key.includes('peach')?'#e5a785':'#f8dca5');attr(el,'r',key.includes('boba')?4.5:4);}});
  const iceCount=Number(d.ice)===100?8:Number(d.ice)===50?4:0;v.ice.forEach((el,i)=>attr(el,'opacity',i<iceCount&&fill>25?'1':'0'));
 }else if(s.career==='noodle'){
  v.tops.forEach((el,i)=>{attr(el,'opacity',i<(d.toppings||[]).length?'1':'0');attr(el,'fill',['#7caa57','#eedc9a','#c88462','#9fca86'][i%4]);});
  v.bubbles.forEach((el,i)=>attr(el,'opacity',i<Math.floor(ui.heat/14)?'.8':'0'));
  attr(v.soup,'fill',ui.heat>80?'#e67a31':'#dd9c59');attr(v.steam,'opacity',ui.heat>45?'.75':'.15');attr(v.flame,'opacity',ui.heat>20?'.8':'0');
 }else{
  const entries=Object.entries(d.skewerCounts||{}).filter(x=>x[1]>0).slice(0,4);
  v.rows.forEach((row,i)=>{attr(row,'opacity',entries[i]?'1':'0');const n=entries[i]?.[1]||0;[...row.querySelectorAll('[data-skewer-piece]')].forEach((el,j)=>{attr(el,'opacity',j<Math.min(n,5)?'1':'0');attr(el,'fill',d.fryState==='perfect'?'#c57f3a':ui.flip?'#d28a4a':'#d7a26e');});});
  attr(v.fire,'opacity',ui.stage==='grilling'?'.9':'.2');
 }
}
function renderDish(){
 if(!current)return;
 const s=current,d=s.dish;
 textField('cs20-dish-name',s.career==='boba'?'Ly trà đang pha':s.career==='noodle'?'Thố mì đang nấu':'Vỉ xiên đang nướng');
 const mat=s.career==='streetfood'?Object.values(d.skewerCounts).reduce((a,b)=>a+Number(b||0),0)+' xiên · '+(s.label[d.sauce]||'Sốt'):(s.label[d.base]||'Nước cốt')+' · '+Object.values(Object.fromEntries(d.toppings.map(k=>[k,portionCount(d,k)]))).reduce((a,b)=>a+b,0)+' phần topping';
 textField('cs20-dish-detail',mat);paintVessel(s);
 textField('cs20-valuation',s.practice?'Luyện tập · Kho/Xu giữ nguyên':`Vốn ${s.cost} Xu`);
 textField('cs20-profit',s.practice?'Giá chỉ tham khảo':`Lãi dự kiến ${Math.round(Number(d.listedPrice)-Number(s.cost))} Xu`);
 textField('cs20-sale-price',`${d.listedPrice} Xu`);
 const progress=Math.round(s.career==='boba'?ui.pour:s.career==='noodle'?ui.heat:Number(d.fryProgress||0)),width=clamp(progress,0,100)+'%';
 if($('cs20-gauge').style.width!==width)$('cs20-gauge').style.width=width;
 textField('cs20-gauge-label',s.career==='boba'?`Lượng rót ${Math.round(ui.pour)}%`:s.career==='noodle'?`Nhiệt ${Math.round(ui.heat)}% · Giữ nhịp ${ui.hold.toFixed(1)}s`:`Độ chín ${Math.round(d.fryProgress||0)}%`);
 textField('cs20-craft',ui.craft>0?`Dấu ấn ${Math.round(ui.craft*100)}% (hiển thị)`:'Pha một ly theo ý bạn');
 const capping=s.career==='boba'&&ui.stage==='capping';
 const meter=$('cs20-gauge').parentElement;meter.classList.toggle('cs29-cap-meter',capping);
 if(capping){
  const p=s.practice?ui.capPosition:bridge.capPosition();
  if(p!==null){ui.capPosition=p;meter.style.setProperty('--cap-position',p+'%');}
  textField('cs20-gauge-label','Canh kim ở giữa • Dập nắp!');
  textField('cs20-craft','Xanh: đạt · Vàng giữa: Perfect');
 }
}
function renderAction(){
 const ready=current?.dish?.isShaken||current?.dish?.isCooked||current?.dish?.fryState==='perfect';
 const d=current?.dish||{};
 let label='',secondary='',disabled=false;
 if(!current?.customer){label=current?.phase==='open'?'Đang chờ khách…':'Mở quán để đón khách';disabled=true;}
 else if(ready){label=safe(current?.practice?'✨ Hoàn thành bài luyện':'✨ Giao món cho khách');secondary='send';}
 else if(ui.career==='boba'){
  if(ui.stage==='choose'||ui.stage==='pour'){label=ui.active?'⏹ Dừng rót':'🫖 Rót trà vào ly';secondary='pour';}
  else if(ui.stage==='mix'){label='🥤 Canh nhịp dập nắp';secondary='cap-start';}
  else if(ui.stage==='capping'){label='✦ Dập nắp ngay!';secondary='cap-hit';}
  else {label='Đang dập nắp…';disabled=true;}
 } else if(ui.career==='noodle'){
  label=ui.stage==='cook'?'🔥 Tăng lửa / Giữ nhiệt':ui.stage==='heating'?'Đang bày món…':'🔥 Bắt đầu nấu';secondary='heat';disabled=ui.stage==='heating';
 }else{
  if(ui.stage==='choose'){label='🔥 Đặt xiên lên vỉ';secondary='grill';}
  else if(ui.stage==='grilling'){
   label=d.fryProgress>=65&&d.fryProgress<=90?'🥢 Vớt mẻ xiên':'🔥 Đang nướng — canh nhiệt';secondary=d.fryProgress>=65&&d.fryProgress<=90?'pull':'watch';disabled=secondary==='watch';
  }else{label='Đang hoàn thiện…';disabled=true;}
 }
 textField('cs20-primary',label);disable(primary,disabled||!!current?.pause);attr(primary,'data-act',secondary);
 hide($('cs20-flip'),!(ui.career==='streetfood'&&ui.stage==='grilling'));
 hide($('cs20-sauce'),!(ui.career==='streetfood'&&ui.stage==='grilling'));
 disable($('cs20-flip'),ui.flip);disable($('cs20-sauce'),ui.sauce);
 disable($('cs20-undo'),!current?.customer||ui.delivering||!!current?.pause);
 disable($('cs20-price-down'),!current?.customer||!!current?.practice||!!current?.pause);disable($('cs20-price-up'),!current?.customer||!!current?.practice||!!current?.pause);
}
function endPour(){
 if(!ui.active)return;
 ui.active=false;ui.stage='mix';ui.craft=.55*clamp(1-Math.abs(ui.pour-72)/50,0,1);
 setNotice('Đã rót trà. Bấm canh nhịp, rồi dập nắp khi kim vào vùng giữa.');
 renderDish();renderAction();
}
function pour(){
 if(ui.active){endPour();return;}
 if(ui.stage==='mix')return;
 ui.stage='pour';ui.active=true;ui.lastTick=performance.now();setNotice('Nhấn Dừng rót khi nước gần vạch 72%. Có thể chạm giữ nút.');renderAction();ensureAnimation();
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
 if(a==='cap-start'){
  if(!practiceDish&&!bridge.beginCap())return;
  ui.stage='capping';ui.capElapsed=0;ui.capPosition=0;ui.lastTick=performance.now();
  setNotice('Kim chạy qua lại. Nhấn khi kim ở vùng xanh; giữa màu vàng là Perfect!');renderDish();renderAction();ensureAnimation();return;
 }
 if(a==='cap-hit'){
  let result;
  if(practiceDish){const p=ui.capPosition;result=p>=44&&p<=56?'perfect':p>=32&&p<=68?'good':'miss';}
  else result=bridge.hitCap();
  if(!result)return;
  if(result==='miss'){ui.stage='mix';setNotice('Hụt nhịp rồi! Canh lại nhé, khách vẫn đang chờ.');}
  else{
   ui.stage='done';ui.craft=result==='perfect'?1:.75;
   if(practiceDish)practiceDish.isShaken=true;
   touchMotion($('cs20-visual').querySelector('svg'),[{transform:'translateY(-5px)'},{transform:'translateY(3px)'},{transform:'translateY(0)'}],230);
   setNotice(result==='perfect'?(practiceDish?'Perfect! Luyện tập không cộng Xu.':'Perfect! Giao đúng món để nhận tip biểu diễn 10%, tối đa 8 Xu.'):'Nắp đã kín! Sẵn sàng giao món.');
  }
  refresh(true);return;
 }
 if(a==='heat'){
  if(ui.stage==='choose'){ui.stage='cook';ui.heat=25;ui.hold=0;ui.lastTick=performance.now();setNotice('Chạm tăng lửa, giữ nhiệt ổn định trong vùng 58–82%.');}
  else if(ui.stage==='cook'){ui.heat=clamp(ui.heat+23,0,100);}
  renderAction();ensureAnimation();return;
 }
 if(a==='grill'){
  if(Object.values(current.dish.skewerCounts).reduce((a,b)=>a+Number(b),0)<1){setNotice('Chọn ít nhất một que xiên trước khi nướng.');return;}
  ui.stage='grilling';ui.flip=false;ui.sauce=false;ui.lastTick=performance.now();if(practiceDish){practiceDish.fryProgress=0;practiceDish.fryState='unfried';}else bridge.complete('startGrill');setNotice('Lật xiên, quét sốt và vớt khi độ chín xanh.');renderAction();ensureAnimation();return;
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
 attr(root,'data-state',s.practice?'practice':hasOrder?'order':'idle');attr(root,'data-career',s.career);root.closest('#tab-shop')?.classList.toggle('cs20-active-order',hasOrder&&!s.practice);const courtyard=document.getElementById('v88-live-scene');if(courtyard)attr(courtyard,'data-cs20-compact',hasOrder?'true':'false');
 textField('cs20-customer-name',hasOrder?s.customer.name:s.phase==='open'?'Đang đợi khách ghé quán':'Quán đang nghỉ ca');
 textField('cs20-order-text',hasOrder?s.customer.description:s.phase==='open'?'Quầy đã sẵn sàng. Khách đến sẽ gọi món tại đây.':'Mở quán để đón khách, hoặc chọn Tập chế biến.');
 textField('cs20-order-time',hasOrder?(s.pause?'⏸':`${Math.ceil(s.customer.patience)}s`):'—');
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
function needsMotion(){return !!current&&!current.pause&&document.visibilityState!=='hidden'&&current.phase==='open'&&!!current.customer&&current.customer.patience>0&&(ui.active||ui.stage==='capping'||ui.stage==='cook'||ui.stage==='grilling');}
function ensureAnimation(){
 if(!needsMotion()){if(animationId)w.cancelAnimationFrame(animationId);animationId=0;return;}
 if(!animationId){ui.lastTick=performance.now();animationId=w.requestAnimationFrame(animate);}
}
function animate(t){
 animationId=0;
 const dt=Math.min(.07,(t-(ui.lastTick||t))/1000);ui.lastTick=t;
 if(!needsMotion())return;
 if(ui.active){ui.pour=clamp(ui.pour+dt*35,0,100);if(ui.pour>=100)endPour();}
 if(ui.stage==='capping'){
  // Native clock owns real scoring; practice uses an isolated, ephemeral clock.
  if(practiceDish){ui.capElapsed+=dt*1000;const c=(ui.capElapsed/1800)%2;ui.capPosition=(c<=1?c:2-c)*100;}
  else {const p=bridge.capPosition();if(p===null){ui.stage='choose';refresh(true);return;}ui.capPosition=p;}
 }
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
 else if((ui.active||ui.stage==='capping'||ui.stage==='cook'||(practiceDish&&ui.stage==='grilling'))&&t-lastVisualFrame>=33){lastVisualFrame=t;renderDish();renderAction();}
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
  ++practiceNumber;refresh(true);
  // Keep the player's scroll position unchanged when entering practice.
  return true;
 },
 stopPractice:()=>{if(!practiceDish)return false;practiceDish=null;refresh(true);return true;},
 status:()=>({career:ui.career,stage:ui.stage,key:ui.key,craft:ui.craft,capPosition:ui.capPosition,practice:!!practiceDish,animating:!!animationId,previewOnly:false})
});
})(window);
