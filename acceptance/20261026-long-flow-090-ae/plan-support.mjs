import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
const base=path.dirname(fileURLToPath(import.meta.url));
const root=JSON.parse(fs.readFileSync(path.join(base,'project.json'))).project;
const read=f=>JSON.parse(fs.readFileSync(f));
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const save=(f,v)=>fs.writeFileSync(path.join(base,f),JSON.stringify(v,null,2)+'\n',{flag:'wx'});
const state=read(path.join(root,'.writer/state.json'));
if(process.argv[2]==='entry'){
 const evidenceFile='研究/AE作者任务.md';
 save('plan-workflow-input.json',{expected_revision:state.revision,operation_id:'AE_PLAN_ENTRY_PAUSED_20261026',author_evidence:{quote:'继续推进',local_source:evidenceFile,source_sha256:sha(fs.readFileSync(path.join(root,evidenceFile))),locator:'研究/AE作者任务.md，第5—7行最新用户原话；第9—17行保留此前完整任务及控制器解释，具体61—66规模不冒充作者新原话',recorded_by:'本轮AE原生Codex首程 /root，依据本地真实任务记录'},workflow:{stage:'paused',task:'AE首程恢复实读与61—66规划：完整读55—60及实际使用旧线原文；新建V22/V23契约、61—63近期细纲和64—66滚动骨架；不写正文、不取draft context或record-template、不新建revision、不提交Git。',authorization:{allowed_actions:['discuss','plan'],draft_range:null,revise_range:null,stop_conditions:['只写AE独立样本的新规划与本程证据；不修改已消费1—60计划、设定、卷纲、正文、原来源版本与旧意见应用。','61原stub仅在确认未消费后通过正式plan替换；发现消费矛盾停止并记录。','规划不等于事实，不自动复航、治愈脚伤、揭父旧事或填戏词两空。','90分钟未完成保存真实checkpoint及未完成交接；退出由根核真实进程结果。']},planning:state.governance.planning}});
 const refs=new Set();
 const visit=v=>{if(typeof v==='string'&&fs.existsSync(path.join(root,v))&&fs.statSync(path.join(root,v)).isFile())refs.add(v);else if(Array.isArray(v))v.forEach(visit);else if(v&&typeof v==='object')Object.values(v).forEach(visit)};
 visit(state);
 const inventory=[...refs].sort().map(ref=>({ref,sha256:sha(fs.readFileSync(path.join(root,ref)))}));
 save('plan-entry-baseline.json',{revision:state.revision,state_sha256:sha(fs.readFileSync(path.join(root,'.writer/state.json'))),inventory,units:state.units,snapshot:state.snapshot,source_versions:state.source_versions,source_ranges:state.source_ranges,governance:state.governance,top_keys:Object.keys(state)});
 save('plan-body-index.json',state.units.map(u=>({unit:u.unit,draft:u.draft,...(()=>{const b=fs.readFileSync(path.join(root,u.draft));return {sha256:sha(b),chars:b.toString('utf8').length,pages:Math.ceil(b.toString('utf8').length/1800)}})()})));
 console.log(JSON.stringify({revision:state.revision,top_keys:Object.keys(state),units:state.units.length,inventory:inventory.length,body_index:'plan-body-index.json',workflow_input:'plan-workflow-input.json'}));
}
if(process.argv[2]==='locate'){
 for(const key of ['lamp','lesson','curtain','book','cabinet']){
  const d=read(path.join(base,'cli-logs',`plan-recall-${key}`,'stdout.txt'));
  const matches=d.matches.filter(x=>x.kind==='ledger').map(x=>({id:x.id,status:x.entry.status,statement:x.entry.statement,current:x.entry.reader_known,evidence:x.entry.evidence.map(e=>({unit:e.unit,quote:e.quote,draft:e.draft}))}));
  save(`plan-locations-${key}.json`,matches);
  console.log(JSON.stringify({kind:key,matches:matches.map(m=>({...m,evidence:m.evidence.length>6?[...m.evidence.slice(0,3),...m.evidence.slice(-3)]:m.evidence}))}));
 }
 const source=read(path.join(base,'cli-logs/plan-entry-sources-supported/stdout.txt'));
 save('plan-source-entry-summary.json',{revision:source.revision,versions:source.versions,ranges:source.ranges,pending_edits:source.pending_edits});
 console.log(JSON.stringify({sourceKeys:Object.keys(source),sourceVersions:Object.keys(source.versions),sourceRanges:source.ranges,pending:source.pending_edits}));
 for(const id of [7,11,13,15,18,24,30,35,38,40,48,49,50,51,52,53,54]){
 const u=state.units.find(x=>x.unit===id),txt=fs.readFileSync(path.join(root,u.draft),'utf8');
 const re=/(?:旧灯|听戏|七点|第三|第[一二四五]回|针距|针尾|偏长|窗帘|十四|八元|纸条|夹纸|台灯|不修|六十二)/g;
 console.log(JSON.stringify({unit:id,draft:u.draft,pages:Math.ceil(txt.length/1800),hits:[...txt.matchAll(re)].map(m=>({word:m[0],page:Math.floor(m.index/1800)+1,at:m.index}))}));
 }
}
if(process.argv[2]==='small-locate'){
 for(const [id,terms] of [[34,['柜门','侧面']],[49,['上次','八块','信封']],[52,['拆','帘','旧灯']],[53,['新洗那幅','夹子','帘','挂']],[54,['七十二','旧灯','不修']]]){
  const u=state.units.find(x=>x.unit===id),txt=fs.readFileSync(path.join(root,u.draft),'utf8');
  console.log(JSON.stringify({unit:id,draft:u.draft,pages:Math.ceil(txt.length/1800),hits:terms.flatMap(term=>[...txt.matchAll(new RegExp(term,'g'))].map(m=>({term,page:Math.floor(m.index/1800)+1})))}));
 }
}
