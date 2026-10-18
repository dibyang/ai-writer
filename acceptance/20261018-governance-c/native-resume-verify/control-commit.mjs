import path from 'node:path';import assert from 'node:assert/strict';
import {call,read,write,dir,state} from './helpers.mjs';
const s=read(path.join(dir,'session-access.json')), input={id:s.id,token:s.token}, before=state().revision;
const commit=call('native-three-30-commit',['revision','commit'],{input});write(path.join(dir,'commit-result.json'),commit);assert.equal(state().revision,before+1);
const again=call('native-three-31-commit-idempotent',['revision','commit'],{input});assert.equal(again.unchanged,true);assert.equal(state().revision,before+1);
const view=call('native-three-32-needs-recheck-view',['review-issues','list','--id','NATIVE_C_READABILITY_01']);assert.equal(view.issues[0].effective_status,'needs-recheck');assert.equal(view.issues[0].application.commit_id,'c5e3da0b-4b95-4e7a-884f-b58febd07421');
call('native-three-33-postcommit-status',['status']);
call('native-three-34-final-review-template',['review-template','--from','1','--to','6']);
console.log(JSON.stringify({commit,view:view.issues.map(i=>({id:i.id,status:i.status,effective_status:i.effective_status,context_changed:i.context_changed,old_review:i.verification.review_ref,application:i.application.commit_id})),revision:state().revision},null,2));
