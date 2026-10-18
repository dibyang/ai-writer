# 《铜桥来信》第三独立会话：恢复、后半程修订与事务提交

本阶段完成。原会话 b035e525-797d-4f5f-8d7d-fffa8113cfb6 已恢复并提交，主业务 revision 28 → 29；随后仅更新暂停/讨论任务至 revision 30。分支临时 revision=45 没有覆盖主计数。最终仍为六章、正文4051汉字，next_unit=7，未写第七章。

范围仅为 acceptance/20261018-governance-b 内本轮独立作品及本阶段文件。使用主项目 cwd 和 bin/ai-writer.mjs，每次真实产品调用都通过 capture.mjs、唯一 native-three-* 标签；没有代理、其他会话消息、Git操作/提交/推送、真实作品修改、源码/技能修改、旧封存改写或随附工具升级。没有手改 state、基线、令牌摘要或事务状态。

## 恢复与授权证据

先读 writer-project、writer-novel、writer-review、长篇与通用/自然语言模块、docs/revision-and-sources.md，以及根 handoff.json/report.md 和 native-revise-partial 交接。再由真实 CLI 核实：主稿六章、revision28、pending id=7a56e371-5a27-42e1-81fa-aa2b9522a520、活跃会话 editing；分支 revision39、仅登记1–3、next_unit4、revision_scope1–6。4–6旧文件留存并不等于重登完成。

继承已经准备的合成作者原话“从第二章开始，押钱改为三枚，第五章退回三枚……第一章仍保留当时旧规则……主稿保留到下一会话完成全部尾段复核与事务提交。完成整轮修订后暂停正文，不写第七章”。原完整证据位于研究/第二会话-合成作者修订原话.md，SHA256=3d200eff63ef0aad6d767776f47851ff722c7954c235c9303de94e47e76cebb3；没有另造授权。保守前缀1仍按已确认流程核查，语义改价从2生效。

保存主状态原字节、六章指纹、分支状态、session/base/base-state。错误 token 的 resume 返回 REVISION_OWNER_REQUIRED；正确 token 恢复同一ID、原workspace与base_revision28。style-scan带输出路径尝试主稿写旁路，返回 REVISION_OCCUPIED，未产生目标文件。三次恢复探测均未改主状态；恢复前后session字节和base字节相同，没有新建替代会话、transfer或改所有权元数据。[恢复核验](restore-invariance.json)及原始调用见末尾索引。

## 模型实读、正文修订与账本修复

实读[恢复六章](readings/resume-six.md)、[入口与六份细纲](readings/resume-inputs.md)、[全部冻结输入](readings/effective-frozen-inputs.md)，区分活动入口与真正消费版本。每章取新 context/template，再以真实引文、summary和changes登记。

- 第4章全文保留并重新登记：柳婆只看旧页描样、听封套描述；修印仍为待现场核验的解释，不预知押钱或铜片保管。阿禾与柳婆自行保管描样、试纸。
- 第5章三处退款数额改三枚，洗净细节明确“两枚钱的孔边原先洗得亮……另一枚孔里还带着黑垢”，对应第2章洗两枚、临时添一枚。保留原印封回柜底、封套由周叔布囊带上坡、铜片从暂存转归档留锁匣、信另签领。
- 第6章仅将开头收钱改三枚，人物/时间线/FACT_DEPOSIT补三枚进家中小碟的当前证据。铜片留柜，鞋样入旧册，信回敞盒；回信未寄，周叔柳婆不知私信内容。

第一次重登至6后完整连读并逐项核账，发现 OBS_NOTCH 中周叔所知仍停在“暂不能断缺角成因”，与第5章复验冲突，见[实际发现](first-read-finding.md)。正式 rewind5 后取新context/template，更新第5章三位在场者所知并重登5–6。原观察 statement、author_truth 和第3章观察证据保留，修补解释仍由 FACT_STAMP_REPAIR 承载。这是本会话登记遗漏并已纠正，不是产品自动推理失败。

重登6后再次完整读[最终六章](readings/final-six-after-reregister.md)，写[具体模型复核报告](model-review-final.md)，在独立workspace正式 review覆盖1–6。报告保留各章不同选择：1接受次晨再来、2追问后补钱、3不凭缺角下结论、4柳婆亲认手艺、5认错却不立即宽宥、6给姨母留饭。没有添加阴谋或审核式旁白。

这是同会话知情模型实读。机械副本生成和哈希计算只用于绑定字节；不称真人盲读、独立代理、市场验证或正式发布验收。未做实际人声朗读。

## Prepare、事务与历史保留

