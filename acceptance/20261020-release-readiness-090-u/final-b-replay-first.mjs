import fs from 'node:fs';import path from 'node:path';import {U,W,write,json,hash,run} from './final-b-run.mjs';
const session=json(path.join(U,'final-b-revision-session.json'));const B=session.workspace;
const before=json(path.join(B,'.writer/drafts/final-b-replay-2-before.json'));const x=structuredClone(before);const edit=json(path.join(U,'final-b-revision-edits.json'));
const replayReport='审查/final-b-replay-0002-六项核查.md';const draftReport='审查/final-b-revision-0002-完整章自检.md';
write(path.join(B,replayReport),`# 第2章修订重放六项实读核查

审查者：本次Codex执行代理，知情自检。会话ID=${session.id}，owner=${session.owner}，base_revision=${session.base_revision}，独立区=${B}。

实际范围：原第1—3章已从当前登记路径完整连读；独立区修改后又全文读第2章1—164行和第3章1—243行，并核原第2章replay-input恢复的summary/changes。原第2章SHA=${edit.files[0].before_sha256}，当前第2章SHA=${edit.files[0].after_sha256}；当前下游第3章SHA=${edit.files[1].after_sha256}，该章尚未重登。本报告不冒充整个修订尾段完成复核。

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
`);
write(path.join(B,draftReport),`# 修订第2章完整章自检

审查者：本次Codex执行代理，知情模型自审。实际完整读独立区正文/0002-多跑的一趟-v2.md第1—164行，SHA256=${edit.files[0].after_sha256}；并全文读下游第3章1—243行，SHA256=${edit.files[1].after_sha256}。原2—3全文此前已读，旧字节保存于U/final-b-revision-before。新第2章只在58/80行将三十元改三十五元，其余字节机械差异复核与实际阅读均保持。

有效第2章细纲SHA256=b4099834a3ae98f2551aca6cc6c46501f9743f26c72e1477b34aa70871a05bc2。goal/change由21—45行真实外放、33行委托、37—43行钱袋/凭据安排及74行出发落实；沈父本章不再直接通话，沿首章实际信息经女儿129行语音接续，没有伪称新增电话。五项beats分别由19—53通话、13—17/84—90/123—129工作与回家选择、58—80普通报价及转述、33—43授权、70—74/147—163留箱留纸/实际离场兑现。禁止项仍成立：未预写第3章归还，周岸离场后不知洗手/父亲回复，梁伯未讲父辈全史。

报价选择是代理在既有普通小修授权内完成，35元与第3章新小票一致；并无错票、克扣押金或故事内临时涨价。80元押金、5元票款、21:10/21:30/21:40/22:00、人物语气、原单与原箱保管都未改。第2章结尾仍是候船室内许蓉/沈禾、原箱闭合矮桌、周岸取物未返，下游第3章从此续接。

人物/文学判断：许蓉顾关门与留灯，周岸先取得委托再跑一趟，沈禾把工作安排接好且保留家用车，这些选择的收益没有被普通金额调整改变。无新增高置信连续性或物理动作问题。第3章仅下游核读，尚不算已登记的修后尾段。

## 真人语言别扭句

有没有哪句话意思能够看懂，却让你觉得别扭、像为了写得漂亮硬拼出来，或者不像一个人当面会这样说？

### 真人语言硬问题

没有

### 风格偏好观察

按当面说话、动宾拆分、具体落地、逐句默读改口核对；未作真人音频朗读。“有的人坐了一辈子，拿钱比找手机快”是许蓉的具体经验口气，保留；多处收拾物件适合慢叙述，压缩只作为建议。本次两处普通报价的改字没有把任何角色改成审核口吻。

可在已授权2—3范围重登第2章，首章原观察保持；当前没有第3章登记、尾段review或提交的结论。两份报告是实读记录，文件哈希本身不证明文学通过。
`);
const price=s=>s.replaceAll('三十元','三十五元');
x.summary=price(x.summary);
for(const k of ['许蓉','老何'])x.changes.characters[k]=price(x.changes.characters[k]);
x.changes.timeline_append=x.changes.timeline_append.map(price);
function changePrice(v){if(typeof v==='string')return price(v);if(Array.isArray(v))return v.map(changePrice);if(v&&typeof v==='object')return Object.fromEntries(Object.entries(v).map(([k,v])=>[k,changePrice(v)]));return v;}
x.changes.ledger.F_GATE_QUOTE=changePrice(x.changes.ledger.F_GATE_QUOTE);
x.replay_review={reviewer:'本次Codex执行代理；知情自检',report:replayReport,draft_sha256:hash(path.join(B,x.draft)),checked_fields:['summary','characters','timeline','ledger','evidence','downstream']};
x.draft_review={reviewer:'本次Codex执行代理；完整章知情自检',report:draftReport,draft_sha256:hash(path.join(B,x.draft)),report_sha256:hash(path.join(B,draftReport))};
write(path.join(B,'.writer/drafts/final-b-replay-2-valid.json'),x);
write(path.join(U,'final-b-replay-first-binding.json'),{session_id:session.id,draft_sha256:x.draft_review.draft_sha256,replay_report:{path:replayReport,sha256:hash(path.join(B,replayReport))},draft_review:x.draft_review,original_input_sha256:hash(path.join(B,'.writer/drafts/final-b-replay-2-before.json')),valid_input_sha256:hash(path.join(B,'.writer/drafts/final-b-replay-2-valid.json')),source_hashes_unchanged:JSON.stringify(before.source_hashes)===JSON.stringify(x.source_hashes)});
run('26-preview-replay-first',['record-preview','--input','.writer/drafts/final-b-replay-2-valid.json','--revision-token',session.token],B);
