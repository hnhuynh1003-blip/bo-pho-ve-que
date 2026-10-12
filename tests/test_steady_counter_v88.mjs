// Real UI regression: customer transitions must not reflow or recreate the counter.
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {mkdirSync,writeFileSync} from 'node:fs';
const args={headless:true,args:['--no-sandbox','--disable-gpu']};
if(process.env.BPVQ_TEST_BROWSER_PATH)args.executablePath=process.env.BPVQ_TEST_BROWSER_PATH;
const browser=await chromium.launch(args),records=[];
const dest='artifacts/v88-steady-counter';mkdirSync(dest,{recursive:true});
try{
 for(const [width,career] of [[320,'boba'],[390,'boba'],[390,'noodle'],[390,'streetfood']]){
  const page=await browser.newPage({viewport:{width,height:844}}),errors=[];
  page.on('pageerror',e=>errors.push(String(e)));
  await page.route('https://cdnjs.cloudflare.com/**',r=>r.abort());
  await page.goto('http://127.0.0.1:8765/',{waitUntil:'load'});
  await page.waitForFunction(()=>!!window.BPVQCookingStation&&!!window.BPVQUnifiedShop);
  await page.evaluate(c=>{
   document.getElementById('account-new-name').value='Khung TEST '+c;createLocalAccount();
   document.getElementById('intro-shop-name').value='Quầy TEST';selectedIntroCareerChoice=c;confirmStartGameFromIntro();if(window.v8771SkipStory)window.v8771SkipStory();if(window.v8771ChooseHelp)window.v8771ChooseHelp('off');
   gameState.level=20;gameState.shopStage=0;gameState.currentCareer=c;gameState.phase='prep';currentCustomer=null;
   for(const list of Object.values(CAREER_WORKBENCH_KEYS[c]))for(const key of list)gameState.inventory[key]=20;
   cleanWorkbenchDish();renderCustomerBooth();updateHeaderStats();window.BPVQUnifiedShop.update();
  },career);
  await page.waitForTimeout(650);
  const baseline=await page.evaluate(()=>{
   const names=['#cs20-station','.cs20-stage','.cs20-price','.cs20-pantry','#cs20-shelf','#cs26-pager','#cs20-feedback','.cs20-grill-actions','.cs20-actions'];
   const rect=el=>{const r=el.getBoundingClientRect();return {top:r.top,height:r.height}};
   window.__counterRefs={svg:document.querySelector('#cs20-visual svg'),size:document.querySelector('#cs27-containers button'),ingredient:document.querySelector('#cs20-shelf button'),slider:document.querySelector('#cs26-meters input'),group:document.querySelector('#cs20-groups button'),ticket:document.querySelector('.cs20-ticket')};
   return Object.fromEntries(names.map(s=>[s,rect(document.querySelector(s))]));
  });
  for(let n=0;n<10;n++){
   const state=n%2?'waiting':'order';
   await page.evaluate(({n,state,c})=>{
    gameState.phase='open';
    const order=c==='boba'?{career:c,container:'cup_m',base:'tea_black',sugar:70,ice:50,toppings:n===8?CAREER_WORKBENCH_KEYS.boba.toppings.filter(k=>k!=='syrup_rainbow'):['topping_boba'],requiresShaken:true,maxPrice:120}:
     c==='noodle'?{career:c,container:'bowl_m',base:'broth_kimchi',spicyLevel:3,toppings:['ntop_beef'],requiresCooked:true,maxPrice:120}:
     {career:c,tray:'plate',sauce:'sauce_sweet_chili',skewerCounts:{skewer_fish:2},requiresFried:true,maxPrice:120};
    currentCustomer=state==='waiting'?null:{name:'Khách '+n,avatar:'🐰',role:'Khách TEST',budget:120,strict:'moderate',patience:180,maxPatience:180,order,quote:formatCustomerOrder(order)};
    renderCustomerBooth();window.BPVQUnifiedShop.update();
   },{n,state,c:career});
   await page.waitForFunction(s=>document.getElementById('cs20-station').dataset.state===s,state==='order'?'order':'idle');
   const report=await page.evaluate(names=>{
    const rect=el=>{const r=el.getBoundingClientRect();return {top:r.top,height:r.height}};
    const same=Object.entries(window.__counterRefs).every(([key,node])=>!node||node.isConnected);
    return {rects:Object.fromEntries(names.map(s=>[s,rect(document.querySelector(s))])),same,animating:window.BPVQCookingStation.status().animating,overflow:document.documentElement.scrollWidth-innerWidth};
   },Object.keys(baseline));
   for(const [selector,box] of Object.entries(baseline)){
    assert.ok(Math.abs(report.rects[selector].height-box.height)<1,`${width}/${career}/${state}: height changed ${selector}`);
    assert.ok(Math.abs(report.rects[selector].top-box.top)<1,`${width}/${career}/${state}: position changed ${selector}`);
   }
   assert.equal(report.same,true,'installed controls and vessel keep their DOM nodes');
   assert.equal(report.animating,false,'no animation loop while waiting or reading an order');
   assert.ok(report.overflow<=1,'no horizontal overflow');
  }
  const mutation=await page.evaluate(async()=>{
   const visual=document.getElementById('cs20-visual');let redraws=0;
   const observer=new MutationObserver(rs=>redraws+=rs.filter(r=>r.type==='childList').length);observer.observe(visual,{childList:true});
   await new Promise(r=>setTimeout(r,1650));observer.disconnect();return redraws;
  });
  assert.equal(mutation,0,'waiting must not recreate the SVG every poll');
  if(career==='boba'){
   await page.locator('#cs20-groups').getByRole('button',{name:'Cốt trà',exact:true}).click();
   assert.ok(await page.locator('.cs28-dispenser').count()>0,'illustrated tea dispensers load');
   await page.waitForFunction(()=>[...document.querySelectorAll('img.cs28-jar-shell')].every(im=>im.complete&&im.naturalWidth>0));
   const asset=await page.evaluate(()=>[...document.querySelectorAll('img.cs28-jar-shell')].every(im=>im.complete&&im.naturalWidth>0));assert.ok(asset,'dispenser raster is available');
   await page.screenshot({path:`${dest}/${width}-tea.png`});
   await page.locator('#cs20-groups').getByRole('button',{name:'Topping & siro',exact:true}).click();
   await page.screenshot({path:`${dest}/${width}-topping.png`});
  }
  await page.evaluate(()=>{gameState.phase='prep';currentCustomer=null;renderCustomerBooth();window.BPVQUnifiedShop.update()});
  await page.waitForFunction(()=>document.getElementById('cs20-station').dataset.state==='idle');
  await page.getByRole('button',{name:'Luyện nấu ăn không mất nguyên liệu khi nghỉ ca'}).click();
  await page.waitForFunction(()=>document.getElementById('cs20-station').dataset.state==='practice');
  const practice=await page.locator('#cs20-station').boundingBox();assert.ok(Math.abs(practice.height-baseline['#cs20-station'].height)<1,'training preserves the installed counter height');
  if(width===390){
   const money=await page.evaluate(()=>JSON.stringify([gameState.coins,gameState.inventory]));
   if(career==='boba'){
    await page.locator('#cs20-primary').click();await page.waitForTimeout(1100);await page.locator('#cs20-primary').click();
    await page.locator('#cs20-primary').click();
    await page.waitForFunction(()=>{const p=window.BPVQCookingStation.status().capPosition;return p>=47&&p<=52});
    await page.evaluate(()=>document.getElementById('cs20-primary').click());
   }else if(career==='noodle'){
    for(let i=0;i<3;i++)await page.locator('#cs20-primary').click();
   }else{
    await page.locator('#cs20-shelf button:enabled').first().click();await page.locator('#cs20-primary').click();
    await page.locator('#cs20-flip').click();await page.locator('#cs20-sauce').click();
    await page.waitForFunction(()=>document.getElementById('cs20-primary').dataset.act==='pull');await page.locator('#cs20-primary').click();
   }
   await page.waitForFunction(()=>document.getElementById('cs20-primary').dataset.act==='send');
   const vessel=await page.evaluate(()=>window.__counterRefs.svg===document.querySelector('#cs20-visual svg'));assert.ok(vessel,'cooking animation retains the vessel');
   await page.locator('#cs20-primary').click();
   assert.equal(await page.evaluate(()=>JSON.stringify([gameState.coins,gameState.inventory])),money,'all careers train without settlement');
   assert.equal(await page.evaluate(()=>window.BPVQCookingStation.status().animating),false,'animation stops when practice ends');
  }else await page.getByRole('button',{name:'✕ Thoát luyện tập',exact:true}).click();
  assert.deepEqual(errors,[],`${width}/${career} browser errors`);
  records.push({width,career,cycles:10,redraws:mutation,height:baseline['#cs20-station'].height});console.log(`PASS steady counter ${width}/${career}: 10 transitions, zero SVG rebuilds`);
  await page.close();
 }
}finally{await browser.close();writeFileSync(dest+'/transitions.json',JSON.stringify(records,null,2))}
