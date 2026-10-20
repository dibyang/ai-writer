import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';
export const U=path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/,'$1'));
export const W=path.join(U,'scenario-final','东岸末班船');
export const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
export const hash=f=>fs.existsSync(f)?sha(fs.readFileSync(f)):null;
export const json=f=>JSON.parse(fs.readFileSync(f,'utf8'));
export function write(f,v){if(fs.existsSync(f))throw Error('Refuse overwrite: '+f);fs.mkdirSync(path.dirname(f),{recursive:true});fs.writeFileSync(f,typeof v==='string'?v:JSON.stringify(v,null,2)+'\n');}
export function run(label,args,project=W){
 const dir=path.join(U,'final-b-commands',label);if(fs.existsSync(dir))throw Error('duplicate log');fs.mkdirSync(dir,{recursive:true});
 const state=path.join(project,'.writer/state.json');const before=hash(state);if(fs.existsSync(state))fs.copyFileSync(state,path.join(dir,'state-before.json'));
 const inputs=[];for(let i=0;i<args.length;i++){if(['--input','--plan'].includes(args[i])&&args[i+1]){let f=path.resolve(project,args[i+1]);if(fs.existsSync(f)){const b=fs.readFileSync(f);let n=`input-${inputs.length}.bin`;fs.writeFileSync(path.join(dir,n),b);inputs.push({argument:args[i+1],path:f,sha256:sha(b),bytes:b.length,saved:n});}}}
 const argv=[path.join(W,'.writer/tool/bin/ai-writer.mjs'),...args,'--project',project];
 const result=spawnSync(process.execPath,argv,{cwd:project,encoding:null,maxBuffer:64*1024*1024});
 fs.writeFileSync(path.join(dir,'stdout.bin'),result.stdout||Buffer.alloc(0));fs.writeFileSync(path.join(dir,'stderr.bin'),result.stderr||Buffer.alloc(0));
 if(fs.existsSync(state))fs.copyFileSync(state,path.join(dir,'state-after.json'));
 const meta={label,at:new Date().toISOString(),executable:process.execPath,argv,project,inputs,exit_code:result.status,signal:result.signal,error:result.error?.message,state_before_sha256:before,state_after_sha256:hash(state)};write(path.join(dir,'meta.json'),meta);
 console.log(JSON.stringify(meta));console.log(result.stdout?.toString()||'');if(result.stderr?.length)console.error(result.stderr.toString());
 if(result.status!==0)throw Error('CLI failed; dependent steps stopped: '+label);return result.stdout?.toString();
}
if(process.argv[1]&&path.resolve(process.argv[1])===path.resolve(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/,'$1'))){const [label,...args]=process.argv.slice(2);run(label,args);}
