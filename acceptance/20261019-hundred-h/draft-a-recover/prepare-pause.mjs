import fs from 'node:fs';import path from 'node:path';
const h=path.resolve('acceptance/20261019-hundred-h'),p=path.join(h,'draft-a-recover'),x=JSON.parse(fs.readFileSync(path.join(p,'workflow-recover.json'))),check=JSON.parse(fs.readFileSync(path.join(h,'commands/draft-a-recover-check-after-review/stdout.raw.txt')));
x.expected_revision=check.revision;x.operation_id='h-draft-a-recover-pause-after-108-v1';x.author_evidence.quote='最后正式pause，仅discuss/plan，draft/revise范围清空；109 context和record-template均需真实ACTION_OUT_OF_SCOPE且state前后相同，无109正文和未登记稿。';
x.author_evidence.locator='本次用户恢复任务「完整收束而非仅恢复报告」段原句';
x.workflow.stage='paused';x.workflow.task='H轮draft-a-recover已完成108登记和103–108知情连读复核；暂停正文，仅讨论/规划。109须后续新授权，107候选及旧章保护批尚未实施。';
x.workflow.authorization.allowed_actions=['discuss','plan'];x.workflow.authorization.draft_range=null;x.workflow.authorization.revise_range=null;
fs.writeFileSync(path.join(p,'workflow-pause.json'),JSON.stringify(x,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify(x,null,2));
