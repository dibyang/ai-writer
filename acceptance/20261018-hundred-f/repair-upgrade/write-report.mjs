import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {BASE,session,sha,readJSON} from '../session-support.mjs';
const s=session('repair-upgrade'), stage=s.stage, work=s.project;
const get=f=>readJSON(path.join(stage,f));
const state=s.state(), raw=fs.readFileSync(path.join(work,'.writer/state.json'));
const seal=get('seal-verification.json'), commands=get('command-index.json'), check=get('final-check.json'), status=get('final-status.json'), doctor=get('final-doctor.json'), branchDoctor=get('branch-doctor-verification.json'), begin=get('revision-begin.json'), compare=get('installed-source-comparison.json'), update=get('update-verification.json'), failures=get('failures.json'), start=get('started.json');
assert.equal(sha(raw),seal.final_state_sha256);assert.equal(seal.ok,true);assert.equal(compare.same_content,true);
const completed=new Date().toISOString();
const fingerprints={content_id:compare.left.observed_content_id,runtime_id:compare.left.runtime_id,loaded_execution_build_id:branchDoctor.revision_context.execution_build_id,bound_revision_build_id:branchDoctor.revision_context.bound_build_id,build_matches:branchDoctor.revision_context.build_matches,installed_source_same_content:compare.same_content,note:'三个不同命名空间；仅引用实际工具返回值及匹配布尔值，未手填替换。'};
const results={phase:'repair-upgrade',status:'isolated-candidate-upgrade-and-no-text-change-branch-diagnostic-complete',formal_acceptance:false,release:false,started_at:start.started_at,completed_at:completed,measured_execution_elapsed_ms:Date.now()-Date.parse(start.started_at),preparatory_reading_in_elapsed:false,work,tool_version:doctor.tool_version,schema:state.schema_version,revision:state.revision,generation:state.tool_control.generation,state_sha256:sha(raw),fingerprints,upgrade:{from_version:'0.7.1',from_revision:379,from_generation:2,source:path.join(BASE,'sources/package-v2'),source_build_record:path.join(BASE,'source-build-v2.json'),documents:[],enabled:false,schema_migrated:false,...update},branch:{id:begin.id,workspace:begin.workspace,base_revision:begin.base_revision,status:'aborted',token_file:'revision-begin.json',token_active:false,baseline_sha256:get('branch-created.json').baseline_sha256,scope:begin.scope,doctor:branchDoctor,resume:get('resume-verification.json'),no_text_changes:true,rewind:false,record:false,commit:false,all_baseline_files_equal:seal.branch_all_baseline_files_equal,candidate_and_backups_preserved:true},verification:seal,check,commands:{count:commands.length,index:'command-index.json',raw_root:'../commands/f-repair-upgrade-*',fresh_cli_processes:true,other_Codex_sessions_started:false},failures,main_project:{source_modified_here:false,tests_run_here:false,full_suite_status:'not confirmed in this process; do not infer release or final acceptance'},next_phase:'draft-e',new_chapters_written:0,network_used:false,subagents_started:false,committed:false,pushed:false,published:false};
s.write('results.json',results);
const nextFiles=['REQUEST.md','COVERAGE.md','repair-upgrade/handoff.md','repair-upgrade/handoff.json','repair-upgrade/REPORT.md','repair-upgrade/results.json','read-d/REPORT.md','read-d/readings.json','read-d/earlier-rereads.json','read-d/scenario-plan.md','read-d/scenario-plan.json','findings/confirmed-48.json','findings/brick-wording-group.json'];
const d=readJSON(path.join(BASE,'read-d/handoff.json'));
const handoff={phase:'repair-upgrade',status:results.status,work,completed_at:completed,tool_version:doctor.tool_version,schema:state.schema_version,revision:state.revision,generation:state.tool_control.generation,state_sha256:sha(raw),build_id:fingerprints.loaded_execution_build_id,build_id_namespace:'loaded/execution runtime guard; not tool identify content_id or runtime_id',content_id:fingerprints.content_id,runtime_id:fingerprints.runtime_id,fingerprints,version_switch:{previous_handoff:'read-d/handoff.json',previous_version:d.tool_version,previous_revision:d.revision,previous_generation:d.generation,explicit_switch:true,do_not_backfill_old_D_metadata:true},active_revision:null,revision_token:null,diagnostic_revision:results.branch,tool_transaction_pending:false,current_workflow:status.governance,check,source_preservation:{old_source:path.join(BASE,'sources/package'),new_source:path.join(BASE,'sources/package-v2'),both_unchanged:true,new_source_same_content:compare.same_content},literature:{registered_units:100,new_chapters:0,body_unchanged:true,units_unchanged:true,snapshot_unchanged:true,source_hashes_unchanged:true,root_custom_unchanged:true,historical_stale_reviews_retained:62,new_reading_or_literary_review:false,reading_coverage_source:'read-d/handoff.json and its four actual prior reading stages',unknown:d.unknown,knowledge_custody_reference:d.knowledge_custody_and_timing},next:{phase:'draft-e',entry:path.join(work,'.writer/tool/bin/ai-writer.mjs'),restore_from_this_handoff:true,commands_first:['status','workflow show','doctor','tool identify','context --purpose discussion','check'],authorization:'当前paused仅discuss/plan，须按真实F轮原话和当时实际state另登记有限101—103；代理执行范围具体化，不伪称作者逐条选择剧情。',batches:[[101,103],[104,106]],each_batch_separate_actual_process:true,chapter_target_Han_characters:[3000,4000],also_report_nonwhitespace:true,planning_reference:'read-d/scenario-plan.md/json',old_revision_candidates:[48,54,66,71],old_revisions_not_done:true,old_revision_scope_plan:[48,106],old_revision_batches:[[48,62],[63,77],[78,92],[93,106]],warning:'不可再用D的379/gen2生成输入；新输入使用实际当前revision/generation及工具返回值。诊断分支已abort，不可resume；后续旧章修改需新建正式受保护候选，真实replay_review与CAS。不得在100基线声称CAS发布新增101—106。'},next_files:nextFiles,unresolved:results.main_project.full_suite_status,scope:'isolated candidate only, not formal release or final acceptance',artifacts:{report:'REPORT.md',results:'results.json',verification:'seal-verification.json',commands:'command-index.json',failures:'failures.json'},network_used:false,subagents_started:false,new_Codex_sessions_started:false,committed:false,pushed:false,published:false};
s.write('handoff.json',handoff);
const report=[
'# F轮0.7.2切换与百章修订区doctor实际验证',
'',
'状态：隔离候选实跑完成；不是正式发布或最终产品验收。主任务全套测试状态未在本进程确认。本进程只修改本campaign记录与work，不修改主源码或冻结源。',
'',
'读取REQUEST/COVERAGE、D交接md/json、source-build-v2和branch-doctor-before/before-v2/after后执行。D交接0.7.1 / revision379 / generation2与本次0.7.2是明确版本切换，旧记录保持原样。',
'',
'|实测阶段|结果|',
'|---|---|',
'|外部新进程初始status/workflow show/doctor/identify/check|100章，state精确匹配D交接；安装包为0.7.1，所有读取state不变|',
'|外部0.7.2 update-plan与显式update|来源sources/package-v2，documents=[]；真实F原话与实际来源SHA；revision379→380，generation2→3；无enable、无schema迁移|',
'|原输入立即重试|两份input.raw.json原字节相同；幂等返回，state原字节相同，无第二次revision/generation推进|',
'|新随附入口help/doctor/status/discussion/check/identify/compare|全部成功；安装包与package-v2 same_content=true，differences=[]，根定制不覆盖|',
'|临时workflow与begin|仅discuss/plan/revise，revise100—100，draft=null；代理执行范围具体化，无剧情选择；workflow推进至381，begin不推进业务revision|',
'|实际分支doctor|外部主0.7.2入口，新session记录器repair-upgrade-branch，默认main；ok=true，资源为父work与父.writer/tool；build_matches=true；分支无自带工具|',
'|错误/真实令牌resume|错误为REVISION_OWNER_REQUIRED；正确恢复原workspace/base_revision381；base.json、父/分支state原字节不变；实际分支status/context/check成功|',
'|abort与暂停|明确abort无改稿诊断候选，保留全分支/备份；只改协作元数据；workflow回paused，discuss/plan，两范围null，revision382|',
'|最终随附doctor/status/check/context及封存|全部ok；100正文、完整units/snapshot、全部原source_hashes和40项根定制完全相同；主源码与两份冻结源未变|',
'',
'当前schema6 / revision'+state.revision+' / generation'+state.tool_control.generation+' / '+doctor.tool_version+'。state SHA256='+sha(raw)+'。',
'',
'内容ID='+fingerprints.content_id+'；runtime_id='+fingerprints.runtime_id+'；loaded/execution build_id='+fingerprints.loaded_execution_build_id+'。三者口径不同，值及匹配布尔值均来自实际工具返回；未相互替换。',
'',
'诊断ID='+begin.id+'；base_revision='+begin.base_revision+'；workspace='+begin.workspace+'。已aborted，无活动令牌；原始令牌仅保存在本地revision-begin.json及原输入中，不删除。没有修改正文、rewind、record、prepare或commit。整个分支受管基线文件均与base.json相符。',
'',
'共'+commands.length+'条实际新产品CLI进程，所有argv、输入、原始stdout/stderr、父或目标state前后字节、构建观测见command-index.json和../commands。它们不是另一Codex会话。2次命令形式错误（workflow缺show、help带记录器project）及1次预期错误令牌均保留；3次记录脚本错误（git启动、Git路径引用、help文本解析）单独留档，不冒充产品缺陷。本次无新确认产品缺陷。',
'',
'旧诊断三类严格分开：从C复制旧封存分支marker位置不匹配的REVISION_CORRUPT是正确拒绝；真实D分支缺.writer/tool导致ENOENT是此次主任务修复的问题；0.7.2读取绑定旧构建的D分支build_matches=false是正确保护。原档案本进程未操作、未改元数据、未拷运行包。',
'',
'最终state只变化revision、governance/governance_binding/governance_events、operations、tool_control；其他文学与来源状态完全相同。既有工作文件仅7项变化，均为state或包内更新文件；新增协作/事务/备份材料完整保留。check为mechanical-only、literary_quality=unreviewed，rolling_review valid51/stale62原样保留，不新增文学审查。',
'',
'下一实际进程draft-e必须从本交接恢复；按当时真实state和F原话重新登记有限101—103，随后下一进程104—106，每章3000—4000汉字并报告非空白字符。D的scenario-plan仍是计划，未知与物件/知情边界见D报告；本阶段不新增章纲和正文。四处旧章48/54/66/71候选尚未执行，续至106后另建正式保护分支及逐章实读/CAS。不要再使用379/gen2生成新输入。',
'',
'未联网、未启动其他代理/Codex会话、未提交推送或发布。主任务全套测试未确认，来源仍为本地0.7.2候选。本次不运行或冒称仓库全套验收。',
''
].join('\n');
s.write('REPORT.md',report);
const md=[
'# F轮repair-upgrade交接',
'',
'唯一作品：'+work+'。当前'+doctor.tool_version+' / schema6 / revision'+state.revision+' / generation'+state.tool_control.generation+'。state SHA256='+sha(raw)+'。',
'',
'内容ID='+fingerprints.content_id+'；runtime_id='+fingerprints.runtime_id+'；loaded/execution build_id='+fingerprints.loaded_execution_build_id+'。不同口径，均取工具返回，不得相互填换。',
'',
'0.7.1旧源sources/package与0.7.2新源sources/package-v2均完整保留且未变。安装包与新源same_content=true。D的379/gen2交接属于旧阶段，不回填新状态。',
'',
'无改稿诊断分支'+begin.id+'已abort，base_revision='+begin.base_revision+'，workspace='+begin.workspace+'；全分支/备份保留、基线未刷新，父/分支state在doctor/resume前后原字节完全相同。令牌保留于revision-begin.json但候选已终态，不继续resume。无正文修改、rewind、record或CAS提交。',
'',
'100正文、完整units/snapshot、全部原source_hashes、40项根AGENTS/技能/手册完全相同；主源码与冻结源不变。最终doctor/status/check/context均ok。check仅mechanical-only；51 valid/62 stale审查照留。workflow已paused，仅discuss/plan，draft/revise范围null，无活动修订或待恢复事务。',
'',
'下一阶段draft-e从此交接及实际文件恢复，先status、workflow show、doctor、tool identify、discussion context、check；使用当时实际revision/generation重新登记真实F原话下有限101—103，再由下一实际进程104—106。每章3000—4000汉字并报告非空白字符。必须读取D的REPORT/readings/scenario-plan及handoff中信息与物件边界，计划不当已发生情节。四处旧章候选尚未修改，后续保护流程见handoff.json。不要再按D的379/gen2生成新输入。',
'',
'33条实际产品CLI原始记录和所有失败保留，见REPORT.md、results.json、command-index.json、failures.json。外部main对新分支doctor已实测ok且build_matches=true，没有给分支复制工具；真实令牌恢复保持原workspace和base_revision。CLI进程不冒称另一Codex会话。',
'',
'这是隔离候选实跑；主任务全套测试状态未确认，不宣称正式发布或最终验收。未联网、未启动其他代理/会话、未提交推送或发布。',
''
].join('\n');
s.write('handoff.md',md);
const artifacts=['REPORT.md','results.json','handoff.md','handoff.json','seal-verification.json','command-index.json','failures.json'];s.write('artifact-index.json',artifacts.map(ref=>({path:ref,sha256:sha(fs.readFileSync(path.join(stage,ref)))})));
console.log(JSON.stringify({ok:true,artifacts,revision:state.revision,generation:state.tool_control.generation,state_sha256:sha(raw),commands:commands.length}));
