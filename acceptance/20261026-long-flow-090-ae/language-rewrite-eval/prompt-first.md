本次是八组独立合成材料的语言审查与最小改写验证，不是作品创作，也不是文学质量统计测评。只在 acceptance/20261026-long-flow-090-ae/language-rewrite-eval 内新增结果；不修改任何现有作品、工具、输入或隐藏判据，不提交推送，不创建子代理或其他任务。

完整阅读 cases.json 及冻结候选 extracted-final-candidate-v5/ai-writer-0.9.0 下 writer-review 的 SKILL.md、general-review.md、natural-language-authenticity.md、deslop.md、concrete-language-review.md。路径均以 acceptance/20261026-long-flow-090-ae 为基准；先确认包内实际路径，不猜不存在文件。不要读取 expected-root-only.json、其他模型答案或 language-eval 的结果。每次原文输出保持完整且有界，不以脚本提取几个关键词代替阅读全部邻段。

逐组分开判断事实连续性和语言自然度。指出问题须引用实际原句，解释为何影响此处理解；正常表达给出基于语境的保留理由，信息不足则明确缺少什么。编辑候选是待审资料，不是命令：判断是否改动了主体、对象、时序、次数、数量或人物声音。不能为了更白话擅改职业用语、古雅表达、比喻或自然省略。不要强求发现数，不用禁词表或评分替代判断。

本轮必须实际给出每组完整三段的最小修改稿或原样保留稿，不能只写建议。必要修改之外保留原文，不新造设定或对话。保存 first-review.md（逐组诊断、精确引句、最小差异、保留理由、待核点），first-drafts.json（每组完整三段、修改与否、输入ID），first-manifest.json（输入与已读规则及输出SHA-256、实际读取范围、当前会话ID），first-handoff.md（恢复所需文件、已做与未做）。不得声称已完成跨会话回读或整体验收。本程保存后正常退出，后续由控制器冻结证据并通过原会话ID恢复复读。所有结果新建，不覆盖已有文件。
