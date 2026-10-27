import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';
const base=path.resolve('acceptance/20261024-long-flow-090-ac'),root=JSON.parse(fs.readFileSync(path.join(base,'project.json'))).project,sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const parts=Array.from({length:7},(_,i)=>{const ref='分段/AC-D-0046/'+String(i+1).padStart(2,'0')+'.md';return {path:ref,sha256:sha(fs.readFileSync(path.join(root,ref)))};});
const body=parts.map(x=>fs.readFileSync(path.join(root,x.path),'utf8')).join('\n\n');const han=(body.replace(/^#.*$/gm,'').match(/\p{Script=Han}/gu)||[]).length;
fs.writeFileSync(path.join(base,'d-inputs/assemble46-final-v1.json'),JSON.stringify({unit:46,expected_revision:210,draft:'正文/0046-盒里最后一块-ac-d-v1.md',parts,separator:'\n\n'},null,2)+'\n',{flag:'wx'});console.log(JSON.stringify({parts:7,body_han:han,chars:body.length}));
