import {read,put,run,stage,hundred,base,state,evidence} from './harness.mjs';import path from 'node:path';import fs from 'node:fs';
const b=read(path.join(stage,'hundred-session.json')),p=b.workspace;
const r=read(path.join(stage,'hundred-review-template.json'));
const rows=[
 [95,['退出旧开头并写自己的当日新页','以后不直接拿去播放，也不取一句接进新稿。'],['将自己的变化讲成终于懂事会抹去旧经历，旧载体尚未全核','她不想今天将开头改得更懂事，像那个人从来没有急过。'],['保留旧字另作说明，新页只许何个人预看','看完给我，不拍不拷。'],['何指出粥句歧义，添午饭照吃，原半页独夹收回','在自己那行旁添午饭照吃'],['何既是有自身工作的人，也是有限的私人读者','我刚才说你饼不圆，你也别连这份活还给我。']],
 [96,['核盘并重听旧文件，同时争取与周见面','将昨日决定的退出说明存到旁边。'],['声音无法证明椅脚/声源；周今晚要休息','那盒带里没有能让她看见椅脚的画面。'],['不拼造完整长声，不用自己的空闲强占周的晚上','文件分别留着，没有拼成一条从未停机的长声。'],['核听有明确结束点，饭照常吃，与周另约明晚','十点三十四，她摘下耳机。'],['能表达想见也接受对方今晚独处','今晚想早点回去，也是真的。']],
 [97,['确认原两页与保管并实际告唐新限制','今天只核是不是原两张，怎么收'],['缺名原页与新版、上柜单页不能混同；邱有自己的下班时间','别写成今天才不讲。'],['另纸保留撤回日期，原页不补，唐按真实新知登记','第五十五日本人撤回后续展示朗读及匿名接用，第六十日当面核存。'],['两页两夹归邱下柜；唐收到罗停新预看和邱撤回','再送回下柜干布格'],['邱是做枕套、想早下班的人，沈不以配合索取新授权','不能晚上头已经躺下，再说我还没下班。']],
 [98,['赴有限椅约末晨，补何新信息并约个人听读','第六十一日九点二十八'],['椅存在不等未来空位，店主与店员各有安排','可我先不答哪一早一定给空着。'],['不代兜班也不拿新页重开公屋，只约两人','这次不替屋子问。'],['期纸真实取下，何获核存与核盘新知，明日下午约成','十点四十五，葛起身取门内那张期纸。'],['老人向店主直接询问，何从活动经办转为自愿私人听者','我来是想听你今天想讲什么。']],
 [99,['兑现饭约并说出现在要住的家','那句想说的话从淘米时便在'],['两人偏好、空间、班次和离开时限各不同','自己这口还没咽，她已经准备再给一勺了。'],['主动表达留住和亲近，仍不占满对方时间','这是我现在要住的家。真要换，我会告诉你。'],['两人吻与靠肩，周按时离，余饭留明日','八点二十八，周下楼。'],['周辨认出新的家之表态而非旧行程复述','今天那句家，我刚听到。']],
 [100,['履行个人私读并回邱实际通知结果','今天先读这一页。'],['沈易中断追问理解；何有歇眼与菜单时限','不必一拿纸就开场。'],['读完当前半页、不加昨晚私话，当前不排公开','目前就到今天，不打算把这一份拿去排一场公开的。'],['何15:09离不带纸音，另纸说明，邱确认收到','三点零九，何下楼。'],['沈能请一个人听而不索求其替未来人答，邱不需再次表态','你不用叫她们再到我这儿点一次头。']]
];
const fields=['goal','obstacle','choice','consequence','relationship_change'];
r.chapter_functions=rows.map(([unit,...v])=>({unit,...Object.fromEntries(v.map(([text,quote],i)=>[fields[i],{status:'observed',text,evidence:[{unit,quote}]}]))}));
r.operation_id='native-four-hundred-current-95-100';r.report='审查/native-four-95-100真实连读.md';
r.comparison={similar_structures:[{units:[95,97,100],judgment:'表面都有说明范围、纸页收存和回电话；不能仅按动作词判为同章复演。',differences:'95退出旧自页并产生新半面；97核原两页缺名且告唐，物证未变；100履行当前私读并作不排公开选择。',preserve:'保留95何指出午饭歧义、97邱自己的枕套劳动、100何歇眼及眼镜笑话；这些使配角具有本人的当下生活。',optional_adjustments:[],uncertainty:'边界解释连续出现会使一部分读者感到节奏偏慢；本次没有陌生读者数据，也没有足够理由在仅100等价回放授权下删句。',evidence:[{unit:95,quote:'在自己那行旁添午饭照吃'},{unit:97,quote:'别写成今天才不讲。'},{unit:100,quote:'我今天想请你听，今天也念了。'}]},{units:[96,99],judgment:'都以饭和约会写个人日子，功能不是重复确认同一个约。',differences:'96遭遇今晚不能见的失落并约明日；99真正做饭、主动说家与亲吻，约定成为行动。',preserve:'保留各自独处、口味及钥匙，99主动亲近不改成无限陪伴。',optional_adjustments:[],uncertainty:'仅本尾段比较，不据此判断整书关系线比例。',evidence:[{unit:96,quote:'今晚想早点回去，也是真的。'},{unit:99,quote:'今天那句家，我刚听到。'}]}],distinct_gains:['95：自述从替人总结转为具体当日生活，并经何实际理解反馈添字。','96：旧音回听无新归因，能结束工作并接受见面改期。','97：原缺名页实物核存、撤回与核存日期分开、唐真实获新知。','98：有限椅约结束且未来开放不兜底；何愿作私人听者。','99：共同饭与主动亲密、现在的家之表态；不重起旧月约。','100：私读实做与当前不公开选择、有限回声到邱。'],preserve:['未知余带声源、罗私因、上柜单页中途日期保留。','旧观察、原纸缺名、当事人撤回及各知情边界保留。','生活笑话与各角色自有劳动不能一律压成清单。'],optional_adjustments:[],limits:'同一Codex会话知情自检，登记后完整连续读取95–100共六章；1–94仅机器完整性核验。没有真人盲读、市场数据、全书文学通过或新增95–99意见。仅100等价回放，issues=[]。'};
put(path.join(stage,'hundred-functions.json'),r);
const table=['|章|目标|阻力|选择|后果|关系变化|','|---|---|---|---|---|---|',...rows.map(([n,...v])=>'|'+n+'|'+v.map(([t,q])=>t+'；引文：'+q).join('|')+'|')].join('\n');
put(path.join(stage,'真实读稿及五项功能表.md'),'# 百章尾段实读记录\n\n完整初读95–100、100细纲与原增量及设定；登记后再次从95到100连续完整实读。正文长行换行视图保留全部字符，原稿字节未动。阅读记录为知情模型自检，非盲读。\n\n'+table+'\n\n'+JSON.stringify(r.comparison,null,2)+'\n\n## 真人语言别扭句\n\n### 真人语言硬问题\n没有\n\n### 风格偏好观察\n边界说明较密，但六章承担不同变化；未形成必须修改的独立证据，允许保留。四项自然语言检查没有发现需在本授权中更改的硬问题。\n');
put(path.join(p,r.report),'# 登记后95–100真实连读\n\n'+fs.readFileSync(path.join(stage,'真实读稿及五项功能表.md'),'utf8')+'\n\n正文SHA：\n'+JSON.stringify(r.source_hashes,null,2));
run('hundred-review',['review','--revision-token',b.token],p,r);
run('hundred-prepare',['revision','prepare'],hundred,{id:b.id,token:b.token});
const c=run('hundred-commit',['revision','commit'],hundred,{id:b.id,token:b.token});put(path.join(stage,'hundred-commit.json'),c);
const c2=run('hundred-commit-idempotent',['revision','commit'],hundred,{id:b.id,token:b.token});put(path.join(stage,'hundred-commit-repeat.json'),c2);
const g=state(hundred).governance;g.stage='structure';g.task='百章等价回放及尾段复核完成，暂停，仅讨论和规划';g.authorization={allowed_actions:['discuss','plan'],draft_range:null,revise_range:null,stop_conditions:['没有进一步作者授权，不写101，不修正文']};
run('hundred-pause',['workflow','set'],hundred,{expected_revision:state(hundred).revision,operation_id:'native-four-hundred-pause',author_evidence:evidence(hundred,'研究/百章C模拟授权.md','提交及当前复核后暂停到discuss/plan，正文与修订范围均取消。'),workflow:g});
for(const [n,args] of [['check',['check']],['status',['status']],['doctor',['doctor']],['compare',['tool','compare','--other',path.resolve(base,'../..')]]]){const o=run('hundred-final-'+n,args);put(path.join(stage,'hundred-final-'+n+'.json'),o);}
const e=run('hundred-export',['export','--out',path.join(stage,'hundred-export')]);put(path.join(stage,'hundred-export-result.json'),e);
console.log(JSON.stringify({revision:state(hundred).revision,commit:c,export:e}));
