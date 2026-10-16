import fs from 'node:fs';
import {project,hash} from './run-cli.mjs';
for(const n of process.argv.slice(2).map(Number)){const p=fs.readdirSync(project+'/正文').find(p=>p.startsWith(String(n).padStart(4,'0')+'-'));const file=project+'/正文/'+p;const t=fs.readFileSync(file,'utf8').replace(/^#{1,6}\s.*$/gm,'');console.log(JSON.stringify({unit:n,path:file,han:(t.match(/\p{Script=Han}/gu)??[]).length,sha256:hash(file)}));}
