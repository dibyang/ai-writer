# 故事门禁工作室规则映射追踪表

## 用途

本文用于追踪 `story-gate-studio` 插件的每个能力模块来自本项目哪份经验文档、未来应落到哪个插件文件、如何验收。

规则迁移原则：

1. 通用规则只抽象方法，不搬运源项目的私有人名、案名、物证和终局设定。
2. 项目私有规则可以作为 `project_rule_pack`，但不能进入 `universal-novel`。
3. 每个模块必须能回溯到来源文档。
4. 每个报告 finding 必须带 `rule_id` 和 `source_refs`。

## 编号规范

| 前缀 | 含义 |
| --- | --- |
| `SGM-ARCH` | 项目架构、卷级结构、项目圣经 |
| `SGM-CHAP` | 章节开写卡、滚动分场、正文准备 |
| `SGM-REV` | 第三方审稿、质量审查 |
| `SGM-BLIND` | 单章/连续盲读、票据隔离、逐票裁定 |
| `SGM-FBK` | 外部意见处理 |
| `SGM-GATE` | 发布门禁、机械审核 |
| `SGM-MKT` | 爆款冷读、市场上限 |
| `SGM-READ` | 易懂性、反烧脑、普通读者明线 |
| `SGM-EMO` | 刀感、情绪杀伤力、人味余震 |
| `SGM-VIS` | 视觉资产、提示词、版本、selected 入库 |
| `SGM-SCR` | 剧本、短剧、分镜和视觉转译 |
| `SGM-TRACE` | 追踪、报告、状态记录 |
| `SGM-QA` | 自动化测试、fixture、质量门禁 |
| `SGM-BIZ` | 商业化、授权、分发、隐私和发布包边界 |
| `SGM-PILOT` | 客户试点、售后支持、诊断包和商品化验证 |

## 模块追踪总表

