import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import assert from 'node:assert/strict';import {fileURLToPath} from 'node:url';
const here=path.dirname(fileURLToPath(import.meta.url)),j=p=>JSON.parse(fs.readFileSync(p)),sha=b=>crypto.createHash('sha256').update(b).digest('hex'),rows=[];
const cases=[['ef-negative-stale-revision','REVISION_CHANGED'],['ef-negative-main-workflow-active','REVISION_OCCUPIED'],['ef-negative-new-bind-old-consumer','SOURCE_BIND_MISMATCH'],['ef-negative-stale-impact','IMPACT_STALE'],['ef-negative-pending-export','IMPACT_PENDING'],['ef-negative-pending-context','REVISION_REWIND_REQUIRED']];
for(const [label,expected] of cases){
 const dir=path.join(here,'cli-logs',label),r=j(path.join(dir,'result.json')),error=j(path.join(dir,'stderr.txt'));
 assert.equal(r.exit_code,2,label);assert.equal(error.ok,false,label);assert.equal(error.code,expected,label);
 assert.equal(r.before_state_sha256,r.after_state_sha256,label);
 const before=fs.readFileSync(path.join(dir,'before-state.json')),after=fs.readFileSync(path.join(dir,'after-state.json'));
 assert.equal(sha(before),r.before_state_sha256,label);assert.equal(sha(after),r.after_state_sha256,label);assert.deepEqual(before,after,label);
 const input=path.join(dir,'input.raw.json');if(!label.includes('pending-'))assert(fs.existsSync(input),label);
 rows.push({label,expected_code:expected,actual_code:error.code,exit_code:r.exit_code,state_sha256:r.before_state_sha256,input_sha256:fs.existsSync(input)?sha(fs.readFileSync(input)):null,stderr_sha256:sha(fs.readFileSync(path.join(dir,'stderr.txt'))),state_unchanged:true});
}
const root=j(path.join(here,'project.json')).project,entry=j(path.join(here,'checkpoint-e-entry-state.json')),current=j(path.join(root,'.writer/state.json'));
assert.equal(current.units.length,60);for(const u of entry.units){const v=current.units.find(v=>v.unit===u.unit);assert.equal(v.draft,u.draft);assert.equal(v.sha256,u.sha256);assert.equal(sha(fs.readFileSync(path.join(root,u.draft))),u.sha256,u.draft);}
const result={ok:true,at:new Date().toISOString(),cases:rows,all_main_60_body_bytes_still_equal_e_entry:true,scope:'Actual typed CLI guards, valid captured inputs, raw rejection output, and identical before/after state. Main remains original; code rejects before mutation. Does not stand in for a separate deliberate baseline-file-conflict experiment.'};
fs.writeFileSync(path.join(here,'e-negative-receipts-root-verification.json'),JSON.stringify(result,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify({ok:true,cases:rows.length,all_main_60_body_bytes_still_equal_e_entry:true}));
