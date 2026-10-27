import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
const base=path.dirname(fileURLToPath(import.meta.url)),sha=b=>crypto.createHash('sha256').update(b).digest('hex'),rows=[];
for(const name of ['seal.json','seal-files.json'])if(fs.existsSync(path.join(base,name)))throw Error('Never overwrite an evidence seal');
function walk(dir,ref=''){for(const e of fs.readdirSync(dir,{withFileTypes:true}).sort((a,b)=>a.name.localeCompare(b.name))){const r=ref?ref+'/'+e.name:e.name,f=path.join(dir,e.name);if(e.isSymbolicLink())throw Error('Unexpected evidence link: '+r);if(e.isDirectory())walk(f,r);else{const bytes=fs.readFileSync(f);rows.push({file:r,bytes:bytes.length,sha256:sha(bytes)});}}}
walk(base);const manifest=Buffer.from(JSON.stringify(rows,null,2)+'\n');fs.writeFileSync(path.join(base,'seal-files.json'),manifest,{flag:'wx'});
for(const r of rows)if(sha(fs.readFileSync(path.join(base,r.file)))!==r.sha256)throw Error('Evidence changed during sealing: '+r.file);
const result={ok:true,sealed_at:new Date().toISOString(),files:rows.length,bytes:rows.reduce((s,r)=>s+r.bytes,0),manifest_sha256:sha(manifest),excluded:['seal.json','seal-files.json'],existing_works_modified:false,committed:false,pushed:false};fs.writeFileSync(path.join(base,'seal.json'),JSON.stringify(result,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify(result));
