# D批：本地工具更新与长篇整合验证

日期：2026-10-18。基线：`257c08ad6c6a74feb7f60df7ce7075393a812c66`。0.7.0本地候选的产品验证已完成，新作品默认schema6，旧作品不自动迁移。结果见[最终验证](final-verification.json)及`evidence-manifest.json`；原生记录、全部失败尝试与同期真实目录差异均保留。没有提交或推送。

## 本批实现

- 完整轻量包：13个运行文件，以及包内技能、必要手册、示例、来源与许可，共61个受管资源；不复制主项目引擎、作品或Git。
- `tool update-plan`只读核本地来源、目标、定制、规划权限与业务就绪；schema5单独`tool enable`至6，再重新计划更新。旧0.6解析器拒绝6。
- 复用B文件发布器及事务目录，逐文件备份、state最后切换；pending阻断普通入口，外部`tool updates/recover`完成或回滚。不自动抢锁、覆盖第三方版本或清理备份。
- 根AGENTS/技能/手册笔记默认保留。受管手册仅显式选取且旧基线可信、无定制、未被章节消费时可更新；原版基线跨轮保留，不能追认作者笔记为原版。
- generation、实际加载运行文件、全局revision和稳定operation_id共同保护恢复与幂等。没有作者身份认证、自动合并、自动联网更新或跨机保证。

快速入门及使用手册已同步；[更新手册](../../docs/tool-updates.md)、[本批实现约束](../../docs/authoring-governance-d-implementation.md)说明接口和边界。

## 最终候选与失败修复

最终产品内容ID：`8a9e937e5942887d25339fe5189a8f96374df389215721d82f0a6aac9e974167`。主项目与最终随附包的公共受管内容相同，profile/来源单列。内容指纹是磁盘观测，不是供应链签名。

初次候选`cf999dbe85fe5a0ad41382078c10c900402bfe2a82905811a715ae5c294469b9`通过主要保护后，真实CLI另复现“正文已锁外改动，执行会拒绝，但计划仍显示可更新”。修复将业务就绪/授权/活跃修订检查前移到只读计划；`stale-preview-v1`保留复现，`stale-preview-v2`保留修复对照，最终包重跑全量回归和中断矩阵。

开发失败包括默认协议断言、旧修订恢复入口被误挡、包内许可诊断，以及未替换文件的第三方改动未报冲突；均有开发日志和后续通过记录。Windows临时目录占用使两次清理失败，测试清理改为有限异步重试。辅助脚本漏令牌、括号错误、Buffer误序列化及旧CLI退出码预设错误均与产品失败分开记录，原失败材料保留。

## 自动与真实CLI验证

| 范围 | 结果/记录 |
| --- | --- |
| 最终源码回归 | `final-tests-1`：145项，144通过、0失败、1跳过；普通沙箱不能创建文件符号链接 |
| 主项目诊断/烟测/技能格式 | `final-doctor-1`、`final-smoke-1`、`final-skill-1`通过 |
| 每个发布边界 | `tool-faults-v2`：57个位置，分别完成/回滚，114个场景通过 |
| 补充异常 | 同矩阵另5项：验证末尾中断、ENOSPC注入、第三方工具字节、验证副本变化、正文漂移 |
| 旧在途进程 | `old-held-v2`：实际0.6进程更新前加载并读5，更新后写入报TOOL_BUILD_CHANGED，state不变 |
| 事务发布前中断 | `pre-transaction-v2`：exit98，原工具/state不变；显式解遗留锁后重试原输入，代次只加一次 |
| 路径保护 | `path-safety-v2`：经单命令工具放行，在D夹具真实创建junction与硬链接，分别拒绝；不改全局设置 |
| 只读原封存核验 | `prior-c-seal-check`、`hundred-original-check`；原C封存和百章源均只读 |

`commands/`保存原始输入、argv、stdout/stderr、退出码、前后state和运行文件观测。矩阵保留标准prepared事务及全量输入/状态记录；临时克隆逐字节核验后清理，不重复保留114份相同备份。每次非零结果均保留，最终审计汇总，不抹掉失败重试。

## 实际Codex会话

启动器为本机Codex CLI，`codex-cli 0.163.0-alpha.10.2`；通过既有`scripts/codex-acceptance.mjs`实际启动，未用脚本替身冒充模型阅读，未创建聊天或子代理。每个进程保存request、完整events.jsonl、stderr、final与process-result。

