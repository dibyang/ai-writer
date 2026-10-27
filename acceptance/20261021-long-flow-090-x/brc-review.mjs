import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import{fileURLToPath}from'node:url';
const X=path.dirname(fileURLToPath(import.meta.url)),P=path.join(X,'scenario/东岸末班船-再扩展验证'),read=r=>fs.readFileSync(path.join(P,r)),sha=v=>crypto.createHash('sha256').update(v).digest('hex'),j=r=>JSON.parse(read(r)),put=(r,v)=>fs.writeFileSync(path.join(P,r),typeof v==='string'?v:JSON.stringify(v,null,2)+'\n',{flag:'wx',encoding:'utf8'});
const t=j('.writer/drafts/brc-review-template-25-30-r132.json');delete t.output;delete t._instructions;t.operation_id='x-brc-review-25-30-r132';t.report='审查/X-BRC当前25-30完整比较复盘-v1.md';
// 以下功能与比较是本执行代理原生逐页实读后的具体判断；脚本仅校对引文字节和排版，不生成文学结论。
const fields=['goal','obstacle','choice','consequence','relationship_change'];
const rows=[
 [25,[
 ['使补衣回到真正买菜/搬椅日常，朋友关系从帮忙之外起步','我去买菜，回来再脱。下午搬椅子也穿这个。'],
 ['未用足一天无法预判肘角手感，私人约日尚要各问班','我现在也说不出。到晚上告诉你。'],
 ['母亲要求洗后再看，女儿不当夜重拆；双方留远约各自挑书','等洗了看，别今晚弄。'],
 ['坐与走得到不同用感，工装实际第一次洗晾','坐桌前有一点顶，走着不觉'],
 ['从修袋/借书的往来进入互留名字号码和约一起看书','你哪天歇？不赶着还书的那种，我们一道去看看。']]],
 [26,[
 ['把私人半下午与整日休息说清，使工作排期可执行','去朋友家坐一会儿，下午不接。'],
 ['门客要自己在场、姑娘休息还与另一人的时间相关','可我想我也在，省得过后两头说不明白。'],
 ['沈把周一早班与远周日整休分开谈成，不拿一项抵另一项','星期一五点到，三点半走。下下个星期日整天歇。这是两件。'],
 ['沈获整休/早班记下，姑娘得到次日无论成否都回的约而未获准','明天不管成不成都回。'],
 ['母衣归母使用，女带练布询角；双方可以有自己的课与衣','母亲说袖子归自己穿，要带只带原来那块练的']]],
 [27,[
 ['交付拖延风扇并让远约准假落到双方消息，生活继续长出兴趣','先开吧，我听听。'],
 ['风扇仍有轻声；女孩准假仅半日，不等于沈的整日','不是一点声音都没有。'],
 ['物主听残声仍选择先用，女将准假具体时点告沈','自己回去先用。'],
 ['16实收且实物被物主推走，本章不是继续等人来取','站在门口看他推过杂货店'],
 ['两姑娘以画和口味来往，关系不止于为一个日子协调','多了一张画、两顿饭和不必都一样的口味']]],
 [28,[
 ['母亲自己挑鞋/周关铺真走/沈为次日早班作家中安排','去看双鞋。'],
 ['鞋码和脚背不合；衣二洗仍凉；女裤里外并非同一问题','大的那双脚背松了，走一步后跟便松一下。'],
 ['许按自己脚感买灰鞋当下穿，不等女陪；周给步行留时间','穿着。旧的装我这个。'],
 ['鞋100找62净38已成交，工装仍晾/父粥冷藏/闹钟4:10仍待执行','六十二放回钱夹'],
 ['母女分别听戏与问裤，沈看照只能承认看清却不会教','你记你的。我回去听，刚唱到我想听的地方。']]],
 [29,[
 ['兑现周一5点早到与15:30早走，把睡眠成本和休息收益实际写出','下午你回来，我三点半走。'],
 ['独守早柜、送粉小包漏看，父亲伤脚需自热分步端碗','问小包是不是临时添的'],
 ['沈回拨核实小包按原留款付清；老板回店先接柜再放她走','沈禾回拨老板补问小包'],
 ['15:30真的离店，早得的时间真睡过一阵而未换成洗厚帘','三点半，老板从柜前回头，叫她走吧'],
 ['父自热并告女，女听结果/亲见净碗而非隔空替做；父给女留睡觉空间','窗边那幅厚的留着，什么时候想弄再弄。']]],
 [30,[
 ['第三课让学习用在自己裤兜，周把纱门上门承诺落成有限修理','今天是自己的裤子。'],
 ['练布厚、袋里薄与外开线两种问题，贴身手感不等于母工作裤的需求','垫进去对这条裤有些厚'],
 ['女里用薄衬、外另挑近灰线，老师示范而实裤自己做','颜色留在里面，外面那一道开线以后得另找近些的线'],
 ['90分钟第三课按时结束/两处缝上，当晚自己穿坐试有限结果','八点半，老师叫收针'],
 ['母女容得下厚薄与配衣喜好不同，新反馈传到女而非自动共享老师；沈只听文字','自己想换上衣是另一回事。']]]
];
t.chapter_functions=rows.map(([unit,values])=>({unit,...Object.fromEntries(values.map(([text,quote],i)=>[fields[i],{status:'observed',text,evidence:[{unit,quote}]}]))}));
t.comparison={similar_structures:[
 {units:[25,29],judgment:'均以糕店搬粉/单据和吃饭组织劳动节奏，存在程序段相近的真实风险。',differences:'25沈与老板托底抬袋并再挪让盆，是协作负担；29老板外出，送货人用推车独落、沈对小包与付款，最终15:30交班后睡，父另场自热构成独立结果。不是改个客人就复写同一损益。',preserve:'保留25掌纹/搬笼先后和29落板不代归柜、原款收联回交，不能删尽实际体力使安排失去代价。',optional_adjustments:['未来若压篇，可先压午间盘架收放，保留对单小包差异和早走真睡；当前不据相似即重写已登记稿。'],uncertainty:'知情模型可能更能看出差异而低估陌生读者对连续操作的疲劳，未做真人节奏验证。',evidence:[{unit:25,quote:'靠她这一端没把手，她托着底角'},{unit:29,quote:'他没有叫沈禾去接，自己推到门前'}]},
 {units:[26,28,30],judgment:'都有工作请求出现后不立即接、另留时间的取舍，句法与母题有亲缘。',differences:'26客确实改约/廖在家腾椅洗壶，承担远期排期；28周关铺走56余分钟并短遇许、母亲实付自选鞋，是当日已享用；30上门实修实收22，向客户重申明日空档，但这次重申不算又一次大牺牲，更不是已赴茶。课堂把选择转入薄衬及自用。',preserve:'26说去朋友家而不拿工事遮掩、28真正走到河边、30修门物主夫妻有自己的饭与上班；保留各自具体欲望。',optional_adjustments:['后卷写真赴茶时无需再完整复述这三次排期话语，收益应来自赴约交流本身；此为后续写作建议，不新增当前授权。'],uncertainty:'30重申时段的增益较小，保留是因为新客户知情与现场收尾清楚，不能凭这句证明跨卷总目标已兑现。',evidence:[{unit:26,quote:'去朋友家坐一会儿，下午不接。'},{unit:28,quote:'今天这会儿不去了。我出来走这一段。'},{unit:30,quote:'明天两点到四点自己去朋友家，铺里也不留人等'}]},
 {units:[27,30],judgment:'均有物主或使用者亲试、接受有限结果再归还/收存，表层像修好后查验。',differences:'27是拖延修物的交付与公开残声，物主付16后推车走；30是女学习给自己做里外两处并当晚穿坐，母仍有不同厚垫经验。同桌喜酒挪扣、裙衬留记号，完成程度不同。自用与收费修物关系不同，不把所有人写成同一验收人。',preserve:'27保留轻声而不假完美，30保留薄衬的触感和没写死的使用寿命，周门另22实收不同旧款。',optional_adjustments:['可选压短30课堂末一句明白不等于缝好式总结，实作足以支撑；不删母女配衣玩笑和不同意见。'],uncertainty:'复盘未比较1—24的整个针线密度，不能宣称所有跨全书重复已排除，也未请专业裁缝做工艺验收。',evidence:[{unit:27,quote:'自己回去先用。'},{unit:30,quote:'这两处缝上了，回家穿着坐坐，自己还不知道。'}]}
 ],distinct_gains:['25：补衣进入真实穿洗，两个私人约定各有发起者与号码姓名，不替人选书。','26：问班/改门/腾椅洗壶使私人时间有现实排期，不把待答假写准。','27：风扇交付和16实收，姑娘12:30后准假，两朋友多了画、饭与口味。','28：38灰鞋自己选付/周真步行，母与女各有趣味，早班/裤里布新问题有准备而未提前完成。','29：独守/送粉/父自热/真早走睡眠四种结果，早来的成本没有用更多家务抹平。','30：第三课90分钟、自裤里外自修及穿坐/母新反馈，纱门22实结；茶书仍跨后卷。'],preserve:['温和克制、慢热合作与饭桌余韵；人物不靠争吵证明有欲望。','具体钱物和时点各归各事；不消除伤脚或补造旧问路人终点。','27母女共听戏、28鞋店袜子、29空篮客忘自己吃面、30花摊说傻一句/母女拿错电话纸。'],optional_adjustments:['保留既有两条A风格意见未采纳状态；本次只新增课堂总结句的可选压缩意见，未实改当前稿。'],limits:'r132后09:01:42.050Z至09:04:02.369Z原生FastCtx按25→30各三页完整读，limit100，18页精确续页；紧接after，state/units/snapshot/六稿SHA相同。后续另读25:141—240/241—290、27:38—57、30:80—90/241—265是链锚点，不用于补窗口缺页。知情模型自检，非真人盲读、市场、专业工艺或出版验收；未来实际赴茶/选书/长期穿用均未发生。'};
