import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
const base=path.dirname(fileURLToPath(import.meta.url));
const excluded=new Set(['seal.json','seal-files.json','seal-progress.json']);
const rows=[];let bytes=0;
function visit(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true}).sort((a,b)=>a.name.localeCompare(b.name))){const file=path.join(dir,entry.name),rel=path.relative(base,file).split(path.sep).join('/');if(excluded.has(rel))continue;if(entry.isSymbolicLink())throw Error(`Unexpected symbolic link: ${rel}`);if(entry.isDirectory()){visit(file);continue;}if(!entry.isFile())throw Error(`Unexpected entry: ${rel}`);const b=fs.readFileSync(file);bytes+=b.length;rows.push({file:rel,bytes:b.length,sha256:crypto.createHash('sha256').update(b).digest('hex')});if(rows.length%500===0)fs.writeFileSync(path.join(base,'seal-progress.json'),JSON.stringify({files:rows.length,bytes,at:new Date().toISOString()},null,2));}}
visit(base);const manifest=Buffer.from(JSON.stringify(rows,null,2)+'\n');fs.writeFileSync(path.join(base,'seal-files.json'),manifest,{flag:'wx'});
const out={ok:true,files:rows.length,bytes,manifest_sha256:crypto.createHash('sha256').update(manifest).digest('hex'),excluded:[...excluded],note:'Local evidence integrity only; not product release or literary approval.'};fs.writeFileSync(path.join(base,'seal.json'),JSON.stringify(out,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify(out));
