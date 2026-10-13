// Contract originally introduced in v88.17.1.7, retained after the v88.17.1.8 art/layout QA correction.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import './test_counter_layout_v881718.mjs';
const js=readFileSync('js/v88-17-1-7-counter-remake.js','utf8');
const native=readFileSync('js/v88-cooking-station.js','utf8');
assert.match(js,/const marker=document\.createComment/);
assert.match(js,/insertBefore\(el,marker\)/);
assert.ok(js.includes("['.cs20-pantry','.cp177-pantry-slot']"));
assert.match(js,/if\(action==='pour'\)\$\('cs20-primary'\)\?\.click\(\)/);
assert.ok(js.includes('cloneFinishedCup()'));
assert.ok(native.includes('paintDetailedToppings(visual,d)'));
console.log('PASS inherited v88.17.1.7 native gameplay contract after 1.8 layout replacement');