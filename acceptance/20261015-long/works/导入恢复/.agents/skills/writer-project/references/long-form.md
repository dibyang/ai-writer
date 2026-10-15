# 长篇分卷、追踪与旧作恢复

长篇或跨卷续写时读本文件。`tool` 指 `node .writer/tool/bin/ai-writer.mjs`（主仓库为 `node bin/ai-writer.mjs`）；下列参数都补 `--project 作品目录`。

## 规划和启用

先读定位、文风、权威规则和全书大纲。按阶段讨论、卷纲、章纲、正文、修订，只完成作者要求的阶段；已有连续创作授权时不中途逐章索要确认。当前请求优先于本书风格，本书风格优先于通用技法。风格不能改变事实和人物信息边界，不因缺对标阻断原创。

1. `status` 取 revision；`long-enable --expected-revision N` 备份并启用 schema 2。不手改 state；旧 schema 1 仍可原样使用。长篇status默认只给进度和最近摘要，不载入全量追踪；明确排障才用 `status --view full`，正常续写取context/recall。
2. 保存分卷 JSON，用 `volume --input 文件`。范围用全书连续单元号；卷之间不重叠，每卷 arcs 连续覆盖卷范围。未来卷可粗排，近期细化。分卷契约是计划，不建立已经发生的追踪。

```json
{
  "id": "V1", "title": "失物", "start": 1, "end": 6,
  "promises": ["查明错领的包裹去了哪里"],
  "constraints": ["证据解释不超过观察本身"],
  "reserved": ["终局寄件人身份"],
  "arcs": [
    {"id": "A1", "start": 1, "end": 3, "goal": "找到签收记录", "payoff": "排除一位嫌疑人", "forbidden": ["提前公开寄件人"]},
    {"id": "A2", "start": 4, "end": 6, "goal": "重建交接链", "payoff": "找回包裹", "forbidden": ["无证定罪"]}
  ]
}
```

3. 章纲沿用 `plan`，增加 `arc_id`（可选）和 `recall_ids`（可选稳定线索 ID）。`outline --unit N` 查看本章卷契约与剧情单元；`context --unit N` 自动携带切片。只需要改未来单元时，不改已消费的整份卷纲；确需改动先核实最早受影响单元并 rewind。

## 写作和登记

`context` 包含在场人物状态、作者事实、读者已知、各人物已知，三者分开读。显式 ID、置顶、到期未结信息全部携带；按人物关联和最近三章补充最多12条，列出 omitted_ids。证据带首条与最近两条锚点，省略数量另列，完整历史可 recall 回查。遗漏表是回查入口，不代表这些线索可以丢弃；设计回收旧线索时先 `recall --query 关键词`，再把 ID 加入章纲，完整重读 evidence 指向的相关正文。工具不能自动发现所有语义相关材料。

预算不足会报错，不会默默删必需信息。用更精确的章纲引用、简洁状态或显式增加 `--max-chars` 处理；不要通过删掉待核事实来压缩。

动笔前获取 `record-template` 保存到 `.writer/` 的本章输入文件。长篇模板用 `changes`，未变项自动保留，无需抄写整个快照：

```json
{
  "characters": {"阿禾": "值班室；怀疑签收时间；不知道寄件人"},
  "timeline_append": ["第一夜：发现封口破损并交老陈保管"],
  "ledger": {
    "O001": {
      "type": "observation", "statement": "封口有一道裂口", "status": "pending",
      "cast": ["阿禾"], "tags": ["信封"], "due_unit": 5,
      "reader_known": "看见裂口，成因未明",
      "character_known": {"阿禾": "看到裂口，不知道成因"},
      "evidence": [{"unit": 1, "quote": "封口有一道裂口。"}]
    },
    "P001": {
      "type": "object", "statement": "破损信封", "status": "active", "cast": ["阿禾", "老陈"],
      "custody": {"holder": "老陈", "location": "值班室铁柜", "condition": "破损，未拆内封"},
      "evidence": [{"unit": 1, "quote": "老陈把信封锁进铁柜。"}]
    }
  }
}
```

这是模板中 `changes` 的内容，不替换外层 unit/revision/source_hashes/draft/summary。引文必须在真实正文出现，证据至少一条指向本章。工具自动记录正文哈希和行号；它只证明引文存在，不能证明推论成立。

ledger 类型：fact / thread / object / relationship / observation；状态：active / pending / partial / resolved / intentional-open。未明确的状态可写 pending，说明已知边界、下一步与回查时机，不能为“全部完成”强行结案。到期但未收的条目继续召回，不会自动标 resolved。observation 已记录的 statement/author_truth 不可逆改，新解释另建条目并关联旧 ID。作者尚未确认的秘密不要编入 author_truth。

更新 ledger 只交变化字段及本章 evidence，旧证据和其他人物所知自动保留；`character_known` 的文字应写截至当前的完整信息。物证换手时交新的完整 custody，加 `previous_holder` 与旧保管人一致，并核对正文动作和位置。退场角色可用 `retire_characters` 从热状态移除，旧章与证据保留；角色仍有关联未收线索时须安排回查。

交接示例（放在 `changes.ledger` 下，previous_holder 与 custody 同级）：

```json
{"P001":{"previous_holder":"老陈","custody":{"holder":"阿禾","location":"值班室桌边","condition":"破损，未拆内封"},"evidence":[{"unit":2,"quote":"老陈把信封交还阿禾。"}]}}
```

普通 `threads` 是兼容短列表，长篇多线索优先 ledger。`threads` 若提交表示整份替换；`timeline_append` 只追加已发生事件。不要在长篇登记中改用全 snapshot 丢掉 ledger。

## 滚动连读

每三章检查当前三章与前三章（开篇不足六章就读已有部分），核对事件先后、人物知识、物证交接、情绪承接、重复解释和未兑承诺。可以合并成更大的实际连读区间，不强制每段打分。

审查报告保存后用 `review --input 文件` 登记覆盖：

```json
{"from":1,"to":3,"kind":"model-self-review","report":"审查/1-3连读.md","source_hashes":{"正文/0001.md":"真实SHA256","正文/0002.md":"真实SHA256","正文/0003.md":"真实SHA256"}}
```

先读正文再填真实哈希；CLI 不会替你审稿。`check.rolling_review` 给欠审窗口和过期报告数量。旧报告随正文或报告文件变动失效；仅审查不动正文，已授权修订可直接修高置信问题，并按 rewind 重登。

## 自有旧稿导入

另建空作品、启用 long，再 `import-index --input 文件`：输入 `{"rights":"作者自有作品，用于续写","files":["D:/原书/第一章.md","D:/原书/第二章.md"]}`，顺序由作者原目录核对后明确列出。不改源文件；合订本先按实际章节结构拆分到新目录，保留原文和位置映射，不猜重复章号。

`import-status` 显示冻结副本、原文件漂移、已登记和未登记范围。`import-next` 复制下一章（重复执行同章内容一致则复用），实际完整读该章，反推已发生的事件与信息边界，保存章纲，取 context/template，再登记真实 summary/changes。未登记前下一次仍返回这一章。把读取覆盖和不确定项记入研究/审查文件，导入范围超过当前能读的范围时如实停在断点，不宣称全文深读完成。

导入旧稿是本书续写基线，不放进对标库，不套成别书素材。完整导入后才正常续写下一章；若需要修订，先冻结基线登记，再用 rewind 流程修订，原稿副本继续保留。
