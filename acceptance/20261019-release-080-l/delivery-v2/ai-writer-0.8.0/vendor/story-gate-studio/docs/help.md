# Story Gate Studio 帮助

## CLI

统一入口：

```powershell
node scripts/story-gate.js <command>
```

可用命令：

| 命令 | 用途 | 退出码 |
| --- | --- | --- |
| `--help` | 显示帮助 | `0` |
| `tasks` | 输出 v0.1 任务注册表 | `0` |
| `validate` | 运行全部质量门禁 | 通过为 `0`，失败为 `1` |
| `blind-read-gate <json>` | 检查单章/连续盲读票据、隔离、逐票通过和双评分 | blocked 为 `1` |
| `chapter-gate <json>` | 检查章节开写门禁 | blocked 为 `1` |
| `chapter-batch-metrics <md...>` | 检查章节批量系统词密度、活人压力和对话指标 | needs_polish 为 `1` |
| `review-scorecard <md...>` | 检查冷读弃读风险、易懂性、追读和情绪落点 | needs_polish 为 `1` |
| `host-run <host-request.json>` | 运行 agent/container/CI 通用 JSON 请求 | 由任务结果决定 |
| `project-rule-check <json-or-dir>` | 校验外部项目私有规则包 | 失败为 `1` |
| `init-project-rule-pack --out dir --name slug [--mode novel] [--force]` | 在插件外部初始化客户项目规则包 | 失败为 `1` 或 `2` |
| `customer-pilot [--project dir] [--out report.json] [--support-out dir]` | 跑通匿名客户项目试点流程 | 失败为 `1` 或 `2` |
| `support-bundle --project dir [--out dir \| --dry-run] [--force]` | 生成不含正文的售后诊断包 | 失败为 `1` 或 `2` |
| `release-check [--checksums file]` | 校验版本、发布说明、归档命名和回滚信息 | 失败为 `1` 或 `2` |
| `private-package-check` | 校验私有商业试用交付包清单和安装 smoke | 失败为 `1` |
| `commercial-readiness-check` | 校验授权、试用、隐私、支持和营销禁用承诺 | 失败为 `1` |
| `build-private-package [--out dir]` | 按交付清单构建私有商业试用包目录 | 失败为 `1` 或 `2` |
| `build-release-archive [--package-dir dir] [--out-dir dir] [--force]` | 为已验收的交付目录生成 zip 和 `SHA256SUMS.txt` | 失败为 `1` 或 `2` |
| `customer-install-smoke [--full] [--zip file --extract-to dir]` | 模拟客户解压后安装自检 | 失败为 `1` 或 `2` |
| `visual-selected <json-or-dir>` | 检查视觉资产 selected 门禁 | blocked 为 `1` |
| `release-audit <dir>` | 扫描发布残留标记 | blocked 为 `1` |

## 报告格式

所有审核脚本输出 `StoryGateReport` JSON，关键字段包括：

- `report_id`
- `module_id`
- `mode`
- `rule_pack`
- `target_refs`
- `source_refs`
- `verdict`
- `findings`

报告 schema 位于 `references/report.schema.json`。

## 常见任务

一键安装到另一个本地 Codex 项目：

```powershell
cd /d D:\work\小说\cayyl\story-gate-deliverables\story-gate-studio-private-commercial-trial
node scripts/story-gate.js install-local --project D:\work\小说\new-project --name new-project
```

在 Windows `cmd.exe` 中跨盘符切目录要使用 `cd /d`。如果不想切目录，也可以直接运行插件脚本的绝对路径。

该命令会复制插件、写入 `.agents/plugins/marketplace.json`、初始化项目规则包，并运行基础 smoke。已有安装不会被覆盖，除非显式添加 `--force`。

章节开写门禁：

```powershell
node scripts/story-gate.js chapter-gate examples/fixtures/chapter-gate-pass.json
```

盲读审核门禁会检查版本锁定、票据隔离、逐票通过、双评分，以及是否使用内部临时代理且不继承当前上下文：

