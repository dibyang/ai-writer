# 百章长篇真实 Codex 实跑（本轮完成）

本轮将《潮汐信号》从原24章扩大到100章，完成多轮文件恢复、跨卷具象伏笔回收、三轮多处旧章作者改稿及最终全书模型实读。结果是模型/CLI实跑与独立机械及定向语义复核，不能当作真人盲读、市场或发布验收。

最终独立冻结：**100章、13卷、r371、228287正文汉字**；新25—100共76章189745字，单章**2411—2840**，均满足2400—3200约定。原1—24保留上一轮规格，不声称百章每章都达到新下限。[结构化最终验证](final-verification.json)、[主会话最终独立复核](final-parent-review.md)、[最终100章草稿](final-review/export/manuscript.md)为入口；r350是修前生成阶段，未冒作最终版本。

最终真实作品state为1095397 bytes，实际跨过1MiB并完成恢复/重登/导出；与主测试的1.7MB合成样本分别记录。

第二轮作者改稿B从36章正式回退后重登31章，13章正文/7份细纲修改。详见[主会话语义复核](revision-b/parent-semantic-review.md)及[audit](audits/revision-b.json)。下文r165为B修前第七轮创作冻结点。冻结后又补查到“缺轮椅”追踪简写，已安排72章批次后的正式修正，见[pending-semantic-findings-at66.md](pending-semantic-findings-at66.md)；不能将B的定向通过扩大成全书没有其他问题。

session-09中间修复已到**72章r247、158006Han**并独立复核，详见[中间证明](intermediate-proofs/repair-at72.json)、[语义复核](intermediate-proofs/repair-at72-review.md)及[最终78的实际73输入绑定](intermediate-proofs/repair-at72-final-binding.json)。32起41章已正式重登，895原锚点保留，0—72快照仅五种词义澄清，72只改一句离家口语。最终78已正常完成；75日期词另正式回退修复，但其人物摘要的提前知情问题仍由下一阶段处理。

session-10已将75知情修正正式重登到**78章r263**，中间副本[独立证明](intermediate-proofs/repair-at78.json)及[实读复核](intermediate-proofs/repair-at78-review.md)通过：78正文、前74登记、944引文保持，仅两条目标路径变化。实际79已接用该状态，[最终84绑定](intermediate-proofs/repair-at78-final-binding.json)通过，完整阶段已正常完成。

已完成13轮创作、作者改稿A/B/C及最后全书复读，**17个不同的原生Codex会话**均正常结束。原生进程累计43280秒，最终全书进程3475秒；不把这些当模型吞吐基准。旧CLI配置不兼容与父沙盒数据库权限两次启动失败另留档，不混入完成数量。程序没有指定模型覆盖，使用本机0.163.0-alpha.10.2真实入口，内层workspace-write。作者改稿A改变开放时间、旧两页保管位置和全文预看顺序；B改变同砖缺口方向、核听费和归钥时间；C改变门闩同笔费用、原录所选遍次与留椅约末，并同步对应知识、计划、引文和实际时点。

## 当前证据入口

