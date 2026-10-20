# S-R1 原生修订会话中断交接

2026-10-20，按本轮明确指令正常停止，等待父会话真实 exec resume。本次为全新原生Codex修订会话，无其他代理；所有写入仅在S根 acceptance/20261020-long-flow-090-s/ 内。没有改Q/R、其他作品、工具源码、辅助脚本或Git，没有联网/发布作品。

## 唯一恢复会话与令牌位置

- 主作品：D:/work/other/ai-writer/acceptance/20261020-long-flow-090-s/scenario/雨棚后的灯
- session ID：6258de87-149a-44e3-871a-2bfc4ef53e05
- owner：Codex-S-volume-and-dialogue；范围from4、through9；最终revision list状态editing。
- 真实workspace：D:/work/other/ai-writer/acceptance/20261020-long-flow-090-s/scenario/雨棚后的灯/.writer/revisions/6258de87-149a-44e3-871a-2bfc4ef53e05/workspace
- 本地令牌文件：D:/work/other/ai-writer/acceptance/20261020-long-flow-090-s/r1-session.json，token在该文件，不在此抄secret。文件SHA256及实际停止清单见workspace/交接/S-R1-停止核验.json。
- 会话build_id：28d1085869b8a4b65d1e2da2d438e049b3b774a5ce168f155c6cd3e20b30114d；继续用原主项目入口，不换构建、不刷新基线。

恢复先实读本交接、execution-guide.md、revision-one.mjs及主/独立区status、source list、revision list；再从仓库根运行：

```powershell
node acceptance/20261020-long-flow-090-s/revision-one.mjs resume
```

它使用原ID/token恢复原workspace。不要重跑init、baseline或stage，不重新begin、不复制主state进分支、不手改哈希；`revision-one.mjs finish`会review/prepare/commit并恢复workflow，本会话没有调用。

## 实际停止位置

- 入口主r21 → baseline发布r22 → bind旧7—9 r23 → 冻结候选r24 → stage r25。
- begin基线r25；独立区rewind4到r26、发布新V3到r27；逐章重登4/5/6/7到r28/r29/r30/r31。
- 当前主作品r25、已登记1—9；独立区r31、已登记1—7。独立区8/9仅保留原正文文件，不是已重登。
- 主state SHA256：2f9e50394445f3323e8ae088e1998ee2f3b79ceeabc98272054c6a48193ad9fa。
- 独立state SHA256：37b301044a83a2b52ca10f1f3a20bb87d271f9cdbc92170b6ad790f3fba9f0a3。
- 主稿九章逐一与入口 r1-native-entry-hashes.json 比较，全部字节未变；独立区与主稿逐章比较，只有第4章一处短语不同。第1—3章本轮亦因baseline重试追加完整实读，没有修改或重登。

停止核验清单在workspace/交接/S-R1-停止核验.json，SHA256：9d1f58f1f2dc941330a4a5d1a5e3a5006b6fdbc7bf990a1906fef4ce3dd756f7。它列正文1—9、全部四份重登报告、journal、版本依赖、令牌文件指纹和本轮未执行项；是实际字节/流程核对，不是自动文学验收。

## 契约已发布到哪里

主作品只发布了S_V3_ORIGINAL baseline（通用来源范围[1,null]），旧7—9已等价bind；原source_hashes仍为旧字节，主稿继续原V3。S_V3_CLARIFIED目前在主作品为冻结提案加历史pending，pending ID a4d61f36-19c3-4dcf-8f7b-323810411dad；只有未来正式事务commit后才会解除，不将stage说成主稿已修。

独立区发布区间为S_V3_ORIGINAL [1,6]、S_V3_CLARIFIED [7,null]。这是逻辑来源区间；V3/A3本身start=7,end=9不变。4—6的实际context仍消费原V2，7的实际绑定是新版V3。新候选只澄清S轮已有授权及续篇骨架，不追认旧占位文字“未来骨架，未授权正文/未来计划/未定”原本已有新承诺，不改原观察或未来补证。

| 实际文件/版本 | SHA256 |
| --- | --- |
| 原V2 大纲/分卷/V2.json（4—6） | cff8d0a2141de271d3b35308a615960cc669d936512412214abcd51e385c538c |
| S_V3_ORIGINAL .writer/objects/81cc3a8c79c97c15d073150c8c5541deeff4c95dfc31305c478b6d9efed7780d.source | 81cc3a8c79c97c15d073150c8c5541deeff4c95dfc31305c478b6d9efed7780d |
| S_V3_CLARIFIED .writer/objects/eaf2bca6deca00b217843343f910dfc0722f8163ff16037c93a416da499ad936.source | eaf2bca6deca00b217843343f910dfc0722f8163ff16037c93a416da499ad936 |
| 主研究/S-V3候选.json（冻结来源） | eaf2bca6deca00b217843343f910dfc0722f8163ff16037c93a416da499ad936 |

## 正文与实读重登

| 文件 | 主稿SHA256 | 独立区SHA256/状态 |
| --- | --- | --- |
| 正文/0004.md | 0d97321f1011a48127795c5da37e433b7ad6d0e32d2cbb6a6bddb6b5a3b4c302 | 6d10e3b0d5ea503b4b46bf5076b99258a62b3832bdcecab9ee9b0645916c197d；已重登 |
| 正文/0005.md | 3d9abc901b3e6d59f9f36c6fdb4e0ed962e2e697f1bb7ba6bc01edfcb6ad8b1b | 同主稿；已重登 |
| 正文/0006.md | e5e9e30c7526bff3a0b5381f431ef2772866aa2c20b83111e1629113f29a9941 | 同主稿；已重登 |
| 正文/0007.md | 822b236676b390042c740eda993b07df37490163f089c0011f34f462b738e9f0 | 同主稿；已重登，新V3绑定 |
| 正文/0008.md | 0b81e0d5c79f66dc67fe634861a8879dd388b3bfd10aa00f1b79e836f5256f71 | 同主稿；未改、未重登 |
| 正文/0009.md | d12f9832911f0e57440de60090947e2a7720984e031573071bb450207aeed85e | 同主稿；未改、未重登 |

