# Story Gate Studio 分阶段推进与验收路线图

## 背景

`story-gate-studio` 已完成 v0.1 私有商业试用包：插件源码、匿名 fixture、质量门禁、私有交付目录、zip 归档和 SHA256 清单均已落地。后续改进不能只靠临时对话推进，必须按阶段记录项目目标、项目产出、项目测试和验收结果。

本文是 v0.1 之后的推进总入口。每个阶段都必须先设计、再实现、再测试；测试失败时必须回到修改环节，直到测试通过后才能完成验收。阶段完成验收后必须立即进行一次本地 Git 提交，并在阶段记录中写入 commit hash、提交范围和回滚方式。每个阶段只有在验收结果达到 `已通过` 或明确标记为 `延期` 后，才允许进入下一层商业化或能力扩展。

## 状态定义

| 状态 | 含义 |
| --- | --- |
| `已通过` | 产出存在，测试已跑，验收证据可追踪，且已完成本地提交或已标记历史提交待补录 |
| `进行中` | 正在实现，已有部分产出但未完成验收 |
| `待开始` | 已规划，尚未实现 |
| `延期` | 有价值但不属于当前优先级 |
| `阻断` | 存在必须先解决的问题 |

## 阶段生命周期

每个阶段必须按以下顺序推进，不得跳过设计或测试：

```text
阶段设计 -> 阶段实现 -> 初次测试 -> 修正复测 -> 完成验收 -> 本地提交
```

| 环节 | 进入条件 | 必需产出 | 退出条件 |
| --- | --- | --- | --- |
| 阶段设计 | 阶段被排入优先级 | 设计说明、范围边界、接口/数据/脚本落点、测试方案、风险清单 | 设计已写入 `docs/phased-roadmap.md` 或独立设计文档 |
| 阶段实现 | 阶段设计已完成 | 代码、文档、fixture、schema、脚本或交付物 | 所有计划产出已落地，未留 TODO 占位 |
| 初次测试 | 实现完成 | 单元测试、门禁命令、安装 smoke、归档/校验命令 | 记录首次测试结果 |
| 修正复测 | 初次测试失败或人工验收发现问题 | 修复记录、失败原因、复测命令 | 同一批测试全部通过 |
| 完成验收 | 复测通过 | 验收结果、证据链接、归档 hash 或报告路径 | 阶段状态改为 `已通过` |
| 本地提交 | 阶段验收通过 | 本地 Git commit、commit hash、提交范围说明、回滚方式 | commit hash 写入本文或阶段验收记录 |

硬性规则：

1. 没有阶段设计，不得开始实现。
2. 没有自动化测试或明确人工验收步骤，不得标记 `已通过`。
3. 测试失败时不得降级验收标准，必须修改实现或修正设计后复测。
4. 每次复测必须记录命令或证据，不能只写“已检查”。
5. 阶段完成后必须同步更新交付包、归档和 SHA256 清单，除非该阶段明确不影响交付物。
6. 阶段验收通过后必须进行本地提交；未记录 commit hash 的阶段不得视为可回溯完成。
7. 阶段提交只包含该阶段相关文件，不得混入无关小说正文、临时依赖、构建缓存或其他阶段改动。
8. 阶段验收提交信息必须能读出阶段编号和结果，例如 `story-gate: complete P4 release management`。

## 当前基线

| 项目 | 当前结果 |
| --- | --- |
| 插件形态 | Codex 本地插件 |
| 当前版本 | `0.1.0` |
| 当前交付级别 | 私有商业试用包 |
| 当前交付目录 | `story-gate-deliverables/story-gate-studio-private-commercial-trial/` |
| 当前归档 | `story-gate-deliverables/story-gate-studio-v0.1.0-private-commercial-trial.zip` |
| 当前校验清单 | `story-gate-deliverables/SHA256SUMS.txt` |
| 当前核心测试 | `node scripts/story-gate.js validate`、`node --test tests/*.test.js` |
| 当前官方校验 | Codex `validate_plugin.py` |

## 分阶段路线图

