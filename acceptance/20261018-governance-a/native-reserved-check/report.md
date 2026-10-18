# 最终交付构建：保留键防护与完整流程重放

本阶段要求的 Windows 本地 CLI 重放通过，未发现需交主会话修复的新问题。共 41 条真实产品 CLI：33 条成功，8 条预期拒绝（退出码2），无意外失败。此结论仅覆盖下列流程，不是正式发布验收。

## 边界与真实输入

只写本阶段目录及 commands/native-four-*。不改实现，不启用子代理、不联网、不迁移或更新旧作品、不提交推送。当前主项目原有脏工作区保持原样。每条产品命令由 evidence.mjs 调用指定 capture.mjs，再启动真实 Node CLI；未导入 lib 替代产品操作。捕获器保留 argv、原始 stdout/stderr、真实退出码、输入原字节与哈希，以及带作品路径命令的前后 state 原字节。observations 另为每条命令记录作品前后 state 哈希、修订号、正文清单与全作品文件哈希清单。外层辅助脚本正常退出不代表被测CLI成功，计数均读取 capture 的 exit_code。

已先读当前 writer-project 技能、docs/user-guide.md FAQ 及 docs/workflow.md 的 ID 约束。测试作者完整原话见 author-instruction.txt，作品内真实本地来源为“研究/本轮作者原话.txt”；workflow/decision 以该来源真实 SHA256、原话和本地定位绑定，没有编造消息 ID。所有治理、章纲及登记 JSON 输入均放在本阶段外层目录，未手改权威 state。

## 保留键与普通字典索引

| 输入位置 | ID | 真实结果 | state/正文及全作品清单 |
| --- | --- | --- | --- |
| workflow operation_id | prototype | INVALID_INPUT / 2 | 相同 |
| workflow operation_id | constructor | INVALID_INPUT / 2 | 相同 |
| workflow operation_id | __proto__ | INVALID_INPUT / 2 | 相同 |
| decision.id | prototype | INVALID_INPUT / 2 | 相同 |
| decision.id | constructor | INVALID_INPUT / 2 | 相同 |
| decision.id | __proto__ | INVALID_INPUT / 2 | 相同 |

六次拒绝均在 revision=0，且每次之后实际 status 成功，未形成不可读状态。workflow 负例与正式有效 trial 输入只改 operation_id；decision 负例与后续正常地点决策的主体仅 ID 不同，CAS 修订号及操作号各按对应时点准备。

普通 operation_id=toString 首次正常登记至 revision=1；相同原字节重放返回 unchanged，state 与全作品文件哈希不变，修订号未前进。地点、赠物决策及 record 的原输入也各重放一次，均 unchanged。地点决策重放响应保留历史 revision=2，当时权威 state 仍为 revision=3；它没有倒退状态。

## 有限 trial 与来源重放

最终主入口初始化“最终交付重放作品”，schema=3；补充了简短定位。trial 仅 draft 1–1，revise_range=null，有登记后复盘、转讨论再暂停的条件。planning.structure=deferred，原因保留作者允许暂缓且仅验证单章的边界。地点“旧渡口方案” confirmed；纸签、铜铃为 candidate，adopted_items=[]，没有替作者选赠物。

复制前已通过 FastCtx 完整读完第三轮第1章《提手》18行，记录见 reading-evidence.json。实际按 plan → context → record-template → 字节复制 → 填真实 summary/changes → record → check 执行。模板和 context 均来自本轮 revision=3；source_hashes 原样保留，不读用旧 state、旧 source_hashes 或旧随附工具。changes 只登记许桥与老人的已发生状态及修灯时间线，未把候选赠物写入事实。record 推进至 revision=4，机械 check 无 findings、已登记1章、无未登记稿。

复制源：native-final-check/最终回归微型作品/正文/0001-提手.md。

复制目标：本阶段“最终交付重放作品/正文/0001-提手.md”。两者 SHA256 均为：

`11c972bb478a04553c0e809216f5a58be9c2528159414aa2fdfd3f99eefab451`

共 1217 字节、419 个 Unicode 字符（包含标题和空白）、343 个汉字（包含标题）。全部计为复用，新增文学创作0字。check 的 literary_quality 仍为 unreviewed，单章自读与机械检查不作为文学通过。

## 讨论与全部暂停

完成登记及复盘后，正式 workflow set 切到 structure（revision=5），仅 discuss/plan，draft_range 与 revise_range 都为 null，远期结构仍 deferred。discussion context 成功；unit2 draft context 返回 ACTION_OUT_OF_SCOPE/2，拒绝前后 state、正文和全作品清单完全相同。

随后正式切到 paused（revision=6），allowed_actions=[]、两个范围 null。实际 status 的 next.command 指向 workflow show，已按该建议通过捕获器执行成功。随后真实 discussion context 返回 ACTION_OUT_OF_SCOPE/2；next_action 为：

> 当前所有创作动作均暂停，仅可只读查看任务。可用 workflow show 查看；只有作者的新明确指令才可更新范围。

没有建议继续讨论或规划。拒绝前后 state/正文及全作品清单相同。新随附入口的 workflow show、check、status 也实际成功。最终 next_unit=2 仅为登记顺序，当前任务仍是全部暂停；没有写第2章。

## 最终构建

主项目与新随附工具版本均为 0.4.0，profile 分别为 main / workspace-copy。tool identify 两边及 tool compare 的完整输出在对应 commands 下；本阶段全部捕获命令的内容/runtime 指纹都绑定同一构建。

- observed_content_id：`ce3feec4071aba1f6ad7ea85388793a892fd72afaf38f23457bf769c1e2d7797`
- runtime_id：`7924f07a6243ae103767f0c525a98c71c66059aa35f5044740eca48cb3245b9c`
- 随附 declared_build_id：`ce3feec4071aba1f6ad7ea85388793a892fd72afaf38f23457bf769c1e2d7797`
- 来源 commit：`36bd9c27797a43dd958e74b4e4b8f5b9713e140a`；dirty=true，不能将指纹归因于干净提交。

共 45 个受管文件（content 7、runtime 9、skills 29）逐项一致；compare same_content=true、differences=[]，随附清单 missing=[] / mismatches=[]。治理模块 SHA256：`361731881688509df07cd071cb4f85e9857f542709bd1b8b43e5b8abb16d88f9`。workspace-copy 有意省略完整引擎，这不是引擎发布包验收；指纹不是供应链签名或作者身份认证。旧随附副本没有更新。

## 保护核对与未覆盖

protected-before/after/comparison 保存前后哈希清单：主工作区（排除 .git、node_modules、acceptance）5371 个文件相同；其他验收区域（排除本阶段及 native-four 标签）7173 个文件相同，包含前三轮作品与故障现场；D:/work/小说/dzkxqxx（排除 .git）195 个文件相同。比较对象为路径、字节数和 SHA256，不宣称审计文件访问时间或 Git 内部元数据。

- 未重跑 npm test、npm run doctor 或内置引擎测试；本阶段未改实现，覆盖为所列最终CLI流程
- 未验证 supersedes 保留键、所有其他ID/Unicode边界或跨范围替代链
- 未做并发、中断、磁盘故障、锁外修改或长篇规模验证
- 未做旧作品迁移/更新、旧故障现场恢复、外部发布或联网验证
- 未做 Linux、其他 Node 版本或多机器验证
- 复用单章，不是新增文学创作、真人盲读、市场验证、作者定稿或正式发布验收

命令完整索引见 commands-index.json，机器摘要见 summary.json。最终状态为 paused/revision=6；本阶段验证完成后停止。
