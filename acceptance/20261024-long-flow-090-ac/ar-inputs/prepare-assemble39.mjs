import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';
const base=path.resolve('acceptance/20261024-long-flow-090-ac'),p=path.join(base,'scenario/东岸末班船-48章独立验证'),sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const parts=Array.from({length:6},(_,i)=>`分段/AC-AR-0039/${String(i+1).padStart(2,'0')}.md`).map(file=>{const b=fs.readFileSync(path.join(p,file));return {path:file,sha256:sha(b),bytes:b.length,han:(b.toString().replace(/^#.*$/gm,'').match(/\p{Script=Han}/gu)||[]).length};});
fs.writeFileSync(path.join(base,'ar-inputs/39-parts-manifest.json'),JSON.stringify(parts,null,2)+'\n',{flag:'wx'});
fs.writeFileSync(path.join(base,'ar-inputs/assemble39.json'),JSON.stringify({unit:39,expected_revision:183,draft:'正文/0039-留到手上用-ac-ar-v1.md',parts:parts.map(({path,sha256})=>({path,sha256})),separator:'\n\n'},null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({parts,han:parts.reduce((a,b)=>a+b.han,0)},null,2));