| 阶段 | 项目目标 | 阶段设计 | 阶段实现 | 初次测试 | 修正复测 | 完成验收 | 本地提交 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| P0 可安装插件基线 | Codex 能识别插件，核心 skill 和 CLI 可运行 | v0.1 设计、任务注册表、插件目录边界 | `.codex-plugin/plugin.json`、8 个 skill、`scripts/story-gate.js`、基础 fixture | `validate`、`node --test`、Codex `validate_plugin.py` | 已根据门禁补齐结构、schema、fixture | 已通过 | 历史阶段，commit hash 待补录 |
| P1 私有商业试用包 | 对外试用包只包含可交付内容，不携带源项目私有素材 | 商业包 include/exclude 清单和私有内容边界 | `references/private-package-manifest.json`、`docs/private-package.md`、`scripts/private-package-check.js` | `private-package-check`、BIZ-QG、私有明文扫描 | 已修正黑名单明文存储和交付清单 | 已通过 | 历史阶段，commit hash 待补录 |
| P2 可分发归档 | 交付包可压缩、可校验、可售后定位 | 构建目录与归档校验方案 | `build-private-package.js`、`build-release-archive.js`、zip、`SHA256SUMS.txt` | 构建回归、归档回归、系统 Zip 打开检查、SHA256 校验 | 已修正 `reports/` 缺失和交付包过期问题 | 已通过 | 历史阶段，commit hash 待补录 |
| P3 外部安装验收 | 模拟客户从 zip 解压、安装、运行和反馈问题 | `docs/customer-install.md` 定义客户安装流程、解压自检、失败排查路径 | `scripts/customer-install-smoke.js`、`examples/customer-smoke/README.md`、CLI `customer-install-smoke` | 从 zip 解压到临时目录后运行 `customer-install-smoke --full`、`validate`、`node --test` | 首次实现后通过交付包重建和 zip 解压 smoke 复测 | 已通过 | 历史阶段，commit hash 待补录 |
| P4 发布版本体系 | 每次交付有版本号、变更记录、发布决策和回滚入口 | `docs/release-management.md` 定义版本事实源、发布状态、归档命名和回滚策略 | `references/release-manifest.json`、`CHANGELOG.md`、`RELEASE.md`、`scripts/release-check.js`、CLI `release-check` | 源插件与交付包均通过 `release-check`、`validate`、`node --test`、交付包 `release-check --checksums` | 首次通过，无需修正；重建交付包与 SHA256 清单后复测通过 | 已通过 | 已提交：`4f4976c`（`story-gate: complete release tracking gates`） |
| P5 客户项目规则包模板 | 不同小说/剧本项目可独立维护私有规则，不污染通用插件 | `docs/project-rule-pack-template.md` 定义模板字段、私有边界、初始化流程 | `templates/project-rule-pack/`、`scripts/init-project-rule-pack.js`、CLI `init-project-rule-pack` | `init-project-rule-pack` 临时目录生成、`project-rule-check` 模板回归、通用规则包未变更断言 | 首次通过，无需修正；补齐设计契约和交付清单后复测 | 已通过 | 已提交：`0db2637`（`story-gate: complete P5 project rule pack template`） |
| P6 核心审核能力增强 | 从结构门禁升级为更稳定的写作/审稿/爆款评估工具 | `docs/review-capability-enhancement.md` 定义冷读、易懂性、爆款、情绪评分和误杀边界 | `scripts/review-scorecard.js`、P6 pass/needs_polish fixture、CLI `review-scorecard` | `review-scorecard` fixtures、`validate`、`node --test`、交付包复测均通过 | 首次通过；交付包重建后复测通过 | 已通过 | 已提交：`932afa9`（`story-gate: complete P6 review scorecard`） |
| P7 多 host / 容器适配 | 在 Codex 之外保留 agent、container、CI 接入能力 | `docs/host-adapter.md` 定义 host adapter JSON 契约和兼容边界 | `references/host-adapter.schema.json`、`scripts/host-adapter.js`、CLI `host-run`、`examples/host-adapter/` | host-run fixtures、容器/CI smoke、完整门禁均通过 | 首次通过；交付包重建后复测通过 | 已通过 | 已提交：`a826d3e`（`story-gate: complete P7 host adapter`） |
| P8 商业化与授权闭环 | 支持试用、授权、客户支持和销售边界管理 | `docs/commercial-operations.md` 定义授权模型、试用策略、支持流程和隐私边界 | `references/commercial-readiness.json`、`scripts/commercial-readiness-check.js`、CLI `commercial-readiness-check` | 已通过：商业文档门禁、免责声明检查、交付包合规检查 | 已复测：修正商业化文档私有标记后，源插件和交付包测试通过 | 已通过 | 已提交：`fa2e3a4`（`story-gate: complete P8 commercial readiness`） |
| P9 客户试点与支持闭环 | 模拟真实客户从匿名项目完成规则、审核、门禁、host 和支持包流程 | `docs/customer-pilot.md` 定义客户试点流程、状态机、接口、隐私边界和验收线 | `examples/customer-pilot/`、`scripts/customer-pilot.js`、`scripts/support-bundle.js`、`docs/support-playbook.md`、`references/license-profile.json` | 已通过：`customer-pilot`、`support-bundle --dry-run`、隐私扫描、完整门禁和交付包 smoke | 首次通过，无需修正；交付包重建后复测通过 | 已通过 | 已提交：`435bc84`（`story-gate: complete P9 customer pilot`） |
| P10 公开市场准备 | 当官方公开插件市场条件成熟时，可迁移到公开发布流程 | 延期设计：等待官方公开市场条件明确 | 延期实现：公开 marketplace 材料、截图/说明、平台条款复核记录 | 延期测试：官方校验、平台条款 checklist、公开包私有内容扫描 | 延期复测：按平台反馈修正 | 延期 | 延期，无提交要求 |

