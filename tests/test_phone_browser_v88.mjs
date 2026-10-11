// Browser-level regression: exercise the real game HTML + merged Phone OS.
// Executed on a temporary local HTTP server by GitHub Actions, never on users' saves.
import assert from 'node:assert/strict';
import {chromium} from 'playwright';

const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const failures=[];
for(const width of [320,390,430]){
  const page=await browser.newPage({viewport:{width,height:800},deviceScaleFactor:1});
  const uncaught=[];
  page.on('pageerror',e=>uncaught.push(String(e?.message||e)));
  await page.route('https://cdnjs.cloudflare.com/**',route=>route.abort('blockedbyclient'));
  try{
    await page.goto('http://127.0.0.1:8765/',{waitUntil:'domcontentloaded',timeout:45000});
    await page.waitForFunction(()=>!!window.VillageOS&&!!window.BPVQReborn&&!!window.BPVQDecorV88,{timeout:30000});
    const result=await page.evaluate(()=>{
      const el=id=>document.getElementById(id);
      const check=(ok,why)=>{if(!ok)throw Error(why)};
      check(typeof window.openSmartPhoneModal==='function','phone opener missing');
      window.openSmartPhoneModal();
      check(!el('modal-smartphone').classList.contains('hidden'),'phone not visible');
      check(!el('phone-app-home').classList.contains('hidden'),'Home not visible after opening');
      const homeCount=window.VillageOS.listApps().length;
      check(homeCount>=12,'lost apps from registry: '+homeCount);
      window.VillageOS.open('construction');
      check(!el('phone-app-construction').classList.contains('hidden'),'Xây Quán screen hidden');
      check(el('v8775-construction-content')?.textContent.includes('Bậc 1'),'stage overview did not render');
      check(window.BPVQShopScenesV88?.diagnostics().total===27,'27-stage scene manifest missing');
      check(window.BPVQShopScenesV88?.diagnostics().ready===0,'unapproved placeholder art was incorrectly activated');
      check(document.querySelector('#v88-architecture-preview .v88-arch-art-pending')?.textContent.includes('0/27'),'missing-shell warning must be visible');
      window.BPVQReborn.constructionTab('layout');
      const slots=el('v8775-construction-content')?.querySelectorAll('.v88-decor-slot');
      check(slots?.length===24,'expected 24 rendered decor slots, got '+slots?.length);
      check(el('v8775-construction-content').textContent.includes('6/24 ô mở'),'stage B1 slots mismatch');
      window.BPVQReborn.constructionTab('inventory');
      check(el('v8775-construction-content')?.querySelectorAll('.v88-decor-item').length===14,'14 decor inventory rows missing');
      window.BPVQReborn.constructionTab('shop');
      check(el('growth-decor-grid')?.children.length===14,'14 legacy shop decor cards missing');
      window.BPVQReborn.constructionTab('paint');
      check(el('v8775-construction-content')?.querySelectorAll('.v88-paint-preset').length===8,'missing color presets');
      check(el('v8775-construction-content')?.querySelectorAll('.v88-paint-region').length===6,'missing paint regions');
      window.BPVQReborn.constructionTab('stage');
      check(el('growth-panel-story')?.parentElement?.id==='v8775-construction-content' && (el('growth-panel-story')?.textContent||'').includes('Bậc 1'),'stage view missing growth stage content');
      window.VillageOS.open('notifications');
      check(!el('phone-app-notifications').classList.contains('hidden'),'notifications screen missing');
      window.VillageOS.open('settings');
      check(!el('phone-app-settings').classList.contains('hidden'),'settings missing');
      window.switchPhoneApp('progress');
      check(!el('phone-app-character').classList.contains('hidden'),'progress->character legacy redirect broken');
      window.VillageOS.home();
      check(!el('phone-app-home').classList.contains('hidden'),'Home navigation broken');
      window.closeSmartPhoneModal();
      check(el('modal-smartphone').classList.contains('hidden'),'close phone broken');
      return {homeCount,slots:slots.length,decorCards:14};
    });
    console.log('BROWSER PASS',width+'px',JSON.stringify(result),uncaught.length?'pageerrors='+JSON.stringify(uncaught):'');
    assert.deepEqual(uncaught,[],`unexpected page runtime errors at ${width}px`);
  }catch(error){
    console.error('BROWSER FAIL',width+'px',String(error),JSON.stringify(uncaught));
    failures.push({width,error:String(error),uncaught});
  }finally{await page.close()}
}
await browser.close();
assert.equal(failures.length,0,JSON.stringify(failures,null,2));
console.log('Phone OS v88: real-browser smoke test PASS');
