# V轮 A首停交接

本进程已达到A首停，接下来正常退出，交根会话独立核验，再由根恢复同ID。不知道本次Codex thread ID，未编造；作品project_id继承隔离副本，并不等于thread。没有新建修订会话。历史revision ID `8cf5ae0a-54f3-424b-b89e-61562f20d120`已committed，是旧2—3章事务，不能拿它当本次恢复ID。

## 入口、状态与证据

- V：`D:/work/other/ai-writer/acceptance/20261020-long-flow-090-v`
- W：`D:/work/other/ai-writer/acceptance/20261020-long-flow-090-v/scenario/东岸末班船-扩展验证`
- 唯一产品入口：`W/.writer/tool/bin/ai-writer.mjs`；未来独立修订区也使用此父入口传project/token。
- 0.9.0 / workspace-copy；content_id=`ff6cde0f1be3459f7d8a4249e3dd8ee3eec39d468df48f9c2f11308e5bd6641b`，与delivery-start一致；runtime_id=`9ed9031ff670f4c6e0ef5754b32e079e436d5e6de9576912b4742b6f541b138f`。identify无缺项/失配，doctor无错误/警告。generation=0/installed=null仍是未更新状态。
- 治理revision13→14初始新任务→15已选→16候选→17完整规划引用与A首停。现在trial，允许discuss/plan/draft，有限范围4—12，revise_range=null；必须遵守A退出停点。没有改成最终F阶段的paused。
- 已登记仍只有1—3，next_unit=4；snapshot、units及其旧事实、来源、正文与初始完全一致。stateSHA=`9ac29347490e31afbb28b91a1288644a791613f23faf204cab31d8c70111a8e9`。

所有实际产品及辅助子进程使用V/v-log.mjs，证据在V/cli-logs，含argv、原输入、完整stdout/stderr、实际退出码和前后state。初始核验见a01—05，写前check/context/template见a16—18，停点status/check见a21—22，字节审计见a23。status不扫描分段目录，不能因draft_inventory只列旧留稿而重新开写第4章。

发生过一次辅助记录器标签错误：`a12-volume-V3`含大写，spawn产品前即退出1，后续依赖停止。初次未进入记录器，缺独立原始双流，这是本轮证据缺口；原终端返回及说明保留，不能宣称全程零失败。`cli-logs/a12-first-wrapper-rejection-note.md`说明初次，`a12-wrapper-rejection-reproduced`保存明确标识的复现完整双流/exit1/相同stateSHA。改小写标签后原volume输入成功；没有改产品或绕过保护。没有发现产品CLI缺陷。

## 已读、规划与本次实际正文

从state.units取得且完整实读：`正文/0001-灯下的箱子-v2.md`、`正文/0002-多跑的一趟-v2.md`、`正文/0003-把手朝外-final-b.md`。原SHA依次为`6b7dda66e606b753b75cbebeab8af536b797b0060a9c14048932da58a6709893`、`78ff1a743694ce4ca1fb0dcca7a7d94dab5f36b7305d2ba078522f408653d886`、`3647db1243db710d9942db1df904aa301f349fc7ae050ce25803c2f18f20a221`，均未动。

已读writer.json、根AGENTS、随包三技能及chapter-delivery/general-review/natural-language-authenticity/long-form参考，包内quickstart/long-form/revision-and-sources/review-and-registration/workflow；作品根技能与包内同字节，见a-start-audit。已读必要设定、旧骨架、V1/V2及旧试验选择说明。较长context已分段补读，扩展骨架另从原文件完整回读。

新增`大纲/扩展骨架-V.md`、V3=4—6/V4=7—9/V5=10—12契约，仅正式细化4—6；旧三章是已经完成的有限单元，扩展不是旧承诺未兑现。没有改已消费来源，不需要以刷新哈希消除漂移。D_V_EXTENSION是代理在真实授权内已选；D_V_CANDIDATES保存未决。复航、长期频次/价格、新材料工费及配角姓名仍未选，不进事实。

原始本任务`研究/V-A-原始任务.md` SHA=`6f44d08cc118a0418bb7e3e2727377b77f4373fc1c15e29d71d7a4d7c4d962ae`；授权/代理选择来源`研究/V-A-授权与选择来源.md` SHA=`c94d069cb8af83d5146a04b78860c0698d880884d67c5e62e26cce6ed4592785`。真实原话“继续推进”按本次任务转述保存，未伪造人类消息ID或逐项采纳。

| 实际分段（相对W） | 去ATX标题后Unicode Script=Han | 最终SHA256 |
| --- | --- | --- |
| 分段/0004/v1/01.md | 1151 | 558eb60ce2c5d9b36c2ec753a4ef76132c544b683999d32c8c4db9aa53408113 |
| 分段/0004/v1/02.md | 1158 | a899d1299b90a1a628a3577943081f67f239ea2ed616f6c309b50874c3c19493 |

02无章标题，开头用场景分隔转次晨。总2309汉字。首轮1090/1083及修前字节没有覆盖，见a-part-snapshots/before-fix；修后计数与字节见after-fix。本次知情自检已保存`W/审查/V-A-0004前两段-知情自检.md`，覆盖两段最终全文，包含高置信修复与偏好保留。

