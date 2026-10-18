# 0.5.0 第二批 B：设定版本、影响分析与跨会话修订保护

日期：2026-10-18。范围为八项设计中的 AW-03/AW-04；交付为本地验证候选，未发布、未提交、未推送。现有作品不迁移、不修改。本目录保留原始失败、修后结果、各阶段源码、独立作品、作者证据、命令输入输出、模型读稿报告和事务旧新备份。

## 实现结果

- 设定、单元细纲、卷纲与研究输入可冻结为不可变版本，按明确章节区间生效；已写章节保留原消费哈希。未来补充不再因活动入口变化使旧章全部失效；未版本化输入继续受原哈希保护。
- 影响预览列出直接消费者、需回读章节、保留前缀和未知间接影响。历史发布先持久登记pending，在独立修订区处理尾段，完成复核后随事务一次发布。间接文学影响须模型实读，脚本不作语义验收。
- 修订会话保存所有者、令牌摘要、范围、原业务revision、文件及运行模块基线，独立复制稿件；跨进程恢复沿用原基线，普通主稿写入受占用保护，并行候选最终只允许一个通过全局CAS。不自动合并或按超时删锁。
- prepare核对完整原尾段重登、未改前缀、增量事实链、来源与授权证据、最终实读报告；commit保存旧新字节，最后替换state，主revision只增加一次。中断可显式补完或回滚；第三方改动保留三方后停止，重复成功提交幂等。
- 原设计拟扩展schema3；核实旧0.4解析器会忽略新字段后改用 **schema4**，使旧客户端明确拒绝。旧1/2/3仍可读，升级须preview/enable并备份，不能自动升级已有作品或随附工具。

接口及边界见[实现约束](../../docs/authoring-governance-b-implementation.md)，操作见[快速入门](../../docs/quickstart.md)、[使用手册](../../docs/user-guide.md)、[专项手册](../../docs/revision-and-sources.md)。writer-project及writer-review长篇/修订说明同步更新。未增加运行依赖或常驻进程，未更改内置引擎。

## 最终版本与回归

最终交付与测试候选的103个文件逐项哈希一致：[交付清单](sources/final-delivery/source-manifest.json)、[测试清单](sources/candidate-final/source-manifest.json)。运行模块守卫指纹为 `fd93a368c02475da18c9ea8baf1b5836d28e330edf817d47cbca15e969f79acb`，是修订模块使用的有序文件哈希，与identify的runtime_id/content_id不是同一命名空间。

| 检查 | 最终结果 | 原始证据 |
|---|---|---|
| npm test | 112/112，失败0、跳过0 | [输出](commands/final-regression/stdout.raw.txt)、[进程结果](commands/final-regression/result.json) |
| npm run doctor | 退出0，errors/warnings均空 | [输出](commands/final-doctor/stdout.raw.txt) |
| npm run smoke | 完整真实CLI流程通过 | [输出](commands/final-smoke/stdout.raw.txt) |
| 四文体CLI矩阵 | 182次调用，含预期拒绝、4种故障、竞争提交 | [结果](commands/matrix-final-run/stdout.raw.txt)、[脚本](cli-matrix.mjs) |
| 逐位置事务故障 | 23种情境、378次调用、8个发布文件位置 | [结果](commands/exhaustive-final-run/stdout.raw.txt)、[脚本](exhaustive-faults.mjs) |
| 不同章节并行候选 | 30次调用，一方提交、另一方冲突并保留 | [结果](commands/disjoint-final-run/stdout.raw.txt)、[脚本](disjoint-candidates.mjs) |
| 修订边界回归 | 10项通过 | [输出](commands/final-boundaries/stdout.raw.txt) |
| writer-project技能格式 | 通过 | [输出](commands/skills-final-validate/stdout.raw.txt) |

