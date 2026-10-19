# S-R3 新工具等价回放后当前入口

2026-10-20。本轮真实Codex客户端已完成最终随附包generation3的11—12等价重登及7—12最终连续实读，到本交接处退出。仅写S目录；没有改正文/业务事实、其他作品/封存、产品源码、Git或全局配置，没有启动子代理、联网、发布，也没有写或补13。

## 当前主作品与工具

作品：D:/work/other/ai-writer/acceptance/20261020-long-flow-090-s/scenario/雨棚后的灯。

- 主作品当前 **r38、schema6、已登记1—12、next_unit=13**。原trial已原样恢复，旧7—18试写范围保留；本客户端授权已止于等价重登，不能因workflow范围而自行续写。
- 真实随附CLI：.writer/tool/bin/ai-writer.mjs，版本0.9.0、generation3。source_content_id/observed_content_id/declared_build_id=730a9e3eaffd691e1ef902722513ba548821ce9f077b35a4ff43bb52e0dbfecc，runtime_id=5010447287bb52f84ef0f76405c20d1cc87dff4bab45a3cb7138eb504894a2f2；identify missing/mismatches=[]。
- 本轮11/12的协议tool_build_id=c012921c5617106f0b5dede61af532afee505016f207068a2d6910b5caef8505，勿与上面的内容ID混淆。身份对应S根delivery-current.json；长篇/登记手册与该文件指定最终ZIP源码字节一致，见r3-client-manual-identity.json。
- 当前state SHA256=d08300f4295836c7237e48da2f73a662299d13792d8750e970db1e36339c515c。

## 真实事务和审查

父会话已建立的R3 session=34d109f3-5e8e-41ef-a3d1-df4d2726abb6，scope11—12，主基线r36。本客户端使用r3-session.json真实独立区/令牌，没有重新begin或resume旧R1/R2；独立区回退后r37，11/12真实登记到r38/r39，review后候选r40不是主作品r号。

revision-three.mjs finish已真实完成review、prepare、事务commit、workflow restore及check。事务435aa030-8391-424a-a069-97c8a2f94c26为completed，session为committed，backups_preserved=true；主作品提交r36→37，恢复trial到r38。prepare中没有正文文件变更，只有新journal/objects/reviews、三份新报告和state追踪事务变更。**不要resume已committed的R1/R2/R3。**

review ref=.writer/reviews/da8451e5-7f4b-470d-bcdf-4a49e7fdcd75.json，coverage=[7,12]，quality=review-recorded-not-acceptance。报告已随事务进入主作品：

- 审查/S-R3-重登-0011.md，SHA f5f3079c44251fe47fe5c63e58f1ac6ccd007314b323f881b1eda155d878a262。
- 审查/S-R3-重登-0012.md，SHA d9810ff1f8a59459f687c0d56f8723d4e400c197e0505a4436737eda7eb53973。
- 审查/S-R3-0007-0012.md，SHA d9f783253e894d3bf040cf7e9a6c2aabc17e92d2ff34c73aef196c6107639598。

先完整读主稿7—12及真实ledger/原R2四份reviewed输入，再分别核新草案、实际preview前后数据和候选，最后在两章重登后连续完整重读独立区7—12。r3-client-reread-before/after.json证明该次读稿窗口的六章正文、27项依赖和候选state完全一致。逐稿SHA与具体覆盖详见总报告，不以哈希替阅读。

本轮是知情模型自检与真实客户端协议验证，不是盲读、真人或文学正式验收。check ok=true、scope=mechanical-only、literary_quality=unreviewed、findings=[]；rolling_review valid=4、stale=5、stale_with_current_coverage=5、stale_without_current_coverage=0、pending_windows=[]，只证明版本和覆盖。

## 稀疏结果与候选处理

11的T_VISIT.character_known仅林照/许舟；12仅何岚，没有旧type/statement或周伯等整表写回。不是按键断言作审稿：10后林仍称许未获转述，11在修理铺实际告许，故林许更新；12店内才把陈与日前朋友对应，故仅何更新。其余知识与既有证据保留。

新草案summary/changes均未手改。与R2成功业务输入对照，11只由新版自动省去原本未变的T_SHORT_ACCOUNT.status=active，12与原R2最后成功12-retry1相同。没有改原changes、_replay或来源哈希来伪造等价；snapshot深度等价和全部12body等价由finish及r3-client-final-verification.json实际确认。

