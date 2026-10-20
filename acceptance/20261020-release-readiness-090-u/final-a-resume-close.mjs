import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import assert from 'node:assert/strict';import {spawnSync} from 'node:child_process';
const U='D:/work/other/ai-writer/acceptance/20261020-release-readiness-090-u',W=U+'/scenario-final/东岸末班船',P='D:/work/other/ai-writer/.tmp/U 最终交付验收包解压/ai-writer-0.9.0';
const sha=b=>crypto.createHash('sha256').update(b).digest('hex'),read=f=>JSON.parse(fs.readFileSync(f,'utf8')),hash=f=>sha(fs.readFileSync(f)),put=(f,v)=>fs.writeFileSync(f,JSON.stringify(v,null,2)+'\n',{flag:'wx'});
const stateSha=hash(W+'/.writer/state.json'),status=read(U+'/final-commands/final-a-73-status-finish/stdout.raw.txt'),check=read(U+'/final-commands/final-a-74-check-finish/stdout.raw.txt');
assert.equal(status.revision,6);assert.equal(status.draft_inventory.registered_count,2);assert.equal(status.next_unit,3);assert.equal(check.ok,true);assert.equal(check.rolling_review.valid,1);assert.equal(check.rolling_review.stale,0);assert.equal(status.governance.stage,'trial');assert.deepEqual(status.governance.authorization.draft_range,{from:1,to:3});assert.equal(status.revisions.sessions.length,0);assert.equal(status.revisions.transactions.length,0);
const zip=read(U+'/zip-delivery-verification.json'),id=read(U+'/final-commands/final-a-32-identify-resume/stdout.raw.txt');assert.equal(zip.content_id,id.observed_content_id);assert.equal(zip.content_id,'ff6cde0f1be3459f7d8a4249e3dd8ee3eec39d468df48f9c2f11308e5bd6641b');assert.equal(path.resolve(zip.extracted),path.resolve(P));
for(const root of [P,W+'/.writer/tool']){const m=read(root+'/build-manifest.json');assert.equal(m.build_id,zip.content_id);for(const f of m.files){const b=fs.readFileSync(path.join(root,f.group==='skills'?'.agents/skills':'',f.file));assert.equal(sha(b),f.sha256);assert.equal(b.length,f.bytes);}}
let checkedSourceBindings=0;for(const base of ['final-a-before','final-a-before-2']){for(const s of read(U+'/'+base+'/manifest.json').sources){assert.equal(hash(s.copy),s.sha256);if(s.ref!=='.writer/state.json'){assert.equal(hash(W+'/'+s.ref),s.sha256);checkedSourceBindings++;}}}
const oldStop=read(U+'/final-commands/final-a-25-close/stdout.raw.txt');assert.equal(hash(U+'/交接-最终A首停.md'),oldStop.handoff_sha256);
const oldParts=read(U+'/final-a-parts-verified/manifest.json').parts;for(const p of oldParts)assert.equal(hash(W+'/'+p.ref),p.sha256);
const observation=read(U+'/final-commands/final-a-77-observation-finish/stdout.raw.txt').matches[0].entry,firstO=read(W+'/.writer/drafts/final-a-content-1.json').changes.ledger.O_BOX_PAINT;for(const k of ['type','statement','author_truth'])assert.equal(observation[k],firstO[k]);
const preview=read(U+'/final-commands/final-a-47-preview-missing-report/stdout.raw.txt'),err=read(U+'/final-commands/final-a-49-record-missing-report/stderr.raw.txt');assert.equal(read(U+'/final-commands/final-a-47-preview-missing-report/result.json').exit_code,1);assert.equal(read(U+'/final-commands/final-a-49-record-missing-report/result.json').exit_code,2);assert.ok(preview.findings.some(f=>f.code==='DRAFT_REVIEW_INVALID'));assert.equal(err.code,'DRAFT_REVIEW_INVALID');assert.deepEqual(read(U+'/final-a-guard-before.json'),read(U+'/final-a-guard-after-preview.json'));assert.deepEqual(read(U+'/final-a-guard-before.json'),read(U+'/final-a-guard-after-record.json'));assert.equal(fs.existsSync(W+'/审查/final-a-controlled-missing-report-do-not-create.md'),false);
const chapters=[1,2].map(n=>{const r=read(W+'/.writer/drafts/final-a-record-'+n+'-valid.json'),v=read(U+'/final-a-assembly-'+n+'-v2-verification.json');assert.equal(hash(W+'/'+r.draft),r.draft_review.draft_sha256);assert.equal(hash(W+'/'+r.draft_review.report),r.draft_review.report_sha256);assert.equal(hash(W+'/'+r.draft),v.sha256);for(const p of v.parts)assert.equal(hash(W+'/'+p.path),p.sha256);return {unit:n,draft:r.draft,sha256:v.sha256,bytes:v.bytes,body_han:v.body_han,parts:v.parts,draft_review:r.draft_review,expected_revision:r.expected_revision};});
const reviewResult=read(U+'/final-commands/final-a-72-review-1-2/stdout.raw.txt'),review=read(W+'/'+reviewResult.ref);assert.equal(hash(W+'/'+review.report),review.report_sha256);assert.deepEqual(review.units.map(u=>u.sha256),chapters.map(c=>c.sha256));
assert.equal(fs.existsSync(W+'/分段/0003'),false);assert.equal(fs.readdirSync(W+'/正文').filter(f=>f.startsWith('0003')).length,0);
const logs=[];for(const name of fs.readdirSync(U+'/final-commands').sort()){const match=/^final-a-(\d+)/.exec(name);if(!match||Number(match[1])<30||Number(match[1])>77)continue;const d=U+'/final-commands/'+name,r=read(d+'/result.json');assert.ok(fs.existsSync(d+'/stdout.raw.txt'));assert.ok(fs.existsSync(d+'/stderr.raw.txt'));for(const input of r.inputs)assert.equal(hash(d+'/input.raw.json'),input.sha256);logs.push({label:name,exit_code:r.exit_code,entry:r.entry,inputs:r.inputs,before_state_sha256:r.before_state_sha256,after_state_sha256:r.after_state_sha256});}
const failures=logs.filter(l=>l.exit_code!==0);assert.deepEqual(failures.map(f=>f.label).sort(),['final-a-47-preview-missing-report','final-a-49-record-missing-report']);
const git=spawnSync('git',['status','--short'],{cwd:'D:/work/other/ai-writer',windowsHide:true});assert.equal(git.status,0);const gitResult={exit_code:git.status,stdout:git.stdout.toString('utf8'),stderr:git.stderr.toString('utf8')};assert.equal(gitResult.stdout,read(U+'/final-a-repository-after.json').stdout);put(U+'/final-a-resume-repository-after.json',gitResult);
const refs=['.writer/drafts/final-context-1.json','.writer/drafts/final-record-1-before.json','.writer/drafts/final-a-assemble-1-v2.json','.writer/drafts/final-a-record-1-valid.json','.writer/drafts/final-a-context-2.json','.writer/drafts/final-a-record-2-before.json','.writer/drafts/final-a-assemble-2-v2.json','.writer/drafts/final-a-record-2-valid.json','.writer/drafts/final-a-record-1-missing-report.json','.writer/drafts/final-a-review-1-2-input.json','.writer/drafts/final-a-workflow-resume-finish.json'];const inputs=refs.map(ref=>({ref,sha256:hash(W+'/'+ref)}));
put(U+'/final-a-resume-evidence-index.json',{ok:true,created_at:new Date().toISOString(),W,P,content_id:zip.content_id,runtime_id:id.runtime_id,revision:6,state_sha256:stateSha,registered_units:[1,2],next_unit:3,chapters,inputs,review:{ref:reviewResult.ref,...review},unchanged_non_state_source_bindings:checkedSourceBindings,original_stop_handoff_unchanged:true,original_two_parts_unchanged:true,observation,guard:{preview_exit:1,record_exit:2,code:'DRAFT_REVIEW_INVALID',state_journal_objects_and_whole_writer_unchanged:true},check,logs_before_closing_call:logs,expected_failures:failures,unexpected_cli_failures:[],inspection_warning:{file:'分段/0002/v1/01.md',requested_offset:57,actual_lines:54,resolution:'Full lines 1-54 read before continuing; no state mutation'},native_session_id:null,not_done:['chapter 3','cross-volume observation payoff','protected retrospective revision','fresh-session full three-chapter review','discuss-only pause and chapter-4 rejection','draft export']});
const chapterRows=chapters.map(c=>'| '+c.unit+' | '+c.draft+' | '+c.sha256+' | '+c.body_han+' |').join('\n'),partRows=chapters.flatMap(c=>c.parts.map(p=>'| '+p.path+' | '+p.sha256+' |')).join('\n'),inputRows=inputs.map(i=>'| '+i.ref+' | '+i.sha256+' |').join('\n');
const text=`# 交接：最终A恢复完成（仅第1—2章）

本次按用户指明的同一个原生Codex对话，从首停实际文件恢复，完成第1—2章及当前1—2全文连读；不是新鲜会话、真人盲读或正式验收。原生会话ID仍未知，未编造。当前进程正常结束，不开始第3章。旧首停交接保持原字节，作为此前未完成片段阶段的历史，后续正文恢复以本交接和正式登记v2为准。

## 工作区、工具与当前范围

W=${W}

U=${U}

P=${P}

实际产品入口只用 W/.writer/tool/bin/ai-writer.mjs。tool_version=0.9.0，content_id=${zip.content_id}，runtime_id=${id.runtime_id}；与U/zip-delivery-verification.json相同，结束时P和W随附清单文件再次逐项核对一致。没有调用源码lib、旧候选或初测a-run.mjs。

当前schema6、revision6、stage=trial，allowed_actions=discuss/plan/draft，draft_range=1—3，revise_range=null；已登记1—2，next_unit=3，活跃修订和事务均无。不是暂停态。本次在两章登记之后才按真实恢复任务更新workflow：revision3用于第1章原模板；record1升4；record2升5；更新任务升6；普通review不推进revision。没有在第1章写后刷新原模板/来源求通过。

当前state SHA256=${stateSha}。初始授权原文仍在 U/final-prompt.md 和 W/研究/最终测试原始prompt.md，SHA256=13b241bd13c94250186fa7bce194c13262acac110e581113759ebb6abd837a16；本次恢复原文在 U/final-a-resume-prompt.md 和 W/研究/最终测试恢复prompt.md，SHA256=d25dfcdc50e04e189b4746b8360eaa5a02f2c1f2d7367c9855a2dadc37ddb3f9。正式workflow以真实quote、locator、本地来源及SHA登记，没有伪造人类消息ID。人物、普通报价等仍为获授权代理的创作选择，不冒充人类逐项指定。

## 当前登记稿与片段

| 章 | 正文（相对W） | SHA256 | 正文汉字 |
| --- | --- | --- | ---: |
${chapterRows}

两章合计8737正文汉字，去标题后按Unicode Script=Han计，不含标点数字英语。第1章正文18640字节，第2章12457字节。每次合章都实际调用CLI assemble；当前两份v2与各自有序片段及分隔符逐字节相等，不是辅助脚本写出的合章。

| 当前片段（相对W） | SHA256 |
| --- | --- |
${partRows}

原第1章v1/01.md和02.md仍是首停的d66ee53d6e943f95e6630ad7fbc07bb02febd54f3c3e5e43069b29ca0cd33c49、8993d508140ce38223d434274ff60617cef368bfef48a2adfa1a67939015f303；当前v2的前两段与之相等。原片段没有改写。其余v1、初次合章也保留，不作为当前恢复权威。

check退出0（mechanical-only），stale_units/changed_sources/impact_pending为空，有效连读覆盖1份、过期0份。两项UNREGISTERED_DRAFT警告是本轮保留的历史初次合章：正文/0001-灯下的箱子.md（7deef77f0cc7cacc1dae632dfbba12b5ef45f66a714d45d4ef31acea5ef872e8）与正文/0002-多跑的一趟.md（a4ff0bbdc4d7d7982025e5576f1fee0df9ec405c6ecbd72435817b47296d3c0e）。不自动重登、删除或合并它们，后续导出须核它们确被排除。

## 写前模板、实际输入与报告

以下均相对W；原模板作为已消费历史保留，不能重新拿来重复登记。第3章恢复时另取当前revision下的新context和模板，不能只改旧SHA。完整写前来源原字节分别在 U/final-a-before/sources/ 和 U/final-a-before-2/sources/，对应manifest。结束时除权威state按正常操作推进外，${checkedSourceBindings}个非state来源绑定仍与冻结副本一致。

| 输入 | SHA256 |
| --- | --- |
${inputRows}

record1/2都包含draft_review，分别绑定：

- 审查/final-a-0001-完整章自检.md，SHA256=${chapters[0].draft_review.report_sha256}；实际完整读初稿和当前v2的1—281行，逐项回对goal/change/六项beats/forbidden及人物物件。
- 审查/final-a-0002-完整章自检.md，SHA256=${chapters[1].draft_review.report_sha256}；完整读初稿和当前v2的1—164行，逐项回对goal/change/五项beats/forbidden。
- 审查/final-a-0001-0002-连读.md，SHA256=${review.report_sha256}；两章登记、workflow更新后，按1再2实际全文连读，保存报告后才review登记。范围1—2、全部两份当前正文SHA齐全；正式review_ref=${reviewResult.ref}。check确认valid=1/stale=0。这仍是知情自检，未冒充新鲜会话或文学通过。

## 受控门禁与修正记录

第1章当前v2已全文实读、真实报告保存前，用不存在的 审查/final-a-controlled-missing-report-do-not-create.md，绑定正确完整章SHA及64个0的report占位SHA。该路径始终未创建。实际preview退出1、record退出2，均DRAFT_REVIEW_INVALID；前后state=371b6634ede8ca23aac6f7d951c8b9a04c447422ef7dc44820de6627304cb95f、objects4项、journal0项，整个.writer86文件的清单和哈希不变。证据：final-a-46/47/48/49/50。record错误JSON在stderr；记录器直接捕获退出2，外层PowerShell展示1不替代它。

之后才保存真实报告，另存正确输入：record1 preview/record为final-a-52/53，record2为final-a-67/68，全部退出0；输入原字节、双流、真实退出码、前后state都在各自 U/final-commands/final-a-*/。受控失败未当文学报告、未覆盖，初测与上次首停所有失败记录也保持。

本次无非预期CLI门禁失败。一次FastCtx偏移57超过第2章首段实际54行的提示，已立即改读该片段1—54行再续写，未影响state。第1章初次完整稿有塑料椅数量、转述来源和先听语音动作三处小问题，v2修复；第2章把误写电话来向的“来电”改“已通”，补汗衫从包中取出再放回。修改前完整稿与片段均保留，修后对应片段和完整稿一致并完整重读。

## 第二章结尾的实际处境

时间最后明确为当晚21:26及其后，尚未写到21:40。最后一班船已离开，候船室还亮着灯，22:00才关门。

许蓉在值班窗边，仍临管原箱，箱放矮桌干报纸上，两搭扣合拢，未开未点，周岸未接箱。她与沈禾为之后开盖腾开椅子，借具条平放灯下。移椅不等于验收。

周岸已骑电动三轮离开，带自用帆布工具包及铺门钥匙。原备货单已实际交谭老板，消息双方确认；末次自述正去修理铺，尚未写他取到钱、空白还箱单、小票、或返程。原箱并不在他车上，不能跳成已收。

沈禾仍在候船室，有父亲的八十元借具条（目前平放桌上）、手机和折叠拉车；蓝捆带、汗衫已收回帆布袋，汗衫擦手后明确折回。照片和原单都已完成给点心铺这项工作，她答应明早提前到，今晚仍要等退款后回家。

## 第三章待回收与知情边界

- O_BOX_PAINT仍active，due_unit=3。原statement：${observation.statement} type=observation。原author_truth：${observation.author_truth} 三项经实际recall核对未变。许蓉亲见；沈父电话称记得并给出滴漆说法；周岸/沈禾尚未被写成核看白漆形位。第三章跨卷须回读第1章第7行及证据、原输入和各人所知，具体行动中兑现，不能逆改、编暗号或将单个特征升级成排他证明。
- P_TOOLBOX仍active，holder许蓉、矮桌、合扣未清点；T_RETURN partial：梁伯已在真实外放电话委托周岸码头代收并验后给沈禾一联凭据，尚未实际归还。交箱需写动作；届时custody变更须带previous_holder=许蓉并据实写完整新保管。
- T_DEPOSIT partial：八十元已核并授权全退给沈禾；钱袋只据梁伯说在铺里借具本最后、袋面沈成林名字。未写取袋或交钱，第三章须真正拿到、带回、点清并交付；不能用授权代替付款。
- 底联照片只承诺“马上发”，未写实际收到或展示；两联还箱单未取回填写。后续须实际接到/取到再使用，不把待办补成已发生。箱盖内清单据沈父与梁伯说存在，开箱后才是现场核验。
- F_GATE_QUOTE active、due3：普通西门维修工料三十元，周岸直接报，许蓉记本并实转述老何，沈禾在场听见；月底结，周岸承诺返程带小票，票未开带、款未付。它是正常代理创作选择，非observation/author_truth；后续如在原授权内合理追溯改价，最早影响章为2，须覆盖2至3的独立区实读重登，含老何等人所知和转述，不能直接主稿改字或补哈希。
- T_BACK pending、due3：周岸承诺21:40前带钱袋和凭据回码头，末次消息重申但尚未回来；许蓉、沈禾知道这个时间，沈父语音未被告知具体21:40，梁伯仅听到22:00关门。
- T_CALLBACK已resolved：21:10实际联系与口述核底联完成。P_ORDER已resolved：21:30关门前谭老板与周岸消息确认原单收到，custody谭老板（米糕店内具体位置未述），不能把原单仍写在周岸内袋。
- 沈父只通过女儿实际语音得知梁伯已授权、周岸去取钱、箱仍许临管、她等候；回复饭热好且不下楼，不知现场后续，不应自动知道退款完成。梁伯远程只知道通话范围及22:00；老何只知门维修。周岸离开后不知道候船室收车洗手及沈父回复，需后续在场或转述才更新。

原始期限汇总：21:10联系已兑现；21:30前送原单已兑现；21:40前返回未兑现；22:00关门前开箱清点、交箱、退八十仍待办；维修月底结，返程补小票仍待办。候选父亲亲自到场和热汤尾声仍未被正式采纳，不能为闭合清单强加出场或全史解释。

## 正常结束与恢复入口

本进程至此结束，未取第3章写前模板、未写第3章。原1—3有限范围仍在trial，不暂停、不自动续3。根会话核验并在下一进程明确恢复后，先status/workflow/tool identify/revision list，再读当前两章与本交接、O_BOX_PAINT原文、卷2契约及第3章实际细纲；核当前revision/SHA后新取第3章context与record-template。下一章至少5000正文汉字，真实跨卷完成有限归还；不能拿旧v1分段或旧首停交接重写已登记开头。

仍未覆盖：第3章跨卷兑现、普通报价追溯修订的独立事务、新鲜会话完整1—3审查、暂停仅discuss及实际拒绝第4章、新目录草稿导出。不能把本次两章完成升级为三章完成或正式发布。全部脚本和日志是本轮final-a-*记录，正文及报告只在新W；初测scenario、旧a-*.mjs、candidate/T封存和源码只读，没有另派代理、改产品、Git暂存/提交/推送或外传。
`;
fs.writeFileSync(U+'/交接-最终A恢复完成.md',text,{flag:'wx'});console.log(JSON.stringify({ok:true,handoff:U+'/交接-最终A恢复完成.md',handoff_sha256:hash(U+'/交接-最终A恢复完成.md'),evidence_index:U+'/final-a-resume-evidence-index.json',revision:6,state_sha256:stateSha,chapters:chapters.map(c=>({unit:c.unit,sha256:c.sha256,body_han:c.body_han})),review_ref:reviewResult.ref,expected_guard_failures:2,unexpected_cli_failures:0,unregistered_historical_drafts:2,next_unit:3,native_session_id:null},null,2));
