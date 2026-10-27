import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import {fileURLToPath} from 'node:url';
const here=path.dirname(fileURLToPath(import.meta.url)),dest=path.join(here,'harness-history/20261025-ndjson'),files=['verify-reads.mjs','verify-read-order.mjs','verify-tail-read-after-replay.mjs','reading-progress.mjs'];
fs.mkdirSync(dest,{recursive:true});const entries=[];
for(const name of files){const b=fs.readFileSync(path.join(here,name));fs.writeFileSync(path.join(dest,name),b,{flag:'wx'});entries.push({file:name,sha256:crypto.createHash('sha256').update(b).digest('hex')});}
fs.writeFileSync(path.join(dest,'before.json'),JSON.stringify({at:new Date().toISOString(),entries,note:'Original single-JSON-only readers preserved before supporting complete concatenated public page objects. No native output changed and no prior coverage receipt overwritten.'},null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({ok:true,files:entries.length}));
