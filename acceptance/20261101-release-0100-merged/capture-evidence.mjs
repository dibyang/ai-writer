import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import {fileURLToPath} from 'node:url';
const base=path.dirname(fileURLToPath(import.meta.url)),work=path.join(base,'work'),out=path.join(base,'evidence');
if(fs.existsSync(out))throw Error('Evidence destination exists');
const state=JSON.parse(fs.readFileSync(path.join(work,'.writer/state.json'),'utf8'));
const collect=(directory,prefix)=>fs.readdirSync(path.join(work,directory),{withFileTypes:true}).filter(x=>x.isFile()&&x.name.startsWith(prefix)).map(x=>`${directory}/${x.name}`);
const session='.writer/revisions/1d8736d0-7e09-4ca3-9d9e-8908237d57dc';
const refs=['.writer/state.json',...state.units.slice(-2).map(x=>x.draft),...collect('.writer/drafts','rc0100'),...collect('审查','RC0100'),...collect(session,'')];
const digest=b=>crypto.createHash('sha256').update(b).digest('hex'),seen=new Set(),rows=[];
for(const ref of refs){const src=path.resolve(work,ref),dst=path.resolve(out,ref);if(!src.startsWith(work+path.sep)||!dst.startsWith(out+path.sep)||fs.lstatSync(src).isSymbolicLink())throw Error('Unsafe input: '+ref);if(seen.has(ref))throw Error('Duplicate input: '+ref);seen.add(ref);const bytes=fs.readFileSync(src);fs.mkdirSync(path.dirname(dst),{recursive:true});fs.writeFileSync(dst,bytes,{flag:'wx'});if(digest(fs.readFileSync(dst))!==digest(bytes))throw Error('Copy mismatch: '+ref);rows.push({file:ref,bytes:bytes.length,sha256:digest(bytes)});}
fs.writeFileSync(path.join(out,'manifest.json'),JSON.stringify(rows,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify({files:rows.length,bytes:rows.reduce((n,x)=>n+x.bytes,0)}));