## 阶段验收模板

每个新阶段必须补齐以下字段，不能只写口头目标：

| 字段 | 要求 |
| --- | --- |
| 阶段编号 | 使用 `P<number>`，不得复用 |
| 项目目标 | 用可验证结果描述，不写泛泛愿景 |
| 项目产出 | 列出具体文件、脚本、fixture、文档或归档 |
| 项目测试 | 列出命令、测试文件、门禁编号或人工验收步骤 |
| 初次测试 | 记录第一次测试命令和结果，不允许空缺 |
| 修正复测 | 测试失败后记录修正内容和复测命令；若首次通过，写明“首次通过，无需修正” |
| 验收结果 | `已通过`、`进行中`、`待开始`、`延期` 或 `阻断` |
| 本地提交 | 阶段验收通过后必须记录 commit hash；历史阶段若未拆分提交，必须标记 `待补录` |
| 回滚方式 | 写明可回滚到哪个 commit hash，或如何撤销该阶段改动 |
| 证据 | 指向报告、测试输出、归档 hash 或变更记录 |
| 下一步 | 指明下一个最小可交付动作 |

## 当前优先级建议

| 优先级 | 阶段 | 原因 |
| --- | --- | --- |
| 1 | P10 公开市场准备 | 延期观察，等待官方公开插件市场条款和发布机制明确 |

## P3 详细推进计划

| 项目 | 内容 |
| --- | --- |
| 项目目标 | 客户解压 zip 后，不依赖本仓库上下文即可完成安装前自检和基础 CLI 验收 |
| 阶段设计 | 先设计客户安装流程、解压目录结构、命令行自检、失败排查表和 Codex 安装说明边界 |
| 项目产出 | `docs/customer-install.md`、`scripts/customer-install-smoke.js`、`examples/customer-smoke/` |
| 项目测试 | 从 zip 解压到临时目录，运行 `node scripts/story-gate.js private-package-check`、`node scripts/story-gate.js validate`、`node --test tests/*.test.js` |
| 修正复测 | 首次实现后通过交付包重建、zip 重新归档、`customer-install-smoke --full` 和交付包内测试复测 |
| 验收结果 | 已通过 |
| 本地提交 | 历史阶段，commit hash 待补录 |
| 回滚方式 | 回滚到 P3 前一阶段提交；若无拆分提交，按文件清单撤销 P3 产出 |
| 主要风险 | Codex 本地 marketplace 安装步骤仍依赖用户界面；第一版先验证命令行与插件目录结构 |
| 下一步 | P4 发布版本体系 |

## P4 详细推进计划

| 项目 | 内容 |
| --- | --- |
| 项目目标 | 每个交付包都能追踪版本、变更、测试证据、归档 hash 和回滚方式 |
| 阶段设计 | 先设计版本字段、发布状态、归档命名、CHANGELOG 粒度和回滚策略 |
| 项目产出 | `docs/release-management.md`、`CHANGELOG.md`、`RELEASE.md`、`references/release-manifest.json`、`scripts/release-check.js` |
| 项目测试 | 检查 manifest 版本与 `package.json`、plugin manifest、zip 名称、release note、changelog、质量证据和回滚入口一致 |
| 初次测试 | 已通过：`node scripts/story-gate.js release-check`、`node scripts/story-gate.js validate`、`node --test tests/*.test.js` |
| 修正复测 | 首次通过，无需修正；重建交付包和 SHA256 清单后，在交付包内复测 `validate`、`node --test`、`release-check --checksums`、`customer-install-smoke --zip ... --full` 均通过 |
| 验收结果 | 已通过 |
| 本地提交 | 已提交：`4f4976c`（`story-gate: complete release tracking gates`） |
| 回滚方式 | 回滚 P4 阶段提交，恢复上一版 release manifest、CHANGELOG、RELEASE 和归档命名 |
| 证据 | `story-gate-deliverables/story-gate-studio-v0.1.0-private-commercial-trial.zip`，SHA256 以 `story-gate-deliverables/SHA256SUMS.txt` 为准，交付文件数 81 |
| 主要风险 | 版本号升级后忘记同步交付包名称或 SHA256 记录 |
| 下一步 | P5 客户项目规则包模板 |

## P5 详细推进计划

