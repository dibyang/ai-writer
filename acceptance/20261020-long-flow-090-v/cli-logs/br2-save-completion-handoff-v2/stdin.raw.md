import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const V=process.cwd(),W=path.join(V,'scenario/东岸末班船-扩展验证');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const raw=p=>fs.readFileSync(path.join(W,p));
const json=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const assert=(v,m)=>{if(!v)throw Error(m);};
const sb=raw('.writer/state.json'),s=JSON.parse(sb);
const baseFile='cli-logs/br2-start-trial-nine/before-state.json',base=json(baseFile);
const status=json('cli-logs/br2-close-status/stdout.raw.txt');
const check=json('cli-logs/br2-close-check/stdout.raw.txt');
const doctor=json('cli-logs/br2-final-doctor/stdout.raw.txt');
const issues=json('cli-logs/br2-final-issues/stdout.raw.txt');
const delivery=json('delivery-current.json');
assert(s.revision===45 && base.revision===40,'revisions');
assert(s.units.length===9 && !s.units.some(x=>x.unit>=10),'unit scope');
assert(status.governance.stage==='trial' && eq(status.governance.authorization.draft_range,{from:9,to:9}) && status.governance.authorization.revise_range===null,'governance');
const old=base.units.map(u=>{const n=s.units.find(x=>x.unit===u.unit);return {unit:u.unit,body_matches:sha(raw(u.draft))===u.sha256,registration_equal:eq(u,n),journal_matches:sha(raw(u.journal))===u.journal_sha256};});
assert(old.length===8 && old.every(x=>x.body_matches&&x.registration_equal&&x.journal_matches),'old registered data drift');
const sources=new Map();
for(const u of base.units)for(const [p,h] of Object.entries(u.source_hashes))if(p!=='.writer/state.json'){
  if(sources.has(p))assert(sources.get(p)===h,'historical source disagreement '+p);
  sources.set(p,h);
}
const sourceMismatches=[...sources].filter(([p,h])=>sha(raw(p))!==h).map(([p])=>p);
assert(sourceMismatches.length===0,'old consumed source drift');
const observationEqual=eq(base.snapshot.ledger.O_BOX_PAINT,s.snapshot.ledger.O_BOX_PAINT);
assert(observationEqual,'immutable observation drift');
const planningEqual=eq(base.governance.planning,s.governance.planning),decisionsEqual=eq(base.decisions,s.decisions);
assert(planningEqual&&decisionsEqual,'governance planning/decisions drift');
assert(status.changed_sources.length===0 && status.stale_units.length===0 && status.impact_pending.length===0,'pending changed sources');
assert(check.ok && check.rolling_review.pending_windows.length===0 && check.rolling_review.stale_without_current_coverage===0,'review not covered');
const issue=issues.issues.find(x=>x.id==='V_A_U5_TIME_METADATA');
assert(issue?.effective_status==='verified'&&!issue.context_changed,'A time issue');
assert(doctor.ok && doctor.errors.length===0 && doctor.build.mismatches.length===0,'doctor');
assert(doctor.build.observed_content_id===delivery.content_id && delivery.content_id==='ab14a65fc7677e8c76c03cbe8f7ec7c49203ad070ed0163e265cf5047500e626' && status.tool_control.generation===1,'identity');
const u9=s.units.find(x=>x.unit===9),body9=raw(u9.draft).toString('utf8');
const han9=(body9.replace(/^#.*(?:\r?\n|$)/gm,'').match(/\p{Script=Han}/gu)||[]).length;
assert(han9===5436 && sha(raw(u9.draft))===u9.sha256,'nine body');
assert(sha(raw(u9.draft_review.report))===u9.draft_review.report_sha256 && sha(raw(u9.draft_review.frozen_ref))===u9.draft_review.report_sha256,'nine report');
const reviewRefs=['.writer/reviews/f6a17eef-abd0-4e3a-8aef-b860dc02f055.json','.writer/reviews/643ffb74-cb7b-4b0f-bac8-948d83041a33.json','.writer/reviews/bb2f2786-6336-4470-9df0-55a0ee688709.json'];
const reviews=reviewRefs.map(ref=>{
 const r=JSON.parse(raw(ref));
 const ok=sha(raw(r.report))===r.report_sha256&&sha(raw(r.frozen_report))===r.report_sha256&&r.units.every(u=>sha(raw(u.draft))===u.sha256&&sha(raw(u.frozen_ref))===u.sha256);
 assert(ok,'review frozen bytes drift');
 return {ref,from:r.from,to:r.to,report:r.report,report_sha256:r.report_sha256,dependencies:r.dependencies,all_current_and_frozen_bytes_match:ok};
});
const firstStopHash=sha(fs.readFileSync('交接-B首停.md'));
assert(firstStopHash==='dfcf80b2fb6ba9472174671195b2549a5f3c7534dd8949daa8743e06672d4670','first stop handoff drift');
const noTenBody=!fs.readdirSync(path.join(W,'正文')).some(f=>/^0010(?:-|\.)/.test(f));
const noTenTemplate=!fs.readdirSync(path.join(W,'.writer/drafts')).some(f=>/(?:record|template)[^/]*[-_]10(?:[-_.]|$)/.test(f));
assert(noTenBody&&noTenTemplate&&!status.next.plan_exists,'ten unexpectedly started');
const proof={scope:'B恢复完成点的必要核对；非全目录索引/封存/全命令库存',revision:s.revision,state_sha256:sha(sb),baseline:{path:baseFile,revision:base.revision,sha256:sha(fs.readFileSync(baseFile))},stage:status.governance.stage,draft_range:status.governance.authorization.draft_range,revise_range:null,identity:{content_id:delivery.content_id,runtime_id:doctor.build.runtime_id,generation:1},old_1_to_8:old,old_consumed_sources_count:sources.size,old_consumed_source_mismatches:sourceMismatches,observation_entire_item_unchanged:observationEqual,planning_unchanged:planningEqual,decisions_unchanged:decisionsEqual,first_stop_handoff_sha256:firstStopHash,chapter9:{draft:u9.draft,sha256:u9.sha256,body_han:han9,draft_review:u9.draft_review,journal:u9.journal,journal_sha256:u9.journal_sha256},reviews,rolling_review:check.rolling_review,unregistered_drafts:check.draft_inventory.unregistered.map(x=>x.draft),time_issue_effective_status:issue.effective_status,check_ok:check.ok,doctor_ok:doctor.ok,no_10_body_or_template:noTenBody&&noTenTemplate,no_10_plan:!status.next.plan_exists,ok:true};
fs.writeFileSync('br2-completion-verification.json',JSON.stringify(proof,null,2)+'\n',{flag:'wx',encoding:'utf8'});
const logs={
 entry:['br2-status','br2-workflow','br2-revisions','br2-identify'],
 governance:['br2-start-trial-nine','br2-stop-after-nine'],
 write:['br2-plan-nine','br2-context-nine','br2-template-nine-before-draft','br2-assemble-nine','br2-assemble-nine-v2'],
 register:['br2-save-nine-report','br2-preview-nine','br2-record-nine'],
 reviews:['br2-review-seven-nine','br2-review-four-nine'],
 check:['br2-final-check','br2-close-check','br2-close-status','br2-final-issues','br2-final-doctor']
};
for(const label of Object.values(logs).flat()){
 const result=json(`cli-logs/${label}/result.json`);
 assert(result.exit_code===0,'logged nonzero '+label);
 const argv=json(`cli-logs/${label}/argv.raw.json`).argv;
 if(argv[0]?.endsWith('ai-writer.mjs'))assert(argv.includes('--project')&&argv[argv.indexOf('--project')+1]===W,'missing explicit project '+label);
}
const index={scope:'本次恢复关键证据入口，逐次双流与原始输入见所列cli-logs目录；完整库存由根负责',W,identity:proof.identity,state:{revision:s.revision,sha256:proof.state_sha256},author_evidence:'scenario/东岸末班船-扩展验证/研究/V-B恢复9实际授权.md',inputs:['br2-workflow-start.json','br2-plan-9-before.raw.json','br2-plan-9.json','.writer/drafts/br2-record-9-template.json','br2-assemble-9-v2.json','br2-record-9.json','br2-review-7-9.json','br2-review-4-9.json','br2-workflow-stop.json'],chapter9:proof.chapter9,reviews,verification:'br2-completion-verification.json',key_logs:logs,auxiliary_retry:{failed:'cli-logs/br2-save-completion-handoff',exit_code:1,cause:'辅助脚本误用state.workflow.planning，实际为state.governance.planning、state.decisions；失败时未写输出且state未变',retry:'cli-logs/br2-save-completion-handoff-v2'},clue_chains:[
 {id:'T_EARLY_BATCH',first:4,latest:8,status:'resolved-for-this-trial',payoff:'8约5:46实收8元交两包；破边两人吃净，三包失单；15:30离店15:58理发付款',knowledge:'沈禾亲历全程；老板见交货/离店未见理发；陈秀亲付亲取未展示转交；许/沈父/周未获结果'},
 {id:'T_SHELF_USE',first:5,latest:9,status:'partial',payoff:'5同意留位并实试摆；9配料、预下料、父女接受报价和停航第四日16:30未来约',knowledge:'三人5同场，周9亲购26元；父女9仅电话获告；11安装/最终摆碗仍未发生'},
 {id:'T_ROUTE_STEP',first:6,latest:9,status:'partial',payoff:'6实走东岸两口/图实际交妇人；9母图责任和钥匙实交老何、许走开',knowledge:'许爬阶、何阶脚等；二人走缓坡到桥头未过；同事只室内读图；妇人只见离室往药店；12实走后果未发生'}
 ]};
fs.writeFileSync('br2-evidence-index.json',JSON.stringify(index,null,2)+'\n',{flag:'wx',encoding:'utf8'});
const handoff=`# B恢复完成交接：停在9\n\nV=${V.replaceAll('\\','/')}；W=V/scenario/东岸末班船-扩展验证。本实际B会话按prompt-b-resume-v2.md及prompt-b-resume.md恢复，同一会话未派代理。只写V，未动U/T/产品/既有作品，未Git提交推送；未替换源包、未做目录索引或全封存。完整库存和独立验收由根负责。\n\n当前revision45，state SHA256=${proof.state_sha256}；stage=trial，draft_range=9—9，revise_range=null。task明确9完成停下、10待C新提示，next_unit=10不是授权。planning/decisions保持首停原样（含远期未选候选的历史表述，不反向改写人类决定）；本章已发生的配料和价格以正文/当前账本为准。\n\n当前包身份delivery-current与随包identify/doctor一致：ab14a65fc7677e8c76c03cbe8f7ec7c49203ad070ed0163e265cf5047500e626 / generation1；runtime=${doctor.build.runtime_id}。旧ff6或旧追踪阻断不是当前状态；A日期意见effective_status仍verified。\n\n## 本次成稿与登记\n\n第9《留给明天的活》当前正文/0009-留给明天的活-v2.md，共5436正文汉字，SHA256=${u9.sha256}。至少2段要求实际用3段完成，最终01-v2/02-v2/03-v3由CLI assemble成整稿；初合章v1及所有早期片段保留。先40→41正式收窄范围，再取真实context/写前模板；原9未消费细纲调整有旧字节副本，不刷新已消费来源。完整稿实读修正，审查报告与draft_review实际双SHA绑定，preview成功才record41→42。\n\n逐章报告：W/审查/V-B恢复-0009完整章自检.md，SHA256=${u9.draft_review.report_sha256}。当前7—9又全文顺读并正式review42→43，报告W/审查/V-B恢复-当前0007-0009完整连读.md，ref=${reviews[1].ref}，报告SHA256=${reviews[1].report_sha256}。\n\n治理停点更新43→44后check虽为0，仍列4—9滚动窗口欠覆盖。本会话重新实际全文顺读4→5→6→7→8→9及当前人物/时间线/15账本，保存六章功能比较并正式review44→45：W/审查/V-B恢复-当前0004-0009六章连读.md，ref=${reviews[2].ref}，报告SHA256=${reviews[2].report_sha256}。不是7—9报告代替完整窗口。此前首停的当前1—6完整连读报告/ref均保留。\n\n最终check/doctor实际码均0；rolling_review.pending_windows=[]，stale_without_current_coverage=0；status.stale_units/changed_sources/impact_pending均空。5个UNREGISTERED_DRAFT是保留的1/2初稿、6-v1、8-v1、9初合章v1，不删除不混入导出。1—8登记对象/正文/各journal及${sources.size}项旧消费来源核对未漂移，O_BOX_PAINT整条未改，首停交接原字节保留。\n\n## 三条线索：首次、最近、收益与知情\n\n- 早取T_EARLY_BATCH：首次4，5告父，最近有效正文8。7布褶损两块、完整四块保留；8约5:46陈秀实付5+1+1+1共8元入店钱盒、亲接两包离开，破边沈禾/老板吃净，另三包客走。老板实接热笼、沈禾15:30离店/15:58理发已付。只兑现本次，次日先不接早取、老板进货尚计划；同事实际收到/吃到未知。沈禾亲历，老板不知理发完成，陈秀不知工时安排，许蓉/沈父/周岸未获8结果。\n- 柜位T_SHELF_USE：首次5实量/试摆、父同意留女儿盒位；最近9，仍partial。9周自付26买16合页+8木料+2螺丝，预下留余量，父女电话接受材料26+工50合76、做妥再付及停航第四日16:30。周亲购；父女仅电话/文字获告。未装门/层板、未最终摆碗、未收76。11须真劳动试关门/摆碗及使用后果，不以电话约定代替。\n- 路线T_ROUTE_STEP：首次6，最近9，仍partial。6许爬药店阶、何阶脚等，两人走粮油侧缓坡到东岸桥头未过桥；代班同事只室内读母图，妇人只见拿图离室朝药店。9许实交母图簿/值班钥匙，何接窗口答扫地，许实际走到药店。只是当班接手，12还需具体出行后果；不能补妇人已到坡/过桥或旧版已全收。\n\n## C恢复时的日程、物件与钱\n\n1—3停航前夜；4开头接该夜入铺，后是首日，5首日晚/6首日下午并行；7—9第二日，9开场14点与8下午并行。9“后天”明确第四日16:30。月末35元支付与11回装的叙述日序需C先协调，可像5/6一样明确并行，不能按章序等同日期、把未来约当已做；月份/复航日期未选。10/11/12均未写，本次未取10模板或立10细纲。\n\n周岸：9末锁铺在隔两家面摊实际坐吃；自用包留梁家铺门内凳旁，新合页/螺丝纸袋在包内、木料扎包外，旧合页一片裹原纸单独侧袋，票/便笺已收妥。旧样5获准带走，9实配样但未还，11应交代返还。原短螺丝仍沈家柜旁小抽屉酱碟。电饭煲9实际取回在工作台未拆未修，东街门把手明早仍待回装。新抽屉客因周不应今晚而抱走另找人，没有默认接单。\n\n沈禾/沈父：9晚在家真实通话，饭盒本人称洗好在家；周只获告。父伤脚未愈，未来先挪水杯/父女一起挪桌留盒均未执行，别补父独搬。父女同意总76做妥付，当前未付。沈禾8理发本人手机付款，与原退款分开。\n\n许蓉：第二日16—18:30当日前段结束，交班后已走到药店，未描写到家或吃面；女儿获她“到药店了/开火吧”回字，snapshot女儿条保留6历史范围并非覆盖9所有消息，本轮报告列出正文新增。6约次晨洗盒/两勺未写执行，不能自动兑现。坏检修灯仍物主自己带走，未交周。两借椅9她亲问仍在用，老何记收工问，未归还。\n\n老何：接后段，值班钥匙挂窗后钩，母图仍夹候船室值班簿、两补图仍窗台茶叶盒、未补旧图封抽屉；许已交他母图/当班责任，未有新发图或补图。许/何都未获8早取/剪发和沈家新价消息。\n\n原箱4已合扣放梁家铺架下，单联和原空袋在借具本；5周口述告父女，梁伯仅远程见照未亲接。白漆观察整条不变。原80元3已退且沈父收钱盒，后无新移动；西门工料35元仍未付（10承诺待实付）；新26元周已垫、76元未收，两者不抵35或80。父辈旧事继续留白。\n\n## 证据入口与停点\n\nV/br2-evidence-index.json为本次关键入口，V/br2-completion-verification.json为必要核对；每个所列cli-logs目录保留stdout.raw.txt、stderr.raw.txt、argv.raw.json、result.json、前后state及实际输入副本。普通产品调用均用v-writer，实际argv显式--project W；辅助生成脚本由v-log冻结stdin。本次产品调用未发生非0码；一次check为0但欠窗口的中间证据同样保留。未建立独立修订区。\n\n未发现需本轮报根处理的新增高置信旧章问题。图纸说明压缩、器具细节与节奏均留可选，不升必改。本轮全部报告为知情模型自审，不能称真人盲读、市场、作者定稿或正式产品验收。到9正常退出，10等待C新提示及根独立核验。\n`;
fs.writeFileSync('交接-B完成.md',handoff,{flag:'wx',encoding:'utf8'});
console.log(JSON.stringify({ok:true,revision:s.revision,state_sha256:sha(sb),old_units_unchanged:old.length,old_consumed_sources_unchanged:sources.size,body9_han:han9,pending_windows:check.rolling_review.pending_windows,proof:'br2-completion-verification.json',index:'br2-evidence-index.json',handoff:'交接-B完成.md',handoff_sha256:sha(Buffer.from(handoff))},null,2));
