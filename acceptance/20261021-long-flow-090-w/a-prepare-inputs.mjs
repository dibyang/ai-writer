import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
const W=path.dirname(fileURLToPath(import.meta.url)),P=path.join(W,'scenario/东岸末班船-规模验证');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const save=(name,value)=>{const f=path.join(W,'inputs',name);fs.writeFileSync(f,JSON.stringify(value,null,2)+'\n',{flag:'wx'});return {file:f,sha256:sha(fs.readFileSync(f))};};
fs.mkdirSync(path.join(W,'inputs'),{recursive:true});
const source=fs.readFileSync(path.join(W,'prompt-a-first.md'));
const localSource='研究/W-A-测试授权原文.md';
fs.writeFileSync(path.join(P,localSource),source,{flag:'wx'});
const lines=source.toString('utf8').split('\n');
const authorEvidence={quote:lines[4]+'\n\n'+lines[6],local_source:localSource,source_sha256:sha(source),locator:'W/prompt-a-first.md第5—7行；人类原话在第3行，测试规模和停点为根执行器选择，第13—17行限定本进程；本地副本与源同字节',recorded_by:'Codex W-A 本进程；未伪造人类消息ID，未将代理选择称为人类逐项设定'};
const state=JSON.parse(fs.readFileSync(path.join(P,'.writer/state.json'),'utf8'));
if(state.revision!==55||state.units.length!==12)throw Error('Unexpected baseline; stop');
const planning={
 positioning:{status:'adopted',refs:['设定/作品定位.md','设定/文风.md','设定/权威规则.md','设定/人物与声音.md'],unresolved_ids:[]},
 structure:{status:'adopted',refs:['大纲/扩展骨架-W.md'],unresolved_ids:[]},
 volume:{status:'adopted',refs:['大纲/扩展骨架-W.md'],unresolved_ids:[]},
 outline:{status:'adopted',refs:['大纲/近期细纲-W-13-15.md'],unresolved_ids:['16—24仅远期骨架，逐阶段滚动细化']}
};
const workflow={stage:'trial',task:'W扩规模有限试验13—24；本进程A只写13章01/02两个分段后停，同ID恢复13—15；其余阶段按原文另行恢复',authorization:{allowed_actions:['discuss','plan','draft'],draft_range:{from:13,to:24},revise_range:null,stop_conditions:[
 '本进程严格只实写分段/0013/v1/01.md与02.md，各1800—2400正文汉字；两段完整实读，保存交接后正常退出等待根独立核验。',
 '本进程不写03、不assemble、不record13、不写14—24正文。第13章目标至少6000正文汉字，本次不足是计划中断，不能称章完成。',
 '后续A同ID完成13—15；B新鲜16—17停/同ID18；C新鲜19—20停/同ID21；D新鲜22—24后另登记正式修订范围13—24，独立区仅重登13停/同ID同token续14—24，最后F新鲜全文回读及暂停导出。未到阶段不提前执行。',
 '新增普通章至少6000正文汉字且至少3段；15/18/21/24至少8000且至少4段；全文分段及合章实读，报告绑定真实两SHA，preview退出0才record。',
 '前12正文与state.units对象保持，V/U/T及其他封存只读；不恢复指向V的历史修订，不改已消费source、不刷新旧期望哈希。',
 '所有新增写入仅W；不改根产品/其他作品、不另派代理、不Git提交或推送、不上传。缺陷留复现报根，不绕过产品。',
 '只登记实际发生事实，不改任何observation type/statement/author_truth；未来候选与代理方案不冒充人类逐项设定或已发生事实。'
 ]},planning};