t.issues=[{id:'I_X_BRC_CLASS_SUMMARY',type:'optional_style',severity:'suggestion',confidence:'medium',statement:'30课堂末的明白不等于缝好总结略带解释，前面实作已充足，可选压短。',suggestion:'若未来获相应修订范围，可试删短此句后比较停顿；当前保留，不视作硬问题或已采纳。',evidence:[{unit:30,quote:'没有因为自己听明白就先变成缝好的样子。'}]}];
for(const c of t.chapter_functions)for(const field of fields)for(const e of c[field].evidence){const r=Object.keys(t.source_hashes).find(r=>Number(r.match(/\/(\d{4})-/)[1])===e.unit);if(!read(r).toString('utf8').includes(e.quote))throw Error('absent function quote '+e.unit+' '+e.quote);}
for(const c of [...t.comparison.similar_structures,...t.issues])for(const e of c.evidence){const r=Object.keys(t.source_hashes).find(r=>Number(r.match(/\/(\d{4})-/)[1])===e.unit);if(!read(r).toString('utf8').includes(e.quote))throw Error('absent comparison quote '+e.unit+' '+e.quote);}
const units=Object.entries(t.source_hashes).map(([r,h])=>({r,h,han:(read(r).toString('utf8').replace(/^#.*$/gm,'').match(/\p{Script=Han}/gu)||[]).length}));
let report='# 当前25—30完整比较复盘\n\n同ID X-BRC执行代理据当前完整原文作知情模型复盘，非真人盲读或作者定稿。\n\n## 阅读窗口与当前绑定\n\n'+t.comparison.limits+'\n\n正文汉字合计'+units.reduce((n,v)=>n+v.han,0)+'；早前进度消息是估数，以此逐稿清单为准。原生FastCtx尾行含末尾空行，25/26/27/28/29/30分别读至290/218/253/271/227/265；read-boundary计不含末尾空行，两者不是缺页。\n\n|当前稿|SHA256|正文汉字|\n|---|---|---:|\n'+units.map(v=>`|${v.r}|${v.h}|${v.han}|`).join('\n')+'\n\n## 逐章功能与原文\n';
for(const c of t.chapter_functions){report+='\n### 第'+c.unit+'章\n\n';for(const k of fields){const v=c[k];report+=`- ${k}：${v.text}。引文：“${v.evidence[0].quote}”\n`;}}
report+='\n## 结构比较、差异与不确定性\n';for(const c of t.comparison.similar_structures){report+='\n### '+c.units.join('／')+'\n\n'+c.judgment+'\n\n'+c.evidence.map(e=>'第'+e.unit+'章：“'+e.quote+'”').join('；')+'。\n\n差异：'+c.differences+'\n\n保留：'+c.preserve+'\n\noptional_style：'+c.optional_adjustments.join('；')+'\n\n不确定性：'+c.uncertainty+'\n';}
report+='\n## 不同收益与有效文风资产\n\n'+t.comparison.distinct_gains.map(v=>'- '+v).join('\n')+'\n\n'+t.comparison.preserve.map(v=>'- '+v).join('\n')+'\n\n## 三链首次、最近与本卷实际\n\n衣链首次25:243具体坐走用感/253洗后再看/267—271实际洗；最近30:242—250二洗干后再穿并夜回女，老师课中仅读旧纸，周三新反馈还没传老师。28二洗仍凉、30首次叙述周一干收柜，未改29补出一场。T_X_COAT_DAILY仍partial/due33，长期/再反馈保留。\n\n茶首次25:143—167约下个星期四14—16并实际记本；26改另一门至周六8:30、廖两椅洗壶，27互告；最近30:86对纱门客户真正说明明日不留铺等，但还未到廖家。T_X_TEA_AFTER_WORK pending/due32，不能拿周28步行或30花摊看盆当赴茶。\n\n书首次25:198—226约下下周日14/各问班/各选；最近实际27:38—48女12:30后准、与沈整休不同，前日告变；28裤照、29早回、30课后文字及青菜趣事是关系日常而非同行买书。T_X_BOOK_COMPANY pending/due35，店未来营业/实际选择及付款仍未知。至少茶书两条跨后卷，衣链也未强结。\n\nV11课堂新需求及排期选择：28裤里布新问题→30真课/自用裤修，29早班/送粉/父热早餐/15:30离店真兑现；30纱门13:30到场并22实收。原V11后卷私约不提前兑现，已发生小结不能反悔回未发生。\n\n## 连续性与硬问题\n\n本次未发现须直接修已登记旧稿的高置信硬问题；核查提示没有升级为确认错误。原1—28完整unit和正文/原观察三字段还须终检字节保护核验。28不重写，29起始两v2原字节保持。时间25周四/26周五/27周六/28周日/29周一/30周三，跳过周二；90分钟、伤脚未愈、净宽27/原凳90长44高、原80/35/81/84与新38鞋/22纱门互不冲抵。粉钱数字没露不造，单/收联/空袋归老板；新薄布赠予与借剪刀归还分别写实。\n\n整体风险：反复收碗收盒和解释限度仍有密度，30操作最多。上述差异有实际角色和后果，但知情模型可能为作者意图提供过多理解，不能断言陌生读者完全不疲劳。未见必须打断温和风格制造强冲突的依据。\n\n## 四语言测试\n\n当面说话：25“你补件衣服，我还得给你写一封信”、26“我没要把你一天换成半天”、27“空着正好轮到我”、28“你还没问，我先说了”、29“是你要早，我还想睡”、30“谁坐着替你看钟”各对具体对象说，保留轻微误解和笑。\n\n动宾拆分：核搭配和物件数量；29新段问时间主语、盒/碗及30同兜里外两处等在登记前另存纠正，不把旧片段句认当前。当前30窄袋比小屋、28脚不肯黑鞋是明确转喻，动作有落处，不因不似口语直接判错。\n\n具体落地：25掌纹搬粉、26明确改约/洗壶、27取扇收16与蛋口味、28实付38/真步行、29独守与父早餐/睡、30有限修门收22和实裤两处，支撑了主题；仍有可选说明句可压，不能用主题抽象替代动作。\n\n朗读改口：逐句模拟朗读，检查称谓、数字、物品和前后知情，未进行音频或真人实读。25“把笔合上”可按笔盖理解，个人更习惯盖好笔但未产生可靠歧义，不立硬错；27膝盖笑话/分蛋余韵仍可保留，不让单一偏好扣分。\n\n## 真人语言别扭句\n\n有没有哪句话意思能够看懂，却让你觉得别扭、像为了写得漂亮硬拼出来，或者不像一个人当面会这样说？\n\n### 真人语言硬问题\n\n没有\n\n### 风格偏好观察\n\noptional_style：30“没有因为自己听明白就先变成缝好的样子。”有解释感，但前有真正练结/实际未完的布，能看见所指，不满足两测试共同证实的硬问题门槛。本次仅登记I_X_BRC_CLASS_SUMMARY为suggestion，不称采纳或已修。29“给这道尚未见过的门留出回来的路”略设计，实际排期支撑，暂留。原I_X_AR_KNEE_JOKE/I_X_AR_EGG_ECHO仍未采纳。\n\n## 覆盖边界\n\n正式review只绑定本次完整读过的当前25—30六稿；窗口之后不改正文来迁就引用。引文字节核验仅用于发现抄引错误，不能替代原生全文、结构判断或文学验收。下个到期窗口尚未发生，不伪造提前覆盖。31未建纲未写，下一新线程须另获有限任务。\n';
put(t.report,report);put('.writer/brc-inputs/review-25-30-final-v1.json',t);put('审查/X-BRC当前25-30绑定清单-v1.json',{revision:132,report:t.report,report_sha256:sha(read(t.report)),input_sha256:sha(read('.writer/brc-inputs/review-25-30-final-v1.json')),units,chapter_functions:t.chapter_functions,comparison:t.comparison});
console.log(JSON.stringify({report:t.report,report_sha256:sha(read(t.report)),input:'.writer/brc-inputs/review-25-30-final-v1.json',functions:t.chapter_functions.length,comparisons:t.comparison.similar_structures.length,han:units.reduce((n,v)=>n+v.han,0)}));
