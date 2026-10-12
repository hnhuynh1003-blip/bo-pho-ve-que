import assert from 'node:assert/strict';
import { chromium } from 'playwright';
const browser=await chromium.launch({headless:true});
try {
  for(const width of [320,360,375,390,430]) {
    const page=await browser.newPage({viewport:{width,height:width===320?568:width===360?640:width===375?812:width===390?844:932}});
    const errors=[];page.on('pageerror',e=>errors.push(String(e)));
    await page.goto('http://127.0.0.1:8765/',{waitUntil:'domcontentloaded'});
    await page.waitForFunction(()=>!!window.BPVQCookingBridge&&!!window.BPVQCookingStation);
    await page.evaluate(()=>{
      gameState.hasStarted=true;gameState.currentCareer='boba';gameState.phase='open';gameState.shiftClosed=false;
      gameState.level=20;gameState.shopStage=0;gameState.coins=450;
      Object.assign(gameState.inventory,{cup_m:20,tea_black:20,topping_boba:12,topping_jelly:10});
      currentCustomer={name:'Bé Bơ',avatar:'🐰',role:'Khách TEST',budget:120,strict:'moderate',patience:180,maxPatience:180,
        order:{career:'boba',container:'cup_m',base:'tea_black',sugar:70,ice:50,toppings:['topping_boba'],toppingPortions:{topping_boba:2},requiresShaken:true,maxPrice:120},quote:'Trân châu hai phần'};
    });
    await page.waitForTimeout(800);
    const data=await page.evaluate(()=>({shelf:document.querySelectorAll('#cs20-shelf .cs20-item').length,
      docWidth:document.documentElement.scrollWidth,viewport:document.documentElement.clientWidth,
      snapshot:window.BPVQCookingBridge.snapshot()}));
    assert.equal(data.shelf,width<=365?6:8,`${width}px ingredient grid`);
    assert.ok(data.docWidth<=data.viewport+1,`${width}px horizontal overflow`);
    assert.match(data.snapshot.customer.description,/×2/,'customer order contains quantity');
    if(width===390){
      const result=await page.evaluate(async ()=>{
        const bridge=window.BPVQCookingBridge;
        const before=bridge.snapshot();
        const one=bridge.choose('topping','topping_boba',1);
        const two=bridge.choose('topping','topping_boba',-1);
        const three=bridge.choose('topping','topping_boba',1);
        const after=bridge.snapshot();
        const cashBefore=gameState.coins,stockBefore=gameState.inventory.topping_boba;
        bridge.complete('boba');await new Promise(r=>setTimeout(r,1750));
        const served=bridge.deliver(),twice=bridge.deliver();
        return {one,two,three,servings:after.dish.toppingPortions.topping_boba,
          cashBefore,cashAfter:gameState.coins,stockBefore,stockAfter:gameState.inventory.topping_boba,
          served,twice,costBefore:before.cost,costAfter:after.cost};
      });
      assert.deepEqual([result.one,result.two,result.three],[true,true,true]);
      assert.equal(result.servings,2);assert.equal(result.stockBefore-result.stockAfter,2);
      assert.equal(result.costAfter-result.costBefore,5,'each extra pearl portion costs 5 Xu');
      assert.equal(result.served,true);assert.equal(result.twice,false);
      assert.ok(result.cashAfter>result.cashBefore,'one native settlement pays once');
    }
    assert.deepEqual(errors,[],`${width}px browser errors`);
    await page.close();
    console.log(`PASS UI-Q2.6 mobile width ${width}: ${data.shelf} ingredient jars`);
  }
} finally{await browser.close()}
