import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const v='D:/work/other/ai-writer/acceptance/20261020-long-flow-090-v';
const w=path.join(v,'scenario','东岸末班船-扩展验证');
const current=JSON.parse(fs.readFileSync(path.join(v,'cli-logs/ac33-workflow-before-stop/stdout.raw.txt'),'utf8'));
if(current.revision!==33)throw Error('Need current governance revision33');
const prior=JSON.parse(fs.readFileSync(path.join(w,'.writer/drafts/v-ac-workflow-start.json'),'utf8'));
const author_evidence={...prior.author_evidence};
const source=fs.readFileSync(path.join(w,author_evidence.local_source));
if(crypto.createHash('sha256').update(source).digest('hex')!==author_evidence.source_sha256)throw Error('Authorization source drift');
author_evidence.quote='完成后正式workflow收口paused仅discuss、两范围null，task明确“6章工具已升级、时间意见已闭环，等待B新的7—9提示；不写7”。';
if(!source.toString('utf8').includes(author_evidence.quote))throw Error('Stop quote not verbatim actual prompt');
author_evidence.locator='本轮实际恢复提示末段；根在隔离工具试验内选择收口，保留用户继续推进原话来源，不冒称人类逐字指定工具字段或情节';
const workflow=structuredClone(current.workflow);
workflow.stage='paused';
workflow.task='6章工具已升级、时间意见已闭环，等待B新的7—9提示；不写7';
workflow.authorization={allowed_actions:['discuss'],draft_range:null,revise_range:null,stop_conditions:[
 '6章已完成；本次工具正式更新、既有时间意见tracking应用和当前实读verify已完成，等待根独立核验。',
 '等待B新的7—9提示；不写7，不将12章扩展骨架或旧整体试验范围当成本阶段正文许可。',
 '正文、事实、已消费内容来源和immutable observation保持；后续若改变内容须新授权与正式流程。',
 '仅V及W写入，不改U/T/源码，不派代理、不Git提交推送上传；历史输入、双流、退出码和前后state保留。'
]};
const input={expected_revision:33,operation_id:'v-ac-pause-after-tracking-verified',author_evidence,workflow};
fs.writeFileSync(path.join(v,'ac-workflow-stop.json'),JSON.stringify(input,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({input:'ac-workflow-stop.json',expected_revision:33,stage:workflow.stage,task:workflow.task,planning_preserved:JSON.stringify(workflow.planning)===JSON.stringify(current.workflow.planning),decisions:'workflow set不输入决策变更；最终校验原governance.decisions'}));
