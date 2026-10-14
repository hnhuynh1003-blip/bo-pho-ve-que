import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const rules=require('../js/v88-day-rules.js');
const full=fs.readFileSync('js/game.js','utf8');
const section=full.slice(full.indexOf('    /* v88.16.13.4 — Đợt 3:'),full.indexOf('    function getNextCustomerDelayMs()'));
assert.ok(section.includes('function d3EnsurePlan'));
const ctx={console,JSON,Math,Date,Set,Number,String,Array,Object,sessionGameActive:true,activeProfileId:'profile-1',
  currentCustomer:null,activeOnlineOrders:[],deliveryCooldown:25,v87PendingShipments:0,gameState:{hasStarted:true,day:4,currentCareer:'boba',shopStage:4,coins:30,debt:0,reputation:4.4,ratingCount:10,
    dailyStats:{counterServed:2,deliveryServed:1,counterRev:500,deliveryRev:65,tipsRev:40,ratings:[5]}},
  window:{BPVQDayRulesV88:rules},
  v88MenuEnsure:()=>({active:{version:2,entries:{a:{enabled:true,price:65}}}}),RECIPE_BOOK:{boba:[{id:'a',order:{}}]},
  v88MenuSuggested:()=>50,getShopPopularityScore:()=>70,getGrowthBonuses:()=>({arrivalPct:.1,revenuePct:0,deliveryPct:0}),
  getDailyEventBonuses:()=>({arrivalPct:0,revenuePct:0,deliveryPct:0}),
  v87DayCharges:()=>({opCosts:100,interestCost:7}),v87531Due:()=>30,v87DailyRevenue:()=>605,
  v87531Ensure:()=>({arrears:0}),
  saveGameToStorage:()=>true, updateHeaderStats:()=>{},showToast:()=>{},
  v87532ShipCompleted:()=>{},addExp:()=>{},playSound:()=>{},buildV85DeliveryReview:()=>'',
  addShopReview:()=>{},renderShopReviews:()=>{},showV85QuickReview:()=>{},setTimeout:()=>{},
};
ctx.window.BPVQDayRulesV88=rules;
const context=vm.createContext(ctx);
vm.runInContext(section+';globalThis.d3Test={ensurePlan:d3EnsurePlan,ledger:d3EnsureLedger,remaining:d3Remaining,markDelivery:d3MarkDelivery,pay:d3PayOperatingArrears,complete:d3CompleteShipment,summary:d3Summary};',context);
const api=ctx.d3Test;
assert.equal(api.remaining('counter'),rules.COUNTER[4]-2);
assert.equal(api.remaining('delivery'),rules.DELIVERY[4]-1);
const cached=JSON.stringify(ctx.gameState.dailyVisitPlan);
assert.equal(JSON.stringify(api.ensurePlan()),cached);
ctx.gameState.day=5;ctx.gameState.dailyStats.counterServed=0;ctx.gameState.dailyStats.deliveryServed=0;
assert.equal(api.remaining('counter'),rules.COUNTER[4]);
const l=api.ledger();l.operatingArrears=85;
const before=ctx.gameState.coins;
assert.equal(api.pay().paid,30);
assert.equal(ctx.gameState.coins,0);assert.equal(l.operatingArrears,55);
ctx.gameState.coins=70;
ctx.saveGameToStorage=()=>false;
assert.equal(api.pay().ok,false);
assert.equal(ctx.gameState.coins,70);assert.equal(l.operatingArrears,55);
ctx.saveGameToStorage=()=>true;
const slot=rules.issue(ctx.gameState.dailyVisitPlan,'delivery');
const entry={id:slot.id,day:5,order:{d3SlotId:slot.id,reward:50,customerName:'Online',dishName:'Trà',packTimeRemaining:4},settled:false};
ctx.gameState.d3InFlight=[entry];ctx.v87PendingShipments=1;
let reviews=0,exp=0;
ctx.addShopReview=()=>reviews++;
ctx.addExp=n=>exp+=n;
const coins=ctx.gameState.coins;
api.complete(entry);
assert.equal(ctx.gameState.coins,coins+50);
assert.equal(ctx.gameState.dailyVisitPlan.deliveryStatus[slot.index],'accepted');
assert.equal(reviews,1);assert.equal(exp,30);
api.complete(entry);
assert.equal(ctx.gameState.coins,coins+50);assert.equal(reviews,1);assert.equal(exp,30);
console.log('PASS D3 native connection: plan & legacy migration, repeated reads, day rollover, arrears rollback, shipment one-shot');
