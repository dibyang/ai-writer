# W-A完成交接：13—15后停，网络中断恢复补核

本交接对应同一个W-A原生线程`01a15a15-6242-7581-9fd2-8f302b9e749f`。上一个续程执行器在两小时总时限SIGTERM，未正常退出，不能称其阶段通过。本次恢复只补复核、暂停和交接；13—15未重写、未再次record。阶段A的创作及本次补核已完成，执行器最终退出码由根在本次进程结束后独立核验。

## 当前入口和硬边界

- W=`D:/work/other/ai-writer/acceptance/20261021-long-flow-090-w`
- P=`W/scenario/东岸末班船-规模验证`，实际绝对路径见后附清单。
- 唯一产品CLI=`P/.writer/tool/bin/ai-writer.mjs`；所有产品命令通过`node W/w-writer.mjs <唯一小写标签> <参数>`自动显式project。本次`an-*`每次子码均0，双流、原输入、前后state在`W/cli-logs/<标签>/`，不是用shell错误继续。
- 随附0.9.0、schema6、generation1；content_id=`ab14a65fc7677e8c76c03cbe8f7ec7c49203ad070ed0163e265cf5047500e626`；runtime_id=`d4517cba32906d3c758015aacee7fdafadc2037a4dd8288e26c9d9cfa5c448b4`。包内资源实际在`.writer/tool/.agents/skills`及`.writer/tool/docs`，根作品自定义技能保留。
- 当前r65，state SHA=`1024cd0cf71c40a9b25e083290c91740d386bdd1b5123e3ff89cc9d1a006f26f`，15章，next_unit16。workflow正式paused，仅`discuss`，draft_range/revise_range均null；task明确13—15完成、16待新鲜B。暂停事件`.writer/objects/1f2af8cb-93ab-4191-afac-b13af2e90288.json`，SHA=`6648e49d9b72d93612fb07f6761661588df4fde4dbd9c1ab62f73580f15d765d`。
- 不写16、不导出、不启动后续独立修订、不恢复指向V的旧修订。没有另派代理，没有Git提交/推送、上传；新写入均在W。U/T及其他封存未写；本次不宣称新增全量U/T封存哈希验收。

## 授权、计划与实际停点

原始测试授权在`研究/W-A-测试授权原文.md`，SHA `043ee501466c8e088d6a43933636f673144c8aa2b3e889350e1a2bdd14f5deda`；同ID续程在`研究/W-A-续程授权原文.md`，SHA `47b93aebe0680ffb217cb4ca1c1e1a0b5a109d4c9b5d56ad48b82d54b65a8fae`；网络恢复原话在`研究/W-A-网络恢复授权原文.md`，SHA `b1d97389a8a549225a561607fadc6e3550ee8e86e44f3db22d77bebfd904bc66`。均由W对应prompt同字节复制，author_evidence记录真实quote、SHA和行locator，不编人类消息ID。

旧首停r58已完成；续程正式workflow r59改为13—15停，D_W_EXECUTION_AR在r60替代旧执行停点，整体13—24范围未扩大。`大纲/扩展骨架-W.md`仍是24章9卷骨架；V6—V9正式契约存在；仅13—15有近期细纲和正式单元计划。近期细纲及旧near中残存“02停”是当时历史限制，最新正式治理及续程授权已替代它，不刷新旧来源哈希。现暂停再次收回正文权限。

V6《腾出来的地方》实际兑现：13母女桌面试用/自己报名；14锅修试收款及窄凳条件委托；15歇日洗挂一帘、沈真正去旧书店、父半成品袋。首课、窄凳制用、袋出门不是本卷已兑现事实。

## 实际创作规模、当前1—15与片段

13—15共20065正文汉字；全1—15共75372。汉字统计排标题和非汉字，规模机械核算不等于文学通过。三章均逐段实读，CLI assemble后完整合章实读，保存对应当前SHA报告，preview退出0后record。13 r60→61、14 r61→62、15 r62→63。15最终采用record-v2输入，仅将父状态“准其”改为“听她说……叫她先去”，保留v1，正文不因登记措辞变更。

