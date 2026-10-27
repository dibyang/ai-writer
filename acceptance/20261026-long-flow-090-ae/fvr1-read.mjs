import fs from'node:fs';import path from'node:path';import{fileURLToPath}from'node:url';import{spawnSync}from'node:child_process';
const a=path.dirname(fileURLToPath(import.meta.url)),[unitArg,pageArg,countArg='2',suffix='body']=process.argv.slice(2),unit=Number(unitArg),page=Number(pageArg),count=Number(countArg);
if(!Number.isInteger(unit)||!Number.isInteger(page)||![1,2].includes(count))throw Error('Invalid page request');
const c=JSON.parse(fs.readFileSync(path.join(a,'fvr1-private-ownership.json'),'utf8')),b=JSON.parse(fs.readFileSync(path.join(a,'fvr1-baseline.json'),'utf8')),u=b.units.find(u=>u.unit===unit);
for(let p=page;p<page+count;p++){const r=spawnSync(process.execPath,[path.join(a,'read.mjs'),`fvr1-u${unit}-${suffix}-p${String(p).padStart(2,'0')}`,path.join(c.workspace,u.draft),String(p)],{encoding:'utf8',windowsHide:true,maxBuffer:1024*1024});process.stdout.write(r.stdout??'');process.stderr.write(r.stderr??'');if(r.status!==0){process.exitCode=r.status??1;break;}}
