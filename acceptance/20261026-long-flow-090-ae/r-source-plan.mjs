import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
const A=path.dirname(fileURLToPath(import.meta.url)),P=JSON.parse(fs.readFileSync(path.join(A,'project.json'))).project;
const sha=b=>crypto.createHash('sha256').update(b).digest('hex'),s=JSON.parse(fs.readFileSync(path.join(P,'.writer/state.json')));
const write=(f,v)=>{fs.mkdirSync(path.dirname(f),{recursive:true});fs.writeFileSync(f,v,{flag:'wx'});};
const specs=[
 ['01','大纲/单元/0054.json',54,54,null],['02','大纲/单元/0059.json',59,59,'AD_E_S03_NEW'],
 ['03','大纲/单元/0060.json',60,60,'AD_E_S04_NEW'],['04','研究/AD-D滚动写前核对.md',58,60,'AD_E_S05_NEW'],
 ['05','研究/AD-DR-60返工核对.md',60,60,'AD_E_S06_NEW'],['06','研究/AE规划与旧线证据.md',61,66,null],
 ['07','大纲/分卷/V22.json',61,63,null],['08','大纲/分卷/V23.json',64,66,null]
];
// Verify the actual ref for S05 instead of silently selecting a similarly named file.
specs[4][1]=s.source_versions.AD_E_S06_NEW.ref;
const note=`\n\n## AE-R 受控修订候选的生效说明（2026-10-26，尚未发布/尚未改稿）\n\n上文是原阶段真实计划、消费与阅读记录，原引句、哈希、D/E/B阶段事实和规划首停权限均作为历史保留。以下是本次独立样本控制器已激活的普通fixture候选，并非作者新增逐项原话；只有正式修订发布、54—66完整重登及事务提交后才成为新历史。\n\n本版本拟自本来源的实际消费者起生效：54新购可调光窄长灯头灯净价74，付100找26（一张20、一张5、一枚1元硬币）；48扁灯与82圆灯仍是未选比较，48至74相差26。54购买票及55饭间女儿回述须对应74；60计划的72旧口径由本版本替代。未修旧灯、旧留物条/原票、女小灯互相独立，旧留物条不记新购74。\n\n59是第47日周五原16:30约见；女主动报晚20分钟、16:50到，沈16:30先到仍独看，17:11收书起身，实坐约21分钟，口语为二十来分钟。女出门低头看钟改为四点四十刚过，使步行至16:50的经过承接；不是改变58原约、不是新约延期至17:20。61回述的星期五半小时和赔那一刻相应改为二十来分钟/二十分钟。64所约、65第53日周四16:45画画完全是另一事件，不改。\n\n旧AE新增骨架中60入口72及62/59的晚一刻比较属于旧输入/未来计划，保持原字节；执行新口径时以本有效新研究及0054/0059/0060新单元计划、V22/V23新契约和纲文回对为准，不把旧计划当已发生事实。相较旧规划的具体偏离只限上述价格、找零、迟到和实际共坐时长。\n\n柜修46+16=62及70找8（5+三张1元纸币）、62章四盒订单40和12:40新批、14花册/8册及原白纸、原纸浅抽/65画不展示、两录私有、两空未填、脚伤/杖/脚凳、停航均不改变。O_BOX_PAINT原类型/陈述/作者真相保持。33未发布、13optional、49retained、原9已采用历史保持。首次保护停程只读，不改稿、不rewind、不发布、不重登或commit。\n`;
const rows=[];
for(const [n,ref,from,through,existing] of specs){
 const old=existing?s.source_versions[existing]:null,bytes=fs.readFileSync(path.join(P,old?.object_ref??ref));
 const consumed=s.units.filter(u=>Object.hasOwn(u.source_hashes,ref));
 if(!consumed.length||consumed.some(u=>u.source_hashes[ref]!==sha(bytes)))throw Error('Not equivalent actual consumer '+ref);
 let text=bytes.toString('utf8'),candidate;
 if(n==='01'){
  const j=JSON.parse(text);j.goal+='；AE-R受控候选：本章新灯净价74，100找26（20+5+一枚1元硬币），48至74价差26；尚未改稿/发布。';
  j.forbidden.push('新灯74与未修旧灯、女小灯、柜修62、旧门总50各自独立；旧留物条不记新购价。原作者观察与核心选择不改。');candidate=JSON.stringify(j,null,2)+'\n';
 }else if(n==='02'){
  const j=JSON.parse(text);j.goal=j.goal.replace('晚15分钟','晚20分钟');j.beats=j.beats.map(x=>x.replace('晚15分钟到16:45','晚20分钟到16:50').replace('女约16:45实际到场','女约16:50实际到场').replace('共同余半小时','至17:11收书起身共同约21分钟（二十来分钟）'));
  j.forbidden.push('58原约16:30、约17:15离开的上限不改；59女出门四点四十刚过，16:50刚过落座、17:11收书；61回述对应20分钟迟到/二十来分钟共坐。64/65新周四16:45画画不改。');candidate=JSON.stringify(j,null,2)+'\n';
 }else if(n==='03'){
  if(!text.includes('72'))throw Error('No old lamp in60');const j=JSON.parse(text);j.beats=j.beats.map(x=>x.replace('72','74'));candidate=JSON.stringify(j,null,2)+'\n';
 }else if(n==='07'||n==='08'){
  if(!text.includes('母灯净72'))throw Error('No contract price');candidate=text.replaceAll('母灯净72','母灯净74');
 }else candidate=text+note;
 if(candidate===text)throw Error('No candidate change '+ref);
 const ext=path.extname(ref),file=`研究/AE-R来源候选/S${n}${ext}`;write(path.join(P,file),candidate);
 const oldCopy=`r-old-sources/S${n}${ext}`;write(path.join(A,oldCopy),bytes);
 rows.push({n,ref,from,through,existing_old_version:existing,old_version_id:existing??`AE_R_S${n}_OLD`,new_version_id:`AE_R_S${n}_NEW`,old_sha256:sha(bytes),candidate_file:file,candidate_sha256:sha(Buffer.from(candidate)),old_copy:oldCopy,consumers:consumed.map(u=>u.unit),old_binding_needed:!existing});
}
const evidence=JSON.parse(fs.readFileSync(path.join(A,'b-resume-workflow66-input.json'))).author_evidence;
evidence.locator='研究/AE作者任务.md第9—15行原话；本次已激活R首程控制器要求独立fixture有限revise54—66并保存只读保护首停。74/20为待实际核实的普通fixture候选，不冒称作者新增逐项原话。';evidence.recorded_by='AE R native 01a17511-c2b0-79a3-bf72-0f77373bfce2';
const workflow=JSON.parse(fs.readFileSync(path.join(A,'b-resume-workflow66-input.json'))).workflow;
workflow.stage='revision';workflow.task='AE R受控旧章修订54—66。54净价72→74、59迟到15→20/16:45→16:50经实读判断可作普通fixture。首程只做旧新冻结、影响实读/stage和revision begin，再在受保护workspace完整重读54/59后停。不改正文、不rewind、不publish新历史、不重登、不prepare/commit；不draft。';
workflow.authorization={allowed_actions:['discuss','plan','revise'],draft_range:null,revise_range:{from:54,to:66},stop_conditions:['任何不可变观察/作者核心选择冲突或未知影响未解则停，不强stage。','先在main冻结/stage，之后才revision begin；保护区首程仅实读。','实际正文依赖为54、55、59、61，后续重登54—66全部；不同事件不全局替换。','保存完整main/workspace字节checkpoint，核完后不再写作品；同ID恢复前两个checkpoint均须先核字节再官方resume。','保留旧33/13optional/49retained/9已采用，原文及失败历史不删除。']};
for(const v of Object.values(workflow.planning))v.reason='本R首程完整实读main54—66，实际消费版本与历史骨架区分。有限受控候选，先freeze/impact/stage后begin，只读保护首停；不把规划当事实。';
workflow.planning.outline.refs=['大纲/单元/0054.json','大纲/单元/0059.json','大纲/单元/0060.json','大纲/AE新增骨架-61-66.md'];
write(path.join(A,'r-source-plan.json'),JSON.stringify({at:new Date().toISOString(),entry_revision:s.revision,native_id:process.env.CODEX_THREAD_ID,rows,author_evidence:evidence,scope:{from:54,through:66},no_prose_change:true},null,2)+'\n');
write(path.join(A,'r-workflow-input.json'),JSON.stringify({expected_revision:s.revision,operation_id:'AE_R_FIRST_WORKFLOW_54_66',author_evidence:evidence,workflow},null,2)+'\n');
write(path.join(A,'r-entry-unit-baseline.json'),JSON.stringify({revision:s.revision,units:s.units,observations:Object.entries(s.snapshot.ledger).filter(([,v])=>v.type==='observation'),source_ranges:s.source_ranges,review_workflow:s.review_workflow,decisions:s.decisions},null,2)+'\n');
console.log(JSON.stringify(rows,null,2));
