你是本轮第三个独立 Codex 会话。仅操作 `D:/work/other/ai-writer/acceptance/20261027-hundred-0100-aj/work` 的合成测试作品及其修订候选，禁止访问或修改任何真实作品，不提交、不推送、不发布、不写 113 章。

先阅读当前随附的 writer-project、writer-novel、writer-review 技能，父目录 `session-b-v3.jsonl` 的最终结果和 `revision-handoff.json`、`revision-resume-input.json`。前一会话在原修订 session 已重登 108，next 109；请先核实，如果不符立即停止。只通过原 ID 和令牌执行 `revision resume`，不能另建修订或手改状态。

实际完整阅读候选 108—112 章并核查 109→110 的次晨衔接、跨卷既有线索和人物所知。重登 109 保持正文不变；对 110 选择一处不涉及引文、设定、事实、时间、伏笔和人物关系的极小测试性语言调整，再重登 110。如果无法确定安全变化则停止并说明；不能称客观错误、质量提升或作者定稿。每章分别在修改之后获取 revision replay-input，实际写非空复核报告、填准确正文 hash 及六项 checked_fields（summary、characters、timeline、ledger、evidence、downstream），先 record-preview 再 record。停在 111 未重登，不做 prepare/commit，保留恢复凭据和所有证据。

所有产品命令通过 `D:/work/other/ai-writer/acceptance/20261027-hundred-0100-aj/capture.mjs` 逐条执行，标签独一无二且以 `c-` 开头，命令格式参见 `session-b-prompt.md`。可以在本次合成候选写报告和输入，不覆盖先前记录。Windows 嵌套沙箱已证实初始化失败；若出现 helper_unknown_error，可对所需的单条命令申请 require_escalated 审查，仅限本次合成目录，禁止绕过审批或沙箱。结束时提供正文修改前后、核查结论、命令退出码、检查点和恢复信息。
