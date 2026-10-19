# H轮read-b：技能入口修复后实际更新并整读23–54章

遵循H轮PLAN.md、PLAN-AMENDMENTS及READING-PROTOCOL-v2.md。先核read-a-recover/handoff.md/json及该阶段实际通过的parent-verification记录，再从work的真实文件和现有随附CLI恢复，不依赖聊天记忆。前置恢复已正常退出831秒，父原文曝光及状态核验通过。若通过记录与实际不符，报告阻断，不推进依赖工作。

父执行者在原恢复期间修复了当前包内技能定位，主仓库变化由PARENT-ACTIVITY.json说明，不是该会话越界写入。新完整冻结SOURCE为D:/work/other/ai-writer/acceptance/20261019-hundred-h/sources/package-v2，版本0.7.5，身份见source-build-v2.json；v2-tests已156项中155通过、0失败、1环境跳过，v2-doctor成功。先用实际现有0.7.4入口只读确认106章/r411/schema6/generation5、paused/discuss-plan及无活跃/待恢复事务；读取前后state应不变。不要重复0.7.3→0.7.4原更新，也不resume旧历史修订。

随后用SOURCE的外部入口执行真实identify/compare/update-plan与tool update，从0.7.4升级到0.7.5；author_evidence仍引用本轮真实人类任务/代理测试范围，按实际help和计划request准备输入，不手改state或只复制CLI。保存准确前后state/正文/units/snapshot和根作者文件清单，相同输入重试应unchanged，不再推进revision或generation。当前只有读稿/规划授权，不能写107。

更新后新Node进程从随附入口运行help、doctor、status、discussion context与compare，核完整资源与SOURCE相同、generation仅5→6、schema仍6、106章正文/units/snapshot和根定制保留。**实际按help与doctor.skill_root返回路径完整读取当前writer-project、对应文体和审查技能**，记录resource-routing-proof.json（实际路径/完整SHA/冻结版本及本次读取范围），与保留的根旧技能分开，作者根要求继续生效，不自动覆盖或删除它们。新的CLI路径信息只提供入口，不代表模型已读；由实际读取输出证明。如果升级/路径/保护出现问题，保存原失败与现场，不刷新构建绑定硬过。

只有以上步骤完成才继续下面的原稿阅读；正式workflow仍仅discuss/plan，临时读稿范围保存任务/交接，不混入旧长期设定。原0.7.4段的实际操作身份保留，不改写成0.7.5执行。

本阶段完整实际读取23–54章。23–27重读用于承接，28–54为本进程新覆盖，不把重叠算新章。按统一session-io助手每1–2章整读并保存版本，原正文和106章登记保持。所有产品调用唯一read-b-*标签经capture，原始输入输出不覆盖。

重点复核首部已兑现主线如何进入生活/工作续部，旧单页与后续纸张是否被混同、原件/工作副本的处理、人物对公开讲述的不同立场、知道事实与愿意讲出的区别、收入/工时与关系成本。对照前阶段未决清单，尚未获得原文支持的声音/编辑/私人原因继续保留。报告每章不同收益及可能重复的解释，候选修改给具体原句与代价，不在本阶段动稿或强行确证。

保存read-b/REPORT.md、handoff.md/json、results.json和命令清单。结束仍106章、只讨论/规划、107未写；交接下一真实进程读50–81章。题名/事实/阶段均用实际文件值，不为凑验收扩写阴谋或捏造作者选择。