- [计划和边界](plan.md)、[发现与处理](findings.md)、[启动来源](origin.json)、[环境](environment.json)。
- [最终独立审计](audits/final-review.json)：3074机械项、1157当前引文、544在用文件通过；51有效报告、62失效历史均有当前完整覆盖，pending为空。覆盖不等于文学及格。
- [实际原生阅读返回证明](final-reading-proof.json)：100篇当前SHA、7822行、269非空分段与真实原始返回对应；16个旧版本范围不计当前覆盖。实际模型阅读依据是[全书报告](works/潮汐信号/审查/final-review-overall-0001-0100-r371-complete.md)和17份分组笔记；根另完整读最终六改章与10组逐章差异。
- [最终十份输入绑定](input-bindings/final-review/proof.json)、[全部101快照保护](final-invariants-proof.json)、[两项有意引文替换](final-anchor-mapping-proof.json)：旧ID身份/due/初始观察保持，1153条原句保留+2条有意替换+2条新增=1157，不说全部旧引文字面不变。先修到r361的候选曾遗漏两个早章首锚，第二次正式92起重登到r371才补回，原失败仍保留。
- [最终v4实际context绑定](integration-documentation/native-context-proof.json)对应10次正式登记消费的源字典；[百章混合漂移探针](parent-commands/final-mixed-drift/stdout.raw.txt)确认最早25、一次回退恢复、canonical未动。它不是整书重新登记证明。
- [百章生成独立审计](audits/session-13.json)、[主会话97—100语义复读](session-13/parent-semantic-review.md)：3072机械项、1155当前锚点通过；四章完整实读、97处非证据状态变化/96组逐句差异全文读完，[真实输入与成功CLI绑定](input-bindings/session-13/proof.json)及前96登记/快照不变。三个有限事项完成、两条纸音总线保留partial，不以due100强收未知。此为生成阶段快照，已发现问题仍待最终修。
- [96章独立审计](audits/session-12.json)、[主会话语义复核与必修项](session-12/parent-semantic-review.md)：2975项、1109锚点通过，六份全文实读与最终SHA一致；[6份真实输入/成功CLI/逐章快照绑定](input-bindings/session-12/proof.json)和193组逐句差异实读。95遗漏正式修复及96实际消费证明在[中间证明](intermediate-proofs/repair-at95/proof.json)与[后续输入](intermediate-proofs/repair-at95/actual96-input-binding.json)。编号穿入人物、罗旧知标签和总线残留等父发现仍待最终修，不以本批绿灯覆盖。
- [C后90章独立审计](audits/revision-c.json)、[主会话语义复核](revision-c/parent-semantic-review.md)：2846项、1052当前锚点、14改章实读版本绑定；前40登记/快照及全部33初始观察保留。首轮50次、补充11次正式重登；[全部50份最终实际input/CLI/逐章快照绑定](revision-c-parent-reading/input-proof.json)通过。旧时长表述修正经91份完整快照精确核对。27单页待核仅补入90当前总线，未凭空结案。原生C的少量前置命令归档缺口见[result](revision-c/result.md)，保留合并原回包，不补造分流。
- [90章独立审计](audits/session-11.json)、[定向语义复核](session-11/parent-semantic-review.md)：2670项、1050引文通过；本批85—90完整实读及最终版本绑定、27/31复读绑定。88有限路线/月后选择阶段回收，89撤回/90落实限范围；[27单页待核](pending-paper27-at90.md)不当作丢失或已处理。
- [84章独立审计](audits/session-10.json)、[定向语义复核](session-10/parent-semantic-review.md)、[真实六份input/成功CLI/逐章快照绑定](input-bindings/session-10/proof.json)：2546项、998引文通过；本批六章完整实读并绑定最终版本。两车/三晨/新单阶段兑现，长期/纸物及旧未知未虚报结案。
- [78章独立审计](audits/session-09.json)、[主会话语义复核](session-09/parent-semantic-review.md)、[75日期修复独立证明](session-09/parent-date-repair-proof.json)：2414机械项、944锚点；实际完整读取73—78并绑定最终版本。75知情问题见[pending-knowledge-findings-at75.md](pending-knowledge-findings-at75.md)，未误报已修。
- [72章独立审计](audits/session-08.json)、[本批语义复核](session-08/parent-semantic-review.md)、[72章两行修复独立证明](session-08/parent-repair-proof.json)：2292机械项、895引文、前71登记不变，6章实读最终版本匹配。声音方法阶段兑现而旧余带无解，原due72保持partial；职业阶段兑现不等同长期收入保障。
- [66章独立审计](audits/session-07.json)：2159项机械核验、837条引文、无待审窗口；主会话61—66逐章实读版本与冻结稿一致。原始151项知识文本及原时间线前缀的保留核对见legacy-proofs/session-07.json。机械保留不代表语义正确。
- [60章独立审计](audits/session-06.json)：1987项机械核验、743条引文、无待审窗口；主会话55—60全部实读版本与最终冻结稿一致。56的新三轮已付180、旧款付240/两段未清、重开经费未知，开门线仍partial与due56；真实context57继续强召回见parent-commands/stage06-due-recall/，不能称整条线已全部解决。
- [54章独立审计](audits/session-05.json)：1816项机械核验、650条引文、无待审窗口；主会话49—54全部实读版本与最终冻结稿一致，身份核验见session-05/parent-reading-version-proof.json。
- [48章独立审计](audits/session-04.json)：1658项机械核验、570条引文、无待审窗口；只证明版本与覆盖，不是文学质量验收。
- [43/44正式修复的独立差异证明](session-04/parent-repair-proof.json)、[本批定向语义复核](session-04/parent-semantic-review.md)。其他阶段保留各自request/events/stderr/final/process-result、命令原始输出、阅读记录、审查和导出。
- [改稿A的独立语义复核](revision-a/parent-semantic-review.md)、revision-comparisons/逐章状态与知识对照。r109曾丢4条未改引文的辅助迁移失败保留，正式第二次回退后修复至r128。
- checkpoints/按完成阶段冻结正文、状态、当前journal、来源与报告；parent-reading-copies/记录主会话实际全文读取的版本，不能把文件哈希当阅读。

