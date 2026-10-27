import fs from'node:fs';import path from'node:path';import{fileURLToPath}from'node:url';
const A=path.dirname(fileURLToPath(import.meta.url)),P=JSON.parse(fs.readFileSync(path.join(A,'project.json'))).project,x=JSON.parse(fs.readFileSync(path.join(A,'fr-full-review-input.json'))),old=fs.readFileSync(path.join(A,'f-full-current60-pre-review.md'),'utf8');
const needle='周日28看书、周四32门50、周一36共饭、周四39? 不从周序猜，逐章日期以笔记原文为准；';
if(!old.includes(needle))throw Error('Exact report correction anchor missing');
const report=old.replace(needle,'第28日周日看书、第32日周四门工料50、第36日周一共饭；');
x.report='审查/F-全书当前60章-修前知情自检-v2.md';x.operation_id='ad-f-full-current60-before-revision-v2';
fs.writeFileSync(path.join(A,'f-full-current60-pre-review-v2.md'),report,{flag:'wx'});fs.writeFileSync(path.join(P,x.report),report,{flag:'wx'});fs.writeFileSync(path.join(A,'fr-full-review-input-v2.json'),JSON.stringify(x,null,2)+'\n',{flag:'wx'});
console.log('Saved separate v2: removed draft report calendar hesitation; old report/input retained; no prose or state changed.');
