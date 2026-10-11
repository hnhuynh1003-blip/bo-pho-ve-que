// iOS Safari engine preflight on Playwright's Linux WebKit build.
// This is WebKit emulation, NOT a physical iPhone or iOS Safari certification.
import assert from 'node:assert/strict';
import {webkit} from 'playwright';

const browser=await webkit.launch({headless:true});
try{
  for(const width of [375,390,430]){
    const context=await browser.newContext({viewport:{width,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true});
    const page=await context.newPage(),errors=[];
    page.on('pageerror',error=>errors.push(error.message));
    await page.route('https://cdnjs.cloudflare.com/**',r=>r.abort('blockedbyclient'));
    try{
      await page.goto('http://127.0.0.1:8765/',{waitUntil:'domcontentloaded',timeout:45000});
      await page.waitForFunction(()=>!!window.VillageOS&&!!window.BPVQReborn&&!!window.BPVQDecorV88&&!!window.BPVQArchitectureV88,{timeout:30000});
      const snapshot=await page.evaluate(()=>{
        const require=(ok,why)=>{if(!ok)throw Error(why)};
        window.openSmartPhoneModal();
        require(!document.getElementById('modal-smartphone').classList.contains('hidden'),'Phone hidden');
        window.VillageOS.open('construction');
        require(!document.getElementById('phone-app-construction').classList.contains('hidden'),'construction missing');
        window.BPVQReborn.constructionTab('layout');
        require(document.querySelectorAll('.v88-decor-slot').length===24,'layout slots missing');
        window.BPVQReborn.constructionTab('inventory');
        require(document.querySelectorAll('.v88-decor-item').length===14,'inventory rows missing');
        window.BPVQReborn.constructionTab('stage');
        const details=document.querySelector('#v88-architecture-preview details');
        require(!!details,'architecture preview missing');
        details.open=true;window.BPVQArchitectureV88.select(9);
        const card=document.querySelector('#v88-architecture-preview .v88-arch-card');
        require(card?.textContent.includes('Thương Hiệu Đặc Sản'),'B9 blueprint missing');
        const rect=card.getBoundingClientRect(),phone=document.querySelector('.phone-shell').getBoundingClientRect();
        require(rect.width>0&&rect.left>=phone.left-2&&rect.right<=phone.right+2,'B9 card overflows phone');
        window.VillageOS.home();
        require(!document.getElementById('phone-app-home').classList.contains('hidden'),'back home failure');
        window.closeSmartPhoneModal();
        require(document.getElementById('modal-smartphone').classList.contains('hidden'),'close phone failure');
        return {apps:window.VillageOS.listApps().length,slotCount:24,decorCount:14,blueprints:window.BPVQArchitectureV88.all().length};
      });
      assert.deepEqual(errors,[],'JS runtime errors');
      console.log('WEBKIT MOBILE PASS',width+'px',JSON.stringify(snapshot));
    }finally{await context.close()}
  }
}finally{await browser.close()}
