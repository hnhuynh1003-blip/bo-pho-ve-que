/* Bỏ Phố Về Quê v88 — dynamic shop-name plaque at approved S1 anchor.
 * Display-only component: never touches save/economy, never draws over draft art.
 * Requires a truly approved game shell with measured S1 position.
 */
(function(w){
 'use strict';
 const CAREERS=Object.freeze({boba:'Quán Trà Sữa',noodle:'Quán Mì Cay',streetfood:'Quán Xiên Que'});
 const escape=v=>String(v).replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));
 function title(name,career){
   const fallback=CAREERS[career]||'Quán Nhà Mình';
   const value=String(name??'').replace(/[\u0000-\u001f\u007f]/g,' ').replace(/\s+/g,' ').trim().slice(0,32);
   return value||fallback;
 }
 function measuredS1(scene){
   if(!scene?.isReady||!scene.anchors||typeof scene.anchors!=='object')return null;
   const p=scene.anchors.S1;
   if(!p||![p.x,p.y].every(n=>typeof n==='number'&&Number.isFinite(n)&&n>=0&&n<=1)||!Number.isInteger(p.layer)||p.layer<0||p.layer>20)return null;
   return {x:p.x,y:p.y,layer:p.layer};
 }
 function render(scene,shopName){
   const p=measuredS1(scene);
   if(!p)return '';
   const label=title(shopName,scene.career);
   return `<span class="v88-arch-shop-sign" role="img" aria-label="Biển hiệu: ${escape(label)}" data-v88-shop-sign="S1" style="left:${p.x*100}%;top:${p.y*100}%;z-index:${p.layer}"><span class="v88-arch-sign-name">${escape(label)}</span></span>`;
 }
 w.BPVQShopSignV88=Object.freeze({render,normalizeName:title,validS1:measuredS1});
})(window);
