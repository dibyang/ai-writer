# ai-writer

面向 Codex 的中文创作工具，支持小说、剧本、散文与非虚构写作。作品保存在本地 Markdown 文件中，设定、细纲、正文、研究资料和创作状态分开管理；新会话可从文件恢复进度。

当前版本：**0.8.1 本地候选版，采用 Apache License 2.0，尚未正式发行。** [K 轮](acceptance/20261019-apache-license-k/README.md)已完成许可携带、旧包兼容、正式更新和打包验证。0.8.0 的创作方法与版本兼容支持见 J 轮；百章副本上的恢复、修订、更新和草稿导出验证见 H 轮。

从作品定位和全书大纲开始，按分卷与近期章纲写作，在新会话中恢复进度，并在独立修订区修改旧稿、导出草稿。工具记录创作阶段、授权范围、作者决定和来源版本，支持增量追踪、跨章复核、审查意见处理和可恢复的本地更新；文学质量仍需实际读稿判断。

包含 7 个 Codex 技能、去 AI 味流程和原有质量引擎。新作品使用 schema 6；已有作品不会自动迁移协议或更新随附工具。工具更新后从当前包读取新版流程，同时保留作品目录中的作者规则和定制技能。

## 开始使用

0.8.0 的方法来源、适配范围及验证结果见[J 轮记录](acceptance/20261019-webnovel-reference-j/README.md)，其中保留了完整回归、旧包更新和两次 Codex 实跑证据。H 轮进展另见[百章验证记录](acceptance/20261019-hundred-h/README.md)。

使用前请准备好 Codex 和 Node.js 20 或更高版本。无须安装额外 npm 依赖；写作使用当前 Codex 会话及其模型，不单独调用模型 API。

第一次使用看[快速入门](docs/quickstart.md)，日常任务看[使用手册](docs/user-guide.md)。跨章复核、登记和审查意见处理见[专项手册](docs/review-and-registration.md)；设定版本与并行修订见[版本和修订](docs/revision-and-sources.md)；语言修订见[去 AI 味流程](docs/deslop.md)；命令及 JSON 格式见[技术手册](docs/workflow.md)。这些指南会复制到新作品中。

在 Codex 中打开本项目，直接说：

> 创建一部中篇悬疑小说，放在 works/雨夜来信。先确定人物与谜面，再滚动细化前三章并写第一章。普通读者一遍能懂，保留自然叙述，不要提前揭底。

也可以先运行：

```powershell
node bin/ai-writer.mjs doctor
node bin/ai-writer.mjs init --path "works/雨夜来信" --kind novel --title "雨夜来信"
```

然后继续在 ai-writer 主项目的 Codex 会话中，明确作品目录，说：

> 为 works/雨夜来信 按作品规则规划并写第一章，完成自检、登记和检查，说明未登记正文与下一步。

