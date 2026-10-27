# 从完整修订候选采纳下一章

此入口用于：旧修订区已经完整重登到第六章，范围固定为 1–6；作者明确允许采纳已经封存的第七章，并要求保留原候选、主稿和动笔前来源。不能靠扩大 workflow 授权或覆盖旧工具解决。

本功能仍属于 0.9.0 开发版。只创建新的独立副本；新副本完整承接旧登记链，允许指定的下一章，禁止旧章改写、再下一章及 prepare/commit。不提供发布或切换主稿功能。

## 先核实

保留原作品、候选、会话、封存正文、实读报告、动笔前原始清单和来源的备份及 SHA-256。使用外部固定新工具入口，不更新原作品 `.writer/tool`。原候选须没有来源漂移、未完成重登或待恢复事务，旧主稿和旧构建须仍符合原基线。

派生目标必须是原作品之外的全新目录。下面命令里的路径、令牌、修订号和哈希均须从实时现场取得，不能直接照抄示例。输入文件放在操作记录目录，不能为了构造输入而改旧正文或旧清单。

## 派生输入

`revision continue --project <旧候选绝对路径> --input <派生输入.json>` 接受：

```json
{
  "expected_revision": 432,
  "expected_state_sha256": "原候选.writer/state.json的实际SHA256",
  "expected_session_sha256": "原协调目录session.json的实际SHA256",
  "token": "原会话所有者令牌",
  "target": "D:/独立测试或作品派生目录/第七章续写候选",
  "owner": "本次操作者",
  "unit": 7,
  "author_evidence": {
    "quote": "作者允许采纳第七章的完整原话",
    "local_source": "研究/作者授权.md",
    "source_sha256": "该文件实际SHA256",
    "locator": "真实会话定位",
    "recorded_by": "记录者"
  },
  "draft": ".writer/drafts/封存稿/0007.md",
  "draft_sha256": "封存正文实际SHA256",
  "manifest": {
    "root": "parent",
    "ref": ".writer/drafts/准备记录/动笔前清单.json",
    "sha256": "原始清单实际SHA256",
    "audit_only_refs": [".writer/drafts/封存稿/写前准备.md"]
  }
}
```

`manifest.root` 为 `parent`（旧主稿目录）或 `candidate`（旧候选目录）；清单必须原样包含 `revision` 和 `source_hashes`。清单列出的来源逐一对照旧候选当前字节。仅清单已有的 `.writer/drafts/` 准备材料可显式列入 `audit_only_refs`，作为审计附件保存；正式细纲仍须使用普通公开来源路径。`.git`、`.aws` 等私有目录不能收纳。

成功结果含新 `parent`、`workspace`、独立 `id` 和 `token`。保存结果并保护令牌；后续 `--project` 使用新 workspace。原候选和主稿没有因此合并或升级。目标已存在会拒绝覆盖；失败时保留现场，不把失败目标当可用作品。

## 采纳和登记

1. 在新候选用正常 `plan --input` 建立第七章正式细纲。来源必须对应原清单已保留的公开材料；模型实读确认它与封存稿的对应关系。不要把私有准备附件直接挂为创作来源。
2. 执行 `revision adopt --project <新workspace> --revision-token <新token> --input <采纳输入.json>`。输入只有 `unit`、当前 `expected_revision` 和正常正文目标 `draft`（如 `正文/0007.md`）。命令复制封存稿原字节并返回登记草案，`registered:false`。将标准输出按 UTF-8 保存为新 JSON 文件。
3. 实读封存稿、六章结尾、细纲和有关来源，填写真实 `summary`、增量 `changes`；保存新报告到新候选 `审查/`，添加正常 `draft_review`。保留 `_adoption`，不要换成新 `record-template` 或补造旧模板。
4. `record-preview --input` 通过后再 `record --revision-token ... --input ...`；随后 `check`、跨章连读及必要的正常 `review`。工具核验哈希和登记链，不证明文学通过。
5. 跨进程恢复先 `revision list`，必要时对新 parent 执行 `revision resume` 并提供新 id/token。范围仍是单章；旧六章只读，第八章不写，不执行 prepare/commit。

采纳凭据同时记录旧清单身份和当前正式登记上下文。正式细纲建立于采纳时，不被追认成动笔前已存在。若任何原来源、封存稿、候选 state 或会话发生变化，停止并核查；不要改哈希、旧清单或旧状态绕过保护。

仅有未来规划新增导致旧主稿库存不等时，可按 docs/revision-and-sources.md 的“主稿仅新增未消费规划文件”一节填写 `acknowledged_parent_additions`。必须逐项指定原路径、哈希、原写前清单对应材料路径；不删除文件或更新旧基线。私有审计附件与公开细纲分别保留，不作同字节推定。

若派生继承了未登记的7号正式计划，只有旧六章及原写前清单都未消费时可按正常plan7改写；登记后按实际消费哈希保护。旧包已因这个计划改写拦住 adopt 时，按 docs/revision-and-sources.md 的“已被旧包拦住的派生如何接管”使用 `revision continue-repair` 复制到新候选，原派生和基线不动。不要直接更新活跃旧包或手改保护文件。