| 模块编号 | 插件能力 | 来源文档 | 未来插件落点 | 验收标准 |
| --- | --- | --- | --- | --- |
| SGM-ARCH-001 | 项目圣经生成器 | `资料/01_创作规则.md`、`资料/02_核心设定.md`、`资料/03_人物表.md` | `skills/story-architect/SKILL.md`、`references/universal-novel-rules.md` | 能从一句话卖点生成类型定位、核心卖点、主角、世界规则、禁区和追踪表目录 |
| SGM-ARCH-002 | 卷级架构工作台 | `卷纲/000_全书结构.md`、`资料/19_长线悬念与连载抗压规则.md`、`资料/20_追更节奏与情绪账本.md` | `skills/story-architect/SKILL.md`、`references/volume-architecture-template.md` | 每卷有主钩子、阶段回报、长线推进、禁止抢戏信息 |
| SGM-CHAP-001 | 章节开写门禁 | `资料/15_章节写作模板与发布流程.md`、`资料/23_全书开写门禁与执行总控.md` | `skills/chapter-workbench/SKILL.md`、`references/chapter-card-template.md` | 主事件、处境变坏、明线一句话、章末追问缺失时必须阻止开写 |
| SGM-CHAP-002 | 滚动分场执行稿 | `资料/18_滚动分场细纲规则.md`、`资料/15_章节写作模板与发布流程.md` | `skills/chapter-workbench/SKILL.md`、`references/rolling-scene-template.md` | 只规划未来 2-3 章，每场有入场承接、出场推力、画面锚点、禁止说透 |
| SGM-REV-001 | 第三方冷读审核 | `资料/08_第三方审稿规则.md`、`资料/24_悬疑小说质量审查规则.md` | `skills/third-party-review/SKILL.md`、`references/third-party-review-rubric.md` | 先输出弃读风险，不替项目辩护，不直接改正文 |
| SGM-BLIND-001 | 单章与连续盲读审核 | `references/blind-read-review-rules.md` | `skills/third-party-review/SKILL.md`、`scripts/blind-read-gate.js`、`references/rule-pack.json` | 版本锁定、临时任务执行、票据类型、隔离、旧票失效、逐票通过、单章/连续边界和双评分均可审核 |
| SGM-FBK-001 | 外部意见采纳裁判 | `资料/09_对待第三方意见规则库.md`、`资料/07_外部反馈采纳与开放问题.md` | `skills/feedback-triage/SKILL.md`、`references/feedback-triage-rubric.md` | 每条意见归类为直接采纳、暂定采纳、开放问题或忽略 |
| SGM-GATE-001 | 发布门禁审核 | `资料/01_创作规则.md`、`资料/15_章节写作模板与发布流程.md`、`tools/novel-publish-audit.js` | `skills/release-gate/SKILL.md`、`scripts/story-gate-audit.js` | 检查字数、格式、TODO、工程词、元叙事、禁用词、考据残留 |
| SGM-GATE-002 | 跨章模板扫描 | `tools/novel-template-scan.js`、`资料/24_悬疑小说质量审查规则.md` | `scripts/story-template-scan.js` | 能发现跨章相似段、同类句式和重复压迫结构 |
| SGM-PROOF-001 | 逐句错字病句校对 | `资料/15_章节写作模板与发布流程.md`、`资料/24_悬疑小说质量审查规则.md` | `skills/release-gate/SKILL.md`、`skills/chapter-workbench/SKILL.md`、`references/rule-pack.json` | 正式发布前必须记录人工逐章逐句校对范围；机械扫描不能替代人工校对 |
| SGM-MKT-001 | 爆款冷读复审 | `资料/20_追更节奏与情绪账本.md`、`资料/24_悬疑小说质量审查规则.md`、`资料/26_发布前定向精修执行清单.md` | `skills/blockbuster-review/SKILL.md`、`references/blockbuster-rubric.md` | 必须分列发布门禁、外部冷读分、爆款上限风险 |
| SGM-READ-001 | 易懂性/反烧脑审核 | `资料/29_易懂性与反烧脑审核规则.md`、`资料/28_专业名词首次出现追踪表.md` | `references/readability-rules.md` | 普通读者能回答发生了什么、谁危险、什么变坏、下一章追什么 |
| SGM-EMO-001 | 刀感与情绪杀伤审核 | `资料/27_刀感与情绪杀伤力规则.md`、`资料/26_发布前定向精修执行清单.md` | `references/knife-emotion-rules.md` | 每个高强度刀点必须有刀前人味、刀落具体、刀后余震 |
| SGM-VIS-001 | 视觉资产总控 | `视觉资产/README.md`、`视觉资产/00-视觉风格圣经.md`、`视觉资产/01-人物视觉索引.md`、`视觉资产/02-道具视觉索引.md` | `skills/visual-asset-manager/SKILL.md`、`references/visual-style-rules.md` | 角色、道具、场景、阵营、提示词和 selected 状态均有入口和版本记录 |
| SGM-VIS-002 | 视觉一致性审核 | `视觉资产/短剧/selected入库规则.md`、`视觉资产/短剧/视觉交付清单.md`、`视觉资产/短剧/物证道具总表.md` | `skills/visual-asset-manager/SKILL.md`、`scripts/visual-asset-audit.js` | 不符合角色卡、道具证据功能、文字可读性或风格圣经时不得入 selected |
| SGM-SCR-001 | 短剧/剧本适配 | `视觉资产/短剧/试制视频脚本-木牌开场90秒.md`、`视觉资产/短剧/分镜视觉规范.md` | `skills/screenplay-adapter/SKILL.md`、`references/screenplay-adapter-rules.md` | 只有 `mode=screenplay` 或 `mode=short_drama` 时输出镜头、声音、字幕和道具 |
| SGM-SCR-002 | 短剧生产清单 | `视觉资产/短剧/试制视频总控.md`、`视觉资产/短剧/试制视频拍摄清单.md`、`视觉资产/短剧/试制视频剪辑与声音规范.md`、`视觉资产/短剧/试制视频AI生成提示词.md` | `skills/screenplay-adapter/SKILL.md`、`references/short-drama-production-rules.md` | 能生成 60/90 秒试制包、拍摄清单、AI 提示词、剪辑声音规范和交付清单 |
| SGM-TRACE-001 | 报告追踪 | `plugins/story-gate-studio/docs/architecture.md` | `references/rule-pack.schema.json`、`scripts/validate-report.js` | 每条 finding 有 `rule_id`、`source_refs`、`severity`、`location` |
| SGM-QA-001 | 自动化质量门禁 | `plugins/story-gate-studio/docs/architecture.md` | `scripts/run-quality-gates.js`、`scripts/validate-rule-pack.js`、`scripts/validate-report.js` | QG-001 到 QG-009 全部通过才允许发布 Codex 插件；P4 起 QG-010 也必须通过 |
| SGM-QA-002 | Fixture 回归测试 | `plugins/story-gate-studio/docs/traceability.md` | `examples/fixtures/`、`examples/expected-reports/`、`scripts/validate-fixtures.js` | 已知好/坏样例结论稳定，规则变更不得让门禁误放或误杀 |
| SGM-BIZ-001 | 商业化分发策略 | `plugins/story-gate-studio/docs/commercialization.md` | `docs/commercialization.md`、`marketplace.private.example.json`、`LICENSE.md` | 第一阶段支持自有收款 + 私有 Git/压缩包/私有 marketplace 分发，不依赖官方公开市场 |
| SGM-BIZ-002 | 商业发布包边界 | `plugins/story-gate-studio/docs/commercialization.md` | `scripts/commercial-release-check.js`、`scripts/private-package-check.js`、`scripts/build-private-package.js`、`scripts/build-release-archive.js`、`references/private-content-blocklist.json`、`references/private-package-manifest.json` | 发布包不得包含源项目私有素材、第三方反馈原文或未经确认的视觉资产 |
| SGM-PILOT-001 | 客户试点与支持闭环 | `plugins/story-gate-studio/docs/customer-pilot.md`、`plugins/story-gate-studio/docs/support-playbook.md` | `scripts/customer-pilot.js`、`scripts/support-bundle.js`、`examples/customer-pilot/`、`references/license-profile.json` | 匿名客户项目能完成规则、审核、门禁、host 和支持包检查，支持包不得复制章节正文 |