| 项目 | 内容 |
| --- | --- |
| 项目目标 | 客户能为自己的小说或剧本创建独立 `project_rule_pack`，不污染通用规则 |
| 阶段设计 | `docs/project-rule-pack-template.md` 定义模板字段、私有内容边界、客户项目目录和初始化流程 |
| 项目产出 | `templates/project-rule-pack/`、`docs/project-rule-pack-template.md`、`scripts/init-project-rule-pack.js`、CLI `init-project-rule-pack` |
| 项目测试 | 用模板生成匿名规则包并通过 `project-rule-check`，同时确认通用 `references/rule-pack.json` 未变化；纳入 `node --test tests/*.test.js` |
| 初次测试 | 已通过：`node scripts/story-gate.js init-project-rule-pack --out <temp> --name sample-customer`、`node scripts/story-gate.js project-rule-check <temp>/rule-pack.json` |
| 修正复测 | 补齐 `docs/v0.1-design.md`、`docs/implementation-plan.md` 和 `references/private-package-manifest.json` 后，重新运行设计契约、质量门禁和单元测试 |
| 验收结果 | 已通过 |
| 本地提交 | 已提交：`0db2637`（`story-gate: complete P5 project rule pack template`） |
| 回滚方式 | 回滚 P5 阶段提交，移除模板、示例和模板测试 |
| 主要风险 | 客户把私有剧情写入通用插件目录，导致商业包污染 |
| 下一步 | P6 核心审核能力增强 |

## P6 详细推进计划

| 项目 | 内容 |
| --- | --- |
| 项目目标 | 提高插件对真实章节、架构和审稿任务的判断质量 |
| 阶段设计 | `docs/review-capability-enhancement.md` 定义评分模型、误杀边界、报告字段和 fixture 覆盖策略 |
| 项目产出 | `scripts/review-scorecard.js`、`examples/fixtures/review-scorecard-pass.md`、`examples/fixtures/review-scorecard-needs-polish.md` |
| 项目测试 | 每类能力至少 1 个 pass、1 个 needs_polish fixture；报告 schema 稳定；CLI 退出码稳定 |
| 初次测试 | 已通过：`review-scorecard` pass fixture 退出码 0、needs_polish fixture 退出码 1、`validate`、`node --test tests/*.test.js` |
| 修正复测 | 首次通过，无需修正；交付包重建后复测 `review-scorecard`、`validate`、`node --test`、`release-check --checksums`、`customer-install-smoke --zip ... --full` 和 Codex `validate_plugin.py` |
| 验收结果 | 已通过 |
| 本地提交 | 已提交：`932afa9`（`story-gate: complete P6 review scorecard`） |
| 回滚方式 | 回滚 P6 阶段提交，恢复上一版 rubric、fixture 和评分逻辑 |
| 证据 | 交付包文件数 89，`story-gate-deliverables/story-gate-studio-v0.1.0-private-commercial-trial.zip`，SHA256 以 `story-gate-deliverables/SHA256SUMS.txt` 为准 |
| 主要风险 | 规则过硬导致误杀，或规则过软导致不能真正帮助写作 |
| 下一步 | P7 多 host / 容器适配 |

## P7 详细推进计划

| 项目 | 内容 |
| --- | --- |
| 项目目标 | 在 Codex 之外保留 agent、container、CI 接入能力 |
| 阶段设计 | `docs/host-adapter.md` 定义 request/response、支持任务、失败行为和容器/CI smoke |
| 项目产出 | `references/host-adapter.schema.json`、`scripts/host-adapter.js`、`examples/host-adapter/`、CLI `host-run` |
| 项目测试 | `host-run` review_scorecard/chapter_gate fixtures、完整门禁、交付包 smoke |
| 初次测试 | 已通过：`host-run` review_scorecard/chapter_gate fixtures、`validate`、`node --test tests/*.test.js`、Codex `validate_plugin.py` |
| 修正复测 | 首次通过，无需修正；交付包重建后复测 `host-run`、`validate`、`node --test`、`release-check --checksums`、`customer-install-smoke --zip ... --full` 和 Codex `validate_plugin.py` |
| 验收结果 | 已通过 |
| 本地提交 | 已提交：`a826d3e`（`story-gate: complete P7 host adapter`） |
| 回滚方式 | 回滚 P7 阶段提交，移除 host adapter schema、脚本和 fixtures |
| 证据 | 交付包文件数 94，`story-gate-deliverables/story-gate-studio-v0.1.0-private-commercial-trial.zip`，SHA256 以 `story-gate-deliverables/SHA256SUMS.txt` 为准 |
| 主要风险 | 不同 host 的路径解析差异导致相对路径不可用 |
| 下一步 | P8 商业化与授权闭环 |

## P8 详细推进计划

