import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {fileURLToPath} from 'node:url';
import {state,file,call,evidence,sourceInput,begin,rewindBranch,sha} from '../../tests/protection-fixture.mjs';
const A=path.dirname(fileURLToPath(import.meta.url)),root=path.join(A,'probes/historical-prefix-before/work');
const pending=Object.values(state(root).impact_pending);assert.equal(pending.length,1);
// This is a new-library API diagnostic over real pre-fix pending data. It does
// not claim that an old build-bound production session may resume on a new CLI.
const branch=begin(root,true);rewindBranch(branch);
const bytes=fs.readFileSync(path.join(branch.workspace,'.writer/state.json'));
let error;try{call(branch.workspace,'source','publish',sourceInput(branch.workspace,{impact_id:pending[0].id,author_evidence:evidence(branch.workspace)}),branch.token);}catch(e){error=e;}
const after=fs.readFileSync(path.join(branch.workspace,'.writer/state.json'));
const out={at:new Date().toISOString(),synthetic_only:true,kind:'New library handler with real pre-fix pending data; not cross-build CLI resume',root,workspace:branch.workspace,error_code:error?.code??null,error_message:error?.message??null,state_unchanged:bytes.equals(after),before_state_sha256:sha(bytes),after_state_sha256:sha(after)};
file(root,'研究/旧pending新发布处理诊断.json',out);console.log(JSON.stringify(out));
assert.equal(error?.code,'SOURCE_BASELINE_REQUIRED');assert(out.state_unchanged);
