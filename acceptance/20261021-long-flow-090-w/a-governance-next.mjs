import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const W=path.dirname(fileURLToPath(import.meta.url)),P=path.join(W,'scenario/东岸末班船-规模验证');
const step=process.argv[2],state=JSON.parse(fs.readFileSync(path.join(P,'.writer/state.json'),'utf8'));
const initial=JSON.parse(fs.readFileSync(path.join(W,'inputs/a-workflow-trial.json'),'utf8'));
let value,name;
if(step==='refs'){
 const workflow=structuredClone(initial.workflow);
 workflow.planning.volume.refs=[6,7,8,9].map(n=>'大纲/分卷/V'+n+'.json');
 workflow.planning.outline.refs=['大纲/近期细纲-W-13-15.md',...[13,14,15].map(n=>'大纲/单元/'+String(n).padStart(4,'0')+'.json')];
 value={expected_revision:state.revision,operation_id:'w-a-trial-official-planning-refs',author_evidence:initial.author_evidence,workflow};
 name='a-workflow-official-refs.json';
}else if(step==='decision'){
 value={expected_revision:state.revision,operation_id:'w-a-execution-selection-13-24',author_evidence:initial.author_evidence,decision:{id:'D_W_EXECUTION_A',topic:'W13—24本轮代理执行选择',status:'confirmed',options:['日常分工、修衣晚课、面摊窄凳与旧布袋跨卷展开'],adopted_items:['仅13—15有细纲，16—24保留骨架','13晚课、14窄凳、15旧布用途作为本轮代理选定的跨卷拟线索；不是人类逐项设定或已发生事实','本进程只写13章两个分段后退出'],excluded_items:['重开箱据悬疑','追补6妇人终点或12旅客对岸抵达','修改前12或不可变观察'],unresolved_items:['16—24具体细纲','窄凳尺寸工钱和布袋形状用途须写时在场定','复航日期及是否安排复航场景'],effective_range:{from:13,to:24}}};
 name='a-decision-selected.json';
}else throw Error('Use refs or decision');
fs.writeFileSync(path.join(W,'inputs',name),JSON.stringify(value,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({file:'inputs/'+name,expected_revision:state.revision}));
