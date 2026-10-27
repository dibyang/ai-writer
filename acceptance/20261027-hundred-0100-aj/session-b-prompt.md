你是本轮第二个独立 Codex 会话。只使用 `D:/work/other/ai-writer/acceptance/20261027-hundred-0100-aj/work` 这个合成测试副本，禁止访问或修改任何真实作品，不提交、不推送、不发布、不写第 113 章或以后正文。

用户要求验证百章规模的分卷迁移、多轮跨会话恢复、旧章修订后的连续性。前一独立会话已实读 81、84、89、95、104—112 章并报告没有足以强制修复 108/110 章的高置信问题；报告在本轮父目录 `session-a-report.md`。因此此处授权是在隔离副本做两处可控测试性语言细调，目的是真实检验修订、重登和连续性；不得谎称发现客观错误、文学品质提高、作者已采纳。全程保留事实、人物所知、物件、时间、未决悬念、证据引文和作者声音；如找不到语义安全的小调整，停止并明确报告，不为通过而编造。

主稿已按真实用户请求登记了仅修订 108—112 的 workflow，已建立原生独立修订会话。读取父目录 `revision-handoff.json`、`revision-resume-input.json` 获得原 id、workspace 和令牌，不能自行新建修订、修改 state 或刷新基线。先读当前随附 writer-project、writer-novel、writer-review 技能，实际完整读 107—110 章，必要时阅读 111—112 章。重新核查 109→110 承接和 108 原文的语义、证据锚点。

本会话只做以下步骤并停在第 109 章未重登的检查点：

1. 在主稿使用原 id 和令牌执行 `revision resume`，记录原 base 和 owner；在原候选 workspace 按当前 revision 对第 108 章执行 `rewind`。不得在主稿直接改正文。
2. 在候选区第 108 章选择一处能保留事实和声音的小调整；实际比较改前改后，不能删除或改写 ledger 已用引文，不能动其他章。将这是测试性变化而非确认错误写入报告。
3. 改完正文之后以原令牌执行 `revision replay-input --unit 108`，核对当前上下文、原登记差量及引文，根据实际读稿写非空复核报告，并在输入中填写 `replay_review` 的 reviewer、report、draft_sha256 及六项 `checked_fields`：summary、characters、timeline、ledger、evidence、downstream。不得把自动草案冒称语义复核，不能手改来源哈希。
4. 实际运行 record-preview 和 record，确认已登记至 108、下一章为 109；保留 109—112 旧正文和原修订凭据，不提前改 110、不 prepare、不 commit。写最终报告：改前后片段、正文与登记 SHA、确认内容、不确定点和可恢复入口。

所有 ai-writer 产品命令使用本轮 `D:/work/other/ai-writer/acceptance/20261027-hundred-0100-aj/capture.mjs`，每条不同标签以 `b-` 开头；格式为 `node <capture.mjs绝对路径> b-唯一标签 node <主稿随附bin/ai-writer.mjs绝对路径> <产品命令...>`。捕获器在父目录 `commands/b-标签/` 保存输入、stdout/stderr、状态前后哈希及产品退出码；以各自 result.json/stderr 为准。执行成功后读取相应 stdout.raw.txt；不在回退中并行执行写命令。

允许在候选的 `审查/` 和 `.writer/drafts/` 新建真实复核报告及输入，也允许捕获器在本轮父目录写唯一证据；不能改原始封存、其他作品或源代码。保持全部失败和原稿，不覆盖旧记录。任务结束后给出完整报告和检查点。
