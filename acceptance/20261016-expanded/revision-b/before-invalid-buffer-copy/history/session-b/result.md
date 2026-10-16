# 潮汐信号 session-b 真实续写结果

已完成独立恢复、第5–8章创作与登记、第6章后的1–6滚动完整连读，以及结束后的1–8全稿完整连读和模型知情复核。作品当前revision=9，next_unit=9，8章均登记。新增6401正文汉字，整稿12657汉字。字数口径：删除首行标题，以JavaScript Unicode \p{Script=Han}逐码点计数，标点、数字和标题不计。结果为草稿，模型审查不等于真人盲读、文学定稿或正式产品验收。

## 实际读写边界

仓库cwd为D:/work/other/ai-writer。仅向作品acceptance/20261016-expanded/works/潮汐信号和acceptance/20261016-expanded/session-b/写入。辅助输入、恢复记录、CLI原始日志、结果、导出全部用完整阶段相对路径，没有写仓库根同名session-b或export。未使用子代理，未修改产品代码或作品内工具，未手改state/journal，未提交、推送、上传或发布。

实际完整读：恢复时现行1–4章；其后回查铜牌早证；每章创作后完整实读自检；第6章登记后重新完整读1–6；第8章登记后再次按1→8完整连读当前版本。另读当前writer.json、设定四文件、全书大纲、V1/V2卷契约、第4章现行章纲、当前state、当前作品内1–4报告，以及本轮新章纲/context/recall/当前账本。1–3章纲只采集来源哈希，没有把其未实读内容写成剧情依据。只读取现行状态，不读旧状态或旧journal补剧情。没有读取其他阶段请求/聊天/结果、测试README；当前报告中涉及历史过程的说明未用作剧情来源。恢复记录见recovery.md，初始实际来源哈希和10条基线ledger见initial-evidence.json。

作品写入包括：第5–8正文、通过plan生成的四份单元章纲、CLI产生的state/journal/review追踪，以及审查/session-b-0001-0006连读.md和审查/session-b-0001-0008模型知情复核.md。第1–4章正文、设定和原卷契约均未改，原证据哈希全部不变。

## 章节、修订号和当前正文哈希

| 章 | 文件（作品内） | 正文汉字 | 本阶段登记修订 | SHA-256 |
| --- | --- | --- | --- | --- |
| 1 | 正文/0001-六天的空位.md | 1554 | 恢复基线 r5 内既有记录，未重登 | 3b7caf64e475d1e34dd812133a10b122335992c8389482202b0e82401f0a71f6 |
| 2 | 正文/0002-箱子里面.md | 1550 | 恢复基线 r5 内既有记录，未重登 | fde7038ca2797bd07fc5df0b3646d92cedcc919b7698b12fd79f2c0545d75cf2 |
| 3 | 正文/0003-红棉绳.md | 1579 | 恢复基线 r5 内既有记录，未重登 | 6c0bf8ef63f57702f6e43a1d0e01a290c977630ed54707e7f073b110842fd1b1 |
| 4 | 正文/0004-先停在这里.md | 1573 | 恢复基线 r5 内既有记录，未重登 | c441029c91862cdc9a1b3d8d630854af8fbc6ec1df4a0d5cf3af92458d1429bd |
| 5 | 正文/0005-说给一个人听.md | 1627 | r5 → r6 | 56f17c8c7e83e0464c349a89c3e948ea11ae94129f0de42c8cc8d5e292e03c38 |
| 6 | 正文/0006-箭头朝东.md | 1577 | r6 → r7 | 375e6e07db20ee5bf79dab45e2404705a83339d3fb81b23d28cd6435e77a6f1e |
| 7 | 正文/0007-先走出去.md | 1582 | r7 → r8 | 806ae3db86d1f458144ab09d3a80a3ddaa99fc304951866d650c1d48e36bf6c4 |
| 8 | 正文/0008-六号窗口.md | 1615 | r8 → r9 | 565014e3d1ed00f626dc57f91c247cbe51f86f786af6d3ee91910263a88aba98 |

第1–4章没有重新登记，本报告不推测其更早的逐章修订历史。当前所有章节均处于r9整稿内。

