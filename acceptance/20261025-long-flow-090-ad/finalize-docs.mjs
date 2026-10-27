import fs from'node:fs';import path from'node:path';import assert from'node:assert/strict';import{fileURLToPath}from'node:url';
const A=path.dirname(fileURLToPath(import.meta.url)),j=n=>JSON.parse(fs.readFileSync(path.join(A,n))),v=j('verification.json');assert(v.ok&&v.complete&&!v.formal_release_acceptance);const audit=j('command-audit-final.json'),parity=j('build-parity-g-final.json'),scope=j('g-scope-negative-verification.json');
fs.mkdirSync(path.join(A,'harness-history/final-documentation'),{recursive:true});fs.copyFileSync(path.join(A,'README.md'),path.join(A,'harness-history/final-documentation/README-before-final.md'),fs.constants.COPYFILE_EXCL);
const report=`# AD 0.9.0 独立长篇扩大实跑：完成记录

核验完成时间：${v.at}。本轮48→60章、正文542,804汉字，新增49—60共161,066汉字；普通新章≥12,000，52/56/60章≥16,000。最终主区r${v.revision}/generation8。验证结果见[verification.json](verification.json)，全部原始命令、公开事件、分段、失败、旧稿、checkpoints、报告与哈希保留。本轮不修改现有真实作品，不提交、推送或发布。

## 已完成的真实流程

1. 先实读规划，再以四组三章写作49—60；50/53/56/59各在写前模板与前两段后真实退出、同ID恢复。原片段在首次完整稿各一次有序合入。后续合法旧章修订不强行保持最早片段文本。
2. A称谓、D第58章说话人发现后正式修订；E有意修改48/54/55/56/60章，六份来源按版本、区间和影响分析处理；同一修订在51、56后两次正常退出和同ID恢复，最后48—60共121页在最终登记后返回，主区/候选一致。32来源、31区间、24消费绑定保持真实；冻结观察O_BOX_PAINT不改。
3. F新会话全书复读发现21章“送过去只隔两条街”与既有近邻冲突，仅将该处改为“两家门面”，实际21—60尾部40单元重登。最终登记后21—60共304页严格返回，正式事务完成；169个发布目标与2份旧备份核验通过。49购书回忆补核15章后确认为误判，正式retained，没有49正文修改或应用绑定。
4. F原距离意见采用证据9/21/42，而真实修改仅21。旧工具把未改参考9也强制纳入21—60提交，触发真实REVIEW_PUBLICATION_MISMATCH。已修复：校验归档前后及当前参考完全未变，真实范围内记录匹配发布，仍要求实际正文变化；不增加必填参数、不删除证据、不重做采用、不使用acknowledge绕过。
5. 新源码实际npm test 229项：227通过、0失败、2项Windows符号链接权限跳过；新根doctor通过。旧代码复现red及5项针对回归保留。新ZIP真实解压，327源码/发布文件和66安装受管文件匹配；显式更新独立副本至generation8，60单元/正文、snapshot、来源、旧意见及提交不变，39未选本地文件保持，11更新目标和10旧备份一致。
6. G使用作品随附generation8入口，新会话完整读1—30章143页并正常退出；实际同ID恢复核23,615文件与151冻结对象后，再完整读31—60章244页。当前全书387页覆盖及整章先后顺序核验通过。新全书报告绑定当前60章，原距离意见成功apply/verify：reference_units=[9]、target_units=[21]、after_units=[9,21,42]；旧8意见仅再verify，原采用/应用/提交保留，13条optional保持原状。
7. 有效drafting阶段允许draft，范围1—60，61计划在G入口前已存在且未消费；context61与record-template61各真实退出2/ACTION_OUT_OF_SCOPE，状态字节不变，无61正文。不是用paused或缺计划错误替代范围拒绝。
8. 实际导出当前60章草稿，逐字节核manuscript、manifest与正文；36份未登记历史变体留在原处并按预期排除，保留导出警告。最终六个产品命令通过，旧六组45,716文件按原封存只读复核通过。

## 缺陷修复和构建

新包仍为未发布的0.9.0候选：[ZIP](reference-evidence-fixed/ai-writer-0.9.0.zip)，SHA256 0e4ca99dc86cc8d5c794dc3072aac22394227c61bca1d3dcdfffe75dd13ec48b。content_id ${parity.content_id}；runtime_id ${parity.runtime_id}。快速入门、使用手册、审查登记说明、CLI帮助及开发发行说明已补齐。旧gen7包和active-tool.json保留作历史；G入口配置为active-tool-generation8.json/cli-g8.mjs。

新增章节创作和F距离正文修订实际发生于gen7；gen8验证的是显式工具更新、新会话全书实读、同ID恢复、原意见闭环、范围保护和导出，不能冒称gen8重新写了60章。无内置引擎源码变化，未重复跑engine套件；本轮没有Linux/macOS CI或正式发布验收。

## 失败和纠正保留

命令审计收录${audit.cli_count}次产品CLI、${audit.native.length}次原生进程；非零不抹除，包含预期拒绝、普通参数/路径或辅助脚本错误和环境失败，按原始事件及交接区分。F续程真实容量失败exit1后，完整checkpoint及无未完命令核验，再同ID恢复；没有改写为正常退出。E基线387页覆盖通过，但额外严格返回顺序未过，不能列作严格顺序通过；后续E尾部121/F尾部304/G全书387另有通过证据。

文学判断的误判也保留：49回忆不应按后来另一次书店行程理解；正确课堂为18/24/30/38/48/57，第三课在30，31是周四回顾。F2及根旧报告的31定位错误已在g-course-location-root-correction.md撤回，没有反向修改正确正文。E56登记曾实际成功却漏把已收2改8，之后在同一修订正式回退重登纠正，原成功错误输入仍在。

根辅助脚本的Copy-Item前版保存失败后继续、事务修订号327误写328、Node -e多余括号导致备份未生成，以及容量退出后短暂错误报活跃等，均在对应控制器/处置文档如实记录，不伪造前版或成功证据。详见ROOT-CONTROLLER.md、ROOT-F-CONTINUATION.md、ROOT-G-CONTINUATION.md、f-capacity-recovery-disposition.md、harness-history/20261025-f-transaction/disposition.md。

## 验收边界与记录入口

这是模型知情自检和独立工具流程验证，不是认知阅读证明、真人盲读、市场验证、作者定稿或出版。草稿导出保留quality_review要求；历史变体警告是预期行为。未运行百章新扩展：本轮从48扩大到60章，不能写成已完成100章。正式发布验收为false。

当前stale_units/changed_sources/impact_pending均为空；来源列表仍保留大纲/单元/0033.json这一份editing-entry-only-not-published入口差异，selected_version仍为CR33_RECALL_ID_V2、matched_published_ranges为空，不能说全部来源编辑差异为零。滚动审查旧59份stale均有当前覆盖，未覆盖stale与pending_windows为0，不删除旧报告“清零”。

- [全部门禁结果](verification.json)
- [完整命令审计](command-audit-final.json)
- [新构建最终一致性](build-parity-g-final.json)
- [原9条意见闭环](g-root-final-commands-verification.json)
- [全书返回覆盖](read-proof-g-final-current1-60.json) / [章节顺序](read-order-g-final-current1-60.json)
- [有效61范围拒绝](g-scope-negative-verification.json)
- [最终草稿字节核验](g-current60-draft-export-byte-verification.json)
- [旧六组封存复核](prior-seals-final-verification.json)

AD文件清单封存与独立复核在本文保存后进行，以目录内evidence-manifest.json及目录旁-seal-receipt.json为准；本文不预填封存文件数量或SHA。封存后不再向AD写入。
`;
fs.writeFileSync(path.join(A,'FINAL-REPORT.md'),report,{flag:'wx'});
const overview=`# 0.9.0 AD：48→60章扩大实跑已完成

本轮独立副本60章、542,804汉字；新增49—60共161,066汉字，普通新章≥12,000，52/56/60≥16,000。最终r${v.revision}/generation8，验证完成时间${v.at}。现有真实作品未改，未提交、推送或发布。

发现并修复一处真实工具缺陷：已采用跨章意见的未改参考章被错误要求纳入实际修改范围。保留原9/21/42证据和原采用，真实只改21；新构建下原意见正式apply/verify通过。源码实际229项测试：227通过、0失败、2项Windows权限跳过，根及作品doctor通过。

已覆盖四轮分段真实首停/同ID恢复、跨卷旧线、多处旧章修改、两次修订会话恢复及尾部重登；新构建显式更新后又完成全书387页返回、新会话和同ID恢复、原9条意见复核、有效61范围拒绝与当前60章草稿逐字节核验。旧六组45,716文件只读复核保持，原13条optional与49误判retained保持。36历史变体仍存，导出按预期排除并有警告。

新增创作与距离正文修订发生gen7；gen8完成更新、当前全书实读和闭环，未冒称新工具重写60章。模型自检不替代真人或文学正式验收；草稿仍需quality_review。仅本地Windows验证，本轮无Linux/macOS CI、引擎改动或正式发布验收。

阅读[完整完成记录](FINAL-REPORT.md)、[机器核验结果](verification.json)、[全部命令审计](command-audit-final.json)、[真实缺陷及回归](reference-evidence-fix-design-and-repro.md)、[新包](reference-evidence-fixed/ai-writer-0.9.0.zip)。原失败、误判、报告纠正及历史README均保留；历史文档中的“未完成”等是当时现场，由本README、FINAL-REPORT和verification当前结论覆盖。

封存清单为evidence-manifest.json，独立回执位于本目录旁20261025-long-flow-090-ad-seal-receipt.json；只有实际生成并复核后才认定封存完成，本文不预填结果。
`;
fs.writeFileSync(path.join(A,'README.md'),overview);fs.appendFileSync(path.join(A,'reference-evidence-fix-design-and-repro.md'),`\n\n## 最终状态更新（${v.at}）\n\n本缺陷已在generation8实际独立作品中使用原采用与原提交完成apply/verify，全书387页新构建复读、有效61范围拒绝和草稿导出核验通过。229项源码测试为227通过、0失败、2项Windows权限跳过；仍为未发布开发候选。以上覆盖本文早期“尚待全量/实跑”等当时状态，原始证据保留。详见FINAL-REPORT.md及verification.json。\n`);console.log(JSON.stringify({ok:true,revision:v.revision,report:'FINAL-REPORT.md',scope_negatives:scope.commands.length,readme_history_preserved:true}));
