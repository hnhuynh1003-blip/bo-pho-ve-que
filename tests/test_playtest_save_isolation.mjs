// QA-001: actual importer script, synthetic save and in-memory Storage only.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { rewritePlaytestSave } from '../scripts/isolate-playtest-save.mjs';

const read = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');
const sourceGame = read('js/game.js');
const sourceImporter = read('chuyen-save.html');
const output = rewritePlaytestSave(sourceGame, sourceImporter);
const P = 've_que_khoi_nghiep_';
const T = 'bpvq_playtest_';
const registry = prefix => prefix + 'accounts_v1';
const active = prefix => prefix + 'active_profile_v1';
const profile = (prefix, id) => prefix + 'profile_' + id + '_save_v13';

assert.ok(sourceGame.includes(P + 'accounts_v1'));
assert.ok(sourceImporter.includes(P + 'accounts_v1'));
assert.equal(output.game, sourceGame.replaceAll(P, T));
assert.equal(output.importer, sourceImporter.replaceAll(P, T));
assert.ok(!output.game.includes(P) && !output.importer.includes(P));
assert.throws(() => rewritePlaytestSave(sourceGame, sourceImporter.replaceAll(P, T)), /Unexpected source/);
assert.throws(() => rewritePlaytestSave(sourceGame, sourceImporter.replace(P + 'accounts_v1', 'wrong')), /Unexpected source/);

// Read the actual game key declarations, not hard-coded mock game accessors.
const gameRegistry = output.game.match(/const ACCOUNT_REGISTRY_KEY = '([^']+)'/)[1];
const gameActive = output.game.match(/const ACTIVE_PROFILE_KEY = '([^']+)'/)[1];
const gameProfile = new Function('profileId', output.game.match(/function getProfileStorageKey\(profileId\)\s*\{([\s\S]*?)\n\s*\}/)[1]);
assert.equal(gameRegistry, registry(T));
assert.equal(gameActive, active(T));
assert.equal(gameProfile('existing'), profile(T, 'existing'));

const script = output.importer.match(/<script>([\s\S]*?)<\/script>/)[1];
const baseSave = {
  currentCareer: 'boba', level: 7, day: 3, coins: 425,
  inventory: { tea_black: 12, topping_boba: 8 },
  playerName: 'Synthetic QA', shopName: 'QA', hasStarted: true,
};
const fixtures = [
  { ...baseSave },
  { ...baseSave, currentCareer: 'noodle', decorV88: { placements: {} }, counterCraft: null },
];
const production = [
  [registry(P), JSON.stringify([{ id: 'prod', name: 'Synthetic QA' }])],
  [active(P), 'prod'],
  [profile(P, 'prod'), JSON.stringify({ ...baseSave, coins: 9999 })],
  [P + 'progression_v1', '{"legacy":true}'],
  [P + 'legacy_imported_v1', '1'],
];
const existing = [
  [registry(T), JSON.stringify([{ id: 'existing', name: 'Existing QA' }])],
  [active(T), 'existing'],
  [profile(T, 'existing'), JSON.stringify({ ...baseSave, coins: 100 })],
];

