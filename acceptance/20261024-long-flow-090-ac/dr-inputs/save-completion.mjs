import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import assert from 'node:assert/strict';
const base=path.resolve('acceptance/20261024-long-flow-090-ac'),get=p=>JSON.parse(fs.readFileSync(p)),cp=get(path.join(base,'checkpoint-d-first.json')),root=cp.project,sha=b=>crypto.createHash('sha256').update(b).digest('hex'),write=(p,x)=>fs.writeFileSync(path.join(base,p),JSON.stringify(x,null,2)+'\n',{flag:'wx'}),info=ref=>{const b=fs.readFileSync(path.join(root,ref));return{ref,bytes:b.length,sha256:sha(b)};},stateBytes=fs.readFileSync(path.join(root,'.writer/state.json')),state=JSON.parse(stateBytes),status=get(path.join(base,'cli-logs/dr22-status-final/stdout.txt')),check=get(path.join(base,'cli-logs/dr23-check-final/stdout.txt')),doctor=get(path.join(base,'cli-logs/dr24-doctor-final/stdout.txt')),active=get(path.join(base,'active-tool.json')),oldState=get(path.join(base,'checkpoint-d-first-state.json')),coverage=get(path.join(base,'dr-inputs/window-read-coverage.json')),reviewResult=get(path.join(base,'cli-logs/dr21-review43-48/stdout.txt'));
assert.equal(process.env.CODEX_THREAD_ID,cp.thread_id);assert.equal(state.revision,215);assert.equal(state.units.length,48);assert.deepEqual(state.units.slice(0,46),oldState.units);for(const[ref,v]of Object.entries(cp.files)){const a=info(ref);assert.equal(a.bytes,v.bytes,ref);assert.equal(a.sha256,v.sha256,ref);}for(const k of ['stale_units','changed_sources','impact_pending'])assert.deepEqual(status[k],[]);assert(status.revisions.sessions.every(x=>x.status==='committed'));assert(status.revisions.transactions.every(x=>x.status==='completed'));assert.equal(status.tool_control.generation,6);assert.equal(doctor.build.observed_content_id,active.content_id);assert.equal(doctor.build.runtime_id,active.runtime_id);assert.deepEqual(doctor.errors,[]);assert.deepEqual(doctor.warnings,[]);assert.deepEqual(check.rolling_review.pending_windows,[]);assert.deepEqual(check.rolling_review.unpublished_records,[]);assert.equal(check.rolling_review.stale_without_current_coverage,0);assert(check.findings.every(x=>x.severity==='warning'&&x.code==='UNREGISTERED_DRAFT'));
const expectedDrafts=[...cp.known_unregistered_drafts,'正文/0047-留一口自己的-ac-d-v1.md','正文/0048-自己的那一段-ac-d-v1.md'].sort();assert.deepEqual(status.draft_inventory.unregistered.map(x=>x.draft).sort(),expectedDrafts);assert.deepEqual(status.draft_inventory.unsafe_entries,[]);assert.equal(check.findings.length,expectedDrafts.length);
const current47=fs.readFileSync(path.join(root,state.units.find(x=>x.unit===47).draft),'utf8');let originalPrefix='';const byteProof=[];for(const p of cp.chapter47.parts){const raw=fs.readFileSync(path.join(root,p.ref)),orig=fs.readFileSync(path.join(base,'dr-inputs/47-original-'+path.basename(p.ref)));assert(raw.equals(orig));assert.equal(sha(raw),p.sha256);assert.equal(current47.split(raw.toString('utf8')).length-1,1);originalPrefix+=raw.toString('utf8')+'\n\n';byteProof.push({ref:p.ref,bytes:raw.length,sha256:sha(raw),unchanged_from_first_stop:true,occurrences_in_current47:1});}assert(current47.startsWith(originalPrefix));assert.equal(info(cp.chapter47.template.ref).sha256,cp.chapter47.template.sha256);assert.equal(info(cp.chapter47.context.ref).sha256,cp.chapter47.context.sha256);
for(const row of coverage.rows){const u=state.units.find(u=>u.unit===row.unit);assert.equal(u.sha256,row.sha256);assert.equal(info(u.draft).sha256,row.sha256);}assert.equal(coverage.pages,49);assert.equal(reviewResult.revision,215);const review=get(path.join(root,reviewResult.ref));assert.deepEqual(Object.fromEntries(review.units.map(u=>[u.draft,u.sha256])),get(path.join(base,'dr-inputs/review43-48-filled.json')).source_hashes);for(const u of review.units)assert.equal(info(u.frozen_ref).sha256,u.sha256);assert.equal(info(review.report).sha256,review.report_sha256);assert.equal(info(review.frozen_report).sha256,review.report_sha256);
assert.equal(fs.readdirSync(path.join(root,'正文')).some(x=>/^00(?:49|[5-9][0-9])/.test(x)),false);assert.equal(fs.readdirSync(path.join(root,'大纲/单元')).some(x=>/^0049\./.test(x)),false);
const cliResults=fs.readdirSync(path.join(base,'cli-logs')).filter(x=>/^dr\d\d-/.test(x)).sort().map(label=>({label,...get(path.join(base,'cli-logs',label,'result.json'))}));assert.equal(cliResults.length,24);assert(cliResults.every(x=>x.exit_code===0));const firstCli=fs.readdirSync(path.join(base,'cli-logs')).filter(x=>/^d\d\d-/.test(x)).sort().map(label=>({label,...get(path.join(base,'cli-logs',label,'result.json'))}));const firstFailures=firstCli.filter(x=>x.exit_code!==0);assert.equal(firstFailures.length,2);assert(firstFailures.every(x=>x.exit_code===2&&x.before_state_sha256===x.after_state_sha256));
const auxiliaryFailures=[{phase:'inline47-count',exit_code:1,error:'SyntaxError: Invalid regular expression: overescaped \\p{Script=Han}: Incomplete quantifier',effect:'未调用产品，无写入',recovery:'保存脚本使用正确Unicode属性正则'},{phase:'prepare-assemble47 initial gate',exit_code:1,error:'AssertionError: Han=9939',effect:'不足10000，尚未生成assemble输入/未合章/未登记',recovery:'补入具体收尾动作后10045，再语句修清最终10054；不计重复总结填充'},{phase:'inspect current ledger wrong root',exit_code:1,error:"TypeError: Cannot read properties of undefined (reading 'P_AC_C_MEAL_BOX')",effect:'只读命令误用state.ledger，无写入',recovery:'读真实结构后改state.snapshot.ledger核未变子字段'},{phase:'read38 wrong guessed filename',exit_code:1,error:'ENOENT: 正文/0038-把衣服放到桌上-ac-v1.md',effect:'未读到正文、无页证据生成、不算实读',recovery:'glob定位真实0038-带进灯下-ac-a-v1.md后dr-pre48-old38-actual-p4成功'},{phase:'FastCtx read wrong prior log path',exit_code:null,error:'File does not exist: cli-logs/d19-assemble46-final/input.json',effect:'只读失败；不算产品调用或实读',recovery:'读真实cli.mjs/已存输入格式，使用正确assemble字段'}];auxiliaryFailures.push({phase:'save-completion first attempt',exit_code:1,error:'AssertionError: formal review.source_hashes undefined; actual record stores units/frozen_ref',effect:'交接写入前断言停止，未改作品/state',recovery:'读实际review结构，改核units当前SHA及frozen_body/frozen_report原字节，失败脚本另存'});write('dr-inputs/all-failures.json',{first_process_product_failures:firstFailures.map(x=>({label:x.label,product_exit_code:x.exit_code,outer_powershell_exit_code:1,state_unchanged:true,args:x.args})),first_process_auxiliary:cp.helper_failures,resumed_product_failures:[],resumed_auxiliary:auxiliaryFailures,note:'产品结果以result.json为准；首停文字将产品2简写为1，完成交接更正，旧文件不改。辅助错误不是产品缺陷。'});
const readEntries=fs.readdirSync(path.join(base,'read-pages')).filter(x=>x.startsWith('dr-')).sort().map(log=>{const x=get(path.join(base,'read-pages',log));return{log,file:x.file,sha256:x.sha256,page:x.page,pages:x.pages};});write('dr-inputs/all-read-coverage.json',{nature:'actual-page-output-in-this-resumed-process',entries:readEntries});
const files={};function walk(dir,rel=''){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const ref=(rel?rel+'/':'')+e.name;if(e.isDirectory()){if(ref==='.writer')continue;walk(path.join(dir,e.name),ref);}else if(e.isFile()){const a=info(ref);files[ref]={bytes:a.bytes,sha256:a.sha256};}}}walk(root);for(const folder of ['drafts','objects','journal','reviews']){const dir=path.join(root,'.writer',folder);for(const n of fs.readdirSync(dir)){const ref='.writer/'+folder+'/'+n;if(fs.statSync(path.join(root,ref)).isFile()){const a=info(ref);files[ref]={bytes:a.bytes,sha256:a.sha256};}}}
const result={ok:true,at:new Date().toISOString(),thread_id:process.env.CODEX_THREAD_ID,project:root,revision:state.revision,schema_version:state.schema_version,state_sha256:sha(stateBytes),registered_range:{from:1,to:48},generation:6,content_id:active.content_id,runtime_id:active.runtime_id,provenance:doctor.build.provenance,original_first_stop_files_matched:Object.keys(cp.files).length,old_units_1_46_deep_equal:true,original47_context:info(cp.chapter47.context.ref),original47_template:info(cp.chapter47.template.ref),original47_parts:byteProof,original47_prefix_preserved_once:true,restoration_source_hashes_matched_at_r211:true,current47_48:coverage.rows.filter(x=>x.unit>=47),current43_48_read_pages:49,current43_48:coverage.rows,formal_review:{ref:reviewResult.ref,...info(reviewResult.ref),coverage:[43,48],revision:215,issues:reviewResult.issue_ids,quality:reviewResult.quality},diagnostics:{status_exit:0,check_exit:0,doctor_exit:0,stale_units:[],changed_sources:[],impact_pending:[],active_or_pending_revision_transactions:[],doctor_errors:[],doctor_warnings:[],check_known_unregistered_warning_count:check.findings.length,rolling_review:check.rolling_review},known_unregistered_drafts:expectedDrafts,unknown_unregistered_drafts:[],public_commands_resumed:cliResults.length,public_failures_resumed:0,public_commands_all_d:firstCli.length+cliResults.length,public_failures_all_d:firstFailures.length,resumed_actual_page_calls:readEntries.length,no49:true,no_product_source_changes:true,protected_file_count:Object.keys(files).length,files};
write('checkpoint-d-complete.json',result);fs.writeFileSync(path.join(base,'checkpoint-d-complete-state.json'),stateBytes,{flag:'wx'});write('dr-inputs/final-verification.json',{...result,files:undefined});
const rows=coverage.rows.filter(x=>x.unit>=46);const handoff=`# AC D轮完成交接

本组已完成：46—48正式登记，48之后当前43—48六章完整连读并正式review，按要求止48。没有写49；没有提交、推送、发布、外部传输或向其他聊天发送消息。只操作AC独立副本及AC内证据，没有改旧封存目录、真实作品、产品源码或全局配置，没有子代理、额外会话、后台写稿。

## 实际状态与构建

作品：${root}

本线程实际ID ${result.thread_id} 与首停相同。恢复入口r211/schema6/已登记1—46，原state SHA ${cp.state_sha256}，与checkpoint-d-first-state逐字节相同；恢复先真实dr01-status/dr02-check/dr03-doctor，核无漂移/事务/未知稿后才续写。完成r215/schema6/已登记1—48，当前state SHA ${result.state_sha256}；原字节见checkpoint-d-complete-state.json，结构与保护文件见checkpoint-d-complete.json。

工具仍0.9.0 generation6，content_id ${active.content_id}，runtime_id ${active.runtime_id}；最终status/doctor与active-tool相符。来源7961decef067a63453e05923d2a7512a103ff795 dirty=true，内容指纹不是签名/发布证明。没有升级或修改工具。

dr22-status-final/dr23-check-final/dr24-doctor-final均0：stale_units/changed_sources/impact_pending空；无活跃修订会话或待恢复事务，旧会话全committed、旧事务全completed；doctor errors/warnings空。check为mechanical-only：25份已知未登记留稿（首停23＋本轮47-v1/48-v1），无未知或unsafe，不删除旧版。rolling_review valid22/stale31，31份旧报告均有当前覆盖，stale_without_current_coverage0、pending_windows空、unpublished_records空。这些只是机械/覆盖结论，不是文学或作者通过。

## 正文与登记链

|章|正式稿|正文汉字|字节|SHA256|
|---|---|---:|---:|---|
${rows.map(x=>'|'+x.unit+'|'+x.draft+'|'+x.body_han+'|'+x.bytes+'|'+x.sha256+'|').join('\n')}

汉字统计Unicode Script=Han，排除Markdown题行。46首程已登记r211，本次未改。47原七段合章v1全7页读后，修新03/07的金额块数/主语/水池及谓语，新v2再完整7页；原模板r211填真实差量，dr09初preview/dr10最终preview0，dr11-record47→r212。48从47实况新建滚动补充/plan48、实读采用后dr13同步workflow→r213，才dr14-context48/dr15写前template；九段合章v1全10页，修时间词/问话/消息先后/病句，v2全10页；dr18-preview48 0，dr19-record48→r214。两章均保存自检报告/draft_review与真实changes，未写后刷新模板。

48只新补充大纲/AC-D48-登记47后滚动细化.md与0048正式细纲，不动已消费A37—48骨架、原D窗口、V17/旧规则。V17“归还”按45自盒事实调整为真实余食/垃圾/使用后续，不造不存在的借碗。所有修改前稿/段和输入都在AC内保留。没有在登记后的主稿直接改字。

## 真实恢复字节证明

首停1675项保护文件在恢复入口全部逐字节/SHA匹配，完成时仍全部匹配；当前1—46 units与首停状态严格深相等。证明在dr-inputs/resume-verification.json及final-verification.json，不冒称人工读过每个散列。所有旧宏纲/已消费源、43—46当前正文及旧冻存对象未改。

47原context：${cp.chapter47.context.ref}，${result.original47_context.bytes}字节，SHA ${result.original47_context.sha256}。

47原写前template：${cp.chapter47.template.ref}，${result.original47_template.bytes}字节，SHA ${result.original47_template.sha256}；保留expected_revision211和原source_hashes，未重取模板。恢复时逐项源匹配，后来正式47/48登记自然推进state，不能把旧模板现在的state哈希改成新状态。

${byteProof.map(p=>'- '+p.ref+'：'+p.bytes+'字节，SHA '+p.sha256+'；与首停和dr-inputs/47-original-'+path.basename(p.ref)+'完全相同，在当前47只出现1次。').join('\n')}

最终47以原01、原02顺序开始，分隔符仍为两换行；没有重新写已存两段。dr-original47-01-p1、02-p1/p2先实际读原片段，再从03续写。完整47后才改workflow准备48，未使47原写前模板失效。整组trial仍draft_range/revise_range46—48、discuss/plan/draft/revise；task保持首程断点→同ID恢复→整组复核完整安排，长期stop写本组末章48及保护边界，没有把首程不写48变永久禁令。授权原话来自研究/AC作者任务.md，控制器分组不冒充真人新增情节选择。

## 实际读稿与正式review

本次先重新读COMMON.md、author-request.md、project.json、active-tool.json、交接-D首停.md；checkpoint-d-first完整JSON解析并逐项核1675文件，不以聊天记忆恢复。已读技能/必要references以当前包指纹未变为前提沿用；实际读当前文风、A骨架、D窗口、V17及48新补充/正式章纲。没有把冻结旧源/未来计划当当前事实。

恢复先原47两段3页及46末页；真实recall工装/门/柜后实读当前41p3—4、42p1—2/p6—7、36p3、38p4，48前又实读38p4；42不是全章，38也不是本次全章。首程曾完整43—45，本次依要求在全部登记后另重新顺序完整43八页、44十页、45七页、46七页、47七页、48十页，共49页。47/48各自初/最终版另全7/10页。当前恢复所有实际页输出${readEntries.length}次，见dr-inputs/all-read-coverage.json，窗口逐字拼接证据window-read-coverage.json；失败旧章路径不算实读。

窗口报告：审查/AC-D-当前43-48六章窗口知情复核.md。dr20真实review-template保留r214六章SHA，填30项逐章目标/阻力/选择/后果/关系变化及本章原文、3组跨章相似结构/差异/保留/可选建议；dr21正式review→r215，记录${reviewResult.ref}。审查类型model-self-review、quality=review-recorded-not-acceptance。没有新增确认必须修订的硬问题，故未创建空修订会话或为闭环改空格；可选否定解释密度/备餐步骤/休息收尾3项只保持建议，不冒充已修复。43—45没有范围外高置信必改发现，未偷改旧章。若日后确认问题，必须依现授权在正式独立revision区处理并回读重登下游。

## 回收链、剩余与下卷接口

T_AC_SHARED_MEAL：37发起、42问班/厨房许可、43付时间钱买料、44真做吃允许差异、45洗收并各家真实接食，有限resolved；46女实际投垃圾/纸、父明确尝原整块半并吃完、沈吃余饭及另一半、自盒洗沥，女两菜已45吃净；47各家再用一点/新豆腐与新饼蛋汤，48课/看书各有时段仍交换照片，不约下一次。不凭计划新增还碗。

T_X_COAT_DAILY仍partial：25靠桌顶/洗后看，36原纸三洗，38老师实衣/原纸实看并暂不拆，39返母；46实洗湿，47晨潮夜干/短试仍碰/原纸新行；48母真穿候船室，老师只实读到当晨，女夜才从母口述记当日靠桌仍碰、站取物没总想、胸袋顺手并读回确认。旧观察不涂改，不把没总想变没碰，不结长期舒适。原工装48夜母钩、未拆剪/本章未洗；原反馈纸夜归护纸桌内。

P_AC_PRACTICE_CLOTH/T_W_EVENING_CLASS：原36六七针/38新六针保留、47没添；48第五课19—20:40在空处新三拉皱退本次后两针重做，误穿一层退重，自己缓线/收结，小段放平仍一针距大，针固定归盒、布纸分收桌内，母实看/沈仅照片知标新段。保持partial，不学成/不判课程总期数。

T_D_ROOM_DOOR_LOOK本处41实48结、42旧钉入废钉筐，47只核自己旧本/原小票主人持，不重收；18抽屉不同。T_D_CABINET_PHOTOS34黑线/36等侧图、47/48无新图，继续pending，未预约上门或强令归来。

剩余：工装后续真实穿洗/是否调整；原纸48夜新行老师尚未读；练布剩空边；柜门侧图/本人归期；窄口枕套仍另袋未处置；48母本晚一点新余饭已盖好冷藏未再吃。父脚仍杖凳，父辈全史、问路真正终点、复航日期、课程总数、长期门/抽屉耐用未知。这些只是接口/未决，不是已发生未来情节，不写49。

## 全部失败与未覆盖

D首程公开27次（25成功2拒绝）；恢复公开24次全0。合计51次公开产品命令、49成功2拒绝，原输入/stdout/stderr/前后state/result保留cli-logs。首程d16目标已存在/d18草稿不在正文目录两次assemble，真实产品退出码均2、外层PowerShell报告1，前后state相同；首停交接把产品写1是口径错误，本处更正，不回写旧交接。首程辅助inline计数SyntaxError1及未提交输入格式草案也保持原证据。

本次辅助/读路径失败：一次inline统计正则过度转义SyntaxError1；一次准备assemble47断言正文9939不足10000退出1（尚未合章/登记，补具体动作后达标）；一次读取state.ledger误用根层TypeError1（改真实snapshot.ledger）；一次猜旧38文件名ENOENT1（glob找到真实文件后实读，失败不算页）；一次FastCtx读取不存在的旧assemble日志input.json（无产品调用，后读真实CLI/输入格式）；完成脚本初次把正式review记录误作含source_hashes的输入模板，断言退出1，交接写入前停止，读实际units/frozen_ref结构后修正并核冻结正文/报告字节，失败脚本另存。均无产品state或旧稿写入。详见dr-inputs/all-failures.json。产品复核/登记未被这些辅助错误跳过，未刷新哈希绕过。

模型确认的稿内硬问题均在47/48登记前修正并保存真实差量。窗口仍有可选风格风险，不宣布文学完全无重复。本轮未改产品源码，未运行产品源码测试；未做真人盲读/市场验证、实物缝纫或现实工作测试、全书逐章重读、外部发布。本组创作与模型复核、机械诊断已到指定终点；此交接保存后退出，不继续49。
`;
fs.writeFileSync(path.join(base,'交接-D完成.md'),handoff,{flag:'wx'});write('d-complete-verification.json',{ok:true,revision:215,state_sha256:result.state_sha256,thread_id:result.thread_id,registered_units:48,original_first_stop_files_matched:result.original_first_stop_files_matched,original47_prefix_preserved_once:true,chapter47_body_han:10054,chapter48_body_han:14062,window_pages:49,review_ref:reviewResult.ref,handoff_sha256:sha(fs.readFileSync(path.join(base,'交接-D完成.md'))),no49:true});console.log(JSON.stringify({ok:true,revision:215,state_sha256:result.state_sha256,first_stop_files_matched:result.original_first_stop_files_matched,old_units_1_46_preserved:true,original47_prefix_preserved_once:true,registered_units:48,body_counts:rows.map(x=>({unit:x.unit,han:x.body_han})),window_pages:49,formal_review:reviewResult.ref,public_commands_resumed:24,public_failures_resumed:0,known_unregistered_warnings:check.findings.length,protected_files:Object.keys(files).length,handoff:'交接-D完成.md'},null,2));
