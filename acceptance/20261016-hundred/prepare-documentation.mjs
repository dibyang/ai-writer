import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const base='acceptance/20261016-hundred',target=`${base}/documentation-next`,paths=['lib/help.mjs','docs/quickstart.md','docs/user-guide.md','docs/long-form.md','docs/workflow.md'],manifest=JSON.parse(fs.readFileSync(`${base}/source-baseline-v3.json`)),hash=x=>crypto.createHash('sha256').update(x).digest('hex');assert(!fs.existsSync(target));
const files=paths.map(file=>{const bytes=fs.readFileSync(file);assert.equal(hash(bytes),manifest.files.find(x=>x.file===file)?.sha256,`Main changed: ${file}`);return{file,bytes,sha256:hash(bytes)};});
for(const f of files){const p=path.join(target,f.file);fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,f.bytes,{flag:'wx'});}
fs.writeFileSync(`${base}/documentation-origin.json`,JSON.stringify({at:new Date().toISOString(),scope:'Unapplied documentation/help draft from current v3; main and active book unchanged',target,files:files.map(({file,sha256})=>({file,sha256}))},null,2)+'\n',{flag:'wx'});console.log(JSON.stringify({copied:files.length,target}));
