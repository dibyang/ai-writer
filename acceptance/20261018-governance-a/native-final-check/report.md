# 最终 A 候选：原生 Codex 回归过程报告

日期：2026-10-18（Asia/Shanghai）。结果：本轮要求的 A 流程与保护均通过，保留一项文档提示残留；未改实现。完整机器摘要见 [summary.json](summary.json)，逐命令原始证据索引见 [commands-index.json](commands-index.json)。

本轮在当前原生 Codex 会话中实际恢复任务、准备真实输入、调用最终主 CLI、写出并回读微型正文。共31条产品命令：28条退出0，3条预期拒绝退出2；无输入错误、无重试、无意外产品命令错误。24项证据一致性核对均为true。这些结果只覆盖本轮流程，不代表文学质量或产品全面验收。

## 入口、读取和写入范围

开始前读取当前 writer-project 技能、快速入门、使用手册，另读取 workflow 命令说明；实际写作前读取 writer-novel 技能。没有创建子代理。

本轮31条产品调用全部使用当前主项目的 `bin/ai-writer.mjs`，每条都包在指定的 capture 命令中，标签均为 `native-three-` 前缀。capture 保存 raw stdout/stderr、真实子进程退出码、构建指纹、输入快照和可用的 before/after state。没有通过导入 lib 执行或替代产品命令；一次性 Node 片段只准备本阶段资料/输入、读盘点与汇总本阶段证据。

调用模式：`node acceptance/20261018-governance-a/capture.mjs native-three-唯一标签 node bin/ai-writer.mjs ...实际参数...`。

受测六章作品实际位于 `acceptance/20261018-governance-a/works/纸灯札记`；项目根 `works/纸灯札记` 未发现对应文件。新作品仅由最终主工具 init 创建在本阶段的 [最终回归微型作品](最终回归微型作品)。本轮写入只在本阶段目录及 commands 下本轮31个标签目录；已有 request/events 由宿主保存，未改写。

没有改代码、手改 state、替换来源哈希、迁移、升级旧副本、提交或推送。未写原六章作品、前轮微型作品及 `D:/work/小说/dzkxqxx`。

## 六章作品只读恢复

`native-three-six-status` 实际返回 revision=12、schema=3、registered_count=6、next_unit=7，当前任务是“暂停正文，先讨论全书总纲”。stage=structure，allowed_actions=[discuss,plan]，draft_range/revise_range 都为null；stale_units、changed_sources、未登记正文均为空。宗门方向与技艺路线已确认，小盾仍为候选。

`native-three-six-discussion` 成功返回 purpose=discussion，无第7章细纲要求。随后实际调用 `context --purpose draft --unit 7`，`native-three-six-draft-denied` 返回 ACTION_OUT_OF_SCOPE、真实退出2。next_action 原样为：

> 按当前任务和范围执行允许动作（discuss、plan）。可用 workflow show 查看；只有作者的新明确指令才可更新范围。

提示只列当前允许的discuss/plan；没有建议写第7章或自行扩权。没有创建第7章细纲或正文。

## 新微型作品的正式指令与有限试写

`native-three-init` 使用当前主工具创建 novel、schema3 的独立作品，初始不授权正文。完整作者新指令逐字保存为 UTF-8 的 [研究/本轮作者原话.txt](最终回归微型作品/研究/本轮作者原话.txt)，SHA-256为 `ebb74d9d973b83e035b9a56cf7c58ba5904d28a0791d32e4e101ad1333df2930`。没有消息ID可用，locator 如实说明来自本轮用户完整新指令和本地第1行，未编造ID。

先实际 `workflow show`，从返回的workflow字段构造 [inputs/trial.json](inputs/trial.json)，没有把包含decisions/note的governance视图当成输入。正式 `workflow set` 成功推进revision0→1，stage=trial、draft_range=1—1、revise_range=null、allowed_actions=[discuss,plan,draft]。停止条件写明：只写第1章300—450正文汉字；登记/check后复盘动作、人物语气、候选边界；正式转总纲讨论，再验证讨论成功/续章拒绝后正式全部暂停。

planning.structure 从此保持deferred，refs为空，未决项为远期全书骨架、全书终局、结尾赠物。原因如实保留作者“先有限试写并复盘，再只讨论总纲”的安排。没有伪造adopted；volume保持missing，未启用分卷。

两项选择分别通过正式decision set保存，均绑定同一真实原话：

| ID | 主题 | 状态 | 采纳/候选 | revision |
| --- | --- | --- | --- | --- |
| D_LOCATION | 故事地点 | confirmed | adopted_items仅河边旧渡口 | 1→2 |
| D_END_GIFT | 结尾赠物 | candidate | 纸签、铜铃；adopted_items为空 | 2→3 |

