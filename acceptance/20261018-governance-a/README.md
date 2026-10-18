# 0.4.0 最小首批 A：实现与 Codex 实跑验证记录

日期：2026-10-18。最小首批 A 已实现并完成本轮验证，状态为 **0.4.0 候选**；未发布、提交或推送。只覆盖构建识别、创作阶段与授权范围、基础作者决策，以及必要的 schema 3 兼容骨架。不代表八项需求全部完成、真人文学验收或正式发布验收。

## 交付行为

- `tool identify/compare` 只读报告版本、内容指纹、运行时指纹、profile、协议范围和文件差异，新作品副本保存构建清单。同版本号不直接视为同一构建；本批没有自动更新或替换命令。
- 新作品默认 schema 3、增量 changes。正式命令集中记录阶段、当前任务、允许动作、有限正文/修订范围和规划状态。status/context/record-template/record/rewind 及相关写入口检查范围；discussion 不依赖下一章细纲，next_unit 不等于正文授权。
- 作者决策有稳定 ID，支持候选、确认、撤回、同主题同范围取代、逐项采纳/排除/未决；保留冻结原话和本地来源。计划与已发生事实分开，不自动语义采纳或认证作者。
- 旧 schema 1/2 不自动迁移。显式 preview/migrate 保护备份、历史事实和原来源；旧 0.3 实际解析器拒绝 schema 3，doctor 明确报告旧随附工具与状态不兼容，不自动升级。
- [快速入门](../../docs/quickstart.md)、[使用手册](../../docs/user-guide.md)、命令帮助、工作流程、长篇文档及 writer-project 技能同步。默认先规划并明确有限范围，空占位不算作者已采纳规划。

## 最终交付验证

| 检查 | 结果 | 证据 |
| --- | --- | --- |
| 完整回归 | 81 tests / 81 pass / 0 fail / 0 skip | [原始输出](commands/delivery-regression/stdout.raw.txt)、[元数据](commands/delivery-regression/result.json) |
| doctor | ok=true，errors/warnings 为空 | [原始输出](commands/delivery-doctor/stdout.raw.txt) |
| 默认新协议完整 smoke | 初始化、有限授权、规划、上下文、增量登记及检查通过 | [原始输出](commands/delivery-smoke/stdout.raw.txt) |
| 四文体及同版本差异 | 49 次真实 CLI；四文体各一单元，同为 0.3.0 的不同文件被识别 | [摘要](cli-matrix-delivery/summary.json) |
| 旧协议迁移 | 38 次真实 CLI；冻结旧 0.3 创建/登记非空 schema 1/2，迁移保留历史并继续登记；含非法键和不兼容探针 | [摘要](migration-matrix-delivery/summary.json) |
| 最终主 Codex 会话重放 | 24 次真实 CLI，全新初始化到登记、暂停、只读恢复、决策保留、doctor、构建比较，全部符合预期 | [摘要](primary-delivery-r2/summary.json) |
| 最终一致性审计 | ok=true，核源码、构建、样稿、授权、输入证据、拒绝及保护边界 | [结构化结果](final-verification.json)、[命令](commands/final-audit/result.json) |

四文体矩阵使用合成文本；历史事实卡不是真实史料，不计历史创作验收。容量开发脚本另以 10 单元验证原 schema 1/2 对照与新输出目录，不宣称性能收益或百章新协议验收，见 [结果](capacity-entry.json)。内置引擎未改，本轮未运行 test:engine。

最终 [candidate-delivery](sources/candidate-delivery) 与 [final-delivery](sources/final-delivery) 快照共 84 文件，逐项与工作区一致，包含源码、测试、技能、手册及开发脚本。内容标识 `1fdb8d6b7b1698e95291168f46a7874882bcf38e9050c6c7530bb291f4c9e4ba`，运行时标识 `a5d887bfe37406dc570d591786f4776f7c73a328efed5dedc27d8a00c4ae223e`。

