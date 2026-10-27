# 第2章修订重放六项实读核查

审查者：本次Codex执行代理，知情自检。会话ID=8cf5ae0a-54f3-424b-b89e-61562f20d120，owner=final-b-native-codex，base_revision=10，独立区=D:\work\other\ai-writer\acceptance\20261020-release-readiness-090-u\scenario-final\东岸末班船\.writer\revisions\8cf5ae0a-54f3-424b-b89e-61562f20d120\workspace。

实际范围：原第1—3章已从当前登记路径完整连读；独立区修改后又全文读第2章1—164行和第3章1—243行，并核原第2章replay-input恢复的summary/changes。原第2章SHA=890b9e8b183191013269abfbc2e8a3cec8b125becdf34406819b8495beaca6c5，当前第2章SHA=78ff1a743694ce4ca1fb0dcca7a7d94dab5f36b7305d2ba078522f408653d886；当前下游第3章SHA=3647db1243db710d9942db1df904aa301f349fc7ae050ce25803c2f18f20a221，该章尚未重登。本报告不冒充整个修订尾段完成复核。

## summary

原摘要“门维修工料三十元”据第2章58行本人报价和80行电话转述改成“三十五元”。21:10授权、21:40返程承诺、原单送达、箱未开未交与钱袋未取均继续成立；没有把第3章返回/退款写进第2章摘要。

## characters

许蓉亲听周岸报35元并记本，随后电话转述同额给老何；老何只能从这次电话知道，仍不知工具箱现场。沈禾在场听报价与转述，F_GATE_QUOTE中自己的文字原来没有金额，仍须结合当前35元条目读。周岸本人报35元，已离场不能知道沈禾后来洗手、父亲回饭热好了；沈成林只知女儿语音，不知维修价与21:40期限；梁伯仅通话授权范围。各人真实旧状态完整核读，只有许蓉和老何的显式金额段落需要改字，其他角色原段保留。

## timeline

原追加3条中，第2条许蓉向老何转述的30改35。第1条21:10—21:15授权和第3条21:26送单确认原字不改；21:30米糕店关门、21:40返程和22:00候船室关门均不动。不能以回退抹掉已经发生的原单交付。

## ledger

逐项实核原replay草案7条变化：P_TOOLBOX仍许蓉矮桌临管未开；T_RETURN原受托关系已清但未实交；T_DEPOSIT仍partial/80元；T_CALLBACK仍resolved但第2章照片尚待收到；P_ORDER仍resolved，previous_holder周岸→谭老板，原单未回到口袋；T_BACK仍pending，原返程时间未到。F_GATE_QUOTE的tags、reader_known、周岸/许蓉/老何显式金额及两条引文改35，沈禾在场知识来源保留，status仍active/due3不变。本章之后才在第3章转partial并带票。第1章O_BOX_PAINT不在本次changes，原type=observation、statement“箱盖左后角有一块月牙形的白漆。”及author_truth保持原值；没有删除原观察或用due延期。

## evidence

失效原句“这扇门工料三十元。”与“西门插销修好了，周岸报的工料三十元，我记在值班簿了。”分别据当前58/80行改35，CLI将按新正文取真实行号/SHA。其余本章引文逐条与新全文核对，仍原字存在：留箱、交谭老板原单、梁伯授权/八十、21:40等不变。未手编辑source_hashes或state；本次使用修改正文之后生成的replay草案，原before输入留存。

## downstream

完整读当前第3章：35行小票口述已改35；37行与值班簿对数、212行给老何发维修页、月底未付款逻辑继续成立。原80元及50+10+10+10、白漆53行、八件点具、交箱与凭据、父亲在家均保留。第3章还没生成replay输入，更没重登；下次必须用当前revision的新replay-input恢复真实旧summary/changes，语义修正其中“三十元/30元”和原引文，不能把旧整段状态覆回30，不能只刷新SHA。

结论：首个影响章2的重放草案可据本次实读修正后预览；不是自动无变化结论。六项checked_fields对应以上实际核查。另有当前完整章draft_review报告，两种保护分别填入，不能互相替代。未prepare/commit/abort，无正式发布。
