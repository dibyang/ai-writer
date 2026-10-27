import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const base=path.resolve('acceptance/20261026-long-flow-090-ae');
const dir=path.join(base,'scenario/东岸末班船-66章独立验证/分段/AE-0065');
const old=path.join(dir,'03-坐开的几分钟-v1.md');
const target=path.join(dir,'03-坐开的几分钟-v2.md');
const text=fs.readFileSync(old,'utf8');
const anchor='“总在动。”她说。';
const insertion=`店里的人送完垫子，又折回来，蹲到盆底边。他先抽出外头一块垫砖，伸手扶住盆，往墙边慢慢挪。盆底刮着砖面，一阵很低的沙声。

沈禾的笔停在纸上，跟着盆动了小半步。

“等——”她开了口，又止住。

那人抬头。“怎么？”

沈禾看看他已经搬过去的半边，声音低下来。“您还要挪？”

“挪里头点，刚才抬东西老碰。”他指指盆沿，“这片叶出去这么多，晚上人过还得绕。”

沈禾的手在板后收紧。她方才来回找，才找到那一小截，盆这一转，先前朝外的叶就对着店门了。她看见姑娘从凳上抬起脸，显然也听见了那一声等。

那人仍蹲着，一只手扶盆，问她：“你没画好？”

沈禾不知该点头还是摇头。她没画好，可要他等多久，她也说不上。让他把已经挪的转回去，等她画完再挪，听着更不像话。她看了一眼门内，第二趟还堆着货，便将板退到自己身前。

“没事，您挪吧。”

那人重新扶住盆，没再搬远，只转了个角度，让最外面的叶朝向檐下。他把抽出的砖垫回去，按着盆沿试稳，拍掉手上的土，进门了。

姑娘问：“是不是看不见刚才那片了？”

“看得见。尖到里头了。”

沈禾往旁边找了找，叶尖在玻璃门前，后面没有原来那条砖缝，深浅也变了。她将板抬起来，对着自己画的一半，想记住它方才的样子。可一边看眼前的，方才那个样子就一边散，连哪一头高也拿不准。

姑娘提着板，向她这边稍稍侧身。“要不等没货了，问他能不能再转一下？”

沈禾摇头。“算了。他就是要这么放。”

她说完，才发觉自己这回并不怕姑娘开口。那是问她愿不愿意去问，不是已经替她把盆转好。姑娘没有追着劝，将板又放回膝上。

沈禾站在新角度看了片刻，忽然把纸上刚添的细茎遮住，只露叶的那一点。原来的细茎与眼前位置不合，遮住倒容易看。她的左手不能一面挡纸一面稳托板，试了一下就松了，仍让那几笔露出来。

“这个不改了。”她说，“不然一直跟着追。”

姑娘以为她说整张，抬头看她的笔，沈禾却只在那小段细茎旁点了点。她没把它重画到新的方向，转去找叶面那块亮处。盆还在原地近旁，画里的这一点却已是她站到那边时的东西。

店门又开，带起近门的一片叶，沈禾等它晃完，向旁边退了半步。

`;
if(text.split(anchor).length!==2)throw new Error('anchor count');
const next=text.replace(anchor,insertion+anchor);
fs.writeFileSync(target,next,{flag:'wx'});
const sha=s=>crypto.createHash('sha256').update(s).digest('hex');
const audit={old,old_sha256:sha(text),target,new_sha256:sha(next),han:(next.match(/\p{Script=Han}/gu)||[]).length,reason:'补充店主因出货挪盆、沈不能要求复位及选择保留旧观察的实际动作后果；不改原分段。'};
fs.writeFileSync(path.join(base,'b-resume-65p3-change.json'),JSON.stringify(audit,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify(audit,null,2));
