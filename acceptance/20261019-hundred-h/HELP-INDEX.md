# 本轮真实CLI帮助捕获

以下均由父流程以当前H/work随附0.7.5入口实际执行，exit_code=0；命令不带--project，不写业务状态。帮助为纯文本，不能JSON.parse。后续模型可直接读取stdout.raw.txt，并按现场status.next.command与实际输出核输入。

- `commands/parent-help-plan/stdout.raw.txt`
- `commands/parent-help-volume/stdout.raw.txt`
- `commands/parent-help-workflow/stdout.raw.txt`
- `commands/parent-help-review/stdout.raw.txt`
- `commands/parent-help-review-issues/stdout.raw.txt`
- `commands/parent-help-revision/stdout.raw.txt`

这些帮助记录不替代具体JSON专项手册，不证明后续业务命令已经执行。所有产品调用仍经capture，并为每次调用使用新标签；不得把旧输出改名充当新会话恢复结果。
