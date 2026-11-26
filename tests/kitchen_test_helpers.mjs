import assert from 'node:assert/strict';
export async function enterKitchen(page){
 if(await page.locator('#v88-live-scene').getAttribute('data-view')!=='kitchen')await page.locator('#us21-enter-kitchen').click();
 await page.waitForFunction(()=>document.getElementById('v88-live-scene').dataset.view==='kitchen');
}
export async function pourBoba(page){
 const dispenser=page.locator('#cp177-pour-object');
 assert.equal(await dispenser.count(),1);
 await dispenser.waitFor({state:'visible'});
 assert.equal(await page.locator('#cs20-primary').isVisible(),false,'native pour is represented by the dispenser');
 await dispenser.click();
 await page.waitForFunction(()=>window.BPVQCookingStation.status().stage==='pour');
 await page.waitForFunction(()=>window.BPVQCookingStation.status().pour>5);
 await dispenser.click();
 await page.waitForFunction(()=>window.BPVQCookingStation.status().stage==='mix');
 assert.equal(await page.evaluate(()=>window.BPVQCookingStation.status().poured),true);
 assert.equal(await page.locator('#cs20-primary').getAttribute('data-act'),'cap-start');
}
export async function takeBoba(page){
 const before=await page.evaluate(()=>JSON.stringify([gameState.coins,gameState.inventory,gameState.reviews]));
 const primary=page.locator('#cs20-primary');
 await page.waitForFunction(()=>document.getElementById('cs20-primary').dataset.act==='take');
 await primary.click();
 await page.waitForFunction(()=>document.getElementById('cs20-primary').dataset.act==='send');
 assert.equal(await page.evaluate(()=>window.BPVQCookingStation.status().handoffHeld),true);
 assert.equal(await page.evaluate(()=>JSON.stringify([gameState.coins,gameState.inventory,gameState.reviews])),before,'holding cup never settles');
}
export async function hitTiming(page,grade='perfect'){
 const target=grade==='perfect'?48:grade==='good'?34:3;
 await page.waitForFunction(()=>['timing','capping'].includes(window.BPVQCookingStation.status().stage));
 if(grade==='timeout'){await page.waitForFunction(()=>!['timing','capping'].includes(window.BPVQCookingStation.status().stage),{},{timeout:16000});return;}
 // Deterministic grade fixture uses a clock-aligned DOM click on a visible enabled UI; trusted pour input has separate browser coverage.
 await page.locator('#cs20-primary').waitFor({state:'visible'});
 await page.evaluate(target=>new Promise((resolve,reject)=>{const started=performance.now();function step(){const k=window.BPVQCookingBridge.kitchenStatus(),s=window.BPVQCookingStation.status();const p=s.practice?s.kitchen?.position:k.position;if(p>=target&&p<=target+4){const button=document.getElementById('cs20-primary');if(button.disabled||!button.getClientRects().length||!['cap-hit','kitchen-hit'].includes(button.dataset.act)){reject(Error('timing control is not actionable'));return;}button.click();resolve();}else if(performance.now()-started>10000)reject(Error('timing window not reached'));else requestAnimationFrame(step);}requestAnimationFrame(step);}),target);
}
export async function cookKitchen(page,career,grade='perfect'){
 if(career==='streetfood'&&await page.locator('[data-skewer-slot][opacity="1"]').count()===0){await page.locator('#cs20-groups').getByRole('button',{name:'Chọn xiên',exact:true}).click();await page.locator('#cs20-shelf button:enabled').first().click();}
 if(career==='boba')await pourBoba(page);
 await page.locator('#cs20-primary').click();
 await hitTiming(page,grade);
 if(career==='streetfood'){await hitTiming(page,grade);await page.waitForFunction(()=>window.BPVQCookingStation.status().stage==='plating');await page.locator('#cs20-sauce').click();await page.locator('#cs20-primary').click();}
 if(career==='boba'&&!(await page.evaluate(()=>window.BPVQCookingStation.status().practice)))await takeBoba(page);
 await page.waitForFunction(()=>document.getElementById('cs20-primary').dataset.act==='send');
}
