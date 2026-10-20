import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const v='D:/work/other/ai-writer/acceptance/20261020-long-flow-090-v';
const w=v+'/scenario/东岸末班船-扩展验证';
const state=JSON.parse(fs.readFileSync(w+'/.writer/state.json','utf8'));
const mode=process.argv[2];
const sha=f=>crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const write=(name,obj)=>{const f=w+'/.writer/drafts/'+name+'.json';fs.writeFileSync(f,JSON.stringify(obj,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify({file:f,sha256:sha(f),revision:state.revision}));};
const evidence={quote:'实际用户本轮原话“继续推进”；根会话在该授权内选择以下隔离试验方案，不冒充人类逐字设定：基于当前《东岸末班船》三章已完成的箱钱据有限归还，扩展到12章、5卷。',local_source:'研究/V-A-授权与选择来源.md',source_sha256:sha(w+'/研究/V-A-授权与选择来源.md'),locator:'“本进程直接收到的原文”引文；完整本次任务另存研究/V-A-原始任务.md及其SHA；无平台消息ID',recorded_by:'本次V-A首停Codex执行代理；依真实任务在授权内选择情节，不冒充人类逐项决定'};
const refs=['设定/人物与声音.md','大纲/扩展骨架-V.md'];
const forbidden=['不改1—3正文及事实，不逆改O_BOX_PAINT三项','80元已退不能重开退款；35元未到实际交款不能写已付','未来计划、未选候选不得写成已发生；人物所知各有来源','不加阴谋、秘密机关、万能物证或父辈全史'];
if(mode==='initial'){
 const volumes=[
 {id:'V3',title:'停航后的早晨',start:4,end:6,promises:['以真实入铺接住箱的去向，展开停航后的营业、家务与出行','让取糕时段、柜内使用位置和绕行入口各产生一项可继续承担的安排'],constraints:forbidden,reserved:['早餐安排的实际营业后果留8','柜内位置的共同选择留11','绕行入口是否真好用留12'],arcs:[{id:'A3',start:4,end:6,goal:'把昨夜的互助转成白日里能承担的小安排',payoff:'亲自做过、量过、走过，知道成本而非全解决',forbidden:['一卷完成全部长期收益','让沈禾承担无限免费跑腿']}]},
 {id:'V4',title:'各有一段路',start:7,end:9,promises:['真实检验一回提前取货，处理时间、工时和余货代价','周岸排出自己的工，许蓉把一段照料交给别人'],constraints:forbidden,reserved:['35元实际付款与柜门装好留末卷','图的最终出行后果留12'],arcs:[{id:'A4',start:7,end:9,goal:'让试出来的小安排经受营业与排工',payoff:'8章真取真卖或处置余货，9章承担推迟一件事的代价',forbidden:['无代价地所有人都方便','把未来柜门修好写成过去事实']}]},
 {id:'V5',title:'留得下的晚饭',start:10,end:12,promises:['实际结付原35元维修款','装柜门并实际调整父女常用的碗架位置','以一次具体绕行与交班回收前卷的生活安排'],constraints:forbidden,reserved:['父辈未说的旧事继续留白','一次小安排有效不等于永久有效'],arcs:[{id:'A5',start:10,end:12,goal:'在实际付款、共同劳动和出行里兑现剩余承诺',payoff:'有人接手、有人准时吃饭，各人保有自己的时间',forbidden:['未选复航日期当事实','强行父女大和解','用旁白宣布所有问题解决']}]}
 ];
 for(const x of volumes)write('v-a-volume-'+x.id,x);
 const plans=[
 {unit:4,title:'少蒸的两笼',arc_id:'A3',goal:'沈禾照减量单完成早晨工作，和谭老板为绕桥赶工的人试一个可承担的小取货安排',change:'原箱真正入铺；昨夜的归还结束后，停航带来的空闲与新劳动成本同时出现；只试一小批，不宣布长期成功',beats:['01：周岸同夜带原箱至梁家铺，解自己的绳、把合扣箱放回架下，自己一联/空袋夹借具本；拍照真实告知梁伯，收自己的包和绳离开；不重复开箱点八件。','02：明确翌晨换沈禾视点；照昨夜答应提前到，实际刷蒸笼、照新单和老板减量，首位绕桥赶工的客人提出早取的实际难处，尚不凭一句话成立长期订单。','03：许蓉到岗前买自己的早饭，在店里亲见现状，回到以她为主的限知视点；不知道箱入铺除非有人真实告诉。','04：沈禾与老板以试份、工时、取货时段协商，不应承送到对岸；价格/数量只在选定时写出，不照候选强填。','05及后续：实际做出并交付一回有限试份，处理留下的活，保留T_EARLY_BATCH到8章的检验；以许蓉到岗和沈禾继续做活的生活动作收章。'],cast:['周岸','沈禾','谭老板','许蓉','梁伯'],setting_refs:refs,research_refs:[],recall_ids:['P_TOOLBOX','T_RETURN','T_DEPOSIT','P_ORDER','F_GATE_QUOTE'],forbidden:[...forbidden,'整章最终至少5000正文汉字；本次先写01/02，不在本进程写后段、合章或record4','夜间入铺用自然分隔换视点，不把几人写成自动共享知识','不用复制旧章或重复电话/清点填篇幅']},
 {unit:5,title:'门板靠墙',arc_id:'A3',goal:'沈禾与父亲请周岸实际看看柜口和门板，把修理变成能坐稳参与的活',change:'看出照原样装并不便于沈禾常用碗和饭盒，留下实际使用位置的选择；父亲让出一项自己做不了的活',beats:['承接4章实际工作结束时点，说明三人各自何时有空，不能把刚答应的事当已到场。','沈成林仍坐稳，周岸用自用包测量；沈禾将桌上碗一只只试回柜内，挡门或够不到之处现场显出。','先处理安全和可修的部分，核定工时/需要补的材料；若新款发生，来源与80元退款另写。','沈禾指出自己常用那层，父亲暂时把旧放法停下来；预留T_SHELF_USE至11的实装与共同摆放。','结束在门板与碗的真实现状；可排到后日，不将脚伤、柜门、父女关系一次全好。'],cast:['沈禾','沈成林','周岸'],setting_refs:refs,research_refs:[],recall_ids:['T_DEPOSIT','P_TOOLBOX'],forbidden:forbidden},
 {unit:6,title:'走一遍再画',arc_id:'A3',goal:'许蓉找能交班的时段，与老何实走一次绕行路线，令图上的站名接得上街上的入口',change:'发现和修正一个具体入口/台阶问题，照料由亲自带路转成可以交给别人使用的图；仍待真实旅客检验',beats:['接住许蓉工作时段与同事交班，拿真实现有绕行图，不凭空离岗。','从药店旁通往公路桥/车站的实际路径走一次；看字高度、转弯和台阶的困难跟着身体动作出现，不写成问答说明会。','回到岗上改一份有限版本，向老何交代自己实际试过哪段；不声称所有路线都已验证。','与前两章的早餐和家务进展只按真实接触衔接，不能自动知道他处结局。','预留T_ROUTE_STEP到12章的实际出行；连读4—6与1—3并保存报告以后，才判断V3兑现范围。'],cast:['许蓉','老何'],setting_refs:refs,research_refs:[],recall_ids:['F_GATE_QUOTE'],forbidden:forbidden}
 ];
 for(const p of plans)write('v-a-plan-'+p.unit,p);
}
const planning={positioning:{status:'adopted',refs:['设定/作品定位.md','设定/文风.md','设定/权威规则.md','设定/人物与声音.md','研究/V-A-授权与选择来源.md'],unresolved_ids:[]},structure:{status:'adopted',refs:['大纲/扩展骨架-V.md'],unresolved_ids:[]},volume:{status:mode==='final-workflow'?'adopted':'draft',refs:mode==='final-workflow'?['大纲/分卷/V1.json','大纲/分卷/V2.json','大纲/分卷/V3.json','大纲/分卷/V4.json','大纲/分卷/V5.json']:['大纲/分卷/V1.json','大纲/分卷/V2.json','大纲/扩展骨架-V.md'],unresolved_ids:[]},outline:{status:'draft',refs:mode==='final-workflow'?['大纲/单元/0004.json','大纲/单元/0005.json','大纲/单元/0006.json']:[],unresolved_ids:['7—12仅骨架，按后续阶段滚动细化']}};
if(mode==='initial'||mode==='final-workflow')write('v-a-'+mode,{expected_revision:state.revision,operation_id:'v-a-'+mode,author_evidence:evidence,workflow:{stage:'trial',task:'V轮隔离扩展：整体有限试写4—12；本进程A首停只建规划并写第4章v1分段01/02，完整实读后退出，根独立核验后才同ID恢复。',authorization:{allowed_actions:['discuss','plan','draft'],draft_range:{from:4,to:12},revise_range:null,stop_conditions:['A首停：只完成分段/0004/v1/01.md与02.md，各1100—1500正文汉字；不写03、不合章、不record4、不写5—12，交接后退出','根会话独立核验再同ID恢复；后续B/C/F停点按研究/V-A-原始任务.md，不得借整体范围跳过','第1—3章正文及事实本轮不改；7/9普通事实修订到C阶段再正式登记7—12 revise范围','12章完成及后续修订/全文审查后正式暂停仅discuss；13章无正文授权']},planning}});
if(mode==='chosen')write('v-a-chosen',{expected_revision:state.revision,operation_id:'v-a-chosen',author_evidence:evidence,decision:{id:'D_V_EXTENSION',topic:'V轮代理在继续推进授权内已选的扩展方向',status:'confirmed',options:['停航后的劳动、家务和绕行三条行动线'],adopted_items:['代理已选：全作12章5卷；新增V3=4—6/V4=7—9/V5=10—12，原三章有限归还已经兑现','代理已选：4章先实写箱入铺、再写沈禾次晨减量做糕；普通细节由代理组织','代理已选：取货时段/柜内使用位置/绕行入口分别在8/11/12产生真实动作或关系后果','原题材、声音、有限知情和父辈留白保持；计划不进事实账本'],excluded_items:['阴谋、秘密机关、万能物证','用重开箱钱据悬念延长原故事','人类逐项指定或编造消息ID'],unresolved_items:['远期章的场面、定价、复航、材料工费须按实际选择与成稿更新'],effective_range:{from:4,to:12}}});
if(mode==='candidate')write('v-a-candidate',{expected_revision:state.revision,operation_id:'v-a-candidate',author_evidence:evidence,decision:{id:'D_V_CANDIDATES',topic:'V轮远期仍未选细节',status:'candidate',options:['末章已复航','末章仍停航，以绕行和交班收束','小批取货只试行一次或保持有限频次'],adopted_items:[],excluded_items:[],unresolved_items:['复航日期与末章是否复航未选','取货安排长期频次、数量与定价未选','柜门新材料、工费与未来配角姓名未选；不从候选推定事实'],effective_range:{from:4,to:12}}});
if(!['initial','chosen','candidate','final-workflow'].includes(mode))throw Error('Unknown preparation mode');
