import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const V = process.cwd();
const W = path.join(V, 'scenario/东岸末班船-扩展验证');
const sha = b => crypto.createHash('sha256').update(b).digest('hex');
const read = p => fs.readFileSync(path.join(W,p),'utf8');
const stateBytes = fs.readFileSync(path.join(W,'.writer/state.json'));
const state = JSON.parse(stateBytes);
if (state.revision !== 42) throw Error('expected revision 42');
const input = JSON.parse(read('.writer/drafts/br2-review-7-9-template.json'));
for (const [p,h] of Object.entries(input.source_hashes)) if(sha(fs.readFileSync(path.join(W,p)))!==h) throw Error('body drift '+p);
const bodies = Object.fromEntries(Object.entries(input.source_hashes).map(([p])=>[Number(p.match(/正文\/0*(\d+)-/)[1]),read(p)]));
const ev = (unit,quote) => {if(!bodies[unit].includes(quote))throw Error('quote missing '+unit+': '+quote);return {unit,quote};};
const observed = (unit,text,quote) => ({status:'observed',text,evidence:[ev(unit,quote)]});
input.operation_id = 'v-b-resume-v2-full-read-seven-nine';
input.report = '审查/V-B恢复-当前0007-0009完整连读.md';
input.chapter_functions = [
  {unit:7,
    goal:observed(7,'按首日约定先做好陈秀两包四块，保住下午半小时；开始把同一双手上互抢的活排开。','两包以外还多两块'),
    obstacle:observed(7,'双人早到却彼此挡手，笼布未铺平，原想加卖的两块破了；送货、钱盒又来抢注意。','原想多出的两块塌在边上'),
    choice:observed(7,'不以破角补顾客份量，不再兼顾钱盒/送粉，把四块先安置；请老板接走门外的活。','你拿吧，我先把这个分开。'),
    consequence:observed(7,'完整四块留住、破边另置自吃；老板真正搬粉，取货尚未发生，留下8的当面检验。','两人将粉袋搬进来，没有叫她放下盘子。'),
    relationship_change:observed(7,'分工由她顺手全接变成老板也实际承担；她说出要剪发，老板确认本次3:30先走，尚未兑现。','下午三点半你走，别等到四点又跟我算。')},
  {unit:8,
    goal:observed(8,'完成约定的当面交付，并实际拿到下午属于自己的时间。','沈禾将袋子挪过来，仍托住袋底。'),
    obstacle:observed(8,'常规糕未熟，三包赶车客仍来；临走未凉笼和次日老板进货又诱发她加早承担。','我明早要去进货，守不了灶。'),
    choice:observed(8,'不提前售未熟糕，不再加早闹钟保证所有人方便；按本次约定把笼留给老板，去剪头发。','那就别先接早的。照平常的来，我一个人看不住里外。'),
    consequence:observed(8,'5:46两包实交、8元实入店盒；破边本人和老板吃净、三包客离开。老板收热笼，3:30她离店，3:58剪发付费完成。','她照镜旁标的价钱，用自己的手机付了款。'),
    relationship_change:observed(8,'双方能够承认工时和营业损失，不只口头叫她先走；老板自己继续洗，她不接回。个人时间有实际内容。','她站了一下，没从他手里接回来。')},
  {unit:9,
    goal:observed(9,'周岸把沈家活落实为可执行报价与时段，许蓉把当班照料真实交给同事。','我得先把答应的排下。'),
    obstacle:observed(9,'抽屉顾客要今晚跟去，原两件工未收；检修灯要顺路绕送，临离岗仍有椅子和扫地问事。','你跟他熟，省得我们明天又去找。'),
    choice:observed(9,'周不应当晚新活并承担失单，许不代送代拨；周在既有工和沈家作息之间商定第四日16:30、76元做妥再付。','今晚不应了。'),
    consequence:observed(9,'新顾客抱抽屉离开；周自付26购料并预下料、取锅进铺未修；许18:30交钥匙母图并实际走到药店，老何开始答事。','许蓉听见了，手从门把上放开，走下台阶。'),
    relationship_change:observed(9,'沈家父女参与价格、时间及摆盒约定，服务不再靠女儿无期等候；老何能够自己接下当班判断，许未接回话。','你把价钱和时间写给我。')}
];
input.comparison = {
  similar_structures:[{
    units:[7,8,9],
    judgment:'三章共同写不把顺手的事全揽回来，存在主题性相似；7—8为同一次试早取的准备/兑现连续段，9另转排工与交班。当前不判为必须重写的同构重复。',
    differences:'7的阻力落在同一双手/布褶和备货损耗，后果只到四块留住；8让顾客、现金、失去三包和剪发动作兑现；9改变职业接单与同事责任分配，拒绝使一位顾客确实离开，配料/搬锅/交钥匙皆为新行为。9一次电话用来达成未定价格和时刻，没有连环查证代替行动。',
    preserve:'保留7等待与8接续的时间连续性，保留破边和失单代价；9允许别人不谅解，不把拒绝都写成获得赞许。',
    optional_adjustments:['若作者更偏快节奏，可压7备货器具挪动或9绑绳/票据，但不改现稿，不增悬疑冲突。'],
    uncertainty:'同一知情模型已经知道细纲，不能代替陌生读者对慢节奏的耐受判断。',
    evidence:[ev(7,'两人将粉袋搬进来，没有叫她放下盘子。'),ev(8,'刚才没做成额外两块，也没接到三包'),ev(9,'那我问问别人。一个抽屉，等这么多天。')]
  }],
  distinct_gains:['7：专注先做好两包，老板实际接住钱盒和送货，未提前宣布取货成功。','8：当面收8元交两包、处置破边和失去三包，半小时转为已完成的剪发；次日先不接早取。','9：为排工付出失单代价，配新料并达成有价有时的未来约；许蓉真实交班并走开，老何开始独立接事。'],
  preserve:['8不补同事收到糕或吃到糕的场外结果；一次试行不升级为长期经营定式。','9配料/约定与11安装/摆碗分开，9室内交图责任与12实际出行分开。','人物所知来自现场、电话、文字，未写别人自动知道早取、理发或沈家采购。'],
  optional_adjustments:['图纸解释与动作细节压缩、节奏加快属于可选偏好；本轮不升级为旧章必改。'],
  limits:'本次为按当前登记路径完整连续阅读7—9后的知情模型自审，回看4章204—272、5章78—183、6章126—200和V4/V5承诺。未让真人或陌生读者盲读，未作市场或正式产品验收；没有新确认的旧章硬问题，不修1—8。'
};
input.issues = [];
delete input._instructions;
delete input.output;
const basis = ['正文/0004-少蒸的两笼-v1.md','正文/0005-门板靠墙-v1.md','正文/0006-走一遍再画-v2.md','大纲/分卷/V4.json','大纲/分卷/V5.json'];
const bind = [...Object.entries(input.source_hashes),...basis.map(p=>[p,sha(fs.readFileSync(path.join(W,p)))])].map(([p,h])=>`- ${p}：${h}`).join('\n');
const report = `# 当前7—9完整连读与跨卷功能比较\n\n同一实际B恢复会话，知情模型自检。第9正式record成功revision42后，按state当前路径从7至9顺序全文读，分别156/181/220行；随后回读4章204—272、5章78—183、6章126—200，并读V4/V5分卷承诺。不是拼接首停短评，也不把初稿或细纲当成当前正文。审查时state SHA256=${sha(stateBytes)}。\n\n## 当前版本\n\n${bind}\n\n## 逐章功能\n\n${input.chapter_functions.map(row=>`### 第${row.unit}章\n\n`+['goal','obstacle','choice','consequence','relationship_change'].map((k,i)=>`${['目标','阻力','选择','后果','关系变化'][i]}：${row[k].text} 原文：“${row[k].evidence[0].quote}”`).join('\n\n')).join('\n\n')}\n\n## 相似与区别\n\n${input.comparison.similar_structures[0].judgment}\n\n${input.comparison.similar_structures[0].differences}\n\n7—8同一早晨接续有必要：7末手稳留在平盘旁、取货者未到；8从装袋起续，不把7准备冒充已卖。8后半到理发店转场，钱盒三枚币混入日常营业、破边吃净和热笼由老板承担，得失可见。9第二场明确当日分段班表，许在18:30把簿/钥匙交老何，老何实际应扫地，许走到药店；不是又一次只在心里答应离开。9周岸只有一次为定价定时的电话，前有买料/失单，后有实际预下料和去面摊坐吃，未用重复电话求证替代推进。\n\n## 三条线索与跨卷兑现边界\n\n|条目|首次与最近|截至9真实进展|尚待正文|\n|---|---|---|---|\n|T_EARLY_BATCH|4章约两包/5章告父；最近有效证据8章|7先损两块，8约5:46陈秀以五元纸币加三元硬币付8元，沈禾入店钱盒再交两包；破边本人和老板吃完，三包临客离开；3:30真走、3:58理发后用本人手机付费。|陈秀同事收到/吃到未见；次日暂不接早取，长期频次未定。9未传播这些结果。|\n|T_SHELF_USE / P_HINGE_SAMPLE|5章量柜试摆留位、获准带一片旧合页；最近9章|周持样自付26元买16+8+2新料并预下留量；旧片分包仍在周包侧。电话父女接受第四日16:30、材料26加工50合76做妥再付，文字回执成立。沈禾称洗好盒在家。|未安装、未最终摆碗、未收76、未还旧片；11须当面试关门和真实使用后果。|\n|T_ROUTE_STEP / P_ROUTE_MASTER|6章许走石阶、二人走缓坡到东岸桥头；最近9章|6母图/三张补图，一张交妇人，只见往药店走；9母图夹簿仍候船室，由许实交老何，钥匙也交后挂窗后，两小图仍盒内。|无新发图/补图/回收，外流旧版本未全收；9不是出行验证，12须具体出行与接手后果。|\n\nV4两项承诺各有动作和代价兑现：8真拿真卖并承担破边/未成交/工时，9排工失单、同事接事。V5三项仍留：原35元真实付款（10）、柜门与碗架实际使用（11）、具体绕行（12）。月末及具体复航日期未被本轮选择；后续需以实际相对日序协调，不能拿章号当日期。\n\n## 知情、物件和费用\n\n周岸亲见采购付款/新顾客离开/取锅，9电话才获沈禾平日16点下工、盒在家；不知8早取/理发，沈家父女只听材料价未亲见买料。许蓉与老何只知6所走东岸范围和9接班，不知妇人最终是否走坡或过桥，也不知沈家新价。许女儿只获她走到药店的回字，未写已到家吃面。\n\n陈秀8从店离开后下游未知；老板说明明早要进货仍是将来。两把借椅9由许亲问仍在用，老何记收工问，未写收回。坏灯由物主带走，周尚未接修。沈父脚伤未愈；挪水杯、等女儿共同挪桌仍待执行。盒子5装菜入冰箱、7携店冷藏、8洗空带离/理发、9本人称已洗在家，链条未补造他人目击。\n\n原工具箱在梁家铺架下、单据和空原袋在借具本，不用它做新一轮物证；O_BOX_PAINT整条保持。80元已退且本轮无新移动，原35未付；8元早取入店钱盒，理发沈禾本人手机付；新26元周自付，76元仅约定未收，三笔不互抵。9末新件纸袋在周自用包内、旧样侧袋、木料绑包外，包在铺门内凳旁；取回电饭煲在台上未拆，东街门把手仍待明早回装。\n\n## 真人语言别扭句\n\n有没有哪句话意思能够看懂，却让你觉得别扭、像为了写得漂亮硬拼出来，或者不像一个人当面会这样说？\n\n### 真人语言硬问题\n\n没有\n\n本次对当前三章逐句默读，按当面复述、动宾是否相接、话能否落到具体动作、是否本能想改口四项核查。9初合章所见门口/下楼、未写两点却划去、无据早回推测等问题已在新v2修正并全文复核，旧分段及v1保存；没有把修前错误当成不存在。默读并非真人朗读。\n\n### 可选偏好\n\n7工序等待与9绑绳/票据可以按作者节奏偏好压缩；图纸说明可选减量。7“金属钱”改为“硬币”更常用，也只列偏好，不判为必须修改的旧章问题。当前慢速叙述与具体劳动相配，不加阴谋或大争吵求差异。\n\n## 结论和限度\n\n当前三章功能可区分；未发现新增高置信旧章问题，issues为空。正式review输入绑定7、8、9全部当前SHA，原1—6报告与首停证据保留；依赖由随包CLI正式登记，不以补哈希当读稿。该结论属于知情模型自检，非真人盲读、市场、作者定稿或正式产品验收。第9已完成，10等待C新提示，本会话到9停止。\n`;
fs.writeFileSync(path.join(W,input.report),report,{flag:'wx',encoding:'utf8'});
fs.writeFileSync(path.join(V,'br2-review-7-9.json'),JSON.stringify(input,null,2)+'\n',{flag:'wx',encoding:'utf8'});
console.log(JSON.stringify({revision:state.revision,body_hashes:input.source_hashes,report:input.report,report_sha256:sha(Buffer.from(report)),input:'br2-review-7-9.json',issues:0},null,2));
