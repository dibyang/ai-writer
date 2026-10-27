import fs from 'node:fs';
const P=new URL('./scenario/东岸末班船-再扩展验证/',import.meta.url);
const t=JSON.parse(fs.readFileSync(new URL('.writer/drafts/dr-workflow-resume35.json',P)));
t.expected_revision=157;t.operation_id='x-dr-adopt36-trial';t.workflow.task='35已登记；实际plan36已读，按原作者有限34—36与本次明确续程授权采用执行纲并写36，完成当前31—36真实复盘后paused仅discuss；37未获本轮授权。';
t.workflow.planning.outline={status:'adopted',refs:['大纲/单元/0034.json','大纲/单元/0035.json','大纲/单元/0036.json','大纲/X-D近期执行纲-34-36.md','大纲/X-DR续程执行纲-35-36.md','大纲/X-DR第36章执行纲.md'],unresolved_ids:['本次采用为代理在有限作者授权内的执行，非逐项作者采纳','未来课/实衣给老师/长期洗穿与两件待问修理不结案']};
for(const ref of t.workflow.planning.outline.refs)if(!fs.existsSync(new URL(ref,P)))throw Error('missing ref '+ref);
fs.writeFileSync(new URL('.writer/drafts/dr-workflow-adopt36.json',P),JSON.stringify(t,null,2)+'\n',{flag:'wx'});
