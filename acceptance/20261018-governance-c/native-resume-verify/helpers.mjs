import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';
export const root=process.cwd(), dir=path.join(root,'acceptance/20261018-governance-c/native-resume-verify'), work=path.join(root,'acceptance/20261018-governance-c/native-create-review/work');
export const sha=x=>crypto.createHash('sha256').update(x).digest('hex');
export const read=f=>JSON.parse(fs.readFileSync(f,'utf8'));
export const state=(p=work)=>read(path.join(p,'.writer/state.json'));
export const write=(p,x)=>{fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,typeof x==='string'?x:JSON.stringify(x,null,2)+'\n',{flag:'wx'});return p;};
export function call(label,args,{project=work,input,exit=0}={}){
 const inFile=input===undefined?null:write(path.join(dir,'inputs',label+'.json'),input);
 const cli=['bin/ai-writer.mjs',...args,...(project?['--project',project]:[]),...(inFile?['--input',inFile]:[])];
 const r=spawnSync(process.execPath,[path.join(dir,'capture.mjs'),label,process.execPath,...cli],{cwd:root,encoding:'utf8',windowsHide:true});
 const cd=path.join(dir,'commands',label), meta=read(path.join(cd,'result.json'));
 const stdout=fs.readFileSync(path.join(cd,'stdout.raw.txt'),'utf8'), stderr=fs.readFileSync(path.join(cd,'stderr.raw.txt'),'utf8');
 console.log(JSON.stringify({label,exit:meta.exit_code,before:meta.before_state_sha256,after:meta.after_state_sha256}));
 if(meta.exit_code!==exit)throw Error(label+' unexpected exit '+meta.exit_code+' '+stdout+' '+stderr);
 let data;try{data=JSON.parse(stdout)}catch{}
 if(stderr)console.log(stderr);return data;
}
