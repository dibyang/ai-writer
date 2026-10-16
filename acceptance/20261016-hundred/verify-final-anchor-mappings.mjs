import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {replaySnapshots} from './rebuild-utils.mjs';
const base='acceptance/20261016-hundred',read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
function load(label){const root=`${base}/checkpoints/${label}/files`,state=read(`${root}/.writer/state.json`);return{root,state,snapshots:replaySnapshots(root,state)};}
const a=load('session-13'),b=load('final-review');assert(read(`${base}/final-invariants-proof.json`).ok);
const pairs=[
 {id:'T_RO_VISIT_93',unit:94,old_quote:'九点五十八，他们在楼下分路。',new_quote:'九点五十八，他们在门外分路。',parent_judgment:'Flat-house location corrected; no relocation or new stairs introduced. Parent completely read final chapter94.'},
 {id:'P_QIU_WORK_PAGES',unit:95,old_quote:'第三十一章两页仍在下柜透明盒',new_quote:'后来新印的缺名两页仍在下柜透明盒',parent_judgment:'Author chapter number replaced with in-world identification; the same two pages remain in the same lower-cabinet box. Parent completely read final chapter95.'}
];
for(const p of pairs){
 p.before=a.state.snapshot.ledger[p.id].evidence.find(e=>e.unit===p.unit&&e.quote===p.old_quote);assert(p.before);
 p.after=b.state.snapshot.ledger[p.id].evidence.find(e=>e.unit===p.unit&&e.quote===p.new_quote);assert(p.after);
 const u=b.state.units[p.unit-1];assert.equal(p.after.sha256,u.sha256);assert.equal(p.after.draft,u.draft);
 assert(fs.readFileSync(path.join(b.root,u.draft),'utf8').split(/\r?\n/)[p.after.line-1].includes(p.new_quote));
 p.bound_snapshots=[];for(let n=0;n<=100;n++){if(!(a.snapshots[n].ledger?.[p.id]?.evidence??[]).some(e=>e.unit===p.unit&&e.quote===p.old_quote))continue;assert(b.snapshots[n].ledger[p.id].evidence.some(e=>e.unit===p.unit&&e.quote===p.new_quote&&e.sha256===u.sha256));p.bound_snapshots.push(n);}
}
const key=(id,e)=>JSON.stringify([id,e.unit,e.quote]),oldKeys=new Set(),newKeys=new Set(pairs.map(p=>key(p.id,{unit:p.unit,quote:p.new_quote})));
let beforeTotal=0,unchanged=0,afterTotal=0;const added=[];
for(const[id,entry]of Object.entries(a.state.snapshot.ledger))for(const e of entry.evidence??[]){beforeTotal++;oldKeys.add(key(id,e));if(pairs.some(p=>p.id===id&&p.unit===e.unit&&p.old_quote===e.quote))continue;const u=b.state.units[e.unit-1];assert(b.state.snapshot.ledger[id].evidence.some(x=>x.unit===e.unit&&x.quote===e.quote&&x.sha256===u.sha256));unchanged++;}
for(const[id,entry]of Object.entries(b.state.snapshot.ledger))for(const e of entry.evidence??[]){afterTotal++;if(!oldKeys.has(key(id,e))&&!newKeys.has(key(id,e)))added.push({id,...e});}
assert.equal(beforeTotal,unchanged+pairs.length);assert.equal(afterTotal,unchanged+pairs.length+added.length);
const result={at:new Date().toISOString(),ok:true,scope:'Two intentional quotation replacements manually reviewed against final complete chapters and bound in every affected snapshot. This precisely distinguishes unchanged quote text from continued citation identity.',before_anchors:beforeTotal,unchanged_quote_contents:unchanged,intentional_replacements:pairs.length,new_anchors:added.length,after_anchors:afterTotal,pairs,added};
fs.writeFileSync(`${base}/final-anchor-mapping-proof.json`,JSON.stringify(result,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify({ok:true,before:beforeTotal,unchanged,replacements:pairs.length,new:added.length,after:afterTotal}));
