import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { base, work, read, state, sha, save, write } from './common.mjs';

const fromBase = ref => JSON.parse(fs.readFileSync(path.join(base,ref),'utf8'));
const current = state();
const entry = fromBase('a-resume-entry-binding.json');
const initial = fromBase('commands/a-resume-status/before-state.json');
const first = fromBase('checkpoint-a-first.json');
const rolling = fromBase('a-resume-rolling-16-21-after.json');
const check = fromBase('commands/a-resume-final-check/stdout.raw.txt');
const review = fromBase('commands/review-21/stdout.raw.txt');
const doctor = fromBase('commands/a-resume-final-doctor/stdout.raw.txt');
const identity = fromBase('commands/a-resume-final-identify/stdout.raw.txt');
assert.equal(current.units.length,21); assert.equal(current.revision,58);
assert.equal(process.env.CODEX_THREAD_ID,first.native_thread_id);
assert.ok(check.ok && doctor.ok && identity.ok);
assert.deepEqual(check.findings,[]); assert.deepEqual(check.rolling_review.pending_windows,[]);
assert.deepEqual(current.units.slice(0,18),initial.units);
for(const [id,value] of Object.entries(initial.snapshot.ledger)) assert.deepEqual(current.snapshot.ledger[id],value);
assert.deepEqual(current.tool_control,initial.tool_control);
assert.ok(entry.prefix.every(f=>sha(read(f.ref))===f.sha256));
assert.ok(first.chapter.parts.every(f=>sha(read(f.ref))===f.sha256));
assert.ok(rolling.files.every(f=>sha(read(f.ref))===f.sha256));
for(const ref of ['正文/0022.md','分段/0022','交接/T-细纲-0022.json']) assert.ok(!fs.existsSync(path.join(work,ref)));

