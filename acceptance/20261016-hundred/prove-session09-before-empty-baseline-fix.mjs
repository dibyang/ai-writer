import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {replaySnapshots} from './rebuild-utils.mjs';
const base='acceptance/20261016-hundred',phase=`${base}/session-09`,oldRoot=`${phase}/continuity-repair/before/work`,root=`${base}/checkpoints/session-09/files`;
const read=p=>JSON.parse(fs.readFileSync(p,'utf8')),sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const before=read(`${oldRoot}/.writer/state.json`),after=read(`${root}/.writer/state.json`);
assert.equal(before.units.length,78);assert.equal(after.units.length,78);assert.equal(after.revision,258);
assert.deepEqual(before.units.slice(0,74),after.units.slice(0,74));assert.deepEqual(before.baseline,after.baseline);
const changed=[];for(let n=1;n<=78;n++){
 const old=fs.readFileSync(`${oldRoot}/${before.units[n-1].draft}`,'utf8'),now=fs.readFileSync(`${root}/${after.units[n-1].draft}`,'utf8');
 assert.equal(sha(`${oldRoot}/${before.units[n-1].draft}`),before.units[n-1].sha256);assert.equal(sha(`${root}/${after.units[n-1].draft}`),after.units[n-1].sha256);
 if(old!==now){assert.equal(n,75);assert(old.includes('昨天那团软纸'));assert.equal(now,old.replace('昨天那团软纸','前日那团软纸'));changed.push(n);}
}
assert.deepEqual(changed,[75]);
const strip=s=>{const v=structuredClone(s);for(const e of Object.values(v.ledger))delete e.evidence;return v;};
const oldSnapshots=replaySnapshots(oldRoot,before),newSnapshots=replaySnapshots(root,after);
assert.equal(oldSnapshots.length,79);assert.equal(newSnapshots.length,79);
for(let n=0;n<=78;n++)assert.deepEqual(strip(oldSnapshots[n]),strip(newSnapshots[n]),`Non-evidence semantic difference at ${n}`);
let anchors=0;for(const[id,entry]of Object.entries(before.snapshot.ledger)){
 const current=after.snapshot.ledger[id];assert(current);assert.equal(current.type,entry.type);assert.equal(current.introduced_unit,entry.introduced_unit);assert.equal(current.due_unit,entry.due_unit);
 for(const e of entry.evidence??[]){const unit=after.units[e.unit-1],body=fs.readFileSync(`${root}/${unit.draft}`,'utf8'),at=body.indexOf(e.quote);assert(at>=0,`${id}/${e.unit} quote`);assert(current.evidence.some(x=>x.unit===e.unit&&x.quote===e.quote&&x.sha256===unit.sha256&&x.line===body.slice(0,at).split(/\r?\n/).length));anchors++;}
}
const result={at:new Date().toISOString(),ok:true,scope:'Independent date-word repair verification; unchanged metadata is not semantic approval of the existing chapter75 knowledge issue',before_revision:before.revision,after_revision:after.revision,prefix_registrations_unchanged:74,changed_bodies:changed,per_unit_non_evidence_snapshots_equal:79,anchors_retained:anchors};
fs.writeFileSync(`${phase}/parent-date-repair-proof.json`,JSON.stringify(result,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify(result));