第四章只改“柜台上的饭桌”→“后间的饭桌”，保存修前字节到workspace/留稿/S-R1/0004-before.md（同主稿第4章SHA），修前修后均完整实读。棚下看纸木板、后间绳下落布桌和晚饭试坐一致；三格观察/用途、人物所知和原纸/幕布交接未改。5—7正文、summary及changes保留，实际核完六字段后才record；最终核对输入changes与原replay草案一致，报告与当前稿SHA绑定。

独立区报告：审查/S-R1-重登-0004.md、0005.md、0006.md、0007.md，全部包含summary/characters/timeline/ledger/evidence/downstream真实核查。第4章改稿后另取.writer/drafts/s-r1-replay-4-after-edit.json，保留最先template4的旧稿；交接/S-R1-登记-0004.json将新生成的完整输入供helper合入。没有只改_replay或预期SHA绕过校验。

主报告为审查/S-R1-原卷契约影响.md、S-R1-原卷契约影响-from1重试.md、S-R1-新卷契约影响.md。required_readings所列原文/冻结来源均完整实读，新historical预览后6—9重新完整读取；主报告绑定相关实际哈希。报告属于本次知情模型实读，不是真人盲读、正式验收或作品发布。

## 唯一失败与保留证据

原 `revision-one.mjs baseline` 的首次publish使用from7，CLI拒绝SOURCE_RANGE_INVALID：“baseline 只用于首次从第 1 单元固定原输入；其他旧消费者用 bind”。失败前后主state SHA均f0d04dfb738c27fd36decfc3e7d1e27504a482f11e2342850c2db5bd97e4c8ae。保留 inputs/r1-publish-baseline.json、commands/r1-publish-baseline/ 全部日志、原影响预览和绑定报告，未删改失败证据或helper。

只读核实实现后，以新名r1-impact-baseline-retry-from1取得真实from1预览，补充完整实读1—3章，另写from1重试报告；用新名r1-publish-baseline-retry-from1及operation_id=s-r1-publish-baseline-from1发布成功。再按原辅助相同顺序执行r1-bind-old、r1-freeze-new、r1-impact-historical，随后原helper stage成功。没有重复覆盖wx输入或把原失败说成成功；成功与失败捕获均保留。其余本轮template/preview/record没有失败。

## 恢复后待办及事实边界

下一章仅是修订第8章，先resume原会话，再 `revision-one.mjs template 8`，实读独立区原文、原稿、新V3及真实replay字段。第8章当前139行是：

> “陈阿姨答应了，明天下午两点，榆树巷六号。她和周伯在电话里说的，我也接了电话。”林照将记路纸翻开，“就定了我跟周伯两个人去。”

可最小删除中间那句电话来源的重复补述，保留实际同意、时间地址、两人及许舟送下楼的范围；它是语言改进，不是“AI味”硬错。父快照所提“你不在电话边，我现在把约定带回来”已不在当前稿，不虚构删改。改8前保存旧字节，改后完整复读并检查引文，另名replay-input重新生成当前稿绑定；保留旧template，必要时通过交接/S-R1-登记-0008.json供helper合入新草案，不手改旧绑定。写实际六项报告再record8；第9章仍待完整复核和重登，尚未提前处理。

第7日仅拟问第9日下午，陈尚未同意，何岚/许舟没有未听的邀请详情。第8日真实电话才同意两点两人、右边补鞋处及六号；许舟守一点半工作、只约一点十分到一点二十送出；何岚只知去见朋友。第9日许舟送下楼后离开，林照付去程钱后与周伯实际会面；陈只述姓邵者后屋一段，未见箱内物/原片，年份、送碗日、全名、碗花及失联者承诺保持未知。原片和节目单留周家；幕布何岚柜内。第9章末仍在六号门廊，周伯靠垫在腰后，黑伞在脚边，车钱未结清，回程/归垫/返家上楼及抄稿再核、公开许可均未完成。T_VISIT会面有限兑现不能吞掉T_RETURN及T_SHORT_ACCOUNT后续义务。

第五、六章沿用的O_CURTAIN.reader_known保留较早交付摘要，不能据它误判仍由许舟持布；即时custody/character_known及已读归布/入柜原文明确。第8章原登记已有当面确认后更新该总览，恢复应核实这部分原changes，不遗漏或凭候选计划改事实。

## 分段与明确未执行

工具revision没有复制分段/交接/留稿：建立独立区时实查三个目录均不存在。本会话仅新增辅助交接及第4章修前留稿，没有创建任何分段，更没有把它们称为事务发布树。主作品旧分段完整保留原版中间稿。本会话未同步分段；父会话在未来commit后按原分段最小派生新版本，再核最终合章，不能把旧分段当作已跟随新主稿发布。

到此停止：未template8、未改8、未重登8/9、未登记最终4—9尾段review、未prepare、未commit、未恢复trial、未导出或发布。父会话仍需实做这些剩余步骤；已存在主报告或停止核验不替代最终字节的完整尾段复核。
