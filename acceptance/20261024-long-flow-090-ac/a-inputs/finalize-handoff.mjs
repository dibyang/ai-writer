import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import assert from 'node:assert/strict';
const b=path.resolve('acceptance/20261024-long-flow-090-ac'),p=JSON.parse(fs.readFileSync(path.join(b,'project.json'))).project;
const sha=x=>crypto.createHash('sha256').update(x).digest('hex'),read=f=>fs.readFileSync(path.join(p,f)),j=f=>JSON.parse(read(f)),write=(f,s)=>{fs.mkdirSync(path.dirname(f),{recursive:true});fs.writeFileSync(f,s,{flag:'wx'});};
const stateBytes=read('.writer/state.json'),s=JSON.parse(stateBytes),template=j('.writer/drafts/AC-A-record38-before.json'),baseline=JSON.parse(fs.readFileSync(path.join(b,'a-inputs/old-files-baseline.json')));
const oldFiles=baseline.files.map(f=>({path:f.path,expected:f.sha256,actual:sha(read(f.path))}));
const mismatches=oldFiles.filter(f=>f.expected!==f.actual);
const sources=Object.entries(template.source_hashes).map(([f,h])=>({path:f,expected:h,actual:sha(read(f))}));
assert.equal(mismatches.length,0);assert.deepEqual(s.units.slice(0,36),baseline.units);assert.equal(s.units.length,37);assert.equal(s.units.at(-1).unit,37);assert.equal(s.revision,182);assert.equal(template.expected_revision,182);assert(sources.every(f=>f.actual===f.expected));assert.equal(template.summary,'');
assert(!fs.existsSync(path.join(p,template.draft)));
assert.equal(fs.readdirSync(path.join(p,'分段/AC-A-0038')).length,2);
assert(!fs.readdirSync(path.join(p,'正文')).some(f=>/^0*39\D/.test(f)));
const originalState=JSON.parse(fs.readFileSync(path.join(b,'cli-logs/a01-status/before-state.json')));
const originalObservations=Object.fromEntries(Object.entries(originalState.snapshot.ledger).filter(([,v])=>v.type==='observation'));
for(const [id,v]of Object.entries(originalObservations))assert.deepEqual(s.snapshot.ledger[id],v);
const status=JSON.parse(fs.readFileSync(path.join(b,'cli-logs/a30-final-status/stdout.txt'))),check=JSON.parse(fs.readFileSync(path.join(b,'cli-logs/a31-final-check/stdout.txt')));
assert(status.ok&&check.ok);assert.equal(status.next_unit,38);assert.deepEqual(status.changed_sources,[]);assert.deepEqual(status.stale_units,[]);assert.deepEqual(status.impact_pending,[]);assert(!check.findings.some(x=>x.severity==='error'));
const parts=['01.md','02.md'].map(f=>{const rel='分段/AC-A-0038/'+f,v=read(rel);return {path:rel,bytes:v.length,sha256:sha(v),han:(v.toString('utf8').replace(/^\s*#{1,6}\s.*$/gm,'').match(/\p{Script=Han}/gu)||[]).length};});
const han38=parts.reduce((n,v)=>n+v.han,0);assert(han38>=3000&&han38<=5000);
write(path.join(b,'a-inputs/38-parts-final-manifest.json'),JSON.stringify({complete:false,assembled:false,registered:false,han:han38,parts},null,2)+'\n');
const reads=fs.readdirSync(path.join(b,'read-pages')).filter(f=>f.startsWith('a-')).map(f=>JSON.parse(fs.readFileSync(path.join(b,'read-pages',f))));
const groups=new Map;for(const r of reads){const k=r.file+'|'+r.sha256;if(!groups.has(k))groups.set(k,{file:r.file,sha256:r.sha256,total_pages:r.pages,pages:[]});groups.get(k).pages.push(r.page);}
const coverage=[...groups.values()].map(v=>({...v,pages:[...new Set(v.pages)].sort((a,b)=>a-b),complete:new Set(v.pages).size===v.total_pages}));
write(path.join(b,'a-inputs/read-coverage.json'),JSON.stringify({reader:'same-session-Codex-actual-page-reading',coverage},null,2)+'\n');
const u=s.units.at(-1),draftBytes=read(u.draft),han37=(draftBytes.toString('utf8').replace(/^\s*#{1,6}\s.*$/gm,'').match(/\p{Script=Han}/gu)||[]).length;
const rejection=JSON.parse(fs.readFileSync(path.join(b,'cli-logs/a21-context37-low/result.json')));
const audit={revision:s.revision,project_id:s.project_id,state_sha256:sha(stateBytes),registered_units:37,next_unit:38,tool:s.tool_control.installed,generation:s.tool_control.generation,old_files_verified:oldFiles.length,old_file_mismatches:mismatches,old_36_unit_objects_equal:true,observations_unchanged:Object.keys(originalObservations),template38_sources_match:sources.every(f=>f.actual===f.expected),template38_source_details:sources,draft38_exists:false,unit39_draft_exists:false,han37,han38,parts,status_ok:status.ok,check_ok:check.ok,check_findings:check.findings,unchanged_legacy_drafts:status.draft_inventory.unregistered.length,budget_rejection:{exit_code:rejection.exit_code,state_unchanged:rejection.before_state_sha256===rejection.after_state_sha256},no_new_rolling_review_claim:true};
write(path.join(b,'a-inputs/final-audit.json'),JSON.stringify(audit,null,2)+'\n');
const context38='.writer/drafts/AC-A-context38.json',temp38='.writer/drafts/AC-A-record38-before.json';
const handoff=`# AC 第一轮 A 首停交接

状态：已到规定断点，等待同ID恢复。第37章实际完成并正式登记；第38章只有两个未完自然分段，未合章、未登记；第39章没有正文。仅操作AC独立副本，无其他会话消息、子代理、外部写作服务、提交/推送/发布。

## 身份与权威状态

- 唯一project：${p}
- 主state：.writer/state.json；revision **${s.revision}**；project_id **${s.project_id}**；SHA256 **${sha(stateBytes)}**；units=37，next_unit=38，schema6。
- 工具：0.9.0 generation **${s.tool_control.generation}**；content_id **${s.tool_control.installed.source_content_id}**；runtime_id **${s.tool_control.installed.runtime_id}**。公开CLI均由AC/cli.mjs固定入口执行，输入/输出/退出码/前后state保存在cli-logs/a01— a31各唯一标签目录。doctor a03实际通过，无errors/warnings。
- 当前workflow为trial，draft_range=37—39、revise_range=37—39，允许discuss/plan/draft/revise；停点明确本轮不写39。author_evidence引用研究/AC作者任务.md真实第3行；无伪造逐项作者采纳。会话UUID未由本次工具提供，不编造；这里的“同ID恢复”指继续本次原会话。

## 第37章实际完成

- 正文：${u.draft}；${draftBytes.length}字节；去Markdown标题正文汉字 **${han37}**；SHA256 **${u.sha256}**。
- 报告：${u.draft_review.report}；SHA256 ${u.draft_review.report_sha256}。知情模型自检，非盲读/作者定稿。
- 写前context：.writer/drafts/AC-A-context37.json；写前模板：.writer/drafts/AC-A-record37-before.json（revision181）；填后输入AC根a-inputs/record37-filled.json；预览a25、正式登记a26。
- 六段原稿：分段/AC-A-0037/01.md—06.md；正式assemble a24；初合章8页及三处局部语言修正后最终8页全部实际回读。分段仍是修前过程字节，**不要重新拼旧段覆盖当前37**。修前完整章在AC根a-inputs/37-assembled-before-language-fix.md，最终以state所指正文为准。
- 37发生：周二母女收床单，原衣散气夜实交女备课；另一家房门母女真实电话重约周四9—12，未修未收；沈与女约以后都空半天一起做午饭、各做一项/各出菜钱，许夜许可厨房一次、女将许可发沈；日期/菜/采购仍未来。父脚伤仍垫，父只听厨房待问的较早转述。

## 第38章写前材料与未完分段

37登记后，通过a27正常plan保存当前正式细纲大纲/单元/0038.json，SHA256 ${sha(read('大纲/单元/0038.json'))}。这次修正原初纲晨携出：37实际已经选先回家取衣，所以38晨间袋留家；旧初纲输入保留，说明在大纲/AC-A-38写前细化说明.md。

- 正式context：${context38}；SHA256 ${sha(read(context38))}；a28使用max-chars45000成功。
- 写前record-template：${temp38}；SHA256 ${sha(read(temp38))}；expected_revision=182，summary仍空，source_hashes全部与停止时当前字节相同。
- 预定完整章路径：${template.draft}；此文件**不存在**，没有assemble/preview/record38。写前来源与workflow此后未改。

|分段|UTF-8字节|去标题汉字|SHA256|
|---|---:|---:|---|
${parts.map(x=>`|${x.path}|${x.bytes}|${x.han}|${x.sha256}|`).join('\n')}

合计 **${han38}**正文汉字。原始计数清单38-parts-manifest.json保留初版，两处语言修正后以38-parts-final-manifest.json及上述SHA为准。最终分段按COMMON分页完整读：01共2页、02共1页，a-r38-final-*保存实际字节。没有拼接一份完整38。

分段现状（**未进主事实账本**）：周三早晨女只带饭袋/小包出门，工装/原反馈纸/旧练布/针盒仍备课袋在许家干椅，母尚家常薄衣，深衣挂好未出16点班；女给沈发饭约下回再谈，没有问班成功。周三上午周承认抽屉昨天漏回话，实际电话议定换底板18元/周五午后取、来前电话，未收钱、未修交；检查磨平自用撬片、两垫木另绑/工具台下，抽屉和板仍台上，止于板边点记/未连线。周四门的周三晚确认还没有发生，柜门侧图仍无新图。

## 恢复下一步

1. 继续同一会话，先读COMMON、作者任务、本交接，实际status/check与38 context/template及两分段，核上列SHA和当前revision182。若同字节同state，不重取模板；有漂移先核影响，不能只刷哈希。
2. 从周三白日以后接第三自然分段：姑娘下工先回家、吃饭/取衣再走到活动室，19点第四课才真实读周一新条、看原衣与六七针练布；现场决定是否动针，不按骨架强拆，不让老师预知。按真实情形续到20:40收针。
3. 周三晚房门是否确认须真实消息/自然换场写出；抽屉18元和周五安排是38未登记新事实，之后完整38登记时才进changes，不能提前改37账本。完整38正文至少10000汉字，合章、全读、回对、填写前模板、preview后record；39先回对38实际结果再细化动笔。
4. 完成39时才连读37—39及34—36并review绑定实际六章哈希；本轮没伪造该窗口。

## 尚未回收与储备

- T_X_COAT_DAILY：37只到实交衣备课；老师未见周一新条与本次实衣，保留partial。38—39安排实际看衣/返衣，长期穿洗仍不保证。
- T_D_ROOM_DOOR_LOOK：周四9—12真重约，尚未取旧底条/拆修/定最后工料/交钱；拆后原木情况未知，V15 40—42是拟兑现窗口。
- T_D_CABINET_PHOTOS：本人未归、侧图未齐，仍pending，不能为回收强令本人归来。
- T_AC_SHARED_MEAL：37首次普通饭约/厨房许可已登记pending，40—48仍粗排，不固定远期菜、日期或借碗。P_AC_DRAWER在37只留物待看；38分段已有18元及周五约，尚未登记。
- 父辈全史、问路人终点、复航日期、课程总期数、父伤后续留白；旧箱80及35/81/84旧款有限兑现，不重开。

## 失败与验证边界

显式低预算a21返回CONTEXT_BUDGET_EXCEEDED：1000预算，实际31106；工具日志exit_code=${rejection.exit_code}，前后state SHA完全相同；随后明确扩大40000成功。没有借删来源或重取模板绕过。展示层长JSON曾截断，关键context从已保存JSON继续实读；不把展示截断当工具缺陷。初次想在functions批调FastCtx时名字不可用，改用直接FastCtx读取，没有写作品副作用。

最终a30 status/a31 check均ok，changed_sources/stale_units/impact_pending为空；check只有原有22个1—36章历史留稿warning，保留原样，没有新增38完整正文；机械check不作文学验收。116个既有已消费来源/当前旧正文哈希逐一相同，旧36个unit对象严格相同，旧observation整条未变。38写前来源逐一匹配，主state哈希与template一致。详见a-inputs/final-audit.json、read-coverage.json。当前只有37新完成，38未登记，等待同ID恢复。
`;
write(path.join(b,'交接-A首停.md'),handoff);
console.log(JSON.stringify({revision:s.revision,registered:37,next:38,han37,han38,old_files_verified:oldFiles.length,sources38_match:true,state_sha256:sha(stateBytes),parts,handoff:path.join(b,'交接-A首停.md')},null,2));
