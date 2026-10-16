# fixtures

未来放置匿名化测试输入样例。

fixture 应覆盖好样例、坏样例、边界样例和商业发布包剥离样例，不得直接使用来源项目的正文、人物、案名或终局设定。

## Blind-read fixtures

- `blind-read-pass.json`: valid continuous blind-read summary.
- `blind-read-isolation-block.json`: blocks mixed/informed tickets and broken isolation.
- `blind-read-context-leak-block.json`: blocks blind reads that use the current conversation, create previewable tasks, or retain sidebar entries.
- `blind-read-average-mask-block.json`: blocks using an average to hide a failed single-chapter ticket.
- `blind-read-continuous-block.json`: blocks continuous-read substitution, merged scores, bad chapter records, and weak page-turner claims.
