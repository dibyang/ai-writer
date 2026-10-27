import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import assert from 'node:assert/strict';
const a=path.resolve('acceptance/20261026-long-flow-090-ae'),p=path.join(a,'scenario/东岸末班船-66章独立验证'),dir='分段/AE-0066/',sha=b=>crypto.createHash('sha256').update(b).digest('hex'),audit=[];
function version(name,edits){const old=dir+name+'-v1.md',next=dir+name+'-v2.md';let s=fs.readFileSync(path.join(p,old),'utf8');for(const [before,after]of edits){assert.equal(s.split(before).length,2,before);s=s.replace(before,after);}fs.writeFileSync(path.join(p,next),s,{flag:'wx'});audit.push({old,next,before_sha256:sha(fs.readFileSync(path.join(p,old))),after_sha256:sha(s),edits});return next;}
const p2=version('02-先吃自己的那一份',[['桌内今天的新画没有取出','桌内昨日的新画没有取出']]);
const p6=version('06-书回到自己的桌上',[[
'姑娘将饭菜取出，问母亲现在吃还是先洗头。',
`许蓉看见碗旁那张便条，拿起来，先认出下头的黄瓜，又看见上面划掉的几个字。

“不是买了么，怎么这里写没买？”

姑娘伸头看，才想起自己出门前写的那一句。“那会儿还没出去，写完觉得不用说，又划了。”

“我还以为你买了又没带回来。”

“在架上呢。”

“看见了。”许蓉笑了一下，把便条平放回去，“你一划，我又要猜你为什么划。”

姑娘有点无奈，也笑了。她本来是怕母亲等面，删掉又怕母亲问，如今还是问了。她伸手想将纸收走，母亲先指住下半行，问黄瓜是不是还没拌。姑娘说没拌，取出冰箱里那半根给她看，母亲这才将纸递回去。

姑娘将便条揉进厨房的废纸里，没有拿回房夹进哪本书。已经说清的这一张用到这里就够了，明早的面也不靠留着它才能记住。

许蓉洗手时，姑娘把挂面往架里推稳一点，免得碰到门边的瓶。母亲看见，说自己明天拿会先看，不用她把每一样都安到最好取的地方。姑娘收回手，转头见门旁毛巾堆得乱，又没有先去理。

姑娘将饭菜取出，问母亲现在吃还是先洗头。`
]]);
const p7=version('07-空着那只手回来',[['下午站着托板的那一点绷','昨日站着托板的那一点绷']]);
const selected=[dir+'01-今天不顺路带去-v1.md',p2,dir+'03-出门以前还有一点空-v1.md',dir+'04-接到手才往旁边走-v1.md',dir+'05-买到了再拿-v1.md',p6,p7];
const t=JSON.parse(fs.readFileSync(path.join(p,'.writer/drafts/ae-b-record66-original.json')));for(const [r,h]of Object.entries(t.source_hashes))assert.equal(sha(fs.readFileSync(path.join(p,r))),h,r);
const parts=selected.map(rel=>({path:rel,sha256:sha(fs.readFileSync(path.join(p,rel)))}));
const input={unit:66,expected_revision:t.expected_revision,draft:t.draft,parts,separator:'\n\n'};
fs.writeFileSync(path.join(a,'b-resume-66-selected-changes.json'),JSON.stringify({audit,selected},null,2)+'\n',{flag:'wx'});
fs.writeFileSync(path.join(a,'b-resume-assemble66-input.json'),JSON.stringify(input,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({parts,body_han:selected.reduce((n,r)=>n+(fs.readFileSync(path.join(p,r),'utf8').replace(/^#.*\n/,'').match(/[\u4e00-\u9fff]/g)||[]).length,0),source_hashes_unchanged:true},null,2));
