import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {replaySnapshots} from './rebuild-utils.mjs';
const base='acceptance/20261016-hundred',mode=process.argv[2];assert(['live','final'].includes(mode));
const afterRoot=`${base}/checkpoints/repair-at72/files`,afterBytes=fs.readFileSync(`${afterRoot}/.writer/state.json`),after=JSON.parse(afterBytes);
const hash=bytes=>crypto.createHash('sha256').update(bytes).digest('hex'),afterHash=hash(afterBytes);
const root=mode==='live'?`${base}/works/潮汐信号`:`${base}/checkpoints/session-09/files`;
const bytes=fs.readFileSync(`${root}/.writer/state.json`),state=JSON.parse(bytes);assert(state.units.length>=73);
assert.deepEqual(state.units.slice(0,72),after.units,'Intermediate registrations must be the real continued prefix');
const snapshots=replaySnapshots(root,state);assert.deepEqual(snapshots[72],after.snapshot,'Later chapter knowledge must not leak into the intermediate snapshot');
const inputHash=state.units[72].source_hashes['.writer/state.json'];assert.equal(inputHash,afterHash,'Chapter73 must consume the actual repaired72 state version');
if(mode==='final'){
 const result=JSON.parse(fs.readFileSync(`${base}/session-09/process-result.json`)),audit=JSON.parse(fs.readFileSync(`${base}/audits/session-09.json`));
 assert.equal(result.exit_code,0);assert(audit.ok&&audit.units===78&&state.units.length===78);
}
const dir=`${base}/intermediate-proofs`,copy=`${dir}/repair-at72-${mode}-observed-state.json`;
fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(copy,bytes,{flag:'wx'});
const payload={at:new Date().toISOString(),ok:true,scope:mode==='live'?'Actual first continuation input binding; parent phase is still running':'Final78 independent audit and input binding to repaired72',mode,observed_revision:state.revision,observed_units:state.units.length,observed_state_copy:copy,observed_state_sha256:hash(bytes),intermediate_state_sha256:afterHash,chapter73_input_state_sha256:inputHash,prefix_units:72,journal_snapshot72_equal:true};
fs.writeFileSync(`${dir}/repair-at72-${mode}-binding.json`,JSON.stringify(payload,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify(payload));
