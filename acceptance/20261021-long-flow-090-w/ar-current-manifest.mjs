import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import{fileURLToPath}from'node:url';
const W=path.dirname(fileURLToPath(import.meta.url)),P=path.join(W,'scenario/东岸末班船-规模验证'),sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const raw=fs.readFileSync(path.join(P,'.writer/state.json')),s=JSON.parse(raw);
const units=s.units.map(u=>{const b=fs.readFileSync(path.join(P,u.draft)),actual=sha(b);if(actual!==u.sha256)throw Error('registered bytes changed '+u.unit);return{unit:u.unit,path:u.draft,sha256:actual,bytes:b.length,lines:b.toString('utf8').split('\n').length,body_han:(b.toString('utf8').split(/\r?\n/).filter(l=>!/^\s*#/.test(l)).join('\n').match(/\p{Script=Han}/gu)||[]).length};});
const out={project:P,revision:s.revision,state_sha256:sha(raw),units};fs.writeFileSync(path.join(W,'ar-current-r'+s.revision+'.json'),JSON.stringify(out,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify(out,null,2));