prepare前主状态仍为原SHA ad49c0d50c2e79c1f3c0342ae91b67c29483304e9aedd25e57150f7480a46596；原CAS基线102文件无差异，作者证据相同、范围完整1–6、账本与最终正文已核。[预检查](pre-prepare-verification.json)与[准备清单核验](prepared-verification.json)保留具体文件、旧新哈希、旧版本对象及依赖证据。prepared后候选未再改动；117项候选树校验无差异。

主作品 revision prepare 返回 target_revision29。revision commit 返回主revision29、事务 e1433cbb-4344-4870-a5bd-5f3e9f3cbfbd completed、backups_preserved=true；主正文只在该事务提交中发布。重复同一会话commit返回 unchanged=true，主状态字节与revision均未再变化。[幂等核验](commit-invariance.json)可回查。

事务35项计划的旧/新备份逐项核哈希，原有文件的旧字节均保留；分支、rewind备份、base及事务目录完整留存。主pending消失；第1章正文原SHA不变且绑定RULES_V1，第2–6绑定RULES_V3_FROM2。起始7个冻结版本元数据与对象字节逐项有效，原source事件完整保留，含RULES_V2_FROM7原未来安排。v2仍在历史中，其有效区间由本次从2持续的v3替代，没有误报它仍于7切换。[最终来源历史](final-source-history.json)、[最终账本](final-ledger.json)和[核验详情](verification.json)包含证据。

## 主入口核验、暂停与导出

新主项目入口check/doctor/status、source list（1/6）、recall（铜片/押钱/缺角印）均退出0。check为6章、findings=[]、未登记=[]；rolling_review valid1、stale3，但3份旧报告都有当前覆盖，pending_windows=[]。这是覆盖与机械结果，literary_quality仍为unreviewed。

按原证据执行workflow暂停：stage=structure、allowed_actions=[discuss,plan]、draft_range/revise_range均null。最终revision30，next_unit保留7，next.action明确只讨论。更新前后六章units及snapshot完全相同，当前完整复核仍valid1，没有因阶段文字更新全部失效。第7章context和record-template均返回ACTION_OUT_OF_SCOPE/退出2，状态字节不变，无第7章正文或细纲。

随附副本与主项目均显示0.5.0，但比较发现7处内容差异：两份手册、4个runtime模块、writer-project技能。副本清单missing/mismatches均空，doctor正在诊断该作品随附副本；实际进程入口始终是主项目bin。44次记录器的主runtime_guard均为c479c3f5485a2f937197cc9459d70cf95df58741cadb07e81668a1b0e28e568b，与原会话build_id相同，进程前后磁盘runtime稳定。本轮没有主构建或主基线冲突；没有自动替换副本掩盖差异。

导出在作品外新目录 [export-six](export-six/manuscript.md)：included_units=[1,2,3,4,5,6]、excluded_drafts=[]、warnings=[]。已核六章完整文本均包含且合订稿实际SHA与manifest相同：8b7c5818f762aac69f314da566e58f61aae1a04e4e3d4d9f4eeb1bf074476682。当前正文目录只有六章，排除清单确为空；修订分支/事务/内部记录不作为额外正文混入导出。导出状态仍为draft-export。

## 错误、产品缺陷与边界

44次真实CLI：退出0共40次；退出2共4次，均为预期拒绝（错误token、主写旁路、两次第7章越权）。无非预期产品调用失败，无新发现的产品缺陷；没有修改源码或绕过协议。

一次本阶段辅助脚本准备错误：read-more.mjs 首次把状态版本字段写为 s.sources.versions，实际字段为 s.source_versions，触发TypeError。失败发生在任何产品调用及作品写入前；修正本阶段helper后继续，没有修改产品状态。它不计入44次产品调用，也没有把它称为产品缺陷。[原错误说明](helper-error.md)保留最小输入与异常。

只覆盖本机Windows的本轮六章真实CLI与模型复核流程。未验证跨机/共享盘、断电或事务中断恢复、市场、平台发布、真实旧作品迁移及长期压力。未修改工具，因此未运行npm test/npm run doctor/test:engine；本轮作品CLI doctor已真实执行，不引用别会话测试充数。

## 最终文件

- [summary.json](summary.json)、[handoff.json](handoff.json)：revision、session、事务、暂停范围与下次恢复入口。
- [最终作品哈希](final-work-hashes.json)：作品目录442个文件，包括保留分支及事务备份。
- [最终输入哈希](final-input-hashes.json)、[六章与消费绑定](final-units-and-inputs.json)：区分活动入口哈希与每章冻结消费哈希。
- [逐调用索引](command-index.json)：argv、输入哈希、退出码、前后state、构建观测及真实stdout/stderr摘要。每次调用原始证据完整复制到本阶段commands/，记录器根commands/native-three-*原件也保留。
- 最终主state SHA256：3a9d813682cfc9d624bdce0a246d00052d0d2975ede638ad4439f2576c73d7ca。