// Deterministic shared-storage / Web Locks fixture, not native browser.
async function harness({ populated = true, fail = null, confirmImport = true, importerScript = script,
    secure = true, lockSupport = true, lockDenied = false } = {}) {
  const data = new Map([...production, ...(populated ? existing : [])]);
  const before = [...data];
  const operations = [], lockRequests = [];
  const held = new Set();
  let failed = false, fault = () => false, afterWrite = () => {};
  const lockManager = {
    async request(name, options, callback){
      lockRequests.push(name);
      assert.deepEqual(options,{mode:'exclusive',ifAvailable:true});
      if(lockDenied)throw new Error('Synthetic Web Locks denial');
      if(held.has(name))return callback(null);
      held.add(name);
      try{return await callback({name,mode:'exclusive'});}
      finally{held.delete(name);}
    }
  };
  const checkFault = (op,key,value) => { if(fault(op,key,value))throw new Error('Synthetic persistent/compound fault'); };
  const localStorage = {
    getItem(key) { operations.push(['get', key]); checkFault('get',key); return data.get(key) ?? null; },
    setItem(key, value) {
      operations.push(['set', key]);
      checkFault('set',key,value);
      if (!failed && fail && fail(key)) { failed = true; throw new Error('Synthetic QuotaExceededError'); }
      data.set(key, String(value));
      afterWrite(key,value);
    },
    removeItem(key) { operations.push(['remove', key]); checkFault('remove',key); data.delete(key); },
  };
  function openTab({source=importerScript,contextSecure=secure,hasLocks=lockSupport}={}){
    const nodes = Object.fromEntries(['saveCode','preview','importBtn','newName','status','inspectBtn'].map(id =>
      [id, { value: '', textContent: '', style: {}, disabled: false, listeners: {},
        addEventListener(type, listener) { this.listeners[type] = listener; } }]));
    const reload = () => {
      for(const n of Object.values(nodes)){n.value='';n.textContent='';n.disabled=false;n.listeners={};}
      return new Function('document','localStorage','confirm','atob','TextDecoder','window','navigator',
        'return '+source.trim())(
        {getElementById:id=>nodes[id]},localStorage,()=>confirmImport,atob,TextDecoder,
        {isSecureContext:contextSecure},hasLocks?{locks:lockManager}:{});
    };
    const ready=reload();
    const inspect = save => {
      nodes.saveCode.value = typeof save === 'string' ? save : btoa(JSON.stringify(save));
      nodes.saveCode.listeners.input();
      nodes.inspectBtn.listeners.click();
    };
    const submit = name => { if (name !== undefined) nodes.newName.value = name; return nodes.importBtn.listeners.click(); };
    return {nodes,ready,reload,inspect,submit};
  }
  const first=openTab();
  await first.ready;
  const isolated = () => {
    assert.deepEqual([...data].filter(([key]) => key.startsWith(P)), production);
    assert.ok(operations.every(([, key]) => key.startsWith(T)), 'all importer storage access must be playtest-only');
    assert.ok(lockRequests.every(name=>name===T+'import_pending_v1'), 'playtest lock must be namespaced');
  };
  return {...first,data,before,isolated,operations,openTab,held,lockRequests,localStorage,lockManager,
    setFault:fn=>{fault=fn;},setAfterWrite:fn=>{afterWrite=fn;},didFail:()=>failed};
}

function assertSuccess(h, save, populated) {
  h.isolated();
  const id = h.data.get(gameActive);
  assert.ok(id.startsWith('p_import_'));
  assert.deepEqual(JSON.parse(h.data.get(gameProfile(id))), save, 'preserve entire save payload');
  const accounts = JSON.parse(h.data.get(gameRegistry));
  assert.equal(accounts.length, populated ? 2 : 1);
  assert.equal(accounts.at(-1).id, id);
  assert.equal(accounts.at(-1).summary.coins, undefined, 'do not change existing registry schema');
  assert.equal(accounts.at(-1).summary.career, save.currentCareer);
  assert.ok(h.nodes.importBtn.disabled);
  assert.ok(!h.data.has(T+'import_pending_v1'));
  if (populated) assert.equal(h.data.get(profile(T, 'existing')), existing[2][1]);
}

for (const save of fixtures) {
  const h = await harness();
  const beforeInspect=h.operations.length;
  h.inspect(save);
  assert.equal(h.operations.length, beforeInspect, 'inspection is read-only');
  await h.submit();
  assertSuccess(h, save, true);
  console.log('PASS synthetic ' + (save.decorV88 ? 'v88' : 'v87') + ' import, game keys, existing profiles, isolation');
}

for (const populated of [true, false]) {
  for (const target of ['save', 'registry', 'active']) {
    const h = await harness({ populated, fail: key => target === 'save' ? key.startsWith(T + 'profile_') :
      key === (target === 'registry' ? registry(T) : active(T)) });
    h.inspect(fixtures[1]);
    await h.submit();
    assert.ok(h.didFail(), 'must actually inject a failure');
    assert.deepEqual([...h.data], h.before, 'rollback restores exact pre-import state: ' + target);
    assert.match(h.nodes.status.textContent, /Synthetic QuotaExceededError/);
    h.isolated();
    await h.submit(); // transient failure cleared: retry should succeed exactly once.
    assertSuccess(h, fixtures[1], populated);
    console.log('PASS rollback and retry: ' + target + ', ' + (populated ? 'existing' : 'empty') + ' playtest');
  }
}

for (const kind of ['invalid', 'duplicate', 'cancel']) {
  const h = await harness({ confirmImport: kind !== 'cancel' });
  h.inspect(kind === 'invalid' ? 'invalid!' : fixtures[0]);
  await h.submit(kind === 'duplicate' ? 'Existing QA' : undefined);
  assert.deepEqual([...h.data], h.before);
  assert.ok(h.operations.every(([op]) => op === 'get'), 'rejected import cannot write');
  h.isolated();
  console.log('PASS rejected import: ' + kind);
}

