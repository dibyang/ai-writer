import {fs,path,base,project,state,sha,read,json,outer,assert,log} from './c-utils.mjs';
const cp=JSON.parse(fs.readFileSync(path.join(base,'checkpoint-c-first.json'))),s=state(),st=log('ccr-final-status'),check=log('ccr-final-check'),doctor=log('ccr-final-doctor'),review=log('ccr-review52-57'),coverage=JSON.parse(fs.readFileSync(path.join(base,'ccr-window52-57-coverage.json'))),restore=JSON.parse(fs.readFileSync(path.join(base,'ccr-restore-byte-proof.json')));
const entry=JSON.parse(fs.readFileSync(path.join(base,'cli-logs/ccr-entry-status/before-state.json')));
assert.equal(process.env.CODEX_THREAD_ID,cp.native_thread_id);assert.equal(s.units.length,57);assert.equal(s.revision,285);assert.deepEqual(s.units.slice(0,55),entry.units);assert.deepEqual(s.governance,entry.governance);assert.deepEqual(s.tool_control,entry.tool_control);
assert(st.ok&&check.ok&&doctor.ok);for(const k of ['changed_sources','stale_units','impact_pending'])assert.deepEqual(st[k],[]);assert(st.revisions.transactions.every(t=>t.status==='completed'));assert(st.revisions.sessions.every(t=>t.status==='committed'));assert.equal(s.tool_control.generation,7);assert.equal(doctor.build.observed_content_id,cp.content_id);assert.equal(doctor.build.runtime_id,restore.runtime_id);assert.deepEqual(doctor.errors,[]);assert.deepEqual(doctor.warnings,[]);assert.deepEqual(check.draft_inventory.unsafe_entries,[]);assert.deepEqual(check.rolling_review.pending_windows,[]);assert.deepEqual(check.rolling_review.unpublished_records,[]);
const checkpointFiles=Object.entries(cp.files).map(([ref,v])=>{const b=fs.readFileSync(path.join(project,ref));assert.equal(b.length,v.bytes,ref);assert.equal(sha(b),v.sha256,ref);return {ref,...v}});
const metadata=['.writer/drafts/ad-c-context56-original.json','.writer/drafts/ad-c-record-template56-original.json','.writer/drafts/ad-cr-context57-budget.json','.writer/drafts/ad-cr-record-template57-original.json','大纲/单元/0056.json','大纲/单元/0057.json','研究/AD作者任务.md'].map(ref=>{const b=fs.readFileSync(path.join(project,ref));return {ref,bytes:b.length,sha256:sha(b)}});
const text56=read(s.units[55].draft),originals=['分段/AD-C-0056/01.md','分段/AD-C-0056/02.md'].map(ref=>{const t=read(ref),b=Buffer.from(t),offset=text56.indexOf(t);assert(offset>=0);assert.equal(text56.indexOf(t,offset+t.length),-1);return {ref,bytes:b.length,chars:t.length,han:(t.replace(/^#.*$/gm,'').match(/\p{Script=Han}/gu)||[]).length,sha256:sha(b),offset,occurrences:1}});assert(originals[0].offset<originals[1].offset);
const oldUnreg=new Set(restore.inventory.unregistered.map(v=>v.draft)),added=check.draft_inventory.unregistered.filter(v=>!oldUnreg.has(v.draft));assert.deepEqual(added.map(v=>v.draft),['正文/0056-留给她自己试-ad-c-v1.md']);
const folders=fs.readdirSync(path.join(base,'cli-logs')).filter(v=>v.startsWith('ccr-')).sort();
const commands=folders.map(label=>{const f=path.join(base,'cli-logs',label,'result.json');if(!fs.existsSync(f)){assert.equal(label,'ccr-assemble57');return {label,engine_started:false,wrapper_exit_code:1,formal_exit_code:null,error:'ENOENT copying relative --input before spawn; corrected label ccr-assemble57-corrected'}}const r=JSON.parse(fs.readFileSync(f));assert.equal(r.exit_code,0,label);return {label,formal_exit_code:r.exit_code,engine_started:true,started_at:r.started_at,elapsed_ms:r.elapsed_ms,before_state_sha256:r.before_state_sha256,after_state_sha256:r.after_state_sha256,args:r.args};});
const failures=[
{phase:'historical first stop',ref:'c-first-handoff-erratum.md',detail:'c-context56-budget formal tool exit2 / outer command exit1; need42853>default40000, explicit60000 preserved all constraints before original56template. Original handoff exit1 not rewritten.'},
{phase:'56 new natural part11 authoring',type:'apply_patch verification failed',detail:'partial line anchor did not match; no file mutation; exact full paragraph anchor corrected. See ccr-before56-assembly.json and native tool transcript.'},
{phase:'56 preregistration self-read',type:'draft corrections',detail:'initial whole56 including original parts15697 Han not yet qualified; added344 Han actual preclass exchange before assembly, final16041. v1 full11pages then copied new04/06/09/10 to correctiondir: 五十一张→五十元一张; 昨日小盒→前天小盒; 问带钥匙→提醒; 昨晚另写一句→前晚; He wearing glasses so box stated empty. Original01/02 and v1 preserved; finalv2 full11pages before preview/record.'},
{phase:'57 assemble input',label:'ccr-assemble57',type:'wrapper input path',wrapper_exit_code:1,formal_exit_code:null,detail:'relative .writer/drafts/ad-cr-assemble57-input.json was resolved at repo cwd, ENOENT copyfile; before-state exists but engine not spawned/no result.json. Original input preserved. Absolute same file in ccr-assemble57-corrected succeeded. No product defect.'},
{phase:'sixchapter review preparation',type:'quote preflight assertion',script:'ccr-review52-57.mjs',exit_code:1,detail:'AssertionError 53:下工回来处理; phrase belongs52, not53. No report/input/state mutation. Original script preserved; ccr-review52-57-corrected.mjs uses real53 她从零钱里找出一块，把两只都收下。; all quotes pass then review exit0.'}
];
outer('ccr-failures-and-corrections.json',{failures,scope:'recorded observed failures; no fabricated engine failure for wrapper/helper',historical_first_stop_details:'交接-C首停.md plus c-first-handoff-erratum.md remain byte-identical'});
const stateHash=sha(Buffer.from(read('.writer/state.json'))),current=coverage.chapters.map(({pages,...v})=>({...v,page_count:pages.length}));
const data={ok:true,at:new Date().toISOString(),native_thread_id:process.env.CODEX_THREAD_ID,same_native_thread:true,entry:{revision:282,units:55,state_sha256:cp.state_sha256},final:{revision:s.revision,units:s.units.length,next_unit:st.next_unit,state_sha256:stateHash,generation:7,tool_version:doctor.tool_version,content_id:doctor.build.observed_content_id,runtime_id:doctor.build.runtime_id},checkpoint_files_checked:checkpointFiles.length,checkpoint_mismatches:[],originals,metadata,current_window:current,coverage_ref:'ccr-window52-57-coverage.json',complete_pages:coverage.pages,review,all_first55_registration_records_unchanged:true,workflow_unchanged:true,tool_control_unchanged:true,original_templates_not_refreshed:true,source_drift:st.changed_sources,stale_units:st.stale_units,impact_pending:st.impact_pending,transactions:st.revisions.transactions.length,committed_revision_sessions:st.revisions.sessions.length,unsafe:check.draft_inventory.unsafe_entries,known_unregistered_count:check.draft_inventory.unregistered.length,new_unregistered:added,rolling_review:check.rolling_review,commands,failures,stop_at:57,no_58_draft_or_record:true};
outer('checkpoint-c-complete.json',data);
const fileTable=current.map(v=>`|${v.unit}|${v.ref}|${v.han}|${v.page_count}|${v.sha256}|`).join('\n');
const originalTable=originals.map(v=>`|${v.ref}|${v.bytes}|${v.han}|${v.offset}|${v.occurrences}|${v.sha256}|`).join('\n');
const metaLines=metadata.map(v=>`- ${v.ref}：${v.bytes} bytes；SHA ${v.sha256}`).join('\n');
const c=commands.filter(v=>v.engine_started).length;
const handoff=`# AD C完成交接：同ID恢复56—57及52—57六章复核后停止

本程唯一AD独立样本：${project}。原生线程${process.env.CODEX_THREAD_ID}与checkpoint-c-first一致；未另起会话/子代理/后台写稿/其他聊天。只写AD作品及AD证据，未改真实作品/源码/AC或X封存，未Git提交、推送、导出发布。长期停止57，控制器next_unit58不是作者新增情节授权，没取58模板/写58正文/登记58。

## 主state、来源、构建与授权

进入前先读c-first-handoff-erratum.md，然后COMMON/author-request/project/active-tool、C首停与checkpoint摘要。实际entry status/check/doctor全部0，正式登记55/r282，state SHA ${cp.state_sha256}。${checkpointFiles.length}个checkpoint文件在进入时精确匹配，完成时再核仍全部同字节；state不在该不可变文件清单，以另项SHA追踪。旧原稿/原分段/计划与整理前历史报告都保留。

当前登记57/r285，state SHA **${stateHash}**。schema6，generation7，0.9.0；content **${doctor.build.observed_content_id}**；runtime **${doctor.build.runtime_id}**。实际包入口依active-tool，不替换/升级工具。包内review-and-registration.md与本程实际读的同名说明SHA一致60d5079707c5f4e9e6607b6bd70c3d34d9fc6b37c6cecdb617d84467216a6b28。

workflow原完整55—57/首停→同ID恢复→当前52—57完整连读，author trial discuss/plan/draft/revise及两range55—57全未改。研究/AD作者任务.md真实quote“继续推进”及完整SHA绑定保持，控制器的章数、字数、断点未伪作作者新核心选择。首55个登记记录全部与进入前一致。

## 恢复原字节与写前来源

原56context/template/两段在续写前实读：ccr-original56-1-p1/p2与ccr-original56-2-p1/p2；不是拿交接结论代读。恢复证明ccr-restore-byte-proof.json。原56两个字符串在最终合章各精确一次且顺序同：

|原文件|bytes|去标题汉字|最终字符偏移|次数|SHA256|
|---|---:|---:|---:|---:|---|
${originalTable}

${metaLines}

原56template expected_revision282，source_hashes在进入时全部实际匹配；后续state正常推进，不称它仍与最终state相同，也未重取/刷新来规避。填写版只clone原模板改draft到v2/填真实变化。原目标正文/0056-留给她自己试-ad-c-v1.md是真assemble初版，保留；当前登记指另一新v2。

56原两段→新分段AD-CR-0056/03—11；登记前修正04/06/09/10另存在AD-CR-0056-修正；两个assemble输入顺序和逐段SHA详.writer/drafts/ad-cr-assemble56-input.json与ad-cr-assemble56-v2-input.json。首次合章与最终合章都真实完整11页实读，最终ccr-final56-p1—p11。56报告/实变化填稿/preview0后record0，r283。

57沿用既有正式0057计划，无需来源改版。先实际context（ccr-context57-budget，默认预算即通过，未截掉约束）；同原56不变设置/研究/卷纲/治理逐字段比同，差异delta1042行完整实读。动笔前ccr-template57保存r283原模板。AD-CR-0057/01—10十自然分段/真实assemble，整章ccr-whole57-p1—p8完整后报告和真实变化，preview0/record0到r284。当前57没有登记后直接改稿。

## 正文、字数与整窗覆盖

去标题汉字口径：移除Markdown标题行，Unicode Script=Han计数；不是字符数冒汉字。当前六章均>=12000，56>=16000。55本程保留已登记原版，没有重写。

|章|当前登记文件|去标题汉字|整窗实读页|SHA256|
|---|---|---:|---:|---|
${fileTable}

55—57共${current.filter(v=>v.unit>=55).reduce((n,v)=>n+v.han,0)}汉字；当前52—57共${current.reduce((n,v)=>n+v.han,0)}汉字。两章登记后新开ccr-window52-p1—p11、53-p1—p9、54-p1—p8、55-p1—p9、56-p1—p11、57-p1—p8，共56页逐页完整输出/实读；无缺漏、无旧稿混读。ccr-window52-57-coverage.json含每页实际区间/同SHA并逐页核原文切片。

各章真实六字段：56 summary/9人物/9时间线/17ledger/真实引文/downstream；57 summary/5人物/6时间线/9ledger/真实引文/downstream。稿件reviewer、正文SHA、报告SHA均绑定真实文件，冻结报告由工具检验。报告在审查/AD-CR-56整章纲文语言与连续性知情自检.md与57同名报告。preview相关未变候选实际核历史时点，未因关联角色批量改旧事实。

六章正式review：${review.ref}，r285，operation_id ad-c-restored-window52-57-current-r284。报告审查/AD-CR-52至57六章当前SHA知情连读.md；填稿.writer/drafts/ad-cr-review52-57-filled.json；逐章goal/obstacle/choice/consequence/relationship_change五项均observed+实际引文，五组相似结构分别比较差异/保留/阅读成本。kind=model-self-review，不是另一模型、盲读、真人、作者定稿或市场验收。

## 旧线回收与本次后果

柜线从34不凭黑线买料→50/51实际补照片与新牌/约时→52双方保先看后决定→55亲见用法/两旧孔补固/46+12=58未收→56亲检稳、原门原合页螺丝复装、使用者浅盘/大碗/坐写过路真试、接受仍侧身并自己改日用摆放，实交60找2净58、旧纸原未收旁补今日已收。T_D_CABINET_PHOTOS只结本次资料到有限交付，非全柜/永久保证。原门件全复用、布盒归户，无旧件外运；旧门40工+10料=50、抽屉18和三宽条事实未被新柜58覆盖。

学习线13周三课承诺→48第五课原平小段/偏长针及夜母反馈→52另一侧硬尾自试仍硬→55原样定位备问→56原纸/布/小纸先看带到场→57同日19—20:40第六课真实发生。师实际读48夜行/获准摸52尾后才新知；女只在新空边试末角夹入，退最后一下重走自收，旧48/52段都留，新角仍厚但较散；母回家真摸/女直接说想听夸，母保留自己的慢戏时间。T_W_EVENING_CLASS/T_X_COAT_DAILY仍partial，不给学成、总课期或母衣永久效果盖章。

52第二幅帘承诺在53实际收干/买双钩1元/装回并接受色差，56不是再次洗挂，只父袋轻用/8册递还的生活后果；父伤脚凳杖仍在。54母自买灯的选择到56何亲听已摆好能看而不知68，57母在自灯下听戏/纸两空仍留。女孩原14册仍自持，57真实移动原书签到停页，没有新改自写夹纸字。沈只得57实际文字且误会后问回，不凭朋友新练习共享课堂或母夜摸。

## 重复成本、意见与修订

六章确有试摆/自己拿/收物/杯水/保留旧痕与负向边界句积累，报告明确其阅读成本，尤其56柜前细密动作、57多次核针和向母/沈再述。区分52休息洗未干、53跨日劳动与自己迟交、54母自消费、55谈价待稳、56本人验用付款、57新角学习和明确求夸；不靠强冲突/新阴谋制造差异。

本次没有发现必须改的高置信授权内问题，故未启动新revision，也未直接动登记主稿。历史7 verified/13 open未被本轮改变或重复实改；范围外旧意见不冒充当前52—57已全覆盖。可选风格只记观察，不自动升级必改。若日后有硬证据，仍须独立revision完整读稿/重登/尾段复核，不在主稿直接改字。

## 全部失败、纠正及成功证据

本恢复程ccr-*包装器目录${commands.length}个，其中正式引擎实际启动${c}条、全部正式exit0；另1次包装器输入路径失败在spawn之前，无正式退出码。每条成功参数/双流/真实exit/state前后在cli-logs同标签；完整清单checkpoint-c-complete.json.commands。正文分页命令在read-pages，覆盖按全文逐字区间，不用SHA代实读。

1. 原首停c-context56-budget：正式exit2、外层exit1；需42853/默认40000，显式60000后才原模板/动笔。erratum保留，原交接不改成新历史；其他首停29命令28成功1失败与55登记前修正详原交接/C首停audit。
2. 56新段11一次apply_patch部分行锚验证失败，无写入，改精确整段锚后成功；原工具调用现场和ccr-before56-assembly.json保留。
3. 56含原两段的初稿合计15697汉字时尚不合格，在首合章前增加344汉字的课前想听夸交流，达16041。v1全读后五项文字澄清另存：金额“五十元一张”、小盒“前天”、钥匙“提醒”、另半纸“前晚”、何戴镜时盒为空；原新段/初版均不删除。最后v2全11页再填稿登记。
4. ccr-assemble57的相对input按仓库cwd复制找不到，包装器ENOENT/exit1，正式引擎未执行，仅before-state留存。原输入/失败目录保留，ccr-assemble57-corrected同文件绝对路径成功。非产品缺陷。
5. ccr-review52-57.mjs误把52一句“下工回来处理”作53引文，预检AssertionError/exit1，未生成报告/登记输入/state变更；原脚本保留，另corrected脚本用53真实购钩原句，全部引文校验通过后正式review0。不是为了让引文过改正文或hash。

细表ccr-failures-and-corrections.json。没有已知未交付的真实工具缺陷；没有把普通输入错误说成产品结果。输出截断的status/doctor/list完整双流都已落文件并以结构字段核结果，不称终端短显为全文阅读。

## 最后诊断与未覆盖

ccr-final-status/check/doctor全部正式exit0；来源漂移0、stale unit0、impact pending0、${st.revisions.transactions.length}事务全completed、${st.revisions.sessions.length}独立修订历史全committed；unsafe0，未发布review0，rolling pending_windows空，39历史stale review均有当前覆盖而不作旧报告重验。doctor errors/warnings空，构建缺失/不匹配空。

check仍列34份未登记历史正文：进入时已知33份+本程保留的56初版v1，精确新增仅正文/0056-留给她自己试-ad-c-v1.md，无未知未登记新稿；不删除历史。它们不进入正式导出，check机械成功不等文学通过。checkpoint清单871文件0差异，首55登记对象0差异，原56context/template/分段/正式计划0差异。

剩余接口：58及以后未授权本程写；原52旧正面图所有外流版本/来客对岸是否到达、复航、母衣长期穿洗反馈、原旧灯后续、68新灯长期耐久、父伤恢复、女下一次练习与同学领子都未发生或未证明，保留有限知识边界。柜本次结清不承诺多年质量。未完整重读全书1—51，不把旧承诺的相关原文回读说成全书通读；未做人类盲读、实物木工/裁缝验收、出版或市场测试。

主state至57，交接保存即退出；不提前启动58或下一组。
`;
fs.writeFileSync(path.join(base,'交接-C完成.md'),handoff,{flag:'wx'});
console.log(JSON.stringify({ok:true,revision:s.revision,units:s.units.length,state_sha256:stateHash,checkpoint_unchanged:checkpointFiles.length,originals,formal_commands:c,wrapper_failures:1,current,review_ref:review.ref,handoff:'交接-C完成.md'},null,2));
