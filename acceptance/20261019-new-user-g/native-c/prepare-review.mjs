import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
const here=path.dirname(fileURLToPath(import.meta.url)),base=path.dirname(here),project=path.join(base,'作品','雾港 来信');
const sha=x=>crypto.createHash('sha256').update(x).digest('hex');
const write=(p,x)=>{fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,typeof x==='string'?x:JSON.stringify(x,null,2)+'\n',{flag:'wx'});};
const initial=fs.readFileSync(path.join(project,'.writer/state.json'));
const state=JSON.parse(initial);
if(state.revision!==15) throw Error('Unexpected initial revision');
write(path.join(here,'baseline-initial/state.json'),initial.toString('utf8'));
const rows=[];
for(const u of state.units){const b=fs.readFileSync(path.join(project,u.draft));write(path.join(here,'baseline-initial',u.draft),b.toString('utf8'));rows.push({unit:u.unit,draft:u.draft,sha256:sha(b)});}
write(path.join(here,'baseline-initial/manifest.json'),{revision:state.revision,state_sha256:sha(initial),units_sha256:sha(JSON.stringify(state.units)),snapshot_sha256:sha(JSON.stringify(state.snapshot)),manuscripts:rows});
const input=JSON.parse(fs.readFileSync(path.join(base,'commands/c-review-template-1-6/stdout.raw.txt'),'utf8'));
input.operation_id='c-review-1-6-actual-reading';input.report='审查/0001-0006-C修前完整实读.md';
const functions=[
 [
 ['按路线送达私人来信并完成当日投递','雾港路十七号，钟守义收。'],
 ['钟要澄清扣钟名声，但不交出信牌让林代办','原件给出去，回头人家又说我没收过。牌也先留我这儿。'],
 ['林只接有限传话，不替管理员承诺','我只管传话。她来不来，我不能替她答应。'],
 ['林把陶记入路线，卷入次日还要面对的责任','林柯在路线纸背面记了一个“陶”。'],
 ['陌生收件人向投递员请求有限帮助，双方都留边界','我也没请你抬钟。']
 ],
 [
 ['陶要在核对前明确挂钟去向，仍留最后开放时段','明天来核对的不是我，换个人也得看得懂。'],
 ['账目缺日期和签名，两边要求对方先来','后面日期那格空着，接收人签名也空着。'],
 ['林主动陪陶当面核实，终止两边传话','我下班陪你去。你带簿子，他拿钟，柜台上摆开看。'],
 ['会合落实电话与时刻，看房让后；尚未接物','他把平日下班后去看的出租房信息，从手机提醒里往后挪了一天。'],
 ['陶用电话安排回应林的过满承诺，形成具体合作','所以才让你来电话。']
 ],
 [
 ['当面核实挂钟、修理号与原信，避免归还争执悬空','先看钟，十分钟。'],
 ['旧账误会仍在，实物短摆后停，不能直接认全好','钟摆越荡越窄，没过多久便停住。'],
 ['陶选择记暂存并提有限实测，林先问留回话办法','停了就记停了，我不请您签个‘全好’。'],
 ['约定周六九点与分工，借牌签条，钟未搬','借二十七号铜牌核对，钟暂存钟铺'],
 ['师傅接受陶带牌核对，三人从互疑转为有限合办','这个她带走，认账得有东西。钟今天不搬。']
 ],
 [
 ['安全把挂钟接回供试，林保住当日邮路与看房时间','这趟能帮到九点半。'],
 ['窄街和钟的重量使搬运必须分工护物','一个卖菜的筐就能堵住半条道。'],
 ['拆摆裹布、垫车收带，再挂稳复装而不急试','钟师傅搬来小凳，先卸下钟摆，用布裹住交给陶芷'],
 ['牌归钟，钟接回但未测试，陶签收责任明确','周六上午接回，待试'],
 ['陶用借车玩笑接住林限时，师傅从争辩转向护物','我问的是你知不知道哪家借车，不是再借一个人。']
 ],
 [
 ['完成真实十五分钟观察并留下可询问的结果','打开十五分钟倒计时'],
 ['开放中的杂务分散注意，钟慢带来修饰结果的诱惑','至少让三个人等出来的东西好看些。'],
 ['等满再记，明确慢约一分钟而不拨成准钟','等完再记。'],
 ['签一次有限观察，原件留桌，抄件交林待送','期间未见停摆，结束时钟面约九点十四分'],
 ['师傅由怕背责任变为认可共同有限证据','这张我认。']
 ],
 [
 ['把回话真正留到可取阅处，并完成林自己的还车看房','纸放进去以后，她将封套插到柜台里的留言夹'],
 ['柜台不识寄件人、留件有期限，迁钟旧账仍未完','留到月底。来问的自己看，我可不知道谁寄的。'],
 ['林实际还车，拒绝无法保证的周一帮工','那天早班，不能答应。'],
 ['原记录入陶旧簿、钟留锁屋、抄件在海堤；林去看房','现在过去'],
 ['三人各认下一步，林不再处处接话兜底','不用。你把车送到就行。']
 ]
];
const keys=['goal','obstacle','choice','consequence','relationship_change'];
input.chapter_functions=functions.map((f,i)=>({unit:i+1,...Object.fromEntries(keys.map((k,j)=>[k,{status:'observed',text:f[j][0],evidence:[{unit:i+1,quote:f[j][1]}]}]))}));
input.comparison={
 similar_structures:[
  {units:[1,2,4,6],judgment:'林反复面对帮忙与个人时间的取舍，是同一责任主题的阶段推进；相似不等于重复。',differences:'1只接传话，2主动陪同并延看房，4学会限时，6拒绝无法保证的周一而完成能做的还车；后果从多担转向可持续协作。',preserve:'葱、午饭、邮路和租房的生活成本，以及陶不会借玩笑强迫林无限帮忙的声音。',optional_adjustments:[],uncertainty:'只比较本轮完整读过的六章；不据此保证更多章节仍无重复。',evidence:[{unit:1,quote:'我只管传话。她来不来，我不能替她答应。'},{unit:2,quote:'我下班陪你去。'},{unit:4,quote:'这趟能帮到九点半。'},{unit:6,quote:'那天早班，不能答应。'}]},
  {units:[3,4,5],judgment:'三章均有纸面确认，但确认对象与责任逐步不同。',differences:'3是借牌及暂存约定；4是实物接回待试；5是未调准的一次观察。它们把计划、交接和结果依次落实。',preserve:'不把签借条、接收实物与签观察结果压成同一次完成；保留师傅这张我认的转变。',optional_adjustments:[],uncertainty:'是文本内因果比较，未验证真实机芯与行业手续。',evidence:[{unit:3,quote:'借二十七号铜牌核对，钟暂存钟铺'},{unit:4,quote:'周六上午接回，待试'},{unit:5,quote:'本次观察，不作长期走时保证'}]}
 ],
 distinct_gains:['第1章建立无回址请求及原件保管。','第2章让陶的清点压力落到会合与林的生活代价。','第3章核号、短摆停与有限试走分工。','第4章实际运钟还牌与明确帮忙限时。','第5章留下不美化走慢的有限观察。','第6章实交抄件、分流保管与林恢复自己的安排。'],
 preserve:['日常悬疑不凭顾姓定人，不加终局阴谋。','铜牌缺口、合影掉漆与手机照片的不同证据层级。','师傅短问反问、陶具体安排与林报时间的声口；葱及看房的生活线。','费用仍未核、未付款；牌原信归铺、原钟暂留旧室与原件抄件分开。'],
 optional_adjustments:[],limits:'C已逐章完整实读当前最终1–6章原字节，并读B当前报告及父第2章意见。本报告是知情代理复核，非真人盲读或文学定稿。仅确认第2章一句可澄清的付款方向阅读问题，无新增风格意见；修后须另核，不能将修前覆盖当作候选尾段最终复读。'
};
input.issues=[{id:'I_C_CH2_REPAIR_FEE_DIRECTION',type:'readability',severity:'minor',confidence:'medium',statement:'第2章39行问他欠多少修理费可能短暂读成钟师傅欠费；41行白修才能消除歧义。局部表达可澄清，不是重大剧情错误。',suggestion:'仅将问句改为“你问过他修理费要多少吗？”，不增金额、付款、债务确定性或其他事实，保留抹平钞票的观察和陶下一句。',evidence:[{unit:2,quote:'你是不是问他欠多少修理费了？'},{unit:2,quote:'我第一句就问了。总不能让人白修。'}]}];
delete input._instructions;
write(path.join(here,'inputs/review-1-6.json'),input);
const table=input.chapter_functions.map(x=>'| '+x.unit+' | '+keys.map(k=>x[k].text+'；“'+x[k].evidence[0].quote+'”').join(' | ')+' |').join('\n');
const report=`# C进程修前第1–6章完整实读\n\n实际范围：六份最终原稿全文，分别82、84、76、74、74、74行，无未续读截断。实际原字节和SHA见native-c/readings.json及read-versions，逐章SHA如下。审查者为知情代理，参考了父会话的真实意见与B当前报告，不是独立真人盲读。未沿用B“没有问题”作为本轮结论。\n\n${rows.map(x=>`- 第${x.unit}章 ${x.sha256}`).join('\n')}\n\n## 章节功能表\n\n| 章 | 目标 | 阻力 | 选择 | 后果 | 关系变化 |\n| --- | --- | --- | --- | --- | --- |\n${table}\n\n## 比较\n\n${input.comparison.similar_structures.map(x=>x.judgment+' '+x.differences+' 应保留：'+x.preserve+' 边界：'+x.uncertainty).join('\n\n')}\n\n六章不同收益依次是请求、会合代价、实物核实与试走安排、搬运交接、有限观察、回话落地与责任分担。不为制造结构差异添加阴谋、冲突或重复问题。比较对象数组按当前review-and-registration准确七字段填写，功能表30项均带本章原句。\n\n## 实际意见\n\nI_C_CH2_REPAIR_FEE_DIRECTION：readability/minor/medium。第2章39行“你是不是问他欠多少修理费了？”仍是父记录所读SHA，41行“我第一句就问了。总不能让人白修。”显示陶询价、准备让修者获得报酬。问他后直接接欠多少，存在将他同时作欠费主语的短暂歧义；上下文可澄清，绝非重大剧情矛盾。第3章23行“你第一句问欠多少钱，第二句就问什么时候还”是在师傅立场复述被追问的顺序，不必随之改写。\n\n建议仅问句变为“你问过他修理费要多少吗？”。不新增具体数额、已报价、已付款或谁已承担债务的事实；保留林看手的联想与陶的下一句。原作者只授权隔离验证，建议和处置均是agent-within-authorized-scope，不声称真人逐项采纳。当前只是待正式采用并进入候选，尚未应用。\n\n## 真人语言别扭句\n\n有没有哪句话意思能够看懂，却让人觉得别扭、像为了写得漂亮硬拼出来，或者不像一个人当面会这样说？本次做了当面复述、动宾拆分、具体落地和默读改口四项模型语言检查；未做真人出声朗读。\n\n### 真人语言硬问题\n\n没有\n\n上述局部可读性意见保留medium置信度，不把可恢复的问句说成语法硬错。动宾拆分时“问他欠多少”可把他牵成欠费者，当面复述更自然的是向师傅问价，阅读代价是需要下一句回正；具体行动、人物声音及费用事实并无证实矛盾。除这条已有真实意见外，不造可选风格意见。\n\n## 连续性与应保留内容\n\n林1章读原信、2章空手转述，陶3章亲读；原信未到海堤。牌3章借陶4章归钟，缺口旧观察不变。合影在旧簿前页，陶3章手机拍摄未等于给两人看手机。3章手拨短摆停不是15分钟测试，4章清理是师傅口述，5章才少上弦整点观察，约慢一分钟而无长期保证。6章原记录入陶簿末页并入袋，抄件在海堤柜台留言夹；林先告陶、钟稍后只获转述，不变成钟亲见送件或收簿。钟暂留锁旧室、陶持钥匙；周一运新址、旧材料账、月底取阅及寄件者身份动机仍未完成。\n\n修订授权只改第2章必要表达，允许2–6实读重登，不授权3–6改字。本进程按明确停点只重登2–3，4–6及最终尾段连读、prepare/commit留给下一进程；本报告是修前比较，不能充当候选最终尾段验收。机械检查及本报告均不证明真人文学定稿、市场效果、专业修理真实性或全书无问题。\n`;
write(path.join(project,input.report),report);
console.log(JSON.stringify({review_input:path.join(here,'inputs/review-1-6.json'),report:input.report,initial_revision:state.revision,body_hashes_match_B:true}));
