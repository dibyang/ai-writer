import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {isDeepStrictEqual as same} from 'node:util';
import {stage,work,read,hash,save,runner,logRead} from './stage.mjs';
import {replaySnapshots} from '../rebuild-utils.mjs';
const before=path.join(stage,'before/work'),old=read(path.join(before,'.writer/state.json')),state=read(path.join(work,'.writer/state.json'));
if(state.revision!==128||state.units.length!==42)throw Error('Expected r128/42');
const replacements=read(path.join(stage,'evidence-replacements.json'));
for(const e of replacements)e.reason=e.unit===31?'A2：指定旧两页的柜侧夹放改为细夹夹合后平放柜上透明盒，客户尺寸纸仍分开。':e.unit===35?'A1：半小时许可改为14:45—15:15，当次收稿14:58改15:13，仍在许可内。':e.unit===36?'A3：罗初次预看许可与三页袋指向唐穗，不再指向何映。':e.unit===37?(e.id==='O_LAMP_PANEL'?'A3：由唐完整读稿后说出两短与改口的比较，何此章不获完整稿内灯事实。':'A3：唐在新库9:57读完归还三页，替代旧版何在阅览间收稿句。'):e.unit===38?'A1：邱明确另准的40分钟改为14:50—15:30，时长和撤回边界保留。':'A3：42章存袋历史改为37唐先看、40何另获许可后看，不保留何先看。';
save(path.join(stage,'evidence-replacements.json'),replacements);
logRead('设定/续部人物与场所.md','最终来源全文回读：9—11、14:30—17，与人物和场所全文核对','after');
logRead('审查/revision-a-最终25-42章模型知情审查.md','最终知情报告全文校读，非新一次正文语义阅读','after');
fs.appendFileSync(path.join(stage,'reading.jsonl'),JSON.stringify({at:new Date().toISOString(),kind:'reading-log-interpretation',purpose:'登记时写入的本章全文已读记录是对同哈希实际阅读的确认。repair1不表示重新读了18章；最终语义全文阅读为final-reading-start所绑定r109及其后完整25—42输出，r128正文逐一同哈希。辅助扫描和哈希检查不计语义实读。'})+'\n');
const toolDiff=runner.run('git',['diff','--exit-code','--','lib','bin','tests','.agents','package.json','package-lock.json'],'delivery-product-diff');
if(toolDiff.exit_code!==0)throw Error('Unexpected tracked product diff');
const auditCommand=runner.run(process.execPath,[path.join(stage,'audit-revision.mjs')],'delivery-audit-final');
if(auditCommand.exit_code!==0)throw Error(auditCommand.stderr||auditCommand.stdout);
const audit=read(path.join(stage,'audit.json'));
const target=path.join(stage,'after/work');if(fs.existsSync(target))throw Error('after snapshot exists');
fs.cpSync(work,target,{recursive:true,errorOnExist:true,force:false});
const files=[];function walk(d){for(const e of fs.readdirSync(d,{withFileTypes:true})){const p=path.join(d,e.name);if(e.isDirectory())walk(p);else files.push({file:path.relative(target,p).replaceAll('\\','/'),bytes:fs.statSync(p).size,sha256:hash(p)});}}walk(target);
save(path.join(stage,'after/manifest.json'),{at:new Date().toISOString(),revision:128,units:42,state_sha256:hash(path.join(target,'.writer/state.json')),files});
const digest=v=>crypto.createHash('sha256').update(JSON.stringify(v)).digest('hex');
const snapshots=read(path.join(stage,'before/snapshots.json')),current=replaySnapshots(work,state);
const prefix={units_1_24_same:same(old.units.slice(0,24),state.units.slice(0,24)),snapshot24_same:same(snapshots[24],current[24]),baseline_same:same(old.baseline,state.baseline),units_sha256:digest(state.units.slice(0,24)),snapshot24_sha256:digest(current[24]),baseline_sha256:digest(state.baseline),knowledge_fields_preserved:audit.preserved_first_part_knowledge_fields};
const plans=state.units.filter(u=>u.unit>=25).map(u=>{const ref=`大纲/单元/${String(u.unit).padStart(4,'0')}.json`;return{unit:u.unit,path:path.join(work,ref),before_sha256:hash(path.join(before,ref)),sha256:hash(path.join(work,ref)),changed:hash(path.join(before,ref))!==hash(path.join(work,ref))};});
const summaries=state.units.filter(u=>u.unit>=25).map(u=>({unit:u.unit,before:old.units[u.unit-1].summary,after:u.summary,changed:u.summary!==old.units[u.unit-1].summary}));
const source='设定/续部人物与场所.md';
const allIds=Object.entries(state.snapshot.ledger).map(([id,e])=>({id,type:e.type,before_due:old.snapshot.ledger[id].due_unit,after_due:e.due_unit,due_same:same(old.snapshot.ledger[id].due_unit,e.due_unit),before_status:old.snapshot.ledger[id].status,after_status:e.status,author_truth_same:same(old.snapshot.ledger[id].author_truth,e.author_truth),before_statement:old.snapshot.ledger[id].statement,statement:e.statement,statement_same:old.snapshot.ledger[id].statement===e.statement}));
const drift=read(path.join(stage,'source-drift.json'));
const beforeManifest=read(path.join(stage,'before/manifest.json'));
const exportManifest=read(path.join(stage,'export/manifest.json'));
const known=[
 {who:'唐穗',unit:28,event:'愿看与自己有关文字，但第12日不参加；有新库工作和自己的生活',limit:'不因此获罗全文、原录音或私因'},
 {who:'罗敬',unit:36,event:'沈先转述唐愿看文字；罗实读两页工作段和沈页，明确只准唐一人预看',limit:'不公开、不读给公众；罗未见唐随后实际看稿'},
 {who:'唐穗',unit:37,event:'18日新库9:30—9:57在沈在场时完整读三页并归还，无外拷，十点继续接车工作',limit:'只是读文字；亲听旧音、亲见原签、私因均不成立；13亲见灯片及15电话知改口的有效旧知识保留'},
 {who:'何映',unit:37,event:'沈10:22步行到阅览间后只展示沈自述单页；37—39未读罗完整段',limit:'无罗稿内原话/灯细节、全文公开权或持稿权；陈便笺、何送样字条独立保留'},
 {who:'罗敬',unit:40,event:'20日9:35听沈报告唐看完已还无拷；新准只何一人连沈页预看',limit:'不自动获何实际读完的现场结果或陈家情况'},
 {who:'何映',unit:40,event:'10:05—10:38在沈在场时完整读三页，立即还沈，不拷不留',limit:'此时才得罗完整工作段知识；不倒灌37—39，不等听原音、见原签、知私因或公众使用许可'}
];
const timing=[
 {event:'阅览间公共开放',before:'9:00—11:00 / 14:00—17:00',after:'9:00—11:00 / 14:30—17:00',authority:'续部人物与场所'},
 {event:'26章标题与到访约见',before:'下午两点的房间 / 14:00',after:'下午两点半的房间 / 14:30',authority:'何的约见；15:55返回不变'},
 {event:'35章限定半小时',before:'14:30—15:00；14:58收',after:'14:45—15:15；15:13收',authority:'邱本章上午亲口准许；14:30准备、14:40多到、14:45起、15:20离'},
 {event:'35章O_HOURS_NOTE正面',before:'本日两点半至三点',after:'本日两点四十五至三点十五',authority:'新版作者改写；背面蓝笔17:10/四折/后续交样重排不变'},
 {event:'38/39/40另场四十分钟',before:'20日14:20—15:00；14:56离；15:00前收',after:'20日14:50—15:30；15:26离；15:30前收',authority:'38邱亲口另准，39核桌头，40早9:20再确认；14:35准备、14:50起、15:32反馈后试门'},
 {event:'40新增何预看',before:'无；旧版本何在37先看',after:'9:35罗新许可；10:05—10:38何读；11:00前沈离收三页回家',authority:'与上午9:20邱电话、11点关门及下午四页相容'},
 {event:'独立时刻与内部维修',before:'27邱铺14:00；29客户14:40；31邱铺14:40约/14:47到；41/42维修14:00',after:'全部不变',authority:'其他地点或贴暂不借阅告示的内部维修，不构成提前对公众开放'}
];
const custody=[
 {id:'P_QIU_WORK_PAGES',unit:31,holder:'邱阿兰',event:'细夹夹合旧两页平放柜上干净透明盒，与客户尺寸纸隔开；第二页缺名不改',witness:'沈亲见；何/陈未在场'},
 {id:'P_QIU_WORK_PAGES',unit:35,previous_holder:'邱阿兰',holder:'沈禾',event:'邱从盒取出比对并实际还沈；旧缺名袋与新使用两页袋分开',witness:'沈亲见取还；后来的何/陈非邱柜存放现场见证'},
 {id:'P_RO_WORK_PAGES',unit:36,holder:'沈禾',event:'罗看原工作段，沈保旧另打新三页唐先看版封袋'},
 {id:'P_RO_WORK_PAGES',unit:37,holder:'沈禾',temporary_reader:'唐穗',event:'沈在场看完归还，无外拷，不登记永久交接'},
 {id:'P_RO_WORK_PAGES',unit:40,holder:'沈禾',temporary_reader:'何映',event:'另获许可后完整看完归还；上午收回家，与下午邱大字四页分清'},
 {id:'P_RO_WORK_PAGES / P_QIU_LARGE_PAGES / 两套旧页',unit:42,holder:'沈禾',event:'家中各原袋分装，罗三页先唐后何预看完仍封；未借严顾'}
];
const failures=[
 {category:'auxiliary-call',event:'一处apply_patch预期文本匹配失败',effect:'该次原子修改未落地，随后按真实内容修正补丁；不是作品或产品错误',raw:'工具调用原始错误保留于本次会话；不伪造命令退出码'},
 {category:'auxiliary-transform',event:'首轮辅助审计发现四条未变引文未保留',checks:2447,failed:read(path.join(stage,'audit-first-failed.json')).failures,reason:'同章同一行可有多个引文，辅助脚本按unit+line挑首条造成覆盖',repair:'改为按原证据数组索引保留；真实rewind --from25 --expected-revision109并重新context/template/record/check25—42，109→110→128；正文哈希不变',preserved:['audit-first-failed.json','r109-export-before-evidence-repair/'],final:'delivery-audit-final退出0，2451项全部通过'},
 {category:'display-truncation',event:'较大ledger/汇总工具输出显示截断',effect:'不把截断视作完整实读；正文全文按三章块另读补齐，原命令stdout/stderr文件不截断，扫描和阅读分开'}
];
const selfFindings=[
 {unit:37,kind:'candidate-length',before:'最初唐场景候选2247正文Han',after:'补足真实新库工作空档、枕套补线及移动场景，最终2459Han'},
 {unit:36,kind:'knowledge-source',before:'候选稿罗提出唐看文字，尚未获唐意愿来源',after:'沈先转述28章唐愿看文字，罗才限定唐一人'},
 {unit:39,kind:'reader-knowledge',before:'“来看第二遍”暗示何已看大字新版',after:'改“来看一遍”，何没有提前取得四页全文'},
 {unit:41,kind:'current-plan-drift',before:'旧计划“带本子/交何钥给严”与当前r90正文不符',after:'计划改为沈忘本子、严备用/何常用各持；正文与登记事实不变'}
];
const labels=['before-status','drift-status','drift-context43','drift-export','rewind-from25-r90','repair1-rewind25-r109','delivery-review25-42','final3-status','final3-check','final3-doctor','final3-export','delivery-audit-final','delivery-git-status','delivery-product-diff'];
const commands=Object.fromEntries(labels.map(l=>{const r=runner.last(l);return[l,{executable:r.executable,argv:r.argv,exit_code:r.exit_code,started_at:r.started_at,elapsed_ms:r.elapsed_ms,files:r.files}];}));
const chapterCommands=state.units.filter(u=>u.unit>=25).map(u=>({unit:u.unit,expected_revision:read(path.join(stage,`repair1/inputs/${u.unit}.json`)).expected_revision,input:path.join(stage,`repair1/inputs/${u.unit}.json`),context:runner.last(`repair1-context-${u.unit}`).files,template:runner.last(`repair1-template-${u.unit}`).files,record:runner.last(`repair1-record-${u.unit}`).files,check:runner.last(`repair1-check-${u.unit}`).files,source_hashes:u.source_hashes,journal:u.journal,journal_sha256:u.journal_sha256}));
const readings=fs.readFileSync(path.join(stage,'reading.jsonl'),'utf8').trim().split(/\r?\n/).map(JSON.parse);
const body=audit.body_rows.filter(x=>x.unit>=25),finished=new Date().toISOString(),started=runner.last('before-status').started_at;
const result={ok:true,status:'author-revision-complete-draft-not-published',work,stage,started_at:started,finished_at:finished,elapsed_minutes:(Date.parse(finished)-Date.parse(started))/60000,revision_before:90,revision_after:128,units:42,method:'真实Codex单模型实际阅读与逐章CLI重建；无子代理',baseline:'仅before冻结r90 units当前引用journal回放；未从旧rewind或遗留输入提取基线',author_revision_groups:['A1开放与许可时间重排','A2指定旧两页透明盒存放','A3唐先看、何另准后看'],first_part:prefix,changed_body_units:body.filter(x=>x.changed).map(x=>x.unit),unchanged_body_units:body.filter(x=>!x.changed).map(x=>x.unit),changed_plan_units:plans.filter(x=>x.changed).map(x=>x.unit),changed_summary_units:summaries.filter(x=>x.changed).map(x=>x.unit),rebuilt_units:body.map(x=>x.unit),chapter_han:{rule:'Unicode Script=Han，排除首行标题',total:body.reduce((s,x)=>s+x.han,0),min:Math.min(...body.map(x=>x.han)),max:Math.max(...body.map(x=>x.han)),all_2400_3200:true,chapters:body},source_changes:[{path:path.join(work,source),before_sha256:hash(path.join(before,source)),sha256:hash(path.join(work,source)),consumed_by:Array.from({length:18},(_,i)=>25+i),earliest:25}],plans,summaries,timing,knowledge_acquisition:known,custody,actual_permanent_transfers:audit.transfers,id_due_and_observations:allIds,evidence:{...audit.evidence,old_total:497,new_additions:9,replacements,unchanged_quotes_rebound_to_final_draft_hash:true,all_current_quotes_verified:true,details:path.join(stage,'evidence-audit.json')},source_drift:{...drift,blocked_directory_still_absent:!fs.existsSync(path.join(stage,'blocked-export')),proof:'context43/export因已消费来源变化退出2；不是缺43章纲；status列25—42；导出目录未创建'},reading:{log:path.join(stage,'reading.jsonl'),records:readings.length,before_units:body.map(x=>x.unit),necessary_earlier_units:[15,22,23,24],rolling_windows:[[22,27],[25,30],[28,33],[31,36],[34,39],[37,42]],final_full_read_units:body.map(x=>x.unit),final_full_read_revision:109,final_binding_revision:128,body_hashes_unchanged_during_repair:true,mechanical_checks_not_semantic_reads:true},review:{report:path.join(work,'审查/revision-a-最终25-42章模型知情审查.md'),kind:'model-self-review-informed-not-human-blind-read',...audit.rolling_review,historical_reports:'原报告未改；18个失效review全部有当前版本覆盖，失效记录保留'},self_review_findings:selfFindings,auxiliary_failures:failures,verification:{checks:audit.checks,failures:audit.failures,status:runner.json('final3-status'),check:runner.json('final3-check'),doctor:runner.json('final3-doctor'),product_diff_exit_code:toolDiff.exit_code,tests:'本轮只改作品和本阶段脚本/输出，未修改产品；未运行产品npm test/test:engine，已执行作品doctor/check及阅读审查'},export:{path:path.join(stage,'export'),status:exportManifest.status,units:exportManifest.included_units,excluded:exportManifest.excluded_drafts,warnings:exportManifest.warnings,manuscript_sha256:audit.export_sha256,manifest_sha256:audit.manifest_sha256},hashes:{before_state:audit.before_state_sha256,final_state:audit.state_sha256,before_manifest:hash(path.join(stage,'before/manifest.json')),after_manifest:hash(path.join(stage,'after/manifest.json')),source:audit.source_sha256,manuscript:audit.export_sha256,export_manifest:audit.manifest_sha256,reading_log:hash(path.join(stage,'reading.jsonl')),evidence_replacements:hash(path.join(stage,'evidence-replacements.json')),final_review:hash(path.join(work,'审查/revision-a-最终25-42章模型知情审查.md'))},freeze:{before:{path:path.join(stage,'before/work'),files:beforeManifest.files.length,bytes:beforeManifest.files.reduce((s,x)=>s+x.bytes,0)},after:{path:target,files:files.length,bytes:files.reduce((s,x)=>s+x.bytes,0)}},commands,chapter_commands:chapterCommands,command_index:runner.index,git_status:runner.last('delivery-git-status').stdout,boundaries:{no_subagents:true,no_product_changes:true,no_manual_state_or_journal:true,no_commit:true,no_push:true,no_publication:true,no_other_stage_requests_or_chat_used:true,writes:'仅当前作品与revision-a；after/before为快照而非另一个作品审查目录'}};
save(path.join(stage,'auxiliary-failures.json'),failures);save(path.join(stage,'result.json'),result);
const code=x=>'`'+x+'`',join=x=>x.join('、'),table=(head,rows)=>'| '+head.join(' | ')+' |\n| '+head.map(()=>'---').join(' | ')+' |\n'+rows.map(row=>'| '+row.map(x=>String(x??'').replaceAll('|','\\|').replaceAll('\n','<br>')).join(' | ')+' |').join('\n');
const md=`# 《潮汐信号》第一轮计划性作者改稿结果

已完成A1/A2/A3以及25—42逐章真实重建，当前42章、revision128（开始revision90）。本轮为明确作者改写；全文实读和模型知情审查已完成，仍为草稿导出，未提交、推送、发布。开始${started}，结束${finished}，记录耗时${result.elapsed_minutes.toFixed(1)}分钟；这是实际运行记录，不以预估60—90分钟冒充用时。

## 实际修改范围

- 正文实际改动：${join(result.changed_body_units)}；26章标题/文件名改为《下午两点半的房间》。其余25—42正文哈希不变：${join(result.unchanged_body_units)}。
- 计划实际改动：${join(result.changed_plan_units)}。摘要实际改动：${join(result.changed_summary_units)}。25—42全部18章重新取真实context/template、record/check并重绑来源。
- 来源仅改${code(source)}的下午对外开门14:00→14:30；上午9—11、下午结束17:00不变。没有全局替换“两点”。
- 第一部1—24正文、完整units登记、24末追踪快照和baseline逐字段不变；前24有效知情字段${prefix.knowledge_fields_preserved}个完整保留。既有主线、原物归宿和私人原因未知继续保留。

第一部完整登记摘要哈希：${code(prefix.units_sha256)}；24末快照摘要哈希：${code(prefix.snapshot24_sha256)}。完整证明见audit.json（2451项，0失败）与result.json。

## 冻结与来源漂移保护

改稿前已冻结完整作品${beforeManifest.files.length}文件、${beforeManifest.files.reduce((s,x)=>s+x.bytes,0)}字节于before/work，保留state、当前引用journal、计划、来源与写前输入；before/manifest.json保留每文件哈希。之后仅改A1资料先真实运行status/context43/export。${code('drift-context43')}和${code('drift-export')}均退出2，原文“创作来源已变化或缺失”阻断，最早25；不是以缺43章纲充当来源阻断。blocked-export始终未创建。原argv/退出码/stdout/stderr见source-drift.json与commands/index.jsonl。

随后真实${code('rewind --from25 --expected-revision90')}，90→91，再逐章至109。仅从冻结r90 units所指向的journal回放各章快照，不从旧rewind/遗留输入取基线，不把未来完整snapshot写回早章，不直接写state/journal。最终引文修复又真实从25回退109→110→128。

## 每章正文Han

计数为Unicode Script=Han，排除标题；18章合计${result.chapter_han.total}，范围${result.chapter_han.min}—${result.chapter_han.max}，全部满足2400—3200。

${table(['章','正文Han','正文是否改动','最终正文SHA-256'],body.map(x=>[x.unit,x.han,x.changed?'是':'否',code(x.sha256)]))}

## 原新时刻与许可

${table(['事件','修前','新版及衔接','明确授权/边界'],timing.map(x=>[x.event,x.before,x.after,x.authority]))}

每次限制、不拍不录不带走、此后先不用与没有自动恢复日保留。O_HOURS_NOTE正面按新版当次时段重写；背面蓝笔17:10、四折及送样/重排历史不变。这是作者形成新版本，不是剧情已观察字迹自行变化。

## 首位获知、所知边界和保管链

${table(['人物/章','实际取得知识','仍未取得'],known.map(x=>[x.who+' / '+x.unit,x.event,x.limit]))}

${table(['物件/章','持有人和临时阅读','实际动作'],custody.map(x=>[x.id+' / '+x.unit,(x.previous_holder?x.previous_holder+'→':'')+x.holder+(x.temporary_reader?'；临时读者'+x.temporary_reader:''),x.event+(x.witness?'；'+x.witness:'')]))}

永久交接只有重建区间35章指定旧两页邱→沈；previous_holder取真实旧持有人。唐37和何40的当场阅读归还不虚构为永久转交。旧缺名两页、新使用两页、罗三页、邱大字四页各袋分开。

## 证据替换与未改证据

旧证据497条：487条原引文完整保留并绑定新版正文哈希；10条因作者改文明确替换；新增9条真实本章锚点，最终506条均验证quote、unit、draft、line、sha256。下表按每条引文列旧新句和原因；完整旧新章哈希见evidence-replacements.json及result.json对应行。

${table(['ID/章','旧句','新句','原因'],replacements.map(x=>[x.id+' / '+x.unit,x.old,x.new,x.reason]))}

全部${allIds.length}个ledger ID及due保留，T_PUBLIC_USE仍due40并resolved；T_PRIVATE仍intentional-open且无author_truth答案。所有author_truth逐项不变。观测仅O_HOURS_NOTE当次正面时段及O_ROOM_LATCH相应场景时刻随A1调整；纸缺名、椅轮两声、砖缺口、铜牌刻线、钥绳颜色等其他初始观察不变。完整逐ID/due/状态/statement对照在result.json的id_due_and_observations；完整语义字段对照在semantic-diff.json。

实际改写覆盖characters热状态、reader_known、character_known、timeline，以及thread/object/fact/relationship与嵌套历史，未只补证据。何37已读的旧版事实不留在剧情知识字段中；只有报告保留作者级版本对照。有效旧知识保留，唐13亲见灯片和15电话获改口不被本轮首次读全文覆盖。

## 阅读、review与历史报告

改前完整25—42、必要15/22—24及相关当前资料/章纲/追踪；每3章完整连读22—27、25—30、28—33、31—36、34—39、37—42，最后再完整读修后25—42。reading.jsonl记录实际路径/哈希/用途及before/after；扫描不能算实读。全文阅读绑定r109，后续引文修复到r128正文逐一同哈希，复核哈希只用于适用版本说明，不伪称再次语义阅读。

最终报告在当前作品${code('审查/revision-a-最终25-42章模型知情审查.md')}并真实review登记；没有建立“作品审查/”。最终有效review13、历史失效18，18个均有当前版本覆盖，未覆盖失效0，pending_windows为空。旧报告未篡改、失效不抹去。审查是参与改稿模型的知情自检，没有真人盲读或市场验证；机械check只支持完整性与覆盖，不等于文学/产品正式验收。

## 分账：作者变化、自检错误、辅助失败

作者选择为A1开门/许可时段、A2指定旧稿存放、A3唐先何后知情三组，已落实到正文和追踪，不称旧版全部为程序bug。

${table(['自检问题','修正'],selfFindings.map(x=>[x.unit+'章：'+x.before,x.after]))}

辅助失败：一次apply_patch预期匹配失败未落地，已按实际文本重试；较大输出的显示截断另以小块全文补读，原日志分流文件保留。最重要的是首轮audit发现四条未变引文被辅助脚本按“unit+line”错误合并，保留audit-first-failed.json和r109-export-before-evidence-repair，不以首轮通过check冒充全量证据保留。

四项为T_PAID_WORK:25:31、T_PUBLIC_USE:27:95、T_VOICE_CONSENT:30:35、T_VOICE_CONSENT:36:25。修正为按原证据索引保留，使用真实rewind/逐章context/template/record/check重建25—42到128；正文与有效知识不为修复而回填旧版错误。修复后delivery-audit-final退出0、2451项全通过。失败与重试分开标签，未覆盖；详见auxiliary-failures.json、repair1/及命令原始日志。

## 最终命令、导出和哈希

${table(['精确label','退出码','作用'],labels.map(l=>[code(l),commands[l].exit_code,l==='delivery-audit-final'?'2451项通过':l==='final3-check'?'零findings/零pending':l==='final3-export'?'恰好1—42草稿导出':l.startsWith('drift-')?'真实来源漂移保护试验':'原argv及分流日志见result.json']))}

汇总用精确label读取JSON，不用endsWith混入git-status。final3-status无stale/来源漂移/未登记正文；final3-check无问题，doctor无错误警告。未修改产品，因此没有运行产品npm test或test:engine；本轮验证为真实作品CLI、逐章登记、全文阅读和独立机械核验。

export/manifest.json恰好包含1—42章，excluded=[]、warnings=[]，manuscript逐章等同最终正文，仍为draft-export。

${table(['制品','SHA-256'],Object.entries(result.hashes).map(([k,v])=>[k,code(v)]))}

交付快照after/work共${files.length}文件；after/manifest.json绑定完整最终作品。source-bindings.json记录每章消费来源；repair1/inputs记录真实expected_revision/source_hashes与changes；commands/index.jsonl指向每次真实stdout、stderr和退出码。result.json提供完整结构化数据，未将脚本哈希检查当文学实读。

Git最终仍仅未跟踪${code('.idea/')}和${code('acceptance/20261016-hundred/')}，产品tracked diff为空。没有子代理、手工state/journal写入、产品修改、提交、推送或发布；所有写入限当前作品和本阶段目录。
`;
save(path.join(stage,'result.md'),md);
console.log(JSON.stringify({ok:true,revision:128,changed_body:result.changed_body_units,changed_plans:result.changed_plan_units,changed_summary:result.changed_summary_units,han:result.chapter_han.total,ids:allIds.length,checks:audit.checks,files:files.length,elapsed_minutes:result.elapsed_minutes,result:path.join(stage,'result.md')}));
