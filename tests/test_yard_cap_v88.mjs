// Real customer dialogue, cap timing, pause and exactly-once native payment.
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {mkdirSync} from 'node:fs';
const opt={headless:true,args:['--no-sandbox','--disable-gpu']};
if(process.env.BPVQ_TEST_BROWSER_PATH)opt.executablePath=process.env.BPVQ_TEST_BROWSER_PATH;
const browser=await chromium.launch(opt);
try{
 for(const width of [320,390,430,1366]){
  const page=await browser.newPage({viewport:{width,height:844}}),errors=[];
  page.on('pageerror',e=>errors.push(String(e)));await page.route('https://cdnjs.cloudflare.com/**',r=>r.abort());
  await page.goto('http://127.0.0.1:8765/',{waitUntil:'load'});
  await page.waitForFunction(()=>!!window.BPVQUnifiedShop);
  await page.evaluate(()=>{
   document.getElementById('account-new-name').value='Dập nắp TEST';createLocalAccount();
   document.getElementById('intro-shop-name').value='Quầy TEST';selectedIntroCareerChoice='boba';confirmStartGameFromIntro();window.v8771SkipStory?.();window.v8771ChooseHelp?.('off');
   gameState.level=20;gameState.shopStage=0;gameState.phase='preparing';currentCustomer=null;
   for(const list of Object.values(CAREER_WORKBENCH_KEYS.boba))for(const k of list)gameState.inventory[k]=80;
   cleanWorkbenchDish();renderCustomerBooth();window.BPVQUnifiedShop.update();
  });
  await page.waitForTimeout(650);
  const idle=await page.locator('#cs20-station').boundingBox();assert.equal(await page.locator('.cs29-speech').isVisible(),false,'no idle ticket');
  await page.evaluate(()=>{
   window.__newCapOrder=(price=45)=>{
    clearInterval(customerPatienceTimer);gameState.phase='open';gameState.shiftClosed=false;cleanWorkbenchDish();workbenchDish.listedPrice=price;
    const order={career:'boba',container:workbenchDish.container,base:workbenchDish.base,sugar:workbenchDish.sugar,ice:workbenchDish.ice,toppings:[],toppingPortions:{},requiresShaken:true,maxPrice:1000};
    currentCustomer={npcId:'ba_sau',name:'Bà Sáu',avatar:'👵',role:'Khách TEST',strict:'easy',tipMod:1,budget:1000,patience:180,maxPatience:180,order,quote:formatCustomerOrder(order)};
    renderCustomerBooth();window.BPVQUnifiedShop.update();
   };window.__newCapOrder();
  });
  await page.waitForTimeout(650);
  const geometry=await page.evaluate(()=>{
   const box=s=>{const r=document.querySelector(s).getBoundingClientRect();return {top:r.top,bottom:r.bottom,left:r.left,right:r.right,width:r.width,height:r.height}};
   return {frame:box('#v88-live-frame'),bubble:box('.cs29-speech'),tools:box('.cs29-yard-tools'),station:box('#cs20-station'),guest:document.getElementById('cs29-guest').getAttribute('src'),overflow:document.documentElement.scrollWidth-innerWidth};
  });
  mkdirSync('artifacts/v88-yard-cap',{recursive:true});await page.screenshot({path:`artifacts/v88-yard-cap/${width}-yard.png`});
  assert.ok(Math.abs(idle.y-geometry.station.top)<1&&Math.abs(idle.height-geometry.station.height)<1,'customer causes no counter reflow');
  assert.ok(geometry.bubble.width<=geometry.frame.width*.5,'bubble at most half courtyard');
  assert.ok(geometry.bubble.bottom<geometry.frame.top+geometry.frame.height*.4,'bubble keeps cart body visible');
  assert.ok(geometry.tools.bottom<=geometry.frame.bottom&&geometry.tools.top>=geometry.bubble.bottom,'yard tools do not cover order');
  const guestBox=await page.locator('#cs29-guest').boundingBox();assert.ok(guestBox&&guestBox.width<=geometry.frame.width*.25&&guestBox.height<=geometry.frame.height*.4,'NPC stays at edge of yard');
  assert.ok(geometry.overflow<=1);assert.match(geometry.guest,/118_batu/,'reuse existing full-body art');
  await page.getByRole('button',{name:'Điện thoại',exact:true}).click();
  await page.waitForFunction(()=>phonePauseActive);await page.evaluate(()=>closeSmartPhoneModal());
  await page.getByRole('button',{name:'Hỏi Mika',exact:true}).click();assert.ok(await page.locator('#v877-mika-panel').isVisible());await page.evaluate(()=>v877MikaClose());
  if(width===390){
   const coinStock=()=>page.evaluate(()=>JSON.stringify([gameState.coins,gameState.inventory]));
   const original=await coinStock();
   await page.locator('#cs20-primary').click();await page.waitForTimeout(900);await page.locator('#cs20-primary').click();await page.locator('#cs20-primary').click();
   assert.equal(await page.locator('#cs20-primary').getAttribute('data-act'),'cap-hit');
   await page.evaluate(()=>document.getElementById('cs20-primary').click());assert.equal(await page.locator('#cs20-primary').getAttribute('data-act'),'cap-start','miss permits retry');assert.equal(await coinStock(),original);
   const score=async target=>{
    assert.equal(await page.evaluate(()=>window.BPVQCookingBridge.beginCap()),true);
    return page.evaluate(async target=>{const b=window.BPVQCookingBridge;return new Promise(resolve=>{function tick(){const p=b.capPosition();if(p>=target&&p<=target+3)resolve(b.hitCap());else requestAnimationFrame(tick)}requestAnimationFrame(tick)});},target);
   };
   const baselineTip=async price=>page.evaluate(price=>{
    const saved=JSON.parse(JSON.stringify(gameState));window.__newCapOrder(price);workbenchDish.isShaken=true;const before=gameState.dailyStats.tipsRev||0;window.BPVQCookingBridge.deliver();const tip=gameState.dailyStats.tipsRev-before;gameState=saved;window.__newCapOrder(price);return tip;
   },price);
   const standardTip=await baselineTip(45);
   assert.equal(await score(48),'perfect');assert.equal(await coinStock(),original,'Perfect does not pay or consume until delivery');
   assert.equal(await page.evaluate(()=>window.BPVQCookingBridge.beginCap()),false,'successful cap is locked');
   await page.evaluate(()=>{
    const s={coins:gameState.coins,tips:gameState.dailyStats.tipsRev||0,rev:gameState.dailyStats.counterRev||0};window.__beforeCap=s;
   });
   const paid=await page.evaluate(()=>{
    const b=window.BPVQCookingBridge,s=window.__beforeCap;
    const first=b.deliver(),second=b.deliver();
    return {first,second,delta:gameState.coins-s.coins,tip:(gameState.dailyStats.tipsRev||0)-s.tips,rev:(gameState.dailyStats.counterRev||0)-s.rev};
   });
   assert.equal(paid.first,true);assert.equal(paid.second,false);assert.equal(paid.delta,paid.tip+paid.rev);
   assert.equal(paid.tip,standardTip+5,'price45 Perfect pays exactly5 extra');
   // Same native settlement without Perfect for comparison, then cap8 at high price.
   for(const [price,target,expected] of [[45,35,0],[200,48,8]]){
    const standard=await baselineTip(price);assert.equal(await score(target),target===35?'good':'perfect');
    const report=await page.evaluate(()=>{const tips=gameState.dailyStats.tipsRev||0,rev=gameState.dailyStats.counterRev||0;const ok=window.BPVQCookingBridge.deliver();return {ok,tip:gameState.dailyStats.tipsRev-tips,rev:gameState.dailyStats.counterRev-rev};});
    assert.equal(report.ok,true);assert.equal(report.tip,standard+expected);
   }
   // Signature guards direct legacy edits, bridge edits, reset, replacement orders.
   await page.evaluate(()=>window.__newCapOrder());await score(48);
   assert.equal(await page.evaluate(()=>{workbenchDish.sugar=30;return window.BPVQCookingBridge.consumeCapTip(currentCustomer,workbenchDish,true)}),0,'dish edit invalidates award');
   await page.evaluate(()=>window.__newCapOrder());await score(48);
   assert.equal(await page.evaluate(()=>{window.BPVQCookingBridge.choose('ice',0);return window.BPVQCookingBridge.consumeCapTip(currentCustomer,workbenchDish,true)}),0);
   await page.evaluate(()=>window.__newCapOrder());await score(48);
   assert.equal(await page.evaluate(()=>{window.__newCapOrder();return window.BPVQCookingBridge.consumeCapTip(currentCustomer,workbenchDish,true)}),0,'replacement customer cannot inherit tip');
   await page.evaluate(()=>window.__newCapOrder());await score(48);
   assert.equal(await page.evaluate(()=>{cleanWorkbenchDish();workbenchDish.isShaken=true;return window.BPVQCookingBridge.consumeCapTip(currentCustomer,workbenchDish,true)}),0,'legacy reset invalidates award');
   await page.evaluate(()=>window.__newCapOrder());await score(48);
   const rejected=await page.evaluate(()=>{const money=gameState.coins,tips=gameState.dailyStats.tipsRev;currentCustomer.strict='very_strict';currentCustomer.order.base='tea_green';const ok=window.BPVQCookingBridge.deliver();return {ok,delta:gameState.coins-money,tip:gameState.dailyStats.tipsRev-tips};});
   assert.equal(rejected.ok,true);assert.equal(rejected.delta,0);assert.equal(rejected.tip,0,'Perfect cannot pay a refused wrong recipe');
   await page.evaluate(()=>window.__newCapOrder());
   assert.equal(await page.evaluate(()=>window.BPVQCookingBridge.beginCap()),true);
   await page.evaluate(()=>window.BPVQCookingBridge.capPosition());
   await page.getByRole('button',{name:'Điện thoại',exact:true}).click();await page.waitForTimeout(600);
   const paused=await page.evaluate(()=>window.BPVQCookingBridge.capPosition());await page.waitForTimeout(650);
   assert.equal(await page.evaluate(()=>window.BPVQCookingBridge.capPosition()),paused,'phone freezes timing');
   assert.equal(await page.evaluate(()=>window.BPVQCookingBridge.hitCap()),null,'cannot score through phone');await page.evaluate(()=>closeSmartPhoneModal());
   await page.evaluate(()=>window.BPVQCookingBridge.reset());
  }
  await page.evaluate(()=>window.scrollTo(0,0));mkdirSync('artifacts/v88-yard-cap',{recursive:true});await page.screenshot({path:`artifacts/v88-yard-cap/${width}-yard.png`});
  assert.deepEqual(errors,[]);console.log(`PASS yard/cap ${width}px: existing NPC, one bubble, fixed counter, Phone/Mika${width===390?', native tips + guards + pause':''}`);await page.close();
 }
}finally{await browser.close()}
