import fs from 'node:fs';import path from 'node:path';
import {stage,project,hash,save,runner} from './run-cli.mjs';
const start='2026-10-16T11:20:29.717Z',end=new Date().toISOString();
const audit=JSON.parse(fs.readFileSync(`${stage}/continuity-preservation-audit.json`,'utf8'));
const ev=JSON.parse(fs.readFileSync(`${stage}/export-verification.json`,'utf8'));
const s=JSON.parse(fs.readFileSync(`${project}/.writer/state.json`,'utf8'));
const statusRow=runner.last('status-final');
if(statusRow.label!=='status-final'||statusRow.executable!==process.execPath||statusRow.argv[1]!=='status')throw Error('Invalid exact final status identity');
const status=runner.json('status-final'),check=runner.json('check-final'),doctor=runner.json('doctor-final');
if(audit.failures.length||ev.failures.length||check.rolling_review.pending_windows.length)throw Error('Result cannot mark incomplete gates complete');
const fullReadExtras=[`${stage}/ledger-recovery-index.json`,'acceptance/20261016-hundred/command-runner.mjs'];
for(const f of fullReadExtras)fs.appendFileSync(`${stage}/reading.jsonl`,JSON.stringify({path:f,sha256:hash(f),range:'full',purpose:f.includes('ledger-')?'完整实读活跃及未结ledger字段投影；不是全量旧证据历史深读':'共享无剧情原生命令捕获代码，按用户授权只读',read_at:end,method:'FastCtx完整展示实读后记录；非哈希扫描冒充阅读'})+'\n');
const reads=fs.readFileSync(`${stage}/reading.jsonl`,'utf8').split(/\r?\n/).filter(Boolean).map(JSON.parse);
const unique=[...new Map(reads.map(x=>[x.path+'\0'+x.sha256,x])).values()];
const chaptersRead=unique.filter(x=>x.path.includes('/正文/')).map(x=>Number(path.basename(x.path).slice(0,4))).sort((a,b)=>a-b);
const chapters=audit.chapters.map((c,i)=>({...c,state_hash_before:c.source_hashes['.writer/state.json'],state_hash_after:i<5?audit.chapters[i+1].source_hashes['.writer/state.json']:hash(`${project}/.writer/state.json`),journal_sha256:typeof c.journal==='string'&&fs.existsSync(path.join(project,c.journal))?hash(path.join(project,c.journal)):null}));
const current=x=>typeof x==='string'?x.split('；历史有效信息（以下按原章时点，不作当前状态）：')[0]:x;
const knowledgeIds=['T_RETURN_MONTH','R_SHEN_ZHOU','P_CUP_SKETCH_84','P_BOWL_SKETCH_87','T_ROUTE_COMMON','P_LAMP','P_SHOP_CHAIR_66','T_SHOP_SEAT_WEEK_86','T_VOICE_CONSENT','T_PAGE_PAIR','P_QIU_WORK_PAGES','P_PUBLIC_PAGES','P_QIU_LARGE_PAGES','P_QIU_MARKED_SAMPLE_89','P_QIU_TEXT_FILES_89','I_PUBLIC_SCOPE_40','T_QIU_WITHDRAWAL_89','R_SHEN_QIU_LIFE','P_RO_WORK_PAGES','P_TRIAL_VOICE','P_HE_HOME_STOOL_88'];
const boundary=Object.fromEntries(knowledgeIds.map(id=>{const v=s.snapshot.ledger[id];return[id,{type:v.type,status:v.status,due_unit:v.due_unit,custody:v.custody,reader_known:v.reader_known,character_known_current:Object.fromEntries(Object.entries(v.character_known??{}).map(([name,x])=>[name,current(x)])),evidence_latest:v.evidence.filter(e=>e.unit>=85)}];}));
save('current-boundaries.json',{state_sha256:hash(`${project}/.writer/state.json`),nature:'current-field projection; full historical strings preserved in authoritative state and checked by preservation audit',ledger:boundary});
const tracks=[
 {ids:['O_HOURS_NOTE','P_HOURS_NOTE','T_KEEPER_SHARE','T_HE_OLD_PAY'],first_unit:26,concrete_first_unit:35,current_unit:90,span:'V5/V6—V8—V10—V13',evidence:'26何的兼职/排版与宋半上午值班；35蓝笔17:10交校样、四折痕横墨；56三轮180与旧240分开、原纸旧字保留；72仍两段未清。',payoff:'56已阶段落实有限轮换报酬与退出；本批无新增旧款回收。',unknown:'何旧两段未清、长期重开经费/人手未定；due56/64均保留。'},
 {ids:['T_PAID_WORK','T_SOUND_CONTEXT'],first_unit:25,concrete_first_unit:25,current_unit:90,span:'V5—V9/V10—V12/V13',evidence:'25八分钟有偿单与两人菜；72三日2700/勘看180/核听480的3360只限对应三项、工位80另支出，拒占整周；84另一新12分单480齐。',payoff:'72工钱线已回收；82误记窗外搬盆被排、版本重开后才定位，本批不接无范围新单。',unknown:'余带男钟/剪者/目录用意仍无新增来源，不能拿新生活钟或客户声代证；本批无新余带回收。'},
 {ids:['T_ROUTE_COMMON','O_RAIN_TILE','O_ROUTE_PREP_85','T_SHOP_SEAT_WEEK_86'],first_unit:28,concrete_first_unit:36,current_unit:90,span:'V5—V6—V8—V10—V11—V12—V13',evidence:'28菜被板挡且范不许检查处办活动；36两暗红砖/半月缺口/水薄泥仍在；75原双侧筐需转弯；85真挪重箱门内转架，88收空筐木屑后邹原宽车外过、何提家凳走过并靠坐。',payoff:'88有限通行和歇脚办法用于实际生活，T_ROUTE_COMMON按阶段resolved，原due88未改。',unknown:'不证整季/全路不积水或灯下开放；55—61店椅只见首晨后段，58晨休/余晨待，52/53后续仅乔55口述且价仍谈。'},
 {ids:['T_RETURN_MONTH','R_SHEN_ZHOU','T_SHARED_EVENING_84','P_CUP_SKETCH_84','P_BOWL_SKETCH_87'],first_unit:25,concrete_first_unit:25,current_unit:90,span:'V5—V8—V9—V11—V12—V13',evidence:'25虾/茄子与各自早晨；74第44日起未来一月镇家/可出差归来且各住；84杯画背葱/杯口擦毛实交沈；87周原碗画三重线长弯才展示后自留，19点到20:29离且握手靠肩。',payoff:'87兑现54日晚约及跨最初一月后的实际来往选择，根线resolved、due88保留。',unknown:'永久住所与同居未定，各钥各家；未把未来一个月已经过完当事实。'},
 {ids:['T_VOICE_CONSENT','T_PAGE_PAIR','O_PAGE_PAIR','O_PAGE_SLIP_48','T_QIU_WITHDRAWAL_89'],first_unit:27,concrete_first_unit:31,current_unit:90,span:'V5/V6—V8—V10—V12—V13',evidence:'27罗拒无名坐听形象、邱最早改词单页留铺；31第二页无名/细夹；48细夹松页滑桌边后宽夹合/原细夹留；54原袋两夹归盒，83扣盒入下柜；89邱撤回后续且不匿名接用，90逐份自持范围落实/实际告何并回邱。',payoff:'89—90撤回与分载体/受话人落实已发生，仍partial；预定100附近总回收尚未发生。',unknown:'旧实际听读者未逐告、自述未逐句复核、罗后续授权另核；27最早单页实体后续去向未核，不并入31两页；due100/94原值保留。'}
];
const unresolved=Object.entries(s.snapshot.ledger).filter(([id,v])=>typeof v.due_unit==='number'&&v.due_unit<=90&&!['resolved','intentional-open'].includes(v.status)).map(([id,v])=>({id,type:v.type,status:v.status,due_unit:v.due_unit,statement:v.statement,reader_known:v.reader_known}));
const index=fs.readFileSync(runner.index,'utf8').split(/\r?\n/).filter(Boolean).map(JSON.parse);
const failureRows=index.filter(x=>x.exit_code!==0);
const reports=['审查/82-87-20261016-session11.md','审查/85-90-20261016-session11.md','审查/26-28-20261016-session11.md'].map(p=>({path:project+'/'+p,sha256:hash(path.join(project,p))}));
const result={task:'真实Codex百章长篇第85—90章',status:'batch-complete-draft-not-publication-acceptance',started_at:start,completed_at:end,elapsed_s:Math.round((Date.parse(end)-Date.parse(start))/1000),native_command_elapsed_ms_sum_as_of_generation:index.reduce((n,r)=>n+r.elapsed_ms,0),project,stage,revision_before:269,revision_after:275,next_unit:91,state_hash_before:audit.baseline_state_sha256,state_hash_after:hash(`${project}/.writer/state.json`),chapters,han_total:chapters.reduce((a,c)=>a+c.han,0),actual_full_read_chapters:chaptersRead,full_read_sources:unique,reading_log:`${stage}/reading.jsonl`,read_scope_boundary:'只从当前作品恢复剧情；未读其他阶段请求/结果/聊天或旧状态补剧情。baseline-r269仅由本轮当前state原样复制供机械保留审计。全量导出仅做结构与哈希核验，不冒充本轮全书全文审读。',write_scope:{story:'当前作品85—90正文、CLI生成对应章纲/状态/journal及审查文件',stage:'本阶段命令/输入/恢复/阅读/审计/结果与新导出',product_modified:false,other_stages_modified:false,subagents:false,manual_state_or_journal_edits:false,rewind_required:false,commit:false,push:false,publish:false},cross_volume_progress:tracks,current_scene:{day:56,time:'10点过后至午前',shen_location:'沈镇家；淘米未开火、续读自家小说',he_location:'9:57持自包离沈家，回自己排版方向；不证到家完成新排版',qiu_location:'本人铺内电话后接取衣客',zhou_location:'本批最新现场54晚周家；55早班仅其自述未来，未补亲见'},custody_and_knowledge:`${stage}/current-boundaries.json`,preservation:{old_ids:audit.old_ids_checked,old_observations:audit.old_observations_checked,old_due_fields:audit.old_due_fields_checked,old_evidence_instances:audit.old_evidence_instances_checked,old_knowledge_fields:audit.old_character_known_fields_checked,old_character_histories:audit.old_character_histories_checked,failures:audit.failures,scope:audit.scope,evidence_identity:audit.evidence_identity},unresolved_due_ledger:unresolved,reviews:reports,final_status:status,final_check:check,final_doctor:doctor,export:{directory:`${stage}/export`,included_units:ev.included_units,count:ev.count,heading_count:ev.chapter_headings_count,excluded_drafts:ev.excluded_drafts,warnings:ev.warnings,manuscript_sha256:ev.manuscript_sha256,manifest_sha256:ev.manifest_sha256,source_hashes_verified:90,nature:'draft-export; structural/hash checks do not prove literary quality'},command_logging:{index:runner.index,records_as_of_generation:index.length,split_raw_bytes_preserved:true,bootstrap_exception:`${stage}/commands/bootstrap-tool-boundary.json`,bootstrap_boundary:'首次机器计时命令只得到exec_command合并回包，已如实保存边界，没有补造分流字节。',status_exact_label_validation:ev.status_row_verified,failures:failureRows},issues_and_repairs:[{kind:'stage-helper-defect-not-product',detail:'首次review-87生成循环边界错误，仅提交82哈希而称82—87，CLI正确拒绝；失败原输入/报告/原始输出保留，修正辅助脚本后以实读六章登记成功。',evidence:['review-87-failure.json','review-87-failed-input.json','review-87-failed-report.md']},{kind:'auxiliary-path-lookup',detail:'补读27时误猜标题，FastCtx报不存在；错误边界已记录，按工具实际给出的正确路径完整实读；失败路径未记full read。',evidence:['read-27-path-failure.json']},{kind:'unregistered-draft-self-corrections',detail:'85昨日改前日；86扩场重复付款顺序、88小票到手顺序/绳勒表述均在record前修正，未变更已登记正文。'},{kind:'progress-count-correction',detail:'88最终Han是2455，口报2453已立即以原生命令核实更正。'}],product_defects_found:[],not_covered:['未做真人/盲读/市场/正式发布验收；模型知情报告与机械脚本各有范围。','没有在本轮全文重审1—90全部章节；实际全文范围见列表，导出90章为结构哈希核验。','旧审查元数据仍有35份stale，其中2份stale_without_current_coverage；本轮两窗均有效，pending_windows为空，不删除历史。','旧实际听读者通知、自述逐句复核、27最早单页后续实体去向尚未核；不以本机/对应盘备份说明宣全部版本同步。','店椅新周余晨与58休、原路全季/全段、阅览间重开及旧账两段仍未结；余带男声钟源/剪者/目录用意未新增答案。'],git_status:ev.git_status};
save('result.json',result);
const md=`# 第85—90章阶段结果

本批六章已全部真实创作、登记、实读自检并完成滚动审查。revision **269 → 275**，next **91**。这是草稿交付，不是文学质量或发布验收。

开始 ${start}，结果生成 ${end}，机器实测 ${result.elapsed_s} 秒（约 ${(result.elapsed_s/60).toFixed(1)} 分钟）。原生子进程耗时另在commands每条elapsed_ms中，不将它冒充总创作时间。

|章|正文Han（去Markdown标题）|写前revision|登记revision|正文SHA-256|
|---|---:|---:|---:|---|
${chapters.map(c=>`|${c.unit}|${c.han}|${c.prewrite_revision}|${c.registered_revision}|${c.sha256}|`).join('\n')}

合计 **${result.han_total} Han**。完整写前source_hashes、登记输入哈希、journal路径与哈希、每章前后状态哈希在result.json及continuity-preservation-audit.json；所有权威写入均经CLI，没有手改state/journal、没有需要rewind的已登记正文错误。

初始状态SHA-256：${result.state_hash_before}；最终：${result.state_hash_after}。

## 实际读写范围

本轮完整实读章节：${chaptersRead.join('、')}（${chaptersRead.length}章），另读现行设定、全书/续部总纲、V12/V13卷契约与活跃/未结ledger字段投影。read范围与各哈希/用途逐条在reading.jsonl，投影不是127项全历史证据逐条深读。旧证据均在recall单ID定位后按相应正文回读，未读其他阶段请求、结果、聊天或旧状态补剧情。共享command-runner无剧情代码只读；本轮r269复制仅作保留审计。

只写当前作品85—90正文、CLI章纲/追踪与审查，以及session-11辅助/日志/结果/新导出。没有子代理，没有修改产品，也没有提交、推送、上传或发布。仓库原有lib/help.mjs、lib/workspace.mjs等工作区改动仍保留。

## 跨卷伏笔与回收

|稳定ID/线|最初章—当前章|具体证据与已回收范围|保留未知|
|---|---|---|---|
${tracks.map(t=>`|${t.ids.join(' / ')}|${t.first_unit}—${t.current_unit}（具象起点${t.concrete_first_unit}）|${t.evidence} ${t.payoff}|${t.unknown}|`).join('\n')}

以上各线跨至少两个续部卷，旧观察不逆改。第100章附近的总回收尚未发生；未为凑回收翻案第一部、解释罗私人失约或编余带答案。

## 当前保管与知情

实际停在第56日上午10点过后至午前，沈在镇家；何9:57离沈家回自己排版方向，邱接完回报电话继续接取衣。沈周按44日起未来一月选择继续各住，54晚原约已经真实相处，没有交钥/同居。

原箱连布牌仍宋里间干板、原带宋另干格；原钥/通知/簿仍赵新库，原灯范原位不接电、不开放检查处。邱最早缺名两页原袋/两夹仍下柜扣盒，89未开；27最早单页是另一份，后续实体去向本批未核。使用两页/大字四页/标改试样仍沈家各袋，外添55撤回说明、旧字/内文保留；本人电脑及一只移动盘对应旧稿备份另存说明，母原盘、旧转录、客户未调用。罗三页保持原限制，未被邱退出替代。杯画沈家用本，原碗画周家画册，未混。

何90才从沈转述获55完整撤回，并只亲读三袋外新纸，未见旧页/屏幕操作、不收文件；邱只电话获落实回报，未亲验沈家。何55家凳到家/母试只56当前回顾，沈不补成现场。冯小满先为破围裙夜班需要付8修补、离后才谈旧事，没获得沈姓名或旧材料知识。thread/object/fact/relationship逐项知情与保管投影见current-boundaries.json，完整旧文本仍留权威状态。

## 验证及真实边界

保留审计：${audit.old_ids_checked}个旧ID、${audit.old_observations_checked}条旧观察、${audit.old_due_fields_checked}个到期字段、${audit.old_evidence_instances_checked}条旧证据实例、${audit.old_character_known_fields_checked}个人物知情字段及${audit.old_character_histories_checked}个人物历史全文均保留，0丢失。证据按ID+unit+精确quote+版本SHA+draft多重计数核对，未用unit+line当唯一身份。这只证明机械保留，不证明语义无误。

82—87和85—90均完整重新连读并review绑定哈希；26—28另作跨卷起点补核。status/check/doctor末次均成功，无stale_units/changed_sources/未登记稿；check.findings为空、**pending_windows=[]**。旧报告有35份stale，其中2份stale_without_current_coverage，这些历史元数据没有删除；本轮窗口覆盖有效，不以机械覆盖冒充文学通过。

新导出：export/manuscript.md 和 export/manifest.json；manifest与真实export回包均恰好**1—90章**，90个章节标题、90个源正文哈希一致，无excluded_drafts/warnings，没有覆盖旧导出。合订本SHA-256：${ev.manuscript_sha256}；manifest：${ev.manifest_sha256}。本轮没有全文审读合订本1—90，导出核验是结构与哈希。

## 问题及未覆盖

未发现需修改产品的工具缺陷。首次review-87辅助循环边界错误，工具正确拒绝不全哈希；失败输入/报告/原始回包均留存，修正本阶段脚本后重登成功。27补核一次路径标题误猜也记录真实MCP错误，再按工具给出的正确路径实读；失败路径未写入full read。未登记稿小修均在record前；88口报Han已由原生命令更正2455。

未结继续保留：旧账两段、公屋重开、店椅余晨/58休、全雨季通行、旧实际听读者逐个通知、自述复核与27单页后续去向；余带与私人失约未知不填答案。无真人、盲读、市场或正式验收。不得把本批六章完成说成100章已经完成。

所有实际CLI/核心辅助进程的argv、退出码、原始分流stdout/stderr见commands/index.jsonl及对应files。启动首次计时只得工具合并回包，commands/bootstrap-tool-boundary.json如实记边界，未补造分流字节。最终status按label严格等于status-final取，并核executable/argv，git-status-final邻接不会被当status。
`;
fs.writeFileSync(`${stage}/result.md`,md,'utf8');
save('delivery-files.json',{generated_at:end,files:[`${stage}/result.md`,`${stage}/result.json`,`${stage}/recovery.md`,`${stage}/reading.jsonl`,`${stage}/current-boundaries.json`,`${stage}/continuity-preservation-audit.json`,`${stage}/export-verification.json`,`${stage}/export/manifest.json`,`${stage}/export/manuscript.md`,...reports.map(r=>r.path)].map(p=>({path:p,sha256:hash(p)}))});
console.log(JSON.stringify({status:result.status,elapsed_s:result.elapsed_s,han_total:result.han_total,chapters:chapters.map(c=>({unit:c.unit,han:c.han,revision:c.registered_revision})),full_read_chapters:chaptersRead,final_state_sha256:result.state_hash_after,export_count:ev.count,pending_windows:check.rolling_review.pending_windows,result_files:['result.md','result.json','delivery-files.json']},null,2));
