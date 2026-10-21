import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import {fileURLToPath} from 'node:url';
const W=path.dirname(fileURLToPath(import.meta.url)),s=JSON.parse(fs.readFileSync(path.join(W,'d-active-revision.json'))),P=s.workspace,sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const pre=JSON.parse(fs.readFileSync(path.join(W,'pre-revision-current.json'))),diff=JSON.parse(fs.readFileSync(path.join(W,'d-revision-changed-current.json'))),x=JSON.parse(fs.readFileSync(path.join(P,'.writer/drafts/d-replay13-template.json'))),u=pre.state.units.find(u=>u.unit===13),b=fs.readFileSync(path.join(P,x.draft)),h=sha(b);
if(x.expected_revision!==98||x.replay_review.draft_sha256!==h||u.sha256!==x._replay.old_unit_sha256)throw Error('stale template');
const journal=fs.readFileSync(path.join(s.main_project,u.journal));if(sha(journal)!==u.journal_sha256)throw Error('old journal drift');
x.summary=x.summary.replace('每周一次两小时','每周一次一个半小时');
x.changes.characters['许蓉']=x.changes.characters['许蓉'].replace('亲读下周三19点/每周一次课程纸、','亲读下周三19点/每周一次课程纸，亲听女儿说每回一个半钟头、');
x.changes.characters['许蓉女儿']=x.changes.characters['许蓉女儿'].replace('每周一次两小时','每周一次一个半小时');
x.changes.timeline_append[0]=x.changes.timeline_append[0].replace('商量下周三19点修衣课与窄桌','商量下周三19点起、每周一次每回一个半小时的修衣课与窄桌');
const t=x.changes.ledger.T_W_EVENING_CLASS;
t.statement=t.statement.replace('每周一次的','每周一次、每回一个半小时的');
t.reader_known=t.reader_known.replace('每周一次两小时','每周一次一个半小时');
t.character_known['许蓉']=t.character_known['许蓉'].replace('亲读课程纸、','亲读课程纸、亲听女儿说每回一个半钟头、');
t.character_known['许蓉女儿']=t.character_known['许蓉女儿'].replace('本人问报并将经过告诉母亲','本人问报并将经过告诉母亲，已向母亲说每回一个半钟头');
t.evidence.push({unit:13,quote:'一回一个半钟头。'});
for(const v of Object.values(x.changes.ledger))for(const e of v.evidence||[])if(e.unit===13&&!b.toString('utf8').includes(e.quote))throw Error('bad evidence');
const replayRef='审查/0013-W-D重登六项复核.md',draftRef='审查/0013-W-D当前章完整自检.md';
const replay=[
'# 13章 W-D 实际重登六项复核','',`会话 ${s.id}；owner ${s.owner}；原基线r${s.base_revision}。当前候选r98，主稿r97保留24章。`,
`原13正文 ${u.draft} SHA ${u.sha256}；新13同相对路径的独立区字节 SHA ${h}。`,
`旧追踪：pre-revision-current.json的unit13；旧journal ${u.journal} SHA ${u.journal_sha256}；已实际全文读过该157行journal和replay-input原草案。`,'',
'实际阅读：独立区旧13全文1—238；修改后新13再全文1—238。旧下游17/18/21/22/23/24的尺寸、钟点、动作及相邻段落摘录已读（W/d-candidate-impact-original.md），新稿全部改前改后已读（W/d-revision-actual-diff.md）；另实读新18的101—226、22的55—150、24的91—234。此前主稿19—24已在24登记后按序全文连读并正式review。当前修订后的14—24还没有完整尾段连读或重登，不冒充已完成。','',
'## summary','',
'原自动草案仍是“两小时”，已经改成每回一个半小时。保留本章第六日的问报/本人消息、腾桌、留衣、晚饭和小布试针。首课仍在下周，不把18课堂或24补完倒灌进13。','',
'## characters','',
'许亲读纸上的周三19点/每周一次，课长来自女儿本人当面说“一回一个半钟头”；女儿是问报参与者。许未亲见午间报名过程或实付金额。老何只交接窗口和见芹菜，不因全知摘要获晚课知识。沈父、沈、周、廖不获本章课程知识。旧路线知识仍为转述，不新增旅客抵对岸。','',
'## timeline','',
'保留停航第六日，晨间商量/7:40多女出门、午间消息、15点闹钟、16点接班、18:30钥匙交何及晚间在家试针。timeline首条补出承诺课长90分钟；这是未来课表的本章约定，并非已赴课。下游18与24改为19—20:30，18的19:45短歇/20:20多收尾与24约20点转末两边/20:15折角/20:30收针可成立。','',
'## ledger','',
'T_W_EVENING_CLASS仍thread/pending，due18；statement、reader_known和两位character_known如实纳入90分钟。原P_W_COAT仍object/active、母所有女暂留，右肘未补，窄桌靠墙、衣和针盒都没有被提前带到课堂。物件持有未变，不制造previous_holder交接。O_BOX_PAINT存在和type/statement/author_truth保持。','',
'## evidence','',
'原三条晚课引句、三条工装引句逐条与新稿核对仍原字存在；新增39行“一回一个半钟头。”作为新课长证据。午间“报名还有位置，已经报上了”在142行是消息；没有任何付款金额证据，因此不补造学费。新draft_review和本报告都绑定当前新稿SHA，原稿与旧报告保留。','',
'## downstream','',
'课长13→18首课→24次课的实改不是仅账本回收；18和24仍有教/学、误扎拆回、有限结果及实际持物。17净宽27的纸样/画边→18接头内收→21成凳固定→23侧置和仍想削窄→24客坐/收凳都已在正文改好。21首约15:30→22到店15:24、长针到六接书、十几分钟后包好、16点离店；22原15那次书店“三点半接人”是另一次已发生时间，不随还书约时改动。','',
'复核下游物件/知情：13工装留女窄桌、18原衣归母柜、24母晨交后女携课再返母真试穿；针盒/练布和灯不丢失。14工60/17另料24/21实付84不变，凳27仍窄，不抹去端盆/收腿/葱皮的代价。15另存短帘→袋→21小修→24轻装门口并取空，父伤脚/小凳/另一幅帘未洗都保留。22画册由姑娘还沈后到父膝短翻再返沈床头；23/24沈自己读书不变，不把书当酬谢。','',
'## 旧计划与保护','',
'所有设定/大纲/分卷/研究来源保持会话基线原字节；无source发布、无手改state、无刷新消费哈希。旧计划中两小时/28宽/15点是历史计划值，普通正文回溯的差异在W/d-revision-choice.md逐项披露。13正式plan本已明确“课时属于普通事实，不设observation”；17计划也明确首次商定、实际尺寸以成稿为准。此处没有更改已消费来源入口，因此不制造source新版本。','',
'范围内结论：13可按新普通事实重登，六项都实际核查。7章已实改，14—24未重登及未做修订尾段完整review，仍是下次同ID的必需工作。长期耐用性/父辈全史/复航与真人读者评价没有证据，保持未验收；这不是原稿bug修复声明。'
].join('\n')+'\n';
const draft=[
'# 13章 W-D 当前完整章自检','',`正文：${x.draft}`,`当前SHA-256：${h}`,`完整实读：修改后1—238行；正文汉字6036。原SHA ${u.sha256}的全部旧字节另存W/originals/d-revision-main24。`,'',
'当前目标：女儿为自己想去的修衣课争取一块能留下针布的桌面，许从替她报名/选布转为留自己的工装和腾自己的物件。阻力来自杂物、灯闪、椅架相碰和不会落针；并非用课长变化另造矛盾。90分钟为授权内代理测试选择。','',
'按现行0013正式plan回对：下周三19点起每周一次、女儿自己问报、入门先练、工装仍母亲要穿，所有主要beats成立。课长由两小时合理回溯到一个半小时，不改旧计划冒充原消费值；旧近期计划中的旧值与修订差异见六项报告。','',
'因果：晨间纸面意愿促成试桌；许只处理自己东西，拿工装后没替裁；午间报名消息与晚饭转述分开，女先在小布上穿针抽脱再重做，才约带衣。全章没有课已上/衣已补/母代会的倒灌。','',
'时间钱物：7:40多出门、15点闹钟、16—18:30许当班不动；3元芹菜仍个人支出。报名费只有许想问、未交代金额，保持未知。工装/盒归窄桌靠墙，旧灯闪后拔电，女床头灯暂留桌边拟睡前取（13还没实际取，不写已还）。','',
'角色所知与声音：许通过纸、消息和本人转述知道课程，何不知道。女儿“先去认认哪根粗”“我只拿了一根”与母亲的收物迟疑和日常口气配合；保留试针失手和少量笑，不改成说理演讲。课长新句仍是姑娘对母亲问题的自然回答。','',
'当前有限结论：本章没有发现需在重登前修正的高置信连续性问题。可选风格意见：部分母亲解释念头的句子较直白，本轮只做普通事实测试，不据偏好另改无关句。下游缩课后的实际动作窗口见六项报告；不等于后续14—24已重登或完整修订验收。','',
'审查者为本次同一Codex知情模型，没有独立代理、真人盲读或市场验证。'
].join('\n')+'\n';
fs.writeFileSync(path.join(P,replayRef),replay,{flag:'wx'});fs.writeFileSync(path.join(P,draftRef),draft,{flag:'wx'});
x.replay_review={reviewer:'W-D本次同一Codex模型，实际阅读新13/旧追踪及下游，不冒充真人或独立代理',report:replayRef,draft_sha256:h,checked_fields:['summary','characters','timeline','ledger','evidence','downstream']};
x.draft_review={reviewer:'W-D本次同一Codex模型全文自检',report:draftRef,draft_sha256:h,report_sha256:sha(Buffer.from(draft))};
fs.writeFileSync(path.join(W,'inputs/d-replay13-record.json'),JSON.stringify(x,null,2)+'\n',{flag:'wx'});
fs.writeFileSync(path.join(W,'d-replay13-report-binding.json'),JSON.stringify({session:s.id,draft:x.draft,draft_sha256:h,replay_report:replayRef,replay_report_sha256:sha(Buffer.from(replay)),draft_report:draftRef,draft_report_sha256:sha(Buffer.from(draft)),checked_fields:x.replay_review.checked_fields},null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({input:'inputs/d-replay13-record.json',draft_sha256:h,replay_report_sha256:sha(Buffer.from(replay)),draft_report_sha256:x.draft_review.report_sha256}));
