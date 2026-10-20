import fs from 'node:fs';import path from 'node:path';import {spawn}from'node:child_process';
const base=path.resolve('acceptance/20261020-release-readiness-090-u/provenance-probes');fs.mkdirSync(base,{recursive:true});
for(const [name,args]of [['current',['status','--porcelain','--untracked-files=normal']],['no-optional-locks',['--no-optional-locks','status','--porcelain','--untracked-files=normal']]]){
  const dir=path.join(base,name);fs.mkdirSync(dir);const start=Date.now(),child=spawn('git',args,{windowsHide:true,stdio:['ignore','pipe','pipe']});const out=fs.openSync(path.join(dir,'stdout.raw.txt'),'wx'),err=fs.openSync(path.join(dir,'stderr.raw.txt'),'wx');
  child.stdout.on('data',b=>fs.writeSync(out,b));child.stderr.on('data',b=>fs.writeSync(err,b));const timer=setTimeout(()=>child.kill(),30000);let error=null;child.on('error',e=>error={code:e.code,message:e.message});
  const r=await new Promise(resolve=>child.on('close',(code,signal)=>{clearTimeout(timer);fs.closeSync(out);fs.closeSync(err);resolve({name,args,exit_code:code,signal,error,elapsed_ms:Date.now()-start,deadline_ms:30000});}));fs.writeFileSync(path.join(dir,'result.json'),JSON.stringify(r,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify(r));
}
