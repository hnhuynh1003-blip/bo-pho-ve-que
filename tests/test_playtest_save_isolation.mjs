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

function harness({ populated = true, fail = null, confirmImport = true, importerScript = script } = {}) {
  const data = new Map([...production, ...(populated ? existing : [])]);
  const before = [...data];
  const operations = [];
  let failed = false;
  let fault = () => false;
  const checkFault = (op,key,value) => { if(fault(op,key,value))throw new Error('Synthetic persistent/compound fault'); };
  const localStorage = {
    getItem(key) { operations.push(['get', key]); checkFault('get',key); return data.get(key) ?? null; },
    setItem(key, value) {
      operations.push(['set', key]);
      checkFault('set',key,value);
      if (!failed && fail && fail(key)) { failed = true; throw new Error('Synthetic QuotaExceededError'); }
      data.set(key, String(value));
    },
    removeItem(key) { operations.push(['remove', key]); checkFault('remove',key); data.delete(key); },
  };
  const nodes = Object.fromEntries(['saveCode','preview','importBtn','newName','status','inspectBtn'].map(id =>
    [id, { value: '', textContent: '', style: {}, disabled: false, listeners: {},
      addEventListener(type, listener) { this.listeners[type] = listener; } }]));
  const reload = () => {
    for(const n of Object.values(nodes)){n.value='';n.textContent='';n.disabled=false;n.listeners={};}
    new Function('document', 'localStorage', 'confirm', 'atob', 'TextDecoder', importerScript)(
      { getElementById: id => nodes[id] }, localStorage, () => confirmImport, atob, TextDecoder);
  };
  reload();
  const inspect = save => {
    nodes.saveCode.value = typeof save === 'string' ? save : btoa(JSON.stringify(save));
    nodes.saveCode.listeners.input();
    nodes.inspectBtn.listeners.click();
  };
  const submit = name => { if (name !== undefined) nodes.newName.value = name; nodes.importBtn.listeners.click(); };
  const isolated = () => {
    assert.deepEqual([...data].filter(([key]) => key.startsWith(P)), production);
    assert.ok(operations.every(([, key]) => key.startsWith(T)), 'all importer storage access must be playtest-only');
  };
  return { data, before, nodes, inspect, submit, isolated, operations, reload, setFault: fn=>{fault=fn;}, didFail: () => failed };
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
  const h = harness();
  const beforeInspect=h.operations.length;
  h.inspect(save);
  assert.equal(h.operations.length, beforeInspect, 'inspection is read-only');
  h.submit();
  assertSuccess(h, save, true);
  console.log('PASS synthetic ' + (save.decorV88 ? 'v88' : 'v87') + ' import, game keys, existing profiles, isolation');
}

for (const populated of [true, false]) {
  for (const target of ['save', 'registry', 'active']) {
    const h = harness({ populated, fail: key => target === 'save' ? key.startsWith(T + 'profile_') :
      key === (target === 'registry' ? registry(T) : active(T)) });
    h.inspect(fixtures[1]);
    h.submit();
    assert.ok(h.didFail(), 'must actually inject a failure');
    assert.deepEqual([...h.data], h.before, 'rollback restores exact pre-import state: ' + target);
    assert.match(h.nodes.status.textContent, /Synthetic QuotaExceededError/);
    h.isolated();
    h.submit(); // transient failure cleared: retry should succeed exactly once.
    assertSuccess(h, fixtures[1], populated);
    console.log('PASS rollback and retry: ' + target + ', ' + (populated ? 'existing' : 'empty') + ' playtest');
  }
}

