# V 最新根检查点：B 完成，C 已启动

这份检查点较orchestration-mid-b.md更新。全部12章/5卷及C修订、F全文/暂停/导出/完整记录/封存目标仍未完成，不得提前结项。用户未授权Git提交/推送，不动现有作品、U/T、.idea，不派协作子代理。

B首停codex-b-first已正常退出0，1540192ms，实际启动11:31:05.215UTC，thread 01a15914-4efd-7c72-94b4-c4ceabe4ada9；same B恢复codex-b-resume正常退出0，1865059ms，11:57:11.987UTC启动，真实stdin prompt-b-resume-v3.md。r45、9章41452正文汉字；7=3651、8=3611、9=5436。交接-B完成.md为当前入口。第9首稿/早期片段保留，修后v2登记。当前5份未登记旧稿（1/2/6v1/8v1/9v1）不删不混入导出。

B实际复核1—6、7—8、7—9及4—9完整滚动窗口。根提示原漏列4—9，实际check如实发现，B重新全文顺读补报告，最终pending=[]、stale_without_current_coverage=0；b-rolling-window-note.md留历史及当前补全说明，不称产品错误。一次交接辅助脚本字段名错误实际非0，修新版本后通过，state不变，旧双流保留。B恢复产品CLI无非0。根parent-b-first、parent-b-resume(v3检查点)、parent-b-prefix-verification.json均通过：第1—6在B首停/恢复同字节同登记，B恢复前8同字节同登记；观察三字段及最终源码/包/ZIP不变。不要重跑这些wx文件输出。

当前唯一正在跑 **codex-c-first**，outer exec session **43351**，实际stdin **prompt-c-first-v4.md**，实际新thread **01a15949-9318-7cf0-b097-221f6e21d981**，约12:29UTC启动。run-long.mjs限2小时异步，≤45秒轮询，用户≤60秒更新。progress.mjs查看。C阶段预计70—100分钟（3长章+跨卷回收+正式修订区7首停）。C恢复以后仍用prompt-c-resume-v4.md，同实际thread；最终新鲜F用prompt-f-v3.md。C v4已加实际滚动窗口要求，尤其7—12报告不自动包含4—9；未运行版本的补充不改历史实际stdin。

当前修后包仍ab14a65f…、generation1，ZIP542a2db0…，源码自10:46冻结，source/package各199总197通过0失败2Windows链接权限skip，engine29通过、doctor两处通过。build-tracking-verification及parent-upgrade-close-verification已成功；A旧真实commit tracking闭环verified，不能当旧am阻断仍当前。新验收脚本只V内，不能修改产品/手册/CI脱离包。

后续必须做：
1. C首停正常退出后verify-checkpoint-v3 c-first(主12)；guard-probe occupied(主plan13实际2 REVISION_OCCUPIED/全W文件同字节)；**capture-pre-revision.mjs**保存主12所有正文/单位/所有observation三字段，必须在C恢复commit前调用，输出parent-before-c-revision/只建一次。
2. 同Cthread恢复prompt-c-resume-v4，原R ID/token重登8—12/全文/prepare/commit/更新过时任务；v3 c-resume；verify-c-revision.mjs要7/9正文真实改变、1—6单位/正文不变、全部observation三字段不变，输出parent-c-revision-verification。
3. 新F prompt-f-v3，当前1—12按章单调顺序、每次FastCtx≤100行，read-boundary pass1 before/after同版本；若硬修复保留旧pass后pass2整12重读。全文报告/当前范围review/暂停仅discuss/null范围/13真实context+template拒绝/导出export-final-current-12。
4. F正常退出→v3 final、verify-native-reading(现核真实返回行+章次单调)、guard-probe final；根实际CLI用run-long保存到commands/parent-final-check、parent-final-revisions、**parent-final-issues**及doctor等。verify-final-state.mjs预期这些确切label，核12章≥53000/五卷范围/三线ledger resolved(只是账本不是语义)/全当前报告/窗口空/无activeR或tx/意见effective verified/导出字节与排除稿。不要称语法检查已通过实际验收。
5. 根U/T seal verify及源码/P/ZIP/HEAD/index核对。最后完整commands+cli-logs库存 **audit-evidence.mjs直接执行，不用V内runner记录它自己，否则自身目录未结束会被列incomplete**。解析全部9次原生/4thread及全部失败/通知/文件变更。创建failure-dispositions.json.complete=true，captured_nonzero_names精确列audit.nonzero.name，native_failed_item_keys精确列audit.native失败name+'/'+id，并对每项分类解释。close-verification.mjs要求这些集合一致/全部9次正常/线程配对正确/所有阶段证明ok，写verification.json scope windows-local-upgraded-twelve-chapter-flow/complete true/12章/非正式发布。
6. README最终真实结果/完整证据入口/暂缓范围，根收尾记录；**seal-evidence.mjs seal直接调用，不能V内runner录自身后续流**。回执写V外，封存后不得再改V内文件。verify seal回执亦V外。U/T只读核封存，不运行它们旧source-bound脚本去假称新版通过。

新增尚未执行的验收辅助均已node --check，不等于通过：capture-pre-revision、verify-c-revision、verify-final-state、audit-evidence、close-verification、seal-evidence。verify-budget-diagnostic已执行ok（1000预算实际需21680、2码/同state/完整context成功），verify-b-prefix已执行ok。真实命令回执以commands和cli-logs为准，root日常progress/gitshell工具输出不全部在库存，不冒称库存是操作系统全进程审计。A首个大写标签拒绝只有原生聚合流，独立重现不冒原始流，完整审计须披露这个边界。

Git仍0c6d27ab；本轮V和前轮U均未提交，.idea保留。源码相对U11文件变化，总工作树另含U未提交内容（不要仅stage11而漏用户后续提交要求）。无远端CI/Linux/macOS/Node20实跑，无真人盲读/市场；0.9.0开发中未发布。本轮12章不是百章，新包是先6旧包、正式更新再7—12/全文最终复核，不称新包从零写12。记得最终memory引用MEMORY.md:230及01a14352-7ed0-7ce0-b512-67b16aa8ceea（机械≠文学）。
