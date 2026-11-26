// RC2 B-02: same full-game diagnostic on original baseline, UI parent and candidate.
import assert from 'node:assert/strict';
import {chromium,webkit} from 'playwright';
import {mkdirSync,writeFileSync} from 'node:fs';
import {cookKitchen,enterKitchen} from './kitchen_test_helpers.mjs';
const engine=process.env.BPVQ_QA_ENGINE||'chromium';
const output=process.env.BPVQ_QA_OUTPUT||'artifacts/rc2-practice-hit';
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
 await enterKitchen(page);
 await page.evaluate(c=>{
  const b=window.BPVQCookingBridge;
  if(c==='boba'){if(!window.BPVQCookingStation.status().practice){b.choose('topping','topping_boba',1);b.choose('topping','topping_boba',1);}}
  else if(c==='noodle'){if(!window.BPVQCookingStation.status().practice){b.choose('base','broth_kimchi');b.choose('spice',2);b.choose('topping','ntop_beef',1);b.choose('topping','ntop_beef',1);b.choose('topping','ntop_fishcake',1);}}
  else if(!window.BPVQCookingStation.status().practice){b.choose('topping','skewer_fish',1);b.choose('topping','skewer_fish',1);b.choose('topping','skewer_beef',1);}
 },career);
}
const reports=[],failures=[];
const snapshot=page=>page.evaluate(()=>JSON.stringify([gameState.coins,gameState.inventory,gameState.reviews,gameState.xp]));
try{
 for(const [width,height] of [[320,568],[390,844],[1366,768]])for(const career of ['streetfood','boba','noodle']){
  const page=await browser.newPage({viewport:{width,height},hasTouch:width<700}),errors=[];
  const report={engine,width,height,career,errors};reports.push(report);
  const key=career+'-'+width;
  const capture=(name,fullPage=false)=>page.screenshot({path:output+'/'+key+'-'+name+'.png',fullPage});
  const press=locator=>width<700?locator.tap({timeout:6000}):locator.click({timeout:6000});
  page.on('pageerror',e=>errors.push(String(e)));
  try{
   // Fresh synthetic profile, not a real user save.
   await setup(page,career,true);
   assert.equal(await page.evaluate(()=>window.BPVQCookingStation.status().practice),true);
   const before=await snapshot(page);
   const group=page.locator('#cs20-groups').getByRole('button',{name:career==='streetfood'?'Chọn xiên':career==='boba'?'Topping & siro':'Topping',exact:true});
   await group.scrollIntoViewIfNeeded();
   report.geometry=await group.evaluate(e=>{
    const rect=x=>{const r=x.getBoundingClientRect(),s=getComputedStyle(x);return {x:r.x,y:r.y,w:r.width,h:r.height,pointer:s.pointerEvents,display:s.display,position:s.position,z:s.zIndex}};
    const r=e.getBoundingClientRect(),x=r.x+r.width/2,y=r.y+r.height/2;
    const hit=document.elementFromPoint(x,y);
    return {group:rect(e),hit:hit?{tag:hit.tagName,id:hit.id,className:hit.getAttribute('class')}:null,centerHitsGroup:!!hit&&e.contains(hit),props:[...document.querySelectorAll('#cs20-station .cp175-props, #cs20-station .cp175-props img')].map(x=>({className:x.className,...rect(x)}))};
   });
   await group.evaluate(e=>{window.__rc2TrustedGroupClicks=0;e.addEventListener('click',ev=>{if(ev.isTrusted)window.__rc2TrustedGroupClicks++});});
   await capture('before-click');
   // Keep the actual selected group click even if redundant; no force or programmatic input.
   await press(group);
   report.groupClicked=true;
   report.trustedGroupClicks=await page.evaluate(()=>window.__rc2TrustedGroupClicks);
   assert.ok(report.trustedGroupClicks>=1,'trusted group click received');
   assert.equal(await group.getAttribute('aria-pressed'),'true');
   for(const [id,n] of career==='streetfood'?[['skewer_fish',2],['skewer_beef',1]]:career==='boba'?[['topping_boba',2]]:[['ntop_beef',2],['ntop_fishcake',1]]){
    const item=page.locator('#cs20-shelf [data-item="'+id+'"]');
    for(let i=0;i<n;i++)await press(item);
   }
   await capture('ingredients',true);
   await cookKitchen(page,career,'perfect');
   assert.equal(await page.locator('#cs20-primary').getAttribute('data-act'),'send');
   await capture('ready',true);
   await press(page.locator('#cs20-primary'));
   await page.waitForFunction(()=>!window.BPVQCookingStation.status().practice);
   assert.equal(await snapshot(page),before,'practice settlement leaves coins/inventory/reviews/xp unchanged');
   assert.deepEqual(errors,[]);
   report.practiceSettled=true;
   await capture('settled',true);
  }catch(e){report.failure=String(e);failures.push({width,career,error:String(e)});await capture('failure',true).catch(()=>{});}
  console.log('RC2 PRACTICE',JSON.stringify(report));
  await page.close();
 }
}finally{await browser.close();writeFileSync(output+'/geometry.json',JSON.stringify({reports,failures},null,2));}
assert.deepEqual(failures,[],'RC2 practice hit/settlement failures');
