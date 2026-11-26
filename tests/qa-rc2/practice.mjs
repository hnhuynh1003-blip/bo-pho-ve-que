// Run RC2's trusted group input + whole practice on both isolated copies, with the full game.
import {readFileSync,writeFileSync,copyFileSync,mkdirSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {resolve} from 'node:path';
const engine=process.env.QA_ENGINE, dest='harness/tests/qa-rc2/generated',out=resolve('qa-evidence');
mkdirSync(dest,{recursive:true});mkdirSync(out,{recursive:true});
copyFileSync('source/tests/kitchen_test_helpers.mjs',dest+'/kitchen_test_helpers.mjs');
const results=[];
for(const variant of ['production','playtest']){
 let s=readFileSync('source/tests/test_rc2_practice_hit_v88.mjs','utf8');
 s=s.replaceAll("http://127.0.0.1:8765/","http://127.0.0.1:8765/"+variant+"/");
 s=s.replace(/await page\.route\('https:\/\/cdnjs\.cloudflare\.com\/\*\*',[^;]+;/g,"await page.route('**/*',r=>new URL(r.request().url()).origin==='http://127.0.0.1:8765'?r.continue():r.abort());");
 // Original test uses xp; also check real exp/level/SP.
 s=s.replace("gameState.reviews,gameState.xp]","gameState.reviews,gameState.exp,gameState.level,gameState.sp]");
 if(variant==='playtest')s=s.replace(/(await page\.goto\([^;]+?\);)/g,"$1\n await page.waitForFunction(()=>typeof bpvqCanWriteProfile==='function'&&bpvqCanWriteProfile()&&!!bpvqGameLoopTimer,null,{timeout:12000});");
 const file=resolve(dest+'/'+variant+'-practice-hit.mjs'),dir=resolve(out,variant+'-practice-hit');
 mkdirSync(dir,{recursive:true});writeFileSync(file,s);
 const r=spawnSync(process.execPath,[file],{cwd:dir,encoding:'utf8',timeout:360000,maxBuffer:8*1024*1024,env:{...process.env,BPVQ_QA_ENGINE:engine,BPVQ_QA_OUTPUT:dir}});
 const log=(r.stdout||'')+'\n'+(r.stderr||'')+'\n'+(r.error||'');
 console.log('PRACTICE_VARIANT',variant,log);
 writeFileSync(dir+'/result.log',log);
 results.push({variant,status:r.status===0?'PASS':r.error?'BLOCKED':'FAIL',exitCode:r.status});
}
writeFileSync(out+'/practice-results.json',JSON.stringify({target:process.env.TARGET_SHA,harness:process.env.GITHUB_SHA,engine,results},null,2));
if(results.some(r=>r.status!=='PASS'))process.exitCode=1;
