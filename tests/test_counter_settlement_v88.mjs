import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const core=fs.readFileSync('js/game.js','utf8');
const fn=name=>{const a=core.indexOf('    function '+name+'(');assert.ok(a>=0,name);const rest=core.slice(a);const next=rest.slice(5).search(/^    function /m);return next<0?rest:rest.slice(0,next+5);};
const cfg=vm.runInNewContext('('+core.match(/const CAREER_WORKBENCH_KEYS = ([\s\S]*?);\n/)[1]+')');
const start=core.indexOf('(function installBPVQCookingBridge()');const bridge=core.slice(start,core.indexOf('})();',start)+5);
function env(career){let clock=0,persisted=null,fail=false;const inventory=Object.fromEntries(Object.values(cfg).flatMap(x=>Object.values(x).flat()).map(k=>[k,50]));
 const d={career,container:career==='noodle'?'bowl_m':'cup_m',tray:'plate',base:career==='noodle'?'broth_kimchi':'tea_black',sugar:70,ice:50,spicyLevel:2,sauce:'sauce_sweet_chili',toppings:career==='streetfood'?[]:['ntop_beef'],toppingPortions:career==='streetfood'?{}:{ntop_beef:2},skewerCounts:career==='streetfood'?{skewer_fish:2}:{},listedPrice:40,isCooked:false,isShaken:false,fryState:'unfried'};
 if(career==='boba'){d.selectedBase=d.base;d.pourAmount=72;d.toppings=['topping_boba'];d.toppingPortions={topping_boba:2};}
 const c={BPVQ_PLAYTEST_WRITER:false,bpvqCanWriteProfile:()=>true,window:{},document:{visibilityState:'visible',addEventListener(){}},performance:{now:()=>clock},console,CAREER_WORKBENCH_KEYS:cfg,ITEM_DICTIONARY:Object.fromEntries(Object.keys(inventory).map(k=>[k,{name:k}])),VILLAGE_NPC_ART:{},CUSTOMER_TOLERANCE:{easy:{label:'Dễ',maxMajor:3,maxMinor:3,maxSeverity:5,maxPriceRatio:2},moderate:{label:'Vừa',maxMajor:1,maxMinor:2,maxSeverity:3,maxPriceRatio:1.2},very_strict:{label:'Khó',maxMajor:0,maxMinor:0,maxSeverity:0,maxPriceRatio:1}},gameState:{hasStarted:true,currentCareer:career,phase:'open',day:1,shiftClosed:false,inventory,automation:{shopFastEnabled:false},coins:500,reputation:5,ratingCount:0,dailyStats:{},reviews:[]},activeProfileId:'test',currentCustomer:{patience:180,maxPatience:180,name:'Khách',strict:'easy',tipMod:1,avatar:'',order:{...JSON.parse(JSON.stringify(d)),requiresCooked:true,requiresShaken:true,requiredFryState:'perfect',maxPrice:120,quotedTotal:95}},workbenchDish:d,phonePauseActive:false,shakeTimer:null,noodleCookTimer:null,fryInterval:null,customerPatienceTimer:null,
 clearTimeout(){},clearInterval(){},updateWorkbenchPreview(){},renderWorkbenchControls(){},renderCustomerBooth(){},updateHeaderStats(){},startCustomerPatienceTimer(){},getPlayerChibiSource:()=>'',formatCustomerOrder:()=>'',isShopFastAssistantUnlocked:()=>false,isItemStoryUnlocked:()=>true,calculateDishCost:()=>10,showToast(){},openQuickRestock(){},playSound(){},getGrowthBonuses:()=>({revenuePct:0,tipPct:0}),getDailyEventBonuses:()=>({revenuePct:0,tipPct:0}),v8744CareerBonus:()=>({revenuePct:0,tipPct:0}),v88MenuQuoteOrder(order){if(!Number.isFinite(order.quotedTotal))throw Error('Missing quote');return order.quotedTotal;},v8744RecordOrder(){},v8753OnOrder(){},v8745MasteryTip:()=>0,v8745OnDishServed(){},addExp:n=>{c.gameState.xp=(c.gameState.xp||0)+n;},buildV85CustomerReview:()=>({text:'Review',voice:'test',reason:'test'}),addShopReview:r=>{c.gameState.reviews.push(r);return c.gameState.reviews.length;},maybeQueueShopIncident:()=>false,renderShopReviews(){},showV85QuickReview(){},scheduleNextCustomer(){},itemLabel:k=>k,activeFeedbackReviewId:null,updateAccountSummary(){},getProfileStorageKey:id=>'save:'+id,localStorage:{setItem(k,v){if(fail)throw Error('full');persisted=v;}}};
 vm.createContext(c);vm.runInContext('let counterSettlementDepth=0;',c);
 for(const name of ['normalizedCountMap','sameCountMap','dishToppingCounts','v87532Req','getDishRequirements','getMissingDishIngredients','consumeDishIngredients','validatePlayerDishAgainstOrder','evaluateCustomerDecision','serveDishToCustomer','serveCounterDishNative','saveGameToStorage']){let source=fn(name);if(name==='consumeDishIngredients')source=source.replace('    let counterSettlementDepth = 0;','');vm.runInContext(source,c);}
 c.cleanWorkbenchDish=()=>{c.window.BPVQCookingBridge.invalidateCap();c.workbenchDish.toppings=[];c.workbenchDish.toppingPortions={};c.workbenchDish.skewerCounts={};};
 vm.runInContext(fs.readFileSync('js/v88-kitchen-play.js','utf8'),c);vm.runInContext(bridge,c);const api=c.window.BPVQCookingBridge;
 c.renderWorkbenchPresetCards=()=>{};
 const step=n=>{for(let i=0;i<Math.round(n*100);i++){clock+=10;api.kitchenStatus();}};
 const play=g=>{let guard=0;while(api.kitchenStatus().stage==='warming'){assert.ok(++guard<2000);step(.01);}if(g==='timeout'){step(10.1);return;}let target=g==='perfect'?50:g==='good'?36:5;while(api.kitchenStatus().position<target){assert.ok(++guard<2000);step(.01);}assert.equal(api.kitchenAction('hit'),true);};
 const reload=()=>{api.checkpointBatch();c.saveGameToStorage(false);const saved=JSON.parse(persisted);api.dropRuntime();c.currentCustomer=null;c.gameState=saved;c.gameState.phase='prep';assert.equal(api.restoreBatch(),true);};
 return {c,api,step,play,reload,fail:v=>{fail=v;}};
}
for(const career of ['boba','noodle','streetfood'])for(const grade of ['perfect','good','bad','timeout']){
 const {c,api,play,reload}=env(career);c.workbenchDish.isCooked=true;c.workbenchDish.isShaken=true;c.workbenchDish.fryState='perfect';assert.equal(api.deliver(),false,'forged native flags blocked');
 assert.equal(api.kitchenAction('begin'),true);const stock=JSON.stringify(c.gameState.inventory);assert.equal(c.gameState.inventory[career==='streetfood'?'skewer_fish':career==='boba'?'topping_boba':'ntop_beef'],48,'two portions debited at begin');
 assert.equal(api.choose('base',c.workbenchDish.base),false);assert.equal(api.kitchenAction('begin'),false);reload();assert.equal(JSON.stringify(c.gameState.inventory),stock);
 play(grade);if(career==='streetfood'){reload();play(grade);api.kitchenAction('sauce');api.kitchenAction('lift');}reload();assert.equal(api.kitchenStatus().grade,grade==='timeout'?'bad':grade);
 assert.equal(api.deliver(),true,`${career}/${grade} handable`);assert.equal(JSON.stringify(c.gameState.inventory),stock,'handover never debits twice');assert.equal(c.gameState.ratingCount,1);assert.equal(c.gameState.reviews.length,1);assert.equal(c.gameState.dailyStats.counterServed,1);
 assert.equal(c.gameState.reviews[0].stars,grade==='perfect'?5:grade==='good'?4:3);assert.ok(c.gameState.coins>500);const settled=JSON.stringify(c.gameState);assert.equal(api.deliver(),false);assert.equal(JSON.stringify(c.gameState),settled,'no duplicate payment, XP or review');
}
for(const career of ['boba','noodle','streetfood']){
 const {c,api,play,fail}=env(career);assert.equal(api.kitchenAction('begin'),true);play('bad');if(career==='streetfood'){play('bad');api.kitchenAction('lift');}c.currentCustomer.strict='very_strict';assert.equal(api.deliver(),true);assert.equal(c.gameState.coins,500,'refused dish has no earnings');assert.equal(c.gameState.reviews.length,1);
 const other=env(career);other.fail(true);const before=JSON.stringify(other.c.gameState.inventory);assert.equal(other.api.kitchenAction('begin'),false);assert.equal(JSON.stringify(other.c.gameState.inventory),before,'failed begin save rolls inventory back');
 const retry=env(career);retry.api.kitchenAction('begin');retry.api.reset();
 if(career==='boba'){
  assert.equal(retry.c.workbenchDish.container,null);assert.equal(retry.c.workbenchDish.base,null);
  assert.equal(retry.c.workbenchDish.sugar,null);assert.equal(retry.c.workbenchDish.ice,null);
  assert.equal(retry.api.kitchenAction('begin'),false);
  assert.equal(retry.api.choose('container','cup_m'),true);assert.equal(retry.api.choose('base','tea_black'),true);
  assert.equal(retry.api.choose('sugar',70),true);assert.equal(retry.api.choose('ice',50),true);
  assert.equal(retry.api.choose('topping','topping_boba'),true);assert.equal(retry.api.choose('topping','topping_boba'),true);
  assert.equal(retry.api.setPresentation({pour:72,poured:true}),true);
 }else assert.equal(retry.c.workbenchDish.toppingPortions.ntop_beef,career==='streetfood'?undefined:2,'other career redo keeps recipe');
 assert.equal(retry.api.kitchenAction('begin'),true);assert.equal(retry.c.gameState.inventory[career==='streetfood'?'skewer_fish':career==='boba'?'topping_boba':'ntop_beef'],46,'new batch consumes new ingredients');
}
{const {c,api,play,fail}=env('noodle');api.kitchenAction('begin');play('perfect');const stock=JSON.stringify(c.gameState.inventory);fail(true);assert.equal(api.deliver(),false);assert.equal(c.gameState.coins,500);assert.equal(c.gameState.reviews.length,0);assert.ok(c.currentCustomer);assert.equal(api.kitchenReady(),true);assert.equal(JSON.stringify(c.gameState.inventory),stock);fail(false);assert.equal(api.deliver(),true);assert.equal(c.gameState.reviews.length,1);}
for(const career of ['boba','noodle','streetfood']){
 const {c,api}=env(career);
 for(const name of ['v87532AutoServe','v87532AutoServeNative','v87532HasIngredients','v87532Price','v87532BuildDish'])vm.runInContext(fn(name),c);
 c.v87532Ensure=()=>c.gameState.staffOps||(c.gameState.staffOps={settings:{host_lan:true},today:{stats:{}}});c.v87532Active=id=>id==='host_lan';c.v87532Stat=()=>({jobs:0});c.v87532Cap=()=>100;c.v87532Record=()=>{};
 c.currentCustomer.npcId='test';c.currentCustomer.quote='test';
 const before=c.gameState.inventory[career==='streetfood'?'skewer_fish':career==='boba'?'topping_boba':'ntop_beef'];for(let i=0;i<9;i++)c.v87532AutoServe();
 assert.equal(c.currentCustomer,null,'employee serves existing order');assert.equal(c.gameState.inventory[career==='streetfood'?'skewer_fish':career==='boba'?'topping_boba':'ntop_beef'],before-2,'employee uses actual portion quantities');assert.equal(c.gameState.reviews.length,1);assert.equal(c.gameState.coins,614,'employee uses agreed 95 Xu quote, not 120 Xu budget; standard tip19, no player performance bonus');
 const blocked=env(career);for(const name of ['v87532AutoServe','v87532AutoServeNative'])vm.runInContext(fn(name),blocked.c);blocked.api.kitchenAction('begin');const state=JSON.stringify(blocked.c.gameState);blocked.c.v87532AutoServe();assert.equal(JSON.stringify(blocked.c.gameState),state,'staff cannot race paid manual batch');
}
{const {c,api}=env('noodle');delete c.gameState.counterCraft;assert.equal(api.restoreBatch(),false);assert.equal(c.gameState.inventory.ntop_beef,50,'old saves unchanged');api.kitchenAction('begin');api.checkpointBatch();api.dropRuntime();c.activeProfileId='another';assert.equal(api.restoreBatch(),false,'cannot bind batch across profiles');}
{const {c,api,play}=env('streetfood');api.kitchenAction('begin');play('perfect');play('perfect');api.kitchenAction('lift');assert.equal(api.kitchenStatus().grade,'good');const validation=c.validatePlayerDishAgainstOrder(c.workbenchDish,c.currentCustomer.order);assert.ok(validation.issues.some(i=>i.label==='chưa quét sốt'),'unapplied sauce is visible to customer evaluation');assert.equal(api.deliver(),true);assert.equal(c.gameState.reviews[0].stars,4);}

