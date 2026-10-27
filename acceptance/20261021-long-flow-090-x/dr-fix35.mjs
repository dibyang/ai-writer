import fs from 'node:fs';
import crypto from 'node:crypto';
const P=new URL('./scenario/东岸末班船-再扩展验证/',import.meta.url);
let t=fs.readFileSync(new URL('分段/0035/05-dr-v1.md',P),'utf8');
for(const [a,b] of [
 ['字也不会多会认两个','也不会多认得两个字'],
 ['拿杆的人把盘让他收好','拿杆的人叫他把线盘收好'],
 ['沈禾道菜场里面还有一家，自己午前经过见开着，现在得再看，没从椅边替人许到下午的货。','沈禾道菜场里面还有一家，自己前几天在那里买过，今天没从那边走，不知道现在还剩不剩。']
]) {if(!t.includes(a))throw Error('missing exact edit');t=t.replace(a,b);}
fs.writeFileSync(new URL('分段/0035/05-dr-v2.md',P),t,{flag:'wx'});
const rels=['分段/0035/01-d-v2.md','分段/0035/02-d-v1.md','分段/0035/03-dr-v2.md','分段/0035/04-dr-v1.md','分段/0035/05-dr-v2.md'];
const input={unit:35,expected_revision:155,draft:'正文/0035-一起翻到下一页-dr-v2.md',parts:rels.map(path=>({path,sha256:crypto.createHash('sha256').update(fs.readFileSync(new URL(path,P))).digest('hex')})),separator:'\n\n'};
fs.writeFileSync(new URL('.writer/drafts/dr-assemble35-v2.json',P),JSON.stringify(input,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({parts:input.parts,han:rels.reduce((n,p)=>n+(fs.readFileSync(new URL(p,P),'utf8').match(/\p{Script=Han}/gu)||[]).length,0)}));
