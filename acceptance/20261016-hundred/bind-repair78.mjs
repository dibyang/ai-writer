import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {replaySnapshots} from './rebuild-utils.mjs';
const base='acceptance/20261016-hundred',mode=process.argv[2];assert(['live','final'].includes(mode));
const intermediate=`${base}/checkpoints/repair-at78/files`,bytes=fs.readFileSync(`${intermediate}/.writer/state.json`),after=JSON.parse(bytes),hash=x=>crypto.createHash('sha256').update(x).digest('hex');
const root=mode==='live'?`${base}/works/潮汐信号`:`${base}/checkpoints/session-10/files`,actualBytes=fs.readFileSync(`${root}/.writer/state.json`),actual=JSON.parse(actualBytes);assert(actual.units.length>=79);
assert.deepEqual(actual.units.slice(0,78),after.units);assert.deepEqual(replaySnapshots(root,actual)[78],after.snapshot);
assert.equal(actual.units[78].source_hashes['.writer/state.json'],hash(bytes));
if(mode==='final'){const p=JSON.parse(fs.readFileSync(`${base}/session-10/process-result.json`)),a=JSON.parse(fs.readFileSync(`${base}/audits/session-10.json`));assert.equal(p.exit_code,0);assert(a.ok&&a.units===84&&actual.units.length===84);}
const result={at:new Date().toISOString(),ok:true,scope:mode==='live'?'Actual79 input binding; parent phase unfinished':'Completed84 independent audit, prefix78 and actual79 input binding',mode,intermediate_revision:after.revision,intermediate_state_sha256:hash(bytes),observed_units:actual.units.length,observed_revision:actual.revision,observed_state_sha256:hash(actualBytes),chapter79_input_state_sha256:actual.units[78].source_hashes['.writer/state.json'],prefix78_equal:true,journal_snapshot78_equal:true};
fs.writeFileSync(`${base}/intermediate-proofs/repair-at78-${mode}-observed-state.json`,actualBytes,{flag:'wx'});fs.writeFileSync(`${base}/intermediate-proofs/repair-at78-${mode}-binding.json`,JSON.stringify(result,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify(result));
