import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const base=path.dirname(fileURLToPath(import.meta.url)),work=path.join(base,'scenario/雨棚后的灯');
const read=f=>fs.readFileSync(path.join(base,f));
const json=f=>JSON.parse(read(f));
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const stateBytes=fs.readFileSync(path.join(work,'.writer/state.json')),s=JSON.parse(stateBytes);
const binding=json('final-read-binding.json'),flow=json('final-flow-verification.json'),support=json('final-support-verification.json');
assert.equal(s.revision,54);assert.equal(s.units.length,18);assert.equal(s.tool_control.generation,3);
assert.equal(s.governance.stage,'paused');assert.deepEqual(s.governance.authorization.allowed_actions,['discuss']);
assert.equal(s.governance.authorization.draft_range,null);assert.equal(s.governance.authorization.revise_range,null);
const beforePause=json('commands/final-pause/before-state.json');
assert.deepEqual(s.snapshot,beforePause.snapshot);assert.deepEqual(s.units,beforePause.units);assert.deepEqual(s.tool_control,beforePause.tool_control);
const refusalBefore=read('commands/final-next-draft-refused/before-state.json'),refusalAfter=read('commands/final-next-draft-refused/after-state.json');
assert.equal(sha(refusalBefore),sha(refusalAfter));assert.equal(sha(stateBytes),sha(refusalAfter));
for(const f of binding.files)assert.equal(sha(fs.readFileSync(path.join(work,f.file))),f.sha256_before);
assert.ok(!fs.existsSync(path.join(work,'正文/0019.md')));assert.ok(!fs.existsSync(path.join(work,'.writer/drafts/s-final-no-19.json')));
const check=json('commands/final-work-check/stdout.raw.txt'),doctor=json('commands/final-work-doctor/stdout.raw.txt'),identity=json('commands/final-work-identity/stdout.raw.txt'),review=json('commands/final-current-review/stdout.raw.txt'),exported=json('commands/final-export/stdout.raw.txt');
assert.equal(check.ok,true);assert.deepEqual(check.findings,[]);assert.equal(doctor.ok,true);assert.deepEqual(doctor.errors,[]);assert.deepEqual(doctor.warnings,[]);
assert.deepEqual(identity.missing,[]);assert.deepEqual(identity.mismatches,[]);assert.equal(identity.observed_content_id,binding.tool_content_id);
assert.equal(check.rolling_review.stale_without_current_coverage,0);assert.deepEqual(check.rolling_review.pending_windows,[]);
assert.equal(review.quality,'review-recorded-not-acceptance');assert.deepEqual(review.coverage,[1,18]);
const manifest=json('export-current-18/manifest.json'),manuscript=read('export-current-18/manuscript.md');
assert.equal(exported.status,'draft-export');assert.equal(sha(manuscript),exported.sha256);assert.equal(sha(manuscript),flow.export.sha256);
assert.deepEqual(exported.included_units,Array.from({length:18},(_,i)=>i+1));assert.deepEqual(exported.excluded_drafts,[]);assert.deepEqual(exported.warnings,[]);
assert.deepEqual(manifest.units.map(u=>[u.unit,u.sha256]),s.units.map(u=>[u.unit,u.sha256]));
let previous=-1;const exportPositions=[];
for(const unit of s.units){const body=fs.readFileSync(path.join(work,unit.draft),'utf8').trim();const pos=manuscript.toString('utf8').indexOf(body,previous+1);assert.ok(pos>previous,`Missing exported body ${unit.unit}`);previous=pos;exportPositions.push({unit:unit.unit,position:pos,sha256:unit.sha256});}
const report='scenario/雨棚后的灯/作品审查/S-完整当前稿-0001-0018.md',cliReport='scenario/雨棚后的灯/审查/S-完整当前稿-0001-0018.md';
assert.equal(sha(read(report)),sha(read(cliReport)));assert.equal(sha(read(report)),json('final-report-binding.json').sha256);
const commands=['final-current-review','final-workflow-before','final-pause','final-next-draft-refused','final-discussion-restore','final-revisions','final-work-check','final-work-doctor','final-work-status','final-work-identity','final-export'].map(label=>{const r=json('commands/'+label+'/result.json');assert.equal(r.exit_code,label==='final-next-draft-refused'?2:0);return {label,exit_code:r.exit_code,elapsed_ms:r.elapsed_ms,result_sha256:sha(read('commands/'+label+'/result.json'))};});
const mapping=support.segments.map(row=>`|${row.unit}|${row.directory||'以当前正文为入口，不声明分段映射'}|${row.parts?.length||'—'}|`).join('\n');
const handoff=`# S轮最终当前入口：18章已实读、草稿已导出，待父会话总审计

2026-10-20。本客户端为新原生进程session 01a155ce-f6b7-78d2-b851-f8432b026c95，只凭S文件恢复。此处结束授权范围，不写19。原生进程最终退出码由父会话外层捕获，本文件不预造退出回执。

## 实际当前状态

作品根：D:/work/other/ai-writer/acceptance/20261020-long-flow-090-s/scenario/雨棚后的灯。

入场revision53、已登记1—18；完整实读后真实执行S/finish-flow.mjs成功，主线现在**revision54、schema6、已登记18、next_unit19、stage paused**。allowed_actions仅discuss，draft_range/revise_range均null。19只是顺序提示，未获正文授权；无19正文/成功模板。没有活动revision或未完成事务，不resume已committed的R1—R6。

实际CLI为.writer/tool/bin/ai-writer.mjs，工具0.9.0/generation3；observed/source content_id **730a9e3eaffd691e1ef902722513ba548821ce9f077b35a4ff43bb52e0dbfecc**，runtime_id **5010447287bb52f84ef0f76405c20d1cc87dff4bab45a3cb7138eb504894a2f2**。最终identify missing/mismatches为空，与delivery-current.json匹配。协议tool_build_id c012921c5617106f0b5dede61af532afee505016f207068a2d6910b5caef8505不是content_id，不混写。最终state SHA256 **${sha(stateBytes)}**。

## 完整实读与当前报告

按当前主线正文0001→0018完整实读2911行、正文69112 Han；7的Partial从221补齐，13从161补齐，18稿读前后SHA完全相同。final-read-binding.json保存18稿SHA、实际行范围、真实call_id、原生工具日志定位和前后state指纹；final-read-tool-log.jsonl保存40条真实调用/返回原始记录。补充材料的范围见final-support-read-binding.json，不声称读完所有旧输入、旧分段、日志或备份。

当前正式报告：**作品审查/S-完整当前稿-0001-0018.md**，SHA256 **${sha(read(report))}**。为兼容现成finish-flow，审查/S-完整当前稿-0001-0018.md保存同字节副本，没有修改helper。真实review ref **${review.ref}**，coverage1—18，quality=${review.quality}；CLI覆盖不等于文学验收。

结论：当前1—18未发现新的高置信硬问题；15“腾不出手开门”、16房内整理旧鞋带、17对同次整理的自嘲、18“把门再推开些”均在当前主稿实见。R6 snapshot去evidence哈希后无额外语义差异仅为范围守恒，本客户端另作全18实读。报告保留14—16准备/许可重复偏密和旁白总结偏多的可选优化，未改主稿，不把风格偏好升级必改。

这是**知情模型自检**，不是真人盲读、市场验证、正式出版/发布或百章文学验收。当前18章是本轮完整当前版本，旧分段与旧C/D报告不能拼成修前稿或冒充当前未修。

## 当前分段目录映射

|章|当前目录（均在分段/下）|段数|
|---|---|---:|
${mapping}

13个有映射章已机械核按文件名顺序、两个换行连接与当前正文完全同字节。4/8用-r1，10用-r2，15用-r5，16—18用-r6；其余按表。1—3、5—6本次不另声明段稿映射。旧4/8/10、旧15、旧16—18及留稿完整保留，不回拼覆盖。正文18稿SHA全表见完整报告/final-read-binding.json。

## 已完成的有限兑现与保留边界

- T_GRID只完成三格拟去用途；O_GRID观察和原字不改，不等于三场全履约。O_PROGRAM仍周柜上层原袋，原片O_FILM仍周柜下层左，旧信O_LETTER右；第六晚是新拍短片，13只见卷边而非影像。
- R1餐桌空间及8邀请来源、R2/R3的10何实际电话才知河西/邵全名指代、11林许和12何的真实知情时点均经当前全文与登记核对；章10仍故事第九日，章11第十日，章12第十二日。
- R4父保护区只补14 O_SHORT_DRAFT.reader_known，不是新原生客户端；C真实resume后才写15，旧S-C-完成止14。13代次更新后新context/template及阅读先于续段；15新来源与旧模板退出2拒绝均有真实记录。R5后D先完整读/登记10—15，不能拿R5单章报告替代。
- T_SHORT_ACCOUNT只核字；T_SORT_INVITE只13有限整理；T_LETTER_SCOPE只14询问；T_NEIGHBOR_TELLING在故事十六日实际完成本人可纠正的后屋朗读与周亲说送碗。陈17即时纠正“雨小”，女邻居改变拟转述，原字稿不改。许/何在17才完整听本次后屋段，私信和新捎信未公开。
- O_CURTAIN同一幕布：旧5还何、6归柜；15新借给许，previous_holder何。16许亲从家木箱取、携至棚、展一截，仍许持；18 14:53许亲叫还、何接稳后亲入柜原层，holder何/previous_holder许。T_CURTAIN_RETURN按15原约故事十六日15:00前闭合，due_unit18不是十八日。没有到店即当归还。
- T_SITE_RETURN实际还何两凳两夹、隔壁两凳，何三点前实走确认复原；周稳凳稍后送进门，林自凳回家。许14:58短信报回铺由林实告周陈何；陈18末报到家只有林收到，不给其他人自动增知。周见交布，入柜后由林实告；陈未亲见后间柜。
- 林自留清稿18归纸夹前层，周份仍抽屉独立袋；私人摘抄/电话页/旧改稿留住处后层等原处。旧信“托收/那盒/署邵无年月”观察不改，陈13新见内页不倒改9未见箱内的历史。

仍未知：邵全名、年份、去向、碗花/送碗日、三处全部履约、信中那盒与现盒完整对应、完整转手链与原片影像/全史。仍未授权：原片外借播放复制、原信任意示人散发、私摘抄示人、公开新捎信记忆、任意散稿/拍摄、住址传播或长期场次。有限结清不扩大原承诺。

## 真实最终流程及草稿导出

finish-flow真实退出0，命令捕获均保留于commands/final-*。1—18 review登记后workflow暂停到r54；19 record-template真实退出2，code ACTION_OUT_OF_SCOPE，拒绝前后state SHA同为 **${sha(refusalBefore)}**，无输出模板/正文。discussion context恢复真实成功，输出.writer/drafts/s-final-discussion.json。暂停只是正文范围，不影响允许的讨论。

最终check ok，findings=[]，stale/changed/impact为空，draft_inventory已登18、无unregistered/unsafe；rolling_review valid9/stale7，stale_without_current_coverage0、pending_windows=[]。旧stale报告仍保留且有当前覆盖，未删除历史去清零。最终doctor ok、errors=[]、warnings=[]，工具身份仍generation3。它们都是机械/资源健康结果。

草稿导出：**S/export-current-18/manuscript.md**，manifest.json并存；status=draft-export，revision54，included_units1—18，excluded_drafts=[]、warnings=[]、quality_review=required。稿SHA256 **${exported.sha256}**。导出清单18项SHA与主稿及实读绑定逐项相同；另实测全部18章原文在导出中按序存在。没有把导出再称一次独立文学实读或正式发布。

final-flow-verification.json记录既有流程结果，final-client-completion-verification.json记录交付后18稿仍同读前、snapshot/units/tool未变、19拒绝字节不变、报告副本一致和导出当前绑定。final-support-verification.json保存章纲消费、当前合章、186条引文绑定及父进程/原生日志定位。未运行源码测试，因为本客户端没有修改产品或引擎；不借此声称完成产品发布回归。

## 父会话下一步与本客户端结束

本客户端仅写S，未向真实作品、Q/R封存、产品源码、Git或全局配置执行写操作；未联网/发布、未启动代理、未提交或推送、**未封存**。此处已完成本客户端完整当前稿实读及有限草稿交付。父会话仍需最终汇总、审计、源文件与原封存校验后才可决定封存；本文件不预先替父会话签收其未执行项。第19章仍未获正文授权。
`;
const entry='scenario/雨棚后的灯/交接/S-最终当前入口.md';fs.writeFileSync(path.join(base,entry),handoff,{flag:'wx'});
const result={ok:true,at:new Date().toISOString(),session_id:binding.session_id,revision:54,registered_units:18,stage:'paused',allowed_actions:['discuss'],tool_generation:3,tool_content_id:identity.observed_content_id,state_sha256:sha(stateBytes),all18_body_sha_same_as_before_read:true,snapshot_unchanged_by_finish:true,units_unchanged_by_finish:true,tool_unchanged_by_finish:true,refused19:{exit_code:2,code:'ACTION_OUT_OF_SCOPE',before_sha256:sha(refusalBefore),after_sha256:sha(refusalAfter),no_template_or_body:true},review,report:{file:report,cli_report:cliReport,sha256:sha(read(report))},read_binding_sha256:sha(read('final-read-binding.json')),export:{file:'export-current-18/manuscript.md',sha256:sha(manuscript),status:exported.status,all18_in_order:true,positions:exportPositions,excluded_drafts:exported.excluded_drafts,warnings:exported.warnings},check,doctor:{ok:doctor.ok,errors:doctor.errors,warnings:doctor.warnings},commands,handoff:{file:entry,sha256:sha(handoff)},sealed:false,note:'Actual final client handoff. Parent still owns process-exit capture and final source/archive audit. Mechanical evidence is not literary or human acceptance.'};
fs.writeFileSync(path.join(base,'final-client-completion-verification.json'),JSON.stringify(result,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({ok:true,revision:54,units:18,stage:'paused',state_sha256:sha(stateBytes),report_sha256:sha(read(report)),handoff_sha256:sha(handoff),export_sha256:sha(manuscript),sealed:false}));