## 写前来源留存

每章顺序为plan → context → record-template → 写正文 → 实读自检及必要修正 → 填changes → record → check。原始写前模板record-template-0005至0008.json、context-0005至0008.json和登记输入record-0005至0008.json均保留。模板的source_hashes逐字保留到record，没有写后重取哈希绕过来源检查。audit确认context/template来源一致。

| 章 | 写前revision | 写前state SHA-256 | context omitted_ids数 |
| --- | --- | --- | --- |
| 5 | 5 | 075c151073383de8534be46bdc883cc0233e71bb5260a6c42b6ad4e063bd7723 | 0 |
| 6 | 6 | 11f7f6a7a50a31be0cee6f758d6063bd68af63a76e5ad3574102d19e2415d25e | 0 |
| 7 | 7 | 3570207c703d21599910df0466a2454a23f876762c5f149b670422e51daf189f | 0 |
| 8 | 8 | 03e65231b807df7ec2b9b7e2b35a1b09fdaeaf0af89d4e07b24fa96e9983d15d | 0 |

恢复时以recall“沈禾”取得全部10条ledger，再006–015逐一显式召回主要稳定ID。进入V2又031–034召回T_EAST/O_NOTICE/P_NOTICE/T_INDEX；相关原文已完整读回。四章context均显式列入当时全部ID，omitted_ids为空；证据摘要的evidence_omitted并非丢弃，通过完整早章实读及当前ledger复核补齐。

## 人物知情和物件保管

- O_PLATE：原观察仍只有第2章沈禾亲见。第5章23/29行首次完整口述给周砚并注明沈禾述；第7章7/9行唐穗才首次获告。二人均未见牌；顾遥、罗敬、问讯员未获牌的完整内容。
- P_BOX：牌与棉布仍随唯一原箱，编织袋封装自第3章领回后未拆，沈禾保管在顾遥店后干燥顶架。沈→唐、唐→沈两次既有交接完整保留；顾遥只是收费空间提供者，无新增保管交接。
- O_KEY/P_KEY：原三角磨痕、红棉绳不变；沈禾背包内侧纸套封袋，未试锁，跨V1/V2保留。周、唐未被无据赋予钥匙信息。
- P_TAPE/T_TAPE：原盒与前层硬袋仍沈禾随身，原试听记录纸仍在外保护袋隔放。只保留第4章真实短听范围，未重播、转录、倒带或听全；第8章背包随身洗手、坐回搁腿边动作明确。
- O_NOTICE/P_NOTICE：第6章沈唐亲见无日期改候船残页；第7章沈只带正面工作照片，唐亲手夹回原件、明确管原件。第8章问讯员只看照片；周仅知消息/电话转述，未到客运厅。唐电话说原件未动，沈尚未返站复核。号码页不入镜、不外发。
- T_INDEX/O_CURRENT/T_MAP：目录两栏是周所示抄纸，仍周持有。现六号寄存和接驳图是沈亲见；周只听电话。问讯员建议找带年份旧图，不代表具体经手人或图已找到。

上述位置与引文绑定本表当前正文哈希；模型复核报告给出各章实际行号。69条ledger引文均另经audit核对SHA、行号、原句子串，无不符。

## 卷契约、未结与到期

V1已落实发现和保管旧资料、两次原箱交接、安全短听、基于有限资料的初始误判。V2已在第7章出发、第8章实地查访和初步排除，人物作了实际选择：先卸架、放弃修音时段与急活、走出去、等待服务、撤回无证定位；没有只延长手续。

T_EAST现为partial：排除当前六号窗口与旧六码头的数字直配，不能由今天箭头认定旧址；历史接续与旧东埠位置仍未知。T_SIGNAL pending due12；T_LAMP pending due9（下一章到期，应及时召回第4章实读，未证则保留）；P_TAPE active和T_TAPE partial均due18。到期数未延期，T_PRIVATE intentional-open，不补私因或author_truth。T_INDEX/T_MAP仍pending。T_HANDOVER active：第7日移交；第2日已交单，第3日上午卸架和电话通报已发生，下午回站与当日留存单仍未发生，不能记作完成。

