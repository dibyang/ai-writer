import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
export const stage=path.dirname(fileURLToPath(import.meta.url));
export const base=path.dirname(stage), repo=path.resolve(base,'../..');
export const hundred=path.join(base,'scale-hundred/work'), fresh=path.join(stage,'fresh-work');
export const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
export const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
export function put(p,v){fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,typeof v==='string'?v:JSON.stringify(v,null,2)+'\n',{flag:'wx'});return p;}
export function state(p){return read(path.join(p,'.writer/state.json'));}
export function run(label,args,project=hundred,input=null,expected=0){
 const full='native-four-'+label;
 const file=input===null?null:put(path.join(stage,'inputs',label+'.json'),input);
 const argv=[path.join(base,'capture.mjs'),full,process.execPath,path.join(repo,'bin/ai-writer.mjs'),...args];
 if(project) argv.push('--project',project);
 if(file) argv.push('--input',file);
 const r=spawnSync(process.execPath,argv,{cwd:repo,encoding:'utf8',maxBuffer:20*1024*1024,windowsHide:true});
 const d=path.join(base,'commands',full), m=read(path.join(d,'result.json'));
 const raw=fs.readFileSync(path.join(d,'stdout.raw.txt'),'utf8');
 let out;try{out=JSON.parse(raw);}catch{out=raw;}
 console.log(JSON.stringify({label:full,exit:m.exit_code,elapsed:m.elapsed_ms,code:out?.error?.code??out?.code,expected}));
 if(m.exit_code!==expected){console.log(raw);console.log(fs.readFileSync(path.join(d,'stderr.raw.txt'),'utf8'));throw Error('Unexpected CLI result '+full);}
 return out;
}
export function evidence(project,rel,quote){const b=fs.readFileSync(path.join(project,rel));return {local_source:rel,source_sha256:sha(b),quote,locator:'全文授权段',recorded_by:'Codex native-four; synthetic acceptance author'};}
