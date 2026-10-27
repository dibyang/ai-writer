import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const x=path.dirname(fileURLToPath(import.meta.url)),p=path.join(x,'scenario/东岸末班船-再扩展验证');
const j=f=>JSON.parse(fs.readFileSync(path.join(x,f),'utf8'));
const sha=v=>crypto.createHash('sha256').update(v).digest('hex');
const failed=j('commands/codex-b-resume/result.json'),recovered=j('commands/codex-b-resume-capacity-recovery/result.json');
assert.equal(failed.exit_code,1);assert.equal(recovered.exit_code,0);
assert.equal(j('creation-controller.result.json').ok,false);
const native=label=>fs.readFileSync(path.join(x,'commands',label,'stdout.raw.txt'),'utf8').split(/\r?\n/).filter(Boolean).map(v=>JSON.parse(v));
const old=native('codex-b-resume'),now=native('codex-b-resume-capacity-recovery');
assert(old.some(v=>v.type==='turn.failed'&&/model is at capacity/.test(v.error?.message??'')));
const id=old.find(v=>v.type==='thread.started')?.thread_id;assert(id);
assert.equal(now.find(v=>v.type==='thread.started')?.thread_id,id);
const stop=j('capacity-stop-b.json'),entry=j('resume-start-b-capacity.json');
assert.equal(stop.thread_id,id);assert.equal(stop.revision,128);assert(entry.ok);
assert.equal(entry.expected_state_sha256,stop.state_sha256);
assert(j('read-proof-brc-window-current.json').ok);assert(j('creation-brc29-30.json').ok);
const complete=j('checkpoint-b-complete.json');assert(complete.ok);
assert.equal(complete.registered_units,30);assert.equal(complete.stage,'paused');
assert.deepEqual(complete.authorization.allowed_actions,['discuss']);
assert.equal(complete.authorization.draft_range,null);assert.equal(complete.authorization.revise_range,null);
const changedSources=[];let protectedBodies=0,protectedParts=0;
for(const f of stop.files){
  assert.equal(sha(fs.readFileSync(path.join(stop.archive,f.file))),f.sha256);
  const current=sha(fs.readFileSync(path.join(p,f.file)));
  if(f.file.startsWith('正文/')||f.file.startsWith('分段/')){
    assert.equal(current,f.sha256,'Capacity-stop body/part overwritten: '+f.file);
    f.file.startsWith('正文/')?protectedBodies++:protectedParts++;
  }else if(current!==f.sha256)changedSources.push({file:f.file,old_sha256:f.sha256,current_sha256:current,scope:f.file==='.writer/state.json'?'expected subsequent governance/record/review state':'inspect actual source history; old stop bytes retained'});
}
const proof={ok:true,at:new Date().toISOString(),scope:'actual external model-capacity failure and completed same-ID recovery, not a product source fix or human literary acceptance',thread_id:id,failed_invocation:'codex-b-resume',failed_exit_code:1,recovered_invocation:'codex-b-resume-capacity-recovery',recovered_exit_code:0,entry_revision:128,entry_state_sha256:stop.state_sha256,completed_revision:complete.revision,completed_units:30,body_han:complete.body_han,archive_files_verified:stop.files.length,original_current_bodies_preserved:protectedBodies,original_partial_versions_preserved:protectedParts,source_changes_after_stop:changedSources,original_failed_controller_retained:true,current_complete_proofs:['resume-start-b-capacity.json','read-proof-brc-window-current.json','creation-brc29-30.json','checkpoint-b-complete.json']};
fs.writeFileSync(path.join(x,'capacity-recovery-b-verification.json'),JSON.stringify(proof,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({ok:true,thread_id:id,failed_exit_code:1,recovered_exit_code:0,completed_units:30,protected_bodies:protectedBodies,protected_parts:protectedParts,changed_sources:changedSources.map(v=>v.file)}));
