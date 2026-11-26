// #14: full-game yard/kitchen diagnostic, separate from legacy compact-counter contract.
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {mkdirSync,writeFileSync} from 'node:fs';
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-gpu']});
const dest=process.env.BPVQ_QA_OUTPUT||'artifacts/v88-yard-compare';
mkdirSync(dest,{recursive:true});
const reports=[],failures=[];
const ids=['cs20-primary','cs20-shelf','cs20-visual','cs26-meters','cs27-containers','us21-exit-kitchen','us21-enter-kitchen'];
try{
 for(const [width,height,career] of [[320,568,'boba'],[360,800,'boba'],[375,812,'boba'],[390,844,'boba'],[430,932,'boba'],[1366,768,'boba'],[320,568,'noodle'],[390,844,'noodle'],[430,932,'noodle'],[1366,768,'noodle'],[320,568,'streetfood'],[390,844,'streetfood'],[430,932,'streetfood'],[1366,768,'streetfood']]){
  const page=await browser.newPage({viewport:{width,height}}),errors=[];
  page.on('pageerror',e=>errors.push(String(e)));
  const report={width,height,career,errors};reports.push(report);
  try{
  await page.route('https://cdnjs.cloudflare.com/**',r=>r.abort());
  await page.goto('http://127.0.0.1:8765/',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>!!window.BPVQCookingStation&&!!window.BPVQUnifiedShop);
  await page.evaluate(c=>{
   document.getElementById('account-new-name').value='Quầy TEST '+c;createLocalAccount();
   document.getElementById('intro-shop-name').value='Quầy TEST';selectedIntroCareerChoice=c;confirmStartGameFromIntro();
   if(window.v8771SkipStory)window.v8771SkipStory();if(window.v8771ChooseHelp)window.v8771ChooseHelp('off');
   for(const id of ['screen-account','screen-intro'])document.getElementById(id).classList.add('hidden');
   gameState.hasStarted=true;gameState.currentCareer=c;gameState.phase='open';gameState.shiftClosed=false;
   gameState.level=20;gameState.shopStage=0;gameState.coins=450;
   cleanWorkbenchDish();
   const keys=CAREER_WORKBENCH_KEYS[c];
   for(const ids of Object.values(keys))if(Array.isArray(ids))for(const key of ids)gameState.inventory[key]=20;
   const order=c==='boba'?{career:c,container:'cup_m',base:'tea_black',sugar:70,ice:50,toppings:['topping_boba'],toppingPortions:{topping_boba:2},requiresShaken:true,maxPrice:120}:
    c==='noodle'?{career:c,container:'bowl_m',base:'broth_kimchi',spicyLevel:3,toppings:['ntop_beef'],requiresCooked:true,maxPrice:120}:
    {career:c,tray:'plate',sauce:'sauce_sweet_chili',skewerCounts:{skewer_fish:2},requiresFried:true,maxPrice:120};
   currentCustomer={name:'Bé Bơ',avatar:'🐰',role:'Khách TEST',budget:120,strict:'moderate',patience:180,maxPatience:180,order,quote:formatCustomerOrder(order)};
   renderCustomerBooth();updateHeaderStats();window.BPVQUnifiedShop.update();window.__updateHeaderNavLayout();
  },career);
  await page.waitForTimeout(650);
  await page.waitForFunction(()=>{const ticket=document.querySelector('.cs20-ticket');return ticket&&!ticket.hidden&&ticket.getClientRects().length>0;});

   const measure=()=>page.evaluate(ids=>{
    const box=s=>{const e=document.querySelector(s);if(!e)return null;const r=e.getBoundingClientRect(),c=getComputedStyle(e);return {w:r.width,h:r.height,x:r.x,y:r.y,right:r.right,bottom:r.bottom,display:c.display,ratio:c.aspectRatio,visible:r.width>0&&r.height>0}};
    return {view:document.querySelector('#v88-live-scene').dataset.view,overflow:document.documentElement.scrollWidth-innerWidth,yard:box('#v88-live-frame'),yardWrapper:box('#v88-live-supported'),workshop:box('#cp177-workshop'),station:box('#cs20-station'),stage:box('.cs20-stage'),stationChildren:[...document.querySelector('#cs20-station').children].map(e=>{const r=e.getBoundingClientRect(),c=getComputedStyle(e);return {id:e.id,className:e.className,h:r.height,w:r.width,display:c.display}}),primary:box('#cs20-primary'),shelf:box('#cs20-shelf'),size:box('#cs27-containers'),meters:box('#cs26-meters'),timing:box('#cp177-workshop .cp178-meter-slot'),nodes:Object.fromEntries(ids.map(id=>[id,document.querySelectorAll('#'+id).length]))};
   },ids);
   await page.evaluate(ids=>{window.__uiNodes=Object.fromEntries(ids.map(id=>[id,document.getElementById(id)]))},ids);
   const sameNodes=()=>page.evaluate(ids=>ids.every(id=>window.__uiNodes[id]===document.getElementById(id)),ids);
   report.yard=await measure();
   await page.screenshot({path:dest+'/'+career+'-'+width+'-yard.png',fullPage:true});
   await page.locator('#us21-enter-kitchen').click();
   await page.waitForFunction(()=>document.querySelector('#v88-live-scene').dataset.view==='kitchen');
   await page.waitForTimeout(200);
   report.kitchen=await measure();
   if(career!=='boba')report.legacyCompact520=report.kitchen.station.h<=520;
   report.sameNodesEnter=await sameNodes();
   await page.screenshot({path:dest+'/'+career+'-'+width+'-kitchen.png',fullPage:true});
   await page.locator('#us21-exit-kitchen').click();
   await page.waitForFunction(()=>document.querySelector('#v88-live-scene').dataset.view==='yard');
   report.returned=await measure();
   report.sameNodesExit=await sameNodes();
   await page.screenshot({path:dest+'/'+career+'-'+width+'-returned.png',fullPage:true});
   // View contract; record the separate legacy 520px gate without waiving it.
   assert.equal(report.yard.view,'yard');
   assert.ok(report.yard.yard.visible,'yard visible outside kitchen');
   assert.equal(report.kitchen.view,'kitchen');
   assert.equal(report.kitchen.yardWrapper.visible,false,'no ghost yard');
   if(career==='boba')assert.equal(report.kitchen.workshop.visible,true,'premium kitchen visible');else{assert.equal(report.kitchen.station.visible,true,'legacy station visible');assert.equal(report.kitchen.workshop.visible,false,'premium boba hidden for other careers');}
   assert.ok(report.kitchen.overflow<=1,'no horizontal page overflow');
   assert.ok(Object.values(report.kitchen.nodes).every(n=>n===1),'exactly one native node per control');
   assert.equal(report.returned.yard.visible,true,'yard restored by exit');
   assert.equal(report.returned.workshop.visible,false,'premium kitchen hidden after exit');assert.equal(report.returned.station.visible,false,'native station hidden after exit');
   assert.ok(report.sameNodesEnter&&report.sameNodesExit,'native node identity retained');
   assert.deepEqual(errors,[]);
  }catch(e){failures.push({width,message:String(e)});report.failure=String(e);await page.screenshot({path:dest+'/'+career+'-'+width+'-failure.png',fullPage:true}).catch(()=>{});}
  console.log('YARD COMPARE',JSON.stringify(report));
  await page.close();
 }
}finally{await browser.close();writeFileSync(dest+'/geometry.json',JSON.stringify({reports,failures},null,2));}
assert.deepEqual(failures,[],'full-game yard/kitchen diagnostic failures');
