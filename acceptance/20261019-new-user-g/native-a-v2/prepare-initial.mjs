// Local input preparation only. No business API imports or prose generation.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const base = path.resolve('acceptance/20261019-new-user-g');
const project = path.join(base, '作品/雾港 来信');
const out = path.join(base, 'native-a-v2/inputs');
fs.mkdirSync(out, {recursive:true});
fs.copyFileSync(path.join(base,'PLAN.md'),path.join(project,'研究/G轮PLAN原件.md'));
const ref='研究/本轮作者依据.md';
const sha=crypto.createHash('sha256').update(fs.readFileSync(path.join(project,ref))).digest('hex');
const evidence=quote=>({quote,local_source:ref,source_sha256:sha,locator:'当前用户请求的本地转录；无消息ID；见本文件来源二',recorded_by:'Codex主代理，agent-within-authorized-scope'});
const write=(name,data)=>fs.writeFileSync(path.join(out,name+'.json'),JSON.stringify(data,null,2)+'\n',{flag:'wx'});
const planning={
 positioning:{status:'draft',refs:['设定/作品定位.md','人物/主要人物.md','设定/文风.md'],unresolved_ids:[]},
 structure:{status:'draft',refs:['大纲/全书大纲.md','大纲/核心承诺.md'],unresolved_ids:['寄件人是否当面出现','材料费金额']},
 volume:{status:'draft',refs:['大纲/全书大纲.md'],unresolved_ids:[]},
 outline:{status:'draft',refs:['大纲/全书大纲.md'],unresolved_ids:[]}
};
write('workflow-trial',{expected_revision:0,operation_id:'G_A_V2_TRIAL_1_3',author_evidence:evidence('本轮只授权写第1–3章'),workflow:{stage:'trial',task:'代理在授权内规划两卷六章，仅试写1–3章；逐章自检登记、整段连读后暂停正文',authorization:{allowed_actions:['discuss','plan','draft'],draft_range:{from:1,to:3},revise_range:null,stop_conditions:['第3章自检登记与1–3整段连读完成后正式暂停，仅讨论/规划','不写第4章；普通创作细节是代理实施决定，不冒充真人作者采纳']},planning}});
write('decision-requirements',{expected_revision:1,operation_id:'G_A_V2_REQUIREMENTS',author_evidence:evidence('面向普通读者，日常悬疑'),decision:{id:'D_USER_SCOPE',topic:'本轮作品明确要求',status:'confirmed',options:['两卷六章的小规模方法验证'],adopted_items:['原创小说《雾港来信》；普通读者、日常悬疑','林柯、钟师傅、陶芷各有利益与声音','无超自然、谋杀或终局阴谋','仅写1–3章，完成后暂停正文'],excluded_items:['本轮第4章正文','把方法验证当真人文学定稿'],unresolved_items:['普通细节由代理实施，非真人逐项确认'],effective_range:{from:1,to:null}}});
write('decision-agent',{expected_revision:2,operation_id:'G_A_V2_AGENT_PLAN',author_evidence:evidence('普通命名、情节和文风细节你可自行判断'),decision:{id:'D_AGENT_SCHEME',topic:'代理试写方案与未决',status:'candidate',options:['旧阅览室挂钟、二十七号牌与无回址信；本次授权内选用'],adopted_items:[],excluded_items:[],unresolved_items:['钟守义本名及挂钟方案由代理选用，未获真人逐项采纳','寄件者当面出现方式、材料费金额、搬迁后的开放分工未定'],effective_range:{from:1,to:null}}});
write('volume-1',{id:'V1',title:'谁来签收',start:1,end:3,promises:['核对信、修理牌与旧钟的联系','种下T_TEST15的一次十五分钟实测与反馈约定'],constraints:['信由收件人拆开','人有工钱、工时和清点责任','正文事实不得来自未来大纲'],reserved:['寄件人的完整身份动机','钟到阅览室后的实测结果'],arcs:[{id:'A1',start:1,end:3,goal:'把模糊求助变成可执行的物件核对与约定',payoff:'钟与牌的修理号相符；三人承担不同责任',forbidden:['本卷交付尚未发生的实测结果','替人物全知寄件人']}]});
write('volume-2',{id:'V2',title:'把钟送回去',start:4,end:6,promises:['回读首次与最近证据后完成T_TEST15的有限实测与反馈','说明信的主要来意'],constraints:['本轮只有粗骨架，未经新授权不写正文','不能更改缺口、邮戳、交接等既定事实'],reserved:['寄件者不愿公开的私事可保持未决'],arcs:[{id:'A2',start:4,end:6,goal:'完成归还和一次实测，处理普通人情旧账',payoff:'T_TEST15可于第5章有限兑现，不强迫所有秘密结案',forbidden:['超自然解释','谋杀','终局阴谋','新卷悄改旧卷事实']}]});
const common={cast:['林柯','钟守义','陶芷'],setting_refs:['设定/作品定位.md','设定/文风.md','设定/权威规则.md','人物/主要人物.md','大纲/核心承诺.md','大纲/全书大纲.md'],research_refs:[],arc_id:'A1'};
write('plan-1',{...common,unit:1,title:'没有回址',goal:'林柯按时送到一封无回址的普通信',change:'钟守义取出旧修理牌，林柯答应转口信，投递任务成为个人协调',beats:['雾港路十七号午前，林柯找收件人，钟师傅还要招呼付费顾客；不为悬念虚构身份核验制度','钟师傅当面拆信，信纸与黄铜牌可见；牌孔边小缺口只能证明外观','林柯想走，却因钟师傅旧钟与图书馆清点的争执接下传话，约晚些回话'],forbidden:['林柯私拆信','揭寄件人','钟或修理牌无动作换手','陶芷提前得知信内容'],recall_ids:[]});
write('plan-2',{...common,unit:2,title:'清点单外',goal:'林柯把口信送到陶芷，争取她去核钟',change:'陶芷不按旧牌签收，提出现场核对；林柯承诺下班后一起去',beats:['同日下午旧阅览室，陶芷赶清点又要接待读者，林柯只能口述信和牌，原物仍在钟铺','清点单与相片提供对应线索而非产权定论；陶芷误以为钟师傅只等钱','陶芷决定带旧登记簿去铺，林柯回邮站完成本职再来；付出下班时间'],forbidden:['陶芷知道作者秘密','口述变成见过原件','未来约定当事实登记','替未到场钟师傅新增知情'],recall_ids:['O_LETTER','O_TAG27','T_SENDER']});
write('plan-3',{...common,unit:3,title:'先走一刻',goal:'三人在钟铺确认钟牌对应并谈妥下一步',change:'找到修理号与旧登记簿对应；牌签交陶芷，钟信留铺；实测仍未发生',beats:['当日晚钟铺，陶芷带旧登记簿与林柯到场，钟师傅仍担心被写成扣钟','取钟开后盖核铅笔号与旧簿，不据相符认定谁寄信；试摆短时不是十五分钟验收','三人约周六阅览室实测十五分钟并留结果，林柯负责问海堤代办所转告方式','陶芷签条接过二十七号牌入拉链袋，钟师傅收存信与钟；暂不运钟'],forbidden:['写周六已经实测','交代全部寄件人秘密','用登记ID作人物台词','写第4章'],recall_ids:['O_LETTER','O_TAG27','OBS_TAG_NOTCH','T_SENDER']});
console.log(JSON.stringify({project,evidence_sha256:sha,inputs:fs.readdirSync(out)}));