## 错误与修复

- 第6章，首次登记前：说先查昨天的摩擦声 → 说先查上午的摩擦声。第3至6章均为第2日，摩擦声在当天上午；完整实读发现并在首次record前修正。
- 第7章，首次登记前：那你前天问我里面什么，为什么不说？ → 前天我问你里面什么，你为什么不说？。唐穗是第2章提问者，纠正对话主客关系。
- 第7章，首次登记前：她借过一辆卸面粉的车 → 她从一辆卸面粉的车旁绕过。动宾和具体落地检查避免被误读为借用车辆。
- 第8章，首次登记前：翻过昨天记听带位置的那页 → 翻到空白页。第4章试听记录是隔放在外保护袋的纸，不能变成本子旧页；保留原纸位置。
- 第8章，首次登记前：纸巾只剩包过轮盖的那张，她没留 → 纸巾刚才连轮盖一道给了旅客。明确纸巾实际已递出；洗手间来回背包随身，坐回后置腿边再电话，补齐原物携带及身体位置。

这些均在各章首次record前修正。未发现已登记正文需改的硬错误，因此没有rewind或重登，也没有用手改state补洞。基线10项ledger均保留，原证据、人物键和due值未丢，原observation陈述不变；当前共16项。语义知情/保管边界经全文复核，保留正常未结，不为清零改resolved。

## 审查、工具与日志

第6章登记后先重读1–6，review 028登记当前滚动窗口，check 029无欠审。最后完整重读1–8，review 046登记模型知情全稿报告。最终check 048：8章、r9、findings=[]，3份有效报告、0过期、无pending_windows。status 047：next_unit=9、无stale_units/changed_sources/unregistered。doctor 049：Node v24.15.0、作品内工具0.3.0、7项skills、errors=[]、warnings=[]。CLI机械通过不冒充文学验收。

真实作品CLI共50次，全部退出0，无非零结果被隐藏或改写。cli-index.json及logs/逐次json保留实际node executable、完整argv、cwd、起止时间、退出码及signal；stdout/stderr按子进程原始字节分别保存为.stdout/.stderr，空stderr也保留。外层日志提示不混入原始stdout。所有工具调用均使用本作品.writer/tool/bin/ai-writer.mjs，参数--project始终为完整作品相对路径。

## 导出核对

导出目录acceptance/20261016-expanded/session-b/export，含manuscript.md、manifest.json。manifest included_units恰为[1,2,3,4,5,6,7,8]；excluded_drafts=[]、warnings=[]。合订稿只有8个章标题，每章当前正文完整且各出现一次，各源哈希与manifest一致，无遗漏和重复。保持draft-export/quality_review=required状态，不称发布稿。

- 导出整稿SHA-256：5b50d4064240cf0bae67bf94b300adbf5be3ac5ae906a0e7a240c1e3774abcf4
- 导出manifest SHA-256：4463a371ea048ec58ae19ae3f2479051838828d238b54a29fe97a985c6b2d24b
- 恢复基线state SHA-256：075c151073383de8534be46bdc883cc0233e71bb5260a6c42b6ad4e063bd7723
- 最终state SHA-256：60fe89d64dba093fb7e765ff184accc4be2da0c826ca7cd092eb9470396ca387
- 1–6报告SHA-256：b5fb9278bfc56244cf499f8c85d4db5d69797b0208d5c511a0b807ba00a01c55
- 1–8报告SHA-256：9adb4b9389f89ab11290c7ce557b7e499443118cac36bbcbacf161761970bc44

独立验证结论：无不符项。详细计数/锚点/初始条目保留核对见audit.json；导出完整性、原始日志哈希和报告哈希见verification.json。后续续写从第9章恢复，先处理T_LAMP到期回查，不能将待找图、下午返站、交单或最终广播答案当作已发生。

## 当前来源哈希

state单独列于上方；下表为当前已消费来源，旧历史state哈希只作为写前绑定值保留，不用于补剧情。

