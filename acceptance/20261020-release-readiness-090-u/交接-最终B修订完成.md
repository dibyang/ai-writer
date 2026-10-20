# 交接：最终B正式修订完成，等待全新F

本次恢复同一个最终B执行会话，沿用原正式修订ID/token完成剩余第3章重登、最终2—3全文连读、prepare范围核查和正式commit事务。不是Git提交。没有另派代理、改产品、手编辑state/来源哈希、Git暂存/提交/推送、写第4章、导出或执行F验收。本进程正常结束；全新F仍待执行。

## 正式终态与身份

- 主稿W=D:\work\other\ai-writer\acceptance\20261020-release-readiness-090-u\scenario-final\东岸末班船
- 正式commit ID=b62dfd37-673e-4355-a354-642103603f82
- transaction ID=5acbb3c2-1c68-47d7-9b6c-550e01bcb481，status=completed，备份保留。
- 原revision session ID=8cf5ae0a-54f3-424b-b89e-61562f20d120，owner=final-b-native-codex，status=committed；保留原独立区D:\work\other\ai-writer\acceptance\20261020-release-readiness-090-u\scenario-final\东岸末班船\.writer\revisions\8cf5ae0a-54f3-424b-b89e-61562f20d120\workspace及所有证据，不再resume已提交会话。
- base_revision=10，候选完成重登/连读后branch_revision=14；正式主稿revision=11，schema6。
- 当前主state SHA256=f334272adb758892baf0220f94157ff472c8a427a055f6d5c6185049391b2e39。
- 活跃修订0，待恢复事务0。revision list仍列历史committed会话与completed事务，不等于列表为空，也不应删历史清理。
- 唯一产品入口仍W/.writer/tool/bin/ai-writer.mjs；本轮独立区实际用此父入口带--project独立区和原令牌，未复制运行包。
- content_id=ff6cde0f1be3459f7d8a4249e3dd8ee3eec39d468df48f9c2f11308e5bd6641b，runtime_id=9ed9031ff670f4c6e0ef5754b32e079e436d5e6de9576912b4742b6f541b138f，0.9.0。独立区及提交后主稿doctor/identify均通过，绑定未变。generation0/installednull仍只是未经过工具更新。
- 原生Codex对话ID未从当前接口取得，不编造；上述session/commit/transaction各有不同用途。原token保留在final-b-revision-session.json、首停交接及原始调用日志中，已提交后不能拿它另开或覆盖候选。

本次恢复用户原指令本地转录为U/final-b-resume-author-instruction.md，实际UTF-8 SHA256=0d7b199e1b773e24364ad4c45f204d218a2c409812fa0922b3723cdcfbbe07a8。其中已明确授权核清prepare后commit。state中workflow仍保留首停时的“只重登2、不prepare/commit”历史任务文字，这是本次自然语言恢复指令明确覆盖的上一进程停点；本次保持原revise_range2—3/draft_range=null和会话绑定，不手改该历史事件。F应以本交接、真实终态和本次授权理解已完成状态，不能因旧任务文字重新修订，更不能把next_unit=4当正文授权。

## 当前三章：恢复的唯一正文依据

路径均相对W，已与state.units[].draft及实际字节核对。

| 章 | 当前正文路径 | SHA256 | 正文汉字 | 字节 |
| --- | --- | --- | ---: | ---: |
| 1 | 正文/0001-灯下的箱子-v2.md | 6b7dda66e606b753b75cbebeab8af536b797b0060a9c14048932da58a6709893 | 5214 | 18640 |
| 2 | 正文/0002-多跑的一趟-v2.md | 78ff1a743694ce4ca1fb0dcca7a7d94dab5f36b7305d2ba078522f408653d886 | 3525 | 12463 |
| 3 | 正文/0003-把手朝外-final-b.md | 3647db1243db710d9942db1df904aa301f349fc7ae050ce25803c2f18f20a221 | 5226 | 18518 |

