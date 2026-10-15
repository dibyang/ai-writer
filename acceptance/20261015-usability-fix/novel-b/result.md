# novel-b：雨后失物恢复、续写与去味结果

本次授权范围已完成：按文件恢复作品、正式重定位两章原文件来源、完整实读并登记第二章旧稿基线、依原有分卷续写第三章、三章去味与连读复核、重新登记、登记滚动审查及导出。当前为 **revision 12，已登记1—3章的草稿**，不是作者定稿或发布。

## 交付物

- [最终三章合并稿](export/manuscript.md)，已实际完整读回64行。
- [导出清单](export/manifest.json)，included_units=[1,2,3]，excluded_drafts=[]，warnings=[]。
- [最终去味与连读报告](../works/雨后失物/审查/1-3-去味与连读-20261015-final.md)，已保存并完整读回77行，包含9处改前改后、候选保留、四项语言测试、角色知情、物件交接与未覆盖项。
- [修改前诊断](../works/雨后失物/审查/去味-1-3-修改前诊断-20261015.md)、[第二章基线实读](../works/雨后失物/审查/第二章-本会话基线实读-20261015.md)。旧报告只支持其原哈希，不自动支持修订稿。
- [57次真实CLI记录索引](cli-index.md)：每次均留json元数据和原始stdout/stderr文本；包括失败的初次import-status，没有重写成成功结果。
- [逐行改动全集](full-diff.json)、[版本与保护文件核验](version-verification.json)、[来源及导出核验](delivery-audit.json)、[随附工具模块核对](bundled-parity.json)。

## 文件恢复与基线

从当前 ai-writer 根目录执行所有命令；所有支持作品参数的实际工具命令都显式传 `--project acceptance/20261015-usability-fix/works/雨后失物`。未读取 novel-a 聊天事件或结果报告替代正文，也未启动代理。

初始status（cli/001）为revision2、next_unit2，第一章已登记；正文/0002-导入.md是未登记旧稿，不是可自动合并或删除的垃圾。import-status（002）实际exit1，phase=blocked、can_continue=false，旧fixtures/original路径失效。已先查import-relink帮助（003），再对两章使用同内容的relocated映射（006），生成独立 import-locations.json，location_revision=1，保留旧→新路径历史。**没有将文件搬回旧目录，没有修改fixtures，没有手改import.json或state。**

重定位后import-status（007）为ready、无blockers，原文件与冻结副本均同哈希。import-next（008）复用第二章原字节。完整读第一章18行、第二章18行，读取定位、文风、权威规则、角色卡与原V1契约后，反推第二章细纲、读取context、取得模板并登记（010—013）。第二章登记时正文仍为原哈希616fbc76…；import-status（014）显示complete、baseline_registered_through=2，unchanged_baseline_units=[1,2]。先完成基线，之后才进入第三章续写和专项修改。

第二章实际内容：柜内是黑线蓝袋；许棠以白线五针和扎手结痂拒认；另一页补记“三路车，蓝袋，送调度室”，经手仅“何”字，缺签收时间；周叔拨电话、放号码牌，未明写接通；许棠未拿错袋，错袋回原柜扣门。没有从旧摘要、规划或历史验收报告猜第二章。

原V1雨后核验、A1第1—2章、A2第3章结构保留。原设定/章纲/卷纲中的“本阶段不写第三章、不润色”等为旧建档阶段说明，本次明确授权优先；这些已消费资料保持原字节，当前实际进度以CLI状态和本次报告为准，不把其中第一章角色状态或计划当作当前实况。未因整理旧阶段文字引入来源漂移。

## 第三章与实际修订

第三章《盒盖里面》最终 **300个汉字**，计正文Unicode Han字符，不含标题、标点及空白。调度室接通→周叔陪同→外部五针白线吻合→许棠主动先说饭盒盖内“棠”字→取盒开盖、双方实看→复盖装袋→签名后接袋→门口拨父亲号码，电话仍响。取回过程由行动兑现；未将接电话的人认作“何”，未补原签收时间、父亲病情/位置或改口缘由。

