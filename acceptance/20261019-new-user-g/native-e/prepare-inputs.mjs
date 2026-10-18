// Acceptance input preparation only. No product API imports or state writes.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
const here=path.dirname(fileURLToPath(import.meta.url)),base=path.dirname(here),project=path.join(base,'作品/纸桥书店 规划');
const dir=path.join(here,'inputs');fs.mkdirSync(dir,{recursive:true});
const save=(n,v)=>fs.writeFileSync(path.join(dir,n+'.json'),JSON.stringify(v,null,2)+'\n',{flag:'wx'});
const evidence=quote=>({quote,local_source:'研究/作者任务原话.md',source_sha256:crypto.createHash('sha256').update(fs.readFileSync(path.join(project,'研究/作者任务原话.md'))).digest('hex'),locator:'实际用户原话：新用户任务段；本会话未提供消息ID',recorded_by:'Codex / native-e / agent transcription of actual user request'});
const readOutput=n=>JSON.parse(fs.readFileSync(path.join(base,'commands',n,'stdout.raw.txt'),'utf8'));
const planning=(all)=>({
 positioning:{status:'draft',refs:['设定/作品定位.md','设定/人物.md','设定/文风.md','设定/权威规则.md'],unresolved_ids:['D_E_AGENT_PROPOSAL']},
 structure:{status:'draft',refs:['大纲/全书大纲.md'],unresolved_ids:['D_E_AGENT_PROPOSAL']},
 volume:{status:all?'draft':'missing',refs:all?['大纲/分卷/V1.json','大纲/分卷/V2.json','大纲/分卷/V3.json']:[],unresolved_ids:all?['D_E_AGENT_PROPOSAL']:[]},
 outline:{status:all?'draft':'missing',refs:all?['大纲/单元/0001.json','大纲/单元/0002.json','大纲/单元/0003.json']:[],unresolved_ids:all?['D_E_AGENT_PROPOSAL']:[]}
});
const workflow=all=>({stage:all?'paused':'structure',task:all?'规划已交付：十二章三卷粗骨架、人物/文风及前三章细纲；本轮只规划，不写正文。完成恢复取证后停止；下一会话须取得实际有限写作授权才可更新权限。':'新建《纸桥书店》十二章三卷规划，完成定位、人物与文风、全书粗骨架、分卷范围及前三章细纲；仅讨论/规划，不写正文，不授权试写。',authorization:{allowed_actions:['discuss','plan'],draft_range:null,revise_range:null,stop_conditions:['规划材料与前三章细纲齐备后停止扩写，不细化第4–12章场景','新CLI回读status、workflow与discussion context，完整保存三份设定和任务记录证据','第1章draft context及record-template应拒绝，状态字节不变，正文目录为空','证据与交接完成即结束；下一会话继续正文须实际新授权，不由已有章纲或next_unit推定']},planning:planning(all)});
if(process.argv[2]==='start') {
 save('workflow-start',{expected_revision:readOutput('e-status-initial').revision,operation_id:'e-workflow-planning-only',author_evidence:evidence('本轮只讨论/规划，不写正文，不授权试写。'),workflow:workflow(false)});
 const volumes=[
 {id:'V1',title:'留下的书',start:1,end:4,promises:['查清寄存书与库存责任','让母女第一次协商分工并完成实际归还'],constraints:['归还和清点有具体工时成本','人物掌握信息须有来源'],reserved:['长期经营组合与房屋合作条件'],arcs:[{id:'E_A1',start:1,end:3,goal:'辨认责任、协商分工并完成首本书归还',payoff:'林乔从直接结业转向承担有限责任',forbidden:['经营困境已解决','把查找名单当作所有书已归还']},{id:'E_A2',start:4,end:4,goal:'清点首批归还后仍未满足的需求',payoff:'确定先调查有限服务成本',forbidden:['提前宣告转型成功']}]},
 {id:'V2',title:'开门的代价',start:5,end:8,promises:['试行有边界的开放时段','让活动的工时与收支后果显现'],constraints:['志愿者可拒绝或退出','活动收入与持续经营分开核算'],reserved:['终局租用条件与母女个人选择'],arcs:[{id:'E_A3',start:5,end:8,goal:'从时段试行到活动复盘，识别过度承诺',payoff:'取消无限开放设想并接受缩小规模',forbidden:['热情自动变成长期人手','一场活动奇迹翻盘']}]},
 {id:'V3',title:'过桥的人',start:9,end:12,promises:['建立可退出的合作分工','处理未结寄存责任并落实母女各自的生活选择'],constraints:['约定须落实为实际一天','保留经营风险'],reserved:[],arcs:[{id:'E_A4',start:9,end:12,goal:'缩小服务，协商责任并以新方式开门',payoff:'母亲可以退休，女儿保留工作，社区承担有限职责',forbidden:['匿名巨款解决全部成本','退出者被塑造成背叛者']}]}
 ];volumes.forEach((v,i)=>save('volume-'+(i+1),v));
 const common={setting_refs:['设定/人物.md','大纲/全书大纲.md'],research_refs:[],arc_id:'E_A1',recall_ids:[]};
 const plans=[
 {unit:1,title:'寄存架',goal:'林乔想完成结业库存清点，查出哪些书可以出售',change:'误把寄存书列入库存后撤回；母女出现责任分歧，林乔接受核对一本书主信息的有限任务',beats:['开场承接：林乔返乡带着结业清单进店，许芸仍按日常方式接待；两人的目的并不一致','场景一｜店内前厅；林乔、许芸；林乔要装箱，寄存标签使她必须停下并询问归属','场景二｜寄存架与柜台；两人核对书本标签和旧记录，只确认一条可联络线索，不能据缺项判断书主不要了','关键选择：林乔撤回出售这一批书的安排，答应先核一本，许芸承认自己不能继续独自处理全部书','后果与信息变化：暂定的结业效率被责任清点取代；尚未联系书主，未发生归还','章末去向：两人约在次日上午分开清点自有库存与寄存记录，林乔带走记录抄件而非寄存原书'],cast:['林乔','许芸'],forbidden:['不预制正文句子','不揭示全部书主和长期经营答案','不把暂定安排登记为已发生事实']},
 {unit:2,title:'不能一起装箱',goal:'林乔要把寄存任务分成能完成的工作，避免母亲继续独自兜底',change:'发现联系与保管记录不完整；母女明确谁核账、谁查找，并共同缩小一次行动范围',beats:['开场承接：前一日寄存书未动，次日上午依约清点，明确原物仍在店内','场景一｜柜台与后间；林乔、许芸；两套清单的标记不能一一对应，林乔想统一归类，许芸担心弄乱熟客习惯','场景二｜店门内侧；陈朔短暂停留查看书架，指出挪动要预留通道和工时，不承诺免费包办维修','关键选择：母女不追求当天全部查清，林乔核对有联系线索的一本，许芸把清楚的自有库存另记','后果与关系变化：林乔停止替母亲许诺所有工作，许芸接受让女儿看见未完成项；两人分工有边界但仍不习惯','章末去向：通过原记录中的联系方式取得一次当面核对机会，只约定见面地点与时间，尚未确认归还成功'],cast:['林乔','许芸','陈朔'],forbidden:['不凭单方电话认定书主身份全部无误','不让陈朔同时在两处做事','不重复第1章误装箱作为主要转折']},
 {unit:3,title:'一本书的归处',goal:'林乔要核对首位书主并把一本寄存书妥善归还',change:'完成一次有明确交接的归还，发现借读需要与怀旧不同；她选择做有限名单而非承诺永久开门',beats:['开场承接：按第2章约定准备书本与核对记录，许芸在店内协助确认来源','场景一｜书店柜台；林乔、许芸、唐薇；唐薇以可对应的寄存信息核对原书，身份与书况得到当面确认','场景二｜同一柜台；林乔提出借这次归还宣传，唐薇拒绝涉及私人夹页；林乔接受并只记必要的交接信息','关键选择与后果：实际把原书交给唐薇并记录接收，原物离店；许芸亲见交接，其他未在场者不自动知道详情','关系与信息收益：唐薇说明仍需方便的阅读时段，同时提出带领与收尾不能全靠许芸；林乔第一次听到具体而有边界的需求','章末去向：林乔与母亲只确定先完成可核对的归还名单，将开放设想留给第4章成本调查，不作长期保证'],cast:['林乔','许芸','唐薇'],forbidden:['不虚构隐私材料的公开许可','不把一次归还写成全部寄存书结案','不让活动收益或终局合作提前兑现']}
 ];plans.forEach((v,i)=>save('plan-'+(i+1),{...v,...common}));
} else if(process.argv[2]==='requirements') {
 save('decision-requirements',{expected_revision:readOutput('e-workflow-start').revision,operation_id:'e-record-actual-specification',author_evidence:evidence('题名《纸桥书店》，计划十二章三卷。'),decision:{id:'D_E_REQUIREMENTS',topic:'用户明确的作品规格',status:'confirmed',options:['题名《纸桥书店》，计划十二章三卷'],adopted_items:['题名《纸桥书店》','长篇小说规划','十二章三卷'],excluded_items:[],unresolved_items:[],effective_range:{from:1,to:null}}});
} else if(process.argv[2]==='candidate') {
 save('decision-candidate',{expected_revision:readOutput('e-decision-requirements').revision,operation_id:'e-record-agent-proposal',author_evidence:evidence('普通原创细节自行决定，明确属于代理方案，不伪造人类作者采纳。'),decision:{id:'D_E_AGENT_PROPOSAL',topic:'代理原创方案，尚无人类作者逐项采纳',status:'candidate',options:['青汀镇纸桥书店的母女协作与有限社区经营方案，人物/视角/文风/情节详见设定及全书大纲'],adopted_items:[],excluded_items:[],unresolved_items:['人物、镇名、具体活动与结局经营组合尚无人类作者逐项采纳','第4–12章仅粗骨架；具体场景、账目数字和书目未细化'],effective_range:{from:1,to:null}}});
} else if(process.argv[2]==='finish') {
 save('workflow-final',{expected_revision:readOutput('e-status-planned').revision,operation_id:'e-finish-planning-and-stop',author_evidence:evidence('本轮只讨论/规划，不写正文，不授权试写。'),workflow:workflow(true)});
} else throw Error('start | requirements | candidate | finish');
console.log('Inputs prepared; no product state was written.');