// QA-001-R: persistent recovery intent, independent of game account/save schema.
const pending=T+'import_pending_v1';
function assertRegistered(h){
  h.isolated();
  const accounts=JSON.parse(h.data.get(gameRegistry));
  assert.equal(accounts.length,2);
  const id=accounts[1].id;
  assert.deepEqual(JSON.parse(h.data.get(gameProfile(id))),fixtures[1]);
  assert.equal(h.data.get(profile(T,'existing')),existing[2][1]);
  assert.equal(h.data.get(gameActive),'existing');
  return id;
}
for(const persistent of [false,true]){
  const h=await harness();
  h.inspect(fixtures[1]);
  let activeFailed=false,registryFailed=false;
  h.setFault((op,key)=>{
    if(op==='set'&&key===gameActive&&!activeFailed){activeFailed=true;return true;}
    if(activeFailed&&op==='set'&&key===gameRegistry&&!registryFailed){registryFailed=true;return true;}
    return persistent&&activeFailed&&op!=='get';
  });
  await h.submit();
  assert.ok(activeFailed&&registryFailed);
  assert.match(h.nodes.status.textContent,/Chưa phục hồi/);
  assert.ok(h.data.has(pending));
  const id=assertRegistered(h);
  if(persistent){
    await h.reload();
    assert.match(h.nodes.status.textContent,/Chưa phục hồi/);
    assert.equal(assertRegistered(h),id);
  }
  h.setFault(()=>false);
  await h.reload();
  assert.match(h.nodes.status.textContent,/Đã phục hồi/);
  assert.equal(assertRegistered(h),id);
  assert.ok(!h.data.has(pending));
  const recovered=[...h.data];
  h.inspect(fixtures[1]);await h.submit();
  assert.match(h.nodes.status.textContent,/Tên hồ sơ đã tồn tại/);
  assert.deepEqual([...h.data],recovered);
  h.isolated();
  console.log('PASS QA-001-R '+(persistent?'persistent':'compound')+' active + registry fault; reload recovery, no duplicate');
}
for(const populated of [true,false]){
  const h=await harness({populated});
  h.inspect(fixtures[1]);
  let failed=false;
  h.setFault((op,key)=>{
    if(op==='set'&&key===gameRegistry){failed=true;return true;}
    return failed&&op==='remove';
  });
  await h.submit();
  assert.ok(failed&&h.data.has(pending));
  assert.match(h.nodes.status.textContent,/Chưa phục hồi/);
  h.isolated();
  h.setFault(()=>false);await h.reload();
  assert.match(h.nodes.status.textContent,/Đã dọn/);
  assert.deepEqual([...h.data],h.before);
  h.inspect(fixtures[1]);await h.submit();
  assertSuccess(h,fixtures[1],populated);
  console.log('PASS QA-001-R orphan cleanup after reload + retry: '+(populated?'existing':'empty'));
}
{
  const h=await harness();
  h.inspect(fixtures[1]);
  h.setFault((op,key)=>op==='set'&&key===pending);
  await h.submit();
  assert.deepEqual([...h.data],h.before);
  assert.match(h.nodes.status.textContent,/Synthetic persistent/);
  h.isolated();
  h.setFault(()=>false);await h.submit();assertSuccess(h,fixtures[1],true);
  console.log('PASS QA-001-R journal write denied; no partial writes, retry');
}
{
  const h=await harness();
  h.inspect(fixtures[1]);
  h.setFault((op,key)=>op==='remove'&&key===pending);
  await h.submit();
  assert.match(h.nodes.status.textContent,/Chưa phục hồi/);
  const id=h.data.get(gameActive);
  assert.ok(h.data.has(gameProfile(id))&&h.data.has(pending));
  h.data.set(gameActive,'existing'); // user switched to old account before reload
  h.setFault(()=>false);await h.reload();
  assert.match(h.nodes.status.textContent,/Đã phục hồi/);
  assert.equal(assertRegistered(h),id);
  assert.ok(!h.data.has(pending));
  console.log('PASS QA-001-R journal cleanup denied; keep completed profile and current selection');
}
{
  const h=await harness();
  h.inspect(fixtures[1]);
  let blocked=false;
  h.setFault((op,key)=>{
    if(op==='set'&&key===gameActive){blocked=true;return true;}
    return blocked&&op==='get';
  });
  await h.submit();
  assert.match(h.nodes.status.textContent,/Chưa phục hồi/);
  assert.ok(h.data.has(pending));
  h.setFault(()=>false);await h.reload();
  assert.match(h.nodes.status.textContent,/Đã phục hồi/);
  assertRegistered(h);
  console.log('PASS QA-001-R storage read denied during rollback; reload preserves registered payload');
}

