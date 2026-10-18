import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {session,sha} from '../session-support.mjs';
const s=session('revise-a'),r=JSON.parse(fs.readFileSync(path.join(s.stage,'revision-local.json'))),b=session('revise-a-branch',{project:r.workspace,token:r.token});
const items=JSON.parse(fs.readFileSync(path.join(s.stage,'../findings/brick-wording-group.json'))).items;
const diffs=[];for(const i of items){const before=fs.readFileSync(path.join(s.stage,'before',path.basename(i.draft))),after=fs.readFileSync(path.join(b.project,i.draft));assert.equal(before.toString('utf8').replace('同两块','那两块'),after.toString('utf8'));assert.equal(sha(fs.readFileSync(path.join(s.project,i.draft))),i.source_sha256);s.write('after/'+path.basename(i.draft),after);diffs.push({unit:i.unit,draft:i.draft,before_sha256:sha(before),after_sha256:sha(after),before:i.before,after:i.proposed_after,codepoint_diff:[{offset_utf16:before.toString('utf8').indexOf('同两块'),before:'同',after:'那'}],byte_delta:after.length-before.length});}
s.write('body-diffs.json',diffs);
console.log(b.run('rewind-48',['rewind','--from','48','--expected-revision',String(b.state().revision)]).value);
const c=b.run('context-48',['context','--unit','48','--purpose','revision','--max-chars','120000']);s.write('context-48.json',c.value);
const t=b.run('replay-input-48',['revision','replay-input','--unit','48']);s.write('replay-template-48.json',t.value);console.log(t.value);
s.write('root-base-unchanged-after-rewind.json',{state_sha256:sha(fs.readFileSync(path.join(s.project,'.writer/state.json'))),base_state_matches:sha(fs.readFileSync(path.join(s.project,'.writer/state.json')))===sha(fs.readFileSync(path.join(s.stage,'root-base-state.bin')))});
