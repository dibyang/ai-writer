import fs from 'node:fs';
import crypto from 'node:crypto';
const P=new URL('./scenario/东岸末班船-再扩展验证/',import.meta.url);
const read=p=>fs.readFileSync(new URL(p,P),'utf8');
const put=(p,t)=>fs.writeFileSync(new URL(p,P),t,{flag:'wx'});
const add=(t,a,b)=>{if(!t.includes(a))throw Error('missing expansion anchor');return t.replace(a,b+a);};
let one=read('分段/0036/01-dr-v1.md');
one=add(one,'她还是想看那块旧练布。',`看久了，她想试试那朵红的究竟有几层瓣。桌边旧信封留着一张，反面干净，笔筒里有支红笔，是母亲圈日子用的，她取来，在信封上画个小小的圈。第二层画到一半，外头便鼓出一个尖，跟书上的圆瓣全不相像。她将书移远一点，不照着每一条边走，只想那一整片红，笔落下，反而成了一只扁扁的碗。

她自己看着笑。再画一朵，不先画最里面，先绕外头那一圈，绕过来又碰上，花中间没地方留。红笔是细的，要涂满便得来回走，画过几下，深浅一道道，倒像自己给花编了个篓。她停手，拿信封同书放到一起，纸上两朵没有一朵像，连哪边朝上也有点分不清。

门外有人经过，脚步在楼梯口停一阵，她听见钥匙碰门，低头又在第二朵底下添一根短茎，这回总算能看出头脚。叶子只两片，尖得像剪剩的纸，自己不想接着把它们涂满，笔盖扣上，红笔回到筒里。她把信封留在桌里侧，没有夹进花书，真花和自己那两团红都还看得见。

`);
put('分段/0036/01-dr-v2.md',one);
let four=read('分段/0036/04-dr-v1.md').replace('已经没有前一夜那种凉','已经没有周六夜里那种凉').replace('老何来时，手里没拿上回那只梨盒，只带自己的杯。','老何来时，手里带着自己的杯。');
four=add(four,'等家人的女人没待很久。',`孩子没有立刻坐住。他把拇指同食指捏在一起，留下一个小口，向老何举，说这个才有嘴。老何也比一下，手指粗，口留得大，自己一看先笑，说像鸭，不像杯上的。女人叫孩子别挡人家喝水，他往旁边挪两步，手却仍举着，转给母亲看，母亲伸手碰他那个尖，叫它低一点。

许蓉看见窗边有光，手影落到孩子衣服上，一张一合，真像有个什么在啄。他自己低头，嘴上还发一声短短的叫，又笑，手一松，影便散到衣褶里。老何说若是叶子，风一吹也这样动，孩子这回没反驳，换一只手，五指张开，摊得比自己的脸还大，问这样还像不像。

“这个像你的手。”母亲说。

孩子笑得弯一下腰，终于回到椅边坐好。许蓉将杯朝里移，自己刚才为了看，身子也跟着向窗偏，值班簿下角露出来。她把簿合平，窗外的光落到封面上，空着，没有谁的小嘴，她伸一根手指过去，影子在纸上走了一小步，自己先收回来，笑意还留在嘴边。

`);
put('分段/0036/04-dr-v2.md',four);
let five=read('分段/0036/05-dr-v1.md');
five=add(five,'门铃响，老板应一声，出去同人说话。',`椅后有一小扇高窗，风只进得来一点。她将脚从椅脚旁移开，膝头放平，书就不用两只手一直托。画上最小的那件下头还有一只盆，黑边同墙影叠在一起，自己起先看成门槛，这时才认出盆口是圆的。原来这一张不只晾衣，也有人才做完一盆事，衣挂起来，人已经走开。

她想起家中父亲在树底找那只鞋，自己也差不多，看见一件便总先给它找个用法。如今不急着讲给谁听，盆也能只留在墙下。她往后翻一张，画里换成很近的一截窗，纸边磨得比前头亮，自己以前一定也翻过，却记不住是不是停在这里。她将指头从画边撤开，让窗下浅浅那一块也露出来，坐着看，耳边还是店里的响声，眼睛倒已经离开柜前一会儿。

`);
put('分段/0036/05-dr-v2.md',five);
const rels=['01-dr-v2','02-dr-v1','03-dr-v1','04-dr-v2','05-dr-v2','06-dr-v1'].map(n=>'分段/0036/'+n+'.md');
const parts=rels.map(path=>({path,sha256:crypto.createHash('sha256').update(fs.readFileSync(new URL(path,P))).digest('hex')}));
put('.writer/drafts/dr-assemble36-v1.json',JSON.stringify({unit:36,expected_revision:158,draft:'正文/0036-灯下还有一页-dr-v1.md',parts,separator:'\n\n'},null,2)+'\n');
const counts=rels.map(path=>({path,han:(read(path).replace(/^#.*$/gm,'').match(/\p{Script=Han}/gu)||[]).length}));console.log(JSON.stringify({counts,total:counts.reduce((a,c)=>a+c.han,0)}));
