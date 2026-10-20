import fs from 'node:fs';
const v='D:/work/other/ai-writer/acceptance/20261020-long-flow-090-v',w=v+'/scenario/东岸末班船-扩展验证';
const state=JSON.parse(fs.readFileSync(w+'/.writer/state.json','utf8')),event=JSON.parse(fs.readFileSync(v+'/cli-logs/am10-workflow-start/stdout.raw.txt','utf8'));
if(state.revision!==25||event.revision!==25)throw Error('Unexpected workflow revision');
const input={expected_revision:state.revision,operation_id:'v-am-adopt-time-metadata',id:'V_A_U5_TIME_METADATA',disposition:'adopted',reason:'本轮真实根提示明确采用metadata-only修正，覆盖4—6；代理在当前正式revise授权内落实，只修summary/timeline时间措辞，六章正文和人物/物件/钱据/观察保持。不冒充人类逐字选择。',decision_actor:'agent-within-authorized-scope',authorization:event.event};
fs.writeFileSync(w+'/.writer/drafts/v-am-issue-adopt.json',JSON.stringify(input,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify(input));
