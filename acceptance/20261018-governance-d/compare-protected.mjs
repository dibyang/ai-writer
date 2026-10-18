import fs from 'node:fs';
import path from 'node:path';
import {BASE,sha,write} from './cli-support.mjs';
const before=JSON.parse(fs.readFileSync(path.join(BASE,'protected-before.json'))),files=[];
function visit(ref=''){for(const name of fs.readdirSync(path.join(before.root,ref)).sort()){const r=ref?ref+'/'+name:name,f=path.join(before.root,r),s=fs.lstatSync(f);if(s.isSymbolicLink())throw Error('Unexpected link: '+r);if(s.isDirectory())visit(r);else{const bytes=fs.readFileSync(f);files.push({file:r,bytes:bytes.length,sha256:sha(bytes)});}}}visit();
const old=new Map(before.files.map(r=>[r.file,r])),now=new Map(files.map(r=>[r.file,r])),changes=[];for(const ref of new Set([...old.keys(),...now.keys()])){const a=old.get(ref),b=now.get(ref);if(a?.sha256!==b?.sha256)changes.push({file:ref,status:!a?'added':!b?'removed':'changed',before:a??null,after:b??null});}
const result={at:new Date().toISOString(),root:before.root,before_files:before.files.length,after_files:files.length,unchanged:!changes.length,changes,scope:'Read-only observation during D campaign. No restore/update is performed. Hash differences alone do not attribute an actor; this task execution records target repository/D fixtures, not this work.'};
write(path.join(BASE,'protected-after.json'),{root:before.root,at:result.at,files});write(path.join(BASE,'protected-diff.json'),result);console.log(JSON.stringify({before:before.files.length,after:files.length,changes:changes.length,files:changes.map(r=>r.file)}));
