// User-facing drink edits must preserve poured volume, but invalidate lid/tip.
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const opt={headless:true,args:['--no-sandbox','--disable-gpu']};if(process.env.BPVQ_TEST_BROWSER_PATH)opt.executablePath=process.env.BPVQ_TEST_BROWSER_PATH;
const browser=await chromium.launch(opt);
try{
 for(const practice of [false,true]){
  const page=await browser.newPage({viewport:{width:390,height:844}}),errors=[];page.on('pageerror',e=>errors.push(String(e)));await page.route('https://cdnjs.cloudflare.com/**',r=>r.abort());
  await page.goto('http://127.0.0.1:8765/',{waitUntil:'load'});await page.waitForFunction(()=>!!window.BPVQUnifiedShop);
  await page.evaluate(practice=>{
   document.getElementById('account-new-name').value='Giữ lượng TEST';createLocalAccount();document.getElementById('intro-shop-name').value='Quầy TEST';selectedIntroCareerChoice='boba';confirmStartGameFromIntro();window.v8771SkipStory?.();window.v8771ChooseHelp?.('off');
   gameState.level=20;gameState.shopStage=1;gameState.phase=practice?'preparing':'open';gameState.shiftClosed=false;
   for(const a of Object.values(CAREER_WORKBENCH_KEYS.boba))for(const k of a)gameState.inventory[k]=30;
   cleanWorkbenchDish();
   window.__replaceCustomer=()=>{currentCustomer={name:'Khách TEST',npcId:'ba_sau',avatar:'👵',role:'TEST',strict:'moderate',budget:200,patience:180,maxPatience:180,order:{career:'boba',container:'cup_m',base:'tea_black',sugar:70,ice:50,toppings:[],toppingPortions:{},requiresShaken:true,maxPrice:200}};renderCustomerBooth();window.BPVQUnifiedShop.update();};
   if(practice){currentCustomer=null;renderCustomerBooth();window.BPVQUnifiedShop.update();}else window.__replaceCustomer();
  },practice);
  await page.waitForTimeout(650);if(practice){assert.equal(await page.evaluate(()=>window.BPVQCookingStation.startPractice()),true);}
  const economy=await page.evaluate(()=>JSON.stringify([gameState.coins,gameState.inventory]));
  const status=()=>page.evaluate(()=>window.BPVQCookingStation.status());
  await page.locator('[data-item="topping_boba"]').click();assert.equal((await status()).pour,0);assert.equal(await page.locator('#cs20-primary').getAttribute('data-act'),'pour');
  await page.locator('#cs20-primary').click();await page.waitForTimeout(700);
  const running=(await status()).pour;await page.locator('[data-item="topping_boba"]').click();assert.equal((await status()).stage,'pour');assert.ok((await status()).pour>=running,'edit during pour keeps its accumulated volume');
  await page.locator('#cs20-primary').click();const stopped=await status();assert.ok(stopped.pour>0);assert.equal(stopped.poured,true);
  const same=async()=>{const s=await status();assert.equal(s.pour,stopped.pour);assert.equal(s.poured,true);assert.equal(await page.locator('#cs20-primary').getAttribute('data-act'),'cap-start');};
  for(const [label,index]of [['Đường trong món',2],['Đá trong món',2]]){
   await page.evaluate(({label,index})=>{const e=document.querySelector(`input[aria-label="${label}"]`);e.value=String(index);e.dispatchEvent(new Event('change',{bubbles:true}));},{label,index});await same();
  }
  await page.locator('[data-item="topping_boba"]').click();await same();await page.locator('#cs20-visual').click();await same();
  await page.getByRole('button',{name:'Cốt trà',exact:true}).click();await page.locator('[data-item="tea_green"]').click();await same();
  await page.locator('#cs27-containers button').nth(1).click();await same();
  assert.equal(await page.locator('#cs20-top-up').isEnabled(),true,'stopped cup can be topped up');
  await page.getByRole('button',{name:'Rót thêm trà vào ly',exact:true}).click();
  await page.waitForTimeout(450);assert.ok((await status()).pour>stopped.pour,'top up continues above retained volume');
  await page.locator('#cs20-primary').click();stopped.pour=(await status()).pour;await same();

  const cap=async()=>{await page.locator('#cs20-primary').click();await page.waitForFunction(()=>{const p=window.BPVQCookingStation.status().capPosition;return p>=47&&p<=52});await page.evaluate(()=>document.getElementById('cs20-primary').click());await page.waitForFunction(()=>document.getElementById('cs20-primary').dataset.act==='send');};
  await cap();const cooked=await status();await page.getByRole('button',{name:'Topping & siro',exact:true}).click();await page.locator('[data-item="topping_boba"]').click();assert.equal((await status()).stage,'done','sealed paid batch cannot be silently edited');assert.equal((await status()).pour,cooked.pour);
  if(practice)assert.equal(await page.evaluate(()=>JSON.stringify([gameState.coins,gameState.inventory])),economy,'practice no economy');
  else assert.equal(await page.evaluate(()=>window.BPVQCookingBridge.snapshot().dish.isShaken),true,'locked cap preserves completion');
  assert.equal(await page.locator('#cs20-top-up').isDisabled(),true,'sealed cup cannot silently resume pouring');
  await page.locator('#cs20-undo').click();assert.equal((await status()).pour,0);assert.equal((await status()).poured,false);assert.equal(await page.locator('#cs20-primary').getAttribute('data-act'),'pour');
  await page.locator('#cs20-primary').click();await page.waitForTimeout(400);await page.locator('#cs20-primary').click();assert.ok((await status()).pour>0);
  await page.getByRole('button',{name:'Rót thêm trà vào ly',exact:true}).click();
  await page.waitForFunction(()=>window.BPVQCookingStation.status().pour===100);assert.equal((await status()).stage,'mix');
  assert.equal(await page.locator('#cs20-top-up').isDisabled(),true,'full cup cannot overflow');
  await page.evaluate(()=>document.getElementById('cs20-top-up').click());assert.equal((await status()).pour,100);

  if(practice){await page.evaluate(()=>window.BPVQCookingStation.stopPractice());await page.evaluate(()=>window.BPVQCookingStation.startPractice());}
  else{const key=(await status()).key;await page.evaluate(()=>window.__replaceCustomer());await page.waitForFunction(k=>window.BPVQCookingStation.status().key!==k,key);}
  assert.equal((await status()).pour,0,'new drink starts empty');assert.deepEqual(errors,[]);console.log(`PASS retained pour ${practice?'practice':'live'}: sugar/ice/portions/base/size, edits during pour, recap, reset/new drink`);await page.close();
 }
}finally{await browser.close()}
