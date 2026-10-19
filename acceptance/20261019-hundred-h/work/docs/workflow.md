# 创作工作流与命令

以下命令从 ai-writer 根目录执行。`--project` 指作品目录；JSON 输入文件路径相对于当前命令目录。JSON 中引用的文件路径相对于作品目录，使用正斜杠。路径含空格时加引号。所有文本使用 UTF-8。

作者日常使用先看 [使用手册](user-guide.md)。独立作品将命令前缀换为 `node .writer/tool/bin/ai-writer.mjs`，在含 writer.json 的作品目录可省略 --project。各子命令支持 `--help`，例如 `node bin/ai-writer.mjs record --help`。

**协议选择：** 本页的完整 snapshot 示例适用于 schema 1。启用长篇后，record-template 返回 changes，必须按 [长篇流程](long-form.md) 填写，不能复制下面的 snapshot 覆盖长篇账本。两种协议的修订、来源核验与导出保护一致。

## 初始化

```powershell
node bin/ai-writer.mjs init --path "works/示例" --kind novel --title "示例"
```

目标必须不存在。初始化写入技能、工具和待完善的创作说明，不生成假正文。Codex 下一步按作者要求完善定位、文风和大纲。

## 细纲

把以下内容写到作品的 `.writer/plan-input.json`：

```json
{
  "unit": 1,
  "title": "没寄出的信",
  "goal": "阿禾想确认父亲寄出的信到了谁手里",
  "change": "寄件记录指向仍在值班的陌生人",
  "beats": ["阿禾索取寄件记录", "值班员拒绝交出原件", "两张记录出现同一个编号"],
  "cast": ["阿禾", "值班员"],
  "setting_refs": [],
  "research_refs": [],
  "forbidden": ["本章不揭露真正收件人"]
}
```

```powershell
node bin/ai-writer.mjs plan --project "works/示例" --input "works/示例/.writer/plan-input.json"
node bin/ai-writer.mjs context --project "works/示例" --unit 1
```

工具将细纲写为 `大纲/单元/0001.json`。`context` 从文件读取作品定位、作者声音、权威规则、完整状态、最近三条摘要、上章末尾、指定研究资料与设定。主对话按需再读更早原文；1800 字符的上章结尾和最近摘要不代替必要原文。

默认上下文预算 40000 字符（不是 token 数）；溢出报错，不截断。按任务相关性拆分引用或显式使用 `--max-chars`。`cast` 用于提示创作角色，不自动猜角色文件名；需要的角色卡明确列入 setting_refs。

单篇正文及单个引用文件上限为 1 MiB；含历史完整快照的内部追踪文件上限为 64 MiB，避免把正常累积的长篇状态按单篇素材拒读。超限写入会在替换前失败并保留原状态。这是文件容量保护，不保证任意长篇的召回质量；context 仍按相关性和预算读取。

## 写正文与登记

Codex 读取 context 输出，写 `正文/0001-没寄出的信.md`，逐段自检并落实授权内修改。把 context 中的 `revision` 和完整 `source_hashes` 原样带入登记文件：

推荐在读完 context、动笔之前运行下列命令取得登记模板，由工具预填来源哈希、修订号和上一完整快照，保存 JSON 后再写正文、填写实际摘要与快照。摘要初始为空，未填写不能登记；模板不表示已经阅读或写完正文。写后来源已变化时，先重读评估，不能重新取模板绕过旧哈希。PowerShell 保存命令输出时显式使用 UTF-8，或由 Node 写文件。

```powershell
node bin/ai-writer.mjs record-template --project "works/示例" --unit 1 --draft "正文/0001-没寄出的信.md"
```

```json
{
  "unit": 1,
  "expected_revision": 0,
  "source_hashes": {"这里必须替换成 context 实际返回的完整对象": "不能使用这个示例值"},
  "draft": "正文/0001-没寄出的信.md",
  "summary": "阿禾拿到寄件记录，发现两张记录编号相同；值班员留下原件。",
  "snapshot": {
    "characters": {"阿禾": "值班室；知道编号重复；还不知道真正收件人", "值班员": "持有原件；拒绝交还"},
    "threads": ["两个编号为什么相同", "真正收件人尚未揭露"],
    "timeline": ["第一夜：阿禾抵达值班室并查阅记录"]
  }
}
```

```powershell
node bin/ai-writer.mjs record --project "works/示例" --input "works/示例/.writer/record-input.json"
node bin/ai-writer.mjs check --project "works/示例"
node bin/ai-writer.mjs status --project "works/示例"
```

完整快照保留未变化的角色、伏笔和时间线；不要只写本章增量。旧 context 中任何来源变化都会拒绝登记。相同输入可幂等重放，不重复推进修订号。质量状态一直是草稿，程序不擅自提升为正式稿。

`threads` 保存尚未兑现的线索，已兑现事项转入摘要或时间线。需要全书大纲、卷纲片段或更早原文时，通过 `setting_refs` 显式引用相关文件；默认 context 不整读全书。

## 历史散文

