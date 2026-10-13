import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const src=fs.readFileSync('js/game.js','utf8');
const start=src.indexOf('    /* v88 Đợt 2');
const end=src.indexOf('    function buildRecipeOrder(',start);
assert.ok(start>0 && end>start);
const menu=src.slice(start,end);
const RECIPE_BOOK={
 boba:[
  {id:'boba_classic',name:'Trà sữa M',order:{container:'cup_m',base:'tea_black',toppings:['topping_boba']}},
  {id:'boba_l',name:'Trà sữa L',order:{container:'cup_l',base:'tea_black',toppings:['topping_boba','topping_jelly']}}],
 noodle:[{id:'noodle_kimchi',name:'Mì Kimchi M',order:{container:'bowl_m',base:'broth_kimchi',toppings:['ntop_beef']}}],
 streetfood:[{id:'street_fish',name:'Xiên',order:{tray:'plate',sauce:'sauce_sweet_chili',skewerCounts:{skewer_fish:2}}}]
};
const CAREER_WORKBENCH_KEYS={boba:{toppings:['topping_boba','topping_jelly']},noodle:{toppings:['ntop_beef']},streetfood:{toppings:['skewer_fish']}};
const dict={cup_m:3,cup_l:5,tea_black:8,topping_boba:5,topping_jelly:5,bowl_m:6,broth_kimchi:12,ntop_beef:12,tray_plate:2,sauce_sweet_chili:3,skewer_fish:5};
const create=(career='boba',day=1,extra={})=>{
 let events=0,saves=0,fail=false;
 const state={day,currentCareer:career,phase:'prep',shiftClosed:false,level:1,shopStage:0,hasStarted:true,...extra};
 const context={RECIPE_BOOK,CAREER_WORKBENCH_KEYS,isItemStoryUnlocked:()=>true,ITEM_DICTIONARY:Object.fromEntries(Object.entries(dict).map(([key,basePrice])=>[key,{basePrice}])),gameState:state,
  dishToppingCounts(order){return Object.fromEntries((order.toppings||[]).map(id=>[id,Number(order.toppingPortions?.[id])||1]));},
  getUnlockedRecipes(career){return RECIPE_BOOK[career].filter(r=>r.id!=='boba_l'||Number(state.level)>=3);},
  saveGameToStorage(){saves++;return !fail;},window:{dispatchEvent(){events++;}},CustomEvent:class{constructor(name){this.type=name}}};
 vm.createContext(context);vm.runInContext(menu,context);
 return {context,state,api:context.window.BPVQMenuV88,fail:v=>fail=v,stats:()=>({saves,events})};
};
{
 const {api,state}=create();let menu=api.getView();
 assert.equal(menu.recipes[0].active.price,45);
 assert.equal(menu.recipes[1].unlocked,false);assert.equal(menu.recipes[1].active.enabled,false);
 assert.equal(api.edit('boba_classic','price',50).ok,true,'initial menu editable before first opening');
 assert.equal(api.getView().recipes[0].active.price,50);
 state.phase='open';state.menuV88.firstOpenDone=true;
 assert.equal(api.edit('boba_classic','price',60).effectiveDay,2);
 assert.equal(api.getView().recipes[0].active.price,50,'active fixed during business day');
 let req={...RECIPE_BOOK.boba[0].order,recipeId:'boba_classic'};
 assert.equal(api.quote(req),50,'snapshot current menu price');
 assert.equal(req.menuVersion,1);
 state.day=2;api.applyDay();api.applyDay();
 assert.equal(api.getView().pendingDay,null);assert.equal(api.getView().activeVersion,2);
 assert.equal(api.getView().recipes[0].active.price,60);
 assert.equal(api.quote(req),50,'unpaid old order keeps quoted total and old menu version');
 let newOrder={...RECIPE_BOOK.boba[0].order,recipeId:'boba_classic',toppingPortions:{topping_boba:3}};
 assert.equal(api.quote(newOrder),60+2*10,'extra portions only outside included first one');
 assert.equal(api.quote(newOrder),80,'cannot double charge extras on quote again');
 assert.equal(api.edit('boba_classic','price',800).ok,false,'price guard');
 state.level=3;
 assert.equal(api.getView().recipes[1].unlocked,true);
 assert.equal(api.getView().recipes[1].active.enabled,false,'new unlock must be configured');
 assert.equal(api.edit('boba_l','enabled',true).ok,true);
 assert.equal(api.getView().recipes[1].active.enabled,false,'next day only');
 state.day=3;api.applyDay();assert.equal(api.getView().recipes[1].active.enabled,true);
 const restore=JSON.parse(JSON.stringify(state.menuV88));const e=create('boba',3,{menuV88:restore,level:3,phase:'open'});
 assert.equal(e.api.getView().recipes[0].active.price,60,'save survives load');
 assert.equal(e.api.getView().recipes[1].active.enabled,true,'unlock state survives load');
}
for(const [career,expected] of [['noodle',65],['streetfood',40]]){
 const {api,state}=create(career,1,{phase:'open'});
 const id=RECIPE_BOOK[career][0].id;
 assert.equal(api.getView().recipes[0].active.price,expected);
 const order={...RECIPE_BOOK[career][0].order,recipeId:id};
 assert.equal(api.quote(order),expected);
 assert.equal(order.menuDay,1);
 state.menuV88.firstOpenDone=true;
 assert.equal(api.edit(id,'price',expected+5).effectiveDay,2);
 assert.equal(api.quote(order),expected,'quote stays same even after pending edited');
 state.day=2;api.applyDay();assert.equal(api.getView().recipes[0].active.price,expected+5);
}
{
 const {api,state,fail}=create('boba',5,{phase:'open'});
 api.getView(); const copy=JSON.stringify(state.menuV88);
 fail(true);const ret=api.edit('boba_classic','price',50);
 assert.equal(ret.ok,false);assert.equal(JSON.stringify(state.menuV88),copy,'failed storage must roll back');
}
console.log('PASS MENU DOT2: 3 careers, defaults, first-open, pending days, exact/extra quotes, save migration, unlock, rollback');

