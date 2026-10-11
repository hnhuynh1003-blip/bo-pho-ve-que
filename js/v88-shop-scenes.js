/* Bỏ Phố Về Quê v88 — reviewed visual asset registry.
 * This is a data contract, not a graphics generator and not another Phone OS patch.
 * Ownership, economy, stage progress and saves are never read or written by this module.
 * Do NOT put concept collages into game art slots.
 */
(function(w){
  'use strict';
  const careers=Object.freeze(['boba','noodle','streetfood']);
  const unlock=Object.freeze({
    S1:1,S2:2,S3:3,S4:4,S5:1,S6:1,S7:2,S8:1,S9:2,S10:4,
    S11:1,S12:4,S13:6,S14:1,S15:3,S16:5,S17:7,S18:5,
    S19:6,S20:7,S21:8,S22:8,S23:9,S24:9
  });
  const slotNames=Object.freeze(Object.keys(unlock));
  // No production architecture shells have been reviewed/linked in this repo.
  // Each record can be filled only after the respective clean art is approved.
  // image: local filename; anchors: normalized (0..1) object keyed by S1..S24.
  // Must use 1:1 matching between visual shell and its 24 stage-specific anchors.
  const spec=Object.freeze(careers.flatMap(career=>
    Array.from({length:9},(_,i)=>{
      const tier=i+1;
      return Object.freeze({
        id:career+'-b'+tier,career,tier,
        artwork:null,
        anchors:Object.freeze({}),
        approved:false,
        artReview:'pending',
        lockDesign:tier===9,
        pendingReason:'Cần shell sạch được duyệt và đo anchor trên ảnh đúng bậc.'
      });
    })
  ));
  const lookup=new Map(spec.map(x=>[x.id,x]));
  function stageSlots(tier){
    const number=Number(tier);
    if(!Number.isInteger(number)||number<1||number>9)return [];
    return slotNames.filter(id=>unlock[id]<=number);
  }
  function validAssetPath(path,id){
    if(typeof path!=='string'||!path)return false;
    // Whitelist project-local reviewed shell paths only; never remote or data URLs.
    return new RegExp('^assets/images/v88/shops/'+id+'\\.(?:webp|png)$').test(path);
  }
  function validate(record){
    const reasons=[];
    if(!record||!careers.includes(record.career)||!Number.isInteger(record.tier)||record.tier<1||record.tier>9){
      return Object.freeze({ready:false,reasons:['Invalid scene record']});
    }
    const id=record.career+'-b'+record.tier;
    if(record.id!==id)reasons.push('ID must match career/tier');
    if(record.artReview!=='approved'||record.approved!==true)reasons.push('Shell art not approved');
    if(!validAssetPath(record.artwork,id))reasons.push('Missing approved local shell asset');
    const used=stageSlots(record.tier);
    if(!record.anchors||typeof record.anchors!=='object')reasons.push('Anchors missing');
    else {
      const keys=Object.keys(record.anchors);
      for(const slot of used){
        const pin=record.anchors[slot];
        if(!pin||![pin.x,pin.y].every(n=>typeof n==='number'&&Number.isFinite(n)&&n>=0&&n<=1)||!Number.isInteger(pin.layer)||pin.layer<0||pin.layer>20){
          reasons.push('Unmeasured/invalid anchor '+slot);
        }
      }
      for(const id of keys)if(!used.includes(id))reasons.push('Anchor for a locked or unknown slot '+id);
    }
    return Object.freeze({ready:reasons.length===0,reasons:Object.freeze(reasons)});
  }
  function byId(career,tier){
    const n=Number(tier);
    return Number.isInteger(n)?lookup.get(career+'-b'+n)||null:null;
  }
  function resolve(career,tier){
    const item=byId(career,tier);
    if(!item)return null;
    const validity=validate(item);
    return Object.freeze({
      id:item.id,career:item.career,tier:item.tier,
      artwork:validity.ready?item.artwork:null,
      anchors:validity.ready?item.anchors:null,
      isReady:validity.ready,
      state:validity.ready?'approved-production-asset':'awaiting-approved-shell',
      reasons:validity.reasons,lockedDesign:item.lockDesign
    });
  }
  function diagnostics(){
    return Object.freeze({
      total:spec.length,
      ready:spec.filter(x=>validate(x).ready).length,
      pending:spec.filter(x=>!validate(x).ready).length,
      careers:careers.slice(),
      lockedB9:spec.filter(x=>x.lockDesign).map(x=>x.id)
    });
  }
  w.BPVQShopScenesV88=Object.freeze({
    catalog:()=>spec.slice(),get:resolve,stageSlots,validate,diagnostics
  });
})(window);
