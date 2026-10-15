# 本阶段问题与失败现场

未经确认不归为产品缺陷；不修改产品实现。

| 阶段 | 现象 | 核实与处置 | 分类 |
| --- | --- | --- | --- |
| 技能读取 | 编排中调用 `tools.mcp__fastctx__read`，得到 `TypeError: ... is not a function` | 核实该名称未暴露在functions工具列表，改用直接提供的 `mcp__fastctx.read`；未进入写作CLI | 本次调用方式错误 |
| 审稿模块读取 | 推测的 `references/suspense.md` 不存在 | glob查到实际为 `suspense-review.md`，读取后继续 | 本次路径输入错误 |
| 设计保存 | apply_patch拒绝同一补丁对同一文件先Delete再Add | 未落盘、未改变作品追踪；改用Update操作 | 本次补丁格式错误 |

根init和首次status成功；输出在会话工具记录中。其后命令由本阶段run-tool.mjs转发到作品随附工具，保留stdout、stderr、参数和退出码。不重取写前模板消除来源漂移。

## 初始化副本与后来根目录的差异

`copied-provenance.json`记录初始化随附文件及核对时根目录的真实SHA-256：journal.mjs、longform.mjs、workspace.mjs、writer-project/references/long-form.md、writer-research/SKILL.md共五处不同。已只读核对根init使用copyFileSync直接复制原文件；文本差异包含applyDelta参数与召回预算规则，非换行差异。因此推断根目录在初始化后有其他写入，不能据此认定初始化复制故障。保留原作品副本，不升级、不覆盖、不把根目录后来的版本当本轮实际运行版本。

protected-baseline在此核对时采集，仅可证明采集时刻以后的变化，不能追溯为本轮开始时的全局快照。本轮没有写入保护目录的操作。后续如果根目录继续变化，最终报告将区分外部变化与本轮写入范围，不把整个根工作区称为干净。

## 第二章record输入失败（已核实）

首次第二章record退出1，报“物证交接必须明确previous_holder，且与当前保管人一致”。原输入将previous_holder放在custody内部，值虽为当前保管人何素琴，字段层级不符。已只读核对随附longform.mjs第70、89行：它要求ledger条目顶层的input.previous_holder。失败输入保存在evidence/record-0002-failed-input.json，原stdout/stderr亦保留；失败后check仍为units=1、revision=2，未推进。

只将previous_holder移至P001条目顶层，保留同一写前模板、expected_revision及全部source_hashes后重试。不归为产品缺陷；文档对字段层级的示例不够直观可作为使用说明观察，本阶段不改文档或实现。

目前没有已确认的产品问题。若后续失败，在此追加核实结果，保留原输入和evidence。

## 结束前范围核对

protected-baseline之后，根lib/longform.mjs、lib/workspace.mjs、tests/longform.test.mjs又出现哈希变化。这里仅记录观察到的同期变化；本轮没有向根lib/bin/tests/.agents写入的工具操作，没有回退或覆盖这些文件。最终审计列出的protected_changed不是本轮修改清单，不据此宣布根工作区干净。作品随附工具和技能另按冻结清单核对，正文消费来源由status/check验证。

最终09:54:40 UTC审计又包含根.agents/skills/writer-project/references/long-form.md，共四个根文件相对baseline不同；作品随附33个工具/技能文件相对冻结清单全部未变（copied_changed=[]）。本阶段不追查或清理根目录同期工作。