// QA-001-MT: A pauses after journal write, B opens during the live transaction.
{
  const h=await harness();h.inspect(fixtures[0]);
  let b, competing, evidence;
  h.setAfterWrite(key=>{
    if(key!==pending||b)return;
    const intent=h.data.get(pending),before=[...h.data],opCount=h.operations.length;
    b=h.openTab();
    const startup=b.nodes.status.textContent;
    b.inspect(fixtures[1]);competing=b.submit('Tab B');
    evidence={startup,submit:b.nodes.status.textContent,opCount,afterCount:h.operations.length,
      intent,afterIntent:h.data.get(pending),before,after:[...h.data]};
  });
  await h.submit('Tab A');assert.ok(b&&evidence);
  await b.ready;await competing;
  assert.match(evidence.startup,/Một tab khác/);assert.match(evidence.submit,/Một tab khác/);
  assert.equal(evidence.afterCount,evidence.opCount,'busy requests must not touch storage');
  assert.equal(evidence.afterIntent,evidence.intent,'live intent must survive');
  assert.deepEqual(evidence.after,evidence.before);
  assert.match(h.nodes.status.textContent,/Đã tạo hồ sơ/);assert.equal(h.held.size,0);
  h.setAfterWrite(()=>{});
  await b.reload();b.inspect(fixtures[1]);await b.submit('Tab B');
  const accounts=JSON.parse(h.data.get(gameRegistry));
  assert.deepEqual(accounts.map(a=>a.name),['Existing QA','Tab A','Tab B']);
  assert.deepEqual(JSON.parse(h.data.get(gameProfile(accounts[1].id))),fixtures[0]);
  assert.deepEqual(JSON.parse(h.data.get(gameProfile(accounts[2].id))),fixtures[1]);
  assert.equal(h.data.get(gameActive),accounts[2].id);
  assert.equal(h.data.get(profile(T,'existing')),existing[2][1]);
  assert.ok(!h.data.has(pending));assert.equal(h.held.size,0);h.isolated();
  console.log('PASS QA-001-MT A live journal, B startup/submit denied, B retry preserves both profiles');
}
{
  const h=await harness(),b=h.openTab();await b.ready;
  h.inspect(fixtures[0]);b.inspect(fixtures[1]);await h.submit('Same name');
  const before=[...h.data];await b.submit('same NAME');
  assert.match(b.nodes.status.textContent,/Tên hồ sơ đã tồn tại/);
  assert.deepEqual([...h.data],before);assert.equal(h.held.size,0);h.isolated();
  console.log('PASS QA-001-MT second tab re-reads registry under lock and rejects duplicate name');
}
{
  const h=await harness();h.inspect(fixtures[0]);
  h.setFault((op,key)=>op==='set'&&key===gameActive);
  await h.submit('Fault A');
  assert.match(h.nodes.status.textContent,/Synthetic persistent/);
  assert.deepEqual([...h.data],h.before);assert.equal(h.held.size,0);
  h.setFault(()=>false);
  const b=h.openTab();await b.ready;b.inspect(fixtures[1]);await b.submit('Retry B');
  assert.match(b.nodes.status.textContent,/Đã tạo hồ sơ/);
  assert.equal(JSON.parse(h.data.get(gameRegistry)).length,2);
  assert.equal(h.held.size,0);h.isolated();
  console.log('PASS QA-001-MT storage error releases lock for other tab');
}
for(const options of [{secure:false},{lockSupport:false},{lockDenied:true}]){
  const h=await harness(options);assert.match(h.nodes.status.textContent,/Không thể/);
  h.inspect(fixtures[0]);await h.submit('Blocked');
  assert.match(h.nodes.status.textContent,/Không thể/);
  assert.deepEqual([...h.data],h.before);
  assert.equal(h.operations.length,0,'fail closed before touching storage');
  assert.equal(h.held.size,0);h.isolated();
  console.log('PASS QA-001-MT fail closed '+Object.keys(options)[0]);
}
{
  const h=await harness();h.inspect(fixtures[1]);h.setFault((op,key)=>op==='remove'&&key===pending);
  await h.submit('Recover A');assert.ok(h.data.has(pending));assert.equal(h.held.size,0);
  const b=h.openTab();await b.ready;
  assert.match(b.nodes.status.textContent,/Chưa phục hồi/);
  assert.ok(h.data.has(pending));assert.equal(h.held.size,0);
  h.setFault(()=>false);await b.reload();assert.match(b.nodes.status.textContent,/Đã phục hồi/);
  assert.ok(!h.data.has(pending));assert.equal(h.held.size,0);
  b.inspect(fixtures[1]);await b.submit('Recover A');
  assert.match(b.nodes.status.textContent,/Tên hồ sơ đã tồn tại/);
  assert.equal(JSON.parse(h.data.get(gameRegistry)).length,2);h.isolated();
  console.log('PASS QA-001-MT failed journal cleanup releases lock; second tab recovers safely');
}


