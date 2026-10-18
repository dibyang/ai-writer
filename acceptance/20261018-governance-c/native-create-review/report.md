# 第三批C 原生Codex第一阶段执行报告

已实际完成《渡口旧箱》独立新作规划、两卷六章有限试写、逐章登记、正式暂停、最终六章完整连读及三条开放意见登记。本次为合成验收草稿，不是现实作品作者决定、真人盲读或读者定稿。控制重复字保留。

作品完整路径：`D:/work/other/ai-writer/acceptance/20261018-governance-c/native-create-review/work`。主cwd始终`D:/work/other/ai-writer`，全部56次产品CLI经本批capture，入口均为当前主`bin/ai-writer.mjs`。没有创建第7章。没有Git add/commit/push、网络发布、其他会话、子代理或跨会话消息；工具/技能/手册和既有作品未作修改。

## 当前状态

state schema=5，writer.json自身清单schema=1；业务revision=9。1–6登记完revision=7，按合成原话暂停后=8，结构化review后=9。stage=structure，allowed_actions=[discuss,plan]，draft/revise范围均null。next_unit=7仅为登记顺序，next.action为暂停正文、结构讨论。作者来源见[验证授权原话](work/研究/验证授权原话.md)。

定位、声音、全书骨架先建；V1=1–3、V2=4–6；只先细化1–3，卷一完成实读登记后再细化4–6。原骨架预计第3章见纸样，实际第4章开箱后才见，原计划保留，未倒填正文事实。

## 正文核对

|章|真实文件|字节数|正文Han数|完整字节SHA-256|
|---|---|---:|---:|---|
|1|[正文/0001-木架空着一层.md](work/正文/0001-木架空着一层.md)|2961|831|`81d72c44c8da25b67f4597d758b01dc53eb5c6e89c3431bc044cd02261a3c41d`|
|2|[正文/0002-先放一夜.md](work/正文/0002-先放一夜.md)|2953|816|`0978361349090596f1c408fadca208715ffc95b438c5f48c7245a8303fd805e0`|
|3|[正文/0003-垫高两块砖.md](work/正文/0003-垫高两块砖.md)|2995|839|`8d628e3f706f8442fb348b7587163035727ce1258f9022db3b08da65d58d1fa3`|
|4|[正文/0004-盖子打开以后.md](work/正文/0004-盖子打开以后.md)|3016|854|`f76c6874d4d8d492343cfb0e354a6f1a8157e01e47753f1cc9f495097a937aa2`|
|5|[正文/0005-抽屉留条缝.md](work/正文/0005-抽屉留条缝.md)|2808|801|`abe9dd297f1420bcde8e91c307459030b4b74debd82ec22af9189fc7502e3439`|
|6|[正文/0006-一碗面的位置.md](work/正文/0006-一碗面的位置.md)|3013|844|`6ee9bebd47547da185ce9f263fee36eb049c02fc67b0e37fa6684574254a9e78`|

合计4985汉字。去掉首行标题后统计Unicode Script=Han，不把摘要、追踪或报告计入。所有章800–1100。完整绝对路径和哈希另见[body-hashes.json](body-hashes.json)。

## 实读审查与开放意见

最终六章在全部登记并暂停后，按顺序用FastCtx各分两段实读到末尾。共12段，无长行截断、未补读部分或摘要替读。此前另完成1–3实读复核。完整范围、版本和性质见[阅读覆盖](reading-coverage.json)与[实际六章报告](work/审查/1-6结构连读.md)。

功能表/比较/意见绑定的review_ref为`.writer/reviews/774a2be2-1d2e-45a9-8952-f541ec8b7f32.json`，记录SHA=`ce79affa439d248946e7258a050f2f026d01601a1b28ecf1a054a89e5a01e29c`。每章五项齐全，observed有本章引文；第1章关系变化none、第4章unknown均说明缺证原因，没有编造关系进展。