三章原字节备份先于改动，位于作品审查目录，未混入正文。修改前修订号4，先正式rewind from1→revision5，保留正文与旧状态备份，再逐章取context/写前模板、修改、实读、重登至6/7/8。字数复核发现第三章仅288汉字，按正式from3回退至9、重登至10，写清已有的左下角与照片对应后达到300字。状态核对再发现O004人物知情仍停在第二章，正式from3回退至11、重登至12，同步当前物件说明和角色知情，正文哈希保持不变。两次局部回退均保留前两章登记；未直接改追踪JSON。

实际改动共9处：

1. 第一章3行去“缓缓开口”，保留首次呼吸及原话。
2. 第一章5行去第二次重复呼吸，保留展示照片及后面的完整辨认依据。
3. 第一章7行收紧双微表情模板，保留周叔复杂神情、笑、翻册与安慰，不解释原因。
4. 第一章9行合并重复焦虑，保留着急、袋在此车丢及未找到；饭盒与父亲两次交代原样。
5. 第一章17行去未完成核验时的信任主题结论与后续预告，保留收回手机，不增新情节。
6. 第二章11行收紧两人同构动作与空气/时间双比喻，保留再查、双方看另一页、许棠吸气与沉默。
7. 第二章17行去“人生课”空泛结论，未拿错袋、回柜扣门逐字保留。
8. 第三章7行把已有白线五针观察明确到左下角并与照片相符，无新事实、数字或动作。
9. 第三章13行合并两次视觉落点，开盖、字的位置与周叔看见均保留。

确认的主要问题是重复解释、连续模板风险和收尾空转；第三章视线句属局部收紧偏好。没有虚构语法硬伤，没有按固定删字率修改。具体原句、改句及阅读代价全部见最终报告和full-diff.json。

候选扫描原稿为9/4/0项，最终为2/0/0项。保留第一章“深吸一口气”和“不是黑袋，而是蓝袋”，分别服务开口前停顿与照片辨认；第二章“不是这个”“没记错”、五针白线、扎手结痂都服务拒领，不为清零删改。保留饭盒/父亲原句、周叔的复杂神情与安慰/怀疑/再查/拿伞提醒、第三章“没有再往后退”、坠手换手和电话响声。这些是人物与叙事资产，不是见词就删。

## 原稿与修订稿哈希

| 章 | 原稿/备份 SHA-256 | 最终正文 SHA-256 | 汉字前→后 |
| --- | --- | --- | --- |
| 1 | `992c03096d803bbfe6937385fd13a697713076c6ecc8e9ce3a9451dae1f9e83f` | `907fd552ba6ed8509522c123a01e40137c6f3553e3a32f145d512d93e403f186` | 335→246 |
| 2 | `616fbc76d16d5ae921d7f7d6abb3d16e1cdc6dcaf63c3110de806ec49ee25e47` | `c291518d613393ea2e49ca48157575fa6e469ecee9e47551bbe8eb60e63abc52` | 267→206 |
| 3 | `cdafb22de7f0a6688e5a35fb2db742391303ea07d32d26ee158cbbf3eef54f9a` | `183f060acc8f1d0722473251cd159eaf6ddfbde06e2fcbd3b74676ef5bfdb6da` | 292→300 |

备份路径依次为 `审查/去味-0001-992c0309-before.md`、`审查/去味-0002-616fbc76-before.md`、`审查/去味-0003-cdafb22d-before.md`。两章fixtures原件=冻结副本=before备份，均由脚本重算确认。import.json始终为 `2420c70f962d6dd7f2a4d2f42b53f99530e21ecd69fe75b2cf71f3b3bbd24c1e`，重定位历史绑定同一清单。

合并稿SHA-256：`d71b8d93dfeab356815c069fe2bb1645e06ec944f2837d65163a9caddee478cc`。

导出manifest SHA-256：`5f0ab8f21f9fb692120bd9f16eb267a8d6ad04de326ce62c7eb9e87bbd4e2d9f`。

