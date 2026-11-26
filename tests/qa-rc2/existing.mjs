// QA-only adaptation of exact RC1 tests. Each career/grade has its own process.
import {readFileSync,writeFileSync,copyFileSync,mkdirSync} from 'node:fs';
import {spawn} from 'node:child_process';
import {resolve} from 'node:path';
const engine=process.env.QA_ENGINE;
const dest='harness/tests/qa-rc2/generated',evidence=resolve('qa-evidence');
mkdirSync(dest,{recursive:true});mkdirSync(evidence,{recursive:true});
copyFileSync('source/tests/kitchen_test_helpers.mjs',dest+'/kitchen_test_helpers.mjs');
const cases=[];
for(const variant of ['production','playtest']){
 cases.push({variant,test:'test_save_upgrade_v88',career:'all',grade:'upgrade'});
 for(const career of ['boba','noodle','streetfood'])for(const grade of ['perfect','good','bad','timeout','practice'])cases.push({variant,test:'test_kitchen_browser_v88',career,grade});
}
// Preserve the existing checks and helper, only filter loops and adapt origin/lock startup.
function transform(c){
 let s=readFileSync('source/tests/'+c.test+'.mjs','utf8');
 s=s.replaceAll("http://127.0.0.1:8765/","http://127.0.0.1:8765/"+c.variant+"/");
 s=s.replace(/await page\.route\('https:\/\/cdnjs\.cloudflare\.com\/\*\*',[^;]+;/g,"await page.route('**/*',r=>new URL(r.request().url()).origin==='http://127.0.0.1:8765'?r.continue():r.abort());");
 if(c.test==='test_save_upgrade_v88'){
   s=s.replace("import {chromium} from 'playwright';","import {chromium,webkit} from 'playwright';");
   s=s.replace("await chromium.launch({headless:true,args:['--no-sandbox']})","await (process.env.QA_ENGINE==='webkit'?webkit:chromium).launch(process.env.QA_ENGINE==='webkit'?{headless:true}:{headless:true,args:['--no-sandbox']})");
 }else{
   s=s.replace("for(const career of ['boba','noodle','streetfood'])for(const grade of ['perfect','good','bad','timeout'])","for(const career of "+JSON.stringify(c.grade==='practice'?[]:[c.career])+")for(const grade of "+JSON.stringify([c.grade])+")");
   s=s.replace("for(const career of ['boba','noodle','streetfood']){","for(const career of "+JSON.stringify(c.grade==='practice'?[c.career]:[]) +"){");
   s=s.replaceAll("reviews:gameState.reviews.length","exp:gameState.exp,level:gameState.level,sp:gameState.sp,reviews:gameState.reviews.length");
   s=s.replace("assert.equal(await page.evaluate(()=>gameState.coins),after.coins);","assert.deepEqual(await page.evaluate(()=>({coins:gameState.coins,exp:gameState.exp,level:gameState.level,sp:gameState.sp,inventory:JSON.stringify(gameState.inventory),reviews:gameState.reviews.length})),{coins:after.coins,exp:after.exp,level:after.level,sp:after.sp,inventory:after.inventory,reviews:after.reviews},'no duplicate Xu/XP/stock/review');");
   s=s.replaceAll("gameState.inventory,gameState.reviews]","gameState.inventory,gameState.reviews,gameState.exp,gameState.level,gameState.sp]");
   s=s.replace("await page.close();\n }\n}finally","await page.close();console.log('PASS practice '+career);\n }\n}finally");
 }
 if(c.variant==='playtest')s=s.replace(/(await page\.(?:goto|reload)\([^;]+?\);)/g,"$1\n await page.waitForFunction(()=>typeof bpvqCanWriteProfile==='function'&&bpvqCanWriteProfile()&&!!bpvqGameLoopTimer,null,{timeout:12000});");
 return s;
}
const results=[];
async function execute(c){
 const name=[c.variant,c.career,c.grade].join('-'),dir=resolve(evidence,name);
 mkdirSync(dir,{recursive:true});
 const file=resolve(dest+'/'+name+'.mjs');
 writeFileSync(file,transform(c));
 const result=await new Promise(done=>{
   const child=spawn(process.execPath,[file],{cwd:dir,env:{...process.env,BPVQ_KITCHEN_ENGINE:engine}});
   let log='',timed=false;
   child.stdout.on('data',b=>log+=b);child.stderr.on('data',b=>log+=b);
   const timer=setTimeout(()=>{timed=true;child.kill('SIGKILL')},110000);
   child.on('error',e=>{clearTimeout(timer);done({status:'BLOCKED',log:log+e})});
   child.on('close',code=>{clearTimeout(timer);done({status:timed?'BLOCKED':code===0?'PASS':'FAIL',log,code})});
 });
 writeFileSync(dir+'/result.log',result.log);
 console.log(result.status,name,result.log);
 results.push({...c,status:result.status,exitCode:result.code});
}
for(let i=0;i<cases.length;i+=2)await Promise.all(cases.slice(i,i+2).map(execute));
writeFileSync(evidence+'/existing-results.json',JSON.stringify({engine,target:process.env.TARGET_SHA,harness:process.env.GITHUB_SHA,classification:'native browser with synthetic setup/direct state and deterministic timing instrumentation retained',results},null,2));
if(results.some(r=>r.status!=='PASS'))process.exitCode=1;
