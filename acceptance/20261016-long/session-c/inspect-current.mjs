import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';
const base=path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/,'$1'));
const project=path.resolve(base,'../works/雨线档案');
const ids=['O_KEY','P_KEY','O_LABEL','P_ENVELOPE','T_COPY','T_MISSED','F_DIRECTORY','F_ACCESS','F_ENV'];
for(let i=0;i<ids.length;i++){
 const label=`recall-id-${ids[i]}`;
 const r=spawnSync(process.execPath,[path.join(base,'run-cli.mjs'),label,'recall','--query',ids[i]],{encoding:'utf8'});
 if(r.status!==0)throw Error(r.stdout+r.stderr);
 const d=JSON.parse(r.stdout); console.log(JSON.stringify({id:ids[i],exit_code:r.status,total:d.total,matches:d.matches.map(x=>({id:x.id,unit:x.unit}))}));
}
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const files=['writer.json','.writer/state.json'];
for(const folder of ['正文','设定','大纲']){const walk=rel=>{for(const item of fs.readdirSync(path.join(project,rel),{withFileTypes:true})){const f=rel+'/'+item.name;if(item.isDirectory())walk(f);else files.push(f)}};walk(folder);}
fs.writeFileSync(path.join(base,'initial-hashes.json'),JSON.stringify(Object.fromEntries(files.map(f=>[f,sha(fs.readFileSync(path.join(project,f)))])),null,2)+'\n');
