# Story Gate Studio v0.1 实现计划

## 目标

本文把 v0.1 详细设计拆成可以直接实现的任务。每个任务必须有入口、输入、输出、落点、测试和完成标准。

## 实现顺序

| 顺序 | 任务编号 | 名称 | 入口 | 完成标准 |
| --- | --- | --- | --- | --- |
| 1 | `IMPL-001` | 任务注册表与路由 | `references/task-registry.json` | QG-012 通过，所有任务能映射到 skill/mode/module |
| 2 | `IMPL-002` | 请求与报告对象工具库 | `scripts/lib.js` | 能生成并校验 `StoryGateRequest`、`StoryGateReport` |
| 3 | `IMPL-003` | 章节开写门禁 | `skills/chapter-workbench`、`scripts/chapter-gate.js` | 好 fixture pass，坏 fixture blocked |
| 4 | `IMPL-004` | 第三方冷读审稿 | `skills/third-party-review` | 能输出弃读风险、当前页风险、修订建议 |
| 5 | `IMPL-005` | 发布门禁 | `skills/release-gate`、`scripts/story-gate-audit.js` | 能扫描 TODO、占位、元叙事、乱码 |
| 6 | `IMPL-006` | 爆款追读复审 | `skills/blockbuster-review` | 发布分和市场分分离 |
| 7 | `IMPL-007` | 视觉资产 selected 门禁 | `skills/visual-asset-manager`、`scripts/visual-asset-audit.js` | 缺提示词/版本/用途时 blocked |
| 8 | `IMPL-008` | 短剧试制适配 | `skills/screenplay-adapter` | 只在 `screenplay`/`short_drama` mode 输出分镜 |
| 9 | `IMPL-009` | 商业发布包检查 | `scripts/commercial-release-check.js` | BIZ-QG 全部通过 |
| 10 | `IMPL-010` | 私有试用包 | `marketplace.private.example.json` | 新环境可安装并跑最小 fixture |
| 18 | `IMPL-018` | P4 发布版本体系 | `references/release-manifest.json`、`scripts/release-check.js` | QG-013 通过，版本、发布说明、zip 名和回滚入口一致 |
| 19 | `IMPL-019` | P5 客户项目规则包模板 | `templates/project-rule-pack/`、`scripts/init-project-rule-pack.js` | 可在插件根目录外生成匿名规则包并通过 `project-rule-check` |
| 20 | `IMPL-020` | P6 核心审核评分卡 | `scripts/review-scorecard.js`、`docs/review-capability-enhancement.md` | pass/needs_polish fixture 稳定，评分字段分离 |
| 21 | `IMPL-021` | P7 Host Adapter | `scripts/host-adapter.js`、`references/host-adapter.schema.json` | host-run JSON request/response 稳定，容器/CI smoke 通过 |
| 22 | `IMPL-022` | P8 商业化与授权闭环 | `docs/commercial-operations.md`、`scripts/commercial-readiness-check.js` | 授权、试用、隐私、支持和禁用承诺门禁通过 |
| 23 | `IMPL-023` | P9 客户试点与支持闭环 | `docs/customer-pilot.md`、`scripts/customer-pilot.js`、`scripts/support-bundle.js` | 匿名客户项目完成规则、审核、门禁、host 和支持包隐私验收 |

## 任务契约

所有任务登记在 `references/task-registry.json`，并由 `references/task-registry.schema.json` 约束。

任务必须包含：

- `task_id`
- `task`
- `skill`
- `module_ids`
- `mode`
- `write_policy`
- `inputs`
- `outputs`
- `tests`
- `done_when`

## 错误码

| 错误码 | 含义 | 处理 |
| --- | --- | --- |
| `SGM_ERR_SCHEMA` | 请求、规则包或报告 schema 不通过 | 阻断任务，输出校验错误 |
| `SGM_ERR_MODE_LEAK` | mode 污染，例如 novel 输出分镜 | 阻断任务，要求显式切换 mode |
| `SGM_ERR_READONLY_WRITE` | `review_only` 下尝试写目标稿件 | 阻断任务，输出越权报告 |
| `SGM_ERR_RULE_MISSING` | 找不到任务所需规则包或模块 | 阻断任务，提示缺失规则 |
| `SGM_ERR_PRIVATE_CONTENT` | 商业发布包含私有素材 | 阻断商业发布 |
| `SGM_ERR_FIXTURE_DRIFT` | fixture 与 expected report 不一致 | 阻断合并 |

## 文件落点

