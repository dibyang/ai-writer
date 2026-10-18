import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
const here=path.dirname(fileURLToPath(import.meta.url)),root=path.dirname(here),source=path.dirname(path.dirname(root));
const read=f=>JSON.parse(fs.readFileSync(f)),sha=b=>crypto.createHash('sha256').update(b).digest('hex'),put=(f,x)=>fs.writeFileSync(path.join(here,f),typeof x==='string'?x:JSON.stringify(x,null,2)+'\n',{flag:'wx'});
const h=read(path.join(root,'native-c/handoff.json')),v=read(path.join(here,'verification-corrected.json')),initial=read(path.join(here,'initial.json')),final=read(path.join(here,'final.json'));
if(!v.ok)throw Error('Corrected audit has unresolved findings');
const commands=fs.readdirSync(path.join(root,'commands')).filter(x=>/^d-/.test(x)).sort().map(label=>{
  const dir=path.join(root,'commands',label),r=read(path.join(dir,'result.json'));
  return {label,exit_code:r.exit_code,started_at:r.started_at,elapsed_ms:r.elapsed_ms,input:r.input,before_state_sha256:r.before_state_sha256,after_state_sha256:r.after_state_sha256,stdout:path.relative(here,path.join(dir,'stdout.raw.txt')).replaceAll('\\','/'),stderr:path.relative(here,path.join(dir,'stderr.raw.txt')).replaceAll('\\','/'),result:path.relative(here,path.join(dir,'result.json')).replaceAll('\\','/')};
});
put('commands.json',commands);
const supports=['docs/user-guide.md','docs/long-form.md','docs/revision-and-sources.md','docs/review-and-registration.md','docs/tool-updates.md','.agents/skills/writer-project/SKILL.md','.agents/skills/writer-novel/SKILL.md','.agents/skills/writer-review/SKILL.md','.agents/skills/writer-review/references/general-review.md','.agents/skills/writer-review/references/natural-language-authenticity.md'].map(x=>path.join(source,x));
supports.push(...['native-c/handoff.md','native-c/handoff.json','PACKAGE-STAGES.md','source-build.json','source-build-final.json','source-build-g3.json','source-build-g4.json'].map(x=>path.join(root,x)));
const supportRows=supports.map((file,i)=>{const b=fs.readFileSync(file),copy=path.join(here,'read-versions',`support-${String(i+1).padStart(2,'0')}-${sha(b).slice(0,12)}-${path.basename(file)}`);fs.writeFileSync(copy,b,{flag:'wx'});return {path:file,sha256:sha(b),version:path.relative(here,copy).replaceAll('\\','/'),nature:'supplemental byte preservation after initial actual FastCtx/CLI reading; not a new full reading event or read-before-freeze assertion'};});
put('support-readings.json',supportRows);
const reviewRef=v.issue.verification.review_ref,reviewReport=path.join(h.project_path,'审查/0001-0006-D最终完整连读.md');
const results={schema_version:1,status:'completed-isolated-local-workflow-not-publication',project_path:h.project_path,manuscript_directory:h.manuscript_directory,revision:{id:h.revision_id,workspace:h.workspace,original_base_revision:18,base_sha256:final.base_manifest_sha256,main_start:18,main_after_commit:19,main_after_apply:20,main_after_verify:21,main_after_update:22,main_final:23,branch_start:21,branch_after_register:24,branch_final:25,commit_id:v.issue.application.commit_id,transaction_id:v.issue.application.transaction_id,session_status:'committed',transaction_status:'completed',repeat_commit_unchanged:true,token_file:path.join(here,'inputs/session-operation.json'),prior_C_initial_main_revision:15},registration:{main:[1,6],C_replayed:[2,3],D_replayed:[4,6],prefix1:'read-only; original unit record and original journal preserved',old_journals_preserved:true},actual_changes:{body:{unit:2,before:'你是不是问他欠多少修理费了？',after:'你问过他修理费要多少吗？',exactly_one_expression:true},summary3:{reason:'C已依据第3章65行将签借条者澄清为陶芷，正式重登保留这项语义校正；原单位及journal保留。'},body1_and_3_to_6_unchanged:true,snapshot:'Only seven chapter-2 evidence SHA bindings changed across six ledger entries; all quotes, observations, character knowledge, dates, custody, due fields, statuses and other literary facts preserved.',details:['commit-comparison.json','evidence-rebindings.json','update-comparison.json','pause-comparison.json']},issue:v.issue,tool:v.tool,readings:{final_range:{from:1,to:6},final_phase:'final-tail-1-6',final_after_all_records:true,full_displayed_after_marker:true,version_hashes:v.final_readings.map(r=>({path:r.path,sha256:r.sha256,version:r.version})),report:reviewReport,review_ref:reviewRef,review_kind:'model-self-review',rolling_current:1,old_stale_preserved:3,pending_windows:[],proof_boundary:'Parent actual model events determine text exposure; readings.json alone does not prove reading or understanding.'},export:v.export,final_task:{stage:'paused',allowed_actions:['discuss','plan'],next_unit:7,chapter7_context_denied:'ACTION_OUT_OF_SCOPE',chapter7_record_template_denied:'ACTION_OUT_OF_SCOPE',unregistered:[],active_sessions:[],pending_transactions:[]},verification:{file:'verification-corrected.json',ok:v.ok,guards:v.guards,failed_initial_report_preserved:'verification-final.json',source_build_g4:'../source-build-g4.json',pre_update:'before-update.json',post_update:'after-update.json'},failures_and_corrections:[{commands:['d-025-issue-apply','d-026-issue-verify'],reason:'Agent supplied transaction UUID instead of publication object commit_id, then tried expected revision20 while apply had not advanced19.',result:'Both rejected without state changes. Read publication binding and corrected input at d-028; only then d-029 verified with current valid report. Failed inputs and outputs preserved.'},{artifact:'verification-final.json',reason:'Local audit originally omitted expected formal tool build-manifest replacement from allowed old-path changes.',result:'Original failed report preserved. Corrected audit additionally verifies old/new manifest SHA against completed update transaction; verification-corrected.json is current.'},{artifact:'0004-D重登语义复核.md',reason:'First report draft counted 12 rather than 11 evidence quotes.',result:'Count corrected before record; record revalidated current report. No consumed report overwritten.'},{outputs:'Several setup/build/preview/doctor/compare/issue outputs were display-truncated.',result:'Raw capture output remains complete. Necessary metadata was subsequently parsed and displayed in focused summaries; all final 1–6 body output was complete and untruncated. Initial source-build combined print alone is not claimed as complete display.'}],uncovered:['No human blind reading, author finalization, market test or professional clock-repair validation.','No chapter7; sender identity/motive, old materials account/amount/payment, Monday move/new wall/new-site opening and month-end recheck remain unresolved or unperformed.','No network research, upload, paid service, publication, Git commit or push.','No product modules changed; local audit scripts are evidence helpers, not product test coverage.','Root original manuals intentionally retained; installed entry help points to updated package manuals.'],commands_file:'commands.json',source_inputs:['../native-c/handoff.md','../native-c/handoff.json','../native-c/inputs/resume-next-process.json','inputs/session-operation.json','inputs/record-4-reviewed.json','inputs/record-5-reviewed.json','inputs/record-6-reviewed.json','inputs/review-final-1-6.json','inputs/issue-apply.json','inputs/issue-apply-corrected.json','inputs/issue-verify.json','inputs/tool-update.json','inputs/pause.json'],outputs:['REPORT.md','readings.json','read-versions/','handoff.md','handoff.json','verification-final.json','verification-corrected.json',v.export.path]};
put('results.json',results);
const handoff={schema_version:1,created_at:new Date().toISOString(),status:'completed-and-paused',project_path:h.project_path,manuscript_directory:h.manuscript_directory,revision_id:h.revision_id,workspace:h.workspace,base_revision:18,branch_revision:25,main_revision:23,session_status:'committed',commit_id:results.revision.commit_id,transaction_id:results.revision.transaction_id,token_file:results.revision.token_file,tool:v.tool,registered_range:{from:1,to:6},final_reading_range:{from:1,to:6},review_ref:reviewRef,report:reviewReport,issue:{id:v.issue.id,status:v.issue.effective_status,decision_actor:v.issue.decision_actor,author_choice:null},task:results.final_task,export:v.export,body_hashes:final.texts,base_manifest_sha256:final.base_manifest_sha256,original_main_state_sha256:initial.main_state_sha256,final_main_state_sha256:final.main_state_sha256,final_branch_state_sha256:final.branch_state_sha256,outstanding:results.uncovered,paths:{results:path.join(here,'results.json'),report:path.join(here,'REPORT.md'),readings:path.join(here,'readings.json'),versions:path.join(here,'read-versions'),verification:path.join(here,'verification-corrected.json')},next:'Only discuss or plan under paused workflow. Do not resume committed candidate, regenerate baseline, or write chapter7. Fresh old-chapter changes require new explicit scope and normal revision flow.'};
put('handoff.json',handoff);
const report=`# G轮 native-d 实跑报告

状态：指定新作品本地流程完成，正文已暂停，交付仍是草稿。最终核验见 verification-corrected.json；原失败 verification-final.json 保留。所有产品操作经 capture.mjs 使用唯一 d- 标签，原输入、stdout/stderr、状态前后SHA和运行身份见 commands.json（${commands.length}项，含只读Git状态）。没有直接import业务API。

## 恢复与修订

作品：${h.project_path}；正文：${h.manuscript_directory}。
仅从native-c/handoff及本作品恢复，未扫描其他acceptance业务输入。实核主18、分支21、同ID ${h.revision_id}，原base_revision18、base指纹 ${final.base_manifest_sha256}。resume没有刷新基线或更换令牌；主稿在全部重登前始终为原字节。C原初主15是历史信息，不是本次提交基线。

C已重登2–3；D完整实读候选2–6、原摘要/人物/时间线/19项ledger与引文及实际下游。第4章8项/11处引文、第5章7项/12处、第6章10项/18处均有六项replay_review报告，先preview后record，分支21→22→23→24。第1章不重登，原单位记录与6份原journal均逐字节保留。

实际净收益改动存在：第2章39行“你是不是问他欠多少修理费了？”→“你问过他修理费要多少吗？”。整文件等于原稿仅作此一次替换，未增金额或付款事实。第1及3–6章正文完全原字节。C把第3章摘要的签借条者澄清为陶芷，此次保留；不是改写第3章剧情。主snapshot相对原基线只有6项ledger中7处第2章引文SHA按正式重登换绑，原句、观察、人物知识、物件、到期和状态其余相同。原文件88项核对，除主state、第2章正文及正式工具更新替换的build-manifest外均保留；第三项有已完成更新事务的旧/新SHA证明。

## 最终完整阅读与正式提交

全部2–6最终登记且停止正文修改后，发出指定阅读标记，随后依序完整显示并阅读最终1/2、3/4、5/6章，全部路径+SHA+行号正文无截断。包含尾段2–6和前缀1；不是把前面的重登读稿拼成六章报告。实际读稿版本在readings.json、read-versions；父模型事件才可证明曝光，自声明与核验脚本不能替代理解或真人阅读。

报告：${reviewReport}。review from1/to6正式登记于 ${reviewRef}，分支24→25。主作品prepare后事务 ${results.revision.transaction_id} completed，主18→19。提交对象commit_id=${results.revision.commit_id}；相同commit输入重试unchanged，state SHA未变。主稿仅第2章正文变化，第1章记录原样，旧观察/物件与知识链连续；旧报告3份仍保留，当前完整报告1份，pending_windows空。

意见 ${v.issue.id}：原adopted为agent-within-authorized-scope、author_choice=null。主事务完成后才apply至20，再以主作品当前有效六章报告verify至21，最终仍effective_status=verified。最初误把transaction_id当commit_id，apply拒绝；随后错误预期20的verify也拒绝。两个失败未改state，原输入原输出均保留；读正式publication对象后新输入d-028成功，再d-029复核，没有假报候选已应用或虚构真人取舍。

## g4资源更新与真实入口

已读PACKAGE-STAGES及四份source-build。初包→final→g3→g4仅6份文档变化；四阶段runtime_id均为 ${v.tool.runtime_id}。旧包content_id=${v.tool.before_content_id}，新包content_id=${v.tool.final_content_id}，版本都0.7.4，未把同版本当同内容。

仅在原修订committed、无活跃会话后，从外部主入口针对当前最终源码update-plan；source的61项与source-build-g4完全相同、无blocker、根39项政策全preserve，documents=[]。按本轮真实用户原话准备授权输入并正式update，事务9823844e-f137-4c79-9770-91788baf4e2f completed，主21→22、generation0→1。相同输入重试unchanged、state SHA不变。没有enable、schema仍6，没有手动重建清单。

更新前后正文/units/snapshot完全一致；58个根AGENTS、技能、手册、设定与大纲资源保持。旧根手册有意保留，随附入口help指向.writer/tool/docs最新手册。更新后实际从随附入口运行help、doctor、status、discussion context、identify和与冻结g4的compare：doctor无errors/warnings，compare same_content=true，61项身份一致。主项目当前61份资源逐项仍同g4；源码运行模块未修改，Git工作区已有改动原样保留。

## 暂停与导出

正式workflow paused于主revision23，allowed_actions=discuss/plan，无正文或修订区间。第7章draft context、record-template均ACTION_OUT_OF_SCOPE且state SHA未变；未创建第7章。暂停后的discussion恢复也成功。当前6章已登记、无未登记稿、无活跃会话或pending事务；check只代表机械一致性。

新导出：${v.export.path}。manifest实际纳入1–6，excluded_drafts=[]、warnings=[]，status=draft-export、quality_review=required。逐章正文完整按序存在于manuscript，哈希 ${v.export.manuscript_sha256} 与manifest吻合，不覆盖旧导出。后续只讨论/规划，无新明确授权不写下一章。

## 失败纠正与边界

除意见标识误用外，收尾自有审计首次把正式更新build-manifest误判为不允许变化，保留verification-final.json。修正版核对completed更新事务的旧/新SHA后通过，见verification-corrected.json；没有改产品状态求绿灯。第4章报告草稿计数12→11在record之前纠正，正式登记冻结的是纠正稿。部分大型元数据输出截断，原capture完整保存并用聚焦摘要补核；最终六章正文曝光全部完整。支持文档副本是在先前实际FastCtx/CLI阅读之后补存，support-readings.json明示时间性质。

寄件者身份/动机、旧材料账/金额/付款、周一搬钟及新墙/新址开放、月底取阅回访仍未核或未做。文学判断为知情模型自检，不称全书文学无误、真人盲读、作者定稿、市场或专业修理验收。未联网研究、付费生成、上传、Git提交/推送或发布。没有修改主产品模块，故未运行主项目测试；辅助审计通过不代替产品完整测试。原A/B/C档案、包、阅读记录和报告未改。
`;
put('REPORT.md',report);
put('handoff.md',`# D完成交接：六章已登记并暂停

作品：${h.project_path}
正文：${h.manuscript_directory}
原修订ID：${h.revision_id}；独立区：${h.workspace}
原base_revision18不变；D开始主18/分支21，最终主23/分支25；session=committed，正文事务completed。提交对象${results.revision.commit_id}，事务${results.revision.transaction_id}。令牌只在本地${results.revision.token_file}，无需重启该已提交候选。

C重登2–3，D重登4–6；1只读原登记保留。全部登记后独立完整连读最终1–6，正式review=${reviewRef}。只改第2章39行必要问法，3–6原字节，第3章摘要签名者按C澄清为陶芷。意见effective_status=verified，代理授权内实施，author_choice=null。

工具0.7.4完整包已通过正式更新到g4，content_id=${v.tool.final_content_id}，runtime_id=${v.tool.runtime_id}，generation1。根定制/手册/文学事实保留，schema仍6；同输入更新和提交均幂等。随附help/doctor/status/discussion与g4比较已实跑。

当前任务paused，只discuss/plan。第7章context和record-template均实际拒绝，无第7章。已登记1–6、无未登记稿、无活跃会话或中断事务。寄件者身份动机、旧材料钱与付款、周一搬迁新墙/新址开放、月底回访仍未完成；不能因next_unit7续写。

草稿导出：${v.export.path}，纳入1–6、排除与警告为空。下一会话先从作品随附入口status与discussion context恢复，只讨论规划；不要resume已committed候选，不自动刷新基线或升级其他作品。若未来修旧章须新的明确授权及正式流程。

详证REPORT.md、results.json、readings.json、read-versions、commands.json和verification-corrected.json；原失败verification-final.json及错误意见输入输出保留。元数据补存与实际阅读区分，父模型事件核曝光。不是真人盲读或作者定稿，未Git提交/推送、联网或发布。
`);
console.log(JSON.stringify({status:results.status,main_revision:23,branch_revision:25,commands:commands.length,readings:v.final_readings.length,artifacts:['REPORT.md','readings.json','read-versions','handoff.md','handoff.json','results.json'],verification:'verification-corrected.json',export:v.export.path},null,2));
