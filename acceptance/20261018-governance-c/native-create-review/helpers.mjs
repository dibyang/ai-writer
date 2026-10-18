import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';
export const base='acceptance/20261018-governance-c/native-create-review';
export const project=`${base}/work`;
export const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
export const readJson=p=>JSON.parse(fs.readFileSync(p,'utf8'));
export function write(p,s){fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,s,{encoding:'utf8',flag:'wx'});}
export function json(p,v){write(p,JSON.stringify(v,null,2)+'\n');}
export function cli(label,args,{expect=0}={}){
 const r=spawnSync(process.execPath,['acceptance/20261018-governance-c/capture.mjs',label,'node','bin/ai-writer.mjs',...args],{cwd:process.cwd(),encoding:'utf8',windowsHide:true,maxBuffer:16*1024*1024});
 const dir=`acceptance/20261018-governance-c/commands/${label}`;
 const stdout=fs.readFileSync(`${dir}/stdout.raw.txt`,'utf8'),stderr=fs.readFileSync(`${dir}/stderr.raw.txt`,'utf8');
 let actual;try{actual=JSON.parse(stdout);}catch{actual={stdout,stderr};}
 const shown=args[0]==='context'?{ok:actual.ok,unit:actual.unit,revision:actual.revision,source_hashes:actual.source_hashes,continuity:actual.continuity,snapshot:actual.snapshot,output:actual.output}:actual;
 console.log(JSON.stringify({label,exit:r.status,actual:shown}));
 if(r.status!==expect)throw Error(`Unexpected exit ${label}: ${r.status}; expected ${expect}`);
 return actual;
}
export const state=()=>readJson(`${project}/.writer/state.json`);
