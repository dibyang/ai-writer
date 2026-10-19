这是S轮一次真实全新 Codex 修订会话验收，不是协作子代理。只可写 D:/work/other/ai-writer/acceptance/20261020-long-flow-090-s/，不得改其他作品、Q/R封存、工具源码或Git，不启动其他代理。先读execution-guide.md及revision-one.mjs（这是本轮接受真实CLI的捕获辅助，不自动审稿），并读项目docs/revision-and-sources.md与docs/review-and-registration.md相关协议。

父会话已在本组九章完成后运行revision-one.mjs init：阶段切到revision，仅授权4—9完整尾段，旧V3卷契约冻结为S_V3_ORIGINAL，尚未发布。先主作品status/source list/revision list，读r1-workflow-before.json、commands/r1-impact-baseline/stdout.raw.txt。完整实读主作品正文4—9章、第三卷原契约、S轮续篇骨架、前述影响预览required_readings涉及的全部真实文件（若分页面就读完）。不要把脚本字段当语义判断。

背景：S轮把正文授权扩到18章，但复制的第三卷仍带Q轮“未来骨架，未授权正文/未来计划/未定”占位文字。明确的S授权和新续篇骨架一直存在；这是测试初始化的规划遗漏，不是工具绕过授权。旧消费字节/哈希不能直接替换。A实际连读又发现第四章第9行“柜台上的饭桌”与同章139/141/165行饭桌在后间的空间关系冲突，见审查/S-0004-0009.md H04-01，父会话也完整实读该章确认。另有第八章一处冗余对白候选，见parent-read-snapshots/0008-initial-notes.md；它是语言改进，不是凭“AI味”判硬错，先实读判断。本次修订从4开始，V3新版只从7生效，4—6继续原卷契约。

具体顺序：
1. 写主作品 审查/S-R1-原卷契约影响.md，绑定实际读过的旧卷契约和正文/required_readings哈希，说明baseline只固定原字节、不给旧章伪造原本没有的授权。创建主作品 研究/S-V3候选.json，保持id=V3,start=7,end=9,arc id=A3、start/end不变。title改“先去见一个人”，promises为“经实际联系确认一次有限走访并完成会面”；constraints保留人物知情和交接，说明只做一次有限走访、原片与节目单不外借；reserved为旧片完整来历；arc.goal为“尊重工作与照料限制，安排并完成一次走访”，payoff为“实际会面并取得可撤回的有限讲述”，forbidden保留“不揭晓旧片完整来历”。这只澄清本轮已经授权的规划范围，不改观察或未来强行补证。
2. node acceptance/20261020-long-flow-090-s/revision-one.mjs baseline：发布原版baseline并等价bind旧7—9消费，冻结候选，生成历史影响预览。实读新预览的required_readings、新旧契约和相关原文，再写主作品 审查/S-R1-新卷契约影响.md，明确文本事实与计划澄清的区别、保留未知及第八章语言最小改进范围。
3. revision-one.mjs stage：持久stage影响、begin独立修订、rewind4，并在独立区发布从7生效的新契约。r1-session.json返回真实workspace/token，后续只在这个独立区操作；主稿仍保留原始九章，不直接改主稿/哈希。
4. 依次处理第4—7章：每章先revision-one.mjs template N得重登草案，实读独立区正文及原稿/实际有效契约。第四章保存修前字节后，将“柜台上的饭桌”最小改成“后间的饭桌”，全文复读核空间关系，不动三格原观察/用途、物件交接和人物所知。5—7事实无必要改则保留正文和changes，V2仍原版、V3才新版。每章写独立区审查/S-R1-重登-000N.md（四位数），实际核summary/characters/timeline/ledger/evidence/downstream六项，绑定当前稿SHA，具体说明下游承接，再revision-one.mjs record N。脚本只填结构与绑定，真实阅读必须完成。
5. 分段/交接/留稿不是工具revision的自动复制/发布树，不要假定它们已在独立区；主稿旧分段应保留为原版中间稿，父会话会在commit后从原分段最小派生新版本并核最终合章。不要把新建未受管分段误称已经事务发布。
6. 在主作品交接/S-R1-中断.md保存实际session ID、workspace、token文件路径（可引用r1-session.json不抄secret）、主/独立区r号、已经发布的契约版本、主稿九章未变与候选仅重登到7章、8章待最小修改/9章待复核、实际文件/哈希、恢复入口。不要改八章、不重登八/九、不prepare/commit、不恢复trial。正常退出，等待父会话的真实exec resume。

遇到辅助脚本或输入异常保留所有原输入/日志并报告；不删失败证据、不手改state，不声称尚未完成的步骤通过。
