# 第二轮旧章改写与 Codex 恢复验证结果

实际基线 revision 44，已登记1–20章、next=21、无来源/正文漂移。正式 rewind --from 7 --expected-revision 44 后 revision45，7–20共14章逐章取得新 plan/context/record-template 后重新登记，最终 revision **59**。review 命令不增加 state revision，最终仍59。全程无子代理、不写21章、不手改state/journal、不提交推送发布；产品代码未改。

## 完成状态

- 正文只改第7、8、11、14、20章；1–6正文、章纲和完整登记对象逐字节/逐字段保持原样。
- 最早影响来源是第7章自身章纲，由7消费；拟改7/8/11/14/20各章纲均只由对应章消费。全局设定、权威规则、全书大纲、卷契约不改，未制造更早漂移。详细映射 source-impact.json。
- 当前20章，每章正文Script=Han计数1551–1701，均在1500–2000内；标题不计。五章原文全文对照见 changed-chapters-before-after.md，逐章说明见 chapter-diff.md。
- 修前完整作品171文件原字节快照 before/work、逐文件哈希 before/manifest.json，另保留此前请求、输入、报告、导出及验收历史到before/history。旧journal、rewind备份、review及报告均未删改。
- 全账本36稳定ID保留，所有类型/状态/due_unit/custody及observation.statement逐项相等。198条旧引文中196条不受影响的原引文保留并重绑现稿；仅替换7章09:35引文与11章顾提前知情引文2条，新增8条；最终204条全部核对正文hash、行号和quote。
- 旧20章和新20章journal均实际独立重放，与对应state一致。14次新登记expected_revision顺序45–58，逐项匹配当次真实context/template来源；逐章重建登记前state并核SHA-256，14/14一致，没有复用旧revision或伪造source_hashes。

## 知识迁移

| 重放截至章 | 顾遥实际所知 | 原牌亲见 |
|---|---|---|
| 11 | 浅色棉布、窄铜牌、归属未核且沈继续负责；不知铭文、刻线、日期信息 | 未见 |
| 12 | 继承11，正文无新增告知，快照无14章知识 | 未见 |
| 13 | 继承11，正文无新增告知，快照无14章知识 | 未见 |
| 14 | 唐16:54离店、沈复封上架后，在前台首次当面获完整西埠四号泊位、右下两短线、正反未找到日期，以及首日独开未拍抄边界 | 未见 |

详见 knowledge-migration.md（角色短状态、O_PLATE、P_BOX、真实journal路径/hash与引文），after/replayed-snapshots.json 与 after/snapshots/0011至0014。第15–20章保留完整口述知识，同时各自嵌套的截至13历史仍仅泛知箱内有牌，没有把所有11机械改成14。周5章、唐7章获告和唐14章首次亲见不变。当前原牌地点、唯一原箱及蓝棉绳均保持。

## 时间与话题来源

第三日08:35到站、09:00提醒、09:20拍通知、09:30工人到场均保留；临走助工挪小车、卸装篷布扎绳垫轮，09:50离站。09:50+12分钟=10:02蓝牌，+23分钟（含绕路）=10:25入厅。10:25至十一点刚过约36分钟，固定候问8分钟+洗手4分钟后尚有约24分钟容纳标识、两次问答、帮助旅客、电话周和休息，详见模型报告的可行分配（不是新增正文钟点）。十一点刚过通报早于11:30承诺；其后写本、买饭吃完11:25返程，18+12=30分钟约11:55回站；13:00、14:40、15:00、15:17、15:28、16:05、16:26、17:15等后续原时点成立，未无谓顺延。

第20章确认旧稿答长灯前只有箱照和归属说明。现稿先实际展示灯柱原位工作照并询问未拆整根可否暂放，再让宋拒收。他只看照片，不读门背字、不亲见灯、不自动获灯语或历史，不杜撰先前联系。同步角色沈/宋、T_LAMP、T_ARCHIVE、timeline和证据。

## 审查误判纠正（单列）

第2章61、65行第一天明确写扶微波炉、重新挂帘。第三日“前天”有依据；第11章正式恢复为“前天还见她帮着扶微波炉、挂门帘”。上一轮请求、结果与主会话撤回记录完整保留（before/history/findings.md及原请求/输出），不篡改旧历史、不解释成人物记错，不算产品缺陷修复。

## 检查与导出

status/check/doctor最终均ok；registered20、next21、stale_units=[]、changed_sources=[]、unregistered=[]。check findings=[]；有效模型review1份，旧失效12份全部有当前覆盖、欠审窗口=[]，旧报告仍保留。doctor errors=[]、warnings=[]。模型报告在作品审查/revision-b-0001-0020-模型知情复核-r59.md，已完整实读最终1–20并review绑定当前哈希；不冒充真人盲读或产品正式验收。

