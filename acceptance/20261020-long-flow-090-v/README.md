# 0.9.0 新版工具长篇实跑 V：本轮完成

本轮已完成隔离作品的 **12章、5卷、55307正文汉字** 创作与修订流程，9次真实Codex进程均正常退出0，涉及4个实际thread和5次同thread恢复。当前作品revision55/schema6/generation1，已正式暂停、仅允许discuss，两项写作范围均null，无活跃修订或待恢复事务。0.9.0仍为开发版，未正式发布；本轮未Git提交、暂存或推送，未修改现有作者作品、封存U/T及无关.idea。

当前结果以[verification.json](verification.json)、[最终流程核验](final-flow-verification.json)、[最终当前入口](交接-最终当前入口.md)为准。早期交接、orchestration检查点、build快照和`verification.before-tool-event-supplement.json`保留当时状态，不代表当前尚未完成。证据树由`evidence-manifest.json`封存；最终封存核验结果见目录外[回执](../20261020-long-flow-090-v-seal-verification.json)。

## 范围和真实流程

只在`scenario/东岸末班船-扩展验证`中，从U最终三章的同字节隔离副本继续。前6章在初始ff6包完成，随后正式更新为ab14/generation1，再写7—12及执行最终全文复核；不宣称新包从零写完12章。文体为温暖克制现实小说，普通测试情节由执行器选择，不冒充人类逐字设定。初态见[baseline-worktree.json](baseline-worktree.json)。

| 阶段 | 实际完成 | 独立证据 |
| --- | --- | --- |
| A首停/同ID恢复 | 第4章前两段停下，恢复后完成4—6；发现追踪日序问题 | parent-a-first / parent-a-resume-verification.json |
| A追踪修订/同ID升级闭环 | 正式revision4—6修摘要和时间线，正文不变；新工具用旧真实commit完成意见闭环 | [追踪修正](parent-tracking-repair-verification.json)、[升级闭环](parent-upgrade-close-verification.json) |
| B首停/同ID恢复 | 7—8停下，恢复写9；完整1—6、7—8、7—9及4—9窗口复核 | [前章保护](parent-b-prefix-verification.json)、交接-B完成.md |
| C首停/同ID恢复 | 写10—12；正式独立区只重登7首停，原ID/token恢复8—12并prepare/commit | [实际改动](parent-c-revision-verification.json)、交接-C完成.md |
| 新鲜F | 当前1→12全文实读、完整范围review、暂停、两项13越权拒绝、当前12草稿导出 | [原生行覆盖](native-final-read-coverage.json)、[最终核验](final-flow-verification.json) |

新增4—12均使用至少两个真实顺序片段后CLI assemble，逐章完整回读、保存报告并绑定当前SHA，preview成功才record。4/6/9/10/12各达到5000汉字，5/7/8/11各达到3500汉字。首稿中发现的知情、日序、算术及动作衔接问题均在登记前修正，旧分段与整稿保留。F实际29次FastCtx读取覆盖当前全部2410行，单次≤100行、章次单调、同一pass前后版本一致；该脚本只证明返回行与版本，不能证明文学理解。

三条跨卷线索由正文行动兑现：4→8早取货、收款及实际早走；5→11装门试放、付款与父女分工，12实际使用；6→12新旅客读图、重绑、过沟上坡和接班。目送只到桥上近两灯杆，不补写已到对岸/楼中，也不补写第6章妇人未见的终点。全文[模型实读报告](scenario/东岸末班船-扩展验证/审查/V-最终当前稿-0001-0012.md)保留首次/最近、人物所知及未知边界。

## 本轮实际修复

A发现第4/5章追踪日序误标，正式修订后六章正文、前3章登记未动；但旧默认review-issues apply要求正文实改，无法表达纯追踪意见的完成。保留旧真实拒绝后，新增可选`change_scope:tracking`，默认draft仍保留正文实改门禁。

新模式核真实completed修订事务前后state归档及章节末journal快照，比较摘要和事实追踪值；对象键排序不算变化、数组顺序保留，不把来源/报告/修订号或同值重登当作修改，也不把值哈希当自然语言理解。仍须实际当前review及verify。新增5项正式保护用例，完善帮助、快速入门和使用手册；具体范围见[source-changes-since-u.json](source-changes-since-u.json)。正式更新后用同一个旧commit应用并verify日期意见，保留原资源；最终effective_status仍verified。