第二/第五章同是桌边核查：前者暂扣交付而产生难堪，后者交出记法主动权并实际划去工具，应保留不同收益。第三/五/六章共同做事后柔和收束有节奏可商榷处；没有足够证据判无效复演，待作者选择。脚本不判断文学重复。

|稳定ID|类型/严重度/置信度|状态|原句|
|---|---|---|---|
|`NATIVE_C_READABILITY_01`|readability/minor/high|open|5章：林禾把钥匙放回布袋里里，收紧袋口，搁进自己柜台下的抽屉。|
|`NATIVE_C_STYLE_02`|optional_style/suggestion/medium|open|1章：木架上少了一层空处，屋子看起来比早上小了一点。|
|`NATIVE_C_PACING_03`|readability/suggestion/low|open|3章：她留了一半饭在锅里，让周梅回去端菜。<br>5章：临走前周梅拎起工具套和锤子，忽然问昨天那盘豆角咸不咸。<br>6章：她们各要了一小碗，林禾多走一趟取筷子，回来见周梅把缝纫机上的布移开，铺了两张旧报纸。|

全部仅open，没有resolve、adopted、applied或verified记录。第五章控制句完整进入O_KEY第5章evidence；正文仅一次“布袋里里”。该处为人为控制样本，本轮未修，不代表拟交付读者定稿。

## 事实和知识边界

箱和钥匙1–5章由林禾暂管；6章真实递接后，箱在周梅改衣摊矮架，钥匙在她围裙口袋小钩的钥匙圈。纸样4章才首次看见，5章装套回箱、6章随箱交周梅。旧簿4章归还老邵；交接签单留林禾。

OBS_BLUE/OBS_REGISTER保留原观察；I_BLUE/I_BOX_ORIGIN另记后续解释。须把历史观察语境、当前人物状态和解释合读，不把旧观察上“未知”当成全部最新知识。周梅只在针法/裁口核看后辨认母亲余料；老邵混箱说法是其自述，不是独立鉴定。老邵未在5–6场景，不擅知后续交接与旧歉。周梅仍说“我也没全忘”，没有宣称完全和好。

未来未决：林禾是否常留、回县日期、长期费用、无名纸样原收件人和复制对象。它们没有被强行写成确定事实；下一阶段须新模拟授权。本次不进行修订5–6、replay、意见处置或导出。

## 守卫与不变性证据

[完整机械核对](integrity-verification.json)：结构化review前后六章字节哈希、units和事实snapshot完全一致；state仅review_workflow与revision两项改变。空摘要拒绝及全部预览均未改state；三次越权拒绝前后state哈希一致；第7章正文与越权输出模板都不存在。六个正式输入原样保留写前模板的expected_revision/source_hashes，六次预览都返回matched-current-context；未手填/刷新原消费哈希。

源码0.6.0，基线commit=832581720f4d6d6c99780390812218e215167822、dirty=true。tool identify首尾content_id=`0910f122e5c0a685687b902746d6252d09f94b06b77eae639da666972dadffd1`、runtime_id=`5c749179ae6f01b0958e9973ff5d01d2ec9cd8eac8775cfa4886437da9e3ffd5`且全部文件列表相同。56次CLI的capture运行守卫均为`bafba65483cbae67215ee3cfabcc3c00868889407731ce886204e3a4cfacff2b`，每次前后稳定。capture守卫与identify runtime_id使用不同构造方法，不能互当同一个ID。守卫只观测磁盘字节，不是进程已加载模块的数字签名或证明。原始源码/技能/手册观测副本及来源哈希见[source-input-index](source-input-index.json)。

最终check：units=6，findings=[]，unregistered=[]，rolling_review valid=2、stale=0、pending_windows=[]。这是机械与覆盖结果，不给文学质量通过。工具未改，本阶段未运行npm全回归，也不借用旧矩阵作本次实读证据。