1. `native-update-prepare`：逐字节复制封存C小说358个文件，完整实读六章，先登记结构讨论/无正文范围。未来纸样备忘仅candidate/from7；根三处定制保留。显式5→6，旧0.6拒绝；刻意exit97停prepared，state及六章未半更新。交付在[session-one](final-integration/session-one/report.md)。
2. `native-recover-integrate`：只凭文件恢复冻结事务至generation1，再显式更新最终构建至2。第3章只将“簿子”明确为“借物簿”，工程控制不冒充文学优化；3–6在新独立区实读重登，A提交、旧B真实CAS冲突并abort。可选意见apply/verify、旧重复字意见重核，retained/deferred不升为修复。最终完整六章阅读覆盖，revision44，正文暂停。对应6处证据版本SHA及1处quote合法更新，事实字段不变。交付在[session-two](final-integration/session-two/report.md)。
3. `native-hundred-update`：仅在百章必要文件副本更新工具，完整实读95–100并回查相关旧章片段；100正文、100journal、完整原units/消费来源、snapshot不变。最终schema6/revision378/generation1，正文暂停，第101章越权调用拒绝。33条产品命令与交付见[百章报告](native-hundred-update/report.md)，不计作本轮新写百章。

这里的模型阅读是知情验证，不是真人盲读、全书文学验收、作者定稿或市场验证；脚本只能核结构、绑定和字节，不能裁定文学重复或语义净收益。

## 证据布局与重放

- `sources/baseline`及`candidate-*`保留源码阶段；最终完整源码另存`sources/final-source-v2`，`final-source`保留基线差异发现前的完整快照。两者仅包外设计状态说明不同，61个产品资源不变。早期快照遗漏的7个未变包资源由`sources/common-resources`补全，每个原始字节都与基线Git对象和当时CLI文件清单SHA一致；没有改写旧快照。
- `fixtures/tool-0.6`和根`tests/fixtures/tool-0.6`逐字节来自基线提交，不靠浅克隆运行时历史；原旧工具/新包、计划、旧/新备份、独立验证副本和失效历史保留。
- `tool-faults-v2`是最终包的119个故障场景与482次产品CLI；v1是前一候选证据，不能替代最终结果。`old-held-v2`、`pre-transaction-v2`、`path-safety-v2`和`stale-preview-v2`是补充对照。
- `final-integration`保存六章副本及两会话交接；`scale-hundred`保存显式必要文件副本、原字节清单和迁移交接。原C、原百章与真实作品均只读，未借用其旧通过数计作本批新测试。
- 原始字节用直接copy/write Buffer保存，生成后立即校验；JSON索引与源码字节分开。原生第二会话的误序列化失败产物留在其audit-attempt-one，正确副本另建raw-v2，不将错误副本当来源。

所有重放都应使用新标签/新测试目录，不能覆盖本封存或指向真实作品。封存后只读运行`node acceptance/20261018-governance-d/seal-evidence.mjs verify`；输出记录写到本目录外。

## 真实作品基线的同期变化

第一次最终审计严格比较真实作品整目录时未通过，失败原件在`commands/final-audit-1`；不能把它删掉或改称整目录未变。随后只读重算，`protected-before.json`为启动时517文件，`protected-after.json`为590文件，`protected-diff.json`记录94项差异（15修改、76新增、3删除）；正文/卷纲哈希未变。变化主要是0.6工具/技能/文档、schema5追踪、升级授权与说明、Git缓存；当前真实作品工具为0.6，D交付为0.7。

本任务记录中没有产品CLI指向该真实目录，工具与验证写入限本仓库/D夹具；本任务未执行该目录升级或回填。仅凭哈希不能归因到某个会话，故不替其他工作恢复旧文件。最终产品审计将本项保留为`protected.unchanged=false`的独立观察，不把它当作产品失败，也不声称整目录未变。原C及原百章仍须严格按封存/复制清单核同。

百章会话另观察到主项目包外`docs/authoring-governance-design.md`变化：是主会话同步设计状态及澄清本轮边界，未变61个受管产品资源。模型报告保持其独立观察原文，主会话在此补充执行上下文，最终源码快照另存不覆盖。

## 最终审计与封存

[final-audit-v2](final-audit-v2/verification.json)独立检查最终145文件源码快照、61文件安装包、全部已采集输入/state及构建命名空间、两份作品的真实新入口、阅读覆盖、意见有效状态、原C/原百章源。真实目录差异完整保存在该审计的protected-observation.json；最终JSON明确unchanged=false，正文/卷纲变化为空，指向该目录的本轮产品命令数为0。

所有最终验收都针对内容ID `8a9e937e…`；前一候选的通过不代替最终包。基本回归的1项文件符号链接跳过仍保留，额外junction/硬链接实测不冒充该测试已执行。未改引擎，不借用旧引擎测试数；未做Linux/NFS、物理断电、跨机、真人或全书文学验收。

封存目录内所有文件按SHA-256列入evidence-manifest，清单自身除外；只读复核收据在相邻`../20261018-governance-d-seal-verification.json`。封存后不再改本目录。Git保持本地未提交，本轮未自动迁移实际作品，未推送/发布。
