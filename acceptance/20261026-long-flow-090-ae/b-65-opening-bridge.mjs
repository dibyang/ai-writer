import fs from'node:fs';import path from'node:path';import crypto from'node:crypto';import assert from'node:assert/strict';import{fileURLToPath}from'node:url';
const A=path.dirname(fileURLToPath(import.meta.url)),P=JSON.parse(fs.readFileSync(path.join(A,'project.json'))).project,from='分段/AE-0065/01-把这一小时问清楚-v2.md',to='分段/AE-0065/01-把这一小时问清楚-v3.md',sha=b=>crypto.createHash('sha256').update(b).digest('hex'),old=fs.readFileSync(path.join(P,from));let body=old.toString('utf8');
const anchor='到了旧街，四点四十五还差几分钟。';assert.equal(body.split(anchor).length,2);
const addition=`***

姑娘下工回家时，桌上那两张新纸还在早晨留的干处。

她把平日的包放下，先揉一下右手食指。白日在桌前拿笔，才知道昨夜捏布的酸没有全退，写急了，指头会自己往里扣。如今铅笔就在小纸盒边，自己说想画，真要再捏一阵，手未必听早晨那句只带两只眼睛的玩笑。

她取手机，原想说今天算了，字打到一半，看见昨夜自己先发的旧街长凳，又把那两个字删掉。她并非不能过去，也仍想看盆，只是想着朋友买了新笔，自己若到了便说不想画，好像先将别人的那点兴致换成自己坐着歇。

姑娘最后发：手指还酸，今天想少画点，若拿不住，我就先看。

字发出，她把手机留在桌面，去洗手，没等沈禾先答能不能。水过指腹，她将腕放松，慢慢把手擦干。旧两张杯画从硬纸边露一角，纸背的周日仍在；她看了一眼，没有拿它们来替今日不多画作一个现成的成绩。

两张新的连盒片取起，上头那张边角压得很平。姑娘原想将它们塞到平日包后，试过，盒片太宽，侧边向里折，白纸也要跟着弯。她将它们拿出，找一只原有的干净空袋，纸板平送进去，才知道早晨只想纸够白，连出门怎么提都还没试。

铅笔、橡皮和刨笔刀另留小格，水杯拧好，放包的另一头。她拎起包，肩上熟悉的分量并不重，手里这片平的却得照看，进门的钥匙若先塞到底，到时回来怕又得一路换手找。姑娘把钥匙移到外格，袋提到左手，让刚才酸的右手先空着。

手机亮，沈禾回，先来，自己也不知道能画多久；买的这些以后还能用，别先替自己把五块钱画回来。姑娘看着笑，回那自己出来了，四点四十五仍到。她没有答应手会在走到街口以前变好，拿包的这一回，指头也没有再捏紧。

门关上，屋里纸盒外的碎片早晨已收，母亲还没回，窗边衣在风里轻轻动。姑娘走下楼，将画纸的袋从扶手旁让开一点，没让纸板硬角一路擦过去。下到平地，她先想找一段阴处走，绕过一家店门外晾着的东西，比平日多走几步，袋里的白纸仍平着。

到了能看见旧街那排高叶的地方，她停一停，换手摸手机，确认没有迟到的新字。自己的手还酸，眼前却真有一段能坐下的时间，她把袋提好，继续往长凳那头去。

***

`;
body=body.replace(anchor,addition+anchor);fs.writeFileSync(path.join(P,to),body,{flag:'wx'});
const result={at:new Date().toISOString(),from:{path:from,sha256:sha(old)},selected:{path:to,sha256:sha(Buffer.from(body)),han:[...body.replace(/^#.*\r?\n/,'').matchAll(/\p{Script=Han}/gu)].length,chars:body.length},reason:'补出原稿略过的女下工回家取物/指酸改变本次期望/真实消息确认/实际提纸出门；仍为分段1内普通行动，不新增分段、不预写17:12之后。',source_or_workflow_changed:false};fs.writeFileSync(path.join(A,'b-65-opening-bridge.json'),JSON.stringify(result,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify(result));
