import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
export const A=path.dirname(fileURLToPath(import.meta.url));
export const P=path.join(A,'scenario/卷目录默认路径-三章验证');
export const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
export const read=r=>fs.readFileSync(path.join(P,r),'utf8');
export const json=r=>JSON.parse(read(r));
export const put=(r,v)=>{const f=path.join(P,r);fs.mkdirSync(path.dirname(f),{recursive:true});fs.writeFileSync(f,typeof v==='string'?v:JSON.stringify(v,null,2)+'\n',{flag:'wx'});};
export const evidence=()=>({quote:'本程只完成1和2章，每章至少1000正文汉字',local_source:'研究/本次用户授权.md',source_sha256:sha(read('研究/本次用户授权.md')),locator:'本次用户消息，激活时间2026-10-26T05:23:54.421Z；本地逐字保存的任务段落',recorded_by:'Codex控制器，依用户独立工具验证授权'});
export const plan=(n)=>({unit:n,title:['','雨停以前','迟一天的消息','干透的伞'][n],goal:['','让许宁在开店前决定是否把唯一的大伞借给新邻居','让借伞人不能按约归还时主动通知，双方重新约定','实际归还同一把伞并兑现一段普通邻里关系'][n],change:['','许宁借出大伞，改走近路买材料；邻居从点头之交变为有具体约定的人','许宁承认自己需要伞，周岚说清延期原因和新时刻；双方从客气揣测转为直接沟通','伞由周岚亲手归还许宁，归还确认后约一次普通帮忙'][n],beats:[[],['早上七点四十，许宁要买改裤子用的拉链，周岚要赶八点钟社区服务站的搬箱','许宁指认深蓝长柄伞、白线缝过的伞套扣环和伞柄底部缺一小角的贴纸，周岚当面看见','许宁选择借伞，周岚约定当晚七点前在缝纫店归还，二人交换号码','许宁承担绕路和少买一种拉链的后果，给对方留可直接联系的店名'],['同日下午六点二十，周岚来电说仍在服务站，雨未停，今晚七点前还不了','许宁先想客套说不急，想到次晨要带布料去公交站后明确说需要','周岚提出次晨八点四十到店，许宁解释自己八点出门；改约次晨七点半店门口亲交','二人各复述新时间地点；伞仍由周岚持有，通知不等于归还'],['次晨七点二十五许宁开店，等候约定七点半的交接','周岚带回同一把深蓝长柄伞，双方核原识别处，不把原贴纸缺角说成新损坏','七点半周岚亲手交伞给许宁，许宁确认接收；无新失物或谜案','许宁使用归还的伞带布料赶公交，双方能直接提出小请求']][n],cast:['许宁','周岚'],setting_refs:['设定/本次故事约束.md'],research_refs:[],forbidden:['不复制66章作品内容','未来事件不作既成事实','同一把伞、通知与归还不混淆','不修改原观察'],arc_id:n<3?'A01':'A02',recall_ids:n>1?['P_UMBRELLA','O_UMBRELLA_MARK','T_RETURN']:[]});
if(process.argv[2]==='assembly'){
 const n=Number(process.argv[3]),stem=String(n).padStart(4,'0');
 const parts=fs.readdirSync(path.join(P,'分段',stem)).sort().map(name=>{const r=`分段/${stem}/${name}`;return {path:r,sha256:sha(fs.readFileSync(path.join(P,r)))};});
 const t=json(`.writer/drafts/record-${n}-original.json`),c=json(`.writer/drafts/context-${n}-original.json`);assert.equal(t.draft,c.draft_path);
 put(`输入/assemble-${n}.json`,{unit:n,expected_revision:t.expected_revision,parts,separator:'\n\n'});
 console.log(JSON.stringify({unit:n,template_path:t.draft,parts}));
}
if(process.argv[2]==='verify-assembly'){
 const n=Number(process.argv[3]),input=json(`输入/assemble-${n}.json`),t=json(`.writer/drafts/record-${n}-original.json`),body=fs.readFileSync(path.join(P,t.draft)),expected=Buffer.concat(input.parts.flatMap((p,i)=>[...(i?[Buffer.from(input.separator)]:[]),fs.readFileSync(path.join(P,p.path))]));assert.deepEqual(body,expected);
 const result=JSON.parse(fs.readFileSync(path.join(A,`cli-logs/vf-assemble-${n===1?'one':'two'}/stdout.txt`),'utf8'));assert.equal(result.draft,t.draft);
 const han=(body.toString('utf8').replace(/^#.*\n/u,'').match(/\p{Script=Han}/gu)||[]).length;assert(han>=1000);
 const receipt={ok:true,unit:n,draft:t.draft,sha256:sha(body),body_han:han,chars:body.toString('utf8').length,pages:Math.ceil(body.toString('utf8').length/1800),parts:input.parts,separator:input.separator,ordered_bytes_equal:true,template_assemble_path_equal:true};put(`审查/合章核对-${n}.json`,receipt);console.log(JSON.stringify(receipt));
}
if(process.argv[2]==='authorize'){
 const original=json('输入/workflow-plan.json');
 const w=original.workflow;w.stage='drafting';w.task='按用户授权进行独立三章工具验证；本程写1、2并保存3写前输入后停止';w.authorization.allowed_actions=['discuss','plan','draft'];w.authorization.draft_range={from:1,to:3};
 for(const k of ['positioning','structure','volume','outline']){w.planning[k].status='adopted';w.planning[k].unresolved_ids=[];}
 w.planning.volume.refs=['大纲/分卷/V01.json','大纲/分卷/V02.json'];w.planning.outline.refs=['大纲/单元/0001.json','大纲/单元/0002.json'];
 put('输入/workflow-draft.json',{expected_revision:json('.writer/state.json').revision,operation_id:'vf-drafting-bounded',author_evidence:evidence(),workflow:w});
 put('研究/范围核对.md','已核对本任务明确授权三章、两卷，正文有限范围1—3。本程仅1、2章，保存3写前模板后停止。adopted表示控制器在本次工具验证授权内采用合成规划，不代表真实作者逐项作出人物或情节决定。\n');
 console.log('Prepared bounded workflow from current revision; no state edited.');
}
if(process.argv[2]==='prepare'){
 put('研究/本次用户授权.md',`# 本次任务授权原话摘录\n\n提示激活时间2026-10-26T05:23:54.421Z。\n\n本模板由根在确认最终包后激活。只读root源码，允许写AE/scenario/卷目录默认路径-三章验证及AE根新证据文件，不修改66章主验证作品、真实作品、旧封存、全局配置、memory或Git，不起子代理/新聊天。使用AE/cli-g9-v5-source.mjs唯一label保存所有正式命令输入、完整输出和状态前后；初始化后也使用同一冻结包入口，不调用开发root/bin。\n\n通过init --mode long新建指定独立作品，标题《巷口借伞》。保存本任务授权本地证据，明确是用户要求的独立工具验证，由控制器选择合成原创情节，不伪称真实作者逐项决定。先规划阶段、全书三章骨架、V01《借出的一天》1—2章、V02《归还以后》3章；确认范围后正式workflow允许1—3有限正文，不扩章。人物两三人、普通社区生活，明确同一把伞的借出、延期通知和实际归还；不同物件/时刻不混淆，原观察不可改。不得复制66章作品的正文或账本。\n\n本程只完成1和2章，每章至少1000正文汉字，有具体目标、选择、后果与人物关系变化，不用占位文本或重复凑字。每章plan/context及写前record-template都省略--draft，直接采用返回路径正文/V01-借出的一天/000N-标题.md。分两段写在分段/对应单元/，实际SHA后assemble省略draft，验证返回路径与原模板完全一致、完整合章等于原段有序连接。完整逐页实读当前稿，必要修正用明确新路径并保持模板/合章一致，记录所有候选；不刷源哈希。真实摘要/changes及本章物件交接/人物所知登记，preview后record。所有正文读取用AE/read.mjs每次至多同章两页，原输出不截断。\n\n第2章完成后，正式保存第3章细纲、串行获取原context与record-template，仍省略draft，确认其默认目录为V02而不是V01。保存原输入SHA、expected_revision、source_hashes、source_bindings；此后不写正文3或推进state。保存volume-first-stop.json、交接-卷目录首停.md，列2章字数/路径/原段/完整读页/账本/未完3、真实错误及下一步。用scenario-checkpoint save volume-first 指定项目 2，再verify volume-first，保存完整清单后正常退出。后程同ID实际恢复再写3，复核/修订/导出。全程每60秒进度，预计20—35分钟；100分钟未完保存真实断点，不假称2完成。\n`);
 put('设定/本次故事约束.md',`# 巷口借伞：本次合成故事约束\n\n这是用户要求的独立工具验证。以下人物、情节与细节由当前Codex控制器原创选择，不代表真实作者逐项确认，非66章作品派生。\n\n第三人称限于许宁可知，普通社区生活，温和、具体，不额外制造谜案。许宁在巷口开缝纫小店，怕麻烦人，容易先客套；正学着明确说出自己的需要。周岚刚搬进社区，做社区服务站临时搬运整理工作，怕失约被当作不可靠，说话常先给出时间，但愿意纠正。只设这两名主要人物，其他人不参与核心交接。\n\n唯一核心物件：许宁的深蓝长柄伞，伞套扣环用白线缝过，伞柄底部贴纸原已缺一小角。第一次观察记录后不可改。两处识别信息用于确认同一物件，不把缺角当新损坏。第1章当日上午借出，初约当晚七点前归还；第2章当日下午六点二十通知延期，改约次晨七点半店门口亲手交还；第3章才实际归还。通知仅是消息，伞仍在周岚手中。\n\n篇幅来自当日买拉链与店内整理布料的具体行动、双方客气与直接的变化，不重复总结；不强制每段有修辞或危机。每章至少1000正文汉字。\n`);
 put('大纲/全书三章骨架.md',`# 三章骨架（计划，不是已发生事实）\n\n全书仅三章。V01《借出的一天》1—2章：借出同一把伞并经历一次按时通知的延期。V02《归还以后》第3章：亲手归还，确认邻里之间可以直接说需要。\n\n1《雨停以前》：许宁想买到拉链赶回开店；把伞借给赶去搬箱的周岚，自己改路且少买一种材料。建立今晚七点前归还的明确约定。\n2《迟一天的消息》：六点二十接到延期电话。许宁需要伞保护次晨带走的布料；不说虚假的“不急”，与周岚改约次晨七点半店门口，保留实际归还未完成。\n3《干透的伞》：次晨实际交还，核对同一把伞而不逆改观察。许宁带布料出门，关系落实为可提出小请求的邻居。\n\n本程停在第2章登记后与第3章写前模板保存后。正文3留待同ID后程恢复。\n`);
 for(const n of [1,2,3])put(`输入/plan-${n}.json`,plan(n));
 for(const v of [{id:'V01',title:'借出的一天',start:1,end:2,promises:['明确借出、当日延期通知与新归还约定'],constraints:['通知不等于归还','原识别观察不可逆改'],reserved:['实际归还留在第3章'],arcs:[{id:'A01',start:1,end:2,goal:'从借物的客气到说清双方实际需要',payoff:'在原约定前通知并共同改定归还时刻',forbidden:['提前写实际归还']}]},{id:'V02',title:'归还以后',start:3,end:3,promises:['亲手归还同一把伞'],constraints:['全书只三章','继承原观察和交接链'],reserved:[],arcs:[{id:'A02',start:3,end:3,goal:'完成归还并落实关系变化',payoff:'伞回许宁手中且双方能直接说需要',forbidden:['另开失物谜案']}]}])put(`输入/volume-${v.id}.json`,v);
 put('输入/workflow-plan.json',{expected_revision:0,operation_id:'vf-planning',author_evidence:evidence(),workflow:{stage:'outline',task:'独立工具验证：规划三章与两卷，控制器原创合成，非真实作者逐项决定',authorization:{allowed_actions:['discuss','plan'],draft_range:null,revise_range:null,stop_conditions:['三章范围不扩章','本程第2章后仅保存第3章写前输入并停止']},planning:{positioning:{status:'draft',refs:['设定/本次故事约束.md'],unresolved_ids:[]},structure:{status:'draft',refs:['大纲/全书三章骨架.md'],unresolved_ids:[]},volume:{status:'draft',refs:[],unresolved_ids:['待正式保存两卷']},outline:{status:'draft',refs:[],unresolved_ids:['待正式保存第1、2章细纲']}}}});
 const selection=JSON.parse(fs.readFileSync(path.join(A,'package-generation9-v5.json')));const resources=['.agents/skills/writer-project/SKILL.md','.agents/skills/writer-novel/SKILL.md','.agents/skills/writer-review/SKILL.md','.agents/skills/writer-project/references/long-form.md','.agents/skills/writer-review/references/general-review.md','.agents/skills/writer-review/references/natural-language-authenticity.md','.agents/skills/writer-review/references/concrete-language-review.md','.agents/skills/writer-novel/references/chapter-delivery.md'];
 fs.writeFileSync(path.join(A,'vf-resource-reading.json'),JSON.stringify({at:new Date().toISOString(),activation:'2026-10-26T05:23:54.421Z',build:selection,reviewer:'same-session informed controller',resources:resources.map(r=>({path:path.join(selection.package,r),sha256:sha(fs.readFileSync(path.join(selection.package,r))),read:'complete via FastCtx'})),scope:'0.9.0 development build, not release; root source read only'},null,2)+'\n',{flag:'wx'});
 console.log(JSON.stringify({ok:true,project:P,prepared:true}));
}
