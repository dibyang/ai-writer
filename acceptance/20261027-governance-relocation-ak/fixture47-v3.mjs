import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {main} from '../../lib/workspace.mjs';
import {initProject} from '../../.tmp/relocation-ai6/ai-writer-0.10.0/lib/workspace.mjs';
import {file,state,evidence,workflow,call} from '../../tests/protection-fixture.mjs';
const base=path.dirname(fileURLToPath(import.meta.url)),root=path.join(base,'work-v3');
if(fs.existsSync(root))throw Error('Fixture exists; preserve it');
const events=[];function log(step,extra={}){events.push({step,at:new Date().toISOString(),...extra});fs.writeFileSync(path.join(base,'fixture47-v3-progress.json'),JSON.stringify(events,null,2));}
initProject(root,'history','合成历史迁移验证');file(root,'研究/验证授权.md','允许独立验证作品在规定范围内试写、修订、版本发布和中断恢复。\n这是合成测试材料，不冒充实际作者逐条确认。\n');workflow(root);
file(root,'研究/合成事实卡.json',{status:'verified',claims:[{type:'direct',statement:'本条为虚构测试数据',boundary:'仅接口验证，不指称真实历史',source_dependency:'合成来源',sources:[{title:'测试来源',locator:'测试位置',excerpt:'合成证据',checked_at:'2026-10-27'}]}]});
let w=call(root,'workflow','show').workflow;w.authorization.draft_range.to=47;call(root,'workflow','set',{expected_revision:state(root).revision,operation_id:'ak-range47',author_evidence:evidence(root),workflow:w});
for(let n=1;n<=47;n++){
  const draft=`正文/${String(n).padStart(4,'0')}.md`;
  call(root,'plan',null,{unit:n,title:`合成第${n}篇`,goal:'检验来源',change:'记录合成事件',beats:['核对合成事实'],cast:[],setting_refs:[],research_refs:['研究/合成事实卡.json']});
  const input=main(['record-template','--project',root,'--unit',String(n),'--draft',draft]);file(root,draft,`# 合成第${n}篇\n\n这是一段仅供验证的合成历史叙述，编号${n}。\n`);input.summary=`合成事件${n}的记录`;input.changes.timeline_append=[`合成事件${n}`];call(root,'record',null,input);
  if(n%5===0||n===47)log('recorded',{n});
}
const before=state(root);w=call(root,'workflow','show').workflow;w.planning.structure={status:'adopted',refs:before.units.slice(0,34).map(u=>u.draft),unresolved_ids:[]};call(root,'workflow','set',{expected_revision:before.revision,operation_id:'ak-planning34',author_evidence:evidence(root),workflow:w});
const original=state(root),ranges=[[1,7],[8,17],[18,25],[26,37],[38,47]],dirs=ranges.map(([from,to],i)=>({volume_id:`V${i+1}`,directory:`正文/V${i+1}-合成卷`,from,to})),mapping=original.units.map(u=>({unit:u.unit,from:u.draft,to:`${dirs.find(d=>u.unit>=d.from&&u.unit<=d.to).directory}/${path.basename(u.draft)}`,sha256:u.sha256}));
const planned=call(root,'draft','relocate-plan',{mapping,directories:dirs}),result=call(root,'draft','relocate',{...planned.request,author_evidence:evidence(root)});const after=state(root);if(result.moved!==47||result.body_copies!==0||after.schema_version!==7)throw Error('migration mismatch');
for(const u of original.units){const v=after.units[u.unit-1],bytes=fs.readFileSync(path.join(root,v.draft)),digest=crypto.createHash('sha256').update(bytes).digest('hex');if(digest!==u.sha256||fs.existsSync(path.join(root,u.draft)))throw Error(`body ${u.unit}`);}
for(const cmd of [['status'],['check'],['source','list']]){const out=main([...cmd,'--project',root]);if(cmd[0]==='check'&&!out.ok)throw Error('check failed');log('command',{cmd,ok:true});}
if(JSON.stringify(after.governance.planning.structure.refs)!==JSON.stringify(original.governance.planning.structure.refs))throw Error('refs changed');
fs.writeFileSync(path.join(base,'fixture47-v3-result.json'),JSON.stringify({ok:true,root,units:47,planning_refs:34,volumes:5,schema:after.schema_version,revision:after.revision,moved:result.moved,body_copies:result.body_copies,refs_preserved:true,snapshot_equal:JSON.stringify(original.snapshot)===JSON.stringify(after.snapshot)},null,2)+'\n',{flag:'wx'});log('completed');