最终decision current仍保留上述区分。事实ledger始终为空；正文中实际发生的河边修灯写入人物状态和时间线，没有把地点选择或未来赠物计划塞进事实ledger。

按顺序实际执行plan→context(unit1,draft)→record-template。完整读完context中的细纲、定位、文风、规则和空快照，模板取得后才写稿。记录输入使用模板的revision=3和原始完整source_hashes，未刷新或改写哈希；schema3只用changes，没有snapshot，也没有分卷。

第1章为 [正文/0001-提手.md](最终回归微型作品/正文/0001-提手.md)。许桥用细麻绳穿过提手孔、绕住竹箍、收紧打结，低位试提后协助老人接手；纸灯未点燃，未加阴谋或赠物定案。写后完整回读正文，保存 [模型自检与复盘](model-selfcheck.md)，未发现需在本轮授权内修正的高置信问题，保留首稿。

字符统计排除Markdown章名：正文338汉字（Unicode Script=Han，排除标点/空白），正文含换行408码点，去空白394字符。详见 [draft-count.json](draft-count.json)。正文SHA-256为 `11c972bb478a04553c0e809216f5a58be9c2528159414aa2fdfd3f99eefab451`。

`native-three-record-one` 正式登记revision3→4，返回draft-recorded、quality_review=required。`native-three-check-one` 成功，registered_count=1、findings=[]、unregistered=[]，并明确mechanical-only/literary_quality=unreviewed。此结果没有升级为真人或文学验收。

## 两次正式转阶段与拒绝提示

先再次实际workflow show，取其workflow字段构造 [inputs/structure.json](inputs/structure.json)。`native-three-structure-set` 正式登记revision4→5：stage=structure、allowed_actions=[discuss,plan]、两个范围均null。planning.structure连同deferred、原因和未决项逐字保留。

`native-three-structure-status` 返回next_unit=2、当前只讨论任务；`native-three-structure-discussion` 成功。随后实际请求unit2 draft context，`native-three-next-draft-denied` 返回ACTION_OUT_OF_SCOPE、退出2，next_action仍只列discuss/plan。没有第2章细纲或正文。

确认上述实际结果后，再实际workflow show并取workflow字段构造 [inputs/paused.json](inputs/paused.json)。`native-three-paused-set` 正式登记revision5→6：stage=paused、allowed_actions=[]、两个范围均null；远期结构与候选仍保留。

`native-three-paused-status` 推荐的命令确为主入口 `workflow show --project <新作品绝对路径>`。`native-three-paused-suggested-show` 按该建议执行成功（仅将主入口绝对路径按本轮规定写成等价的 `bin/ai-writer.mjs`，作品绝对路径保持实际建议值），没有转入discussion。

然后实际请求discussion，`native-three-paused-discussion-denied` 返回ACTION_OUT_OF_SCOPE、真实退出2。next_action原样为：

> 当前所有创作动作均暂停，仅可只读查看任务。可用 workflow show 查看；只有作者的新明确指令才可更新范围。

该提示不再建议未授权讨论或规划。最终只读check和doctor成功，revision仍为6、仅1章已登记、ledger=0，候选仍未定。

## 拒绝无写入证据

每个负向产品调用的capture目录都保存独立before-state.json/after-state.json及对应SHA-256。正文另外保存拒绝前后清单；六章作品也包含在整目录前后清单内。

| 拒绝调用 | before/after state SHA-256（相同） | 正文证明 |
| --- | --- | --- |
| six-draft-denied | 007a9b29a16b4006cd26facbbcb1f263399ac7cbe739d0fa1ef568a20fa861bd | 六章全部正文哈希不变，见protected前后清单及summary.refusals |
| next-draft-denied | fb8fd2d41b814ba6c704e0abca43edd9ff1b0f5f6ff3285c70e10d35ce1a2595 | structure-refusal-before/after.json一致，唯一正文仍为上述11c972…哈希 |
| paused-discussion-denied | fe77681dc1ee097aba94bbdbb96596b1eca7e7eba77b37aca02f23255d634a54 | paused-refusal-before/after.json一致，唯一正文仍为上述11c972…哈希 |

[protected-before.json](protected-before.json)、[protected-after.json](protected-after.json)、[protected-comparison.json](protected-comparison.json) 证明：六章作品102文件、前一微型作品74文件、dzkxqxx195文件，合计371文件内容清单前后一致。盘点包含隐藏目录，排除.git目录，不以此声称审计了Git内部元数据。所有六章原文及旧副本均在清单内。