| 项目 | 内容 |
| --- | --- |
| 项目目标 | 支持试用、授权、客户支持和销售边界管理 |
| 阶段设计 | `docs/commercial-operations.md` 定义授权层级、试用策略、隐私边界、支持流程、更新回滚和禁用承诺 |
| 项目产出 | `references/commercial-readiness.json`、`scripts/commercial-readiness-check.js`、CLI `commercial-readiness-check` |
| 项目测试 | 商业文档门禁、禁用营销承诺扫描、完整门禁、交付包合规检查 |
| 初次测试 | 初次失败：`commercial-readiness-check` 通过，但 `validate` 和 `node --test tests/*.test.js` 被 BIZ-QG private package 拦截，原因是 `docs/commercialization.md` 含源项目私有标记 |
| 修正复测 | 已修正 `docs/commercialization.md`，改为通用“源项目/真实创作项目”表述；复测 `commercial-readiness-check`、`private-package-check`、`validate`、`node --test tests/*.test.js`、交付包内 `validate`、交付包内 `node --test`、`release-check --checksums`、`customer-install-smoke --zip ... --full`、Codex `validate_plugin.py` 均通过 |
| 验收结果 | 已通过 |
| 本地提交 | 已提交：`fa2e3a4`（`story-gate: complete P8 commercial readiness`） |
| 回滚方式 | 回滚 P8 阶段提交，移除 commercial readiness manifest、脚本和文档 |
| 证据 | 交付包文件数 98，`story-gate-deliverables/story-gate-studio-v0.1.0-private-commercial-trial.zip`，SHA256 以 `story-gate-deliverables/SHA256SUMS.txt` 为准 |
| 主要风险 | 法律/平台条款变化，公开销售前仍需复核最新条款 |
| 下一步 | P9 客户试点与支持闭环 |

## P9 详细推进计划

| 项目 | 内容 |
| --- | --- |
| 项目目标 | 匿名客户项目能在不暴露真实正文的前提下完成规则包校验、审核评分、章节门禁、host adapter 和支持包诊断 |
| 阶段设计 | `docs/customer-pilot.md` 定义试点接口、状态机、失败行为、隐私边界和验收标准；`docs/support-playbook.md` 定义售后支持包边界 |
| 项目产出 | `examples/customer-pilot/`、`scripts/customer-pilot.js`、`scripts/support-bundle.js`、`references/license-profile.json`、CLI `customer-pilot` / `support-bundle` |
| 项目测试 | `customer-pilot --project examples/customer-pilot`、`support-bundle --project examples/customer-pilot --dry-run`、隐私正文排除测试、`validate`、`node --test tests/*.test.js`、交付包 smoke |
| 初次测试 | 已通过：`customer-pilot --project examples/customer-pilot`、`support-bundle --project examples/customer-pilot --dry-run`、`node scripts/story-gate.js validate`、`node --test tests/*.test.js` |
| 修正复测 | 首次通过，无需修正；交付包重建后复测 `customer-pilot`、`support-bundle --dry-run`、`validate`、`node --test`、`release-check --checksums`、`customer-install-smoke --zip ... --full`、Codex `validate_plugin.py`、私有标记扫描和支持包正文排除 |
| 验收结果 | 已通过 |
| 本地提交 | 已提交：`435bc84`（`story-gate: complete P9 customer pilot`） |
| 回滚方式 | 回滚 P9 阶段提交，移除 customer pilot、support bundle、license profile、fixture、任务注册和文档 |
| 证据 | 交付包文件数 109，`story-gate-deliverables/story-gate-studio-v0.1.0-private-commercial-trial.zip`，SHA256 以 `story-gate-deliverables/SHA256SUMS.txt` 为准 |
| 主要风险 | 匿名 fixture 过于理想化；支持包边界必须持续防止客户正文、视觉资产或私有规则泄漏 |
| 下一步 | P10 公开市场准备保持延期，等待平台条件明确 |

## 变更规则

1. 新增阶段必须同时更新本文、`docs/implementation-plan.md` 和相关测试。
2. 阶段状态从 `待开始` 改为 `已通过` 时，必须写明测试命令和验收证据。
3. 对外交付包必须重新运行 `build-private-package`、`build-release-archive` 和 SHA256 校验。
4. 涉及 manifest、skills、marketplace 或交付包边界时，必须运行 Codex `validate_plugin.py`。
5. 不得把源项目私有人名、案名、物证链、正文或视觉资产写入通用插件交付包。
6. 阶段验收通过后必须进行本地 Git 提交；提交完成前，该阶段只能算“验收通过待提交”，不能算可回溯完成。
7. 每次阶段提交后必须把 commit hash、提交范围和回滚方式写入阶段记录；后续售后和回滚以该 hash 为准。
## P11 Detailed Plan: Physical Operability Gate