| 来源（作品内） | SHA-256 |
| --- | --- |
| writer.json | e9e0f74ae90e3c008d6ef2d090f14bbba908709a1db9ad564622597d6d4008b3 |
| 大纲/单元/0001.json | 7f6bde37b8724ec2c218640064c2ad60a694f2eb011d81dbeb08c49a29d2db5f |
| 设定/作品定位.md | 1149a87c65fe312b292e6879909c7c27ed83b466211a313be9aa22783e510e94 |
| 设定/文风.md | 2fdc05792c2bb688acbf0d1fef354e9cb70ce24bee3a535d056328ba7c5f382c |
| 设定/权威规则.md | 42d83dfbfcba4b6eead41d557d4e420be8b28d74fea48c26e4c7b4558dfcb6e6 |
| 设定/角色卡.md | 944495ced492696613e970d574e1ea07dd636cb38c56170a2bf9d80f7041e21e |
| 大纲/全书大纲.md | 0f936435e2b4946d4abe9607d53c9e903c097623490ae248ad228cbaa67d8ef9 |
| 大纲/分卷/V1.json | 54d5f5ae832f07656ac8955546a3c050925d0d7ae07ff6bfe05c039ed1228f2c |
| 大纲/单元/0002.json | c4e1f8853e6ae096e670b10e5b91f4cedc19cf6a7fcaad4adab02c653e892726 |
| 正文/0001-六天的空位.md | 3b7caf64e475d1e34dd812133a10b122335992c8389482202b0e82401f0a71f6 |
| 大纲/单元/0003.json | 9e229faddb97fc57068ba67e73333bcdc6ff62d6a98306ca566c714a1165c1bc |
| 正文/0002-箱子里面.md | fde7038ca2797bd07fc5df0b3646d92cedcc919b7698b12fd79f2c0545d75cf2 |
| 大纲/单元/0004.json | 6c80ae197958d29bce713ac7b32f8cda74d2361ecb67578e50096c66c71e9bbe |
| 正文/0003-红棉绳.md | 6c0bf8ef63f57702f6e43a1d0e01a290c977630ed54707e7f073b110842fd1b1 |
| 大纲/单元/0005.json | 32cedd0ee2acea640914aebe12b57c6ed232eca8f39f9b32f0614e80878c49a6 |
| 正文/0004-先停在这里.md | c441029c91862cdc9a1b3d8d630854af8fbc6ec1df4a0d5cf3af92458d1429bd |
| 大纲/单元/0006.json | 2aa9153434579bf0bc77e37abbab4fc4cb987770739319fe3bcd21f833d3179a |
| 正文/0005-说给一个人听.md | 56f17c8c7e83e0464c349a89c3e948ea11ae94129f0de42c8cc8d5e292e03c38 |
| 大纲/单元/0007.json | c5a85865cec2cc451a300cb1bcaaaa060bfe8fc9ddceeb24fc6b9ff24ff91175 |
| 大纲/分卷/V2.json | 2cbff269ea6ffd0adccf60c4351958221dca8aceb6f99d443b9f9a6c026c7cb5 |
| 正文/0006-箭头朝东.md | 375e6e07db20ee5bf79dab45e2404705a83339d3fb81b23d28cd6435e77a6f1e |
| 大纲/单元/0008.json | cd9b539d00329ce3e11d1971b09a050f9391f932996f7bcafbdc80b2b5f3bdff |
| 正文/0007-先走出去.md | 806ae3db86d1f458144ab09d3a80a3ddaa99fc304951866d650c1d48e36bf6c4 |

## 作品CLI逐次索引

