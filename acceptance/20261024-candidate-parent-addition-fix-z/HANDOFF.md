# 未消费规划新增：第七章采纳接入补充

状态：最终独立验收通过，verification-final.json 已生成。最终解压包207项测试：205通过、2项Windows链接权限相关跳过、0失败；源码及解压包doctor通过，60条兼容CLI及实际连读后的review/scan/check通过。真实小说目录未由本会话修改，真实接入仍由原小说会话接管。

## 新固定制品

- 路径：`fixed/ai-writer-0.9.0.zip`
- ZIP SHA-256：`906089466a90e05e62a24af7d268d1547674dc1591731fe63c056a8a4f7abe41`
- content ID：`54b1f781002479dc43bb491a2778eb1bd230bc3ac7b8e0e64b0dd2a44e07a509`
- 外部解压入口：`D:/work/other/ai-writer/acceptance/20261024-candidate-parent-addition-fix-z/extracted/ai-writer-0.9.0/bin/ai-writer.mjs`
- 仍为 0.9.0 开发版，未提交、推送或发布。Y 原包和证据原字节保留；本真实新增规划场景使用新 Z 包，不覆盖任何原作品随附工具。

## 对原 continue 输入的唯一补充

原小说会话在本地另存新输入，实时重核 candidate revision/state SHA、session SHA、令牌、来源、正文及目标不存在。不要将含令牌的原 continue.input.json 输出或转发，也不改变其中原始 manifest/draft/evidence。

新增字段：

```json
"acknowledged_parent_additions": [
  {
    "ref": "大纲/新版第七章细纲候选-下一回-2026-10-24.md",
    "sha256": "7488aa191637fda5fc398f55f1b0f92b467b49b6407632814b6c07ea6fe05f40",
    "manifest_ref": ".writer/drafts/rootless-ch7-pending-20261024/第七章细纲依据.md"
  }
]
```

这两份材料实际同字节，原 manifest 已列出该私有准备附件；原 input.manifest.audit_only_refs 也须保持显式列明。公开 `大纲/新版第七章细纲-下一回-2026-10-24.md` 的哈希是 71e51772...，与主稿新增规划不同，不能用它替代上面的对应关系或声称二者等价。

此字段只是本次操作对具体库存新增的审计承认，不认证作者身份、不刷新旧基线。旧主稿1995个基线文件和 state 必须全部保持原哈希；任何额外新增、修改、删除、消费者变化、构建变化和并发差异继续拒绝。最多16项、仅大纲直属新增 Markdown；不能填目录、通配符或旧文件。

## 重试及后续

1. 核对新 ZIP 与发行清单，确认备份及实时现场。用新外部入口执行 `revision continue --project <原候选> --input <新输入>`。原候选预计仍 r432/六章，但必须实时核实。若失败，停止，不改 scope/state/哈希或删除规划文件绕过检查。
2. 目标仍须是原作品之外的全新协调目录。原失败发生在创建目标之前；先核实目标确实不存在，再决定是否沿用，存在则保留现场并另选新目录，不覆盖。
3. 保存新 parent/workspace/id/token，仅在新 workspace 建公开第七章 plan、revision adopt 采纳封存稿、实读填写真实 summary/changes 和 draft_review，先 record-preview 再带新令牌 record。来源继续使用原清单公开材料；私有附件仅作审计，不自动加入创作来源树。
4. 登记后执行 check、普通 review 和必要 style-scan 报告保存。跨进程对新 parent 用新 id/token resume。第八章、旧章改写、rewind/replay、prepare/commit 仍拒绝；不切主稿。

新候选保存新增原字节、原基线身份、逐项对应及完整接受库存；采纳凭据绑定此审计。原新增文件留在主稿原路径，原基线、会话、候选和封存稿不变。普通旧修订 prepare/commit 的库存规则没有放宽；本入口不为它解除阻断。
