# V 中途交接：A 正式升级闭环已完成，B 首停运行中

这是较orchestration-after-tracking-fix.md更新的检查点。任务仍为12章/5卷真实Codex扩展、三条跨卷兑现、7/9两项普通事实正式修订并回放7—12、最终新鲜F全文当前稿回读/复核/暂停/负向13/当前12章草稿导出。不能只因6章或补丁完成就结项。无Git提交/推送授权，不动现有作品、封存U/T与.idea，不用协作子代理。

A同一真实thread 01a15880-13ce-7fe0-adf7-78a1110f6bb2 的codex-a-upgrade-close已正常退出0，1113945ms。正式ff6→ab14工具更新/generation1，旧真实追踪修订commit通过新change_scope:tracking完成V_A_U5_TIME_METADATA应用与verify；默认新工具apply仍真实码2拒绝。根parent-a-closure、parent-upgrade-close-verification均成功；6章正文/单位及snapshot与parent-a-repair相同，原根资源保持。最终交接=交接-A追踪闭环完成.md；不是旧“追踪修正完成”的未闭环交接。原1—6整窗报告因metadata修订过期，由B实际连读后补当前1—6范围报告，不绕过哈希。

当前B首停运行=commands/codex-b-first，实际stdin prompt-b-first-v6.md引用v5；thread 01a15914-4efd-7c72-94b4-c4ceabe4ada9，外层exec session60048，约11:29UTC启动。progress.mjs查询，11:47UTC为r37/7章32405正文汉字，7已登记3651字，8正在写；应只7—8首停/no9。三条初始只读漏project真实码2、record-template误带max-chars真实码2、一次辅助组装输入脚本出错均留日志，不据此改产品。完整1—6当前范围报告已注册，check-six-covered过期4条均有当前覆盖、pending空。预算负向7/max1000真实CONTEXT_BUDGET_EXCEEDED，需21680字符，无截断/state前后同，随后完整context成功。根parent-budget-diagnostic-verification.json已核验，命令parent-budget-diagnostic退出0。

当前最终源码/包自10:46UTC后保持冻结，11产品文件相对U变化；ab14a65f…，ZIP542a2db0…，见delivery-current/product-frozen-current。源码/实际解压包全测试各199/197pass/0fail/2Windows链接权限skip，engine29pass，doctor两处通过；build-tracking-verification已有成功历史。不修改产品/手册/CI以免包脱节；本阶段新增仅V验收辅助。

新验收包装器v-writer.mjs在普通命令补显式--project W，再用v-log记录实际argv；修订workspace仍必须显式真实路径/token。recording-project-note.md说明旧log.project仅快照目标、不证明漏project命令针对W。不要改过往stdin/日志。后续实际stdin使用：B同ID恢复prompt-b-resume-v3.md；新鲜C首停prompt-c-first-v4.md；同C恢复prompt-c-resume-v4.md；新鲜F prompt-f-v3.md。它们继承旧提示但当前ab14身份/明确project优先，不要用旧ff6硬编码或回降。

根后续顺序：B首停退出→verify-checkpoint-v3 b-first(8)；B同thread resume完成9→v3 b-resume(9)；新C完成10—12并独立区只重登7首停→v3 c-first(主12)、guard-probe occupied、capture-pre-revision.mjs(主12原字节与全observation三字段，必须在主区commit前调用且不可覆盖)；同C resume重登8—12/实读/prepare/commit/正确停点任务→v3 c-resume、verify-c-revision.mjs；新F当前1—12边界内按章单调完整FastCtx≤100行→报告/复核/暂停/13真实两项拒绝/导出export-final-current-12→v3 final、verify-native-reading、guard-probe final。F阅读脚本现额外核实际章次非递减，跨章返回对照留在after标记之后，不能把返回行覆盖当理解。

新根辅助capture-pre-revision、verify-c-revision、verify-final-state、audit-evidence、seal-evidence已编写但除语法检查外尚未执行，不能称通过。verify-final-state预期commands/parent-final-check及parent-final-revisions，检查全12/≥53000、暂停只discuss、无活跃修订/事务、全窗口当前覆盖、全稿当前SHA+报告冻结、当前导出逐字节重组/排除稿、同代工具等。audit-evidence必须最后调用，库存commands及cli-logs，所有非零逐类说明，9次正常原生/4thread只是目标按真实回执统计。seal-evidence最后才seal，前置verification.json.ok/complete/registered_units12/scope windows-local-upgraded-twelve-chapter-flow/formal_release_acceptance false。seal调用不可通过V内部runner录自身结束流，回执写V目录外；封存后不得再写内部。

README已更新为“当前进行中/修后ab14/6章闭环及B入口”，最终仍需改为真实终态。U/T只读核封存，最后全源码/ZIP/P仍同字节；Git仍HEAD0c6d27ab/保留无关.idea；本轮和U均未提交。无远端CI/Linux/macOS/Node20实跑、无人类盲读/市场验收，不称正式发布。当前模型执行不等于真人验收。
