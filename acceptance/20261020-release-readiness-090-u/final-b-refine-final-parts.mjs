import fs from 'node:fs';import path from 'node:path';import {U,W,write,hash,json} from './final-b-run.mjs';
const replacements={
 '03':[['许蓉抬起桌边那张报纸，让箱底离开被油洇湿的地方，伸手去托另一头。','许蓉把箱子朝桌边挪了挪，双手托住箱底。'],['沈禾握着笔，在代还领款一栏写名字。','周岸将自己签名的末笔描清，才把笔交回沈禾。她在代还领款一栏写名字。']],
 '04':[['周岸解锁手机，选好方才的锤柄照片，发给她。沈禾等图片点得开，才把手机收进外套口袋。','周岸解锁手机，选好方才的锤柄照片，发给她。梁伯的回字也到了，说收箱退钱的单子看清了，让他进铺后把箱子搁回架下。周岸念了一遍，将手机收好。沈禾等图片点得开，才把手机收进外套口袋。'],['许蓉站到她经过药店前那块亮地，便退回候船室','许蓉看着她经过药店前那块亮地，便退回候船室']]};
const manifest=[];
for(const n of ['01','02','03','04']){const source=path.join(W,`分段/0003/final-b-v3/${n}.md`);let t=fs.readFileSync(source,'utf8');for(const [a,b] of replacements[n]??[]){if(!t.includes(a))throw Error(a);t=t.replace(a,b);}const rel=`分段/0003/final-b-v4/${n}.md`;write(path.join(W,rel),t);manifest.push({path:rel,sha256:hash(path.join(W,rel)),han:[...t.replace(/^#.*\r?\n/,'').matchAll(/\p{Script=Han}/gu)].length,source_sha256:hash(source)});}
write(path.join(U,'final-b-parts-v4-manifest.json'),{order:manifest,total_body_han:manifest.reduce((s,x)=>s+x.han,0),note:'v1/v2/v3全部保留。v4只修实际托箱动作、描清签名动作和等候措辞，补实梁伯收到收还消息的回复；未改写前来源。'});console.log(JSON.stringify(manifest));console.log('total',manifest.reduce((s,x)=>s+x.han,0));
write(path.join(W,'.writer/drafts/final-b-assemble-3.json'),{unit:3,expected_revision:json(path.join(W,'.writer/drafts/final-b-record-3-before.json')).expected_revision,draft:'正文/0003-把手朝外-final-b.md',parts:manifest.map(({path,sha256})=>({path,sha256})),separator:'\n\n'});
