# 父会话检查点01（过程记录，未完成）

用户要求继续0.9.0扩大实跑，暂不改真实作品；无Git提交/推送授权。基线ccffda7a8f8aa5ffa50b7b4298b0c1eadf913420，只有无关.idea原先未跟踪。T路径为acceptance/20261020-long-flow-090-t；主验证小说scenario/雨棚后的灯，从S封存18章的完整新副本续19—30、十个测试分卷。普通新增5000—6500 Han/四段；19与25长章10500—12500/六段。具体后续检查点见planned-checkpoints.md，仍须全部完成才能封存。

已完成：bootstrap复制前后18章snapshot/正文/初始state完全相同，授权CLI设到r55、gen3。原S封存6860文件、147048661字节、manifestSHA037d1285de80907283467e5d7daef549494dc18247926a81a1a996be3e15f057，before verify通过。root源码初始321项，随附包66项，不能混为完整开发包。baseline-frozen-inputs首次误查随附包tests缺失已修脚本，保留失败和before-profile-fix副本；重试按两种清单通过。

首原生客户端A真实thread：01a15654-8bd8-79b1-8f41-10d31671537d，外层commands/codex-a-first，首进程退出0、705996ms。实际完整读当前1/16—18（原始FastCtx覆盖另用verify-native-read证明），19只写前两段并退出，1821+1886=3707 Han，state仍18/r55；checkpoint-a-first.json及a-first-interruption-verification.json通过。预算19四种读法拒绝/精确重试通过，state不变。父实际读两段并核旧1搬砖场景，parent-a-first-two-read.json。用同ID resume启动codex-a-resume（当前PTY24425）；正在写/登19—21及16—21整段复读。已登记19（约10561 Han）和20，r57，21四段候选5038 Han正完整读。19记录报告命令曾PowerShell中文引号导致SyntaxError（item42），客户端改apply_patch文件重试，保留原始失败；非产品缺陷。20/21真实事实以正文为准。21已写借陶平板车：何交20试工订金、50押金，何接管，林承诺故事二十二日18:00前亲还交陶收，陶二十三日早需用；此时未登记21，不假称归还。更新阶段不能覆盖正在运行A的随附包。

初始源码npm test已通过176/175pass/0fail/1symlink-skip（462030ms），source-tests-verification.json绑定初始321源码；这只是修复前基线，不能当最终新代码回归。内置引擎未改。

实际产品漏洞确认与修复：回退到观察首次出现之前，replay能改原观察原字/作者真相/类型或删整条，原prepare仍成功。T/probe-immutable before已真实复现并abort自有小样，没有发布/修改小说；tests/revision-observations.test.mjs六例，旧实现1pass5fail，修后6pass。lib/revisions.mjs增加跨会话原基线observation的type/statement/author_truth比较，prepare、commit及apply complete前保护，rollback不封死。用户指南/快入/修订/复核手册、长篇参考、CHANGELOG/RELEASE_NOTES及release allowlist补齐；共10个产品文件，product-frozen-guarded.json。不得再改这些文件而不重跑最终回归/构建。

真实旧实现遗留事务：probe-immutable legacy在修复前用真实旧代码形成非法观察目标并在transaction-prepared注入exit93，没手改state；修后root CLI recover complete拒绝IMMUTABLE_OBSERVATION_CHANGED，before/afterstate同，rollback0且原字节同、abort自有session。原verify-immutable-legacy-recovery末尾辅助断言误以为API ledger_id会出现在CLI JSON（实际仅code/error），所有恢复操作当时已成功，原失败及before-cli-field-fix脚本保留；新verify-immutable-legacy-captured.mjs逐一复核已捕获命令与最终持久文件，canonical immutable-legacy-recovery-verification.json通过，不重复终态事务。所有纯接口报告明确合成，不冒充文学实读。两个隔离probe已abort；legacy也rolled-back/abort。

修复后最后源冻结source-guarded.json为322项；candidate-guarded真实ZIP解压到D:/work/other/ai-writer/.tmp/长篇 0.9.0 T 修订保护交付解压/ai-writer-0.9.0。guarded-zip-verification.json：324项，323载荷，ZIP SHA1263fd1b86b1596fec557447cf939832cd2521d7fee7b16cc9dcaecd9a3070d7，contentID e25b6416d61e498fca37c7a25a3f66e889d85e5d56e8ddca9e2b0c16a1b56f27。CRC/路径/集合/逐载荷SHA通过。修复后源码完整测试PTY81158（commands/guarded-source-tests）和实际解压包测试PTY25399（guarded-package-tests）仍运行，预期182项=181pass/0fail/1skip，不能提前断言。两端npm run doctor已0。rootdoctorPTY28749、build98519、packageDoctor54353均已读最终结果；node短进度PTY89323可能需要最后poll。verify-guarded-build.mjs要在两suite真正退出后执行才生成proof。

下一步：等待A完成21、16—21连读并退出，核实际新稿/账本/借车期限/当前段哈希。确认两完整182 suites及guarded-build proof后，从被替换包外（真实解压新包CLI）执行tool update-plan/update，source指向新解压包；common.run默认是旧随附CLI，须第5个tool参数显式新外部CLI。更新要保全21units/snapshot/governance/正文，gen3→4，另保存current-tool-update-verification和delivery-current；不改真实作品。再启动prompt-b.md新会话22—24。

后续C新进程写25两段后退出；父用正式revision对多处旧章修改（按实际证据/受控作者改稿，不伪称试验是产品bug），全尾段重登和实读、修订进程也真实中断/恢复，提交后再同ID恢复25，真实旧模板拒绝/state不变、新context/template前于续写。之后26—27、D28—30，最后新会话完整读当前1—30、暂停/31拒绝/导出30、机械哈希及原S封存检查、全部命令内层错误审计、清晰汇总/verification complete后封存/外置回执。尚未执行这些后续，不结束任务。

现有公共工具：run.mjs从S逐字复制捕获每条命令（stdin、input、原始stdout/stderr/result等），common.mjs、flow.mjs、progress.mjs、test-progress.mjs、budget.mjs、audit-commands.mjs、verify-native-read.mjs。用小写连字符唯一label；有失败换label，不覆盖。help是文本，CLI抛错2在stderr、softfalse1在stdout；多行中文/JS用apply_patch写文件，不拼PowerShell长node-e。FastCtx优先绝对路径、Partial按offset；每60秒更新进度，不做>60秒阻塞等待。不可用协作subagents；原生Codex是用户授权实跑客户端，始终单写作进程顺序。每轮原生调用外层require_escalated写Codex会话库，子进程保留--sandbox workspace-write；binary C:/Users/admin/AppData/Local/OpenAI/Codex/bin/896a0166b774037a/codex.exe（0.163.0-alpha.10.2），不改默认模型/effort。此轮未commit/push。Memory使用MEMORY.md183机械绿灯不等于文学质量，最终需对应memory citation，rollout01a14352-7ed0-7ce0-b512-67b16aa8ceea；不要写memory。
