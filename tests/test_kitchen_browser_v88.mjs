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
try{
 for(const career of ['boba','noodle','streetfood'])for(const grade of ['perfect','good','bad','timeout']){
  const page=await browser.newPage({viewport:{width:390,height:844}}),errors=[];page.on('pageerror',e=>errors.push(String(e)));await setup(page,career,false);
  const initial=await page.evaluate(()=>({coins:gameState.coins,inventory:JSON.parse(JSON.stringify(gameState.inventory)),reviews:gameState.reviews.length}));
  assert.equal(await page.evaluate(()=>{workbenchDish.isShaken=true;workbenchDish.isCooked=true;workbenchDish.fryState='perfect';return window.BPVQCookingBridge.deliver();}),false,'flags cannot forge completion');
  await page.evaluate(()=>{workbenchDish.isShaken=false;workbenchDish.isCooked=false;workbenchDish.fryState='unfried';});
  await cookKitchen(page,career,grade);
  const key=career==='boba'?'topping_boba':career==='noodle'?'ntop_beef':'skewer_fish';
  const ready=await page.evaluate(key=>({grade:window.BPVQCookingBridge.kitchenStatus().grade,stock:gameState.inventory[key],profile:activeProfileId}),key);
  assert.equal(ready.grade,grade==='timeout'?'bad':grade);assert.equal(ready.stock,initial.inventory[key]-2);
  if(grade==='perfect'){
   const profile=ready.profile;await page.evaluate(()=>saveGameToStorage(false));await page.reload({waitUntil:'load'});await page.evaluate(profile=>continueLocalAccount(profile),profile);await page.waitForFunction(()=>document.getElementById('cs20-primary').dataset.act==='send');
   assert.equal(await page.evaluate(()=>window.BPVQCookingBridge.kitchenStatus().grade),'perfect','actual reload retains outcome');
  }
  const frozen=await page.evaluate(()=>JSON.stringify(window.BPVQCookingBridge.kitchenStatus()));await page.waitForTimeout(650);assert.equal(await page.evaluate(()=>JSON.stringify(window.BPVQCookingBridge.kitchenStatus())),frozen);
  await page.screenshot({path:`artifacts/v88-kitchen/${career}-${grade}.png`});
  const before=await page.evaluate(()=>({coins:gameState.coins,inventory:JSON.stringify(gameState.inventory),reviews:gameState.reviews.length}));
  await page.locator('#cs20-primary').click();
  const after=await page.evaluate(()=>({customer:!!currentCustomer,coins:gameState.coins,inventory:JSON.stringify(gameState.inventory),reviews:gameState.reviews.length,stars:gameState.reviews[0].stars}));
  assert.equal(after.customer,false);assert.equal(after.inventory,before.inventory);assert.equal(after.reviews,before.reviews+1);assert.equal(after.stars,grade==='perfect'?5:grade==='good'?4:2);
  assert.equal(await page.evaluate(()=>window.BPVQCookingBridge.deliver()),false);assert.equal(await page.evaluate(()=>gameState.coins),after.coins);assert.deepEqual(errors,[]);await page.close();
  console.log(`PASS actual browser ${career}/${grade}: native stock once, completion, grade, review, save/reload`);
 }
 for(const career of ['boba','noodle','streetfood']){
  const page=await browser.newPage({viewport:{width:390,height:844}});await setup(page,career,true);const before=await page.evaluate(()=>JSON.stringify([gameState.coins,gameState.inventory,gameState.reviews]));await cookKitchen(page,career);await page.locator('#cs20-primary').click();assert.equal(await page.evaluate(()=>JSON.stringify([gameState.coins,gameState.inventory,gameState.reviews])),before,'practice has no economy');await page.close();
 }
}finally{await browser.close();}