| Field | Content |
| --- | --- |
| Project goal | Bring the project-level physical logic and operability rule into the reusable plugin without copying private evidence chains. |
| Stage design | Add a universal method rule `SGM-PHY-001`, require `physical_operability` in `chapter-gate`, and reserve project-local physical constraints in external project rule packs. |
| Project outputs | `references/rule-pack.json`, `scripts/chapter-gate.js`, `scripts/lib.js`, `skills/chapter-workbench/SKILL.md`, `templates/project-rule-pack/rule-pack.template.json`, physical blocked fixture and expected report, traceability addendum. |
| Project tests | `node scripts/story-gate.js validate`; `node --test tests/*.test.js`; `node scripts/story-gate.js chapter-gate examples/fixtures/chapter-gate-physical-block.json`; `node scripts/story-gate.js project-rule-check templates/project-rule-pack/rule-pack.template.json`; `release-check --checksums`; `customer-install-smoke --zip ... --full`; Codex `validate_plugin.py`. |
| Initial test | Passed: `node scripts/story-gate.js validate`; `node --test tests/*.test.js`; physical blocked fixture returned exit `1` with `SGM-PHY-001-R001`; project rule-pack template check passed; release archive and install smoke passed. |
| Fix and retest | First pass succeeded; no fix cycle required. |
| Acceptance result | Passed. |
| Local commit | Completed: `4922df4` (`story-gate: complete P11 physical operability gate`). |
| Rollback | Revert the P11 commit to restore `universal-novel@0.1.0` behavior and remove the physical blocked fixture. |
| Evidence | `validate` PASS; `node --test tests/*.test.js` PASS 26/26; physical blocked CLI output contains `SGM-PHY-001-R001`; project rule-pack template check PASS; archive SHA256 `3f16cb9f60713f8bd4d8a736395684d29d1c453291b841bca2037565292dba88`; Codex `validate_plugin.py` PASS. |
| Next step | Rebuild private deliverable only if this rule update is prepared for customer distribution. |

## P12 Detailed Plan: Physical Explanation Quality Gate

| Field | Content |
| --- | --- |
| Project goal | Prevent empty-compliance chapter cards where `physical_operability` exists but only says the reveal is reasonable. |
| Stage design | Add `SGM-PHY-001-R002`: a physical explanation must name a concrete evidence/action target and at least two support anchors such as position, obstruction, angle, light, distance, posture, tool, timing, or procedure. |
| Project outputs | `scripts/chapter-gate.js`, `references/rule-pack.json`, vague physical blocked fixture and expected report, quickstart command, traceability addendum. |
| Project tests | `node scripts/story-gate.js validate`; `node --test tests/*.test.js`; `node scripts/story-gate.js chapter-gate examples/fixtures/chapter-gate-physical-vague-block.json`; `release-check --checksums`; `customer-install-smoke --zip ... --full`; Codex `validate_plugin.py`. |
| Initial test | Failed first because `docs/architecture.md` and `docs/commercialization.md` were corrupted by a version-sync encoding mistake; QG-009 and BIZ-QG blocked release. |
| Fix and retest | Restored the two docs from HEAD bytes, reapplied only ASCII version changes, then retested: `validate` PASS, `node --test tests/*.test.js` PASS 26/26, vague physical fixture returned `SGM-PHY-001-R002`. |
| Acceptance result | Passed. |
| Local commit | Completed: `c3fc838` (`story-gate: complete P12 physical detail gate`). |
| Rollback | Revert the P12 commit to keep P11 required-field behavior without low-detail blocking. |
| Evidence | QG-009 caught the encoding regression; retest passed with `validate` PASS, `node --test tests/*.test.js` PASS 26/26, and `chapter-gate-physical-vague-block.json` blocked with `SGM-PHY-001-R002`. |
| Next step | Consider a standalone physical-operability report only if chapter-gate heuristics become too coarse. |

## P13 Detailed Plan: Small Object Handling and State Continuity

| Field | Content |
| --- | --- |
| Project goal | Bring the new small-object action proportion and object-state continuity rules into the plugin's physical operability gate. |
| Stage design | Add `SGM-PHY-001-R003` for missing size-appropriate handling action and `SGM-PHY-001-R004` for object states that shift between small, fragile, protected, direct-pinch, and bundle-sized handling. |
| Project outputs | `scripts/chapter-gate.js`, `references/rule-pack.json`, two blocked fixtures and expected reports, quickstart commands, traceability addendum, rebuilt deliverable package. |
| Project tests | `node scripts/story-gate.js validate`; `node --test tests/*.test.js`; `chapter-gate-small-object-action-block.json`; `chapter-gate-object-continuity-block.json`; `release-check --checksums`; `customer-install-smoke --zip ... --full`; Codex `validate_plugin.py`. |
| Initial test | Passed: `validate` PASS, `node --test tests/*.test.js` PASS 26/26, small-object action fixture blocked with `SGM-PHY-001-R003`, object continuity fixture blocked with `SGM-PHY-001-R004`. |
| Fix and retest | First pass succeeded; no fix cycle required. |
| Acceptance result | Passed. |
| Local commit | Completed: `ae6a265` (`story-gate: complete P13 small object physical gates`). |
| Rollback | Revert the P13 commit to keep P12 physical detail behavior without small-object/action continuity blocking. |
| Evidence | `validate` PASS; `node --test tests/*.test.js` PASS 26/26; `chapter-gate-small-object-action-block.json` and `chapter-gate-object-continuity-block.json` returned expected blocker rule ids. |
| Next step | If false positives appear, split physical checks into a standalone detailed report with per-check toggles. |

