import fs from'node:fs';import path from'node:path';import assert from'node:assert/strict';import{fileURLToPath}from'node:url';
const W=path.dirname(fileURLToPath(import.meta.url)),P=path.join(W,'scenario/东岸末班船-规模验证'),t=JSON.parse(fs.readFileSync(path.join(P,'.writer/drafts/w-ar-review-template-10-15.json'),'utf8'));
const evidence=(unit,quote)=>({unit,quote});const obs=(unit,text,...quotes)=>({status:'observed',text,evidence:quotes.map(q=>evidence(unit,q))});
t.operation_id='w-a-network-recovery-review-10-15-r63';t.report='审查/W-A-10-15完整连读-恢复补核.md';delete t._instructions;delete t.output;
t.chapter_functions=[
 {unit:10,
 goal:obs(10,'把停航前西门35元真正结清，完成月底值班收尾后回家。','问他傍晚能否到码头结西门的钱'),
 obstacle:obs(10,'椅子归还、票据与零支误算占时间；许习惯接管家里细活。','自己把十二写成了十七。'),
 choice:obs(10,'备用零钱现金亲交、周签收，留痕改错、交何钥匙；回家让女儿自己炒刷。','一张二十、一张十元、一张五元','我炒的我刷，粘着那块我知道在哪儿。'),
 consequence:obs(10,'35实收实付并合账，何接独立应答，许回家完成一顿双方分担的饭，窗扣仅开缝未修。','月底现金已付，三十五元','把已经抬起的手放下来'),
 relationship_change:obs(10,'母女分工由催问时刻转为发班表与各做自己一段，改变是小步的。','真有事晚了也给个字','我炒的我刷，粘着那块我知道在哪儿。')},
 {unit:11,
 goal:obs(11,'装妥柜门且让沈禾饭盒能顺手取放。','里面的木托要卸，别将灰落进去。'),
 obstacle:obs(11,'盒扣耳碰门，桌沿碰腕，酱油瓶原位占盒位且灶下父够不到。','腕子又碰桌沿','那边我够不着。'),
 choice:obs(11,'按父女实际取放方向留左侧四指空隙/桌距，酱油改父可及托盘，按原价付81。','这儿不要塞碟子。','一共八十一。没添。'),
 consequence:obs(11,'柜门收紧可用，当晚能单手取碟盛余菜，付费结清，窗帘仍只是另约。','单手便能拿到，另一只手还端着盆。'),
 relationship_change:obs(11,'父承认坐着转身够不到，仍参与擦碗而非由女儿包办；双方调整共同空间。','你把这两只端进去。我这儿转身够不着。')},
 {unit:12,
 goal:obs(12,'让补图在一次真实推车出行中有用，并使工作接手能支持许离岗。','这张没添入口。要走前头粮油店侧边。'),
 obstacle:obs(12,'原空背图引向石阶，货松、篦子高边和坡面细砂造成阻碍。','前轮碰到篦子的高边','上头那包被面又向前松。'),
 choice:obs(12,'何陪东岸但让旅客自己停稳重绑慢推，只添通用停稳句，不泛化绑绳；沈拒新三包早取。','先放平。','绑绳的事没加成给所有人的规矩。'),
 consequence:obs(12,'旅客到桥头并上桥近两灯杆，何返告、更新母图和余1；许18:30离岗。未见对岸。','终于走到桥头。','过了前两根灯杆才回。'),
 relationship_change:obs(12,'何作为独立接班者直接答问，许离开而不再次替他证明；女儿只听许转述。','他把窗台那张图拿给对方看，没有先向许蓉望。')},
 {unit:13,
 goal:obs(13,'女儿自己报修衣课并取得固定练习桌面，母女真实试用。','妈，那个桌子能分我一点吗？'),
 obstacle:obs(13,'母惯于代办、桌杂物与电线、闪灯和初针抽脱阻碍她自己学习。','后头的电线却绷住了。','一拉便全抽出来。'),
 choice:obs(13,'女儿自己问报，许只收自己的物件留仍要穿的工装；拔闪灯借床灯，在小布试针。','我自己能去。我还有两句要问，问完再报。'),
 consequence:obs(13,'报名本人消息/口述到家，桌可坐且重试针不散；工装留女儿拟下周带课，尚未补衣或去首课。','针脚在布上歪着，终于没散。','这件先留给我。下周带去，回来还给你。'),
 relationship_change:obs(13,'许忍住代穿针，让女儿重试；愿将自己仍想穿的衣留作真实练习对象。','许蓉把摊开的手合到膝上。')},
 {unit:14,
 goal:obs(14,'按先报钱约定完成锅活，和面摊主商定窄凳真正解决的需求。','十八，工钱二十，一起三十八。装好试过，能用再给。'),
 obstacle:obs(14,'机主考虑新锅，修理需配样/等待；摊主担心收摊通道且老人需靠背。','先问放在那里，收摊时锅盆怎么进出。'),
 choice:obs(14,'方同意总38后试本人日常米量；周吃面后收回好办，只定旧板若可用工60/先看料并保留靠背椅。','就照三十八，先修这只。','若旧板能用，一张坐两个人的窄凳，手工六十。'),
 consequence:obs(14,'试饭后锅款38实收，还碗吃面，和廖存电话约后日2点先看料；未制作/付凳钱。','周岸看清收到的数，点头说收到了','后天下午两点？'),
 relationship_change:obs(14,'由熟人食客转有条件劳务双方，廖能改周的空间预设并承诺变动时联系。','有事我就说一声，别让你锁了门白跑。')},
 {unit:15,
 goal:obs(15,'歇班共同做完一部分窗帘，又留出沈禾自己的外出时间。','下午想去旧书店走走。'),
 obstacle:obs(15,'湿布沉、薄处起毛、绳位和时间有限，父脚伤且女儿想趁手全做。','湿布沿手臂向袖口跑'.replace('湿布','灰水'),'布浸透后沉得多'),
 choice:obs(15,'只洗一幅留另一幅，沈真去书店买读画册；父坐着卸钩折衣，自选旧布轻物袋、眼累歇手。','今天不拆。','手机付过八块'),
 consequence:obs(15,'帘洗挂回；沈夜里仍读画册，袋身成/一带成另一带未缝、均未固定洗晾，更未出门。','两条带只合好一条，另一条压着还没缝','把画册翻到夹纸的那页。'),
 relationship_change:obs(15,'父接下坐着能做的部分并让女儿自己去看书，袋用途由他提出持有，女儿未承包所有后续。','父亲抬抬还有半杯的杯子，叫她先去看她的书。','父亲说这就先留自己这里，明天坐着慢慢做。')}
];
t.comparison={similar_structures:[
 {units:[10,13,15],judgment:'饭桌/家务里纠正、想接手又停住；10和15均有盐少回锅，确实有局部同形。',differences:'10结账离岗后实践分工；13女儿自选晚课并试桌/借工装；15已独立外出读书且父自选袋用途。不同后果已实际发生。',preserve:'保留会出错可自行改的小能力、母亲收手和父坐着参与；不能把全章不同结果一并删去。',optional_adjustments:['可压缩15忘盐回锅及部分没有句，减轻10同类动作的回声。'],uncertainty:'知情模型可能替慢段补意义，未有陌生读者节奏反馈。',evidence:[evidence(10,'用热水化开，倒回锅中又翻两下。'),evidence(13,'许蓉把摊开的手合到膝上。'),evidence(15,'添一点盐水，翻过再装出来。')]},
 {units:[11,14],judgment:'实际试使用方式后才让钱落地，均有操作与小额劳务。',differences:'11是柜位已施工完成/付81；14锅活38完成后窄凳才成立为条件委托，留靠背椅且未看料。',preserve:'使用者判断自己的拿法/米量，配角对生活有要求。',optional_adjustments:['后卷避免再加同样的检验轮次，转入窄凳的实际制作和营业使用。'],uncertainty:'两项工种不同不自动保证阅读体验不同；当前动作密度仍有可压缩处。',evidence:[evidence(11,'再看你怎么拿。'),evidence(14,'试的就是你平日这点饭。')]},
 {units:[12,14],judgment:'帮助别人时先收回包办惯性，再按对方实际需要行动。',differences:'12旅客自己重绑推坡到桥头，行动当章兑现；14廖提出过道和靠背需要，劳务仅约先看料。',preserve:'何独立接班、旅客自己推车与廖保留靠背椅均保留。',optional_adjustments:[],uncertainty:'14到未来21是否有真实使用回收尚未发生，不以计划承诺为证。',evidence:[evidence(12,'没有一直替他推'),evidence(14,'将刚要出口的“好办”咽回去')]}
],distinct_gains:['10原35实付且能离岗回家分工。','11柜门/饭盒动线从试用到当晚使用。','12补图在一次推车东岸行程中生效，何独立接班。','13女儿自己问报、练习桌面试用和未补工装暂留。','14锅活真实收38，面摊60条件劳务和先看料成立。','15真正去旧书店读自己画册，洗挂一帘、父持半袋。'],preserve:['保留有限视点、伤脚未好、旧物不如新、不同人的时间与预算。','晚课13/13、窄凳14/14、旧布袋15/15；未来用途不算事实。','35/81/原80与旧箱收束、旅客只到所见桥段不逆改。'],optional_adjustments:['15洗帘/缝袋的容器和手部动作密度可压缩；本次保留为可选，不称已修。'],limits:'同一W-A原生模型已在r63完整读当前10→15六章1195行；本次核原日志15次FastCtx实读全部行文本同当前SHA，再完整读报告补网络恢复边界。不是新鲜盲读，不证明市场/真人/正式产品验收；不覆盖未来16或新字节。'};
t.issues=[];
const s=JSON.parse(fs.readFileSync(path.join(P,'.writer/state.json'),'utf8'));assert.equal(s.revision,t.expected_revision);
for(const c of t.chapter_functions)for(const name of['goal','obstacle','choice','consequence','relationship_change'])for(const e of c[name].evidence){const u=s.units.find(u=>u.unit===e.unit);assert.ok(fs.readFileSync(path.join(P,u.draft),'utf8').includes(e.quote),'Missing actual quote '+e.unit+': '+e.quote);}
for(const c of t.comparison.similar_structures)for(const e of c.evidence){const u=s.units.find(u=>u.unit===e.unit);assert.ok(fs.readFileSync(path.join(P,u.draft),'utf8').includes(e.quote),'Missing comparison quote '+e.unit);}
fs.writeFileSync(path.join(W,'inputs/an-review-10-15-v2.json'),JSON.stringify(t,null,2)+'\n',{flag:'wx'});console.log('Prepared actual model functions/comparison; all quotes matched current drafts; no state or hash edits.');
