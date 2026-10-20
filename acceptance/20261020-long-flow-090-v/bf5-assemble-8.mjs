import fs from 'node:fs';import crypto from 'node:crypto';
const w='scenario/东岸末班船-扩展验证',sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const s=JSON.parse(fs.readFileSync(`${w}/.writer/state.json`));
const parts=['分段/0008/01-v1.md','分段/0008/02-v1.md'].map(path=>{const b=fs.readFileSync(`${w}/${path}`);return {path,sha256:sha(b),han:[...b.toString().replace(/^#.*$/gm,'').matchAll(/\p{Script=Han}/gu)].length};});
fs.writeFileSync('bf5-assemble-8.json',JSON.stringify({unit:8,expected_revision:s.revision,draft:'正文/0008-半个钟头-v1.md',parts:parts.map(({path,sha256})=>({path,sha256})),separator:'\n\n'},null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({parts,total_han:parts.reduce((n,p)=>n+p.han,0),revision:s.revision},null,2));
