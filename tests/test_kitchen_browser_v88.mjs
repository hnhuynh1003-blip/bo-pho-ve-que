import assert from 'node:assert/strict';
import {chromium,webkit} from 'playwright';
import {mkdirSync} from 'node:fs';
import {cookKitchen} from './kitchen_test_helpers.mjs';
const options={headless:true,args:['--no-sandbox','--disable-gpu']};if(process.env.BPVQ_TEST_BROWSER_PATH)options.executablePath=process.env.BPVQ_TEST_BROWSER_PATH;
const browser=process.env.BPVQ_KITCHEN_ENGINE==='webkit'?await webkit.launch({headless:true}):await chromium.launch(options);mkdirSync('artifacts/v88-kitchen',{recursive:true});
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
  const order=career==='noodle'?{career,container:'bowl_m',base:'broth_kimchi',spicyLevel:2,toppings:['ntop_beef','ntop_fishcake'],toppingPortions:{ntop_beef:2,ntop_fishcake:1},requiresCooked:true,maxPrice:120}:
   {career,tray:'plate',sauce:'sauce_sweet_chili',skewerCounts:{skewer_fish:2,skewer_beef:1},requiredFryState:'perfect',maxPrice:120};
  window.__testOrder=order;
  currentCustomer=practice?null:{npcId:'kitchen_test',name:'Khách bếp',avatar:'🐰',budget:120,strict:'very_strict',patience:180,maxPatience:180,order,quote:formatCustomerOrder(order)};
  renderCustomerBooth();updateHeaderStats();window.BPVQUnifiedShop.update();
 },{career,practice});
 await page.waitForTimeout(650);
 if(practice){await page.getByRole('button',{name:'Luyện nấu ăn không mất nguyên liệu khi nghỉ ca'}).click();}
 await page.evaluate(c=>{
  const b=window.BPVQCookingBridge;
  if(c==='noodle'){if(!window.BPVQCookingStation.status().practice){b.choose('base','broth_kimchi');b.choose('spice',2);b.choose('topping','ntop_beef',1);b.choose('topping','ntop_beef',1);b.choose('topping','ntop_fishcake',1);}}
  else if(!window.BPVQCookingStation.status().practice){b.choose('topping','skewer_fish',1);b.choose('topping','skewer_fish',1);b.choose('topping','skewer_beef',1);}
 },career);
 if(practice){
  await page.locator('#cs20-groups').getByRole('button',{name:career==='noodle'?'Topping':'Chọn xiên',exact:true}).click();
  for(const [key,n]of career==='noodle'?[['ntop_beef',2],['ntop_fishcake',1]]:[['skewer_fish',2],['skewer_beef',1]])for(let i=0;i<n;i++)await page.locator(`[data-item="${key}"]`).click();
 }
 await page.waitForTimeout(650);
}
try{
 for(const career of ['noodle','streetfood'])for(const practice of [false,true]){
  const page=await browser.newPage({viewport:{width:390,height:844}}),errors=[];page.on('pageerror',e=>errors.push(String(e)));await setup(page,career,practice);
  const balance=await page.evaluate(()=>JSON.stringify([gameState.coins,gameState.inventory]));
  await page.locator('#cs20-groups').getByRole('button',{name:career==='noodle'?'Topping':'Chọn xiên',exact:true}).click();
  await page.waitForFunction(()=>[...document.querySelectorAll('#cs20-shelf .cs26-jar-image img')].every(im=>im.complete&&im.naturalWidth>0));
  const visible=await page.evaluate(c=>{
   const selector=c==='noodle'?'[data-food-slot]':'[data-skewer-slot]';
   return [...document.querySelectorAll(selector)].filter(g=>g.getAttribute('opacity')!=='0').map(g=>({id:g.dataset.ingredient,qty:Number(g.dataset.quantity),color:g.querySelector('[data-color]').dataset.color}));
  },career);
  assert.equal(new Set(visible.map(x=>x.color)).size,2,'ingredient colors stay distinct');
  assert.equal(visible.filter(x=>x.id===(career==='noodle'?'ntop_beef':'skewer_fish')).reduce((n,x)=>n+x.qty,0),2,'actual two portions/que visible');
  assert.equal(visible.reduce((n,x)=>n+x.qty,0),3,'all actual ingredients represented');
  await page.screenshot({path:`artifacts/v88-kitchen/${career}-${practice?'practice':'live'}-ingredients.png`});
  if(!practice){
   const bypass=await page.evaluate(c=>{
    const before=JSON.stringify([gameState.coins,gameState.inventory]);
    if(c==='noodle'){workbenchDish.isCooked=true;}else{workbenchDish.fryState='perfect';workbenchDish.fryProgress=80;}
    const result=window.BPVQCookingBridge.deliver();serveDishToCustomer();
    return {result,same:before===JSON.stringify([gameState.coins,gameState.inventory]),customer:!!currentCustomer};
   },career);assert.deepEqual(bypass,{result:false,same:true,customer:true},'forged ready flags cannot skip the kitchen');
   await page.evaluate(()=>{workbenchDish.isCooked=false;workbenchDish.fryState='unfried';});
  }
  // A genuine UI begin, followed by immediate finish spam, cannot complete.
  await page.locator('#cs20-primary').click();
  if(!practice)assert.equal(await page.evaluate(()=>{for(let n=0;n<50;n++)window.BPVQCookingBridge.kitchenAction('finish');return window.BPVQCookingBridge.kitchenReady();}),false);
  await page.locator('#cs20-lift').click();
  const heldEarly=await page.evaluate(()=>window.BPVQCookingStation.status().kitchen);
  assert.equal(heldEarly.stage,'held');assert.equal(heldEarly.ready,false);
  await page.waitForTimeout(1200);
  const heldAfter=await page.evaluate(()=>window.BPVQCookingStation.status().kitchen);
  for(const key of ['elapsed','heat','cook','a','b'])assert.equal(heldAfter[key],heldEarly[key],'early lift freezes '+key);
  assert.equal(await page.locator('#cs20-visual svg').getAttribute('data-off-heat'),'true');
  await page.locator('#cs20-primary').click();
  assert.notEqual(await page.evaluate(()=>window.BPVQCookingStation.status().kitchen.stage),'held','UI return resumes cooking');
  await page.waitForTimeout(300);await page.evaluate(()=>openSmartPhoneModal());
  const frozen=await page.evaluate(()=>window.BPVQCookingStation.status().practice?window.BPVQCookingStation.status().kitchen:window.BPVQCookingBridge.kitchenStatus());
  await page.waitForTimeout(1200);
  const after=await page.evaluate(()=>window.BPVQCookingStation.status().practice?window.BPVQCookingStation.status().kitchen:window.BPVQCookingBridge.kitchenStatus());
  assert.equal(after.elapsed,frozen.elapsed,'phone freezes kitchen clock');
  await page.evaluate(()=>closeSmartPhoneModal());await page.waitForTimeout(650);
  if(!practice){
   await page.evaluate(c=>{applyRecipePreset(RECIPE_BOOK[c][0].id,c);},career);
   assert.equal(await page.evaluate(()=>window.BPVQCookingBridge.kitchenStatus().stage),'choose','preset starts a fresh preparation');
  }
  await page.locator('#cs20-undo').click();
  // Rebuild the selected real recipe after native reset, then actually play.
  if(!practice)await page.evaluate(c=>{const b=window.BPVQCookingBridge;if(c==='noodle'){b.choose('base','broth_kimchi');b.choose('spice',2);b.choose('topping','ntop_beef',1);b.choose('topping','ntop_beef',1);b.choose('topping','ntop_fishcake',1);}else{b.choose('topping','skewer_fish',1);b.choose('topping','skewer_fish',1);b.choose('topping','skewer_beef',1);}},career);
  else{await page.locator('#cs20-groups').getByRole('button',{name:career==='noodle'?'Topping':'Chọn xiên',exact:true}).click();for(const [id,n]of career==='noodle'?[['ntop_beef',2],['ntop_fishcake',1]]:[['skewer_fish',2],['skewer_beef',1]])for(let i=0;i<n;i++)await page.locator(`[data-item="${id}"]`).click();}
  await page.waitForTimeout(650);await cookKitchen(page,career);
  const cooked=await page.evaluate(()=>window.BPVQCookingStation.status().kitchen);assert.equal(cooked.grade,'perfect');assert.ok(cooked.elapsed>=6,'real minimum cooking time');
  assert.equal(await page.evaluate(()=>JSON.stringify([gameState.coins,gameState.inventory])),balance,'cooking cannot consume stock or pay');
  await page.screenshot({path:`artifacts/v88-kitchen/${career}-${practice?'practice':'live'}-perfect.png`});
  await page.locator('#cs20-primary').click();
  if(practice)assert.equal(await page.evaluate(()=>JSON.stringify([gameState.coins,gameState.inventory])),balance,'practice never settles');
  else{
   const delivery=await page.evaluate(()=>({paid:gameState.coins>500,beef:gameState.inventory.ntop_beef,fish:gameState.inventory.skewer_fish,counter:gameState.dailyStats.counterServed}));
   assert.equal(delivery.paid,true,'exact cooked order paid by native validation');assert.equal(career==='noodle'?delivery.beef:delivery.fish,48);assert.equal(delivery.counter,1);
   const once=await page.evaluate(()=>JSON.stringify([gameState.coins,gameState.inventory]));await page.evaluate(()=>window.BPVQCookingBridge.deliver());assert.equal(await page.evaluate(()=>JSON.stringify([gameState.coins,gameState.inventory])),once,'one delivery only');
  }
  assert.deepEqual(errors,[]);console.log(`PASS kitchen browser ${career}/${practice?'practice':'live'}: real assets/colors/quantities, anti-spam/forged flags, Phone pause, Perfect, native single settlement`);await page.close();
 }
}finally{await browser.close();}
