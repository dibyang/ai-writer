import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {base,work,read,state,sha,save,write} from './common.mjs';
const get=ref=>JSON.parse(fs.readFileSync(path.join(base,ref),'utf8')),s=state(),before=get('final-read-before.json'),after=get('final-read-after.json'),flow=get('final-flow-verification.json'),manifest=get('export-current-30/manifest.json'),status=get('commands/final-work-status/stdout.raw.txt'),reviewResult=get('commands/final-current-review/stdout.raw.txt'),review=JSON.parse(read(reviewResult.ref)),entry=JSON.parse(fs.readFileSync(path.join(base,'commands/f-entry-status/before-state.json'),'utf8'));
assert.equal(s.revision,76);assert.equal(s.schema_version,6);assert.equal(s.tool_control.generation,5);assert.equal(sha(read('.writer/state.json')),flow.state_sha256);assert.deepEqual(s.units,entry.units);assert.deepEqual(s.snapshot,entry.snapshot);assert.deepEqual(s.tool_control,entry.tool_control);assert.deepEqual(s.decisions,entry.decisions);
assert.equal(status.governance.stage,'paused');assert.deepEqual(status.governance.authorization.allowed_actions,['discuss']);assert.equal(status.governance.authorization.draft_range,null);assert.equal(status.governance.authorization.revise_range,null);assert.deepEqual(status.stale_units,[]);assert.deepEqual(status.changed_sources,[]);assert.deepEqual(status.impact_pending,[]);assert.deepEqual(status.draft_inventory.unregistered,[]);
assert.equal(review.from,1);assert.equal(review.to,30);assert.equal(review.kind,'model-self-review');assert.equal(review.report_sha256,sha(read(review.report)));assert.equal(review.report_sha256,get('f-report-final-binding.json').report_sha256);
assert.equal(manifest.status,'draft-export');assert.equal(manifest.quality_review,'required');assert.equal(manifest.revision,76);assert.deepEqual(manifest.included_units,Array.from({length:30},(_,i)=>i+1));assert.deepEqual(manifest.excluded_drafts,[]);assert.deepEqual(manifest.warnings,[]);assert.equal(manifest.units.length,30);
const m=fs.readFileSync(path.join(base,'export-current-30/manuscript.md'),'utf8'),parts=s.units.map(u=>read(u.draft).toString('utf8').trim()),separator='\n\n---\n\n';assert.equal(m,parts.join(separator)+'\n');assert.equal(sha(Buffer.from(m)),manifest.sha256);assert.equal((m.match(/^# /gm)||[]).length,30);
let pos=0;const units=manifest.units.map((u,i)=>{const b=read(u.draft);assert.equal(u.unit,i+1);assert.equal(u.sha256,sha(b));assert.equal(u.sha256,before.chapters[i].sha256);assert.equal(u.sha256,after.chapters[i].sha256);assert.equal(u.sha256,s.units[i].sha256);assert.equal(u.sha256,review.units[i].sha256);assert.deepEqual(u.source_hashes,s.units[i].source_hashes);const row={unit:u.unit,draft:u.draft,sha256:u.sha256,export_utf8_byte_offset:Buffer.byteLength(m.slice(0,pos)),export_text_bytes:Buffer.byteLength(parts[i]),heading:parts[i].split('\n')[0]};assert.equal(m.slice(pos,pos+parts[i].length),parts[i]);pos+=parts[i].length+(i<29?separator.length:1);return row;});assert.equal(pos,m.length);
assert.ok(!fs.existsSync(path.join(work,'正文/0031.md')));assert.ok(!fs.existsSync(path.join(work,'.writer/drafts/t-final-no-31.json')));
const verification={ok:true,revision:s.revision,schema:6,generation:5,content_id:s.tool_control.installed.source_content_id,state_sha256:sha(read('.writer/state.json')),read_state_sha256:before.state_sha256,units_and_snapshot_unchanged_from_entry:true,tool_control_unchanged_from_entry:true,report_sha256:review.report_sha256,review_ref:reviewResult.ref,review_ref_sha256:sha(read(reviewResult.ref)),export:{directory:path.join(base,'export-current-30'),manifest_sha256:sha(fs.readFileSync(path.join(base,'export-current-30/manifest.json'))),manuscript_sha256:manifest.sha256,status:manifest.status,quality_review:manifest.quality_review,included_units:manifest.included_units,excluded_drafts:[],warnings:[],exact_content:'Each original body trim(), joined in unit order with two LF + --- + two LF, terminal LF; manifest keeps original untrimmed body SHA.',no_unregistered_content:true,units},scope:'Mechanical export verification only; native full manuscript reading occurred before finish-flow and remains subject to independent parent audit.'};save('f-export-verification.json',verification);
const seg=get('f-current-segments-verification.json'),table=['|章|当前分段目录/依据|段数与拼装|','|---|---|---|',...seg.chapters.map(r=>`|${r.unit}|${r.current_parts?path.posix.dirname(r.current_parts[0].ref):'仅当前正文；旧flatparts不作当前映射'}|${r.exact_assembly?r.part_count+'段，两个LF精确拼装':'未宣称旧段等于当前'}|`)].join('\n');
const handover=`# T 最终当前入口（F，未封存）

本F已完成授权的当前30章全文实读、知情模型自检、机械收尾和草稿导出，现停止，不继续31。T整轮尚待父从原生日志独立逐行审计；本文件不宣布封存、真人/市场/百章/跨平台/正式发布验收。没有启动代理、联网、提交推送；写入仅T测试副本与记录，产品/S/Q/R封存/真实作者作品/全局配置未由F写入。

## 最终入口及暂停

作品：${work.replaceAll('\\','/')}；文体novel。CLI为作品内 .writer/tool/bin/ai-writer.mjs。

最终schema6 / revision76 / generation5 / 登记30章。工具contentID：${s.tool_control.installed.source_content_id}；runtimeID：${s.tool_control.installed.runtime_id}。最终stateSHA：${flow.state_sha256}。

实际finish-flow.mjs exit0。当前stage=paused，仅allowed_actions=[discuss]，draft_range=null、revise_range=null；到30停止。31 record-template实际返回ACTION_OUT_OF_SCOPE（commands/final-next-draft-refused/stderr.raw.txt），该拒绝前后stateSHA相同，没有正文/0031.md，也没有t-final-no-31模板。discussion恢复实际成功，输出 .writer/drafts/t-final-discussion.json；这只准讨论，不授予31、旧章改稿或恢复旧revision的权限。

所有revision会话committed、事务completed，无活动修订/未决事务；stale_units/changed_sources/impact_pending与未登记正文空。tool identity missing/mismatches空，check ok、doctor ok。rolling_review valid9/stale14，stale_with_current_coverage14、stale_without_current_coverage0、pending_windows空；旧报告留在历史，仅由当前覆盖接续，不声称旧报告重新变当前文学通过。工具帮助修复安装后的gen5已实核；R1 gen4/e25和delivery-current的24章/r66只是历史。

## 实际阅读与审查

本F从当前正文/0001.md按1→30至0030.md逐章每行真实FastCtx返回至EOF，共36次正文调用。7的1—220/221—438；13的1—170/171—319；19的1—120/121—240/241—353；25的1—110/111—220/221—329均按Partial指定offset补齐；其余各1次完整到EOF。全部30个具体EOF、SHA、逐章目标/选择/后果/知识/物钱时锚和阅读代价见完整报告。原生日志由父独立核，不能以本文件自报代替。

T/final-read-before.json与final-read-after.json的30个真实路径/SHA/Han/字节/行数逐章相同，且等于current units；阅读阶段stateSHA均${before.state_sha256}（r75），之后只经授权CLI暂停到r76。141631Han为全文件含章题；JSON lines不计终LF生成的空元素，比FastCtx显示的末空行少1，未漏章或尾行。T/f-read-*.md保留读取当时阶段边界，f-current-plan-view/f-ledger-focus为辅助核对视图，不能代替正文阅读。

审查报告：审查/T-完整当前稿-0001-0030.md，最终SHA ${review.report_sha256}。review实际登记：${reviewResult.ref}，范围1—30、kind=model-self-review，报告及30SHA均已实际核对，quality=review-recorded-not-acceptance。报告回读时只改正了三处F自己的行号/取条称呼/卸归表述，旧报告保留T/f-history/report-before-editorial-corrections.md，最终绑定f-report-final-binding.json；没有改正文。

本次没有确认新增高置信硬问题。24当前SHA c3ca7b5b82c7c99958e730566bd89df98fe3ad9239b29f3bfa3d4c9170d33699：23电话只核陶在，何33自己定同行，陶69亲见才知，77递押纸后81—83退60，24H1按当前关闭。27当前SHA 05daf2b72055707c46950e2483f20018acd58096f43d59dfa5a04f5ef6a8e41b：158重翻已经读完杂志，从桌边取旧纸条夹重读页，接24取纸/读完和30重读，R2 C27-H1按当前关闭。旧B/C未修判语仍属其旧SHA。R1借布14:55/自报回铺14:57/押60为测试授权内代理选择的受控改稿，非用户逐字指定、非产品缺陷；工作15点/场地15点和还车22日18点原期限不挪。

## 当前分段版本

以下仅映射当前版本，完整段SHA、正文SHA及拼装在T/f-current-segments-verification.json。参考父r1-current-segments与inherited-current-segments，并以实际拼装核过，不能由旧交接覆盖现稿。

${table}

15以0015-t-r1为当前，不能回用0015-r5；18以0018-t-r1为当前，不能回用0018-r6；21/22/24用-t-r1；27只用0027-t-r2。1—3/5—6的继承平铺旧段不声明当前等价；正文和current unit SHA才是入口。

## 草稿导出与机械复核

导出目录：T/export-current-30，文件manuscript.md与manifest.json。status=draft-export，quality_review=required；included_units恰1—30顺序、excluded_drafts和warnings空。合稿SHA ${manifest.sha256}，manifestSHA ${verification.export.manifest_sha256}。

T/f-export-verification.json实际核manifest全部30SHA等于before/after/current units/review；合稿逐章正文仅按导出格式trim首尾空白，以两个LF/---/两个LF连接并末LF，整体字节精确相等，30个章题顺序齐，无未登记或历史候选混入。没有把规范化后的合稿块SHA冒充原稿SHA。units/snapshot/tool_control/decisions与F入口相同，正文不因暂停导出改变。check/doctor/export不构成文学或正式发布验收。

## 当前收益、未完事项和可选意见

1的坏轮/窄空间经19拆看、22失败、23何自选继续、25真实换两轮到30本人挪空架清后地获得有限改善：不再托坏轮端/垫砖/趴铁条下掏，仍须卸轻货逐瓶水、归货、留营业通道、绕凸缝，肩仍累；没有满载越槛沟/雨天/长期耐用结论。21借车已在24故事22日17:36陶本人收入里墙并亲退50+10共60何钱包，原18点期/陶23日早用不挪；25以后用何自筐/柜脚/另一排临放，不另借车。旧检查20+失败试工20共40不退不抵，新100在25亲付陶收清，旧80没付，28回收4独立收入。26进纸6提42/郝货56实交，29锅原30上限后实际20、50找30，不混为修架账。

原观察O_GRID/O_LETTER_TEXT整条与R1基线相同，type/statement/author_truth有无均保留。节目单周柜上层、片套下层左、原信下层右；两份后屋清稿各自存可改撤不散发，林私抄信后层与清稿分放。陈本人在可纠的那次口述已办，非长期散稿/拍摄/复制/借片/借棚许可。原片对应邵木箱/信中那盒、全史/全名/年月/捎信前托话人/送碗确日及碗花仍未知，不造期限或全史结论。

当前故事27日18点后两人仍向河岸转弯树走，未到树/折返完/回家。何只听约、不知已会合；许清扫/回收知情来自林转述，不亲见；周陈停在16日最后有据状态，陶仅知25日何询回收、不知后来具体约价成交。何柜顶空盒自拟28日晨取，未取/未请林/无钟点；许改天看挪架或问豆腐做法无定约。万后续去处、锅到家长期效果、陶纸样回铺新位、何总余额、许27日下午具体活均未核。原有限承诺全按原期闭合，未知不因为thread resolved而强行解决。

可选意见均未采用/未改：28:136杯在垫上后156箱上仍空着可明确“还有空处”；29:48姓氏参照可点明锅贴/本子。重复卸放中仍有不同结果，应保留；可考虑减少行动后再作自检说明、反复问许可/纠推断的总结层、归位/吃饭式连续章尾，以及30两个儿童粉笔呼应的工整感。保留22落空清扫的情绪、27拒饭独处和29/30新的相处选择。位置、代价及最小方向见报告，不能升级必改或谎称已应用。

## 偏差保留及父待审计

19报告保存失败后先record的历史偏差、D28 Buffer合章异常和首版Han不足、C旧模板拒绝、历史预算/回归红灯均保留，不能追认为全程无误。F辅助视图v1误读不存在的input.draft_sha256，v2改用captured after-state实际unitSHA，旧v1保留；非产品/正文问题。F最终report SHA已由真实review绑定；不再改报告使其失效。

父尚须从真实原生日志逐行核F的当前30章覆盖、来源版本与最后一行，独立核A/C同thread恢复及各客户端正常退出、R1/R2正式提交边界、所有历史异常和最终输出。不能仅凭此交接/JSON自报封存。本F将实际FastCtx回读本交接至EOF并存前后指纹；随后正常结束本客户端回合，不封存、不提交、不推送、不续31。
`;
const ref='交接/T-最终当前入口.md';write(ref,handover);save('f-handover-read-before.json',{ref,path:path.join(work,ref),sha256:sha(read(ref)),state_sha256:sha(read('.writer/state.json')),report_sha256:sha(read(review.report)),note:'Fingerprint before actual FastCtx handover read; no automatic read-complete assertion.'});
console.log(JSON.stringify({ok:true,revision:s.revision,state_sha256:flow.state_sha256,export_sha256:manifest.sha256,handover:ref,report_sha256:review.report_sha256}));
