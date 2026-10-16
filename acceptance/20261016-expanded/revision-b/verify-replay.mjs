import fs from 'node:fs';
import assert from 'node:assert/strict';
import {json,write,stage,project,hash} from './run.mjs';
const results=[];
for(const base of [stage+'/before/work',project]){
 const s=json(base+'/.writer/state.json');let snapshot=structuredClone(s.baseline),patches=0;
 for(const u of s.units){const p=base+'/'+u.journal;assert.equal(hash(fs.readFileSync(p)),u.journal_sha256);for(const d of json(p).patch){let v=snapshot;for(const k of d.at.slice(0,-1)){v[k]??={};v=v[k];}const k=d.at.at(-1);if(d.append){assert.equal(v[k]?.length??0,d.length);v[k]??=[];v[k].push(...structuredClone(d.append));}else{if(d.had)assert.deepEqual(v[k],d.before);else assert(!Object.hasOwn(v,k));if(d.has)v[k]=structuredClone(d.after);else delete v[k];}patches++;}}
 assert.deepEqual(snapshot,s.snapshot);results.push({base,revision:s.revision,units:s.units.length,patches,verified_before_values:true,append_lengths:true,journal_sha256:true,replayed_state_equal:true});
}
write(stage+'/after/replay-before-values.json',results);console.log(JSON.stringify(results,null,2));
