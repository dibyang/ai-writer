继续用户授权的百章长篇真实 Codex 实跑。仓库 D:/work/other/ai-writer，当前作品 acceptance/20261016-hundred/works/潮汐信号，阶段目录 acceptance/20261016-hundred/session-11。本次只读当前作品文件恢复，不读其他阶段请求/结果/聊天/旧状态补剧情。不使用子代理。只修改当前作品和本阶段目录；发现产品工具缺陷将复现证据写本阶段 result.md 后报告主会话，不修改产品。不得手改 state/journal、不得提交推送发布。

先按 writer-project、writer-novel、writer-review 及必要连续性规则执行 status/check/outline。完整实读最近6章、当前设定及续部总纲（若存在）、活跃/到期未结 ledger；通过 recall 定位旧证据后实读相应正文。保存 recovery.md：恢复来源及哈希、当前实际时间/位置/物件保管、谁知道什么、未结承诺与本批回查项。不得把大纲计划写作已发生事实。不能把已结案主线推翻来制造续篇。

从文件确认续部卷契约、此前修订的现行时间/标识/知情边界，恢复上一会话真正留下的处境。recall 的空白分词为AND，不用多个ID一次查出OR结果。新角色须有实际场景和利益，避免把所有角色都变成核对清单的同一种声音。

本次连续创作并登记第85–90章，每章2400–3200正文汉字（Unicode Script=Han，排除Markdown标题）；不是总字符数。每章有可见场景、人物选择、关系或信息的实际变化，增加篇幅靠展开行动与生活后果，不能靠重复前情、空洞排比、流程清单或章末总结凑字。不逐章询问用户。每章先plan（setting_refs含当前卷与续部总纲，cast准确，recall_ids显式列相关跨卷项）/context/record-template并保存写前revision与完整source_hashes；正文完成后完整实读自检，再填真实summary与changes登记、check。为保持人物旧知识，character_known若更新须保留有效旧信息并标历史章次，新旧状态勿混；关联thread/object/fact/relationship的知识和custody同时核对，不能仅添证据就宣称全同步。

每到3的倍数章，完整读当前3章及前三章，保存当前作品内的“审查/”中的短模型知情报告，用review登记实际哈希；不能伪称真人或盲读。报告正文应写具体连续性核对及必要问题，避免堆模板。相关旧证据全文阅读并记录路径/哈希/范围；正文和报告修改会令旧报告失效，结束前check.pending_windows必须为空。脚本只证明覆盖，不证明语义。

发现已登记错误时，保留修前正文/状态/输入，核实最早受影响单元及来源消费范围，正式rewind后从回退点逐章重登，不删正文、不手改state。旧有效观察/ID/证据/人物所知/due不得丢失或改期清零；修后角色不得提前知道后章信息。无必要不为审美偏好返工。

每个CLI/辅助命令须用文件式包装保存真实argv、退出码、stdout与stderr（阶段目录commands/，不可把JSON字段虚构成原始输出）；启动期只能取得工具合并回包时如实记录边界，不补造分流原字节。工具失败先记录再修复，失败记录不得覆盖。可新建一个run-cli.mjs捕获每次子进程输出，编码UTF-8，避免长PowerShell内嵌脚本转义。当前作品内的“审查/”与本阶段辅助文件均已授权，不因报告位置再次询问。

结束时status/check/doctor；导出到acceptance/20261016-hundred/session-11/export（不能覆盖旧导出），确认恰好1–90章。保存result.md及result.json：实际读写范围、每章Han、revision、源/状态哈希、跨卷回收进度、当前保管/知情边界、问题修复及未覆盖项。保存reading.jsonl记录实际全文读过的路径/hash/用途，不得把哈希扫描当全文阅读。报告预计45–70分钟，每60秒报告已完成章数、当前内容、耗时及下一检查点。最后完成本批全部章节后再结束，不用“建议用户下一步”替代已授权工作。

跨卷伏笔验证须包含具体正文细节，不能全由“接任务—完成任务”清单代替。结合现有余带、灯、纸物与人的生活细节，逐步铺设至少3条相容的具象伏笔或早期信息差（稳定ID、最初观察不可逆改、角色所知分开），让回收跨至少2个续部卷并跨多个会话；不同线分批在56/72/88/100附近兑现，以实际证据决定，不临近结尾凭空造答案。不要为凑测试数量把已结主线翻案或强加惊天秘密。每阶段result列最初章—当前章—证据—保留未知，若尚无回收写明尚未发生。
本阶段优先复用本轮共享日志实现 acceptance/20261016-hundred/command-runner.mjs（允许只读该辅助代码；它没有剧情资料）。在本阶段脚本 import {createRunner} from '../command-runner.mjs'，createRunner('acceptance/20261016-hundred/session-11') 后用 run(executable,args,label) 保存真实argv/退出码/分流原始输出；返回值带精确files，最终取json('status-final')必须按索引的label严格相等，不用文件名endsWith，避免将git-status-final误当status-final。可使用自己的薄包装，但不要重复已两次出现的后缀冲突。辅助实现已在真实status/git-status邻接标签、缺失标签和非零命令上回归核对。需要正式回退时可只读本轮无剧情代码 acceptance/20261016-hundred/rebuild-utils.mjs，了解只读journal重放及前保管人校验；所有权威写入仍必须经过CLI，不直接写state/journal。


补充真实改稿经验：证据不能用 unit+line 作为唯一标识；同一单元同一行可能有同一 ID 的多条不同引文。回退迁移按原证据身份/ID+unit+quote+版本核对，未变引文逐条保留，不能因位置相同覆盖。主工具恢复错误现提供 CONTEXT_CHANGED/recovery，正文和来源同时漂移时按所有影响的最早单元回退。

进度耗时请用机器时钟与本阶段开始时间计算，不凭感觉报分钟；无法取得时钟时明确未实测，最终以原生runner的elapsed_s与命令时间戳为准。

已验证的CLI使用经验：--max-chars仅context支持，不传给record-template或recall；先用单项--help核对参数，不臆造模板选项。journal按state.units各自journal路径和实际.writer/journal目录备份、重放，不假定存在journal.jsonl。recall结果可能先列关联项，按真实id核对目标，不能把首项自动当精确ID。预期非零错误从实际stdout/stderr核实，不用仅接受成功的json捷径解析失败回包；全部原始错误先留档再修。
