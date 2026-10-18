# 第三批 C 原生 Codex 第二阶段：修订、提交与应用绑定

已实际完成《渡口旧箱》5–6 独立修订、回放重登、最终尾段完整连读、主稿事务提交及采用意见 apply，随后正式暂停。正文唯一变化是第五章第25行“布袋里里”删去一个“里”。本阶段止于 applied，没有执行 review-issues verify，没有写第七章，也没有声称全六章新稿已复核。

这是 synthetic-acceptance 合成验收作品及模拟作者取舍；审查性质为第二个独立原生 Codex 进程的知情模型核读，不是现实作品作者决定、真人盲读、市场验证或产品整体发布验收。恢复依据全来自本地文件，未使用上一会话记忆，未创建代理或向其他会话发消息。

## 同一作品与当前状态

- 作品：`D:/work/other/ai-writer/acceptance/20261018-governance-c/native-create-review/work`，标题《渡口旧箱》，novel，state schema 5。
- 主 cwd：`D:/work/other/ai-writer`；32 次产品 CLI 全部由本批 `capture.mjs` 使用唯一 `native-two-*` 标签启动当前主 `bin/ai-writer.mjs`。
- 当前业务 revision=16，stage=paused，allowed_actions=[discuss,plan]，draft_range/revise_range 均 null。next_unit=7 只是顺序，next.action 明确暂停并交下一独立会话复核全六章。
- 当前 state：66087 字节，SHA256=`51abac397d9928eaa2df460646d67128ac956ed9cc0f427bf20711840220c523`。
- 最终 check：6 章，findings=[]，无未登记正文，无正文/来源漂移，无待处理来源影响。

交付：[handoff.json](handoff.json)、[verification.json](verification.json)、[command-index.json](command-index.json)、[实读覆盖](reading-coverage.json)。JSON 中保留绝对路径、原始哈希、完整登记对象的比较依据及真实产品记录位置。

## 作者原话与三条真实意见

原话保存在[研究/第二阶段模拟作者取舍.md](../native-create-review/work/研究/第二阶段模拟作者取舍.md)，完整 UTF-8 来源 SHA256=`b3a47503ca7e5d87bcfae846770600dbd2573de5a0d2d7dfbf457df51664df75`。文件明确标注 synthetic-acceptance、来源为本轮用户指定模拟原话、记录者为第二个独立原生 Codex 进程，没有伪造消息 ID。

> 采用第五章‘布袋里里’的重复字意见，只做该处最小修正；可选风格意见保留原句，结构复演/节奏疑问延期，不借这次修订删去人物声音或增添冲突。授权独立修订范围5–6，第六章只核承接和等价重登，不另改正文，不写第七章。保持既有事实、观察statement、人物所知、物件位置和伏笔结论，更新与新稿相符的证据版本。完成实际提交及应用绑定后暂停，下一独立会话再做全六章复核。

先在主作品登记有限 revise_range=5–6、无 draft，再在主作品分别 resolve 三条意见；三个输入的 decision_actor 均为 author，完整绑定同一原话的 quote/local_source/source_sha256/locator/recorded_by，由产品冻结证据及 author_choice。选择本身来自这段明确模拟指令，没有以一般授权推断作者逐条采纳。

|真实 ID|begin 前取舍|当前状态|实际处理|
|---|---|---|---|
|NATIVE_C_READABILITY_01|adopted，r11|applied|只删第五章指定重复字；提交完成后绑定实际 commit 与旧新稿|
|NATIVE_C_STYLE_02|retained，r12|retained|第一章原句完整保留；无 application/verification，不记修复|
|NATIVE_C_PACING_03|deferred，r13|deferred|3/5/6 节奏疑问延期，不删谈菜段、不添冲突；context_changed=true，仍是延期|

三条处置全部在 revision begin 前完成，未在 5–6 窄分支处置涉及第一章或第三章的旧意见。原三条意见、原六章报告、原引文、历史对象均保留。当前采用项 verification=null，另外两项 application/verification 均 null。

## 修前保留、范围和版本