本阶段到此停止正文。第7章后的剧情仍待作者选择，不自动继续。

## 全部逐调用证据

| 标签 | 退出码 | 原始产品结果 |
|---|---:|---|
| native-three-branch-check-after-review | 0 | [stdout](commands/native-three-branch-check-after-review/stdout.raw.txt) / [stderr](commands/native-three-branch-check-after-review/stderr.raw.txt) |
| native-three-branch-check-before-review | 0 | [stdout](commands/native-three-branch-check-before-review/stdout.raw.txt) / [stderr](commands/native-three-branch-check-before-review/stderr.raw.txt) |
| native-three-chapter4-context | 0 | [stdout](commands/native-three-chapter4-context/stdout.raw.txt) / [stderr](commands/native-three-chapter4-context/stderr.raw.txt) |
| native-three-chapter4-record | 0 | [stdout](commands/native-three-chapter4-record/stdout.raw.txt) / [stderr](commands/native-three-chapter4-record/stderr.raw.txt) |
| native-three-chapter4-template | 0 | [stdout](commands/native-three-chapter4-template/stdout.raw.txt) / [stderr](commands/native-three-chapter4-template/stderr.raw.txt) |
| native-three-chapter5-context | 0 | [stdout](commands/native-three-chapter5-context/stdout.raw.txt) / [stderr](commands/native-three-chapter5-context/stderr.raw.txt) |
| native-three-chapter5-record | 0 | [stdout](commands/native-three-chapter5-record/stdout.raw.txt) / [stderr](commands/native-three-chapter5-record/stderr.raw.txt) |
| native-three-chapter5-template | 0 | [stdout](commands/native-three-chapter5-template/stdout.raw.txt) / [stderr](commands/native-three-chapter5-template/stderr.raw.txt) |
| native-three-chapter6-context | 0 | [stdout](commands/native-three-chapter6-context/stdout.raw.txt) / [stderr](commands/native-three-chapter6-context/stderr.raw.txt) |
| native-three-chapter6-record | 0 | [stdout](commands/native-three-chapter6-record/stdout.raw.txt) / [stderr](commands/native-three-chapter6-record/stderr.raw.txt) |
| native-three-chapter6-template | 0 | [stdout](commands/native-three-chapter6-template/stdout.raw.txt) / [stderr](commands/native-three-chapter6-template/stderr.raw.txt) |
| native-three-denied-context7 | 2 | [stdout](commands/native-three-denied-context7/stdout.raw.txt) / [stderr](commands/native-three-denied-context7/stderr.raw.txt) |
| native-three-denied-template7 | 2 | [stdout](commands/native-three-denied-template7/stdout.raw.txt) / [stderr](commands/native-three-denied-template7/stderr.raw.txt) |
| native-three-discussion-context | 0 | [stdout](commands/native-three-discussion-context/stdout.raw.txt) / [stderr](commands/native-three-discussion-context/stderr.raw.txt) |
| native-three-final-tail-review | 0 | [stdout](commands/native-three-final-tail-review/stdout.raw.txt) / [stderr](commands/native-three-final-tail-review/stderr.raw.txt) |
| native-three-fix-knowledge-context5 | 0 | [stdout](commands/native-three-fix-knowledge-context5/stdout.raw.txt) / [stderr](commands/native-three-fix-knowledge-context5/stderr.raw.txt) |
| native-three-fix-knowledge-context6 | 0 | [stdout](commands/native-three-fix-knowledge-context6/stdout.raw.txt) / [stderr](commands/native-three-fix-knowledge-context6/stderr.raw.txt) |
| native-three-fix-knowledge-record5 | 0 | [stdout](commands/native-three-fix-knowledge-record5/stdout.raw.txt) / [stderr](commands/native-three-fix-knowledge-record5/stderr.raw.txt) |
| native-three-fix-knowledge-record6 | 0 | [stdout](commands/native-three-fix-knowledge-record6/stdout.raw.txt) / [stderr](commands/native-three-fix-knowledge-record6/stderr.raw.txt) |
| native-three-fix-knowledge-rewind5 | 0 | [stdout](commands/native-three-fix-knowledge-rewind5/stdout.raw.txt) / [stderr](commands/native-three-fix-knowledge-rewind5/stderr.raw.txt) |
| native-three-fix-knowledge-template5 | 0 | [stdout](commands/native-three-fix-knowledge-template5/stdout.raw.txt) / [stderr](commands/native-three-fix-knowledge-template5/stderr.raw.txt) |
| native-three-fix-knowledge-template6 | 0 | [stdout](commands/native-three-fix-knowledge-template6/stdout.raw.txt) / [stderr](commands/native-three-fix-knowledge-template6/stderr.raw.txt) |
| native-three-main-bypass-style-scan | 2 | [stdout](commands/native-three-main-bypass-style-scan/stdout.raw.txt) / [stderr](commands/native-three-main-bypass-style-scan/stderr.raw.txt) |
| native-three-main-check-committed | 0 | [stdout](commands/native-three-main-check-committed/stdout.raw.txt) / [stderr](commands/native-three-main-check-committed/stderr.raw.txt) |
| native-three-main-check-paused | 0 | [stdout](commands/native-three-main-check-paused/stdout.raw.txt) / [stderr](commands/native-three-main-check-paused/stderr.raw.txt) |
| native-three-main-doctor | 0 | [stdout](commands/native-three-main-doctor/stdout.raw.txt) / [stderr](commands/native-three-main-doctor/stderr.raw.txt) |
| native-three-main-export | 0 | [stdout](commands/native-three-main-export/stdout.raw.txt) / [stderr](commands/native-three-main-export/stderr.raw.txt) |
| native-three-main-recall-copper | 0 | [stdout](commands/native-three-main-recall-copper/stdout.raw.txt) / [stderr](commands/native-three-main-recall-copper/stderr.raw.txt) |
| native-three-main-recall-deposit | 0 | [stdout](commands/native-three-main-recall-deposit/stdout.raw.txt) / [stderr](commands/native-three-main-recall-deposit/stderr.raw.txt) |
| native-three-main-recall-notch | 0 | [stdout](commands/native-three-main-recall-notch/stdout.raw.txt) / [stderr](commands/native-three-main-recall-notch/stderr.raw.txt) |
| native-three-main-sources-unit1 | 0 | [stdout](commands/native-three-main-sources-unit1/stdout.raw.txt) / [stderr](commands/native-three-main-sources-unit1/stderr.raw.txt) |
| native-three-main-sources-unit6 | 0 | [stdout](commands/native-three-main-sources-unit6/stdout.raw.txt) / [stderr](commands/native-three-main-sources-unit6/stderr.raw.txt) |
| native-three-main-status-paused | 0 | [stdout](commands/native-three-main-status-paused/stdout.raw.txt) / [stderr](commands/native-three-main-status-paused/stderr.raw.txt) |
| native-three-restore-branch-status | 0 | [stdout](commands/native-three-restore-branch-status/stdout.raw.txt) / [stderr](commands/native-three-restore-branch-status/stderr.raw.txt) |
| native-three-restore-main-status | 0 | [stdout](commands/native-three-restore-main-status/stdout.raw.txt) / [stderr](commands/native-three-restore-main-status/stderr.raw.txt) |
| native-three-restore-revision-list | 0 | [stdout](commands/native-three-restore-revision-list/stdout.raw.txt) / [stderr](commands/native-three-restore-revision-list/stderr.raw.txt) |
| native-three-resume-same-session | 0 | [stdout](commands/native-three-resume-same-session/stdout.raw.txt) / [stderr](commands/native-three-resume-same-session/stderr.raw.txt) |
| native-three-resume-wrong-token | 2 | [stdout](commands/native-three-resume-wrong-token/stdout.raw.txt) / [stderr](commands/native-three-resume-wrong-token/stderr.raw.txt) |
| native-three-revision-commit | 0 | [stdout](commands/native-three-revision-commit/stdout.raw.txt) / [stderr](commands/native-three-revision-commit/stderr.raw.txt) |
| native-three-revision-commit-idempotent | 0 | [stdout](commands/native-three-revision-commit-idempotent/stdout.raw.txt) / [stderr](commands/native-three-revision-commit-idempotent/stderr.raw.txt) |
| native-three-revision-prepare | 0 | [stdout](commands/native-three-revision-prepare/stdout.raw.txt) / [stderr](commands/native-three-revision-prepare/stderr.raw.txt) |
| native-three-tool-compare-copy | 0 | [stdout](commands/native-three-tool-compare-copy/stdout.raw.txt) / [stderr](commands/native-three-tool-compare-copy/stderr.raw.txt) |
| native-three-tool-identify-main | 0 | [stdout](commands/native-three-tool-identify-main/stdout.raw.txt) / [stderr](commands/native-three-tool-identify-main/stderr.raw.txt) |
| native-three-workflow-pause | 0 | [stdout](commands/native-three-workflow-pause/stdout.raw.txt) / [stderr](commands/native-three-workflow-pause/stderr.raw.txt) |