|章|P内当前路径|正文汉字|SHA-256|
|---|---|---|---|
|1|正文/0001-灯下的箱子-v2.md|5214|6b7dda66e606b753b75cbebeab8af536b797b0060a9c14048932da58a6709893|
|2|正文/0002-多跑的一趟-v2.md|3525|78ff1a743694ce4ca1fb0dcca7a7d94dab5f36b7305d2ba078522f408653d886|
|3|正文/0003-把手朝外-final-b.md|5226|3647db1243db710d9942db1df904aa301f349fc7ae050ce25803c2f18f20a221|
|4|正文/0004-少蒸的两笼-v1.md|5820|9ccb0b8e5eb4e5631555fa280b706f9a53639500773ebbec611c0efd0db169f4|
|5|正文/0005-门板靠墙-v1.md|3845|2386bbb6cb98237842871a1274afa5b33df113b1373dae177bcc1ce61a4832bb|
|6|正文/0006-走一遍再画-v2.md|5124|7d94bf2d87f925e43001c88e7ce7b7d60968ad93a9cc54e5322bbbdf7310fb91|
|7|正文/0007-先留出两包-v1.md|3661|44c39f40f7a22b3ef500e4948066303e27407b4f0d426daeedfdbb88781d9a04|
|8|正文/0008-半个钟头-v2.md|3646|5c1f40674da30b617367171ec44a72a6972ae9e87add5db3f26b761df8b0cfc5|
|9|正文/0009-留给明天的活-v2.md|5438|77d7210e10d8f2c662cacff742755d096ea6d890a762af56231491f881dde48e|
|10|正文/0010-月底的三十五块-v2.md|5077|773cf058337c048165bbb6afab2c00edf860068ebdef986902b94110d6cac52d|
|11|正文/0011-盒子放进去-v2.md|3607|2410d684c6a0d2de7f0cdd0e25b20814af22dca213dfb66f2e804cd111bac075|
|12|正文/0012-沿着坡走-v2.md|5124|973c82b824598d71120d881c9c5b8dc87c8ded132d82643bffd89c92c579fc42|
|13|正文/0013-桌边留一半-v1.md|6035|f4531a35c13af7675f50e931fc2e088df7d74271a4eab52a1e58e43d5d173349|
|14|正文/0014-坐下再量-v1.md|6019|85bc3fd6b6b6476011ed17bc0cc505800100b570fbcc6430ec59498d6c2664da|
|15|正文/0015-一幅一幅洗-v1.md|8011|e30513d5c0914e5d0de0c477c26ffae47e5a9f06d8c645bc22d54503d7f66d83|

|章/片段|P内路径|正文汉字|实际SHA-256|
|---|---|---|---|
|13/01.md|分段/0013/v1/01.md|1848|b28a81e6e72da383f84fa46b8c05c2701ebd19f183fce6c4a64de54f5a2bb59c|
|13/02.md|分段/0013/v1/02.md|2009|a3cf9fb4bcef741789df6f0515a0f8be7dcab00ab4a7180a2956ce6303eb485a|
|13/03.md|分段/0013/v1/03.md|2178|e1c07f1da425267cf8d01a9e83585bd4fc12e94cb987e7b403034b82d62157ee|
|14/01.md|分段/0014/v1/01.md|1836|5e17e9e0a8489a5ac78530bb6d2e922cb33c2475142a9446b3e38d9ce67bf334|
|14/02.md|分段/0014/v1/02.md|1871|f85ff1ecd7427719262bad2479b2106dfeb6e8b1932fd1d49ee7cb5c745bc9e4|
|14/03.md|分段/0014/v1/03.md|2312|92da4af71b861b9a776dd66ae1a369cf890e312da9dbc71c1d55562ffaec1133|
|15/01.md|分段/0015/v1/01.md|1834|33104e75c13b166fbdf42fce65b96d3ca757e575d29c3a86334c36cf10c901f3|
|15/02.md|分段/0015/v1/02.md|1852|56d6895e3bbcb105e94a13482aab08d38b7e7b19677368f6def56b39839fcb3e|
|15/03.md|分段/0015/v1/03.md|2138|f67cdffc4de665b9147569601b3e2c22462f9cf3f7bdc0c456cd69e091c4910f|
|15/04.md|分段/0015/v1/04.md|2187|7cec8c2581f3acc9855582880f69ae696cf8cc781ad352095e140e3f86b59f87|

