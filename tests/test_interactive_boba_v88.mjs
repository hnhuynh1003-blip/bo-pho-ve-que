import assert from 'node:assert/strict';
import {chromium,webkit} from 'playwright';
import {mkdirSync,writeFileSync} from 'node:fs';
const engine=process.env.BPVQ_QA_ENGINE||'chromium',out=process.env.BPVQ_QA_OUTPUT||'artifacts/interactive-boba';
mkdirSync(out,{recursive:true});
const browser=await (engine==='webkit'?webkit:chromium).launch({headless:true});
const reports=[],failures=[];
try{
 for(const width of [390,1366]){
 const page=await browser.newPage({viewport:{width,height:844},hasTouch:width<700}),errors=[],report={width,errors};reports.push(report);
 page.on('pageerror',e=>errors.push(String(e)));
 const shot=n=>page.screenshot({path:out+'/'+width+'-'+n+'.png',fullPage:true});
 const press=s=>width<700?page.locator(s).tap():page.locator(s).click();
 const dish=()=>page.evaluate(()=>window.BPVQCookingStation.presentation().dish);
 const wait=fn=>page.waitForFunction(fn);
 try{
  await page.route('https://cdnjs.cloudflare.com/**',r=>r.abort());
  await page.goto('http://127.0.0.1:8765/',{waitUntil:'load'});
  // Controlled synthetic order for focused UI regression; fresh onboarding tested separately.
  await page.evaluate(()=>{
   document.getElementById('account-new-name').value='UI PREP TEST';createLocalAccount();
   document.getElementById('intro-shop-name').value='Quầy TEST';selectedIntroCareerChoice='boba';confirmStartGameFromIntro();
   window.v8771SkipStory?.();window.v8771ChooseHelp?.('off');
   for(const id of ['screen-account','screen-intro'])document.getElementById(id).classList.add('hidden');
   gameState.level=20;gameState.currentCareer='boba';gameState.shopStage=0;gameState.phase='open';gameState.shiftClosed=false;gameState.automation={...gameState.automation,shopFastEnabled:false};
   for(const ids of Object.values(CAREER_WORKBENCH_KEYS.boba))for(const id of ids)gameState.inventory[id]=50;
   cleanWorkbenchDish();
   const order={career:'boba',container:'cup_m',base:'tea_black',sugar:0,ice:50,toppings:['topping_boba'],toppingPortions:{topping_boba:1},requiresShaken:true,maxPrice:120};
   currentCustomer={npcId:'ui_test',name:'Khách TEST',avatar:'🐰',budget:120,strict:'very_strict',patience:180,maxPatience:180,order,quote:formatCustomerOrder(order)};
   renderCustomerBooth();updateHeaderStats();window.BPVQUnifiedShop.update();window.__updateHeaderNavLayout();
  });
  await page.waitForTimeout(700);await press('#us21-enter-kitchen');
  await wait(()=>document.querySelector('#cp177-workshop').dataset.interactive==='1');
  const d=await dish();assert.equal(d.container,null);assert.equal(d.base,null);assert.equal(d.ice,null);assert.equal(d.sugar,null);assert.equal(d.pourAmount,0);assert.deepEqual(d.toppings,[]);
  assert.equal(await page.locator('.cp180-cap').isDisabled(),true);await shot('empty');
  assert.match(await page.locator('.cp180-receipt').innerText(),/Khách TEST/);
  await press('#cs27-containers button:first-child');
  await press('[data-flavor="ice"][data-value="50"]');
  await wait(()=>window.BPVQCookingStation.presentation().dish.ice===50);
  assert.equal((await dish()).pourAmount,0);
  assert.equal(await page.locator('#cs20-visual [data-ice][opacity="1"]').count(),4);
  await press('[data-flavor="sugar"][data-value="0"]');
  assert.equal((await dish()).sugar,0);await shot('ice-before-pour');
  await press('#cs20-groups [data-group="base"]');await press('#cs20-shelf [data-item="tea_black"]');
  assert.equal((await dish()).selectedBase,'tea_black');assert.equal((await dish()).base,null);
  await press('#cs20-groups [data-group="topping"]');await press('#cs20-shelf [data-item="topping_boba"]');
  assert.equal((await dish()).toppingPortions.topping_boba,1);
  await press('#cp177-pour-object');await wait(()=>window.BPVQCookingStation.status().pour>15);await press('#cp177-pour-object');
  await wait(()=>window.BPVQCookingStation.presentation().dish.pourAmount>0);
  assert.equal((await dish()).base,'tea_black');assert.equal(await page.locator('#cs20-visual [data-lid]').getAttribute('opacity'),'0');
  await shot('poured');await press('.cp180-cap');
  await wait(()=>window.BPVQCookingStation.status().stage==='capping');
  await shot('cap-timing');await press('.cp180-cap');
  await wait(()=>window.BPVQCookingStation.presentation().dish.isShaken===true);
  assert.equal(await page.locator('#cs20-visual [data-lid]').getAttribute('opacity'),'1');
  await shot('capped');await press('#cs20-primary');await wait(()=>document.getElementById('cs20-primary').dataset.act==='send');await press('#cs20-primary');
  await wait(()=>!window.BPVQCookingBridge.snapshot().customer);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth<=1));
  assert.deepEqual(errors,[]);report.pass=true;
 }catch(e){report.failure=String(e);failures.push({width,error:String(e)});await shot('failure').catch(()=>{});}
 console.log('INTERACTIVE BOBA',JSON.stringify(report));await page.close();
 }
}finally{await browser.close();writeFileSync(out+'/results.json',JSON.stringify({reports,failures},null,2));}
assert.deepEqual(failures,[]);
