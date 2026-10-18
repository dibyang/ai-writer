# 最终 A：协议诊断与完整流程复验

指定 CLI 场景全部符合预期。34 条产品命令中，29 条退出 0，5 条预期非零；意外产品错误 0，产品重试 0。工作区整体未变的附加审计未通过：观察到本会话操作范围外的文件变化，详见下文。此结论仅覆盖本阶段指定流程，不表示正式发布验收。

## 构建与入口

主项目和新随附工具均为 0.4.0，observed_content_id 为 `4257cdc3300a0995be14b3ed2be3b7363e9795e97dc4d9aab5f502f141079d7a`，runtime_id 为 `55f8ce1ae8fab2233a860dd0165b0abab739ca30bb765d2a1735f3ae11c4b2b5`。两次 identify 和 compare 结果一致，differences=[]。main/workspace-copy profile 不同；轻量副本的引擎省略按文档保留。新随附 doctor、status 均实际退出 0。所有产品调用均由 capture.mjs 以 native-five 唯一标签保存原始 stdout/stderr、输入、退出码和可用的 state 前后哈希，见 [命令索引](commands-index.json)。退出码以捕获的子进程 result.json 为准。

## 协议诊断与负向请求

迁移夹具保持原样：完整实际 0.3 工具 build.ok=true，missing=[]、mismatches=[]，支持 schema [1,2]，其 state 已为 3。主 doctor 明确提示“随附工具版本/清单未声明支持当前 state schema 3；从新主项目入口操作。本批不自动更新随附工具，不要手改 state 或只复制 CLI。”。新主 check 成功；旧 parser 报“追踪状态损坏”并退出 2，属于旧协议拒绝，未把它归成文件损坏或意外产品失败。三次请求的 71 个夹具文件各有完整前后盘点，均未变。

| 分类 | 命令标签 | 实际退出 | 代码/诊断 | 前后盘点 |
| --- | --- | ---: | --- | --- |
| doctor-incompatibility | native-five-fixture-main-doctor | 1 | ok=false + 协议错误说明 | 71 文件不变 |
| old-parser-refusal | native-five-fixture-old-status | 2 | COMMAND_FAILED | 71 文件不变 |
| invalid-id-refusal | native-five-invalid-prototype | 2 | INVALID_INPUT | 64 文件不变 |
| authorization-refusal | native-five-structure-unit2-refusal | 2 | ACTION_OUT_OF_SCOPE | 72 文件不变 |
| authorization-refusal | native-five-paused-discussion-refusal | 2 | ACTION_OUT_OF_SCOPE | 73 文件不变 |

非法请求与正式 trial 输入仅 operation_id 不同，完整证据与其他 workflow 字段均合法。prototype 请求返回 INVALID_INPUT；state 仍为 revision 0，随后 status 读取成功。每个负向请求的 state、正文与全目录哈希见 [负向哈希证据](negative-request-hashes.json) 及对应 before/after.json。

## 新作品完整流程

正式 init 后，初始 direction 仅允许 discuss/plan，两个范围为 null。原话存于新作品研究/本轮作者原话.txt，哈希 9916ebd36af4930c6c16f7d7641877439c0d51ff09d910f57568be765c8404f3；正式 workflow/decision 使用该真实来源，不编造消息 ID。合法 trial 1–1 有明确复盘条件；旧渡口在第1章范围 confirmed，纸签和铜铃单独为 candidate，adopted_items=[]。计划选择未塞入事实 ledger。

已完整阅读原章第1–18行；取得正式 plan → context → record-template 后，复制 1217 字节至新作品。源/目标 SHA-256 均为 `11c972bb478a04553c0e809216f5a58be9c2528159414aa2fdfd3f99eefab451`。原稿未改；只复制正文，未复制旧 state 或旧 source_hashes。record 输入使用本新 CLI context/template 的真实 revision 3 和来源哈希，填写实际摘要、两个人物状态及已发生时间线，ledger={}；record 成功到 revision 4，check 通过，registered_count=1。重放新增文学字数为 0。详见 [复制证据](copy-evidence.json)。

登记末章后 status 实际提示“试写范围已到，先复盘：仅重放并正式登记既有第1章，完成后复盘、讨论总纲，保留远期 deferred，随后全部暂停”。随后 structure 正式登记到 revision 5，动作 discuss/plan、两个范围 null，远期结构 deferred 及原因完整保留。正式 discussion 成功；本轮讨论实录见 [总纲讨论](structure-discussion.md)。unit2 draft 在检查细纲前即以 ACTION_OUT_OF_SCOPE 拒绝，全部文件未变。

