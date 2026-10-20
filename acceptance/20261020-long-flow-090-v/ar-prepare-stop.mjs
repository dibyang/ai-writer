import fs from 'node:fs';import crypto from 'node:crypto';
const v='D:/work/other/ai-writer/acceptance/20261020-long-flow-090-v',w=v+'/scenario/东岸末班船-扩展验证';
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const shown=JSON.parse(fs.readFileSync(v+'/cli-logs/ar36-workflow-before-stop/stdout.txt','utf8'));
const state=JSON.parse(fs.readFileSync(w+'/.writer/state.json','utf8'));
if(state.revision!==shown.revision||state.revision!==22)throw Error('Revision changed');
const local_source='研究/V-A-恢复限定原文.md',raw=fs.readFileSync(w+'/'+local_source);
const quote='第6完成后更新task说明真实完成点、下一阶段7—9需根新提示，当前draft_range仍4—6，到6停止。';
if(!raw.toString('utf8').includes(quote))throw Error('Actual prompt quote absent');
const workflow=structuredClone(shown.workflow);
workflow.task='本次已完成第4—6章整稿、逐章实读报告与登记，并完成当前1—6章连读review；到6停下等待B，下一阶段7—9需根新提示';
workflow.authorization.stop_conditions=[
 '本次第4—6章及连读review已完成，到6停止等待根独立核验和B新提示；next_unit=7不构成续写授权',
 'stage保持trial，draft_range仍明确4—6，revise_range为null；不得写7、不得开启正式修订',
 '首停v1的01/02、revision17写前模板、旧1—3正文与O_BOX_PAINT保留；后续8/11/12兑现仍属计划',
 '全部操作仅V；不改产品、U/T及其他作品，不Git提交或推送、不上传；保留真实失败、原输入和版本'
];
const input={expected_revision:shown.revision,operation_id:'v-ar-stop-after-6',author_evidence:{quote,local_source,source_sha256:sha(raw),locator:'当前用户恢复限定原文末段；真实本提示原文已保存，不编造人类消息ID或thread',recorded_by:'同一实际V-A Codex恢复会话；完成点来自实际登记与报告'},workflow};
fs.writeFileSync(w+'/.writer/drafts/v-ar-workflow-stop.json',JSON.stringify(input,null,2)+'\n',{flag:'wx'});
fs.writeFileSync(v+'/ar-governance-before-stop.json',JSON.stringify(shown.governance,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({revision:shown.revision,task:workflow.task,planning_preserved:JSON.stringify(workflow.planning)===JSON.stringify(shown.workflow.planning),input_sha256:sha(fs.readFileSync(w+'/.writer/drafts/v-ar-workflow-stop.json'))}));
