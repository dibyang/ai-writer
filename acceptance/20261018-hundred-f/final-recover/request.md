# F轮0.7.2保护提交与恢复会话：准备跨会话提交、恢复与草稿导出

阶段变更说明：主任务发现D详细长报告复用普通字符串20k默认上限，将在本0.7.2保护提交完成且你退出后另修0.7.3、重新回归并启动upgrade-final实跑。因此本阶段仍严格使用已冻结0.7.2入口完成准备跨会话commit/恢复/导出/暂停，不改源码/包/手册/构建绑定，不封存，不把本阶段报告称为全任务最终验收。当前基线和候选均须保持原绑定；完整修复计划在report-capacity-fix/PLAN.md，仅作后续说明，非本阶段源码修改许可。

导出路径以CLI真实保护为准：若out只能位于作品内，使用WORK/导出/下本轮新目录或文件，它仍在F campaign内；不要为BASE/draft-export这个建议名称使用../或绕开路径保护。报告列实际路径与manifest，仍只导出草稿106章。

实际语义核查：本轮58派生角色状态曾误记顾亲见移动盘跌落，A按正文/既有O_LEAD_DROP_58澄清为沈叫后到场、瞬间由沈说明。核最终派生状态与后续承接不被旧replay恢复错误；原观察statement/author_truth与正文不因该澄清改变。将此登记修正与四处旧正文改字分开报告。

补充：按findings/parent-101-interim.md及revise-a/D实际记录核101澄清的采用情况。如果101“未买大包出现在柜子”的中间句最终仍存在并在分支实修，正式候选可以是4旧章+该新章的最小差异；不能机械沿用下面原计划“只有四处/六新全不变”。若E已修正则不重复修改。最终报告按真实清单区分4旧章和本轮新章自检修正。

先读本campaign REQUEST.md/COVERAGE.md/source-build-v2.json、revise-d/handoff.md/json及整段报告/prepare结果、前几轮真实交接、docs/revision-and-sources.md与review-and-registration.md。按writer-project/writer-review/writer-novel恢复。仅F work/其原候选及本阶段目录final-recover可写；真实作品/源百章/A—E档案/主源码/冻结包只读。不git提交、不push、不发布、不启动代理或其他会话。

产品命令全部session-support记录，root session('final-recover')用embedded，branch如需 session('final-recover-branch',{project:实际workspace,token})用main。先实际root status/revision list、doctor/identify，核0.7.2/gen3、原base、原candidate已prepared。**不要无必要resume取消准备。** 读准备清单与实际四处diff、106篇路径SHA；核主稿未变，候选只有48/54/66/71各同两块→那两块正文变化，其余原100及新6正文不变；候选replay48–106和完整current review有效。

1. 若准备仍有效，直接root revision commit原id/token；若确实因恢复/候选修改需resume则真实重检并重新prepare，不跳守卫。commit只发布本轮F测试副本，主业务revision仅base+1，candidate的临时head不得覆盖主revision。保存清单和结果。同commit重试应幂等且state字节不再推进，实际测试一次。不把这个提交与git提交混淆。
2. 主稿随附入口实际doctor/status/check/workflow/discussion context/review-issues list，确认106章、4处已发布、当前报告/来源/账本哈希；旧report stale如实保留。若四意见已agent采用，用真实commit_id apply、当前有效覆盖报告verify resolved，绑定原application；若尚未登记意见，不为报表伪造原采用时刻，也不重做假修订。
3. 本进程全文实读98–106并回读实际需要的种子/转折：至少4/19/24声音、27/31纸页、48/54物件、66/76/86椅位（可已有最终版48–106整段报告结合必要全文回查，清楚报本人范围）。核跨卷有限回收仍是真行动：原声未知未被猜成答案，私人页无默认公开，期限椅位不变永久服务；四字改不改变当日事实。保存本进程全文/片段真实范围SHA与模型审查，发现确认事实问题按受保护范围处理，不直接改正式稿。
4. 依F总任务完成事实正式设置workflow paused，仅discuss/plan、draft/revise_range=null。实际请求107的context/record-template，验证暂停范围提示/拒绝与state不变，保留真实结果；不能单因next_unit107就开始写。最后root status/discussion context明确完成106和原未知。
5. export仅草稿至本campaign新的draft-export目录，核导出清单106登记章、无未登记正文混入，标题次序和字数/内容SHA实际对应；保留draft警告，不宣称作者定稿，不外传。用check/doctor收尾。
6. REPORT.md/results.json/handoff.md/json记录实际当前revision/generation/content_id/runtime_id/loaded_id/stateSHA、commit/幂等、106章及4旧/6新实际差异与字数、跨会话恢复/尾段重登/本人复读区别、闭环意见状态、导出清单/警告、命令与全部失败、尚未解决的文学观察/未知。所有计数来自真实命令或字节；不要写“主任务测试未确认”作为最终已验收结论，引用主任务的实际test记录但不越过其最终审计。每60秒内报进度/耗时/检查点，预计12–20分钟。不要封存campaign，父任务还须总审计后封存。
