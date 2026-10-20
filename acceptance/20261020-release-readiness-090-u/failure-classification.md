# U 命令失败与范围归类

最终库存：249份已结束命令、18份非零回执；7次原生启动尝试中6次正常退出，4个独立thread。完整原始双流与实际子进程码保留，下面按已捕获的命令逐项说明。

|记录|分类|处理及结果|
|---|---|---|
|commands/audit-v2-failed|auxiliary|审计器仅识别raw.txt/bin，未识别F的stdout.txt；v4统一流文件名、退出码别名及全部容器。|
|commands/codex-a-first|environment|Codex状态数据库及arg0目录访问失败，尚未生成thread；获批外层权限后成功，内层仍workspace-write。|
|commands/parent-final-no-four|expected-guard|暂停仅讨论后，第4章模板实际退出2 ACTION_OUT_OF_SCOPE，state不变。|
|commands/parent-main-occupied|expected-guard|B进程退出后修订占用仍有效，实际退出2 REVISION_OCCUPIED，state不变且未创建第4章细纲。|
|commands/release-build|environment|PowerShell选择npm.ps1，被系统执行策略拒绝；改用npm.cmd，不改执行策略。|
|commands/report-integrity-before|product-fixed|两个新增故障注入测试先失败：冻结报告损坏漏检、验证至冻结间锁外改动漏检；补校验与冻结前复核，最终194项回归通过。|
|commands/source-tests|environment|npm.ps1执行策略拒绝，未开始产品测试；随后npm.cmd执行。|
|commands/source-tests-cmd|product-diagnostic-fixed|191项188通过/1 Git来源读取失败/2跳过。旧错误未留底层状态，不归因为已证实超时；后补精确诊断及仅瞬时错误一次重试，最终通过。|
|commands/source-tests-final|product-diagnostic-fixed|193项190通过/1 Git来源读取失败/2跳过，同上；最终冻结版本194项通过。|
|commands/source-tests-retry|invalidated-run|运行中源码发生变化，191项155通过/34保护失败/2跳过；TOOL_BUILD_CHANGED等使该轮无效，不能当最终验收或34项独立产品缺陷。|
|commands/verify-final-reading|auxiliary|实际正文全行已返回，但FastCtx末尾空行被算作不匹配；v2仅排除文件真实末尾换行产生的一个空项，全部685正文行逐字匹配。|
|final-commands/final-a-00-preflight|auxiliary|技能入口错误拼到包根writer-essay/SKILL.md；按真实.agents/skills目录修正，不改变产品。|
|final-commands/final-a-18-parts-before-review|test-writing-rework|首段1087汉字未达1100下限，写作自检失败后补足，不降低验收线；首停最终1126。|
|final-commands/final-a-19-parts-after-review|test-writing-rework|第二段1093汉字未达1100下限，补足至首停1215，后续恢复保持两段原字节。|
|final-commands/final-a-47-preview-missing-report|expected-guard|缺失报告的preview实际退出1，DRAFT_REVIEW_INVALID；无state/objects/journal推进。|
|final-commands/final-a-49-record-missing-report|expected-guard|同输入record实际退出2，DRAFT_REVIEW_INVALID；无写入，不把PowerShell外层1当产品实际码。|
|final-f-commands/18-deny-unit4-context|expected-guard|正式paused后第4章context draft实际退出2 ACTION_OUT_OF_SCOPE；状态不变。|
|final-f-commands/19-deny-unit4-template|expected-guard|正式paused后第4章模板实际退出2 ACTION_OUT_OF_SCOPE；状态不变。|

原生事件中8次非零命令与上述负向输入/辅助检查相对应，逐条id、命令、输出SHA见JSON。6条respect_system_proxy开发功能提示属于Codex已有配置，未改全局配置。Codex stderr中的技能/模型刷新警告保留，不能据此误报产品失败或已修复全局环境。

其他记录与边界：

- 仅清点已捕获命令；早期未包装shell/工具调用保留会话及摘要，不能声称每次都有独立双流。
- file_change事件之外的全部shell副作用不能仅靠事件清点证明；作品、冻结源码和T另按字节核验。
- 初期硬链接EPERM、Python别名、WSL查询及Git index.lock权限在早期说明/会话，均不算最终产品通过。
- 源码Git失败底层原因未知；受控ETIMEDOUT/EINTR/EAGAIN测试不是现场超时证明。
- 最终阅读核验v1、审计v2的失败保存；v3库存缺A容器而未作终核，最终v4补齐。
- 根会话两次手工定位错误（F负向目录名、A日志流后缀）均只读未写；FastCtx替换模板引用拒绝未写，改为字符串拼接。
- B审计辅助文件短暂改动后按保护原SHA恢复，修改版本另存；见parent-audit-helper-version-note.json。
- F曾手选旧journal首100行，随后按state当前指针核验；没有把旧对象当当前事实。

- B辅助保护清单误纳入活动日志的原失败保留；修正限定该唯一日志，验证旧内容仍是当前文件的原始前缀，不重置正文或旧文件基线。
- A恢复时FastCtx越界offset警告后按实际范围全文重读；F末尾换行行数与边界脚本相差1是显示差异。均未冒称失败调用已返回完整文件。
- 初测仅两段2341汉字，未登记且不作完整流程；最终作品从最终ZIP全新初始化。
- 源码冻结后全部产品回归、实际ZIP回归及doctor/engine完成，后续仅U辅助证明与本隔离作品变动，没有产品代码变更使最终测试失效。
