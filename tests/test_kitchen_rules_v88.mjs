import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const env={window:{}};vm.runInNewContext(readFileSync('js/v88-kitchen-play.js','utf8'),env);
function session(career){let clock=0;const commits=[];const c={career,person:{id:1},dish:{container:'bowl_m',base:'broth_kimchi',sugar:70,ice:50,toppings:['ntop_beef'],toppingPortions:{ntop_beef:2},tray:'plate',sauce:'sauce_sweet_chili',skewerCounts:{skewer_fish:2}},phase:'open',patience:180,paused:false,hidden:false};
const api=env.window.BPVQKitchenPlay.create({context:()=>c,now:()=>clock,onFinish:g=>commits.push(g)});
const advance=n=>{for(let i=0;i<Math.round(n*100);i++){clock+=10;api.snapshot();}};
const play=grade=>{let guard=0;while(api.snapshot().stage==='warming'){assert.ok(++guard<1000);advance(.01);}if(grade==='timeout'){advance(10.1);return;}const p=grade==='perfect'?50:grade==='good'?36:5;while(api.snapshot().position<p){assert.ok(++guard<2000);advance(.01);}assert.equal(api.action('hit'),true);};return {c,api,advance,play,commits};}
for(const career of ['boba','noodle','streetfood'])for(const grade of ['perfect','good','bad','timeout']){
 const {c,api,advance,play,commits}=session(career);assert.equal(api.action('begin'),true);assert.equal(api.action('begin'),false);assert.equal(api.action('finish'),false);
 play(grade);if(career==='streetfood'){assert.equal(api.snapshot().stage,'warming');assert.equal(api.action('flip'),false);play(grade);assert.equal(api.snapshot().stage,'plating');api.action('sauce');api.action('lift');}
 assert.equal(api.ready(),true,`${career}/${grade} can finish`);assert.equal(api.snapshot().grade,grade==='timeout'?'bad':grade);assert.equal(commits.length,1);
 const done=JSON.stringify(api.snapshot());advance(20);assert.equal(JSON.stringify(api.snapshot()),done,'finished result freezes');assert.equal(api.action('hit'),false);assert.equal(api.action('begin'),false);
 const saved=api.exportState();api.reset();assert.equal(api.restore(saved),true);assert.equal(api.snapshot().grade,grade==='timeout'?'bad':grade);assert.equal(commits.length,1,'restore does not award again');
 c.dish.base='different';assert.equal(api.ready(),false,'changed contents invalidate proof');
}
for(const a of ['perfect','good','bad'])for(const b of ['perfect','good','bad']){const {api,play}=session('streetfood');api.action('begin');play(a);const saved=api.exportState();api.reset();assert.equal(api.restore(saved),true);play(b);api.action('sauce');api.action('lift');assert.equal(api.snapshot().grade,[a,b].includes('bad')?'bad':a===b&&a==='perfect'?'perfect':'good');}
for(const career of ['boba','noodle','streetfood']){
 const {c,api,advance}=session(career);api.action('begin');advance(.5);const before=api.snapshot();c.paused=true;advance(20);assert.equal(api.snapshot().elapsed,before.elapsed);assert.equal(api.action('hit'),false);c.paused=false;advance(.01);assert.equal(api.snapshot().elapsed,before.elapsed);c.hidden=true;advance(20);assert.equal(api.snapshot().elapsed,before.elapsed);c.hidden=false;advance(.01);
 const saved=api.exportState();api.reset();c.person={id:2};assert.equal(api.restore(saved),true);const restored=api.snapshot().elapsed;advance(.01);assert.ok(api.snapshot().elapsed-restored<.02,'no offline catch-up');c.person={id:3};assert.equal(api.ready(),false);assert.equal(api.snapshot().stage,'choose');
}
{const {api,play}=session('streetfood');api.action('begin');play('perfect');play('perfect');api.action('lift');assert.equal(api.ready(),true,'missing sauce still handable');assert.equal(api.snapshot().grade,'good','missing sauce cannot get Perfect');}
console.log('PASS 3 careers × 4 outcomes, 9 face combinations, frozen completion, serialization, pause/hidden and invalidation');
