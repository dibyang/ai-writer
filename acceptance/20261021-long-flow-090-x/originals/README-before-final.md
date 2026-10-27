# 0.9.0 X轮长篇扩大实跑（进行中）

隔离验证副本为 `scenario/东岸末班船-再扩展验证`，下称 P；实际阶段以其 `.writer/state.json` 为准，执行计划与检查点见 run-plan.md。此目录中的历史快照保留当时事实，不代替当前状态。

最近独立完成阶段：B在r134暂停、登记30章/192530正文汉字；29/30分别8279/10544字，原24完整units/正文、原观察及324个根源文件保持。当前C新会话已启动，有限31—33，首轮只写31整章与32两段。实时状态以P/.writer/state.json及原始收据为准，不把本阶段快照当作后续最新状态。B根证明为checkpoint-b-complete.json、creation-brc29-30.json、read-proof-brc-window-current.json、capacity-recovery-b-verification.json；C/D/E/F尚未全部完成。

B首轮正常0，首次同ID续程在保存29六段后遭遇外部模型容量错误，实际退出1，原串行执行器停止；不是产品通过或作者暂停。真实r128停点字节见capacity-stop-b.json。不同调用名codex-b-resume-capacity-recovery用原模型/同ID恢复并正常0，已完成29—30及当前25—30正式复核。独立核验停点28稿和188个旧分段版本同字节，旧来源仅正常推进state不同。后续执行器continue-creation-after-capacity.mjs在正常0和根核验后才进入C，C/D继续按同样的首停/恢复/核验流程串行。原失败和所有旧稿不覆盖。

B首停历史：r127/28章，第29章两段3138字未合章未登记；首停正文/片段及来源分别归档，见checkpoint-b-first.json、creation-b28.json、read-proof-b-entry-current.json、source-stop-b.json、parent-b-first-stop-archive.json。36章整体仍未完成，受控旧章修订和最终全36阅读尚未开始；后台后续状态以state和原始收据为准。

A已完成阶段：25/26/27分别8622/8071/10520字；原24完整units/正文保持。入口全24原生62次/5093行、22—27原生18次/1423行均已独立匹配，零缺页，pass前后状态/SHA相同。证据：checkpoint-a-complete.json、read-proof-a-entry-current.json、read-proof-ar-window-current.json、creation-a25.json、creation-ar26.json、creation-ar27.json、resume-a-fragment-continuation.json、交接-A完成.md。原首停与其172文件备份、12来源保存核验仍保留为历史，不覆盖改写。

当前源码与原交付ZIP解压包已分别实际重跑199项测试：197通过、0失败、2项Windows权限跳过，两者doctor通过，324个源文件及包内容仍同字节；见baseline-regression-verification.json。这是本轮起始基线通过，不表示36章流程已完成。

授权口径：author-request.md保存真人本轮请求；prompt-*.md是本聊天代理据该授权派发给原生CLI的执行任务，不代表新增真人确认或作者逐项采纳。CLI消息的user角色不自动等于真人作者；治理记录中的本地来源和代理实现选择按实际出处区分，不能用模型自检冒充作者定稿。

仅在本轮scenario副本工作，W封存与作者作品只读。计划24→36章，新增普通章至少8000汉字、重点章至少10000汉字，完整保存真实原生Codex、失败、恢复及修订证据。未完成前不宣称验收。

阶段：A25—27、B28—30、C31—33、D34—36，每轮含实际分段中途停点和同ID恢复；E正式旧章多处修订及跨会话尾段重登；F新会话全36当前稿实读、暂停保护与草稿导出。

0.9.0仍开发中，非正式发布、真人盲读或市场验收。不得提交推送、改旧封存、手改state/hash或清理失败记录。