原13前两段SHA与首停相同；新增03后才合章。14、15均写前生成真实context/template。13原r58来源与r60对比见`ar-context13-diff.json`及`ar-recovery-impact.md`，实际变的是授权/执行选择，原文学选择和01/02保持；没有仅刷新SHA追认稿件。

## 全文阅读与报告

首停先从state当前路径完整读取1—12，恢复报告为`a-recovery-reading.md`，原读行范围/当前SHA见该报告与`initial-native-read-coverage.json`。本轮续程又逐段读13—15及各合章；15前重读11全章，确认窗帘只约未做。

15登记后按state当前路径完整10→15连读：10的1—100/101—200/201—206；11的1—100/101—137；12的1—100/101—179；13的1—100/101—200/201—238；14的1—100/101—198；15的1—100/101—200/201—237，共15次FastCtx调用、1195行。上次原stdout返回的逐行文本经本次对照当前同SHA，完整无错缺且按章顺序，证据`an-recovery-verified.json`包含实际事件序号/item_id。这是核已真实返回模型的文本，不是脚本代读或文学评分。

原完整报告`审查/W-A-10-15完整连读.md`保存且不覆盖，SHA `c5f63b036c0864925e7debd495020cc68e17ba5e9415574761439db88fc990c2`。本次完整读报告后补网络中断边界、16滚动要求，并订正报告“当年”为“当时”，另存`审查/W-A-10-15完整连读-恢复补核.md`，SHA `69375ba4f29c5d3152a137800012a37040e5eaa2750cec8a104ff8755c8fa45e`。

本次正式review r63→64成功：`.writer/reviews/e89710f8-874a-44fe-ba4e-64311cd0175b.json`，记录SHA `c9c53ff1f85e9b7709aac94186e0aeeeb1ec2096089e6c335b16d9e2252287d7`。当前六项正文和冻结report/body均真实SHA匹配；输入有逐章五项功能、三组结构比较、实际引文、保留项和不确定性。审查者为同一模型知情自检，不是真人盲读、市场或正式产品验收。

文学结论有限：10结旧账、11柜取放、12实走路线、13晚课桌面、14条件劳务、15自己的歇日有不同结果；10/15盐少回锅及10/13/15收手主题存在局部同形，15洗帘/缝袋动作密度偏高，保留为可选压缩，不称已修。当前没有需修改1—12或已登记13—15的高置信错误。未来不得反复用问清/验货替代实际跨卷行动。

## 三条跨卷线索：首次、最近、持有与知情

1. `T_W_EVENING_CLASS`/`P_W_COAT`首次13、最近13。女儿本人问报，许只亲读纸/消息并听她述，未亲见交费/课堂。课程下周三19点，每周一次两小时，首次未去。母所有的右肘薄旧工装由女儿按约暂留，在许家窄桌靠墙一侧右袖上，未补；练针是旧枕套小片。何只知交班/芹菜，周/沈未获晚课消息。拟18真正去课、学习/归衣；不能靠ledger resolved算回收。
2. `T_W_NOODLE_STOOL`首次14、最近14。周与廖约旧板若可用，两人窄凳手工60、另料先说，后天下午两点先去廖家看料，电话已互存；廖口述旧板屋后有檐垫砖、一端会湿，周未见当前料况。未定尺寸、未做、未收钱，尚无新凳持有链。老人靠背椅保留，新凳拟可竖收给锅盆留路。拟17实际选做、21营业中用，后果必须进场写。
3. `P_W_CURTAIN_BAG`/`T_W_CURTAIN_BAG`首次15、最近15。另存早年浅蓝旧短帘，不是当日洗挂的在用帘。父自选装少量水、眼镜、折报纸，不扛一兜菜。当前袋身合好，两带裁成，一带合一带未缝、均未固定；未再洗晾、未试提、未出门。父亲持有，干净外布袋里放父椅旁小凳边，与垫伤脚凳隔开；针另收铁盒。沈亲帮穿针/折裁、父亲手缝，别人未获知。父说明天慢做只是约定；拟18/24等真正带用形成独立生活后果，脚伤不能自动写愈。

