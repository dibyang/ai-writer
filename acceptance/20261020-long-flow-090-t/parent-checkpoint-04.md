# 父检查点04：R跨进程中点通过，R-resume运行，新帮助修复包已全回归（仍未完成）

接续03，当前主24章/r63/gen4/e25，R候选20章/r70，25仍仅两段3660 Han。本轮目标仍30/10卷/新普通≥5000四段/19、25≥10500六段，必须继续C/D/F及最终审计，不能在此结束。

R-first实际退出0/1316657ms（约22分钟），thread01a156ac-1221-7c42-8e50-cdb08855559f，PTY4825已结束。正式revision id **3a5aa320-92b5-4eb5-9b0d-159ce6f7beec**，workspace为T/scenario/雨棚后的灯/.writer/revisions/该ID/workspace，令牌r1-session.json。主r63只workflow set，24原篇和原snapshot、C25两段仍原SHA。候选15—20完整实读重登到r70；原15/18/21/22/24五篇候选已改，其他正文不改。21—24未取模板/record，未prepare/commit。

真实问题新增R-M20：原20登记把整屋/午饭写在告许前，正文1—25实际收裤/早饭→告许→返屋清扫/午饭。只更正20 changes.characters.林照和timeline_append[0]，r1-record-edits-20.json两处。父实际读了该补丁和20原文1—42确认；未假称父全文读20。父另完整读r1-text-edits.json 23项，以及候选审查/T-R1-中断0020.md 35行；数字改稿与H1/R-M20分开。受控金额还影响24“另一半”，已改为新100何自己出，不只替数字。两张钞50+10交出/夹账/抽出/捻开/退还均候选实写。三点数值是父代理试验，非人类作者逐字选定。

父真实独立证明：
- native-r-first-main-read.json：原生R完整主15—24，1631非EOF行。
- native-r-first-candidate-read.json：原生R完整当前候选15—20，1001非EOF行。
- parent-r1-mid-verify命令0；r1-midpoint-verification.json：进程已真实退出仍可凭原id恢复；主plan25真实拒绝REVISION_OCCUPIED，主stateSHA前后0bf4a86baf2aeae9daa2a6ab0dd39f580e3a2119494645df77155fc90ed59d9a不变。24原文/units/两段保持。不是按PID死亡放锁。

**当前唯一活动原生写作进程：commands/codex-r-resume**，PTY21818，同真实thread **01a156ac-1221-7c42-8e50-cdb08855559f**（live已确认），prompt-r-resume.md；最近已真实revision resume原id，正在继续21—24重登，然后最终15—24一次完整连读/review/diff，待父审，要求退出不prepare/commit。至检查时15 completed items/0嵌套错。仍使用gen4/e25，不在活动R中更新。progress用live.mjs codex-r-resume。

## 第二个真实产品问题：help携通用project失败，已修主源码和最终包

03里对R两个错误的早期描述需更正：ledger实际是未知命令（没有该独立CLI），不是缺子命令；错误提示指向help。第二次实际仅help --project路径，也报“help只接受一个命令名”，是真帮助恢复缺陷，并非多传主题。原记录r1-entry-ledger/r1-entry-help，说明help-recovery-problem.md已完整保存。R-first自己也更正了文档。

lib/workspace.mjs帮助解析现允许最多一个主题+project/revision-token，未知/重复/缺值仍拒绝，不访问/更改作品。tests/usability.test.mjs新增3真实定向测试：修前2fail/1pass，修后3pass；包括真实随附未知命令→帮助。quickstart/user-guide/CHANGELOG/RELEASE_NOTES增说明。产品从10文件变为**12文件**（新增修改workspace和usability，原new observation test仍在），冻结**product-frozen-contextual-help.json**。source-contextual-help.json沿用准确源/包映射，322映射/321不同源，已实际对根和ZIP核同。旧product-frozen-guarded和182项e25验证只代表历史，不再当最终当前。

最终新包 **contentID37096262d76a9dc17b7b2c23f57f8cfe87f6295a45c21b40ecdcfa1c0edc770b**，ZIP **f1cddcb8461b5234e94738ef3566554fed6311b0d89c3d3a4076eef0d58580ea**。T/candidate-contextual-help；实际ZIP解压 **D:/work/other/ai-writer/.tmp/长篇 0.9.0 T 帮助修复交付解压/ai-writer-0.9.0**。324entries/323payloads，CRC/路径/唯一/全部SHA/精确集合均过。

**最新最终源码及真实解压包各185总/184pass/0fail/1Windows symlink skip**，source658251ms、package515750ms，两端npm run doctor均0。contextual-help-build-verification.json已由contextual-help-build-proof实际通过，322源/包映射与12改动文件冻结均匹配。两个完整测试PTY84323/84087和doctor11673/83138、build26707、zip40730均已结束并poll，不再重复测试（除非真改产品/新失败）；无engine改动/无engine测试/无新跨平台CI发布。此前观察保护/真实旧事务complete拒绝+rollback仍有效，当前185套件也含那6项。