## 已合入的工具修复

正文与更早来源同时漂移时，context/export原来只报正文回退点，保护正确拒绝，但恢复指引与status不一致。现汇总两类漂移，返回CONTEXT_CHANGED及最早recovery.from、修订号和可用命令。修改为lib/workspace.mjs、lib/help.mjs，新增4项真实CLI回归。

隔离候选与合入后的主工具均59/59测试、doctor通过；引擎29/29通过。原始结果见integration-v2/和parent-commands/integrated-v2-engine/。后续写作绑定[source-baseline-v2.json](source-baseline-v2.json)的72个文件，当前作品内置工具同步，未改变权威状态。

90静止检查点后另合入精确ledger ID优先召回v3，保留其他关键词AND/原顺序/total/omitted，读操作不改state。隔离候选红→绿后，主版本也实际60/60无skip+doctor通过，详见[integration-v3/review.md](integration-v3/review.md)。作者C起使用[source-baseline-v3.json](source-baseline-v3.json)完整246来源，90state SHA不变；此前v2记录仍指当时版本，不回写历史。

混合漂移的真实42章副本探针见mixed-drift-before/和mixed-drift-after42-r2/。后者只证明按指引一次回退恢复，不冒充全书重登；测试/探针辅助失败也保留。

v4上下文指引、帮助及手册共7文件已在100章静止点合入，主版本60/60、引擎29/29，均无skip，doctor无错误/警告。新指引说明追踪章号/ID只供定位，人物正文使用可知日期称谓动作；它不是自动语义检测器。先前隔离验证见[candidate-v4-verification.json](candidate-v4-verification.json)，实际合入/激活见[integration-documentation](integration-documentation/)，最终来源为[source-baseline-v4.json](source-baseline-v4.json)完整246文件；主与作品内置help/longform同步，合入时state字节不变。最终原生运行与实际context绑定、最终全部246哈希复核均已完成。后续只有作品/验证资料变更，未重复无新增依据的主回归。

## 范围与文件级封存

本轮已确认问题均已正式处理，最终回退/重登/审查/导出及独立核验完成。56/72/100等到期只是审查点，旧款、未知声源与纸页中途日期不强行结案；故事仍是草稿，报告保留重复场景骨架的阅读代价。原始24章轮次9826文件和清单在原生结束后再次核对无变化，见[最终原目录完整性](origin-final-integrity.json)，前次[检查点](origin-integrity.json)不覆盖。

文件级封存入口为[evidence-manifest.json](evidence-manifest.json)，只排除清单自身；`node acceptance/20261016-hundred/seal-evidence.mjs verify` 可重新核对。原始失败、候选和未执行设计稿均保留其真实状态。C少量前置命令及最终首次git status只有原生合并回包，不伪造分流；主会话帮助文本误按JSON的失败见parent-commands/final-v4-context，修后新标签通过，不说首次全绿。

无提交、无推送、无发布；原有.idea/不在本轮变更范围。所有作品导出仍为草稿，模型阅读、字数与脚本通过不等于真人盲读或市场验证。