| 类型 | 落点 |
| --- | --- |
| skill 提示词和流程 | `skills/<skill-name>/SKILL.md` |
| 通用规则 | `references/*.md`、`references/rule-pack.json` |
| schema | `references/*.schema.json` |
| 可执行脚本 | `scripts/*.js` |
| 单元测试 | `tests/*.test.js` |
| 输入样例 | `examples/fixtures/`、`examples/requests/` |
| 期望报告 | `examples/expected-reports/` |
| 质量报告 | `reports/quality-gates/` |

## 每次实现必须跑

```powershell
node scripts/run-quality-gates.js
node --test tests/*.test.js
```

影响 manifest 或插件目录时，还必须跑 Codex 插件创建器 `validate_plugin.py`。

## v0.1 Definition of Done

1. `references/task-registry.json` 覆盖 v0.1 所有用户工作流。
2. 每个任务至少有 1 个 fixture 或明确的测试占位。
3. 每个 skill 至少有 Scope、Workflow、Inputs、Outputs、Guardrails、Tests。
4. `node scripts/run-quality-gates.js` 全绿。
5. `node --test tests/*.test.js` 全绿。
6. Codex 插件创建器校验通过。

## v0.1 第一版实现状态

| 任务 | 状态 | 证据 |
| --- | --- | --- |
| `IMPL-001` 任务注册表与路由 | 已落地 | `references/task-registry.json`、`scripts/story-gate.js tasks`、QG-012 |
| `IMPL-002` 请求与报告对象工具库 | 已落地 | `references/request.schema.json`、`references/report.schema.json`、`scripts/lib.js`、QG-003 |
| `IMPL-003` 章节开写门禁 | 已落地 | `scripts/chapter-gate.js`、`examples/fixtures/chapter-gate-pass.json`、`examples/fixtures/chapter-gate-block.json` |
| `IMPL-010` 私有试用包 | 已落地 | `.agents/plugins/marketplace.json`、`docs/quickstart.md`、`docs/help.md` |
| `IMPL-011` 真实项目试运行 | 已落地 | `scripts/chapter-batch-metrics.js`、`scripts/project-rule-pack-check.js`、外部 `project_rule_pack` 试运行报告 |
| `IMPL-012` 匿名终局活人代价 fixture | 已落地 | `examples/final-arc-live-cost/`、`tests/quality-gates.test.js`、`references/task-registry.json` |
| `IMPL-013` 私有商业包验收 | 已落地 | `references/private-package-manifest.json`、`scripts/private-package-check.js`、`docs/private-package.md` |
| `IMPL-014` 私有商业包构建命令 | 已落地 | `scripts/build-private-package.js`、`story-gate.js build-private-package`、`tests/quality-gates.test.js` |
| `IMPL-015` 私有商业包归档与校验清单 | 已落地 | `scripts/build-release-archive.js`、`story-gate.js build-release-archive`、`SHA256SUMS.txt` |
| `IMPL-016` 分阶段推进与验收路线图 | 已落地 | `docs/phased-roadmap.md`、`scripts/validate-design-contracts.js`、QG-011 |
| `IMPL-017` P3 外部安装验收 | 已落地 | `docs/customer-install.md`、`scripts/customer-install-smoke.js`、`examples/customer-smoke/README.md` |
| `IMPL-018` P4 发布版本体系 | 已落地 | `docs/release-management.md`、`references/release-manifest.json`、`CHANGELOG.md`、`RELEASE.md`、`scripts/release-check.js`、QG-013 |
| `IMPL-019` P5 客户项目规则包模板 | 已落地 | `docs/project-rule-pack-template.md`、`templates/project-rule-pack/`、`scripts/init-project-rule-pack.js`、`tests/quality-gates.test.js` |
| `IMPL-020` P6 核心审核评分卡 | 已落地 | `docs/review-capability-enhancement.md`、`scripts/review-scorecard.js`、`examples/fixtures/review-scorecard-*.md`、`tests/quality-gates.test.js` |
| `IMPL-021` P7 Host Adapter | 已落地 | `docs/host-adapter.md`、`references/host-adapter.schema.json`、`scripts/host-adapter.js`、`examples/host-adapter/` |
| `IMPL-022` P8 商业化与授权闭环 | 已落地 | `docs/commercial-operations.md`、`references/commercial-readiness.json`、`scripts/commercial-readiness-check.js`、BIZ-QG |
| `IMPL-023` P9 客户试点与支持闭环 | 已落地 | `docs/customer-pilot.md`、`docs/support-playbook.md`、`examples/customer-pilot/`、`scripts/customer-pilot.js`、`scripts/support-bundle.js` |
| `IMPL-025` P17 盲读审核门禁 | 已落地 | `references/blind-read-review-rules.md`、`scripts/blind-read-gate.js`、`examples/fixtures/blind-read-*.json`、`tests/quality-gates.test.js` |
| `IMPL-026` P18 盲读临时任务隔离 | 已落地 | `SGM-BLIND-001-R013`、`blind-read-context-leak-block.json`、`tests/quality-gates.test.js` |