// QA-001-GW: actual lifecycle and account writer functions from the generated
// game.js, mocked DOM/timers/Storage/Web Locks. Not full native browser.
function openGame(h,{source=output.game,secure=true,hasLocks=true,locks=h.lockManager}={}){
  const elements=new Map(),listeners=new Map(),timers=new Map(),callbacks=[],toasts=[];
  let nextTimer=0,reloads=0,renders=0;
  function element(id=''){
    return {id,value:'',style:{},classList:{add(){},remove(){},contains(){return false;}},
      setAttribute(){},remove(){elements.delete(this.id);}};
  }
  const document={
    getElementById(id){
      if(id==='bpvq-writer-notice')return elements.get(id)||null;
      if(!elements.has(id))elements.set(id,element(id));
      return elements.get(id);
    },
    createElement(){return element();},
    body:{appendChild(node){elements.set(node.id,node);}}
  };
  const window={isSecureContext:secure,location:{reload(){reloads++;}},
    addEventListener(type,fn){if(!listeners.has(type))listeners.set(type,[]);listeners.get(type).push(fn);}};
  const fire=(type,event={})=>{for(const fn of listeners.get(type)||[])fn(event);};
  const fn=name=>{
    const a=source.indexOf('    function '+name+'(');
    assert.ok(a>=0,name);
    const b=source.indexOf('\n    }',a);
    assert.ok(b>a,name+' body');
    return source.slice(a,b+6);
  };
  const names=['readAccountRegistry','writeAccountRegistry','bpvqRegistryFailure','bpvqSelectProfile','getAccountById',
    'updateAccountSummary','saveAccountShopEdit','createLocalAccount','startFreshRunForActiveProfile','newGameForLocalAccount',
    'continueLocalAccount','enterLoadedGame','openAccountScreen','deleteLocalAccount','importLegacySaveAsAccount',
    'saveGameToStorage','loadGameFromStorage','bpvqAdminTestActive','bpvqAdminInfo','bpvqAdminCreateSandbox',
    'bpvqAdminEnterSandbox','bpvqAdminLeaveSandbox','bpvqAdminResetSandbox','bpvqAdminApply','confirmStartGameFromIntro',
    'masterGameLoop','bpvqStartGamePage'];
  const header=source.slice(0,source.indexOf('    const FARM_PLOTS_CONFIG ='));
  const startup=source.match(/    window\.onload=function\(\)\{[\s\S]*?\n    \};/)[0];
  const helpers=`
    let gameState=JSON.parse(JSON.stringify(baseSave)),counterSettlementDepth=0,selectedIntroCareerChoice='boba';
    let pendingAccountShopAvatar='bunny',pendingAccountPlayerChibi='male',editingAccountShopId='existing';
    let pendingAccountEditAvatar='bunny',pendingAccountEditPlayerChibi='male',currentCustomer=null;
    const SHOP_ICON_CHOICES=[],VILLAGE_ZONES={},DEFAULT_GAME_STATE={...baseSave,hasStarted:false,inventory:{}};
    const noop=()=>{},normalizedShopAvatar=x=>x||'bunny',normalizedPlayerChibi=x=>x||'male';
    const getCurrentShopAvatar=()=>gameState.shopAvatar||'bunny',getCurrentPlayerChibi=()=>gameState.playerChibi||'male';
    const getCareerDefaultShopIcon=()=>null,getActiveWorldEventConfig=()=>true,v87521MigrateCompletedAwards=()=>0;
    const resetRuntimeForProfile=noop,ensureGrowthState=noop,ensureV6State=noop,updatePlayerChibiPickers=noop;
    const updateHeaderStats=noop,selectIntroCareer=noop,playSound=noop,showToast=(msg)=>toasts.push(msg);
    const renderAccountScreen=()=>{rendered();},closeAccountShopEdit=noop,renderVillageChibi=noop,renderVillagePoints=noop;
    const renderVillageNpcs=noop,ensureVillageNpcMotion=noop,d3RestoreRuntime=noop,generateDailyFlashDeal=noop;
    const generateSoppiFlashSale=noop,rollDailyWorldEvent=noop,announceDailyMarketNews=noop,applyCareerLockToUI=noop;
    const updateShopPhaseUI=noop,renderCustomerBooth=noop,scheduleNextCustomer=noop,renderDailyWorldEventBanner=noop;
    const renderNotificationBadge=noop,renderGameCollectionSummary=noop,renderFarmEventPanel=noop,renderBarnEventPanel=noop;
    const renderVillageUI=noop,v88MenuEnsure=noop,d3EnsureLedger=noop,v8753Ensure=noop,v8753MaybeBadge=noop;
    const refreshShopStageQuickBadge=noop,renderFarmUI=noop,renderBarnUI=noop,renderWorkbenchControls=noop;
    const renderShopReviews=noop,renderGrowthApp=noop,renderSoppiApp=noop,renderBankApp=noop,refreshShopFloorSummary=noop;
    function resetGameStateToDefault(){gameState=JSON.parse(JSON.stringify(DEFAULT_GAME_STATE));}
  `;
  const exposed=`
    return {canWrite:bpvqCanWriteProfile,start:()=>window.onload(),mode:BPVQ_PLAYTEST_WRITER,
      create:createLocalAccount,edit:saveAccountShopEdit,summary:updateAccountSummary,write:writeAccountRegistry,
      save:saveGameToStorage,load:loadGameFromStorage,select:bpvqSelectProfile,fresh:startFreshRunForActiveProfile,
      newGame:newGameForLocalAccount,continue:continueLocalAccount,enter:enterLoadedGame,account:openAccountScreen,
      remove:deleteLocalAccount,legacy:importLegacySaveAsAccount,adminCreate:bpvqAdminCreateSandbox,
      adminEnter:bpvqAdminEnterSandbox,adminLeave:bpvqAdminLeaveSandbox,adminReset:bpvqAdminResetSandbox,
      adminApply:bpvqAdminApply,confirmStart:confirmStartGameFromIntro,tick:masterGameLoop,
      setCurrent(id,state){activeProfileId=id;sessionGameActive=true;gameState=JSON.parse(JSON.stringify(state));},
      active:()=>activeProfileId,session:()=>sessionGameActive,state:()=>gameState};
  `;
  const api=new Function('document','window','navigator','localStorage','setInterval','clearInterval','confirm','console','baseSave','toasts','rendered',
    header+'\n'+helpers+'\n'+names.map(fn).join('\n')+'\n'+startup+'\n'+exposed)(
      document,window,hasLocks?{locks}:{},h.localStorage,
      cb=>{const id=++nextTimer;timers.set(id,cb);callbacks.push(cb);return id;},
      id=>timers.delete(id),()=>true,console,baseSave,toasts,()=>{renders++;});
  return {...api,fire,timers,callbacks,toasts,reloads:()=>reloads,renders:()=>renders,
    notice:()=>document.getElementById('bpvq-writer-notice')?.textContent||'',
    input:(id,value)=>{document.getElementById(id).value=value;}};
}
function assertBlockedGame(g){
  assert.equal(g.canWrite(),false);
  for(const [name,args] of [
    ['create',[]],['edit',[]],['summary',[]],['write',[[]]],['save',[false]],['load',['existing']],
    ['select',['existing']],['fresh',[]],['newGame',['existing']],['continue',['existing']],['enter',[]],
    ['account',[]],['remove',['existing']],['legacy',[]],['adminEnter',['existing']],['adminLeave',[]],
    ['adminReset',[]],['confirmStart',[]],['tick',[]]
  ])assert.equal(g[name](...args),false,name+' must fail before mutation');
  assert.equal(g.adminCreate().ok,false);assert.equal(g.adminApply('coins',1).ok,false);
}
function assertGameIsolation(h){
  assert.deepEqual([...h.data].filter(([key])=>key.startsWith(P)),production);
  assert.ok(h.operations.every(([,key])=>key.startsWith(T)||/^bpvq:admin:seed:test_/.test(key)));
  assert.ok(h.lockRequests.every(name=>name===pending));
}
{
  const h=await harness(),g=openGame(h);
  const before=[...h.data],ops=h.operations.length;
  assertBlockedGame(g);assert.deepEqual([...h.data],before);assert.equal(h.operations.length,ops);
  assert.equal(g.timers.size,0);
  const running=g.start();assert.equal(g.canWrite(),true);assert.equal(g.timers.size,2);
  const b=h.openTab();await b.ready;assert.match(b.nodes.status.textContent,/Một tab khác/);
  const busyOps=h.operations.length;b.inspect(fixtures[1]);await b.submit('Import B');
  assert.match(b.nodes.status.textContent,/Một tab khác/);assert.equal(h.operations.length,busyOps);
  g.input('account-new-name','Game A');g.input('account-new-shop-name','QA shop');g.create();
  const a=g.active();assert.ok(a.startsWith('p_'));assert.ok(h.data.has(gameProfile(a)));
  const payload=h.data.get(gameProfile(a));
  g.fire('pagehide');await running;assert.equal(g.canWrite(),false);
  await b.reload();b.inspect(fixtures[1]);await b.submit('Import B');
  const accounts=JSON.parse(h.data.get(gameRegistry));
  assert.deepEqual(accounts.map(x=>x.name),['Existing QA','Game A','Import B']);
  assert.equal(h.data.get(gameProfile(a)),payload);assert.equal(h.data.get(profile(T,'existing')),existing[2][1]);
  assert.deepEqual(JSON.parse(h.data.get(gameProfile(accounts[2].id))),fixtures[1]);assertGameIsolation(h);
  console.log('PASS QA-001-GW game owner blocks importer startup/submit; release and retry preserve both');
}
{
  const h=await harness();let g,attempt,evidence;
  h.inspect(fixtures[0]);
  h.setAfterWrite(key=>{
    if(key!==pending||g)return;
    g=openGame(h);const before=[...h.data],ops=h.operations.length;attempt=g.start();
    evidence={before,ops,after:[...h.data],afterOps:h.operations.length,notice:g.notice()};
  });
  await h.submit('Import A');assert.ok(g&&evidence);await attempt;
  assertBlockedGame(g);assert.equal(g.timers.size,0);
  assert.match(evidence.notice,/Một tab/);assert.deepEqual(evidence.after,evidence.before);assert.equal(evidence.ops,evidence.afterOps);
  assert.match(h.nodes.status.textContent,/Đã tạo hồ sơ/);
  const id=h.data.get(gameActive),b=openGame(h),running=b.start();assert.equal(b.canWrite(),true);
  b.continue(id);assert.equal(b.active(),id);assert.equal(b.state().coins,fixtures[0].coins);
  b.fire('pagehide');await running;assertGameIsolation(h);
  console.log('PASS QA-001-GW importer live journal denies all game writers; later game loads imported profile');
}
{
  const h=await harness(),a=openGame(h),running=a.start(),b=openGame(h);
  await b.start();assertBlockedGame(b);assert.equal(b.timers.size,0);
  a.fire('blur');a.fire('visibilitychange');assert.equal(a.canWrite(),true);
  a.fire('pagehide');assert.equal(a.canWrite(),false);assert.equal(a.timers.size,0);await running;
  a.fire('pageshow',{persisted:true});assert.equal(a.reloads(),1);
  const before=[...h.data],ops=h.operations.length;assertBlockedGame(a);
  for(const cb of a.callbacks)cb();
  assert.deepEqual([...h.data],before);assert.equal(h.operations.length,ops);
  const c=openGame(h),r=c.start();assert.equal(c.canWrite(),true);c.fire('pagehide');await r;
  assertGameIsolation(h);console.log('PASS QA-001-GW game/game contention, hidden keeps lock, pagehide/BFCache and stale timers');
}
{
  const h=await harness(),g=openGame(h);h.data.set(pending,'synthetic unresolved intent');
  const before=[...h.data];await g.start();
  assertBlockedGame(g);assert.match(g.notice(),/chưa phục hồi/);assert.equal(g.timers.size,0);
  assert.deepEqual([...h.data],before);assert.equal(h.held.size,0);assertGameIsolation(h);
  console.log('PASS QA-001-GW pending importer journal refuses game startup without deletion');
}
for(const kind of ['insecure','unsupported','denied']){
  const h=await harness(),g=openGame(h,{secure:kind!=='insecure',hasLocks:kind!=='unsupported',
    locks:kind==='denied'?{request:async()=>{throw Error('Synthetic Web Locks denial');}}:h.lockManager});
  const before=[...h.data],ops=h.operations.length;await g.start();assertBlockedGame(g);
  assert.equal(g.timers.size,0);assert.deepEqual([...h.data],before);assert.equal(h.operations.length,ops);
  assert.ok(g.notice());assertGameIsolation(h);console.log('PASS QA-001-GW fail closed '+kind);
}
{
  const h=await harness(),g=openGame(h);h.setFault((op,key)=>op==='get'&&key===gameRegistry);
  const before=[...h.data];await g.start();assertBlockedGame(g);
  assert.equal(g.timers.size,0);assert.equal(h.held.size,0);assert.deepEqual([...h.data],before);
  h.setFault(()=>false);const a=openGame(h),r=a.start();
  a.setCurrent('existing',fixtures[1]);a.input('account-new-name','Must not create');
  h.setFault((op,key)=>op==='get'&&key===gameRegistry);
  assert.equal(a.create(),false);assert.equal(a.save(false),false);assert.equal(a.summary(),false);
  assert.deepEqual([...h.data],before);
  h.setFault(()=>false);a.fire('pagehide');await r;assertGameIsolation(h);
  console.log('PASS QA-001-GW startup/read failures fail closed; registry and payload preserved');
}
{
  const h=await harness(),g=openGame(h),r=g.start();
  g.setCurrent('existing',fixtures[1]);
  h.setFault((op,key)=>op==='set'&&key===gameProfile('existing'));
  assert.equal(g.save(false),false);assert.equal(h.data.get(gameProfile('existing')),existing[2][1]);
  h.setFault((op,key)=>op==='set'&&key===gameRegistry);
  assert.equal(g.save(false),true,'committed payload must not trigger false settlement rollback');
  assert.deepEqual(JSON.parse(h.data.get(gameProfile('existing'))),fixtures[1]);
  const before=[...h.data];assert.equal(g.remove('existing'),false);assert.deepEqual([...h.data],before);
  h.setFault((op,key)=>op==='remove'&&key===gameActive);
  assert.equal(g.remove('existing'),false);
  assert.equal(h.data.get(gameActive),'existing');assert.ok(h.data.has(gameProfile('existing')),'active still references payload');
  h.setFault(()=>false);g.fire('pagehide');await r;assertGameIsolation(h);
  console.log('PASS QA-001-GW payload boolean contract, failed registry/active delete retains referenced payload');
}
{
  const h=await harness(),g=openGame(h),r=g.start();
  h.data.set(T+'progression_v1',JSON.stringify(fixtures[1]));g.legacy();
  let accounts=JSON.parse(h.data.get(gameRegistry)),legacy=accounts.find(a=>a.id.startsWith('legacy_'));
  assert.ok(legacy);assert.deepEqual(JSON.parse(h.data.get(gameProfile(legacy.id))),fixtures[1]);
  assert.equal(h.data.get(T+'legacy_imported_v1'),'1');
  g.setCurrent('existing',{...fixtures[0],hasStarted:true});
  const created=g.adminCreate();assert.equal(created.ok,true);assert.ok(h.data.has(gameProfile(created.id)));
  const original=h.data.get(gameProfile('existing'));
  assert.equal(g.adminEnter(created.id),true);assert.equal(g.adminApply('coins',777).ok,true);
  assert.equal(g.adminReset(),true);assert.equal(g.adminLeave(),true);
  assert.equal(h.data.get(gameProfile('existing')),original);
  g.fire('pagehide');await r;assertGameIsolation(h);
  console.log('PASS QA-001-GW actual legacy and admin create/enter/apply/reset/leave writer fixture');
}
{
  const h=await harness(),g=openGame(h,{source:sourceGame,secure:false,hasLocks:false});
  const count=h.lockRequests.length,before=[...h.data];
  await g.start();assert.equal(g.mode,false);assert.equal(g.canWrite(),true);assert.equal(g.timers.size,2);
  assert.equal(h.lockRequests.length,count);assert.deepEqual([...h.data],before);
  console.log('PASS QA-001-GW production source retains synchronous startup without Web Locks');
}
{
  const h=await harness();let grant;
  const locks={request:(name,opts,callback)=>new Promise(resolve=>{grant=()=>h.lockManager.request(name,opts,callback).then(resolve);})};
  const g=openGame(h,{locks}),running=g.start(),before=[...h.data],ops=h.operations.length;
  assert.equal(g.canWrite(),false);g.fire('pagehide');await grant();await running;
  assertBlockedGame(g);assert.equal(g.timers.size,0);assert.equal(h.held.size,0);
  assert.deepEqual([...h.data],before);assert.equal(h.operations.length,ops);assertGameIsolation(h);
  console.log('PASS QA-001-GW pagehide before delayed grant cannot revive retired game');
}

// Negative control: old sync transformed only game.js. Synthetic production is intentionally used here.
const old = await harness({ importerScript: sourceImporter.match(/<script>([\s\S]*?)<\/script>/)[1] });
old.inspect(fixtures[0]);
await old.submit('Old bug QA');
assert.throws(() => old.isolated(), /production|playtest|deep-equal|deepStrictEqual/);
assert.notEqual(old.data.get(active(P)), 'prod');
assert.ok(old.lockRequests.every(name=>name===P+'import_pending_v1'),'production lock is distinct');
console.log('PASS negative control detects old importer production leak');
console.log('PASS QA-001 save isolation: mock DOM/storage, actual importer, no real saves');
