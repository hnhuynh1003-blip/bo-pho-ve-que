// Browser integration: three professions, real profile saves and interactive Paint UI.
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const professions=['boba','noodle','streetfood'];
try {
 for(const career of professions){
  const page=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:1});
  await page.route('https://cdnjs.cloudflare.com/**',r=>r.abort('blockedbyclient'));
  const errors=[];
  page.on('pageerror',err=>errors.push(err.message));
  try{
   await page.goto('http://127.0.0.1:8765/',{waitUntil:'domcontentloaded',timeout:45000});
   await page.waitForFunction(()=>!!window.BPVQShopPaintV88&&!!window.BPVQReborn);
   const outcome=await page.evaluate(career=>{
    const check=(ok,why)=>{if(!ok)throw Error(why)};
    const shop='Quán Sơn '+career;
    document.getElementById('account-new-name').value='Test Paint '+career;
    document.getElementById('account-new-shop-name').value=shop;
    createLocalAccount();
    document.getElementById('intro-shop-name').value=shop;
    selectIntroCareer(career);
    confirmStartGameFromIntro();
    check(gameState.hasStarted&&gameState.currentCareer===career,'wrong live profile');
    const key=getProfileStorageKey(activeProfileId);
    const api=window.BPVQShopPaintV88;
    const before=JSON.stringify({coins:gameState.coins,sp:gameState.sp,decorations:gameState.decorations,shopStage:gameState.shopStage,shopConstruction:gameState.shopConstruction,bonus:getGrowthBonuses()});
    check(!gameState.shopAppearanceV88,'legacy-style save should not have paint setting');
    window.openSmartPhoneModal();
    window.VillageOS.open('construction');
    window.BPVQReborn.constructionTab('paint');
    const root=document.getElementById('v8775-construction-content');
    check(root?.textContent.includes('Sơn Màu Quán'),'missing paint tab');
    check(root?.querySelectorAll('.v88-paint-preset').length===8,'8 presets missing');
    check(root?.querySelectorAll('.v88-paint-region').length===6,'6 surface areas missing');
    check(!gameState.shopAppearanceV88,'viewing Paint must not mutate old save');
    const preset=api.choosePreset('milk_cream');
    check(preset.ok,'basic paint preset failed to apply');
    const recolor=api.chooseRegion('sign','walnut');
    check(recolor.ok,'painting shop sign failed');
    check(api.preview().colors.sign==='walnut','shop sign color did not update');
    check(root?.querySelector('.v88-paint-scene')?.style.getPropertyValue('--paint-sign')==='#5F4031','paint preview color not refreshed');
    check(gameState.shopAppearanceV88?.presetId==='milk_cream','paint preset missing from gameState');
    check(gameState.shopAppearanceV88?.overrides.sign==='walnut','custom paint color not stored');
    check(!('decorV88' in gameState),'paint must not create a decor layout');
    check(JSON.stringify({coins:gameState.coins,sp:gameState.sp,decorations:gameState.decorations,shopStage:gameState.shopStage,shopConstruction:gameState.shopConstruction,bonus:getGrowthBonuses()})===before,'paint changed economy, bonus, decor or building');
    const saved=JSON.parse(localStorage.getItem(key)||'null');
    check(saved?.shopAppearanceV88?.overrides?.sign==='walnut','paint color did not persist to storage');
    window.closeSmartPhoneModal();
    return {career,key,shop,coins:gameState.coins};
   },career);
   await page.reload({waitUntil:'domcontentloaded'});
   const restored=await page.evaluate(key=>{
     const data=JSON.parse(localStorage.getItem(key)||'null');
     if(!data)throw Error('Profile save missing after page reload');
     return {paint:data.shopAppearanceV88,coins:data.coins,career:data.currentCareer,decor:data.decorV88};
   },outcome.key);
   assert.equal(restored.paint?.presetId,'milk_cream');
   assert.equal(restored.paint?.overrides?.sign,'walnut');
   assert.equal(restored.coins,outcome.coins);
   assert.equal(restored.career,career);
   assert.equal(restored.decor,undefined);
   assert.deepEqual(errors,[],`JS page errors in profession ${career}`);
   console.log('BROWSER PAINT PASS',career,JSON.stringify({preset:restored.paint.presetId,color:restored.paint.overrides.sign,coins:restored.coins}));
  }finally{await page.close()}
 }
}finally{await browser.close()}
console.log('PAINT: all 3 live career profiles saved custom color and reloaded PASS');
