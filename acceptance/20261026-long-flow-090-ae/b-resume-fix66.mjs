import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import assert from 'node:assert/strict';
const a=path.resolve('acceptance/20261026-long-flow-090-ae'),p=path.join(a,'scenario/东岸末班船-66章独立验证'),from='正文/0066-照约把书带回来-ae-b-v1.md',to='正文/0066-照约把书带回来-ae-b-v2.md',sha=b=>crypto.createHash('sha256').update(b).digest('hex');
let s=fs.readFileSync(path.join(p,from),'utf8');const edits=[];function rep(before,after,reason){assert.equal(s.split(before).length,2,before);s=s.replace(before,after);edits.push({before,after,reason});}
rep('纸上是自己画的几道彩线，折过好多回。','纸外露着几道彩线，折过好多回。','沈只能见线不能隔空确认谁画。');
rep('同事将自己的杯底朝上晃一下，说带一杯水，坐着喝就成。她也笑，手伸过去接住要倒的半杯水，提醒杯子还没空。','同事将自己的杯子晃一下，说带一杯水，坐着喝就成。她也笑，伸手扶住倾斜的杯身，提醒杯子还没空。','原杯底朝上及接住半杯水不合物理，改扶杯。');
rep('沈禾的书今晚就回来。','借给沈禾的书今晚就回来。','明确14原所有人不是沈。');
rep('沈禾说下午店里有客人想留糕，','沈禾说今天店里有客人想留糕，','该客写在上午。');
rep('先没有像前天那样找一块能同看的地方。','先没有像周二那样找一块能同看的地方。','周五的前天是周三，两女当日未现场同看；63是周二。');
rep('“你前天也说过白角。”','“这个角，我买回来就这样。”','去掉无据相对日期与对话追认，以女已知购入旧角说。');
rep('同刚才在长凳旁帮人站起来时提两下不同。','同昨日在长凳旁替沈禾临时提那几下不同。','长凳帮袋在65周四，不是66刚才，未扶人站起。');
rep('她只好先将挂面放回柜上，把包立住，再取袋。','她只好先把包立住，将水杯扶正，再取袋。','挂面已被老板放柜，无凭空再次在女手。');
rep('沈禾接过纸包。姑娘把空袋撑开，将四块五用手机付过，','沈禾接过纸包。姑娘将包底靠在自己身前，左手还握着书袋提手，右手终于空出。她拿手机时碰到钥匙，先把钥匙拨回衣袋，没同手机一齐抽出来。柜前那人退开，她才站近一点，看清码牌，用右手把手机对准。姑娘把空袋撑开，将四块五用手机付过，','补足书/面/包/手机实动作，原书始终女持，沈只帮拿面。');
rep('前天沈禾在楼下找虫时，','周二沈禾在楼下找虫时，','实际63周二。');
rep('也没有忽然觉得父亲喜欢的密处都好；','也没有忽然觉得沈禾父亲喜欢的密处都好；','姑娘视角明确沈父，避免虚增姑娘父亲知情。');
rep('“你前天说取出来，我刚想，','“你周二说取出来，我刚想，','实际63取原夹纸/口述母是在周二。');
rep('昨天她画盆就想将口沿画成一个完整的圈，今晚看这只碗，边也并非处处一样。','昨天她画盆，口沿一边厚一边薄，擦过仍不匀。今晚看这只碗，亮处与暗处的线也不一样；她把书拿远一点，想先认清自己究竟看见哪一段，不急着替另一头补一条。','不将姑娘要求接齐圈的观点偷归沈，承接沈想画眼前可见。');
fs.writeFileSync(path.join(p,to),s,{flag:'wx'});
const result={from,to,before_sha256:sha(fs.readFileSync(path.join(p,from))),after_sha256:sha(s),body_han:(s.replace(/^#.*\n/,'').match(/[\u4e00-\u9fff]/g)||[]).length,chars:s.length,pages:Math.ceil(s.length/1800),edits};
assert(result.body_han>=16000);fs.writeFileSync(path.join(a,'b-resume-66-pre-record-fixes.json'),JSON.stringify(result,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify(result,null,2));
