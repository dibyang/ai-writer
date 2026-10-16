# ai-writer

通过 Codex 创作中文小说、剧本、历史散文，以及散文和一般非虚构。作品保存在本地 Markdown 文件中，设定、细纲、正文、研究和追踪各有职责；新会话可以从文件恢复创作。

当前版本：**0.3.0 本地候选版**。包含 7 个 Codex skills、小说审查参考规则、去 AI 味专项流程、可执行作品管理工具及 story-gate-studio 质量引擎。支持长篇分卷、线索召回、旧稿导入和同内容重定位；状态与导出主动列出未登记正文。自动化检查验证文件流程和保护逻辑；文学质量、史实真伪和作者验收由实际阅读与核验裁定。

## 开始使用

需要已经可以使用的 Codex，以及 Node.js 20 或以上。工具不需要安装 npm 依赖，也不单独调用模型 API；写作使用当前 Codex 会话及其模型。

第一次使用看 [快速入门](docs/quickstart.md)；日常任务看 [使用手册](docs/user-guide.md)；修订表达看 [去 AI 味流程](docs/deslop.md)；命令与 JSON 看 [技术手册](docs/workflow.md)。这些指南都会随新作品复制。

在 Codex 中打开本项目，直接说：

> 创建一部中篇悬疑小说，放在 works/雨夜来信。先确定人物与谜面，再滚动细化前三章并写第一章。普通读者一遍能懂，保留自然叙述，不要提前揭底。

也可以先运行：

```powershell
node bin/ai-writer.mjs doctor
node bin/ai-writer.mjs init --path "works/雨夜来信" --kind novel --title "雨夜来信"
```

然后继续在 ai-writer 主项目的 Codex 会话中，明确作品目录，说：

> 为 works/雨夜来信 按作品规则规划并写第一章，完成自检、登记和检查，说明未登记正文与下一步。

新作品随附 skills、轻量工具和手册，也可直接打开作品目录使用。独立目录运行 `node .writer/tool/bin/ai-writer.mjs status`；各子命令支持 `--help`。本机曾在嵌套目录启动 Codex CLI 时遇到 helper 初始化失败；若出现同类情况，返回主项目会话并传明确作品路径，不修改全局安全设置。Codex 从 `.agents/skills/` 发现技能，`AGENTS.md` 提供自然语言任务路由。[官方技能说明](https://learn.chatgpt.com/docs/build-skills)、[AGENTS.md 说明](https://learn.chatgpt.com/docs/agent-configuration/agents-md)。

## 四种文体

| 文体 | kind | 创作与审核重点 |
| --- | --- | --- |
| 小说 | novel | 人物、情节、伏笔、信息公平、连续性与追读 |
| 剧本 | screenplay | 故事弧、场次、可表演行动、对白与空间连续性 |
| 历史散文 | history | 事实卡、史源依赖、推断边界、亲和讲述与散文性 |
| 散文/非虚构 | essay | 作者声音、观察、经验与事实边界、论述和余味 |

历史小说属于 novel，非虚构历史属于 history。选择文体会改变写作与审查方式，不只是换一个文件模板。

## 技能

| 技能 | 用途 |
| --- | --- |
| writer-project | 建作品、恢复上下文、登记追踪、修订与导出 |
| writer-novel | 长短篇、悬疑、仙侠、历史等小说创作 |
| writer-screenplay | 原创/改编剧本、分集纲与场次正文 |
| writer-history | 可追溯史料的历史散文 |
| writer-essay | 散文、随笔与一般非虚构 |
| writer-research | 选题、拆文、资料核验与灵感整理 |
| writer-review | 按文体实读审查，区分硬问题与风格偏好 |

支持自然语言选择，也可在 Codex 中显式提及 `$writer-novel` 等技能。工具维护任务不触发写作流程。

去 AI 味可以直接说“只审查这两章的模板表达”或“已授权去味润色，保留剧情与文风，给改前改后对照”。writer-review 按文体执行诊断、最小修改和版本复核；style-scan 只提供候选线索，不给 AI 概率或自动删句。

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
├── 参考拆解/               研究机制和适用条件
├── 审查/                   绑定源哈希的实读报告
└── .writer/                唯一追踪状态、回退备份与轻量工具
```

- 正文变化后，旧追踪不能继续用于续写或导出；回退会保留正文和旧状态备份。
- 登记绑定设定、细纲、研究和前文哈希，拒绝过期上下文；顺序写入带锁，失败不自动抢锁。
- 已登记来源变更会定位最早消费者并阻断过期续写、导出；写前登记模板自动保留真实哈希和完整快照。
- 研究 verified 只表示填写者声明已核验，程序不能证明史实正确。
- 初始化和导出不覆盖已存在目录；正文不会自动上传或发布。
- `check` 只检查有限的机械问题，不是 AI 检测器或文学质量评分器。

命令和 JSON 见 [完整工作流](docs/workflow.md)，自然语言例子见 [创作任务示例](examples/prompts.md)。

长篇先按 [长篇流程](docs/long-form.md) 显式启用新协议。原schema 1兼容；迁移前自动备份，作品随附工具可独立续写。

## 吸收与复用

参考 [oh-story-claudecode](https://github.com/zenstory-ai/oh-story-claudecode) 的分层记忆、章纲驱动、续写事务、拆文机制与定点去味方法；结合本地 story-gate-studio、novel-review，以及仙侠、悬疑、历史散文三个实际项目的通用经验。

采用内容、调整原因、固定提交、文件哈希和许可范围见 [来源与吸收表](docs/sources.md)。参考仓库的脚本和宿主 hooks 没有直接接入运行；这里使用独立实现的 Node 工具。历史散文与一般散文不继承网文的统一强压、禁词或删句门槛。

本轮对参考项目816份文件建立完整索引、读完13个技能入口，并深入长篇协议和相关脚本。逐项采用、改造与未移植内容见 [完整能力盘点](docs/reference-audit.md)，来源深度与26份新快照哈希见 [审计清单](docs/oh-story-audit-manifest.json)。

## 验证

```powershell
npm test
npm run doctor
npm run test:engine
```

0.3.0 的易用性与去味流程记录见 [专项验证](acceptance/20261015-usability-fix/README.md)；长篇见 [24章扩大实跑](acceptance/20261016-expanded/README.md)与 [百章真实Codex实跑](acceptance/20261016-hundred/README.md)，各轮源码、实际完成范围、失败记录及未核边界以报告为准。0.2.0 的工具回归 40/40、内置引擎回归 29/29 及六章小说、旧稿导入、剧本与历史散文实跑继续保留，见 [0.2.0真实验证](acceptance/20261015-long/README.md)；[0.1.0三文体证据](acceptance/20261015/README.md)也继续保留。

本机Codex嵌套目录cwd曾遇宿主helper初始化失败，成功入口为工作区根目录加明确作品路径；作品随附Node工具可独立运行。百章的模型实读、连续性发现与修复范围见上述实跑记录；跨系统CI、真人阅读、排演与作者定稿尚未验收，模型检查不能保证全书没有其他语义问题。容量测量只统计当前state和有效journal，包含保留备份的全目录不承诺同等缩减。

本项目尚未对外发布；许可证与内置私有内容的分发限制见 [LICENSE.md](LICENSE.md)。