[before/work](before/work) 完整保留修前作品 123 个文件，包括原 state、六章全部正文、units、事实 snapshot、全部 journal、意见与报告证据、随附工具。原 state SHA256=`4b33a5877f7fea52db9d1581080a0e8e23850173fd4a3b0861fd5704b3371562`。另保留 [before/inventory.json](before/inventory.json)、[pre-begin-state.json](pre-begin-state.json)、各次 capture 的前后原始 state，以及产品基线、rewind 备份、独立分支和事务新旧备份。

|阶段|主 revision|分支 revision|
|---|---:|---:|
|文件恢复初始|9|—|
|workflow 登记修订授权|10|—|
|三条 author 取舍完成|13|—|
|begin（仅5–6）|13|13|
|rewind5|13|14|
|第5章重登|13|15|
|第6章等价重登及基础 review|13|16|
|prepare|13|16|
|实际 commit|14|16|
|重复 commit|14，不变|16|
|采用意见 apply|15|16|
|正式暂停|16|16|

begin、独立编辑、重登、review 和 prepare 都没有改变主稿正文；提交前按产品基线清单逐项核对全部文件字节，详见[precommit-main-baseline-verification.json](precommit-main-baseline-verification.json)。主稿提交仅基线加一次，没有复制分支临时 revision。重复 commit 返回 unchanged=true，前后 state SHA 完全相同。

真实标识：

- session_id：`db1d9ffb-dd55-4216-81a1-769eb76e40fe`。
- commit_id：`c5e3da0b-4b95-4e7a-884f-b58febd07421`，commit 对象 SHA256=`6004885df486297ceb4cf4b48be389eade79eba190dc21a7ff93e1e51872bbc4`。
- transaction_id：`99ce3f6b-c1b2-492a-84e0-a46c9af92732`，实际 status=completed。
- 分支及 begin 原始令牌保存在 [session-access.json](session-access.json) 和 handoff.json；终态 committed，不应 resume 或刷新原基线。
- 5–6 正式 review_ref：`.writer/reviews/fee4d58a-00b0-4d11-a7c1-0fa9aebf0067.json`，记录 SHA256=`fbd3b12feb28ad763e6bb5a4e238e1b072b10e01a500a9e5a0dbacdc36eb920a`。

全局活动权威、定位、声音、骨架与两卷文件没有为控制样本改写。旧“暂留控制样本”继续作为第一阶段历史任务保留，由本阶段新模拟原话和正式 workflow 优先。必要的计划同步仅在分支用 plan 更新第五章细纲的旧控制任务两处；没有改第1–4章或第6章细纲，也未扩大范围。

## 正文前后完整 SHA256 与实际差异

|章|真实文件|修前完整 SHA256|修后完整 SHA256|
|---|---|---|---|
|1|正文/0001-木架空着一层.md|81d72c44c8da25b67f4597d758b01dc53eb5c6e89c3431bc044cd02261a3c41d|81d72c44c8da25b67f4597d758b01dc53eb5c6e89c3431bc044cd02261a3c41d|
|2|正文/0002-先放一夜.md|0978361349090596f1c408fadca208715ffc95b438c5f48c7245a8303fd805e0|0978361349090596f1c408fadca208715ffc95b438c5f48c7245a8303fd805e0|
|3|正文/0003-垫高两块砖.md|8d628e3f706f8442fb348b7587163035727ce1258f9022db3b08da65d58d1fa3|8d628e3f706f8442fb348b7587163035727ce1258f9022db3b08da65d58d1fa3|
|4|正文/0004-盖子打开以后.md|f76c6874d4d8d492343cfb0e354a6f1a8157e01e47753f1cc9f495097a937aa2|f76c6874d4d8d492343cfb0e354a6f1a8157e01e47753f1cc9f495097a937aa2|
|5|正文/0005-抽屉留条缝.md|abe9dd297f1420bcde8e91c307459030b4b74debd82ec22af9189fc7502e3439|b819ba8107ddbc052709f26480638e6fa5b9fe14450e5f3570e832d46efbd307|
|6|正文/0006-一碗面的位置.md|6ee9bebd47547da185ce9f263fee36eb049c02fc67b0e37fa6684574254a9e78|6ee9bebd47547da185ce9f263fee36eb049c02fc67b0e37fa6684574254a9e78|

唯一正文差异（第5章第25行）：

```diff
-林禾把钥匙放回布袋里里，收紧袋口，搁进自己柜台下的抽屉。
+林禾把钥匙放回布袋里，收紧袋口，搁进自己柜台下的抽屉。
```

