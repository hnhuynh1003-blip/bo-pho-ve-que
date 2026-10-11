// Visual layout regression for the actual Phone OS in headless Chromium.
// Saves screenshots as CI artifacts; checks essential viewport geometry, not aesthetics.
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {mkdirSync,writeFileSync} from 'node:fs';

const dest='artifacts/v88-layout';
mkdirSync(dest,{recursive:true});
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const devices=[{w:320,h:568},{w:375,h:667},{w:390,h:844},{w:430,h:932},{w:1280,h:800}];
const screens=[['home',()=>window.VillageOS.home()],['stage',()=>{window.VillageOS.open('construction');window.BPVQReborn.constructionTab('stage')}],['blueprint',()=>{window.BPVQReborn.constructionTab('stage');document.querySelector('#v88-architecture-preview details').open=true;window.BPVQArchitectureV88.select(9)}],['layout',()=>window.BPVQReborn.constructionTab('layout')],['inventory',()=>window.BPVQReborn.constructionTab('inventory')],['shop',()=>window.BPVQReborn.constructionTab('shop')],['notifications',()=>window.VillageOS.open('notifications')],['settings',()=>window.VillageOS.open('settings')]];
const records=[],issues=[];
for(const {w,h} of devices){
 const page=await browser.newPage({viewport:{width:w,height:h},deviceScaleFactor:1});
 await page.route('https://cdnjs.cloudflare.com/**',r=>r.abort('blockedbyclient'));
 const errors=[];
 page.on('pageerror',e=>errors.push(e.message||String(e)));
 try{
   await page.goto('http://127.0.0.1:8765/',{waitUntil:'domcontentloaded',timeout:45000});
   await page.waitForFunction(()=>!!window.VillageOS&&!!window.BPVQDecorV88);
   await page.evaluate(()=>window.openSmartPhoneModal());
   for(const [name,action] of screens){
     await page.evaluate(action);
     await page.waitForTimeout(60);
     const report=await page.evaluate(label=>{
       const modal=document.getElementById('modal-smartphone');
       const shell=modal.querySelector('.phone-shell');
       const viewport={w:innerWidth,h:innerHeight};
       const rect=el=>{if(!el)return null;const r=el.getBoundingClientRect();return {l:r.left,r:r.right,t:r.top,b:r.bottom,w:r.width,h:r.height}};
       const box=rect(shell),content=rect(document.getElementById('phone-app-container'));
       const checks=[];
       const check=(ok,msg)=>{if(!ok)checks.push(msg)};
       check(!!box,'phone shell missing');
       if(box){check(box.l>=-1&&box.r<=viewport.w+1,'phone-shell overflows horizontal viewport');check(box.t>=-1&&box.b<=viewport.h+1,'phone-shell overflows vertical viewport')}
       const current=document.getElementById('v8775-construction-content');
       const boxes=(label==='layout'?current?.querySelectorAll('.v88-decor-slot'):label==='inventory'?current?.querySelectorAll('.v88-decor-item'):label==='blueprint'?document.querySelectorAll('#v88-architecture-preview .v88-arch-card,#v88-architecture-preview .v88-arch-tiers button'):label==='stage'||label==='shop'?document.querySelectorAll('#phone-app-construction .v8775-tabs button'):document.querySelectorAll('#v8772-app-launcher .v8776-home-page')).values();
       const list=boxes?[...boxes].filter(x=>x.getClientRects().length).map(rect):[];
       if((label==='layout'||label==='inventory'||label==='blueprint')&&content){
         const bad=list.filter(b=>b.w>0&&(b.l<content.l-2||b.r>content.r+2));
         check(!bad.length,label+': '+bad.length+' item cards overrun the phone panel');
       }
       if(label==='layout'){
         check(list.length===24,'layout should render 24 slots');
         for(let i=0;i<list.length;i++)for(let j=i+1;j<list.length;j++){
           const a=list[i],b=list[j];
           const intersect=Math.max(0,Math.min(a.r,b.r)-Math.max(a.l,b.l))*Math.max(0,Math.min(a.b,b.b)-Math.max(a.t,b.t));
           if(intersect>1){check(false,'slot cards overlap '+i+' '+j);i=list.length;break}
         }
       }
       if(label==='stage'||label==='shop'||label==='layout'||label==='inventory'||label==='blueprint'){
         const tabs=[...document.querySelectorAll('#phone-app-construction .v88-decor-tabs button')].map(rect);
         check(tabs.length===4,'four tabs expected');
         for(let i=0;i<tabs.length;i++)for(let j=i+1;j<tabs.length;j++){
           const a=tabs[i],b=tabs[j];
           if(Math.max(0,Math.min(a.r,b.r)-Math.max(a.l,b.l))>2&&Math.max(0,Math.min(a.b,b.b)-Math.max(a.t,b.t))>2){check(false,'tabs overlap '+i+' '+j);break}
         }
       }
       return {screen:label,width:viewport.w,height:viewport.h,phone:box,content,cardCount:list.length,issues:checks};
     },name);
     records.push(report);
     if(report.issues.length)issues.push(report);
     await page.screenshot({path:`${dest}/${w}x${h}-${name}.png`,animations:'disabled',timeout:20000});
     console.log('VISUAL',w+'x'+h,name,report.issues.length?'ISSUES '+report.issues.join('; '):'GEOMETRY PASS', 'cards='+report.cardCount);
   }
   if(errors.length)issues.push({width:w,issues:errors});
 }catch(error){issues.push({width:w,issues:[String(error)]});}
 finally{await page.close()}
}
await browser.close();
writeFileSync(dest+'/geometry.json',JSON.stringify({records,issues},null,2));
assert.equal(issues.length,0,'Visual layout geometry issues: '+JSON.stringify(issues,null,2));
console.log('All viewport geometry smoke tests PASS; screenshot artifacts generated.');