## 当前已落地文件追踪

| 类别 | 文件 | 覆盖 |
| --- | --- | --- |
| 插件 manifest | `.codex-plugin/plugin.json` | QG-001 |
| 规则包 | `references/rule-pack.json`、`references/rule-pack.schema.json` | QG-002 |
| 请求 schema | `references/request.schema.json` | QG-011 |
| 报告 schema | `references/report.schema.json` | QG-003 |
| 质量门禁 schema | `references/quality-gate.schema.json` | QG-011 |
| 任务注册表 | `references/task-registry.json`、`references/task-registry.schema.json` | QG-012 |
| 质量门禁脚本 | `scripts/run-quality-gates.js` | QG-001 到 QG-013、BIZ-QG |
| 结构校验 | `scripts/validate-plugin-structure.js` | QG-001 |
| 规则包校验 | `scripts/validate-rule-pack.js` | QG-002 |
| 报告校验 | `scripts/validate-report.js` | QG-003 |
| fixture 回归 | `scripts/validate-fixtures.js` | QG-004、QG-006 |
| 发布门禁 smoke | `scripts/story-gate-audit.js` | QG-008、SGM-GATE-001 |
| 模板扫描 smoke | `scripts/story-template-scan.js` | QG-008、SGM-GATE-002 |
| 项目索引 smoke | `scripts/story-index.js` | QG-008 |
| 视觉资产审核 smoke | `scripts/visual-asset-audit.js` | QG-007、QG-008、SGM-VIS-001 |
| 商业发布检查 | `scripts/commercial-release-check.js` | BIZ-QG-001 到 BIZ-QG-006 |
| 私有商业包检查 | `scripts/private-package-check.js`、`references/private-package-manifest.json`、`docs/private-package.md` | BIZ-QG 私有交付清单、禁止目录、私有标记扫描和安装 smoke |
| 私有商业包构建 | `scripts/build-private-package.js`、`story-gate.js build-private-package` | BIZ-QG 构建产物与交付清单一致 |
| 私有商业包归档 | `scripts/build-release-archive.js`、`story-gate.js build-release-archive` | BIZ-QG zip 归档与 SHA256 清单一致 |
| 客户项目规则包模板 | `templates/project-rule-pack/`、`scripts/init-project-rule-pack.js`、`docs/project-rule-pack-template.md` | P5 模板初始化、外部目录隔离、`project-rule-check` 回归 |
| 客户试点闭环 | `examples/customer-pilot/`、`scripts/customer-pilot.js`、`docs/customer-pilot.md` | P9 匿名客户项目端到端试点 |
| 售后支持包 | `scripts/support-bundle.js`、`docs/support-playbook.md`、`references/license-profile.json` | P9 不含正文的支持诊断与授权档位记录 |
| 核心审核评分卡 | `scripts/review-scorecard.js`、`docs/review-capability-enhancement.md`、`examples/fixtures/review-scorecard-*.md` | P6 冷读、易懂性、追读和情绪评分回归 |
| 盲读审核门禁 | `scripts/blind-read-gate.js`、`references/blind-read-review-rules.md`、`examples/fixtures/blind-read-*.json` | P16 单章/连续盲读票据隔离、逐票通过、双评分和旧票失效回归 |
| Host Adapter | `scripts/host-adapter.js`、`references/host-adapter.schema.json`、`examples/host-adapter/`、`docs/host-adapter.md` | P7 agent/container/CI JSON request-response smoke |
| 商业就绪检查 | `scripts/commercial-readiness-check.js`、`references/commercial-readiness.json`、`docs/commercial-operations.md` | P8 授权、试用、隐私、支持和禁用营销承诺门禁 |
| 设计契约检查 | `scripts/validate-design-contracts.js`、`docs/v0.1-design.md` | QG-011 |
| 任务注册表检查 | `scripts/validate-task-registry.js`、`docs/implementation-plan.md` | QG-012 |
| 发布版本检查 | `scripts/release-check.js`、`references/release-manifest.json`、`CHANGELOG.md`、`RELEASE.md` | QG-013 |
| 请求契约样例 | `examples/requests/chapter-gate-request.json` | QG-011 |
| Node 测试 | `tests/quality-gates.test.js` | 所有已落地门禁的自动化断言 |

