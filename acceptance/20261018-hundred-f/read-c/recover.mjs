import fs from 'node:fs';
import path from 'node:path';
import {session,sha,BASE} from '../session-support.mjs';
const s=session('read-c');
function inventory(dir,root=dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>{const p=path.join(dir,e.name);return e.isDirectory()?inventory(p,root):[{path:path.relative(root,p).replaceAll('\\','/'),sha256:sha(fs.readFileSync(p)),bytes:fs.statSync(p).size}];}).sort((a,b)=>a.path.localeCompare(b.path));}
s.write('baseline-work.json',inventory(s.project));
const outputs={};
for(const [label,args] of [['status',['status']],['workflow',['workflow','show']],['discussion',['context','--purpose','discussion']],['identify',['tool','identify']],['check',['check']]]){outputs[label]=s.run(label,args).value;}
s.write('recovery.json',outputs);
console.log(JSON.stringify({status:outputs.status,workflow:outputs.workflow,identify:outputs.identify,check:outputs.check},null,2));
