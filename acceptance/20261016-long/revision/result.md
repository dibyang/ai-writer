# 雨线档案：旧章修订与连续性恢复结果

日期：2026-10-16。完成范围为第1–8章既有文本修订与恢复登记；没有写第9章。语义结论为本主会话知情模型审查，不是真人盲读或正式验收。

作品：acceptance/20261016-long/works/雨线档案。证据目录为同阶段revision/。产品代码和其他阶段输出未改；未读其他阶段聊天事件/请求作剧情依据；未使用子代理，未提交、推送、发布或外部上传。

## 实际修订与保留

这是作者改写旧版本：纸签首次出现即为九号柜，不是人物记错后纠正。副页待核、半月缺口、黑垢及原有基本事件保留。正文共6处必要替换，未按字数扩写：

| 位置 | 改前 | 改后 |
| --- | --- | --- |
| 第2章纸签 | “七号柜”“副页待核” | “九号柜”“副页待核” |
| 第5章林岚告知 | ‘七号柜’，‘副页待核’ | ‘九号柜’，‘副页待核’ |
| 第5章陆衡追问 | 七号，是纸签写的？ | 九号，是纸签写的？ |
| 第6章目录 | 七号柜那一行 | 九号柜那一行 |
| 第6章末 | 铜钥匙也仍在她内袋里。 | 铜钥匙也仍在林岚包内袋里。 |
| 第7章批件 | 准查七号柜旧泵房维护档案 | 准查九号柜旧泵房维护档案 |

第1、3、4、8章正文原字节保留。第1章完整登记索引、journal及O_KEY观察未变；第3、4、8章虽未改字，也完整重读并通过record重新建立追踪。细纲仅0002.json：change及第2个beat中的柜号；0003.json：禁止陆衡提前知情条款中的柜号；0006.json：第1个beat的目录柜号同步，共4处柜号替换；由真实plan命令落盘。其余细纲、全书大纲、三卷契约和设定未改。

## 回退、重新登记与版本

修改前before/已冻结54个来源/状态/审查/检查文件，另有manifest.json（55个文件总计）；备份全部哈希已回读验证。含实际1–8正文、state、当前journal、4条审查登记及审查正文、计划/设定、历史登记输入。before/status.json与before/check.json绑定revision11。旧记录仅作历史证据，不采用其过期revision/source_hashes。

正式命令：node bin/ai-writer.mjs rewind --project acceptance/20261016-long/works/雨线档案 --from 2 --expected-revision 11。结果revision12，失效2–8共7章，全部旧正文保留，仅第1章仍登记。CLI原生备份为.writer\rewind-11-b56719ba-8138-4bf3-8d4f-d483fc2fbf11.json。回退后的status/check/state及0有效／4过期结果在after-rewind/。

O_LABEL在回退后的账本中不存在；本轮record2才重新建立“九号柜／副页待核／无日期签名”的观察，introduced_unit=2。未在保留旧观察时逆改不可变字段。各章先核对受影响细纲，再独立取得新context与写前template，完整读最终章稿后填写摘要与changes，顺序登记；从历史输入仅取已按实际正文复核的语义候选，所有expected_revision和source_hashes均来自本轮模板。未手改state或journal。

| 章 | 写前revision | record后revision | 实际最终正文SHA-256 |
| --- | --- | --- | --- |
| 2 | 12 | 13 | 6bd808fd5207d8b0ac5e61c638ab98fcc3b7d3e3f2b6d7cf16742630c2fb56aa |
| 3 | 13 | 14 | ffea4b0bcf78324fb8730a2b3a1d887a42d834592ce080ef60717f54365a6639 |
| 4 | 14 | 15 | 8d36322983b01b06d51df3c83024a60fd5e463625a0d45bb5966148d661acbac |
| 5 | 15 | 16 | be9c98f75ac5c7ebeb64c636aea108b52ec2e7f3c025669373f0696071e49683 |
| 6 | 16 | 17 | 913c0d95f2caf6031f98bb89ad31a7a41854d63ebdfb3d9aee249c16c62cb799 |
| 7 | 17 | 18 | 4298c06d3fd9f4475a6790c103fbac6a59f40186b3f122eade8a0a3ab4068a08 |
| 8 | 18 | 19 | 1bedc669d89cca42c2a33be8e1972cf8e663c4f4f6d98cebbce67c4a9d6164a2 |