汉字按去标题后的Unicode Script=Han，不含标点/数字/英语。第1章正文与完整登记记录均保留原字节；第2章增两个“五”，第3章增一个“五”，正文总修改仅三处普通报价。路径仍含v2/final-b等历史名，不用名字判断版本。

## 改前改后与不变范围

依据原试验授权，由代理在ordinary事实小修范围内选择30元→35元，不冒充人类逐字指定、不宣称原30不合理、不在故事内制造涨价或错票。

- 第2章58行：这扇门工料三十元。→这扇门工料三十五元。
- 第2章80行：西门插销修好了，周岸报的工料三十元，我记在值班簿了。→同句三十五元。
- 第3章35行：门的。工料三十元，月底结。→同句三十五元。
- 实际语义修正：两章summary、许蓉/老何相关状态、报价/小票时间线、F_GATE_QUOTE标签/读者所知/按人所知/失效引文同步35。第3章不带回旧30标签，也不复制整张旧知识表覆盖前章修正。
- 80元押金及50+10+10+10、5元票款、五点半上工、21:10/21:30/21:40/22:00等其他数额约定不变；人物口气、八件工具、原单/原箱和两联去向、核心情节、世界边界均保留。

原O_BOX_PAINT三项精确保持：type=observation；statement“箱盖左后角有一块月牙形的白漆。”；author_truth“箱盖左后角确有月牙形白漆；它不是暗号，也不能单独充当排他归属证明。”。第1章7行→第3章53—57行转箱定向→180行装车辨认，实际跨卷兑现，非仅改状态；没有暗号/排他归属升级，due未延期。

受托归还/押金/返回已按真实动作闭合：周岸21:37带物返回，三人实际开箱按清单点八件，旧缝由照片/梁伯实际拨来外放核认；许蓉21:48交原箱给周岸，80元数清并交沈禾，两联分开。箱最后由周岸保管于三轮赴铺途中，未写已入铺；P_ORDER原单仍谭老板持有。沈禾带80及原借具条/下联回家，沈父收入钱盒。周岸留自己一联/空钱袋，许蓉留签交记录及照片。维修35元票已夹本、老何收到维修页并回复，月底款未付，F_GATE_QUOTE仍partial/due3。未知父亲旧交不补全。

人物知情分别核证：许蓉现场亲见但未见沈家晚饭或实际入铺；周岸本人办箱钱据，只从沈禾得知父亲收到还箱消息；沈禾现场核认后回家亲自展示；父亲仅女儿语音/下联及家中实物，不知码头白漆用途/报价/21:40；梁伯电话/照片回字知验收退款而未亲见；老何只知维修。F可核当前ledger各人子项，不把作者真相合成全知表。

## 本次真实完成的阅读与报告

恢复先实读首停交接、选择说明、主revision list及独立区status/doctor/identify；核主revision10与原三章、独立区revision12及所有已登记稿/报告/冻结对象SHA吻合。原ID/token调用resume，无begin/transfer/绑定改写。

第3章完整读1—243行后调用revision replay-input，实核全部旧summary/changes、原证据及第2章已修内容。正文自首停候选没有再改；另存原草案与语义修正版，保存真实六项replay_review和当前完整章draft_review，preview退出0才record至branch13。记录与报告均冻结，不用刷新哈希替代核读。

两章重登全部完成后重新按2→3完整连读：第2章1—164、第3章1—243，最终字节对应上表2/3；另回读第1章1—15的观察首见作为锚点，本轮未假称全新完整1—3审查。尾段报告及正式review：

- 当前报告=审查/final-b-resume-0002-0003-最终尾段连读.md
- 报告SHA256=30bcde32a4d23b40254a13d18a7a61bed8ea513a94bada56448da2eaad7695a7
- review_ref=.writer/reviews/ddebf5eb-1bd5-493b-b952-9137ebd3c334.json，范围2—3、两份正文SHA和冻结review-body齐全，提交后仍当前有效。
- 第2章draft/replay报告与首停同字节，已核真实阅读记录；第3章两个报告为审查/final-b-resume-0003-replay六项.md和审查/final-b-resume-0003-完整章.md，按实际保存字节与state/frozen_ref一致。

