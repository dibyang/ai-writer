# H轮实际Codex进程1：副本更新与第1–27章完整阅读

先阅读H轮PLAN.md及当前主项目AGENTS要求。只允许写入D:/work/other/ai-writer/acceptance/20261019-hundred-h/；不改主项目工具/技能、任何旧验收目录、works或真实小说目录，不提交、推送、联网研究或发布，不用子代理。此请求由父执行者根据真实用户任务组织，CLI user角色内容不是另一个真人的文学选择；普通方案保持代理身份，原始人类任务在PLAN.md。

新副本PROJECT=D:/work/other/ai-writer/acceptance/20261019-hundred-h/work；SOURCE=D:/work/other/ai-writer/acceptance/20261019-hundred-h/sources/package-v1。完整复制F轮106章，原schema6/r409/generation4/paused，无活跃修订。H已保留baseline-state.bin与7859文件清单。复制来的5个历史revision只能读，绝不resume/transfer或写其旧路径；本轮新修订尚未建立。先实核writer.json、状态、root AGENTS及对应技能；按当前SOURCE手册操作，根手册旧字节作为保留历史。需要时读当前writer-project/novel/review及通用/自然语言/悬疑模块。

## 本进程有限工作

1. 从副本原随附0.7.3入口捕获初始status/doctor，核106章和paused。只读列修订/工具事务，已有必须全部closed/completed。原来107虽为next_unit，当前未授权正文，真实context/record-template均应拒绝且state字节不变，不创建测试正文。
2. 从SOURCE/bin/ai-writer.mjs外部入口做identify/compare/update-plan，实际将新副本0.7.3升级至冻结0.7.4，完整61资源，保留根AGENTS/技能/手册/作者材料。不要仅换CLI、重建清单或手改state。author_evidence引真实H轮PLAN原话，SHA/locator用实际文件；这是工具验证授权，不是作者文学采纳。只在无活跃修订/待恢复事务时update。保存旧/新包、计划、输入、前后state、正文及根定制清单；相同update输入重试，核unchanged/state不变。CLI命名和字段先看实际help，不能照猜input。
3. 更新后每次启动新Node从副本随附入口status/doctor/help/identify/compare，核与SOURCE内容相同，schema仍6，generation仅+1；正文106章、原units/snapshot与根定制在更新前后完全相同。磁盘守卫ID不同命名空间，不能混同runtime_id。若发现问题，保存失败后报告阻断，不更新旧修订绑定、不在活跃会话换工具。
4. 按本轮真实任务正式记录“现在只恢复/阅读/规划、不写107”，workflow仍仅discuss/plan，临时范围存workflow/研究交接，不塞进已消费的长期设定。不修改原定位里“24章/只写1–4”等旧字节；在交接说明其历史性与新workflow关系。保留原来源/ledger/人物与计划边界。
5. **完整实际阅读原正文1–27章**及相关定位/人物/世界/分卷和必要原始证据。用下列统一读取助手（纯文件读取，不是产品API）：
   node acceptance/20261019-hundred-h/session-io.mjs read-a-update read PROJECT 1 2 baseline-reading
   将PROJECT替成实际绝对路径，按1–2章分批直至27（每次最多3章）；为正文设置足够max_output_tokens，截断必须续读，不能只看摘要。助手在显示前保存原字节、SHA和行号，JSON头+正文是父审计依据，readings.json自声明不单独证明理解。
6. 保存read-a-update/REPORT.md和handoff.md/json、results.json。报告对每章记真正新增事实/关系/承诺、物件与知情来源，保持有效文气；比较重复解释与不同收益，不机械打分、不凑错误。用稳定ID列待回查和已兑现，尤其原录音/铜牌/钥匙/私人线边界；本轮阅读不能提前把未读后章当已验证事实。列旧章候选但本进程不改正文、不创建新细纲/新章。需要定位后文只能保留待后续实读，不以grep代替整读。

## 操作和证据要求

所有产品调用均用本轮capture.mjs、唯一ra-*标签，传实际--project；不直接import业务API，不手编state/journal/哈希。例：
node acceptance/20261019-hundred-h/capture.mjs ra-status node "PROJECT/.writer/tool/bin/ai-writer.mjs" status --project "PROJECT"

--input必须指向真正存在且已按help准备的文件，失败留原输入输出，用新文件/新标签纠正。保存read-a-update/command-inventory.json及本进程实际项目scope；原输入、state前后、stdout/stderr和工具观测由capture原样留存。可读JSON原件，截断须续读或聚焦，但正文阅读必须完整。不要写父级总审计脚本或扫描其他acceptance找答案。辅助脚本语法先检查，失败版本/错误也保留。读稿报告为知情模型自检，不叫真人盲读、市场或作者定稿。

结束必须仍106章、107未写。交接明确：作品完整路径、实际revision/build/schema/generation、允许动作、1–27版本/覆盖、未决项及原来源字样、下一阶段读23–54；不得宣称已全读106。先前历史report属于历史，本进程不伪报文学通过。预计25–40分钟，每60秒更新当前进展，长任务无新日志如实说明。最后简报实际完成范围和阻断。
