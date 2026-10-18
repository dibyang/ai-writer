# G轮新用户实跑D：修订跨会话恢复、最终复核、更新与导出

这是新的真实Codex CLI进程；只在D:/work/other/ai-writer/acceptance/20261019-new-user-g/内写入。先读native-c/handoff.md/json与当前作品文件、user-guide/long-form/revision-and-sources/review-and-registration/tool-updates及所需技能和实际help。不得修改主项目、现有作品、旧档案、原始报告、state或哈希，不Git提交/推送、联网研究或发布。所有产品操作使用capture.mjs唯一d-标签；不直接import业务API。只凭本地交接恢复，不继承聊天或扫描其他acceptance找现成业务输入。

目标作品为作品/雾港 来信。核C实际状态：若C有未完修订，恢复同ID、令牌和原base_revision，不另建新基线或跳过未登记尾段；保留主稿原字节及原单位记录。按C的实际采用意见和授权，从独立区继续实读重登4–6章，核摘要、人物、时间线、ledger、引文和下游，preview后record，正文3–6无确认问题保持原字节。只允许第2章必要表达澄清，不增金额或付款事实，不重写其他剧情，不写第7章。若C未发生净收益改动，真实报告并中止空候选，不伪称意见已应用。

完成2–6章最终登记且不会再改正文后，先输出一条明确的进度消息 **G_FINAL_TAIL_BEGIN**，再按最终字节完整阅读本独立区第1–6章（包含所需尾段2–6和未改前缀1，第1章只读不重登），不能用此前重登读稿或零散短评拼出这次完整连读。可以用FastCtx或带路径、SHA及行号的CLI输出；输出预算不足须续读。保存实际阅读版本和哈希、连续性/语言及范围边界报告，登记from=1/to=6的review，再回主作品prepare/commit。核实际发布只改了必要的正文，旧章/知识及物件仍连续，其他旧原文与事实保持；重复相同commit输入应幂等、不再次推进revision。实际主事务完成后才review-issues apply，当前有效模型报告复核后才verify；无实际改动不得applied，不伪造真人选择。

上述标记消息应以G_FINAL_TAIL_BEGIN开头，只在确实开始最终尾段阅读时输出，不在开场预告中复述此标记。父审计仅计算该消息之后实际显示的最终版本正文。

本书只有六章；为同时覆盖受影响的1–3与1–6滚动窗口，本次标记之后实际完整读取**最终1–6章**，报告from=1、to=6，包含所需尾段2–6。第1章只读、原登记保留，不因回读前缀重登或改写它。不能先按2–6短报再把范围改大成1–6；必须真的读取全部六章后绑定当前哈希。

## 最终资源一致性

读PACKAGE-STAGES.md、source-build.json、source-build-final.json、source-build-g3.json和source-build-g4.json：初次0.7.4包到g4仅文档改变，包括版本文字、临时任务与长期设定分离及comparison准确类型/示例，运行模块始终相同；A/B原始包和读取记录不改。**在当前修订已提交或中止、没有活跃会话之后**，本G轮隔离验证允许更新本新作品完整工具包以匹配g4交付资源：从主项目外部入口tool update-plan，source为D:/work/other/ai-writer的当前最终源码，核对source-build-g4身份后按真实作者任务/代理执行范围准备update输入。保留根AGENTS、技能、手册笔记和全部文学事实，不暗做schema迁移，不重建清单追认；只走正式tool update流程。保存更新前后正文/units/snapshot对照、实际包身份和幂等重试，不把版本号相同叫内容相同。若计划阻断先按真实原因处理，不能改状态绕过。

更新后从实际作品随附入口运行help/doctor/status及discussion context，确认当前包与最终冻结包一致、正文/事实没变。根手册可保留原版本字节，入口help应指向包内最新手册，这属于定制保留政策。主项目运行模块不得在本会话中修改；无法更新则保留原包及阻断，不预填已通过。

最后正式暂停正文，仅讨论/规划，验证第7章context和record-template都被拒绝。导出当前已登记6章到G轮目录内、作品目录外的新导出目录，不覆盖旧版本；核manifest纳入、排除和警告，仍是草稿。不称全书文学无误、人类盲读或作者定稿。

保留native-d/REPORT.md、readings.json及read-versions、handoff.md/json、results.json：主/分支原基线与最终revision、实际提交和意见状态、最终工具身份、读稿范围、源输入/输出、失败纠正和未覆盖项。最终交付按五项简报，不在公开回答重复令牌。父审计会按真实模型事件中的文字核读取曝光，readings.json自声明不单独证明阅读。
