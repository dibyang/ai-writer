import fs from 'node:fs';import crypto from 'node:crypto';
const v='D:/work/other/ai-writer/acceptance/20261020-long-flow-090-v',session=JSON.parse(fs.readFileSync(v+'/cli-logs/am13-begin/stdout.raw.txt','utf8')),p=session.workspace;
const read=f=>JSON.parse(fs.readFileSync(p+'/'+f,'utf8')),sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const t=read('.writer/drafts/v-am-review-4-6-before.json'),s=read('.writer/state.json');
if(t.expected_revision!==30||s.revision!==30)throw Error('Review revision drift');
const bodies={};for(const u of s.units.filter(u=>u.unit>=4)){const b=fs.readFileSync(p+'/'+u.draft);if(sha(b)!==t.source_hashes[u.draft])throw Error('Body drift');bodies[u.unit]=b.toString('utf8');}
const ev=(unit,quote)=>{if(!bodies[unit].includes(quote))throw Error('Quote missing '+unit);return {unit,quote};};
const ob=(unit,text,quote)=>({status:'observed',text,evidence:[ev(unit,quote)]});
t.chapter_functions=[
 {unit:4,goal:ob(4,'让赶桥上工的人能在有限时段买早饭，并承担停航减量劳动。','五点。比平时早半个钟头。'),obstacle:ob(4,'减笼仍需洗刷，提前开锅也须有人接下午收尾。','不能因为早上两包，晚上就少弄一堆。'),choice:ob(4,'约先试两包，沈禾早到换老板接热笼。','下午那半个钟头你先走，热笼子我收。'),consequence:ob(4,'许蓉实买和带糕已有反馈，陈秀确认的是次晨订单，未交付。','您也别先给钱，拿到再付。'),relationship_change:ob(4,'沈禾与老板对换具体工时，保留试一次的边界。','可不是天天都这么定')},
 {unit:5,goal:ob(5,'量柜并为女儿常用饭盒留顺手位置。','我就是想有一处不用天天拿开。'),obstacle:ob(5,'旧孔松且原摆法会挡碗和门，不能直接装回。','原孔松了。光换个合页，拧回去还得晃。'),choice:ob(5,'先量和带旧样，父亲同意按女儿盒子留位。','先记着，照她这个盒子留。'),consequence:ob(5,'只记短痕与便笺，门板和层板仍未装；饭盒装菜入冰箱。','他没有锯板，也没卸下原层板'),relationship_change:ob(5,'父亲开始承担先盛女儿饭盒及为她让路的具体家务。','父亲用干净勺子先给饭盒装一份')},
 {unit:6,goal:ob(6,'实际走东岸入口，使补注与路况对应。','从他们平常指给人的起点走'),obstacle:ob(6,'石阶与沟边有身体成本，同事接孩子限制离岗时长。','最迟五点。我得去接孩子'),choice:ob(6,'走到桥头即返并拒绝绕取包裹，补有限图。','今天不绕那边了。'),consequence:ob(6,'一张补图交出两张留盒，妇人走完路线仍未知。','窗台盒里还剩两张补过的图。'),relationship_change:ob(6,'公共帮助者也接受女儿照料，并守住同事换回时限。','她将洗碗的事留在那里')}
];
t.report='审查/V-A-追踪修正-0004-0006-完整尾段连读.md';t.operation_id='v-am-tail-review-r30';t.issues=[];
t.comparison={similar_structures:[{units:[4,5,6],judgment:'三章都以具体手上劳动和日常照料承接互助，有表面相似。',differences:'4通过早到与接收尾分配工时，5承认女儿柜内使用需要，6以实际步行和按时换回同事承担公共照料；本次只修日序追踪，不改这些不同功能。',preserve:'保留真实代价、小收益与尚未发生的约定。',optional_adjustments:['后续转向实际交付、排工和安装使用的后果，图纸压缩仍是可选建议。'],uncertainty:'只有知情模型实读，不能预测真人追读或长期重复感。',evidence:[ev(4,'下午那半个钟头你先走，热笼子我收。'),ev(5,'先记着，照她这个盒子留。'),ev(6,'今天不绕那边了。')]}],distinct_gains:['4有限早餐试行与工时交换，5父女共同使用位，6出行补注与代班边界。','四处summary/timeline时间措辞澄清，六章正文同字节，人物和账本无语义变化。'],preserve:['原1—3有限归还与所有原观察三项；35未付、80已退、柜未装。','6同日下午并行及亲走/口述/未见结果的知情边界。'],optional_adjustments:['图纸说明可在未来获得相应授权时评估，当前不改正文。'],limits:'重登至候选revision30后完整按序实读4—6，并完整读修后summary/timeline/characters/ledger/evidence及下游边界；候选语义已修正，正式提交及意见apply/verify尚未执行，不冒称闭环。历史P_ORDER引句用途另报根，不扩本轮修订。'};
fs.writeFileSync(p+'/.writer/drafts/v-am-review-4-6-filled.json',JSON.stringify(t,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({revision:s.revision,report:t.report,report_sha256:sha(fs.readFileSync(p+'/'+t.report)),input_sha256:sha(fs.readFileSync(p+'/.writer/drafts/v-am-review-4-6-filled.json'))}));
