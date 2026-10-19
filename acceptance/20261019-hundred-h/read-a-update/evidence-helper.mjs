import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const dir=path.dirname(fileURLToPath(import.meta.url)), base=path.dirname(dir), project=path.join(base,'work');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const read=f=>JSON.parse(fs.readFileSync(f,'utf8'));
const save=(name,data)=>fs.writeFileSync(path.join(dir,name),JSON.stringify(data,null,2)+'\n',{flag:'wx'});
function tree(root,skipWriter=false,prefix='') {let rows=[];for(const e of fs.readdirSync(path.join(root,prefix),{withFileTypes:true}).sort((a,b)=>a.name.localeCompare(b.name))){if(!prefix&&skipWriter&&e.name==='.writer')continue;const rel=prefix?prefix+'/'+e.name:e.name;assert.ok(!e.isSymbolicLink());if(e.isDirectory())rows.push(...tree(root,skipWriter,rel));else{const b=fs.readFileSync(path.join(root,rel));rows.push({file:rel,bytes:b.length,sha256:sha(b)});}}return rows;}
const state=()=>read(path.join(project,'.writer/state.json'));
function snapshot(name){const bytes=fs.readFileSync(path.join(project,'.writer/state.json')),s=JSON.parse(bytes);fs.writeFileSync(path.join(dir,name+'-state.bin'),bytes,{flag:'wx'});const j={at:new Date().toISOString(),project,state_sha256:sha(bytes),revision:s.revision,schema:s.schema_version,generation:s.tool_control?.generation,unit_count:s.units.length,units_sha256:sha(JSON.stringify(s.units)),snapshot_sha256:sha(JSON.stringify(s.snapshot)),root:tree(project,true),tool:tree(path.join(project,'.writer/tool'))};save(name+'-inventory.json',j);return j;}
const action=process.argv[2];
if(action==='baseline'){
 const j=snapshot('before-update');assert.equal(j.unit_count,106);assert.equal(j.state_sha256,sha(fs.readFileSync(path.join(base,'baseline-state.bin'))));
 fs.cpSync(path.join(project,'.writer/tool'),path.join(dir,'old-package'),{recursive:true,errorOnExist:true,force:false});
 const source=path.join(base,'sources/package-v1');fs.cpSync(source,path.join(dir,'new-package'),{recursive:true,errorOnExist:true,force:false});
 const evidenceFile=path.join(project,'研究/H轮PLAN原始任务.md');fs.mkdirSync(path.dirname(evidenceFile),{recursive:true});fs.copyFileSync(path.join(base,'PLAN.md'),evidenceFile,fs.constants.COPYFILE_EXCL);
 const plan=read(path.join(base,'commands/ra-update-plan/stdout.raw.txt'));assert.equal(plan.can_update,true);assert.equal(plan.source.files.length,61);assert.deepEqual(plan.blockers,[]);
 const author_evidence={quote:'继续通过 Codex 做百章规模的长篇实跑验证，重点覆盖新版工具下的多轮跨会话恢复、跨卷伏笔回收和多处旧章修改后的连续性，发现问题直接修复，保留完整验证记录，暂不修改现有作品。',local_source:'研究/H轮PLAN原始任务.md',source_sha256:sha(fs.readFileSync(evidenceFile)),locator:'H轮PLAN.md 第5–9行；原始人类任务第7行；本次副本更新安排第18行。工具验证授权，非作者文学采纳。',recorded_by:'Codex read-a-update agent; parent-organized verification'};
 save('author-evidence.json',author_evidence);save('update-input.json',{...plan.request,author_evidence});save('update-plan.json',plan);
 save('scope.json',{project,source,write_boundary:base,role:'actual Codex process read-a-update; informed model self-review',allowed:['tool update','workflow discuss/plan','read original chapters 1–27','reports'],forbidden:['draft 107','edit prose','resume old revisions','subagents','network','commit','push','publish'],source_task:'PLAN.md:5–18'});
 console.log(JSON.stringify({baseline:j.state_sha256,unit_count:j.unit_count,root_count:j.root.length,tool_count:j.tool.length,input:'read-a-update/update-input.json'}));
}else if(action==='after-update'){
 const a=snapshot('after-update'),b=read(path.join(dir,'before-update-inventory.json'));assert.equal(a.revision,b.revision+1);assert.equal(a.generation,b.generation+1);assert.equal(a.schema,6);assert.equal(a.units_sha256,b.units_sha256);assert.equal(a.snapshot_sha256,b.snapshot_sha256);
 const current=new Map(a.root.map(x=>[x.file,x]));for(const r of b.root)assert.deepEqual(current.get(r.file),r,r.file);
 const retry=read(path.join(base,'commands/ra-update-retry/result.json'));assert.equal(retry.before_state_sha256,retry.after_state_sha256);
 save('update-preservation.json',{ok:true,original_root_files:b.root.length,preserved_all_original_root_files:true,added_root_files:a.root.filter(x=>!b.root.some(y=>y.file===x.file)),units_unchanged:true,snapshot_unchanged:true,generation:[b.generation,a.generation],revision:[b.revision,a.revision],schema:a.schema,retry_state_unchanged:true});
 console.log(JSON.stringify({ok:true,revision:a.revision,generation:a.generation,preserved:b.root.length}));
}else if(action==='workflow-input'){
 const s=state(),e=read(path.join(dir,'author-evidence.json'));save('workflow-input.json',{expected_revision:s.revision,operation_id:'h-read-a-update-workflow-v1',author_evidence:e,workflow:{stage:'paused',task:'H轮 read-a-update：现在只恢复、阅读原正文1–27章和规划，不写107。按冻结0.7.4验证副本；父执行者代理安排不冒充作者文学选择。下一阶段新进程读23–54。',authorization:{allowed_actions:['discuss','plan'],draft_range:null,revise_range:null,stop_conditions:['保持106章；107与任何新章均未授权，不创建正文或新细纲。','只写H轮目录；旧revision只读且不resume/transfer、不改绑定。','不改已消费来源/ledger/人物事实；旧24章和只写1–4字样保留为历史。','不联网、不子代理、不提交推送发布；本次只声称1–27实读。']},planning:s.governance?.workflow?.planning??s.governance?.planning??read(path.join(base,'commands/ra-initial-status/stdout.raw.txt')).governance.planning}});console.log('workflow-input.json prepared at revision '+s.revision);
}else if(action==='final'){
 const a=snapshot('final'),b=read(path.join(dir,'before-update-inventory.json'));assert.equal(a.unit_count,106);assert.equal(a.units_sha256,b.units_sha256);assert.equal(a.snapshot_sha256,b.snapshot_sha256);for(const r of b.root)assert.deepEqual(a.root.find(x=>x.file===r.file),r,r.file);
 const labels=fs.readdirSync(path.join(base,'commands')).filter(x=>x.startsWith('ra-')).sort();const commands=labels.map(label=>({label,...read(path.join(base,'commands',label,'result.json'))}));save('command-inventory.json',{project,commands});
 console.log(JSON.stringify({revision:a.revision,schema:a.schema,generation:a.generation,units:a.unit_count,commands:commands.length,root_preserved:true}));
}else throw Error('unknown action');
