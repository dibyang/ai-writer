import fs from 'node:fs';
import path from 'node:path';
const V=process.cwd(),W=path.join(V,'scenario/东岸末班船-扩展验证');
const state=JSON.parse(fs.readFileSync(path.join(W,'.writer/state.json'),'utf8'));
if(state.revision!==43)throw Error('expected 43');
const input=JSON.parse(fs.readFileSync('br2-workflow-start.json','utf8'));
input.expected_revision=43;
input.operation_id='v-b-resume-v2-stop-after-nine';
input.workflow.task='同一实际B恢复已完成第9章5436汉字及当前7—9完整连读review；只到9，10等待C新提示';
input.workflow.authorization.draft_range={from:9,to:9};
input.workflow.authorization.revise_range=null;
input.workflow.authorization.stop_conditions=[
  '第9已通过三个真实顺序片段assemble新整章、全文回读修正并绑定报告，preview成功后正式record；当前登记9章。',
  '当前7—9已逐章完整连读，回看4—6所涉原线索、V4/V5承诺，文学报告及功能比较已正式review绑定全部当前SHA与依赖。',
  '停在9，draft_range保留9—9、stage trial、revise_range null；本会话不取10写前、不写10，10等待C新的明确提示。',
  '保留B首停、4—12总体有限试验授权历史及planning/decisions；原35未付、11柜门实装/摆碗和12出行仍未兑现。',
  '只写V；不派代理，不改U/T/产品/既有作品，不修旧章，不替换包，不做目录索引，不Git提交推送；交接后等待根独立核验。'
];
fs.writeFileSync('br2-workflow-stop.json',JSON.stringify(input,null,2)+'\n',{encoding:'utf8',flag:'wx'});
console.log(JSON.stringify({expected_revision:input.expected_revision,task:input.workflow.task,draft_range:input.workflow.authorization.draft_range}));
