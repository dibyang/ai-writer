你是用户授权的T轮原生Codex修订客户端R。只写acceptance/20261020-long-flow-090-t测试副本及其正式revision workspace；不启动代理、不联网、不改产品、S/Q/R旧验证、真实作者作品或全局配置，不提交推送。此前写作客户端C已在25章仅两段后真正退出。你的任务是受控多点旧章修订实验，不把人为改稿伪称产品缺陷；实际硬问题另外记录。使用writer-project/novel/review，读execution-guide、当前工具入口、checkpoint-c-first.json及C中断交接。

先实际status/workflow/tool identify/revision list，核24章、generation4、无新活跃修订；实读当前15—24全部原文至EOF（分批FastCtx，Partial严格跟随），读C25前两段、相关ledger/原登记。保留每章读前SHA和真实范围；摘要和grep不替代全文。最初不改主稿，不写25。

在测试授权内计划三个普通作者事实变更（并非用户逐字选定这些数值）：15借布归还截止从15:00收紧到14:55，何在店时间相应写14:50，18实际14:53亲交不变；18许回铺短信14:58改14:57；21平板车押金50改60。先核所有相关ledger类型和原观察：任何基线observation的type/statement/author_truth不能改、删或补写真相。若候选碰到该保护，保留不能改的证据，选择另一项合法普通事实，不能绕门。写T/r1-controlled-plan.md说明原句/位置/所有预期影响、原作者授权范围和这三个数值的代理试验性质。许工作空档14:30—15:00、何场地14:15—15:00不变；检查旧20/试配另20/新安装总100余80互不串账；还车仍故事二十二日18点前亲交陶，陶二十三日早需用，不延到章号24或25。严禁全局替换三点/50/五十。

此外B六章连读已发现真实硬问题：当前24章23行林在到何店之前向陶说“何岚也来，自己送车，她领押金”，到33行何才第一次决定一道去。21等前文没有她同行约定。父已实读当前24的1—65行确认。正式修订需最小删除电话里提前知道她决定的内容，保留到33行她自己作决定；陶随后亲见到场才知，不预先分配退押对象的行动。相关登记、证据与后文转述逐项核。保留B问题报告并在r1-text-edits中单独标记实际问题修复，与三点受控改稿性质分开，不能为省事提前补一个原来不存在的承诺掩盖问题。

核定后运行node acceptance/20261020-long-flow-090-t/revision-tail.mjs begin。它冻结24章/25两段/旧snapshot，设置15—24正式修订范围、revision begin并rewind15，返回T/r1-session.json（workspace/token）。所有后续修改只在该独立workspace。用嵌入T当前CLI（common.cli）并--project candidate，写命令带--revision-token，真实revision list/resume不改基线。主稿当前字节/24章和C两段必须保持。

将候选15—24相关原文按最小必要处改正，保留T/r1-text-edits.json数组{unit,old,new,reason}，每个old在目标原文恰出现一次。可在候选apply_patch，不能改主正文。保存原句/新句及旧新SHA。处理所有下游转述、receipt、现金、人物已知/未知；原始观察和引句绑定继续真实。父已读24完整1—153：81—83写原夹一张五十、仍一张五十，138/142又提退款；押60必须具体成五十加十元两张实际交出/夹账/取出/退还，不能把一张五十机械改成不存在的一张六十。原21交出也要核对面额及两笔20/100边界，不增新钱或误抵。读正文实际判断不是纯字符串换数。独立workspace没有分段目录，不需要复制旧分段或工具进去。C未登记两段留主目录；只报告影响不先替C改。

本进程只重登15—20，然后真正退出；21—24留同ID恢复。每章顺序：
1 node T/revision-tail.mjs template N（这里T代表acceptance/20261020-long-flow-090-t全路径，不用字面T），读取新replay-input和实际当前候选整章，核summary/characters/timeline/ledger/evidence/downstream六项。
2 保存T/r1-record-edits-N.json为精确路径补丁数组（可空[]）。格式{at:["changes","ledger","ID","statement"],old:"精确旧字符串",new:"精确新字符串"}或{at:[...],value:真实新值}，只允许summary/changes。更早章变化不能被后来原changes覆盖回去；不改不可变原观察。evidence引句只改对应实际新字节，工具绑定必须真实。
3 候选内写审查/T-R1-重登-NNNN.md，写当前draftSHA、实际完整实读范围、六项逐项分析、下游影响、没变项及未核范围；再T/r1-read-review-N.json {report:"审查/...",checked_fields:["summary","characters","timeline","ledger","evidence","downstream"]}。六项要实际核，不能机械打勾。
4 node T/revision-tail.mjs preview N，实际读预览；错误停下修复保留日志，用新label而不覆盖原证据。然后record N，读取结果。helper的固定label只执行成功一次，若失败另存修正helper或输入调用common.run唯一retry label，绝不删原命令目录。

多行文本/JSON用apply_patch，避免长PowerShell node-e和多层JS拼计划；每步检查退出值，失败不继续后续依赖。所有CLI通过common.run或run.mjs留原始输入/输出、退出码、状态前后。文学结论只能来自实读，不把脚本检查作盲读。

20登记后只保存T/checkpoint-r-first.json及候选审查/T-R1-中断0020.md：main revision/stateSHA和24篇SHA仍原、候选20篇revision、id/token本地路径、gen4、已改/未改/已核范围、21起具体恢复入口及六项风险，25两段依旧未改。不要prepare/commit，不恢复主流程，不写21重登或25，正常退出给父。主稿锁占测试和后续完整尾段连读由恢复进程完成。