三链用途不同：学习与母女空间、劳务与摊主歇脚、父自带轻物与分工。普通数量/安排事实可供后续按实稿选择修订，但本次不预改，不改任何observation的type/statement/author_truth。

## 已收束、未决与知情边界

- 旧箱/80押金/还箱单已按原文收束；O_BOX_PAINT的type/statement/author_truth含缺值状态保持。不得重开箱据悬疑。
- 10原西门35由备用钱20+10+5实付周，何见账听许不是亲见现金交手。11柜材料26+工55共81由父日常钱包50+20+10+1实付，原80/两纸仍原盒；15自然使用托盘盐罐，不重新点物核柜。
- 14锅件18+工20共38新款已付收，是12询价约定的后果，不是旧35/81重付。锅已试饭、带回；方家饭锅归位是下午方回告，周非亲见。小风扇只收下约第七日看，结果未写。
- 12新推车旅客只目送桥上近两灯杆，不补对岸到楼；6原妇人终点未知。母图夹簿、余1补图茶叶盒、外流旧图未全更新；复航日期未知。
- 许家歪窗扣未修，闪旧灯已拔、床灯临借睡前取回仍未写；工装未补，首课未上。沈父脚仍伤，父辈旧事保留。沈15画册自己8元购得，床头夹干净纸，父只翻过；不是早糕8元重记。

## 新鲜B的16—18入口（只有骨架，尚无正文授权）

16必须从15已经发生的旧书店出门、买画册和父自做半袋的后果滚动细化，不能机械重演旧远骨架同一“歇班出门—回来家务”。15开头第七日与老板说“后天上班再拿”纸盒：先核第八/九日歇班与后续上班日期，不能把计划当已执行。可选择后续工作安排、父坐着补袋与各自时间的新冲突，但须由新鲜B读正文/context后决定。

17承14的“后天下午两点先看料”是第八日，与15并行；可清楚回切当日写周/廖实际看料，不能悄悄把约改到第九/十日。空间尺寸、旧板可用与否、做法/另料/工钱承接才在正文定，留普通事实小修选点不等于故意写错。18拟大章把下周三首课真的走出/学习写实，许自己安排晚饭、沈父袋补齐后若条件成立再带用；各线并行有时间标记，不能拿章节号当日期。19—24仍远期骨架，当前不细化成已发生。

## 网络中断、失败与纠正

`commands/codex-a-resume/result.json`记started_at `2026-10-20T16:35:48.954Z`、elapsed_ms7200049、exit_code null、signal SIGTERM。`stdout.raw.txt`1013425字节、`stderr.raw.txt`18421字节保留；stderr17:20起记录断流/TLS EOF/HTTP重试到18:35前。三章record在中断前成功不代表执行器成功。`checkpoint-after-network-interruption.json`记录r63、15章和冻结边界，与本次入口一致。

本次原执行器目录`commands/codex-a-network-recovery/`正在捕获；结束后根核实际码。此次新增正式产品命令均退出0，未遇产品缺陷；辅助生成review输入时一次断言退出1：把10原文“把已经抬起的手放下来”误录成“将……”。正式输入尚未写、review尚未执行即停依赖；原`an-prepare-review.mjs`保留，`an-input-preparation-failure.json`记录真实错误，另存`an-prepare-review-v2.mjs`和`inputs/an-review-10-15-v2.json`后重核所有引文再成功review。没有改正文或来源/期望哈希规避。

