// Legacy 1.2 artwork compatibility test, updated for the approved 1.8 full layout replacement.
import assert from 'node:assert/strict';
import fs from 'node:fs';
const html=fs.readFileSync('index.html','utf8');
const js=fs.readFileSync('js/v88-cooking-station.js','utf8');
const art=fs.readFileSync('assets/images/v88/cute-premium/boba-backbar.svg','utf8');
const black=fs.readFileSync('assets/images/v88/cute-premium/tea-black-clean.svg','utf8');
for(const id of ['cs20-station','cs20-visual','cs20-shelf','cs20-primary','cs20-undo','cs20-sale-price','cs20-gauge','cs33-order-summary'])
 assert.equal((html.match(new RegExp('id="'+id+'"','g'))||[]).length,1,'keep unique original gameplay id '+id);
assert.ok(html.includes('css/v88-17-1-8-kitchen-qa.css?v=88.17.1.8'));
assert.ok(!html.includes('cp171-backbar" aria-hidden="true"'),'do not restore duplicate kitchen backdrop');
assert.ok(fs.existsSync('assets/images/v88/cute-premium/boba_backbar.webp'),'approved new AI backbar retained');
assert.ok(js.includes("tea_black:'v88/cute-premium/tea-black-clean.svg'"));
assert.ok(!js.includes("tea_black:'057_tea-black"));
assert.ok(art.includes('<svg')&&art.includes('linearGradient')&&art.includes('filter'),'legacy art remains available without occupying UI');
assert.ok(black.includes('viewBox="0 0 160 160"'));
assert.ok(!js.includes('BPVQPremiumBobaSettlement'),'single native settlement owner');
console.log('PASS legacy layered art retained, no duplicate backbar, same 3-career native IDs and settlement');
