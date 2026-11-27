/* v88.16.13: timing is independent of completion and economic settlement. */
(function(w){
'use strict';
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
// Boba preparation is transient; requested order is never a source of applied ingredients.
function emptyBoba(){return {career:'boba',container:null,selectedBase:null,base:null,sugar:null,ice:null,pourAmount:0,
 spicyLevel:0,fryHeat:170,tray:null,sauce:null,toppings:[],toppingPortions:{},skewerCounts:{},listedPrice:45,
 isShaken:false,isCooked:false,fryProgress:0,fryState:'unfried'};}
function canCapDish(d){
 return !!d&&d.career==='boba'&&typeof d.container==='string'&&d.container.startsWith('cup_')&&
  typeof d.base==='string'&&d.base===d.selectedBase&&Number.isFinite(d.pourAmount)&&d.pourAmount>0&&d.pourAmount<=100&&
  [0,30,70,100].includes(d.sugar)&&[0,50,100].includes(d.ice);
}
function chooseBoba(d,group,key,delta=1){
 if(!d||d.career!=='boba'||d.isShaken)return false;
 if(group==='container'){
  if(typeof key!=='string'||!key.startsWith('cup_')||d.container===key)return false;
  if(d.base||d.pourAmount>0||d.sugar!==null||d.ice!==null||d.toppings?.length)return false;
  d.container=key;
 }else if(group==='base'){
  if(typeof key!=='string'||!key||d.selectedBase===key||d.pourAmount>0)return false;
  d.selectedBase=key;
 }else if(group==='sugar'||group==='ice'){
  if(!d.container||key===null||key===undefined||key==='')return false;
  const n=Number(key),allowed=group==='sugar'?[0,30,70,100]:[0,50,100];
  if(!allowed.includes(n)||d[group]===n)return false;d[group]=n;
 }else if(group==='topping'){
  if(!d.container||typeof key!=='string'||!key)return false;
  const portions={...Object.fromEntries((d.toppings||[]).map(k=>[k,1])),...(d.toppingPortions||{})};
  const old=Number(portions[key]||0),next=Math.max(0,Math.min(3,old+Math.sign(delta)));
  if(!Number.isFinite(next)||next===old)return false;
  if(next)portions[key]=next;else delete portions[key];
  d.toppingPortions=portions;d.toppings=Object.keys(portions).filter(k=>portions[k]>0);
 }else return false;
 delete d.recipeId;return true;
}
function pourBoba(d,amount){
 if(!d||d.career!=='boba'||d.isShaken||!d.container||!d.selectedBase||typeof amount!=='number'||!Number.isFinite(amount)||amount<=0||amount>100||
    (d.base&&d.base!==d.selectedBase)||amount<=Number(d.pourAmount||0))return false;
 d.base=d.selectedBase;d.pourAmount=amount;delete d.recipeId;return true;
}
// Keep the original signature for already-paid legacy batches; new batches include actual pour.
const signature=c=>JSON.stringify([c.career,c.dish.container,c.dish.tray,c.dish.base,c.dish.spicyLevel,c.dish.sugar,c.dish.ice,c.dish.sauce,Object.entries(c.dish.toppingPortions||{}).sort(),[...(c.dish.toppings||[])].sort(),Object.entries(c.dish.skewerCounts||{}).sort(),...(c.career==='boba'&&Object.prototype.hasOwnProperty.call(c.dish,'pourAmount')?[c.dish.selectedBase,c.dish.pourAmount]:[])]);
function create({context,now=()=>performance.now(),onBegin=()=>true,onFinish=()=>{},onChange=()=>{}}){
 let s=null,last=now(),suspended=false;
 const blocked=c=>!!c.paused||!!c.hidden;
 const valid=c=>s&&c.person===s.person&&c.dish===s.dish&&c.career===s.career&&c.phase==='open'&&c.patience>0&&signature(c)===s.signature;
 function reset(){s=null;last=now();suspended=false;}
 function position(){const p=s? s.phaseTime/(s.career==='boba'?1.8:2.2):0;const f=p%2;return (f<=1?f:2-f)*100;}
 function data(){if(!s)return {stage:'choose',ready:false,canFinish:false,canDrop:false,flame:2,heat:20,cook:0,a:0,b:0,side:'a',sauced:false,grade:'',notice:'',elapsed:0};
 return {career:s.career,stage:s.stage,ready:s.stage==='done',canFinish:s.stage==='plating',canDrop:false,flame:2,heat:s.stage==='warming'?20+60*clamp(s.phaseTime/1.4,0,1):80,cook:s.hits.length?100:0,a:s.hits.length?100:0,b:s.hits.length>1?100:0,side:s.hits.length?'b':'a',sauced:s.sauced,grade:s.grade,notice:s.notice,hint:s.notice,elapsed:s.elapsed,position:position(),round:s.hits.length+1,totalRounds:s.career==='streetfood'?2:1,hits:[...s.hits],offHeat:['plating','done'].includes(s.stage),overflow:0,glaze:0,setTime:1};}
 function changed(){onChange(exportState());}
 function complete(){s.stage='done';s.grade=s.hits.includes('bad')?'bad':s.hits.every(g=>g==='perfect')&&(s.career!=='streetfood'||s.sauced)?'perfect':'good';s.notice=s.grade==='perfect'?'Perfect! Món đã hoàn thành.':s.grade==='good'?'Good! Sẵn sàng giao món.':'Hụt nhịp — vẫn có thể giao để khách đánh giá, hoặc chọn làm lại.';onFinish(s.grade,data());changed();}
 function hit(grade){s.hits.push(grade);s.phaseTime=0;
  if(s.career==='streetfood'&&s.hits.length===1){s.stage='warming';s.notice='Đã tự lật sang mặt B. Canh nhịp thứ hai nhé!';changed();}
  else if(s.career==='streetfood'){s.stage='plating';s.grade=s.hits.includes('bad')?'bad':s.hits.every(g=>g==='perfect')&&(s.career!=='streetfood'||s.sauced)?'perfect':'good';s.notice='Hai mặt đã xong. Quét sốt rồi gắp ra; có thể gắp ngay nếu muốn.';changed();}
  else complete();
 }
 function tick(){const t=now(),c=context(),dt=clamp((t-last)/1000,0,.12);last=t;
  if(!s)return c;if(!valid(c)){reset();return c;}if(blocked(c)){suspended=true;return c;}
  const step=suspended?0:dt;suspended=false;
  if(['warming','timing','capping'].includes(s.stage)){s.elapsed+=step;s.phaseTime+=step;
   if(s.stage==='warming'&&s.phaseTime>=(s.career==='noodle'?2:1.5)){s.stage='timing';s.phaseTime=0;s.notice=s.career==='noodle'?'Canh vùng sáng và nhấn nhấc nồi!':'Canh vùng sáng cho mặt '+(s.hits.length?'B':'A')+'!';changed();}
   else if(['timing','capping'].includes(s.stage)&&s.phaseTime>=(s.career==='boba'?7.2:8.8))hit('bad');
  }return c;
 }
 function snapshot(){const c=tick(),v=data();return Object.freeze({...v,ready:v.ready&&!blocked(c),canFinish:v.canFinish&&!blocked(c)});}
 function begin(){const c=tick();if(s||!['boba','noodle','streetfood'].includes(c.career)||!c.person||c.phase!=='open'||c.patience<=0||blocked(c))return false;
  if(c.career==='boba'&&!canCapDish(c.dish))return false;
  if(c.career==='streetfood'&&!Object.values(c.dish.skewerCounts||{}).some(n=>Number(n)>0))return false;
  if(onBegin(c)===false)return false;
  s={person:c.person,dish:c.dish,career:c.career,signature:signature(c),stage:c.career==='boba'?'capping':'warming',phaseTime:0,elapsed:0,hits:[],sauced:false,grade:'',notice:c.career==='boba'?'Canh vùng sáng để dập nắp.':'Đang làm nóng bếp…'};last=now();suspended=false;changed();return true;
 }
 function action(kind){if(kind==='begin')return begin();const c=tick();if(!valid(c)||blocked(c))return false;
  if(kind==='hit'&&['timing','capping'].includes(s.stage)){const p=position();hit(p>=44&&p<=56?'perfect':p>=28&&p<=72?'good':'bad');return true;}
  if(kind==='sauce'&&s.stage==='plating'&&!s.sauced){s.sauced=true;s.notice='Đã quét sốt. Gắp ra để giao món.';changed();return true;}
  if(['lift','finish'].includes(kind)&&s.stage==='plating'){complete();return true;}return false;
 }
 function exportState(){if(!s)return null;const {person,dish,...v}=s;return JSON.parse(JSON.stringify(v));}
 function restore(v){reset();const c=context();if(!v||v.career!==c.career||!c.person||c.phase!=='open'||c.patience<=0||v.signature!==signature(c)||!['warming','timing','capping','plating','done'].includes(v.stage))return false;
  const max=c.career==='streetfood'?2:1;
  if(!Array.isArray(v.hits)||v.hits.length>max||v.hits.some(g=>!['perfect','good','bad'].includes(g))||!Number.isFinite(v.phaseTime)||v.phaseTime<0||v.phaseTime>10||!Number.isFinite(v.elapsed)||v.elapsed<0)return false;
  if((v.stage==='done'||v.stage==='plating')&&v.hits.length!==max)return false;
  if(v.stage==='plating'&&c.career!=='streetfood'||v.stage==='capping'&&c.career!=='boba'||v.stage==='timing'&&c.career==='boba'||['warming','timing','capping'].includes(v.stage)&&v.hits.length>=max)return false;
  s={...JSON.parse(JSON.stringify(v)),person:c.person,dish:c.dish};s.grade=s.hits.length===max?(s.hits.includes('bad')?'bad':s.hits.every(g=>g==='perfect')&&(s.career!=='streetfood'||s.sauced)?'perfect':'good'):'';last=now();suspended=false;return true;
 }
 return Object.freeze({action,snapshot,reset,ready:()=>snapshot().ready,exportState,restore});
}
w.BPVQKitchenPlay=Object.freeze({create,emptyBoba,canCapDish,chooseBoba,pourBoba});
})(window);
