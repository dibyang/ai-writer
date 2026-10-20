# V根编排检查点：修后包全回归通过，待实际升级闭环

这是较新的检查点，覆盖orchestration-after-a-first.md中尚未发生的后续假设；原文件不改作历史。用户本轮“继续推进”，本轮目标仍V隔离副本12章/5卷，多轮恢复、3条跨卷兑现、7/9两处旧章正式修订、最终F全文实读/暂停/导出。未授权Git提交或推送，不动既有作品、U/T及.idea，不派协作子代理。

## 已完成的实际进展

W=V/scenario/东岸末班船-扩展验证，V=D:/work/other/ai-writer/acceptance/20261020-long-flow-090-v。

1. A首停及同ID恢复均正常退出0，A thread=01a15880-13ce-7fe0-adf7-78a1110f6bb2。6章28754正文汉字，各5214/3525/5226/5820/3845/5124。A恢复3570369ms，59分30秒，**未触发**旧run.mjs的1小时上限，不能记成超时。后续均run-long.mjs（2小时异步限时，仍≤45秒轮询/60秒内反馈）。
2. 根parent-a-resume机械核验及guard-probe after-a成功；context7实际码2 ACTION_OUT_OF_SCOPE，443份作品文件同字节。
3. A最后发现日期登记错：第4timeline“停航次晨”、第5summary/timeline“停航次日晚”。正文正确。权威规则是停航前夜，第4次晨=停航首日，第5晚/6下午晚同日并行。
4. 同A thread第三次运行codex-a-tracking-repair，正常退出0、1310416ms。正式revision4—6：session4b267c89-25a8-4fa0-a61b-06fd59f67561，commit3ec56fe0-3fbc-4bfe-9cb1-2253bdf0db68，transaction97c11e48-4f17-44c5-96de-5e087099eea0 completed；六章正文/原1—3单位记录未变，snapshot只两条日期前缀变、4/5摘要澄清。根parent-a-repair及parent-tracking-repair-verification通过。当前修订后r28 paused仅discuss，range双null。
5. V_A_U5_TIME_METADATA在修订前adopted。旧ff6工具真实apply失败（cli-logs/am43-apply-issue）码2 REVIEW_CHANGE_REQUIRED、state前后同SHA；因只修追踪没有正文变化，仍adopted、application/verification空，停止verify。交接-A追踪修正完成.md和am-tool-blocker.md是**闭环未完**的历史入口。
6. P_ORDER3/190引句另经根片段复核，见parent-order-evidence-assessment.md：2/4直接支持订单送达，3引句支持周岸听到还箱消息的知情字段，不独立证送达；没有扩大修订，不是另一个已确认需修硬问题。

## 已补产品能力并完成新包全回归

source change只11文件（source-changes-since-u.json）：lib/review-workflow.mjs、revisions.mjs、workspace.mjs、help.mjs；tests/review-workflow.test.mjs；docs快速入门/手册/复核/流程；CHANGELOG和RELEASE_NOTES。0.9.0仍开发中。新可选apply JSON change_scope=tracking，默认draft仍认正文实改。tracking从真实completed事务的旧/新state归档+journal恢复对应章末事实快照，与摘要比较规范化JSON哈希；核采用时旧dependency和当前实际追踪，忽略对象键顺序但保留数组，不把来源/报告/修订号/等价重登当变化。不是自然语言语义验收，仍须当前实读verify。新增5项正式保护用例，模块19全通过；V下前置2例先红后绿。

**最终修后候选**：candidate-tracking/ai-writer-0.9.0.zip；SHA542a2db03a4ddbdf96431e3a60a5940eb7523ac82adf3f30f32e32db31ac3ce5；content_id=ab14a65fc7677e8c76c03cbe8f7ec7c49203ad070ed0163e265cf5047500e626。

实际独立解压P=D:/work/other/ai-writer/.tmp/V 登记追踪修正验收包解压/ai-writer-0.9.0。delivery-current.json、product-frozen-current.json、extract-current.mjs绑定ZIP325文件/来源323映射/324冻结条目。初始ff6、delivery-start及product-frozen-start只作旧代，不覆盖。

commands/source-tests-tracking、package-tests-tracking各199项197通过0失败2Windows链接权限跳过，源码835565.0912ms、包840625.5103ms reporter；doctor两处0/oktrue/ab14；package-engine-tracking29通过0失败0跳过。verify-build-tracking.mjs已成功，build-tracking-verification.json.ok=true，核全部最终源码/实际包/ZIP/CI字节不变。里面actual_workspace_upgraded=false/actual_issue_closed=false是当时构建快照，不改成终态。源码自10:46构建起冻结，后续不编辑任何产品文件，除非发现真实新缺陷（若再修需新最终包与全回归）。Windows Node24.15.0，CI配置三OS×Node20/24未远端执行。

