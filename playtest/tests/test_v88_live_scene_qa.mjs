// v88.12.1 regression: the Quán screen MUST contain a visible, interactive B1 draft preview.
// This does not approve artwork or alter the production scene registry.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const read=p=>fs.readFileSync(p,'utf8');
const index=read('index.html');
assert.ok(index.indexOf('id="v88-live-scene"')>index.indexOf('id="tab-shop"'));
assert.ok(index.indexOf('id="v88-live-scene"')<index.indexOf('id="v8745-contest"'));
assert.ok(index.includes('js/v88-live-scene-qa.js')&&index.includes('css/v88-live-scene-qa.css'));
const colors=['original','cream','vanilla','rose','sage','honey'];
for(const c of colors){
 const f='assets/images/v88/qa/boba-b1-'+c+'.webp';
 const b=fs.readFileSync(f);
 assert.equal(b.toString('ascii',0,4),'RIFF',f);
 assert.equal(b.toString('ascii',8,12),'WEBP',f);
 assert.ok(b.length>100_000,'QA image must contain real source art '+f);
}
const noodleImage=fs.readFileSync('assets/images/v88/qa/noodle-b1-reused.webp');
assert.equal(noodleImage.toString('ascii',8,12),'WEBP');
assert.ok(noodleImage.length>100_000,'restored noodle cart contains actual art');
const b=fs.readFileSync('assets/images/v88/qa/streetfood-b1-reused.webp');
assert.equal(b.toString('ascii',8,12),'WEBP');
assert.ok(b.length>100_000,'restored streetfood cart contains actual art');
const regCtx={window:{}};
vm.runInNewContext(read('js/v88-shop-scenes.js'),regCtx);
assert.equal(regCtx.window.BPVQShopScenesV88.get('boba',1).isReady,false,
 'Draft QA image must never auto-approve a scene');
assert.equal(regCtx.window.BPVQShopScenesV88.diagnostics().ready,0);
function el(){return {children:[],attrs:{},dataset:{},style:{},listeners:{},textContent:'',hidden:false,
 append(...items){this.children.push(...items)},replaceChildren(){this.children=[]},
 setAttribute(k,v){this.attrs[k]=v},addEventListener(k,fn){this.listeners[k]=fn},
 classList:{toggle(){},add(){},remove(){}}};}
const ids=['v88-live-scene','v88-live-frame','v88-live-image','v88-live-palette',
 'v88-live-shop-sign','v88-live-markers','v88-live-supported','v88-live-other-career',
 'v88-live-toggle-slots','v88-live-go-decor','v88-live-hide'];
const nodes=Object.fromEntries(ids.map(id=>[id,el()]));
const shop={shopName:'Trà B1 QA',currentCareer:'boba',shopStage:0,coins:450,sp:5,
 decorations:['flower_corner'],decorV88:{placements:{S14:'flower_corner'}}};
const before=JSON.stringify(shop);
const doc={getElementById:id=>nodes[id],createElement:()=>el(),createTextNode:t=>({textContent:t})};
const ctx={document:doc,gameState:shop,window:{sessionStorage:{getItem:()=>null,setItem(){}},
 setInterval:()=>0,BPVQDecorV88:{snapshot:()=>({active:{S14:'flower_corner'}})},
 openSmartPhoneModal(){},VillageOS:{open(){}},BPVQReborn:{constructionTab(){}}}};
vm.runInNewContext(read('js/v88-live-scene-qa.js'),ctx);
const api=ctx.window.BPVQLiveSceneQA;
assert.ok(api&&api.status().previewOnly);
assert.equal(nodes['v88-live-shop-sign'].textContent,'Trà B1 QA');
assert.equal(nodes['v88-live-palette'].children.length,6);
api.setColor('rose');
assert.ok(nodes['v88-live-image'].src.endsWith('boba-b1-rose.webp'));
nodes['v88-live-toggle-slots'].listeners.click();
assert.equal(nodes['v88-live-markers'].children.length,5,'five purchasable slots + dynamic S1 sign');
assert.equal(nodes['v88-live-markers'].children.filter(x=>x.className.includes('v88-filled')).length,1);
assert.equal(JSON.stringify(shop),before,'QA interactions must not mutate gameState');
shop.currentCareer='noodle';api.update();
assert.equal(nodes['v88-live-supported'].hidden,false,'restored noodle scene is supported');
assert.ok(nodes['v88-live-image'].src.endsWith('noodle-b1-reused.webp'),'no boba cart for noodle');
shop.currentCareer='streetfood';api.update();
assert.ok(nodes['v88-live-image'].src.endsWith('streetfood-b1-reused.webp'),'skewers use their own old cart');
api.setColor('cream');
assert.ok(nodes['v88-live-image'].src.endsWith('streetfood-b1-reused.webp'),'boba palette cannot repaint other careers');
shop.currentCareer='boba';api.update();
assert.ok(nodes['v88-live-image'].src.endsWith('boba-b1-cream.webp'),'boba palette is retained independently');
shop.currentCareer='boba';
assert.equal(JSON.stringify(shop),before,'restoring career art cannot mutate save');
console.log('v88.12.1 LIVE SCENE QA: 6 real images, player name, 5 decor markers + S1, career guard, immutable save PASS');

