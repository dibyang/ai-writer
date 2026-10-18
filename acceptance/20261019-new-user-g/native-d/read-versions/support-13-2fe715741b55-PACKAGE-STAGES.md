# 候选资源的两个时点

原候选0.7.4的完整61文件冻结在sources/candidate-package和source-build.json；native-a-v2实际从这份主项目资源建书，运行模块及三份新用户手册在整个会话期间不变。其源内容ID为d672568ec98345708756c40d7f1d490c301089b6134b429106dda2dfe62d7e1f。

A结束后，核对相关说明发现“当前适用0.7.3”等版本用语仍需与新候选一致，因此统一更新当前版本字样。其中受管包内仅docs/revision-and-sources.md的一处版本说明改变；运行模块、快速入门、使用手册及长篇路径均未变。最终资源另冻到sources/final-package和source-build-final.json，保留原包与原测试，不覆写它们。最终包重跑完整npm test与doctor。

G新书仍暂时保留最初安装的原0.7.4包；这是真实的同版本不同内容，不篡改清单使其假装相同。最终修订会话提交/结束且无占用后，允许在本次隔离验证范围内从主项目外部入口显式tool update-plan/update，保留根定制、正文与事实；再从最终包入口诊断、恢复并导出。具体实际执行与身份以最终阶段记录为准，不预填已完成。现有作品不升级。

首次读取审计脚本仅适配FastCtx，因此未计A使用的带编号CLI读稿输出；reading-audit/native-a-v2.json保留失败。verify-command-readings.mjs改为核对原模型事件中实际显示的文件头、SHA及逐行正文，校验通过保存在native-a-v2-corrected.json。不能只凭readings.json自声明推定读过，也不能把输出匹配称理解证明或真人盲读。

## 第三时点：实际新用户问题引出的说明修复

A把“仅写1–3章”混进长期定位/权威来源，B恢复时实际遇到旧范围文字。没有覆盖已消费来源；在当前任务中明确历史任务与最新范围。为防止新书再混用，三份作者指南新增临时范围只放workflow/交接的要求，冻结为sources/g3-package及source-build-g3.json。运行模块与前两份包完全相同，最终交付资源以g3为准，另重跑g3-tests/g3-doctor，并由新的native-e只规划建书实跑检验。最终样稿包只在修订结束后正式更新到g3，不改清单追认；历史两包、原始测试和会话证据保留。

## 第四时点：结构化比较格式说明

B真实审查因外层distinct_gains误用对象、similar_structures对象字段不符连续拒绝；B以报告保留完整判断、空结构数组的可接受输入结束，明确没有把空数组称为不存在相似结构。补齐docs/review-and-registration.md的完整片段、准确类型与空数组规则，workflow.md直接链接。冻结为sources/g4-package及source-build-g4.json，**最终资源以g4取代上节g3作为交付目标**。运行模块始终未变；重跑g4-tests/g4-doctor，并由C实际填写完整对象验证说明。D最终更新及E新建书均使用g4，旧各包和测试不覆盖。
