import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { replaySnapshots } from './rebuild-utils.mjs';
const base='acceptance/20261016-hundred',read=p=>JSON.parse(fs.readFileSync(p,'utf8')),hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
function load(label){const work=path.join(base,'checkpoints',label,'files'),state=read(path.join(work,'.writer/state.json'));return {work,state,snapshots:replaySnapshots(work,state)};}
const old=load('session-11'),middle=load('revision-c-r326-reading'),final=load('revision-c');assert.equal(final.state.units.length,90);
assert.deepEqual(old.state.units.slice(0,40),final.state.units.slice(0,40));
for(let i=0;i<=40;i++)assert.deepEqual(old.snapshots[i],final.snapshots[i],`prefix snapshot ${i}`);
const identity=[];for(const[id,e]of Object.entries(old.state.snapshot.ledger)){
 const n=final.state.snapshot.ledger[id];assert(n,id);for(const field of ['type','introduced_unit','due_unit'])assert.deepEqual(n[field],e[field],`${id}.${field}`);
 if(e.type==='observation'){assert.deepEqual(n.statement,e.statement,id);assert.deepEqual(n.author_truth,e.author_truth,id);}
 identity.push({id,type:e.type,introduced_unit:e.introduced_unit,due_unit:e.due_unit});
}
const oldPhrase='不称沈连续亲验三小时',newPhrase='未完整亲验三晨各75分钟',changed=[];
for(let i=0;i<=90;i++){
 const expected=structuredClone(middle.snapshots[i]);
 if(i>=80){const entry=expected.ledger.T_SHOP_SEAT_TRIAL_76;assert.equal(entry.reader_known.split(oldPhrase).length,2,`exact one old phrase ${i}`);entry.reader_known=entry.reader_known.replace(oldPhrase,newPhrase);changed.push({unit:i,field:'ledger.T_SHOP_SEAT_TRIAL_76.reader_known',from:oldPhrase,to:newPhrase});}
 assert.deepEqual(final.snapshots[i],expected,`full snapshot after one permitted correction ${i}`);
}
for(let i=0;i<90;i++)assert.equal(final.state.units[i].sha256,middle.state.units[i].sha256,`unchanged r326 body ${i+1}`);
assert.deepEqual(final.state.units.slice(0,79),middle.state.units.slice(0,79));
const preview=read(path.join(base,'revision-c-parent-reading/changed-evidence-preview.json'));assert.equal(hash(path.join(base,'revision-c/final-evidence-audit.json')),preview.source_sha256,'The eight read replacements must bind retained audit');
const report={ok:true,scope:'Independent exact identity/prefix preservation and strict full-journal proof of final 11-unit metadata correction; semantic reading documented separately',before_revision:old.state.revision,middle_revision:middle.state.revision,final_revision:final.state.revision,unchanged_prefix:40,immutable_observations:identity.filter(x=>x.type==='observation').length,identity_entries:identity,final_correction:changed,all_91_snapshots_exact_after_only_allowed_correction:true,all90_body_hashes_unchanged_from_r326:true,first79_registrations_unchanged_from_r326:true,read_changed_evidence_audit_sha256:preview.source_sha256,final_state_sha256:hash(path.join(final.work,'.writer/state.json'))};
fs.writeFileSync(path.join(base,'revision-c-parent-reading/final-proof.json'),JSON.stringify(report,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify({ok:true,revision:final.state.revision,snapshots:91,corrected_cells:changed.length,observations:report.immutable_observations}));
