import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {isDeepStrictEqual as same} from 'node:util';
import {replaySnapshots} from './rebuild-utils.mjs';
const base='acceptance/20261016-hundred',oldRoot=`${base}/checkpoints/session-09/files`,root=`${base}/checkpoints/repair-at78/files`;
const read=p=>JSON.parse(fs.readFileSync(p,'utf8')),hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const before=read(`${oldRoot}/.writer/state.json`),after=read(`${root}/.writer/state.json`);assert.equal(before.units.length,78);assert.equal(after.units.length,78);
assert.equal(hash(`${base}/session-10/knowledge-repair/before/work/.writer/state.json`),hash(`${oldRoot}/.writer/state.json`),'Native repair must start at the actual completed78 version');
assert.deepEqual(before.units.slice(0,74),after.units.slice(0,74));assert.deepEqual(before.baseline,after.baseline);
for(let n=0;n<78;n++){assert.equal(before.units[n].sha256,after.units[n].sha256);assert.equal(hash(`${root}/${after.units[n].draft}`),after.units[n].sha256);}
const oldSnapshots=replaySnapshots(oldRoot,before),newSnapshots=replaySnapshots(root,after),changes=[];
const fields=s=>{const v=structuredClone(s);for(const entry of Object.values(v.ledger??{}))delete entry.evidence;return v;};
function diff(a,b,p=[]){if(same(a,b))return;const object=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);if(object(a)&&object(b)){for(const key of new Set([...Object.keys(a),...Object.keys(b)]))diff(a[key],b[key],[...p,key]);}else changes.push({path:p,before:a,after:b});}
const rows=[];for(let n=0;n<=78;n++){
 changes.length=0;diff(fields(oldSnapshots[n]),fields(newSnapshots[n]));
 if(n<75)assert.equal(changes.length,0,`Unexpected earlier snapshot change at ${n}`);
 for(const c of changes){assert(['characters/邹秀琴','ledger/T_ROUTE_TRIAL_73/character_known/邹秀琴'].includes(c.path.join('/')),`Unexpected semantic field ${n}:${c.path.join('/')}`);rows.push({unit:n,...structuredClone(c)});}
}
assert(rows.some(x=>x.unit===75&&x.path.join('/')==='characters/邹秀琴'));
let anchors=0;for(const[id,entry]of Object.entries(before.snapshot.ledger)){
 const current=after.snapshot.ledger[id];assert(current);assert.equal(current.type,entry.type);assert.equal(current.introduced_unit,entry.introduced_unit);assert.equal(current.due_unit,entry.due_unit);
 for(const e of entry.evidence??[]){const unit=after.units[e.unit-1],body=fs.readFileSync(`${root}/${unit.draft}`,'utf8'),at=body.indexOf(e.quote);assert(at>=0);assert(current.evidence.some(x=>x.unit===e.unit&&x.quote===e.quote&&x.sha256===unit.sha256&&x.line===body.slice(0,at).split(/\r?\n/).length));anchors++;}
}
const result={at:new Date().toISOString(),ok:true,scope:'Bounded structural proof only; every changed knowledge value still requires semantic reading',before_revision:before.revision,after_revision:after.revision,unchanged_bodies:78,prefix_registrations:74,unchanged_initial_snapshots:75,anchors_retained:anchors,changed_values:rows};
fs.mkdirSync(`${base}/intermediate-proofs`,{recursive:true});fs.writeFileSync(`${base}/intermediate-proofs/repair-at78.json`,JSON.stringify(result,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify({ok:true,revision:after.revision,anchors,changed_values:rows.length}));