candidate-v1 至 v9、candidate-final、final-handoff 系列是过程快照，保留但不冒充终版。冻结旧工具来自 `36bd9c27797a43dd958e74b4e4b8f5b9713e140a`，见 [来源清单](../../tests/fixtures/tool-0.3/source-manifest.json)。旧 0.1/0.2 的模块/profile/协议元数据经过回归，未宣称运行其历史发行版。

## 五轮原生 Codex 会话

均为独立 codex exec 进程，codex-cli 0.163.0-alpha.10.2、Windows、Node 24.15.0，无模型覆盖参数、无子代理。五个进程 exit 0，预期拒绝命令保留非零退出记录。[环境和可执行文件哈希](environment.json)。

| 会话 | 实际覆盖 | 证据 |
| --- | --- | --- |
| native-create | 新写《纸灯札记》六章共 2749 正文汉字，单章 446–471；两次模型连读；六章后暂停正文讨论总纲，next_unit=7，三次越权拒绝。起始 v3，期间有修复 | [报告](native-create/native-one-process-report.md)、[事件](native-create/events.jsonl)、[进程](native-create/process-result.json) |
| native-recover | 文件恢复任务与未决项，六章作品 102 文件不变，主工具及副本六次越权拒绝；另建 v6 微型作品 365 汉字，发现拒绝提示遗漏 | [报告](native-recover/report.md)、[事件](native-recover/events.jsonl)、[进程](native-recover/process-result.json) |
| native-final-check | v7 新建 338 汉字微型作品，有限试写→保留暂缓规划→转讨论→全部暂停；发现 FAQ 残留提示并修正 | [报告](native-final-check/report.md)、[事件](native-final-check/events.jsonl)、[进程](native-final-check/process-result.json) |
| native-reserved-check | v8 六种保留键拒绝后状态可读；合法 toString ID 与幂等重放正常；复用前轮 338 汉字样稿 | [报告](native-reserved-check/report.md)、[事件](native-reserved-check/events.jsonl)、[进程](native-reserved-check/process-result.json) |
| native-delivery-check | v9 实证旧 0.3 完整但不兼容 schema 3 时 doctor 失败，新工具检查通过、旧解析器拒绝，夹具 71 文件不变；重放暂停和决策流程 | [报告](native-delivery-check/report.md)、[事件](native-delivery-check/events.jsonl)、[进程](native-delivery-check/process-result.json) |

独立原创正文共 3452 汉字，后两轮和主会话复制的 338 汉字不重复计入。“已选青岚宗”“先学炼器”与“小盾待选”被分别保留；候选和细节未决不自动转为事实。

最终源码比 v9 多一处旧 0.2 必需模块 profile 修正及开发脚本适配；由本主 Codex 会话完成 24 次真实 CLI 重放和终版回归，不冒称第六轮独立模型创作。五轮模型会话分别证明对应候选上的创作、恢复、发现及修复范围。

模型实读提出教学节奏与后两章交接说明重复；纸样位置跳接的初步怀疑重读确认是不同对象后已撤回，不计缺陷。未实施跨章文学重复自动裁决，未擅改只读恢复对象，也不宣称文学质量已验收。

## 发现与修复

1. **全部暂停仍推荐 discussion**：改为只读 workflow show；[修前](paused-before/result.json)、[修后](paused-after/result.json)。
2. **暂缓规划阻止试写后转回讨论**：无正文动作时保留 deferred 和原因；继续带暂缓项写正文仍需有限 trial 与停止/复盘条件；[修前](deferred-before/result.json)、[修后](deferred-after/result.json)。
3. **拒绝回包及 FAQ 残留越权下一步**：会话二、三发现并补齐，按允许动作/范围提示，全部暂停不暗示另开创作。
4. **保留对象键可写入后使状态不可读**：拒绝 __proto__/constructor/prototype，自有属性判断及落盘前结构检查；合法 toString 与幂等重放仍正常；[修前](reserved-id-before/result.json)、[修后](reserved-id-after/result.json)。故障只发生于独立探针。
5. **旧副本完整但协议不兼容仍被 doctor 判绿**：核对状态与工具协议范围；[修前](commands/doctor-protocol-before-fix/result.json)、[修后](commands/doctor-protocol-after-fix/result.json)。
6. **旧 smoke 依赖隐式授权及完整快照**：适配默认 schema 3、有限授权和 changes；[修前](commands/smoke-before-fix/result.json)、[最终](commands/delivery-smoke/result.json)。容量脚本显式保留原对照、输出放新目录，避免写历史封存记录。