## 规则抽象边界

| 来源中的项目私有内容 | 通用抽象方式 | 是否进入通用规则 |
| --- | --- | --- |
| 源项目主角 | 主角/职业型主角/调查者 | 是，抽象后进入 |
| 源项目关系角色 | 可信与可疑并存的关系角色 | 是，抽象后进入 |
| 源项目核心物件 | 核心物证/警告物 | 是，抽象后进入 |
| 源项目重要死者 | 重要死者/受害者主动成证 | 是，抽象后进入 |
| 源项目双线世界 | 双线叙事/异质世界/历史线 | 是，抽象后进入 |
| 现代法医术语 | 专业题材术语 | 是，抽象后进入 |
| 源项目强物证组合 | 长线强物证 | 只作为项目私有示例，不进通用规则 |
| 第一卷三夜倒计时 | 卷级倒计时结构 | 是，抽象后进入 |
| 源项目终卷闭环表达 | 终局闭环主题 | 只作为项目私有示例，不进通用规则 |
| 角色定妆、关键物件等视觉卡 | 角色视觉卡/关键物证视觉卡 | 是，抽象后进入 |
| 关键物件开场 90 秒试制 | 60/90 秒短剧试制包模板 | 是，抽象后进入 |

## 能力验收清单

### SGM-CHAP-001 章节开写门禁

必须检查：

- 本章主事件是否是具体事件，而不是查资料、确认规则、怀疑某人。
- 本章是否有处境变坏。
- 本章是否有普通读者明线一句话。
- 本章是否有可见画面锚点。
- 本章是否有转场承接。
- 本章章末是否有具体追问。
- 本章是否出现专业名词首现且未给读者抓手。

阻止条件：

- 主事件缺失。
- 处境变坏缺失。
- 明线一句话写不出。
- 章末只剩气氛或抽象问题。

### SGM-REV-001 第三方冷读审核

必须检查：

- 陌生读者会不会点下一章。
- 主角是否只是功能工具。
- 重要关系角色是否只负责解释或封口。
- 案件敌人、利益链和压迫现场是否具体。
- 设定是否拖慢剧情。
- 当前章节是否把后文解释当成当前问题的挡箭牌。

禁止：

- 默认替项目辩护。
- 用“后面会解释”放过当前章节风险。
- 未获授权直接修改正式正文。

### SGM-BLIND-001 单章与连续盲读审核

必须检查：

- 每轮盲读是否先锁定日期、文件顺序、字数、Git 提交号或未提交文件修改时间、附栏状态、票据类型和问卷版本。
- 真人盲读票、隔离代理票、知情审查是否分开统计。
- 盲读者是否只接触锁定正文、中性任务说明和标准问卷。
- 任务说明是否暗示作者担忧、上一轮结论、重点检查段落或后续剧情。
- 是否使用内部临时代理执行，且不创建可预览任务、不继承当前对话上下文、读取结果后丢弃、不在侧边栏保留入口。
- 实质改稿后，旧票是否标为历史参考，而不是继续显示为当前分数。
- 单章盲读和连续盲读是否分开裁定。
- 是否逐票通过，而不是用平均分覆盖失败票。
- 正式质量分和追读/商业黏性分是否分开输出。

阻止条件：

- 版本锁定信息缺失。
- 知情审查或混合票据冒充盲读票。
- 盲读隔离被破坏。
- 使用当前对话上下文、普通可预览任务、保留侧边栏入口或未丢弃结果的任务冒充盲读。
- 只用一张筛查票宣称正式通过。
- 单章通过冒充连续通过或发布前结论。
- 任意正式裁定票未读完、复述错误、关键误读、续读分未达线或不愿立即继续。
- 连续盲读未按章序、少于三章、缺少逐章即时记录或疲劳节点。
- 正式质量分和追读分合并。

### SGM-GATE-001 发布门禁

机械检查：

- 字数硬下限和建议线。
- 标题与正文格式。
- TODO、占位、模板词。
- 系统文、任务面板、金手指等禁用表达。
- 元叙事词和创作工程词残留。
- 乱码和替换字符。
- 核心术语误写或混写。

