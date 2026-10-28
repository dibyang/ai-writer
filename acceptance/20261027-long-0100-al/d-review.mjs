import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const base=path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/,'$1'));
const recovery=JSON.parse(fs.readFileSync(path.join(base,'session-d-recovery.json'))),root=recovery.workspace;
const unit=Number(process.argv[2]);if(![110,111,112].includes(unit))throw Error('unit');
const read=r=>fs.readFileSync(path.join(root,r));
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const save=(r,v)=>fs.writeFileSync(path.join(root,r),typeof v==='string'?v:JSON.stringify(v,null,2)+'\n',{flag:'wx'});
const raw=JSON.parse(read(`.writer/drafts/AL-d-replay${unit}-raw.json`));
const old=JSON.parse(fs.readFileSync(path.join(base,'session-d-baseline.json'))).units.find(x=>x.unit===unit);
const before=fs.readFileSync(path.join(base,`session-d-originals/${unit}.md`)).toString(),after=read(raw.draft).toString();
const changes={110:['她原想接问像哪个同学','她原想接着问像哪个同学'],111:null,112:['那七八分钟没让沈觉得特别长。','沈没觉得那七八分钟特别长。']}[unit];
if(changes?before.replace(changes[0],changes[1])!==after:before!==after)throw Error('unexpected text changes');
if(sha(Buffer.from(after))!==raw._replay.draft_sha256)throw Error('replay stale');
const evidence=[];
for(const [id,item] of Object.entries(raw.changes.ledger??{}))for(const e of item.evidence??[]){
 if(!before.includes(e.quote)||!after.includes(e.quote))throw Error('evidence changed '+id);
 evidence.push({id,quote:e.quote,old_line:before.slice(0,before.indexOf(e.quote)).split('\n').length,new_line:after.slice(0,after.indexOf(e.quote)).split('\n').length,quote_unchanged:true});
}
const notes={
110:{summary:'旧摘要的68日8元早饭、9:40多素姐靠坐、10:08装袋迟缓、10:20多沈离/近11返、陶11离均由当前正文支持；摘要原样保留。',characters:'本次只添“着”，仍为沈内在的原想，葛先停手的动作没有变。沈未真正问哪个同学；素姐随后自行说班主任。素姐家事仍是本人口述，陶不获离店后知识，沈不知修镜。',timeline:'68日事件顺序和十几分钟坐谈均未动。没有把111的69日炒饭结果倒补给本日冷饭，也没有改成永久留椅。',ledger:'P_SHOP_CHAIR_66保管人仍葛；I_SEAT_USE68_110只证当次靠坐和有限陪谈。O_SU_ACCOUNT68_110的type/statement/author_truth边界未改，不增家人动机。',downstream:'已完整读111—118。111第45—47行才口述前日剩饭倒掉，112仍接烫发旧谈及本人剪发愿望；117新邀饭/118本人选鱼尾与吃完是一日晚饭，非110全天陪伴的扩张。新句不触及这些前因。'},
111:{summary:'旧摘要的69日13:06两块糕6元、两盒交付、葛炒饭吃完、电话约14点洗剪、13:50自锁店均在原字节全文；无须改摘要。',characters:'沈仅递碗、看发尾并陪路，不代看店；葛是问好不好看，非沈替她决定省事。梁名处没有新消息，15:30是沈自己改提醒。所有旧人物知识和热状态完整保留。',timeline:'110为68日未吃完饭，111是69日另一次炒饭吃完；118第110—116行的“最好一块最后倒”是对111口述的三天前回声。贴14—15暂歇是预期，不能证明15点回店。',ledger:'I_MEAL69_111当次炒饭与T_HAIRCUT69_111 pending原样；钥匙葛自己放包，无交沈。111不变仍要重登，因为前章依赖已换哈希；不把字节不变等同免审。',downstream:'112从两级台阶与预约接入，才洗剪付款；113才实走采购；117才新邀晚饭；118吃饭和照片不倒灌111人物知识。111无新增事实或重写。'},
112:{summary:'旧摘要的等候/洗剪吹干35元、不烫、局部剪尖、14:49分路、15:30自看例子和次晨拟走均仍成立。只改等候感受句语序，摘要不变。',characters:'“那七八分钟没让沈觉得特别长”改为“沈没觉得那七八分钟特别长”，主语仍沈、同一七八分钟、同一感受否定范围；不推葛不着急或理发师已吃完。葛本人选剪，钥匙/旧夹始终葛自持。',timeline:'14点差几分到、快14:15等饭、14:40多看镜、14:49离、15:30提醒顺序未动，等候主观感受不能替换计时事实。',ledger:'T_HAIRCUT69_111仍partial，保留15点开门/销售待核；I_HAIRCUT69_112已完成洗剪；T_SELF_WALK70_112在当前112仍pending，不能借113已成稿先在112写resolved。',downstream:'113第7/54—68/94行实际买面蛋才接走路；117第123/133行确认是理发店所说蓝衫，118第124/143行是本人两张照片自留。112第37—39蓝衫原话、付款与分路引文未改。未将117穿衫预写到112。'}
}[unit];
const readingUnits=[27,95,100,104,105,...Array.from({length:12},(_,i)=>107+i)];
const baseline=JSON.parse(fs.readFileSync(path.join(base,'session-d-baseline.json')));
const readings=readingUnits.map(n=>{const u=baseline.units.find(x=>x.unit===n);return {unit:n,draft:u.draft,sha256:u.sha256,coverage:'完整实读旧稿'};});
const lines=[`# AL-D 第${unit}章 replay 六项实读复核`,'','审查者：本轮独立旧章会话 Codex，知情模型自检；没有子代理或真人盲读。旧报告没有被当成本次新稿报告。',`原会话 ${recovery.id}；base revision ${recovery.base_revision}；原章SHA ${old.sha256}；当前候选SHA ${sha(Buffer.from(after))}。`,'',changes?`受控测试变更：${changes[0]} → ${changes[1]}。原句可理解，没有确认硬伤；本次不宣称文学净收益、品质提升或作者采纳。`:'本章正文逐字节不变；为连续性依赖核查重新登记。','',...Object.entries(notes).flatMap(([k,v])=>[`## ${k}`,v,'']),'## evidence','逐条对照旧差量 journal、新 replay 草案与当前原文，下列引文文字及行号不变；工具自动生成新正文SHA锚点，不手改历史来源哈希。',...evidence.map(x=>`- ${x.id}，旧/新行${x.old_line}/${x.new_line}：“${x.quote}”`),'','本章summary与changes不作事实修改；六项checked_fields来自上述实际核读。原差量完整保存父目录session-d-old-deltas.json，原journal逐字节保存在session-d-originals。历史知识文本中的更早未读事件仅原样保留，未独立证实其全部历史。','','## 真人语言别扭句','### 真人语言硬问题','没有','### 风格偏好观察',unit===110?'“接问/接着问”是可理解表达间的细微选择。四项测试：按本书有限第三人称作复述，动宾均是“问哪个同学”，落地仍是“原想”被葛停手打断；文本朗读节奏模拟中“接着问”较展开，但无两项测试共同证明理解损害，因此仅作受控测试。':unit===112?'两句复述、动宾、具体落地、文本朗读节奏模拟均指同一段主观等待感受；主语前置是表达选择，无确认理解损害，仅作受控测试。':'四项语言测试按当前完整正文核对：对白保留葛的直说、动作有落点、情绪由想好看而非只省事推进；未发现本轮必须改的句子。无音频朗读或真人反馈。','','## 覆盖与未覆盖','本轮完整旧稿覆盖：27、95、100、104、105、107—118；逐章原SHA见下表；本章候选在生成replay后全文核读。其余1—106未列章节未完整读取；旧早期悬疑线未重新取证，不宣称全书重审。113—118虽已完整读作下游，本次只保留旧稿，未重登；未来同会话恢复仍须逐章实读。','','|章|原正文SHA256|','|---|---|',...readings.map(x=>`|${x.unit}|${x.sha256}|`),'','保留未决：余带男声/钟声/同日、剪者/命名、残通知日期/挂牌点、罗私人原因、旧钱/押金、未知载体/受话人、公屋长期工时；素姐修镜/葛69日回店销售/何71日取送样/女人去向/伞修成/顾72送件到达及修后外测均无本轮新证。旧五项needs-recheck及97—102、100—105欠审不作已解决。候选112后停next113，不prepare/commit。',''];
const report=`审查/AL-d-${unit}-replay-review.md`;save(report,lines.join('\n'));
save(`研究/AL-d-${unit}-evidence-comparison.json`,{unit,old_sha256:old.sha256,new_sha256:sha(Buffer.from(after)),changes,evidence,readings});
raw.replay_review={reviewer:'AL session D Codex / informed model self-review',report,draft_sha256:sha(Buffer.from(after)),checked_fields:['summary','characters','timeline','ledger','evidence','downstream']};
raw.draft_review={reviewer:raw.replay_review.reviewer,report,draft_sha256:raw.replay_review.draft_sha256,report_sha256:sha(read(report))};
save(`.writer/drafts/AL-d-record${unit}.json`,raw);
console.log(JSON.stringify({unit,report,evidence_count:evidence.length,sha256:raw.replay_review.draft_sha256,record:`.writer/drafts/AL-d-record${unit}.json`}));