两章正式record前各另用新label捕获preflight-preview，补读后才调用revision-three.mjs record N的真实preview/record，未覆盖已有label。两次related_unchanged_ledger均7候选、omitted_count=0、semantic_judgment=not-performed。O_PROGRAM/O_CURTAIN按ID在真实独立区召回并读原文，另读O_GRID及其他真实条目；节目单仍周持、幕布仍何柜，原三格/用途/一晚自摄片的历史有效，全部有据保留。候选只是定位，不能自动判错或要求补齐所有项；未触及8项截断边界，不冒称测完该边界。

T_RETURN何条的第九日“当时尚不知”与第十二日后得对应并存；T_SHORT_ACCOUNT许条第十日“当时稿仍待再听”也保留日期，不因12被邀请就假定听过订正全文。全14条ledger、按条目累计99条证据（含跨条目重复引文）与本轮基线完全一致，观察/statement/author_truth不改。

## 未改正文、资产与当前事实

r3-client-final-verification.json逐文件确认123个既有作品资产、70份旧输入、原13context/template均未变，changed_prior_assets=[]。1—12正文全部保持delivery-current.json列出的SHA；本轮只新增报告、CLI输入/捕获、机械核验工件和本交接。所有失败/重试/备份与历史报告保留。一次recall包装因label含下划线在CLI启动前被拒，后用新label retry1成功，见r3-client-capture-label-error.md。

当前已登正文停在故事第十二日午后：林回住处；陈尚未到周家，许在修理铺待次日工作回话，何在店营业。第10章在第九日晚已归垫、陪周上楼、结钱、向陈何报到；许第11章才听转述，何第12章才知陈与朋友对应。短稿两份仅暂留、可改撤，不外传；原片/节目单仍周柜、旧信未取、幕布仍何柜。第十三日两点有限整理已约陈、许尚待实际答复，不能把邀请当到场或开套。

## 第13章两段原样保留，旧写前模板已过期

本轮没有读两段正文作新的文学审查，只读取S-C中断交接定位它们，并核哈希/字节未变。两段尚未合章、未登记，其已写情节仍按未登记段稿身份恢复，不倒填到已登12的snapshot。

| 保留段稿 | SHA256 |
| --- | --- |
| 分段/0013/part-01.md | 1bf875911e1950ffb0f3608ab1300402484a642bcfba75644919c5a875d4df19 |
| 分段/0013/part-02.md | b41d23d3ce9f3fcfe950010fa7cf5ff8bb23e6142a72f4eb838ba63f02458658 |

原.writer/drafts/s-context-13.json SHA=903c89d0286a1e138708afb123a9fd07fe06c98bed6793252694cd531670eb4c；s-record-13.json SHA=d99f99329a40951fd75d5c8844582ad5eb41b959928639208d81f4f007ca1c1d，expected_revision=34，均原样保留。它们来自generation2/r34；现在generation3/r38，**写前模板过期，不能直接record，不能只换期望revision或哈希。**

正文/0013.md及part-03/04/05均不存在，本客户端未生成任何新13正文或补段，也没重跑已经prepare过的13，没取代父会话真实resume。

父会话接下来真实resume原C线程后，必须先用实际generation3 CLI重新status并读取本入口、新13 context、当前12全文、保留两段全文及相关旧原文；将旧段落与新context核对后，**另用新名取得13写前record-template**并保留旧context/template与捕获。不得在仍用r34旧context/模板的情况下直接接part-03。后续写作按父会话真实授权执行，完成全五段才合正文/0013.md、完整读合章、真实preview/record。

## 新旧入口顺序

1. 当前权威恢复入口是本S-R3文件及真实r38状态。
2. 交接/S-C-中断.md保留第13章两段的停笔现场、物件和后三段待办；其中generation2/r34和“旧模板当前有效”仅为当时历史，已由本入口更新。
3. 交接/S-R2-修订后当前入口.md保留第10章两处实际修文、知情修复和r34历史；交接/S-R2-分段当前版本.md用于现行10章分段版本，不把旧分段/0010回拼到现行正文。
4. S-R1相关交接、旧S-B完成等保留历史，不恢复已提交会话、不回滚4/8现行正文。

本客户端到此结束。父会话负责真实resume原C线程；本轮未执行该resume，也没有借此继续写13。
