import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import {fileURLToPath} from 'node:url';
const X=path.dirname(fileURLToPath(import.meta.url)),P=path.join(X,'scenario/东岸末班船-再扩展验证'),s=JSON.parse(fs.readFileSync(path.join(P,'.writer/state.json'),'utf8'));
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const rows=[];for(const u of s.units.filter(u=>u.unit>=25)){const b=fs.readFileSync(path.join(P,u.draft)),ls=b.toString('utf8').split(/\r?\n/);rows.push({unit:u.unit,draft:u.draft,sha256:sha(b),anchors:ls.flatMap((text,i)=>/课|凳|还书|二十七/.test(text)?[{line:i+1,text}]:[])});}
fs.writeFileSync(path.join(X,'e-downstream-anchors.json'),JSON.stringify(rows,null,2)+'\n',{flag:'wx'});
console.log('saved e-downstream-anchors.json; anchors='+rows.reduce((n,r)=>n+r.anchors.length,0));
