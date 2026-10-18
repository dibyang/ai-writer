这是ai-writer第三批C原生验收第二个独立Codex进程。实际执行，不只提出计划。范围只限acceptance/20261018-governance-c中的第一阶段新作《渡口旧箱》和本阶段材料；主源码/技能/手册只读，不改真实作品、旧封存、全局配置，不Git提交/推送，不创建代理或向其他会话发消息。主cwd为ai-writer根，用当前bin/ai-writer.mjs，所有产品CLI经本批capture.mjs加唯一native-two-*标签，输入/输出/失败全部保留。

从文件恢复：先读AGENTS与writer-project/writer-novel/writer-review及长篇/本批手册；再读native-create-review/report.md和handoff.json、所有六章实际正文、当前权威/章纲/分卷/事实及意见。不能引用上一会话记忆。第一阶段在修复前候选上执行，本阶段主工具已有边界修复；按实际tool identify/compare及逐调用守卫核对差异，不升级作品随附工具，不因版本同为0.6就称内容相同。第一阶段控制样本是第五章唯一“布袋里里”，它在O_KEY证据里，真实数据须回读确认。

本阶段模拟作者新原话，保存到研究/第二阶段模拟作者取舍.md并标注synthetic-acceptance，不冒充现实作品作者或伪造消息ID：
“采用第五章‘布袋里里’的重复字意见，只做该处最小修正；可选风格意见保留原句，结构复演/节奏疑问延期，不借这次修订删去人物声音或增添冲突。授权独立修订范围5–6，第六章只核承接和等价重登，不另改正文，不写第七章。保持既有事实、观察statement、人物所知、物件位置和伏笔结论，更新与新稿相符的证据版本。完成实际提交及应用绑定后暂停，下一独立会话再做全六章复核。”

根据这份真实本地模拟原话先在主作品workflow登记revise_range5–6、无draft，再按第一阶段实际意见ID分别resolve adopted/retained/deferred，decision_actor=author且完整绑定这份原话。不要擅自采用其他细节或把保留记作修复。三条处置在begin前完成，不在窄分支越界处置旧意见；如果用代理处理，必须如实标agent-within-authorized-scope，不能伪称作者逐条确认。本场景的三项作者选择来自上面明确模拟指令。

保留修前state、全部正文、units/事实及意见证据。revision begin仅5–6，主稿直到commit前不变化。独立区rewind5后只改第五章重复字，确认第六章原字节不动。第五章旧“布袋里里”引文将失效：调用revision replay-input --unit 5 --revision-token真实令牌，旧summary/changes与本次来源哈希由产品恢复。先用未完成草案record-preview，预期拒绝（stdout ok=false/退出1），状态不变；保留旧失效引文的实际诊断。真实核读新稿、旧事实、人物/时间线/ledger/引文和下游承接后更新summary/changes及O_KEY引文，填写replay_review真实报告和六项checked_fields，再preview/record。不要为了过检只改SHA，未变事实不誊写全快照，也不删观察或未知项。

第六章同样取产品replay-input，正文保持原字节，实际核查并填报告后preview/record。可用out写新的.writer/drafts可读入口，禁止覆盖旧输入。全局活动设定不为控制样本改写；新模拟作者指令优先于第一阶段“暂留控制样本”的任务记录，该历史任务不应被改成新事实。必要的章纲同步仅限新授权范围，不扩大修订范围。

完整实读最终5–6后正式review绑定最终字节（结构化或基础形式均可，不能拼接短评），主稿prepare/commit。核原主revision只加一次，不复制分支临时计数；重复commit应幂等。主稿1–4完整登记对象/正文不变，第6正文不变，只有第5指定重复字改变。事实的实际内容保持；因第5全文SHA和引文变化更新的证据版本单独列出，不能要求证据SHA也不变。

只有实际commit成功后，review-issues apply绑定采用意见的真实commit_id、原旧稿与当前新稿。实际应用可查，不把retained/deferred或尚未提交候选记applied。此阶段到applied停止：不verify，不提前称全六章新稿已复核。按模拟原话正式暂停，无第七章授权；验证状态/正文/下一步如实，不写7。保留全部分支、备份与原意见/原报告，原功能表因第5新稿应过期，不删来清零。

交付native-revise-apply/report.md、handoff.json、verification.json、command-index.json：同一作品路径、明确作者取舍及三条真实ID、阶段/范围、主和分支revision、session/commit/事务ID、所有正文前后SHA及实际差异、1–4登记保留证据、第5引文与事实内容对照、旧功能表有效性、状态applied/retained/deferred、下一阶段复核入口。保留拒绝/重试及辅助错误，真实CLI原始记录和构建守卫，不冒充真人盲读或市场验收。不修改工具；发现产品缺陷保留最小复现并在报告说明，不绕过协议或伪造状态。
