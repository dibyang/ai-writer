# 第三批C验证记录：跨章重复复核、登记减负、意见闭环

本批 AW-05/06/08 已实现；最终 0.6.0 本地候选的回归、实际 Codex 流程与数据保护审计通过。没有修改现有作品，没有 Git 提交、暂存或推送，没有发布。本地候选不等于正式发布、文学通过或作者定稿；D 批安全工具更新不在本轮实现范围。

基线 HEAD：832581720f4d6d6c99780390812218e215167822。新建作品 schema5；旧作品显式启用并备份，旧工具不自动更新。最终源码120份与冻结 candidate-v2 完全相同，12份 runtime 的磁盘观察 guard 为 `c9c6ca170c19b518a26782e6aae044c27c84f4ca0c5d88830aba1a44ddc7e0ec`。它与 identify 的 runtime/content ID 命名空间不同，不是执行字节签名。

## 实现结果

|能力|本轮行为|
|---|---|
|跨章重复复核|当前版本模板；逐章目标、阻碍、选择、后果、关系变化；逐章引文、相似流程的不同收益、保留项及不确定性。模型实读判断，脚本不评文学重复率。|
|登记减负|明确长篇的新作可 init --mode long；旧链只读预览；record-preview 列缺项和真实增量；独立区 replay-input 恢复原摘要/原changes/引文及当前绑定，仍需六项真实语义核查。|
|意见闭环|原意见→采用/保留/延期→真实主稿提交→apply→当前版本实读verify；作者明确选择持续保留，新版本失效显示 needs-recheck，历史不删。可选风格只能 suggestion。|

保留原分卷、增量journal、来源版本、哈希与修订事务。新增结构化报告及事件由 state 索引发布，失败孤儿不计覆盖；分支意见也核声明范围，一般润色授权不能翻转作者明确选择。具体约束与协议细化见[实现说明](../../docs/authoring-governance-c-implementation.md)。

## 最终源码验证

|验证|实际结果与证据|
|---|---|
|npm test|132项通过，0失败、0跳过；[原始输出](commands/candidate-v2-regression/stdout.raw.txt)|
|npm run doctor / npm run smoke|均退出0；[doctor](commands/candidate-v2-doctor/result.json)、[smoke](commands/candidate-v2-smoke/result.json)|
|两个修改技能校验|均通过；[project](commands/skills-project-validate/result.json)、[review](commands/skills-review-validate/result.json)|
|C四种文体协议流程|164次真实CLI调用；[汇总](c-matrix-v2/summary.json)。为机械合成夹具，不是四种文体的模型文学验收。|
|原B流程回归|182次CLI；[汇总](b-matrix-v2/summary.json)|
|发布故障与恢复|378次CLI、23种情况、8处发布文件边界；[汇总](exhaustive-v2/summary.json)。包含进程退出与注入ENOSPC，不等同物理断电/满盘。|
|不相交修订的全局CAS|30次CLI，一方提交、另一方保留；[汇总](disjoint-v2/summary.json)|
|结构化审查孤儿复现/修复|修复后20次CLI，state发布失败不算覆盖，重试只发布一次；[汇总](orphan-cli-after/summary.json)|
|最终独立审计|15项通过；[结果](final-verification.json)、[实际执行回执](final-audit-execution.json)|

没有改内置引擎，未运行或借用 test:engine 结果。旧真实0.5完整11份源码夹具证明其读取4、拒绝5；不是伪造旧解析器。旧B完整封存亦作只读校验，26432文件、344378922字节通过。

## 四个独立 Codex 进程

均实际运行 codex-cli 0.163.0-alpha.10.2，四个不同 thread ID；请求、events.jsonl、stderr.log、process-result.json 和 final.md 全部保留。表中213次为捕获的实际产品调用，包含预期拒绝及已纠正的操作者错误，不是213次文学通过。

|阶段|源码/调用|实跑内容|
|---|---|---|
|[六章创作与初审](native-create-review/report.md)|V1 / 56次|原创《渡口旧箱》两卷六章，初稿4985正文汉字；逐章登记、完整连读、功能比较及3条开放意见。|
|[限范围修订及应用](native-revise-apply/report.md)|最终V2 / 32次|仅第五章删一重复字，5–6独立重登/提交；第一至四章完整登记及正文、第六章正文不变；意见 adopted→applied，其他 retained/deferred。|
|[独立恢复及再次复核](native-resume-verify/report.md)|最终V2 / 50次|完整六章实读；保护作者保留选择；第六章一字等价控制变化后，真实 verified→needs-recheck→verified，沿用原application。最终4984字、revision24、stage=paused。|
|[百章及最终源码从零短篇](native-hundred-replay/report.md)|最终V2 / 75次|百章第100章等价回放、实读95–100；另从V2 init原创两章《关门以前》，完成一字修订、真实提交/apply/当前实读verify。|

