import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import assert from 'node:assert/strict';import {fileURLToPath} from 'node:url';
const base=path.dirname(fileURLToPath(import.meta.url)),project=JSON.parse(fs.readFileSync(path.join(base,'project.json'))).project,sha=b=>crypto.createHash('sha256').update(b).digest('hex'),read=r=>fs.readFileSync(path.join(project,r)),json=r=>JSON.parse(read(r));
const write=(name,data)=>fs.writeFileSync(path.join(base,name),typeof data==='string'?data:JSON.stringify(data,null,2)+'\n',{flag:'wx'});
const entry=JSON.parse(fs.readFileSync(path.join(base,'checkpoint-c-entry.json'))),stateBytes=read('.writer/state.json'),state=JSON.parse(stateBytes),originalState=JSON.parse(fs.readFileSync(path.join(base,'cli-logs/c01-status/before-state.json')));
assert.equal(state.revision,201);assert.equal(state.units.length,43);assert.deepEqual(state.units.slice(0,42),originalState.units);
const originalFileFailures=[];for(const [ref,f]of Object.entries(entry.files)){const b=read(ref);if(b.length!==f.bytes||sha(b)!==f.sha256)originalFileFailures.push(ref);}assert.deepEqual(originalFileFailures,[]);
const templateRef='.writer/drafts/AC-C-record44-before.json',contextRef='.writer/drafts/AC-C-context44.json',template=json(templateRef),context=json(contextRef);
assert.equal(template.expected_revision,201);assert.deepEqual(template.source_hashes,context.source_hashes);
const sourceMismatches=[];for(const [ref,h]of Object.entries(template.source_hashes))if(sha(read(ref))!==h)sourceMismatches.push(ref);assert.deepEqual(sourceMismatches,[]);
assert(!fs.existsSync(path.join(project,template.draft)));assert(!fs.existsSync(path.join(project,'分段/AC-C-0045')));
const status=JSON.parse(fs.readFileSync(path.join(base,'cli-logs/c22-final-status/stdout.txt'))),check=JSON.parse(fs.readFileSync(path.join(base,'cli-logs/c23-final-check/stdout.txt'))),doctor=JSON.parse(fs.readFileSync(path.join(base,'cli-logs/c24-final-doctor/stdout.txt'))),initialStatus=JSON.parse(fs.readFileSync(path.join(base,'cli-logs/c01-status/stdout.txt')));
assert.deepEqual(status.draft_inventory.unregistered,initialStatus.draft_inventory.unregistered);assert.deepEqual(status.changed_sources,[]);assert.deepEqual(status.stale_units,[]);assert.deepEqual(status.impact_pending,[]);assert.deepEqual(doctor.errors,[]);assert.deepEqual(doctor.warnings,[]);
const handoffPartRefs=['分段/AC-C-0044/01.md','分段/AC-C-0044/02.md'];
const parts=handoffPartRefs.map((ref,i)=>{const b=read(ref),s=b.toString('utf8'),pages=Math.ceil(s.length/1800),labels=[];for(let n=1;n<=pages;n++){const label=`c-stopfinal44-0${i+1}-p${n}`,p=JSON.parse(fs.readFileSync(path.join(base,'read-pages',label+'.json')));assert.equal(p.sha256,sha(b));assert.equal(p.text,s.slice((n-1)*1800,n*1800));labels.push(label);}return {path:ref,sha256:sha(b),bytes:b.length,han:(s.replace(/^#{1,6} .*$/gm,'').match(/\p{Script=Han}/gu)||[]).length,pages,read_labels:labels};});
const han44=parts.reduce((n,p)=>n+p.han,0);assert(han44>=3000&&han44<=5000);
const logs=fs.readdirSync(path.join(base,'cli-logs')).filter(n=>/^c\d/.test(n)).sort().map(label=>({label,...JSON.parse(fs.readFileSync(path.join(base,'cli-logs',label,'result.json')))}));assert(logs.every(l=>l.exit_code===0&&!l.error));
const files={};const scan=(ref)=>{for(const ent of fs.readdirSync(path.join(project,ref),{withFileTypes:true}).sort((a,b)=>a.name.localeCompare(b.name))){const p=ref+'/'+ent.name;if(ent.isDirectory())scan(p);else if(ent.isFile()){const b=read(p);files[p]={bytes:b.length,sha256:sha(b)};}else throw Error('Unexpected file type: '+p);}};for(const ref of ['正文','分段','.writer/drafts'])scan(ref);
const at=new Date().toISOString(),thread=process.env.CODEX_THREAD_ID??process.env.THREAD_ID,session=process.env.CODEX_SESSION_ID??process.env.SESSION_ID;assert.equal(thread,session);assert.equal(thread,'01a16ed8-0da2-7671-bbad-944dde1a62d0');
const audit={ok:true,at,project,project_id:state.project_id,thread_id:thread,session_id:session,revision:state.revision,registered_units:43,next_unit:44,state_sha256:sha(stateBytes),generation:status.tool_control.generation,content_id:doctor.build.observed_content_id,runtime_id:doctor.build.runtime_id,tool_version:doctor.tool_version,old_605_files_preserved:true,old_1_42_registration_rows_preserved:true,template:{path:templateRef,sha256:sha(read(templateRef)),expected_revision:template.expected_revision,source_hashes_match:true},context:{path:contextRef,sha256:sha(read(contextRef))},parts,partial_han:han44,chapter43:JSON.parse(fs.readFileSync(path.join(base,'c-inputs/43-final-audit.json'))),draft44_exists:false,draft45_exists:false,changed_sources:status.changed_sources,stale_units:status.stale_units,impact_pending:status.impact_pending,unregistered_old_count:22,unknown_unregistered:0,unsafe_entries:status.draft_inventory.unsafe_entries,active_revisions:status.revisions.sessions.filter(r=>r.status!=='committed'),pending_transactions:status.revisions.transactions.filter(t=>t.status!=='completed'),rolling_review:check.rolling_review,cli_calls:logs.length,cli_failures:[],doctor_errors:doctor.errors,doctor_warnings:doctor.warnings,elapsed_minutes:(Date.now()-Date.parse(logs.find(l=>l.label==='c01-status').started_at))/60000,workflow_state_unchanged_since44_template:true,inventory_files:Object.keys(files).length};
write('c-inputs/first-stop-audit.json',audit);write('checkpoint-c-first-state.json',stateBytes.toString('utf8'));write('checkpoint-c-first.json',{ok:true,at,project,revision:201,registered_units:43,state_sha256:sha(stateBytes),generation:audit.generation,content_id:audit.content_id,thread_id:thread,template:audit.template,context:audit.context,parts,files});
const table=parts.map(p=>`|${p.path}|${p.han}|${p.bytes}|${p.pages}|${p.sha256}|`).join('\n');
const handoff=`# AC C轮首停交接

截至${at}，已按本次提示到首停退出：登记1—43，44仅两自然分段${han44}汉字，未合章未登记，45无正文。整组43—45未完成，不将首停当整组结束。由c01-status起约${audit.elapsed_minutes.toFixed(1)}分钟。后续只能在同一C Codex ID真实恢复后继续。

## 实际会话、工具、状态

- project：${project}
- project_id：${state.project_id}；schema6；revision201；stage trial；机器next44只是登记顺序。
- 本轮C真实THREAD_ID/SESSION_ID均为${thread}；这与B交接中旧B ID不同，不冒称同一B会话。恢复必须回到这个C ID，不能另开会话/子代理/后台写稿或向其他聊天发消息。
- 实际0.9.0，generation${audit.generation}；content_id=${audit.content_id}；runtime_id=${audit.runtime_id}。active-tool.json、status、doctor与tool identify一致；provenance源commit7961decef067a63453e05923d2a7512a103ff795、dirty=true，不称已发布包。project.json.package仍为最初setup来源，未回写。
- state SHA256：${audit.state_sha256}。checkpoint-c-first-state.json为精确副本，checkpoint-c-first.json为当前稿/分段/内部草案${audit.inventory_files}项完整库存；c-inputs/first-stop-audit.json为检查详情。
- 最终c22-status/c23-check/c24-doctor实际退出0，无changed_sources/stale_units/impact_pending；修订均committed、事务均completed，无活跃修订或待恢复事务。doctor errors/warnings均空。22份旧未登记版本与入口逐项相同，未知未登记/unsafe均0。44在分段/内，不能拿status正文清单未列44推断无未完稿。
- check仅机械：rolling_review valid20/stale30，stale_without_current_coverage=0、pending_windows=[]、unpublished_records=[]；尚未发生的40—45整组文学复核不能由此宣称完成。

## 整组任务和来源

workflow.task已完整涵盖43—45“首程断点→同ID恢复→整组复核”，draft_range/revise_range均43—45，allowed_actions为discuss/plan/draft/revise；长期stop_conditions为45完成并复核40—45后止、不写46及真实保护边界，未将本次不写45写成永久禁止。首停是总任务控制器安排，非作者新增情节选择。原话真实绑定研究/AC作者任务.md第3行；没有另造“项目研究”目录。

六份指定入口完整读过；初始status/check/doctor/discussion context与605项checkpoint逐项核对一致。当前包writer-project/novel/review及long-form/chapter-delivery/general-review/natural-language-authenticity、workflow手册已读；定位/声音/人物/规则/37—48骨架/V16已实读。规划只采用真实存在且实读文件。沿用A骨架，新增大纲/AC-C推进窗口-43-45.md和43—45正式细纲；43后只用plan同步尚未消费的44细纲，未改已消费的骨架、规则或C窗口。未在44模板后再改workflow/来源。

## 43正式登记与当前正文

正文/0043-一起走到摊前-ac-c-v1.md：${audit.chapter43.han}正文汉字、${audit.chapter43.bytes}字节、8页，SHA256 ${audit.chapter43.sha256}。七段正式assemble空白separator后自检定点修，当前分段相连与最终章逐字节一致；原assemble与修前版本分别保留，不能用原assemble哈希替代当前正文。

最终c-registered43-p1—p8全8页实读，审查/AC-C43-登记前完整回读与纲文回对.md绑定当前SHA；写前context/template为revision200，未写后刷新。c16首次preview成功后纠正母亲亲见喝水的知情误写，另存record43-filled-v2/c17-preview43-v2，再c18-record43正式登记到201。此修正是模型追踪输入问题，不是CLI失败，旧输入和预览均留存。

43实际：沈早到半小时/女12点交班/沈12:30交班；未取订单由老板真实接手，客户最终取货未写。许母自吃听戏进房；沈先坐过10分钟，再同买。女芹菜3付10找7、豆干2付两枚1，原10余5；沈两小芋头6付10找4，原15余9，各在自己包。回家去泥/初洗、取锅杯，止未正式开做。父热吃只据本人文字称“饭热过吃了。碟好拿，没热馒头。”，沈/女非现场，许母未共享；不补写父私下过程。

本次完整实读40十页/41七页/42七页，c-read40/41/42-pN均为当前版。recall后实读37p5/p7、39p5的饭约原文及25p5—6/39p1工装原文；未声称全书深读。

## 44未完稿、原写前输入与冻结范围

正式细纲大纲/单元/0044.json已按43实际材料同步；写前context ${contextRef}，SHA256 ${audit.context.sha256}；原record-template ${templateRef}，SHA256 ${audit.template.sha256}，expected_revision201。最终停止时原模板source_hashes全部逐项匹配当前来源，包括state201；没有重取模板、填44摘要/changes或登记44。

最终44预定完整路径：${template.draft}，文件尚不存在。仅下列两段，计数剔除标题、只计Unicode汉字：

|路径|正文汉字|字节|页数|SHA256|
|---|---:|---:|---:|---|
${table}

44初次片段回读后仅补清“碗米倒进小锅”并将几处沈内心改为可见动作/本人说话；原片段保留c-inputs/44-before-local-check，最终c-stopfinal44-01-p1及02-p1/p2已完整实读。未完章不声称已完成整章文学审查；两段当前字节是同ID续写基线，恢复先核SHA并实读，续03起，别先改旧workflow或取新模板。

## 首停的真实现场

第36日周一午后，许家厨房/外桌，许蓉仍在房里，未被拉来教学/尝菜。女、沈均在，未用餐。

- 家中米各自量过混到碗，已倒小锅淘洗并添水；干米杯已回桶、桶盖合。小米锅盖着放右灶，火未点。
- 两小芋头带皮，在左灶炒锅水中煮，已翻过一只/重新盖好，水慢滚，尚未证明熟透、未剥未切未拌。沈看左锅，手已离开开关。
- 芹菜已择筋切梗，叶单独小碗，尚未下水烫/调味。女愿较脆、沈说喜欢较软叶，拟同锅分先后起，尚未做出结果。
- 两片豆干已切，浅盘一角留沈要的两条宽边，未拌。盐罐合着在干台，未下；勺用过翻芋头，小碗刚放在沈伸手可拿处，拟接一小口看，动作未发生。砧板下布已摊平，刀洗过。
- 坏叶碟移垃圾旁等收，未当洗收完成。钱余女5/沈9仍各自包；书/反馈原纸/针盒未取出交接。无借碗/带回食物事实。
- 02末句：“眼前这顿饭还有好些时候要等，谁也没从这一阵热气里先替对方尝出结果。”

## 未回收与下一步

T_AC_SHARED_MEAL仍partial：37各做一项/各付/一次厨房、39窗口、40—42准备已接到43实际交班/买菜；44做吃尚未完成，45洗收未发生，不能提前resolved。T_X_COAT_DAILY仍partial：25用感→38老师实看未拆→39母亲选先穿且仍认角；本轮不凭时间推长期改善。T_D_CABINET_PHOTOS等图pending，未造客户归来。门41当次有限resolved、48实收；抽屉42当次有限resolved、18实收；不扩大长期/全柜结论，不重开旧款。父脚伤、课程总期数、复航、父辈全史、问路人真正终点仍留原边界。没有确认范围外高置信正文问题需私改；旧历史时点追踪不擅自刷新。

同C ID恢复：重新读本交接、COMMON/author-request/project/active-tool/checkpoint-c-first；实际status/check/doctor/discussion context，逐项核state/库存/两段原字节与原模板source。无漂移再按旧workflow及44原模板接03，不重演量米/买菜/坐水。44全章至少14000正文汉字，分段→正式assemble→完整分页读→纲文回对/自检/preview/record。只有44登记后，如需同步任务说明，在45取写前输入前做；45按44实际剩量细化后取context/template，写并登记至少10000汉字；40—45当前六章完整连读、报告及正式review，整组结束止45、不写46。

## 全部失败、修正与显示局限

本轮${logs.length}次公开CLI均实际退出0；无CLI/辅助脚本异常、无工具产品缺陷或环境阻断。不是继承B轮失败数。实际模型初稿问题已记录：43“一齐下班”的对象误指、两处动作表达与水龙头歧义、数处同场限知内心移动；全部43登记前修并完整复读。登记输入v1将母亲亲见沈到家扩大到亲见坐喝水，preview后另存v2修正才正式record。44未完段初检补倒米动作及收视角，不称全章通过，修前片段保留。

大对象显示发生截断：doctor/tool identify/context43/context44/preview43及其v2、一次context字段合并打印，以及初始工具发现过滤过宽的输出；原CLI stdout完整保存在各唯一cli-logs，后按相关状态/构建/人物/卷/知情/selected及omitted IDs/source和差量重读。所有正文1800字符分页输出完整，不以计数/哈希代替阅读。库存605及当前${audit.inventory_files}项是机器逐项比较，不称人工逐字阅读每个散列。

所有写入仅AC；旧605项稿/分段/内部草案与1—42登记行全部同入口；未对AC外全盘哈希扫描，不作超出证据的全盘声明。未改真实作品/旧封存目录/产品源码/全局配置；无子代理、额外会话、后台写稿、外部写作服务、向其他聊天发消息、Git提交推送发布。没有真人盲读、市场/出版或现实厨房实测；机械check不代替文学验收。

首停工作到此结束，等待同一C ID真实恢复，本进程不再续稿。
`;
write('交接-C首停.md',handoff);
console.log(JSON.stringify({ok:true,at,revision:201,registered:43,han43:audit.chapter43.han,han44,template:audit.template,context:audit.context,parts,state_sha256:audit.state_sha256,files:audit.inventory_files,cli_calls:logs.length,elapsed_minutes:audit.elapsed_minutes,handoff:'交接-C首停.md'},null,2));
