# 来源与吸收记录

整理日期：2026-10-15。参考不是整仓照搬，运行路径由 ai-writer 自行实现。

## oh-story-claudecode

- 来源：[zenstory-ai/oh-story-claudecode](https://github.com/zenstory-ai/oh-story-claudecode)
- 固定提交：`c945de68d0b61d87d6c5e933ea065a4fc673282c`
- 许可：MIT；保留原 LICENSE 于 `vendor/oh-story-reference/LICENSE`。
- 原文快照仅用于溯源和比较，不是运行依赖。快照里的脚本、跨文件链接与 Claude hooks 不表示本项目已实现那些功能；缺少的相邻文件应在固定提交的原仓库查看，不直接执行快照指令。

| 实际阅读的来源文件 | 吸收内容 | 本项目落点与调整 |
| --- | --- | --- |
| story-long-write/references/project-files.md | 设定/大纲/正文/追踪分层、角色与资料按需读取、权威状态 | writer-project、context、单文件追踪；用显式 setting_refs，不整读全书 |
| story-long-write/references/workflow-chapter.md | 细纲驱动、写前准备、先核实际落点再更新追踪、定点修复 | plan→context→Codex→record；普通规划可在授权内直接补齐，不重复打断作者 |
| story-deslop/references/deslop-gates.md | 保护剧情和关键信息、按问题选择修订范围、警惕模板反应 | writer-novel/review；不移植普遍禁词、统一删句和固定删减比例 |
| story-short-analyze/references/analysis-method.md | 从阅读体验反推结构、人物和情绪机制，输出复用条件 | writer-research；加入证据锚点、失效条件与事实/推断分离 |

参考项目还提供扫榜、封面、浏览器和宿主适配等能力。本版本的选题研究使用 Codex 已有查询能力；没有搬入自动爬榜、封面生成、浏览器账号和外部付费调用。

## 我们的既有能力

| 来源 | 复用方式 | 范围边界 |
| --- | --- | --- |
| story-gate-studio 0.1.0 | 按原 private-package manifest 打包，137 文件快照保存在 vendor；原源码不修改 | CLI gate 转发既有质量门禁；原 proprietary 许可保留，不宣称整个项目已可公开分发 |
| novel-review | 18 份通用审查 references 随 writer-review 打包，按任务加载 | 小说模块只用于适合的文体；审查与改稿授权分开，原项目分数阈值不默认推广 |
| 仙侠项目 | 人物、境界、规则、章际承接与视觉/剧本边界的成熟方法 | 未复制正文或视觉资产 |
| 悬疑项目 | 滚动细纲、信息三层、双时空身体、时间与物证生命周期 | 提炼为通用模块，未复制人物、物证编号、规则数值或终局 |
| 历史散文项目 | 史料分层、四类表达边界、史源依赖、亲和讲述与文气保护 | 按最新规范阅读后提炼，不带原书正文、资料库或专属验收阈值 |

`source-manifest.json` 记录所有复制文件的 SHA-256、来源类型和提炼所据本地规范的哈希。它不包含本地原书路径，原书正文不属于分发内容。派生技能为本项目维护的版本，后续吸收源更新应重新比较，而不是盲目覆盖。

## Codex 接入依据

采用官方 [Build skills](https://learn.chatgpt.com/docs/build-skills) 的 `.agents/skills/<name>/SKILL.md` 发现方式，使用 [AGENTS.md](https://learn.chatgpt.com/docs/agent-configuration/agents-md) 组织作品规则。不依赖 Claude Code 专用斜杠命令、hooks 或子代理配置。新会话真实发现与长文效果仍需实测，结构检查不能替代行为验收。

## 0.1.0 实跑后的补充吸收（历史记录）

仍以以上固定提交快照为原文依据，不把上游网页上的最新功能当作已接入能力。

| 做法与出处 | 本轮落点 | 适用边界 |
| --- | --- | --- |
| workflow-chapter 步骤12：预填追踪事务、保留完整角色快照 | `record-template` 自动生成真实修订号、来源哈希和当前完整快照，摘要留空，写前保存、写后按原文填写 | 不生成剧情摘要，不替作者判断线索兑现；空摘要拒绝登记 |
| project-files：设定、未来计划、已发生事实各有职责，按需取段 | writer-project 明确 `setting_refs` 引用相关大纲或角色卡；已兑现线索从当前 threads 退出 | 不强制把整卷纲塞进每章；没有对标项目也能原创 |
| 本地历史散文经验：史源依赖与事实更正必须可追溯 | `source_dependency` 成为事实卡必填字段；已登记来源变更由 status/check 定位，阻断过期续写与导出；导出带来源哈希 | 哈希和字段不证明史实正确，正文仍需实读，单一史源不能伪称独立互证 |
| 本地交付经验：最终文件、版本和实际流程对应 | 保存独立CLI会话的真实JSONL及主会话CLI命令记录、请求、失败原因、样稿、审查与导出，最终再核对哈希 | 短篇流程验证不等于长篇稳定性、真人盲读、排演或正式出版验收 |
| 本轮真实使用反馈：常规自检报告不要反过来挤占创作 | writer-review 记录实际阅读覆盖和必要问题，不默认逐段堆“通过”表 | 仍须完整阅读；用户要逐段台账时照要求展开 |

暂不吸收统一删句比例、强制逐章高压、自动爬榜和封面发布。长篇的分层状态召回、分卷契约取段、结构化物证/知情矩阵和旧作导入值得继续研究；当前缺少长篇实跑证据，不在这一轮宣称实现。

真实 Codex 运行采用官方 [非交互模式](https://learn.chatgpt.com/docs/non-interactive-mode) 的 JSONL 与最终回复留档思路，实际参数以本机 CLI 帮助为准。系统 npm CLI 与桌面 CLI 在本轮出现配置及参数差异，因此显式记录所用入口，不改全局配置解决兼容问题。

## 0.2.0 完整能力盘点与长篇实现

本轮重新下载上游，固定到 `6d72f70e5fe3de110b457fd6bc81ede6ea614702`，对816份跟踪文件建索引、读完13项技能入口。深读范围、全部能力取舍和26份新增MIT快照见 [reference-audit.md](reference-audit.md) 与 [oh-story-audit-manifest.json](oh-story-audit-manifest.json)。上面的“暂未实现”属于0.1.0历史，0.2.0已实现分卷切片、增量状态、结构化线索/知情/物证、断点导入和滚动覆盖；完整拆书/跨书灵感库等未移植项仍单独列明。

运行工具继续独立用Node实现，没有执行或接入参考Python/Bash/hooks。长篇状态与迁移设计见 [long-form-design.md](long-form-design.md)，实际Codex分会话证据见 [本轮验证](../acceptance/20261015-long/README.md)。
