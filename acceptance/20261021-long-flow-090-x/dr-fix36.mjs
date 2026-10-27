import fs from 'node:fs';import crypto from 'node:crypto';
const P=new URL('./scenario/东岸末班船-再扩展验证/',import.meta.url);
const read=p=>fs.readFileSync(new URL(p,P),'utf8');const put=(p,t)=>fs.writeFileSync(new URL(p,P),t,{flag:'wx'});
function edits(src,dest,pairs){let t=read(src);for(const[a,b]of pairs){if(!t.includes(a))throw Error('missing '+a);t=t.replace(a,b);}put(dest,t);}
edits('分段/0036/01-dr-v2.md','分段/0036/01-dr-v3.md',[['真花和自己那两团红','书上的花和自己那两团红']]);
edits('分段/0036/02-dr-v1.md','分段/0036/02-dr-v2.md',[['她切一根土豆','她切一个土豆'],['锅边轻响，两人隔着门说的却是那条巷子有没有画到尽头。','锅边轻响，两人隔着门说的却是那条巷子有没有画到尽头。菜盛起，她先拨一小半到干净饭盒，留明日中午，余下的端到桌上，父亲已经给自己盛好饭。']]);
edits('分段/0036/05-dr-v2.md','分段/0036/05-dr-v3.md',[['转身时连着道谢，自己原来正要回头问老板看见了没有。','转身时连着道谢，说自己正要回头问老板看见了没有。'],['自己原来正要回头问老板看见了没有。','自己原来正要回头问老板看见了没有。']].slice(0,1));
edits('分段/0036/06-dr-v1.md','分段/0036/06-dr-v2.md',[['先从冰箱拿出留的菜，摸碗底凉，便坐锅热。','先从冰箱拿出留的菜，把碗放进锅里，添水热着。'],['下周三还没来，今日这一行就先在家里','星期三还没到，今日这一行就先在家里']]);
const rels=['01-dr-v3','02-dr-v2','03-dr-v1','04-dr-v2','05-dr-v3','06-dr-v2'].map(n=>'分段/0036/'+n+'.md');
const parts=rels.map(path=>({path,sha256:crypto.createHash('sha256').update(fs.readFileSync(new URL(path,P))).digest('hex')}));
put('.writer/drafts/dr-assemble36-v2.json',JSON.stringify({unit:36,expected_revision:158,draft:'正文/0036-灯下还有一页-dr-v2.md',parts,separator:'\n\n'},null,2)+'\n');
console.log(JSON.stringify({parts,han:rels.reduce((a,p)=>a+(read(p).replace(/^#.*$/gm,'').match(/\p{Script=Han}/gu)||[]).length,0)}));
