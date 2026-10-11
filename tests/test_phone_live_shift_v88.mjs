// Phone pause during the live game shift: no lost customers, no fast-forwarded patience.
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
try{
 const page=await browser.newPage({viewport:{width:390,height:844}});
 const pageErrors=[];
 page.on('pageerror',err=>pageErrors.push(err.message));
 await page.route('https://cdnjs.cloudflare.com/**',r=>r.abort('blockedbyclient'));
 await page.goto('http://127.0.0.1:8765/',{waitUntil:'domcontentloaded',timeout:45000});
 await page.waitForFunction(()=>!!window.VillageOS&&!!window.BPVQDecorV88);
 await page.evaluate(()=>{
  document.getElementById('account-new-name').value='Phone Ca Bán';
  document.getElementById('account-new-shop-name').value='Quán Tạm Dừng';
  createLocalAccount();
  document.getElementById('intro-shop-name').value='Quán Tạm Dừng';
  selectIntroCareer('boba');
  confirmStartGameFromIntro();
  toggleOpenShop();
  if(gameState.phase!=='open')throw Error('shift did not open');
  window.openSmartPhoneModal();
  if(!phonePauseActive)throw Error('phone does not pause shop shift');
  if(document.getElementById('modal-smartphone').classList.contains('hidden'))throw Error('phone is not visible');
 });
 // Original first-customer spawn is scheduled in 1200ms. Phone must block it.
 await page.waitForTimeout(1450);
 const idle=await page.evaluate(()=>{
  if(currentCustomer)throw Error('customer spawned while Phone paused before arrival');
  if(!phonePauseActive)throw Error('phone pause disengaged while open');
  window.closeSmartPhoneModal();
  if(phonePauseActive)throw Error('phone pause remains active after close');
  // Use real spawn function (scheduling itself is also checked by the idle case above).
  clearTimeout(window._nextCustomerTimeout);
  spawnNextCustomer();
  if(!currentCustomer)throw Error('customer did not spawn after closing Phone');
  return {name:currentCustomer.name,patience:currentCustomer.patience,rate:gameState.reputation,coins:gameState.coins};
 });
 await page.waitForTimeout(650);
 const afterWait=await page.evaluate(()=>({patience:currentCustomer?.patience}));
 assert.ok(afterWait.patience<idle.patience,'timer must count down while Phone closed');
 const closed=await page.evaluate(()=>{
  window.openSmartPhoneModal();
  if(!phonePauseActive)throw Error('Phone failed to pause current customer');
  if(!currentCustomer)throw Error('Phone opening removed active customer');
  return {patience:currentCustomer.patience,name:currentCustomer.name,coins:gameState.coins,rate:gameState.reputation};
 });
 await page.waitForTimeout(1750);
 const held=await page.evaluate(()=>({patience:currentCustomer?.patience,name:currentCustomer?.name,rate:gameState.reputation,coins:gameState.coins}));
 assert.equal(held.patience,closed.patience,'customer patience decreased during phone pause');
 assert.equal(held.name,closed.name,'customer replaced while paused');
 assert.equal(held.rate,closed.rate,'lost reputation during pause');
 assert.equal(held.coins,closed.coins,'wallet changed during pause');
 await page.evaluate(()=>{
  window.VillageOS.open('construction');
  window.BPVQReborn.constructionTab('inventory');
  window.BPVQReborn.constructionTab('layout');
  window.closeSmartPhoneModal();
  if(phonePauseActive)throw Error('Phone did not resume shift after closing Xây Quán');
  if(!currentCustomer)throw Error('current customer disappeared');
 });
 await page.waitForTimeout(650);
 const resumed=await page.evaluate(()=>({patience:currentCustomer?.patience,phase:gameState.phase,coins:gameState.coins,rate:gameState.reputation}));
 assert.ok(resumed.patience<held.patience,'customer timer did not resume after closing Phone');
 assert.equal(resumed.phase,'open');
 assert.equal(resumed.coins,closed.coins);
 assert.equal(resumed.rate,closed.rate);
 assert.deepEqual(pageErrors,[]);
 console.log('LIVE SHIFT PHONE PAUSE/RESUME PASS',JSON.stringify({idle,closed,held,resumed}));
}finally{await browser.close()}
