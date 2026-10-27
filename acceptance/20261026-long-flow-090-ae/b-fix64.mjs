import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import assert from 'node:assert/strict';import{fileURLToPath}from'node:url';
const A=path.dirname(fileURLToPath(import.meta.url)),P=JSON.parse(fs.readFileSync(path.join(A,'project.json'))).project,sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const input=JSON.parse(fs.readFileSync(path.join(A,'b-assemble64-input.json'))),from=input.draft,to='正文/0064-把这一边转过来-ae-b-v2.md',old=fs.readFileSync(path.join(P,from));
const parts=input.parts.map(p=>{const b=fs.readFileSync(path.join(P,p.path));assert.equal(sha(b),p.sha256);return b.toString('utf8');});assert.equal(old.toString('utf8'),parts.join(input.separator));
const edits=[
['母亲让她把那一口早饭也问了，碗端着到现在，水都快比饭热。','母亲让她先把那一口早饭吃了，她那碗还在桌上，水都快比饭热。','女并未端碗站着，明确早餐在桌上，去掉误指代。'],
['她出了店，顺路买了一小份能带回的熟菜，装到另一只袋里，不让油袋进课袋。','她出了店，认过路边卖熟菜的那一处，想下工回来再带一点。','购买移到下工以免省略午后食品保管，非补作历史旧事实。'],
['下工时，天仍亮，姑娘提着两只袋先回家。','下工时，天仍亮，姑娘绕到那一处买了一小份熟菜，付过钱，油袋另提着，再回家。','实际取得/付钱落在下工归程，课袋不沾油。'],
['想写针距不齐，写完又觉得自己早就知道这件，','想写针距不齐，字还没落下，又觉得自己早就知道这件，','后文此时未留字，消除写完与未写冲突。'],
['女人在身边站起来，裤子穿到自己身上，手扶桌沿，','女人在身边站起来，将带来的宽裤套在原穿的薄裤外，手扶桌沿，','说明课堂试裤的实际穿法，避免凭空当众脱换。'],
['女人说穿鞋，今日鞋在门边那袋里，自己方才忘了换。','女人说在家穿的是另一双鞋，今日带在门边那袋里，自己方才忘了换。','明确试长对应鞋并非当前脚上那双，说明为何还要换鞋。'],
['那一点皱还留着，针在线也在，','那一点皱还留着，针已放稳，线还连着新行，','修正别扭语句，明确针与布的状态。'],
['她拿起笔，在小纸原来那几行旁找一个窄空，','她把针固定回盒，再拿起笔，在小纸原来那几行旁找一个窄空，','补足停针后执笔的动作顺序。'],
['布与小纸跟上，水杯取回，桌面一下空了。','布与小纸跟上，水杯挪到包边，桌面一下空了。','保留稍后离门前实际提杯动作，避免重复取回。'],
['姑娘笑，知道母亲其实没戴什么平日看字的眼镜，便把灯略向布这边转，','姑娘笑，便把灯略向布这边转，','去掉无必要的新眼镜习惯断言和别扭解释。']
];
let text=old.toString('utf8');for(const [a,b]of edits){assert.equal(text.split(a).length,2,a);text=text.replace(a,b);}
fs.writeFileSync(path.join(P,to),text,{flag:'wx'});
const result={at:new Date().toISOString(),first_assembly:{path:from,sha256:sha(old),exact_ordered_concat:true,part_count:parts.length},final_candidate:{path:to,sha256:sha(Buffer.from(text)),han:[...text.replace(/^#.*\r?\n/,'').matchAll(/\p{Script=Han}/gu)].length,chars:text.length},edits:edits.map(([before,after,reason])=>({before,after,reason})),scope:'Unregistered new64 only; original assembly/parts untouched; not formal literary acceptance.'};
fs.writeFileSync(path.join(A,'b-64-pre-record-fixes.json'),JSON.stringify(result,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify(result));
