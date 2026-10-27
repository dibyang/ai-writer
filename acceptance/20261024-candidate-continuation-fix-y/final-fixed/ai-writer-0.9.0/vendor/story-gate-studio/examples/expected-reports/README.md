# expected-reports

未来放置 fixture 对应的期望报告快照。

快照只保存关键结论、门禁编号、错误码和简短摘要，不保存用户正文长段复制。

Blind-read expected reports must preserve the exact `rule_id` order emitted by `scripts/blind-read-gate.js`, because QG-004 compares generated reports against these snapshots.
