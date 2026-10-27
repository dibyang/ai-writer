# 交接-E首停

本程正常断点已保存：候选正式重登51，待52—60；整轮E未完成、未prepare/commit、未导出、不写61。根选择的普通事实仅是验收参数，不是作者新增原话，也不将原值说成创作错误。

原生threadID：01a1723a-0b10-7d13-bb86-eabb701c7e89
revisionID：c9902468-e063-485b-a47b-8c44989df084
主区：D:\work\other\ai-writer\acceptance\20261025-long-flow-090-ad\scenario\东岸末班船-60章独立验证
候选：D:\work\other\ai-writer\acceptance\20261025-long-flow-090-ad\scenario\东岸末班船-60章独立验证\.writer\revisions\c9902468-e063-485b-a47b-8c44989df084\workspace
私密令牌路径：D:\work\other\ai-writer\acceptance\20261025-long-flow-090-ad\e-revision-private.json。公开交接不复制token；原始CLI日志按要求保留，含令牌的日志同属私密操作证据。

## 当前真实状态

|区域|revision|登记章数|state SHA256|
|---|---:|---:|---|
|main|321|60|1d8eb476bed70f6eae0ec90984fce3b09f3a3f2acc6b45aa1881f71c40dc3fc6|
|candidate|332|51|e0c3308408cabe1b7297c3cfe5fd3e1133bdcab538ca6d8fa100d0f797dcfe66|

主区基线定义在合法workflow、旧基线冻结/等价绑定、历史stage之后且begin之前，见ef-main-business-baseline.json；不是入口r296。begin后main的1489个基线文件及60章正文SHA均不变。候选仅48正文加54字符，先两张后翻垫纸再发现第三张旧细砂纸，总三张一粗两细、不采购；31当次裁两张原文不改。49/50/51正文原SHA，50/51人物增量补本轮砂纸继承，未整条回灌旧状态。52—60正文未动，未先取其本程写前模板。

## 必须如实保留的偏差及边界

第一份workflow因未带齐planning被PLANNING_REQUIRED拒绝，辅助脚本未立即停止，六份OLD source freeze发生在workflow成功之前；随后补齐planning并成功登记workflow，再做全部baseline、新候选freeze、impact、stage。旧源均是真实字节/真实对象，原消费哈希60章逐项未改，后续操作合法通过；但不能声称满足“合法workflow早于首次freeze”的先后要求。此顺序要求是否接受留根审定，未改旧日志/哈希或刷新根基线来掩盖。

四份绑定AD-E-replay报告通用文字有read-logs目录误称，实际均是AD/read-pages；逐页清单和文件SHA正确。勘误ef-report-location-erratum.md保留报告原SHA，不改报告绑定。record的quality_review返回required：当前draft_review/replay_review已基于最终正文与新依赖重新登记；这不等于整轮文学/全尾段正式review或原意见新上下文verify完成。

## 阅读、来源与真实命令

本线程当前主稿1—60完整387页正式阅读，6p2/3、9p2、40p4—6输出恢复亦真实返回，证据见ef-formal-reading-coverage.json，未计前程74页或F封存报告。本候选48写前10页与改后10页均完整读；49/50/51各10/8/9页正文未改，该同路径同SHA完整返回同时作为最终正文阅读。候选最终四章共37页，含48写前共47页返回。六旧/六新来源对象另各真实读1页。

首次baseline每份真实from=1，其required_readings均含当前完整1—60。实际6份baseline+7份historical impact共13份输出保留，其中S01 r315历史预览因S02先stage后失效，未用于正式stage；S01重取r316后才stage。每次按实时revision重取与全required_readings逐项对照，相同路径SHA使用本程已经完整返回的页证据，不引用过期预览。unknown-requires-reading由对应报告实际说明已知边界与仍未亲见处，不伪称脚本证明无影响。

|新版本|实际来源ref|候选生效区间|OLD冻结SHA|NEW冻结SHA|真实stage impact_id|
|---|---|---|---|---|---|
|AD_E_S01_NEW|大纲/单元/0056.json|56—末尾|c88e9ac3b4fe03a3f4dd6450db1d0f7b296fda7ad68e47d954a3ac32cf5f5213|7ea36d6d7d85a1fe958c45bae0c036b784f1b7e497a13f4817efc02c2841d830|4b2fbac7-80d6-43dd-a602-08ee1f925c64|
|AD_E_S02_NEW|大纲/单元/0058.json|58—末尾|08aa0ce937038591d06526a963a600e11ed3c6503090eda05adad6275d01a4a0|d297fa976bb38e5c86c72f679c73d11506c2c6c48cfc7c190aba03a6344aee0d|292b029a-59f8-40d7-bf21-2e73eeedfc99|
|AD_E_S03_NEW|大纲/单元/0059.json|59—末尾|86e552371a8c36ce596a6e5349f7aff08699933eeb9b40f403f80773bcc4e15f|36ae956bcb9fd78b9082e1fac95aaa4ae26bd98c46401778fb36ec285145d9bc|80aa4773-e3f6-46cd-9c8a-5d7e508ed209|
|AD_E_S04_NEW|大纲/单元/0060.json|60—末尾|e72066b7624333bb1c6ef3979fba0e87dc1290a0cc316ddfd14847fd9ed9f6de|070969b3bc887c35715a2c8588292e0bc82e2b4f1854ff925618d54116ceabe1|b4214c2e-be4d-4d17-a672-b899e0382c3d|
|AD_E_S05_NEW|研究/AD-D滚动写前核对.md|58—末尾|ba97625e69a41c4d2d5accff0cb79ae664171778cacbd0a4f1b60be356dc131b|e1589ffd06216b27247facdbed348fc583d4ded776fe12723753cac6fccdfeae|f3db519a-6182-4559-a695-534008ac6951|
|AD_E_S06_NEW|研究/AD-DR-60写前核对.md|60—末尾|4dca76581012c620f37d716ddf65c1308bfb1102fbe6acae5da78224a5173e47|bb6176f1e972d9efdba96e58015819033aa46e6e93982471f5a35b4ca43f9066|31990b25-4d8a-40e5-96bf-9b7bec021ae4|

