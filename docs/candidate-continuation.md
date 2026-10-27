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

## 已登记第七章的小修与重登

`revision continue-revise` 处理已经登记第七章的续写候选。当前实现只覆盖这一明确边界，不是任意章数的嵌套修订。作者须授权本次小修，并有确定的修订稿 SHA256。命令在全部旧作品和候选之外建立新协调目录，绑定当前外部工具；旧七章、原基线、原工具和原状态均保留。读稿可覆盖前六章，正文修改与意见处置只允许第七章；不写第八章，不执行主稿 prepare/commit。

输入字段为 `token`（源续写会话令牌）、`expected_revision`、`expected_state_sha256`、`expected_session_sha256`、`expected_base_sha256`、`replacement_sha256`、`target`、`owner`、`reason`、`author_evidence`。哈希均来自源候选实时字节；`replacement_sha256` 是本次授权修订稿的哈希，须与旧稿不同。`author_evidence` 沿用上文五个字段；若授权文件位于原作品而非源候选，可另传绝对 `evidence_root`，`local_source` 相对此目录。工具复制并冻结授权原字节，不向证据来源写文件。输入 JSON、返回令牌都应保存在受保护操作记录中，不能上传或混入公开报告。

1. 新目录建立后保存返回的 `parent/workspace/id/token/authorization_ref`。这是一条新修订链，不继续使用旧 id/token。失败时可能保留 `.ai-writer-limited-*` 暂存目录；仅成功返回的目标可继续，不删除现场、不刷新旧基线。
2. 在旧稿仍登记时，先用已有的真实旧版本意见 ID 登记采用，标明 `agent-within-authorized-scope` 并绑定当前授权；没有结构化意见时，先实读旧稿，登记绑定旧稿哈希的 review 和本次真实意见。可选润色仍为 suggestion，作者授权范围不等于作者逐条采纳。
3. 在新 workspace 带新 `--revision-token` 执行 `rewind --from 7 --expected-revision ...`，读 `context --unit 7` 并保存本次写前来源，再把封存修订稿原字节放回原第七章路径。此前的小修准备清单只是准备记录，不能追认为本次正式模板。
4. 用 `revision replay-input --unit 7 --revision-token ...` 生成待核草案，核对来源与写前 context 一致。逐项实读并确认 `summary/characters/timeline/ledger/evidence/downstream`；确实未变才保留自动带出的摘要和事实。保存六项复核报告，填写 `replay_review`，同时填写绑定新稿及报告哈希的 `draft_review`。保留 `_replay`。本次工具不自动推断语义等价。
5. `record-preview` 和 `record` 都带新 `--revision-token`。新稿须匹配封存 SHA、原登记路径及限章范围；旧六章和来源仍受哈希保护。登记后完整实读当前新稿与相关旧章，再正式 `review` 登记当前版本报告。
6. 执行 `revision local-proof --project <新workspace> --revision-token <新token> --input <凭据输入.json>`。输入为当前 `expected_revision`、`.writer/state.json` 的 `expected_state_sha256`、唯一 `operation_id`、上一步返回的 `review_ref`。凭据冻结旧稿、新稿、当前报告及登记版本，不产生主稿提交。
7. 对已采用意见执行 `review-issues apply`，使用 `local_revision_id`（凭据返回的 id）、`expected_revision`、`operation_id`、意见 `id` 和 `reason`，不传 `commit_id`。再用当前新稿 `review_ref`、`reviewer`、`conclusion: resolved|not-resolved`、`reason` 及正常 CAS 字段执行 `verify`。旧报告不能证明新稿已修；归档损坏不能继续显示有效核验。
8. 新进程执行 `revision resume`、`status`、`check`、`doctor`，复核原七章候选、旧六章及来源未变。`verified` 在这里仅表示本次候选意见已核查，凭据明确 `publication:false`；它不是主稿发布、作者定稿或文学验收。
