# 第三批C：跨章复核、登记减负与意见闭环实现约束

更新日期：2026-10-19。**C批AW-05/06/08已实现并完成本批本地验证**，原交付版本0.6.0；当前0.7.4继续包含这些能力。见[C批最终记录](../acceptance/20261018-governance-c/README.md)及[当前状态总览](authoring-governance-status.md)。以下保留C批实现细化和schema5兼容依据；D的工具更新后续已交付，不再作为当前未实现项。现有作品不自动迁移或改稿。

## 背景、目标与非目标

已有差量登记、六章滚动复核和独立修订事务。本批补齐章节功能的证据表、可核查的登记草案，以及每条意见的原文—取舍—实际修改—复核链。减少机械抄写，保留语义复核责任。不计算文学重复率，不替作者选风格，不用机械绿灯或合成接口报告冒充模型实读。

## 协议和兼容性

C批0.6新作品当时默认schema5；当前0.7.4新作默认schema6，保留本段的baseline/journal、旧source_hashes、来源版本和review_workflow索引。0.5会忽略新索引，故实际旧解析器拒绝5；旧作品不自动迁移，已有4仍可review-workflow preview/enable，保存原state字节、核原事实链、提升schema和revision并建立空索引，不补造历史意见。1/2先治理迁移3，再protection enable4；5→6及完整随附工具更新分别按[更新手册](tool-updates.md)显式执行。

## 模块、接口与权威

新增lib/review-workflow.mjs，复用longform.reviewData/dependency/reviewStatus、journal原差量、revisions的原基线/已发布事务。state.review_workflow保存reports、issues、events、operations；正文、报告和事件采用内容哈希冻结对象，由state引用校验。旧普通review保持兼容；带功能表或意见的review需要CAS和operation_id，业务revision只加一次。原工作报告改动会使当前覆盖过期，冻结原报告/原文及旧意见仍留存。

|接口|行为|
|---|---|
|init --mode long|仅明确新长篇意图时预置分卷模式，正文仍需有限授权与卷契约|
|long-enable-preview|只读校验旧链、估算新journal体积，不产生迁移/备份|
|record-preview|与record共用纯验证，列缺项、差量与未变项，不写state或journal|
|revision replay-input|原独立区回退后按base-state和真实journal恢复旧summary/changes，填本次context哈希；不自动确认语义无变化|
|review-template / review|模板与功能表、逐条意见；模型填写实际判断和引文，工具仅核范围/字节/字段|
|review-issues list/resolve/apply/verify|查询、取舍、已提交修改绑定、当前版本模型复核|
|review-workflow preview/enable|只读预览或显式备份4→5|

context/template/preview/replay可选out仅写.writer/drafts下新JSON，不覆盖、不推进业务revision，受会话占用与令牌保护。该目录不作为正式消费来源，也不随修订发布。

## 数据及状态机

功能表每章五项goal/obstacle/choice/consequence/relationship_change。observed须引文；unknown/none须原因。比较须列相似结构、实际不同的收益、保留项、可选调整、不确定性和完整阅读边界；每个比较章节均有证据。它们是模型判断，不混入事实ledger。

意见保留稳定ID、correctness/continuity/readability/optional_style、严重度、置信度、原句/原报告/版本。optional_style只能suggestion，不自动升级。状态open→adopted/retained/deferred；仅adopted可applied，实际复核后verified或needs-recheck。保留不等于修复，采用不等于已改。新稿使旧verified视图变needs-recheck，原事件不删不改；重新处置绑定新的当前稿。

decision_actor=author必须冻结真实原话；agent-within-authorized-scope绑定当前治理事件，采用须revise覆盖意见范围，保留/延期须允许讨论。作者采纳记录本身不扩大正文权限。只有审查授权时不能借处置改稿，也不能伪填成作者逐条采用。

## 时序、幂等及异常

补充边界实测后收敛：作者选择存author_choice，代理同名重记仍保留，一般授权不能翻转采用/保留/延期；新稿有效实读可重新verify，保留原实际修复而不制造第二次改字。分支意见另核session scope；扩展读稿不扩大处置范围。覆盖读取只承认state已索引的结构化审查，发布失败孤儿列unpublished_records，不计valid或已完成窗口。空摘要预览也先列授权阻断。

结构化review在短锁内读取当前revision、校验实际正文/引文与报告，再保存冻结字节、不可变记录和state索引。意见每次处置CAS加revision，稳定operation_id相同输入返回历史结果，异输入拒绝。新对象写入失败可留下未引用孤儿，state未切换则不生效，旧权威不覆盖。

采用后走已有独立修订区、完整尾段重登与复核、prepare/commit。与原设计“发布时同批绑定意见”的细化：可以在分支保留取舍，但**applied仅在实际主事务提交后另一次CAS绑定**，核已完成事务的旧新备份、采用时旧稿与当前新稿、至少一处对应原文实际变化。避免把尚未发布候选叫已应用；此登记不改正文/事实，不绕过B事务。verify再绑定一个当前有效、完整覆盖意见章节的模型报告，记录复核者与结论，不冒充作者定稿。

replay-input原数据来自会话固定base-state和journal，恢复原变化而非召回切片。草案绑定旧记录与当前正文；必须真实重核摘要、人物、时间线、ledger、引文及下游，并保存报告。旧引文在新稿消失、来源/正文漂移、revision过期仍拒绝，不自动刷新哈希。正式record冻结重登复核依据。

## 回滚、迁移与风险

只预览可直接停止；候选中止保留原文件；正文发布故障用B recover，遇第三方字节保留三方。已成功发布不复制旧state撤销，应新建逆向修订。意见修正新增事件，冻结报告/原文与历史不自动清理；当前只支持本机文件系统，不提供共享盘/跨机、作者身份认证或任意编辑器零竞态保证。

主要风险：代理误判作者语义、把完整表当文学通过、自动草案误当已核、旧客户端忽略闭环、意见太多造成恢复输出膨胀。对应保留真实原话和角色、模型实读/机械边界、报告绑定与正文SHA、schema5交叉矩阵、status/context默认只给8条未决摘要。可选建议不自动阻断新章。

## 实施与验收方案

先协议和共享验证，再功能表及意见状态，最后技能/手册和原生实跑。程序验证覆盖T19–23、T28–29及原有A/B回归：假引文/不全范围/可选升硬拒绝；预览零写；草案保留未变项且改字后过期；仅审查不可改；采用/保留/延期/实际提交/复核/再次变更全链；历史及篡改保护；旧0.5实际拒绝5。

最终冻结后运行npm test、doctor、smoke；未改引擎不借用旧引擎结果。另建六章作品，由不同原生Codex进程文件恢复，实际比较相似结构与不同收益；再在有限授权内修改并用replay-input补登、处理意见、重新复核和导出。百章采用必要文件副本，核所有原始字节与证据锚点并实测状态/上下文/登记字段成本，明确实际文学阅读范围，不把副本等价测试称新写百章。保存请求、源码快照、输入、原始输出、失败及修复、保留分支/事务、最终封存清单；真实作品只读前后哈希核对。
