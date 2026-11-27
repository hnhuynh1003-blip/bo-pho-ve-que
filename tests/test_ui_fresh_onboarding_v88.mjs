import assert from 'node:assert/strict';
import {chromium,webkit} from 'playwright';
import {mkdirSync,writeFileSync} from 'node:fs';
const engine=process.env.BPVQ_QA_ENGINE||'chromium',out=process.env.BPVQ_QA_OUTPUT||'artifacts/fresh-onboarding';
mkdirSync(out,{recursive:true});
const browser=await (engine==='webkit'?webkit:chromium).launch({headless:true});
const reports=[],failures=[];
try{
 for(const width of [390,1366])for(const career of ['noodle','streetfood','boba']){
  const page=await browser.newPage({viewport:{width,height:844}}),report={career,width,errors:[],network:[]};
  reports.push(report);
  const shot=name=>page.screenshot({path:out+'/'+career+'-'+width+'-'+name+'.png',fullPage:true});
  page.on('pageerror',e=>report.errors.push(String(e)));
  page.on('response',r=>{if(r.status()>=400)report.network.push({url:r.url(),status:r.status()})});
  page.on('requestfailed',r=>report.network.push({url:r.url(),error:r.failure()?.errorText}));
  try{
   await page.goto('http://127.0.0.1:8765/',{waitUntil:'load'});
   await page.locator('#account-new-name').fill('UI TEST '+career);
   await page.locator('button[onclick="createLocalAccount()"]').click();
   await page.locator('#intro-card-'+career).click();
   await page.locator('#intro-shop-name').fill('Quán TEST '+career);
   await page.locator('button[onclick="confirmStartGameFromIntro()"]').click();
   // Complete actual story via its visible Next buttons, no skip or synthetic profile.
   for(let i=0;i<12;i++){
    if(await page.locator('.v8771-next').isVisible())await page.locator('.v8771-next').click();
    else if(await page.locator('#v8771-welcome').isVisible())break;
    else await page.waitForTimeout(250);
   }
   await page.locator('#v8771-welcome button[onclick*="explore"]').click({timeout:10000});
   await page.locator('#nav-btn-shop').click();
   await page.waitForTimeout(800);
   const measure=()=>page.evaluate(()=>{
    const box=id=>{const e=document.getElementById(id);if(!e)return null;const r=e.getBoundingClientRect(),c=getComputedStyle(e);return {w:r.width,h:r.height,display:c.display,visible:r.width>0&&r.height>0,hidden:e.hidden}};
    const s=window.BPVQCookingBridge.snapshot(),scene=document.getElementById('v88-live-scene'),im=document.getElementById('v88-live-image');
    return {career:s.career,started:s.started,phase:s.phase,stage:gameState.shopStage,view:scene.dataset.view,unavailable:scene.dataset.unavailable,scene:box('v88-live-scene'),yard:box('v88-live-supported'),image:{...box('v88-live-image'),src:im.getAttribute('src'),loaded:im.complete&&im.naturalWidth>0},station:box('cs20-station'),workshop:box('cp177-workshop'),overflow:document.documentElement.scrollWidth-innerWidth};
   });
   report.yard=await measure();await shot('yard');
   assert.equal(report.yard.career,career);assert.equal(report.yard.started,true);assert.equal(report.yard.stage,0);
   assert.equal(report.yard.yard.visible,true,'yard visible');
   assert.equal(report.yard.image.visible,true,'scene image visible');
   assert.equal(report.yard.image.loaded,true,'scene image decoded');
   assert.match(report.yard.image.src,new RegExp(career==='boba'?'boba-b1-':career+'-b1-reused'));
   await page.locator('#us21-enter-kitchen').click();await page.waitForTimeout(400);
   report.kitchen=await measure();await shot('kitchen');
   assert.equal(report.kitchen.view,'kitchen');
   assert.equal(report.kitchen.yard.visible,false);
   // Record idle kitchen visibility, do not fake an order to make it visible.
   assert.deepEqual(report.errors,[]);
  }catch(e){report.failure=String(e);failures.push({career,width,error:String(e)});await shot('failure').catch(()=>{});}
  console.log('FRESH UI',JSON.stringify(report));await page.close();
 }
}finally{await browser.close();writeFileSync(out+'/geometry.json',JSON.stringify({reports,failures},null,2));}
assert.deepEqual(failures,[]);
