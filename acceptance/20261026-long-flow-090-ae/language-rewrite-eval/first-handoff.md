# 首轮交接：等待控制器冻结与原会话恢复

当前会话 ID：`01a178e6-3098-73b2-974c-14f5709a1e43`。来源为当前进程环境中的 CODEX_SESSION_ID 与 CODEX_THREAD_ID，两者一致；并非自造编号。

本目录：`D:/work/other/ai-writer/acceptance/20261026-long-flow-090-ae/language-rewrite-eval`。以下所有结果均新建；输入、冻结规则、作品、工具与隐藏判据均未修改。本轮没有子代理、提交、推送或外部发布。

## 恢复所需文件

- `cases.json`：八组输入，必须保留各组 context、三段全文和 editor_candidate，不能以关键词代替邻段。
- `first-input-cases-before.json`：本轮修改稿产生前保存的输入原始字节副本，哈希应与 cases.json 相同。
- `first-review.md`：逐组事实与语言分开诊断，精确引句、最小差异、保留理由、候选裁定及待核点。
- `first-drafts.json`：R01—R08 各完整三段；R01 与 R03 修改，其余原样保留。changes 列表只记录实际替换。
- `first-manifest.json`：输入、五份冻结规则、上述输出的 SHA-256、实际读取范围、会话身份与验证状态。
- `first-manifest.sha256`：first-manifest.json 的外置 SHA-256。manifest 不把自身字节哈希递归写进自身；外置文件承载该哈希，不声称能自包含验证所有校验文件。
- 冻结规则根目录：`../extracted-final-candidate-v5/ai-writer-0.9.0/.agents/skills/writer-review/`。已完整读 `SKILL.md`（1—50 行）、`references/general-review.md`（1—125 行）、`references/natural-language-authenticity.md`（1—95 行）、`references/deslop.md`（1—55 行）、`references/concrete-language-review.md`（1—39 行）。完整末尾空行也包含在读取范围内；包的实际目录经路径查找确认。

先核对 manifest 外置校验，再核对 manifest 内各文件哈希；不应因只有文件名相同就沿用结论。后续过程是否冻结成功由控制器记录，本文件不提前作证。

## 已完成

当前会话已完整阅读 cases.json 第 1—82 行和上述五份规则，逐组审查，不跨组借设定。完成事实连续性、语言四项文字检查、候选是否改变主体对象时序次数数量或声音的判断；实际给出完整三段结果。R01 澄清许可范围及引气对象，R03 校准转腕幅度；没有替正常省略、职业用语、古风比喻和不同人物顾虑加说明或对白。另做同会话内查漏与防误伤，未以此冒充跨会话复读。

保存过程只进行输出结构、原句与替换定位、完整三段、输入前后哈希及文件字节哈希核对。机械核对的最终结果写入 manifest；它不判断文学质量。所有判断均为本次知情模型实读，不是独立真人结论。

## 未完成及后续边界

尚未进行控制器证据冻结、原会话恢复后的重新完整复读、跨会话回读或整体验收，也没有运行文学统计测评。未读取 expected-root-only.json、其他模型答案或 language-eval 结果；恢复时继续遵守这一隔离边界。

后续由控制器冻结上述证据，再通过本文件所列原会话 ID 恢复。恢复后先核对版本和授权，再完整阅读八组原文及本轮稿件，逐组复核语言与事实，结果另建文件。不得覆盖 first-* 证据，不得把本轮的“已做同会话复核”写成“已完成跨会话复读”。本程保存并验证这些首轮文件后结束，不自行启动恢复阶段。
