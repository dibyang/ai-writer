# 已登记第七章受保护小修：接管说明

本轮只交付工具与独立场景验证。没有修改、重登或发布真实小说，没有读取真实所有者令牌或带令牌操作输入。本作接管仍由拥有者会话执行。仅在本目录 README 标明最终验收通过后使用本说明。

固定外部入口：`D:/work/other/ai-writer/acceptance/20261024-registered-seven-revision-ab/extracted-verified/ai-writer-0.9.0/bin/ai-writer.mjs`。ZIP：`verified-fixed/ai-writer-0.9.0.zip`，SHA256 `6b1e8523ee26fe3a347e21b5bf41dfbc5a2c0c535c8bee44bbef63e327696d1a`，content_id `52156ccdc8d1fc7a728215ced690e6c1e58d1653cda828fcc8313e0e6df7e47c`。旧 `final-fixed`/`extracted-final` 是文档链接检查失败前的尝试，不能用作接管入口。

这是从已封存 AA 工具出发的窄范围增量：runtime 仅 governance/help/review-workflow/revisions/workspace 五个模块变化，另加定向测试、白名单和说明。完整差异与源码/包哈希见 `boundaries-verification.json`。没有要求真实作品全面更新、迁移或替换根技能。以固定外部入口建立新限章区，其余源目录保持不动。

## 由作品会话实时核对

交接时预期来源协调目录 `D:/work/小说/dzkxqxx-ch7-takeover-aa-20261024`，来源续写 ID `ed1ae5a2-f0a6-4998-87fd-31bff565a5b5`，workspace 位于其 `.writer/revisions/<id>/workspace`。交接预期为 r436、完整登记七章，旧第七章 SHA `06e36d13a9bfa54504f41b9d4a554eb826e2b575fbc25be0fbc5e94e887d2858`。这些是先前交接预期，不代替接管当刻的实时核查。

已授权修订稿位于原作品 `.writer/drafts/ch7-small-revision-20261024/pending/0007-下一回.md`，预期 SHA `47a2e069f2dfb4b90e400bbc831b367a11ee30108c7887681fa69d6f9db15640`。只允许两处既定小修：比较句明确昨夜；删除重复手续总结。摘要和事实是否不变仍须实读核查，不能自动宣布等价。不改前六章、不写八、不切换主稿、不提交推送。

## 执行顺序

1. 保存原状态、会话、基线、正文、来源及工具哈希备份。当前来源须 clean，七章完整，原 AA 绑定完整。若 r436/旧稿/基线已经变化，停止核对变化，不刷新旧期望值掩盖漂移。令牌仅由作品所有者会话安全使用，不发给工具维护会话。
2. 由拥有者准备 continue-revise 输入：源会话 token，实时 expected_revision/state/session/base SHA，replacement_sha256 为上面47a…，全新目标（例如 `D:/work/小说/dzkxqxx-ch7-small-revision-ab-20261024`，须在全部原目录之外）、owner、reason。author_evidence 使用本次真实授权，evidence_root 为 `D:/work/小说/dzkxqxx`，local_source 为 `.writer/drafts/ch7-small-revision-20261024/作者授权-已登记第七章受保护修订入口.md`，quote/source_sha256/locator/recorded_by 均按真实来源填写。不要沿用旧采纳授权冒充本次修订授权。
3. 固定入口执行 `revision continue-revise --project <源workspace> --input <安全保存的新输入>`。只使用成功返回的新 parent/workspace/id/token。目标存在或任一 CAS 失败时保留现场，不覆盖、不改旧基线。
4. 在新 workspace 实读当前六七章、旧报告和本次准备稿。若原报告只有文本、没有结构化意见 ID，先登记真实旧版本 review/两条意见；已有 ID 则核对实际内容。旧稿仍登记时 resolve 为 adopted，decision_actor 为 agent-within-authorized-scope，绑定新授权事件，不伪称作者逐条点击采用。可选尾句润色仍是 suggestion。
5. 新 workspace 带新 token rewind7；取 context7 并保存本次写前来源，然后复制已经批准的小修稿到原第七章登记路径。这里的准备清单不是正式写前模板；不得重取模板追认旧动笔时间。
6. replay-input7 带新 token，核对来源与刚才 context 一致。实读新稿、旧事实及相关原文；逐项审查 summary/characters/timeline/ledger/evidence/downstream 后填 replay_review，保存真实报告并填 draft_review。preview 与 record 都带新 token。仅本次封存SHA和原路径可登记。
7. 登记后完整读当前六七章，生成当前新版本报告并 review，保存返回 review_ref。local-proof 输入：当前 expected_revision、state SHA、operation_id、当前 review_ref。对实际已采用的两条意见 apply 使用返回 local_revision_id，不传 commit_id；再 verify 引用当前 review_ref。旧06e…报告不能支持47a…修订稿。
8. 新进程 revision resume 后 status/check/doctor，核对两条意见状态、当前登记、新旧稿归档和源候选未变。保留所有输入/输出/失败/哈希/报告，交回作品会话。local-proof publication:false；没有主稿发布、作者定稿或第八章授权。

详细字段见固定包 `docs/candidate-continuation.md` 的“已登记第七章的小修与重登”。独立实跑脚本 `run-revision.mjs` 仅用于合成样本，不得直接套到真实小说，脚本内的测试授权与令牌均不是本作授权。
