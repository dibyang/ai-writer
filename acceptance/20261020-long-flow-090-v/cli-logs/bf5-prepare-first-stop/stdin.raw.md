import fs from 'node:fs';
const w='scenario/东岸末班船-扩展验证';
const s=JSON.parse(fs.readFileSync(`${w}/.writer/state.json`));
const initial=JSON.parse(fs.readFileSync('bf5-workflow-start.json'));
const workflow=structuredClone(s.governance);
workflow.task='V新鲜B 8首停：7—8已写/登记/完整连读review；范围仍7—9，9待同一实际thread恢复，本进程不写9';
workflow.authorization.stop_conditions=['本进程已经完成8首停，不取9写前模板、不写9正文；9等待同一实际thread恢复，恢复时先核当前status/交接和当前7—8全文。','7—9有限范围保持；本次先完成当前1—6完整连读review并check清零，再逐章7/8写前、分段assemble、报告/draft_review、preview和record，已完成。','8取货/实收8元/余份处置/老板接热笼与沈禾实际早走已完成本次有限试行；不等于长期营业承诺。','柜内使用与绕行入口最终兑现留11/12，35元实际付款留10；不得把候选或细纲当事实。','旧1—6正文及已修登记/journal不改，不改不可变观察三项；当前新章只追加真实变化，无新增旧章高置信问题。','仅V写入，不派代理，不改U/T/产品/既有作品，不Git提交推送上传。'];
fs.writeFileSync('bf5-workflow-first-stop.json',JSON.stringify({expected_revision:s.revision,operation_id:'v-bf5-first-stop-after-eight',author_evidence:initial.author_evidence,workflow},null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({revision:s.revision,input:'bf5-workflow-first-stop.json',stage:workflow.stage,range:workflow.authorization.draft_range,task:workflow.task},null,2));