故障矩阵在真实子进程中注入退出，覆盖每个写入位置后的补完/回滚、事务计划准备后、会话终态保存后、备份尚未形成权威计划时的中断、首文件与state替换前模拟ENOSPC；另核第三方字节保留、遗留锁恢复、主文件/候选/随附工具漂移、所有权移交和成功终态保护。**这是注入异常，不是真实磁盘写满、断电或共享盘保证。**单元测试另有两个同时运行的提交进程，不只测顺序冲突。

机器核验见[final-verification.json](final-verification.json)，逐次调用见[command-index-final.json](command-index-final.json)。封存清单见[evidence-manifest.json](evidence-manifest.json)，可运行 `node acceptance/20261018-governance-b/seal-evidence.mjs verify` 只读复核；此前失败候选均保留。

该调用索引在最终审计执行中生成，纳入当时已完成的1862次根记录（含早期失败及预期拒绝，不重复计入各阶段复制件）；审计及总报告链接检查另见各自commands目录，最终封存包含它们：[审计](commands/final-audit-run/result.json)、[链接检查](commands/final-report-links-after/)。第一次链接检查引用自身尚未写出的result.json而失败，已更正入口；原失败保留，产品未运行或修改。

## 四个独立原生Codex进程

实际启动本机 `codex-cli 0.163.0-alpha.10.2 exec --json --sandbox workspace-write`，未指定替代模型，四个不同thread ID。各阶段保存request、events.jsonl、stderr、进程结果、最终回复；产品调用通过记录器保存argv、输入原字节、退出码、前后状态及可用时的构建磁盘观测。早期记录器无构建观测的调用不补造该字段。

| 阶段 | 实际流程 | 记录 |
|---|---|---|
| 1 新建与未来生效 | 新作《铜桥来信》两卷六章，正文3936汉字；一次独立修订；规则从7生效，六章正文及原消费证据保持不变；暂停不写7 | [报告](report.md)、[交接](handoff.json)、[原始进程](native-create/process-result.json)、[事件](native-create/events.jsonl) |
| 2 历史改价中途停止 | 实读六章；第二章押钱改三枚、第五章退款改三枚，第一章留旧规则；分支登记至3停止，主稿六章保持原样、pending保留 | [报告](native-revise-partial/report.md)、[交接](native-revise-partial/handoff.json)、[进程](native-revise-partial/process-result.json) |
| 3 恢复与提交 | 新进程恢复同一会话/基线28，补完4–6并全六章实读；修正周叔知情登记遗漏，提交至29，暂停到30；分支45未覆盖主revision；最终4051汉字，未写7 | [报告](native-revise-complete/report.md)、[核验](native-revise-complete/verification.json)、[进程](native-resume-commit/process-result.json) |
| 4 最终构建百章验证 | 独立副本从100生效，scope100–100，重登100后提交379→380、重复提交幂等，暂停到381；95–100完整实读，前99条登记、100篇正文和事实终态不变 | [请求](native-hundred-final/request.md)、[报告](native-four/report.md)、[前后核对](native-four/post-pause.json)、[进程](native-hundred-final/process-result.json) |

前三次发生在修复过程中，绑定当时源码：`sources/native-v1`、`sources/native-v2`、`sources/native-v2-recovery`，**不能称为最终源码上的重新创作**。第四次及最终112项、全部最终CLI矩阵使用最终交付源码；六章在最终工具上另作只读check，当前资料合法。

### 百章验证准确范围

从已封存百章记录挑选598个必要文件复制，共11,256,809字节，核220份实际消费输入；旧记录原件未写入，见[复制清单](scale-hundred/copy-manifest.json)。这是已有百章长篇的版本迁移、来源分段、修订事务与追踪验证，**不是本轮新写100章或全书文学重新验收**。100篇字节、事实终态及1157条账本证据锚点由脚本核对，文学实读只记95–100。

旧版规则覆盖1–99、新版从100起，只有100重登。旧构建候选因模块变化被拒绝，显式终止但保留，在新基线另建会话；未刷新旧基线绕过冲突。随附0.3工具未替换，其doctor对schema4报告不兼容；主项目doctor通过。