先前草稿纠正保留在`W/originals/`及各章绑定报告：13不足6000时补女儿报名真正问的事；14借碗来历、维修明确同意、旧电线暗示、饭盒布袋、下午肉袋去向；15开头旁线视点及劳作眼累动作。旧报告/测量/输入均留，不覆盖失败或旧版。不将原根执行器的历史测试、预启动失败当本次产品通过。

## 最终检查和可核文件

`an-status-final`/`an-check-final`/`an-doctor-final`/`an-workflow-final`/`an-revisions-final`均0。无章节stale、changed_sources、impact_pending；无未完成修订事务/会话；10—15当前窗口pending为空，review valid9。历史stale8仍保留，8均有当前覆盖、stale_without_current_coverage0、unpublished空；未删除或追认历史报告。check仍列8个继承旧稿UNREGISTERED_DRAFT警告，只留存不登记不清理；doctor无errors/warnings。机械覆盖不是文学通过。

`an-final-audit.json`验证前12正文及整个units对象不变、全observation三字段不变；本次网络恢复前后全部15 units和snapshot同结构同值。P继承1368文件仅state变化，V1368文件无差异，根产品324冻结文件无差异，generation1/tool_control保持；无16或导出。`an-current-1-15-manifest.json`列全部当前路径/实际SHA和计数。最终正文/报告冻结对象均匹配。

P内来源、context、模板及报告当前SHA：

|文件|SHA-256|
|---|---|
|大纲/扩展骨架-W.md|e532b83b992d61273932af872d67b7a3987dc774d21c398c060234ac7fd63776|
|大纲/近期细纲-W-13-15.md|23776351be1a6995408515e3df742d06c3be03721aac6509ba96bd0e5c1de470|
|大纲/分卷/V6.json|a4144de97b63385aa76e4cb28a586a3f427a0e661122f254f8013c7dd674a33d|
|大纲/分卷/V7.json|785550c82b041cb9442c0bdbf0c7f141a376e3403cb903601d3ede927c13af1c|
|大纲/分卷/V8.json|bd5d1b8f5884fcf1a8631dcd26a6d324c281eac7c9763fd69b833c4d81dd865a|
|大纲/分卷/V9.json|b7a893b8448ba034df19b10b075b49086620bac2f7bac4fb7caa29a3cd206510|
|大纲/单元/0013.json|5f06782832ae1748ac94787649382e2de1c1ad9363338a0355dc0ced4272276a|
|大纲/单元/0014.json|e56eb00e10c3a0f530999b4a2a86d10227e9adec077b1d2dfc537c99d65af55e|
|大纲/单元/0015.json|36b59bd66376c9588e6a97f845c45bae7d39c250433bd38890a32de3c342dac9|
|.writer/drafts/w-ar-context-13.json|9dd41ce19c62e4a9596af76302f688cd8af010cf2682d3c77bdc82c3eb34f90f|
|.writer/drafts/w-ar-record-template-13.json|b1810f6a4d285004e13d75243eab0e32ca083ac06855737c4951c9d663d550c5|
|.writer/drafts/w-ar-context-14.json|3b49a657c367b0820aca84f122628d53a2230ce3b78c34003644dfdac61e3ee5|
|.writer/drafts/w-ar-record-template-14.json|6b971b50f2c1e04eb428e275f63d24b1b7db37cc731d4a74e61b2ffa8f8b1959|
|.writer/drafts/w-ar-context-15.json|0ad2ad38dc2009d23e6ab404ad5914f1afc6f6fcc6380adc6b0222917181d2f3|
|.writer/drafts/w-ar-record-template-15.json|07a578f443d9c7a06edbae3d4e115cf56383e7a3c4d127265704d017ec1a861e|
|.writer/drafts/w-ar-review-template-10-15.json|17f74deeba371d9456e54a3477136fa175c6f5bd65a0472a1db607770c3b2161|
|研究/W-A-测试授权原文.md|043ee501466c8e088d6a43933636f673144c8aa2b3e889350e1a2bdd14f5deda|
|研究/W-A-续程授权原文.md|47b93aebe0680ffb217cb4ca1c1e1a0b5a109d4c9b5d56ad48b82d54b65a8fae|
|研究/W-A-网络恢复授权原文.md|b1d97389a8a549225a561607fadc6e3550ee8e86e44f3db22d77bebfd904bc66|
|审查/W-A-10-15完整连读-恢复补核.md|69375ba4f29c5d3152a137800012a37040e5eaa2750cec8a104ff8755c8fa45e|
|.writer/reviews/e89710f8-874a-44fe-ba4e-64311cd0175b.json|c9c53ff1f85e9b7709aac94186e0aeeeb1ec2096089e6c335b16d9e2252287d7|
|.writer/drafts/w-a-context-13.json|9a91a540654f17c34873f2d52238bddc25a210c03d29042620f011f9cadd67f3|
|.writer/drafts/w-a-record-template-13.json|e6338624684d163a5f084b98bd7a78077d8a26832532e9d138f1a3eefea6d7bd|
|审查/0013-W-A完整章自检.md|4ee35a6aef2a05bba42b76d2ad7bbbc1b28114741ce1a6dbb096f6003e28f9b5|
|审查/0014-W-A完整章自检.md|acba6a221e6ffb4508d1a182b766a4f075afa0ddb287f853d011862844ace3fd|
|审查/0015-W-A完整章自检.md|de853315cc0849110966816cc0d87088996d698f248484f3bdfba4792c3c8cb9|

