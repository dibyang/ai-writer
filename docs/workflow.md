# 创作工作流与命令

以下命令从 ai-writer 根目录执行。`--project` 指作品目录；JSON 输入文件路径相对于当前命令目录。JSON 中引用的文件路径相对于作品目录，使用正斜杠。路径含空格时加引号。所有文本使用 UTF-8。

作者日常使用先看 [使用手册](user-guide.md)。独立作品将命令前缀换为 `node .writer/tool/bin/ai-writer.mjs`，在含 writer.json 的作品目录可省略 --project。各子命令支持 `--help`，例如 `node bin/ai-writer.mjs record --help`。

**协议选择：** 0.5 新作品默认 schema 4，用 changes 差量登记；schema 2/3 同样用 changes，schema 1 才用完整 snapshot。下方 snapshot 和主稿 rewind 示例是旧协议兼容说明。schema 4 分卷仍需 long-enable；历史修订须独立区和事务提交。新作品初始仅允许讨论/规划，正文须有限授权。版本/影响/修订的输入及恢复说明见 [专项手册](revision-and-sources.md)。

## 初始化

```powershell
node bin/ai-writer.mjs init --path "works/示例" --kind novel --title "示例"
```

目标必须不存在。初始化写入技能、工具和待完善的创作说明，不生成假正文。Codex 下一步按作者要求完善定位、文风和大纲。

## 创作治理：阶段、范围与作者决策（最小首批 A）

```powershell
node bin/ai-writer.mjs workflow show --project "works/示例"
node bin/ai-writer.mjs context --project "works/示例" --purpose discussion
node bin/ai-writer.mjs decision current --project "works/示例"
```

discussion 不要求下一章细纲，返回当前任务、允许范围、已选和未决项及漂移诊断，不作为有效写作 context。draft 默认需 --unit；revision 需在授权 rewind 后按顺序恢复。工具只能约束正式命令，代理也应在聊天/文件动笔前遵守作者范围。

workflow set 输入由 Codex 根据真实任务准备，字段如下；示例中的 quote/source_sha256/expected_revision 必须换成实际来源与状态，不复制假哈希：

```json
{
  "expected_revision": 0,
  "operation_id": "trial-1-author-instruction",
  "author_evidence": {
    "quote": "先试写第1章，完成后暂停复盘",
    "local_source": "研究/作者要求.md",
    "source_sha256": "该来源文件的实际SHA256",
    "locator": "实际任务记录中的位置；拿不到会话ID时不伪造",
    "recorded_by": "执行本次任务的代理或操作者"
  },
  "workflow": {
    "stage": "trial",
    "task": "试写第1章，完成后暂停复盘",
    "authorization": {
      "allowed_actions": ["discuss", "plan", "draft"],
      "draft_range": {"from": 1, "to": 1},
      "revise_range": null,
      "stop_conditions": ["第1章完成后暂停并复盘"]
    },
    "planning": {
      "positioning": {"status": "draft", "refs": ["设定/作品定位.md"], "unresolved_ids": []},
      "structure": {"status": "deferred", "refs": [], "unresolved_ids": ["远期结构"], "reason": "作者允许有限试写后复盘"},
      "volume": {"status": "missing", "refs": [], "unresolved_ids": []},
      "outline": {"status": "draft", "refs": [], "unresolved_ids": []}
    }
  }
}
```

`workflow set --input 文件` 用 CAS 推进 revision；相同 operation_id/相同输入重试幂等，不同输入复用 ID 拒绝。stage 为 direction/structure/volume/outline/trial/drafting/revision/paused；规划/paused 不允许新正文，但可有明确 revise_range。draft/revise 动作必须分别有非空有限闭区间；空范围不是无限授权。stop_conditions 是待代理落实的文字条件，程序只自动检查动作与单元范围，不理解任意自然语言触发器。

operation_id、decision.id 及 supersedes 引用为 1–100 位字母数字/下划线/连字符，首位为字母或数字；禁止使用 __proto__、constructor、prototype 保留键。非法 ID 在写入前拒绝，不会保存不可恢复的索引。

暂停正文时 stage=structure、allowed_actions=[discuss,plan]，两个范围为 null，并填写实际任务。status.next_unit 保留登记序号，next.action 改指当前任务；context、record-template、record 同步拒绝越权，不能单改 next 的显示。

决策用 `decision set --input 文件`，复用上方 expected_revision/operation_id/author_evidence，另传 decision 对象：

```json
{
  "id": "D_SECT",
  "topic": "宗门方向",
  "status": "confirmed",
  "options": ["青岚宗方向", "另一候选方向"],
  "adopted_items": ["青岚宗方向"],
  "excluded_items": [],
  "unresolved_items": ["经名", "住舍人数", "作息数字"],
  "effective_range": {"from": 1, "to": null}
}
```

status 为 candidate/confirmed/withdrawn；confirmed 必须逐项列 adopted_items，其他状态不能带当前采纳项。首件法器仍未选时另建 candidate，adopted_items=[]，在 unresolved_items 写“小盾仅推荐”。current 按 --unit（默认 next_unit）列已选和候选，list 保留历史；不生成会被误当权威的 Markdown 当前设定文件。

