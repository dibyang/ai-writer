import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {BASE,readJSON,sha} from '../session-support.mjs';
const stage=path.join(BASE,'upgrade-final'),r=readJSON(path.join(stage,'results.json'));
const write=(ref,value)=>fs.writeFileSync(path.join(stage,ref),typeof value==='string'||Buffer.isBuffer(value)?value:JSON.stringify(value,null,2)+'\n',{flag:'wx'});
const raw=fs.readFileSync(path.join(stage,'events.jsonl'));
const lines=raw.toString('utf8').split('\n');if(lines.at(-1)==='')lines.pop();
const events=lines.map(x=>JSON.parse(x));
write('process-events-prefix.jsonl',raw);
write('process-command-index.json',{basis:'Actual event stream prefix at delivery preparation. Original events.jsonl continues through final turn; do not call this prefix a completed process receipt.',prefix_sha256:sha(raw),events:events.length,thread_id:events.find(x=>x.type==='thread.started')?.thread_id,commands:events.filter(x=>x.type==='item.completed'&&x.item?.type==='mcp_tool_call'&&x.item.tool==='exec').map((x,i)=>({index:i,event_id:x.item.id,server:x.item.server,tool:x.item.tool,arguments:x.item.arguments,error:x.item.error,status:x.item.status})),all_tool_calls:events.filter(x=>x.type==='item.completed'&&x.item?.type==='mcp_tool_call').map(x=>({event_id:x.item.id,server:x.item.server,tool:x.item.tool,arguments:x.item.arguments,status:x.item.status,error:x.item.error})),environment_messages:events.filter(x=>x.item?.type==='error')});
const auditPath=path.join(BASE,'reading-audit/upgrade-final.json'),audit=readJSON(auditPath);
assert.equal(audit.ok,true);assert.equal(audit.rows.length,9);
for(const row of audit.rows){assert.equal(row.full_matching_line_coverage,true);assert.equal(row.mismatches.length,0);assert.equal(row.missing_lines.length,0);assert.equal(row.sha256,readJSON(path.join(stage,'body-manifest-106.json'))[row.unit-1].sha256);}
const files=['transcription.json','transcription-frozen-verification.json','d-59-reading-and-current-bindings.json','own-readings.json','model-review.md','model-106.md','model-106-with-d-appendix.md','body-manifest-106.json','branch-replay-verification.json','resume-verification.json','gate-107-verification.json','source-integrity.json','command-index.json','process-command-index.json','failures.json','final-state.bin'];
const artifacts=Object.fromEntries(files.map(ref=>[ref,{sha256:sha(fs.readFileSync(path.join(stage,ref))),bytes:fs.statSync(path.join(stage,ref)).size}]));
r.readings.actual_display_audit={ref:'../reading-audit/upgrade-final.json',sha256:sha(fs.readFileSync(auditPath)),units:9,from:98,to:106,all_full_matching_line_coverage:true,basis:audit.basis};
r.artifacts=artifacts;r.failures='failures.json';r.body_manifest='body-manifest-106.json';r.process_commands='process-command-index.json';r.raw_process_events='events.jsonl';r.audit_helper='../commands/upgrade-final-helper-audit-001';
r.completed_at=new Date().toISOString();r.elapsed_minutes=(Date.now()-Date.parse(readJSON(path.join(stage,'started.json')).started_at))/60000;
r.elapsed_basis='From recorder initialization immediately before first product CLI; initial skill/handoff reading precedes this clock. Full actual process wall time belongs to parent process-result receipt.';
for(const ref of ['results.json','handoff.json'])fs.writeFileSync(path.join(stage,ref),JSON.stringify(r,null,2)+'\n');
const d=r.diagnostic_candidate,t=r.transcription,e=r.export,b=r.build,c=r.commands;
const report=`# F轮 upgrade-final：最终0.7.3恢复与真实长报告容量实跑

本阶段完成；campaign不封存，留父任务总审计。唯一作品为F work及本阶段新候选。当前0.7.3/schema6/generation4/revision${r.revision}，106章，暂停仅discuss/plan，两正文范围null。没有正文变化、107、Git提交/push/发布/联网、启动代理或其他会话。工具源码与全部冻结源只读。本报告属于工具接口与知情模型自检证据，不是真人盲读、文学定稿、市场或发布验收。

计时从首批产品CLI前保存started.json开始，至${r.completed_at}为${r.elapsed_minutes.toFixed(2)}分钟；此前已先读技能和交接。完整进程起止由父任务process-result记录，当前仍不能将运行中events当作已退出回执。

## 最终身份与状态

- state SHA-256：${r.state_sha256}。
- source content ID：${b.content_id}。
- runtime_id：${b.runtime_id}。
- loaded execution guard：${b.loaded_guard}。来自新branch实际main doctor的execution_build_id，bound_build_id相同；fresh CLI前后磁盘guard另核一致。三者分别属于内容、runtime清单、执行模块守卫命名空间，不互相代称。
- 最终doctor/identify/status/check/discussion/workflow/review-issues/revision list均从随附入口实跑；机械check ok/106，findings=[]；rolling valid21/stale105，unpublished=[]、pending_windows=[]。102个stale获当前单份范围覆盖，3个仍无同范围覆盖，历史保留；不称这些数字为文学通过。

## 升级与保持

先用main新入口实际执行identify/status/revision list/doctor/check/workflow/discussion，确认原0.7.2/gen3/revision405和106章，旧16d38509分支已经committed，不resume或改绑定。原state原字节为baseline-state.bin，SHA与final-recover交接7c4a2031…848a9完全相同；106正文、units、snapshot与每章source_hashes在baseline-business.json完整保存。

先亲读真实研究/F轮用户授权与执行范围.md，实际从sources/package-v3运行tool update-plan，再使用计划返回的当前expected_revision405、真实CID、plan SHA和作者依据执行update，documents=[]保留根定制；没有复制CLI/手改state/schema或旧绑定。405→406、generation3→4仅一次，相同完整输入重试返回unchanged:true，重试state原字节相同。schema6未迁移。升级后6条常规恢复命令使用entry:embedded，版本0.7.3、106章。最终units/snapshot/source_versions/ranges/events/operations/decisions/旧commit及每章消费来源全等于升级前；正文106篇同SHA。

source-integrity.json逐项核主源码、package-v3、随附包61项同source-build-v3，旧package与package-v2也均与各自冻结清单一致。update-plan的根local_content逐项同升级前；新运行守卫不强加给旧committed分支，全部旧会话session SHA和终态与升级前列表逐项完全相同。

## 原D详版转录登记

已完整阅读原D final-review-48-106.md，核D handoff/md/json、原失败输入清单和原prepared报告路径，实际原件与阶段报告精确同字节。reading-audit/revise-d.json的start_marker为event270/item_139、14:07:10.786Z，明确106重登完成后开始独立最终59章顺读；59行审计均full_matching_line_coverage、无missing/mismatch，原read-versions与当前root正文逐项同SHA。原报告每章判断及功能/引文表保留。展示审计只证明文本暴露，不单独证明理解；判断来自原D报告。

本次将原D已做的模型复核转录到root：expected_revision406、新operation_id，source_hashes取真实当前review-template，原chapter_functions/comparison/issues保持。新ref ${t.ref}，登记推进至407。报告${t.report}及冻结${t.frozen_report}均为原报告精确字节：${t.characters}字符/${t.bytes}字节，SHA ${t.report_sha256}；范围48—106共59章。最终复核索引发布、正文及dependency绑定全匹配、无impact，current=true；原短登记版仍有效且未删除。transcription.json明确原审阅主体actual-Codex-revise-d，本次是记录执行者，没有声称本人又全文读59章。全部失败前后state在capture保留。

## 本次回读与连续性

本人本进程全文按98—106九章顺读，另全文4/19/24；六处连续片段为27:65—98、31:35—79、58:1—30、92:47—81、95:59—78、97:29—51。路径来自units追踪，逐文件SHA/范围/只读版本在own-readings.json及read-versions，实际98—106事件展示审计为../reading-audit/upgrade-final.json。额外分支106全文和原journal/原报告单列，不重复增加独立章数。

Gu58是沈叫后才过来，获掉盘说明、看外观而非亲见瞬间；当前派生状态保留，36原O_观察statement/author_truth与旧base逐项相同。27单页/31原两页/95新半页/105新页及划头原稿分开；92上柜私册中途移入日未知，97下柜干布盒第二页仍缺名。中间35/48/54/83完整交接本次继承D报告，非本人新增全文阅读。4/19/24亲读确认特定广播交接已回收，不能扩成全带来源、全带日期、钟声归属或逐人登船证明。103两笔240=480实收、720未接无应收；104椅位真失去、老人离开和葛少接一份有代价；106周未接未读，仅口述想被谢、纸沈收回带归。具体本次模型判断、语言观察及未解见model-review.md/model-106.md。未修改正文或作者/意见取舍历史。

## 106正式接口演练与abort

root工作流正式设仅106—106 revise，draft=null，407→408。revision begin返回${d.id}，base408，原base/base-state/session及id/token在branch-original和handoff.json原样保留。branch另phase前缀、main入口及实际token；没有.writer/tool，doctor正确指向父作品资源、当前0.7.3及相同绑定守卫。

分支实际全文读106（1—126行）、原106 journal（1—262行）、原D六项报告（1—26行）、原摘要与changes/8条引句并核当前末章无已发生107。随后真实rewind106至409、replay-input106、手写summary/characters/timeline/ledger/evidence/downstream六项实读报告。附录原D详版精确字节，明确原文中的“本进程/本人”是D，prepared/不commit是D历史时态，不影响原已提交终态。

实际preview只读、record成功，候选revision410且全部106章恢复登记。大报告${d.long_report_characters}字符/${d.long_report_bytes}字节（>20k且<1MiB UTF8），SHA ${d.long_report_sha256}，冻结${d.replay_review.frozen_ref}完整同字节，附录切片精确等于D原报告。候选snapshot、全部106篇正文与root等价；begin至abort root业务state原字节不变，比较前后SHA均1d0167c2c1995e6676df36e5aca99e9f0aaa929405d160f7448127aa9d50e197。

fresh CLI错误token resume实际exit2/REVISION_OWNER_REQUIRED，正确token恢复同workspace/base408；base、branch state、root state原字节均不变。随后正式abort，候选和长报告保留，无prepare、commit或意见applied。候选重登导致其历史审查变stale：valid19/stale107、pending五窗88—93/91—96/94—99/97—102/100—105。它们如实保留，不补造这些区间的新实读来清零；root的当前D59章报告仍有效且pending=[]。

## 暂停门禁与新导出

abort后正式workflow回paused，408→409，仅discuss/plan、draft_range/revise_range均null。实际请求107 draft context与record-template均exit2/ACTION_OUT_OF_SCOPE；前后state SHA均${r.state_sha256}，无107正文。next107只是顺序，不能写。review-issues实际为空0，未制造作者采用、应用或核验历史。

最终0.7.3随附入口新导出到${e.output}，保留final-recover的0.7.2旧导出。manifest SHA ${e.manifest_sha256}，manuscript SHA ${e.manuscript_sha256}，${e.bytes}字节；顺序精确1—106，各章源正文SHA与manifest逐一对应，整稿trim后分隔拼接逐字一致，无游离稿、excluded_drafts=[]、warnings=[]。全106去标题共${e.han}汉字/${e.body_non_whitespace}非空白正文字符；新六章各自3049/3164/3188/3386/3492/3548汉字。导出仍status=draft-export、quality_review=required，不是文学定稿，没有上传/发布。

## 最终版测试、失败与完整命令索引

主任务真实0.7.3记录../commands/final-tests-v3：npm test exit0、152 tests/151 pass/0 fail/1 skipped、254025ms；../commands/final-doctor-v3：npm run doctor exit0、8556ms。容量回归before原4项失败保留，after为4/4通过；包括>20k冻结、精确1MiB/超限state不变、普通短字段20k仍在、replay长报告。未把旧0.7.2全测冒充本版，也没有称本进程重新运行全测；源码未改、未改内置引擎，本阶段不重复开发测试。缺少的父任务final-source/manifest.json只作查找失败记录，未假称已生成；父任务还要总审计与最终源码快照。

产品CLI共${c.count}条（root37：main11、embedded26；branch main+token7），完整参数/原输入/原输出/退出码/state/build前后哈希在command-index.json及../commands/f-upgrade-final-*。所有runtime_files_stable=true，无新增env覆盖。非零4次：update-plan多传字段的实际输入拒绝1次、预期错误token1次、预期107门禁2次；4次均state不变。最初辅助哈希脚本skills路径解析错ENOENT、FastCtx正则newline错误、缺失final-source manifest查找均在failures.json，不抹掉。原D20k拒绝及修复前失败仍保留。process-command-index.json和process-events-prefix.jsonl保存本进程交接检查点之前的全部实际工具调用及inline命令；原events.jsonl继续记录到turn结束，前缀快照不冒充进程退出回执。独立最终机械审计raw为../commands/upgrade-final-helper-audit-001（exit0）。

## 留给父任务

本阶段无需resume旧终态或新aborted候选，无正文待提交。继续总审计、核本阶段真实进程结束回执和全部冻结源，再决定campaign封存；本阶段没有封存。余带源头/日期/男声/钟声/剪者/目录用意、缺名人、罗私因、27入册日、何旧款/长期经费人手、公屋新时段、永久椅位/老人后续、菜单交付收款、新页未来阅读公开及下月相处均保持未解。
`;
write('REPORT.md',report);
write('handoff.md',`# F轮 upgrade-final 交接\n\n本阶段完成，campaign未封存。主作品${r.project}，最终0.7.3/schema6/gen4/revision409/106章，paused仅discuss/plan、两范围null。state SHA ${r.state_sha256}。\n\ncontent ${b.content_id}；runtime ${b.runtime_id}；loaded guard ${b.loaded_guard}，三命名空间分列。升级405→406且gen3→4一次，同输入重试unchanged，106正文/units/snapshot/消费来源保持；仅报告登记和两次治理变更最终到409。\n\n原D详版25,777字符/58,032字节，SHA ${t.report_sha256}；新root ref ${t.ref}，冻结${t.frozen_report}，48—106全59/current有效。转录主体D、本次记录执行；本人没有又全文读59。本人全文98—106及4/19/24，另六处片段，SHA/范围在own-readings.json；98—106实际事件审计../reading-audit/upgrade-final.json。\n\n新候选${d.id}、base408、branch410已aborted，原id/token/base存handoff.json/branch-original。分支无tool，父包doctor/守卫匹配；真实rewind/replay/六项长报告/preview/record完成，报告28,438字符/64,327字节，SHA ${d.long_report_sha256}，原D附录精确保留。候选106正文/snapshot同root，root演练期字节不变；fresh错误token拒绝/正确token恢复同base。没有prepare/commit或意见applied，不resume旧committed16d38509，也不重绑它。候选stale/pending五窗保留，root pending=[]，valid21/stale105。\n\n107 context与record-template均真实exit2/ACTION_OUT_OF_SCOPE，state不变、无107稿。意见0，不造采用/应用历史。新导出${e.output}，manifest SHA ${e.manifest_sha256}，manuscript SHA ${e.manuscript_sha256}，106顺序/内容同登记稿、248114汉字，warnings/excluded=[]；旧0.7.2导出保留，仍是草稿。\n\n主任务最终版npm test 152/151pass/0fail/1skip、doctor exit0已核真实记录，不是本进程重跑；旧0.7.2不冒最终版。主源码/v3包/随附61项及v1/v2冻结源均核同清单。44产品命令完整索引command-index.json，所有失败failures.json，实际工具事件索引process-command-index.json；细节与全部SHA在REPORT.md/results.json/handoff.json。继续等本进程结束后由父任务总审计，不封存、不Git提交/push/发布/联网/启动代理。未解余线和文风观察保留于model-review.md。\n`);
console.log(JSON.stringify({ok:true,report_sha256:sha(fs.readFileSync(path.join(stage,'REPORT.md'))),handoff_sha256:sha(fs.readFileSync(path.join(stage,'handoff.md'))),revision:r.revision,state_sha256:r.state_sha256,elapsed_minutes:r.elapsed_minutes}));