const created=[];
created.push(save('a-workflow-trial.json',{expected_revision:55,operation_id:'w-a-trial-13-24-first-two-parts',author_evidence:authorEvidence,workflow}));
const commonConstraints=['保持前12正文、state.units及全部observation三项；不重新打开旧箱钱据悬疑','人物知情各有原文来源，未来安排不写成已发生','不用阴谋、万能物证、技术奇迹或重复电话验货撑篇幅'];
const volumes=[
 {id:'V6',title:'腾出来的地方',start:13,end:15,promises:['母女为女儿修衣小课腾出实际桌面和时间','周岸与面摊主议定可承担的窄凳活','沈家共同拆洗一部分窗帘，选旧布的后用'],reserved:['第一次晚课真出门','窄凳实际制成使用','旧布袋跨卷实际使用'],goal:'从有空再说转成可承担的一小段',payoff:'做完本卷有限家务与选择，为下一卷各自出门留地方'},
 {id:'V7',title:'出门的人',start:16,end:18,promises:['让歇班的一部分时间用于自己','实际推进凳子制作','女儿第一次真正参加晚课，沈父按体力短程使用布袋'],reserved:['晚课后手艺的实际用途','窄凳制成后的实际使用','布袋的洗晾和磨损后果'],goal:'从备物和约定走到一次真实出门',payoff:'18以可见行动兑现13—15至少一条承诺，保留小安排的代价'},
 {id:'V8',title:'轮换的日子',start:19,end:21,promises:['许和何调整一个有限值守时段','沈禾与老板承担一次常规工序选择的后果','21使凳子、袋子和修衣所得在真实需要中发生作用'],reserved:['21留的一次借还或接手','下一次晚课与各自休息'],goal:'面对别人的时间变化而实际轮换',payoff:'21跨卷行动产生关系后果，并留下22—24可承担的小承诺'},
 {id:'V9',title:'各自回去',start:22,end:24,promises:['完成21留的归还或接手','各人能沿自己的时间出门或收工','凳与袋后续去处明白，晚课继续有实际行动'],reserved:['父辈全史继续留白','正常生活还有明天；复航按需要另选并有真实通知'],goal:'完成有限承诺而不替所有人包办生活',payoff:'24以日常行动收束关系变化，不靠抒情总括宣布永久成功'}
];
for(const v of volumes){const {goal,payoff,...fields}=v;created.push(save('a-volume-'+v.id.toLowerCase()+'.json',{...fields,constraints:commonConstraints,arcs:[{id:'A'+v.id.slice(1),start:v.start,end:v.end,goal,payoff,forbidden:['未选复航日期当事实','把未写骨架登记为已发生','强行父辈和解或重复旧承诺交接']}]}));}
const refs=['设定/人物与声音.md','大纲/扩展骨架-W.md','大纲/近期细纲-W-13-15.md'];
const research=[localSource];
const plans=[
 {unit:13,title:'桌边留一半',goal:'第六日许蓉和女儿为女儿下周三19:00起的修衣课，在家真腾出一半桌面和一段属于自己的时间',change:'女儿自己去学，许处理自己的杂物并留一件仍想穿的旧工装给她试补；母女以晚饭和练布试出空间，第一次课尚未发生',cast:['许蓉','许蓉女儿','老何'],arc_id:'A6',recall_ids:[],beats:[
 '第六日晨间装各自饭盒，女儿提出下周三起每周一次19:00修衣课、入门带一件旧衣，许从替挑最好缝的转为听她本人选择；费用尚未写实交不得报已交',
 '女儿提出家里要留一小块练习桌面，许看见自己杂物占窗边窄桌；女儿正常上班，许只处理属于自己的东西，不替她扔衣或改报名',
 '许整理出自己的旧工装，愿留着让女儿练补，仍想继续穿；不翻出家史秘密，不凭此写女儿已掌握手艺；01/02实写到此过程的具体中断，按停点退出',
 '后续恢复才写许上岗前自己的事务和正常接窗，何有自己的日程，停航仍依原通知，不重画入口或重查钱据',
 '后续恢复才写傍晚普通晚饭与练布实际试桌：灯、拉椅、饭菜和针线分开；女儿试小针，许不抢手替做，旧衣留在说定位置；第一次出门留后卷'
 ],forbidden:['本进程只写01/02各1800—2400汉字，不写03不assemble不record13','不改前12正文/units/已消费来源/不可变观察','课时属于普通事实，不设observation；不预支18课堂和21修补','不添职业变动或身世，不把旧窗扣写成已修，不重复电话点物解释']},
 {unit:14,title:'坐下再量',goal:'周岸按先报钱的约定处理电饭煲，同时和面摊主议定真正能做的窄凳活',change:'机主按实际价格选择，周岸完成其可承受一段；窄凳从泛泛想添一张变成待做的小安排，尚非成品',cast:['周岸','面摊主','电饭煲机主'],arc_id:'A6',recall_ids:[],beats:['实际问到合适配件与成本，向机主说清钱和等待，由对方选择，不以一句先看看宣告修好','按所选处理做完一段，动作具体但不写技术百科；周岸自己停下来吃饭','面摊主有营业/收摊通道和腿累的顾虑，两人坐下试现有位置，议窄凳的做法材料报酬期限；只记录场上真定项','留17按空间选择与制作、21真用的承诺，不在14预支成品'],forbidden:['不提前写本章正文；须同ID恢复完成13后再执行','旧35/81不重付，不碰旧箱观察；周岸不自动知道许家晚课或沈禾零钱理发结果','拟新物件不设不可变观察，计划不进ledger']},
 {unit:15,title:'一幅一幅洗',goal:'沈禾歇班日和父亲做完一部分窗帘拆洗，同时留一段时间给自己',change:'父亲坐着参与可承担一段，女儿不包办全部；另存旧布被选择作可洗带物袋的用途，为后卷实际外出留下普通物件承诺',cast:['沈禾','沈成林'],arc_id:'A6',recall_ids:[],beats:['写明歇班与第六日的间隔，按光线晾晒和体力选先洗哪幅，父亲不登高','实际拆洗灰水并安排午饭，做不完的承认留后，不因一句有空当已经完成','沈禾说自己歇班还想做的事并出去一阵；父亲只接坐着可做的一段，女儿回来处理余下','从另存旧布选可洗带物袋，写清谁拿、用途、未做步骤，晚饭收尾；不剪坏正在用的窗帘'],forbidden:['不得在本进程写本章正文；后续只在授权阶段执行','至少8000正文汉字/四段，不能重复父女边界论辩凑数','不宣告脚痊愈或长期包办买菜，不重查80/81/柜门，不预支18/21/24用途']}
];
for(const p of plans)created.push(save('a-plan-'+p.unit+'.json',{...p,setting_refs:refs,research_refs:research}));
console.log(JSON.stringify({author_source:{path:localSource,sha256:sha(source),same_bytes_as_prompt:true},created},null,2));
