import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import assert from 'node:assert/strict';import {fileURLToPath} from 'node:url';
const base=path.dirname(fileURLToPath(import.meta.url)),cfg=JSON.parse(fs.readFileSync(path.join(base,'project.json'))),root=cfg.project;
const sha=b=>crypto.createHash('sha256').update(b).digest('hex'),json=f=>JSON.parse(fs.readFileSync(f)),s=json(path.join(root,'.writer/state.json')),entry=json(path.join(base,'checkpoint-planning-entry-state.json')),baseline=json(path.join(base,'baseline-state.json'));
const cp=json(path.join(base,'checkpoint-planning-entry.json'));
const oldFiles=Object.entries(cp.files).map(([ref,x])=>{const bytes=fs.readFileSync(path.join(root,ref));return {ref,bytes:bytes.length,sha256:sha(bytes),matches:bytes.length===x.bytes&&sha(bytes)===x.sha256};});
assert(oldFiles.every(x=>x.matches),'checkpoint byte drift');
const protectedFields=['units','snapshot','baseline','source_versions','source_ranges','source_events','source_operations','impact_pending','committed_revisions','tool_control'];
const protectedState=Object.fromEntries(protectedFields.map(k=>[k,JSON.stringify(entry[k])===JSON.stringify(s[k])]));
assert(Object.values(protectedState).every(Boolean),'protected state changed');
assert.deepEqual(s.review_workflow.issues,entry.review_workflow.issues,'old issues changed');
const stateChanges=Object.keys(s).filter(k=>JSON.stringify(s[k])!==JSON.stringify(entry[k]));
assert(stateChanges.every(k=>['revision','governance','governance_events','operations','review_workflow','governance_binding'].includes(k)),'unexpected top-level state change');
const commandAudit=fs.readdirSync(path.join(base,'cli-logs')).filter(x=>x.startsWith('adp-')).map(label=>{const folder=path.join(base,'cli-logs',label),result=json(path.join(folder,'result.json'));return {label,...result,stdout_sha256:sha(fs.readFileSync(path.join(folder,'stdout.txt'))),stderr_sha256:sha(fs.readFileSync(path.join(folder,'stderr.txt')))};}).sort((a,b)=>a.started_at.localeCompare(b.started_at));
assert(commandAudit.every(c=>c.exit_code===0),'CLI failure requires review');
assert(!commandAudit.some(c=>c.args.includes('record-template')),'record template requested');
const pages=fs.readdirSync(path.join(base,'read-pages')).filter(x=>x.startsWith('adp-')).map(ref=>{const p=json(path.join(base,'read-pages',ref)),b=fs.readFileSync(p.file),t=b.toString('utf8');assert.equal(sha(b),p.sha256,'read version drift');assert.equal(t.slice(p.from,p.to),p.text,'page text drift');assert.equal(Math.ceil(t.length/1800),p.pages);return {proof:'read-pages/'+ref,file:path.relative(root,p.file).replaceAll('\\','/'),sha256:p.sha256,page:p.page,pages:p.pages,from:p.from,to:p.to,total_chars:p.total_chars};});
const grouped=new Map();for(const p of pages){if(!grouped.has(p.file))grouped.set(p.file,{file:p.file,sha256:p.sha256,pages_total:p.pages,pages_read:[]});grouped.get(p.file).pages_read.push(p.page);}
const coverage=[...grouped.values()].map(p=>({...p,pages_read:[...new Set(p.pages_read)].sort((a,b)=>a-b),complete:new Set(p.pages_read).size===p.pages_total}));
for(const u of s.units.filter(x=>x.unit>=43)){const c=coverage.find(x=>x.file===u.draft);assert(c?.complete,'current unit not fully read '+u.unit);}
const bodyCoverage=coverage.filter(x=>x.file.startsWith('正文/')).map(x=>({...x,unit:Number(x.file.match(/正文\/(\d+)/)[1])})).sort((a,b)=>a.unit-b.unit);
const currentPages=bodyCoverage.filter(x=>x.unit>=43).reduce((n,x)=>n+x.pages_read.length,0),oldPages=bodyCoverage.filter(x=>x.unit<43).reduce((n,x)=>n+x.pages_read.length,0);
assert.equal(currentPages,49);assert.equal(oldPages,43);
const status=json(path.join(base,'cli-logs/adp-final-status/stdout.txt')),check=json(path.join(base,'cli-logs/adp-final-check/stdout.txt')),doctor=json(path.join(base,'cli-logs/adp-final-doctor/stdout.txt')),sources=json(path.join(base,'cli-logs/adp-final-sources/stdout.txt')),compare=json(path.join(base,'cli-logs/adp-tool-compare/stdout.txt'));
assert(status.ok&&check.ok&&doctor.ok&&compare.same_content);assert.equal(s.units.length,48);assert.equal(s.revision,264);assert.equal(s.tool_control.generation,7);
assert(!status.stale_units.length&&!status.changed_sources.length&&!status.impact_pending.length);
assert.equal(status.draft_inventory.unregistered.length,25);
const packageRoot=path.join(root,'.writer/tool');
const skillRefs=['.agents/skills/writer-project/SKILL.md','.agents/skills/writer-novel/SKILL.md','.agents/skills/writer-review/SKILL.md','.agents/skills/writer-project/references/long-form.md','.agents/skills/writer-novel/references/story-development.md','.agents/skills/writer-novel/references/chapter-delivery.md','.agents/skills/writer-review/references/general-review.md','.agents/skills/writer-review/references/natural-language-authenticity.md','.agents/skills/writer-review/references/architecture-continuity-review.md','.agents/skills/writer-review/references/physical-logic-operability.md','docs/long-form.md','docs/workflow.md','docs/review-and-registration.md'];
const explicitReads=['writer.json','AGENTS.md','设定/作品定位.md','设定/文风.md','设定/权威规则.md','设定/人物与声音.md','大纲/全书大纲.md','大纲/扩展骨架-V.md','大纲/扩展骨架-W.md','大纲/扩大骨架-X.md','大纲/AC扩大骨架-37-48.md','大纲/分卷/V17.json','研究/AD作者任务.md','审查/F-当前全书1-48阅读报告.md','.writer/objects/bbc56b1c15e97bb9d22895d04979687543f7a5b93b710ebf36d8df02b6b95858.source'];
const newRefs=['大纲/AD扩大骨架-49-60.md','研究/AD规划与旧线证据.md','审查/AD-43-48当前实读与规划风险.md',...[18,19,20,21].map(n=>'大纲/分卷/V'+n+'.json'),...[49,50,51].map(n=>'大纲/单元/'+String(n).padStart(4,'0')+'.json')];
const stamp=(ref,where=root)=>{const b=fs.readFileSync(path.join(where,ref));return {ref,bytes:b.length,chars:b.toString('utf8').length,sha256:sha(b)};};
const sourceManifest=[...new Set([...explicitReads,...coverage.map(x=>x.file),...newRefs])].map(ref=>stamp(ref));
const budget=[49,50,51].map(n=>{const ref='大纲/单元/'+String(n).padStart(4,'0')+'.json',p=json(path.join(root,ref));const selected=[...new Set(['writer.json','设定/作品定位.md','设定/文风.md','设定/权威规则.md',ref,'大纲/分卷/V18.json',...p.setting_refs,...p.research_refs])].map(x=>stamp(x));return {unit:n,nature:'static-source-occupancy-not-runtime-context',files:selected,selected_file_chars:selected.reduce((v,x)=>v+x.chars,0),raw_snapshot_json_chars:JSON.stringify(s.snapshot).length,default_runtime_budget:40000,runtime_budget_tested:false,reason:'本程仅discuss/plan，无draft权限；discussion实际成功但不生成写作context/budget。原始snapshot长度不等于工具按相关性选取后的上下文。',next_action:'后续授权draft后先看真实context预算细目；若超限保留错误，以完整约束显式扩容，不重取旧模板/删约束/截断。'};});
const recalls=commandAudit.filter(c=>c.args[0]==='recall').map(c=>{const result=json(path.join(base,'cli-logs',c.label,'stdout.txt'));return {label:c.label,query:result.query,total:result.total,omitted:result.omitted,ids:result.matches.filter(x=>x.kind==='ledger').map(x=>x.id),units:result.matches.filter(x=>x.kind==='unit').map(x=>x.unit),note:'仅定位；采用判断以evidence文档所列本程原文回读为准'};});
const report={ok:true,at:new Date().toISOString(),scope:'AD planning-only first process; not 60-chapter task completion',selection_actor:'controller',author_evidence:{local_source:'研究/AD作者任务.md',sha256:sha(fs.readFileSync(path.join(root,'研究/AD作者任务.md'))),quote:'继续推进',locator:'第3行，承接第7行原任务；无消息ID'},baseline:{revision:baseline.revision,units:baseline.units.length,generation:baseline.tool_control.generation},checkpoint:{revision:entry.revision,units:entry.units.length,files:oldFiles.length,mismatches:0},final:{revision:s.revision,units:48,next_unit:49,generation:7,content_id:doctor.build.observed_content_id,runtime_id:doctor.build.runtime_id,build_missing:doctor.build.missing.length,build_mismatches:doctor.build.mismatches.length,stale_units:status.stale_units,changed_sources:status.changed_sources,impact_pending:status.impact_pending,active_revisions:status.revisions.sessions.filter(x=>x.status!=='committed').length,unrecovered:status.revisions.transactions.filter(x=>x.status!=='completed').length,unregistered:25,check:check.ok,doctor:doctor.ok,rolling_review:check.rolling_review,authorization:s.governance.authorization},protected_state:protectedState,old_review_issues_unchanged:true,actual_top_level_state_changes:stateChanges,checkpoint_byte_checks:oldFiles,unregistered_inventory:json(path.join(base,'ad-planning-entry-audit.json')).inventory,read_coverage:{current_full_range:[43,48],current_pages:currentPages,necessary_old_pages:oldPages,total_body_pages:currentPages+oldPages,complete_old_units:bodyCoverage.filter(x=>x.unit<43&&x.complete).map(x=>x.unit),body:bodyCoverage,other_paged_sources:coverage.filter(x=>!x.file.startsWith('正文/')),proofs:pages,fastctx_full_read_sources:explicitReads,actual_skill_root:packageRoot,skills_and_manuals:skillRefs.map(ref=>stamp(ref,packageRoot)),historical_reference_only:['AC/交接-F完成.md','AD样本/审查/F-当前全书1-48阅读报告.md'],not_claimed:'本程没有完整实读当前1—48或1—60；F报告276页不计本程。'},source_manifest:sourceManifest,source_versions_preserved:{versions:Object.keys(s.source_versions||{}).length,ranges:s.source_ranges,entry_differences:sources.entry_differences,pending_edits:sources.pending_edits,note:'33V2及E九项已发布版本保留；live旧入口差异不是changed_sources，不刷新或覆盖。'},old_line_evidence:{report:'研究/AD规划与旧线证据.md',sha256:stamp('研究/AD规划与旧线证据.md').sha256,recalls,staged_payoffs:['旧灯的物主决定/实际受理与有限取用','柜信息与到场条件；成熟才有限修做/验用/结款','另一帘的可承担一次责任','眼前旧图版本辨认，不声称全部追回','两册自有书的不同兴趣交流','父自有轻袋的当次用途、女自己的下一次练习'],intentionally_open:['照片未见处','所有外流旧图及旧旅客最终去处','复航','母衣永久舒适及长期耐用','父脚痊愈','父辈全史','课程总期数/重大职业与关系终局']},planning:{skeleton:'大纲/AD扩大骨架-49-60.md',volumes:[18,19,20,21].map(n=>'大纲/分卷/V'+n+'.json'),detailed_plans:[49,50,51].map(n=>'大纲/单元/'+String(n).padStart(4,'0')+'.json'),formal_review:json(path.join(base,'cli-logs/adp-review-submit/stdout.txt')),workflow_adoption:json(path.join(base,'cli-logs/adp-workflow-adopt/stdout.txt')),core_unknown_blocker:false,unresolved_core:'保留核心选择而选取不依赖答案的普通生活线；普通现场事实由后续真实成稿建立',characters_different_gains:{许蓉:'自己旧灯的时间/消费/使用选择',周岸:'要求资料提供者参与、承受未接单与使用者意见',沈禾:'自己的歇班与阅读时间不被家务吞掉',沈成林:'自有轻物和自己想看的内容，而非证明伤愈',许蓉女儿:'自己的学习/兴趣与母需求分开，能接受不同看法'}},targets:{new_units:{from:49,to:60,count:12},ordinary_min_han:12000,long_units:[52,56,60],long_min_han:16000,total_min_han:156000,groups:[[49,51],[52,54],[55,57],[58,60]],native_exit_units:[50,53,56,59],exit_after:'原写前模板＋前两自然段约3500—5000后真退出/同ID恢复；本程不开始',status:'controller-scale-target-not-author-scene-selection-not-written'},budget_diagnosis:budget,successes:commandAudit.map(c=>({label:c.label,args:c.args,exit_code:c.exit_code,elapsed_ms:c.elapsed_ms})),failures_and_limits:[{kind:'orchestration-error',action:'首次试图在functions.exec内批量调用FastCtx read',error:'TypeError: tools.mcp__fastctx__read is not a function',effect:'无文件写入；ALL_TOOLS查不到该工具，改用实际可用的FastCtx直接调用后继续。原失败保留于本进程公开工具事件。'},{kind:'metadata-output-truncation',action:'早期status/check/doctor与一组recall返回过长',effect:'完整双流已由wrapper保存；后按JSON提取必要状态/引文补读，不用截断元数据冒充读稿；所有正文分页均足额返回。'},{kind:'scope-limit',action:'真实49写作context预算/正文验收',effect:'本程无draft权限，未取context draft/record-template；只有静态引用占用诊断，真实写前预算待下一阶段。'}],command_audit:commandAudit,pending_steps:['根核本程正式文件/源版本/实际读页与规划容量','按原作者任务正式登记有限正文范围，取得当前有效context与写前模板，再按四组三章写49—60','50/53/56/59各真实首停、原模板/源字节/同ID恢复；每组当前六章完整实读与正式review','后续多处普通旧事实按source协议/独立修订传播，至少两次恢复与整尾回放','最终新会话完整当前1—60实读；原六意见只在覆盖其证据的当前报告verify，保留原application','61范围保护、草稿导出及根的最终交付核验'],no_actions:['no-new-prose','no-record-template','no-source-drift-manufacture','no-old-issue-apply','no-AC-write','no-real-work-write','no-source-or-global-modification','no-git-commit-push-publish','no-external-transfer','no-subagent-extra-session-or-background-writing']};
fs.writeFileSync(path.join(base,'ad-planning.json'),JSON.stringify(report,null,2)+'\n',{flag:'wx'});
const oldSummary=bodyCoverage.filter(x=>x.unit<43).map(x=>x.unit+'章p'+x.pages_read.join('/')).join('；');
const handoff=`# 交接：AD规划完成

本首程只完成实读恢复和正式规划，交根核查；不是整个48→60任务完成。当前实际48章、r264、generation7，next_unit49只是登记序号。仍仅discuss/plan，draft_range/revise_range均null；没有49正文、没有record-template，没有子代理/额外会话/后台写稿/外发/Git提交推送发布。

## 入口与构建

唯一project以AD/project.json为准：${root}。AD/cli.mjs全部命令独立adp标签，外部固定包只读；tool compare确认其与AD安装包same_content。content_id=${doctor.build.observed_content_id}；runtime_id=${doctor.build.runtime_id}。baseline-state是AC复制r261/48；planning checkpoint是r262/48，stage structure；本程review推进263、workflow规划采用推进264。正式volume/plan文件不代表新章发生。

## 实际读稿

当前43—48完整49页：8/10/7/7/7/10，经AD/read.mjs每页1800 JS字符真实返回，旧46—48只认state修后v2。另必要旧原文43页，总正文92页：${oldSummary}。6/12/13/15为全章，其他仅列页；没有称本程全书1—48已读。另分页读V1—V16共16页，V17经FastCtx全文读；原全书、V/W/X/AC骨架、人物声音/规则、作者任务、当前包三技能与所需引用/手册已读。AC交接-F完成及F全书报告仅参考，F的276页不计本程。

所有页文本、范围与SHA在read-pages/adp-*及ad-planning.json；脚本核页覆盖/字节不替代实读。入口checkpoint681项原字节全一致，48unit/snapshot/源版本区间/工具控制完全保留。25未登记旧变体保留，逐项路径/字节/当前对应入口在ad-planning-entry-audit.json和ad-planning.json，不删合并，不将历史分段拼回当前稿。

## 正式文件与采用身份

- 大纲/AD扩大骨架-49-60.md：独立未来窗口，四卷各有目标、选择、代价、关系收益及阶段回收；52—60仅骨架。
- 大纲/分卷/V18.json—V21.json：正式volume创建，对应49—51/52—54/55—57/58—60；原V1—V17未覆盖。
- 大纲/单元/0049.json、0050.json、0051.json：正式plan，仅滚动细化三章。
- 研究/AD规划与旧线证据.md：recall与原文因果、当前所知/物件、不可变约束、容量风险及未决。
- 审查/AD-43-48当前实读与规划风险.md：本进程49页知情自检；正式review ${report.planning.formal_review.ref}，quality=review-recorded-not-acceptance。没有新增issues，没有resolve/apply/acknowledge/verify旧六项。
- ad-planning.json：源SHA/读页/旧线/预算/目标/全部命令成功失败与尚待项。

workflow为outline，structure/volume/outline refs已指新正式路径，status adopted。选择身份controller：依据研究/AD作者任务.md真实quote“继续推进”，不伪称作者逐项选择剧情或新增规模。核心终局/复航/伤愈/课程总期数仍未决，不阻塞所选普通49—51；没有正文范围扩张。

## 来源与旧线边界

33仍消费CR33_RECALL_ID_V2，九项E1_S01_NEW—E1_S09_NEW保持原source区间/绑定；旧live入口不同是历史/编辑入口差异，不作为漂移刷新。本程无需变已消费来源，因此没有freeze/publish造漂移。后续必须改时另保留旧字节走正式source与独立revision全尾协议。

柜主36未归、34侧图黑线不足，47/48无新侧图，先真问当前人/图/原物再约；旧灯13拔电、19延期，仅物主亲问/真交后推进；另一帘与浅蓝袋另存短帘不同。旧图外流未全收、问路人终点未知；母衣靠桌仍碰，老师不知48夜新反馈；父伤凳杖/袋轻用，不自动好。书8/14、18未购/20未动、两种书签纸和原反馈纸分开；47女书/白纸只有可选指代风险，不判原纸瞬移。固定80/35/81/84、29厘米、19:00—20:40/100分钟、箱漆及E14/10总50/三宽条吃1.5余1.5全部不动。

新计划按母自己的灯消费、柜主信息责任、朋友兴趣、父自己轻物用途、有限家务与女自练区分收益。长章供给仍须实际写作核，不能据规划认证可读12k/16k。普通12k、52/56/60为16k，四组三章，50/53/56/59前两自然段约3500—5000后退出并同ID恢复，这些控制器安排没有写成真人逐项剧情选择。

## 预算与末检

discussion实际成功，但不生成写作context或预算；本程未越权取draft context。ad-planning.json有逐文件静态字符占用，不能把raw snapshot长度当运行时context。下一阶段获有限正文范围后先做真实预算诊断，超40000则保留真实报错并显式扩容，不删关键约束/静默截断、不重取原写前模板洗哈希。

最后status/check/doctor全部真实exit0/ok；48章/r264/gen7，stale_units/changed_sources/impact_pending全空，活跃修订0、待恢复事务0。check只25个UNREGISTERED_DRAFT警告；rolling valid21、历史stale38均有当前覆盖、pending_windows空、unpublished空。doctor errors/warnings空。最终source list保留33旧入口差异及E固定版本，非正文来源漂移。全部${commandAudit.length}个adp正式CLI命令成功，详细输入/双流/真实退出码在cli-logs；首个FastCtx编排API不存在的辅助失败、元数据截断及补读方式在JSON中如实保留，没有工具缺陷需改源码。

## 根核后尚待

根先核新骨架/正式卷章纲、引用版本、49页本程覆盖和容量风险。后续仍须按原继续任务登记正文有限授权，写49—60及四个同ID首停恢复、每组三章当前六章完整实读review；多处普通旧事实的source/独立修订传播、至少两次修订恢复与整尾回放；最终当前1—60新会话全读、原六已修意见由当前完整报告verify（不重造apply）、61范围保护与草稿交付。不要从AC历史交接复制命令写封存AC。
`;
fs.writeFileSync(path.join(base,'交接-规划完成.md'),handoff,{flag:'wx'});
const receipt={ok:true,at:new Date().toISOString(),artifacts:['ad-planning.json','交接-规划完成.md'].map(ref=>stamp(ref,base)),old_checkpoint_files:oldFiles.length,old_files_unchanged:true,protected_state,old_issues_unchanged:true,body_pages:92,current_pages:49,old_pages:43,command_count:commandAudit.length,cli_failures:0,final_revision:s.revision,new_prose:false};
fs.writeFileSync(path.join(base,'ad-planning-final-receipt.json'),JSON.stringify(receipt,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({ok:true,revision:s.revision,units:s.units.length,checkpoint_files:oldFiles.length,body_pages:92,current_pages:49,old_pages:43,command_count:commandAudit.length,all_cli_success:true,old_issues_unchanged:true,state_changes:stateChanges,budget:budget.map(x=>({unit:x.unit,selected_file_chars:x.selected_file_chars,runtime_budget_tested:false})),handoff:'交接-规划完成.md'},null,2));