```powershell
node scripts/story-gate.js blind-read-gate examples/fixtures/blind-read-pass.json
node scripts/story-gate.js blind-read-gate examples/fixtures/blind-read-continuous-block.json
```

视觉资产 selected 门禁：

```powershell
node scripts/story-gate.js visual-selected examples/fixtures/visual-selected-block.json
```

发布前残留扫描：

```powershell
node scripts/story-gate.js release-audit examples/fixtures
```

全部质量门禁：

```powershell
node scripts/story-gate.js validate
```

发布版本体系检查：

```powershell
node scripts/story-gate.js release-check
node scripts/story-gate.js release-check --checksums ../../story-gate-deliverables/SHA256SUMS.txt
```

客户试点闭环：

```powershell
node scripts/story-gate.js customer-pilot --project examples/customer-pilot
node scripts/story-gate.js support-bundle --project examples/customer-pilot --dry-run
```

`support-bundle` 会记录检测到但排除的章节稿件，不复制客户正文。

私有商业包验收：

```powershell
node scripts/story-gate.js private-package-check
node scripts/story-gate.js commercial-readiness-check
```

客户项目规则包初始化：

```powershell
node scripts/story-gate.js init-project-rule-pack --out ../../story-gate-projects/sample-customer --name sample-customer
node scripts/story-gate.js project-rule-check ../../story-gate-projects/sample-customer
```

Host adapter smoke：

```powershell
node scripts/story-gate.js host-run examples/host-adapter/review-scorecard-request.json
node scripts/story-gate.js host-run examples/host-adapter/blind-read-gate-request.json
node scripts/story-gate.js host-run examples/host-adapter/chapter-gate-request.json
```

私有商业包构建：

```powershell
node scripts/story-gate.js build-private-package --out ../../story-gate-deliverables/story-gate-studio-private-commercial-trial
node scripts/story-gate.js build-release-archive --package-dir ../../story-gate-deliverables/story-gate-studio-private-commercial-trial --out-dir ../../story-gate-deliverables --force
```

客户安装 smoke：

```powershell
node scripts/story-gate.js customer-install-smoke --full
node scripts/story-gate.js customer-install-smoke --zip ../../story-gate-deliverables/story-gate-studio-v0.1.0-private-commercial-trial.zip --extract-to ../../story-gate-deliverables/tmp-customer-smoke --full
```

## 扩展约定

新增 agent、容器或 CI 入口时，不直接绕过任务注册表。先在 `references/task-registry.json` 注册任务，再补测试，最后让 `QG-012` 和 `QG-011` 验证通过。

## v0.1 真实试运行命令

外部项目规则包校验：

```powershell
node scripts/story-gate.js project-rule-check ../../story-gate-projects/cayyl/rule-pack.json
```

批量章节指标报告：

```powershell
node scripts/story-gate.js chapter-batch-metrics "../../path/to/chapter-058.md" "../../path/to/chapter-059.md" "../../path/to/chapter-060.md" --rule-pack project@0.1.0 --out "../../story-gate-projects/example/reports/final-arc.metrics.json"
```

新增命令摘要：

| 命令 | 用途 |
| --- | --- |
| `blind-read-gate <json>` | 检查盲读汇总中的版本锁定、隔离、票据类型、逐票通过、单章/连续边界和双评分 |
| `chapter-batch-metrics <md...>` | 检查章节批量系统词密度、活人压力和对话指标 |
| `project-rule-check <json-or-dir>` | 校验外部项目私有规则包，不把它打包进通用插件 |
| `init-project-rule-pack --out dir --name slug` | 在插件外部生成客户项目规则包模板 |
| `release-check [--checksums file]` | 检查 P4 发布版本事实源和交付归档一致性 |

匿名终局活人代价样例：

```powershell
node scripts/story-gate.js chapter-batch-metrics examples/final-arc-live-cost/chapter-01.md examples/final-arc-live-cost/chapter-02.md examples/final-arc-live-cost/chapter-03.md
```

该样例用于验证终局类结构可以商业安全地抽象为通用 fixture，并由 `tests/quality-gates.test.js` 扫描私有标记和批量指标输出。
