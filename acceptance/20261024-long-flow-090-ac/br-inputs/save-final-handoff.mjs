import fs from'node:fs';import path from'node:path';import crypto from'node:crypto';import assert from'node:assert/strict';
const root=path.resolve('acceptance/20261024-long-flow-090-ac');const{project}=JSON.parse(fs.readFileSync(path.join(root,'project.json'))),sha=b=>crypto.createHash('sha256').update(b).digest('hex');const parse=p=>JSON.parse(fs.readFileSync(path.join(root,p)));const stateBytes=fs.readFileSync(path.join(project,'.writer/state.json')),state=JSON.parse(stateBytes),cp=parse('checkpoint-b-first.json'),startState=parse('checkpoint-b-first-state.json'),resume=parse('br-inputs/resume-verification.json'),first=parse('b-inputs/final-audit.json'),session=parse('cli-logs/br27-begin42/stdout.txt');
const status=parse('cli-logs/br45-final-status/stdout.txt'),check=parse('cli-logs/br46-final-check/stdout.txt'),doctor=parse('cli-logs/br47-final-doctor/stdout.txt'),identify=parse('cli-logs/br48-final-identify/stdout.txt');
assert.equal(state.revision,197);assert.equal(state.units.length,42);assert.deepEqual(state.units.slice(0,40),startState.units);assert.deepEqual(state.units[40],parse('cli-logs/br09-record41/after-state.json').units[40]);assert.equal(process.env.CODEX_THREAD_ID,resume.session_id);assert.equal(process.env.CODEX_SESSION_ID,resume.session_id);assert.equal(state.tool_control.generation,4);assert.equal(doctor.build.observed_content_id,cp.content_id);assert.equal(identify.observed_content_id,cp.content_id);assert(check.ok&&doctor.ok&&status.ok);assert.equal(status.changed_sources.length,0);assert.equal(status.stale_units.length,0);assert.equal(status.impact_pending.length,0);assert.equal(check.rolling_review.pending_windows.length,0);assert.equal(check.rolling_review.stale_without_current_coverage,0);assert.equal(check.rolling_review.unpublished_records.length,0);assert.equal(check.draft_inventory.unregistered.length,22);assert.equal(check.draft_inventory.unsafe_entries.length,0);assert.deepEqual(check.draft_inventory.unregistered,parse('cli-logs/br02-check/stdout.txt').draft_inventory.unregistered);assert(!status.revisions.sessions.some(s=>!['committed','aborted'].includes(s.status)));assert(!status.revisions.transactions.some(t=>!['completed','rolled-back'].includes(t.status)));
const preservation=Object.entries(cp.files).map(([ref,expected])=>{const b=fs.readFileSync(path.join(project,ref));return {ref,bytes:b.length,sha256:sha(b),same:b.length===expected.bytes&&sha(b)===expected.sha256};});assert(preservation.every(x=>x.same));
const contextRef='.writer/drafts/AC-B-context41.json',templateRef='.writer/drafts/AC-B-record41-before.json';assert.equal(sha(fs.readFileSync(path.join(project,contextRef))),resume.context_sha256);assert.equal(sha(fs.readFileSync(path.join(project,templateRef))),resume.template_sha256);assert.deepEqual(state.governance_binding,startState.governance_binding);assert.equal(state.units[40].source_hashes['.writer/state.json'],cp.state_sha256);
const p41=fs.readFileSync(path.join(project,state.units[40].draft));const originalParts=first.chapter41_parts.map(p=>{const b=fs.readFileSync(path.join(project,p.path)),offset=p41.indexOf(b);assert.equal(sha(b),p.sha256);assert.equal(b.length,p.bytes);assert(offset>=0);return {path:p.path,bytes:b.length,sha256:sha(b),offset_in_final41:offset};});assert.equal(originalParts[0].offset_in_final41,0);assert.equal(originalParts[1].offset_in_final41,originalParts[0].bytes+2);
const coverage=parse('br-inputs/window-final-coverage.json');for(const c of coverage){const row=state.units[c.unit-1];assert.equal(row.draft,c.ref);assert.equal(row.sha256,c.sha256);assert.equal(sha(fs.readFileSync(path.join(project,c.ref))),c.sha256);}assert.equal(coverage.reduce((n,c)=>n+c.pages,0),46);for(const c of coverage)assert(c.body_han>=(c.unit===40?14000:10000));
const reviewRef=parse('cli-logs/br36-review-final-window/stdout.txt').ref,review=JSON.parse(fs.readFileSync(path.join(project,reviewRef)));const reportRef='审查/AC-B窗口37-42-最终完整连读模型自检.md';assert(state.review_workflow.reports[reviewRef]);assert.equal(state.review_workflow.issues.I_AC_B_42_GLASSES_TARGET.status,'verified');assert.equal(state.review_workflow.issues.I_AC_B_42_TYPO_KONGPA.status,'verified');for(const[ref,hash]of Object.entries(parse('br-inputs/review37-42-final.json').source_hashes))assert.equal(sha(fs.readFileSync(path.join(project,ref))),hash);
assert(fs.existsSync(path.join(project,'.writer/drafts/AC-B-resume-record42-before.json'))); // original main-project input preserved; independent revision need not copy private drafts
const allBodyNames=fs.readdirSync(path.join(project,'正文'));assert(!allBodyNames.some(n=>/^\d{4}/.test(n)&&Number(n.slice(0,4))>42));
const callerFailures=[
{at:'br10-recall-drawer',exit_code:1,type:'caller-argument',detail:'recall误用--id；br11按--query重查，失败无状态变化。'},
{at:'FastCtx grep 0040-拆下来的那一条',type:'read-path',detail:'猜错40文件名，路径不存在；glob定位取下来的那一条后实读，无写入。'},
{at:'br21-revise-help',exit_code:1,type:'caller-command',detail:'不存在revise命令；读当前revision-and-sources后用revision begin，不改工具。'},
{at:'prepare-window-initial.mjs first run',exit_code:1,type:'model-quote-location',detail:'40栏误配39原句“先保住原门”，引文断言在写报告/输入前拦住；保留原模块和失败JSON，改用40实际原句后全引文复验成功。'},
...parse('br-inputs/replay-preparation-failures.json').failures.map(x=>({...x,type:'caller-helper-or-dependent-call'})),
{at:'read final committed reports first inspection',exit_code:1,type:'read-helper',detail:'review_workflow.reports是对象，辅助命令误用slice；只读TypeError，后按Object.keys及实际结构核，不影响事务/正文。'},
{at:'save-final-handoff.mjs first run',exit_code:1,type:'read-helper-private-path',detail:'多余地假设正式独立区复制了旧内部record42模板，读不存在路径ENOENT；正式修订按设计不复制全部私有草案。失败在任何交接/审计写入前，正文state未改；保留原脚本，改核主区原模板仍在。'}
];
const cliResults=[];for(const label of fs.readdirSync(path.join(root,'cli-logs')).filter(n=>n.startsWith('br')).sort()){const f=path.join(root,'cli-logs',label,'result.json');if(fs.existsSync(f)){const r=JSON.parse(fs.readFileSync(f));cliResults.push({label,exit_code:r.exit_code,before_state_sha256:r.before_state_sha256,after_state_sha256:r.after_state_sha256});}}
const final={ok:true,at:new Date().toISOString(),session_id:process.env.CODEX_THREAD_ID,same_id:resume.same_id,project,project_id:state.project_id,state_revision:state.revision,state_sha256:sha(stateBytes),registered_units:state.units.length,logical_next_unit:status.next_unit,stop_at:42,tool:{version:doctor.tool_version,generation:4,content_id:identify.observed_content_id,runtime_id:identify.runtime_id,tool_build_id:state.units.at(-1).tool_build_id,provenance:identify.provenance},resume:{entry_revision:resume.revision,entry_registered:resume.registered,state_sha256_at_entry:resume.state_sha256,all_first_stop_files_equal_at_entry:resume.changed.length===0,all_first_stop_files_equal_at_exit:preservation.every(x=>x.same),protected_count:preservation.length,original_context:{ref:contextRef,sha256:resume.context_sha256},original_template:{ref:templateRef,sha256:resume.template_sha256,expected_revision:187},original_parts:originalParts,prefix_units_1_40_unchanged:true,unit41_after_record_unchanged:true,governance_binding_unchanged:true},coverage,final_review:{ref:reviewRef,report:reportRef,report_sha256:sha(fs.readFileSync(path.join(project,reportRef))),scope:[37,42],pages:46,model_informed:true},revision:{id:session.id,base_revision:192,branch_revision:195,transaction:parse('cli-logs/br40-commit42/stdout.txt').transaction_id,status:'committed',scope:[42,42],body_before:'9d2d5f695085a56f732d3efc024b8035b5cc12193c5d9c3d43d0b16232127dda',body_after:state.units.at(-1).sha256,two_issues_verified:true},checks:{status:true,check:true,doctor:true,doctor_errors:doctor.errors,doctor_warnings:doctor.warnings,mechanical_findings:check.findings.map(x=>({code:x.code,draft:x.draft})),known_unregistered_count:22,unknown_unregistered:0,unsafe_entries:0,changed_sources:[],stale_units:[],impact_pending:[],active_revisions:0,incomplete_transactions:0,rolling_review:check.rolling_review,open_optional_style:9},failures:callerFailures,cliResults,display_limitations:['一次context合并打印和最终doctor/build大对象打印出现截断；原始stdout完整留存，后按所需字段重新精确读取。正文读页输出均完整，没有以截断正文称全读。','checkpoint-b-first.json完整JSON机器解析逐项比585文件；不宣称人工逐字阅读585项散列清单。'],outside_scope_findings:[],uncovered:['未进行真人/隔离盲读、市场或出版验收；check为机械门禁。','未重读全书1—36；旧承诺只定位后实读所列原文页。','未做线下维修/伤情/食品保存测试；原柜及门长期使用仅有限小说内信息。','43正文和周一早到/交班/买做吃洗收未写；父伤愈、复航、课程总数、父辈全史仍未知。','未对AC之外文件做全盘字节扫描；本轮写入路径限定AC，未改源码/真实作品/旧封存区。'],scope:{ac_only:true,no_git:true,no_external_messages:true,no_agents:true,no_background_writing:true}};
fs.writeFileSync(path.join(root,'br-inputs/final-audit.json'),JSON.stringify(final,null,2)+'\n',{flag:'wx'});fs.writeFileSync(path.join(root,'br-inputs/b-complete-preservation.json'),JSON.stringify({ok:true,compared:preservation.length,files:preservation},null,2)+'\n',{flag:'wx'});
const start=parse('cli-logs/br01-status/result.json').started_at,elapsed=Math.round((Date.now()-Date.parse(start))/60000);
const handoff=`# AC B轮完成交接

截至${final.at}，本次真实同ID恢复已完成41—42、当前37—42完整窗口复核及42两处正式独立修订。已登记1—42，主state修订号197；机器next_unit=43只是计数，本任务已到42停止，不写43。不做Git提交、推送、发布或发其他聊天。全部操作在AC独立副本和AC证据内；本次从br01恢复检查至交接约${elapsed}分钟。

## 状态与工具

- project：${project}
- project_id：${state.project_id}；schema6；阶段trial；workflow仍为40—42整组任务，draft/revise范围40—42，旧长期stop_conditions和治理绑定未动。原未决规划标签保留历史，不伪称未完章仍要重取模板。
- 同一Codex ID：${final.session_id}；实际环境THREAD_ID/SESSION_ID均核相同。
- 实际工具0.9.0，generation4；content_id=${final.tool.content_id}；runtime_id=${final.tool.runtime_id}；tool_build_id=${final.tool.tool_build_id}。三者不同命名空间。包provenance仍源commit ${identify.provenance.source_commit}、dirty=${identify.provenance.dirty}，不称正式发布包。
- 最终state SHA256：${final.state_sha256}；checkpoint-b-complete.json及-state.json已保存（605项稿/分段/内部草案库存）。
- br45 status、br46 check、br47 doctor、br48 tool identify实际退出0；doctor errors/warnings均空。status无changed_sources、stale_units、impact_pending，全部修订已committed、事务completed，无活跃占用/待恢复。
- check仅机械通过：22项已知旧未登记版本保持同恢复入口清单，unsafe/未知未登记均0，未合并删除；rolling_review valid20/stale30，30均有当前覆盖，stale_without_current_coverage=0、pending_windows=[]、unpublished_records=[]。未把历史报告静默删掉。两项本轮确认问题verified，9项可选风格仍open，不冒充修好。

## 正文统计与当前SHA

统计剔除Markdown标题，只计Unicode汉字；普通章至少10000，40至少14000。

|章|正文汉字|字节|页数|当前SHA256|
|---|---:|---:|---:|---|
${coverage.map(c=>`|${c.unit}|${c.body_han}|${c.bytes}|${c.pages}|${c.sha256}|`).join('\n')}

B组三章40—42合计${coverage.filter(c=>c.unit>=40).reduce((n,c)=>n+c.body_han,0)}汉字；窗口37—42合计${coverage.reduce((n,c)=>n+c.body_han,0)}汉字。41七个自然分段/42八个自然分段；正式assemble均只空白separator，合章后逐页实读/纲文回对、自检、真实changes、preview后record。无43正文。

## 真实恢复字节证明

本轮开工重新读COMMON、author-request、project、交接-B首停及checkpoint-b-first；实际br01-status/br02-check/br03-doctor/br04-discussion context。checkpoint完整JSON解析并逐项对585项原文件，不拿聊天记忆当状态；入口state187/已登记40匹配首停SHA ${cp.state_sha256}，无来源漂移/待恢复事务/未知未登记稿。详见br-inputs/resume-verification.json。

首停41原context ${contextRef}：${resume.context_sha256}；原template ${templateRef}：${resume.template_sha256}，expected_revision187，恢复时全部写前source_hashes仍逐项匹配。未重取41模板，未在未完章中改workflow/来源。41正式登记后原写前state哈希自然成为历史输入，不应拿现在state197去刷新旧哈希。

${originalParts.map(p=>`- ${p.path}：${p.bytes}字节，SHA ${p.sha256}，在最终41连续字节偏移${p.offset_in_final41}。`).join('\n')}

两段原片段保留，后续只续03—07；恢复时原01全一页、02全两页实际读过，另完整重读40十页。退出时首停585项仍全部同字节，1—40登记行完全同首停、41行完全同首次正式登记后状态。详见41-original-parts-preserved.json和b-complete-preservation.json。

## 实际读稿与审查登记

- 首次恢复41：原片段→当前40全十页；旧承诺recall定位后实读34p2—3、37p2—3/p5/p7、38p2/p6、39p5等原文。41合章修前七页/最终br-final41-p1…p7七页；42合章修前七页/最终br-bound42-p1…p7七页。
- 全部首次登记后，br-window37-p1…br-window42-p7按37→42连续完整46页，初读报告正式review记录为.writer/reviews/188d35d3-9ff0-4211-808d-1f2f1d24d71b.json，绑定42旧9d2d5f…，发现两项问题，不能当当前通过。
- 42独立修订后，br-revised42-p1…p7全章七页，六项replay核查；重登后又按37→42全读46页br-finalwindow37-p1…br-finalwindow42-p7，当前所有SHA见window-final-coverage.json。不是拼接短评或仅刷新报告哈希。
- 最终报告：${reportRef}；SHA ${final.final_review.report_sha256}；正式review=${reviewRef}。受管应用到AC主区后逐章再次核字节，主区六章与最终46页完全相同。报告逐章比较目标/阻力/选择/后果/关系变化，列出“问话让决定/停手帮助/杯碗收束”相似结构、每章不同收益及可选调整。
- 模型知情自检，非真人或隔离盲读、市场/出版验收、作者定稿。报告中的“没有硬问题”仅限本次当前版本及实际阅读范围。

## 确认问题的正式独立修订

初读确认42两项：遥控与眼镜动作目标衔接错、那怕缺恐字。按已授40—42范围由代理采用，非冒充真人新增情节选择。正式修订ID ${session.id}，仅42—42，主基线192；rewind分支193后取本次context/template，改两处，replay-input实核summary/characters/timeline/ledger/evidence/downstream，preview/record分支194，完整窗口review分支195。

prepare清单仅一份正文42、必要journal/冻结报告/审查及state。事务 ${final.revision.transaction} 已completed；受管commit把主192→193，两意见apply/verify推进至197。原42旧稿与原输入保留在正式修订base/事务备份/冻结review-body，未直接编辑主区已登记稿。这里是AC内受管作品修订流程，不是Git提交或对外发布。

## 回收链、实际调整与下卷接口

T_D_ROOM_DOOR_LOOK：34未做→37重约→38要求留旧条→39工40料另问→40真拆/原门无须换大块/同意料8及周真支8→41固定、母女亲试/老人端空盆及坐处风感，真付50找2=48。仅当次有限resolved；长期冬天风况未知。旧条老人箱、新余头另袋、凭条女主人票格；周带走旧钉42归铺筐。

P_AC_DRAWER：37留屉→38认漏回电话/18/周五午后约→41试后退待晨→42收边装好、客户新电话主动改午前，毛巾试/18真付/抱走，旧板确认不要由周收废。原柜右边仍要抬，只客户文字告装袜能关，周未现场看；有限resolved不扩大为全柜或长期承重。

T_AC_SHARED_MEAL：37各做一道/各出菜钱及厨房一次许可→39周四晚前回复期限→40女问班/答补周六两小时→41母真收日期许可、沈当面回谭（期限已兑现）→42女实际补班、3元包子自己归家吃，父周日自己选两小容器/择豆角、沈真备熟饭菜冷藏。女10/沈15仍在自己包里，不当已经支出。饭约仍partial，周一早到半小时、12点/12:30真交班、买菜、共同做吃洗收均未发生。

实际调整：门款在41做完当面付清，42不重收；只改未消费的42细纲，未改旧宏纲/规则/V15/扩大骨架。42选择熟悉芋头拌饭暂不试焦底，及到家先坐再同买，后续应承接成稿，不能按旧计划强令发生；43—48仍远骨架，无43正文或新增远细纲。

工装T_X_COAT_DAILY仍partial：老师实看原条/实衣但未拆，母选继续穿仍认角，42女洗自己的衣不增加母工装洗后结论。原纸/练布/针盒/花书仍女家，42为收桌把书/原纸放内格/护纸，原纸无老师新字。另户柜门照片仍pending。父脚伤需杖/垫脚凳，复航、课程总期数、父辈全史、问路人终点均未知，不强改resolved。

## 全部失败、局限与未覆盖

本次恢复有${callerFailures.length}项调用/辅助脚本/引文定位失败；不是工具产品缺陷。原输入、错误和现状均留存，不删失败目录。详见br-inputs/final-audit.json及两份专项失败JSON。

${callerFailures.map((f,i)=>`${i+1}. ${f.at}：${f.detail??(f.error+'；'+f.effect+'；'+f.cause)}`).join('\n')}

首停阶段另有三项已在交接-B首停记载的旧失败：discussion误用--mode；误读不存在的项目研究/AC作者任务路径（实源研究/AC作者任务.md）；原41第01只有一页却请求第2页。均未通过刷哈希掩盖，旧证据保留。A轮失败见交接-A完成，不冒充本次新失败。

显示局限：恢复context大对象及最终doctor/build合并打印出现截断，原stdout完整保存，后按所需字段重读；所有正文1800字符分页输出完整，不以哈希计数代替读稿。checkpoint585项是完整机器比对，不称人工逐字阅读每一项散列。

未覆盖：没有真人/隔离盲读、市场或出版验收；没有1—36全书复读、线下维修或伤情/食品保存实测。未对AC外目录做全盘哈希扫描，本轮写入仅AC；不改真实作品、封存目录、产品源码、全局配置。无子代理、额外Codex会话、后台写稿、外部写作服务、Git提交推送发布或其他聊天消息。正式独立修订区是同会话的受管文件候选，不是额外模型会话。

本组执行已完成，到42和窗口复核后退出。下一步43仅在后续新的明确任务/范围授权下进行；不得凭机器next=43自行续写。
`;
fs.writeFileSync(path.join(root,'交接-B完成.md'),handoff,{flag:'wx'});console.log(JSON.stringify({ok:true,revision:197,registered:42,protected_files:preservation.length,current_pages:46,body_han_B:coverage.filter(c=>c.unit>=40).reduce((n,c)=>n+c.body_han,0),failures:callerFailures.length,handoff:'交接-B完成.md',handoff_sha256:sha(Buffer.from(handoff)),elapsed_minutes:elapsed},null,2));
