// Adapt only QA copies of the pinned existing browser tests; never change runtime.
import {readFileSync,writeFileSync,copyFileSync,mkdirSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {resolve} from 'node:path';
const engine=process.env.QA_ENGINE;
const dest='harness/tests/qa-native-save-phase-a/generated';
const evidence=resolve('qa-evidence');
mkdirSync(dest,{recursive:true});mkdirSync(evidence,{recursive:true});
copyFileSync('source/tests/kitchen_test_helpers.mjs',dest+'/kitchen_test_helpers.mjs');
const results=[];
for(const variant of ['production','playtest'])for(const test of ['test_save_upgrade_v88','test_kitchen_browser_v88']){
 let s=readFileSync('source/tests/'+test+'.mjs','utf8');
 // Restrict browser network to loopback, select native engine, wait for actual lock before game APIs.
 s=s.replaceAll("http://127.0.0.1:8765/","http://127.0.0.1:8765/"+variant+"/");
 s=s.replace(/await page\.route\('https:\/\/cdnjs\.cloudflare\.com\/\*\*',[^;]+;/g,"await page.route('**/*',r=>new URL(r.request().url()).origin==='http://127.0.0.1:8765'?r.continue():r.abort());");
 if(test==='test_save_upgrade_v88'){
   s=s.replace("import {chromium} from 'playwright';","import {chromium,webkit} from 'playwright';");
   s=s.replace("await chromium.launch({headless:true,args:['--no-sandbox']})","await (process.env.QA_ENGINE==='webkit'?webkit:chromium).launch(process.env.QA_ENGINE==='webkit'?{headless:true}:{headless:true,args:['--no-sandbox']})");
 }
 if(variant==='playtest'){
   s=s.replace(/(await page\.(?:goto|reload)\([^;]+?\);)/g,"$1\n await page.waitForFunction(()=>typeof bpvqCanWriteProfile==='function'&&bpvqCanWriteProfile()&&!!bpvqGameLoopTimer,null,{timeout:12000});");
 }
 const file=resolve(dest+'/'+variant+'-'+test+'.mjs');
 writeFileSync(file,s);
 const result=spawnSync(process.execPath,[file],{encoding:'utf8',timeout:240000,maxBuffer:8*1024*1024,env:{...process.env,BPVQ_KITCHEN_ENGINE:engine},cwd:evidence});
 const log=(result.stdout||'')+'\n'+(result.stderr||'')+'\n'+(result.error||'');
 writeFileSync(evidence+'/'+variant+'-'+test+'.log',log);
 console.log(log);
 results.push({variant,test,status:result.status===0?'PASS':result.error?'BLOCKED':'FAIL',exitCode:result.status});
}
writeFileSync(evidence+'/existing-results.json',JSON.stringify({engine,target:process.env.TARGET_SHA,harness:process.env.GITHUB_SHA,classification:'native browser; existing test copies, direct game state and timing instrumentation retained',results},null,2));
if(results.some(r=>r.status!=='PASS'))process.exitCode=1;
