import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const U=path.dirname(fileURLToPath(import.meta.url));
const [label,entry,...args]=process.argv.slice(2);
if(!/^final-a-[a-z0-9-]+$/.test(label??'')||!entry) throw Error('final-a label and entry required');
const dir=path.join(U,'final-commands',label);
fs.mkdirSync(dir,{recursive:false});
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const at=args.indexOf('--project'), init=args.indexOf('--path');
const project=at>=0?path.resolve(args[at+1]):init>=0?path.resolve(args[init+1]):null;
const state=project&&path.join(project,'.writer/state.json');
function snap(name){if(!state||!fs.existsSync(state))return null;const b=fs.readFileSync(state);fs.writeFileSync(path.join(dir,name),b,{flag:'wx'});return sha(b);}
const inputs=[];
for(let i=0;i<args.length;i++) if(args[i]==='--input'){const p=path.resolve(args[i+1]),b=fs.readFileSync(p);fs.writeFileSync(path.join(dir,'input.raw.json'),b,{flag:'wx'});inputs.push({path:p,sha256:sha(b),bytes:b.length});}
const before=snap('before-state.json'),started=new Date().toISOString();
const r=spawnSync(process.execPath,[entry,...args],{cwd:process.cwd(),windowsHide:true,maxBuffer:32*1024*1024,timeout:60000});
fs.writeFileSync(path.join(dir,'stdout.raw.txt'),r.stdout??Buffer.alloc(0),{flag:'wx'});
fs.writeFileSync(path.join(dir,'stderr.raw.txt'),r.stderr??Buffer.alloc(0),{flag:'wx'});
const result={label,entry,args,cwd:process.cwd(),project,project_existed_before:before!==null,started_at:started,finished_at:new Date().toISOString(),exit_code:r.status,signal:r.signal,error:r.error?.message??null,inputs,before_state_sha256:before,after_state_sha256:snap('after-state.json')};
fs.writeFileSync(path.join(dir,'result.json'),JSON.stringify(result,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify(result));
console.log(r.stdout?.toString('utf8')??'');
if(r.stderr?.length)process.stderr.write(r.stderr);
process.exitCode=r.status??2;
