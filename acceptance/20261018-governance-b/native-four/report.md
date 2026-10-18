# native-four 百章副本验证报告

本轮已完成当前构建下的恢复、95–100真实模型阅读、100–100历史版本流程、等价重登与事务提交，并将主副本暂停。主稿100篇正文与原事实完全保全。严格的原字节导出口径有一项产品限制：原生export会归一化各章边缘空白；本阶段另提供100篇原字节补充导出，不将它冒充CLI能力。文学审查范围仅95–100，仍有3份旧报告未被完整覆盖。

操作范围仅 `acceptance/20261018-governance-b/scale-hundred/work` 及本阶段 `native-four/` 的输入/报告、`commands/native-four-*` 捕获证据。未读取或改写封存作品正文，未改真实小说、其他阶段证据、产品源码、技能或Git元数据；没有代理、消息、Git提交、推送、上传或发布。未自动更新随附工具。

本轮使用主项目 cwd 和 `bin/ai-writer.mjs`。31次产品调用均经本阶段现有capture.mjs，标签唯一且均以native-four-开头；完整返回以commands中的stdout.raw.txt/stderr.raw.txt为准，result.json仅为过程元数据。当前Git HEAD为80c74f6ac725ea164c54bf42c361a053f58af903，主项目已有未提交改动；实际运行守卫摘要fd93a368c02475da18c9ea8baf1b5836d28e330edf817d47cbca15e969f79acb，31次前后均相同。它与doctor的runtime_id命名空间不同，不是供应链认证。

## 基线、旧候选及阅读

恢复入口为copy-manifest.json、hundred-prepare-v1/summary.json、hundred-rebuild-v2/summary.json和scale-hundred/handoff-v2.json。原副本为598份必要文件、11256809字节，原schema2/revision371；本轮开始时主副本schema4/revision376，state SHA256为2d7200a910f284201ff41ce90b0a38a6e123a69357a7c780287535f0048aef7e。100篇正文逐篇匹配handoff原哈希。

原事实snapshot SHA256：`2e97cb1de2f85178ce99b5e795746a0d79a60dd59bf5e9b0809c741421683f94`。本轮初始、独立区重登后、主提交后和暂停后均完全相同。

旧prepared会话ba9e9e55-5aab-49f7-a6bc-c29b0ab4d8bd绑定边界修复前构建c479c3f5485a2f937197cc9459d70cf95df58741cadb07e81668a1b0e28e568b。本轮native-four-02-old-commit按预期返回BASELINE_CONFLICT，主state前后相同，正文未变。完整冲突文件保留于：

`.writer/revisions/ba9e9e55-5aab-49f7-a6bc-c29b0ab4d8bd/conflict-e181db32-c101-4ff0-a8c1-e6c4f1217935.json`

其SHA256为ba823b7ce13cb124bc2d830a5643c35600b8d5ec13954545379701b3f1154330，记录旧/新构建与双方revision376，changes为空表示仅工具守卫冲突。随后明确持原令牌abort；旧prepared清单、候选workspace及更早db066ec9-0979-41ba-a9f5-28051cd757b5分支全部保留，没有刷新base/build/state绕过。

实际模型阅读为95–100六章全文。补充实读writer.json、五份设定、V13卷契约、100细纲、续部总纲、冻结规则对象、验证授权、模拟验证授权及旧100登记草案全部字段。旧草案长行曾触发工具单行截断，随后生成保留每个原字符的old-record-readable.txt并从头到尾分段读完，未把初次截断当已读。当前context原始JSON为99305字符，完整解析保留；26个长字符串与此前已读内容逐字对应并记录精确引用，其余完整字段在context-readable.txt中分段实读。导出JSON全部解析后逐项比较100个units及其完整source_hashes。上述大JSON的机器解析与文件哈希核对，不计作未读小说章节的文学阅读。

本轮没有重读1–94，不把context中的旧摘要/旧证据锚点、先前机械报告或原封存文学报告算作本轮复读。100等价重登后，在独立区又全文复读100并核其与初读稿字节相同。95–100连续性与文学观察见主副本 `审查/native-four-0095-0100-真实模型连读.md`；文学观察仅记录、不改正文。

## 精确历史生效与事务

新版本HUNDRED_RULES_NATIVE_FOUR_100的previous为HUNDRED_RULES_BASE；二者冻结对象和原始字节完全相同，SHA256均为23f3bed7e8014b4d5e4e6eeef876ed4ef87eb923a4be2a1f2e2c76b0578420e2。实读同一个内容寻址对象同时核对旧/新版；required_readings按物理路径去重，不表示少读旧规则。原规则未改字、未加剧情或解释。

|步骤|主revision或结果|证据标签|
|---|---|---|
|freeze同字节提案|376→377|native-four-07-freeze|
|登记模拟授权，允许discuss/plan/revise，仅100–100，无draft|377→378，stage=outline|native-four-08-workflow|
|impact historical/from100|revision_from=100；review_from=99；保留前缀1–99；间接范围100–100|native-four-09-impact|
|报告和授权已写主副本后stage|378→379；blocked_range100–100；impact_id cfec1fa2-9302-4edd-8255-bda004093399|native-four-10-stage|
|pending门禁|check为IMPACT_PENDING；export拒绝IMPACT_PENDING|native-four-11-pending-check、12-pending-export|
|begin|范围100–100，base_revision379；主revision不变|native-four-13-begin|
|分支rewind / publish / record|仅100失效；分支380→381→382；主稿仍379|native-four-14至18|
|实读review / check|95–100；机械通过|native-four-19、20|
|prepare|目标主revision380，6个待发布文件，无正文文件|native-four-21-prepare|
|commit|主379→380，事务完成、备份保留|native-four-22-commit|
|重复commit|unchanged=true，主revision及state字节不变|native-four-23-repeat-commit|
|暂停|主380→381，stage=paused；只discuss/plan，两个正文范围均null|native-four-25-pause|

