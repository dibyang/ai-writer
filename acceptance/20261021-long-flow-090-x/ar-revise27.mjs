import {put,read,sha,state} from './a-prepare.mjs';
let p2=read('分段/0027-A/02-十二点半以后-v1.md');
if(!p2.includes('告诉她自己午前下班，吃过饭过去。'))throw Error('p2 anchor');
p2=p2.replace('告诉她自己午前下班，吃过饭过去。','告诉她自己十二点半交完走，吃过饭过去。');
put('分段/0027-A/02-十二点半以后-v2.md',p2);
let p6=read('分段/0027-A/06-自己的那一页-v1.md');
const anchor='“我没嫌今天这段。”女儿道。';
const more=`母亲说这段自己听过几种，有的锣敲得急，人还没走到台边，心先叫它催过去；今天这一回慢些，她听着便想把饭后的那阵也留慢一点。女儿问是不是同一班人，许蓉说不是，自己也认不全，看见名字记得两个，换一套脸和衣服又得认。

女儿站到外头，朝母亲的屏幕看。台上那人衣袖很长，走一步，袖子还慢半步才落下来。她先前隔着门只听见唱，原来唱的时候手也在走。母亲将声音小一点，问她要不要从头看，女儿说不用，就这一阵。两个人站坐着看完一个转身，母亲指方才拖长的那个字，说自己喜欢这一回收得轻，别一到尾音就全喊出去。

姑娘听不出几种的分别，却听出收轻的那一下，跟她从前以为唱戏总得大声不同。她问母亲怎么不早说，许蓉笑，说早说她也只催自己小声些，手指按到音量上，今日还想不想催。女儿摇头，说自己回去画一会儿，门不关紧，能听见就行。母亲将画面转正，音量留在两人刚才一起听的地方，没再往上添。

`;
if(!p6.includes(anchor))throw Error('p6 anchor');
put('分段/0027-A/06-自己的那一页-v2.md',p6.replace(anchor,more+anchor));
const files=['01-来取风扇的人-v1.md','02-十二点半以后-v2.md','03-等接人的一阵-v1.md','04-两碟番茄-v1.md','05-汤另盛一盒-v1.md','06-自己的那一页-v2.md'];
put('.writer/ar-inputs/assemble-27-v1.json',{unit:27,expected_revision:state().revision,draft:'正文/0027-先把这一天过完-v1.md',parts:files.map(f=>({path:'分段/0027-A/'+f,sha256:sha(read('分段/0027-A/'+f))})),separator:'\n\n'});
const counts=files.map(f=>({file:f,han:(read('分段/0027-A/'+f).replace(/^#.*$/gm,'').match(/\p{Script=Han}/gu)||[]).length}));
put('研究/X-AR-27合章前调整.json',{changes:[{file:'02-v2',reason:'十二点半为午后，原午前下班用语不准；另存v2改为实际批准时点。原v1保留。'},{file:'06-v2',reason:'初写六段10186汉字，扩展母女实际共听戏的一阵，让母亲自己的兴趣有行动/对话与两人关系变化；未改已登记稿或用复述边界补字。'}],counts,total:counts.reduce((n,x)=>n+x.han,0)});
console.log(JSON.stringify({counts,total:counts.reduce((n,x)=>n+x.han,0)},null,2));
