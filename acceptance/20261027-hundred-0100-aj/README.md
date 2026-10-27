# 0.10.0 百章迁移、更新与跨会话修订验证（AJ）

本轮以先前 H 轮的 112 章、16 卷合成作品为基线，先逐文件校验并复制到本目录，再只操作此独立副本。没有在本轮新增章节：本轮扩大到百章规模指用已有 112 章作品进行新版工具、迁移和修订验证，不是重新生成或通读 112 章。真实作品未操作；没有 Git 提交、推送或发布。`next_unit=113` 只是状态提示，不代表正文授权。

## 关键证据

- `bootstrap-verification.json`：原封存内 15,122 个作品文件按哈希核对后复制；这一步是创建合成测试副本，不是工具更新时复制正文。
- `commands/update-*`、`update-verification.json`：旧工具从 generation 9 升至 10；112 章与登记快照保持不变，更新验证区无正文文件。
- `migration-fault.mjs`、`commands/migration-*`：112 章分卷迁移进行到 56 章时注入进程中断；确认 recovery-only 后从原事务恢复，完成 112 章。`migration-verification.json` 再核对路径、正文、状态快照及后续固定版更新。
- `budget-fix-delivery.md`、`commands/budget-*`、`budget-live-verification.json`：发现长作品更新内部讨论上下文默认预算不足；修复为带上限的内部检查并纳入计划哈希，超出上限明确拒绝、不截断。实际 CLI 测试覆盖 0.9 到修复版、prepared 故障及原事务恢复、超限拒绝和状态/正文不变。此处引用的其他会话的真实作品报错仅作为问题线索，本轮未操作该作品。
- 最终候选包 `dist/0.10.0-budget-aj1/ai-writer-0.10.0.zip` SHA-256 `3ab39a3a4de3775c8f5ae95f9ec591ca0247e681fd363204b6b57ff7d8fca3fe`，content ID `32892e88325e6b2b67b712bd9623f352c603ee8c29b948911d3a21c272606f9b`。来源含未提交修改，不能称为正式发布包。解压包 npm test 255 项、254 通过、1 项因 Windows 符号链接权限跳过；doctor 通过。`budget-package-verification.json` 校验包与清单。
- `session-a-report.md`、`session-a-reading-verification.json`：独立 Codex 会话实读 81、84、89、95、104—112，全文暴露与当时正文逐行核对。逐行暴露不等于文学质量验收。
- `session-b3-report.md`、`session-c-report.md`、`session-d-report.md`：不同的独立 Codex 会话三次恢复同一修订 ID `5ec86233-b90a-4dca-aca0-b4268ab2547b`，base revision 459；回退 108，顺序重登 108—112，实读并复核 103—112 与相关早章。108 和 110 的各一处措辞变化只为检验修订与连续性，不代表发现客观错误、品质提升或作者定稿。候选预检通过后产品修订应用到合成主稿 revision 460；这不是 Git 提交。
- `b3-final-verification.json`、`c-final-verification.json`、`d-final-verification.json`：各检查点及原始产品退出码。103—112 滚动审查绑定重登后版本；两个旧审查窗口及 5 项旧意见仍需重核，不冒称全书审查完成。
- `final-independent-audit.json`：112 章均有卷目录，只有 108、110 与原基线不同，110 章正文哈希不变；人物、线索和时间线快照相同，账本差异仅为受影响证据路径及哈希重绑定，1,235 条登记引文能在当前正文找到。这是机械比较，不代替语义判断。
- `commands/final-export/`、`export-verification.json`：112 章导出与当前正文按产品规则拼接的字节完全一致，仍标记 draft-export、quality_review required。
- `prior-seals-verification.json`：H 封存 20,138 个文件和 AI 封存 16,220 个文件逐个哈希一致。

## 失败与边界

`codex-probe*` 保留旧 CLI、沙箱网络和配置探测失败；`session-b` 首次参数不兼容；`session-b-v2` 在 Windows 嵌套沙箱初始化前失败，未修改正文；`sandbox-probe` 和后续会话使用受审查单条命令，没有绕过审批。`b3-audit-attempt1` 是验证脚本把增量日志当完整快照导致的断言失败，修正后通过并保留原记录。`commands/c-context-109/` 默认上下文预算拒绝（退出 2），扩容后成功，状态未因拒绝改变。

`commands/` 每条命令保存输入、标准输出、标准错误、状态前后哈希和产品退出码。`session-*.jsonl` 保存独立会话完整工具轨迹；合成凭据仅用于本地测试。机械检查、模型实读及草稿导出均不等于真人盲读、市场验证或正式出版。
