import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';
const V=path.resolve('acceptance/20261020-long-flow-090-v'),W=path.join(V,'scenario/东岸末班船-扩展验证'),read=p=>fs.readFileSync(p,'utf8'),sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const t=JSON.parse(read(path.join(W,'.writer/drafts/c3-review-template-7-12.json')));
const observed=(unit,text,quote)=>({status:'observed',text,evidence:[{unit,quote}]});
const data=[
[7,['做妥两包早取并争取半小时','两包以外还多两块。'],['临时并行劳动和布褶破边使备用量落空','原想多出的两块塌在边上'],['不缩小原份，守散热而让老板拿钱盒','你拿吧，我先把这个分开。'],['四块完整保住，老板接钱盒搬粉；顾客未到未付','两人将粉袋搬进来，没有叫她放下盘子。'],['老板开始真接手、沈禾直接讲自己的理发需求','下午也有。想剪个头发，总到门口又回家。']],
[8,['兑现本次两包交货与可用的半小时','能拿了？'],['余糕破边与新三包客/次日进货冲突','这锅要到六点左右。'],['不许诺次日再早到，按约离店自己理发','那就别先接早的。照平常的来，我一个人看不住里外。'],['实收8交两包，破边吃净/三包客走，15:30离并15:58剪完自付','她照镜旁标的价钱，用自己的手机付了款。'],['老板亲刷余笼，沈禾未又接回，合作有实际交班','她站了一下，没从他手里接回来。']],
[9,['为柜门配料排时，也让许蓉交班回家','他在下面写“后天下午”'],['新抽屉客和捎灯把顺路当无成本','到了拆一拆，顺手就好。'],['拒今晚抽屉/捎灯，约第四日人齐再摆','今晚不应了。'],['失去新抽屉客；26先垫、76待收、第四日16:30约成，何接窗','那我问问别人。一个抽屉，等这么多天。'],['父女能共同参与约价；何已能独立应答而许真正离开','老何已经从小窗探出头']],
[10,['把原35实际结清并回家吃饭','这儿给我落个名。'],['账目与未还椅仍需来人来物、自己算错灯泡数','自己把十二写成了十七'],['周亲来拿，许付款签收后让何接窗，家中让女儿炒刷','我得收啊。'],['35入周夹、两椅还；母女同做饭坐吃叠衣','月底现金已付，三十五元'],['母亲退让具体家务又仍帮助，女儿提出报班时间','我炒的我刷，粘着那块我知道在哪儿。']],
[11,['装门且让饭盒不必天天挪','等她把桌子移开一掌'],['松孔/木托、扣耳碰门与桌沿碍手共同限制','扣耳就轻轻碰了一下门内侧'],['父先问拿取方向、父女反复试，周等试妥才紧固','父亲看了一会儿，问她平常是从哪边抓。'],['旧样返/76实付/门装；留位和取小碟实际可用','从侧面的空隙伸手进去，将盒子完整取出来。'],['父亲坐着递件擦碗，父女仍就瓶子位置商量而非强和解','那边我够不着。']],
[12,['使入口补注在旅客脚下发生，照料能由何接手','这张没添入口。要走前头粮油店侧边。'],['旧图/阶口误读、货袋滑动、沟和坡仍费力','上头那包被面又向前松'],['旅客读图重绑亲推，何只陪东岸，许留窗后离岗','就是得再走到前头。'],['真到桥头上桥，何目见两灯杆而返，改母图/余一图且晚独关门','老何看他走过近处的第一根灯杆，第二根'],['从许亲自兜底转为何独接问船；沈正常休息，周缝自用包','他把窗台那张图拿给对方看，没有先向许蓉望。']]
];
const fields=['goal','obstacle','choice','consequence','relationship_change'];t.chapter_functions=data.map(([unit,...rows])=>({unit,...Object.fromEntries(rows.map((x,i)=>[fields[i],observed(unit,...x)]))}));
t.operation_id='v-c3-current-7-12-complete-read';t.report='审查/V-C3-当前0007-0012完整连读.md';
t.comparison={similar_structures:[{units:[7,8,12],judgment:'店中需求与限量/时间协商复现，8/12都出现三包，存在可辨同形；不凭共词判重复。',differences:'7承担误铺笼布/损耗和老板接手的实际准备；8是已有承诺的现金交货及第一次拿到理发时间；12是后来新客未达成约、旧牌收起和正常工时巩固，非再卖一次。',preserve:'保留7破边、8亲收与理发、12回家把盒放入新柜位；这些是不同资源/使用后果。',optional_adjustments:['若作者以后压缩节奏，可简化12新客三包场面；本轮非必改。'],uncertainty:'知情自检不能预测读者对两次三包场面重复感的容忍度。',evidence:[{unit:7,quote:'我没铺开。'},{unit:8,quote:'她照镜旁标的价钱，用自己的手机付了款。'},{unit:12,quote:'明早没定做小笼。'}]},{units:[9,10,12],judgment:'交班与回家吃饭/周坐面摊多次出现，是主题复现且有拖慢风险。',differences:'9重在拒新差事丢客户并建立约；10首次实结原35和母女共同炒刷；12首次具体旅客上坡、何独关门及周修自用包。',preserve:'保留9真正放手、10我得收啊与女儿刷锅、12让他人继续走与自己的包得到修补。',optional_adjustments:[],uncertainty:'未做真人盲读；是否压缩需作者选择，现有重复未替代主事件。',evidence:[{unit:9,quote:'手从门把上放开，走下台阶。'},{unit:10,quote:'我炒的我刷，粘着那块我知道在哪儿。'},{unit:12,quote:'线口没有再张开。'}]}],distinct_gains:['7：准备成本/损耗与老板接手。','8：真现金交货、离店理发。','9：新活流失/真实排工与责任交接。','10：原35现金结算、母女共同做饭。','11：原门实装/76实付/饭盒位可用，父女分工。','12：新旅客实走至桥头/何接手独关门，柜位日常使用。'],preserve:['克制现实声音、父女仍有小摩擦','旧箱/80与原三章有限闭合不重开','柜位和路线分别通过不同劳动回收，未把电话承诺算执行'],optional_adjustments:[],limits:'本次在12登记后完整顺读当前7→8→9→10→11→12全部正文，再回查4早取、5试摆、6补图原文；版本见六章source_hashes。1—3本轮未全文复核，4—6不凭本报告新增完整范围覆盖；F当前1—12比较仍独立待做。知情自检非真人或产品验收。'};
delete t._instructions;
const body=read(path.join(V,'c3-report-main.md'));
const versions=Object.entries(t.source_hashes).map(([p,h])=>`- ${p}：${h}`).join('\n');
fs.writeFileSync(path.join(W,t.report),'# 当前7—12完整连读与跨卷报告\n\n知情模型自检，实际顺读范围7→12，非拼接短评。\n\n'+versions+'\n\n'+body,{flag:'wx'});
fs.writeFileSync(path.join(V,'inputs/c3-review-7-12.json'),JSON.stringify(t,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({report:t.report,sha256:sha(path.join(W,t.report)),units:t.chapter_functions.map(x=>x.unit),count:Object.keys(t.source_hashes).length}));
