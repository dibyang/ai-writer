# S检查点09：D已退出，R6正在进行

2026-10-20约04:06 Asia/Shanghai。目标仍18章完整当前稿、最终新Codex全18实读/导出/封存，未完成，不可结束。产品仍最终V4内容730a...，Root321源输入/12文件从双175/176+doctor通过后没有再改；不要无理由重跑整套或更新工具。现有作者作品/原Q未动，无Git提交推送。

## D结束与新问题

codex-d正常退出0，1589064ms约26.5min，thread01a155a7-fb2a-7da1-a70a-70e318638fd8，PTY49389已结束，不再poll。已真实补当前10—15前缀、prefix-r5-review，budget16所需26633字符/低/差1/精确同packet通过，写并登记16—18到主r50。新借还T_CURTAIN_RETURN和邻里T_NEIGHBOR_TELLING已按实际完成；D报告记录15:00前还布、许14:58报回铺。全文当前约7万Han，最后18仍有硬问题，不能当文学通过。

D登记18后连续实读13—18发现：
1. 15已写鞋盒送回房，16第70/72/107又当昨天余盒未回房，17第101自述沿用；16登记characters.许舟也说回家收鞋盒，需同步。
2. 18第79“自己关好门边留出的空处，请他进来喝水”动宾/进门动作病句。
详证审查/S-D-待保护修订-0016-0018.md，旧尾段报告审查/S-0013-0018.md，交接/S-D-完成.md均保留未修结论。D没越权改已登正文，没写19/导出/封存。

## 目前R6（父Codex，不是native新进程）

**已begin并rewind16**：主现在r51/18章/保护占用；session **4030288b-5f3c-4381-aed3-58af7c2db796**，独立区：
`scenario/雨棚后的灯/.writer/revisions/4030288b-5f3c-4381-aed3-58af7c2db796/workspace`
工具gen3不变，scope16—18，branch rewind后r52/仅追踪至15，正文16—18仍在。脚本**revision-six.mjs**已写好，begin/edit已真实运行，其余未跑。

已在保护区读取原16 50—119再120—122、17 85—120、18 65—98，用于最小修订。**r6-text-edits.json五处已实际edit**：16母亲问改为盒里旧鞋带、许说拢好旧鞋带、下午进房拢鞋带扣盖再取布（保留15送盒回房）；17自述改出门前拢鞋带、昨天已搬回房以为完事；18改自己把门再推开些请进。不改15、不造另一盒、不改借期/物件主链。r6-edit-verification.json及r6-read-before.json保存新SHA/读前窗口。

**下一步尚未做：按13→14→15→16→17→18连续完整FastCtx读保护区新正文**，准确续Partial；13约319行需两页，其余≤170。然后逐章template16/17/18、实读真实replay草案、修必要登记（16人物鞋盒表述；其它summary/timeline/evidence按实际是否含错），写各自`审查/S-R6-重登-0016/17/18.md`（各draft SHA/真实6项），preview/record顺序。不可跳过字面核查或手换source_hashes/_replay。

revision-six的接口：
- `template N`需前面登到N-1，会新取`.writer/drafts/s-r6-replay-N.json`。
- `preview N [tag]`读**S/r6-record-edits-N.json**（需先创建，空数组也要有），格式patches `{at:["changes","characters","许舟"],old:"实际旧片段",new:"实际新片段"}`或`{at:[...],value:...}`，只准summary/changes；自动按本章实际text-edits替换旧引文字句。填replay_review指`审查/S-R6-重登-00NN.md`。
- `record N [tag]`用对应已捕获reviewed输入；不覆盖wx标签。
- 三章后`diff`写r6-semantic-diff.json（仅规范化16—18证据SHA及实际修句quote），父实际读差异后写**r6-approved-semantic-diff-paths.json**（精确允许path数组；不能不看全准）。
- 写总报告**审查/S-R6-0013-0018.md**绑定真实完整新六章阅读与前后SHA；`finish`核允许diff、前1—15正文不变、review13—18、prepare/commit/恢复trial，派生**分段/0016-r6、0017-r6、0018-r6**精确合章、原段稿不变，写r6-current-segments/r6-tail-repair-verification。所有这些现在都待办。

完成后要更新最终verifier Map加r6-current-segments及旧段检查、必要结果ok；给final prompt补最新R6入口和16/17/18新SHA，旧D完成只是修前。再新native codex-final-read（目前未启动）全1—18实读及finish-flow。R6不可当已修完，不要直接跳seal。

## 验证包装新修复（产品未改）

D嵌套item36把正常CLI--help文本JSON.parse报错，原d-recall-help CLI实际exit0；父已保留common-before-help-text.mjs并使common.run成功--help返回string，其他JSON保持object，helper-help-output-verification.json实测通过/state不变。
又保留common-before-soft-error-channel.mjs，修common.run退出1的ok:false JSON从stdout读、退出2异常从stderr读；用原bad16输入新label parent-preview-false-channel-check实测，helper-soft-error-channel-verification.json通过/原输入未动。默认expected0仍严拒非零，不弱化保护。execution-guide补充这些和custody即使只换地点仍完整holder/location/condition。
D item76首次d-manual-preview16因custody缺holder退出1/state未变，修新输入后通过；错误均保留，没有改产品代码。

## 原生阅读证明与行数

父已实际运行`node verify-native-read.mjs codex-d 10 15 native-d-prefix-read-coverage.json`成功：6章1009个非EOF行逐字匹配当前稿，真实thread ID一致。报告的1015含每文件EOF空分隔项，多6不是漏读，详line-count-method-note.md及proof calls(first/last/lines/matching)。
verify-native-read现支持label/from/to/output参数，默认final仍写native-final-read-coverage.json；每个原生FastCtx返回的行文本必须与当前文件同编号文字相等才计覆盖，不仅数行号。最终还没跑。**Source产品测试仍321冻结字节不变。**

之后：最新R6手册/最终prompt→native全18→finish-flow review/pause/19拒绝expected2/discussion/check-doctor/export→父native-final-read证据/verify-current-manuscript（需加R6）/原Q最后verify/capture-local-status/直接audit-commands（别包S/run自见running）/最终README与verification→seal+只读verify→外置回执。不能seal后再写S。

Memory最终仅MEMORY.md183，rollout01a14352-7ed0-7ce0-b512-67b16aa8ceea；没写memory。进度≤60秒一次、等待≤60；已向用户说明R6约10—15分钟，之后全18终核再约15—25。
