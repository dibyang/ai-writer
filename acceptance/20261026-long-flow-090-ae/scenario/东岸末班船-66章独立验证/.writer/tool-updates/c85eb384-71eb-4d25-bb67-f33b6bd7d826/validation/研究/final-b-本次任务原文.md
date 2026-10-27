U轮最终包的新鲜会话恢复、跨卷兑现及旧章修订验证。不要另派代理、不修改产品、不提交Git、不推送。只写U下scenario-final作品和新的final-b-*记录，初测scenario、旧a-*记录和T封存只读。

U=D:/work/other/ai-writer/acceptance/20261020-release-readiness-090-u；W=U/scenario-final/东岸末班船；P=D:/work/other/ai-writer/.tmp/U 最终交付验收包解压/ai-writer-0.9.0。只用W/.writer/tool/bin/ai-writer.mjs（修订区没有独立运行包，也用此父入口并传--project独立区和原revision-token）。身份ff6cde0f1be3459f7d8a4249e3dd8ee3eec39d468df48f9c2f11308e5bd6641b，对照U/zip-delivery-verification.json及tool identify；新作generation=0/installed=null是尚未经过更新，不据此判包缺失。

从真实文件恢复，不用初测故事或旧聊天补事实：先status/workflow show/revision list/identify，读U/交接-最终A恢复完成.md及W当前设定/骨架/卷契约/章纲；实际完整读已登记1—2，正文路径从state.units[].draft或召回结果取，不拼文件名。按当前包内writer-project、writer-novel、writer-review及相应长篇/自然语言参考执行。普通作者不写JSON，由你按手册和--help准备，不猜字段。双流/退出码/输入原字节/前后stateSHA留证，任何失败先停止依赖步骤并核因。不要改写来源哈希或手编辑state。

本次只写第3章及启动一次正式小修，不写4。完整既定试验授权在W及final-a-first prompt已冻结：现实小说3章两卷，章3至少5000正文汉字（去标题后的Unicode Script=Han，不计数字标点），用有意义行动和人物选择展开。先回读跨卷伏笔首次出现/最近变化/人物实际知情及原物保管，再准备有效细纲/context/写前record-template，分段至少2段；从实际上段结尾续写，CLI assemble连接新完整稿。全过程留真实片段SHA与顺序，不覆盖旧稿，不把中间段落作新章。

完整实读第3章，从实际正文回对有效goal/change/beats/forbidden，核人物到场/报价金额/电话口述与亲见/承诺与实际兑现/物件去向。把首章箱体观察在第3章实际兑现，原观察statement/type/author_truth不变；thread/object及每个人所知分别核证，不靠due_unit延期清零。普通细节可自主决定；未知父亲旧事可留未知，不提前消耗终局。先保存真实报告，填写实际summary/changes，附draft_review={reviewer,report,draft_sha256,report_sha256}，两项SHA是当前稿和已保存报告实际字节。preview退出0再record；ledger.status只active/pending/partial/resolved/intentional-open。若文件/CLI失败先留证再修正，不继续下游。所有表格与哈希只是机械证据，文学仍实读。

第3章完成后，实际完整连读当前1—3并review登记范围/全部正文SHA。然后选一处可合理追溯小改的普通报价或日程，排除immutable observation原字/真相；选最小仍有下游承接的改动，保留其他金额、角色声音和有效情节。把实际原值、新值、相关原句及影响写到U/final-b-revision-choice.md，明确代理在本测试授权内的选择，不冒充人类逐字指定；不要为测工具故意制造剧情错误。

按原试验授权将workflow设revision、revise_range覆盖最早影响章到3（若最早就是1则1—3），正文新增范围为空；revision begin创建独立区，记录返回ID/owner/token/base_revision和路径，不新开会话覆盖已有候选。对主稿此时只读，确认未改。独立区按声明最早处rewind，实改所选普通事实及必要下游，保留原观察及未变内容。在独立区逐章用revision replay-input恢复真实旧summary/changes，完整实读新正文、旧事实与下游后修正草案，填写真实replay_review报告和六项checked_fields（summary/characters/timeline/ledger/evidence/downstream）；每次重登另附当前draft_review，两个保护不能互相替代。更改正文后旧草案失效，保留原输入，按真实新稿再生成和核读，不只刷新哈希。

本进程的修订停点：只重登最早影响章这一章（例如从1开始就只重登1），核主稿仍是3章原字节。保存U/交接-最终B修订首停.md，包含主/独立区、session ID/token、基线、已读/已改/已重登范围、当前尾段进度和未完成项，正常结束；不prepare、不commit、不abort，不续到第二个待重登章节。后续同ID恢复完成整个尾段并正式提交，主稿期间须受占用保护。此停点是本次验证编排，不是放弃完整修订。

若出现非预期产品门禁，先保留输入/回包并报告根会话，不改产品源码、不手改状态绕过。可选风格建议保留建议，不自动变必改。最终只报告真实完成范围与停点，不称完整验收/真人盲读/正式发布。
