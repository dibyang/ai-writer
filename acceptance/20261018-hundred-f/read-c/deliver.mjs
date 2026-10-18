import fs from 'node:fs';
import path from 'node:path';
import {session,sha,readJSON} from '../session-support.mjs';
const s=session('read-c'),r=readJSON(path.join(s.stage,'readings.json')),v=readJSON(path.join(s.stage,'seal-verification.json')),events=fs.readFileSync(path.join(s.stage,'reading-events.snapshot.jsonl'),'utf8').trim().split('\n').map(JSON.parse),st=s.state();
s.write('REPORT.md',fs.readFileSync(path.join(s.stage,'REPORT-body.md')));
const summary=`# F轮阶段C交接：完整实读46—75，仅审查

唯一作品：${s.project}。本阶段只写read-c和commands/f-c-*，未改work、产品、原来源、真实作品或A—E，未写101；未启动其他代理/会话、未联网/提交/推送/发布。

当前schema6 / revision${v.revision} / generation${v.generation} / 0.7.1，build=${v.build_id}，runtime=${v.runtime_id}；state SHA256=${v.state_sha256}。与B交接一致，无活动修订/令牌/待恢复事务。现治理仍discuss/plan、无正文范围；next101不是授权。未update/enable，未登记新review。

本进程按46→75完整读30章：46—50重读、51—75新增。逐章FastCtx均Complete，模型观察全行展示2,384行，74,954汉字含标题，未见长行截断或续页缺项。原始30次回包、事件快照与各SHA版本已存；readings.json有实际目标/选择/后果、关系知情、物件、未知与引句。主任务须以本进程events用既有reading-audit.mjs独立逐行核验；本进程没有运行或抢写reading-audit/read-c.json。累计F轮分进程覆盖1—75，本进程不称全读百章。断点在75章78行Complete；76—100未读。

## 角色知情与物件（截至75章，不用百章末状态回填）

- 48旧缺名原两页在沈家宽夹收齐、旧细夹留袋角，字未补；53邱才听滑页并索回，54原袋/原两页/宽细两夹实交邱透明盒。60何电话仅知原纸归邱，72才知滑页/两夹，不获原页目击/取看。27当面改单页无本阶段新交接；35使用两页、38四页/试样仍沈家各袋停用。罗两页+沈旧自页三页家中封袋，只承此前指定预看、不准公开；37拟补时间转折本范围未见实改。何72自带两张湿试样自收带离，不是邱稿。
- 原箱含布牌宋里间，原带原盒另宋柜格，赵通知/检查簿等盒及原蓝绳铜钥登记袋新库；灯原片围挡内原位不拆不通电。均无本阶段领取。沈带出城的是电脑/工作移动盘/短线，无纸质旧页/原物。母原盘家抽屉另一格；58停用长线前格袋字朝上，不因短线两回顺利定根因或担保现场。
- 阅览间常用钥46何→陈小袋，47锁11:04后11:16交严标套内袋，48归何原圈；备用钥严另串。沈无钥、陈不常驻。三轮公众9—11/付费准备收尾8:45—11:15在52/55/56真完成，三次各60到账合180。34日起实贴暂停；钥仍何不等开门。严33日停送报电话到63才由本人回述，沈未巡门。维修90在50返严，原据姚/照片严；何旧款56收240，仍两段未清（63/72同笔），新钱不抵。
- 新课程三日2700：60接后收1350；62/63/64每日现场当日试声、交盘另一机试开，64尾1350实收；交通128另返，预检80仍成本。陆场地360在61由梁先还，64退240陆→梁/原票取消确认→梁，取消费120项目承担；旧轮椅押金余项仍另留。51小样100已另收。66葛勘看180实做实收，新勘看页葛/沈获准照片；68取消声音码且实告制作人，未录新声/未供旧稿。核听480在68收240、69交意见、72收尾240；2700+180+480的3360只是这三项，不是所有收入或净余钱。
- 69完整看听当前18分钟初版，视觉等待须由温共享原画面/陆报原号，沈声音暂备不足以定帧；试两处新样不等整条改版通过。程第三遍等待选择有62→64→69回查。客户底声只当日当房，不能解释旧余带。T_AUDIO_REMAINDER（男声钟/剪者目录/同日/2013等）未知，T_PRIVATE有意开放，不强收due。
- 路：48邹回述42后续，沈周只看当日晴砖；54斜撑收回后晴天双筐真过；71清纸/扫泥后雨中双筐真过后轮仍晃，旧纸来历不明。73认识乔/约本人邹；75真实板车来，停卸收尾板、收架/搬非空箱后9:30前真过，邹自拨乔号。乔接司机/摆位、范看沟收口，仅约46小件/48板两车试行，未执行未证长期，换班/雨季继续查。两砖缺口方向/白罩未改，不能进灯下；老人靠背需求未被低凳解决。
- 关系：59周家鱼饭→64盒实还周；62漏听周未买鞋造成不快，63告知/65共同试两脚自付180有修复。70共做饭/约44谈，74明确从现在起一个月住镇，出城回来的住处仍此，不是永久/同居；各自钥。47日球场18:30、19:30后饭、21前各归，雨16前告改街口仍未发生。周本章只获外路概述，无新史料或逐项账。

## 审查、候选与后续

没有确认新增情节/空间/物证/知情连续性硬问题。F-B-L48-01“同两块”轻微搭配卡顿本次在48:43重现，54:37/66:3/71:13另留F-C-L54-01/F-C-L66-01/F-C-L71-01并关联同组；句法与模拟朗读改口均指同一处顿读，可最小落明指示，不改砖事实。是同类四处，不是三种跨卷问题，未采纳未修。F-C-S01袋位/证明限度旁白（53:87/69:69/72:73）仅偏好候选；各次实际新行为/知情必须保留。B的44代词/A13/14仅继承待核，未本轮实读升级。至少三处跨卷旧章选点待百章读完统筹；若最终改48，仍走保护流程和最早影响章至届时末章实读重登，不凭本报告跳过。

稳定ID与≤75正文锚索引见stable-id-index.json。可核链包括旧页滑落/归还/分人告知，三轮资金/退出，新场地退款/票据，长线停用，新录/等待回查，葛勘看撤码/椅，雨路清堵/真实转弯与试两车，鱼盒/漏听/鞋/下月选择；所有已做与未做分开。没有新增author_truth或扩阴谋。

下一实际进程仅从文件恢复，完整71→100（71—75重读，76—100新增25）；先读本REPORT/readings/handoff/主任务后补逐行审计，fresh唯一f-d-*核status/workflow/discussion/identify/check。不要重复update/enable、改旧章、写101、启动其他代理或会话。核两车试行/维护换人/靠背、球场雨备约、何旧两段、纸版本与受话人/公开私用、余带未知。先前计划不能冒充后续已发生。

## 完整性与失败

seal-verification.json：work2,002文件逐项无改/增/失，100正文/100units/snapshot/state不变，源1,356文件/主冻结构建61项/根定制40项不变，git diff=0。最终check无findings，unregistered/stale_units/changed_sources/impact_pending空；doctor无错警。继承valid51/stale62仍保留，literary_quality=unreviewed。9次产品调用均capture，command-index-final.json可核。未登记新review；若后来要登记，按当时revision/实际范围/唯一operation_id，不刷新旧输入或虚构chapter_functions。

本阶段失败/偏差全留failures.json：可选误查不存在read-a目录；先读现代根技能后补读副本旧定制的恢复顺序；66草记混列章名/残留编辑提示、72草记记录口吻在最终readings纠正，原notes与修正说明保留。产品CLI无失败，无已确认产品缺陷或需报最小重现；没有绕保护。正文及根定制没有因纠正记录而改变。原始事件正在由外层进程持续记录，快照包含全部30次正文展示；完整行审计仍由主任务运行。报告存在不是文学通过。

## 实读文件、展示范围和实际SHA256

|章|work内路径|展示行（模型观察）|SHA256|
|---|---|---|---|
`;
const table=r.readings.map(n=>`|${n.unit}|${n.path}|1—${n.shown_end}|${n.sha256}|`).join('\n')+'\n';
s.write('handoff.md',summary+table);
const candidates=[{id:'F-B-L48-01',unit:48,line:43,status:'candidate-not-adopted',group:'same-minor-wording',quote:'天还亮，同两块暗红砖表面干着'},{id:'F-C-L54-01',unit:54,line:37,related:'F-B-L48-01',status:'candidate-not-adopted',quote:'车从同两块砖旁过，前轮没进围挡。'},{id:'F-C-L66-01',unit:66,line:3,related:'F-B-L48-01',status:'candidate-not-adopted',quote:'经过旧站外路，同两块暗红砖表面干着'},{id:'F-C-L71-01',unit:71,line:13,related:'F-B-L48-01',status:'candidate-not-adopted',quote:'同两块暗红砖并排'}];
const started=fs.statSync(path.join(s.stage,'events.jsonl')).birthtime.toISOString(),finished=new Date().toISOString();
const handoff={phase:'F-C-read-46-75',status:'model-reading-and-report-complete-line-audit-pending-main-task',work:s.project,process_thread_id:events.find(e=>e.type==='thread.started')?.thread_id,phase_started_at:started,completed_at:finished,elapsed_ms:Date.parse(finished)-Date.parse(started),elapsed_basis:'events file creation to handoff artifact generation; includes recovery, complete reading, notes and verification',schema:st.schema_version,revision:v.revision,generation:v.generation,tool_version:'0.7.1',build_id:v.build_id,runtime_id:v.runtime_id,state_sha256:v.state_sha256,active_revision:null,revision_token:null,tool_transaction_pending:false,author_allowed_actions:st.governance.authorization.allowed_actions,read_units:r.readings.map(n=>({unit:n.unit,path:n.path,sha256:n.sha256,coverage:n.coverage,version:n.version,tool_evidence:n.tool_evidence})),reading_totals:r.totals,breakpoint:{unit:75,line:78,tool_complete:true,next_new_unit:76},cumulative_f_unique_coverage:{from:1,to:75,basis:'A/B inherited completed evidence plus this process46—75, separate informed processes, not one hundred-chapter read'},unread_units:{from:76,to:100},line_audit:{status:'pending-main-task',tool:'../reading-audit.mjs',not_executed_here:true,expected_new_result:'../reading-audit/read-c.json',source_events:'events.jsonl',preserved_events:'reading-events.snapshot.jsonl'},knowledge_and_custody:'handoff.md / REPORT.md / readings.json, strictly as of75',stable_ids:'stable-id-index.json',revision_candidates:candidates,optional_style:[{id:'F-C-S01',units:[53,69,72],status:'suggestion-not-adopted',scope:'repeated stable custody and proof-limit commentary only'}],unknown:['余带/男声钟/剪者目录/2013全链；罗私因有意开放','何旧两段报酬','37旧自页时间转折拟补未在46—75见实改','46/48日两车试行、换人/雨期维护、老人靠背','47日球场/雨备约','永久住处/同居及持续收入','旧轮椅押金余项'],next_phase:{ordered_complete_read:{from:71,to:100},boundary_reread:{from:71,to:75},new_coverage:{from:76,to:100},no_old_chapter_edit:true,no_101:true,no_new_agent_or_session:true,capture_labels:'unique f-d-*',first:'Recover files, then actual fresh status/workflow/discussion/identify/check; verify current revision/generation/build, do not reuse379 blindly for a mutation.'},registered_new_review:false,review_registration_reason:'Optional; keep wholework bytes unchanged. Future registration needs current revision, actual range, unique operation_id; no recycled stale input.',check:v.check,verification:'seal-verification.json',commands:'command-index-final.json',failures:'failures.json',products_modified:false,body_modified:false,new_chapter_written:false,committed:false,pushed:false,network_used:false,subagents_started:false,nature:'informed model sequential reading; not blind/human/whole-book literary acceptance',artifacts:Object.fromEntries(['REPORT.md','readings.json','handoff.md','read-evidence-index.json','stable-id-index.json','seal-verification.json','failures.json'].map(f=>[f,{sha256:sha(fs.readFileSync(path.join(s.stage,f)))}]))};
s.write('handoff.json',handoff);
s.write('artifact-hashes.json',Object.fromEntries(['handoff.json',...Object.keys(handoff.artifacts)].map(f=>[f,sha(fs.readFileSync(path.join(s.stage,f)))])));
console.log(JSON.stringify({started,finished,elapsed_minutes:handoff.elapsed_ms/60000,phase:handoff.status,revision:v.revision,generation:v.generation,read_units:r.readings.length,displayed_lines:r.totals.displayed_lines_as_observed,all_work_bytes_unchanged:v.all_work_bytes_unchanged,source_unchanged:v.source_unchanged,root_customizations_unchanged:v.root_customizations_unchanged,product_failures:v.failed_product_commands,check:{ok:v.check.ok,units:v.check.units,literary_quality:v.check.literary_quality,rolling_review:v.check.rolling_review},doctor:{ok:v.doctor.ok,errors:v.doctor.errors,warnings:v.doctor.warnings}},null,2));