导出到完整路径 D:/work/other/ai-writer/acceptance/20261016-expanded/revision-b/export。manifest包含恰好1–20，excluded_drafts=[]、warnings=[]，逐章正文完整出现一次，无遗漏重复；合订本SHA-256：2b5b37e55cb95aeded92740080f481c0734f7ee97d8dda075b395421c6bc3200。export-verification见after/export-verification.json。状态仍draft-export。

## 未结状态

- T_SIGNAL：partial，due_unit=12；20新口信行只是2012年9/17 14:20西埠四号转候船室交邱阿兰的登记观察，原话另签未见不配无日期录音；邱尚未当面讲、不认最终收件。声音日期班次、剪者、消息实际去向接收仍缺，partial due12不改。
- T_PRIVATE：intentional-open；第15章沈未拿灯片追问罗失约，明确不托唐追问；原私人原因仍未知，无author_truth，intentional-open保留。
- T_LAMP：partial，due_unit=9；已有岸端用法兑现保留；20服务室明确不收长灯，沈电话唐当前不拆、师傅未叫；承付420运另算但真接收去向仍无，不为收束拆片或认船况。
- T_TAPE：partial，due_unit=18；20原带未新播、纸行未与录音证同日；14:00–14:30补起首仅已约未做，须先重检设备再录，模糊语音身份和日期接收交叉验证仍缺，due18保留。
- T_INDEX：partial；20亲见现标2013六月清理航务杂存袋及2011/2012口信二册，实证当前存放，宋后来接管口述不证完整历史链；原话另签不在当前夹位、余散页未展，未把照片清点年认声音日。
- T_EAST：partial；第8章现厅六号是寄存编号，不能用来定位旧牌四号泊位；第10章2011复印图将当年候船室和西埠泊位分画，仍无今厅/挂牌/通知年代，部分排除空间混同，旧今沿革和旧四号泊位精确位置仍未证。
- T_MAP：partial；已找到许成留存的2011年11月单张维修附图复印件及工作照片；尚无整套原图/确切经手去向，不能给无日期通知或铜牌定年代，不含今厅。
- I_AUDIO_ALIGN：partial；保留原有边界，未在本轮强行收束。
- T_CONTACT：pending；保留原有边界，未在本轮强行收束。
- T_ARCHIVE：pending；保留原有边界，未在本轮强行收束。

其他active条目完整保留。原签、余散页、最终班次/消息接收、正式接收箱灯仍缺；第20章14点补录、16点后查访、晚对单及饭约、明早问负责人均未兑现。

## 历史与失败记录

本轮CLI每次真实argv、cwd、退出码、原始stdout/stderr在logs；辅助执行在aux-logs，失败不会被过滤。辅助失败4次：候选字数统计误读未复制1章、证据期望排序不一致、外部历史日志追加被严格相等检查捕获、PowerShell改变内联代码反引号导致归档命令语法失败，均保留首次失败且修正后成功，不算产品缺陷。最早一次函数编排TypeError无子进程argv；帮助输出被辅助脚本误当JSON解析的早期失败另在early-parse-failure转录。该次发生在host建立前，仅有工具回包文本，不能声称是进程原字节分流抓取。首次错误备份在before-invalid-buffer-copy原样保留，已由before/work原字节hash核验替代，不用于恢复。

作品外parent-reading.jsonl在任务期间被其他写入者追加；本轮未写该路径。旧16494字节已核为现文件完整前缀，原历史保留；其余2612个历史文件hash相等。完整记录见audit.json.externalAppends。

## 逐章字数与修前后SHA-256