## P14 Detailed Plan: One-Command Local Install

| Field | Content |
| --- | --- |
| Project goal | Reduce installation friction for other Codex projects from manual copy plus marketplace editing to one CLI command. |
| Project outputs | `scripts/install-local.js`; CLI command `story-gate.js install-local`; task registry entry `TASK-INSTALL-LOCAL`; docs updates in `quickstart.md`, `help.md`, and `customer-install.md`; regression coverage in `tests/quality-gates.test.js`. |
| Stage design | Install the curated private package file set into `<target>/plugins/story-gate-studio`, upsert `<target>/.agents/plugins/marketplace.json`, initialize `<target>/story-gate-projects/<name>/rule-pack.json`, and run light customer smoke by default. Existing installs must not be overwritten unless `--force` is explicit. |
| Stage implementation | Completed: `scripts/install-local.js`, CLI wiring, task registry, docs, and regression tests. |
| Project tests | `node scripts/story-gate.js validate`; `node --test tests/*.test.js`; direct CLI smoke for `install-local --project <temp> --name <slug> --skip-smoke`; `release-check --checksums`; `customer-install-smoke --zip ... --full`; Codex `validate_plugin.py` after package rebuild. |
| Initial test | Passed: `validate` PASS; `node --test tests/*.test.js` PASS 27/27; install-local test created a temp project, marketplace config, external project rule pack, and refused overwrite without `--force`. |
| Fix and retest | First pass succeeded; no fix cycle required. |
| Acceptance result | Passed. |
| Local commit | Completed: `c13fc9b` (`story-gate: complete P14 one-command install`). |
| Rollback | Revert the P14 commit to return to manual marketplace installation. |
| Evidence | `validate` PASS; `node --test tests/*.test.js` PASS 27/27; `P14 install-local creates one-command project installation` PASS; `release-check --checksums` PASS; zip `customer-install-smoke --full` PASS; Codex `validate_plugin.py` PASS; `SHA256SUMS.txt` updated with the final archive checksum. |
| Next step | After validation, rebuild the private commercial trial package so the one-command installer is included in customer zip. |

## P15 Detailed Plan: Dual Timeline and Closed-loop Evidence Gates

| Field | Content |
| --- | --- |
| Project goal | Bring the new dual-timeline body continuity, observed-fact immutability, and cross-boundary artifact lifecycle rules into the reusable plugin without copying source-project private objects. |
| Stage design | Add `SGM-DUAL-001`: `R001` blocks missing both-body/time/care continuity for body-switch or dual-timeline chapters; `R002` blocks retroactive changes to already observed facts; `R003` blocks cross-boundary artifact exceptions that lack old state, source state, active trigger, one-way cost, handoff/use, and final evidence state. |
| Project outputs | `scripts/chapter-gate.js`; `references/rule-pack.json` version `0.1.4`; three blocked fixtures and expected reports; `skills/chapter-workbench/SKILL.md`; `docs/traceability.md`; `docs/quickstart.md`; rebuilt deliverable package. |
| Project tests | `node scripts/story-gate.js validate`; `node --test tests/*.test.js`; three `chapter-gate` CLI fixtures for `SGM-DUAL-001-R001/R002/R003`; `release-check --checksums`; `customer-install-smoke --zip ... --full`; Codex `validate_plugin.py`. |
| Initial test | Passed: `validate` PASS; `node --test tests/*.test.js` PASS 27/27; dual-body fixture blocked with `SGM-DUAL-001-R001`; observed-fact fixture blocked with `SGM-DUAL-001-R002`; cross-artifact fixture blocked with `SGM-DUAL-001-R003`. |
| Fix and retest | First pass succeeded; no fix cycle required. |
| Acceptance result | Passed. |
| Local commit | Completed: `3aa0a04` (`story-gate: complete P15 dual timeline evidence gates`). |
| Rollback | Revert the P15 commit to return to `universal-novel@0.1.3` behavior without dual-timeline and closed-loop evidence blockers. |
| Evidence | `validate` PASS; `node --test tests/*.test.js` PASS 27/27; three `chapter-gate` CLI fixtures returned expected blocker rule ids. |
| Next step | If false positives appear in non-fantasy suspense projects, move these checks behind a `dual_world` project rule-pack flag while keeping the fixture coverage. |

