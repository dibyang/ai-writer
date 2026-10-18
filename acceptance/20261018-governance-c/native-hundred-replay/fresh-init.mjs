import {run,put,state,evidence,fresh,stage} from './harness.mjs';import fs from 'node:fs';import path from 'node:path';
run('fresh-init-corrected',['init','--path',fresh,'--kind','novel','--title','关门以前','--mode','long'],null);
put(path.join(stage,'fresh-init-state.json'),state(fresh));
const files={
 '设定/作品定位.md':'# 关门以前\n原创虚构短篇合成验收。两章，每章正文700–1000汉字；仅顾宁、许姨两名出场人物。一个归还借来小推车的日常事件，完整写出迟归、明确请求、放弃便利的选择及有限关系变化。无真实作品素材，无第三章。long入口只验登记骨架，不声称长篇规模创作。\n',
 '设定/文风.md':'# 声音\n顾宁有限第三人称，清楚温和的当代日常叙述。顾宁怕欠人情，惯用客气掩饰；许姨直说自己的用处，关心不等于随时答应。两人各有生活，不说治理术语。不套失败—解释—再试—查验。\n',
 '设定/权威规则.md':'# 规则与骨架\n仅虚构。全篇同一周五傍晚，街角修补店七点关门，许姨明日歇业；顾宁借唯一折叠小推车两天，约六点半归还。车属于许姨，今晚要用车送修好的旧电扇回家。顾宁尚有一箱书待搬，能付12元寄存到明日；寄存是她自己的代价，不交换许姨的免费照顾。不得凭计划登记已做。第1章形成取舍，第2章实际寄存和归还后结束。\n',
 '大纲/全书大纲.md':'# 两章骨架\n第一章《还有一箱》：顾宁迟到店门，想再借一晚，看到许姨的真实用车需求，明确开口并接受拒绝，选择付费存书。第二章《空车归你》：顾宁将书存入街边柜、取回空车归还；许姨收车仍不替她担后程，双方能直接约一杯茶，借物之便变成能直说的相处。结尾关门，事件结束，不续第三章。\n',
 '研究/模拟创作授权.md':'# 合成验收授权\n本记录为本次用户指定的短篇合成验收，不是真实作品作者决策。只授权虚构作品《关门以前》两章，每章700–1000正文汉字，人物最多3人；按章规划、上下文、模板、实际完整创作和实读登记，不先批量写。第2章保留一处受控重复字并以完整原句入ledger证据。两章完成后暂停，仅讨论审查，无第三章。\n'
};
for(const [rel,text] of Object.entries(files)){const p=path.join(fresh,rel);fs.mkdirSync(path.dirname(p),{recursive:true});if(fs.existsSync(p))fs.writeFileSync(p,text);else put(p,text);}
const wf={stage:'trial',task:'顺序完成两章短篇合成验收，到第2章停止并复盘',authorization:{allowed_actions:['discuss','plan','draft'],draft_range:{from:1,to:2},revise_range:null,stop_conditions:['两章完成立即暂停，不写第三章']},planning:{positioning:{status:'draft',refs:['设定/作品定位.md'],unresolved_ids:[]},structure:{status:'draft',refs:['大纲/全书大纲.md'],unresolved_ids:[]},volume:{status:'draft',refs:[],unresolved_ids:[]},outline:{status:'draft',refs:[],unresolved_ids:[]}}};
run('fresh-authorize-draft',['workflow','set'],fresh,{expected_revision:state(fresh).revision,operation_id:'native-four-fresh-draft-scope',author_evidence:evidence(fresh,'研究/模拟创作授权.md','只授权虚构作品《关门以前》两章，每章700–1000正文汉字，人物最多3人'),workflow:wf});
run('fresh-volume',['volume'],fresh,{id:'V1',title:'关门以前',start:1,end:2,promises:['归还唯一借车并承担自己最后一箱的搬运代价'],constraints:['仅两人出场','单一日常事件','计划不作事实'],reserved:[],arcs:[{id:'A1',start:1,end:2,goal:'借车归还',payoff:'归还完成，能直说请求和拒绝',forbidden:['添第三章','扩大成阴谋或巨变']}]});
run('fresh-plan-one',['plan'],fresh,{unit:1,title:'还有一箱',goal:'关门以前还车并试着再借一晚',change:'顾宁明说请求、听到许姨用途后接受拒绝，选择花12元存书',cast:['顾宁','许姨'],setting_refs:['大纲/全书大纲.md'],research_refs:[],arc_id:'A1',forbidden:['新增人物','将寄存计划冒充已完成'],beats:['借来的车上还有书箱，迟于六点半约定','许姨要运修好电扇，直接表达不再借','顾宁明确请求被拒，选择寄存，先自己承担费用和绕路'],recall_ids:[]});
put(path.join(stage,'fresh-context-one.json'),run('fresh-context-one',['context','--unit','1'] ,fresh));
put(path.join(stage,'fresh-template-one.json'),run('fresh-template-one',['record-template','--unit','1','--draft','正文/0001-还有一箱.md'],fresh));