完整新文件等于完整旧文件仅执行这一次替换，UTF-8 从2808到2805字节、正文 Han 从801到800；其余全部字节相等。第6章始终3013字节，844汉字。第1–4章全部 units 对象深度相等，包含摘要、来源、授权、journal、工具 ID 等所有字段，正文和旧 journal 原字节也相等；verification.json 逐章列出对象摘要哈希、正文前后哈希、原 journal 引用和真实文件哈希，原 state 字节在备份中可回读。

## replay 的真实拒绝与核读

两章均使用当前产品 revision replay-input、真实 session token 和各自新的 `.writer/drafts/native-two-replay-N-pending.json`，恢复原 summary/changes 和本次来源哈希。旧输入未覆盖；完成核读后另写 reviewed 文件。未手改 state、未把原消费 SHA 追认为新来源、未复制全 snapshot。

第5章先以未完成草案实际 record-preview，退出1、stdout ok=false、writes=false，实际诊断为 `RECORD_INPUT_INVALID: 正文找不到证据引文：单元 5`。旧完整 O_KEY 引文在新稿确已不出现。该次前后 state SHA 均为 `0f7e5861d370ec11c7b22bad888722f5c0ef4ab0da9062ed84a3d90866d6fead`；[stdout](../commands/native-two-14-preview-5-unfinished-denied/stdout.raw.txt)、[stderr](../commands/native-two-14-preview-5-unfinished-denied/stderr.raw.txt) 和旧草案原字节保留。

实际核读后，去掉第5章旧摘要中“控制重复字原句保留”这一失效历史任务附句；保留情节摘要，changes 仅更新 O_KEY 的本章引文。第6章原 summary/changes 完整不动。两章分别保存真实报告，replay_review 均绑定实际正文 SHA，并填齐 summary/characters/timeline/ledger/evidence/downstream 六项 checked_fields。两次完整 preview 均 findings=[]、matched-current-context，随后正式 record 成功；所有 preview 状态字节不变。

报告为[第5章核读](../native-create-review/work/审查/native-two-第5章重登核读.md)、[第6章等价核读](../native-create-review/work/审查/native-two-第6章等价重登核读.md)。两章都重登后，又按5→6完整实读最终正文到末尾，再写[5–6最终尾段连读](../native-create-review/work/审查/native-two-5-6最终尾段连读.md)并用基础形式 review 绑定全部两章当前字节和依赖。报告不是拼接零散短评，也未冒称全六章新稿复核。

## 事实内容与证据版本分开核对

旧新 snapshot 的 characters、threads、timeline 及16项 ledger 去除 evidence 后逐字段相等。上述相等指逐字段内容比较；`JSON.stringify` 的原始摘要仍受对象字段插入顺序影响，因此 verification.json 保留两边真实摘要而不把它们假称相等。完整 snapshot 本身也因证据版本变化不要求同 SHA。另以递归排序对象键、保持数组顺序的规范化摘要核对，前后事实内容哈希一致，详见[fact-equivalence.json](fact-equivalence.json)。

保持的实际边界：箱最终在周梅改衣摊矮架；钥匙经真实递接后在她围裙口袋小钩钥匙圈；纸样在宽纸套和硬纸板上随箱；旧簿仍归老邵；签字清单仍留林禾。老邵未在5–6，不增加后续所知。OBS_BLUE/OBS_LIST/OBS_REGISTER 的 statement 与历史语境保留，I_BLUE/I_BOX_ORIGIN 独立承载解释；纸样用途、费用和留镇仍未定，R_LISTEN 仍 partial，不抹掉“我也没全忘”。

|第5章证据所属 ID|引文文字|证据版本变化|
|---|---|---|
|O_BOX|不变，第3行|旧第5章 SHA → 新第5章 SHA|
|O_KEY|第25行“布袋里里”→“布袋里”|引文和全文 SHA 更新；statement/保管内容不变|
|O_BOOK|不变，第7行|旧第5章 SHA → 新第5章 SHA|
|T_CLAIM|不变，第15行|旧第5章 SHA → 新第5章 SHA|
|R_LISTEN|不变，第13行|旧第5章 SHA → 新第5章 SHA|
|O_PATTERN|不变，第17行|旧第5章 SHA → 新第5章 SHA|