新作品自带技能、轻量工具和手册，也可直接打开作品目录使用。在作品目录运行 `node .writer/tool/bin/ai-writer.mjs status` 查看状态；各子命令支持 `--help`。Codex 从 `.agents/skills/` 发现技能，`AGENTS.md` 说明自然语言任务应使用哪些技能。另见[官方技能说明](https://learn.chatgpt.com/docs/build-skills)和[AGENTS.md 说明](https://learn.chatgpt.com/docs/agent-configuration/agents-md)。

## 四类创作流程

| 文体 | kind | 创作与审查重点 |
| --- | --- | --- |
| 小说 | novel | 人物、情节、伏笔、信息公平、连续性与追读 |
| 剧本 | screenplay | 故事弧、场次、可表演行动、对白与空间连续性 |
| 历史散文 | history | 史料核验、来源关系、事实与推断的区分、叙述声音 |
| 散文与一般非虚构 | essay | 观察和经验的表达、事实与观点的区分、结构和语言 |

历史小说选 novel，非虚构历史散文选 history。不同流程使用各自的写作与审查规则，不只是更换文件模板。

## 技能

| 技能 | 用途 |
| --- | --- |
| writer-project | 创建作品、恢复上下文、登记创作状态、修订与导出 |
| writer-novel | 长短篇、悬疑、仙侠、历史等小说创作 |
| writer-screenplay | 原创/改编剧本、分集纲与场次正文 |
| writer-history | 可追溯史料的历史散文 |
| writer-essay | 散文、随笔与一般非虚构 |
| writer-research | 选题研究、参考作品拆解、资料核验与灵感整理 |
| writer-review | 按文体实读审查，区分硬问题与风格偏好 |

可以直接用自然语言说明任务，也可在 Codex 中指定 `$writer-novel` 等技能。工具维护任务不触发写作流程。

去 AI 味可以直接说“只审查这两章的模板表达”或“按本书文风做去 AI 味润色，保留剧情，给改前改后对照”。writer-review 按文体诊断问题；只审查时生成报告，获准润色时再修改并复核当前版本。style-scan 只提供待核线索，不判断 AI 生成概率，也不自动删句。

## 文件和保护

```text
作品/
├── writer.json             文体与标题
├── AGENTS.md               创作规则入口
├── .agents/skills/         可随作品携带的技能
├── 设定/                   定位、文风、权威规则与角色
├── 大纲/单元/              顺序编号的细纲 JSON
├── 正文/                   独立章、场或篇
├── 研究/                   事实卡和核验资料
├── 参考拆解/               参考作品的写法与适用条件
├── 审查/                   绑定源哈希的实读报告
└── .writer/                唯一追踪状态、回退备份与轻量工具
```

- 正文变化后，旧追踪不能继续用于续写或导出；回退会保留正文和旧状态备份。
- 登记绑定设定、细纲、研究和前文哈希，拒绝过期上下文；顺序写入带锁，失败不自动抢锁。
- 来源变化按实际影响范围处理：定位最早受影响的章节，阻止使用过期上下文续写或导出。冻结的旧版本继续保留并校验，修改当前文件不会覆盖旧证据；增量追踪保留未变内容。
- 研究资料标为 verified，表示记录者声明已核验，不是程序对史实的保证。
- 初始化和导出不覆盖已存在目录；正文不会自动上传或发布。
- `check` 只检查有限的机械问题，不是 AI 检测器或文学质量评分器。

命令和 JSON 见 [完整工作流](docs/workflow.md)，自然语言例子见 [创作任务示例](examples/prompts.md)。

长篇按[长篇流程](docs/long-form.md)管理各卷目标，沿用增量追踪记录。新增未来设定可保留旧版本，并按章节指定生效范围；修改旧章则在独立区读稿、重新登记、复核后提交。遇到冲突会保留双方版本，中断事务需按流程恢复。

随附工具按[本地安全更新](docs/tool-updates.md)处理：核对来源，先生成只读计划，保留作品目录中的作者规则、定制技能和笔记。旧协议是否需要迁移、随附工具是否需要更新，按各自预览结果及实际授权分别处理；中断后从外部可信入口恢复。设计依据见[治理设计](docs/authoring-governance-design.md)及[D 批约束](docs/authoring-governance-d-implementation.md)。工具不会自动合并冲突或抢锁，也不能消除锁外编辑及跨机协作的全部风险。

## 吸收与复用

参考 [oh-story-claudecode](https://github.com/zenstory-ai/oh-story-claudecode) 的分层记忆、章纲驱动、续写事务、拆文机制与定点去味方法；结合本地 story-gate-studio、novel-review，以及仙侠、悬疑、历史散文三个实际项目的通用经验。

另参考 [Chinese-WebNovel-Skill](https://github.com/Tomsawyerhu/Chinese-WebNovel-Skill/tree/96709f477f4b59be856ebb10bec052dd0452b846) 的长篇规划和局部诊断思路，按 ai-writer 的流程独立补充，未复制其教程、例文或小说语料。适配范围与不采纳项见[J 轮记录](acceptance/20261019-webnovel-reference-j/README.md)。

采用内容、调整原因、固定提交、文件哈希和许可范围见 [来源与吸收表](docs/sources.md)。参考仓库的脚本和宿主 hooks 没有直接接入运行；这里使用独立实现的 Node 工具。历史散文与一般散文不继承网文的统一强压、禁词或删句门槛。

此前对 oh-story-claudecode 的 816 份文件建立了完整索引，读完 13 个技能入口，并深入检查长篇协议和相关脚本。采用、改造与未移植的内容见[能力盘点](docs/reference-audit.md)，实际阅读范围和 26 份快照的哈希见[审计清单](docs/oh-story-audit-manifest.json)。索引覆盖不等于所有文件均已全文阅读。

## 验证

八项创作治理需求的已确认范围均已实现。当前能力、各批验证证据、实现调整，以及暂缓或尚未验证的范围，统一见[当前实现与验证状态](docs/authoring-governance-status.md)。历史设计和封存报告反映当时状态，判断当前能力请以该总览为准。

H 轮从 106 章验证副本续写至 112 章，通过四个独立会话恢复同一修订、重登并复读 72–112 章，完成五条意见闭环、更新至 0.8.0、暂停门禁与草稿导出。最终回归 162 通过、0 失败、1 项环境跳过，doctor 通过；范围与失败记录见[H 轮记录](acceptance/20261019-hundred-h/README.md)。完整旧作品副本暴露的目录外固定依赖缺陷由 0.7.6 修复，范围与验证见[I 轮记录](acceptance/20261019-dependency-recovery-i/README.md)。各轮结果只覆盖其实际验证范围。

0.7.4 G 轮完成新用户流程审查和 10 项易用性改进，通过 5 个独立 Codex 进程实跑两卷六章、跨会话修订、工具更新与导出；另验证了仅授权规划的作品即使已有细纲，正文入口仍会拒绝。该轮最终回归 154 通过、0 失败、1 项环境跳过，doctor 通过；输入输出、失败纠正、实读版本和封存见[新用户完整流程记录](acceptance/20261019-new-user-g/README.md)。该轮覆盖六章流程，不能替代百章压力验证；验证仅操作隔离作品，未修改现有作品或对外发布。

0.7.0 D 批实现及实跑状态见[D 批记录](acceptance/20261018-governance-d/README.md)，以其最终结果和封存清单为准。[0.6.0 C 批](acceptance/20261018-governance-c/README.md)、[0.5.0 B 批](acceptance/20261018-governance-b/README.md)、[0.4.0 A 批](acceptance/20261018-governance-a/README.md)保留各自记录，不与后续版本的结果混用。

0.7.1 E轮补强清单缺失、已安装完整内容保护与恢复再中断验证，见[实现边界](docs/recovery-hardening-e.md)和[最终验证记录](acceptance/20261018-recovery-e/README.md)。

0.7.3 F轮通过13个真实Codex进程，在隔离的百章副本上续写至106章，验证工具更新、多轮恢复、跨卷回收与旧章修改后59章重登及复读，并修复实跑发现的问题。范围、失败原件、完整实读证据和最终测试见[百章更新与恢复实跑记录](acceptance/20261018-hundred-f/README.md)。现有作品未修改，模型复核不代替作者定稿。

修改工具后运行前两项；修改内置引擎时再运行第三项：

```powershell
npm test
npm run doctor
npm run test:engine
```

0.3.0 的易用性与去味流程记录见 [专项验证](acceptance/20261015-usability-fix/README.md)；长篇见 [24章扩大实跑](acceptance/20261016-expanded/README.md)与 [百章真实Codex实跑](acceptance/20261016-hundred/README.md)，各轮源码、实际完成范围、失败记录及未核边界以报告为准。0.2.0 的工具回归 40/40、内置引擎回归 29/29 及六章小说、旧稿导入、剧本与历史散文实跑继续保留，见 [0.2.0真实验证](acceptance/20261015-long/README.md)；[0.1.0三文体证据](acceptance/20261015/README.md)也继续保留。

本机曾在嵌套作品目录启动 Codex CLI 时遇到 helper 初始化失败；改从工作区根目录启动并明确作品路径后可以运行。若遇到同类情况，可先尝试该入口，不必修改全局安全设置；作品随附的 Node 工具仍可独立使用。

百章实读、连续性问题和修复范围见上述记录。跨系统 CI、真人阅读、排演与作者定稿尚未完成验证，模型检查不能保证全书没有其他语义问题。容量测量仅统计当前状态文件（state）和有效增量日志（journal）；保留备份的整个作品目录不一定同比缩小。

本项目自有代码、技能、规则、文档及内置 story-gate-studio 采用 [Apache License 2.0](LICENSE.md)，版权与适用范围见 [NOTICE](NOTICE)。第三方参考资料保留各自许可；使用工具不会改变作者作品的权利归属。详见[授权与来源说明](docs/attribution.md)。
