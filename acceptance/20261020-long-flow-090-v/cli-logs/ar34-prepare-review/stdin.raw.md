import fs from 'node:fs';
import crypto from 'node:crypto';
const v='D:/work/other/ai-writer/acceptance/20261020-long-flow-090-v',w=v+'/scenario/东岸末班船-扩展验证';
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const t=JSON.parse(fs.readFileSync(w+'/.writer/drafts/v-ar-review-1-6-before.json','utf8'));
const s=JSON.parse(fs.readFileSync(w+'/.writer/state.json','utf8'));
if(s.revision!==t.expected_revision)throw Error('Review template revision drift');
const texts={};
for(const [ref,hash] of Object.entries(t.source_hashes)){
 const bytes=fs.readFileSync(w+'/'+ref);if(sha(bytes)!==hash)throw Error('Review source drift: '+ref);
 // Resolve paths through the already generated review template; unit order is explicit there.
 texts[Object.keys(t.source_hashes).indexOf(ref)+1]=bytes.toString('utf8');
}
const observed=(unit,text,quote)=>{if(!texts[unit].includes(quote))throw Error('Quote absent '+unit+': '+quote);return {status:'observed',text,evidence:[{unit,quote}]};};
const rows=[
 [1,
  ['在十点关门前处理西门、失物和沈禾的还箱请求。','我十点得把两扇都锁上。'],
  ['现场箱子与借具条不足以形成受托收还，梁伯未接电话，沈父最初口信含混。','他什么时候说的？'],
  ['不凭箱貌把箱交走，借电话厘清并等约定回拨；同时为备货单拍照和有条件代送留路。','等老梁电话说定，我去的话就带。'],
  ['箱留矮桌，约到九点十分再联系；原单代送有条件成立，未当作送达。','那就等到九点十分。'],
  ['沈禾由急着拉箱转为接受暂候与具体帮助，许蓉照料而不替人承诺。','先垫着。水有点烫，慢点喝。']],
 [2,
  ['获得具体委托与退款办法，并让原备货单及时到店。','你替我把这一箱收回来。'],
  ['钱和单在铺里、箱在码头，须十点前往返；还要绕菜场送单。','先把她的单子送过去，再进铺。九点四十前回来。'],
  ['按梁伯要求取实名钱袋而不垫款，周岸多绕一趟；许蓉接受小车不借的家庭需要。','你别拿自己的先垫，去拿那个袋子'],
  ['原单实际送达、老板确认按新量备货；箱未开未点，押金未退。','原单收到 周师傅送的 明早按新的做 你别再跑店里了'],
  ['许蓉收回顺手安排他人的提议，尊重沈家仍需小车；父亲开始留饭等女儿。','家里买米用。这个不能借']],
 [3,
  ['按清单完成有限还箱、押金实退和纸据分联。','手锯、锤子，两把钳子，两把起子，两把木凿。八件。'],
  ['锤柄浅缝需确认旧损，复写签名也需看清，不能以点到八件略过。','那道旧的，没松。'],
  ['梁伯据照片确认旧缝后收还；周岸与沈禾当面点清钞票、签据。','八十全退，收好了。'],
  ['箱交周岸并装车赴铺，八十及两纸随沈禾回家；35元仍未付款。','小票带到了，夹本里，钱没付。'],
  ['沈禾愿面对可能的损坏，也能在明确交接后回家吃饭；互助不再靠含混托付。','我爸要是用坏了，您照着说。']],
 [4,
  ['处理停航后减量早班，争取让赶桥上班的人仍买得到早饭。','少蒸两笼'],
  ['减量并不免洗刷，陈秀不能等首笼蒸熟；提前到店也不能把晚活留给别人。','不能因为早上两包，晚上就少弄一堆。'],
  ['沈禾提早半小时到，谭老板接后半小时热笼收尾，仅试两包并约自取。','五点。比平时早半个钟头。'],
  ['许蓉实际买糕并回送包装使用反馈，陈秀下午确认次晨两包；首单次晨交付尚未发生。','五点五十能拿？'],
  ['沈禾与老板开始协商工时分担，顾客也明确拿不到便先上班，关系有条件而不欠人情。','明早这个数可以先试，两包，再多的先别替别人应。']],
 [5,
  ['看清柜门与层板问题，给沈禾饭盒争取能顺手取放的位置。','问能不能留一块顺手拿的地方'],
  ['旧孔松，不能只换合页；父亲原先的放法占用饭桌，受伤也限制搬动。','原孔松了。光换个合页，拧回去还得晃。'],
  ['暂不安装，周岸量位置并带旧样；父亲同意按女儿饭盒预留。','先记着，照她这个盒子留。'],
  ['柜门靠墙、短螺丝留家、旧样随周岸下楼；当晚父女一起做饭装盒，没有预支修好。','合页和便笺分开裹好，搁进包的侧袋'],
  ['父亲由按自己手势摆柜，转为先给女儿装饭、为她留过道并承担次晨热饭的约定。','父亲用干净勺子先给饭盒装一份']],
 [6,
  ['把旧绕行图的入口与身体实际行走对上，避免对推车者只说图上都有。','从他们平常指给人的起点走'],
  ['石阶、缓坡和沟边各有代价，同事要接孩子，许蓉不能任意延长离岗或绕取快递。','最迟五点。我得去接孩子'],
  ['许蓉亲走石阶，随后两人走缓坡到桥头；回岗补图并拒绝再绕取件。','今天不绕那边了。'],
  ['母图入值班簿、三张补图一张交出两张留盒，未补图封存；未核对岸、未见妇人走完。','东岸两个口，到桥头就回了。'],
  ['许蓉守住替同事换回的时间，也接受女儿为自己带饭、洗盒的照料而不包揽。','她将洗碗的事留在那里']]
];
const keys=['goal','obstacle','choice','consequence','relationship_change'];
t.chapter_functions=rows.map(([unit,...values])=>({unit,...Object.fromEntries(values.map(([text,quote],i)=>[keys[i],observed(unit,text,quote)]))}));
const ev=(unit,quote)=>{if(!texts[unit].includes(quote))throw Error('Comparison quote absent');return {unit,quote};};
t.comparison={
 similar_structures:[
  {units:[2,4,6],judgment:'均有明确时限内替他人多做一件事，表面存在代办、回话和纸张动作的相似。',differences:'第2章的代送为沈禾免掉当晚再跑店；第4章将销售机会与提前工时、下午收尾交换；第6章实际离岗步行并按约回岗，路线身体成本和家务边界进入选择。',preserve:'保留时限对选择的约束及已经发生的微小收益。',optional_adjustments:['后续优先写次晨实际交付、剩货和排工，不再连续安排同构的说明、回话、重抄。'],uncertainty:'当前仅六章的知情模型实读，不能预测陌生读者会否感到重复。',evidence:[ev(2,'先把她的单子送过去，再进铺。九点四十前回来。'),ev(4,'不能因为早上两包，晚上就少弄一堆。'),ev(6,'今天不绕那边了。')]},
  {units:[3,5,6],judgment:'饭与归置物件反复出现，但关系方向已有变化，并非每章都以清点物件作为主进展。',differences:'第3章完成受托交箱和退款，沈禾得以回家；第5章父女共同安排饭盒位置、父亲先装她的一份；第6章许蓉吃女儿备的饭，接受女儿次晨洗盒，公共帮助者也成为被照顾的人。',preserve:'保留日常动作用于呈现关系，不加抽象道理收束。',optional_adjustments:['后续让上述选择承担时间或使用上的后果，避免饭盒仅反复充当温情结尾装饰。'],uncertainty:'第5章柜内空间和第6章洗盒尚有未执行部分，不能据现有意愿认定关系已永久改变。',evidence:[ev(3,'回去吃饭吧。'),ev(5,'父亲用干净勺子先给饭盒装一份'),ev(6,'她将洗碗的事留在那里')]}
 ],
 distinct_gains:['第1—3章已完成箱、钱、据的有限归还；扩展不撤销这个已完成单元。','第4章已有实际售糕、包装反馈与次晨有限订单，劳动工时交换仍需后续兑现。','第5章当面量柜、带样和共同装饭是新增行动；父亲承认女儿的使用需要，但不等于柜子已修。','第6章许蓉与老何实际走东岸入口、按时换岗，三张补图已一出两留；对岸和送饭结果仍未知。'],
 preserve:['O_BOX_PAINT三项原观察、author_truth、resolved状态不改，不再强造悬疑。','周岸自用工具包与原箱分离；原八十退款闭环、35元月底未付保留。','第6章开头的同日下午标志及人物亲见、口述、照片的差别。','普通人的误说、笑话和即时改口，不为整齐口吻统一抹平。'],
 optional_adjustments:['7—9若获新提示，把第4章提前开工的代价落实到真实交付、收尾与分工，不再用重复电话证明。','11章的饭盒空间应有实装、承重和再次取放后果；12章路线线索须由具体出行或协作变化兑现。'],
 limits:'实际连续实读当前六篇整稿，并核对第2章漏写明早与第3章另取干图等原文；这是同一创作模型的知情自审，未做真人盲读、市场测试、正式发布验收。计划中的8/11/12兑现及所有次晨约定不算已发生。'
};
t.report='审查/V-A-恢复-0001-0006-连读功能比较.md';t.operation_id='v-ar-review-1-6-r21';t.issues=[];
fs.writeFileSync(w+'/.writer/drafts/v-ar-review-1-6-filled.json',JSON.stringify(t,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({template_revision:t.expected_revision,from:t.from,to:t.to,report:t.report,units:t.chapter_functions.length,input_sha256:sha(fs.readFileSync(w+'/.writer/drafts/v-ar-review-1-6-filled.json'))}));
