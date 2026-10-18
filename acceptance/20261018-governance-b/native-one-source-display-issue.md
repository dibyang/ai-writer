# B-NATIVE-01：source list 的未发布提示含义不清

观察性质：可重复的显示语义问题，未造成数据漂移或阻断本轮；未修改源码，交主会话判断和修复。

前提：本作品 RULES_V1 已从1发布；六章均真实消费并绑定 v1。随后 RULES_V2_FROM7 通过真实 freeze、mode=future/from=7 的 impact、实读报告和 publish 发布。活动入口内容等于 v2 冻结对象。

最小复现只需读取现有作品：

```powershell
node acceptance/20261018-governance-b/capture.mjs native-one-repro-source-six node bin/ai-writer.mjs source list --project "D:/work/other/ai-writer/acceptance/20261018-governance-b/works/铜桥来信" --unit 6
```

该标签尚未调用；如复跑需采用未用唯一标签，避免覆盖证据。已执行的等价命令证据是 commands/native-one-source-current-six/{result.json,stdout.raw.txt}。

预期：指出当前查询6章选v1、活动入口是已发布的7章未来v2；不把它称为“未发布”。

实际：区间表正确为 RULES_V1:1–6，RULES_V2_FROM7:7–null；pending_edits 仍返回 ref=设定/权威规则.md、live_sha256=ec5021cc8a213492a094d051b950b4ef2a9700ef07e39824c5f6efa4c1c3c73f、selected_version=RULES_V1、status=editing-entry-only-not-published。同一时点 --unit 7 的 pending_edits=[]。字节确实已作为未来版本发布，提示容易被误解成仍需再发布或改回入口。

准确准备输入：native-one-inputs/freeze-rules-future.json、impact-rules-future.json、publish-rules-future.json；产品原输入副本也分别在对应 commands/native-one-*/input.raw.json，freeze/impact/publish 输出全文未改。六章旧输入和新旧版本实读报告、完整保留比较为 native-one-future-preservation.json，all_preserved=true。check 无 findings。

建议主会话区分“活动入口不同于所查询历史版本”与“入口尚未发布”，不以未来标签推断语义无影响。此处仅记录问题，不实现修复、不为通过验证改变活动入口或状态。