新候选文件位于研究/AD-E来源候选，原活动入口没有改成新版；冻结对象为各SHA.source。旧baseline前缀依次1—55/57/58/59/57/59，新区间从56/58/59/60/58/60到末尾。原AC20版本19区间保持，现合计32版本31区间；CR33编辑入口差异仍保留，不修成漂移。main6项pending保留，candidate按上述6真实impact_id发布后pending=0。全部版本、对象、prefix、replaced_ranges、消费旧hash、impact的完整required_readings、报告SHA及原输入在e-first.json/ef-final-audit.json/ef-old-consumer-proof.json中。

AD/cli.mjs保存本程92条CLI的真实命令、原始输入、输出及state前后SHA；具体路径/时间/exit code及文件SHA见e-first.json.command_evidence。旧application共8项及committed_revisions与入口逐项一致，O_BOX_PAINT完整条目及CR33_RECALL_ID_V2不变。新四章正文SHA/报告SHA/输入SHA和逐页日志均在e-first.json，不手改state或source registry。

## 有效负例与纠正

- ef-negative-stale-revision：语法及其余内容有效的workflow，只用过期expected_revision296，current302；REVISION_CHANGED，state前后同SHA。随后正常当前revision的合法workflow成功，证明不是缺参/未知命令。
- ef-negative-stale-impact：S01 r315预览在S02stage后过期，当前expected_revision316正确仍IMPACT_STALE拒绝，state不变；原失败输入保留，真实重取r316并对照实读后stage成功。
- ef-negative-new-bind-old-consumer：NEW与旧56消费哈希不等，SOURCE_BIND_MISMATCH，state不变，不追认新字节为旧源。
- ef-negative-main-workflow-active：正式revision活跃时主区本来合法的workflow当前revision/唯一operation_id输入，REVISION_OCCUPIED，state及60正文不变。
- ef-negative-pending-export：正确export --out被IMPACT_PENDING拒绝，state不变，未产生导出。ef-negative-pending-context实际REVISION_REWIND_REQUIRED，不冒充pending测试通过。

最初workflow缺planning不计有效保护负例，顺序偏差上列。所有失败输入/日志未覆盖；辅助脚本标签大小写、wx重名、replace捕获、只读map/目录摘要错误以及正文输出截断均据实纠正，未修改业务state逃避保护。

## 指定checkpoint及恢复

已真实执行 revision-checkpoint.mjs e-first ABS_CANDIDATE 51，得到D:\work\other\ai-writer\acceptance\20261025-long-flow-090-ad\checkpoint-e-first.json，SHA 8fc19bf8ab6cece2c271f5c41f840d2b667ed921c29acc9de21282401006d61b，567项文件；伴随candidate/main state原字节已保存。该helper本身不覆盖全部objects。根按原安排另用augment-revision-checkpoint.mjs e-first-complete checkpoint-e-first.json补核全部objects；本程没有抢跑augment或覆盖同名checkpoint。实际原生包装器退出码只能在本程返回后由根采集，本交接不伪造。

当前check/doctor均ok；check45项UNREGISTERED_DRAFT为保留变体和未回放52—60，不删稿不合章。changed_sources/stale为空，revision状态editing，非prepared/committed。

## 后续52—60（完整范围不缩减）

先同ID恢复原revision、固定同包，读取完整清单/private路径，再核实时main/candidate SHA。52起每章先context和record-template、官方replay-input，再完整分页实读当前正文/所需来源，核当前继承值和六字段，必要句改后完整复读，当前报告绑定真实正文/来源SHA，preview过才record。54/55/56/60不得提前改后补写前模板；56为下一真实断点，完整授权仍48—60，不写61。

**必须带入下一次交接：旧replay-input/旧journal整条ledger、characters或下游项可能夹带原数量、灯价、柜价及收款值；逐章核当前继承值与本章实际变化，不整条回灌覆盖48已重登的三张一粗两细，亦不在55提前出现56付款。54灯72/付100找28=20+5+3一元；55工46+库存料16=62未收；56交70=50+20找8=5+3一元净62；60仅回述不二收。此注意事项须原意带入下一次交接。**

54还须同步报价/想法/试用/付款/收据/夜里母女知情，48与82另两选项不变、差价24，老何未问价、沈只知各自灯有限话；55不加新采购/额外费用，原门40+10=50和抽屉18、81/84保持；60不二次入账。原48砂纸先两张再第三张，不逆改31，50碎角/55几片不杜撰定量用量。旧作者选择、不可变观察和原意见application/commit继续保持，后续当前全尾段实读复核后才进入另程prepare/commit。
