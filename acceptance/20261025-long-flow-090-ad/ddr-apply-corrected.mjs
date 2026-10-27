import {state,json,save,assert} from './c-utils.mjs';
const s=state(),record=json(s.committed_revisions.at(-1).ref);assert.equal(record.session_id,'6fa1ada9-fcb9-4f06-abd3-cfcf0fff7693');
const x=json('.writer/drafts/ad-dr-speaker58-apply.json');assert.equal(x.commit_id,'d5427e6c-d182-4ddc-ab1e-7668a071f850');
x.expected_revision=s.revision;x.operation_id='ad-dr-speaker58-apply-corrected-r'+s.revision;x.commit_id=record.id;
x.reason+=' 原失败输入误填事务ID，现按已完成事务冻结状态中的committed_revisions对象实际id核对，另存修正，不改原失败。';
save('.writer/drafts/ad-dr-speaker58-apply-corrected.json',x);console.log(JSON.stringify({ok:true,commit_id:x.commit_id,transaction_id:'d5427e6c-d182-4ddc-ab1e-7668a071f850',revision:s.revision}));
