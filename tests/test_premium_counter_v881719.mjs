/* v88.17.1.9 — maintainable two-zone counter contract / no duplicated controls. */
import fs from 'node:fs';
import assert from 'node:assert/strict';
const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');
const html=read('index.html');
const view=read('js/v88-17-1-9-premium-counter.js');
const css=read('css/v88-17-1-9-premium-counter.css');
const game=read('js/v88-cooking-station.js');
const native=read('js/v88-17-1-7-counter-remake.js');
const oldCss=read('css/v88-17-1-8-kitchen-qa.css');
assert(html.includes('css/v88-17-1-9-premium-counter.css'));
assert(html.includes('js/v88-17-1-9-premium-counter.js'));
assert(html.indexOf('v88-17-1-7-counter-remake.js')<html.indexOf('v88-17-1-9-premium-counter.js'));
assert(html.indexOf('v88-17-1-8-kitchen-qa.css')<html.indexOf('v88-17-1-9-premium-counter.css'));
for(const term of ['stage.append(upper, bench)','top.append(train)','cp179-live-status','cp179-ticket-head','w.BPVQPremiumCounter179']) {
 assert(view.includes(term),'missing layout behavior '+term);
}
for(const term of [
 'grid-template-areas:"order bench"','grid-template-areas:"order" "bench"',
 '.cp176-idle','.cp177-result','display:none!important',
 'cs20-shelf .cs20-item[hidden]','#cs26-meters .cs26-range',
 'max-width:800px','max-width:425px','max-width:350px','prefers-reduced-motion'
]){
 assert(css.includes(term),'missing responsive/visibility contract '+term);
}
assert(view.includes('shell.insertBefore(originalOptions, nativeActions)'),'sugar/ice and timing must follow topping');
assert(!/cp179-taste|cp179-categories|cp179-result-head/.test(view),'removed duplicate interface was recreated');
assert(!/bridge\.deliver\(|saveGame\(|getProfileStorageKey|localStorage\.setItem|bridge\.choose\(/.test(view),'layout cannot mutate core game');
assert(/handoffHeld/.test(game)&&/if\(a==='take'\)/.test(game)&&/if\(a==='send'\)/.test(game));
assert(/bridge\.deliver\(\)/.test(game),'native game must own delivery');
assert(native.includes('cp177-pour-object')&&native.includes('cs20-primary'),'real pour control stays interactive');
assert(oldCss.includes('#cs20-shelf'),'native ingredient grid preserved');
for(const file of ['assets/images/v88/cute-premium/boba_backbar.webp','assets/images/v88/cute-premium/tea_dispenser.webp']) {
 assert(fs.existsSync(new URL('../'+file,import.meta.url)),'missing art '+file);
}
console.log('PASS 88.17.1.9 two-zone counter + mobile + native cooking');
