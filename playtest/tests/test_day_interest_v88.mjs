import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const D3 = require('../js/v88-day-rules.js');
const cases = [
  {coins:100,opCosts:0,interest:10,wages:0,paidInterest:10,capitalized:0,remainingCoins:90},
  {coins:0,opCosts:0,interest:10,wages:0,paidInterest:0,capitalized:10,remainingCoins:0},
  {coins:4,opCosts:0,interest:10,wages:0,paidInterest:4,capitalized:6,remainingCoins:0},
  {coins:5,opCosts:20,interest:10,wages:5,paidInterest:5,capitalized:5,remainingCoins:0},
  {coins:150,opCosts:20,interest:10,wages:5,paidInterest:10,capitalized:0,remainingCoins:120}
];
for (const c of cases) {
  const r = D3.settlement(c);
  assert.equal(r.paidInterest,c.paidInterest);
  assert.equal(r.interestCapitalized,c.capitalized);
  assert.equal(r.coinsAfter,c.remainingCoins);
  assert.equal(r.paidInterest + r.interestCapitalized,c.interest);
  assert.equal(r.coinsAfter + r.paid,c.coins);
}
let checked=0;
for (let cash=0;cash<=200;cash++) for (let interest=0;interest<=50;interest+=5) {
  const r=D3.settlement({coins:cash,interest,opCosts:40,wages:12});
  assert.equal(r.paidInterest + r.interestCapitalized,interest);
  assert.equal(r.paid + r.coinsAfter,cash);
  assert.equal(r.paid+r.unpaidWages+r.unpaidOperating+r.interestCapitalized,40+interest);
  checked++;
}
const source=fs.readFileSync('js/game.js','utf8');
assert.match(source,/gameState\.debt\s*\+=\s*values\.interestCapitalized/);
assert.doesNotMatch(source,/gameState\.debt\s*\+=\s*interestCost/);
assert.match(source,/interestPaid:values\.paidInterest,interestCapitalized:values\.interestCapitalized/);
console.log('PASS v88 D3 interest accounting: 5 fixtures and '+checked+' cash/interest combinations');
