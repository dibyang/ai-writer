import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';
const root=path.resolve('acceptance/20261024-long-flow-090-ac');const {project}=JSON.parse(fs.readFileSync(path.join(root,'project.json')));const sha=b=>crypto.createHash('sha256').update(b).digest('hex');const state=JSON.parse(fs.readFileSync(path.join(project,'.writer/state.json')));
const parts=Array.from({length:7},(_,i)=>{const rel=`分段/AC-B-0040/${String(i+1).padStart(2,'0')}.md`;const b=fs.readFileSync(path.join(project,rel));return {path:rel,sha256:sha(b),bytes:b.length,han:(b.toString('utf8').replace(/^#.*$/gm,'').match(/\p{Script=Han}/gu)||[]).length};});
fs.writeFileSync(path.join(root,'b-inputs/40-parts-manifest.json'),JSON.stringify(parts,null,2)+'\n');
fs.writeFileSync(path.join(root,'b-inputs/assemble40.json'),JSON.stringify({unit:40,expected_revision:state.revision,draft:'正文/0040-取下来的那一条-ac-b-v1.md',parts:parts.map(({path,sha256})=>({path,sha256})),separator:'\n\n'},null,2)+'\n');