`IMPL-012` 的验收重点是商业安全抽象：fixture 可以复用真实试运行中的结构经验，但不得携带源项目私有人名、案名、物证链、终局设定或正文表达。测试必须同时覆盖批量指标输出和私有标记扫描。

`IMPL-013` 的验收重点是交付边界：对外私有商业包必须按清单 include/exclude，不能把内部项目规则包、临时依赖目录、构建输出或源项目私有标记打进包内；安装后 smoke 必须由 `private-package-check` 实际执行。

`IMPL-014` 的验收重点是构建可重复：构建命令必须只复制 manifest 允许的文件，输出目录不得位于插件根目录内，构建完成后必须能在产物目录内通过 `private-package-check`。

`IMPL-015` 的验收重点是分发可校验：归档命令必须先验证交付目录，再生成 zip 与 SHA256 清单；测试必须验证 zip 魔数、归档哈希和包内关键文件校验记录。

`IMPL-016` 的验收重点是后续推进可追踪：路线图必须按阶段记录项目目标、项目产出、项目测试、验收结果、本地提交、commit hash 和回滚方式；每个阶段必须遵守 `阶段设计 -> 阶段实现 -> 初次测试 -> 修正复测 -> 完成验收 -> 本地提交` 生命周期，并由 QG-011 检查关键字段与阶段编号。

`IMPL-017` 的验收重点是客户可独立自检：必须能从 zip 解压到临时目录并运行 `customer-install-smoke --full`，交付包内还必须通过 `validate` 和 `node --test tests/*.test.js`。

`IMPL-018` 的验收重点是发布可追踪：`references/release-manifest.json` 必须与 `package.json`、`.codex-plugin/plugin.json`、`CHANGELOG.md`、`RELEASE.md`、默认 zip 名和 `SHA256SUMS.txt` 一致；`release-check` 必须纳入 `validate` 和单元测试。

`IMPL-019` 的验收重点是客户规则隔离：初始化命令必须拒绝写入插件根目录，生成的外部 `rule-pack.json` 必须通过 `project-rule-check`，测试必须确认通用 `references/rule-pack.json` 未因客户模板生成而改变。

`IMPL-020` 的验收重点是审核价值可测：评分卡必须区分冷读弃读风险、易懂性、爆款追读和情绪落点；pass fixture 与 needs_polish fixture 必须稳定，且 CLI 退出码可用于门禁。

`IMPL-021` 的验收重点是跨 host 稳定：`host-run` 必须接收 JSON request、输出 JSON response、保持退出码稳定，并在不依赖 Codex UI 的目录中通过 smoke。

`IMPL-022` 的验收重点是商业闭环：授权层级、试用策略、隐私边界、支持流程、更新回滚和禁用营销承诺必须进入交付包，并由 `commercial-readiness-check` 自动检查。
`IMPL-023` 的验收重点是客户价值和售后隐私：匿名客户项目必须能完成规则包校验、审核评分、章节门禁、host adapter 和支持包生成；支持包必须证明章节稿件被检测但排除，不得复制客户正文。
`IMPL-025` 的验收重点是盲读结论可信：版本锁定、票据类型、隔离、旧票失效、逐票通过、单章/连续边界和双评分必须由同一套 CLI、Host Adapter 和 fixture 回归保护。
`IMPL-026` 的验收重点是执行隔离：盲读必须由内部临时代理完成，不创建可预览任务，不继承当前对话上下文，读取后丢弃，不在侧边栏保留入口。
## IMPL-024 Physical Operability Gate

| Field | Content |
| --- | --- |
| Scope | Promote the project physical logic and operability rule into the reusable plugin rule chain. |
| Design | Universal method rule `SGM-PHY-001`; `chapter-gate` requires `physical_operability`; project-specific physical constraints stay in external `project_rule_pack`. |
| Implementation | `references/rule-pack.json`, `scripts/chapter-gate.js`, `scripts/lib.js`, `skills/chapter-workbench/SKILL.md`, `templates/project-rule-pack/rule-pack.template.json`, fixtures and expected reports. |
| Tests | `validate`, `node --test tests/*.test.js`, physical blocked CLI fixture, project rule-pack template check. |
| Acceptance | A chapter card with concrete event but missing physical operability must return `blocked` with `SGM-PHY-001-R001`. |