人工复查：

- 机械审核通过不等于可以发布。
- 仍需检查语言、追读、易懂性、刀感、术语首现和市场冷读。

### SGM-MKT-001 爆款冷读复审

必须输出：

- 发布门禁判定：通过/阻止发布。
- 外部市场冷读分：0-100。
- 爆款上限风险：低/中/高。
- 若门禁通过但冷读低于 90，必须写明：可发布，但不建议称为满血爆款终稿。

不得：

- 把内部 97 分等同于市场 97 分。
- 把规则补齐等同于读者上头。
- 把闭环完整等同于爆款追读强通过。

### SGM-READ-001 易懂性审核

每章必须回答：

1. 发生了什么？
2. 谁更危险、更难脱身或更不被相信？
3. 关键线索表面有什么用？
4. 章末什么变坏？
5. 下一章为什么必须继续看？

失败信号：

- 读者只觉得专业、高级、复杂。
- 读者说不出谁危险。
- 高潮只发生在报告、屏幕、归档、标注和复核状态里。
- 隐藏线索靠看不懂术语隐藏。

### SGM-EMO-001 刀感审核

每个高强度情绪点必须回答：

- 刀子扎向谁。
- 读者在刀落前知道他/她想保住什么。
- 刀落在哪个具体物件、动作或选择上。
- 被切掉的是什么。
- 下一场发生了什么余震。
- 受伤者是否赢回一点。

失败信号：

- 只能概括为制度残酷、记录会害人、历史很冷。
- 受伤者没有刀前人味。
- 刀点结束后下一场正常推进。
- 死者只负责让主角成长。

### SGM-VIS-001 视觉资产总控

必须检查：

- 角色是否有视觉卡、提示词记录和版本状态。
- 道具是否说明剧情优先级、证据功能、出镜场景和制作状态。
- 场景、阵营、提示词包是否有统一入口。
- 图片是否放在 `reference`、`draft` 或 `selected` 对应目录。
- selected 文件是否能追溯到提示词和结果评价。

失败信号：

- 图片有了，但没有角色卡、道具卡或提示词记录。
- 道具图漂亮但看不出证据功能。
- 视觉资产和小说设定冲突。
- selected 入库没有验收依据。

### SGM-VIS-002 视觉一致性审核

必须检查：

- 角色年龄感、气质、服装、标志物是否与角色卡一致。
- 道具文字是否可读，且没有提前剧透。
- 古代文字道具是否符合项目文字规范。
- 风格是否偏离视觉风格圣经。
- 是否能被真人短剧方案转译，而不是只适合生成图观赏。

失败信号：

- 角色过度偶像化、游戏皮肤化或与同阵营人物混淆。
- 物证特写不可读。
- 视觉风格偏甜宠、仙侠、猎奇惊悚或纯氛围。
- 没有演员、造型、道具或镜头落地路径。

### SGM-SCR-002 短剧生产清单

必须输出：

- 正片脚本或场次脚本。
- 分镜表。
- 拍摄清单。
- 角色出镜策略。
- 物证道具清单。
- AI 生成提示词或实拍制作建议。
- 剪辑与声音规范。
- 交付清单和验收口径。

禁止：

- 用短剧分镜反向要求小说正文剧本化。
- 用大段空镜解释世界观。
- 让古装场景只剩漂亮背景，没有压迫和信息。

## 报告字段追踪

| 字段 | 说明 | 必须性 |
| --- | --- | --- |
| `report_id` | 报告唯一 ID | 必须 |
| `module_id` | 能力模块编号 | 必须 |
| `mode` | novel/visual/screenplay/short_drama | 必须 |
| `rule_pack` | 通用规则包版本 | 必须 |
| `project_rule_pack` | 项目私有规则包版本 | 可选 |
| `target_refs` | 被审核/生成的目标文件 | 必须 |
| `source_refs` | 规则来源文件 | 必须 |
| `verdict` | 通过、阻止、需精修等 | 必须 |
| `findings[].rule_id` | 命中的规则编号 | 必须 |
| `findings[].severity` | low/medium/high/blocker | 必须 |
| `findings[].location` | 文件路径或章节位置 | 尽量必须 |
| `findings[].recommendation` | 建议方向 | 必须 |

## 规则包拆分决策

规则包第一版采用三层小说规则加可选扩展包。`universal-novel`、`suspense-novel`、`web-serial` 作为小说主链路；视觉资产、剧本和短剧通过独立扩展包启用，不默认污染 `mode=novel`。