W内登记/合章/review/暂停输入及核验记录SHA：

|文件|SHA-256|
|---|---|
|inputs/ar-record-13-v1.json|fbe08534d3bc9f3eb33039862211584d451f92d3890cd39c335713d620c65d8c|
|inputs/ar-record-14-v1.json|570b6afac5c6be9d6230715c27a62148c86538bc0452e9f2ecd9bc19e1935d5c|
|inputs/ar-record-15-v1.json|e0d8f8974f86702debaa908e7420b0127d889f9f577bf4216a611ea2819aec97|
|inputs/ar-record-15-v2.json|f68d6d92468f477cb42c83d680349ae8329fd8b9618358df712bcaeec682382a|
|inputs/ar-assemble-13-v1.json|5d7f0889cdcb2b74e1524ac8a6cd3962b8a129ae6608af5248afce4d369e9cc4|
|inputs/ar-assemble-14-v1.json|7b8b8d130e3f782141d0d75c0194820fbaed7ea5d4c91569592ca206e7bab629|
|inputs/ar-assemble-15-v1.json|860a60f3d2828b9a16240e120939c7a43166a15d20d954ae1cb88820ba9c51cc|
|inputs/an-review-10-15-v2.json|d55214c6a4b5df5e6fcd00b11f5929461371f7f98e75525bfb394865b49aa8fd|
|inputs/an-workflow-paused.json|5e94ee665db4cb427d62c2bc5bdf63db33262d1bb8530f0bf3ea78096e264aad|
|an-recovery-verified.json|8140c2a25b235cb57c0cc9c85bfa8d3880a131307affb174cb0124b891ce4184|
|an-final-audit.json|c538bd8058de1d2ed5430ee596116a6c8d30606223a6f5ff15c79c6fe6c16c28|
|an-current-1-15-manifest.json|f15dbca8515f37ee3c04f2484cff008668a19f86f71b46453798afeff105eb82|

所有文学判断仅对应上述实际字节；未进行真人、市场或正式0.9.0验收。本次在15收束，等待根独立核验后由新鲜B恢复16。
