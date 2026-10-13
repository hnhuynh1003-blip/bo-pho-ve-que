export async function cookKitchen(page,career){
 if(career==='streetfood'&&await page.locator('[data-skewer-slot][opacity="1"]').count()===0){
  await page.locator('#cs20-groups').getByRole('button',{name:'Chọn xiên',exact:true}).click();
  await page.locator('#cs20-shelf button:enabled').first().click();
 }
 await page.locator('#cs20-primary').click();
 if(career==='noodle'){
  await page.waitForFunction(()=>window.BPVQCookingStation.status().kitchen.canDrop);
  await page.locator('#cs20-primary').click();
  while(await page.evaluate(()=>window.BPVQCookingStation.status().kitchen.flame!==2))await page.locator('#cs20-fire').click();
  await page.locator('#cs20-flip').click();
  await page.waitForFunction(()=>{const k=window.BPVQCookingStation.status().kitchen;return k.canFinish&&k.cook>=99;});
 }else{
  await page.waitForFunction(()=>window.BPVQCookingStation.status().kitchen.a>=77);
  await page.locator('#cs20-flip').click();
  await page.waitForFunction(()=>{const k=window.BPVQCookingStation.status().kitchen;return k.b>=77&&k.elapsed>=7;});
  await page.locator('#cs20-lift').click();
  await page.waitForFunction(()=>window.BPVQCookingStation.status().kitchen.stage==='held');
  const held=await page.evaluate(()=>window.BPVQCookingStation.status().kitchen);
  await page.waitForTimeout(1200);
  const resting=await page.evaluate(()=>window.BPVQCookingStation.status().kitchen);
  if(resting.a!==held.a||resting.b!==held.b)throw new Error('Plated skewers kept cooking');
  await page.waitForFunction(()=>document.querySelector('#cs20-visual svg').dataset.offHeat==='true'&&document.querySelector('[data-plated-tray]').getAttribute('opacity')==='1');
  await page.locator('#cs20-sauce').click();
  await page.waitForFunction(()=>{const k=window.BPVQCookingStation.status().kitchen;return k.canFinish&&k.b>=77;});
 }
 await page.locator('#cs20-primary').click();
 await page.waitForFunction(()=>document.getElementById('cs20-primary').dataset.act==='send');
}