另两项是普通事实修订测试，不称原稿bug：7零钱一卷→两卷、8实际拆备用；9工50→55/总76→81、11实付81。正文只改7/8/9/11，10/12正文不改但旧追踪同步新值。7—12逐章回放及完整4—9/7—12比较后才合并；前6正文与登记对象、全部不可变观察三字段保持。占用期间主区plan13真实退出2/REVISION_OCCUPIED，1235文件同字节；最终暂停后根负向13亦退出2且1368文件同字节。

## 最终候选和回归

当前content ID：`ab14a65fc7677e8c76c03cbe8f7ec7c49203ad070ed0163e265cf5047500e626`。ZIP SHA256：`542a2db03a4ddbdf96431e3a60a5940eb7523ac82adf3f30f32e32db31ac3ce5`。实际包为[candidate-tracking/ai-writer-0.9.0.zip](candidate-tracking/ai-writer-0.9.0.zip)，独立解压后执行测试；身份/来源见[delivery-current.json](delivery-current.json)。

| 最终源码与实际包检查 | 结果 |
| --- | --- |
| 源码npm test | 199项，197通过、0失败、2项Windows链接权限跳过 |
| 实际解压包npm test | 199项，197通过、0失败、相同2项跳过 |
| 实际包test:engine | 29通过、0失败、0跳过 |
| 源码/包npm run doctor、最终作品doctor/check | 均通过 |

[build-tracking-verification.json](build-tracking-verification.json)是实际升级前的构建测试快照，其creative_flow_complete/actual_workspace_upgraded=false保留当时事实；当前升级和完整流程由后续独立证明给出，不修改旧绿灯来冒充新结果。`product-frozen-current.json`冻结324项源码/CI；最终所有冻结源码、ZIP及实际包文件保持同字节。当前Windows/Node24.15.0；配置中的三OS×Node20/24矩阵未在远端执行。

最终当前review有效8份，过期8份均有当前覆盖，缺覆盖0、pending窗口空，无未发布记录。旧过期报告自身仍过期，没有清理状态来清零。导出[当前12章草稿](export-final-current-12/manuscript.md)与[manifest](export-final-current-12/manifest.json)逐项匹配current units/source_hashes，独立重组字节相同，排除但保留8份旧稿；状态仍draft-export/quality_review required。

## 完整记录与失败分类

[命令/原生事件库存](command-native-audit-complete.json)包括commands及cli-logs共468份实际回执，保留argv、输入、stdout/stderr和子进程码。20项捕获非零、21项CLI JSON中标记的原生失败均已在[failure-dispositions.json](failure-dispositions.json)分类；预期保护、旧能力缺口、缺project/错参数/错命令、辅助脚本及路径探读分别说明。shell外包装1与真实CLI2分开记录。C的TLS重连自动恢复，原进程正常退出，原诊断保留。

CLI的`--json`并不包含全部编排工具事件。另从4个真实会话补存1752条公开工具调用/返回、876组配对，按原始偏移及行SHA核值；只保留工具字段，不复制消息、推理和内部元数据。补充发现C/F两次未暴露工具属性TypeError及一次辅助patch上下文不匹配，3项都已修正并分类，见[tool-event-supplement-verification.json](tool-event-supplement-verification.json)和[native-tool-events/](native-tool-events/)。它们不是产品CLI失败，不藏进成功退出码。

已知记录边界：A首次大写日志标签在启动CLI前被包装器拒绝，只有原生聚合输出；单独重现标明reproduced，不冒充首次独立双流。B最初漏project时log.project只是快照默认，实际argv/cwd证明命令没有针对W执行。根的日常进度/只读计算不是操作系统全进程审计，库存只统计已捕获范围。更多使用观察见[final-usability-observations.md](final-usability-observations.md)。

## 保留与暂缓

[repository-final-verification.json](repository-final-verification.json)确认HEAD仍`0c6d27abd3548dc99c1a72996b9b4f2e2ef5ccb4`、index为空、产品diff-check通过，T的8482文件/242700148字节和U的3073文件/45981867字节封存均未变。本轮V及前轮U相关修改/记录仍未提交；无推送或发布。

本轮是12章有限流程验证，不是60/100章扩大或长稳认证。Linux/macOS、Node20远端CI、真人无指导新手/盲读/市场及0.9.0正式发布仍暂缓。第7章动作往返、第10/12章较工整收尾等仅为模型阅读的可选建议，未升为必改；不因机械check或模型自检声称作者定稿、文学或市场验收。