| 规则包 | 范围 | 依赖 |
| --- | --- | --- |
| `universal-novel` | 通用长篇小说结构、章节、人物、发布门禁 | 无 |
| `web-serial` | 追更节奏、章末钩子、三章/十章回报 | `universal-novel` |
| `suspense-novel` | 案件逻辑、线索公平、误导、反转 | `universal-novel` |
| `professional-fiction` | 法医、考古、职场、专业术语首现 | `universal-novel` |
| `dual-world` | 双时空、梦入、异世界、时间线互证 | `universal-novel` |
| `visual-asset` | 角色视觉卡、道具卡、提示词、版本、selected 入库 | 无 |
| `screenplay` | 场次、对白、动作、镜头、字幕 | 无 |
| `short-drama` | 60/90 秒短剧、分镜、道具、声音、剪辑 | `screenplay`、`visual-asset` |

## 报告保存策略

| 报告类型 | 是否落盘 | 建议路径 | 理由 |
| --- | --- | --- | --- |
| 发布门禁报告 | 是 | `reports/release-gate/` | 影响是否发布，必须可复盘 |
| 自动化质量门禁报告 | 是 | `reports/quality-gates/` | 影响插件是否发布，必须可追踪 |
| 架构决策/重大规划报告 | 是 | `reports/architecture/` 或 `资料/` | 影响长期方向，必须纳入文档链 |
| 第三方深度审稿 | 是 | `reports/third-party-review/` | 影响大修取舍，需保留证据 |
| 普通即时反馈 | 否，可选 | 对话输出或临时草稿 | 不影响长期决策时可不落盘 |
| 视觉/短剧交付验收 | 是 | `reports/visual/`、`reports/short-drama/` | 需要追踪版本、提示词、selected 依据 |

## 自动化测试门禁

| 门禁编号 | 覆盖模块 | 自动化目标 | 失败处理 |
| --- | --- | --- | --- |
| QG-001 | SGM-QA-001 | 校验插件 manifest、技能、规则、脚本、样例目录存在 | 禁止发布插件 |
| QG-002 | SGM-QA-001、SGM-TRACE-001 | 校验规则包 schema、模块编号唯一、来源可追踪 | 禁止发布规则包 |
| QG-003 | SGM-TRACE-001 | 校验报告必填字段、finding 的 `rule_id` 和 `source_refs` | 禁止交付报告 |
| QG-004 | SGM-QA-002 | 对 fixtures 做回归，比较关键结论和 expected reports | 禁止合并规则变更 |
| QG-005 | SGM-REV-001、SGM-QA-001 | `review_only=true` 时验证不修改正文、视觉资产、短剧脚本 | 阻断执行并输出越权报告 |
| QG-006 | SGM-SCR-001、SGM-VIS-001 | 验证 `mode=novel` 不输出分镜/镜头/拍摄清单，视觉与短剧必须显式启用 | 禁止发布插件 |
| QG-007 | SGM-VIS-002 | selected 资产必须具备视觉卡、提示词记录、版本、入库依据和用途说明 | 禁止入 selected |
| QG-008 | SGM-GATE-001、SGM-GATE-002、SGM-VIS-002 | 脚本 smoke，确保退出码和 JSON 输出可解析 | 禁止发布脚本 |
| QG-009 | SGM-QA-001 | 检查中文文档、规则包、报告是否出现替换字符或明显乱码标记 | 禁止发布文档 |
| QG-010 | SGM-QA-001 | 容器 CLI 在无 Codex skill 环境下能输出 Markdown + JSONL | P4 起强制 |
| QG-011 | SGM-QA-001 | 校验 `docs/v0.1-design.md` 中列出的 skill、schema、脚本和 fixture 均真实存在 | 禁止进入 v0.1 实现阶段 |
| QG-012 | SGM-QA-001 | 校验 `references/task-registry.json` 中的任务、skill、module、mode、测试和完成标准一致 | 禁止进入功能实现阶段 |
| QG-013 | SGM-QA-001、SGM-BIZ-001 | 校验 `references/release-manifest.json`、`CHANGELOG.md`、`RELEASE.md`、版本化 zip 名、质量证据和回滚路径一致 | 禁止交付版本包 |

## 商业化门禁

