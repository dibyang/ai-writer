# 主会话辅助调用错误

以下为本轮工具返回中的辅助调用错误说明，原始返回存在主会话工具记录；本文件是整理记录，不冒称由子进程捕获的分流stderr。

- 2026-10-16 14:29 UTC，调用Python差异渲染器时在PowerShell里漏写 `&`，工具返回ParserError、exit1，解释器及渲染脚本未启动。随后读取脚本参数定义，改用 `& '…/python.exe' render-revision-diff.py transitions.json` 成功生成97处变化/96组差异材料。产品和正文未改变。
- 最初读取主回归输出误猜为 `stdout.raw`，FastCtx返回路径不存在；列举实际目录后读取真实 `stdout.raw.txt`。测试本身exit0，60/60、无跳过。
- 误猜第13阶段存在 `current-scope-selection.json`，实际该文件仅是上阶段单独整理物；未创建假文件补齐。改用真实CLI recall抓取五项冻结状态，完整读其266行选择字段。

不同层的调用失败与原生CLI失败分别保存，不重写失败为成功。

- 最终v4原生context证明首轮只按argv含context筛选，误读context --help纯文本为JSON。保存已执行旧脚本verify-v4-native-context.before-help-filter-fix.mjs及parent-commands/final-v4-context原始exit1/stderr；改为命令位置严格等于context且排除--help，final-v4-context-r2实际通过10项正式登记消费绑定。产品、正文和权威状态未修改。