六条证据均由产品重登自动绑定新全文 SHA；不能把它们要求为旧 SHA 来冒充事实不变。第6章九条证据的引文和全文 SHA 不变，第6章消费来源中的前章 SHA 则确实更新。旧完整句仍保留在修前正文、旧 journal、原意见和原报告中。全部逐项前后对照见[evidence-version-diff.json](evidence-version-diff.json)及 verification.json。

## 旧功能表和下一阶段

第一阶段功能表/原报告引用仍是 `.writer/reviews/774a2be2-1d2e-45a9-8952-f541ec8b7f32.json`，SHA256=`ce79affa439d248946e7258a050f2f026d01601a1b28ecf1a054a89e5a01e29c`，字节原样保留。由于第5章新稿和5–6重登依赖，当前已失效，没有删除来清零。

最终 rolling_review：valid=2（原1–3、当前5–6），stale=1，stale_with_current_coverage=0，stale_without_current_coverage=1，pending_windows=[1–6]，unpublished_records=[]。分段有效报告不能拼成一次完整六章连读。下一独立会话须恢复当前暂停授权、读原意见与全部当前正文1→6，做一份绑定新稿的完整报告，再按其阶段任务处理 applied 意见的复核；本阶段没有执行此步。

## 工具差异、守卫及限制

第一阶段在修复前候选上完成，其随附工具保持原样。实际 tool compare 返回 same_version=true、same_content=false，结论“版本号相同、构建内容不同”。[tool-comparison.json](tool-comparison.json)和[source-diffs](source-diffs)保留逐文件旧新 SHA 与真实差异：

- lib/review-workflow.mjs：增加分支意见范围检查、持久 author_choice 与代理不得翻转作者选择的检查；允许以当前实读证据复核原真实修复而不虚构第二次改字。
- lib/longform.mjs：未被 state 索引的结构化孤儿报告列 unpublished，不计有效覆盖。
- lib/workspace.mjs：空摘要等预览也先列范围授权阻断。
- docs/review-and-registration.md：对应边界说明。

本阶段主工具首尾 identify 的 content_id 均为 `c68d2a4d7ed598de77d84e038e0d4f9e91a743ed576add4dbe90547567707efc`，runtime_id 均为 `36845c676aeedc90f8660498f06ee5a3372fe23a9fbc2059cd8401c0e5b18ce2`；第一阶段/随附副本分别是 `0910f122e5c0a685687b902746d6252d09f94b06b77eae639da666972dadffd1` 和 `5c749179ae6f01b0958e9973ff5d01d2ec9cd8eac8775cfa4886437da9e3ffd5`。

本阶段全部32次 capture 前后 runtime_files_stable=true，唯一 runtime_guard_id/session build_id=`c9c6ca170c19b518a26782e6aae044c27c84f4ca0c5d88830aba1a44ddc7e0ec`，不同于第一阶段 `bafba65483cbae67215ee3cfabcc3c00868889407731ce886204e3a4cfacff2b`。这些 ID 的构造方式不同，不能相互混用；只是磁盘字节观测，不是签名或在途模块字节证明。

58份主源码/技能/手册观测文件与初始哈希一致，见[source-observation-index.json](source-observation-index.json)；作品随附工具13份文件全部原字节不变。修前123文件中120份仍原字节，现有文件仅 state、第5章细纲、第5章正文发生变化；新增报告、产品对象、分支/事务及本阶段材料另存，没有删除旧文件。

唯一非零产品退出是上述预期失效引文拒绝；新 reviewed 输入通过，不覆盖失败证据。重复 commit 是实际幂等验证。没有辅助执行错误或待绕过的产品缺陷，本场景未发现需要修改工具的问题。未运行 npm 全回归：本阶段不改工具，也不借用其他批次结果充作本次验收。

全部32次精确 argv、cwd、输入原字节、stdout/stderr、退出码、前后 state、每次构建守卫和文件哈希见[command-index.json](command-index.json)，原始记录位于 `../commands/native-two-*`。所有脚本、分支、备份、失败与成功输入均保留。没有 Git add/commit/push、工具升级、旧封存或真实作品改动、全局配置修改、上传或发布。
