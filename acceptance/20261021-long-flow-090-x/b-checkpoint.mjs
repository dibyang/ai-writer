import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
const X=path.dirname(fileURLToPath(import.meta.url)),P=path.join(X,'scenario/东岸末班船-再扩展验证');
const bytes=r=>fs.readFileSync(path.join(P,r));
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const json=r=>JSON.parse(bytes(r));
const s=json('.writer/state.json'),parent=JSON.parse(fs.readFileSync(path.join(X,'parent-before-b-state.json')));
const meta=r=>{const b=bytes(r);return {path:r,sha256:sha(b),bytes:b.length,lines:b.toString('utf8').split(/\r?\n/).length,body_han:(b.toString('utf8').replace(/^# .*\r?\n/,'').match(/\p{Script=Han}/gu)||[]).length};};
const put=(r,v)=>{fs.mkdirSync(path.dirname(path.join(X,r)),{recursive:true});fs.writeFileSync(path.join(X,r),typeof v==='string'?v:JSON.stringify(v,null,2)+'\n',{encoding:'utf8',flag:'wx'});};
const finalLabels=['b-final-status','b-final-check','b-final-doctor','b-final-revisions'];
const outputs=Object.fromEntries(finalLabels.map(n=>[n,JSON.parse(fs.readFileSync(path.join(X,'cli-logs',n,'stdout.raw.txt')))]));
const commandResults=fs.readdirSync(path.join(X,'cli-logs')).filter(n=>n.startsWith('b-')).map(n=>JSON.parse(fs.readFileSync(path.join(X,'cli-logs',n,'result.json'))));
const base=JSON.parse(fs.readFileSync(path.join(X,'baseline-worktree.json')));
const changed=base.files.filter(v=>!fs.existsSync(path.join(P,v.file))||sha(bytes(v.file))!==v.sha256).map(v=>v.file);
const current=s.units.map(u=>({...meta(u.draft),unit:u.unit,unit_hash_matched:sha(bytes(u.draft))===u.sha256}));
const observations=Object.entries(parent.snapshot.ledger).filter(([,v])=>v.type==='observation').map(([id,v])=>({id,equal:['type','statement','author_truth'].every(k=>JSON.stringify(v[k])===JSON.stringify(s.snapshot.ledger[id]?.[k]))}));
const parts=['分段/0029-B/01-四点十分-v2.md','分段/0029-B/02-柜前先亮的灯-v2.md'].map(meta);
const template29=json('.writer/drafts/b-template-29-r127.json');
const sources29=Object.entries(template29.source_hashes).map(([r,h])=>({path:r,expected:h,current:sha(bytes(r)),same:sha(bytes(r))===h}));
const assembly=json('.writer/b-inputs/assemble-28-v2.json');
const joined=Buffer.concat(assembly.parts.flatMap((v,i)=>[...(i?[Buffer.from(assembly.separator)]:[]),bytes(v.path)]));
const skills=['writer-project/SKILL.md','writer-novel/SKILL.md','writer-review/SKILL.md','writer-project/references/long-form.md','writer-novel/references/chapter-delivery.md','writer-review/references/general-review.md','writer-review/references/natural-language-authenticity.md'].map(r=>({ref:r,root_equals_tool:bytes('.agents/skills/'+r).equals(bytes('.writer/tool/.agents/skills/'+r))}));
const proof={at:new Date().toISOString(),revision:s.revision,state_sha256:sha(bytes('.writer/state.json')),registered:s.units.length,next_unit:s.units.at(-1).unit+1,
 protection:{all24_units_equal:JSON.stringify(parent.units.slice(0,24))===JSON.stringify(s.units.slice(0,24)),all27_units_equal:JSON.stringify(parent.units)===JSON.stringify(s.units.slice(0,27)),all27_drafts_equal:current.slice(0,27).every(v=>v.unit_hash_matched),observations,baseline_file_count:base.files.length,changed_baseline_files:changed,unit29_absent:!s.units.some(u=>u.unit===29),no30plan:!fs.existsSync(path.join(P,'大纲/单元/0030.json')),no29full:!fs.existsSync(path.join(P,'正文/0029-五点进门以后-v1.md'))},
 tool:outputs['b-final-status'].tool_control,skill_equivalence:skills,current_drafts:current,
 chapter28:{assembly_input:meta('.writer/b-inputs/assemble-28-v2.json'),parts:assembly.parts.map(v=>({...meta(v.path),input_hash_matches:sha(bytes(v.path))===v.sha256})),assembled_bytes_match:joined.equals(bytes(assembly.draft)),draft_review:s.units.at(-1).draft_review,report:meta(s.units.at(-1).draft_review.report),record_input:meta('.writer/b-inputs/record-28-final-v2.json'),preview_and_record_same:fs.readFileSync(path.join(X,'cli-logs/b-preview28/input-1.raw.json')).equals(fs.readFileSync(path.join(X,'cli-logs/b-record28/input-1.raw.json')))},
 chapter29_unregistered:{parts,total_han:parts.reduce((a,v)=>a+v.body_han,0),template:meta('.writer/drafts/b-template-29-r127.json'),context:meta('.writer/drafts/b-context-29-r127.json'),context_chars:JSON.stringify(json('.writer/drafts/b-context-29-r127.json')).length,sources:sources29,omitted_ids:json('.writer/drafts/b-context-29-r127.json').continuity.recall.omitted_ids},
 final:{status_ok:outputs['b-final-status'].ok,check:outputs['b-final-check'],doctor:{ok:outputs['b-final-doctor'].ok,errors:outputs['b-final-doctor'].errors,warnings:outputs['b-final-doctor'].warnings},revisions:outputs['b-final-revisions']},commands:commandResults.map(v=>({label:v.label,exit_code:v.exit_code,before:v.before_state_sha256,after:v.after_state_sha256})),failures:commandResults.filter(v=>v.exit_code!==0)};
if(s.revision!==127||s.units.length!==28||!proof.protection.all27_units_equal||!proof.protection.all27_drafts_equal||observations.some(v=>!v.equal)||sources29.some(v=>!v.same)||!proof.chapter28.assembled_bytes_match||parts.reduce((a,v)=>a+v.body_han,0)<3000||parts.reduce((a,v)=>a+v.body_han,0)>4500)throw Error('checkpoint invariant failed');
put('B首停保护核验.json',proof);
const rows=current.map(v=>`|${v.unit}|${v.path}|${v.sha256}|${v.body_han}|`).join('\n');
const ps=parts.map(v=>`|${v.path}|${v.sha256}|${v.body_han}|`).join('\n');
const srcs=sources29.map(v=>`- ${v.path}：${v.current}`).join('\n');
const text=`# X-B新鲜首次首停交接

本文件供根独立核验，正常退出，等根以同ID恢复；不是根验收。P=${P.replaceAll('\\','/')}。当前revision **127**，登记1—28，next_unit29；state SHA256 **${proof.state_sha256}**。29只写两段，不assemble、不record、未进入state事实。没有创建30/31单元纲或正文。

## 任务、入口与工具

首产品调用b-entry-status，和parent-before-b-state.json逐字节同r123/27章，SHA878e45ef62f9658d76636f4c58025091a06843d80c429ff720b7842db46a128f。随后workflow show/revision list/tool identify/doctor/discussion均0，无活跃修订及待恢复事务。共同prompt、真实author-request、continuity-watchpoints及交接-A完成.md完整读过；README旧阶段文字不覆盖当前r123/27事实。核查提示没有升级成25已错。

所有产品CLI经X/x-writer.mjs唯一b-标签进入P/.writer/tool；写与out串行，未另派代理，未改根源码/作者作品/旧封存，无提交推送、封存导出、发布、付费或全局配置。技能根读到的七文件与当前tool包逐字节相同，核验见B首停保护核验.json。工具generation3，0.9.0，content553de8f8a42c7bc7ff5f04f78703ed423d17dd69c21ff640ebd8c5c11c570ec2，runtime7fde4277424d98312d67d9db142301ee02d4805c6f5ae095b20b3d1544e0042f，未tool update。unit28原生记录中的tool_build_id保留CLI实际返回值6a744c73a662ac5023dee12bedd0426ceb30f0d64df5c887279ee0235dfd9c0b，不手改它代替实际identify。

r124正式outline/discuss+plan/null范围，plan实际建28；r125采用真实28与新近期执行纲/有限28—30，r126记28；plan实际建29后r127采用，现stage=trial，范围28—30但本首次停点明确29两段即停。30末25—30六章复盘留同ID恢复，不假造已做。真实扩大请求原文与B执行任务分开保存研究/X-B作者请求-原文.md、X-B首次执行指令-原文.md；附带细节由执行代理负责，不称作者逐项采纳。旧骨架/V10—V13/已消费来源原字节保持；本轮新增大纲/X-B近期执行纲-28-30.md，不就地改旧稿刷新哈希。

## 本次真实实读

read-boundaries/b-entry-current-before.json 07:24:06.303Z→after.json 07:27:16.525Z：r123当前22→27原生FastCtx完整单调逐章读，每页limit100、Partial精确续页，窗口间未插state/正文写入。before/after的state/units/snapshot/六章SHA一致；原文工具返回供根核，不以旧A报告替代。另按三链recall回读25:141—230/231—290和27:179—253，27:38—48在稳定全文里。28初合章v1和最终v2各原生完整读1—100/101—200/201—271；29两个v1和最终v2各原生完整读1—40/1—44。28与29context真实保存、读回，显式65000预算，无静默截断。29context紧凑字符${proof.chapter29_unregistered.context_chars}，omitted_ids23项均旧已结/另链，未当不存在；旧早糕试行不等于本次周一早班。

## 第28章当前交付

**正文/0028-走远一点的路-v2.md**，${current.at(-1).body_han}正文汉字，SHA **${current.at(-1).sha256}**，六事件段。由01—05-v2及06-v3实际SHAassemble，空白separator，逐字节一致。报告审查/X-B28最终合章自检-v2.md，SHA **${proof.chapter28.report.sha256}**；冻结${s.units.at(-1).draft_review.frozen_ref}。同一最终输入.writer/b-inputs/record-28-final-v2.json SHA${proof.chapter28.record_input.sha256}，b-preview28子码0后b-record28同输入子码0。报告包括有效纲回对、五beat展开六场的自然变化、四语言测试、硬问题/整体风险/保留项；知情模型自检而非真人或文学正式验收。

故事到第二十一日星期日夜：母第二洗工装，晚仍凉在窗边绳；鞋实付100找62净38，新灰鞋回家/上岗，旧鞋门边纸待刷；18:30钥匙交何。女照本周换班至5点多，饼自己买吃/回家粥，裤外缝与里布薄两问题纸记/拍照，裤旧练布扣针盒仍备课袋未拆。沈分装收糕款，老板电话回告明日午前若到车帮落粉干板条件，干货另买；晚备父一碗粥冷藏、设4:10。周16点关铺步行买皂实付、16:58开门，纱门看照只约明日18前再问，未报价未修，跟26女人下周六8:30房门不同。许周在候船室仅谈眼前鞋/步行，没有互知茶/课堂。姑娘直到28夜沈消息才知周一早班，并发裤照；沈只看照不会教，父只听所述早班与分糕，仍站久脚酸需垫，画册合归沈床头里侧/白纸原页。

## 第29章未完，禁止将以下进度混进state

标题五点进门以后。最终两段共 **${proof.chapter29_unregistered.total_han}正文汉字**：

|未登记片段|SHA256|正文汉字|
|---|---|---:|
${ps}

01实际写到第二十二日周一4:10起床/取消次日重复闹钟、父喝床头水/仍床上慢挪伤脚，粥有柄碗仍冷藏未热，4:32出门，4:58店前，5点门槛。02直接跨门接：老板自述4点已来，两人吃昨晚另存冷藏热糕，合力移第一笼、早客两份实付/普通晨客半份实付（金额没写不造）；今日早做不是永久早取，老板给送粉钱单单独袋/杯压号码，沈复点金额但数字未露，未付款；5:32老板离店往车向，沈只目送未见上车/购货；六点过后沈刚向空篮客问三人吃法，客改按两人切，**还没切/收这笔钱**。下一段从这个真实柜前动作接；送粉/下午交接/父热粥/周纱门再问均未写。上午手机在柜后屏幕朝上，姑娘暂无新消息；包后干钩/外衣脱/自围裙、空饭盒柜内留位、送粉钱袋与售糕零钱分开。父床头灯自己拧亮，门半开，不证明早餐已吃；母衣/鞋、女裤、周和廖均停28已登记状态，不因29未写而补造。

原写前模板 **.writer/drafts/b-template-29-r127.json**，SHA${proof.chapter29_unregistered.template.sha256}，expected_revision127，summary仍空、changes空，未伪填全天。真实context .writer/drafts/b-context-29-r127.json SHA${proof.chapter29_unregistered.context.sha256}；29细纲SHA6db9de8e473bd23ee292beea6a63be57a108445dce7c0336711d6233924f10ec。14来源全部当前同SHA：

${srcs}

下一同ID必须先status/workflow/revision/identify/doctor及实际交接恢复，核这两个v2字节、原模板/来源和28当前稿，实读片段再接，不能重写28或重开29。来源若真变，保留旧模板并核变化再另取，不只刷新哈希。下一有限范围仅29后段、30（真实plan/context/template后写重点>=10000、至少5段），30record后当前25—30完整稳定连读/比较/正式review，届时再paused仅discuss/null；不写31。仍以根新的同ID续程指令为准。

## 三链、钱时伤情和历史

- T_X_COAT_DAILY first25/latest28，partial due33：25穿洗一次、26干后短试、27再穿久靠有限感；28只第二洗未干未穿，女记星期日又洗。不能由洗字面说多次用感已全部交回/永久耐用。
- T_X_TEA_AFTER_WORK first25/latest27，pending due32：25约下周四14—16，26改另门至下周六8:30/廖腾家两椅洗壶，27互告；28私人步行不是赴廖家，实际茶仍未发生。
- T_X_BOOK_COMPANY first25/latest27，pending due35：原25下下周日14点，26沈整日问准、27女12:30交完午后不返/前日告变；当前约定未写成最近这个周日，不按due章号推日期。28裤照/早班消息是日常交流，同行各选自付/店未来营业仍未知。

W旧链：24第二课补四边/还借针、21成凳结84后23/24搬收/27营业位、24浅蓝袋短行小修仍合均保留；原箱押金80、原门35、柜26+55=81、旧锅38、风扇27净16收交均不重开。鞋38是新独立款，饼/米/皂/分装糕数目没写不补。每周三19—20:30共90分钟、净宽27/长90/高44保留；19题真实提前的一个半钟头但路径两个钟头是历史定位；22第十五日15:24到/15:30还书，不混15章另日店主15:30出门。父脚未愈/袋空挂椅外；两旧问路者真正终点未知，停航无新复航通知。

## 保护、失败及终检

与parent-before-b-state相比原1—27完整units及正文均同，尤其原24完整保护；全部原observation type/statement/author_truth同。3919个起始baseline文件仅.writer/state.json正式推进不同；各当前稿哈希及原片段/旧报告保护证据见B首停保护核验.json。A完成/首停、25v1、26v1、27v1/v2、28初合章v1和全部旧分段留为历史，不合回当前。

真实失败：b-context28误指定.writer/b-inputs输出，子码2（包装进程工具显示1）、state仍r125；停止依赖，b-context28-help实际核帮助，b-context28-v2改为.writer/drafts后子码0。失败原双流/输入/前后state全在cli-logs保留。28局部修后另存01—06-v2，初合章读到倒米汤/洗锅顺序错后另存06-v3并新合章v2/全读重绑定。29两段v1→v2明确床头灯动作、早上指代、未知店门积水原因、沈口气/五金来人“您”指代，不触旧稿或state。没有产品修复、升级或隐瞒失败。

本次首轮终检status/check/doctor/revision list均0，同一当前state；stale_units/changed_sources/impact_pending为空，doctor errors/warnings为空。历史五committed修订/八completed事务，无活跃或待恢复。check仅mechanical-only、literary_quality=unreviewed；14个UNREGISTERED_DRAFT warning为13个旧候选加28初合章v1。29只在分段目录，status不列它不等于不存在。rolling valid13/stale18且18都有current coverage，pending_windows为空只是当前未到30，不是25—30已审。两条A optional_style仍open未采纳未改。

本交接保存后再做退出四项只读产品调用，结果单独保留cli-logs/b-exit-*，不再改state或继续创作。正常退出供根核首停。

## 全部当前登记稿

|章|当前路径|SHA256|正文汉字|
|---:|---|---|---:|
${rows}
`;
put('交接-B首停.md',text);
console.log(JSON.stringify({ok:true,revision:s.revision,state_sha256:proof.state_sha256,protection:proof.protection,parts29:parts,total29:proof.chapter29_unregistered.total_han,failures:proof.failures.map(v=>({label:v.label,exit_code:v.exit_code})),check_warnings:proof.final.check.findings.length}));
