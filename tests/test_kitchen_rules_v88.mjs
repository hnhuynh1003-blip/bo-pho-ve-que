import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const env={window:{}};vm.runInNewContext(readFileSync('js/v88-kitchen-play.js','utf8'),env);
function session(career){
 let clock=0;const commits=[];
 const c={career,person:{id:1},dish:career==='noodle'?{container:'bowl_m',base:'broth_kimchi',spicyLevel:2,toppings:['ntop_beef'],toppingPortions:{ntop_beef:2}}:{tray:'plate',sauce:'sauce_sweet_chili',skewerCounts:{skewer_fish:2}},phase:'open',patience:180,paused:false,hidden:false};
 const api=env.window.BPVQKitchenPlay.create({context:()=>c,now:()=>clock,onFinish:(g,s)=>commits.push([g,s.elapsed])});
 const advance=seconds=>{for(let n=0;n<Math.round(seconds*20);n++){clock+=50;api.snapshot();}return api.snapshot();};
 return {c,api,advance,commits};
}
for(const career of ['noodle','streetfood']){
 const {c,api,advance,commits}=session(career);
 assert.equal(api.action('begin'),true);
 for(let n=0;n<100;n++){api.action('begin');api.action('finish');api.action(career==='noodle'?'stir':'flip');}
 assert.equal(api.snapshot().elapsed,0);assert.equal(api.ready(),false);assert.equal(commits.length,0,'click spam cannot cook or finish');
 advance(.6);const before=api.snapshot();c.paused=true;advance(8);
 assert.equal(api.snapshot().elapsed,before.elapsed);assert.equal(api.action('flame'),false,'paused actions rejected');
 c.paused=false;advance(.05);assert.equal(api.snapshot().elapsed,before.elapsed,'resume cannot catch up hidden time');
 c.hidden=true;advance(8);assert.equal(api.snapshot().elapsed,before.elapsed);c.hidden=false;advance(.05);
 c.dish=JSON.parse(JSON.stringify(c.dish));assert.equal(api.snapshot().stage,'choose','new dish object invalidates proof');
 assert.equal(api.ready(),false);
}
for(const container of ['bowl_m','bowl_l','bowl_xl']){
 const {c,api,advance,commits}=session('noodle');c.dish.container=container;api.action('begin');
 assert.equal(api.action('drop'),false);while(!api.snapshot().canDrop)advance(.05);
 assert.equal(api.action('drop'),true);api.action('flame',2);api.action('stir');
 while(api.snapshot().cook<100||!api.snapshot().canFinish){assert.notEqual(api.snapshot().stage,'failed');advance(.05);}
 assert.equal(api.snapshot().canFinish,true);assert.equal(api.action('finish'),true);assert.equal(api.snapshot().grade,'perfect');
 assert.ok(commits[0][1]>=6&&commits[0][1]<=9,'noodle takes real6–9sec');
 assert.equal(api.action('finish'),false);assert.equal(commits.length,1,'completion one-shot');
 c.dish.toppingPortions.ntop_beef=3;assert.equal(api.ready(),false,'ingredient changes invalidate completed dish');
}
{
 const {api,advance}=session('noodle');api.action('begin');while(!api.snapshot().canDrop)advance(.05);api.action('drop');advance(5);
 assert.equal(api.snapshot().stage,'failed');assert.equal(api.ready(),false,'unattended high fire overflows');
}
{
 const {api,advance,commits}=session('streetfood');api.action('begin');advance(3.9);api.action('flip');advance(2.9);api.action('sauce');advance(1);
 assert.equal(api.action('finish'),true);assert.equal(api.snapshot().grade,'perfect');assert.equal(commits[0][0],'perfect');assert.ok(commits[0][1]>=7&&commits[0][1]<=10);
}
{
 const {api,advance}=session('streetfood');api.action('begin');api.action('flip');advance(3.9);api.action('flip');advance(2.9);api.action('sauce');advance(1);
 assert.equal(api.action('finish'),true);assert.equal(api.snapshot().grade,'good','early flipping loses Perfect but can recover');
}
{
 const {api,advance}=session('streetfood');api.action('begin');api.action('sauce');api.action('flame',3);advance(5);
 assert.equal(api.snapshot().stage,'failed');assert.equal(api.ready(),false,'early glaze at high heat burns');
}
{
 const low=session('streetfood'),high=session('streetfood');low.api.action('begin');high.api.action('begin');low.api.action('flame',1);high.api.action('flame',3);low.advance(1);high.advance(1);
 assert.ok(high.api.snapshot().a>low.api.snapshot().a*2,'fire affects actual doneness');
}
for(const career of ['noodle','streetfood']){
 const {c,api,advance,commits}=session(career);api.action('begin');advance(.6);
 assert.equal(api.action('lift'),true,'may stop before ready');
 const frozen=api.snapshot();advance(10);
 for(const key of ['elapsed','cook','heat','a','b','overflow','glaze'])assert.equal(api.snapshot()[key],frozen[key],key+' stays fixed off heat');
 assert.equal(api.action('finish'),false,'lifting raw food never authorizes serving');assert.equal(commits.length,0);
 assert.equal(api.action('return'),true);advance(.5);assert.ok(api.snapshot().elapsed>frozen.elapsed,'return continues same session');
 c.paused=true;assert.equal(api.action('lift'),false);c.paused=false;c.hidden=true;assert.equal(api.action('lift'),false);c.hidden=false;
 api.action('lift');c.person={id:2};assert.equal(api.snapshot().stage,'choose','customer change invalidates held food');
}
{
 const {api,advance,commits}=session('noodle');api.action('begin');while(!api.snapshot().canDrop)advance(.05);
 api.action('drop');api.action('flame');assert.equal(api.snapshot().flame,2,'one tap lowers high fire to medium');
 while(api.snapshot().cook<100||api.snapshot().elapsed<6)advance(.05);
 assert.equal(api.action('lift'),true);assert.equal(api.snapshot().stage,'held','missing stir may finish off heat');
 assert.equal(api.action('stir'),true);assert.equal(api.action('stir'),false);assert.equal(api.snapshot().canFinish,true);
 assert.equal(api.action('finish'),true);assert.equal(api.ready(),true);assert.equal(commits.length,1);
 assert.equal(api.action('lift'),false);assert.equal(api.action('return'),false);
}
{
 const {api,advance,commits}=session('noodle');api.action('begin');while(!api.snapshot().canDrop)advance(.05);
 api.action('drop');api.action('flame',2);api.action('stir');while(!api.snapshot().canFinish||api.snapshot().cook<99)advance(.05);
 assert.equal(api.action('lift'),true);assert.equal(api.snapshot().stage,'done','ready food finishes on lifting');assert.equal(api.snapshot().grade,'perfect');
 const frozen=api.snapshot();advance(10);assert.equal(api.snapshot().cook,frozen.cook);assert.equal(commits.length,1);
}
{
 const {api,advance,commits}=session('streetfood');api.action('begin');advance(3.9);api.action('flip');advance(3.9);
 assert.equal(api.action('lift'),true);assert.equal(api.snapshot().stage,'held');const frozen=api.snapshot();advance(10);
 assert.equal(api.snapshot().b,frozen.b);assert.equal(api.action('flip'),false,'plate cannot receive grill heat or flip');
 assert.equal(api.action('sauce'),true);assert.equal(api.action('finish'),false,'sauce must settle');advance(.6);
 assert.equal(api.snapshot().a,frozen.a);assert.equal(api.snapshot().b,frozen.b);assert.equal(api.snapshot().glaze,0,'sauce cannot scorch on plate');
 assert.equal(api.action('finish'),true);assert.equal(api.snapshot().grade,'perfect');assert.equal(commits.length,1);
}
console.log('PASS kitchen rules: timed cooking, off-heat preservation/return, stir and sauce off heat, readiness gates, pause/edit and one-shot completion');
