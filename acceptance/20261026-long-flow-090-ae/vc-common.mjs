import fs from'node:fs';import path from'node:path';import crypto from'node:crypto';import{fileURLToPath}from'node:url';
export const A=path.dirname(fileURLToPath(import.meta.url)),P=path.join(A,'scenario/卷目录默认路径-三章验证');
export const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
export const read=r=>fs.readFileSync(path.join(P,r),'utf8'),json=r=>JSON.parse(read(r));
export const put=(r,v)=>{const f=path.join(P,r);fs.mkdirSync(path.dirname(f),{recursive:true});fs.writeFileSync(f,typeof v==='string'?v:JSON.stringify(v,null,2)+'\n',{flag:'wx'});};