| 门禁编号 | 覆盖模块 | 自动化/人工目标 | 失败处理 |
| --- | --- | --- | --- |
| BIZ-QG-001 | SGM-BIZ-002 | 扫描发布包中是否含源项目私有人名、案名、章节正文、视觉图片和终局设定 | 禁止商业发布 |
| BIZ-QG-002 | SGM-BIZ-001 | 检查 license、版本号、适用范围、更新策略和支持入口 | 禁止商业发布 |
| BIZ-QG-003 | SGM-BIZ-001、SGM-QA-001 | 新环境通过私有 marketplace 配置安装并运行最小 fixture | 禁止交付客户 |
| BIZ-QG-004 | SGM-BIZ-001 | 文档明确默认本地运行、上传边界和用户作品归属 | 禁止公开销售 |
| BIZ-QG-005 | SGM-BIZ-001 | 上架或公开销售前复核 Codex/OpenAI、支付渠道和分发平台最新条款 | 禁止上架 |
| BIZ-QG-006 | SGM-BIZ-001 | 营销文案不得承诺爆款、签约、收益或平台推荐 | 禁止发布营销页 |

自动化门禁报告字段：

| 字段 | 含义 | 必填 |
| --- | --- | --- |
| `quality_gate_run_id` | 门禁执行 ID | 必须 |
| `plugin_version` | 插件版本 | 必须 |
| `rule_pack_version` | 规则包版本 | 必须 |
| `fixture_version` | fixture 集版本 | 必须 |
| `passed_gates` | 通过的 QG 编号 | 必须 |
| `failed_gates` | 失败的 QG 编号和原因 | 必须 |
| `host` | codex/cli/container/other-agent | 必须 |
| `readonly_violation` | 是否发现越权写入 | 必须 |
| `mode_isolation_violation` | 是否发现模式污染 | 必须 |

## 待建立测试样例

| 测试 ID | 目标 | 样例来源 |
| --- | --- | --- |
| TEST-CHAP-NO-EVENT | 主事件只有查资料时阻止开写 | 从章节开写卡构造 |
| TEST-READ-NO-MAINLINE | 明线一句话写不出时易懂性失败 | 从高密度旧案回收构造 |
| TEST-EMO-CONCEPT-KNIFE | 刀子只扎向概念时失败 | 从刀感规则构造 |
| TEST-MKT-SPLIT-SCORE | 发布过线但市场冷读低于 90 | 从发布前定向精修规则构造 |
| TEST-GATE-META-LEAK | 正文残留本章/上一章/提纲等词 | 从发布审核脚本构造 |
| TEST-VIS-NO-PROMPT | selected 图片缺提示词记录时失败 | 从视觉资产更新流程构造 |
| TEST-VIS-PROP-UNREADABLE | 物证道具不可读时不得入 selected | 从物证道具总表构造 |
| TEST-SCR-MODE-GUARD | novel 模式不得输出分镜表 | 从短剧适配规则构造 |
| TEST-SCR-PRODUCTION-PACK | 短剧模式能输出脚本、分镜、拍摄、AI 提示词和剪辑规范 | 从试制视频总控构造 |
| TEST-QA-REPORT-MISSING-SOURCE | 报告 finding 缺 `source_refs` 时失败 | 从报告 schema 构造 |
| TEST-QA-REVIEW-ONLY-NO-EDIT | 只读审稿尝试改正文时失败 | 从第三方审稿规则构造 |
| TEST-QA-MODE-ISOLATION | novel/visual/screenplay/short_drama 模式互不污染 | 从 mode 规则构造 |
| TEST-QA-ENCODING | 中文规则包或报告出现替换字符时失败 | 从编码门禁构造 |
| TEST-QA-CONTAINER-SMOKE | 容器 CLI 能输出 Markdown + JSONL | 从 P4 CLI 设计构造 |
## P11 Trace Addendum: SGM-PHY-001 Physical Logic and Operability

| Field | Value |
| --- | --- |
| Module id | `SGM-PHY-001` |
| Capability | Physical logic and operability gate |
| Source documents | project docs 15 chapter workflow, 23 opening gate control, and 24 suspense quality review |
| Plugin landing files | `references/rule-pack.json`, `scripts/chapter-gate.js`, `skills/chapter-workbench/SKILL.md`, `templates/project-rule-pack/rule-pack.template.json` |
| Acceptance | `chapter-gate` must block when key evidence, injury, trace, concealment, reveal order, or on-page action lacks a physical operability explanation. |
| Test coverage | `examples/fixtures/chapter-gate-physical-block.json`, `examples/fixtures/chapter-gate-physical-vague-block.json`, expected reports, `tests/quality-gates.test.js` |

The universal rule is method-only: it names the required physical reasoning shape, not source-project private evidence chains. Project-specific materials, period constraints, artifact forms, scene procedures, and reveal mechanics belong in external `project_rule_pack` files.

## P12 Trace Addendum: Physical Explanation Quality

