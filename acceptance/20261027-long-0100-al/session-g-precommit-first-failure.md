# G 独立审计第一次失败（保留）

执行：`node ../g-precommit.mjs`，产品之外的新增证据脚本，exit 1。

失败在完成同输入、journal、报告/rolling绑定、主稿基线和旧意见核验之后，额外检查全历史snapshot evidence时，直接按历史e.draft物理寻址：

```text
Error: ENOENT: no such file or directory, open 'D:\work\other\ai-writer\acceptance\20261027-long-0100-al\work\.writer\revisions\dd6f0f3b-1f02-4db2-be4e-34fe7fe658c7\workspace\正文\0001-六天的空位.md'
    at Object.openSync (node:fs:561:18)
    at Object.readFileSync (node:fs:445:35)
    at digest (g-precommit.mjs:2:218)
    at g-precommit.mjs:15:122
code: ENOENT, errno: -4058, syscall: open
```

以上为错误要点转录，完整原始工具结果在本会话工具记录，未声称此摘录是完整双流。g-precommit.mjs原脚本原样保留，不改成成功版本。此时118 record和rolling review已成功，prepare和commit均未执行，主稿仍473。

立即停止产品写入，后续先只读诊断产品relocation.resolve的历史路径映射与当前正文/引文/哈希；任何真实不符继续停止。该脚本失败不能冒充产品失败，亦不直接当成无害误报。
