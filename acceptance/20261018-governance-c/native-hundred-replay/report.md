# 本批C第四个独立CLI实跑报告

完成状态：本机候选流程已走完并停止，未修改主源码/技能/手册，未Git提交或推送，未联网发布，未使用子代理或发送会话消息。所有文学阅读均为参与写作的同一Codex会话知情自检，不是真人盲读、市场验证或正式发布验收。

## 三种范围必须分开

|范围|实际完成|不能据此宣称|
|---|---|---|
|百章规模|既有100章登记链；仅100–100等价回放；100正文零修改|重写百章、V2从零创作百章、全书文学通过|
|百章实读|完整读95–100六章、100细纲与恢复的全部原增量、必要设定；重登后再从95连续读到100|1–94模型通读；其长历史字段不是原文替代|
|最终源码新创作|0.6/V2 init从零原创《关门以前》两章，767/717汉字初稿；修后767/716|把最初V1六章创作算作V2；把两章短篇算作长篇规模创作|

## 基线、范围与百章事务

实际开场schema5/revision375，完整state与 scale-hundred/before-native-state.json 逐字节相同；before-state.json保存开场完整状态，before-bodies.json保存全部100正文SHA。copy-manifest.json所列598个原始文件均在原封存目录只读复验，原目录598/598原SHA保持。授权副本中原598文件仅state变化，其余597字节保持。

研究/百章C模拟授权.md明确为合成验收，不是真实作者决策。既有治理允许且仅允许revise100–100。begin基线375，独立区rewind100后revision376、登记99章。在这个相同state上3次独立CLI record-template100、3次 replay-input100，六次before/after state同SHA，无覆盖样本。

未填 replay_review 的原始回放输入preview返回REPLAY_REVIEW_REQUIRED，退出1且state不变。完整阅读原100正文、原增量和95–99连接后，六项实核报告绑定真实稿SHA，再preview/record均成功。原摘要完全保留，原journal的39个patch与新journal逐项完全相同；含证据和updated_unit在内无事实差量改变。27条真实语义patch路径另列field-comparison.json；恢复输入中的97个叶字段含保留历史，不能算97个新故事变化。

登记后真正连读95–100，review-template逐章30项功能均有本章原文引文，比较两组相似结构及不同收益；issues为空，没有为验收制造文学问题，也未在分支登记/处置95–99意见。详见[真实读稿及五项功能表](真实读稿及五项功能表.md)、hundred-functions.json及原始review输入。

主作品prepare/commit成功，事务 9eaa56ee-b6a4-4ee9-95d3-de3ea3072b05，主revision375→376，仅+1；重复commit返回unchanged=true，捕获的前后state同SHA。随后workflow暂停推进376→377，仅discuss/plan，draft_range/revise_range均null，没有101章。

100正文逐字节等于原副本，前99完整登记对象深度相同；snapshot SHA仍为 2e97cb1de2f85178ce99b5e795746a0d79a60dd59bf5e9b0809c741421683f94。141条ledger（thread53/observation33/object40/relationship3/fact12），1157个逐ID+unit+quote+version锚点全部核正文SHA、引文及行号；统计及逐锚明细在hundred-ledger-anchor-audit.json。该机械核验不证明1–94文学或语义通读。

新replay_review报告入口与冻结对象SHA相同，六项字段齐全；当前95–100结构报告冻结正文/报告及引文均有效。check无findings、无未登记稿；rolling_review为valid48、stale66，63份旧stale有单份当前报告覆盖，3份仍uncovered：两份25–42报告与旧1–100全书报告。pending_windows=[]仅是旧窗口当前覆盖统计，不能升级成本轮百章文学通过；旧记录不删除、不重标有效。

## 0.5与0.6字段与成本观察

|入口|三次进程毫秒|中位数毫秒|原始输出字符/UTF-8字节|紧凑输入字符/字节|摘要字符/字节|changes字符/字节|人物/时间/ledger/引文|
|---|---|---|---|---|---|---|---|
|真实旧0.5 template|2182/2645/2754|2645|1281/1515|1161/1395|0/0|50/50|0/0/0/0|
|当前0.6 template|379/390/422|390|1306/1540|1182/1416|0/0|50/50|0/0/0/0|
|当前0.6 replay-input|469/491/478|478|39107/98427|36535/95855|253/715|34537/93117|3/1/6/15|

字符口径为Unicode code point，字节为UTF-8；changes采用紧凑JSON，原始输出含格式与说明，紧凑输入包括协议字段。旧0.5对照报告的1395字节已按原stdout解析后紧凑JSON复现，不和1515原始stdout字节混用。具体三个样本逐次值及97条恢复字段名见field-comparison.json。

旧0.5本来自动填写路径/哈希，并有changes与增量ledger及保留未变项能力，这些不是本轮新增。新回放草案额外恢复253字符/715字节摘要、3项人物、1条时间、6项ledger及15条旧引文，仍须实际阅读。纯语义载荷（summary+changes且移除ledger引文）34115字符/92633字节，其中大部分是保留历史。恢复填表不等于判断无变化。

