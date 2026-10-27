# 跨章参考证据与已有实际修复的补登记

当前状态：已实现并完成固定包完整回归、原生C同会话补登记和verify；随后D46—48已在该实现上完成。六组针对性接口测试及最终224项回归（222通过、0失败、2项Windows符号链接权限跳过）通过；source/package doctor通过。实际C验证见ack-final-root-verification.json、runtime-resume-c-ack-verification.json和交接-C补登记完成.md。原代理deferred事件、实际45章commit、42/43只读参考证据均保留；此次接受明确发生在修复之后。来源是C轮真实操作，不把接口测试当作创作实跑验收。下文保留设计和当时的验收顺序；E/F整体长篇验证仍在执行。

## 复现证据

C窗口40—45实读49页，确认45把42的“饭盒＋浅碟”写为“两只空盒”。意见保留42/43/45引文（43有“碟好拿”承接）；C授权修43—45。`review-issues resolve adopted`按全部证据章检查42—45，正确拒绝越出这次有限范围。普通45—45独立修订仍合法，产生真实修稿、追踪和复核，但原意见没有成功采纳，旧apply既要求事前basis又要求所有证据章落在修订scope，无法据实补登记该修复。最终交接将该意见由代理deferred交根，未声称作者延期或已verified。

保留保守resolve/apply原行为，不删除42证据，不用作者原话绕过代理范围，也不重造一次错误再修来满足闭环。

## 最小实现

新增主作品命令`review-issues acknowledge`，表达**现在接受已经实际发生的修复**，不是追认事前采纳。输入CAS、唯一operation_id、意见id、真实commit_id、显式target_units、理由、`decision_actor=agent-within-authorized-scope`和当前authorization绑定。

- 仅open，或只有代理延期且无任何既有采纳历史的high-confidence correctness/continuity问题；拒绝已采用、作者保留/延期、可选润色和分支内部调用。代理延期原事件保留。首版open-only中间包未安装，真实C交接表明需纳入这种代理延期；旧包和测试继续保留，最终使用修正后的新包。
- targets严格递增、非空、每项来自原意见证据；代理修订授权覆盖targets；不把只读参考章转成可改范围。
- 从真实publication归档核原意见的全部旧正文/依赖，与事务before逐项一致。targets均在修订scope内且正文确有变化，当前正文/依赖须与事务after一致。非target参考章在before/after/current完全不变；不承认未登记、伪造、无实改、当前又改过的稿。
- 使用新事件记录当前接受、实际旧/新SHA、全部参考上下文、事务与源审查；显式`phase=after-actual-repair`、`prior_adoption_recorded=false`。应用后为applied，仍须现有verify用覆盖全部原证据章的当前有效实读报告复核，不能直接verified。
- 老resolve/apply/verify语义、CAS、作者取舍、候选局部凭据和范围限制不改；不扩展到tracking-only补登记。

## 验收

合成接口用例覆盖：跨章参考1/目标2、只授权2、先实际提交2再acknowledge/verify成功；修前报告/事务哈希/现状严格匹配；重复ID幂等、冲突/CAS拒绝；坏targets、无授权、可选风格/已有作者选择、无实改、错事务、修改后又漂移均拒绝且state与objects不变；分支内调用拒绝；原流程回归。

实际顺序已完成：最终包完整npm test与source/package doctor→C全部退出→正式更新独立测试副本→同C会话实际补登记并verify→D46—48。原失败、修复发生时间和所有原证据保留。E多处旧章和F全书验证为后续整体流程，当前进度见README.md。真实作品与AB封存包不变。