99是承接实读起点，不是回退起点；全部前缀已用原冻结规则绑定。本轮用当前API实际验证了只授权100–100即可stage/begin/publish/重登/prepare/commit，没有扩大到1–100。历史影响报告 `审查/native-four-规则同字节历史影响.md` 和模拟作者证据均在begin前写入主副本并被带入独立区；不借分支里临时新增证据绕过基线。

新会话：`f0a93266-9b10-4e91-a2e5-55edc634b327`。
事务：`4a446d8c-2289-4a17-bc0d-524748c35339`，completed。
令牌、workspace和完整恢复信息保存于session.json/handoff.json，不在此重复展开。

重登使用当前context和record-template取得expected_revision381、新state来源hash与新版source_binding；仅从旧草案恢复实际summary/changes。三个人物、一条时间线、六个ledger更新逐项对照正文与承接；15条本章引文全部存在。没有照抄旧expected_revision或旧source_hashes。新journal字节SHA256仍等于原100章journal的5681a4160a8f54d003489f18fdf0339f0155c92d8fb576c686106474c45d7d7d，事实snapshot完全相同。

最终1–99完整登记对象逐项与本轮基线一致（涵盖旧绑定、source_hashes和正文hash）；100正文SHA256仍为6f7f439a1adf22655fc76510906bb88c9dd450a0051ea795d446485cae35c89e。生效区间为旧版1–99、新版100至未来。最终主state SHA256为fe6fb1339ebee9cbb7370ab786299ccfa3c17a9510f0010ed6777f1dc627fccb。

## 审查范围与最终机械状态

主提交与暂停后rolling_review计数完全相同：有效48、过期66；其中63份已有一个完整覆盖其旧范围的有效报告，3份没有完整覆盖。pending_windows为空只表示例行窗口覆盖，不表示所有旧报告或文学质量通过。新95–100模型报告在提交后及workflow暂停后均有效，暂停前后100条登记对象完全不变。

仍未完整覆盖的旧报告：

|报告|范围|原因与本轮边界|
|---|---|---|
|revision-a-最终25-42章模型知情审查.md|25–42|旧36/41/42正文hash已过期；本轮没有读这些章节，不重登记|
|revision-a-final-25-42.md|25–42|同上；保留原记录|
|final-review-overall-0001-0100-r371-complete.md|1–100|旧报告无来源依赖字段，与已提交修订范围重叠后失效；95–100不能覆盖其1–94|

分支check为52有效/62过期，主提交后48有效/66过期：提交使4份与100重叠的旧无依赖报告按保护规则失效，属于本场景要求保留的待复核；不在分支尚未事务提交时的数字上宣称全书已审。

最终主副本check机械通过：100登记、无未登记正文、findings为空、stale_units/changed_sources/impact_pending为空。主项目doctor正常。指定副本doctor退出1，仅因随附0.3.0工具声明支持schema1/2、不支持当前4，属于预期兼容性结果；随附工具文件完整且未更新。

原复制清单598份再次全部读字节核验：597份原hash不变，唯一改变的是正式流程写入的 `.writer/state.json`。原规则、100正文、旧journal、旧报告、随附工具等原文件均保留。没有搬整个档案，没有新增百章正文或101。

## 导出与失败记录

原生导出 `export-final/` 是新目录，包含manifest.json与manuscript.md，纳入1–100，排除列表和warnings为空。返回JSON与保存的manifest逐字段完全相同；100条源正文hash与原副本吻合，合订稿总SHA256为f579c2cb65c88864e93271c317021c6d49c5e10d4d7bbc916bd9e7ab70f7b3ab，实际文件与清单一致。

原生合订行为先trim各章：100段均为原正文trim后的全文，不能说逐章原始字节完全保留。例100源8896字节、合订章段8895字节，相差末尾空白。最小复现保存于export-byte-normalization-observation.md，未改源码。另建 `export-byte-preserved/正文/`，逐文件复制100原稿并读回Buffer全比较，100篇全部原字节相同，附独立manifest；明确标作验收侧补充导出。详见export-verification.json。

|失败/非零结果|处理|
|---|---|
|旧prepared commit，BASELINE_CONFLICT退出2|预期；保存冲突、持令牌abort、保留候选，新建当前构建基线|
|pending check退出1；pending export退出2|预期；不旁路，待正式事务后新目录导出成功|
|副本doctor退出1|预期旧工具兼容性；未自动更新|
|本阶段export-audit.mjs首次TypeError|辅助脚本误认raw.manifest；仅修本阶段脚本，改读units及单独manifest，重试成功，失败原文见helper-failure-export-audit-v1.txt|
|原生导出边缘空白归一化|严格原字节导出口径的限制/候选缺陷；保留复现、另提供原字节副本，不改产品|
|初次工具显示长行/大JSON截断|不是产品状态失败；保留原始文件，改用完整分段/逐字引用视图和全字段解析核对，未据截断输出作阅读声明|

summary.json记录31次产品调用的实际退出码、raw文件hash、状态前后hash、构建守卫与时间。所有实际产品退出码均符合场景预期。没有为通过检查改原state、删报告、扩授权或刷新旧候选基线。

交付：report.md、summary.json、handoff.json、final-body-hashes.json；旧记录、三条分支及事务均保留。当前任务暂停，不写101。本轮证明的是当前构建的局部模型恢复、精确生效范围和百章结构保全，不能升级为全百章文学复审、真人盲读、市场或正式发布验收。
