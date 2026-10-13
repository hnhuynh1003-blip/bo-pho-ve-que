import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const D3=require('../js/v88-day-rules.js');
for(const career of ['boba','noodle','streetfood'])for(let stage=0;stage<9;stage++){
  const plan=D3.create({profile:'profile-test',day:8,career,stage,menuVersion:5});
  assert.equal(D3.remaining(plan,'counter'),D3.COUNTER[stage]);
  assert.equal(D3.remaining(plan,'delivery'),D3.DELIVERY[stage]);
  let refused=false;
  for(let i=0;i<D3.COUNTER[stage];i++){
    const s=D3.issue(plan,'counter');assert.ok(s);assert.equal(s.id,`8:counter:${i}`);
    assert.equal(D3.roll(plan.seed,'counter',i),s.roll);
    assert.equal(D3.finish(plan,s.id,i%2?'refused':'accepted'),true);
    assert.equal(D3.finish(plan,s.id,'accepted'),false);
    if(i>0)assert.ok(s.roll>=0&&s.roll<1);
  }
  assert.equal(D3.issue(plan,'counter'),null);
  for(let i=0;i<D3.DELIVERY[stage];i++){
    const s=D3.issue(plan,'delivery');assert.ok(s);assert.equal(D3.finish(plan,s.id,'expired'),true);
  }
  assert.equal(D3.issue(plan,'delivery'),null);
  const loaded=JSON.parse(JSON.stringify(plan));assert.equal(D3.issue(loaded,'counter'),null);
  assert.equal(D3.issue(loaded,'delivery'),null);
  assert.equal(D3.finish(loaded,'7:counter:0','accepted'),false);
  const newer=D3.create({profile:'profile-test',day:9,career,stage,menuVersion:6});
  assert.equal(D3.issue(newer,'counter').id,'9:counter:0');
  const migrated=D3.create({profile:'profile-test',day:8,career,stage,migratedCounter:3,migratedDelivery:1});
  assert.equal(migrated.issuedCounter,3);assert.equal(migrated.counterStatus[0],'legacy');
  assert.equal(D3.finish(migrated,'8:counter:0','accepted'),false);
}
assert.equal(D3.demand({priceRatio:.85})>D3.demand({priceRatio:1.5}),true);
assert.equal(D3.demand({priceRatio:1,popularity:100})>D3.demand({priceRatio:1,popularity:1}),true);
assert.equal(D3.demand({priceRatio:2.6})>=.22,true);
for(const coins of [0,4,10,50,250])for(const opCosts of [0,20,100])for(const interest of [0,5,25]){
  const r=D3.settlement({coins,opCosts,interest,wages:Math.min(30,opCosts)});
  assert.equal(r.paid+r.coinsAfter,coins);
  assert.equal(r.paid+r.unpaidWages+r.unpaidOperating+(interest-r.paidInterest),opCosts+interest);
  assert.equal(r.interestCapitalized,interest);
  assert.ok(r.unpaidWages<=Math.min(30,opCosts));
}
console.log('PASS D3: 3 careers x 9 stages finite slots; reload/day migration, idempotent slot outcomes, price sensitivity, 225 settlement cases');