验证辅助失败原样保留：直接 spawn npm.cmd 的 Windows EINVAL、首次旧宿主漏 examples、原生会话一补丁工具拒绝、普通沙箱链接测试跳过、第五会话两次报告脚本错误、主重放首次标签含下划线被记录器拒绝。修正宿主/辅助脚本后使用新目录或新标签复跑；没有抹去失败。最终测试为 0 skip。首次报告替换补丁亦因重复路径操作被工具原子拒绝，随后改用单次更新。

第五会话的大范围扫描看到父会话授权修改脚本和新增记录，不表示整仓库静止；受保护夹具另核指纹。commands/ 和矩阵保留真实 argv、退出码、stdout/stderr；原生目录保留请求、事件、报告和最终输出。后段记录器冻结输入/前后状态，前段未捕获字段不倒填，原输入与逐章快照、早期辅助脚本保留。

## 现有作品与历史记录保护

现有作品 `D:/work/小说/dzkxqxx` 未改正文、设定、状态或工具，未迁移/升级。前后均 516 个普通文件且无排除项：515 个同路径文件字节不变，没有同路径内容改变；仅 .git/refs/codex/turn-diffs/checkpoints/ 下一个检查点引用换路径，前后同为 41 字节且 SHA-256 相同。所有非 .git 文件的路径和字节一致。

首次全目录相等断言因上述差异失败，原记录保留，随后生成 [差异](protected-differences.json)、[前指纹](protected-before.json)、[后指纹](protected-after.json)。没有还原或写入该目录；比较本身不归因差异写入者。

旧百章封存记录只读复验通过，36,058 文件、1,696,312,660 字节，旧清单 SHA-256 `56aa950cd5fa1732b068e920e1dfeedbd592697056c73f0aeb6a50e9406c51b6`，见 [原始结果](commands/old-hundred-integrity/stdout.raw.txt)。Git HEAD 保持 36bd9c2，暂存区空，无提交、推送；原 .idea 和前轮设计文件保留。

## 未实施与边界

T01–T07、T24、T30 的本批程序范围由真实 CLI 回归、矩阵及原生会话提供证据。T07 使用正式只读 current/list，不生成可手改后冒充权威的选择 Markdown，未做 Markdown 自动重生成。

B（设定版本/影响分析、修订区与跨会话修订事务）、C（跨章复核、意见闭环、进一步登记减负）、D（安全更新）未实施。同范围取代不等于设定版本管理；自然语言授权仍需代理准确登记，字段校验不替代语义或身份认证；编辑器直接写文件在命令门禁外，本批不宣称覆盖并发改稿全过程。备份不等于一键降级。

未新增运行依赖、自动上传或联网升级。Windows/Node 24 验证不扩大为其他系统、共享盘、真人盲读或市场验收。

## 封存和复验

最终审计成功后由 [seal-evidence.mjs](seal-evidence.mjs) 生成 [evidence-manifest.json](evidence-manifest.json)，逐文件记录路径、字节数和 SHA-256，包含失败尝试、历史候选、输入、作品及原始日志，仅排除清单自身。封存后不追加/改写本目录。

仓库根目录只读复验：

```powershell
node acceptance/20261018-governance-a/seal-evidence.mjs verify
```

后续产生新文件的创作或回归应另建验证目录。