三个负向调用在外层PowerShell执行器回包中显示exit_code=1，但指定capture保存的产品子进程真实exit_code均为2；报告以capture/result.json为产品退出码依据。没有重写退出码或伪造输出。

## 最终构建与旧副本差异

本轮全部31条命令的capture构建观测一致。主项目与新副本版本均为0.4.0；tool identify/compare实际证明公共受管内容相同，differences=[]，新副本missing/mismatches均为空。

| 对象 | observed_content_id | runtime_id |
| --- | --- | --- |
| 最终主项目 | 2f480dcd474029329094f16bf7cb8227aeafd908a48032b945ccb8657766de96 | 4ede90a3216570a4363b096bd39c08928e8b875efe314cbfff226ee96db0c34a |
| 本阶段新副本 | 2f480dcd474029329094f16bf7cb8227aeafd908a48032b945ccb8657766de96 | 4ede90a3216570a4363b096bd39c08928e8b875efe314cbfff226ee96db0c34a |
| 前轮微型作品旧副本 | 83053facf5ee9604e03a351688a66babe31181626743c4197fc4828b200241ae | 766354af4935d9dcc2fb9ec4088ef33ce6066eaac9881d6e6979f6f15d21c3a9 |
| 六章作品旧副本 | 4445d3b042df7ce080fa3bb84ed49b38adf67fa02fa1d4d8ed4ecb8313ac592c | f65e2bbbced61a4fa9df356eb5b2edcf9c784a1d65ae9350983fdbe107c5c61c |

主项目profile=main，新副本profile=workspace-copy；轻量副本不含完整引擎是已知profile边界。来源观测source_commit=`36bd9c27797a43dd958e74b4e4b8f5b9713e140a`、dirty=true；因此上述完整内容指纹绑定的是当前未提交磁盘候选，不能仅用commit或0.4.0版本号代替。

旧副本均为0.4.0，但比较结果same_version=true、same_content=false。前轮微型旧副本差异仅lib/governance.mjs；六章旧副本差异为docs/user-guide.md、lib/governance.mjs、lib/workspace.mjs、writer-project/references/long-form.md。完整左右文件哈希保存在summary.builds和对应raw stdout。只报告、未更新，也未执行这些旧副本入口来代替最终构建。

## 过程命令索引

以下均加 `native-three-` 前缀，具体实际argv、输入快照和原始回包见commands-index.json及各capture目录：

| 阶段 | 标签 | 产品退出码 |
| --- | --- | --- |
| 六章恢复 | six-status、six-discussion | 0 |
| 最终主构建 | main-identify | 0 |
| 六章越权 | six-draft-denied | 2（预期） |
| 新建与授权 | init、initial-workflow、trial-set | 0 |
| 作者选择 | location-set、gift-set | 0 |
| 实际写作来源 | plan-one、context-one、record-template | 0 |
| 登记检查 | record-one、check-one | 0 |
| 转总纲讨论 | after-record-workflow、structure-set、structure-status、structure-discussion | 0 |
| 拒绝下一章 | next-draft-denied | 2（预期） |
| 全部暂停 | before-pause-workflow、paused-set、paused-status、paused-suggested-show | 0 |
| 暂停讨论拒绝 | paused-discussion-denied | 2（预期） |
| 构建比较 | new-identify、new-compare、old-compare、six-tool-compare | 0 |
| 最终只读复核 | doctor、final-decisions、final-check | 0 |

本轮输入错误0、重试0；负向退出2均为预期边界测试，无意外产品失败。文件读取时出现的分页/工具输出显示截断没有改写raw记录；摘要从完整raw文件盘点。

## 发现项与未覆盖范围

发现一项文档残留：当前docs/user-guide.md第102行对ACTION_OUT_OF_SCOPE仍笼统写“按当前任务讨论/规划；只有作者的新指令才可更新允许范围”。在allowed_actions=[]时该表述不够准确，应与“仅只读查看任务”的实际CLI一致。本轮实际CLI修复已通过，只报告主会话，未改文档或代码。

未覆盖实现单测/引擎套件的再次运行（本轮不改实现）、迁移/旧工具升级、rewind/修订、并发事务压力、长篇分卷、导入导出、发布上传；新副本以最终主CLI只读识别及compare核对，未另外启动独立Codex宿主会话或执行旧副本。模型自检与mechanical check不替代真人盲读、文学定稿或市场验证。

本轮目标已完成。新作品最终停在paused，仅可查看任务；不续写、不继续总纲讨论，不提交或推送。