首轮V1创作不能冒充最终V2从零创作；source快照及 guard 分别标识。后续三轮使用最终V2，两章新作补足最终源码从初始化到闭环的完整流程。源代码接线失败及边界失败、修复前复现和修复后结果都保留，见[发现与边界](discoveries-and-limits.md)。

最终六章意见为 verified / retained / deferred，原作者取舍与修复事件保留；16项ledger语义不变，39个当前引文锚点匹配。新短篇最终767/716正文汉字，第1章完整登记及正文不变，第2章仅删一个“车”、3个UTF-8字节，事实字段不变、证据版本另记；意见 verified / retained。其revision13、stage=structure，任务明示暂停、仅discuss/plan、两个正文范围null；百章副本同样仅讨论规划、正文暂停，不把授权停止与阶段字段混为一谈。

## 百章与登记减负

原封存目录只读，复制必要598文件、11256809字节，未复制大体积rewind历史。100章228287正文汉字逐字节保持，前99章完整登记对象不变，141项账本记录/1157引文锚点及原snapshot SHA不变。仅100–100等价重登，主revision375→376且重复提交幂等，授权暂停后377。实际文学连读95–100，1–94不声称通读。66份旧stale保留，其中3份未被单份当前报告完整覆盖（含旧1–100全书报告）；pending_windows=[]不代表全书文学通过。

同一独立区99章状态，当前模板和回放各3个新CLI进程；另有真实旧0.5模板3次对照。回放自动恢复253个字符的原摘要、3项人物更新、1条时间记录、6项ledger增量、15个引文锚点；原39个journal patch等价，97个恢复叶字段含旧历史，不是97个新故事变化。六项实核和报告仍必需。旧模板本来会填路径/哈希、原增量账本本来会保留未变项，不能算新收益。[逐样本、字段与成本](native-hundred-replay/field-comparison.json)保留原始输出和毫秒观察，但不是配对性能实验，不宣称工时节省或提速比例。

百章作品doctor保留随附0.3不支持schema5的预期兼容诊断；使用主0.6入口，未升级随附工具。主doctor及新短篇doctor正常。三份导出均核实际合订文本、清单及当前源稿SHA，保持 draft-export / quality_review required；每章trim后合订不是源稿原字节归档，原稿和旧版另保留。

## 证据及现有作品保护

- [最终审计](final-verification.json)：源码120份、4个进程、所有正文/事实/引文/冻结对象、导出、旧夹具、作用目录与Git边界。
- [完整调用索引](command-index-final.json)：1820条已完成调用记录，包含回归包装进程、开发失败与预期拒绝；不把退出码非0全部算产品失败。input.raw.json、before/after-state、stdout/stderr及result原样留存；第三轮的阶段内commands也已纳入，完全相同的复制不重计。
- [作品前后对比](protected-comparison.json)：D:/work/小说/dzkxqxx 的全部516文件（含.git）内容及字节数一致，无排除、无差异。本轮所有捕获的作品入口/成功init目标均在C目录内。
- sources保存baseline、开发失败前、V1、边界修复前、V2、final-delivery等快照；fixtures/tool-0.5及tests中同源夹具逐文件SHA核对。fixtures/tool-0.4是初始化辅助脚本沿用旧名生成的9份0.5子集，未用于兼容结论。
- [封存清单](evidence-manifest.json)覆盖本目录最终全部文件，仅排除清单自身。完整日志在四进程结束后封存；静态报告不伪称运行中日志的最终哈希。只读复验：`node acceptance/20261018-governance-c/seal-evidence.mjs verify`。
- [封存后复验回执](../20261018-governance-c-seal-verification.json)保存在同级目录，以便保存实际校验输出而不改变被校验的文件树。

## 使用文档

[快速入门](../../docs/quickstart.md) · [使用手册](../../docs/user-guide.md) · [跨章复核、登记与意见闭环](../../docs/review-and-registration.md) · [长篇流程](../../docs/long-form.md)

作者可直接说明“只连读审查、不改稿”“保留这些意见，只采用指定一条”“暂停正文讨论总纲”。Codex准备输入；工具保存范围、原话、版本及实际提交依据，不能代替作者判断和真实阅读。