| 章 | 正文汉字 | 修前 SHA-256 | 修后 SHA-256 |
|---|---:|---|---|
| 1 | 1554 | 3b7caf64e475d1e34dd812133a10b122335992c8389482202b0e82401f0a71f6 | 3b7caf64e475d1e34dd812133a10b122335992c8389482202b0e82401f0a71f6 |
| 2 | 1551 | 7d09099dd8a2e257583d7b1ba465a6793c55b459e1676569ed9713b86ac8cf3e | 7d09099dd8a2e257583d7b1ba465a6793c55b459e1676569ed9713b86ac8cf3e |
| 3 | 1579 | 682ef2845eec5cefe1f793c8b58d11983bd472341d0965f1cc8c685a9ace15df | 682ef2845eec5cefe1f793c8b58d11983bd472341d0965f1cc8c685a9ace15df |
| 4 | 1573 | c441029c91862cdc9a1b3d8d630854af8fbc6ec1df4a0d5cf3af92458d1429bd | c441029c91862cdc9a1b3d8d630854af8fbc6ec1df4a0d5cf3af92458d1429bd |
| 5 | 1629 | 14c9f62a68d08a59fcfa18d191b8fdd9c369308fba72900b8d2d5d1387149df2 | 14c9f62a68d08a59fcfa18d191b8fdd9c369308fba72900b8d2d5d1387149df2 |
| 6 | 1606 | 83d3084e8f510235fc980b8bd0bb899b1310f4a6b97ae1a93832a95b2a10e78e | 83d3084e8f510235fc980b8bd0bb899b1310f4a6b97ae1a93832a95b2a10e78e |
| 7 | 1683 | 34256cfd42df6efbd97deb77ee8e88fa6ef40c24949e096aed4ad86adf788813 | 41d3a2bdfae2cd7ec4404e05680a8c9a708cc470efc5c518edeec54ba60b80fa |
| 8 | 1628 | 69ccb4d307ec4b579865392f71aa4ccab0c717c0f5a180732964d68e996f9097 | 90167655e747e966bfaa19355f816ca06386729674c123909fd09746bee36445 |
| 9 | 1553 | a60c2e14dda21e97f3292c71a63ea2b5b7a9d22ae712c4afc1f66dbfa1c7106e | a60c2e14dda21e97f3292c71a63ea2b5b7a9d22ae712c4afc1f66dbfa1c7106e |
| 10 | 1642 | 0a3f2507444f8afe16d680b3e33a65f139941763fc9d185e139f8ea2aafa949e | 0a3f2507444f8afe16d680b3e33a65f139941763fc9d185e139f8ea2aafa949e |
| 11 | 1577 | 6ead2b222f4f993d97e8ade5d454b6e7c1470581b7fbac6396421f7f4554a129 | b0cbd3c74cbfd713843f9c5dd66df5ae16fabf46073de9845a6041261edbfa31 |
| 12 | 1650 | 6d1dd0ac58781f88250bbc9e31eb0ef61e201fa7b84db5226f0324560a4176e4 | 6d1dd0ac58781f88250bbc9e31eb0ef61e201fa7b84db5226f0324560a4176e4 |
| 13 | 1566 | 92e586a06ddb4925a65e69b700e3bcf8f08f0b0088e8d4395653042b61680456 | 92e586a06ddb4925a65e69b700e3bcf8f08f0b0088e8d4395653042b61680456 |
| 14 | 1701 | 265721c8c8361a220ef686bddb62f2f1dd265c13836508e9a5a380fd22e97f61 | b18387aa1c6a78b9cad0fce07d12f35848a04964c447b2b0ac2fa711fba28724 |
| 15 | 1568 | 2600a03d13d7c6004a5b6fa671162486b19f77518303d3ad2ed0fbd07df86bdb | 2600a03d13d7c6004a5b6fa671162486b19f77518303d3ad2ed0fbd07df86bdb |
| 16 | 1569 | 91db5857351b88db52624f9f4856a2f0131f29ad3a28495a7a257e76c9ff2e11 | 91db5857351b88db52624f9f4856a2f0131f29ad3a28495a7a257e76c9ff2e11 |
| 17 | 1577 | a57f36b642d6a32973fb70d49d3a7e523175369c3bb0511b4db72dc41bdc8fe7 | a57f36b642d6a32973fb70d49d3a7e523175369c3bb0511b4db72dc41bdc8fe7 |
| 18 | 1574 | 69c847e4210377eab6163199f8cba6c0197edd1e04bbf7edb8326b6f20481b6a | 69c847e4210377eab6163199f8cba6c0197edd1e04bbf7edb8326b6f20481b6a |
| 19 | 1560 | 896590146f4ef7a69812c857215b6ebc27a28f5f91f439c6905877c8534a3d3e | 896590146f4ef7a69812c857215b6ebc27a28f5f91f439c6905877c8534a3d3e |
| 20 | 1605 | d31124c7b02a79f0d5d4ee55b7d349e83231d29fb8e5b65035b94916aa4823e2 | bf22ebf63322a09ae97b00efd77101538202e6c958530a7033a342c651071bc0 |

## 审计索引

- ledger-semantic-diff.md：全部36项终态字段差异及前后值。
- replay-semantic-diff.md / .json：1–20逐章快照语义差异，尤其11–14不混用终态。
- knowledge-migration.md：顾遥四个关键时点和真实journal证据。
- audit.json / after/evidence-anchors.json：来源、重放、逐引文锚点、保留计数。
- before/work、before/history、logs、aux-logs、inputs、contexts、templates、export：完整追踪材料。

Git最终无tracked文件差异；工作区仍有原先的.idea/与acceptance/未跟踪项，未stage、commit、push或发布。所有本轮文件写入限定作品目录与D:/work/other/ai-writer/acceptance/20261016-expanded/revision-b/。
