export async function hitTiming(page,grade='perfect'){
 const target=grade==='perfect'?48:grade==='good'?34:3;
 await page.waitForFunction(()=>['timing','capping'].includes(window.BPVQCookingStation.status().stage));
 if(grade==='timeout'){await page.waitForFunction(()=>!['timing','capping'].includes(window.BPVQCookingStation.status().stage),{},{timeout:16000});return;}
 // One in-page animation callback reads the native clock and clicks the actual UI.
 await page.evaluate(target=>new Promise((resolve,reject)=>{const started=performance.now();function step(){const k=window.BPVQCookingBridge.kitchenStatus(),s=window.BPVQCookingStation.status();const p=s.practice?s.kitchen?.position:k.position;if(p>=target&&p<=target+4){document.getElementById('cs20-primary').click();resolve();}else if(performance.now()-started>10000)reject(Error('timing window not reached'));else requestAnimationFrame(step);}requestAnimationFrame(step);}),target);
}
export async function cookKitchen(page,career,grade='perfect'){
 if(career==='streetfood'&&await page.locator('[data-skewer-slot][opacity="1"]').count()===0){await page.locator('#cs20-groups').getByRole('button',{name:'Chọn xiên',exact:true}).click();await page.locator('#cs20-shelf button:enabled').first().click();}
 if(career==='boba'){await page.locator('#cs20-primary').click();await page.waitForTimeout(500);await page.locator('#cs20-primary').click();}
 await page.locator('#cs20-primary').click();
 await hitTiming(page,grade);
 if(career==='streetfood'){await hitTiming(page,grade);await page.waitForFunction(()=>window.BPVQCookingStation.status().stage==='plating');await page.locator('#cs20-sauce').click();await page.locator('#cs20-primary').click();}
 await page.waitForFunction(()=>document.getElementById('cs20-primary').dataset.act==='send');
}
