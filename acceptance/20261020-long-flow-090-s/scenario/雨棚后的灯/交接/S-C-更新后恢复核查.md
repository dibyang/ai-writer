# S-C 更新后恢复核查（第13章续段前）

2026-10-20。当前仅在 S 独立样例写入。先读 execution-guide.md，真实执行当前随附 CLI status，实读 S-C 中断交接、part-01/02、S-R3 当前入口、delivery-current.json、current-tool-update-verification.json 及 r3-equivalence-verification.json，再取新 context/模板并实读。此报告在补写 part-03 以前保存。

## 真实当前入口

作品：D:/work/other/ai-writer/acceptance/20261020-long-flow-090-s/scenario/雨棚后的灯。

当前主作品 r38、schema6、已登1—12、next=13、trial；stale/changed/impact 均空。R3 session 34d109f3-5e8e-41ef-a3d1-df4d2726abb6 已 committed、事务435aa030-8391-424a-a069-97c8a2f94c26 completed，不恢复旧修订会话。

generation由2到3；同号0.9.0的实际内容ID由2fccbf8acb1b68c91733fbbcea5ece952384b2a5131624a57202ea97b1f7664e变为730a9e3eaffd691e1ef902722513ba548821ce9f077b35a4ff43bb52e0dbfecc。实际 tool identify 捕获 c-tool-identify-after-update 的 observed/declared均为新ID，runtime_id=5010447287bb52f84ef0f76405c20d1cc87dff4bab45a3cb7138eb504894a2f2，missing/mismatches=[]。不用版本号或更新时r35代替当前r38。

本轮接住原C线程的磁盘停笔点；真实 exec resume 的进程证据由外层原生日志记录，本报告和普通 Node 调用不冒充该进程证据，不另启动代理。

## 已在续写前取得并实读

- commands/c-workflow-after-update：真实 workflow show；stage/task/授权/stop_conditions与旧context的governance深度相等。本轮实际只完成13—15，不写16，不更改workflow。
- .writer/drafts/s-context-13-after-update.json：r38，SHA256 068f17e408fd07972efa5cd54409a04685266d18acf594c227bf6dc34acf3ac2；实读1—320、321—749。
- .writer/drafts/s-record-13-after-update.json：expected_revision=38，SHA256 b5038be148868a87370f95af19b7b7f9f5e24335254dc127cae035d053de29c4。真实新label c-template-13-after-update；context同样用新label c-context-13-after-update。
- 原 s-record-13.json仍为expected_revision=34，SHA256 d99f99329a40951fd75d5c8844582ad5eb41b959928639208d81f4f007ca1c1d。原 s-context-13.json SHA256 903c89d0286a1e138708afb123a9fd07fe06c98bed6793252694cd531670eb4c。两者原字节保留，未替换其中哈希，也未重复flow prepare 13。

模板source_hashes的9个来源中，只有.writer/state.json变化：80ad0556a1eb6ab10b557803a96d92e6220c49cb528875c97d39668730f9cb3a → d08300f4295836c7237e48da2f73a662299d13792d8750e970db1e36339c515c。writer.json、13章纲、四份设定/骨架、V5、12正文全部同哈希。旧模板确已过期，不能把revision或哈希手改成当前值。

## 事实等价与原稿适用性

c-resume-source-comparison-retry1.json保存逐路径比较。实际1—12正文与delivery-current逐项SHA完全一致。比较旧template-13捕获的r34完整state和当前state：snapshot、governance深度相等，snapshot_diffs=[]、governance_diffs=[]。新旧context的plan/settings/snapshot/recent/previous_ending/outline/continuity/governance/source_bindings逐项深度相等。工具事务、R3等价重登和r号前进不表示新增故事事件。

本次恢复完整实读正文/0012.md（1—126），并回读正文/0009.md 50—155行，核陈未见箱内、未看周家片及暂留稿边界。前轮完整实读1/4/6/7/9—12的范围、SHA见S-C中断交接；本次不把这些前轮覆盖冒称新的全文连读。稍后还要执行最终10—15连续实读。

part-01完整实读1—75，SHA256 1bf875911e1950ffb0f3608ab1300402484a642bcfba75644919c5a875d4df19，1675 Han；part-02完整实读1—69，SHA256 b41d23d3ce9f3fcfe950010fa7cf5ff8bb23e6142a72f4eb838ba63f02458658，1704 Han。均与中断交接、更新凭据、R3入口相同，原两段适用，保持原字节不重写。

12章实际停在第十二日午后，原物未取；未登13两段才写到第十三日，许经工作答复及实际通知到场，陈经车程/电话/楼梯到场，四人同处周家。周亲自取套并放桌，末尾仍合着；信仍柜中。此时不将未登段稿倒填进已登12的snapshot。新见纸套外观从13现场开始，9章的未见箱内及未看原片不改变；原节目单三格及旧字迹也不改变。

## 一次失败及处理

首次比较脚本用JSON.stringify检查完整snapshot相等，assert.ok(equality.snapshot&&equality.governance)退出码1；断言发生于写比较JSON之前，所以c-resume-source-comparison.json没有生成。真实tool identify此前已经成功，未重跑/覆盖该wx label。随后另名retry1按递归字段及isDeepStrictEqual比较，确认snapshot仅对象键顺序不同，值无差异，governance连文本顺序也相同；报告保留此失败，不删除原生工具输出，不修改state来使比较通过。

## 继续范围与新提示处理

现在才接part-03：从周面对合套坐定开始，随后才写真实当面同意、周亲手开、实际取信/读信和收回。只见外观不播放，信文和陈本人的记忆分别说明；原片全史仍保留未知。许只在场实听，何未到场、不新增知情。第一、二段原字节保持。

第13章完成五段并完整回读后，保存真实登记details，再以c-manual-preview-13单独捕获preview。实读related_unchanged_ledger候选，按需逐ID召回原文，保存保留/更新理由后才flow record。14、15同理。新候选只是定位，不自动判错；含明确旧日期的历史知情保留。随后以c-old-template-13-refused捕获旧模板加实际details的真实record拒绝并核state前后相同，再用本次新模板正式flow record 13。

以上核查只支持本轮续段的来源有效性及事实等价，不等于文学验收。