机械check退出0、三章登记、stale_units/changed_sources/impact_pending均空。rolling_review valid1/stale2；旧1—2和1—3报告保留但过期，pending_windows仍1—3。这不否定本次有效2—3尾段复核，也不等于完整1—3已覆盖；全新F须完整读当前三章并另存报告。旧正文/0001-灯下的箱子.md、正文/0002-多跑的一趟.md继续未登记警告，未来导出须核不纳入，不能自动删除或补登。

## Prepare/commit范围与提交后验证

实际完整读prepare的19项文件清单及prepared.json 1—1104行目标state/文件树/commit元数据。发布只有两份正文2—3、两份新journal、八个object（两份draft-review、两份replay-review、两份review-body、尾段review-report及commit元数据）、一份尾段review、五份真实报告和state；没有第1章、旧未登记稿、旧分段、工具/设定覆盖。目标主revision11，分支14未直接覆盖主修订号。

三份journal共126项patch按before/had/append长度只在内存逐步重放，精确重建最终snapshot；提交后三份SHA仍逐一吻合。将35元及合法新证据SHA归一回原值后，最终snapshot与原基线完全等价，证明除选择的普通报价和相应证据版本外未改其他事实。原消费哈希未追认改写，新replay来源由工具按当前上下文生成。

正式commit后19项发布文件与prepare.after全部匹配；目标state字节SHA一致；五份单章draft/replay报告的原路径与冻结对象吻合；尾段报告/两份正文冻结对象吻合。无活跃会话/待恢复事务，已完成事务与候选备份保留。提交后doctor/identify通过；13502份原产品、旧记录、原工具及历史分段与恢复前SHA一致，最终Git状态与入场相同，未动既有产品改动。

## 分段与交接历史边界

W/分段/0001、0002及0003/final-b-v1—v4等原中间稿全部保留。它们没有随正式修订同步；第2/3章旧片段仍可能写30元，第3章v4合章SHA仍旧428a4d730b6a9a5141feb2e4ce6c985889088f6fe3f4dcd392fba71a24d6cd61，不能再拿来拼回主稿。U/交接-最终B修订首停.md及最终A旧交接按原字节保留，代表历史状态；本交接以当前完整正文新建，作为之后恢复入口。当前三章以本表和state.units为准；若日后明确需要再分段，从当前完整稿另建版本并核按序组装等价，不覆盖历史。

## 交给全新F的未覆盖及可选项

1. 全新F实际完整审查当前1—3及本次改前改后，另存当前报告；本次同一知情会话自检不替代fresh阅读或真人盲读。
2. F依其实际授权正常更新workflow暂停且仅discuss，实际核第4章拒绝；本进程没有暂停、没有尝试第4章，不推断next_unit4许可。
3. F完成后按原授权导出草稿到新目录并核included/excluded/warnings；本进程没有导出、上传或发布。
4. 可选观察仍是物件整理的慢节奏、照片快语补清和饼干块/片/半包的计量精确度；未强制修改、未冒称已修复。父亲旧事及月底维修付款/箱入铺没有新增正文兑现，不为了清表扩写4。

本次恢复31—48共18次产品CLI均退出0，无产品或辅助失败，无需修正失败输入；首停的历史辅助异常仍完整保留。所有双流原字节/退出码/命令/输入副本/前后state在U/final-b-commands/31-*至48-*；核心记录为final-b-resume-inspection.json、final-b-resume-before-3/、final-b-resume-third-binding.json、final-b-resume-prepare-result.json、final-b-resume-prepare-review.md、final-b-resume-prepare-audit.json、final-b-resume-commit-result.json、final-b-resume-committed-verification.json。机械与文学结论分开，不宣称最终F已验收或正式发布。