正式 paused 到 revision 6，动作列表为空，两个范围 null，deferred 保留。实际执行 status 返回的完整 workflow show 建议，成功且只读；再请求 discussion 以 ACTION_OUT_OF_SCOPE 拒绝，next_action 明确“当前所有创作动作均暂停，仅可只读查看任务。可用 workflow show 查看；只有作者的新明确指令才可更新范围。”。整个暂停后检查段的 73 个新作品文件，包括 state 和正文，前后完全一致。原章仍是唯一登记章，next_unit=2 仅为顺序，不授予继续写作权限。

手册 FAQ 第 102 行的全部暂停指引，以及第 107 行的 doctor 协议不匹配指引，均与本次实际结果一致，见 [文档核对](documentation-check.json)。

## 旧副本只读比较

下列既有副本均显示版本号相同、公共内容不同，仅记录差异，未更新。地点确认生效范围为第1章，因此默认 next_unit=2 的视图不显示该确认项；unit1 的正式 decision current 证据仍保留。

| 旧工具路径 | observed_content_id | runtime_id | 相对主项目差异 |
| --- | --- | --- | --- |
| acceptance/20261018-governance-a/works/纸灯札记/.writer/tool | 4445d3b042df7ce080fa3bb84ed49b38adf67fa02fa1d4d8ed4ecb8313ac592c | f65e2bbbced61a4fa9df356eb5b2edcf9c784a1d65ae9350983fdbe107c5c61c | content:docs/user-guide.md<br>content:docs/workflow.md<br>runtime:lib/governance.mjs<br>runtime:lib/tool-build.mjs<br>runtime:lib/workspace.mjs<br>skills:writer-project/references/long-form.md |
| acceptance/20261018-governance-a/native-recover/最终微型作品/.writer/tool | 83053facf5ee9604e03a351688a66babe31181626743c4197fc4828b200241ae | 766354af4935d9dcc2fb9ec4088ef33ce6066eaac9881d6e6979f6f15d21c3a9 | content:docs/user-guide.md<br>content:docs/workflow.md<br>runtime:lib/governance.mjs<br>runtime:lib/tool-build.mjs<br>runtime:lib/workspace.mjs |
| acceptance/20261018-governance-a/native-final-check/最终回归微型作品/.writer/tool | 2f480dcd474029329094f16bf7cb8227aeafd908a48032b945ccb8657766de96 | 4ede90a3216570a4363b096bd39c08928e8b875efe314cbfff226ee96db0c34a | content:docs/user-guide.md<br>content:docs/workflow.md<br>runtime:lib/governance.mjs<br>runtime:lib/tool-build.mjs<br>runtime:lib/workspace.mjs |
| acceptance/20261018-governance-a/native-reserved-check/最终交付重放作品/.writer/tool | ce3feec4071aba1f6ad7ea85388793a892fd72afaf38f23457bf769c1e2d7797 | 7924f07a6243ae103767f0c525a98c71c66059aa35f5044740eca48cb3245b9c | content:docs/user-guide.md<br>runtime:lib/tool-build.mjs<br>runtime:lib/workspace.mjs |

## 保护边界与审计异常

真实小说 D:\work\小说\dzkxqxx 的 195 个文件未变。主项目中盘点到的 44 个既有验收作品/夹具目录全部未变，覆盖原有正文、state、随附工具和迁移夹具。本轮 bin/lib/docs/技能、package.json 与原始 tests/fixtures 的文件也未变。详见 [完整最终盘点对照](protected-final-comparison.json)。

整体工作区在 2026-10-18T00:21:29.982Z 的快照相对起始快照有 699 项差异：新增 696，删除 0，修改 3。既有变化文件为 `acceptance/20261018-governance-a/snapshot.mjs`、`scripts/benchmark-long.mjs`、`scripts/smoke.mjs`，其他变化主要在 .tmp 和本阶段之外的验收归档/命令目录。这些不是本会话执行的写入；仅能判断存在其他活动，未确定具体操作者。不覆盖、不清理、不回滚它们，也不声称整个工作区静止或干净。原始两次盘点及中间比较报告全部保留。

另有 2 次验收辅助命令错误。第一次重复使用 paused-readonly-before 作为比较输出名，被 wx 保护以 EEXIST 拒绝，旧证据未覆盖；随后用唯一 work-final-comparison.json 保存等价比较，结果无差异。第二次报告脚本只解析 stdout，遇到负向请求 JSON 在 stderr 时失败；修正本阶段辅助脚本后重跑一次，成功生成报告，未重跑任何产品命令。全局盘点比较的非零退出则是上述漂移诊断。它们均独立记录于 [审计异常](infrastructure-errors.json)，未归为产品失败、未隐藏失败或重试。

本会话只写本阶段目录和 native-five 命令证据；未改源码、未直接编辑 state、未升级旧工具、未联网、未启用子代理、未提交推送。未扩充文学创作、真人盲读、完整回归或正式发布验收。新作品停在 paused，按要求完成后停止。
