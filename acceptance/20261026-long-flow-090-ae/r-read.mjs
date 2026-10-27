import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const A=path.dirname(fileURLToPath(import.meta.url));
const [phase,unitArg,startArg,countArg='2',rootArg]=process.argv.slice(2);
const P=rootArg??JSON.parse(fs.readFileSync(path.join(A,'project.json'))).project;
const s=JSON.parse(fs.readFileSync(path.join(P,'.writer/state.json')));
const u=s.units.find(x=>x.unit===Number(unitArg));
if(!u||!/^[a-z][a-z0-9-]*$/.test(phase)||![1,2].includes(Number(countArg)))throw Error('Invalid read arguments');
for(let n=Number(startArg);n<Number(startArg)+Number(countArg);n++){
 const label=`r-${phase}-u${u.unit}-p${String(n).padStart(2,'0')}`;
 const r=spawnSync(process.execPath,[path.join(A,'read.mjs'),label,path.join(P,u.draft),String(n)],{encoding:'utf8',maxBuffer:8e6,windowsHide:true});
 process.stdout.write(r.stdout??'');process.stderr.write(r.stderr??'');if(r.status!==0)process.exit(r.status??1);
}
