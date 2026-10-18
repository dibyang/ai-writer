# F轮跨会话修订B：恢复原分支，63–77重登

新增实际回查项：A在58重登报告发现原characters把顾误写成亲见长线轻动导致移动盘掉落；正文是沈叫后顾才来，掉落瞬间由沈说明，原O_LEAD_DROP_58也如此。A仅澄清派生角色状态，正文/原观察statement与author_truth未改。完整复读58–62时核交接；63以后旧replay若又携原“亲见”错误，须据本章原文与真实知情逐章澄清、另列输入修正，不机械恢复错误或全局改旧历史。

新进程没有隐藏前文，先读campaign REQUEST.md、COVERAGE.md、source-build-v2.json、revise-a/handoff.md/json和实际报告、docs/revision-and-sources.md及docs/review-and-registration.md。按writer-project/writer-review/writer-novel及长篇连续性参考执行。唯一可写作品为本轮F work及revise-a建立的原workspace；其他作品、A—E档案、主源码、冻结包只读。不提交git、不推送、不启动代理/其他会话。本阶段记录revise-b。

统一session-support.mjs捕获产品CLI：主稿用session('revise-b')且embedded；分支用session('revise-b-branch',{project:实际原workspace,token:原token})且main入口。实际root status/revision list，真实token resume同一id，验证base_revision、workspace、绑定build不变，不刷新基线、不重建分支；main state及106篇正文在本阶段始终原字节不变。对branch doctor/check/status、当前workflow/恢复上下文，核0.7.2/gen3和仅48–106修订范围。

1. 完整实读58–62五章承接，真实检查上一会话后果、人物知情、物件地点，报告明确其为复读。确认分支已重登到62，四处改字仅候选已做且其他正文未漂移。依据F用户真实授权继续，不冒充作者逐项选择；不得变更分支治理或配置。
2. 逐章完整实读63–77，逐章context、revision replay-input、真实核旧摘要/changes/下游和当前来源，replay_review的六项严格为summary/characters/timeline/ledger/evidence/downstream，report在作品审查/下且真实模型逐章填写。特别66/71改后“那两块”不改变缺口/天气/通行事实或既有author_truth/statement；涉及原引文才按实际正文修正，不机械全局替换历史记录。先record-preview再record。不得脚本循环生成文学结论/自评勾选或手改state，不誊写全snapshot。下游未实读至106如实待后续；末轮仍将完整48–106复核。
3. 到77停止，不重登78，不prepare/commit。可注册实际连读本范围的review，保留历史stale；主稿仍不变。handoff.md/json保留原id/token/base/currentrootrevision、branchrevision/stateSHA/build、实际重登范围、复读/回查清单、人物物证保持项、失败和待78–106。每60秒以内报已重登数、耗时、下一检查点，预计12–20分钟。新工具缺陷只报主任务，不自改包或绕过保护。
