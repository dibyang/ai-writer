# S 过程检查点 06（C恢复仍运行，未完成）

2026-10-20 02:58 Asia/Shanghai左右。codex-c-resume仍为活动进程，PTY89809，原线程01a15556-0cb4-7823-a277-367ce8b8f139；不要重复启动或覆盖label。主作品r39/已登记13章/工具gen3。第13章真实登记成功：8237 Han、5段、SHA84f8a57da060f7fcb7c48e9a69c833b93c4214acf220b261eacea4d06a5eeded；原两段保留。14章已写3段，当前3818 Han，尚未登记；15未写。父只记录临时字数，不在模型自改期间绑定最终SHA或声称完成。

恢复阶段真实另取context与模板在补后三段前完成。c-resume-source-comparison-retry1.json逐字段证明情节/来源/主snapshot/governance等价，旧snapshot的JSON键顺序变化曾使首次文本比较断言误报，原失败保留。该retry1文件经父实际JSON.parse有效。所有对比字段确实存在于context，不是空值比较。

commands/c-old-template-13-refused真实record退出2，错误COMMAND_FAILED、消息“追踪修订号已变化，请重新生成 context”，before/after state SHA同为d08300f4295836c7237e48da2f73a662299d13792d8750e970db1e36339c515c。C辅助脚本误预期1导致嵌套断言退出1，未重跑或覆盖该label；模型读实际错误后用补写前的r38新模板成功登记13。不能把这个拒绝编成REVISION_CHANGED代码。新包产品保护成功，这两次属于验证辅助脚本错误。

13登记前独立c-manual-preview-13实际10候选/只出8/遗漏2，semantic_judgment=not-performed。模型召回相关旧ID并实读再登记，体现真实有界提示，不宣称候选覆盖全部语义。

已准备未执行的最终帮助脚本：
- finish-flow.mjs：真实完整18章报告后review1—18/暂停/19模板拒绝/discussion/修订清场/check-doctor/export。根据实际bin异常规范，把19拒绝预期码在执行前修为2（不是1）。
- verify-native-read.mjs：对codex-final-read原生FastCtx结果逐行核全部当前正文，写native-final-read-coverage.json；只是机械返回覆盖证据，不是文学证明。
- verify-current-manuscript.mjs：18章字数/源与ZIP字节/当前修后分段精确组装/原中断与历史段稿未改/13新旧模板及拒绝窗口/最终custody等；最后才运行。
- audit-commands.mjs：所有外层捕获结束后直接node运行，别套S/run（否则会看见自己仍运行）。已排除codex-version，只把args含exec当真实客户端；分别保留外层非零、嵌套命令失败、MCP错误与S范围file_change事件。
- capture-local-status.mjs：最后只读Git并保存HEAD/status/暂存/精确tracked范围，不执行任何Git写入。

8个既有S帮助脚本已parse检查通过（delivery-helper-syntax）；其后只有上述辅助断言/审计筛选完善，没有产品源码更改。Root最终12产品/321源冻结、V4实际ZIP与730a...内容ID、175/176双套回归及doctor仍是最终产品版本。新增capture-local-status本身将在末尾真实执行。原Q最后仍须再只读seal verify；S最终README/verification/manifest/外置回执仍未生成，不得标完成。

后续：等C13—15正常退出并读交接→新D16—18（含prepare16后budget16）→新final-read全18稳定稿→父总核与审计/README/verification→封存。暂不修改现有作品，不提交、不推送。Memory实际可引用MEMORY.md183，mechanical checks not literary acceptance，关联rollout01a14352-7ed0-7ce0-b512-67b16aa8ceea；未编辑memory。