## 当前正在执行

第4次同A thread：**commands/codex-a-upgrade-close**，实际stdin **prompt-a-upgrade-close.md**，外层exec session76003，约11:07UTC开始，仍在运行；用progress.mjs查询done/实际thread/最新消息/主状态。它执行正式工具升级至ab14/generation1，旧W入口先合法规划授权，包外P入口compare/update-plan/update，根定制默认保留；随后新W入口默认apply仍须码2拒绝，再新输入显式tracking应用旧真实commit，4—6全文+追踪实读review，verify为verified，暂停仅discuss，交接-A追踪闭环完成.md。执行器预计30—45分钟，不写7、不重做已提交修订。

CLI二进制保持C:/Users/admin/AppData/Local/OpenAI/Codex/bin/896a0166b774037a/codex.exe，0.163.0-alpha.10.2，无模型/努力覆盖。外层exec需批准Codex状态库访问，内层workspace-write。源文件/手册已通过最终测试，不要在此阶段继续小改导致包不匹配。v-log.mjs统一cli-logs，小写标签，不另造庞大全目录索引；完整库存由根末尾做。

## 还必须完成，不能提前结束任务

1. 等A升级闭环正常结束。根用**verify-checkpoint-v3.mjs a-closure**（已改读delivery-current/product-frozen-current并增phase6）保存parent-a-closure证明。额外独立核：generation1、installed.source_content_id/identify为ab14，units/snapshot与parent-a-repair状态完全相同、根原资源保留；V_A_U5_TIME_METADATA真实effective verified，默认新工具拒绝的实际码/同state及显式tracking成功/原commit/state归档哈希真实。这一额外脚本尚未写。旧v1/v2仍绑定ff6，不能用于新包阶段。
2. **新鲜B用prompt-b-first-v5.md**（完整实际提示，已机械替换身份/新闭环交接；不是v4或更早）。新label codex-b-first，run-long，exec --json --sandbox workspace-write -C ROOT -o V/codex-b-first-last.md -。7—8首停（各≥3500），trial7—9，低1000字符预算真实负向诊断、8兑现第一线索。结束根v3 phase b-first要求8章。
3. 同实际B thread resume，label codex-b-resume，**prompt-b-resume-v2.md**（无ff6硬编码，正式收窄9—9），9≥5000、7—9连读review，停9。结束根v3 phase b-resume。
4. 新鲜C，label codex-c-first，**prompt-c-first-v3.md**（明确覆盖旧v2/base中的ff6身份，当前以delivery-current为准），10/12≥5000、11≥3500，11/12兑其余两线。完整7—12读后，7/9各选一项非immutable普通事实合理追溯修改，正式revision7—12，独立区只重登7首停。根v3 phase c-first主12，guard-probe occupied（真实plan13只负向）码2 REVISION_OCCUPIED/全W同字节。保存主12原稿字节及当前state用于对照（不可动U）。
5. 同实际C thread resume，label codex-c-resume，**prompt-c-resume-v3.md**，同R ID/token重登8—12/完整尾段review/prepare差异检查/commit，再更新过时首停任务，不新授权13。根v3 phase c-resume，另写真实修改及下游机械diff证明，1—6与所有immutable三项保持。不凭哈希宣称文学正确。
6. 新鲜F label codex-f，**prompt-f-v2.md**覆盖旧F身份。按read-boundary.mjs pass1 before→当前1—12 FastCtx每次≤100行按序全文→after，真实报告/功能比较/范围review，paused仅discuss、13两项实际拒绝，导出export-final-current-12。若硬修复须正式R并pass2全12新读。根verify-native-reading.mjs解析真实原生返回行+一致边界，另人工看calls顺序，不能把机械覆盖说成理解。根v3 phase final、guard-probe final，CLI check/revision list/doctor、12章当前SHA/报告冻结/完整覆盖/无事务/导出字节与排除稿独立核验。最终状态脚本尚未写，可参照只读U适配12章。
7. 最后命令/原生事件全库存（commands及cli-logs，不可漏容器，流名raw.txt/result.exit_code），全部非零分类、实际正常进程及同thread恢复统计、失败缺口明确；README更新当前最终范围、verification、封存树和目录外回执。U/T只seal verify不重写，V封存后不再写内部。本轮未Git提交/推送，0c6d27ab基线保持。.idea不碰。

真实扩大规模还没到12，不能只因补丁/6章完成就结项。新最终包的实跑是旧包生成前6、正式升级后续写到12、最终新包全文复核，不冒称新包从零写12，更不冒称百章/真人/市场/全平台验证。预计实际进程将比原计划7次多：A新增追踪修正及升级闭环两次，目标9次正常最终原生执行/4thread，实际以回执为准。