确认项变化需新 ID+supersedes，指向同主题、同生效范围当前确认项；不支持循环、悬空或双重重叠确认。本批不支持跨范围设定发布/影响分析。决定是作者计划，不代表该事实已发生；不得直接改 ledger。

作者证据要求 quote 在真实 local_source 中，且来源字节哈希匹配。工具保存不可变事件和冻结原话对象，原记录可以继续追加，冻结对象若改变则拒绝。这里只证明记录字节，没有自动认证作者身份或判断自然语言采纳范围。

## 旧协议预览与显式迁移

`governance preview --project 目录` 只读；`governance migrate --input 迁移.json` 的输入只有 expected_revision、operation_id、author_evidence 三项。迁移先校验来源和原事实链，保存 pre-governance 备份，最后一次替换 state；schema 1 转为差量、schema 2 保留已有差量链，均升为 3，默认仅讨论/规划。正文、原消费哈希和事实终态保持不变；不自动更新随附工具，旧工具会拒绝新 state。真实旧作不得未经授权迁移。

## 只读构建识别和比较

```powershell
node bin/ai-writer.mjs tool identify
node bin/ai-writer.mjs tool compare --project "作品目录" --other "主项目目录"
```

identify 返回 observed_content_id、runtime_id、版本、profile、文件哈希、清单差异和可知来源。副本初始化时保存 build-manifest.json；时间戳不参与内容 ID。compare 不改任一目录，正确报告同版本不同内容，分别列 runtime/content/skills。main/workspace-copy 的引擎省略属于已知 profile 边界。缺清单旧副本标 legacy-unattested，不虚构历史 commit；主项目报 observed-source-tree。观测指纹不等于数字签名，也不承诺旧在途进程已加载磁盘上的新模块。本批没有 tool update 或恢复命令。

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

回退保存旧状态至 `.writer/rewind-*.json`，正文不动；从该单元起的追踪失效。schema 4 必须先 revision begin，再把 --project 指向返回的 workspace、带 --revision-token 运行上述命令；不能在主稿直接 rewind。逐章实读重登，完整尾段复核后回主项目 prepare/commit。新版本依赖也会使旧报告待复核，不只比较正文哈希。

`status` 同时返回 `stale_units`（正文变化）和 `changed_sources`（已消费资料变化）。规则、被引用的大纲、事实卡等改变或缺失，`check` 会报 `CONTEXT_SOURCE_CHANGED`，续写和导出都会阻断。按最早消费者回退并重新评估；这是保守的文件依赖检查，不是史实或语义裁定。状态文件本身在登记时必然更新，不按旧输入哈希判过期。

`context`、`export` 的漂移异常为 `CONTEXT_CHANGED`，包含 `recovery.from`、`recovery.expected_revision`、`recovery.stale_units`、`recovery.changed_sources` 及可核对的 `next_command`。正文与来源一起改变时，最早点按两者共同影响计算。先保存修前稿、核对完整列表，再按建议或实际确认的更早范围正式回退，逐章取得新模板重登；只修追踪语义而文件字节未漂移时也应主动核定首次错误点。

`status.draft_inventory.unregistered` 显示未登记正文候选；回退保留的旧稿也可能在其中。`status.next` 给出下一步与命令，不会自动执行。先核对候选用途，避免覆盖或重复登记。

审查报告用 `review --input` 登记。`from`—`to` 必须是实际完整读过的范围，`source_hashes` 列齐这些正文的真实路径和当前SHA；报告放作品的 `审查/`。先完整构造映射、核对键集合及单元数，再一次提交，不在循环内提前交一部分。正文修订或输出截断需补读；哈希与覆盖只核版本，人物知识或账本改动后还需核对报告结论是否仍适用。

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
| 来源已变化/追踪失效 | 核对正文与来源共同影响及 recovery 最早单元、修订号，备份后回退并逐章重读重登 |
| 审查正文哈希不符 | 核对完整实读范围的全部路径/当前哈希，改动稿补读后一次提交完整覆盖 |
| 存在写入锁 | 确认没有写入进程；异常中断后由操作者核实再清理锁 |
| 无权限/写入失败 | 原状态保持；先修权限或空间，重试同一输入 |
| JSON 无效、缺字段、路径越界 | 按报错修输入，不使用强制绕过 |
| 研究卡未核验 | 完成核查与记录，不伪改 verified |
| context 过大 | 定点选资料或显式扩容，不能悄悄删关键约束 |

退出码：0 表示该命令成功；1 表示检查存在阻断结果；2 表示输入或运行异常。`--help` 输出可读文本，其余命令输出 JSON。

异常包含 code、error、next_action、help_command；适用时带 file、next_command 和 recovery。缺章纲会提示先 plan；JSON 解析错误给文件和解析位置。不要在输入尚未核实时直接执行建议的回退命令。包装脚本先保存真实退出码、stdout和stderr，再按实际回包解析；帮助文本和外层辅助结果不能当成CLI成功JSON。
