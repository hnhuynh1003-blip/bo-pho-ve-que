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
  await page.waitForFunction(()=>window.BPVQCookingStation.status().kitchen.b>=58);
  await page.locator('#cs20-sauce').click();
  await page.waitForFunction(()=>{const k=window.BPVQCookingStation.status().kitchen;return k.canFinish&&k.b>=77;});
 }
 await page.locator('#cs20-primary').click();
 await page.waitForFunction(()=>document.getElementById('cs20-primary').dataset.act==='send');
}
