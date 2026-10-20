import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const v='D:/work/other/ai-writer/acceptance/20261020-long-flow-090-v';
const w=path.join(v,'scenario','东岸末班船-扩展验证');
const sha=x=>crypto.createHash('sha256').update(x).digest('hex');
const template=JSON.parse(fs.readFileSync(path.join(w,'.writer/drafts/v-ac-review-4-6-before.json'),'utf8'));
const state=JSON.parse(fs.readFileSync(path.join(w,'.writer/state.json'),'utf8'));
if(state.revision!==31||template.expected_revision!==31)throw Error('Expected actual revision31');
for(const [file,hash] of Object.entries(template.source_hashes))if(sha(fs.readFileSync(path.join(w,file)))!==hash)throw Error('Body drift '+file);
const observed=(unit,text,quote)=>({status:'observed',text,evidence:[{unit,quote}]});
const f=(unit,items)=>Object.fromEntries([['unit',unit],...Object.entries(items).map(([key,[text,quote]])=>[key,observed(unit,text,quote)])]);
const input={...template,operation_id:'v-ac-review-tracking-time-4-6',report:'审查/V-A-工具升级后-0004-0006-追踪意见复核.md',chapter_functions:[
 f(4,{
 goal:['沈禾为改走桥的顾客尝试次晨更早取糕，并使自己提早到店有可承担的工时安排。','五点。比平时早半个钟头。'],
 obstacle:['客人六点须走，现做糕赶不上；提早上工不能只让下午收洗留空。','那我赶不上。今早得走桥，六点就得从这儿过去。以前上船前买，正好。'],
 choice:['沈禾提出早来换下午早走，老板实际承担热笼收洗，双方只试一天。','下午那半个钟头你先走，热笼子我收。'],
 consequence:['陈秀下午确认两包早取、拿到再付，尚未取货付款。','您也别先给钱，拿到再付。'],
 relationship_change:['沈禾与老板把原来的额外劳动转成具体分担，不承诺无限接受早单。','先两包。早的是一个灶，挪不开两个。']
 }),
 f(5,{
 goal:['量柜口并找到沈禾日常取饭盒不用反复搬碗的位置。','我就是想有一处不用天天拿开。'],
 obstacle:['旧孔松且旧摆法使饭盒受阻，换合页不能直接解决。','原孔松了。光换个合页，拧回去还得晃。'],
 choice:['先量和试摆，父亲同意按女儿饭盒留位置，未贸然安装。','先记着，照她这个盒子留。'],
 consequence:['周岸获准带合页样，材料价格与回装未定；饭盒装菜入冰箱，预留位仍空。','周岸将合页和便笺分开裹好，搁进包的侧袋。'],
 relationship_change:['父亲从让饭盒放桌上到同意留使用位，并主动在饭前给女儿盛菜。','父亲用干净勺子先给饭盒装一份，再夹自己的。']
 }),
 f(6,{
 goal:['辨明图上省略的入口难处，使推车问路者能够按实际入口选择。','一个推车的。走到跟前又回来了，问有没有不用抬的路。'],
 obstacle:['台阶上方有折路，缓坡较远且沟边颠车，代班同事还要接孩子。','最迟五点。我得去接孩子，学校那边不让一直等在门口。'],
 choice:['只实走东岸两口到桥头并按时回室，不绕取女儿包裹，不猜对岸信息。','今天不绕那边了。'],
 consequence:['补3张图，1张已交妇人、2张留盒，母图夹簿，旧图封存而未全收回。','窗台盒里还剩两张补过的图。'],
 relationship_change:['许蓉接受女儿自己取包裹和次晨洗盒的安排，减少替人包办。','她将洗碗的事留在那里，低头继续吃，没去猜女儿究竟会不会比自己起得早。']
 })
],comparison:{
 similar_structures:[{units:[4,5,6],judgment:'三章都有日常劳作、现场协商和有限承诺，需比较后果而非按共用饭盒或拿放动作判重复。',differences:'4是售卖时间与工时分担；5是家庭空间使用权；6是公共指路的实走范围与代班边界。',preserve:'保留老板承担热笼、父亲准留饭盒位、许蓉拒绕取件三个不同选择的代价。',optional_adjustments:[],uncertainty:'仅为当前三章完整实读后的知情模型判断，未来8/11/12兑现尚未发生，也无外部读者反馈。',evidence:[{unit:4,quote:'下午那半个钟头你先走，热笼子我收。'},{unit:5,quote:'先记着，照她这个盒子留。'},{unit:6,quote:'今天不绕那边了。'}]}],
 distinct_gains:['第4章使早取试行有明确数量、价格、窗口和劳动承担，未冒称成交。','第5章用实际试摆改变父女对柜内位置的看法，柜门仍未装。','第6章实走东岸两入口、修补并交出一张图，同时承担拒绕和归还代班时间的后果。'],
 preserve:['保持首日清晨、首日晚、同日下午并行的明确相对日期。','保留有边界知情、原箱钱据有限闭环和三条跨卷线索未兑现部分。','保留原语言与六章正文；可选图纸压缩不转为本轮必改。'],optional_adjustments:[],limits:'在revision31完整实读当前4—6正文及当前summary/timeline，人物状态与相关账本逐项核查；1—3本轮仅核哈希及根评估，不声称新做六章全文连读。报告为知情模型自审，尚待根独立核验，不是作者定稿、真人盲读或市场验证。'},issues:[]};
for(const c of input.chapter_functions)for(const value of Object.values(c))if(value?.evidence)for(const e of value.evidence){const u=state.units.find(x=>x.unit===e.unit);if(!fs.readFileSync(path.join(w,u.draft),'utf8').includes(e.quote))throw Error('Quote not current '+e.unit+' '+e.quote);}
for(const c of input.comparison.similar_structures)for(const e of c.evidence){const u=state.units.find(x=>x.unit===e.unit);if(!fs.readFileSync(path.join(w,u.draft),'utf8').includes(e.quote))throw Error('Comparison quote not current');}
fs.writeFileSync(path.join(v,'ac-review-4-6.json'),JSON.stringify(input,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({expected_revision:31,input:'ac-review-4-6.json',report:input.report,report_sha256:sha(fs.readFileSync(path.join(w,input.report))),body_quotes_checked:true}));
