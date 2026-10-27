import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import assert from 'node:assert/strict';
const b='acceptance/20261024-long-flow-090-ac',p=JSON.parse(fs.readFileSync(b+'/project.json')).project,sha=v=>crypto.createHash('sha256').update(v).digest('hex'),stateBytes=fs.readFileSync(path.join(p,'.writer/state.json')),s=JSON.parse(stateBytes),cp=JSON.parse(fs.readFileSync(b+'/checkpoint-c-first.json')),old=JSON.parse(fs.readFileSync(b+'/checkpoint-c-first-state.json')),read=l=>JSON.parse(fs.readFileSync(`${b}/cli-logs/${l}/stdout.txt`));
const status=read('cr32-status-final'),check=read('cr33-check-final'),doctor=read('cr34-doctor-final'),revs=read('cr35-revision-list-final'),resume=JSON.parse(fs.readFileSync(b+'/cr-inputs/resume-verification.json')),win=JSON.parse(fs.readFileSync(b+'/cr-inputs/final-window-read-audit.json'));
assert.equal(s.revision,206);assert.equal(s.units.length,45);assert.equal(process.env.CODEX_THREAD_ID,cp.thread_id);assert(status.ok&&check.ok&&doctor.ok);assert.equal(status.tool_control.generation,5);assert.deepEqual(status.stale_units,[]);assert.deepEqual(status.changed_sources,[]);assert.deepEqual(status.impact_pending,[]);assert.equal(check.rolling_review.pending_windows.length,0);assert.equal(check.rolling_review.stale_without_current_coverage,0);assert.deepEqual(doctor.errors,[]);assert.deepEqual(doctor.warnings,[]);assert(revs.sessions.every(x=>x.status==='committed'));assert(revs.transactions.every(x=>x.status==='completed'));
const firstInventory=Object.entries(cp.files).map(([ref,v])=>{const bytes=fs.readFileSync(path.join(p,ref));return {ref,expected_sha256:v.sha256,actual_sha256:sha(bytes),expected_bytes:v.bytes,actual_bytes:bytes.length};});assert(firstInventory.every(x=>x.expected_sha256===x.actual_sha256&&x.expected_bytes===x.actual_bytes));assert.deepEqual(s.units.slice(0,43),old.units);assert.deepEqual(s.governance,old.governance);
const stats=s.units.map(u=>{const v=fs.readFileSync(path.join(p,u.draft)),body=v.toString();assert.equal(sha(v),u.sha256);return {unit:u.unit,draft:u.draft,sha256:u.sha256,bytes:v.length,han:(body.replace(/^#{1,6} .*$/gm,'').match(/\p{Script=Han}/gu)||[]).length,pages:Math.ceil(body.length/1800)};});
const orig44=cp.parts.map(x=>{const v=fs.readFileSync(path.join(p,x.path));assert.equal(sha(v),x.sha256);assert.equal(v.length,x.bytes);return {...x,current_sha256:sha(v)};}),whole44=fs.readFileSync(path.join(p,s.units[43].draft)),sep=Buffer.from('\n\n'),prefix=Buffer.concat([fs.readFileSync(path.join(p,orig44[0].path)),sep,fs.readFileSync(path.join(p,orig44[1].path))]);assert(whole44.subarray(0,prefix.length).equals(prefix));assert.equal(sha(fs.readFileSync(path.join(p,cp.template.path))),cp.template.sha256);assert.equal(sha(fs.readFileSync(path.join(p,cp.context.path))),cp.context.sha256);
assert.deepEqual(check.draft_inventory.unregistered.map(x=>x.draft).sort(),read('cr02-check').draft_inventory.unregistered.map(x=>x.draft).sort());assert(!fs.readdirSync(path.join(p,'正文')).some(x=>/^0*46[-章.]/.test(x)));
for(const x of win.readings){const u=s.units[x.unit-1];assert.equal(u.sha256,x.sha256);for(const l of x.read_labels){const page=JSON.parse(fs.readFileSync(`${b}/read-pages/${l}.json`));assert.equal(page.sha256,u.sha256);}}
const logs=fs.readdirSync(b+'/cli-logs').filter(x=>/^cr\d/.test(x)).map(label=>{const f=`${b}/cli-logs/${label}/result.json`;return fs.existsSync(f)?{label,...JSON.parse(fs.readFileSync(f)),args:undefined}: {label,exit_code:1,partial_wrapper_log:true,product_invoked:false};});
const report='审查/AC-C40-45-最终版本完整连读知情自检.md',reportRef='.writer/reviews/0f35a173-ef74-4ab7-91ed-ca4e8e277e72.json';assert.equal(sha(fs.readFileSync(path.join(p,report))),win.report_sha256);assert(fs.existsSync(path.join(p,reportRef)));
const proof={at:new Date().toISOString(),same_thread_id:process.env.CODEX_THREAD_ID,entry_revision:cp.revision,final_revision:s.revision,entry_state_sha256:cp.state_sha256,final_state_sha256:sha(stateBytes),entry_verification_file:'cr-inputs/resume-verification.json',first_checkpoint_files:621,all_first_checkpoint_files_still_match:true,unchanged_registered_prefix:[1,43],original44_context:cp.context,original44_template:cp.template,original44_parts:orig44,final44_prefix_matches:true,prefix_offsets:[0,orig44[0].bytes+sep.length],prefix_bytes:prefix.length,final_window:win.readings,final_window_pages:49,final_window_han:stats.filter(x=>x.unit>=40).reduce((n,x)=>n+x.han,0),stats,all_registered_han:stats.reduce((n,x)=>n+x.han,0),c_window_han:stats.filter(x=>x.unit>=43).reduce((n,x)=>n+x.han,0),tool:{generation:5,content_id:doctor.build.observed_content_id,runtime_id:doctor.build.runtime_id,tool_version:doctor.tool_version,build_guard:'b64b8fe71c611086a93219876dcbfc0c943819e89996f4fc5e3de07e82156c1f'},diagnostics:{status_ok:true,check_ok:true,check_warning_codes:[...new Set(check.findings.map(x=>x.code))],known_old_unregistered:check.draft_inventory.unregistered.length,doctor_ok:true,doctor_errors:0,doctor_warnings:0,stale_units:[],changed_sources:[],impact_pending:[],rolling_review:check.rolling_review,active_revisions:[],pending_transactions:[]},review_ref:reportRef,report,report_sha256:win.report_sha256,revision_id:'b572b1e1-a2ac-4903-9e43-cc84eb36a1b5',transaction_id:'22493cd3-b392-4cf8-868a-70d2a410e4d0',issue_workflow:{id:'I_AC_C45_MEAL_DISH',status:s.review_workflow.issues.I_AC_C45_MEAL_DISH.status,body_fixed:true,adopt_apply_verify_complete:false},logs};
fs.writeFileSync(b+'/cr-inputs/final-completion-audit.json',JSON.stringify(proof,null,2)+'\n',{flag:'wx'});fs.writeFileSync(b+'/checkpoint-c-complete-state.json',stateBytes,{flag:'wx'});
const table=stats.filter(x=>x.unit>=40).map(x=>`|${x.unit}|${x.han}|${x.bytes}|${x.pages}|${x.sha256}|`).join('\n');
const text=`# AC C轮完成交接

本轮已在同一C会话真实恢复，完成44—45并正式登记、40—45当前版本完整连读与review，停止于45。本文件不是46授权。全过程只写AC独立副本与AC证据；无子代理、额外Codex会话、后台写稿、其他聊天消息、外部写作服务、Git提交推送或发布。正式45修订区是本作品受管修订流程，不是额外写作会话。

## 实际状态与构建

作品：${p}

同ID：${process.env.CODEX_THREAD_ID}。起点revision201/43已登记，终点revision206/schema6/已登记1—45。state SHA ${proof.final_state_sha256}，原字节另存checkpoint-c-complete-state.json。next_unit机械值46，但任务stop_conditions明确45后停，不据此动笔。workflow整组43—45与旧44未完模板贯穿，未改成永久不写45，也未因修订扩到42。

工具0.9.0，generation5，content_id ${proof.tool.content_id}；runtime_id ${proof.tool.runtime_id}；修订模块守卫${proof.tool.build_guard}。仍为7961decef067a63453e05923d2a7512a103ff795 dirty=true候选资源，内容指纹不是签名或已发布结论。外部CLI固定active-tool，doctor实际校验作品随附包/当前技能；未升级或修改工具。

## 正文统计

下表计正文汉字，不计章题；页为1800字符实读页。45最后是在同一路径受管修订后的当前稿，原初分段/旧SHA在基线与历史证据，不冒充最终拼接。

|章|正文汉字|UTF-8字节|页|当前SHA256|
|---|---:|---:|---:|---|
${table}

C组43—45共${proof.c_window_han}汉字，40—45共${proof.final_window_han}汉字，已登记1—45机器统计${proof.all_registered_han}汉字（不称本次重读全书）。44≥14000、43/45≥10000均达到；无46正文。

## 真实恢复字节证明

恢复前已重读COMMON.md、author-request.md、project.json、active-tool.json、交接-C首停.md与checkpoint-c-first.json；实际cr01-status/cr02-check/cr03-doctor/cr04-discussion核generation5与ID、43、无漂移/未知新增稿/待恢复事务，再续原段。首停checkpoint 621文件恢复时机器全匹配，结束再次全匹配；1—43登记行与首停state逐项相同，旧冻结源、43、旧草稿未改。实际核验见cr-inputs/resume-verification.json与final-completion-audit.json。

44原context：${cp.context.path}，SHA ${cp.context.sha256}。原模板：${cp.template.path}，SHA ${cp.template.sha256}，expected_revision201；用它完成44，未重取或刷新旧哈希。01原5301字节/1516汉字/SHA ${orig44[0].sha256}，02原6059字节/1764汉字/SHA ${orig44[1].sha256}；当前44正文中偏移0及5303字节精确出现，含分隔符前11362字节完全等于首停两段组合。原段本轮实际读1＋2页，再接写03—09，非重写片段冒充恢复。

## 实际执行与读稿范围

44沿原模板：原两段→新增七段→cr06 assemble→完整初稿10页→七项登记前修正→最终cr-approved44-p1—p10全读、纲文回对/自检→cr07 preview→cr08 record到202。44只做吃，洗收仍partial。45仅滚动未消费单元0045，保留已消费A37—48骨架/C窗口/V16；context/template202先取，再写八段/assemble、7页回读及四项修正、最终cr-approved45-p1—p7全读，cr13 preview/cr14 record到203。

45登记后第一次40→45完整49页（cr-window40-p1至cr-window45-p7）和report/review发现器物错。首轮正式review ref .writer/reviews/25f40fa1-214a-4811-b733-fa24dc02496f.json，revision204。原意见保留42/43/45全文证据，没有删证据过门禁。

正式独立修订仅45—45：${proof.revision_id}，基线204。rewind205后用新context及replay-input，旧正文SHA73cc31d8…改为当前b2e472d8…，登记前修稿7页全读，六项summary/characters/timeline/ledger/evidence/downstream报告实核后preview/record206。然后独立区当前40→45再次完整49页（cr-closed40-p1至cr-closed45-p7），新report与cr26-review-final正式登记。prepare/commit真实成功，事务${proof.transaction_id} completed，主revision205，备份保留；随后意见级延期说明使主revision206。没有直接改已登记主稿。

最终正式review：${reportRef}，报告${report}，报告SHA ${proof.report_sha256}。40—44保持原字节，45候选最终字节由受管事务应用，最终主稿六章与第二轮49页SHA全部相同。首轮旧报告保留历史，不靠刷新旧SHA冒充新稿复核。

本恢复还全读43的8页承接、44两段3页；recall T_AC_SHARED_MEAL后实读37第5、7页旧原文。首程完整40—42及旧工装原文的读稿记录仍见首停交接，不冒称本恢复对1—39全章重读。两个49页窗口确为登记后完整实读，不是散评拼成；语义仍只是模型知情自检。

## 具体修订与当前复核

45原“另一个装菜的也已空…这两只空盒”与42明确浅碟、43“碟好拿”不符；正式独立区改“装菜的小碟也已空…眼前空了的盒和碟”。沈角色现状同步改“亲见旧饭盒和菜碟已空”，添本稿引文；不倒写父中午热洗现场，不改42—44。原45自由分段仍是初次登记历史，不伪称修后分段拼接；修订前后正文均由受管备份保存。

最终比较：40拆清/选料使隐藏门底与真实通行可见；41使用者亲推、接受留细缝并付48；42屉换底18与原柜旧抬手分开、补班付出/家中冷试；43真实交班/各自付找使约定到场；44粉黏/脆软/宽细/蒜量改变实吃，能不全说好；45分担洗收、盐位被真正取用并纠回、说想躺和想回，散场不再需加活动。动作相似而后果不同。当前未再发现确认必修项；解释性否定旁白及器物俏话偏密为可选风格，维持建议，不伪装作者逐项采纳。没有真人语言硬问题的知情自检结论并非真人盲读通过。

## 回收链证据与剩余接口

T_AC_SHARED_MEAL：37各做一项/各出菜钱及一次借厨许可→39问班→40换周六2小时、41母厨房/老板确认→42真补班、3元两个包子、周日只洗自己衣；父饭盒＋浅碟冷藏亲试取放未蒸→43女12/沈12:30实交、许家坐过10分钟、女3＋2余5/沈芋头6余9→44真做吃、四整块女1/母1/沈1/盘1、母半块另留→45母半块亲吃完、洗锅碗/油盐勺归位/真散场。仅本次阶段resolved；未把未知线索强结。

沈自家厚盒装余饭与共盘1整块，先许家冷藏、入自己包带回再自家冷藏，P_AC_C_MEAL_BOX active；未热吃、父未尝，没借许家碗，所以没有必须“还碗”的债。原V17骨架的“若有借还”分支本次未产生，后续只能从实物与各家正常生活继续，不能为服从远纲捏造借用。姑娘两份少菜傍晚真热吃完；垃圾封口门侧、未亲见投放，另一个馒头父口述留着；不预写未来动作。

T_X_COAT_DAILY仍partial：38看衣未拆、39母先穿仍认角；42洗自己衣不包含母工装，本组无新洗改/彻底舒服结论。T_D_CABINET_PHOTOS继续pending等侧图；41门条48与42抽屉18只当次有限完成，旧钉42进废钉筐、门旧料与新余头在主人家、抽屉原板拆短废料不复活。父仍伤脚凳杖，课总期数、复航、父辈全史与问路人终点继续未知。

## 最终诊断

cr32-status/cr33-check/cr34-doctor/cr35-revision-list均退出0。stale_units/changed_sources/impact_pending均空，无活跃修订或未完成事务；doctor errors/warnings均0，generation5、内容ID及runtime匹配。check只有原有22个未登记旧留稿警告，列表与恢复入口完全相同，无未知新稿；不删旧稿消警。rolling_review有效${check.rolling_review.valid}、历史过期${check.rolling_review.stale}均有当前覆盖，缺覆盖0、pending_windows空。机械检查仍标mechanical-only，不是文学验收。

意见状态5 verified（旧历史）、10 open（旧9＋本轮可选建议）、1 deferred。本轮I_AC_C45_MEAL_DISH实质修复已在当前正文/追踪与新report核清，但其adopt/apply/verify链没成功，deferred只延期该意见级闭环交根，不称该ID verified。

## 全部失败与局限

首程C24个公开CLI均0，43初稿/追踪及44原段自检修正见首停交接61—67，原输入与候选保留。不是继承A/B失败数。

本恢复实际失败：①cr-prepare-window-review.mjs辅助脚本引文断言退出1，“我的正好”不是原句，改为“父亲说他的正好”；失败脚本/说明保留，无状态变更。②cr17-adopt-dish公开CLI退出1 ACTION_OUT_OF_SCOPE：证据涉及42使采纳请求42—45，超43—45；原输入/stdout/stderr/前后state全保留，停止该采纳链，未删证据/扩权；仅正常45—45独立修订继续。③inline node准备命令中文引号被PowerShell解析造成SyntaxError退出1；④随后cr18包装器因输入文件不存在、产品spawn前退出1，调用方JSON.parse错误；这个依赖步骤未及时门控的执行失误已改为文件脚本和逐步核出口。cr18有局部日志无result，保留，不伪报产品已调用。⑤首次独立区apply_patch含未复制分段路径导致校验失败，确认正文仍旧SHA未写；改为只修受管正文，原分段历史不动。除cr17及cr18包装器外，本恢复其余公开CLI结果均0；详见cr-inputs/failure-*.json、cli-logs与final-completion-audit。

模型稿前自检：44七项、45初合章后四项，以及写稿中措辞/无据衣物概括等，逐项见章前报告与修前保留，不算产品CLI失败。45盒/碟错是在登记后连读确认，已按正式独立区修复。FastCtx替换有数次慢至十几秒但未失败。

大对象status/context/doctor/preview展示有截断，完整原stdout留各唯一日志，相关字段另读；所有正文分页输出完整，未用统计代替阅读。621原清单及统计为机器核对，不称人工读过每个散列。未对AC外全盘做哈希扫描，保护边界由写路径与已有清单证据说明，不声称全盘证明。未覆盖真人盲读、市场、出版、现实厨房实测或工具产品修复。意见范围保守限制交根；不在本授权内修改产品源码。

本轮停在45，完成文件与检查点保存后退出，不写46。
`;
fs.writeFileSync(b+'/交接-C完成.md',text,{flag:'wx'});
const selectedRefs=new Set([...Object.keys(cp.files),'.writer/state.json','writer.json',...stats.map(x=>x.draft),report,reportRef,'审查/AC-C45-独立修订六项回放自检.md','大纲/单元/0045.json']);const files=Object.fromEntries([...selectedRefs].map(ref=>{const v=fs.readFileSync(path.join(p,ref));return [ref,{bytes:v.length,sha256:sha(v)}];}));
fs.writeFileSync(b+'/checkpoint-c-complete.json',JSON.stringify({ok:true,at:new Date().toISOString(),project:p,revision:s.revision,registered_units:45,state_sha256:sha(stateBytes),generation:5,content_id:proof.tool.content_id,runtime_id:proof.tool.runtime_id,thread_id:process.env.CODEX_THREAD_ID,chapter_stats:stats.filter(x=>x.unit>=40),review_ref:reportRef,report_sha256:win.report_sha256,handoff_sha256:sha(text),resume_proof:'cr-inputs/final-completion-audit.json',files},null,2)+'\n',{flag:'wx'});
console.log({revision:s.revision,units:s.units.length,stats:stats.filter(x=>x.unit>=43),all_registered_han:proof.all_registered_han,window_han:proof.final_window_han,first_checkpoint_files:621,all_match:true,original44_prefix_bytes:prefix.length,final_review:reportRef,known_unregistered:22,issue_status:proof.issue_workflow.status,failed_cli:logs.filter(x=>x.exit_code!==0).map(x=>({label:x.label,exit_code:x.exit_code,partial_wrapper_log:x.partial_wrapper_log})),handoff:b+'/交接-C完成.md'});
