import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { base, work, read, json, state, sha, save, write } from './common.mjs';

const verification = JSON.parse(fs.readFileSync(path.join(base, 'a-first-final-read-verification.json'), 'utf8'));
assert.equal(verification.total_han, 3707);
assert.equal(verification.state.revision, 55);
assert.equal(verification.state.registered, 18);
assert.ok(verification.files.every(f => f.unchanged));
assert.ok(verification.sources_match && verification.prefix_unchanged);
assert.ok(verification.no_chapter19 && verification.no_parts03_through06 && verification.no_chapter20 && verification.no_registration19);
const fingerprint = ref => ({ ref, sha256: sha(read(ref)), bytes: read(ref).length });
const context = fingerprint('.writer/drafts/t-context-19.json');
const template = fingerprint('.writer/drafts/t-record-19.json');
const plans = [19,20,21].map(n => fingerprint(`交接/T-细纲-${String(n).padStart(4,'0')}.json`));
const sourceChecks = Object.entries(json(template.ref).source_hashes).map(([ref, expected]) => ({ ref, expected, actual: sha(read(ref)), match: expected === sha(read(ref)) }));
assert.ok(sourceChecks.every(f => f.match));
const initialRead = JSON.parse(fs.readFileSync(path.join(base, 'a-first-reading-before.json'), 'utf8'));
assert.equal(sha(read('.writer/state.json')), initialRead.files.find(f => f.ref === '.writer/state.json').sha256);
const report = `# T-A 第十九章真实中断交接

2026-10-20；本次原生线程 ${verification.native_thread_id}。只写T副本，未启动代理、联网、提交或推送。正常结束本进程后，父进程凭同ID恢复；本文件不预造外层退出回执。

## 当前状态与完成边界

作品根：${work.replaceAll('\\','/')}。

实际status/workflow/tool identify/revision list均先于写作，捕获在T/commands/a-first-*。工具0.9.0、schema6、generation3，content_id=730a9e3eaffd691e1ef902722513ba548821ce9f077b35a4ff43bb52e0dbfecc，runtime_id=5010447287bb52f84ef0f76405c20d1cc87dff4bab45a3cb7138eb504894a2f2。无活动修订或未完成事务，不恢复历史committed保护区。

**已登记仍为18章/r55，next_unit19；state未改。** state SHA256：${verification.state.sha256}。当前正文1—18逐份与继承清单同SHA，仅0001及0016—0018为本客户端完整文学实读。第19章只有两个未登记中间段，合计3707正文Han；不是完成章。未写part03—06、未合章、未创建正文/0019.md、未创建T-登记-0019.json、未record19、未开始20。status的unregistered正文清单不列这两个分段，不能据此说没有中间稿。

## 最终段与实际阅读

|文件|正文Han|bytes|SHA256|最终实读范围|
|---|---:|---:|---|---|
${verification.files.map(f => `|${f.ref}|${f.han}|${f.bytes}|${f.sha256}|1—${f.lines}，EOF|`).join('\n')}

两段均在写后完整实读；高置信修正后又完整复读最终两段，最终读前后SHA相同。早期候选指纹、增补前篇幅及最终版本分别保存在a-first-part01-written.json、a-first-two-parts-before-review.json、a-first-two-parts-read-before.json、a-first-final-parts-read-before.json、a-first-final-read-verification.json；没有把候选指纹说成最终指纹。修正包括：part01手机递还只发生一次、手中袋子位置明确；part02面袋口从砖后理出而非承重砖下硬抽、断面改为两捆面、油瓶先落柜边、篮子先端上柜再归回。均仅修改未登记新段。

当前前缀实读：正文0001 1—328、0016 1—122、0017 1—120、0018 1—98，均Complete至EOF，读前后SHA一致，见a-first-reading-before.json及a-first-prefix-reading.json。另完整读取执行指南、作品定位/文风/权威规则/T骨架/T授权、S最终当前入口和当前S完整报告、S/final-report-reading-note.md、V7。S报告第83行的“105写邵全名”按说明只指“想问”，全名仍未知。没有拿S阅读记录替代本次前缀实读。

## 写前来源

prepare命令：node acceptance/20261020-long-flow-090-t/flow.mjs prepare 19，真实成功，revision仍55。plan/context/template捕获分别在commands/plan-19、context-19、template-19；输入在inputs/plan-19.json。

- context：${context.ref}；SHA256 ${context.sha256}；${context.bytes} bytes。真实完整实读范围1—256、257—536、537—799，后两次按准确offset补齐，最终EOF。
- template：${template.ref}；SHA256 ${template.sha256}；${template.bytes} bytes。真实完整实读1—25，expected_revision55、draft为正文/0019.md，summary/changes仍空，不可把它当登记完成输入。
- context --max-chars 240000真实成功，无预算拒绝、无删账本。context的9项omitted_ids只是工具选择结果；本次不动对应旧事，不声称逐条旧证据全读。坏轮recall真实matches=[]，所以旧场景依据直接实读0001，非虚构新增“已登记坏轮ID”。
- 来源逐项SHA核对全部匹配；a-first-writing-sources-before.json / a-first-writing-sources-read.json保存写前来源和真实读取范围，checkpoint-a-first.json另存最终source_checks。未写后重prepare、未替换旧哈希。

19—21近期计划在交接/T-细纲-0019.json、0020.json、0021.json。只有19已由prepare保存为正式单元细纲；20/21仍是近期计划文件，需按19实际新物件、人员、日时及账本ID核定后再各自prepare。全章六段阶段目标、进入状态与未完事在交接/T-0019-分段阶段.md，写在正文之前；第3—6段没有预制正文。

## 已实际发生：动作、知情、物件

- **时间**：十七日早晨至11:10。不是十九日；第18章止十六日晚。part01在10:15后到何店，part02连续卸货、营业，11:08拿自己的袋，11:10实际离店向住处走。
- **林照**：衬衣和长裤在住处盆内，尚未拧晒；水龙头仍滴、下接空碗，歪衣架在椅背。拍龙头及水池照片，亲到陶记认识陶，号码/门址写纸留陶，约十一点半左右上门、来前电话，出工二十且换件另算；目前未付这笔钱，未买新龙头。回程买两个包子，在何店买一袋衣夹并付钱。帮扶箱、递洗衣粉、拆分纸巾、取放面、让取货路；看见歪裂轮、砖及折纸板，听何早上添纸板、司机自己的推车经历。说可以向陶提货架；尚未实际告诉陶。末持自己的食物/衣夹袋、手机钥匙向住处走，未到家、未接到陶电话。
- **何岚**：实际收货、按营业取放、接客、核单并减退两捆压断的面；签收并核钱数，正文没有明确写货款已付，不可增记“现金结清”。知道林约陶修家中龙头及十一点十分离开；答应可提架，不许直接带两轮来，尚未与陶新见或约修架。留下整箱纸巾待下午有人取，地面洗衣粉及侧门边新货仍待归位，继续称糖营业。其店货架仍垫砖，旧坏轮未拆未换、没有带货硬推，没有卸空整个架。
- **陶师傅**：新增配角，实际只在五金铺出场，正在做且要送装纱窗，有原顾客来催。知道林家龙头滴水、所在巷子/树及电话；答十一点半左右来、出工二十和换件另算；未诊断内部、未修、未收钱。**不知道林在何店看架的事**，没有答应免费顺路修架。
- **送货人**：何与林在场实际接触，无姓名。要赶下一站及退货；亲说自己车上推车换轮后的高度问题，仅是他的经验，不是何货架的诊断。带回减掉的两捆面、带走空纸板，关车门后已经离开。没有借工具给林何。
- **许、周、陈**：本两段没有出场、电话或被转述，不自动获得新知。许仍只有旧稿所见技能，没有获派修架任务。陶与送货人不自动知道17有限讲述、私信或片史。
- **旧物延续**：原片/信/节目单仍周控制；周份清稿仍抽屉袋，林清稿/私抄分放在住处（part01只说纸夹留柜，没有抽稿）。幕布18已还何收柜，未再借取；原两只木夹不是新买衣夹，不能混作借物。新段无新工具/样件交接，没有新长期场地。

## 纲文回对与恢复入口

19 beat1落实于part01：泡衣/漏水、陶上门与收费约定、买夹、收货和11:10离开上限。beat2落实于part02：赶下一站、坏轮砖/纸板实际露出、货物与顾客通行、11:10林真实离店且何独担余货。接点是part01最后“接稳箱底…朝空地走”→part02首句“洗衣粉落在侧门内的干地上”，没有二次开始卸货。

beat2原计划称不能“兼顾晒衣、接师傅和继续帮卸”，实际落在湿衣至11:10未晒、到点离开，并非师傅已经催到家门；这个差别必须保留。beat3—6均**未写**：陶未到家、修龙头/支付未发生，午后看架测量和师傅看店未发生，傍晚衣物后果及明日安排未发生，不得写入summary/changes。

同ID恢复先核status/workflow/tool identify/revision list及本两段SHA，实际重新完整读两段，再接part03。**从十七日11:10林沿巷往住处走接起**，先到家处理仍泡着的两件衣服，等陶来前电话和约十一点半上门；不要重写上午、不把未发生支付与修好倒填进来。当前有效来源均还匹配；若父会话在中断间正式修订或换来源，保留本模板/context及段字节，先核差异和相关旧文，另取新来源并证明两段不变，不只刷新哈希。后四段结束、合章及record19由恢复进程依授权实际完成。

## 硬问题、可选意见、未核范围

硬问题：本次已实读当前前缀和最终两段未发现需父进程正式修订旧主稿的新硬问题。新稿明确问题已在授权内改并复读。未改任何已登记章。

可选意见：后四段要通过实际修水、整理货位、有限看架与各自晚间生活展开，别把本两段再扩写成反复谈边界。19尚未完成，不能判断全章11000Han后的节奏或本卷文学结果。

未核范围：未完整读2—15章、全部旧分段、备份、保护区及每条旧证据；inherited-baseline.json仅人工读1—100，18项正文SHA另机械核，不称全文阅读该清单；初期广域文件目录分页未作为完整盘点。根与作品随附writer-project/writer-novel技能指纹相同，本次读根技能及长章/长篇参考；没有声称独立读完每个随附副本。没有进行真人盲读、市场、发布或产品回归；无产品/引擎修改，未运行npm测试。不把中间段、自检或状态机械一致当正式文学验收。
`;
const handoffRef = '交接/T-A-中断0019.md';
write(handoffRef, report);
const checkpoint = {
  status: 'interrupted-unregistered-chapter19-after-part02',
  at: new Date().toISOString(),
  native_thread_id: verification.native_thread_id,
  process_exit_receipt: 'parent-process-to-capture-after-this-client-exits',
  work: work.replaceAll('\\','/'),
  state: verification.state,
  state_unchanged_from_entry: true,
  tool: {version:'0.9.0',generation:3,content_id:'730a9e3eaffd691e1ef902722513ba548821ce9f077b35a4ff43bb52e0dbfecc',runtime_id:'5010447287bb52f84ef0f76405c20d1cc87dff4bab45a3cb7138eb504894a2f2'},
  chapter: {unit:19,title:'挪不开的半步',planned_parts:6,written_parts:2,body_han:verification.total_han,target_body_han:[10500,12500],registered:false,assembled:false,parts:verification.files},
  sources: {context,template,source_checks:sourceChecks,all_match:true,expected_revision:55,context_actual_reads:[[1,256],[257,536],[537,799]],template_actual_reads:[[1,25]],max_chars:240000,budget_rejected:false},
  nearby_plans: plans,
  handoff: fingerprint(handoffRef),
  stage_plan: fingerprint('交接/T-0019-分段阶段.md'),
  prefix_binding:'a-first-prefix-reading.json',
  final_read_binding:'a-first-final-read-verification.json',
  constraints: {no_part03_06:true,no_assembly:true,no_record19:true,no_chapter20:true,no_state_edit:true,no_product_edit:true,no_s_q_r_write:true,no_network:true,no_agents:true,no_git_commit_push:true},
  next: {part:3,story_day:17,time:'11:10',place:'林照从何店离开、正沿巷往住处走',action:'实读两段后承接回家、泡衣未晒、等约11:30陶来前电话；后四段均无正文',unfinished:['修自己龙头、费用与支付尚未发生','何店余货和坏轮未修','尚未向陶提架、未测安装处','无工具或样件借还','尚未约明日或写傍晚']},
  authorizations: {scope:'T-only native client A first interruption',workflow_stage:'trial',original_allowed_draft_range:{from:19,to:30},this_process_stop:'after actual part01 and part02'},
  quality:'model-self-check-of-read-prefix-and-two-unregistered-parts; not chapter completion or acceptance'
};
save('checkpoint-a-first.json', checkpoint);
save('interruption-report-a-first.md', `# T-A简短中断报告\n\n仅在T副本写第19章part01/02，共3707正文Han（1821+1886），最终两段已完整实读并冻结SHA；19章仍未完成/未登记。\n\n状态保持18章/r55/schema6/gen3，state SHA ${verification.state.sha256}。19—21近期细纲及19六段阶段目标已保存，22—30未细化。未写part03—06、未合章、未record19、未开始20。\n\n恢复点：十七日11:10，林照离何店往住处走；陶约11:30来前电话，尚未到家/修水/付费，何坏架仍垫砖未修。父进程使用同ID ${verification.native_thread_id} 恢复前须实读两段。\n\n详见scenario/雨棚后的灯/${handoffRef}及checkpoint-a-first.json；原生退出回执由父进程随后捕获。本报告不是全章完成、文学验收或本轮封存。\n`);
assert.equal(sha(read('.writer/state.json')), verification.state.sha256);
assert.equal(state().units.length,18);
assert.equal(state().revision,55);
assert.ok(verification.files.every(f=>sha(read(f.ref))===f.sha256));
console.log(JSON.stringify({ok:true,status:checkpoint.status,body_han:3707,registered:18,revision:55,handoff:handoffRef,checkpoint:'checkpoint-a-first.json'}));