最终复核valid48、stale66，其中63份有当前覆盖，**3份仍缺完整当前覆盖**（两份25–42旧报告、一份1–100全书旧报告）。95–100本轮真实报告有效。未重读1–94，不以哈希、摘要、零pending或draft-export替代全书实读，不清除旧报告来取得表面绿灯。

另发现原有合订导出会对各章调用trim，规范化章首尾空白，故不满足本次验证额外提出的“逐篇原字节导出”检查；100篇源稿未变、合订稿内容和自身SHA正确，清单每章SHA表示源稿而非合订分段。保留[观察与最小复现](native-four/export-byte-normalization-observation.md)、[核对](native-four/export-verification.json)及原生导出，另以本轮辅助脚本保全100篇原字节文件。**补充保全包不是新实现的产品导出功能，也不能把原生合订导出报为字节级通过。**本批不更改既有合订格式；该边界随记录交付。

## 发现与修复

| 发现 | 最终处理 |
|---|---|
| 冻结细纲入口缺失仍被要求存在 | 统一版本解析，真实对象可恢复，未绑定来源仍核哈希；[原复现](commands/protection-edge-before/result.json)及修后结果保留 |
| 移交凭据误计入业务基线产生假冲突 | 存协作目录，移交不刷新base，外部漂移仍拒绝 |
| 内部路径可能成为正式依赖、随附运行模块漂移漏比 | 拒绝内部路径，基线包含随附工具；最终边界回归覆盖 |
| 已发布未来规则被标成未发布编辑 | 区分已发布区间入口差异与真正pending；[复现](commands/native-display-before/result.json)、[修后](commands/source-display-after/result.json) |
| 修订区借更宽作者授权越出声明范围 | 同时检查session scope及作者授权；[先红用例](commands/scope-before/result.json) |
| 从2生效却要求回退1 | 拆开revision_from/review_from；六章第二阶段曾保守扩到1–6，偏差保留；终版测试从2保留1、百章实跑从100保留1–99；[原复现](commands/historical-prefix-before/result.json) |
| 历史授权/决策消费引用未逐项校验 | 核事件SHA、动作/范围与当时确认；撤回不抹去历史确认；[先红用例](commands/consumed-trace-before-quoted/result.json) |
| 漏登周叔已知缺角成因 | 实读发现，正式rewind5、重登5–6修正知情，原观察statement及第3章证据保留；[实际发现](native-revise-complete/first-read-finding.md) |

早期81、102、109及最终112项分开留存。部分中间失败是新协议下旧测试期望或测试断言回调写法，不能全部计作产品缺陷。辅助脚本有重复import、字段名/导出结构误读、Python编码及PowerShell引用错误，修正只涉及辅助脚本或调用方式；见各native报告和[父会话辅助说明](parent-shell-notes.md)。

## 原作品与交付边界

[前清单](protected-before.json)与[后清单](protected-after.json)覆盖 `D:/work/小说/dzkxqxx` 全部516文件，包含.git；[比较](protected-comparison.json)为 **差异0**。新稿与百章副本均在本目录。此前A和百章封存通过只读复验：[A核验](commands/prior-a-seal/stdout.raw.txt)、[百章核验](commands/prior-hundred-seal/stdout.raw.txt)。

四个原生进程全部结束后又作[最终清单](protected-final.json)与[最终比较](protected-final-comparison.json)，仍为516文件、差异0；前述中间核对未被覆盖。

HEAD仍为 `80c74f6ac725ea164c54bf42c361a053f58af903`，暂存区空；未commit/push，原有无关`.idea/`未修改。本轮未改引擎，不声称运行了引擎回归。

未实施C/D的跨章文学重复、意见逐条闭环、进一步登记减负及可恢复工具更新。修订首版不支持删/更名章节、插入新正文、改写治理/决策配置；无同用户安全隔离、共享盘/跨机保证或任意编辑器零竞态保证。锁外已有修改只能经明确授权和足够范围保守收纳，不能伪造旧字节。模型复核为知情实读，不等于真人盲读、市场或平台发布验收。
