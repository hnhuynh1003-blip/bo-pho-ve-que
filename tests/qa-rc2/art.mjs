import assert from 'node:assert/strict';
import {mkdirSync,writeFileSync} from 'node:fs';
import {chromium,webkit} from 'playwright';
const engine=process.env.QA_ENGINE,origin='http://127.0.0.1:8765',out='qa-evidence/art';
const P='ve_que_khoi_nghiep_',T='bpvq_playtest_',id='topping_cheese_foam',file='topping_cheese_foam-B-tray.webp';
mkdirSync(out,{recursive:true});
const browser=await (engine==='webkit'?webkit:chromium).launch({headless:true});
const reports=[];
try{
 for(const variant of ['production','playtest'])for(const width of [320,360,375,390,430,599,600,800,801,1366]){
  const context=await browser.newContext({viewport:{width,height:width===1366?768:844},hasTouch:width<700,serviceWorkers:'block'});
  await context.route('**/*',r=>new URL(r.request().url()).origin===origin?r.continue():r.abort());
  const page=await context.newPage(),errors=[],report={variant,width,errors,checks:[]};reports.push(report);
  page.on('pageerror',e=>errors.push(String(e)));
  const check=async(name,fn)=>{try{await fn();report.checks.push({name,status:'PASS'})}catch(e){report.checks.push({name,status:'FAIL',error:String(e.stack||e)})}};
  const click=async l=>width<700?l.tap():l.click();
  try{
   await page.goto(origin+'/neutral.html');
   const sentinel={[P+'qa_rc1_sentinel']:'synthetic-only',[P+'profile_qa_prod_save_v13']:'{"coins":99999}'};
   if(variant==='playtest')await page.evaluate(s=>{for(const [k,v]of Object.entries(s))localStorage.setItem(k,v)},sentinel);
   await page.goto(origin+'/'+variant+'/',{waitUntil:'load'});
   if(variant==='playtest')await page.waitForFunction(()=>bpvqCanWriteProfile()&&!!bpvqGameLoopTimer);
   await page.evaluate(()=>{
    document.getElementById('account-new-name').value='QA Milk Foam';createLocalAccount();
    document.getElementById('intro-shop-name').value='QA';selectedIntroCareerChoice='boba';confirmStartGameFromIntro();
    window.v8771SkipStory?.();window.v8771ChooseHelp?.('off');
    for(const i of ['screen-account','screen-intro'])document.getElementById(i).classList.add('hidden');
    gameState.hasStarted=true;gameState.currentCareer='boba';gameState.phase='open';gameState.shiftClosed=false;
    gameState.level=20;gameState.shopStage=3;gameState.coins=500;
    for(const ids of Object.values(CAREER_WORKBENCH_KEYS.boba))if(Array.isArray(ids))for(const k of ids)gameState.inventory[k]=50;
    cleanWorkbenchDish();
    const order={career:'boba',container:'cup_m',base:'tea_black',sugar:70,ice:50,toppings:['topping_cheese_foam'],toppingPortions:{topping_cheese_foam:1},requiresShaken:true,maxPrice:120};
    currentCustomer={name:'QA Milk Foam',avatar:'',budget:120,strict:'moderate',patience:180,maxPatience:180,order,quote:formatCustomerOrder(order)};
    renderCustomerBooth();updateHeaderStats();window.BPVQUnifiedShop.update();
   });
   await page.locator('#us21-enter-kitchen').click();
   await page.waitForFunction(()=>document.getElementById('v88-live-scene').dataset.view==='kitchen');
   const money=()=>page.evaluate(()=>JSON.stringify([gameState.coins,gameState.inventory,gameState.exp,gameState.reviews]));
   const before=await money();
   await check('size UI + no debit',async()=>{
     const size=page.locator('#cs27-containers button:enabled').first();
     await click(size);assert.equal(await size.getAttribute('aria-pressed'),'true');assert.equal(await money(),before);
   });
   let selected=false;
   await check('Milk Foam shelf, hit and native portion',async()=>{
     await page.locator('#cs20-groups').getByRole('button',{name:'Topping & siro',exact:true}).click();
     const button=page.locator('#cs20-shelf [data-item="'+id+'"]');
     assert.equal(await button.count(),1);await button.scrollIntoViewIfNeeded();
     await button.locator('img').waitFor({state:'visible'});
     const geom=await button.evaluate(el=>{
       const rect=e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height}};
       const image=el.querySelector('img'),slot=el.querySelector('.cs26-jar-image'),label=el.querySelector('.cs20-item-name'),rail=document.getElementById('cs20-shelf');
       const hit=rect(el);const top=document.elementFromPoint(hit.x+hit.w/2,hit.y+hit.h/2);
       return {hit,slot:rect(slot),image:rect(image),label:rect(label),labelOverflow:label.scrollHeight-label.clientHeight,src:image.getAttribute('src'),rail:rect(rail),centerReceivesHit:el.contains(top)};
     });
     report.foam=geom;assert.ok(geom.hit.w>=44&&geom.hit.h>=44);assert.ok(geom.centerReceivesHit);assert.ok(geom.src.endsWith(file));assert.ok(geom.labelOverflow<=1);
     const decoded=await button.locator('img').evaluate(async im=>{await im.decode();return [im.naturalWidth,im.naturalHeight]});
     assert.deepEqual(decoded,[160,96]);
     await page.screenshot({path:out+'/'+variant+'-'+width+'-shelf.png'});
     const count=()=>page.evaluate(id=>window.BPVQCookingBridge.snapshot().dish.toppingPortions[id]||0,id);
     const old=await count();await click(button);assert.equal(await count(),old+1);
     assert.equal(await button.getAttribute('aria-pressed'),'true');
     assert.equal(await money(),before);
     selected=true;
   });
   const chip=page.locator('.cp177-used-item').filter({has:page.locator('img[src$="'+file+'"]')});
   if(selected){
     await check('B-01 mapping and independent chip decode',async()=>{
       await chip.waitFor({state:'attached'});assert.equal(await chip.count(),1);
       assert.ok((await chip.locator('img').getAttribute('src')).endsWith(file));
       assert.deepEqual(await chip.locator('img').evaluate(async im=>{await im.decode();return [im.naturalWidth,im.naturalHeight]}),[160,96]);
     });
     await check('B-01 owner mobile/desktop visibility at effective breakpoint',async()=>{
       const holder=page.locator('.cp177-active-items');
       const actual=await holder.evaluate(el=>({display:getComputedStyle(el).display,rects:el.getClientRects().length,under599:matchMedia('(max-width:599px)').matches,under800:matchMedia('(max-width:800px)').matches}));
       report.chipVisibility={...actual,visible:await chip.isVisible()};
       // Owner approved mobile hidden / desktop visible. Effective inherited premium rule is <=800.
       // Separately report discrepancy at the explicitly stated 599 boundary; do not silently waive it.
       assert.equal(actual.under599,width<=599);assert.equal(actual.under800,width<=800);
       assert.equal(report.chipVisibility.visible,width>800);
       if(width<=800){assert.equal(actual.display,'none');assert.equal(actual.rects,0);}
       else await chip.waitFor({state:'visible'});
     });
     await check('B-01 stated 599/600 boundary',async()=>{
       assert.equal(await chip.isVisible(),width>599,'owner handoff stated <=599; inherited premium CSS may also hide through 800');
     });
     await check('B-01 native cup feedback and non-overlap',async()=>{
       const dots=page.locator('#cs20-visual [data-cp177-topping-layer] [data-ingredient="'+id+'"]');
       await dots.first().waitFor({state:'visible'});assert.ok(await dots.count()>=1);
       const cup=page.locator('#cs20-visual');
       const geom=await cup.evaluate(el=>{
         const r=el.getBoundingClientRect(),h=document.querySelector('.cp177-active-items'),s=document.querySelector('#cs20-shelf'),hr=h.getBoundingClientRect(),sr=s.getBoundingClientRect();
         const rect=x=>({x:x.x,y:x.y,w:x.width,h:x.height});
         return {cup:rect(r),chip:rect(hr),shelf:rect(sr),chipDisplay:getComputedStyle(h).display,cupShelfOverlap:Math.max(0,Math.min(r.right,sr.right)-Math.max(r.left,sr.left))*Math.max(0,Math.min(r.bottom,sr.bottom)-Math.max(r.top,sr.top))};
       });
       report.cupFeedback={...geom,foamShapes:await dots.count()};
       assert.ok(geom.cup.w>0&&geom.cup.h>0);assert.ok(geom.cupShelfOverlap<=1);
       if(width<=800)assert.equal(geom.chip.w*geom.chip.h,0,'hidden auxiliary list cannot cover cup');
       await page.screenshot({path:out+'/'+variant+'-'+width+'-chip.png',fullPage:true});
     });
   }else for(const name of ['B-01 mapping and independent chip decode','B-01 owner mobile/desktop visibility at effective breakpoint','B-01 stated 599/600 boundary','B-01 native cup feedback and non-overlap'])report.checks.push({name,status:'BLOCKED',error:'shelf selection prerequisite failed'});
   await check('visible dispenser pour stop topup',async()=>{
     const d=page.locator('#cp177-pour-object');
     assert.equal(await d.count(),1);assert.equal(await page.locator('#cs20-primary').isVisible(),false);
     await click(d);await page.waitForFunction(()=>window.BPVQCookingStation.status().stage==='pour');
     await page.waitForFunction(()=>window.BPVQCookingStation.status().pour>5);
     await click(d);await page.waitForFunction(()=>window.BPVQCookingStation.status().stage==='mix');
     const first=await page.evaluate(()=>window.BPVQCookingStation.status().pour);
     assert.ok(first<100,'stop before fill for top-up');
     assert.equal(await page.locator('#cs20-top-up').isVisible(),false);
     await click(d);await page.waitForFunction(()=>window.BPVQCookingStation.status().stage==='pour');
     await page.waitForFunction(v=>window.BPVQCookingStation.status().pour>v,first);
     await click(d);await page.waitForFunction(()=>window.BPVQCookingStation.status().stage==='mix');
     assert.ok(await page.evaluate(v=>window.BPVQCookingStation.status().pour>v,first));
     assert.equal(await money(),before);
     await page.screenshot({path:out+'/'+variant+'-'+width+'-topup.png'});
   });
   await check('namespace sentinel and page errors',async()=>{
     if(variant==='playtest'){
       const production=await page.evaluate(P=>Object.fromEntries(Object.keys(localStorage).filter(k=>k.startsWith(P)).map(k=>[k,localStorage.getItem(k)])),P);
       assert.deepEqual(production,sentinel);
       assert.ok(await page.evaluate(T=>Object.keys(localStorage).some(k=>k.startsWith(T)),T));
     }else assert.equal(await page.evaluate(T=>Object.keys(localStorage).some(k=>k.startsWith(T)),T),false);
     assert.deepEqual(errors,[]);
   });
  }catch(e){report.checks.push({name:'setup',status:'FAIL',error:String(e.stack||e)});}
  await page.screenshot({path:out+'/'+variant+'-'+width+'-final.png'}).catch(()=>{});
  await context.close();console.log('ART',JSON.stringify(report));
 }
}finally{await browser.close();writeFileSync(out+'/results.json',JSON.stringify({engine,target:process.env.TARGET_SHA,harness:process.env.GITHUB_SHA,reports},null,2))}
if(reports.some(r=>r.checks.some(c=>c.status!=='PASS')))process.exitCode=1;
