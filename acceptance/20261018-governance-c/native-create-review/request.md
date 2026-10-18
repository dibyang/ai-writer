这是ai-writer第三批C真实原生Codex验收第一阶段。请实际完成，不只提计划。只能在D:/work/other/ai-writer/acceptance/20261018-governance-c中新建/修改本阶段作品和材料；工具/技能/手册只读。不得改D:/work/小说/dzkxqxx或任何现有作品、旧A/B/百章封存记录。不得Git add/commit/push、联网发布、生成其他会话、子代理或跨会话发消息。主cwd保持ai-writer根目录，产品入口使用本次主bin/ai-writer.mjs，不改安全设置。

先读AGENTS.md、writer-project、writer-novel、writer-review及任务需要的参考；再读docs/review-and-registration.md和本批实现约束。使用当前源码，记录运行守卫、schema、原始输入及每次产品结果。所有产品CLI均通过本目录capture.mjs加唯一native-one-*标签，例如node acceptance/20261018-governance-c/capture.mjs native-one-01-init node bin/ai-writer.mjs init ...。记录器的result只是元数据，实际产品返回在stdout.raw.txt/stderr.raw.txt。辅助脚本可放native-create-review下，避免import带执行入口的脚本。错误/失败保留原样，重试用新标签；不得手工编辑state、事件、原消费哈希或把测试报告冒充模型阅读。模型读稿用FastCtx分段实读；长行截断须补读，不据摘要自称读完全章。

本阶段模拟作者原话（须保存在新作品研究/验证授权原话.md并注明合成验收，不是现实作品作者决定）：
“创建独立小说《渡口旧箱》，现实小镇题材，失物交接、误认与修复关系，不设系统或大阴谋。计划两卷六章，每卷三章，先组织定位、人物声音、全书骨架、卷契约与滚动细纲。本轮只授权试写1–6，完成后暂停正文，只做结构审查，不写7。每章正文800–1100汉字，保持亲近、自然，不把审核结论写进对白或旁白。对象、物证、人物所知和伏笔以正文登记。”

使用init --mode long，默认schema5；不得擅自跳回旧协议。允许在这个新测试作品预置一处可复现的控制缺陷：第五章保留一次明显重复字“布袋里里”，该句描述真实钥匙保管动作，并将包含该短句的完整句子作为O_KEY本章evidence之一，以便后续检验旧引文失效。明确在验收材料标注该处为人为控制样本，第一阶段只报告，不能修掉它；这不代表拟交付读者的定稿。其他高置信错误可在首次登记前正常修复。不要为结构复核额外造死伤或更大阴谋。

六章至少有一对表面核查动作相近但选择/后果实际不同；允许一处可商榷的结构复演，最终如实判断，不强贴重复结论。先规划再写，物件持有人、信息来源、观察与解释分开登记，跨卷兑现至少一项前卷线索，同时保留确有未定的后续计划。核对每章实际汉字数（去标题后Unicode Script=Han），不把摘要、追踪和报告计正文。逐章通过context、写前record-template、实际changes、record-preview、record、check；空摘要和当前哈希仍受保护。可以使用--out .writer/drafts/语义名称.json，禁止覆盖旧输入。

完成六章后按原话正式登记暂停/结构讨论，next_unit仍7但没有新正文授权；实测context --unit 7或record-template越权拒绝，状态哈希不变，不创建第七章正文。之后真实完整连读最终六章，不以刚写过或账本摘要代替。使用review-template按实际阅读填写完整五项功能表和comparison：相似结构、真正不同的阅读收益、保留项、可选调整、不确定性与引文。不存在的关系变化可none/unknown说明原因，不能编造；脚本不能判定文学重复。

用结构化review登记三条稳定ASCII ID意见：控制重复字为readability高置信问题；另有一条真实可选风格建议（optional_style/suggestion，不升级必改）；一条结构/节奏上证据不足或待作者选择的意见，明确不确定性。不能凭凑数发明硬伤。此阶段仅登记open，不采用、不改稿、不绑定applied/verified。验证review前后全部六章正文、units、事实snapshot保持不变，只有review_workflow和revision等业务元数据变化。

交付到native-create-review/report.md、handoff.json、body-hashes.json、source-input-index.json、command-index.json：作品完整路径、schema/revision、所有六章真实路径/字节哈希/正文汉字数、作者授权及阶段、当前next、三条意见ID/原句/类型、功能表review_ref、实际报告/阅读覆盖、事实和人物知识边界、受控缺陷说明、未来未决项、每次真实CLI及错误/重试、记录器构建观测。保留作品全部文件与输入原件。不要写7，不修改控制缺陷；下一阶段将只凭文件恢复后按新模拟授权修订5–6。
