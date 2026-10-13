// v88.16.2: bottom navigation and one visible native order, across all careers.
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';
const options={headless:true,args:['--no-sandbox','--disable-gpu']};
if(process.env.BPVQ_TEST_BROWSER_PATH)options.executablePath=process.env.BPVQ_TEST_BROWSER_PATH;
const browser=await chromium.launch(options),reports=[];
const dest='artifacts/v88-compact-counter';mkdirSync(dest,{recursive:true});
try{
 for(const [width,height,career] of [[320,568,'boba'],[390,844,'boba'],[430,932,'boba'],[1366,768,'boba'],[390,844,'noodle'],[390,844,'streetfood']]){
  const page=await browser.newPage({viewport:{width,height}}),errors=[];
  page.on('pageerror',e=>errors.push(String(e)));
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
  const geometry=await page.evaluate(()=>{
   const rect=s=>{const r=document.querySelector(s).getBoundingClientRect();return {top:r.top,bottom:r.bottom,left:r.left,right:r.right,height:r.height,width:r.width}};
   const visible=s=>[...document.querySelectorAll(s)].filter(x=>x.getClientRects().length>0).length;
   return {header:rect('.compact-header'),nav:rect('.compact-nav'),scene:rect('#v88-live-scene'),
    cardCount:visible('#customer-booth-card'),ticketCount:visible('.cs20-ticket'),
    tapCount:document.querySelectorAll('#cs26-taps').length,groups:[...document.querySelectorAll('.cs20-group')].map(x=>x.textContent),
    containerCount:document.querySelectorAll('#cs27-containers button').length,
    catalogContainerCount:window.BPVQCookingBridge.snapshot().catalog.filter(x=>x.group==='container').length,
    shelf:rect('#cs20-shelf'),item:rect('#cs20-shelf .cs20-item'),horizontal:document.documentElement.scrollWidth-innerWidth};
  });
  assert.equal(geometry.cardCount,0,'legacy customer card must not duplicate ticket');assert.equal(geometry.ticketCount,1);
  assert.equal(geometry.tapCount,0,'tea base must not have a second selector');
  assert.equal(geometry.containerCount,geometry.catalogContainerCount,'all native container choices stay available');
  assert.ok(!geometry.groups.some(x=>['Chọn ly','Chọn thố','Chọn khay','Điều vị'].includes(x)),'no repeated size/flavor pantry tabs');
  assert.ok(geometry.item.height<=80,'ingredient art remains compact and touchable');
  assert.ok(geometry.horizontal<=1,'no horizontal overflow');
  assert.ok(geometry.header.height<=56,'header stays compact');
  assert.ok(Math.abs(geometry.nav.bottom-height)<=1,'area dock touches bottom');
  assert.ok(geometry.scene.top>=geometry.header.bottom,'scene starts below the header');
  assert.ok(geometry.scene.top-geometry.header.bottom<=4,'shop sits close to header');
  assert.equal(geometry.shelf.height,160,'two installed rows');
  const items=await page.evaluate(()=>{const rail=document.getElementById('cs20-shelf').getBoundingClientRect();return [...document.querySelectorAll('#cs20-shelf .cs20-item')].map(b=>{const r=b.getBoundingClientRect();return {top:r.top,width:r.width,visible:r.left>=rail.left-1&&r.right<=rail.right+1};});});
  assert.equal(items.filter(x=>x.visible).length,Math.min(10,items.length),'five columns show up to ten ingredients');
  assert.equal(new Set(items.filter(x=>x.visible).map(x=>x.top)).size,2,'visible ingredients occupy two rows');
  assert.ok(items.every(x=>x.width>=44),'compact ingredient targets stay touchable');
  assert.ok(await page.locator('.cs20-stage #cs20-feedback').count()===1,'status is inside preparation, not a blank block');
  const stationHeight=(await page.locator('#cs20-station').boundingBox()).height;assert.ok(stationHeight<=520,'counter is compact for every career');
  const before=await page.evaluate(()=>JSON.stringify([gameState.coins,gameState.inventory]));
  const size=page.locator('#cs27-containers button:enabled').first();await size.click();
  assert.equal(await size.getAttribute('aria-pressed'),'true','container choice feeds native dish');
  assert.equal(await page.evaluate(()=>JSON.stringify([gameState.coins,gameState.inventory])),before,'selecting size never settles inventory or money');
  if(career==='boba'){
   const groups=page.locator('#cs20-groups');await groups.getByRole('button',{name:'Cốt trà',exact:true}).click();
   assert.ok(await page.locator('#cs20-shelf .cs20-item').count()>0,'native tea catalog available');
   await groups.getByRole('button',{name:'Topping & siro',exact:true}).click();
   const shelf=await page.locator('#cs20-shelf').boundingBox();assert.equal(shelf.height,geometry.shelf.height,'all groups preserve two installed shelf rows');
   assert.equal(await page.locator('#cs20-shelf .cs20-item').count(),await page.evaluate(()=>window.BPVQCookingBridge.snapshot().catalog.filter(x=>x.group==='topping').length),'all toppings and siro share the rail');
   if(width===390){
    const money=await page.evaluate(()=>JSON.stringify([gameState.coins,gameState.inventory]));
    await page.getByRole('button',{name:'Nguyên liệu tiếp theo',exact:true}).click();
    await page.waitForFunction(()=>document.getElementById('cs20-shelf').scrollLeft>50);
    const siro=page.locator('#cs20-shelf [data-item="syrup_rainbow"]');
    assert.equal(await siro.isDisabled(),true,'UI keeps original story lock');
    await page.evaluate(()=>{gameState.shopStage=4;gameState.v874NpcRewards={...(gameState.v874NpcRewards||{}),chiHa:true};});
    await page.waitForFunction(()=>!document.querySelector('[data-item="syrup_rainbow"]').disabled);
    await siro.click();
    assert.equal(await siro.getAttribute('aria-pressed'),'true','siro remains a real native topping');
    assert.equal(await page.evaluate(()=>window.BPVQCookingBridge.snapshot().dish.toppingPortions.syrup_rainbow),1);
    await page.locator('#cs20-visual').click();
    assert.equal(await page.evaluate(()=>window.BPVQCookingBridge.snapshot().dish.toppingPortions.syrup_rainbow||0),0,'tap vessel removes the native portion');
    assert.equal(await page.evaluate(()=>JSON.stringify([gameState.coins,gameState.inventory])),money,'rail choices do not consume stock or pay');
    await page.evaluate(()=>{gameState.shopStage=0;document.getElementById('cs20-shelf').scrollLeft=0;window.BPVQUnifiedShop.update();});
   }

  }
  if(career==='noodle'){
   await page.locator('#cs20-groups').getByRole('button',{name:'Cấp cay',exact:true}).click();
   const spice=await page.evaluate(()=>{const shelf=document.getElementById('cs20-shelf').getBoundingClientRect();return [...document.querySelectorAll('[data-spice]')].map(b=>{const r=b.getBoundingClientRect();return {bottom:r.bottom,shelfBottom:shelf.bottom,width:r.width};})});
   assert.equal(spice.length,8);assert.ok(spice.every(b=>b.bottom<=b.shelfBottom&&b.width>=44),'all spice choices fit without clipping');
   await page.evaluate(()=>window.scrollTo(0,document.documentElement.scrollHeight));
   await page.locator('[data-spice="7"]').click();assert.equal(await page.evaluate(()=>window.BPVQCookingBridge.snapshot().dish.spicyLevel),7);
   await page.locator('#cs20-groups').getByRole('button',{name:'Nước cốt',exact:true}).click();
  }
  await page.evaluate(()=>window.scrollTo(0,document.documentElement.scrollHeight));await page.waitForTimeout(60);
  const final=await page.evaluate(()=>{
   const nav=document.querySelector('.compact-nav').getBoundingClientRect(),button=document.getElementById('cs20-primary').getBoundingClientRect();
   const shelf=document.getElementById('cs20-shelf').getBoundingClientRect(),pager=document.getElementById('cs26-pager').getBoundingClientRect();
   return {navBottom:nav.bottom,navTop:nav.top,buttonTop:button.top,buttonBottom:button.bottom,shelfBottom:shelf.bottom,pagerBottom:pager.bottom};
  });
  assert.ok(Math.abs(final.navBottom-height)<=1,'dock remains fixed during scroll');
  assert.ok(final.buttonBottom<=final.navTop,'primary action is not covered by area dock');
  assert.ok(final.buttonTop>=final.pagerBottom&&final.buttonTop>=final.shelfBottom,'action must not cover ingredient cards or pager');
  await page.screenshot({path:`${dest}/${width}-${career}-counter.png`});
  await page.evaluate(()=>switchTab('farm'));await page.waitForTimeout(40);
  assert.ok(await page.locator('#tab-farm').isVisible(),'area navigation still switches sections');
  await page.evaluate(()=>switchTab('shop'));await page.waitForTimeout(40);
  assert.ok(await page.locator('#tab-shop').isVisible());
  if(width===390&&career==='boba'){
   await page.evaluate(()=>{gameState.phase='preparing';currentCustomer=null;renderCustomerBooth();window.BPVQUnifiedShop.update()});
   const saved=await page.evaluate(()=>JSON.stringify([gameState.coins,gameState.inventory]));
   await page.getByRole('button',{name:'Luyện nấu ăn không mất nguyên liệu khi nghỉ ca'}).click();
   await page.waitForFunction(()=>document.getElementById('cs20-station').dataset.state==='practice');
   await page.locator('#cs27-containers button:enabled').first().click();
   await page.locator('#cs20-primary').click();await page.waitForTimeout(1100);await page.locator('#cs20-primary').click();
   await page.locator('#cs20-primary').click();
    await page.waitForFunction(()=>{const p=window.BPVQCookingStation.status().capPosition;return p>=47&&p<=52});
    await page.evaluate(()=>document.getElementById('cs20-primary').click());
   await page.waitForFunction(()=>document.getElementById('cs20-primary').dataset.act==='send');
   await page.locator('#cs20-primary').click();
   assert.equal(await page.locator('#cs20-station').getAttribute('data-state'),'idle','training finishes safely');
   assert.equal(await page.evaluate(()=>JSON.stringify([gameState.coins,gameState.inventory])),saved,'training leaves native economy unchanged');
  }
  assert.deepEqual(errors,[],`${width}/${career}: browser errors`);
  reports.push({width,height,career,geometry,final});console.log(`PASS compact counter ${width}x${height} ${career}`);
  await page.close();
 }
}finally{await browser.close();writeFileSync(dest+'/geometry.json',JSON.stringify(reports,null,2))}
