/* v88.16.13.4 - Finite daily demand + idempotent day settlement helpers.
   Pure deterministic rules; runtime, Xu, save and dates remain owned by game.js. */
(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.BPVQDayRulesV88=api;
})(typeof window==='object'?window:null,function(){
  'use strict';
  const COUNTER=[9,11,14,16,19,22,25,29,32];
  const DELIVERY=[2,2,3,4,4,5,6,7,8];
  function clamp(n,min,max){return Math.max(min,Math.min(max,n));}
  function seedFor(profile,day,career){
    let h=2166136261;
    for(const c of `${profile}|${day}|${career}`){h^=c.charCodeAt(0);h=Math.imul(h,16777619);}
    return h>>>0;
  }
  function roll(seed,channel,index){
    let v=(seed>>>0)^seedFor(channel,index,'bpvq');
    v=Math.imul(v^(v>>>16),0x7feb352d);
    v=Math.imul(v^(v>>>15),0x846ca68b);
    return ((v^(v>>>16))>>>0)/4294967296;
  }
  function create({profile,day,career,stage=0,menuVersion=1,migratedCounter=0,migratedDelivery=0}){
    const s=clamp(Math.trunc(Number(stage)||0),0,8);
    const counterCap=COUNTER[s],deliveryCap=DELIVERY[s];
    const issuedCounter=clamp(Math.trunc(Number(migratedCounter)||0),0,counterCap);
    const issuedDelivery=clamp(Math.trunc(Number(migratedDelivery)||0),0,deliveryCap);
    return {schema:1,profile:String(profile||''),day:Number(day)||1,career:String(career||'boba'),menuVersion:Number(menuVersion)||1,
      seed:seedFor(profile,day,career),counterCap,deliveryCap,issuedCounter,issuedDelivery,
      counterStatus:Array.from({length:counterCap},(_,i)=>i<issuedCounter?'legacy':'waiting'),
      deliveryStatus:Array.from({length:deliveryCap},(_,i)=>i<issuedDelivery?'legacy':'waiting')};
  }
  function remaining(plan,channel){
    if(!plan)return 0;
    const key=channel==='delivery'?'Delivery':'Counter';
    return Math.max(0,Number(plan[`${channel}Cap`]) - Number(plan[`issued${key}`]));
  }
  function issue(plan,channel){
    if(!['counter','delivery'].includes(channel)||!remaining(plan,channel))return null;
    const isDelivery=channel==='delivery',name=isDelivery?'Delivery':'Counter',index=plan[`issued${name}`]++;
    const id=`${plan.day}:${channel}:${index}`;
    plan[`${channel}Status`][index]='issued';
    return {id,index,channel,roll:roll(plan.seed,channel,index)};
  }
  function finish(plan,id,status){
    if(!plan||typeof id!=='string')return false;
    const parts=id.split(':'),day=Number(parts[0]),channel=parts[1],index=Number(parts[2]);
    if(day!==plan.day||!['counter','delivery'].includes(channel)||!Number.isInteger(index))return false;
    const arr=plan[`${channel}Status`],issued=plan[`issued${channel==='delivery'?'Delivery':'Counter'}`];
    if(index<0||index>=issued||!arr||arr[index]==='waiting'||arr[index]==='legacy')return false;
    if(['accepted','refused','walkout','declined','expired','cancelled'].includes(arr[index]))return false;
    arr[index]=String(status);return true;
  }
  function demand({priceRatio=1,popularity=50,arrivalPct=0,reputation=4}){
    const ratio=clamp(Number(priceRatio)||1,.5,2.6);
    return clamp(.82*Math.pow(ratio,-1.25)+clamp((Number(popularity)||50)-50,-50,50)*.0014+
      clamp(Number(arrivalPct)||0,-.5,.65)*.12 + clamp((Number(reputation)||4)-4,-3,1)*.02,.22,.96);
  }
  function settlement({coins=0,opCosts=0,interest=0,wages=0}){
    const cash=Math.max(0,Math.floor(Number(coins)||0)),ops=Math.max(0,Math.round(Number(opCosts)||0));
    const interestDue=Math.max(0,Math.floor(Number(interest)||0));
    const dueWages=clamp(Math.round(Number(wages)||0),0,ops);
    // Only unpaid interest is added to principal; cash-paid interest is never capitalized.
    // Retains legacy order: interest + non-wage operating fees first; wage arrears last.
    const paidInterest=Math.min(cash,interestDue),afterInterest=cash-paidInterest;
    const paidOther=Math.min(afterInterest,ops-dueWages),afterOther=afterInterest-paidOther;
    const paidWages=Math.min(afterOther,dueWages);
    return {paidInterest,paidOther,paidWages,unpaidWages:dueWages-paidWages,
      unpaidOperating:ops-dueWages-paidOther,interestCapitalized:interestDue-paidInterest,coinsAfter:cash-paidInterest-paidOther-paidWages,
      due:ops+interestDue,paid:paidInterest+paidOther+paidWages};
  }
  return Object.freeze({COUNTER,DELIVERY,create,issue,finish,remaining,roll,seedFor,demand,settlement});
});
