import fs from 'node:fs';import path from 'node:path';
const b=path.resolve('acceptance/20261024-long-flow-090-ac'),p=JSON.parse(fs.readFileSync(path.join(b,'project.json'))).project;
const o=JSON.parse(fs.readFileSync(path.join(b,'a-inputs/plan-38.json')));
o.goal='承37周二夜到周三：姑娘把衣袋留家、下工先归取后赴第四课，周岸准备次日门活；本轮只前两自然分段，保留真实未完行动';
o.change='本轮分段只写到白日：姑娘早晨未携备课袋，母深衣出班仍未来；周准备次日工具并处理新抽屉迟回话。第四课/新条给师/实衣判断留完整38后半，不能登记为本轮事实';
o.beats=[
'第一自然分段，周三晨许家：按37已选路线，备课袋留干椅，原工装/护纸/旧练布/针盒不新改；女带饭袋小包上班，下工先回吃取衣，母今日穿另外深衣照常16—18:30。母女真吃早饭，各自一件事，沈可仅文字说明还没问班，不能当问成。衣不晨交第二次、不晨带出去，不写赴课。',
'第二自然分段，周三周铺：昨日新抽屉还在台，周承认37只量槽/未回话，现在真实来电把待做选择说清，不虚构昨日下午已完；可定一个在明日门后才做的取件时段/报价，实际发生才进入未来完整38登记。检查自用撬片/锤/垫材/工具包，是否购料按实写；另一家房门依37周四9—12，约定周三晚确认仍待晚间，不在中午先伪造。段尾停周白日备工处。',
'以下未写，供同ID续段：女下工先归家吃饭取备课袋，再真实到活动室，19点第四课；老师亲读周一条/见实衣、旧练布新六七针，再决定是否有限调整。衣未见前不套方案；不按上层纲强拆。',
'以下未写：按真实课堂进展到20:40收针，清点原纸/衣/针盒带离；必要返衣留39。周三晚房门确认若要写，须独立场景/实消息。不为补齐本轮目标提前写这些。'
];
o.recall_ids.push('T_AC_SHARED_MEAL','P_AC_DRAWER');
o.forbidden.push('37最终实际先回家取衣优先于原38初纲晨携出；当前正式细纲修正后才取context/template','本轮只写两自然分段；保存未完分段字节/hash，不assemble、不record，不改workflow或刚取写前来源');
fs.writeFileSync(path.join(b,'a-inputs/plan-38-after37.json'),JSON.stringify(o,null,2)+'\n',{flag:'wx'});
const report=`# AC-A 38写前近期细纲调整\n\n37已正式登记revision182后进行，只有尚未消费的38单元纲调整，不改37写前来源。37p6女亲说“我要先回一趟，再去”，故原38初纲晨携出不再采用。正式保存plan-38-after37.json，第一段衣袋留家；第二段周准备自用工具并接住新抽屉未回话，门的周三晚确认保留晚间。首停限前两段，约3000—5000汉字；后半真正19—20:40课堂仍未写。\n\n39初纲保持未写，待38完整成稿实读后再细化，不为首停改变workflow。上层40—48仍粗排。\n`;
fs.writeFileSync(path.join(p,'大纲/AC-A-38写前细化说明.md'),report,{flag:'wx'});
console.log({created:'plan-38-after37.json'});
