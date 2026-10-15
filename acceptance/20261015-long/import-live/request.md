在当前 ai-writer 根目录进行一次真实的自有旧稿导入与文件恢复创作。只使用给出的两章原文，不读取其他验收作品的第三章、续写交接或剧情答案。原文是本工作区本轮原创验收样稿，角色是本书续写基线，不是外部对标。

读 writer-project 与长篇流程、writer-novel 和必要审查规则。使用根工具初始化 acceptance/20261015-long/works/导入恢复，title=末班寄存柜，kind=novel；随后用其随附工具/技能。启用长篇协议。已提供的输入清单是 acceptance/20261015-long/import-source/import-input.json，原文为同目录0001.md与0002.md，哈希来源记录在provenance.json。

先实际完整阅读两章，从已发生内容反推作品定位、文风、权威规则、角色卡和1–3章分卷规划。原文未载的作者秘密和人物知识不要猜成事实。import-index后调用import-next；同一章再调用一次验证不会提前跳章。逐章实读、保存细纲，取context/record-template，填写真实summary/changes及必要的ledger正文证据，record/check后才进入下一章。原文与导入副本保持逐字一致，不先润色原稿，不手改state。

两章登记后检查import-status的角色、原文件/副本哈希及覆盖。只靠这些文件恢复到第3章，原创续写约450–650汉字，推进现有处境和一个有证据的核查步骤，保留合理未定边界，不提前定下箱主。仍按plan/context/template→正文→实读自检→record/check执行。完整连读本次1–3章，登记model-self-review的真实覆盖和哈希，导出到同级新目录“导入恢复-v1”。

本次只保存必要设定、追踪、实读报告和简洁结果，不为每个命令另写说明。实际事件由外部执行器留档。阶段结果写acceptance/20261015-long/import-live/result.md，区分索引/读取/登记/续写，报告失败和未覆盖。不要称为整部长篇验收；不要改工具/技能、提交、推送、发布、调用付费服务或另派代理。若确认产品问题保留现场并说明，不绕过状态与哈希保护。
