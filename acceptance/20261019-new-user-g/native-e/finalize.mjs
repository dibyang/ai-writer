// Byte verification and report packaging only; product operations are captured CLI processes.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
const here=path.dirname(fileURLToPath(import.meta.url)),base=path.dirname(here),root=path.resolve(base,'../..'),project=path.join(base,'作品/纸桥书店 规划');
const slash=p=>p.replaceAll('\\','/');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const write=(n,v)=>fs.writeFileSync(path.join(here,n),typeof v==='string'?v:JSON.stringify(v,null,2)+'\n',{flag:'wx'});
const cmdDir=n=>path.join(base,'commands',n);
const meta=n=>read(path.join(cmdDir(n),'result.json'));
const output=n=>read(path.join(cmdDir(n),'stdout.raw.txt'));
function archive(p,rel,method='byte-verification') {
 const b=fs.readFileSync(p),dest=path.join(here,'read-versions',rel);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,b,{flag:'wx'});
 return {path:slash(p),snapshot:slash(path.relative(here,dest)),bytes:b.length,sha256:sha(b),range:{from_line:1,to_line:b.toString('utf8').split('\n').length,byte_start:0,byte_end_exclusive:b.length},coverage:'entire-file',method,observed_at:new Date().toISOString()};
}
const build=read(path.join(base,'source-build-g4.json')),baseline=read(path.join(here,'build-baseline.json'));
const source=output('e-source-identify'),bundle=output('e-bundled-identify'),doctor=output('e-doctor-final');
const status=output('e-status-after-refusals'),workflow=output('e-workflow-final'),discussion=output('e-discussion-final');
const actualState=fs.readFileSync(path.join(project,'.writer/state.json')),state=JSON.parse(actualState),stateSha=sha(actualState);
const resourceRows=build.files.map(r=>{
 const rel=r.group==='skills'?'.agents/skills/'+r.file:r.file;
 const a=fs.readFileSync(path.join(root,rel)),b=fs.readFileSync(path.join(project,'.writer/tool',rel));
 return {group:r.group,ref:rel,expected_bytes:r.bytes,expected_sha256:r.sha256,source_sha256:sha(a),bundled_sha256:sha(b),matches:a.length===r.bytes&&b.length===r.bytes&&sha(a)===r.sha256&&sha(b)===r.sha256};
});
const help=fs.readFileSync(path.join(cmdDir('e-help-final'),'stdout.raw.txt'),'utf8');
const helpPaths=['docs/user-guide.md','docs/workflow.md','docs/long-form.md','docs/deslop.md'].map(r=>({ref:r,path:slash(path.join(project,'.writer/tool',r)),present_in_help:help.includes(path.join(project,'.writer/tool',r))}));
write('resources-check-final.json',{frozen:path.join(base,'source-build-g4.json'),content_id:build.observed_content_id,runtime_id:build.runtime_id,source_identity:source.observed_content_id,bundled_identity:bundle.observed_content_id,rows:resourceRows,help_paths:helpPaths,g3_to_g4_delta:baseline.delta_from_g3});
const protectedBaseline=read(path.join(here,'protected-baseline.json'));
const differences=protectedBaseline.files.filter(r=>!fs.existsSync(r.path)||sha(fs.readFileSync(r.path))!==r.sha256);
const driftPath=slash(path.join(base,'final-audit.mjs'));
const driftObservation=differences.map(r=>({...r,actual_sha256:sha(fs.readFileSync(r.path)),actual_bytes:fs.statSync(r.path).size}));
write('protected-check-final.json',{baseline:'protected-baseline.json',file_count:protectedBaseline.files.length,differences:driftObservation,coverage_note:protectedBaseline.note,interpretation:'One existing audit helper changed during this run. This execution issued no write to it. Preserve the difference without attributing its actor. All other baseline files are checked separately; do not claim a globally unchanged G directory.'});
const stableRefs=['设定/作品定位.md','设定/文风.md','设定/权威规则.md'];
const scopePattern=/本轮|下一会话|只规划|不写正文|不授权试写|draft_range|stop_conditions|allowed_actions/;
const stableCheck=stableRefs.map(r=>({ref:r,...(()=>{const b=fs.readFileSync(path.join(project,r));return {bytes:b.length,sha256:sha(b),temporary_scope_match:scopePattern.test(b.toString('utf8'))};})()}));
const body=path.join(project,'正文'),bodyEntries=fs.readdirSync(body);
const rejected=['e-draft-context-1-rejected','e-record-template-1-rejected'].map(label=>{
 const m=meta(label),error=read(path.join(cmdDir(label),'stderr.raw.txt'));
 return {label,exit_code:m.exit_code,code:error.code,before_state_sha256:m.before_state_sha256,after_state_sha256:m.after_state_sha256,state_bytes_equal:fs.readFileSync(path.join(cmdDir(label),'before-state.json')).equals(fs.readFileSync(path.join(cmdDir(label),'after-state.json'))),matches_final_state:m.before_state_sha256===stateSha&&m.after_state_sha256===stateSha,scope:error.scope.authorization,raw_error:path.relative(base,path.join(cmdDir(label),'stderr.raw.txt'))};
});
const volumes=[1,2,3].map(i=>read(path.join(project,`大纲/分卷/V${i}.json`)));
const units=[1,2,3].map(i=>read(path.join(project,`大纲/单元/${String(i).padStart(4,'0')}.json`)));
const labels=fs.readdirSync(path.join(base,'commands')).filter(x=>x.startsWith('e-')).sort();
const commands=labels.map(label=>({label,...meta(label),evidence_dir:slash(path.join(base,'commands',label))}));
const checks=[
 ['g4-source-and-copy-resources',resourceRows.length===61&&resourceRows.every(r=>r.matches)],
 ['g4-cli-identity',source.observed_content_id===build.observed_content_id&&bundle.observed_content_id===build.observed_content_id&&doctor.build.observed_content_id===build.observed_content_id&&bundle.runtime_id===build.runtime_id],
 ['g3-delta-documents-only',baseline.delta_from_g3.length===2&&baseline.delta_from_g3.includes('docs/review-and-registration.md')&&baseline.delta_from_g3.includes('docs/workflow.md')&&baseline.runtime_unchanged&&baseline.three_separation_docs_unchanged],
 ['bundled-doctor-help',doctor.ok&&doctor.errors.length===0&&doctor.tool_version==='0.7.4'&&helpPaths.every(p=>p.present_in_help)&&meta('e-help-final').exit_code===0],
 ['fresh-file-recovery',status.ok&&workflow.ok&&discussion.ok&&discussion.purpose==='discussion'&&status.revision===4&&workflow.revision===4&&discussion.revision===4&&status.next.plan_exists===true],
 ['planning-only-authorization',state.governance.stage==='paused'&&JSON.stringify(state.governance.authorization.allowed_actions)===JSON.stringify(['discuss','plan'])&&state.governance.authorization.draft_range===null&&state.governance.authorization.revise_range===null],
 ['planning-material-not-adopted',Object.values(state.governance.planning).every(p=>p.status==='draft'&&p.refs.length>0&&p.refs.every(r=>fs.existsSync(path.join(project,r))))],
 ['three-contiguous-volumes',JSON.stringify(volumes.map(v=>[v.start,v.end]))===JSON.stringify([[1,4],[5,8],[9,12]])],
 ['three-real-detailed-plans',JSON.stringify(units.map(v=>v.unit))===JSON.stringify([1,2,3])&&units.every(v=>v.beats.length>=6&&v.goal&&v.change&&v.arc_id==='E_A1')],
 ['agent-proposal-is-candidate',state.decisions.D_E_AGENT_PROPOSAL.status==='candidate'&&state.decisions.D_E_AGENT_PROPOSAL.adopted_items.length===0],
 ['stable-sources-have-no-task-scope',stableCheck.every(r=>!r.temporary_scope_match)&&stableCheck.every(r=>r.bytes>500)],
 ['draft-context-and-template-denied-with-byte-identity',rejected.every(r=>r.exit_code===2&&r.code==='ACTION_OUT_OF_SCOPE'&&r.state_bytes_equal&&r.matches_final_state)],
 ['no-rejection-output-artifacts',!fs.existsSync(path.join(project,'.writer/drafts/e-draft-context-1.json'))&&!fs.existsSync(path.join(project,'.writer/drafts/e-record-1.json'))],
 ['zero-registered-and-empty-body',state.units.length===0&&status.draft_inventory.registered_count===0&&status.draft_inventory.unregistered.length===0&&bodyEntries.length===0&&status.current.character_count===0&&status.current.ledger_count===0],
 ['existing-g-files-except-observed-audit-drift-unchanged',differences.every(r=>r.path===driftPath)],
 ['all-e-captures-expected-exits-and-build',commands.every(m=>m.runtime_files_stable===true&&m.build_before.version==='0.7.4'&&(rejected.some(r=>r.label===m.label)?m.exit_code===2:m.exit_code===0))]
].map(([name,pass])=>({name,pass}));
if(checks.some(c=>!c.pass)) {write('checks-failure.json',{checks});throw Error('Acceptance evidence checks failed: '+checks.filter(c=>!c.pass).map(c=>c.name).join(', '));}
write('audit-drift-note.json',{observation:driftObservation,prior_attempt:'checks-failure.json preserves the first strict baseline check failure',current_audit_snapshot:archive(path.join(base,'final-audit.mjs'),'boundary-observation/final-audit-current.mjs','archive of observed changed audit helper; not a task instruction'),action:'Preserved; no overwrite or attribution; this file is outside the g4 product file list.'});
write('scope-check.json',{mechanical_patterns:scopePattern.source,stable_sources:stableCheck,semantic_inspection:'Codex fully read all three final sources; only durable story/world/expression constraints found. Regex is supporting evidence, not the semantic conclusion.',task_locations:['.writer/state.json:governance','.writer/objects/a5dacb13-4593-4b01-a157-99172ff104ec.json','研究/作者任务原话.md','研究/本轮任务与交接.md'],rejections:rejected,body_directory:slash(body),body_entries:bodyEntries});
const initial=read(path.join(here,'initial-readings.json')).map(r=>({...r,method:r.path.endsWith('/.writer/state.json')?'archive-only; initial status read separately':'full-agent-file-read via FastCtx'}));
const final=read(path.join(here,'final-readings.json')).map(r=>({...r,method:r.path.endsWith('.txt')?'hash-identical frozen copy of fully read author source':'full-agent-file-read via FastCtx'}));
const extra=[];
extra.push(archive(path.join(base,'source-build-g3.json'),'inputs/source-build-g3.json','manifest comparison; not a product result'));
for(const rel of ['docs/quickstart.md','docs/user-guide.md','docs/long-form.md','docs/workflow.md','.agents/skills/writer-project/SKILL.md','.agents/skills/writer-project/references/long-form.md']) extra.push(archive(path.join(project,'.writer/tool',rel),'bundled/'+rel,'whole-byte equality to fully read current manual/skill'));
for(const label of labels) for(const file of ['stdout.raw.txt','stderr.raw.txt','result.json']) extra.push(archive(path.join(cmdDir(label),file),'commands/'+label+'/'+file,'captured fresh CLI output; JSON checks parsed in finalize.mjs, help and task outputs also read via FastCtx'));
write('readings.json',{scope:'E only; complete byte snapshots, actual paths, hashes and ranges. Methods distinguish agent reading from archive/byte verification.',initial,final,additional:extra});
const handoff={case:'G/native-e',project:slash(project),body_directory:slash(body),registered_units:[],registered_count:0,unregistered_drafts:[],revision:state.revision,state_sha256:stateSha,stage:state.governance.stage,authorization:state.governance.authorization,planning:state.governance.planning,agent_proposal_status:'candidate; no human adoption',volumes:volumes.map(({id,title,start,end})=>({id,title,start,end})),detailed_units:[1,2,3],coarse_only_units:{from:4,to:12},temporary_scope_locations:['.writer/state.json:governance','.writer/objects/a5dacb13-4593-4b01-a157-99172ff104ec.json','研究/本轮任务与交接.md'],long_term_sources:stableRefs,next_step:'先恢复并讨论。必须取得用户实际的新有限写作授权与停止点，正式更新workflow后才可写正文；本交接不预授权限。',resume_commands:['node .writer/tool/bin/ai-writer.mjs status','node .writer/tool/bin/ai-writer.mjs workflow show','node .writer/tool/bin/ai-writer.mjs context --purpose discussion'],blocking_results:rejected.map(({label,code})=>({label,code})),open_items:state.decisions.D_E_AGENT_PROPOSAL.unresolved_items,active_revisions:[],tool:{version:build.tool_version,content_id:build.observed_content_id,runtime_id:build.runtime_id,manifest:slash(path.join(base,'source-build-g4.json'))},limits:'真实CLI规划与文件恢复，仅E；无正文、文学审查、真人新手研究或其他轮次结论。'};
handoff.boundary_observations=driftObservation;
handoff.boundary_note='final-audit.mjs differs from the protected baseline. No write to it was issued by this execution; actor not attributed. Preserve it; do not claim all old G files remained identical.';
write('handoff.json',handoff);
write('handoff.md',`# E 交接：纸桥书店规划\n\n作品：${slash(project)}\n\n正文目录：${slash(body)}（空）；已登记0章，未登记稿0份。revision=${state.revision}，next_unit=1。state SHA256：${stateSha}。\n\n本轮只讨论/规划，十二章三卷粗骨架、人物/文风、三卷1–4/5–8/9–12及前三章细纲已保存。四层planning均为draft；普通原创细节为candidate，无人类作者逐项采纳。第4–12章保持粗骨架。\n\n临时任务位于正式workflow及研究/本轮任务与交接.md。长期定位、文风和权威规则只保留故事与表达约束。正式事件为.writer/objects/a5dacb13-4593-4b01-a157-99172ff104ec.json。\n\n在作品目录依次运行随附入口的status、workflow show、context --purpose discussion恢复；验收重跑仍须经G轮capture.mjs并用新的唯一e-标签。当前stage=paused，allowed_actions=discuss/plan，两种正文区间均为空。下一会话须取得实际的新写作授权，明确有限章数及停止点，再更新workflow；有章纲不等于获准写正文。\n\n第1章draft context和record-template均实际以ACTION_OUT_OF_SCOPE拒绝，两次state原字节相同，未创建--out文件或正文。详细输入输出在../commands/e-*，快照和范围在readings.json与read-versions。\n\n来源为最终0.7.4 g4，content ID=${build.observed_content_id}。既存final-audit.mjs在运行期间与基线不同，本执行未对其发出写操作；差异保留，不归因、不覆盖，详见audit-drift-note.json。除此之外2262个既存G轮文件逐项SHA一致。本次只报告E，不代表文学质量、真人研究、其他轮次或发布验收。\n`);
const result={case:'G/native-e',status:'passed-for-this-cli-planning-and-recovery-case',checked_at:new Date().toISOString(),project:slash(project),version:build.tool_version,source_manifest:'source-build-g4.json',content_id:build.observed_content_id,runtime_id:build.runtime_id,revision:4,registered_count:0,unregistered_count:0,body_entries:bodyEntries,planning_only:true,agent_details_human_adopted:false,checks,rejections:rejected,protected_files_checked:protectedBaseline.files.length,command_count:commands.length,commands,scope:{long_term:stableRefs,temporary:handoff.temporary_scope_locations},next_step:handoff.next_step,readings:'readings.json',handoff:'handoff.json',other_rounds_evaluated:[],limitations:['仅本次E真实CLI规划与文件恢复','没有正文生成或正文文学审查','没有真人新手/盲读/市场研究','未运行主项目测试套件：未修改工具源码、技能或引擎','文件指纹是磁盘观测，不是供应链签名或模块加载证明'],writes:'仅G轮/native-e、新作品和commands/e-*；无提交、推送、联网或发布'};
result.status='cli-planning-and-recovery-passed-with-existing-audit-file-drift-observed';
result.boundary_observations=driftObservation;
result.protected_files_identical=protectedBaseline.files.length-differences.length;
result.warnings=['既存final-audit.mjs在运行期间与基线不同；本执行未对其发出写操作，不归因、不覆盖。原严格检查失败保留在checks-failure.json。'];
write('results.json',result);
const fileRow=r=>{const x=final.find(x=>x.path===slash(path.join(project,r)));return `| ${r} | 1–${x.range.to_line}；0–${x.bytes}（末端不含） | ${x.bytes} | ${x.sha256} |`;};
write('REPORT.md',`# G轮最终新建书回查E\n\n结论：本次真实CLI规划与文件恢复用例通过。作品已登记0章，正文目录为空；完整规划已保存，当前只允许discuss/plan，下一会话仍须实际写作授权。结论仅覆盖本次E。\n\n## 版本与入口\n\n最终来源是source-build-g4.json，0.7.4，content ID=${build.observed_content_id}，runtime ID=${build.runtime_id}。主项目与随附包的61项文件逐字节哈希/长度均匹配，随附doctor ok=true、help指向.writer/tool/docs。g3→g4仅docs/review-and-registration.md和docs/workflow.md改变；quickstart/user-guide/long-form的任务分离说明及运行模块不变。resources-check-final.json保存逐文件证据。\n\n全部${commands.length}次产品调用经原capture.mjs，标签以e-开头且唯一，每次启动新Node CLI进程；没有直接import业务API或手改state。最后三项status/doctor/help在作品目录使用.writer/tool入口完成。capture的runtime_guard_id只表示进程前后磁盘观测稳定，算法与正式runtime_id不同，不据此宣称已加载模块证明。\n\n## 实际规划与恢复\n\n读取真实初始化模板后才替换：定位标题为“纸桥书店”、文风标题为“作者声音”、规则标题为“权威规则”，初始占位字节在read-versions/initialized。现在定位、人物、文风与规则具有具体内容，全书十二章粗骨架完整；卷契约连续覆盖1–4、5–8、9–12，近期单元0001–0003为真实细纲，第4–12章仅粗骨架。四层planning=draft，代理普通细节D_E_AGENT_PROPOSAL=candidate、adopted_items为空；confirmed只记录用户真实指定的题名和十二章三卷规格。没有正文事实入账。\n\n新进程e-status-final、e-workflow-final、e-discussion-final读取revision=4；status显示next_unit=1、plan_exists=true、registered_count=0、unregistered=[]。discussion成功恢复任务与候选，不自动读取三份设定全文，因此另用FastCtx完整实读最终设定与研究记录，不能将discussion回包当作已整读设定。\n\n## 临时任务与长期设定\n\n临时“只讨论/规划、不写正文”、规划齐备及取证交接后的停止点、下一会话必须获得实际新写作授权，均在正式workflow、.writer/state.json的governance及事件.writer/objects/a5dacb13-4593-4b01-a157-99172ff104ec.json保存；本地可读记录为研究/作者任务原话.md、研究/本轮任务与交接.md及native-e/handoff.md/json。初始和最终workflow的冻结来源与原话SHA都保留。\n\n三份长期设定分别保存读者/核心冲突/视角/关系终局、叙述声音/对白/节奏、世界/物件/知情/经营因果约束，不含本轮停止点和下一会话权限。完整语义实读结论辅以scope-check.json中的词项检查；机械词项扫描不代替语义判断。\n\n| 实际作品内路径 | 完整读取行与字节范围 | 字节数 | SHA256 |\n| --- | --- | --- | --- |\n${[...stableRefs,'研究/作者任务原话.md','研究/本轮任务与交接.md','.writer/objects/a5dacb13-4593-4b01-a157-99172ff104ec.json'].map(fileRow).join('\n')}\n\n表内字节区间均从0起、末端不含；行号包含终止换行所对应空行。原字节在read-versions/final按实际相对路径保存，绝对路径、版本、范围及其他规划材料见readings.json。\n\n## 有章纲不等于写作授权\n\n第1章细纲已存在后，e-draft-context-1-rejected与e-record-template-1-rejected均真实返回退出码2、ACTION_OUT_OF_SCOPE；拒绝原因是未授权draft，而不是PLAN_REQUIRED或正文缺失。--out文件均未创建，正文目录无任何条目，没有生成测试正文。\n\n两次调用各自before-state.json与after-state.json逐字节相等，且前后SHA均为${stateSha}。调用后新进程status仍为revision=4、已登记0章、未登记0份，字符状态和事实账本均为空。\n\n## 保护边界与结果范围\n\n保护基线记录了新作品初始化后、规划编辑前的${protectedBaseline.files.length}个既存G轮文件，排除仅新native-e、新作品与commands/e-*；最终其中2262个文件SHA一致；final-audit.mjs与基线不同（最初严格检查的失败保存在checks-failure.json，前后SHA及当前字节另存audit-drift-note.json）。本执行未向该旧文件发出写操作，保留差异且不归因，不能宣称整个G目录无变化。原六章样稿A/B及既有消费来源在其余逐文件核对范围内，未回填、未改哈希。主项目g4清单内源码/技能/资源也逐项保持原字节；不宣称这份基线覆盖初始化前未快照的所有磁盘文件。没有提交、推送、联网、发布或正文导出。\n\n本次${checks.length}项证据检查通过，详见results.json；机械check仅核空正文规划状态的一致性。没有正文文学审查、真人新手研究、盲读、市场或发布验收，也没有预填其他轮次结论。未修改工具源码/技能/引擎，因此未运行npm test/doctor/engine总套件；本用例的真实随附doctor与check已保存。\n\n## 交接五项\n\n1. 作品完整路径：${slash(project)}；正文目录为其下正文/，当前为空。\n2. 已登记范围：0章；完成十二章三卷规划与前三章细纲，均为代理草案。\n3. 实际读审范围：当前三份手册与技能、初始化真实模板、最终三份设定/人物/全书纲/三卷/前三章纲及任务记录；只做文件、范围和权限核查，无正文可审。\n4. 未登记稿或阻断：0份未登记稿；draft context与record-template按未授权正文预期拒绝。\n5. 当前任务与下一步：仅讨论/规划，取证和交接完成即停止；正文或试写须用户实际新授权并正式更新workflow。\n`);
write('checks-output.json',{ok:true,checks,artifacts:['REPORT.md','readings.json','read-versions/','handoff.md','handoff.json','results.json','resources-check-final.json','protected-check-final.json','scope-check.json'],state_sha256:stateSha,registered_count:0});
console.log(JSON.stringify({ok:true,checks:checks.length,commands:commands.length,protected_files:protectedBaseline.files.length,state_sha256:stateSha,registered_count:0,body_entries:bodyEntries}));