完整argv见cli-index.json及logs/*.json，以下仅供定位，原始stdout/stderr未改写。

| 序号 | 命令 | 退出码 | 原始输出文件（仓库相对） |
| --- | --- | --- | --- |
| 001 | status | 0 | acceptance/20261016-expanded/session-b/logs/001-status.stdout / acceptance/20261016-expanded/session-b/logs/001-status.stderr |
| 002 | check | 0 | acceptance/20261016-expanded/session-b/logs/002-check.stdout / acceptance/20261016-expanded/session-b/logs/002-check.stderr |
| 003 | outline | 0 | acceptance/20261016-expanded/session-b/logs/003-outline.stdout / acceptance/20261016-expanded/session-b/logs/003-outline.stderr |
| 004 | recall | 0 | acceptance/20261016-expanded/session-b/logs/004-recall.stdout / acceptance/20261016-expanded/session-b/logs/004-recall.stderr |
| 005 | recall | 0 | acceptance/20261016-expanded/session-b/logs/005-recall.stdout / acceptance/20261016-expanded/session-b/logs/005-recall.stderr |
| 006 | recall | 0 | acceptance/20261016-expanded/session-b/logs/006-recall.stdout / acceptance/20261016-expanded/session-b/logs/006-recall.stderr |
| 007 | recall | 0 | acceptance/20261016-expanded/session-b/logs/007-recall.stdout / acceptance/20261016-expanded/session-b/logs/007-recall.stderr |
| 008 | recall | 0 | acceptance/20261016-expanded/session-b/logs/008-recall.stdout / acceptance/20261016-expanded/session-b/logs/008-recall.stderr |
| 009 | recall | 0 | acceptance/20261016-expanded/session-b/logs/009-recall.stdout / acceptance/20261016-expanded/session-b/logs/009-recall.stderr |
| 010 | recall | 0 | acceptance/20261016-expanded/session-b/logs/010-recall.stdout / acceptance/20261016-expanded/session-b/logs/010-recall.stderr |
| 011 | recall | 0 | acceptance/20261016-expanded/session-b/logs/011-recall.stdout / acceptance/20261016-expanded/session-b/logs/011-recall.stderr |
| 012 | recall | 0 | acceptance/20261016-expanded/session-b/logs/012-recall.stdout / acceptance/20261016-expanded/session-b/logs/012-recall.stderr |
| 013 | recall | 0 | acceptance/20261016-expanded/session-b/logs/013-recall.stdout / acceptance/20261016-expanded/session-b/logs/013-recall.stderr |
| 014 | recall | 0 | acceptance/20261016-expanded/session-b/logs/014-recall.stdout / acceptance/20261016-expanded/session-b/logs/014-recall.stderr |
| 015 | recall | 0 | acceptance/20261016-expanded/session-b/logs/015-recall.stdout / acceptance/20261016-expanded/session-b/logs/015-recall.stderr |
| 016 | record-template | 0 | acceptance/20261016-expanded/session-b/logs/016-record-template.stdout / acceptance/20261016-expanded/session-b/logs/016-record-template.stderr |
| 017 | plan | 0 | acceptance/20261016-expanded/session-b/logs/017-plan.stdout / acceptance/20261016-expanded/session-b/logs/017-plan.stderr |
| 018 | plan | 0 | acceptance/20261016-expanded/session-b/logs/018-plan.stdout / acceptance/20261016-expanded/session-b/logs/018-plan.stderr |
| 019 | context | 0 | acceptance/20261016-expanded/session-b/logs/019-context.stdout / acceptance/20261016-expanded/session-b/logs/019-context.stderr |
| 020 | record-template | 0 | acceptance/20261016-expanded/session-b/logs/020-record-template.stdout / acceptance/20261016-expanded/session-b/logs/020-record-template.stderr |
| 021 | record | 0 | acceptance/20261016-expanded/session-b/logs/021-record.stdout / acceptance/20261016-expanded/session-b/logs/021-record.stderr |
| 022 | check | 0 | acceptance/20261016-expanded/session-b/logs/022-check.stdout / acceptance/20261016-expanded/session-b/logs/022-check.stderr |
| 023 | plan | 0 | acceptance/20261016-expanded/session-b/logs/023-plan.stdout / acceptance/20261016-expanded/session-b/logs/023-plan.stderr |
| 024 | context | 0 | acceptance/20261016-expanded/session-b/logs/024-context.stdout / acceptance/20261016-expanded/session-b/logs/024-context.stderr |
| 025 | record-template | 0 | acceptance/20261016-expanded/session-b/logs/025-record-template.stdout / acceptance/20261016-expanded/session-b/logs/025-record-template.stderr |
| 026 | record | 0 | acceptance/20261016-expanded/session-b/logs/026-record.stdout / acceptance/20261016-expanded/session-b/logs/026-record.stderr |
| 027 | check | 0 | acceptance/20261016-expanded/session-b/logs/027-check.stdout / acceptance/20261016-expanded/session-b/logs/027-check.stderr |
| 028 | review | 0 | acceptance/20261016-expanded/session-b/logs/028-review.stdout / acceptance/20261016-expanded/session-b/logs/028-review.stderr |
| 029 | check | 0 | acceptance/20261016-expanded/session-b/logs/029-check.stdout / acceptance/20261016-expanded/session-b/logs/029-check.stderr |
| 030 | outline | 0 | acceptance/20261016-expanded/session-b/logs/030-outline.stdout / acceptance/20261016-expanded/session-b/logs/030-outline.stderr |
| 031 | recall | 0 | acceptance/20261016-expanded/session-b/logs/031-recall.stdout / acceptance/20261016-expanded/session-b/logs/031-recall.stderr |
| 032 | recall | 0 | acceptance/20261016-expanded/session-b/logs/032-recall.stdout / acceptance/20261016-expanded/session-b/logs/032-recall.stderr |
| 033 | recall | 0 | acceptance/20261016-expanded/session-b/logs/033-recall.stdout / acceptance/20261016-expanded/session-b/logs/033-recall.stderr |
| 034 | recall | 0 | acceptance/20261016-expanded/session-b/logs/034-recall.stdout / acceptance/20261016-expanded/session-b/logs/034-recall.stderr |
| 035 | plan | 0 | acceptance/20261016-expanded/session-b/logs/035-plan.stdout / acceptance/20261016-expanded/session-b/logs/035-plan.stderr |
| 036 | context | 0 | acceptance/20261016-expanded/session-b/logs/036-context.stdout / acceptance/20261016-expanded/session-b/logs/036-context.stderr |
| 037 | record-template | 0 | acceptance/20261016-expanded/session-b/logs/037-record-template.stdout / acceptance/20261016-expanded/session-b/logs/037-record-template.stderr |
| 038 | record | 0 | acceptance/20261016-expanded/session-b/logs/038-record.stdout / acceptance/20261016-expanded/session-b/logs/038-record.stderr |
| 039 | check | 0 | acceptance/20261016-expanded/session-b/logs/039-check.stdout / acceptance/20261016-expanded/session-b/logs/039-check.stderr |
| 040 | plan | 0 | acceptance/20261016-expanded/session-b/logs/040-plan.stdout / acceptance/20261016-expanded/session-b/logs/040-plan.stderr |
| 041 | context | 0 | acceptance/20261016-expanded/session-b/logs/041-context.stdout / acceptance/20261016-expanded/session-b/logs/041-context.stderr |
| 042 | record-template | 0 | acceptance/20261016-expanded/session-b/logs/042-record-template.stdout / acceptance/20261016-expanded/session-b/logs/042-record-template.stderr |
| 043 | record | 0 | acceptance/20261016-expanded/session-b/logs/043-record.stdout / acceptance/20261016-expanded/session-b/logs/043-record.stderr |
| 044 | check | 0 | acceptance/20261016-expanded/session-b/logs/044-check.stdout / acceptance/20261016-expanded/session-b/logs/044-check.stderr |
| 045 | export | 0 | acceptance/20261016-expanded/session-b/logs/045-export.stdout / acceptance/20261016-expanded/session-b/logs/045-export.stderr |
| 046 | review | 0 | acceptance/20261016-expanded/session-b/logs/046-review.stdout / acceptance/20261016-expanded/session-b/logs/046-review.stderr |
| 047 | status | 0 | acceptance/20261016-expanded/session-b/logs/047-status.stdout / acceptance/20261016-expanded/session-b/logs/047-status.stderr |
| 048 | check | 0 | acceptance/20261016-expanded/session-b/logs/048-check.stdout / acceptance/20261016-expanded/session-b/logs/048-check.stderr |
| 049 | doctor | 0 | acceptance/20261016-expanded/session-b/logs/049-doctor.stdout / acceptance/20261016-expanded/session-b/logs/049-doctor.stderr |
| 050 | export | 0 | acceptance/20261016-expanded/session-b/logs/050-export.stdout / acceptance/20261016-expanded/session-b/logs/050-export.stderr |