## P17 Detailed Plan: Blind-read Gate

| Field | Content |
| --- | --- |
| 项目目标 | Add a reusable blind-read governance gate for single-chapter and continuous reading tests, including ticket isolation, version lock, old-ticket invalidation, vote-by-vote pass rules, and split formal-quality/page-turner scoring. |
| 项目产出 | `references/blind-read-review-rules.md`; `scripts/blind-read-gate.js`; `story-gate.js blind-read-gate`; `SGM-BLIND-001` rules in `references/rule-pack.json`; host adapter support; task registry entry; fixtures and expected reports; quickstart/help/design/traceability docs. |
| 项目测试 | `node scripts/story-gate.js blind-read-gate examples/fixtures/blind-read-pass.json`; blocked fixture checks for isolation, average-mask, and continuous-read failures; `node --test tests/*.test.js`; `node scripts/story-gate.js validate`; private package and customer smoke after package rebuild. |
| 验收结果 | Passed. |
| 阶段设计 | Treat blind-read as `SGM-BLIND-001`, attached to `third-party-review`, with method-only universal rules and no private manuscript material. |
| 阶段实现 | Implement a JSON-in/StoryGateReport-out CLI and Host Adapter task so Codex, containers, agents, and CI can all run the same gate. |
| 初次测试 | Initial run found UTF-8 BOM in JSON files after PowerShell version sync; `JSON.parse` failed in fixture and host-adapter checks. |
| 修正复测 | Removed BOM from affected files and added BOM tolerance to `scripts/lib.js`; retest passed: `validate` PASS, `node --test tests/*.test.js` PASS 29/29, Host Adapter blind-read smoke PASS. |
| 完成验收 | Passed: rebuilt private package, rebuilt release archive, `release-check --checksums` PASS, `customer-install-smoke --zip ... --full` PASS, Codex `validate_plugin.py` PASS. Archive SHA256 `423b50ba3dd23d136c561e2be73009d00710a2c8accbfcac745a0c361cf84aec`. |
| 本地提交 | Completed: `8223f8d` (`story-gate: complete P17 blind read gate`). |
| commit hash | `8223f8d` |
| 回滚方式 | Revert P17 commit, restore `universal-novel@0.1.4` package outputs, and rerun `validate`, fixture regression, and customer install smoke. |

## P18 Detailed Plan: Blind-read Temporary Agent Isolation

| Field | Content |
| --- | --- |
| 项目目标 | Ensure every blind-read task uses an internal temporary agent rather than the current conversation context or a visible retained task. |
| 项目产出 | `SGM-BLIND-001-R013`; `scripts/blind-read-gate.js` execution check; updated `references/blind-read-review-rules.md`; `blind-read-context-leak-block.json` fixture and expected report; test assertions; rebuilt deliverable package. |
| 项目测试 | `node scripts/story-gate.js blind-read-gate examples/fixtures/blind-read-context-leak-block.json`; `node scripts/story-gate.js validate`; `node --test tests/*.test.js`; `release-check --checksums`; `customer-install-smoke --zip ... --full`; Codex `validate_plugin.py`. |
| 验收结果 | Passed. |
| 阶段设计 | Treat blind-read execution isolation as a hard blocker: internal temporary agent, no previewable task, no inherited current context, discard after readback, and no sidebar entry. |
| 阶段实现 | Completed: added `SGM-BLIND-001-R013`, execution isolation checks, context-leak fixture, expected report, docs, and regression tests. |
| 初次测试 | Passed: `blind-read-context-leak-block.json` blocked with `SGM-BLIND-001-R013`; fixture regression PASS; `node --test tests/*.test.js` PASS 29/29. |
| 修正复测 | No fix cycle required after implementation; prior PowerShell JSON update issue was avoided by using Node JSON serialization. |
| 完成验收 | Passed: `validate` PASS; Codex `validate_plugin.py` PASS; rebuilt private package file_count `137`; `release-check --checksums` PASS; `customer-install-smoke --zip ... --full` PASS. Archive SHA256 is recorded in `story-gate-deliverables/SHA256SUMS.txt`. |
| 本地提交 | Completed: `73a5318` (`story-gate: enforce blind read temporary agent isolation`). |
| commit hash | `73a5318` |
| 回滚方式 | Revert P18 commit `73a5318`, restore `universal-novel@0.1.5` behavior, and rerun blind-read fixture regression. |
