# story-gate-studio

`story-gate-studio` 是从本小说项目抽象出的写作、审稿、发布门禁、爆款冷读、视觉资产和短剧试制插件包。

本目录是插件的独立权威目录。小说项目 `资料/` 只保留历史入口和迁移说明；插件文档、未来代码、测试、fixture、报告模板和商业发布材料都应放在本目录下。

## 目录职责

| 目录 | 职责 |
| --- | --- |
| `.codex-plugin/` | Codex 插件 manifest 和安装元数据 |
| `docs/` | 架构设计、追踪表、商业化策略和后续 RFC |
| `skills/` | Codex skills，按能力模块拆分 |
| `references/` | 通用规则包、schema、模板和私有内容黑名单 |
| `scripts/` | 审核、校验、发布包检查和质量门禁脚本 |
| `tests/` | 自动化测试、单元测试、回归测试和容器 smoke |
| `examples/` | 最小示例项目、fixtures 和 expected reports |
| `reports/` | 插件自身质量门禁、商业门禁和发布验证报告 |

## 权威文档

- [架构设计](docs/architecture.md)
- [规则映射追踪表](docs/traceability.md)
- [商业化与分发策略](docs/commercialization.md)
- [v0.1 详细设计](docs/v0.1-design.md)
- [v0.1 实现计划](docs/implementation-plan.md)
- [分阶段推进与验收路线图](docs/phased-roadmap.md)
- [客户安装与验收说明](docs/customer-install.md)
- [客户试点流程](docs/customer-pilot.md)
- [支持与排障手册](docs/support-playbook.md)
- [发布版本体系](docs/release-management.md)
- [快速入门](docs/quickstart.md)
- [帮助与 CLI](docs/help.md)

## 第一版快速使用

本仓库已经提供本地 marketplace：`.agents/plugins/marketplace.json`，指向 `./plugins/story-gate-studio`。在 Codex 插件界面选择该 marketplace 后即可安装试用。

命令行试用：

```powershell
cd plugins/story-gate-studio
node scripts/story-gate.js --help
node scripts/story-gate.js validate
node scripts/story-gate.js release-check
node scripts/story-gate.js private-package-check
node scripts/story-gate.js commercial-readiness-check
node scripts/story-gate.js customer-install-smoke --full
node scripts/story-gate.js customer-pilot --project examples/customer-pilot
node scripts/story-gate.js support-bundle --project examples/customer-pilot --dry-run
node scripts/story-gate.js build-private-package --out ../../story-gate-deliverables/story-gate-studio-private-commercial-trial
node scripts/story-gate.js build-release-archive --package-dir ../../story-gate-deliverables/story-gate-studio-private-commercial-trial --out-dir ../../story-gate-deliverables --force
node scripts/story-gate.js chapter-gate examples/fixtures/chapter-gate-pass.json
node scripts/story-gate.js chapter-gate examples/fixtures/chapter-gate-block.json
node scripts/story-gate.js review-scorecard examples/fixtures/review-scorecard-pass.md
node scripts/story-gate.js host-run examples/host-adapter/review-scorecard-request.json
node scripts/story-gate.js init-project-rule-pack --out ../../story-gate-projects/sample-customer --name sample-customer
node scripts/story-gate.js project-rule-check examples/project-rule-packs/sample-project-rule-pack.json
node scripts/story-gate.js chapter-batch-metrics examples/fixtures/chapter-batch-metrics-sample.md
node scripts/story-gate.js chapter-batch-metrics examples/final-arc-live-cost/chapter-01.md examples/final-arc-live-cost/chapter-02.md examples/final-arc-live-cost/chapter-03.md
```

## 当前可执行验证

第一版已经落地可执行质量门禁，使用 Node.js 且不依赖第三方包：

```powershell
node scripts/run-quality-gates.js
node --test tests/*.test.js
node scripts/story-gate.js release-check
node scripts/story-gate.js private-package-check
node scripts/story-gate.js customer-pilot --project examples/customer-pilot
node scripts/story-gate.js support-bundle --project examples/customer-pilot --dry-run
node scripts/story-gate.js build-private-package --out ../../story-gate-deliverables/story-gate-studio-private-commercial-trial
node scripts/story-gate.js build-release-archive --package-dir ../../story-gate-deliverables/story-gate-studio-private-commercial-trial --out-dir ../../story-gate-deliverables --force
node scripts/validate-design-contracts.js
node scripts/validate-task-registry.js
node scripts/story-gate-audit.js examples/fixtures
node scripts/visual-asset-audit.js examples/fixtures
```

当前覆盖：

- `QG-001` 插件结构和 manifest 校验
- `QG-002` 规则包 schema 校验
- `QG-003` 报告 schema 校验
- `QG-004` fixture 回归
- `QG-006` novel/screenplay mode 隔离
- `QG-008` 脚本 smoke
- `QG-009` 编码检查
- `QG-011` v0.1 设计契约检查
- `QG-012` 任务注册表检查
- `QG-013` 发布版本元数据检查
- `BIZ-QG` 商业发布包基础检查

Codex 插件创建器的 Python 校验脚本已通过。若校验脚本缺少 `PyYAML`，按当前约定下载安装到用户级 Python 环境，再运行 `validate_plugin.py`；不得把临时依赖目录打进插件包。

## 独立存放原则

1. 插件代码不得写入小说正文、卷纲或 `资料/`。
2. 插件测试不得依赖源项目的私有剧情；只使用匿名化 fixture。
3. 商业发布包不得包含当前小说的人物、案名、物证链、终局设定、正文或视觉资产。
4. 插件可读取项目作为样例输入，但默认只输出报告，不改正文。
