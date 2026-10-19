# scripts

未来放置插件自己的 Node.js/CLI 脚本，例如：

- `story-gate-audit.js`
- `story-template-scan.js`
- `validate-report.js`
- `validate-rule-pack.js`
- `validate-fixtures.js`
- `run-quality-gates.js`
- `commercial-release-check.js`

脚本只能依赖插件内规则、schema、fixture 和显式传入的项目路径，不得硬编码本小说项目目录。

已实现入口：

- `story-gate.js`: 统一 CLI。
- `chapter-gate.js`: 章节开写门禁。
- `chapter-batch-metrics.js`: 批量章节指标试运行。
- `project-rule-pack-check.js`: 外部项目规则包校验。