最终state revision：19。state文件SHA-256：7fc85c13a45fe9f4a0dd3a7f6c19cfaf99107134210cf936e97c165872f7fe5a。修前state SHA-256：0950355a6f015b483c710549b0e7ba0ff0b53e6309f82ef3498242e60a68ce85。回退state SHA-256：b5a95e8124f6374a56b91bfa3c4dab133856667e26083e4c8a626a67ed682bf5。完整最终状态副本为final/state.json，原件仍以作品.writer/state.json为权威。

| 章 | 正文处理 | 修前SHA-256 | 修后SHA-256 |
| --- | --- | --- | --- |
| 1 | 保留原文 | 2232c3542b7c153b7d39534dcec189361efe66d1881b35bad654d6275607448d | 2232c3542b7c153b7d39534dcec189361efe66d1881b35bad654d6275607448d |
| 2 | 修订 | 010ece4a0cae2fc61b6233570813bfb7b9f1a1bb51c64244439d6f43a82b6b33 | 6bd808fd5207d8b0ac5e61c638ab98fcc3b7d3e3f2b6d7cf16742630c2fb56aa |
| 3 | 保留原文 | ffea4b0bcf78324fb8730a2b3a1d887a42d834592ce080ef60717f54365a6639 | ffea4b0bcf78324fb8730a2b3a1d887a42d834592ce080ef60717f54365a6639 |
| 4 | 保留原文 | 8d36322983b01b06d51df3c83024a60fd5e463625a0d45bb5966148d661acbac | 8d36322983b01b06d51df3c83024a60fd5e463625a0d45bb5966148d661acbac |
| 5 | 修订 | bea09bed43bba94503028567e247b20de8e462c126022017d523f394df690136 | be9c98f75ac5c7ebeb64c636aea108b52ec2e7f3c025669373f0696071e49683 |
| 6 | 修订 | fd50517329a1b0117f9bd4d4cd84f8b68035b6563cf72f549739fd3dca532f65 | 913c0d95f2caf6031f98bb89ad31a7a41854d63ebdfb3d9aee249c16c62cb799 |
| 7 | 修订 | 0ae0b2972189b1f4af1f806321e5647caf5c60ba40ebfa35e774f7834ba35ae5 | 4298c06d3fd9f4475a6790c103fbac6a59f40186b3f122eade8a0a3ab4068a08 |
| 8 | 保留原文 | 1bedc669d89cca42c2a33be8e1972cf8e663c4f4f6d98cebbce67c4a9d6164a2 | 1bedc669d89cca42c2a33be8e1972cf8e663c4f4f6d98cebbce67c4a9d6164a2 |

## 跨章复核与当前恢复点

修改前完整实读1–8章及相关计划/账本；逐章重登时完整复读2–8；最后再次顺读1–8最终稿。最终阅读副本为final-reread.tmp.md，SHA-256 e9179ec00a761f88428944835678220e360b280bd5f0deaaa4585434cf07b2d7。逐章context、template、输入、record结果、state前后副本及check在chapters/02至08/，哈希汇总在final/record-provenance.json。

当前正文、state及15份已消费计划/设定无旧柜号残留，52条当前账本引文的正文哈希、行号和实句均匹配。audit.json记录只读机械核对；语义复核记录在作品审查/1-8修订连读-20261016.md，其SHA-256为6dfe50dc8731dce92c24580a411155953c20f756f43f87986ab87d92c9f42837。

钥匙：陈师傅→林岚（第1章）→陆衡（第7章）；第5–6章始终林岚包内袋，第6章只是消歧，没有交许澄。最终在陆衡双肩包小拉链袋内透明袋，袋口未开，未试锁、未复制、未证实匹配。封套：许澄→林岚（第2章）→陆衡（第4章14:20）→许澄（第5章），最终仍许澄上锁干燥抽屉，签封未拆。无物件凭空回到前保管人。

