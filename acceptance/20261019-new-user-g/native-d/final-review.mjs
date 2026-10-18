import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const here=path.dirname(fileURLToPath(import.meta.url)),h=JSON.parse(fs.readFileSync(path.join(here,'../native-c/handoff.json')));
const x=JSON.parse(fs.readFileSync(path.join(h.workspace,'.writer/drafts/d-final-review-1-6.json')));
delete x._instructions;
x.operation_id='d-final-complete-reading-1-6-r24';x.report='审查/0001-0006-D最终完整连读.md';
const data=[
  [['按时完成送信并确认收件地点','送信。'],['钟师傅担心扣钟名声，林仍要赶饭和邮路','我收修理钱，不收扣东西的名声。'],['只承诺替传话，信牌留收件人处','我只管传话。她来不来，我不能替她答应。'],['将自己下午路线与承诺绑定','答应别人的事，下午若装作忘了，明天这条路还是得从十七号门前过。'],['从投递者转成有限帮忙者','替我问一声。']],
  [['把钟去向核实以便清点','木壳挂钟，一架，外借修理。'],['陶未见实物，清点空格与开放并行','我连钟的实物都没见过，怎么冤枉？'],['林约下班陪陶当面对照','我下班陪你去。你带簿子，他拿钟，柜台上摆开看。'],['林推迟自己的看房安排','他把平日下班后去看的出租房信息，从手机提醒里往后挪了一天。'],['双方从互相等人改为约具体时间','晚了你来电话，我在门口等。']],
  [['当面认钟并确定可做的测试','先看钟，十分钟。'],['原钟短摆即停、顾姓不足以定人','钟摆越荡越窄，没过多久便停住。'],['陶提出暂存与有限试走','停了就记停了，我不请您签个‘全好’。'],['签借铜牌交陶，约周六测试而未搬钟','钟师傅将铜牌交到陶芷手里，她用纸裹住，放进帆布袋的拉链内袋。'],['钟接受有限合作，林为周六留时段','他的周六早晨，已经得空出一段来了。']],
  [['将钟保护运回并接收待试','陶芷在清点单上写“周六上午接回，待试”'],['运输空间和林的邮路看房限制','这趟能帮到九点半。'],['林限定帮助，三人保护钟过街','钟竖着靠住箱壁，钟师傅扶到林柯把两边的软带收紧才松手。'],['牌归钟、钟归旧室，8:58待检查','手机八点五十八。钟摆垂着，等着师傅最后检查。'],['陶接住林的界限，不再多借一个人','我问的是你知不知道哪家借车，不是再借一个人。']],
  [['完成一次十五分钟观察','打开十五分钟倒计时。'],['钟疑似慢、读者与空间要照顾','他忽然很想让师傅拨一下'],['如实等完再记录，不美化读数','等完再记。'],['三人签有限结果，原件留桌抄件由林带走','期间未见停摆，结束时钟面约九点十四分'],['师傅肯认有限结果而非全好','这张我认。']],
  [['给结果一个可回访地点并收束责任','这是抄件，原的在阅览室。'],['寄件人未知、周一工作与旧账仍未解决','那天早班，不能答应。'],['林完成可做到的交件还车，拒绝额外兜底','这个能做。'],['抄件入海堤，原记录收陶袋，钟留旧室','她将封套插到柜台里的留言夹'],['三人各保留自己责任，林去看房','这些事都有了能再问的地方，他却不必每一处都守着。']]
];
const fields=['goal','obstacle','choice','consequence','relationship_change'];
x.chapter_functions=data.map((row,i)=>({unit:i+1,...Object.fromEntries(row.map(([text,quote],j)=>[fields[j],{status:'observed',text,evidence:[{unit:i+1,quote}]}]))}));
x.comparison={similar_structures:[{units:[2,3],judgment:'两章都有核对和促成会面，属于连续推进而非相同结果的复写。',differences:'2从转述到约见、推迟看房；3亲核原物、签借牌并约有限测试。',preserve:'陶未核实不签收、钟未试好不签全好及各自说话习惯。',optional_adjustments:[],uncertainty:'知情模型判断；没有真人重复感或追读验证。',evidence:[{unit:2,quote:'我下班陪你去。你带簿子，他拿钟，柜台上摆开看。'},{unit:3,quote:'停了就记停了，我不请您签个‘全好’。'}]},{units:[4,6],judgment:'两章均有物件运送及帮助边界，行动对象和关系后果不同。',differences:'4把钟运回旧室接收待试；6抄件交海堤、原记录收簿、林拒绝周一额外帮忙并去看房。',preserve:'原物交接动作、分别告知和林逐步学会有限承诺。',optional_adjustments:[],uncertainty:'只覆盖六章现稿，不判断未写后续的结构。',evidence:[{unit:4,quote:'这趟能帮到九点半。'},{unit:6,quote:'那天早班，不能答应。'}]}],distinct_gains:['1建立信与有限传话承诺。','2让林付出时间换取当面核实。','3以原物核对替代遥相误会并约有限测试。','4落实原牌归还、保护运钟和临时接收。','5消耗十五分钟并如实记录不完美结果。','6完成回话可取阅的交付，保留未知与未来计划，林回到自己的生活。'],preserve:['葱、面包、椅子、旧电池的日常质感与三人不同声音。','旧观察、物件与知识链、有限结案和未决账目。'],optional_adjustments:[],limits:'全部重登后在最终字节上从1至6完整连读；第1章只读原登记保留。报告列限制说明稍密的风格观察，未确认为硬问题。不是真人盲读、文学定稿、专业钟表或市场验证。'};
x.issues=[];
fs.writeFileSync(path.join(here,'inputs/review-final-1-6.json'),JSON.stringify(x,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({from:x.from,to:x.to,revision:x.expected_revision,functions:x.chapter_functions.length,hashes:Object.keys(x.source_hashes).length,report:x.report},null,2));
