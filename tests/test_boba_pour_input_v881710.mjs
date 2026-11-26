// #14 WebKit diagnostic: reproduce the old selector, then use visible native UI.
import assert from 'node:assert/strict';
import {webkit,chromium} from 'playwright';
import {mkdirSync,writeFileSync} from 'node:fs';
const output=process.env.BPVQ_QA_OUTPUT||'artifacts/boba-pour';
const engine=process.env.BPVQ_QA_ENGINE||'webkit';
const browser=await (engine==='webkit'?webkit:chromium).launch({headless:true});
mkdirSync(output,{recursive:true});
async function setup(page,career,practice){
 await page.route('https://cdnjs.cloudflare.com/**',r=>r.abort());await page.goto('http://127.0.0.1:8765/',{waitUntil:'load'});
 await page.evaluate(({career,practice})=>{
  document.getElementById('account-new-name').value='Kitchen TEST '+career;createLocalAccount();document.getElementById('intro-shop-name').value='Bếp TEST';selectedIntroCareerChoice=career;confirmStartGameFromIntro();
  if(window.v8771SkipStory)window.v8771SkipStory();if(window.v8771ChooseHelp)window.v8771ChooseHelp('off');
  for(const id of ['screen-account','screen-intro'])document.getElementById(id).classList.add('hidden');
  gameState.level=20;gameState.shopStage=0;gameState.currentCareer=career;gameState.phase=practice?'preparing':'open';gameState.shiftClosed=false;gameState.coins=500;
  gameState.automation={...(gameState.automation||{}),shopFastEnabled:false};
  for(const ids of Object.values(CAREER_WORKBENCH_KEYS[career]))for(const id of ids)gameState.inventory[id]=50;
  cleanWorkbenchDish();
  const order=career==='boba'?{career,container:'cup_m',base:'tea_black',sugar:70,ice:50,toppings:['topping_boba'],toppingPortions:{topping_boba:2},requiresShaken:true,maxPrice:120}:career==='noodle'?{career,container:'bowl_m',base:'broth_kimchi',spicyLevel:2,toppings:['ntop_beef','ntop_fishcake'],toppingPortions:{ntop_beef:2,ntop_fishcake:1},requiresCooked:true,maxPrice:120}:
   {career,tray:'plate',sauce:'sauce_sweet_chili',skewerCounts:{skewer_fish:2,skewer_beef:1},requiredFryState:'perfect',maxPrice:120};
  window.__testOrder=order;
  currentCustomer=practice?null:{npcId:'kitchen_test',name:'Khách bếp',avatar:'🐰',budget:120,strict:'very_strict',patience:180,maxPatience:180,order,quote:formatCustomerOrder(order)};
  renderCustomerBooth();updateHeaderStats();window.BPVQUnifiedShop.update();
 },{career,practice});
 await page.waitForTimeout(650);
 if(practice){await page.getByRole('button',{name:'Luyện nấu ăn không mất nguyên liệu khi nghỉ ca'}).click();}
 await page.evaluate(c=>{
  const b=window.BPVQCookingBridge;
  if(c==='boba'){if(!window.BPVQCookingStation.status().practice){b.choose('topping','topping_boba',1);b.choose('topping','topping_boba',1);}}
  else if(c==='noodle'){if(!window.BPVQCookingStation.status().practice){b.choose('base','broth_kimchi');b.choose('spice',2);b.choose('topping','ntop_beef',1);b.choose('topping','ntop_beef',1);b.choose('topping','ntop_fishcake',1);}}
  else if(!window.BPVQCookingStation.status().practice){b.choose('topping','skewer_fish',1);b.choose('topping','skewer_fish',1);b.choose('topping','skewer_beef',1);}
 },career);
 if(practice){
  await page.locator('#cs20-groups').getByRole('button',{name:career==='streetfood'?'Chọn xiên':'Topping',exact:true}).click();
  for(const [key,n]of career==='boba'?[['topping_boba',2]]:career==='noodle'?[['ntop_beef',2],['ntop_fishcake',1]]:[['skewer_fish',2],['skewer_beef',1]])for(let i=0;i<n;i++)await page.locator(`[data-item="${key}"]`).click();
 }
 await page.waitForTimeout(650);
}
const reports=[],failures=[];
try{
 for(const width of [320,360,375,390,430,1366]){
  const page=await browser.newPage({viewport:{width,height:844},hasTouch:width<700});
  const errors=[],report={width,engine,errors};reports.push(report);
  page.on('pageerror',e=>errors.push(String(e)));
  const state=()=>page.evaluate(()=>{
   const box=id=>{const e=document.getElementById(id);if(!e)return null;const r=e.getBoundingClientRect(),c=getComputedStyle(e);return {act:e.dataset.act,disabled:!!e.disabled,display:c.display,visible:r.width>0&&r.height>0,rect:{x:r.x,y:r.y,w:r.width,h:r.height},count:document.querySelectorAll('#'+id).length,label:e.getAttribute('aria-label')}};
   const s=window.BPVQCookingStation.status();
   return {view:document.getElementById('v88-live-scene').dataset.view,stage:s.stage,pour:s.pour,poured:s.poured,primary:box('cs20-primary'),dispenser:box('cp177-pour-object'),enter:box('us21-enter-kitchen'),overflow:document.documentElement.scrollWidth-innerWidth};
  });
  const shot=label=>page.screenshot({path:output+'/'+width+'-'+label+'.png',fullPage:true});
  try{
   await setup(page,'boba',false);
   report.legacy=await state();
   await shot('yard');
   try{await page.locator('#cs20-primary').click({trial:true,timeout:1200});report.legacyClick='actionable';}catch(e){report.legacyClick='blocked';report.legacyError=String(e);}
   assert.equal(report.legacy.view,'yard','legacy harness has not entered kitchen');
   assert.equal(report.legacyClick,'blocked','legacy selector should not be actionable in yard');
   await page.locator('#us21-enter-kitchen').click();
   await page.waitForFunction(()=>document.getElementById('v88-live-scene').dataset.view==='kitchen');
   const dispenser=page.locator('#cp177-pour-object');
   await dispenser.waitFor({state:'visible'});
   await page.waitForFunction(()=>!document.getElementById('cp177-pour-object').disabled);
   report.choose=await state();
   await shot('choose');
   assert.equal(report.choose.primary.act,'pour');
   assert.equal(report.choose.primary.visible,false,'one visible pour control only');
   assert.equal(report.choose.dispenser.count,1);
   // Trusted Playwright input on the actual visual hit target; no force or bridge call.
   if(width<700)await dispenser.tap();else await dispenser.click();
   await page.waitForFunction(()=>window.BPVQCookingStation.status().stage==='pour');
   await page.waitForFunction(()=>window.BPVQCookingStation.status().pour>5);
   report.pouring=await state();
   await shot('pouring');
   if(width<700)await dispenser.tap();else await dispenser.click();
   await page.waitForFunction(()=>window.BPVQCookingStation.status().stage==='mix');
   report.stopped=await state();
   await shot('stopped');
   assert.equal(report.stopped.poured,true);
   assert.ok(report.stopped.pour>=report.pouring.pour);
   assert.equal(report.stopped.primary.act,'cap-start');
   assert.equal(report.stopped.primary.visible,true);
   assert.ok(report.stopped.overflow<=1);
   assert.deepEqual(errors,[]);
  }catch(e){report.failure=String(e);failures.push({width,error:String(e)});await shot('failure').catch(()=>{});}
  console.log('POUR COMPARE',JSON.stringify(report));
  await page.close();
 }
}finally{await browser.close();writeFileSync(output+'/geometry.json',JSON.stringify({reports,failures},null,2));}
assert.deepEqual(failures,[],'visible pour/stop input diagnostic failures');