// v88.16.13.3 — cùng nguồn phụ thu, áp dụng ngày mới và snapshot giá trong đơn.
{
 const {api,state,fail}=create('boba');
 const initial=api.getView();
 assert.equal(initial.extras.find(x=>x.id==='topping_boba').active.price,10);
 assert.equal(api.editExtra('topping_boba',15).ok,true);
 assert.equal(api.getView().extras.find(x=>x.id==='topping_boba').active.price,15);
 state.phase='open';state.menuV88.firstOpenDone=true;
 const old={recipeId:'boba_classic',career:'boba',container:'cup_m',base:'tea_black',toppings:['topping_boba'],toppingPortions:{topping_boba:3}};
 assert.equal(api.quote(old),75,'one included + two extra portions at 15 each');
 assert.equal(old.quotedExtras[0].unit,15);
 assert.equal(api.editExtra('topping_boba',10).effectiveDay,2);
 assert.equal(api.getView().extras.find(x=>x.id==='topping_boba').active.price,15);
 assert.equal(api.quote(old),75,'snapshot remains unchanged after pending update');
 state.day=2;api.applyDay();
 assert.equal(api.getView().extras.find(x=>x.id==='topping_boba').active.price,10);
 const newer={recipeId:'boba_classic',career:'boba',container:'cup_m',base:'tea_black',toppings:['topping_boba'],toppingPortions:{topping_boba:3}};
 assert.equal(api.quote(newer),65,'quote uses new surcharge next day');
 assert.equal(api.quote(old),75,'old quote still frozen');
 assert.equal(api.editExtra('topping_boba',999).ok,false,'reject invalid extra fee');
 const copy=JSON.stringify(state.menuV88);fail(true);
 assert.equal(api.editExtra('topping_boba',15).ok,false);
 assert.equal(JSON.stringify(state.menuV88),copy,'failed surcharge save rollback');
}
// Migration: .13.2 saved menu lacks extras; default must be injected without resetting prices.
{
 const {api,state}=create('boba');api.getView();
 delete state.menuV88.active.extras;
 state.menuV88.active.entries.boba_classic.price=50;
 state.menuV88.pending={effectiveDay:2,version:2,entries:JSON.parse(JSON.stringify(state.menuV88.active.entries))};
 assert.equal(api.getView().recipes[0].active.price,50);
 assert.ok(api.getView().extras.some(x=>x.id==='topping_boba'));
 state.day=2;api.applyDay();
 assert.ok(api.getView().extras.some(x=>x.id==='topping_boba'));
}
console.log('PASS UI ORDER EXTRAS .13.3: topping fees today/next day, frozen quote, pending migration, rollback');
for(const [career,id,extraId,unit,expected] of [
 ['noodle','noodle_kimchi','ntop_beef',20,85],
 ['streetfood','street_fish','skewer_fish',10,50]
]){
 const {api}=create(career,1,{phase:'open'});
 const order={...RECIPE_BOOK[career][0].order,career,recipeId:id};
 if(career==='noodle')order.toppingPortions={ntop_beef:2};
 else order.skewerCounts={skewer_fish:3};
 assert.equal(api.quote(order),expected,`extra fee consistency for ${career}`);
 assert.equal(order.quotedExtras?.[0]?.unit,unit,`unit extra fee for ${career}`);
 assert.equal(order.quotedExtras?.[0]?.qty,1);
}
console.log('PASS 3 CAREERS EXTRA QUOTES: recipe-included quantities never charged twice');