T/common.run现将args[0]=help和--help按纯文本处理，旧版common-before-help-text-support.mjs留存；这个T辅助适配不能让旧gen4 help假通过。R仍oldhelp，后续更新后C须真正调用新随附help+help record。

## 父后续必须顺序执行

1 R-resume退出0后，实际读候选审查/T-R1-0015-0024.md、交接T-R1-待父审计、r1-native-ready、全部新补丁，生成/检查r1-semantic-diff.json；用verify-native-read.mjs codex-r-resume 15 24 native-r1-tail-read.json **候选绝对路径**证明最终全尾段当前字节覆盖。
2 独立审全文改动清单能重构候选、所有原观察type/statement/author_truth不动、前14/body与main24和C两段保持；审raw final snapshot差异及各单元重登patch（尤其20时序）。不能只把未知diff全部批准。父写r1-parent-approval.json字段：approved:true,candidate_state_sha256,diff_sha256(整个r1-semantic-diff文件),text_edits_sha256,candidate_bodies:[{unit,ref,sha256}]。这是模型父审，不伪称人类批准。
3 **publish-r1.mjs现在是三阶段，03旧说明已过时**：先`... preflight`只读核所有分段编辑可在一段内唯一替换并重构候选；通过才`... prepare`，它只prepare并退出。父再实际审`.writer/revisions/ID/prepared.json`精确changes/目标state/新增commit元对象，没有未知源码/源文件/设定偷偷改；写**r1-parent-publish-approval.json** {approved:true,prepared_sha256,changes:真实changes数组}。最后`... publish`才commit/恢复trial/写NNNN-t-r1新分段与r1-current-segments/r1-publish-verification/交接T-R1-正式提交。不要不带mode运行，也不要自动批准prepared清单。全部正式CLI仍T嵌入gen4/e25，不能在commit前换包。
4 只有R已正式提交、会话/事务全终态后，运行**install-contextual-help-tool.mjs**（已准备，尚未执行），依赖上述r1-publish-verification和contextual-help-build-verification。它用实际新ZIP解压外部CLI update-plan/update，从**gen4→5**，24篇/units/snapshot/阶段/决策/根AGENTS/docs/skills全SHA等价，真实help携project成功/state不变；保留旧delivery到delivery-before-contextual-help.json，再更新delivery-current.json；生成contextual-help-tool-update-verification与交接T-工具再次更新后当前入口。这步尚未发生，当前delivery仍gen4/e25。
5 用原C真实ID **01a1569f-05fa-7030-8585-9b93513f8f4c** resume，prompt-c-resume.md已改期待gen5/new3709、实际验证help，先读R最新和两段/修正并归档旧25—27计划中50及“本C只两段”历史限制，再新flow prepare25 c-resume-r1/完整读source，再续part3—6/25≥10500。旧模板拒绝必须在真实正文与summary存在后合旧expected/source输入，防ENOENT/空summary假冒过期保护。25metrics带c-resume-r1标签，26/27正常，最终22—27全文/review/交接。新上下文和模板必须在修改/续段前取得并实读；原两段实际无三点直接数值但仍要核影响，不能偷刷新哈希。父已完整实读两段58+60行。
6 新D prompt-d.md现gen5，28—30四段≥5000，25—30最终读/review。新F prompt-final.md现gen5/new3709，真正当前1—30全读、前后SHA、报告、finish-flow.mjs；finish-flow与final-support-audit.mjs断言已改gen5（输出gen动态），尚未运行。新F若发现硬问题先父正式修再继续，不宣称通过。
7 final-support-audit.mjs已准备，当前分段选择合并inherited/r1/newmetrics；1—3/5—6不声称映射，证据逐条SHA/quote/line，全部30最小Han、19/25六段其余新四段。C25若真改应另核before-r1归档原SHA，当前代码只列新旧SHA，收尾需补这个断言。
8 budget25已经在R begin前实际通过**budget-25-verification.json**，parent-budget-25-before-r1捕获；budget19早已过。若要验证新工具/R后25预算，需给budget.mjs增加可选tag并保留旧脚本，然后**C-resume已校正25计划并取得新context/template之后、尚未登记25时**用独立tag运行，别重复旧固定label，也别把旧计划的50来源当新有效写前语义。
9 最终F退出后父当前30全行覆盖native-final-read-coverage、support/commands/sourcefreeze/git/S封存/导出恰30/31拒绝/未知与可选风险全审，README诚实写实际30约14万非百章/非真人/未发布。verification.complete:true仅真完成；T seal脚本和外置回执，不通过T/run封存自身。S6860files/147048661/manifest037d1285de80907283467e5d7daef549494dc18247926a81a1a996be3e15f057不变。未提交推送，真实作者作品不动，原.idea不动，HEADccffda7/index空。最终memorycitation只MEMORY183+rollout01a14352-7ed0-7ce0-b512-67b16aa8ceea。

每60秒简报/≤30秒等待，FastCtx优先，继续直至完整任务结束。最近预计余下约2小时，不因套件全绿而提前结束小说流程。