没有03、完整第4章、record4、5—12正文，也没有第4章新ledger登记。当前没有达到整章至少5000汉字；尚须至少2691正文汉字及完整章回读，不宜只按差额机械填足。

## 写前模板与来源

写前context：`W/.writer/drafts/v-a-context-4-before.json`，revision17，SHA=`9ea12bbf1e1dac9f8f5b0deee4dc2171af14cc1dd5ef3c6410d20f5f66f2c8df`。

写前空模板：`W/.writer/drafts/v-a-record-4-before.json`，expected_revision17，SHA=`2e3cb45be9b6c444e0a5d5d26dd76b37373e49227e380ffed04849698763ec09`。保持空summary/changes，是未使用的原写前证据。最终章拟用`正文/0004-少蒸的两笼-v1.md`，当前文件不存在。

模板10项source_hashes与context完全一致，停点核对无变化：

| 来源 | SHA256 |
| --- | --- |
| writer.json | 09427e05445c28cd172683fcfcf032a7387644f906d5ed9ada6d74b368026b8d |
| .writer/state.json | 9ac29347490e31afbb28b91a1288644a791613f23faf204cab31d8c70111a8e9 |
| 大纲/单元/0004.json | 6558e16ee73fac0adaffb3cb7e8ebe1392f88f20b9dcea7acb5070e7ea6bb74c |
| 设定/作品定位.md | bd796918caf9c124df5a0e3ad18afa51edeba2279d5bad427b761aaa6b900abc |
| 设定/文风.md | b7d91538573ec3036e03075f1482241fe14398fe7c54b89b6e7a8e5507a6c140 |
| 设定/权威规则.md | 4655e29181ada961469b16e494fcc32b30c09a2592dc26de3b923ad5ec4c7ff7 |
| 设定/人物与声音.md | 3049b229dcce94ac5acdebd9e5904ca70ecfef76602b83b64765f940e5ee0c69 |
| 大纲/扩展骨架-V.md | a2487262be83f6c6ebb338337667fcd80222f44e6142e5beee13c6ce64b2dad4 |
| 大纲/分卷/V3.json | 1bb242c7202344acf39fe1b0fb59b66fa8750c714c492ffaab947a4681482aa9 |
| 正文/0003-把手朝外-final-b.md | 3647db1243db710d9942db1df904aa301f349fc7ae050ce25803c2f18f20a221 |

## 两段当前现场与下一接续点

正式state仍止于3章；下述是未登记分段的实际发生，恢复必须实读片段再使用。

01：原箱已由周岸实际放入梁家铺架下，合两搭扣，未再开点。自己一联还箱单及空钱袋夹在铺内借具本最后同页；沈家原条/下联未取回。周岸发架下照片和单袋位置说明，梁伯语音确认“看到了”，只属远程获告。周岸锁铺，带自己的工具包、铺钥匙离开；自用绳回三轮座下、旧毯折回车斗。最后只是去找面摊，未写吃到。许蓉、沈禾、沈父、老何均未在此后得知入铺。

02：明确翌晨5:20沈禾到米糕店，至结尾约5:50。柜门出门前仍靠墙，父亲尚未起，早饭留锅里；80元最后确认仍为3章父亲收钱盒，无新消费。沈禾把“已还/钱带回”告诉谭老板，没说箱已入铺。备货原单实际在店铁夹上；按新量，少蒸两笼但仍清洗，首笼上灶尚未起。谭老板和沈禾在柜台，灰蓝外套女客也还在，零钱已收回；她需6:00从这里出发往桥那边打扫楼道，头笼还需约一刻钟。她问“你们明天也这个点出锅？”，老板刚走来，沈禾手持撑开的纸袋。尚未许诺、未交糕、未收钱、客人未离场。

根独立核验并恢复同ID后：先核状态/修订及这里的SHA，实读01/02和写前来源，沿女客的问题往下写03，不能从头重写或把5:50跳成已成交。普通细节可继续自主判断；将许蓉自然带回主视点，接住老何接早班和她已说要收场的安排，写清短时协助与交班，避免连续双班假设。取货试份应在场谈实际数量、时间与工时，不能用本大纲代替对话和动作。

跨卷计划：T_EARLY_BATCH当前仅客人的需求萌芽，后段实际选定/做出什么才登记什么，8章须真取卖/余货与时间后果；T_SHELF_USE在5章种、11章实装摆碗；T_ROUTE_STEP在6章实走、12章由具体出行兑现。后两条目前未发生。O_BOX_PAINT三项保护不动。原35元仍月底待付，due3保持；不能推迟due或把票据变付款。

恢复完成整章后，保留这份旧交接和原模板；按有序分段SHA用assemble另存完整章，完整实读/纲文回对和报告后preview成功才record。模板或revision若变，先核实际影响并重读后另存新输入，不只刷新哈希。再推进到6章并按后续约定停点交付。本进程不执行这些步骤。

停点check为机械ok，只有从U继承的两份旧未登记留稿警告；它不表示文学验收。a-close-audit核U原作349文件无改动/新增、冻结产品324文件无变化、W原文件除CLI治理state外全同字节、snapshot/units不变、无03/完整章/record4。没有Git提交/推送、上传、付费或代理派发。本交接后只可做本次证据文件回读核对，再退出；B/C/F及草稿导出均未完成。