知情：林岚和读者第2章亲见九号柜与副页待核；陆衡最早第5章实际听述，许澄同章随后获告知；两人仍未亲见内签。目录、批件与环境签字不等于副页已找到。第8章末档案柜未开，铜钥匙未出袋，维护册与副页未取得或比对。T_COPY=partial、due_unit=6继续到期挂账，第6–8章写前context持续召回due；T_MISSED=intentional-open，私人原因未定不补。V3仅为未来计划，本次没有unit9细纲、正文或record。

## 审查有效性

| 时点 | 有效 | 过期 | 待审窗口 |
| --- | --- | --- | --- |
| 修前revision11 | 3 | 1 | 无 |
| rewind后revision12 | 0 | 4 | 尚只登记第1章，无到期窗口 |
| 2–8重登完、登记新审查前 | 0 | 4 | 1–3、1–6 |
| 最终revision19 | 1（本次新报告） | 4（旧登记） | 无 |

新review真实登记.writer/reviews/f06b5e69-a8d2-41ca-adf3-927719eb06ef.json，覆盖[1,8]，包含1–6有效滚动连读；没有为了填数量重复登记报告。旧4条的失效原因保留如下，旧报告/旧日志中的原柜号不清除：

| 旧审查登记 | 范围 | 最终失效原因 |
| --- | --- | --- |
| .writer/reviews/08e38c80-aff1-4692-b7f6-8970758ac8f0.json | 1–6 | unit 2 unregistered or hash differs; unit 5 unregistered or hash differs; unit 6 unregistered or hash differs |
| .writer/reviews/110eae28-d768-4843-94b3-36e968ca9f55.json | 7–8 | unit 7 unregistered or hash differs |
| .writer/reviews/9f3b4b18-6e8f-4e16-80e8-7795571dce10.json | 1–3 | unit 2 unregistered or hash differs |
| .writer/reviews/a77330d7-65cb-4172-a15f-35b1af5e2e7e.json | 1–6 | report hash; unit 2 unregistered or hash differs; unit 5 unregistered or hash differs; unit 6 unregistered or hash differs |

final/check.json：ok=true、8章、revision19、findings=[]、未登记稿=[]。final/status.json：next_unit=9、stale_units=[]、changed_sources=[]。CLI审查状态仅表示覆盖与哈希有效，不宣称文学质量通过。

## 导出与交接

真实export输出revision/export/，included_units恰好[1,2,3,4,5,6,7,8]，excluded_drafts=[]、warnings=[]。manuscript.md SHA-256：8a2aaaba1da6653636472fe12ff348f38d98e9c96176d6e68ba53da7690d59ab。导出全文逐章核对包含实际最终正文，只有8个章标题，无旧柜号。export/manifest.json保留全部正文与来源哈希。状态为draft-export，未发布。

下一会话先运行node bin/ai-writer.mjs status --project acceptance/20261016-long/works/雨线档案；读本结果、作品state与本次审查报告，再按实际授权行动。新写前必须重取context/template，不复用chapters/中的历史写前包；next_unit=9只是恢复点，不是本次续写授权。无须重跑finish.mjs或export覆盖已交付目录。

## 错误与范围限制

共保留1次非零CLI调用：record-template误带--max-chars，报“无效、重复或缺值参数：--max-chars”；修正参数后成功，无登记数据损失。另一次FastCtx寻址编排TypeError也保存在errors.md。原始CLI argv、退出码、stdout/stderr在cli-session.jsonl；没有用手改JSON绕过校验，也没有认定为产品缺陷或改产品。

本次CLI证据日志起止2026-10-15T16:38:56.756Z至2026-10-15T16:46:43.345Z，该日志跨度约7.8分钟，不包含最初读取技能/正文的时间。未作真人盲读、市场验证、现实档案专业验收或第9–12章结果验证。产品源码未修改，因此未运行产品npm测试；实际执行的是本轮作品status/check、哈希证据核验、review和export。
