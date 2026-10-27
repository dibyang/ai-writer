import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
const a=path.dirname(fileURLToPath(import.meta.url));
const [mode,label,...args]=process.argv.slice(2);
if(!['main','work'].includes(mode)||!label?.startsWith('fvr1-'))throw Error('Explicit target and unique fvr1 label required');
const main=path.join(a,'scenario','东岸末班船-66章独立验证');
const credpath=path.join(a,'fvr1-private-ownership.json');
const cred=mode==='work'?JSON.parse(fs.readFileSync(credpath,'utf8')):null;
const project=cred?.workspace??main;
const full=[...args,'--project',project];
if(mode==='work')full.push('--revision-token',cred.token);
const r=spawnSync(process.execPath,[path.join(a,'cli-g9.mjs'),label,...full],{encoding:'utf8',windowsHide:true,timeout:130000,maxBuffer:64*1024*1024});
let parsed;try{parsed=JSON.parse(r.stdout)}catch{}
if(args[0]==='revision'&&args[1]==='begin'&&r.status===0){
  if(!parsed?.token||!parsed?.id||!parsed?.workspace)throw Error('Unexpected begin shape; raw log preserved, no credentials printed');
  fs.writeFileSync(credpath,JSON.stringify(parsed,null,2)+'\n',{flag:'wx'});
  const {token,...publicResult}=parsed;console.log(JSON.stringify({...publicResult,token:'[private credential saved; omitted]',credential_file:credpath},null,2));
}else process.stdout.write(r.stdout??'');
process.stderr.write(r.stderr??'');
process.exitCode=r.status??1;