必须人工核的六项分别是：摘要是否仍准确；人物当前/历史所知；时间先后与计划/已发生；ledger状态、custody和未知边界；完整引文及版本；实际下游承接。具体本章实核记录在作品审查/native-four-100回放实核.md，并由CLI冻结。不能只抄六项名字当作完成。

以上毫秒只是不同协议、不同运行环境时段下的本机新进程启动+IO观察；仅3次样本，没有人工计时、填表工时、配对性能实验。不给提速百分比，也不宣称人工时间节省或产品性能提升。

## 从零短篇及意见闭环

见[fresh-report.md](fresh-report.md)、fresh-verification.json和fresh-handoff.json。顺序为init→骨架/一卷两章→计划1/context1/template1→创作实读1/preview/record1→计划2/context2/template2→创作实读2/preview/record2；没有先批量写稿。明确保留第2章人为“小车车”及完整原句ledger证据，写完即暂停，仅讨论审查。初始两章完整实读后，FRESH_C_TYPO为受控correctness/minor，FRESH_C_STYLE为第1章原句语义正确的optional_style/suggestion。

模拟作者新原话真实落文件、SHA冻结，采用2章重复字、保留1章偏好，仅revise2–2。独立区只删一个车；旧完整引文preview按预期拒绝且state不变，修正P_CART/T_RETURN两条完整引文后登记成功。修订尾段2完整实读，prepare/commit真实发布，主基线8→9；重复commit不变。实际publication a79e8eaf-5211-45e0-8123-7f7308fc40ad，随后才apply。再完整连读当前两章形成新有效报告，verify同一已应用项。最后revision13，typo verified、style retained；两个范围null、无第三章。

第1章正文SHA和完整登记对象保持，修第2章净删1个code point/3个UTF-8字节。移除ledger evidence后整个snapshot严格相同；证据版本SHA/完整引文改变，故全snapshot SHA不同，不能把证据版本差异说成事实改变，也不能说整个snapshot字节相同。当前两章报告及replay_review冻结对象有效。控制样本不代表自然检出率。

## 最终工具、导出与调用记录

主doctor正常；百章作品doctor退出1，只读发现随附0.3不支持schema5，未调用旧工具写状态、未更新。tool compare保留实际版本/指纹差异。fresh随附新0.6 doctor正常。75次产品调用都观察到同一0.6构建guard c9c6ca170c19b518a26782e6aae044c27c84f4ca0c5d88830aba1a44ddc7e0ec，前后runtime文件稳定；这是磁盘观测，不是执行字节的密码学证明。

百章新目录导出included1–100、excluded=[]、warnings=[]；合订793463字节，SHA f579c2cb65c88864e93271c317021c6d49c5e10d4d7bbc916bd9e7ab70f7b3ab。短篇included1–2、excluded=[]、warnings=[]；合订5333字节，SHA f23ee52a1bdab1261464933186ac26b3df26de3ef8df9a12763b89bcec3a5b67。已独立重建并逐字节比较实际导出文本；每章先trim首尾空白，再用空行/分隔线拼接，不能称合订保留原始字节。manifest逐章正文SHA与source_hashes全部对应登记对象，仍为draft-export/quality_review required。

所有产品调用经主 bin/ai-writer.mjs 和本批 capture.mjs，唯一 native-four-* 标签。原始证据位于 ../commands/native-four-*/：result.json、stdout.raw.txt、stderr.raw.txt、带 --input 的 input.raw.json，以及带 --project 的完整 before-state.json/after-state.json。init 的正确入口只接受 --path，不带 --project；capture 因而无该次 state 路径，fresh-init-state.json 在初始化完成后立即保存完整结果。所有标签及路径、输入SHA、构建、前后state和退出码列于 command-index.json。

共75次，71次退出0；2次预期preview拒绝、1次预期旧工具兼容诊断、1次操作者init误传--project导致退出2，后改用--path完成。百章标签24次、短篇46次、公共帮助/主工具诊断5次；21次捕获到state字节变化，plan/volume等其他文件写入不能只用state计数替代。record4次（百章重登1、短篇初登2/重登1），review4次（尾6章1、短篇初始/修订尾段/最终各1），真实commit2次及重复查询2次。

|CLI主命令|调用次数|
|---|---|
|status|3|
|--help|1|
|revision|16|
|rewind|2|
|record-template|5|
|record-preview|6|
|record|4|
|review-template|4|
|review|4|
|workflow|5|
|check|2|
|doctor|4|
|tool|3|
|export|2|
|init|2|
|volume|1|
|plan|2|
|context|2|
|review-issues|7|

没有发现必须由父流程修源码的产品失败；门禁拒绝和旧工具兼容提示均保留最小可复现原始输入输出。验收辅助脚本曾把幂等commit输出误当带revision，独立断言报错；已改为核unchanged和before/after state同SHA，未重试或篡改产品事务。主工具未改，因此未运行npm test或test:engine；本阶段已执行主doctor、实际CLI流程和独立字节审计。产品调用与派生审计证据不能冒充正式产品发布验收。

停止：仅交接以上两个授权范围的结果，不继续作者创作。
