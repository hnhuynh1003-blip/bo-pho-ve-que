import assert from 'node:assert/strict';
import {mkdirSync,writeFileSync} from 'node:fs';
import {chromium,webkit} from 'playwright';

const engine=process.env.QA_ENGINE;
assert.ok(['chromium','webkit'].includes(engine));
const origin='http://127.0.0.1:8765';
const out='qa-evidence';
mkdirSync(out,{recursive:true});
const browser=await (engine==='chromium'?chromium:webkit).launch(engine==='chromium'?{headless:true,ignoreDefaultArgs:['--disable-back-forward-cache']}:{headless:true});
const P='ve_que_khoi_nghiep_',T='bpvq_playtest_',R=T+'accounts_v1',A=T+'active_profile_v1',L=T+'import_pending_v1';
const key=(prefix,id)=>prefix+'profile_'+id+'_save_v13';
const results=[];
const sentinel={
 [P+'accounts_v1']:JSON.stringify([{id:'qa_prod',name:'QA sentinel',summary:{hasStarted:false}}]),
 [P+'active_profile_v1']:'qa_prod',
 [key(P,'qa_prod')]:JSON.stringify({coins:987654,inventory:{tea_black:17},qaSynthetic:true}),
 [P+'progression_v1']:JSON.stringify({qaSynthetic:true}),
 [P+'legacy_imported_v1']:'1',
};
const snapshot=page=>page.evaluate(()=>Object.fromEntries(Object.keys(localStorage).sort().map(k=>[k,localStorage.getItem(k)])));
const prod=s=>Object.fromEntries(Object.entries(s).filter(([k])=>k.startsWith(P)));
const assertProd=async p=>assert.deepEqual(prod(await snapshot(p)),sentinel);
const records=async p=>JSON.parse((await snapshot(p))[R]||'[]');
const state=page=>page.evaluate(()=>({id:activeProfileId,coins:gameState.coins,day:gameState.day,level:gameState.level,career:gameState.currentCareer,tea:gameState.inventory.tea_black,sp:gameState.sp,decorations:gameState.decorations,stage:gameState.shopStage}));
const url=(variant,file='index.html')=>origin+'/'+variant+'/'+file;
async function context(){
 const c=await browser.newContext({viewport:{width:390,height:844},serviceWorkers:'block'});
 await c.route('**/*',r=>new URL(r.request().url()).origin===origin?r.continue():r.abort());
 await c.addInitScript(()=>{
   window.addEventListener('pageshow',e=>{
     try{sessionStorage.setItem('qa-pageshow',JSON.stringify([...JSON.parse(sessionStorage.getItem('qa-pageshow')||'[]'),e.persisted]));}catch{}
   });
 });
 return c;
}
async function page(c,target){
 const p=await c.newPage();
 p.on('dialog',d=>d.accept());
 await p.goto(target,{waitUntil:'load'});
 return p;
}
async function neutral(c,seed=true){
 const p=await page(c,origin+'/neutral.html');
 if(seed)await p.evaluate(v=>{for(const [k,s] of Object.entries(v))localStorage.setItem(k,s)},sentinel);
 return p;
}
async function owner(p){
 await p.waitForFunction(()=>typeof bpvqCanWriteProfile==='function'&&bpvqCanWriteProfile()&&!!bpvqGameLoopTimer,null,{timeout:12000});
}
async function deniedGame(p){
 await p.waitForFunction(()=>typeof bpvqCanWriteProfile==='function'&&bpvqWriterRetired&&!bpvqCanWriteProfile(),null,{timeout:10000});
 assert.match(await p.locator('#bpvq-writer-notice').textContent(),/quyền ghi|phục hồi/);
 assert.equal(await p.evaluate(()=>saveGameToStorage(false)),false);
}
async function importer(c){return page(c,url('playtest','chuyen-save.html'))}
async function prepare(p,save,name){
 await p.locator('#saveCode').fill(Buffer.from(JSON.stringify(save),'utf8').toString('base64'));
 await p.locator('#inspectBtn').click();
 assert.equal(await p.locator('#importBtn').isEnabled(),true);
 await p.locator('#newName').fill(name);
}
async function submit(p){await p.locator('#importBtn').click()}
async function waitStatus(p,re){await p.waitForFunction(pattern=>new RegExp(pattern).test(document.getElementById('status').textContent),re.source,{timeout:10000})}
async function success(p){await waitStatus(p,/Đã tạo hồ sơ/)}
async function busy(p){await waitStatus(p,/Một tab khác/)}
async function hold(p,name=L){
 await p.evaluate(name=>{
  window.qaHold=navigator.locks.request(name,{mode:'exclusive'},()=>new Promise(resolve=>{window.qaRelease=resolve}));
 },name);
 await p.waitForFunction(()=>typeof window.qaRelease==='function');
}
async function release(p){
 await p.evaluate(async()=>{window.qaRelease();await window.qaHold;delete window.qaRelease});
}
async function held(p){return p.evaluate(async name=>(await navigator.locks.query()).held.some(l=>l.name===name),L)}
async function released(p){await p.waitForFunction(async name=>!(await navigator.locks.query()).held.some(l=>l.name===name),L)}
const sample={currentCareer:'boba',level:3,day:2,coins:3456,sp:7,inventory:{tea_black:37,topping_boba:8},playerName:'QA synthetic',shopName:'QA synthetic',hasStarted:true,shopStage:0,decorations:['welcome_sign','flower_corner']};
async function create(p,name='QA game'){
 await p.evaluate(name=>{
  document.getElementById('account-new-name').value=name;
  createLocalAccount();
  document.getElementById('intro-shop-name').value='QA shop';
  selectIntroCareer('boba');confirmStartGameFromIntro();
  window.v8771SkipStory?.();window.v8771ChooseHelp?.('off');
 },name);
 assert.equal(await p.evaluate(()=>gameState.hasStarted),true);
}
class Blocked extends Error{}
async function run(name,fn,kind='native'){
 const c=await context();
 const errors=[];
 c.on('page',p=>p.on('pageerror',e=>errors.push(String(e))));
 await c.tracing.start({screenshots:true,snapshots:true});
 let status='PASS',detail='';
 try{const d=await fn(c);detail=d||'';if(errors.length)throw Error('page errors: '+errors.join('; '))}
 catch(e){status=e instanceof Blocked?'BLOCKED':'FAIL';detail=String(e.stack||e)}
 finally{
  for(const [i,p] of c.pages().entries())try{await p.screenshot({path:out+'/'+name+'-'+i+'.png',timeout:3000})}catch{}
  await c.tracing.stop({path:out+'/'+name+'.zip'}).catch(()=>{});
  await c.close();
 }
 results.push({name,kind,status,detail,errors});
 console.log(status,kind,name,detail);
}
try{
 await run('native-lock-support',async c=>{
   const p=await neutral(c);
   const support=await p.evaluate(()=>({secure:isSecureContext,locks:typeof navigator.locks?.request,query:typeof navigator.locks?.query}));
   assert.equal(support.secure,true);
   assert.equal(support.locks,'function');
   assert.equal(support.query,'function');
   await hold(p);assert.equal(await held(p),true);await release(p);await released(p);
   await assertProd(p);
   return JSON.stringify(support);
 });
 await run('importer-importer',async c=>{
   const n=await neutral(c);
   const a=await importer(c);
   await hold(a);
   const before=await snapshot(n);
   const b=await importer(c);await busy(b);
   await prepare(b,sample,'QA B');await submit(b);await busy(b);
   assert.deepEqual(await snapshot(n),before);
   await release(a);
   await prepare(a,sample,'QA A');await submit(a);await success(a);
   await submit(b);await success(b);
   const list=await records(n);
   assert.equal(list.length,2);
   assert.deepEqual(list.map(x=>x.name).sort(),['QA A','QA B']);
   for(const x of list)assert.deepEqual(JSON.parse((await snapshot(n))[key(T,x.id)]),sample);
   const dup=await importer(c);await prepare(dup,sample,'qa a');await submit(dup);await waitStatus(dup,/Tên hồ sơ đã tồn tại/);
   assert.deepEqual(await records(n),list);
   assert.equal((await snapshot(n))[L],undefined);await assertProd(n);
 },'native lock + controlled hold');
 await run('importer-competing-submissions',async c=>{
   const n=await neutral(c),a=await importer(c),b=await importer(c);
   await prepare(a,sample,'QA concurrent A');await prepare(b,sample,'QA concurrent B');
   await Promise.all([submit(a),submit(b)]);
   for(const p of [a,b]){
     await waitStatus(p,/Đã tạo hồ sơ|Một tab khác/);
     if(/Một tab khác/.test(await p.locator('#status').textContent())){
       await released(n);await submit(p);await success(p);
     }
   }
   const list=await records(n);assert.equal(list.length,2);
   assert.deepEqual(list.map(x=>x.name).sort(),['QA concurrent A','QA concurrent B']);
   for(const x of list)assert.deepEqual(JSON.parse((await snapshot(n))[key(T,x.id)]),sample);
   assert.equal((await snapshot(n))[L],undefined);await assertProd(n);
   const x=await importer(c),y=await importer(c);
   await prepare(x,sample,'QA same');await prepare(y,sample,'qa same');
   await Promise.all([submit(x),submit(y)]);
   for(const p of [x,y]){
     await waitStatus(p,/Đã tạo hồ sơ|Một tab khác|Tên hồ sơ đã tồn tại/);
     if(/Một tab khác/.test(await p.locator('#status').textContent())){
       await released(n);await submit(p);await waitStatus(p,/Tên hồ sơ đã tồn tại/);
     }
   }
   assert.equal((await records(n)).filter(r=>r.name.toLowerCase()==='qa same').length,1);
   await assertProd(n);
 });
 await run('game-importer-game',async c=>{
   const n=await neutral(c);
   const g=await page(c,url('playtest'));await owner(g);
   assert.equal(await held(n),true);
   const before=await snapshot(n);
   const imp=await importer(c);await busy(imp);await prepare(imp,sample,'QA imported');await submit(imp);await busy(imp);
   const other=await page(c,url('playtest'));await deniedGame(other);
   assert.deepEqual(await snapshot(n),before);
   await g.close();await released(n);
   await hold(imp);
   await other.reload({waitUntil:'load'});await deniedGame(other);
   assert.deepEqual(await snapshot(n),before);
   await release(imp);await submit(imp);await success(imp);
   const id=(await records(n))[0].id;
   await other.reload({waitUntil:'load'});await owner(other);
   await other.evaluate(id=>continueLocalAccount(id),id);
   const actual=await state(other);
   assert.equal(actual.id,id);assert.equal(actual.coins,sample.coins);assert.equal(actual.tea,37);assert.equal(actual.career,'boba');
   await assertProd(n);
 },'native lock + controlled hold');
 await run('actual-autosave-pagehide-reload',async c=>{
   const n=await neutral(c),g=await page(c,url('playtest'));await owner(g);await create(g);
   const id=(await state(g)).id;
   await g.evaluate(()=>{gameState.coins=23456;});
   await g.waitForFunction(({key})=>JSON.parse(localStorage.getItem(key)||'{}').coins===23456,{key:key(T,id)},{timeout:22000});
   const b=await page(c,url('playtest'));await deniedGame(b);
   assert.equal(await held(n),true);
   await g.goto(origin+'/neutral.html',{waitUntil:'load'});await released(n);
   await b.reload({waitUntil:'load'});await owner(b);await b.evaluate(id=>continueLocalAccount(id),id);
   assert.equal((await state(b)).coins,23456);
   await assertProd(n);
 });
 await run('native-hidden-retains-lock',async c=>{
   const n=await neutral(c),g=await page(c,url('playtest'));await owner(g);
   await n.bringToFront();
   const visibility=await g.evaluate(()=>document.visibilityState);
   if(visibility!=='hidden')throw new Blocked('Headless engine did not produce actual hidden state');
   assert.equal(await held(n),true);
   const b=await page(c,url('playtest'));await deniedGame(b);
   await assertProd(n);
 });
 await run('native-bfcache',async c=>{
   const n=await neutral(c),g=await page(c,url('playtest'));await owner(g);
   await g.goto(origin+'/neutral.html',{waitUntil:'load'});await released(n);
   try{await g.goBack({waitUntil:'domcontentloaded'});}catch(e){if(!g.url().includes('/playtest/'))throw e;}
   await g.waitForLoadState('load');
   await g.waitForFunction(()=>typeof bpvqCanWriteProfile==='function',null,{timeout:10000});
   const persisted=await g.evaluate(()=>JSON.parse(sessionStorage.getItem('qa-pageshow')||'[]').includes(true));
   if(!persisted)throw new Blocked('No actual pageshow.persisted=true observed');
   await owner(g);assert.equal(await held(n),true);
   await assertProd(n);
 });
 await run('stale-callback',async c=>{
   const n=await neutral(c),g=await page(c,url('playtest'));await owner(g);await create(g);
   await g.evaluate(()=>window.dispatchEvent(new PageTransitionEvent('pagehide',{persisted:true})));
   await released(n);
   const before=await snapshot(n);
   const actual=await g.evaluate(()=>{gameState.coins=88888;return {allowed:bpvqCanWriteProfile(),save:saveGameToStorage(false),loop:masterGameLoop(),timer:bpvqAutosaveTimer}});
   assert.equal(actual.allowed,false);assert.equal(actual.save,false);assert.equal(actual.timer,null);
   assert.deepEqual(await snapshot(n),before);
   await assertProd(n);
 },'instrumented browser: synthetic pagehide/direct calls');
 await run('compound-fault-recovery',async c=>{
   const n=await neutral(c),a=await importer(c);
   await prepare(a,sample,'QA recover');
   await a.evaluate(({R,A})=>{
     const set=Storage.prototype.setItem;let fault=false;
     Storage.prototype.setItem=function(k,v){
       if(k===A){fault=true;throw new DOMException('QA active fault','QuotaExceededError')}
       if(fault&&k===R)throw new DOMException('QA restore fault','QuotaExceededError');
       return set.call(this,k,v);
     };
     const remove=Storage.prototype.removeItem;
     Storage.prototype.removeItem=function(k){if(fault&&k===R)throw new DOMException('QA restore fault','QuotaExceededError');return remove.call(this,k)};
   },{R,A});
   await submit(a);await waitStatus(a,/Chưa phục hồi/);
   const s=await snapshot(n),list=JSON.parse(s[R]);assert.equal(list.length,1);assert.ok(s[L]);assert.ok(s[key(T,list[0].id)]);
   const g=await page(c,url('playtest'));await deniedGame(g);
   await a.reload({waitUntil:'load'});await waitStatus(a,/Đã phục hồi hồ sơ/);
   assert.equal((await snapshot(n))[L],undefined);
   await prepare(a,sample,'QA recover');await submit(a);await waitStatus(a,/Tên hồ sơ đã tồn tại/);
   assert.deepEqual(await records(n),list);
   await g.reload({waitUntil:'load'});await owner(g);await g.evaluate(id=>continueLocalAccount(id),list[0].id);
   assert.equal((await state(g)).coins,sample.coins);await assertProd(n);
 },'instrumented browser: native Storage fault injection');
 for(const version of ['v87','v88'])await run('import-'+version,async c=>{
   const n=await neutral(c);
   const g=await page(c,url('playtest'));await owner(g);
   const save=await g.evaluate(s=>({...JSON.parse(JSON.stringify(DEFAULT_GAME_STATE)),...s,inventory:{...DEFAULT_GAME_STATE.inventory,...s.inventory}}),sample);
   if(version==='v87')delete save.decorV88;
   else save.decorV88={placements:{S5:'welcome_sign'}};
   await g.close();await released(n);
   const imp=await importer(c);await prepare(imp,save,'QA '+version);await submit(imp);await success(imp);
   const id=(await records(n))[0].id;
   assert.deepEqual(JSON.parse((await snapshot(n))[key(T,id)]),save);
   const loaded=await page(c,url('playtest'));await owner(loaded);await loaded.evaluate(id=>continueLocalAccount(id),id);
   const actual=await state(loaded);assert.equal(actual.id,id);assert.equal(actual.coins,3456);assert.equal(actual.sp,7);assert.equal(actual.tea,37);assert.equal(actual.level,3);assert.deepEqual(actual.decorations,save.decorations);
   assert.equal(await loaded.evaluate(()=>saveGameToStorage(false)),true);
   await loaded.reload({waitUntil:'load'});await owner(loaded);await loaded.evaluate(id=>continueLocalAccount(id),id);
   assert.equal((await state(loaded)).coins,3456);await assertProd(n);
 },'native browser with synthetic save');
 await run('production-baseline-equivalence',async c=>{
   const runVariant=async variant=>{
     const isolated=await context();
     try{
       const p=await page(isolated,url(variant));
       await p.waitForFunction(()=>typeof createLocalAccount==='function'&&document.readyState==='complete');
       await create(p,'QA compare');
       await p.evaluate(()=>{gameState.coins=4501;gameState.inventory.tea_black=21;saveGameToStorage(false)});
       const id=(await state(p)).id;
       await p.reload({waitUntil:'load'});await p.evaluate(id=>continueLocalAccount(id),id);
       const s=await state(p);delete s.id;
       assert.equal(s.coins,4501);assert.equal(s.tea,21);
       assert.equal(await p.evaluate(async()=>!(await navigator.locks.query()).held.some(l=>l.name.endsWith('import_pending_v1'))),true);
       assert.equal(Object.keys(await snapshot(p)).some(k=>k.startsWith(T)),false);
       return s;
     }finally{await isolated.close()}
   };
   assert.deepEqual(await runVariant('production'),await runVariant('baseline'));
 },'native browser with deterministic state assertions');
}finally{
 writeFileSync(out+'/native-results.json',JSON.stringify({target:process.env.TARGET_SHA,harness:process.env.GITHUB_SHA,engine,browser:browser.version(),viewport:{width:390,height:844},results},null,2));
 await browser.close();
}
if(results.some(r=>r.status!=='PASS'))process.exitCode=1;
