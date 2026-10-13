/* v88.16.12: real elapsed-time kitchen sessions. No money, inventory or save writes.
   Native and practice use the same rules; native completion stays in the core closure. */
(function(w){
'use strict';
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
function signature(c){const d=c.dish;return JSON.stringify([c.career,d.container,d.tray,d.base,d.spicyLevel,d.sauce,
 Object.entries(d.toppingPortions||{}).sort(),[...(d.toppings||[])].sort(),Object.entries(d.skewerCounts||{}).sort()]);}
function create({context,now=()=>performance.now(),onBegin=()=>{},onFinish=()=>{}}){
 let s=null,lastTick=now(),suspended=false;
 const valid=c=>s&&c.person===s.person&&c.dish===s.dish&&c.career===s.career&&c.phase==='open'&&c.patience>0&&signature(c)===s.signature;
 const blocked=c=>!!c.paused||!!c.hidden;
 function reset(){s=null;lastTick=now();suspended=false;}
 function tick(){
  const t=now(),c=context(),gap=clamp((t-lastTick)/1000,0,.12);lastTick=t;
  if(!s)return c;
  if(!valid(c)){reset();return c;}
  if(blocked(c)){suspended=true;return c;}
  const dt=suspended?0:gap;suspended=false;
  if(s.stage==='held'){
   // Food is off the heat. Only sauce settling may continue, never doneness.
   if(s.career==='streetfood'&&s.sauced)s.setTime+=dt;
   return c;
  }
  if(!['heating','simmer','grilling'].includes(s.stage))return c;
  s.elapsed+=dt;
  if(s.career==='noodle'){
   const target=[0,54,74,96][s.flame];s.heat+=(target-s.heat)*Math.min(1,dt*1.3);
   if(s.stage==='simmer'){
    if(s.heat>=60)s.cook+=dt*22*(s.heat>86?1.12:1)/s.size;
    if(s.heat>=62&&s.heat<=82)s.stable+=dt;
    s.overflow=clamp(s.overflow+dt*(s.heat>88?38:-17),0,100);
    if(s.overflow>65)s.spilled=true;
    if(s.overflow>=100||s.cook>137){s.stage='failed';s.grade='burnt';s.notice=s.cook>137?'Mì quá lửa rồi. Làm lại nhé!':'Nồi bị trào! Làm lại và hạ lửa sau khi thả mì.';onFinish('burnt',snapshotValue(c));}
   }
  }else{
   const rate=[0,13,20,29][s.flame];s[s.side]+=dt*rate;
   if(s.sauced){s.glaze+=dt*([0,2,6,15][s.flame]);s.setTime+=dt;}
   if(Math.max(s.a,s.b)>116||s.glaze>=70){s.stage='failed';s.grade='burnt';s.notice='Xiên hoặc sốt đã khét. Làm lại và giảm lửa nhé!';onFinish('burnt',snapshotValue(c));}
  }
  return c;
 }
 function canFinish(){
  if(!s)return false;
  if(s.career==='noodle')return (s.stage==='simmer'||s.stage==='held'&&s.restStage==='simmer')&&s.elapsed>=6*s.size&&s.cook>=88&&s.cook<=118&&s.stable>=1&&s.overflow<65;
  return ['grilling','held'].includes(s.stage)&&s.elapsed>=7&&Math.min(s.a,s.b)>=65&&Math.max(s.a,s.b)<=105&&s.sauced&&s.setTime>=.5&&s.glaze<55;
 }
 function hint(){
  if(!s||['choose','done','failed','heating'].includes(s.stage))return '';
  const held=s.stage==='held';
  if(canFinish())return held?'Món đã ngoài bếp và đủ bước. Bấm hoàn thiện để giao.':s.career==='noodle'?'Mì đã đạt! Nhấc nồi ngay để giữ độ chín.':'Xiên đã đạt! Gắp ra đĩa/mẹt để giữ độ chín.';
  if(s.career==='noodle'){
   if(!held&&s.flame===3)return 'Nước đã sôi! Hạ lửa vừa để mì chín đều, tránh trào.';
   if(!held&&s.flame===1&&s.heat<62&&s.cook<88)return 'Lửa quá nhỏ, mì chín chậm. Tăng về lửa vừa để nấu tiếp.';
   if(s.cook>118)return 'Mì đã quá mềm. Làm lại để đạt đúng độ chín.';
   if(s.cook<88)return held?'Mì còn sống. Đặt lại bếp để nấu tiếp.':'Mì đang chín. Có thể nhấc nồi để dừng nhiệt bất cứ lúc nào.';
   if(s.stable<1)return held?'Đặt lại bếp, hạ lửa vừa và giữ sôi nhẹ 1 giây.':'Hạ lửa vừa, giữ sôi nhẹ 1 giây rồi nhấc nồi.';
   if(s.elapsed<6*s.size)return held?'Thố chưa đủ thời gian. Đặt lại bếp ở lửa vừa.':'Thố cần thêm một chút thời gian ở lửa vừa.';
   if(s.overflow>=65)return 'Nhấc nồi để dừng nhiệt, rồi đặt lại ở lửa vừa để hạ nguy cơ trào.';
  }else{
   if(Math.max(s.a,s.b)>105)return 'Một mặt đã quá lửa. Làm lại mẻ để đạt chuẩn.';
   if(Math.min(s.a,s.b)<65)return (held?'Đặt lại vỉ, ':'')+'canh mặt '+(s.a<s.b?'A':'B')+' chín; lật để đổi mặt nhận nhiệt.';
   if(s.elapsed<7)return held?'Mẻ chưa đủ thời gian. Đặt lại vỉ ở lửa nhỏ.':'Hạ lửa nhỏ, canh thêm một chút rồi gắp ra.';
   if(!s.sauced)return 'Hai mặt đã chín! Gắp ra rồi quét sốt trên đĩa/mẹt.';
   if(s.setTime<.5)return 'Đã quét sốt. Chờ một nhịp để sốt bám, không cần nướng thêm.';
  }
  return held?'Món đã ngoài bếp. Hoàn thiện các bước còn thiếu.':s.notice;
 }
 function finish(c){
  const perfect=s.career==='noodle'?s.cook>=95&&s.cook<=106&&s.heat>=66&&s.heat<=82&&!s.spilled:
   Math.min(s.a,s.b)>=74&&Math.max(s.a,s.b)<=94&&Math.abs(s.a-s.b)<=12&&s.flipErrors===0&&!s.sauceEarly&&s.glaze<=15;
  s.stage='done';s.grade=perfect?'perfect':'good';s.notice=perfect?'Perfect! Món vừa chín, đã đưa khỏi bếp.':'Món đã đạt, đã đưa khỏi bếp. Sẵn sàng giao!';onFinish(s.grade,snapshotValue(c));return true;
 }
 function snapshotValue(c){
  if(!s)return Object.freeze({stage:'choose',ready:false,canDrop:false,canFinish:false,flame:2,heat:20,cook:0,overflow:0,a:0,b:0,side:'a',sauced:false,elapsed:0,grade:'',notice:''});
  return Object.freeze({career:s.career,stage:s.stage,flame:s.flame,heat:s.heat,cook:s.cook,overflow:s.overflow,
   a:s.a,b:s.b,side:s.side,sauced:s.sauced,sauceEarly:s.sauceEarly,glaze:s.glaze,stirs:s.stirs,stable:s.stable,
   elapsed:s.elapsed,grade:s.grade,notice:s.notice,hint:hint(),restStage:s.restStage,setTime:s.setTime,offHeat:['held','done'].includes(s.stage),
   canDrop:s.stage==='heating'&&s.heat>=84&&s.elapsed>=1.6,
   canFinish:canFinish()&&!blocked(c),ready:s.stage==='done'&&!blocked(c)});
 }
 function snapshot(){const c=tick();return snapshotValue(c);}
 function begin(){
  const c=tick();
  if(s||!['noodle','streetfood'].includes(c.career)||!c.person||c.phase!=='open'||c.patience<=0||blocked(c))return false;
  if(c.career==='streetfood'&&Object.values(c.dish.skewerCounts||{}).reduce((a,b)=>a+Number(b||0),0)<1)return false;
  s={person:c.person,dish:c.dish,signature:signature(c),career:c.career,stage:c.career==='noodle'?'heating':'grilling',
   elapsed:0,flame:c.career==='noodle'?3:2,heat:20,cook:0,stable:0,overflow:0,spilled:false,
   size:c.dish.container==='bowl_xl'?1.18:c.dish.container==='bowl_l'?1.09:1,
   stirs:0,stirTick:-10000,a:0,b:0,side:'a',flips:0,lastFlip:-10,flipErrors:0,
   sauced:false,sauceEarly:false,glaze:0,setTime:0,grade:'',
   notice:c.career==='noodle'?'Đun nước dùng. Khi sôi, thả mì và topping rồi hạ lửa.':'Nướng mặt A. Canh vàng rồi trở mặt; phủ sốt gần cuối.'};
  lastTick=now();suspended=false;onBegin(c);return true;
 }
 function action(kind,value){
  if(kind==='begin')return begin();
  const c=tick();if(!valid(c)||blocked(c)||!['heating','simmer','grilling','held'].includes(s.stage))return false;
  if(kind==='lift'&&s.stage!=='held'){
   s.restStage=s.stage;s.stage='held';
   s.notice=s.career==='noodle'?'Đã nhấc nồi khỏi lửa. Độ chín được giữ nguyên.':'Đã gắp xiên ra khay. Có thể quét sốt ngoài vỉ.';
   return canFinish()?finish(c):true;
  }
  if(kind==='return'&&s.stage==='held'){
   s.stage=s.restStage;lastTick=now();s.notice='Đã đặt lại bếp. Tiếp tục canh lửa nhé!';return true;
  }
  if(kind==='flame'){
   const level=value===undefined?(s.career==='noodle'?(s.flame===3?2:s.flame===2?1:3):s.flame%3+1):Number(value);
   if(![1,2,3].includes(level))return false;
   s.flame=level;s.notice='Lửa '+['','nhỏ','vừa','lớn'][level]+(s.career==='noodle'?' · giữ sôi nhẹ sau khi thả mì.':' · nhiệt cao chín nhanh, sốt dễ khét.');return true;
  }
  if(kind==='drop'&&s.career==='noodle'){
   if(!snapshotValue(c).canDrop){s.notice='Nước dùng chưa sôi. Đợi đủ nhiệt trước khi thả mì.';return false;}
   s.stage='simmer';s.notice='Đã thả mì và topping. Hạ về lửa vừa và canh chín. Không cần khuấy nồi.';return true;
  }
  if(kind==='stir'&&s.career==='noodle'&&(s.stage==='simmer'||s.stage==='held'&&s.restStage==='simmer')){
   if(now()-s.stirTick<700)return false;
   s.stirTick=now();s.stirs++;s.heat=Math.max(45,s.heat-8);s.overflow=Math.max(0,s.overflow-30);
   s.notice='Đã khuấy nồi, giảm nguy cơ trào. Khuấy không làm mì chín ngay.';return true;
  }
  if(kind==='flip'&&s.career==='streetfood'&&s.stage==='grilling'){
   if(s.elapsed-s.lastFlip<.7)return false;
   if(s[s.side]<65||s[s.side]>95)s.flipErrors++;
   s.lastFlip=s.elapsed;s.flips++;s.side=s.side==='a'?'b':'a';s.notice='Đang nướng mặt '+s.side.toUpperCase()+'. Hai mặt đều chín mới lấy xuống.';return true;
  }
  if(kind==='sauce'&&s.career==='streetfood'&&!s.sauced){
   s.sauced=true;s.sauceEarly=Math.min(s.a,s.b)<55||Math.max(s.a,s.b)>100;
   s.notice=s.sauceEarly?'Phủ sốt hơi sớm. Hạ lửa để sốt không khét.':'Đã phủ sốt. Canh thêm một chút cho sốt bám đều.';return true;
  }
  if(kind==='finish'){
   if(!canFinish()){s.notice=s.career==='noodle'?'Mì chưa đạt: cần đủ độ chín, thời gian và giữ sôi nhẹ.':'Chưa đạt: hai mặt phải chín, sốt bám đều rồi lấy xuống.';return false;}
   return finish(c);
  }
  return false;
 }
 return Object.freeze({action,snapshot,reset,ready:()=>snapshot().ready});
}
w.BPVQKitchenPlay=Object.freeze({create});
})(window);
