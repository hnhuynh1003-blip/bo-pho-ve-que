// Full career-independent construction progression from B1 to B9, using real game functions.
// Isolated Chromium profile only; no real player data is accessed.
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
try{
 const page=await browser.newPage({viewport:{width:390,height:844}});
 await page.route('https://cdnjs.cloudflare.com/**',r=>r.abort('blockedbyclient'));
 try{
  await page.goto('http://127.0.0.1:8765/',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>!!window.BPVQDecorV88&&!!window.VillageOS);
  const result=await page.evaluate(()=>{
   const check=(ok,msg)=>{if(!ok)throw Error(msg)};
   document.getElementById('account-new-name').value='Công Trình QA';
   document.getElementById('account-new-shop-name').value='Quán Tiến Độ';
   createLocalAccount();
   document.getElementById('intro-shop-name').value='Quán Tiến Độ';
   confirmStartGameFromIntro();
   check(gameState.hasStarted,'profile not started');
   gameState.level=100;
   gameState.reputation=5;
   gameState.coins=500000;
   const originalConfirm=window.confirm;
   window.confirm=()=>true;
   try{
    const records=[];
    for(let target=1;target<9;target++){
      const next=SHOP_STAGE_CONFIG[target],cost=next.cost;
      const prevCoins=gameState.coins,prevSP=gameState.sp,prevStage=gameState.shopStage,prevDay=gameState.day;
      check(prevStage===target-1,'unexpected stage before purchase '+target);
      upgradeShopStage();
      const contract=gameState.shopConstruction;
      const duration=v8775ConstructionDuration(target);
      check(contract?.targetStage===target,'no contract started for stage '+target);
      check(contract?.cost===cost,'wrong construction fee on stage '+target);
      check(contract?.startedDay===prevDay && contract?.finishDay===prevDay+duration,'wrong construction duration '+target);
      check(gameState.coins===prevCoins-cost,'wrong Xu charge for stage '+target);
      check(gameState.shopStage===prevStage && gameState.sp===prevSP,'premature stage/SP reward');
      // Re-entering the same action during an active contract must not charge again.
      upgradeShopStage();
      check(gameState.coins===prevCoins-cost && gameState.shopConstruction?.targetStage===target,'duplicate contract exploit');
      gameState.day=contract.finishDay-1;
      check(v8775FinishConstructionIfReady()===false,'early completion '+target);
      gameState.day=contract.finishDay;
      check(v8775FinishConstructionIfReady()===true,'completion failed '+target);
      check(gameState.shopStage===target && gameState.sp===prevSP+1,'wrong one-time stage/SP reward '+target);
      check(gameState.shopConstruction===null,'contract not cleared '+target);
      check(v8775FinishConstructionIfReady()===false && gameState.sp===prevSP+1,'duplicate completion exploit '+target);
      window.VillageOS.open('construction');
      window.BPVQReborn.constructionTab('layout');
      const available=window.BPVQDecorV88.snapshot().tier;
      check(available===target+1,'decor slots not unlocked for stage '+target);
      records.push({tier:target+1,cost,duration,sp:gameState.sp});
    }
    const before={coins:gameState.coins,sp:gameState.sp,stage:gameState.shopStage};
    upgradeShopStage();
    check(gameState.shopConstruction===null&&gameState.coins===before.coins&&gameState.sp===before.sp&&gameState.shopStage===before.stage,'max tier must not make new contract');
    saveGameToStorage(false);
    return {records,key:getProfileStorageKey(activeProfileId),final:before};
   }finally{window.confirm=originalConfirm}
  });
  assert.equal(result.records.length,8);
  const old=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)||'null'),result.key);
  assert.equal(old.shopStage,8);
  assert.equal(old.sp,8);
  assert.equal(old.shopConstruction,null);
  await page.reload({waitUntil:'domcontentloaded'});
  const saved=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)||'null'),result.key);
  assert.equal(saved.shopStage,8);
  assert.equal(saved.sp,8);
  assert.equal(saved.coins,result.final.coins);
  console.log('ALL 9 SHOP TIERS AND ORIGINAL CONSTRUCTION CONTRACTS PASS',JSON.stringify(result.records));
 }finally{await page.close()}
}finally{await browser.close()}
