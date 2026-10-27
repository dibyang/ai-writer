执行U轮最终修正版的新用户端到端测试。这是原生Codex实际创作验收，不是开发委托；不另派代理、不修改产品、不提交Git、不推送。只写本轮U下新建的scenario-final作品及final-*前缀记录。初测scenario、a-*.mjs、旧prompt/交接、candidate和T封存目录一律只读，不复制初测的规划、片段、正文或state，不把初测过程当最终验证。

仓库D:/work/other/ai-writer；U=D:/work/other/ai-writer/acceptance/20261020-release-readiness-090-u；最终包P=D:/work/other/ai-writer/.tmp/U 最终交付验收包解压/ai-writer-0.9.0；新作品W=U/scenario-final/东岸末班船（必须起初不存在）。身份来源U/zip-delivery-verification.json，content_id必须ff6cde0f1be3459f7d8a4249e3dd8ee3eec39d468df48f9c2f11308e5bd6641b。只用P/bin/ai-writer.mjs初始化，之后W/.writer/tool/bin/ai-writer.mjs实际操作；禁止用源码lib和旧候选工具。调用日志标签final-a-*，辅助脚本final-a-*.mjs，新日志目录不覆盖；可以复用只读U/run.mjs或自建小记录器，不能执行旧a-run.mjs（它指向初测W）。

先实际读P/docs/quickstart.md、user-guide.md、writer-project/SKILL.md、writer-novel/SKILL.md、长章chapter-delivery参考；审查时按writer-review及通用/自然语言参考。复杂输入查包内workflow.md和--help，不猜字段。作者普通口述由你转JSON，保留失败及修正版、完整双流/退出码、输入原字节和前后stateSHA，任何失败停止依赖步骤。帮助文本不作JSON、preview阻断退出1、异常退出2；不写后刷新来源哈希规避保护。

本次工具试验方案由主会话在用户“按你的建议继续”的授权内选择，不冒充人类逐项指定的人物与情节，不影响现有作品。原创现实题材《东岸末班船》，总3章两卷，章1/3各至少5000正文汉字、章2至少3500（去标题后的Unicode Script=Han，不含标点数字英语）。温暖克制，通过行动、选择、生活后果展开，避免审核旁白和反复边界解释。小镇轮渡检修停航前夜，夜班值守许蓉、修理工周岸、代父取工具箱的沈禾，要将一件误放候船室的旧工具箱在关门前交到真正领用人手中。第一卷1—2找对领用关系，第二卷3实际归还及有限收束；父亲旧事可未明，不强行解释全史。一般细节自主组织，人物到场与知情来源、原物保管、押金退还、承诺和真实兑现要分清。首章一个真实可见箱体细节记immutable observation，第三章实际跨卷兑现；另有thread/object及分别人物知情。

完整测试授权：新建novel --mode long，先定位/人物声音/全书骨架/两卷契约，近期细纲，decision集中区分本次试验已选与候选（明确代理选择来源）。保留真实本prompt原文、SHA/quote/locator作为试验授权证据，不伪造人类消息ID。随后有限试写1—3，首章分段中断同ID恢复，第三章跨卷；写完可将一处普通报价或日程（非观察原字/author_truth）作合理追溯小改，授权从最早影响章至3在独立区实读重登/尾段连读/prepare/commit；最后新鲜会话完整审查当前1—3、暂停仅discuss、实际拒绝第4章、导出草稿到U下新目录。背景规则文件只记长期设定，阶段/当前章数/停点/本轮权限归workflow和交接，不混入默认设定消费。

本进程只做到首停：
1. 新建并核doctor/identify，完成上层规划、两卷契约和当前有限workflow；新作默认direction不是正文授权，按真实试验依据设置范围。
2. 第1章动笔前取context与record-template，保存写前输入和来源副本，核完整阅读；片段中断期间保持revision与来源不变。
3. 第1章仅写前两个片段，分段/0001/v1/01.md及02.md，每段约1100—1500正文汉字。第1段可有唯一章标题，第2段无重复章标题。实际完整阅读两段、修复授权内高置信问题。
4. 不写03.md，不合章，不record，不写2/3章。保存U/交接-最终A首停.md，记录W、实际工具身份、workflow/revision、模板/来源/两个片段路径SHA、实际已发生与人物物件现状、未完段及当前可行下一步。原生会话ID不知就不编造。
5. 正常结束进程，等待根会话核验再同ID恢复。不得声称3章完成、真人盲读或正式验收。

长任务定期报告进展。可以用文件写小脚本保存输入，但不要创建庞大重复框架。中文正文用apply_patch或实际UTF-8文件，避免多层shell内联引号、Buffer被JSON化写入正文。遇到非预期门禁先保留证据，按实际原因修正；产品疑似缺陷向根会话报告，不自行改产品或state。
