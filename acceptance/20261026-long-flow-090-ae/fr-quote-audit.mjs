import fs from 'node:fs';
import path from 'node:path';
const A=path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/,'$1'));
const P=path.join(A,'scenario','东岸末班船-66章独立验证');
const s=JSON.parse(fs.readFileSync(path.join(P,'.writer/state.json'),'utf8'));
const notes=fs.readFileSync(path.join(P,'审查/AE-final-read-语义笔记.md'),'utf8');
let unit;const wrong=[];let tested=0;
for(const line of notes.split(/\r?\n/)){const m=line.match(/^## (\d+) /);if(m)unit=Number(m[1]);if(unit&&line.includes('引句：')){const body=fs.readFileSync(path.join(P,s.units.find(x=>x.unit===unit).draft),'utf8');for(const q of line.matchAll(/“([^”]+)”/g)){tested++;if(!body.includes(q[1]))wrong.push({unit,quote:q[1],line});}}}
console.log(JSON.stringify({tested,wrong,note:'Literal audit only. Does not judge literary quality or independence of semantic evidence.'},null,2));
