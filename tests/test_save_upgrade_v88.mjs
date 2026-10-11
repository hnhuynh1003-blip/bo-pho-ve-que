// v88 regression: real v87-style save loading and original shop-construction contracts.
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const page=await browser.newPage({viewport:{width:390,height:844}});
page.on('pageerror',e=>console.error('GAME PAGE ERROR',e.message));
await page.route('https://cdnjs.cloudflare.com/**',r=>r.abort('blockedbyclient'));
try {
 await page.goto('http://127.0.0.1:8765/',{waitUntil:'domcontentloaded',timeout:45000});
 await page.waitForFunction(()=>!!window.BPVQDecorV88&&!!window.VillageOS);
 const result=await page.evaluate(()=>{
  const check=(condition,msg)=>{if(!condition)throw new Error(msg)};
  document.getElementById('account-new-name').value='Save QA';
  document.getElementById('account-new-shop-name').value='Quán Save QA';
  createLocalAccount();
  document.getElementById('intro-shop-name').value='Quán Save QA';
  selectIntroCareer('boba');
  confirmStartGameFromIntro();
  check(!!gameState.hasStarted,'test profile must be started');
  const key=getProfileStorageKey(activeProfileId);
  // Save format v87.8.0.1: own legacy decorations, no decorV88 layout yet.
  const old=JSON.parse(localStorage.getItem(key));
  old.coins=12345;old.sp=7;old.level=3;old.shopStage=0;
  old.decorations=['welcome_sign','flower_corner'];
  old.inventory.tea_black=37;
  old.shopConstruction={targetStage:1,startedDay:1,finishDay:2,cost:700};
  delete old.decorV88;
  localStorage.setItem(key,JSON.stringify(old));
  const ok=loadGameFromStorage(activeProfileId);
  check(ok===true,'v87-style save did not load');
  check(gameState.coins===12345&&gameState.sp===7&&gameState.level===3,'money/SP/level changed on migration');
  check(gameState.inventory.tea_black===37,'old ingredient quantity changed');
  check(gameState.shopStage===0&&gameState.shopConstruction?.targetStage===1,'construction modified on migration');
  check(gameState.decorations.length===2,'legacy decoration ownership changed');
  const before={coins:gameState.coins,sp:gameState.sp,stage:gameState.shopStage,ingredients:gameState.inventory.tea_black,decorations:JSON.stringify(gameState.decorations),contract:JSON.stringify(gameState.shopConstruction)};
  const snapshot=window.BPVQDecorV88.snapshot();
  check(snapshot.stored.length===2&&Object.keys(snapshot.active).length===0,'old owned decor must start in storage, not auto-place');
  window.VillageOS.open('construction');
  window.BPVQReborn.constructionTab('inventory');
  window.BPVQReborn.constructionTab('layout');
  check(gameState.coins===before.coins&&gameState.sp===before.sp&&gameState.shopStage===before.stage,'viewing Xây Quán changed economic progress');
  check(gameState.inventory.tea_black===before.ingredients,'viewing the warehouse changed ingredients');
  check(JSON.stringify(gameState.decorations)===before.decorations,'viewing the warehouse changed owned decorations');
  check(JSON.stringify(gameState.shopConstruction)===before.contract,'viewing Xây Quán changed the active contractor');
  check(!gameState.decorV88,'no automatic v88 state should be added on read');
  // Side effects are permitted only after deliberate player placement.
  check(window.BPVQDecorV88.place('welcome_sign','S5').ok,'cannot place owned legacy decor');
  check(gameState.decorV88?.placements?.S5==='welcome_sign','placement not persisted');
  check(gameState.decorations.length===2,'legacy ownership disappeared');
  check(gameState.coins===12345,'slot placement consumed Xu');
  check(gameState.shopConstruction?.finishDay===2,'slot placement modified existing contract');
  // Contract on the precise day: no completion before finish day, +1 SP once.
  check(v8775FinishConstructionIfReady()===false,'construction completed too early');
  check(gameState.shopStage===0&&gameState.sp===7,'premature completion modified stage/SP');
  gameState.day=2;
  check(v8775FinishConstructionIfReady()===true,'construction did not finish on due day');
  check(gameState.shopStage===1,'shop tier did not advance exactly once');
  check(gameState.sp===8,'contract completion should grant exactly +1 SP');
  check(gameState.shopConstruction===null,'finished contract not cleared');
  check(v8775FinishConstructionIfReady()===false,'completed contract ran twice');
  check(gameState.sp===8,'SP duplicated by double completion');
  // Force stage-translation into the existing Xây Quán app.
  window.BPVQReborn.constructionTab('layout');
  check(window.BPVQDecorV88.snapshot().active.S5==='welcome_sign','decor lost across stage upgrade');
  check(window.BPVQDecorV88.snapshot().stored.includes('flower_corner'),'stored decor was auto-gifted or placed');
  saveGameToStorage(false);
  return {key,coin:gameState.coins,sp:gameState.sp,day:gameState.day,stage:gameState.shopStage,owned:gameState.decorations.slice(),inventory:gameState.inventory.tea_black};
 });
 await page.reload({waitUntil:'domcontentloaded'});
 const save=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)||'null'),result.key);
 assert.ok(save);
 assert.equal(save.coins,result.coin);
 assert.equal(save.sp,8);
 assert.equal(save.day,2);
 assert.equal(save.shopStage,1);
 assert.equal(save.shopConstruction,null);
 assert.equal(save.inventory.tea_black,37);
 assert.deepEqual(save.decorations,['welcome_sign','flower_corner']);
 assert.equal(save.decorV88?.placements?.S5,'welcome_sign');
 console.log('LEGACY SAVE & REAL CONSTRUCTION PASS',JSON.stringify({stage:save.shopStage+1,sp:save.sp,coins:save.coins,owned:save.decorations.length}));
} finally {await page.close();await browser.close()}