| Field | Value |
| --- | --- |
| Stage | `P12` |
| Capability | Low-detail physical explanation blocker |
| Rule id | `SGM-PHY-001-R002` |
| Plugin landing files | `scripts/chapter-gate.js`, `references/rule-pack.json`, `examples/fixtures/chapter-gate-physical-vague-block.json`, `examples/expected-reports/chapter-gate-physical-vague-block.report.json` |
| Acceptance | A non-empty but generic physical explanation must be blocked unless it includes a concrete evidence/action target and at least two support anchors. |

## P13 Trace Addendum: Small Object Handling and State Continuity

| Field | Value |
| --- | --- |
| Stage | `P13` |
| Capability | Small-object action proportion and object-state continuity blocker |
| Rule ids | `SGM-PHY-001-R003`, `SGM-PHY-001-R004` |
| Plugin landing files | `scripts/chapter-gate.js`, `references/rule-pack.json`, `examples/fixtures/chapter-gate-small-object-action-block.json`, `examples/fixtures/chapter-gate-object-continuity-block.json` |
| Acceptance | Small evidence objects must specify size-appropriate handling action; one object must not shift between palm-sized, bundle-sized, fragile, protected, and directly pinched states without explanation. |

## P15 Trace Addendum: Dual Timeline and Closed-loop Evidence Continuity

| Field | Value |
| --- | --- |
| Stage | `P15` |
| Capability | Dual-timeline body continuity, observed-fact immutability, and cross-boundary artifact lifecycle blockers |
| Rule ids | `SGM-DUAL-001-R001`, `SGM-DUAL-001-R002`, `SGM-DUAL-001-R003` |
| Source documents | project docs 33 dual-timeline/body single source, 34 timeline/artifact lifecycle, 35 final structure gate control, and 36 consistency audit |
| Plugin landing files | `scripts/chapter-gate.js`, `references/rule-pack.json`, `skills/chapter-workbench/SKILL.md`, dual blocked fixtures and expected reports |
| Acceptance | Chapters that invoke body switching, already observed facts, or cross-boundary artifacts must provide continuity records; observed facts cannot be retroactively rewritten; artifact exceptions need a full lifecycle and one-way cost. |

This universal rule is method-only. Project-specific bodies, dates, artifacts, names, and closed-loop objects stay in external `project_rule_pack` files.

## P16 Trace Addendum: SGM-PROOF-001 Line-by-line Proofreading

| Field | Value |
| --- | --- |
| Module id | `SGM-PROOF-001` |
| Capability | Dedicated typo, grammar, reference, punctuation, repetition, and label-consistency proofreading gate |
| Plugin landing files | `skills/release-gate/SKILL.md`, `skills/chapter-workbench/SKILL.md`, `references/rule-pack.json`, `references/task-registry.json` |
| Acceptance | Formal release review records the complete reviewed chapter range and performs human line-by-line reading; mechanical search and lint output are supporting evidence only. |

## P17 Trace Addendum: SGM-BLIND-001 Single and Continuous Blind-read Gate

| Field | Value |
| --- | --- |
| Stage | `P17` |
| Capability | Single-chapter and continuous blind-read ticket governance |
| Rule ids | `SGM-BLIND-001-R001` to `SGM-BLIND-001-R013` |
| Source documents | attached universal blind-read rule v1.0, stored as `references/blind-read-review-rules.md` |
| Plugin landing files | `scripts/blind-read-gate.js`, `references/rule-pack.json`, `references/task-registry.json`, `skills/third-party-review/SKILL.md`, `examples/fixtures/blind-read-*.json`, `examples/expected-reports/blind-read-*.report.json` |
| Acceptance | Blind-read summaries must block missing version locks, non-temporary or context-inheriting execution, mixed ticket types, isolation leaks, old-ticket reuse after substantive revision, insufficient formal tickets, single/continuous substitution, merged scores, failed single tickets, weak single strong-pass claims, invalid continuous records, formal-quality failures, and weak continuous page-turner claims. |

## P18 Trace Addendum: Blind-read Temporary Agent Isolation

| Field | Value |
| --- | --- |
| Stage | `P18` |
| Capability | Blind-read execution isolation |
| Rule id | `SGM-BLIND-001-R013` |
| Source documents | user operational rule for temporary blind-read tasks, appended to `references/blind-read-review-rules.md` |
| Plugin landing files | `scripts/blind-read-gate.js`, `references/rule-pack.json`, `references/blind-read-review-rules.md`, `examples/fixtures/blind-read-context-leak-block.json`, `examples/expected-reports/blind-read-context-leak-block.report.json`, `tests/quality-gates.test.js` |
| Acceptance | A blind-read summary must block when it uses the current conversation, creates a previewable task, inherits current context, keeps results after readback, or leaves a sidebar entry. |
