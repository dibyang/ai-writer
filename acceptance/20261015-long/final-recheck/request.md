本次只做最终候选的真实Codex恢复与交付检查，不创作新正文、不另派代理、不修改工具/技能/原有稿件。所有工作在当前ai-writer根目录、acceptance/20261015-long范围内。

先读candidate-validation-v2.json了解最终工具/技能哈希，及docs/long-form.md中的当前协议。四个作品目录分别是acceptance/20261015-long/works/末班寄存柜、留一把椅子、字散开以后、导入恢复。工具已显式备份同步到最终候选；不要自行再覆盖。请实际调用各作品随附的.writer/tool/bin/ai-writer.mjs：doctor不带--project；status/check带明确作品目录；长篇status应使用默认精简输出。只把实际结果写入结论。

在六章小说和剧本中用recall定位一条现有物证或线索，读对应源段落并核对当前位置与未结边界；对导入作品执行import-status核对导入覆盖/原文副本哈希。历史散文只核对事实卡引用链和登记，不冒充新的史学核验。无需把完整状态/全部正文加载进会话。

每个作品用随附工具重新export到acceptance/20261015-long/final-recheck/exports下以目录名区分的新目录，不覆盖任何已有导出。重新计算合订稿哈希、检查manifest与当前revision及单元范围，并核对随附运行文件和七个技能入口/长篇参考与candidate哈希一致。核实原稿与state在本次检查前后没有变化。

最后把简洁实际结果保存到acceptance/20261015-long/final-recheck/result.md，明确这只是最终候选的恢复、工具和交付复核，不是重新创作、真人盲读、市场或整部长篇验收。遇到错误保留输出并说明，不重新取哈希绕过保护，不提交、推送或发布。
