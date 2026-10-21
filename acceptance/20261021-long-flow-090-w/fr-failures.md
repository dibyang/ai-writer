# FR 实际失败、纠正与边界

本文件仅记本次同ID恢复FR。第一F的f-failures.md、旧报告和日志不改。

1. 辅助fr-setup.mjs初次执行退出1：`TypeError: s.snapshot.ledger?.filter is not a function`。实际ledger按ID存对象。失败前已保存r105原state、完整units/snapshot/review_workflow和24正文；没有运行workflow或改正文。按Object.values修正读取，先逐字节核现有部分备份与r105完全一致再继续，没有删除重建或伪造早先结果。错误返回保留在本会话exec记录。
2. 产品fr-tail-review：实际子码2、`REVIEW_EVIDENCE_REQUIRED`，第二比较组列21/22/23/24而漏23引文。主区与候选state均未因此变化，停止prepare依赖；fr-help-review-after-reject读实际help，原输入保留，v2补23当前原句“布已干，洗后边角有些歪”，fr-tail-review-v2正式成功。不是正文问题或工具缺陷。
3. 产品fr-issue-apply：实际子码2、`REVISION_PUBLICATION_UNKNOWN`。我误将已completed事务ID8b607cc7-4878-4cc2-a86a-ac728ee71904填到commit_id；状态未变，停止verify依赖。读fr-help-issues-apply-reject后核主state.committed_revisions实际对象，取得commit_id2391c67a-1aac-4232-8351-c35e357de154（其中session/base/branch/build为本会话真实记录），原输入保留，fr-issue-apply-v2用真实commit对象成功，change_scope仍draft，不改tracking绕门。
4. 辅助fr-final-audit.mjs初次退出1：采用记录实际为issue.resolution，脚本误读issue.disposition.decision_actor。产品最终status/check/doctor/list/identify已成功且state未变。保留fr-final-audit-before-field-fix.mjs，读实际意见对象后只改辅助核验字段名，重新全部审计成功，未改变CLI结果或业务state。
5. fr-negative-context-25和fr-negative-template-25是预期保护：实际子码2、ACTION_OUT_OF_SCOPE，均无--out，前后state同82091ca396f49afbf5b48a261e890fbb404d770e5216149d871f3c249188e276，25纲和正文均不存在。不要将这两次记作工具故障。

本FR共54次产品调用，统一经w-writer唯一fr-标签；每个cli-logs/fr-*目录保存argv、实际输入原字节、stdout.raw.txt/stderr.raw.txt、真实子码、前后state。wrapper对失败的自身退出为1时，实际产品子码仍以result.json的2为准，不把两者混写。所有写及--out串行；任何意外门禁拒绝后先读help/纠正，再恢复依赖步骤。

本次无网络调用、无网络中断或事务中断，不编造recover。新的独立修订正式prepare/commit一次完成，5会话均committed、8事务均completed；未resume旧D token、未删旧stale/旧稿或事务，未手改state/hash。辅助哈希/组合审计只在原生全文实读之后验证字节，不能充当阅读证据。
