# 《补帆人》方法实跑交接

作品路径：`D:/work/other/ai-writer/acceptance/20261019-webnovel-reference-j/method-smoke/work`。本目录及其报告只供工具维护隔离实跑，非用户真实作品。本执行没有修改H轮prepared或任何真实作品，没有提交、推送、联网、子代理或协作消息。

已完成：用冻结0.7.7真实CLI建立novel/long；正式保存并跨进程恢复“只讨论规划、discuss/plan、不写正文”的workflow；完成两个不同阶段及前一结果带来的新选择、一次性事件/长篇供给/重复/缩短讨论；只保存近期三章方向；完整阅读并审查A/B/C原样本，最小候选仅写在审查报告。

实际方法：完整读取冻结包writer-project、writer-novel、writer-review三份SKILL；story-development、scene-connections、general-review、natural-language-authenticity、writer-project的long-form、physical-logic-operability六份参考，以及docs/workflow、docs/long-form。实际行范围与哈希见 methods-read.json，没有加载其他题材或商业发布模块。

规划沿用 work/大纲/全书大纲.md、正式卷契约与单元规划，不新增事实权威。D_AUTHOR_DIRECTION只确认用户原话已有的试验方向；D_STAGE_CANDIDATES仍为candidate、采纳项为空。新人物名、视角、两阶段做法、卷界及短中篇备选不代表作者新决定；产权、师傅状况、经济模型和终局不补定。下一卷兑现仍是计划，未登记任何完成事实。

原文保留：work/研究/原创测试段落-A.txt、B.txt、C.txt均按请求字节保存后只读，最终哈希一致。A报告指出伤情限制未接住并给请人搬的候选；B缺接人结果，候选留待确定，不假定已接到；C没有确定问题，保留合作对白与余韵。详见 work/审查/原创测试段落-20261019.md。未改原样本，未在正文目录或聊天写章稿。

正式恢复状态：schema6、long、revision3、stage=structure；allowed_actions=[discuss,plan]，draft_range=null、revise_range=null。零章、正文目录为空、未登记稿为空、无人物事件/时间线/账本、无活跃修订与漂移。不要因next_unit=1或已有三章规划开始写作。

门禁证据：context --purpose draft --unit 1 与 record-template --unit 1 均被ACTION_OUT_OF_SCOPE拒绝，CLI真实退出码2。原始输出各在evidence/deny-draft-context、evidence/deny-record-template。拒绝前后143个作品文件一致，state哈希为a2def0991073dac2e46412e068bb09695931a17c928adee166faacd9ce5d279e。check明确机械范围、零章、文学未审；doctor在本作品通过。命令清单见commands.md。

需要保留的异常：本次范围快照观察到phase外10个既有文件变化与337个新增文件，不能声称共享工作区不变。v1审计与核验失败证据未覆盖；v2单独证明冻结0.7.7包63个文件未变，有限隔离断言通过。详见audit-failure-note.md、boundary-comparison.json及verification.json。本执行没有写那些外部路径，不回滚或推断外部修改者。

后续只能在实际新任务范围内继续discussion/plan；新正文必须有新的明确授权并正式登记有限范围。若仅恢复本实跑，从ai-writer根目录使用下面入口读取，不用当前主树替换冻结包：

```powershell
node acceptance/20261019-webnovel-reference-j/sources/package-0.7.7/bin/ai-writer.mjs status --project acceptance/20261019-webnovel-reference-j/method-smoke/work
node acceptance/20261019-webnovel-reference-j/sources/package-0.7.7/bin/ai-writer.mjs workflow show --project acceptance/20261019-webnovel-reference-j/method-smoke/work
node acceptance/20261019-webnovel-reference-j/sources/package-0.7.7/bin/ai-writer.mjs context --project acceptance/20261019-webnovel-reference-j/method-smoke/work --purpose discussion
```

未证明：全章文学通过、真人盲读、市场接受、百章供给、真实行业操作、下一卷兑现、主产品全量验收或可发布。完整报告见REPORT.md；不把文件存在或机械绿灯升级为作者采纳与事实完成。
