import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const A=path.dirname(fileURLToPath(import.meta.url));
const audit=JSON.parse(fs.readFileSync(path.join(A,'final-first-entry-audit.json')));
const P=JSON.parse(fs.readFileSync(path.join(A,'project.json'))).project;
const n=fs.readFileSync(path.join(P,'审查/AE-final-first-语义笔记.md'),'utf8');
let c=0;
for(const sec of n.split(/(?=^## \d+ )/m)){
 const m=sec.match(/^## (\d+) /);if(!m)continue;
 const u=audit.units.find(x=>x.unit===+m[1]);const body=fs.readFileSync(u.path,'utf8');
 for(const line of sec.split('\n'))if(line.includes('引句：'))for(const q of line.matchAll(/“([^”]+)”/g))if(!body.includes(q[1])){console.log(m[1]+': '+q[1]);c++;}
}
console.log('mismatches='+c);
