# F轮修复切换：0.7.2更新后实际验证百章修订区doctor

用户已授权本轮百章实跑和发现问题直接修复。先读REQUEST.md、COVERAGE.md、read-d/handoff.md/json、source-build-v2.json、本阶段前主任务保留的branch-doctor-before/v2/after记录。原数据只有本campaign/work可写；原百章/A—E、真实作品、主项目源码及冻结源只读。不提交、推送、联网或启动其他代理/会话。

D交接是0.7.1/revision379/generation2。主任务之后复现并修复doctor误将独立修订区视作自带包的问题，现主代码和冻结新源为0.7.2，故交接与执行源码不同是**明确的版本切换**，不能把旧信息强填进新状态。本阶段记录放repair-upgrade，用session-support的session('repair-upgrade')，所有CLI原始输入/输出/状态保留。

原冻结源sources/package仍保留0.7.1；本次更新来源明确为 `D:/work/other/ai-writer/acceptance/20261018-hundred-f/sources/package-v2`，完整内容ID为 `8f406f43e2e1bb3ee1a865fa77b947fecf39c8bed4d29c1fb3e20c8f07f71cc8`。内容ID、runtime_id和loaded/execution build_id是不同指纹口径，不能相互手填替换。使用工具返回值/匹配布尔值。

主任务已新增回归：合法分支doctor复用父包且状态不变；构建绑定不匹配明确失败；父包损坏仍不健康。全套测试若尚在运行，当前只是隔离候选实跑，不能宣称正式发布或最终验收。源码不由本进程修改。

按顺序实际执行：

1. 新进程外部入口status、workflow、doctor、tool identify/check，核100章与D交接，记录当前0.7.1安装包。保存父state原字节及100正文、units、snapshot、source_hashes、根AGENTS/技能/手册的精确基线。
2. 外部主0.7.2入口对work执行update-plan，source指package-v2、documents=[]。用真实用户F原话和实际来源SHA补返回request，显式tool update，不enable、不迁移schema、不覆盖根定制。原输入立刻幂等重试，核只增加一次revision/generation（预计2→3，以实测为准），所有文学数据不变。然后实际新随附入口help、doctor、status、discussion context、check，确认安装包与新源同内容。
3. 在该百章副本临时workflow set为只验证第100章修订区、allowed_actions为discuss/plan/revise、revise_range100–100、draft_range=null，用真实原话并明确这是代理执行范围具体化，不伪称作者选了剧情。revision begin从100到当前末章100，保存ID/令牌/工作区/基线。**不改任何正文，不rewind、不record**。
4. 从外部主0.7.2入口对返回workspace实际运行doctor（创建新的session('repair-upgrade-branch',{project:workspace})，默认main；分支有意没有自带CLI，不能用entry:'embedded'指向分支）。应ok=true，resource_project_root=父work、tool_root=父work/.writer/tool、revision_context正确且build_matches=true。确认workspace/.writer/tool不存在，父/分支state原字节在doctor前后完全一致。不要复制运行包进去。
5. 用错误令牌实际resume，预期REVISION_OWNER_REQUIRED且父/分支state不变；再用真实令牌resume，核仍是原workspace/base_revision，不刷新基线。实际分支status、discussion context、check，验证修复后的新会话恢复诊断与数据可用。这些是实际新CLI进程；不把本进程内调用冒称另一Codex会话。
6. 明确abort此**没有改稿**的诊断候选，保留全部分支/备份。只改协作元数据，不把候选当正式提交。再workflow set回paused、仅discuss/plan、范围null，任务说明本轮切换/诊断已完成，后续101–103留下一实际进程；不写新章。
7. 新随附入口末次doctor/status/check/context，核100正文、完整units/snapshot及原source_hashes、根定制与基线完全相同，文学state仅正常tool_control和governance/revision元数据变化。新源和主项目文件不变，历史stale审查照留。

保存REPORT.md、results.json、handoff.md/json及全部失败。handoff明确0.7.2新构建、当前revision/generation/state SHA、新旧源保留、诊断分支已abort且未改稿、下一阶段draft-e要从本交接恢复，有限101–103再到104–106。不要再按D的379/gen2生成新输入。

最初只读诊断误选了从C复制的旧封存分支，其marker位置不匹配被正确拒绝；第二次选真实D分支才复现ENOENT。这两类不能混成同一产品缺陷。0.7.2读旧D分支仍报告绑定构建不符也是正确保护，不得篡改其元数据。原档案本进程不操作。

发现异常保留现场、报告主任务，不手改state、marker、来源哈希或会话构建。每60秒报告阶段、实际命令数、耗时/预计剩余；预计8–15分钟。
