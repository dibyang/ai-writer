# F轮跨会话修订C：恢复原分支，78–92重登

盘点经验：B发现历史evidence按append累计后索引已变，54原句在index10而非1，硬编码索引会多报。盘点用稳定条目ID、引用unit/quote及实际字节定位，保留原数组顺序与历史，不为让审计通过重排/删旧引用；先读B勘误及有效审计版本。

承接A实际发现：58派生characters曾误写顾亲见移动盘掉落，现已澄清为沈叫后才来、瞬间由沈说明；O_LEAD_DROP_58原观察不变。继续核后续旧replay不要重引该错误，也不把到场见外观与亲见跌落混淆。按真实原文逐章判断，必要输入澄清另列，不全局改历史或虚补新知情。

先读本campaign REQUEST.md/COVERAGE.md/source-build-v2.json、revise-b/handoff.md/json和实际报告、revise-a创建凭据、docs/revision-and-sources.md与docs/review-and-registration.md，按writer-project/writer-review/writer-novel及连续性参考恢复。仅F work与原独立workspace可写，记录revise-c。真实作品、源百章、A—E档案、主源码、冻结包只读。不git提交/推送/启动代理或其他会话。

产品CLI全部统一session-support捕获，root session('revise-c')用embedded，branch session('revise-c-branch',{project:原workspace,token:原token})用main。实际root status/revision list、revision resume原id/token，核原base_revision/workspace/build不变，主稿state及106篇正文全过程原字节相同；branch doctor/status/check及上下文核仅48–106修订。

完整实读73–77五章承接，再逐章完整实读78–92、context、revision replay-input、实际核摘要/characters/timeline/ledger/evidence/downstream，填写真实逐章报告与replay_review当前正文SHA及精确六项checked_fields；先record-preview再record。保持原观察/author_truth/statement，证据不变则原样复用增量账本，确有引文变化才据正文修正。不可循环自动填语义通过、不可手改state或全snapshot。邱27单页、31原两页、罗两页与沈旧/新自页分清，撤回匿名使用的时间和不同人的知情须真实；未到的93–106下游如实待下一会话，末轮将全文复核整个48–106。

到92停止，不登记93，不prepare/commit，不改治理/配置。可登记本段实际范围review，历史stale保留。handoff.md/json保留id/token/base/currentrootrevision、branchrevision/stateSHA/build、已重登48–92与本轮78–92/复读73–77的区别、知情/物件/未知/失败/待93–106。每60秒内报告进度/耗时/检查点，预计12–20分钟。若工具可复现错误报主任务，不改冻结包、不绕过。