{ // New explicit boba live path. No write until a valid cap starts.
 const {c,api,play}=env('boba');api.reset();
 const before=JSON.stringify(c.gameState.inventory),order=JSON.stringify(c.currentCustomer.order),coins=c.gameState.coins;
 const blank=api.snapshot().dish;
 for(const k of ['container','base','selectedBase','sugar','ice'])assert.equal(blank[k],null,k);
 assert.equal(blank.pourAmount,0);assert.equal(blank.toppings.length,0);assert.equal(api.canCap(),false);
 assert.equal(api.beginCap(),false);assert.equal(api.deliver(),false);
 assert.equal(api.choose('ice',0),false,'no cup');assert.equal(api.setPresentation({pour:72,poured:true}),false);
 assert.equal(api.choose('container','cup_m'),true);
 assert.equal(api.choose('base','tea_black'),true);assert.equal(api.snapshot().dish.base,null);
 assert.equal(api.snapshot().dish.selectedBase,'tea_black');
 assert.equal(api.choose('ice',0),true,'explicit no ice');assert.equal(api.choose('sugar',null),false);
 assert.equal(api.choose('sugar',0),true,'explicit no sugar');
 assert.equal(api.choose('topping','topping_boba'),true);assert.equal(api.choose('topping','topping_boba'),true);
 assert.equal(api.setPresentation({pour:0,poured:true}),false);
 assert.equal(api.setPresentation({pour:72,poured:true}),true);
 assert.equal(api.snapshot().dish.base,'tea_black');assert.equal(api.snapshot().dish.pourAmount,72);
 assert.equal(api.choose('base','tea_green'),false,'cannot swap poured tea');
 assert.equal(api.setPresentation({pour:50,poured:true}),false);
 assert.equal(api.setPresentation({pour:85,poured:true}),true);
 assert.equal(api.choose('container','cup_l'),false,'cannot move applied contents into another cup');
 assert.equal(JSON.stringify(c.gameState.inventory),before);assert.equal(c.gameState.coins,coins);
 assert.equal(JSON.stringify(c.currentCustomer.order),order);assert.equal(api.canCap(),true);
 assert.equal(api.beginCap(),true);assert.equal(c.gameState.inventory.cup_m,49);assert.equal(c.gameState.inventory.tea_black,49);
 assert.equal(c.gameState.inventory.topping_boba,48);assert.equal(api.choose('ice',50),false);
 play('perfect');assert.equal(api.snapshot().dish.isShaken,true);assert.equal(api.deliver(),true);
 assert.equal(c.gameState.inventory.topping_boba,48);assert.equal(api.deliver(),false);
 console.log('PASS explicit boba: blank, requested/actual, zero, pour, stock exact-once');
}
{ // Practice must not mutate live dish, stock, order or money.
 const {c,api}=env('boba'),before=JSON.stringify(c.gameState),live=JSON.stringify(c.workbenchDish);
 const d=api.createPracticeDish('boba');assert.equal(api.canCapDish(d),false);
 assert.equal(api.choosePractice(d,'container','cup_m'),true);assert.equal(api.choosePractice(d,'base','tea_black'),true);
 assert.equal(api.choosePractice(d,'ice',50),true);assert.equal(d.base,null);
 assert.equal(api.choosePractice(d,'sugar',30),true);assert.equal(api.pourPractice(d,72),true);
 assert.equal(api.canCapDish(d),true);assert.equal(JSON.stringify(c.gameState),before);assert.equal(JSON.stringify(c.workbenchDish),live);
 console.log('PASS explicit practice isolation and ice before pour');
}
{ // Previously paid, serialized v1 boba batch uses the original signature.
 const {c,api,play,reload}=env('boba');api.kitchenAction('begin');
 play('good');api.checkpointBatch();
 const a=c.gameState.counterCraft.active,oldSig=JSON.parse(a.engine.signature);oldSig.splice(-2);
 a.engine.signature=JSON.stringify(oldSig);delete a.dish.selectedBase;delete a.dish.pourAmount;
 api.dropRuntime();c.currentCustomer=null;c.gameState.phase='prep';
 assert.equal(api.restoreBatch(),true);const stock=JSON.stringify(c.gameState.inventory);
 assert.equal(api.deliver(),true);assert.equal(JSON.stringify(c.gameState.inventory),stock);
 console.log('PASS legacy already-paid boba batch restore without second debit');
}
{ // Explicit preset/assistant still uses the original recipe and unlock gate.
 const {c,api}=env('boba');api.reset();
 c.RECIPE_BOOK={boba:[{id:'qa_preset',name:'QA',order:{container:'cup_m',base:'tea_black',sugar:0,ice:0,toppings:['topping_boba'],toppingPortions:{topping_boba:2}}}]};
 c.getUnlockedRecipes=()=>[];c.refreshShopFloorSummary=()=>{};
 vm.runInContext(fn('applyRecipePreset'),c);vm.runInContext(fn('maybeAutoFinishWorkbench'),c);
 c.applyRecipePreset('qa_preset','boba');assert.equal(c.workbenchDish.container,null);
 c.getUnlockedRecipes=()=>c.RECIPE_BOOK.boba;c.applyRecipePreset('qa_preset','boba');
 assert.equal(c.workbenchDish.pourAmount,72);assert.equal(c.workbenchDish.sugar,0);assert.equal(c.workbenchDish.isShaken,false);
 assert.equal(api.canCap(),true);assert.equal(api.deliver(),false);
 c.isShopFastAssistantUnlocked=()=>true;c.gameState.automation.shopFastEnabled=true;
 c.applyRecipePreset('qa_preset','boba');assert.equal(c.workbenchDish.isShaken,true);
 const n=c.gameState.inventory.topping_boba;assert.equal(api.deliver(),true);assert.equal(c.gameState.inventory.topping_boba,n-2);
 console.log('PASS explicit preset and unlocked assistant shortcut');
}

console.log('PASS actual native settlement: 12 outcomes + refused, once-only inventory/Xu/review/XP, restore, redo, failed save rollback');
