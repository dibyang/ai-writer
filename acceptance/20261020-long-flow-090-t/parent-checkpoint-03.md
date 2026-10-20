# 父检查点03：B/C-first完成，R-first正在运行（未完成本轮）

2026-10-20。沿用01/02的产品修复、构建测试和限制，不重跑无变化的10分钟套件。当前主稿24章/r62/gen4，总105123 Han；工具e25b6416d61e498fca37c7a25a3f66e889d85e5d56e8ddca9e2b0c16a1b56f27，产品10文件仍冻结。

B实际退出0/1593307ms，thread01a15685-e97b-7770-b842-cca80a415e9f。22/23/24为5113/5078/5032 Han，各四段。完整当前19—24独立行覆盖native-b-window-read.json为1128非EOF行；父完整读其滚动报告83行和各纲文回对报告，另完整读22原文167行及24原文153行。真实H1：24第23行林电话提前说何同行，到33她才决定；B留审查/T-0024-已登记硬问题-H1.md与滚动报告，不锁外改。父R-first prompt明确正式修这一实际问题，三点数值改稿另属受控实验。21借车押50与24退押50将受控改60，必须实际五十加十元两张，不能一张六十。布期限15:00→14:55、何14:50在店；短信14:58→14:57；原工作/场地时段与其他20/100/80/22日18点原归期不变。

C-first实际退出0/745608ms，thread01a1569f-05fa-7030-8585-9b93513f8f4c，PTY76023已结束可不再poll。25仅part01 1823+part02 1837=3660 Han，最终两段完整读；未part03—06/合章/record/26。parent-c-first-interruption-verification.json独立验证24篇/state仍r62原字节，真实两段、context/template、45来源均匹配；native-c-first-context-parts.json严格证明context/template/两段共1229行真实返回（不等于理解）；native-c-first-prefix-read.json证明22—24原文完整覆盖。checkpoint-c-first.json第2行明确实际threadID/exit由父独立捕获，未假造自身不知道的ID。恢复必须用同一个真实C thread。

新父附加校验错误已纠正，保留原失败而不改稿/追认哈希：
1 verify-b首次最终写b-final-verification.json碰B同名EEXIST，改parent-b-final-verification.json，parent-b-verify-retry成功；parent-b-notes.md留原toolchunk。
2 扩展verify-native-read为可选候选project时父误写ES import `work:defaultWork`，SyntaxError（本会话chunk0ebea6），改`work as defaultWork`；旧代码verify-native-read-before-es-import-fix.mjs保留，parent-c-prefix-read-retry成功。第一次错误不是run.mjs捕获，不能伪称其原始stderr在commands。
3 parent-c-first-verify误断言CP必须含实际threadID，CP已明确由父提取，断言错误；旧代码before-checkpoint-contract-fix保留，真实失败stderr在commands/parent-c-first-verify。改核CP state/r62/gen4+原生thread.started格式并把ID写父回执，parent-c-first-verify-retry成功。

**当前唯一活动原生进程R-first**：commands/codex-r-first，PTY4825，prompt-r-first.md。只做15—24完整实读/选合法普通改稿+H1，revision-tail.mjs begin冻结主24/25两段、正式workflow范围15—24、begin/rewind15，候选修改后只实读重登15—20、保存checkpoint-r-first.json并真实退出。尚未有可宣称成功的R结果。main在实际begin前仍r62，begin后workflow r63但24正文不变。用live.mjs codex-r-first（比progress少重复错误串）检查。不要开启并行写作进程。

父已准备（仅方案文件/辅助代码，非已执行结果）：
- revision-tail.mjs phases begin/template N/preview N/record N/diff/review，补丁来自原生实际审读六项；diff原始snapshot差异。begin依赖codex-c-first退出0，读r1-session.json取workspace/token。
- prompt-r-resume.md：同R真实thread resume，21—24重登后再完整15→24连读/报告/review/diff，退出留父审，不prepare/commit。first退出后父应实际对主plan25写命令测试仍被占用拒绝、state不变（即无进程活着也不放锁），留原始错误，不预猜code；再resume R。
- publish-r1.mjs：父审raw snapshot差异和所有正文改动后，写r1-parent-approval.json {approved:true,candidate_state_sha256,diff_sha256,text_edits_sha256,candidate_bodies:[{unit,ref,sha256}]}，不能自动批准未知差异。运行preflight只读核所有编辑清单能在原分段内唯一替换、精确重构候选/原prefix14/不可变原观察/C25两段；通过才正式运行prepare/commit/恢复trial/写新版分段（NNNN-t-r1）和r1-current-segments.json/r1-publish-verification.json/交接T-R1-正式提交.md。尚未执行，不能称已发布。原始R报告须实际读，差异必须父逐项分析；evidence SHA可与正文变化对应，但语义不能一概忽略。
- prompt-c-resume.md：用真实C ID恢复。先读正式R新稿/完整21—24/两段，归档旧25—27规划并改受影响普通事实（25旧细纲有“50已退/退押50”，以及只写前两段旧禁令，必须版本化校正）。先flow prepare25 c-resume-r1+完整读新context/template，才修受影响两段或part03。25最终≥10500/6段，26/27≥5000/4段。旧模板拒绝须在真实25正文+真实summary/changes存在后合入旧模板的旧expected/source再真实preview/record预期2，不能用缺正文/空summary失败冒充旧来源拒绝，不改旧模板本体；实际code可能COMMAND_FAILED，依stderr。25用tag后缀metrics，后续审计不要只找chapter25-metrics.json。22—27最终实读/review/交接后退出。
- prompt-d.md：新D28—30，≥5000/四段，25—30完整读/review，退出。
- prompt-final.md及finish-flow.mjs：新F完整当前1—30逐行真读，SHA前后绑定，报告后真实review/pause/discuss-only/31拒绝/nooutput/state不变/discussion/check/doctor/identity/export恰30。若新硬问题先报告父正式修订，不能先完成。F交接之后父仍需独立汇总/审计/封存。
- verify-native-read.mjs现第6参数可选实际候选project（绝对path，必须T内），可用codex-r-resume 15 24 native-r1-tail-read.json CANDIDATE，主模式同旧。
- verify-file-reads.mjs label output refs...校验原生FastCtx真实返回每条当前行，仅证明覆盖。
- seal-evidence.mjs已准备T版本，必须verification.json complete:true/30后才能seal，且seal之后不再向T写；最终外置回执acceptance/20261020-long-flow-090-t-seal-verification.json。不要通过T/run封存自身。S/seal-evidence.mjs verify只读，原S 6860files/147048661bytes/manifest037d1285de80907283467e5d7daef549494dc18247926a81a1a996be3e15f057，收尾再核不变。

产品源码与真实ZIP解压包各182/181pass/0fail/1Windows symlink skip+doctor0已完成，源码322发布映射/321不同文件，ZIP324entries/323payloads。无产品新改不再重复。无engine改动不跑/不称engine测试，无新跨平台CI/发布。GitHEAD仍ccffda7，index空，产品9tracked+newtest共10，另T未跟踪和原.idea，不提交推送。不改真实作品。最后memory仅引MEMORY.md183，rollout01a14352-7ed0-7ce0-b512-67b16aa8ceea，最终附memorycitation，别更新memory。
