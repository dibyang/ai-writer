# N轮：三个长篇参考项目适配与实际验证

日期：2026-10-19。用户授权审查三个参考项目，有适合ai-writer的内容就吸收。本轮完成独立实现、按需技能及快速入门/使用手册更新、当前Codex会话隔离样例实读和程序回归。没有修改现有作品、提交、推送或发布；v0.8.0标签仍指向27a20edd，HEAD仍为7a0d0509，.idea未改动。

## 来源、许可与读取范围

| 来源 | 固定版本 | 许可核查及取舍 |
| --- | --- | --- |
| Openwrite main | c662440f351436e666b6f996d3bdb3274f351b31 | Apache-2.0；审稿覆盖、工作区身份与可靠性边界，已有能力复用 |
| Openwrite native-core | 4af1f24c2c8dc2751574495fac5da8d5b452c694 | Apache-2.0；上下文保护与预算诊断，非事实性短程候选 |
| novel-creator-skill main | a327428ea26962163f823ad74001243f91bc7738 | README写MIT License，根目录未见完整许可文本；独立表达分步展开和长线节制方法，不复制源码/提示词 |
| Long-Novel-GPT main | 107c31e54686947a6d00404e332475a60b66e630 | 未见根许可或README授权声明；只借鉴分层创作、纲文对应及局部编辑思路 |

references保存四个完整目录索引与根文件哈希；选取29份实现/设计文件缓存，实际读取15份的全部或明确部分，另读README概览。精确覆盖见read-coverage.json和产品docs/usability-sources.json。索引、缓存不当作全文审查，也未运行上游代码或安装器。原文均留在被忽略的.tmp/reference-n，不分发；可按固定URL取到新目录重新核哈希，不在本封存目录内重跑采集脚本。未读取演示小说。

开始访问raw文件遇到ECONNRESET；collect-references.mjs和已写入的固定main索引保留，fetch-references-v2.mjs复用该SHA，改经API并限定重试后成功。初次错误来自本会话工具输出，未生成原始日志文件，记录见fetch-attempt1-observation.json；没有伪称补造原始日志。

## 实际吸收

- context超限返回CONTEXT_BUDGET_EXCEEDED，给出实际紧凑JSON字符总量、差额、各分项及最多十项主要设定/研究引用。它不估算模型token、不截断、不丢约束；授权和来源校验仍先执行，失败不改状态、不写out。
- writer-novel/review增加按需chapter-delivery参考：本章任务收拢到既有plan；必要分歧短程比较；长章按已有事件步骤展开，续段读实际上段结尾，合章完整复读；按实际稿回对有效纲，缺证保留缺证。只登记最终完整章，已有source/revision/review-issues继续复用。
- 复用分卷、增量账本、召回理由和失效保护，不另加事实权威、向量库、宿主或付费API。未套固定场数、强制悬念/冷却配额、机械禁词替换、自动补齐纲文映射或文学总分。

完整取舍见主项目docs/three-project-reference-audit.md；快速入门和手册已有自然语言入口和预算错误恢复说明。产品所有新表达与代码均独立编写；上游命令不作为本地执行指令。

## 最终版本与验证

本轮是正式0.8.0之后的未发布开发目录，版本号尚未另行发布，内容身份与正式包不同。最终candidate-v2有321个文件、66项受管资源，内容ID为235c1313dde6174491c343a4af608e905ad3002517893a224cea619d034d4be6；ZIP SHA-256为072b955f6cb5532bb13e30afcda95095478085cf5d6c9be5234bff2b14018693。来源明确为7a0d0509之上的dirty开发目录，不能当作已发布附件。

| 验证 | 最终结果 |
| --- | --- |
| 定向预算边界/保护测试 | 4/4通过：精确边界、来源明细有界、失败不落盘/不改state、授权先行 |
| 主项目完整回归root-tests-v2 | 171项：170通过、0失败、1项本机符号链接场景跳过；npm test -- --test-concurrency 2 |
| 最终独立解压包package-tests-v2 | 171项：170通过、0失败、1项同环境跳过；npm test默认并发 |
| 主项目/最终包/实际样例随附工具doctor | 均通过 |
| writer-novel与writer-review技能格式 | 均通过；最终章节参考另经实际全文阅读 |
| 独立ZIP读取 | Python zipfile验证CRC、全部载荷SHA、路径及隐藏技能，中文空格目录实际解压 |
| 来源与最终输入 | 319项构建输入冻结后逐字节一致；源码、最终解压包与样例随附工具内容ID相同；29项缓存及根文件SHA复核 |
| 旧证据保护 | L/M封存只读复验通过；无现有作品改动 |

未改内置引擎，未借用旧29项引擎结果当本轮新跑；本轮是Windows/Node24本地验证，未推送，未新增跨平台CI或百章创作验收。

## 当前Codex实际样例

沿现有writer-project/novel/review路径，在最终包初始化独立scenario-v2/归梯样例，登记明确合成授权。当前会话写三个中间段合成一章，最终2012汉字。真正读完初稿、最终稿、实际计划和删尾反例，保留model-reading-binding.json及带源哈希的审查报告，不冒充新代理或真人。

初稿合章实读发现两盆花已搬下却又说未搬、递笔动作缺失及无前文支持的再次掉借条回指，保留原件并修正。最终回对三个步骤、实际变化与禁止事项；允许合作、平静结尾和多对多映射，没有为了悬念改变作者指定路线。删尾反例中出现“签”字却只指过去或条件句，不能据此说当前归还已完成；该判断是模型实读，脚本仅核引文与哈希。

最终真实CLI完成init→workflow→plan→context→预算拒绝→record-template→record-preview→record→check→review-template→模型报告登记→暂停→第2章拒绝→草稿export→最终check和doctor。只登记一章最终稿，中间段/反例不登记，导出仍是draft-export。新工具通过66项资源进入样例随附包，根作者作品未迁移或改写。

## 失败、纠正与记录

保留两次过程失败：root-tests初次171项169通过/1失败/1跳过，因修改指南重字时与更新保护回归重叠，TOOL_PLAN_CHANGED正确拒绝变化来源。之后冻结319项最终输入，重跑主项目及最终解压包均通过；只降低本次测试并发以减轻争用，没有放宽保护或修改默认脚本。初版candidate及其通过的包回归仍保留，但最终身份以candidate-v2为准。

最终核对脚本首次误用content_id而不是API的observed_content_id，原verify-final.mjs及verification-attempt1原始失败保留；verify-final-v2.mjs修正后完整通过。verification.json汇总44条捕获命令，含3次预期业务拒绝和2次验证过程失败，不能写成44次全成功。采集失败另行如实记录。

合并核对由verify-final-v2.mjs执行，不进行文学自动判断。所有最终命令、输入与前后状态、样例及导出、候选ZIP、来源索引、失败原件均在本目录封存；清单自身SHA在目录外复验回执。封存后只运行seal-evidence.mjs verify，其他脚本使用新目录重放，不能覆盖旧记录。
