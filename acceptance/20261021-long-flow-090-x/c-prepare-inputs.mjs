import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const X=path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/,'$1'));
const P=path.join(X,'scenario','东岸末班船-再扩展验证');
const sha=f=>crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const put=(f,obj)=>{fs.mkdirSync(path.dirname(path.join(P,f)),{recursive:true});fs.writeFileSync(path.join(P,f),JSON.stringify(obj,null,2)+'\n',{encoding:'utf8',flag:'wx'});};
const state=JSON.parse(fs.readFileSync(path.join(P,'.writer/state.json'),'utf8'));
const parent=JSON.parse(fs.readFileSync(path.join(X,'parent-before-c-state.json'),'utf8'));
const evidence={quote:'继续通过 Codex 扩大 0.9.0 的长篇实跑规模，在24章基础上增加章节数量和单章篇幅，重点验证多轮跨会话恢复、跨卷伏笔回收和多处旧章修改后的连续性，发现问题直接修复，保留完整验证记录，暂不修改现有作品。',local_source:'研究/作者请求-X-原文.md',source_sha256:sha(path.join(P,'研究/作者请求-X-原文.md')),locator:'2026-10-21实际用户原话第3行；本次细范围见研究/X-C有限执行指令-原文.md，无消息ID',recorded_by:'X-C当前执行代理；按授权实施，非作者逐项采纳新细节'};
if(process.argv[2]==='initial'){
 if(state.revision!==134||parent.revision!==134||state.units.length!==30||parent.units.length!==30)throw Error('entry mismatch');
 if(sha(path.join(P,'.writer/state.json'))!==sha(path.join(X,'parent-before-c-state.json')))throw Error('parent byte mismatch');
 const planning=structuredClone(state.governance.planning);planning.outline={status:'draft',refs:[],unresolved_ids:['待建立31实际单元纲；32写前另建，33恢复后再规划']};
 put('.writer/c-inputs/workflow-outline31.json',{expected_revision:134,operation_id:'x-c-outline31-first',author_evidence:evidence,workflow:{stage:'outline',task:'X-C有限31—33实施：当前只规划31，先discuss/plan；正文停点为完成31及32前约两段，不赶完三章，不创建34。',authorization:{allowed_actions:['discuss','plan'],draft_range:null,revise_range:null,stop_conditions:['先实际plan31再采用真实引用','本首次仅31整章及32两段，32不合章不登记','旧24及观察三字段不变，旧来源不就地改']},planning}});
 put('.writer/c-inputs/plan31.json',{unit:31,title:'门外留一张纸',arc_id:'A12',goal:'周廖把约好的私人半下午从正常工作日中真实留出来，各人照自己的生活安排到赴约前；母女让新补衣裤继续正常穿用。',change:'周实际关铺留纸且廖午市收后回家备茶，茶约仍未实际会面；姑娘穿修裤上班，有限即时用感由实际消息传沈。',beats:['周四清晨母女吃早饭/穿裤出门，袖衣仍归许','周铺完成本章明示的小物交取，协商后问活的时段，午后离铺有真实成本','沈正常班做今日劳动/吃午饭，与姑娘有限互聊，保留远书约','廖完成午市收尾、关门走回家，吃饭清杯取壶备两椅','周吃午饭、留纸实际关门赴约，止于到廖家之前'],cast:['许蓉','许蓉女儿','周岸','沈禾','谭老板','面摊主'],setting_refs:['设定/人物与声音.md','大纲/扩大骨架-X.md','大纲/X-C近期执行纲-31-33.md'],research_refs:[],recall_ids:['T_X_COAT_DAILY','T_X_TEA_AFTER_WORK','T_X_BOOK_COMPANY'],forbidden:['31不提前写32到家喝茶','书约下下周日仍未赴，due不是日期','伤脚不痊愈，旧钱已结不重开，原观察三字段/原24不变','不全体解释边界，不重复修同物，不写账本/章号进正文']});
 console.log(JSON.stringify({revision:state.revision,parent_units:parent.units.length,state_sha256:sha(path.join(P,'.writer/state.json')),prepared:['workflow-outline31.json','plan31.json']}));
}else if(process.argv[2]==='adopt31'){
 const planning=structuredClone(state.governance.planning);planning.outline={status:'adopted',refs:['大纲/单元/0031.json','大纲/X-C近期执行纲-31-33.md'],unresolved_ids:['32写前正式plan，33恢复32后再plan','茶待32真实行动/衣待33真实新反馈/书待35','本首次停于32两段未完，不登记未完事实']};
 put('.writer/c-inputs/workflow-trial31.json',{expected_revision:state.revision,operation_id:'x-c-trial31-first',author_evidence:evidence,workflow:{stage:'trial',task:'代理按实际扩大请求与本次有限指令执行31—33；当前首次仅完成31整章与32前两段3000—4500字后正常退出，32不assemble/record，根同ID恢复32/33；33后28—33完整复盘，不建34。新增细节为代理常规安排。',authorization:{allowed_actions:['discuss','plan','draft'],draft_range:{from:31,to:33},revise_range:null,stop_conditions:['本次完成31完整自检/preview0/record后只写32前两段并保存真实交接正常退出','32未完不合章不登记不进state','同ID恢复完成32/33后当前28—33完整实读正式review；不提前34','旧24/观察三字段/旧来源保持，禁代理/封存/导出/提交推送/源码改动']},planning}});
 console.log(JSON.stringify({revision:state.revision,prepared:'workflow-trial31.json'}));
}else throw Error('unknown operation');
