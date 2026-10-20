import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {base,save,sha} from './common.mjs';
const [phase,nText]=process.argv.slice(2),n=Number(nText),b=JSON.parse(fs.readFileSync(path.join(base,'r1-session.json'),'utf8'));
const refs=[`正文/${String(n).padStart(4,'0')}.md`,`.writer/drafts/t-r1-replay-${n}.json`];
const files=refs.map(ref=>{const v=fs.readFileSync(path.join(b.workspace,ref));return {ref,path:path.join(b.workspace,ref),sha256:sha(v),bytes:v.length,lines:v.toString('utf8').split('\n').length};});
if(phase==='after'){const before=JSON.parse(fs.readFileSync(path.join(base,`r1-candidate-${n}-read-before.json`),'utf8'));assert.deepEqual(files,before.files);}
save(`r1-candidate-${n}-read-${phase}.json`,{unit:n,files});console.log(JSON.stringify(files));
