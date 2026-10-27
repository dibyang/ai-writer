import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const X=path.dirname(new URL(import.meta.url).pathname.replace(/^\/(.:)/,'$1'));
const P=path.join(X,'scenario/东岸末班船-再扩展验证');
const h=b=>crypto.createHash('sha256').update(b).digest('hex');
const read=r=>fs.readFileSync(path.join(P,r));
const put=(r,v)=>{const f=path.join(P,r);fs.mkdirSync(path.dirname(f),{recursive:true});fs.writeFileSync(f,typeof v==='string'?v:JSON.stringify(v,null,2)+'\n',{flag:'wx'});};
const s=JSON.parse(read('.writer/state.json'));
const parent=fs.readFileSync(path.join(X,'parent-before-d-state.json'));
if(!parent.equals(read('.writer/state.json'))||s.revision!==149||s.units.length!==33) throw Error('entry mismatch');
const files={};
for(const u of s.units){files[u.draft]=h(read(u.draft));if(files[u.draft]!==u.sha256)throw Error(u.draft);}
for(const dir of ['大纲','设定','分段']){const walk=d=>{for(const ent of fs.readdirSync(path.join(P,d),{withFileTypes:true})){const r=d+'/'+ent.name;if(ent.isDirectory())walk(r);else files[r]=h(read(r));}};walk(dir);}
fs.writeFileSync(path.join(X,'D入口保护核验.json'),JSON.stringify({revision:s.revision,registered_count:s.units.length,parent_state_sha256:h(parent),live_state_sha256:h(read('.writer/state.json')),identical:true,files,units:s.units,observations:Object.fromEntries(Object.entries(s.snapshot.ledger).filter(([,v])=>v.type==='observation').map(([id,v])=>[id,{type:v.type,statement:v.statement,author_truth:v.author_truth??null}]))},null,2)+'\n',{flag:'wx'});
const req='X轮新鲜D首次，不复用旧线程。先完整读X/prompt-common.md、author-request.md和continuity-watchpoints.md，其边界全部适用；核查提示不等于已确认错误；本次仅写34整章及35约前两段，35不合章/不登记；完成真实分段中途停点正常退出，之后根同ID恢复35/36。不得提前写37或赶完本轮三章。X=D:/work/other/ai-writer/acceptance/20261021-long-flow-090-x，P=X/scenario/东岸末班船-再扩展验证，全部CLI经X/x-writer.mjs唯一d-标签，禁止另派代理/改原作品或旧封存/提交推送。';
put('研究/X-D首次执行指令-原文.md','# X-D本次执行指令\n\n'+req+'\n\n出处：2026-10-21当前任务消息的首段，记录执行范围；没有可用消息ID，不编造。author-request.md为根记录的实际作者扩大实跑授权，prompt-common.md为代理任务共同约束。本文不把代理常规情节选择记作作者逐项采纳。\n');
put('研究/作者请求-X-D-副本.md',fs.readFileSync(path.join(X,'author-request.md'),'utf8'));
put('大纲/X-D近期执行纲-34-36.md',`# X-D近期执行纲：一起看一会儿\n\n沿用扩大骨架X与V13/A13，旧V10—V13及已消费细纲均保留原字节。下列是代理在已有授权内选择的常规情节安排，作者未逐项确认细节。\n\n34《明天的空处》：接第26日周五夜，推进至第27日周六。五实际事件段。女儿照常上工、核次日12:30交完；许蓉自己洗昨日工装，今日换衣值守，不再做同款检测。周岸按既有周六8:30另一门之约现场看普通房门，与主人把需要腾空和未来工时说清，不与30纱门混为一门；午后原松椅待胶后有限试用、实际交还收原20，保留刻痕。沈禾与谭老板落实明日原准整休的交接，回家接父亲借的原画册，父亲有自己的看画意见，伤脚仍需歇。晚两姑娘真实互告班没变、明确明日周日14点原书店门前，未保证开门，不提前选书付款；各自安排午饭和出门物。篇幅至少8000正文汉字，五段各有不同选择与后果。\n\n35《一起翻到下一页》：第28日周日，承接34夜。全章未来目标为两姑娘14点会面、实际同行/各看各选，钱各自付或选择不买。本次只写前两段约3000—4500正文汉字：沈早晨休息及父女午饭/画册，姑娘12:30真实交完班吃饭，赴店前或门口真实相会作为中途停点；若已到门口，仍不写成整章及整链回收。后续同ID先实读片段接未完动作，再补其余段。\n\n36仅保留V13末章职责：根据35实际后果展开各自带回/使用或没买的生活，10000汉字以上、至少五段；完成后实读31—36并正式复盘，随后仅讨论。现在不plan36、不写36正文，更不创建37。\n\n三链：茶仅32这次已坐饮resolved；衣33具体反馈已到师但实衣/再练/后续穿洗partial；书34先落实前日互告，35须真正同行/选择/付出后才更新相应兑现，不能凭提及书店记结案。日期从周五→周六→周日，章号不代日期。未决父辈全史/旧旅客终点/复航/总课数继续留未知。\n\n本首次停点：34成功preview0再record；35真实plan/context/template后写前两段，不assemble/record35、不向state加入35事实。保存交接后status/check/doctor/revision list，正常退出待根。若CLI失败先停依赖、保留旧输入；确须改旧来源走version/impact。\n`);
const ae={quote:req,local_source:'研究/X-D首次执行指令-原文.md',source_sha256:h(read('研究/X-D首次执行指令-原文.md')),locator:'2026-10-21本次根执行消息首段；无消息ID',recorded_by:'X-D新鲜首次执行代理'};
const workflow=structuredClone(s.governance);
delete workflow.enabled;delete workflow.decisions;delete workflow.note;
workflow.stage='outline';workflow.task='X-D有限34—36规划，当前首次仅34整章与35前两段中途停；先建34真实细纲，未授权本次赶完35/36。';workflow.authorization={allowed_actions:['discuss','plan'],draft_range:null,revise_range:null,stop_conditions:['先实际plan34后采用引用','本次只写34整章和35约前两段后正常退出','35不合章不登记，保留同ID续程；不创建37']};workflow.planning.outline={status:'draft',refs:[],unresolved_ids:['待建立34实际细纲']};
put('.writer/drafts/d-workflow-outline34.json',{expected_revision:149,operation_id:'x-d-outline34',author_evidence:ae,workflow});
put('.writer/drafts/d-plan34.json',{unit:34,title:'明天的空处',goal:'各人把明天留给自己的时间落实为当日的工作与家务选择，两姑娘完成前日互告',change:'周六旧松椅归还收20，原茶让出的看门约实际到场；两姑娘确认周日原约，未见书店或选书',beats:['周六姑娘照常上工核明日12:30交完；母洗工装自选换衣与晾处，今日穿用不强行加测试','周岸8:30到另一家看房门，按现场条件和主人出行安排商量将来腾空再做，不是30纱门重演','沈禾在店交代原准假与日常剩料，回家从父亲接回自有画册，父有自己兴趣和伤脚限制','周岸午后卸松椅夹具、有限坐靠后邻居来取，留刻痕交回并收原20；柜门只照可见信息再约不硬接','晚姑娘与母各做饭衣事，沈与父商量自己的午饭；两姑娘真实互告明日周日14点原店门，终止在各自夜里'],cast:['许蓉','许蓉女儿','周岸','沈禾','沈成林','谭老板'],setting_refs:['设定/人物与声音.md','大纲/扩大骨架-X.md','大纲/X-D近期执行纲-34-36.md'],research_refs:[],arc_id:'A13',recall_ids:['T_X_BOOK_COMPANY','T_X_COAT_DAILY','T_X_TEA_AFTER_WORK','P_W_PICTURE_BOOK','P_W_COAT','T_CR_NEIGHBOR_CHAIR','P_CR_NEIGHBOR_CHAIR'],forbidden:['不把原下下星期日变最近一次周日，承接实际周五后周六','不提前兑现35书店同行各选；未知开门与父脚痊愈','不重开旧钱账/茶约，不将35段稿事实记进34','本次34至少8000汉字五实际分段；35前两段后首停不写36/37']});
console.log(JSON.stringify({ok:true,entry_revision:s.revision,registered:s.units.length,protected_files:Object.keys(files).length,author_evidence:ae,created:['d-workflow-outline34.json','d-plan34.json']}));