for (const kind of ['invalid', 'duplicate', 'cancel']) {
  const h = harness({ confirmImport: kind !== 'cancel' });
  h.inspect(kind === 'invalid' ? 'invalid!' : fixtures[0]);
  h.submit(kind === 'duplicate' ? 'Existing QA' : undefined);
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
  const h=harness();
  h.inspect(fixtures[1]);
  let activeFailed=false,registryFailed=false;
  h.setFault((op,key)=>{
    if(op==='set'&&key===gameActive&&!activeFailed){activeFailed=true;return true;}
    if(activeFailed&&op==='set'&&key===gameRegistry&&!registryFailed){registryFailed=true;return true;}
    return persistent&&activeFailed&&op!=='get';
  });
  h.submit();
  assert.ok(activeFailed&&registryFailed);
  assert.match(h.nodes.status.textContent,/Chưa phục hồi/);
  assert.ok(h.data.has(pending));
  const id=assertRegistered(h);
  if(persistent){
    h.reload();
    assert.match(h.nodes.status.textContent,/Chưa phục hồi/);
    assert.equal(assertRegistered(h),id);
  }
  h.setFault(()=>false);
  h.reload();
  assert.match(h.nodes.status.textContent,/Đã phục hồi/);
  assert.equal(assertRegistered(h),id);
  assert.ok(!h.data.has(pending));
  const recovered=[...h.data];
  h.inspect(fixtures[1]);h.submit();
  assert.match(h.nodes.status.textContent,/Tên hồ sơ đã tồn tại/);
  assert.deepEqual([...h.data],recovered);
  h.isolated();
  console.log('PASS QA-001-R '+(persistent?'persistent':'compound')+' active + registry fault; reload recovery, no duplicate');
}
for(const populated of [true,false]){
  const h=harness({populated});
  h.inspect(fixtures[1]);
  let failed=false;
  h.setFault((op,key)=>{
    if(op==='set'&&key===gameRegistry){failed=true;return true;}
    return failed&&op==='remove';
  });
  h.submit();
  assert.ok(failed&&h.data.has(pending));
  assert.match(h.nodes.status.textContent,/Chưa phục hồi/);
  h.isolated();
  h.setFault(()=>false);h.reload();
  assert.match(h.nodes.status.textContent,/Đã dọn/);
  assert.deepEqual([...h.data],h.before);
  h.inspect(fixtures[1]);h.submit();
  assertSuccess(h,fixtures[1],populated);
  console.log('PASS QA-001-R orphan cleanup after reload + retry: '+(populated?'existing':'empty'));
}
{
  const h=harness();
  h.inspect(fixtures[1]);
  h.setFault((op,key)=>op==='set'&&key===pending);
  h.submit();
  assert.deepEqual([...h.data],h.before);
  assert.match(h.nodes.status.textContent,/Synthetic persistent/);
  h.isolated();
  h.setFault(()=>false);h.submit();assertSuccess(h,fixtures[1],true);
  console.log('PASS QA-001-R journal write denied; no partial writes, retry');
}
{
  const h=harness();
  h.inspect(fixtures[1]);
  h.setFault((op,key)=>op==='remove'&&key===pending);
  h.submit();
  assert.match(h.nodes.status.textContent,/Chưa phục hồi/);
  const id=h.data.get(gameActive);
  assert.ok(h.data.has(gameProfile(id))&&h.data.has(pending));
  h.data.set(gameActive,'existing'); // user switched to old account before reload
  h.setFault(()=>false);h.reload();
  assert.match(h.nodes.status.textContent,/Đã phục hồi/);
  assert.equal(assertRegistered(h),id);
  assert.ok(!h.data.has(pending));
  console.log('PASS QA-001-R journal cleanup denied; keep completed profile and current selection');
}
{
  const h=harness();
  h.inspect(fixtures[1]);
  let blocked=false;
  h.setFault((op,key)=>{
    if(op==='set'&&key===gameActive){blocked=true;return true;}
    return blocked&&op==='get';
  });
  h.submit();
  assert.match(h.nodes.status.textContent,/Chưa phục hồi/);
  assert.ok(h.data.has(pending));
  h.setFault(()=>false);h.reload();
  assert.match(h.nodes.status.textContent,/Đã phục hồi/);
  assertRegistered(h);
  console.log('PASS QA-001-R storage read denied during rollback; reload preserves registered payload');
}

// Negative control: old sync transformed only game.js. Synthetic production is intentionally used here.
const old = harness({ importerScript: sourceImporter.match(/<script>([\s\S]*?)<\/script>/)[1] });
old.inspect(fixtures[0]);
old.submit('Old bug QA');
assert.throws(() => old.isolated(), /production|playtest|deep-equal|deepStrictEqual/);
assert.notEqual(old.data.get(active(P)), 'prod');
console.log('PASS negative control detects old importer production leak');
console.log('PASS QA-001 save isolation: mock DOM/storage, actual importer, no real saves');