创建 kind=history 作品后，先由 Codex 调研并写事实卡。格式见 `examples/history-fact-card.json` 和 writer-history 技能。模板默认 draft；实际读过来源、核过定位与原文后才可改 verified。细纲必须引用事实卡。无引用、未核验或缺证据字段时无法生成正式写作上下文；状态和字段齐全仍不能证明事实正确。

正文、史源说明与研究档案分开。不要让内部编号、路径、研究任务话语进入面向读者的正文。

## 修订已写章节

先 `status` 取得修订号，再运行：

```powershell
node bin/ai-writer.mjs rewind --project "works/示例" --from 1 --expected-revision 1
```

回退保存旧状态至 `.writer/rewind-*.json`，正文不动；从该单元起的追踪全部失效。重新检查设定、前文和后续影响，逐章生成 context、修改并登记。不要把旧报告的结论挪到新哈希上。

`status` 同时返回 `stale_units`（正文变化）和 `changed_sources`（已消费资料变化）。规则、被引用的大纲、事实卡等改变或缺失，`check` 会报 `CONTEXT_SOURCE_CHANGED`，续写和导出都会阻断。按最早消费者回退并重新评估；这是保守的文件依赖检查，不是史实或语义裁定。状态文件本身在登记时必然更新，不按旧输入哈希判过期。

`status.draft_inventory.unregistered` 显示未登记正文候选；回退保留的旧稿也可能在其中。`status.next` 给出下一步与命令，不会自动执行。先核对候选用途，避免覆盖或重复登记。

## 导出

```powershell
node bin/ai-writer.mjs export --project "works/示例" --out "exports/示例-v1"
```

导出到全新、位于作品外的目录，包含 `manuscript.md` 和 `manifest.json`。清单包含修订号、正文及其创作来源哈希。只导出顺序登记的草稿；未登记文件不会被偷偷合并。仍需读者视图和文学质量验收，不自动发布。

命令输出与清单同时包含 `included_units`、`excluded_drafts` 和 `warnings`。未登记正文会形成警告但不阻止导出已登记范围；交付前必须核对排除列表，不能把“命令成功”当成“全部正文已导出”。

## 旧稿重定位

导入流程先按 [长篇流程](long-form.md) 建立冻结基线。仅原文件换路径时，先 status 获取作品 revision，再保存映射 JSON：

```json
{"files":[{"unit":1,"path":"D:/新位置/第一章.md"},{"unit":2,"path":"D:/新位置/第二章.md"}]}
```

```powershell
node bin/ai-writer.mjs import-status --project "works/示例"
node bin/ai-writer.mjs import-relink --project "works/示例" --input "路径映射.json" --expected-revision 1
```

示例修订号 1 必须替换成实际值。全部映射先校验再写入；任一内容不同、重复单元或链接文件均拒绝整批修改。新路径的内容须与冻结副本 SHA-256 相同。相对路径按命令 cwd 解释，建议提供绝对路径。

定位历史保存在 `.writer/import-locations.json`；冻结的 import.json、原稿副本、正文和追踪不改。已登记来源仍使用同一内容，旧报告不会因为换路径被冒充为新版。`import-status.can_continue` 表示可继续取下一章，`blockers` 列出阻断；phase=complete 时转为普通创作。

## 去 AI 味扫描与审修

```powershell
node bin/ai-writer.mjs style-scan --project "works/示例" --draft "正文/0001-没寄出的信.md" --out "审查/语言线索-r1.json"
```

扫描只读正文，可接受未登记稿；out 可省略，提供时必须为新的审查 JSON。结果提供原稿哈希、位置和 advisory 候选，不提供 AI 概率与文学通过结论。完整的诊断、修改和复核由 Codex 按 [去 AI 味流程](deslop.md) 执行。

## 原有质量引擎

```powershell
node bin/ai-writer.mjs gate --help
node bin/ai-writer.mjs gate chapter-gate vendor/story-gate-studio/examples/fixtures/chapter-gate-pass.json
```

参数由原 story-gate-studio CLI 解释，路径按当前工作目录。它核验输入卡片与报告，不能把一篇正文自动变成可信评分；小说、短剧模式不能直接覆盖历史散文。

## 错误与恢复

| 情况 | 处理 |
| --- | --- |
| 目标已存在 | 换新目录，不覆盖旧稿 |
| 来源已变化/追踪失效 | 找最早受影响单元，回退并重读重登 |
| 存在写入锁 | 确认没有写入进程；异常中断后由操作者核实再清理锁 |
| 无权限/写入失败 | 原状态保持；先修权限或空间，重试同一输入 |
| JSON 无效、缺字段、路径越界 | 按报错修输入，不使用强制绕过 |
| 研究卡未核验 | 完成核查与记录，不伪改 verified |
| context 过大 | 定点选资料或显式扩容，不能悄悄删关键约束 |

退出码：0 表示该命令成功；1 表示检查存在阻断结果；2 表示输入或运行异常。`--help` 输出可读文本，其余命令输出 JSON。

异常包含 code、error、next_action、help_command；适用时带 file 和 next_command。缺章纲会提示先 plan；JSON 解析错误给文件和解析位置。不要在输入尚未核实时直接执行建议的回退命令。
