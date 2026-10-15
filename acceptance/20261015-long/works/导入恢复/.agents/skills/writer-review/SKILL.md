---
name: writer-review
description: 审查小说、剧本、历史散文和非虚构的结构、语言、连续性及读者体验，给出绑定原文版本的高置信问题与风格资产。
---

# 文稿审查

先读取最新原文与 writer.json，记录实际阅读范围和源文件 SHA-256。仅“审查”不改正文；用户已授权的写作、润色或修订任务可落实范围内有净收益的改动，不重复询问已明确的授权。

## 按文体选择

- novel：先读 `references/general-review.md` 与 `references/natural-language-authenticity.md`；按题材读 suspense、xianxia、historical、transmigration、dual-world；架构问题读 architecture-continuity；动作场面读 action-scene；角色变化读 character-emotion-consistency；心理问题读 psychology-readability；证据动作读 physical-logic-operability。
- screenplay：检查场次目的、可表演行动、对白潜台词、空间道具连续性、时长估计与改编因果。小说专属内心叙述与章末门槛不强加到剧本。
- history：分别检查史料、自然表达、易懂、人物亲近、叙述声音、散文性与跨章基调。按 writer-history 的事实边界核对引用；不凭未核网页摘要判史实。
- essay：按作者的结构与声音目标，检查事实、观点、经验之间的边界及表达、节奏、论证。不能用小说追读门槛否定散文。

小说发布判断任务再读 publication-gate、final-publication-review；逐句校对任务读 proofreading-language-quality。常规全稿自检完整连读并记录覆盖，不自动引入发布评分。商业追读目标再读 page-turner、readability-accessibility，情绪杀伤力任务再读 knife-emotional-impact。只加载当前任务需要的模块，不把整套规则全塞进上下文。

## 报告

保存到 `审查/范围-日期.md`，包含范围、文件哈希、审查者性质（知情自检/隔离代理/真人）、结论、问题列表和未覆盖项。每条问题给原句/位置、可复现的阅读代价、证据及最小修改方向；将硬问题、整体文风风险、风格偏好观察分栏，并列文气/人物资产。没有确认问题可直接写“没有必要修改”。

报告详略随任务：常规创作自检记录章/场覆盖和必要问题即可，不逐段复制情节、堆“通过”表或写无收益的改稿建议。实际阅读仍须完整，只有用户要求逐段审查台账时才逐段展开。

正式质量与商业追读分别裁定。允许“不阻止发布，但追读目标未达到”，也允许缺证时写“待核”，不制造总分掩盖短板。分数只在有明确量尺时使用，不默认继承原项目的分数阈值。

正常修辞和主审改口偏好不能自动升级硬伤。除独立可验证的错误外，至少两项语言测试与实际理解损害共同支持，再确认搭配、指代或语气问题。机械扫词只能提供线索。

## 连续阅读与独立性

全稿任务逐章阅读并记录覆盖，扫描不代替逐句校对。连续区间看重复解释、压力单一、人物退化与情绪承接。独立盲读只在用户请求或已授权时组织，不能把同一会话换角色自问称为独立读者；不可用时如实标知情自检。旧报告只支持其绑定哈希，新稿变动后重新核查影响范围。

长篇每三章建议连读当前三章与前三章；实际读完并保存报告后，按 writer-project 的 long-form 格式用 `review` 登记哈希和范围。`check.rolling_review` 只显示覆盖和失效，不给文学质量通过。审查“待核”须看已知边界、后续调查/阶段回收，不能把状态词一律当占位符。

主项目 `node bin/ai-writer.mjs gate --help` 可查看已有 story-gate-studio 的结构化门禁。它接收人工准备的卡片和报告，不会自动理解正文；脚本通过不能替代本技能的实读。