## 失败和重试

12号负向样本：原始空摘要record-preview退出1，stdout findings=REQUIRED_FIELD；随后用新完整输入13号预览通过。47号越权context退出2、stderr=ACTION_OUT_OF_SCOPE；辅助脚本误预期1而停止，原脚本及产品原始输出保留，48号新标签按退出2重新实测，49号record-template同样拒绝。该辅助预期错误没有重跑已完成写入、覆盖输入或改安全设置，详见[辅助失败说明](denial-helper-note.json)。其余产品命令退出0。

## 每次真实CLI索引

result.json仅记录器元数据，实际产品JSON在下表stdout/stderr。精确argv、cwd、输入原字节、所有输出哈希、状态前后哈希、构建观测见[command-index.json](command-index.json)。本表简写命令不是替代精确argv。

|唯一标签|命令摘要|退出码|真实返回|
|---|---|---:|---|
|native-one-01-init|init --path acceptance/20261018-governance-c/native-create-review/work|0|[stdout](../commands/native-one-01-init/stdout.raw.txt) / [stderr](../commands/native-one-01-init/stderr.raw.txt)|
|native-one-02-tool-identify|tool identify|0|[stdout](../commands/native-one-02-tool-identify/stdout.raw.txt) / [stderr](../commands/native-one-02-tool-identify/stderr.raw.txt)|
|native-one-03-status|status --project acceptance/20261018-governance-c/native-create-review/work|0|[stdout](../commands/native-one-03-status/stdout.raw.txt) / [stderr](../commands/native-one-03-status/stderr.raw.txt)|
|native-one-04-trial-workflow|workflow set --project|0|[stdout](../commands/native-one-04-trial-workflow/stdout.raw.txt) / [stderr](../commands/native-one-04-trial-workflow/stderr.raw.txt)|
|native-one-05-volume-v1|volume --project acceptance/20261018-governance-c/native-create-review/work|0|[stdout](../commands/native-one-05-volume-v1/stdout.raw.txt) / [stderr](../commands/native-one-05-volume-v1/stderr.raw.txt)|
|native-one-06-volume-v2|volume --project acceptance/20261018-governance-c/native-create-review/work|0|[stdout](../commands/native-one-06-volume-v2/stdout.raw.txt) / [stderr](../commands/native-one-06-volume-v2/stderr.raw.txt)|
|native-one-07-plan-1|plan --project acceptance/20261018-governance-c/native-create-review/work|0|[stdout](../commands/native-one-07-plan-1/stdout.raw.txt) / [stderr](../commands/native-one-07-plan-1/stderr.raw.txt)|
|native-one-08-plan-2|plan --project acceptance/20261018-governance-c/native-create-review/work|0|[stdout](../commands/native-one-08-plan-2/stdout.raw.txt) / [stderr](../commands/native-one-08-plan-2/stderr.raw.txt)|
|native-one-09-plan-3|plan --project acceptance/20261018-governance-c/native-create-review/work|0|[stdout](../commands/native-one-09-plan-3/stdout.raw.txt) / [stderr](../commands/native-one-09-plan-3/stderr.raw.txt)|
|native-one-10-context-1|context --project acceptance/20261018-governance-c/native-create-review/work|0|[stdout](../commands/native-one-10-context-1/stdout.raw.txt) / [stderr](../commands/native-one-10-context-1/stderr.raw.txt)|
|native-one-11-template-1|record-template --project acceptance/20261018-governance-c/native-create-review/work|0|[stdout](../commands/native-one-11-template-1/stdout.raw.txt) / [stderr](../commands/native-one-11-template-1/stderr.raw.txt)|
|native-one-12-empty-summary-rejected|record-preview --project acceptance/20261018-governance-c/native-create-review/work|1|[stdout](../commands/native-one-12-empty-summary-rejected/stdout.raw.txt) / [stderr](../commands/native-one-12-empty-summary-rejected/stderr.raw.txt)|
|native-one-13-preview-1|record-preview --project acceptance/20261018-governance-c/native-create-review/work|0|[stdout](../commands/native-one-13-preview-1/stdout.raw.txt) / [stderr](../commands/native-one-13-preview-1/stderr.raw.txt)|
|native-one-14-record-1|record --project acceptance/20261018-governance-c/native-create-review/work|0|[stdout](../commands/native-one-14-record-1/stdout.raw.txt) / [stderr](../commands/native-one-14-record-1/stderr.raw.txt)|
|native-one-15-check-1|check --project acceptance/20261018-governance-c/native-create-review/work|0|[stdout](../commands/native-one-15-check-1/stdout.raw.txt) / [stderr](../commands/native-one-15-check-1/stderr.raw.txt)|
|native-one-16-context-2|context --project acceptance/20261018-governance-c/native-create-review/work|0|[stdout](../commands/native-one-16-context-2/stdout.raw.txt) / [stderr](../commands/native-one-16-context-2/stderr.raw.txt)|
|native-one-17-template-2|record-template --project acceptance/20261018-governance-c/native-create-review/work|0|[stdout](../commands/native-one-17-template-2/stdout.raw.txt) / [stderr](../commands/native-one-17-template-2/stderr.raw.txt)|
|native-one-18-preview-2|record-preview --project acceptance/20261018-governance-c/native-create-review/work|0|[stdout](../commands/native-one-18-preview-2/stdout.raw.txt) / [stderr](../commands/native-one-18-preview-2/stderr.raw.txt)|
|native-one-19-record-2|record --project acceptance/20261018-governance-c/native-create-review/work|0|[stdout](../commands/native-one-19-record-2/stdout.raw.txt) / [stderr](../commands/native-one-19-record-2/stderr.raw.txt)|
|native-one-20-check-2|check --project acceptance/20261018-governance-c/native-create-review/work|0|[stdout](../commands/native-one-20-check-2/stdout.raw.txt) / [stderr](../commands/native-one-20-check-2/stderr.raw.txt)|
|native-one-21-context-3|context --project acceptance/20261018-governance-c/native-create-review/work|0|[stdout](../commands/native-one-21-context-3/stdout.raw.txt) / [stderr](../commands/native-one-21-context-3/stderr.raw.txt)|
|native-one-22-template-3|record-template --project acceptance/20261018-governance-c/native-create-review/work|0|[stdout](../commands/native-one-22-template-3/stdout.raw.txt) / [stderr](../commands/native-one-22-template-3/stderr.raw.txt)|
|native-one-23-preview-3|record-preview --project acceptance/20261018-governance-c/native-create-review/work|0|[stdout](../commands/native-one-23-preview-3/stdout.raw.txt) / [stderr](../commands/native-one-23-preview-3/stderr.raw.txt)|
|native-one-24-record-3|record --project acceptance/20261018-governance-c/native-create-review/work|0|[stdout](../commands/native-one-24-record-3/stdout.raw.txt) / [stderr](../commands/native-one-24-record-3/stderr.raw.txt)|
|native-one-25-check-3|check --project acceptance/20261018-governance-c/native-create-review/work|0|[stdout](../commands/native-one-25-check-3/stdout.raw.txt) / [stderr](../commands/native-one-25-check-3/stderr.raw.txt)|
|native-one-26-review-1-3|review --project acceptance/20261018-governance-c/native-create-review/work|0|[stdout](../commands/native-one-26-review-1-3/stdout.raw.txt) / [stderr](../commands/native-one-26-review-1-3/stderr.raw.txt)|
|native-one-27-plan-4|plan --project acceptance/20261018-governance-c/native-create-review/work|0|[stdout](../commands/native-one-27-plan-4/stdout.raw.txt) / [stderr](../commands/native-one-27-plan-4/stderr.raw.txt)|
|native-one-28-plan-5|plan --project acceptance/20261018-governance-c/native-create-review/work|0|[stdout](../commands/native-one-28-plan-5/stdout.raw.txt) / [stderr](../commands/native-one-28-plan-5/stderr.raw.txt)|
|native-one-29-plan-6|plan --project acceptance/20261018-governance-c/native-create-review/work|0|[stdout](../commands/native-one-29-plan-6/stdout.raw.txt) / [stderr](../commands/native-one-29-plan-6/stderr.raw.txt)|
|native-one-30-context-4|context --project acceptance/20261018-governance-c/native-create-review/work|0|[stdout](../commands/native-one-30-context-4/stdout.raw.txt) / [stderr](../commands/native-one-30-context-4/stderr.raw.txt)|
|native-one-31-template-4|record-template --project acceptance/20261018-governance-c/native-create-review/work|0|[stdout](../commands/native-one-31-template-4/stdout.raw.txt) / [stderr](../commands/native-one-31-template-4/stderr.raw.txt)|
|native-one-32-preview-4|record-preview --project acceptance/20261018-governance-c/native-create-review/work|0|[stdout](../commands/native-one-32-preview-4/stdout.raw.txt) / [stderr](../commands/native-one-32-preview-4/stderr.raw.txt)|
|native-one-33-record-4|record --project acceptance/20261018-governance-c/native-create-review/work|0|[stdout](../commands/native-one-33-record-4/stdout.raw.txt) / [stderr](../commands/native-one-33-record-4/stderr.raw.txt)|
|native-one-34-check-4|check --project acceptance/20261018-governance-c/native-create-review/work|0|[stdout](../commands/native-one-34-check-4/stdout.raw.txt) / [stderr](../commands/native-one-34-check-4/stderr.raw.txt)|
|native-one-35-context-5|context --project acceptance/20261018-governance-c/native-create-review/work|0|[stdout](../commands/native-one-35-context-5/stdout.raw.txt) / [stderr](../commands/native-one-35-context-5/stderr.raw.txt)|
|native-one-36-template-5|record-template --project acceptance/20261018-governance-c/native-create-review/work|0|[stdout](../commands/native-one-36-template-5/stdout.raw.txt) / [stderr](../commands/native-one-36-template-5/stderr.raw.txt)|
|native-one-37-preview-5|record-preview --project acceptance/20261018-governance-c/native-create-review/work|0|[stdout](../commands/native-one-37-preview-5/stdout.raw.txt) / [stderr](../commands/native-one-37-preview-5/stderr.raw.txt)|
|native-one-38-record-5|record --project acceptance/20261018-governance-c/native-create-review/work|0|[stdout](../commands/native-one-38-record-5/stdout.raw.txt) / [stderr](../commands/native-one-38-record-5/stderr.raw.txt)|
|native-one-39-check-5|check --project acceptance/20261018-governance-c/native-create-review/work|0|[stdout](../commands/native-one-39-check-5/stdout.raw.txt) / [stderr](../commands/native-one-39-check-5/stderr.raw.txt)|
|native-one-40-context-6|context --project acceptance/20261018-governance-c/native-create-review/work|0|[stdout](../commands/native-one-40-context-6/stdout.raw.txt) / [stderr](../commands/native-one-40-context-6/stderr.raw.txt)|
|native-one-41-template-6|record-template --project acceptance/20261018-governance-c/native-create-review/work|0|[stdout](../commands/native-one-41-template-6/stdout.raw.txt) / [stderr](../commands/native-one-41-template-6/stderr.raw.txt)|
|native-one-42-preview-6|record-preview --project acceptance/20261018-governance-c/native-create-review/work|0|[stdout](../commands/native-one-42-preview-6/stdout.raw.txt) / [stderr](../commands/native-one-42-preview-6/stderr.raw.txt)|
|native-one-43-record-6|record --project acceptance/20261018-governance-c/native-create-review/work|0|[stdout](../commands/native-one-43-record-6/stdout.raw.txt) / [stderr](../commands/native-one-43-record-6/stderr.raw.txt)|
|native-one-44-check-6|check --project acceptance/20261018-governance-c/native-create-review/work|0|[stdout](../commands/native-one-44-check-6/stdout.raw.txt) / [stderr](../commands/native-one-44-check-6/stderr.raw.txt)|
|native-one-45-pause|workflow set --project|0|[stdout](../commands/native-one-45-pause/stdout.raw.txt) / [stderr](../commands/native-one-45-pause/stderr.raw.txt)|
|native-one-46-status-paused|status --project acceptance/20261018-governance-c/native-create-review/work|0|[stdout](../commands/native-one-46-status-paused/stdout.raw.txt) / [stderr](../commands/native-one-46-status-paused/stderr.raw.txt)|
|native-one-47-context-7-denied|context --project acceptance/20261018-governance-c/native-create-review/work|2|[stdout](../commands/native-one-47-context-7-denied/stdout.raw.txt) / [stderr](../commands/native-one-47-context-7-denied/stderr.raw.txt)|
|native-one-48-context-7-denied-retry|context --project acceptance/20261018-governance-c/native-create-review/work|2|[stdout](../commands/native-one-48-context-7-denied-retry/stdout.raw.txt) / [stderr](../commands/native-one-48-context-7-denied-retry/stderr.raw.txt)|
|native-one-49-template-7-denied|record-template --project acceptance/20261018-governance-c/native-create-review/work|2|[stdout](../commands/native-one-49-template-7-denied/stdout.raw.txt) / [stderr](../commands/native-one-49-template-7-denied/stderr.raw.txt)|
|native-one-50-review-template-1-6|review-template --project acceptance/20261018-governance-c/native-create-review/work|0|[stdout](../commands/native-one-50-review-template-1-6/stdout.raw.txt) / [stderr](../commands/native-one-50-review-template-1-6/stderr.raw.txt)|
|native-one-51-review-register|review --project acceptance/20261018-governance-c/native-create-review/work|0|[stdout](../commands/native-one-51-review-register/stdout.raw.txt) / [stderr](../commands/native-one-51-review-register/stderr.raw.txt)|
|native-one-52-review-issues-list|review-issues list --project|0|[stdout](../commands/native-one-52-review-issues-list/stdout.raw.txt) / [stderr](../commands/native-one-52-review-issues-list/stderr.raw.txt)|
|native-one-53-final-check|check --project acceptance/20261018-governance-c/native-create-review/work|0|[stdout](../commands/native-one-53-final-check/stdout.raw.txt) / [stderr](../commands/native-one-53-final-check/stderr.raw.txt)|
|native-one-54-final-status|status --project acceptance/20261018-governance-c/native-create-review/work|0|[stdout](../commands/native-one-54-final-status/stdout.raw.txt) / [stderr](../commands/native-one-54-final-status/stderr.raw.txt)|
|native-one-55-discussion-context|context --project acceptance/20261018-governance-c/native-create-review/work|0|[stdout](../commands/native-one-55-discussion-context/stdout.raw.txt) / [stderr](../commands/native-one-55-discussion-context/stderr.raw.txt)|
|native-one-56-tool-identify-final|tool identify|0|[stdout](../commands/native-one-56-tool-identify-final/stdout.raw.txt) / [stderr](../commands/native-one-56-tool-identify-final/stderr.raw.txt)|

## 交接入口

[handoff.json](handoff.json)、[正文哈希](body-hashes.json)、[来源与原始输入](source-input-index.json)、[命令索引](command-index.json)均保留。本作品全部文件、原始输入和冻结证据均未清理。下一阶段只凭文件恢复，先status/读原文与旧引文，再按新模拟授权修订5–6；本阶段未授予下一章或修订权限。
