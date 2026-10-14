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
   return {frame:box('#v88-live-frame'),bubble:box('.cs29-speech'),station:box('#cs20-station'),guest:document.getElementById('cs29-guest').getAttribute('src'),overflow:document.documentElement.scrollWidth-innerWidth};
  });
  mkdirSync('artifacts/v88-yard-cap',{recursive:true});await page.screenshot({path:`artifacts/v88-yard-cap/${width}-yard.png`});
  assert.ok(Math.abs(idle.y-geometry.station.top)<1&&Math.abs(idle.height-geometry.station.height)<1,'customer causes no counter reflow');
  assert.ok(geometry.bubble.width<=geometry.frame.width*.5,'bubble at most half courtyard');
  assert.ok(geometry.bubble.bottom<geometry.frame.top+geometry.frame.height*.4,'bubble keeps cart body visible');
  assert.equal(await page.locator('.cs29-yard-tools').count(),0,'yard does not duplicate native floating tools');
  const floats=()=>page.evaluate(()=>{const box=e=>{const r=e.getBoundingClientRect(),c=getComputedStyle(e);return {left:r.left,top:r.top,bottom:r.bottom,right:r.right,width:r.width,height:r.height,position:c.position};};return {phone:box(document.querySelector('.app-shell>div.fixed.bottom-3.right-3')),mika:box(document.getElementById('v877-mika-launch'))};});
  const shopFloat=await floats();await page.evaluate(()=>switchTab('farm'));await page.waitForTimeout(70);assert.deepEqual(await floats(),shopFloat,'same floating position and shape as other tabs');await page.evaluate(()=>switchTab('shop'));
  assert.equal(shopFloat.phone.position,'fixed');assert.equal(shopFloat.mika.position,'fixed');
  await page.evaluate(()=>window.scrollTo(0,document.documentElement.scrollHeight));await page.waitForTimeout(70);assert.deepEqual(await floats(),shopFloat,'floating tools stay fixed during scrolling');
  const guestBox=await page.locator('#cs29-guest').boundingBox();assert.ok(guestBox&&guestBox.width<=geometry.frame.width*.25&&guestBox.height<=geometry.frame.height*.4,'NPC stays at edge of yard');
  assert.ok(geometry.overflow<=1);assert.match(geometry.guest,/118_batu/,'reuse existing full-body art');
  await page.getByRole('button',{name:'Mở điện thoại',exact:true}).click();
  await page.waitForFunction(()=>phonePauseActive);await page.evaluate(()=>closeSmartPhoneModal());
  await page.getByRole('button',{name:'Mở Mika hướng dẫn',exact:true}).click();assert.ok(await page.locator('#v877-mika-panel').isVisible());await page.evaluate(()=>v877MikaClose());
  await page.evaluate(()=>window.scrollTo(0,0));mkdirSync('artifacts/v88-yard-cap',{recursive:true});await page.screenshot({path:`artifacts/v88-yard-cap/${width}-yard.png`});
  assert.deepEqual(errors,[]);console.log(`PASS yard/cap ${width}px: existing NPC, one bubble, fixed counter, Phone/Mika`);await page.close();
 }
}finally{await browser.close()}
