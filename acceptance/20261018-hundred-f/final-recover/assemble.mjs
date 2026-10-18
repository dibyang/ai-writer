import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {s,h,save} from './run.mjs';import {BASE,ROOT,sha,readJSON} from '../session-support.mjs';
const a=readJSON(path.join(s.stage,'final-audit.json')),ex=readJSON(path.join(s.stage,'export-validation.json')),manifest=readJSON(path.join(s.stage,'final-body-manifest-106.json')),commit=readJSON(path.join(s.stage,'commit-idempotency.json')),review=readJSON(path.join(s.stage,'current-full-tail-review-validation.json'));
const baseline=readJSON(path.join(BASE,'baseline-state.bin'));assert.equal(baseline.units.length,100);const baselineDiff=baseline.units.filter(u=>u.sha256!==manifest[u.unit-1].current_sha256).map(u=>u.unit);assert.deepEqual(baselineDiff,[48,54,66,71]);save('original-hundred-body-comparison.json',{baseline:'../baseline-state.bin',baseline_sha256:sha(fs.readFileSync(path.join(BASE,'baseline-state.bin'))),baseline_units:100,changed:baselineDiff,unchanged_count:96,new_units:[101,102,103,104,105,106]});
const readings=readJSON(path.join(s.stage,'readings.json')).sort((x,y)=>x.marked_after_read_at.localeCompare(y.marked_after_read_at));save('readings-chronological.json',readings);
const failed=[
 {kind:'intentional-product-guard',commands:['f-final-recover-0020-paused-context-107','f-final-recover-0021-paused-record-template-107'],exit_code:2,code:'ACTION_OUT_OF_SCOPE',state_unchanged:true,note:'暂停107保护实测，预期拒绝，非工具缺陷'},
 {kind:'auxiliary-driver',file:'pause-export.mjs',message:'预期退出码1，实际CLI保护退出2；session-support断言停住。已保留原拒绝并用finish-actions.mjs顺续，没有重设workflow或重发context。'},
 {kind:'auxiliary-audit',file:'audit.mjs initial run',message:'TypeError: root.snapshot.ledger.filter is not a function；ledger是按ID索引对象，未进行产品写操作。'},
 {kind:'superseded-audit',files:['precommit-audit-v2.json','semantic-state-audit-v2.json','replay-journal-validation-v2.json'],message:'曾错误按value.id筛ledger得到0观察，且去journal顶层找replay_review得null；这些语义字段无效。semantic.mjs/semantic-final.json改按ledger键和unit.replay_review实核36条与59份，不采信旧0/null。其余106正文/251准备/61构建文件核验由后续verify-final独立验证。'},
 {kind:'auxiliary-node-e',message:'SyntaxError: Unexpected token )；一次只读字段盘点括号错误，未执行任何产品命令。'},
 {kind:'auxiliary-path',message:'猜测f-final-recover-0029-final-identify/result.json导致ENOENT；FastCtx glob定位实际0028后全文读取。'},
 {kind:'display-truncation',message:'三次辅助JSON盘点输出超过控制台预算（15856/13554/1690 tokens），原事件保留；改用定向文件及字段核实，不把截断当全文阅读。'},
 {kind:'historical-product-failure-preserved',message:'D详细报告25777字符触发普通字符串20k限制；本阶段未重试未修源码，有效14769字符登记版仍覆盖同59章。完整后续0.7.3计划见../report-capacity-fix/PLAN.md，非本阶段最终验收。'}
];save('failures.json',failed);
const tests=readJSON(path.join(BASE,'commands/final-tests-v2/result.json')),testText=fs.readFileSync(path.join(BASE,'commands/final-tests-v2/stdout.raw.txt'),'utf8');assert.equal(tests.exit_code,0);assert.ok(testText.includes('tests 148')&&testText.includes('pass 147')&&testText.includes('fail 0')&&testText.includes('skipped 1'));const doctor=readJSON(path.join(BASE,'commands/final-doctor/result.json'));assert.equal(doctor.exit_code,0);
const testEvidence={test:{record:'../commands/final-tests-v2/result.json',record_sha256:sha(fs.readFileSync(path.join(BASE,'commands/final-tests-v2/result.json'))),stdout_sha256:sha(Buffer.from(testText)),started_at:tests.started_at,elapsed_ms:tests.elapsed_ms,exit_code:0,tests:148,pass:147,fail:0,skipped:1},doctor:{record:'../commands/final-doctor/result.json',record_sha256:sha(fs.readFileSync(path.join(BASE,'commands/final-doctor/result.json'))),started_at:doctor.started_at,elapsed_ms:doctor.elapsed_ms,exit_code:0},limit:'主任务实际0.7.2测试记录，本阶段已核原始结果；不替代后续0.7.3回归、upgrade-final或主任务最终总审计。本阶段未改工具，因此未重跑开发测试或test:engine。'};save('parent-test-evidence.json',testEvidence);
const completed=new Date().toISOString(),elapsed=(Date.parse(completed)-Date.parse('2026-10-18T14:35:28.490Z'))/60000;
const results={stage:'final-recover',status:'completed-0.7.2-protection-stage-only-not-campaign-final',started_at:'2026-10-18T14:35:28.490Z',completed_at:completed,elapsed_minutes:elapsed,...a,original_hundred:{count:100,changed:baselineDiff,unchanged:96},commit:{id:h.id,token:h.token,base_revision:403,branch_revision:467,published_revision:404,transaction_id:commit.committed.transaction_id,idempotent:commit.retry.unchanged,state_bytes_unchanged_on_retry:true,target_state_sha256:h.prepared_target_state_sha256},workflow_revision:405,branch_state_sha256:h.branch_state_sha256,branch_preserved:true,resume_executed:false,new_body_edits_this_stage:0,body_changes_this_commit:manifest.filter(x=>x.differences.length),registration_clarification:{unit:58,type:'derived-characters-only',body_unchanged:true,observations_count:36,statement_author_truth_unchanged:true,final_inherited:true},chapter101:{status:'E-before-first-registration-self-correction',current_sha256:manifest[100].current_sha256,this_candidate_new_change:false,quote:'她打开柜子，摸到家里还剩的半包面，忽然又想笑。',evidence:['../findings/parent-101-interim.md','../findings/parent-101-version-correction.md','../revise-a/handoff.md','../revise-d/handoff.md']},issues:{actual_list:[],registered:0,apply_verify_performed:false,reason:'原四意见未登记，不伪造采用时刻或假修订'},review,model_review:{path:'model-review.md',sha256:a.model_report_sha256,nature:'informed-model-self-review',full_units:[98,99,100,101,102,103,104,105,106,4,19,24],fragments:a.readings.fragments,inherited_D_full_48_106:true,this_process_full_48_106:false},draft_export:ex,parent_tests:testEvidence,failures:failed,no_source_package_manual_binding_edits:true,no_git_commit_push_publish:true,no_agents_or_other_sessions:true,campaign_sealed:false,next_phase:'Parent only after this process exits: implement report-capacity-fix 0.7.3, rerun tests, freeze package-v3, run real upgrade-final; retain original committed branch and build binding.'};save('results.json',results);
const oldRows=results.body_changes_this_commit.map(x=>`|${x.unit}|${x.han}|${x.body_non_whitespace}|${x.before_sha256}|${x.current_sha256}|同→那一字，字节差0|`).join('\n');const newRows=a.new_six.map(x=>`|${x.unit}|${x.han}|${x.body_non_whitespace}|${x.current_sha256}|本次候选及提交无变化|`).join('\n');
const report=`# F轮0.7.2保护提交、恢复与草稿导出阶段报告

本阶段已完成，campaign未封存。本报告仅属于冻结0.7.2的保护提交与恢复阶段，不是全任务最终验收。后续仍须主任务在本进程退出后按report-capacity-fix/PLAN.md修0.7.3、回归、冻结v3并启动upgrade-final真实进程。主源码、包、手册及构建绑定均未改。

实际起止：${results.started_at} → ${completed}，耗时${elapsed.toFixed(2)}分钟（从本进程首次环境核查计）。唯一作品${s.project}；阶段输出${s.stage}。真实作品、来源百章、A—E历史只读；未Git提交、push、发布、外传、启动代理或其他会话。

## 当前状态与构建

- schema6 / 0.7.2 / generation3 / 主revision405；106章，next_unit107仅顺序，paused只discuss/plan，draft_range/revise_range均null。
- state SHA：${a.state_sha256}。
- content_id：${a.content_id}。
- runtime_id：${a.runtime_id}。
- loaded_id / execution guard：${a.loaded_id}。此值来自本进程branch main doctor的execution_build_id，root fresh CLI的捕获记录另核相同磁盘runtime guard；root doctor本身不另暴露loaded字段。它与content/runtime不是同命名空间，也不宣称模块字节签名。
- snapshot/ledger/source_versions/source_ranges及106消费来源清单摘要在final-audit.json，当前报告记录/来源/账本绑定另有current-full-tail-review-validation.json；source-build-v2的61项在主源码、package-v2、随附包三处逐项同哈希。

## 原prepared直接提交及重试

原id ${h.id}，owner和token在本地results/handoff保留；未resume，未换基线或改候选。初始主403、base403、branch467、prepared target404，base/session/prepared及251文件before/after全核相同后，用root embedded直接commit。真实transaction ${commit.committed.transaction_id} completed，主只403→404；467不写回主revision。随后完全相同id/token重试返回unchanged=true，state SHA在重试前后均${h.prepared_target_state_sha256}，字节完全相同。之后workflow暂停单独404→405，不混成正文提交增加两次。完整文件清单、提交结果、幂等及备份保留。

251项为59 journal、118冻结对象、4 review记录、65审查文件、4正文和1目标state。候选终态SHA仍${h.branch_state_sha256}；原base、prepared与committed分支保留，不清理、不重新resume。

## 四旧章与六新章真实差异

与原百章baseline-state.bin逐项比较，96原章相同，仅下列四篇变化；与提交前403的106篇比较也仅相同四字。全部106实际路径、原/候选/当前SHA与字数在final-body-manifest-106.json。汉字为去首标题Unicode Han，非空白字符含标点；不把二者混称。

|旧章|当前汉字|正文非空白|before SHA|after SHA|差异|
|---|---:|---:|---|---|---|
${oldRows}

四处为同组minor readability指代澄清，原句整句、行/偏移来自本轮字节核并与A保留的修前原字节核同，详body-differences-exact.json；不是四种剧情事实错误。天气、半月缺口、白罩/围挡、筐宽、亲见和转述不变。

|新章|正文汉字|正文非空白|当前SHA|本次变化|
|---|---:|---:|---|---|
${newRows}

六章共${a.new_six.reduce((n,x)=>n+x.han,0)}汉字/${a.new_six.reduce((n,x)=>n+x.body_non_whitespace,0)}非空白字符，当前全106正文${a.total_han}汉字/${manifest.reduce((n,x)=>n+x.body_non_whitespace,0)}非空白字符。新章历史自检另分：101大包/半包及汤底在E首登前澄清，当前85行半包与77行未买大包成立；中间观察未同步冻结原SHA的归属勘误保留，不倒填。E保护修订102吹汤；F保护修订104椅子指代及106两处站里，既有CAS证据见draft-e/f交接。这些不是本次四旧字提交新增改动。

登记层单独核58顾遥：沈叫后才来，获掉盘说明并看外观，瞬间非亲见；本次最终snapshot已继承，未被旧replay复原。58正文无变化，36条原观察statement/author_truth全部相同（含O_LEAD_DROP_58）。按ledger稳定键及unit.replay_review复核，正式证据semantic-final.json；旧辅助0观察/null审计错误已明确废弃保留。

## 恢复、重登与本进程复读

A/B/C/D跨实际进程累计48–106重登59章，原59份六项replay_review、冻结报告/journal/正文SHA全部对应。D在106重登后本人完整顺读最终59章并一次登记完整报告，本进程读完整D详细报告并核有效登记版；不是拼报告充当本人59章连读。

本进程全文按98–106顺读9章，再全文4/19/24；另外9篇仅片段（27/31/48/54/58/66/71/76/86），精确范围、读后时刻及SHA在readings-chronological.json/read-versions，共12篇全文与9篇片段，不能相加称21章全文。知情模型判断见model-review.md，非真人盲读/作者定稿/市场验证。未确认须再开修订的事实矛盾，本阶段没有改正文。

D当前完整尾段ref ${review.ref}，report ${review.report}，SHA ${review.report_sha256}，48–106共59章正文及dependency全匹配，索引已发布。详细版${review.detailed_sha256}保留。最终check机械ok/106/findings=[]，rolling valid20/stale105、pending_windows=[]、unpublished=[]；stale有102被当前单份报告覆盖，3仍无完整同范围覆盖，历史不删除。提交前branch valid42/stale83变为主commit后20/105，反映旧无dependency报告被实际提交失效，不称文学退步或洗绿。

实际review-issues list为空（0），原四字小修为授权内agent执行选择但未登记意见；未伪造原采用时间、apply或verify。不是“意见已resolved”，闭环登记不适用，真实修复由本次commit及当前有效D报告核对。

## 暂停与导出

正式workflow paused后，实际context draft107及record-template107都exit2/ACTION_OUT_OF_SCOPE，提示仅discuss/plan；两个请求前后state SHA均${a.state_sha256}，无107稿。实际最终status/discussion均在暂停之后保存，完成106及未解范围写入当前task，next107无写作授权。

export实际成功到${ex.output}（作品外、campaign本阶段目录内，符合冻结CLI实际边界，没有../绕过）。manifest.json SHA ${ex.manifest_sha256}，manuscript.md SHA ${ex.manuscript_sha256}，${ex.bytes}字节。manifest included_units精确1–106，excluded_drafts=[]、warnings=${JSON.stringify(ex.warnings)}、status=draft-export、quality_review=required。整份导出与登记正文trim后按原顺序拼接逐字一致；逐章标题、原正文SHA、导出片段SHA、汉字计数见export-validation.json。无未登记正文混入，未更改工具生成文件，草稿/仍需质量审查标记保留，不是作者定稿，不外传。

## 命令、失败与测试证据

本阶段产品CLI ${a.commands.count}条，root embedded ${a.commands.root_embedded}、branch main+原token ${a.commands.branch_main}，全部session-support/capture记录参数、原输入输出、退出码、前后state/build及SHA；runtime_files_stable全true，环境无新增覆盖。非零仅上述2次预期107保护拒绝。辅助失败、错误审计和显示截断逐项在failures.json，原文件/输入/事件不删除。暂停驱动误预期1而实际2已改用顺续驱动，未重新设置暂停；其余辅助错误无产品写入。

主任务真实npm test记录commands/final-tests-v2：${tests.started_at}、${tests.elapsed_ms}ms、exit0、148 tests/147 pass/0 fail/1 skipped；npm run doctor记录commands/final-doctor：${doctor.started_at}、${doctor.elapsed_ms}ms、exit0。已核原始meta/stdout并保存SHA于parent-test-evidence.json。本阶段未改工具，未重复开发测试或test:engine；以上是0.7.2实际记录，不能替代待实施0.7.3最终回归/upgrade-final或父任务总审计。

仍保留文学观察与未知：范围说明/否定句及锅碗纸袋微动作偏密、告知流程感和厨房收尾重复，未扩大润色。余带源头、录制日期、男声/钟声/缺名人、罗私事、27中途入册日期、何旧款/长期经费人手、公屋新时段、永久椅位、老人药膏与再来、何菜单交付收款、新页未来阅读/公开和下月安排仍未定。原声未猜成答案、私人页未默认公开、期限椅位未变永久服务。

下一步仅由父任务在本进程退出后处理0.7.3。原committed分支不可resume或重绑；本阶段报告/导出/全部失败保留，campaign不封存。
`;save('REPORT.md',report);
const handoff={stage:results.stage,status:results.status,completed_at:completed,elapsed_minutes:elapsed,project:s.project,revision:405,generation:3,schema:6,tool_version:'0.7.2',content_id:a.content_id,runtime_id:a.runtime_id,loaded_id:a.loaded_id,state_sha256:a.state_sha256,branch:{id:h.id,token:h.token,owner:h.owner,workspace:h.workspace,status:'committed',base_revision:403,branch_revision:467,commit_revision:404,transaction_id:commit.committed.transaction_id,state_sha256:h.branch_state_sha256,do_not_resume:true},workflow:results.workflow,readings_manifest:'readings-chronological.json',reading_manifest_sha256:sha(fs.readFileSync(path.join(s.stage,'readings-chronological.json'))),model_review:'model-review.md',model_review_sha256:a.model_report_sha256,review,commit_idempotent:true,body_manifest:'final-body-manifest-106.json',body_manifest_sha256:sha(fs.readFileSync(path.join(s.stage,'final-body-manifest-106.json'))),changed_old:[48,54,66,71],new_six:a.new_six,chapter101:results.chapter101,registration_clarification:results.registration_clarification,issues:results.issues,draft_export:ex,final_check:a.final_check,parent_tests:testEvidence,failures:'failures.json',command_index:'command-index.json',campaign_sealed:false,next:results.next_phase};save('handoff.json',handoff);
save('handoff.md',`# F轮0.7.2 final-recover交接\n\n本阶段已完成，campaign未封存，不是全任务最终验收。主作品${s.project}，0.7.2/schema6/gen3/revision405，state SHA ${a.state_sha256}。\n\n原候选${h.id}已committed；base403→主commit404，branch467保留未覆盖主revision。同id/token重试unchanged且state字节不变。随后正式暂停404→405，仅discuss/plan，两正文范围null。107 context与record-template实际ACTION_OUT_OF_SCOPE拒绝，无state推进或107稿。不要resume已提交分支，不换绑定。原token/workspace/transaction详handoff.json。\n\n106登记章，原百章仅48/54/66/71各同→那；其余96原章及六新章正文不变。101原剩半包在E首登前已澄清，不重复修；58顾状态仅派生知情澄清，36观察statement/author_truth及正文不变。\n\n本人全文98–106及4/19/24，共12章，另9章片段；精确范围/SHA见readings-chronological.json。D完整59章review当前有效，不能冒充本进程又全文读59章。model-review.md保留模型判断、风格观察和未知，非真人或文学定稿。最终check ok/106，valid20/stale105，pending=[]、unpublished=[]，历史stale不删。意见实际0，未造apply/verify。\n\n草稿实际${ex.output}，manifest SHA ${ex.manifest_sha256}，manuscript SHA ${ex.manuscript_sha256}。精确106章顺序/标题/内容与登记稿对应，status=draft-export/quality_review=required，无外传。\n\n主源码、package-v2和随附包61项最终仍同source-build-v2。content ${a.content_id}，runtime ${a.runtime_id}，loaded guard ${a.loaded_id}。全部29产品命令及2次预期门禁拒绝、辅助失败详REPORT/results/failures。主任务npm test-v2实际148/147pass/0fail/1skip及doctor exit0已核原记录，非0.7.3最终回归。\n\n下一步父任务须等本进程退出，再按report-capacity-fix/PLAN.md修0.7.3、回归、冻结v3并启动upgrade-final。原D详细报告20k拒绝与有效登记版均保留。不Git提交、push、发布或封存F。\n`);
console.log(JSON.stringify({written:['REPORT.md','results.json','handoff.md','handoff.json'],elapsed_minutes:elapsed,revision:405,export:ex.output,report_sha256:sha(Buffer.from(report))}));
