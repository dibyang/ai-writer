import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import assert from 'node:assert/strict';import {fileURLToPath} from 'node:url';
const b=path.dirname(fileURLToPath(import.meta.url)),r=JSON.parse(fs.readFileSync(path.join(b,'project.json'))).project,sha=x=>crypto.createHash('sha256').update(x).digest('hex'),read=f=>fs.readFileSync(path.join(r,f));
const t=JSON.parse(read('.writer/drafts/ad-ar-record-template51-original.json'));assert.equal(t.expected_revision,267);for(const [f,h] of Object.entries(t.source_hashes))assert.equal(sha(read(f)),h,f);
const parts=Array.from({length:9},(_,i)=>`分段/${i===5?'AD-AR-0051-修正':'AD-AR-0051'}/${String(i+1).padStart(2,'0')}.md`).map(p=>({path:p,sha256:sha(read(p))}));
const x={unit:51,expected_revision:267,draft:'正文/0051-翻到自己那页-ad-ar-v1.md',parts,separator:'\n\n'};fs.writeFileSync(path.join(r,'.writer/drafts/ad-ar-assemble51-v1.json'),JSON.stringify(x,null,2)+'\n',{flag:'wx'});
console.log({ok:true,parts:parts.length,han:(parts.map(p=>read(p.path).toString()).join('\n\n').match(/\p{Script=Han}/gu)||[]).length,source_hashes_checked:Object.keys(t.source_hashes).length});
