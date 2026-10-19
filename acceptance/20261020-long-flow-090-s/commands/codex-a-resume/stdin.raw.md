继续同一S轮验收，仅可写 acceptance/20261020-long-flow-090-s/，其他作品、Q/R封存、工具源码与Git均不得改；不得启动其他代理。

这次是真实跨进程 exec resume。先 status 恢复，只凭实际当前文件确认工作进度；实读交接/S-A-中断.md、两个分段全文，核对哈希、人物所知、位置与物件。不要重写已完成的两段，也不要另起一章。保持原写前模板（来源与revision未变才能用，变了先报告并保留旧输入）。

父会话在你第一轮读写期间并行构建了S/candidate并运行source-test、package-tests、doctor与ZIP核验，因此S验收根目录文件数/全树摘要会变化，commands中的运行日志也持续增长。这不等于作品正文/模板/状态变化；按具体文件核对，不用根目录全树摘要误报作品冲突。既有.source/模板/正文哈希保护仍须全部保留。父会话读完了你最初两段，对最终段稿的检查以实际最新字节为准。

完成第7章第3—5段，每段1600—1900汉字，全章至少7500汉字、目标8000左右。第1段含唯一标题，其余段无标题/摘要，各段具体过程和不同的交流不能互为改述。续第2段实际结尾，按计划让周伯提出有限走访，原片与原节目单均留周伯处，陈阿姨未到场不能擅自把她记为已同意。之后按文件名顺序用两个换行拼接为正文/0007.md，完整复读，必要修改保留初稿副本并同步实际分段，避免重开场/丢段/漏动作。

接着依次完成第8、9章，各3500—5000汉字、各拆3段；严格先 prepare 再动笔，不先写后刷新哈希：
1. 主项目运行 node acceptance/20261020-long-flow-090-s/flow.mjs prepare N，准备当章plan/context/写前模板。第7章已prepare，不重跑。
2. 读 .writer/drafts/s-context-N.json、计划与前文真实结尾。分段保存 分段/000N/part-01.md 等（第一段唯一 # 标题），正文/000N.md = 分段按序用两个换行拼接，不能拿提要补字数。
3. 完整实读最终章并回对细纲，创建 交接/登记-000N.json，格式为 {summary:"按实际总结",changes:{characters:{"实际角色":"此时状态/所知"},timeline_append:["实际日期与事件"],ledger:{...}}}。沿原schema6差量格式，不改.writer/state.json。ledger只登记正文有证据的变化，真实quote必须逐字出现在对应章；新thread需type/statement/status/cast/tags/reader_known/character_known/evidence，due_unit合理；旧物件只更新真实custody/knowledge，观察statement不改。可以参照原已登记input及state的字段，但不能复制旧状态当新事实。
4. node acceptance/20261020-long-flow-090-s/flow.mjs record N 会检查篇幅、合章字节、preview/record/check；报错保留输入，定位后用不同文件名/label重试，不改旧日志或直接换哈希蒙混。若helper已有同名证据导致重试失败，在本轮新建带retry后缀的脚本/输入，不改已成功证据。

第9章末实读正文4—9章，写 审查/S-0004-0009.md，包含实际范围与逐文件SHA、分段接续、纲文回对（真实引文）、人物所知、旧物交接、跨卷线索及不同章的行动收益，区分确认错误与偏好。真人语言别扭句按技能给出硬问题，没有则写没有，不能以脚本绿灯代替阅读。实际需要改已登记章时不要直接改主稿：停止并留下问题，父会话走正式revision。
然后 flow.mjs review 9 绑定这次完整读稿。保存 交接/S-A-完成.md，写当前state revision、已登范围、物件/知情/未结线索、下一卷承接与未覆盖问题。完后退出，不写第10章、不暂停整个授权，不改变workflow。
