# 非产品审计失败留存

首次node ../d-audit.mjs退出1；session-d-audit.json为当时实际只读核验结果，未覆盖。脚本要求session.status字面open，实际editing；revisions.mjs第72—84行证实可编辑候选写操作正常设置editing。正文/差量/哈希检查都成立。修正本轮证据脚本枚举断言后，第二次退出0并另存session-d-audit-v2.json，不改产品/状态/旧审计。

已绑定连读报告末句“保持open”不准确，应读为“保持未提交的可编辑会话，实际status=editing”。原报告及其冻结哈希保留，本说明与session-d-report.md更正该表述，不重写已绑定报告或冒称旧报告已无误。