const chapters = [19,20,21].map(unit=>{
  const pad=String(unit).padStart(4,'0');
  const refs=fs.readdirSync(path.join(work,'分段',pad)).filter(f=>/^part-\d+\.md$/.test(f)).sort().map(f=>`分段/${pad}/${f}`);
  const body=read(`正文/${pad}.md`);
  const joined=Buffer.from(refs.map(ref=>read(ref).toString('utf8')).join('\n\n'),'utf8');
  assert.ok(body.equals(joined));
  const han=[...body.toString('utf8').replace(/^#.*$/gm,'').matchAll(/\p{Script=Han}/gu)].length;
  assert.ok(han>=(unit===19?10500:5000));
  assert.ok(han<=(unit===19?12500:6500));
  assert.equal(refs.length,unit===19?6:4);
  return {unit,ref:`正文/${pad}.md`,sha256:sha(body),body_han:han,parts:refs.map(ref=>({ref,sha256:sha(read(ref)),bytes:read(ref).length,body_han:[...read(ref).toString('utf8').replace(/^#.*$/gm,'').matchAll(/\p{Script=Han}/gu)].length})),assembly:'filename-sort; exact two LF join; no trim; byte-identical'};
});
const reportRef='审查/T-0016-0021.md';
const stateSHA=sha(read('.writer/state.json'));
const verify={
  at:new Date().toISOString(),native_thread_id:process.env.CODEX_THREAD_ID,
  registered:21,revision:58,schema_version:6,generation:3,state_sha256:stateSHA,
  tool:{version:identity.tool_version,content_id:identity.observed_content_id,runtime_id:identity.runtime_id,missing:identity.missing,mismatches:identity.mismatches},
  prefix_18_manuscripts_equal:true,prefix_18_unit_records_equal:true,prefix_23_ledger_entries_equal:true,tool_control_equal:true,original_two_parts_equal:true,
  chapters,rolling_read_binding:'a-resume-rolling-16-21-after.json',rolling_review:{...review,report:reportRef,report_sha256:sha(read(reportRef))},
  mechanical_check:{ok:check.ok,findings:check.findings,rolling_review:check.rolling_review},doctor:{ok:doctor.ok,errors:doctor.errors,warnings:doctor.warnings},
  pending_ids:['T_RACK_TRIAL','T_FLAT_CART_RETURN'],new_ids:Object.keys(current.snapshot.ledger).filter(id=>!initial.snapshot.ledger[id]),
  no_chapter22:true,no_agents_or_network:true,no_product_or_s_q_r_writes:true,no_commit_push_or_sealing:true,
  process_deviation:'19 beat report file saved after record due helper quote SyntaxError and missing dependency exit check; actual full reads preceded record; failure preserved; no template refresh',
  current_process_exit_receipt:'parent-to-capture-after-client-exit'
};
assert.equal(current.snapshot.ledger.T_RACK_TRIAL.status,'pending');
assert.equal(current.snapshot.ledger.T_FLAT_CART_RETURN.status,'pending');
assert.equal(current.snapshot.ledger.O_FLAT_CART.custody.holder,'何岚');
save('a-resume-final-verification.json',verify);

const handoff=`# T-A完成0021：同ID真实恢复后停在21

2026-10-20；原生线程${process.env.CODEX_THREAD_ID}。本进程只写T独立副本，完成第19余四段、20及21后停止。**已登记21章/r58/schema6/generation3，next_unit22。** 当前stage仍trial、原19—30授权保留给父后续新客户端；本客户端不启动22，不把next_unit当自己继续写作的许可。不封存、不提交推送，不预造本进程退出回执；由父外层捕获。

## 实际恢复与来源

父commands/codex-a-first/result.json已捕获首进程exit0，elapsed_ms705996；核其指纹与本线程ID后，才实读part01 1—74和part02 1—64、原交接/模板，再从十七日11:10接写。读前后原两段同SHA。a-resume-entry-binding.json、a-resume-reading-after.json及交接/T-A-恢复0019.md保存实际恢复证据。未启动代理或外部任务。

原19 context/template及九项来源实核匹配r55，沿用原.writer/drafts/t-record-19.json，不重prepare、不替hash；父预算只读诊断没有被当作换模板依据。20/21未消费候选先分别保存留稿/T-细纲-0020-未消费初候选.json和0021同名，再按实际成稿调整，随后各自prepare先于正文。context20完整实读1—230/231—530/531—804，context21完整实读1—230/231—580/581—885，模板各1—25，均EOF；指纹和来源实核在a-resume-20-sources-read.json / 21-sources-read.json。没有改已消费纲或写后刷新来源。

## 真实完成与版本

|章|正文Han|段数|当前正文SHA256|登记后revision|
|---|---:|---:|---|---:|
${chapters.map(c=>`|${c.unit}|${c.body_han}|${c.parts.length}|${c.sha256}|${c.unit+37}|`).join('\n')}

19/20/21均用各自原写前模板经flow record实际preview/record/check成功，19→r56、20→r57、21→r58。只有各part01带章题；六/四/四段按文件名排序、两个LF精确合章，不trim、不重写原两段。每章首读后修正未登记稿、再次完整复读最终章；候选保留留稿，回对报告在审查/T-0019/0020/0021-纲文回对.md。

**流程偏差须保留**：19回对报告保存辅助命令发生SyntaxError，编排未检查失败即继续record成功，报告文件在登记后补存；实际全文实读/修改均先于登记。没有倒填存档时刻，没有重prepare或重登。a-resume-report-save-failure.md及19回对报告明确此顺序；原始失败在本次JSONL，不能称全流程无偏差或包装产品缺陷。20/21已先存报告、绑定成功后再单步record。

当前state SHA256：${stateSHA}。机械证明原1—18正文SHA、原1—18登记记录、23项旧ledger和tool_control均与本进程入场相同。新状态仅经CLI登记加入19—21及当前变更，不手写state。原两段SHA仍为${first.chapter.parts[0].sha256}、${first.chapter.parts[1].sha256}。a-resume-prefix-facts-verification.json与a-resume-final-verification.json列证据，不拿哈希证明文学质量。

## 当前分段入口与SHA

|当前段路径|正文Han|SHA256|
|---|---:|---|
${chapters.flatMap(c=>c.parts.map(p=>`|${p.ref}|${p.body_han}|${p.sha256}|`)).join('\n')}

16—18继续以当前主稿及分段/0016-r6、0017-r6、0018-r6为入口；本进程未改。1—3/5—6不新声明分段映射；旧平铺段稿及历史保护区绝对路径保持只读，不resume S旧committed事务。

## 16—21当前六章重新连读

21登记后按16→21全文重新阅读：16 1—122、17 1—120、18 1—98、19 1—120/121—240/241—353、20 1—147、21 1—155，均EOF；31578正文Han，读前后SHA一致。不是拿早先16—18阅读替代。本次报告${reportRef}，SHA256 ${sha(read(reportRef))}；review真实ref ${review.ref}，coverage16—21、quality=review-recorded-not-acceptance。报告列逐章目标/选择/后果/关系、19五接点、各人知情/持有、故事日与承诺，以及具体重复风险/真人语言模块与未核范围。

当前六章未见新高置信硬矛盾；没有修改登记稿。可选保留：19家务与归货较密；16—21多次试路/试拿/归位、否定旁白说明克制偏密；21午前/晚两次空车试位可后续压缩重复步骤。保留安静声音和林自身水事/衣物/理发/读书、何营业/钱/停业成本、许工作及家中盐火柴、陶工钱/返工/自用车需求。未以自检冒充真人盲读/市场/百章/正式验收。

## 当前事实和下一卷待办

故事现在止**十九日晚**。16—18为十六日；19为十七日，20十八日，21十九日。有限讲述、短借幕布、凳夹已按原范围完成，原片/信/节目单仍周控制，两份清稿各自存、林私抄未公开；没有长期新场地、旧片全史或邵全名新增。陈18末报家只有林真实收到，不给其余人自动增知。周陈19—21未出场，旧snapshot是最后已知历史时点，不推断此刻坐处。

新稳定ID共7项：O_RACK_WHEELS、T_RACK_INSPECTION、O_RACK_PATTERN、T_RACK_SAMPLE_VISIT、T_RACK_TRIAL、O_FLAT_CART、T_FLAT_CART_RETURN。前两次检查/看样只有T_RACK_INSPECTION（十八日）和T_RACK_SAMPLE_VISIT（十九日）resolved，货架未修。

- **O_RACK_WHEELS**：何棚下原架仍带货、旧轮装回、砖/纸板复位。常用件孔不合不是已修。许20离场时不知结果，21午后经林才知，没获修架技术。
- **O_RACK_PATTERN**：陶十九日从工具袋拿原纸样出示后收在陶记柜台旁小盒。何林仅看，许只经转述知纸样留陶，没有持物或看照片。
- **T_RACK_TRIAL（pending，due_unit22）**：真实约故事**二十日14:00**陶到何店试配，林13:30帮卸一只，何留另一排营业。何已付新订20，试成总100抵20再付80，试不合轮陶带回、20作此趟出工不退。前一日检查20另已付，不能混作这次订。零件尚未实到/实比，适配、改座或后续返工都未定。许明日下午留铺不能参与，陶未获此工作答复。
- **O_FLAT_CART**：陶清空自物后亲松手、何接管并付车押50，林仅代推；旧前角缺木/掉漆借出时三人实见。末在何店后间靠墙、推把里/墙、车面仅干净硬纸、无货；不挡灶台、水池、饭桌与收布柜。许晚上初见、听何认旧缺角、帮试棚位再空车收回，未见上午借出或付款。车不是修好架的结果。
- **T_FLAT_CART_RETURN（pending，due_unit24为回查点）**：原期限是故事**二十二日18:00前亲交陶本人**，不是二十四日。林来前电话，晚另与何约**二十二日17:00到何店取空车**，何答先空车；陶只知18点收车，许只经林知18点归期、未听17点新安排。陶二十三日早自用，不能擅自顺延。保管何、送回林、本人收车并退押50给何的是陶；保管期损坏何负责。还车/退押均未发生。

押50由陶另夹记账簿一页，押金纸何钱包；试工20便笺何店收据夹。林不持押金纸。下卷应按原期限及已约二十日时段恢复，实到件后才能判断，不通过改due/删账本去门禁。下一客户端准备22—24需要先实读当前19—21及相关旧场景，滚动细化；本进程没有写22细纲、正文或段稿。

## 机械结果与未核范围

最终status/check均ok，registered21、next22，stale_units/changed_sources/impact_pending为空、findings=[]、unregistered=[]；rolling_review valid10/stale7，stale_without_current_coverage0、pending_windows=[]，旧报告未删。doctor errors/warnings均空，identify missing/mismatches均空，工具仍0.9.0/gen3，content_id ${identity.observed_content_id}、runtime_id ${identity.runtime_id}。来源/预算没有拒绝，不移除账本。没有产品/引擎代码修改，未运行npm测试；这些机械结果不替文学或发布验收。

未完整复审2—15、全部旧段/备份/保护区/日志或每条旧证据，未审真实作品及S/Q/R封存、未网络发布、未代父最终审计。所有本次工具调用由原生JSONL捕获；未伪造首进程退出、当前退出或未来承诺已完成。父下一步启动新会话22—24，本客户端在此结束。
`;
const handoffRef='交接/T-A-完成0021.md';
write(handoffRef,handoff);
save('checkpoint-a-complete.json',{status:'client-a-completed-through-21-stop-before-22',at:new Date().toISOString(),native_thread_id:process.env.CODEX_THREAD_ID,registered:21,revision:58,state_sha256:stateSHA,work:work.replaceAll('\\','/'),handoff:{ref:handoffRef,sha256:sha(read(handoffRef))},verification:'a-resume-final-verification.json',report:{ref:reportRef,sha256:sha(read(reportRef)),review_ref:review.ref},chapters,pending_ids:verify.pending_ids,story_day_end:19,next_authorized_client_range:[22,24],no_chapter22:true,current_exit_receipt:'parent-to-capture',process_deviation:verify.process_deviation});
assert.equal(sha(read('.writer/state.json')),stateSHA);
console.log(JSON.stringify({ok:true,registered:21,revision:58,state_sha256:stateSHA,handoff:handoffRef,report:reportRef,stopped_before:22}));
