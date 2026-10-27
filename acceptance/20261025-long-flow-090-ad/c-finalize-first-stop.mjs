import {fs,path,base,project,state,sha,read,json,save,outer,assert,log} from './c-utils.mjs';
const now=new Date().toISOString(),s=state(),cp=JSON.parse(fs.readFileSync(path.join(base,'checkpoint-c-entry.json'))),st=log('c-first-final-status'),check=log('c-first-final-check'),doctor=log('c-first-final-doctor'),compare=log('c-first-final-compare');
assert.equal(s.revision,282);assert.equal(s.units.length,55);assert.equal(s.units.at(-1).unit,55);assert(st.ok&&check.ok&&doctor.ok&&compare.same_content);assert.deepEqual(st.changed_sources,[]);assert.deepEqual(st.stale_units,[]);assert.deepEqual(st.impact_pending,[]);
assert(st.revisions.sessions.every(x=>x.status==='committed'));assert(st.revisions.transactions.every(x=>x.status==='completed'));assert.equal(s.tool_control.generation,7);assert.equal(doctor.build.observed_content_id,cp.content_id);
const entry=JSON.parse(fs.readFileSync(path.join(base,'cli-logs/c-entry-status/before-state.json')));assert.deepEqual(s.units.slice(0,54),entry.units);assert.deepEqual(s.tool_control,entry.tool_control);assert.deepEqual(s.source_versions,entry.source_versions);assert.deepEqual(s.committed_revisions,entry.committed_revisions);
const oldFiles=Object.entries(cp.files).map(([ref,v])=>({ref,match:sha(Buffer.from(read(ref)))===v.sha256}));assert(oldFiles.every(v=>v.match));
const original55=json('.writer/drafts/ad-c-record-template55-original.json'),original56=json('.writer/drafts/ad-c-record-template56-original.json'),context56=json('.writer/drafts/ad-c-context56-original.json');
assert.equal(original55.expected_revision,281);assert.equal(original55.summary,'');assert.equal(original56.expected_revision,282);assert.equal(original56.summary,'');assert.deepEqual(original56.source_hashes,context56.source_hashes);assert.deepEqual(original56.source_bindings,context56.source_bindings);
for(const [ref,hash] of Object.entries(original56.source_hashes))assert.equal(sha(Buffer.from(read(ref))),hash,ref);
assert(!fs.existsSync(path.join(project,original56.draft)));assert(!s.units.some(x=>x.unit>55));
const fileMeta=ref=>{const b=fs.readFileSync(path.join(project,ref)),t=b.toString('utf8');return {path:ref,absolute_path:path.join(project,ref),bytes:b.length,sha256:sha(b),han:(t.replace(/^#.*$/gm,'').match(/\p{Script=Han}/gu)||[]).length,chars:t.length};};
const parts56=['分段/AD-C-0056/01.md','分段/AD-C-0056/02.md'].map(fileMeta);const partialHan=parts56.reduce((n,x)=>n+x.han,0);assert(partialHan>=3500&&partialHan<=5000);assert.equal(parts56.length,2);
const coverage=(ref,labels)=>{const body=read(ref),hash=sha(Buffer.from(body));let pos=0;for(const label of labels){const x=JSON.parse(fs.readFileSync(path.join(base,'read-pages',label+'.json')));assert.equal(x.sha256,hash);assert.equal(x.from,pos);assert.equal(x.text,body.slice(x.from,x.to));pos=x.to;}assert.equal(pos,body.length);return {ref,sha256:hash,chars:body.length,pages:labels.length,labels};};
const readCoverage=[...[[52,'正文/0052-半日不是一整天-ad-b-v3.md',11],[53,'正文/0053-这幅由谁收-ad-b-v2.md',9],[54,'正文/0054-灯照到哪边-ad-b-v2.md',8]].map(([u,r,n])=>coverage(r,Array.from({length:n},(_,i)=>`c-current${u}-p${i+1}`))),coverage(s.units.at(-1).draft,Array.from({length:9},(_,i)=>`c-registered55-p${i+1}`)),...parts56.map((x,i)=>coverage(x.path,[`c-part56-${i+1}-p1`,`c-part56-${i+1}-p2`]))];
const inventory=check.draft_inventory.unregistered.map(x=>({draft:x.draft,sha256:sha(Buffer.from(read(x.draft))),purpose:cp.files[x.draft]?'entry historical variant, unchanged':/^正文\/0055-.*-v[12]\.md$/.test(x.draft)?'C55 pre-registration assembled variant; not final':'UNKNOWN'}));assert(inventory.every(x=>x.purpose!=='UNKNOWN'));assert.equal(inventory.length,33);assert.equal(check.draft_inventory.unsafe_entries.length,0);
const cli=fs.readdirSync(path.join(base,'cli-logs')).filter(x=>x.startsWith('c-')).map(label=>({label,...JSON.parse(fs.readFileSync(path.join(base,'cli-logs',label,'result.json')))}));
assert(cli.filter(x=>x.exit_code!==0).every(x=>x.label==='c-context56-budget'));
const failures=[
{kind:'read-input',target:'大纲/单元/0055.json',error:'File does not exist',correction:'Confirmed future plan not yet created; created via formal plan; no prior prose or template.',state_changed:false},
{kind:'read-input',target:'writer-review/references/architecture-continuity.md',error:'File does not exist; actual architecture-continuity-review.md',correction:'Read actual current installed reference in full.',state_changed:false},
{kind:'helper-input',target:'c-fill55.mjs',error:'AssertionError: 他说自己先送走，明日再找人补。',correction:'Preserved original failed script; c-fill55-corrected.mjs uses real substring 说自己先送走，明日再找人补。 and reuses already saved matching report. No input saved/record before correction.',state_changed:false},
{kind:'cli-budget',target:'c-context56-budget',error:'CONTEXT_BUDGET_EXCEEDED; exit1; required42853 limit40000 over2853',correction:'Continuity24562/settings7211 largest; no constraints removed; explicit60000 c-context56-expanded succeeded before original template.',state_changed:false},
{kind:'pre-registration-editor-correction',target:'55 corrected06 interim',error:'Mechanical replacement briefly generated 才同伴接上话',correction:'Corrected immediately to 邻桌慢的那人终于咽下，才接着同伴的话往下说。 before v2/v3 assembly.',state_changed:false}
];
const bindings={at:now,native_thread_id:process.env.CODEX_THREAD_ID??null,scope:'AD C first stop, full55-57 workflow unchanged; no restore started',revision:s.revision,registered_units:s.units.length,state_sha256:sha(Buffer.from(read('.writer/state.json'))),generation:7,content_id:doctor.build.observed_content_id,runtime_id:doctor.build.runtime_id,unit55:fileMeta(s.units.at(-1).draft),partial56:{directory:'分段/AD-C-0056',parts:parts56,han:partialHan,context:fileMeta('.writer/drafts/ad-c-context56-original.json'),template:fileMeta('.writer/drafts/ad-c-record-template56-original.json'),target_draft:original56.draft,target_exists:false,registered:false,assembled:false,source_hashes:original56.source_hashes,source_bindings:original56.source_bindings},author_evidence:{local_source:'研究/AD作者任务.md',sha256:sha(Buffer.from(read('研究/AD作者任务.md'))),quote:'继续推进',locator:'第3行承接第7行；controller组织规模非作者具体剧情'},workflow:s.governance};
save('.writer/drafts/ad-c-first-stop-originals.json',bindings);
const addedRefs=['研究/AD-C滚动写前核对.md','大纲/单元/0055.json','大纲/单元/0056.json','大纲/单元/0057.json','审查/AD-C-55整章纲文语言与连续性知情自检.md',...inventory.filter(x=>!cp.files[x.draft]).map(x=>x.draft),s.units.at(-1).draft];
for(const dir of ['.writer/drafts','分段/AD-C-0055','分段/AD-C-0055-修正','分段/AD-C-0055-修正-v3','分段/AD-C-0056'])for(const f of fs.readdirSync(path.join(project,dir))){if(dir!=='.writer/drafts'||/^(ad-c-|ad-c\.)/.test(f))addedRefs.push(dir+'/'+f);}
const refs=[...new Set([...Object.keys(cp.files),...addedRefs])].sort(),files=Object.fromEntries(refs.map(r=>{const x=fileMeta(r);return [r,{bytes:x.bytes,sha256:x.sha256}];}));
const audit={ok:true,at:now,...bindings,entry_files:oldFiles.length,entry_files_unchanged:oldFiles.filter(x=>x.match).length,old54_units_identical:true,source_versions_identical:true,tool_control_identical:true,unknown_drafts:0,inventory,readCoverage,cli,failures,tool_compare:{same_content:compare.same_content,conclusion:compare.conclusion},transactions:st.revisions.transactions,revisions:st.revisions.sessions.map(x=>({id:x.id,status:x.status})),final_checks:{status:st.ok,check:check.ok,doctor:doctor.ok,changed_sources:st.changed_sources,stale_units:st.stale_units,impact_pending:st.impact_pending},limits:['55 informed model self-review only','56 partial not tracked facts','52-57 six chapter review pending resume','not whole book reread or author acceptance'],files};
outer('c-first-stop-audit.json',audit);outer('checkpoint-c-first.json',{ok:true,at:now,project,revision:s.revision,registered_units:s.units.length,state_sha256:audit.state_sha256,generation:7,content_id:audit.content_id,files,partial56:bindings.partial56,native_thread_id:bindings.native_thread_id});fs.copyFileSync(path.join(project,'.writer/state.json'),path.join(base,'checkpoint-c-first-state.json'),fs.constants.COPYFILE_EXCL);
const handoff=`# AD C首停交接：55已登记，56原两段后退出

唯一AD独立副本：${project}
原生线程ID：${bindings.native_thread_id}。本次没有子代理、额外会话、后台写稿或其他聊天；未改真实作品、源码、AC/X等封存；未Git提交、推送、发布。到本交接即退出，不提前启动恢复或下组。

## 主state与构建
登记55章，revision ${s.revision}，state SHA256 ${audit.state_sha256}。generation7 / 0.9.0；content ID ${audit.content_id}；runtime ID ${audit.runtime_id}。实际末status/check/doctor均退出0；实际tool compare same_content=true，固定外部包与安装包相同。changed_sources/stale_units/impact_pending全空；${st.revisions.transactions.length}个历史事务全completed、${st.revisions.sessions.length}个历史修订全committed，无活跃项。

原checkpoint-c-entry的${oldFiles.length}文件全零差异，旧54 units逐项完全相同，source_versions/tool_control/committed_revisions相同。33个未登记正文均有用途：入口31个历史变体不动，新增55 v1/v2为登记前留稿；未知0、unsafe0。完整清单交c-first-stop-audit.json与checkpoint-c-first.json供脚本，不逐哈希当读稿。

## 授权与本程范围
workflow仍AD C完整55—57，discuss/plan/draft/revise，draft_range/revise_range均55—57；完整三章、首停→同ID恢复→52—57六章完整复核，长期停止57。本程首停不改workflow，非作者仅许56半章。作者实际证据研究/AD作者任务.md完整文件SHA ${bindings.author_evidence.sha256}，quote“继续推进”，第3行承接第7行；规模/断点/普通情节细化为controller选择，不是作者新增核心选项。

55—57已正式plan；V20沿用实际读过契约，原远期骨架与AD49—60窗口保留；旧本程不授正文只描述退出的规划进程。56在55登记后正式plan细化，before保存.writer/drafts/ad-c-plan56-before-refine.json，之后才context/template/动笔。49/50正式plan整理后文件及规划历史哈希完全不动。没有写后刷新来源。

## 本程实读与55完成
当前52—54完整28页：52=11、53=9、54=8，全部state当前登记路径版本。recall后旧线实读34p5、36p3、50全8页、51p8—9、13p1、48p4—10；不是继承交接结论，未称1—48全读。当前包三writer技能、长篇/长章/方向、通用/真实语言/架构连续性/物理操作引用与workflow/long-form均实际读；误拼引用已纠正。

55有效context默认40000成功，保存.writer/drafts/ad-c-context55-original.json；原template .writer/drafts/ad-c-record-template55-original.json，r281，动笔前取，始终空summary原件不改。9自然分段，正式assemble v1→完整9页；修正后v2只读3页发现早说补孔问题，另v3最终全9页。最终${bindings.unit55.path}，去标题汉字 **${bindings.unit55.han}**，SHA ${bindings.unit55.sha256}。55真实summary、6characters、8timeline、13ledger及真实引文；报告审查/AD-C-55整章纲文语言与连续性知情自检.md，reviewer=知情Codex同进程，draft/report SHA实际绑定。preview0/无findings→record0/r282。完整登记输入.writer/drafts/ad-c-record55-filled.json。不是盲读、真人、作者定稿或出版验收。

登记前修正留原段/v1/v2：第五课最终平段误写缩、动作主宾、视角内心/提前知情、瓶外闻胶、笔上字、审查式证明旁白、补料非复装、上午非中午、画册浅色非同一行；最终v3完整复读。可选边界解释密度保留观察，不将审美升级必改。

55事实：第44日周二9—10真正看量，两位在场，常用者实际取浅盘/大碗、桌小挪选留。获准托门取下才见下合页两旧孔松；双方选原门/原合页旧孔补固，工46料12共58库存用料包价、两次来去含内，装后试用再付，未收/无新购材料支出。实际补固未装，原门垫厚布靠柜旁干墙；原两合页/螺丝小碟入浅干盒柜上，浅盘小碗临盖盒/大碗厨房，周10点前离。周三9—10约装试；晚只半桌新照/女人语音知盖盒难开/找大碗，不亲见全晚/不据照认胶固。

女孩周二实看求看者取两纸，仅听其说后页另认；自款水果金额未写。自练布保48最终段平/偏长针、52另一侧硬尾不拆，原52小废纸加另一侧末尾及结或层叠问题；原母衣反馈纸只读不改/护纸备课，老师未见48夜及52硬尾。母晚亲摸硬尾/看自己宽袋薄底，选本课不带袋；母灯与信封/半纸自己用、女14册/自己小灯独读。未新写康复/复航/耐用/所有外流图，14/10总50/三宽条事实和33V2/E及80/35/81/84/29厘米均不动。

## 56原分段、来源与目标：首停后不得覆写或重取
目录：${path.join(project,'分段/AD-C-0056')}

|顺序|原文件|bytes|去标题汉字|SHA256|
|---|---|---|---|---|
${parts56.map((x,i)=>`|${i+1}|${x.path}|${x.bytes}|${x.han}|${x.sha256}|`).join('\n')}

两段合计 **${partialHan}汉字**，各完整两页实读；刚写完初次实数3292不足，本程在同第二自然场面接出坐桌/椅位的新需求后实数3683，再完整回读并冻结上述原版本。本程无03、无56合章、无56登记、无57正文。

原context：.writer/drafts/ad-c-context56-original.json，SHA ${bindings.partial56.context.sha256}。
原record-template：.writer/drafts/ad-c-record-template56-original.json，SHA ${bindings.partial56.template.sha256}，expected_revision282，完整source_hashes/bindings保持。
目标章：${path.join(project,original56.draft)}，尚不存在；恢复后续新段并正式assemble到新正文文件，原模板不可因首停重取。目标若需另存，clone原模板只改目标路径，不追刷来源。
原来源/顺序/全路径/字节在.writer/drafts/ad-c-first-stop-originals.json与checkpoint-c-first.json。主state已登记55，不含56下列动作；半章事实仅此交接供恢复，不能把它们写进主snapshot冒登记。

56已写：第45日周三约九点前到同一屋，两位在。周亲见原门/原零件、亲检查补固稳才定位；男托门，原合页复装，空手开合下沿已无原擦声。女常用者亲试开合、将原浅盘放回原层再实际取出/转身落半桌，称比昨天轻；手背仍需绕门。原门已复装，垫布收折留屋内矮处，空盒入桌内，起子到周包口，周提包让开现场。浅盘已端回厨房，原小碗仍盖盒；大碗未试，原纸仍台历未收，钱未付/58未收。女人拉近自己纸、椅子只向外拉一点尚未坐，问坐写时通路会不会挡；周刚提包让出地。

下一段03接这一次坐桌/椅位及他人过柜的真试用和交流，不能重开早晨/重报整段价。未完选择：椅位与半桌/常用物摆放如何实际兼用，是否小调/接受残余；大碗或其他必要实际取用尚未做，最终认可/费用交付/纸上收讫/旧件去向仍未完成，不预结。剩余长章篇幅来自选择/代价/关系后果与沈/谭、女课前真实生活，不堆同一工序。女孩本日尚未新场景；57仍同一周三19—20:40/100分钟第六课，不推下一周。恢复先核原ID/主state/构建/上述原字节并完整读两段，再从03续；无漂移才沿原模板。若来源漂移或工具缺陷保留现场交根，不修改源码/state绕过。

## 全部成功失败与边界
本程c-*真实CLI ${cli.length}条，成功${cli.filter(x=>x.exit_code===0).length}、失败${cli.filter(x=>x.exit_code!==0).length}。每条原参数/输入/双流/退出码/state前后保留cli-logs；详细在c-first-stop-audit.json。读取分页范围另readCoverage，不用哈希代阅读。

1. FastCtx读55正式plan不存在：尚未创建，按正常未来计划建正式plan，非工具缺陷。
2. FastCtx引用拼成architecture-continuity.md不存在：工具指实际architecture-continuity-review.md后完整读，原失败保留。
3. c-fill55.mjs引文多“他”触发AssertionError，报告已保存但登记输入未生成/state未动；原失败脚本保留，另c-fill55-corrected.mjs用真实子串/复用已存正确报告后成功，不改正文或来源来迁就引文。
4. c-context56-budget默认40000实需42853（超2853）退出1，无state变化；continuity24562/settings7211，保留全部约束，显式60000成功后才模板与动笔。不是静默截断或工具缺陷。
5. 修正文06的中间替换曾有“才同伴接上话”病句，当场修成真实主语动作，未进入v2/v3合章。原55作者自检中的各改前后版本均留，不伪称工具错误。

大status/context/preview/doctor输出有UI截断，原完整stdout.txt保留、结构化抽取补核。52—54/55最终正文及56原两段分页均未截断。56 context以已实读55 context相同字段逐项JSON等价核，再实际读全部当前差量c-context56-current-delta.json（843行），不谎称另全量打印了相同设定。55原context已读的设定/研究/契约与连续性完整保留。无自动迁移/更新工具，无新独立revision，未改已登记主稿，无发布/导出或整组文学完成声明。52—57六章整窗review仍待同ID恢复写完后执行。
`;
fs.writeFileSync(path.join(base,'交接-C首停.md'),handoff,{flag:'wx'});
outer('c-first-stop-receipt.json',{ok:true,at:now,revision:s.revision,registered_units:55,unit55_han:bindings.unit55.han,partial56_han:partialHan,state_sha256:audit.state_sha256,handoff:'交接-C首停.md',handoff_sha256:sha(Buffer.from(handoff)),checkpoint_files:refs.length,entry_unchanged:oldFiles.length,cli_count:cli.length,cli_success:cli.filter(x=>x.exit_code===0).length,cli_failure:cli.filter(x=>x.exit_code!==0).length,native_thread_id:bindings.native_thread_id,restore_started:false});
console.log(JSON.stringify({ok:true,revision:s.revision,registered_units:55,unit55_han:bindings.unit55.han,partial56_han:partialHan,state_sha256:audit.state_sha256,checkpoint_files:refs.length,entry_unchanged:oldFiles.length,cli_count:cli.length,cli_failure:cli.filter(x=>x.exit_code!==0).length,handoff:'交接-C首停.md'},null,2));
