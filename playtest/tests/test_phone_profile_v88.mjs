// Full game smoke: create real local profiles for each career, purchase legacy decor,
// place it using v88, and confirm game money / ownership / saves remain correct.
import assert from 'node:assert/strict';
import {chromium} from 'playwright';

const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const careers=['boba','noodle','streetfood'];
try{
  for(const career of careers){
    const page=await browser.newPage({viewport:{width:390,height:844}});
    const jsErrors=[];
    page.on('pageerror',e=>jsErrors.push(e.message||String(e)));
    await page.route('https://cdnjs.cloudflare.com/**',route=>route.abort('blockedbyclient'));
    try{
      await page.goto('http://127.0.0.1:8765/',{waitUntil:'domcontentloaded',timeout:45000});
      await page.waitForFunction(()=>!!window.BPVQDecorV88&&!!window.VillageOS);
      const result=await page.evaluate((career)=>{
        const check=(ok,msg)=>{if(!ok)throw new Error(msg)};
        const user='Test '+career,shop='Quán '+career;
        document.getElementById('account-new-name').value=user;
        document.getElementById('account-new-shop-name').value=shop;
        createLocalAccount();
        check(!!activeProfileId,'account not created');
        check(gameState.shopName===shop,'shop name not saved to game state');
        selectIntroCareer(career);
        // v87.7.1 onboarding deliberately clears this input after creating a profile.
        document.getElementById('intro-shop-name').value=shop;
        confirmStartGameFromIntro();
        check(gameState.currentCareer===career,'incorrect selected career');
        check(gameState.hasStarted===true,'game not started');
        const moneyBefore=gameState.coins;
        check(!gameState.decorations.includes('welcome_sign'),'starter profile received free legacy decor');
        const bonusBefore=getGrowthBonuses().patienceSec;
        buyShopDecor('welcome_sign');
        check(gameState.decorations.includes('welcome_sign'),'legacy shop purchase failed');
        const moneyAfter=gameState.coins;
        check(moneyAfter===moneyBefore-180,'purchase did not debit exact 180 Xu');
        const bonusAfter=getGrowthBonuses().patienceSec;
        check(bonusAfter===bonusBefore+2,'original decoration bonus changed');
        const api=window.BPVQDecorV88;
        check(api.place('welcome_sign','S5').ok===true,'cannot place purchased decoration');
        check(api.snapshot().active.S5==='welcome_sign','placement not effective');
        check(gameState.coins===moneyAfter,'decor placement charged Xu');
        check(getGrowthBonuses().patienceSec===bonusAfter,'placement doubled the bonus');
        window.VillageOS.open('construction');
        window.BPVQReborn.constructionTab('layout');
        check(document.getElementById('v8775-construction-content').textContent.includes(shop),'S1 no longer reflects real shop name');
        check(api.store('S5').ok===true,'store decor failed');
        check(api.snapshot().stored.includes('welcome_sign'),'stored decor disappeared');
        check(getGrowthBonuses().patienceSec===bonusAfter,'storing decor disabled existing ownership buff');
        check(api.place('welcome_sign','S5').ok===true,'re-place decor failed');
        const saveKey=getProfileStorageKey(activeProfileId);
        const saved=JSON.parse(localStorage.getItem(saveKey)||'null');
        check(!!saved,'save missing');
        check(saved.currentCareer===career,'career missing from save');
        check(saved.coins===moneyAfter,'Xu changed unexpectedly in save');
        check(saved.decorations.filter(x=>x==='welcome_sign').length===1,'decor duplicated in save');
        check(saved.decorV88?.placements?.S5==='welcome_sign','slot not saved');
        check(saved.shopConstruction===null,'decor changed construction project');
        check(saved.inventory && Object.keys(saved.inventory).length>0,'original material inventory cleared');
        return {career,saveKey,moneyBefore,moneyAfter,bonusBefore,bonusAfter,shop};
      },career);
      await page.reload({waitUntil:'domcontentloaded'});
      const restored=await page.evaluate(saveKey=>{
        const data=JSON.parse(localStorage.getItem(saveKey)||'null');
        if(!data)throw Error('missing save on reload');
        return {career:data.currentCareer,owned:data.decorations.includes('welcome_sign'),slot:data.decorV88?.placements?.S5,shop:data.shopName,coins:data.coins};
      },result.saveKey);
      assert.equal(restored.career,career);
      assert.equal(restored.owned,true);
      assert.equal(restored.slot,'welcome_sign');
      assert.equal(restored.coins,result.moneyAfter);
      assert.equal(restored.shop,result.shop);
      assert.deepEqual(jsErrors,[],`Uncaught JS errors for ${career}`);
      console.log('PROFILE PASS',JSON.stringify({career,coins:restored.coins,shop:restored.shop,decor:restored.slot,bonus:result.bonusAfter}));
    }finally{await page.close()}
  }
}finally{await browser.close()}
console.log('All three careers, live purchases and per-profile save reload: PASS');
