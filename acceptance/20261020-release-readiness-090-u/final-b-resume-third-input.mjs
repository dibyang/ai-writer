import fs from 'node:fs';import path from 'node:path';import {U,W,write,json,hash,run} from './final-b-run.mjs';
const s=json(path.join(U,'final-b-revision-session.json'));const B=s.workspace;
const x=json(path.join(B,'.writer/drafts/final-b-resume-replay-3-before.json'));const body=fs.readFileSync(path.join(B,x.draft),'utf8');const bodyHash=hash(path.join(B,x.draft));
const old=json(path.join(W,'.writer/state.json')).units.find(u=>u.unit===3);if(bodyHash!==x._replay.draft_sha256||old.sha256!==x._replay.old_unit_sha256)throw Error('Draft baseline mismatch');
const sources=Object.entries(x.source_hashes).map(([p,expected])=>{const actual=hash(path.join(B,p));if(actual!==expected)throw Error('source mismatch '+p);write(path.join(U,'final-b-resume-before-3/sources',p),fs.readFileSync(path.join(B,p),'utf8'));return {path:p,sha256:actual};});write(path.join(U,'final-b-resume-before-3/manifest.json'),{sources,draft_sha256:bodyHash,old_unit_sha256:old.sha256});
const replay='审查/final-b-resume-0003-replay六项.md';const draft='审查/final-b-resume-0003-完整章.md';
write(path.join(B,replay),`# 第3章真实重放核查

本次同一最终B会话恢复的Codex执行代理，知情自检。原session=${s.id}，base_revision=10，当前写前revision12。实际完整阅读候选第3章1—243行，当前SHA256=${bodyHash}；核首停两份第2章真实报告、已重登SHA78ff1a743694ce4ca1fb0dcca7a7d94dab5f36b7305d2ba078522f408653d886及replay-input全部字段。原第3章SHA=${old.sha256}。候选只比原稿35行的三十元多一个“五”字；没有新改正文。原重放草案保留，不把自动恢复当作无变化结论。

## summary

18行原草案仍写三十元维修票，须据当前第3章35行改三十五元；其余实际返回21:37、点八件、21:48交箱、现金80元、两联、回字/转述、22:00关门及归家均有正文支持，原摘要保留。新摘要不把赴铺写成入铺，不把月底待付写成已付。

## characters

许蓉原整段中的30元小票改35元，与第2章已修账面同额；老何原段的30元报价改35元，来源仍是许蓉先电话后维修页照片，他只知道维修。周岸/沈禾虽角色段落没重复金额，但各自报价/亲听的准确35元写在F_GATE_QUOTE按人差量中。沈父不知报价、21:40承诺或白漆定向，仍通过女儿语音/下联照片、归家后实物获知；梁伯经电话与照片回字得知验收退款，不是在码头亲见。除应改金额的许蓉/老何整段外，其余角色原草案逐句回正文后保留，不抄旧整张知识表覆盖第2章的35元。

## timeline

只将首条21:37返回所携维修票30元改35元，21:19底联消息、21:48交箱、21:55前后离场、22:00关门等原三条保持。其余独立款项80、面额50+10+10+10不变。

## ledger

八条真实旧差量逐条核读：O_BOX_PAINT在53—57行转箱定向、180行装车再认确已发生，恢复resolved与本章人物知情；原type/statement/author_truth不在输入中改写，仍由第1章原观察继承。P_TOOLBOX由许蓉实际交周岸，previous_holder仍许蓉，完整custody仍三轮赴铺，未记已入铺。T_RETURN受托验收实交后可resolved；T_DEPOSIT真数真给并由女儿带回家可resolved，仍80元。T_CALLBACK更新底联照片已实际展示；P_ORDER只更新周岸的真实新增知情，其余人的子字段不复制，原件谭老板持有未变。T_BACK用21:37实际回程结束等待。F_GATE_QUOTE原草案reader_known及四人所知仍含30，逐人据35行小票、37行对账、212行维修页与老何回复改35；status仍partial/due3不延期，月底付款未发生。第3章不含tags差量，所以保留第2章已修“三十五元”标签，不能带回原30标签。

## evidence

F_GATE_QUOTE原引文“门的。工料三十元，月底结。”已失效，按当前35行改“三十五元”。其余7条本章引文完整读过，在53/129/127/143/41/190/27行原字存在；工具将重新绑定本稿SHA/行号。原source_hashes与_replay守卫保持工具输出，不手编状态或旧消费哈希。draft_review与replay_review分别绑定真实保存的报告及当前稿。

## downstream

这是授权尾段末章，无已写第4章；不能补造新下游。当前章后半已完整核读，35元小票夹本→维修页发老何→月底未付是一条连续事实；家中80元及两纸、原箱赴铺仍独立。完成重登后还须在最终字节重新全文连读2—3并登记，不拼接首停短评。可选风格观察保留建议，不自动变必改。

六项checked_fields对应以上实际核查。结论只支持本章真实重放登记，不等于真人盲读或正式F验收。
`);
write(path.join(B,draft),`# 当前修订第3章完整章审查

审查者为同一最终B执行代理，知情自检。已完整读取独立区正文/0003-把手朝外-final-b.md第1—243行，SHA256=${bodyHash}，正文Unicode Script=Han（去标题）${[...body.replace(/^#.*\r?\n/,'').matchAll(/\p{Script=Han}/gu)].length}字。有效细纲SHA5242b4be06b6ee7200e0ac0df84f8a1ab36b70537dbab5c1d5e8bb4925c7a470；本次不改细纲或正文，核普通报价追溯后的承接。

goal/change落实于129行实接原箱、143—147行80元点交、155—165行两联及原借具条分存。六项beats依成稿核对：27—45行21:37返回带物并展示底联，60—118行实际开箱点八件和旧缝核问，53—57/180行原白漆定向再现，125—165行分别交箱/交钱/分联，178—218行带箱赴铺与22:00关门，222—242行女儿带回两纸80元、父亲让座及柜门仍待修。禁止项原观察三项未动、承诺与兑现分开、未到场者只获实际转述、不写4均成立。

普通工料35元由35行小票口述接第2章35元报价，37行对记账、212行向老何发照片确认仍月底未付款。80元为另一款项，未改或扣减。许蓉在场安置及签交，周岸核实锤柄才收，沈禾不代保证完整却愿面对实际结果；角色选择与原文声音不因改报价而改变。箱最后在周岸三轮车斗，未写入铺；沈父家中持80元及两纸，不是现场目击。首章白漆是同一物转向及装车定位，不承担排他证明，父亲旧事仍留未知。

## 真人语言别扭句

有没有哪句话意思能够看懂，却让你觉得别扭、像为了写得漂亮硬拼出来，或者不像一个人当面会这样说？

### 真人语言硬问题

没有

### 风格偏好观察

用当面说话复述、动宾搭配、具体动作、逐句默读改口四项核对，未做真人音频朗读。“我爸说收到了”后对照片的快语补清仍能理解，是否压缩只是风格选择；收线、叠纸等生活动作偏细仍与温暖克制定位一致。原饼干的块/片/半包为量词精确度观察，未承担本次报价和钱物因果，留给后续F完整审查，不在本次普通报价授权中擅改。

未发现因35元追溯产生的新硬问题。应保留八件/80元/白漆/家用小车界限及有限家常尾声。此报告与六项重放报告分别保存，不能互相替代；完整尾段连读将在重登后进行。没有声称正式发布或最终F验收。
`);
const price=t=>t.replaceAll('三十元','三十五元').replaceAll('30元','35元');
x.summary=price(x.summary);for(const k of ['许蓉','老何'])x.changes.characters[k]=price(x.changes.characters[k]);x.changes.timeline_append=x.changes.timeline_append.map(price);
const q=x.changes.ledger.F_GATE_QUOTE;q.reader_known=price(q.reader_known);for(const k of Object.keys(q.character_known))q.character_known[k]=price(q.character_known[k]);q.evidence=q.evidence.map(e=>({...e,quote:price(e.quote)}));
x.replay_review={reviewer:'同一最终B会话恢复执行代理；知情自检',report:replay,draft_sha256:bodyHash,checked_fields:['summary','characters','timeline','ledger','evidence','downstream']};
x.draft_review={reviewer:'同一最终B会话恢复执行代理；完整章知情自检',report:draft,draft_sha256:bodyHash,report_sha256:hash(path.join(B,draft))};
write(path.join(B,'.writer/drafts/final-b-resume-replay-3-valid.json'),x);
write(path.join(U,'final-b-resume-third-binding.json'),{draft_sha256:bodyHash,replay_report:{path:replay,sha256:hash(path.join(B,replay))},draft_review:x.draft_review,input_sha256:hash(path.join(B,'.writer/drafts/final-b-resume-replay-3-valid.json'))});
const log=console.log;console.log=()=>{};let preview;try{preview=JSON.parse(run('37-preview-replay-third',['record-preview','--input','.writer/drafts/final-b-resume-replay-3-valid.json','--revision-token',s.token],B));}finally{console.log=log;}console.log(JSON.stringify({ok:preview.ok,findings:preview.findings,source_hashes:preview.source_hashes,replay_review:preview.replay_review,summary:preview.summary,related_unchanged:preview.related_unchanged_ledger},null,2));