最终审查报告SHA-256：`2e0b477c971c370c13e5b88bc12f47ce56d176d156d3663e2bddd70bcbddb066`。

## 状态、来源和导出核对

- 最终status（055）：revision12、next_unit4、registered_count3；unregistered=[]、unsafe_entries=[]、stale_units=[]、changed_sources=[]。没有第四章正文；第四章没有细纲，未擅自继续。
- review（052）登记实际1—3章，kind=model-self-review。check（053）exit0，findings=[]；rolling_review.valid=1、stale=0、pending_windows=[]。review不增加正文修订号，最终仍12。
- export（054）exit0，为draft-export；包含且只包含1、2、3，排除正文候选为空。原稿备份、冻结来源、审查报告位于正文之外，本来就不在合并范围；未把这些档案当缺失章节，也未删除它们。
- 实际完整读回合并稿，且脚本确认它与三章当前正文按登记顺序用分隔线合并完全一致，清单中的三章正文哈希全部吻合。
- 清单消费的34项非state来源哈希与磁盘全部吻合；写前state哈希是对应登记时的历史快照，不拿它与当前state作错误等值比较。CLI另确认无changed_sources。
- 最终import-status（056）：complete、blockers=[]、registered_units=[1,2]、unread_or_unregistered=[]、baseline_registered_through2、changed_originals=[]、changed_copies=[]。因已授权修订，unchanged_baseline_units=[]，不能把当前前两章称为未改旧稿；原始基线由冻结副本、before与原登记证据保留。phase complete时can_continue=false表示导入已结束，并非仍被阻断。
- P001蓝袋和P002饭盒当前均由许棠持有；P003黑线错袋留原柜。第三章先说明隐蔽标记、再开盖、再签名交袋；完整章内交接链由原文证据记录。O004当前角色知情已更新；补记何字、缺签收时间等observation statement不改。T003取回已兑现；T001入库对应链保留partial，T002父亲缘由保留pending，不伪造结案。

## 工具问题、边界与未覆盖项

本次未发现新的阻断性产品缺陷。初次import-status的exit1是路径缺失保护的真实结果，已按帮助用同哈希重定位解决，未删证据。57条产品CLI记录中，仅002为这一预期非零，其余exit0。记录包含绝对cwd、完整argv、UTC起止时间、stdout/stderr和exit。

按用户要求从根目录执行随附工具的doctor --project（004和057）与record --project 路径 --help（005）：0.3.0、Node v24.15.0，doctor errors/warnings均空；record帮助正确给出用法并指向作品内docs。随附bin与help/journal/longform/style/workspace五模块均与当前主项目同SHA-256；未重新复制或修改产品文件。可选引擎标为optional-in-workspace-copy，本任务没有调用引擎。

check仍明确scope=mechanical-only、literary_quality=unreviewed，导出仍quality_review=required；这没有被改成文学通过。另存的实际实读报告与review范围已经保存并有效，CLI字段不等于文学判断。

保护核验覆盖278个枚举文件，包括主项目bin/lib/tests/docs/.agents/vendor、package/LICENSE/README、fixtures、本作品随附工具/技能/手册、import.json和冻结来源，均未改变。清单见protected-before.json，核验见version-verification.json。开工时主项目已有未提交维护改动，未覆盖、还原、提交这些内容；最终git状态见git-status-final.json。实际写入仅本作品、novel-b及必要.tmp辅助脚本；novel-a与其他作品没有读作正文依据，也未修改。未提交、推送、发布、调用付费服务或启动额外代理。

未修改工具，因此未运行npm test/doctor脚本/test:engine等产品开发门；本次执行的是用户场景的真实CLI与文件流程核验，不能升级为产品整体正式验收。文学审查为同一会话知情自检，没有独立盲读、真人朗读、市场验证或AI检测概率。未核实现实公交站的实际制度，未写第4章或后续分卷。父亲电话缘由、何字身份及原缺签收时间仍是有边界的未解信息，后续须回读相应正文再决定，不属于本次未完成的工具修复或强行消除项。
