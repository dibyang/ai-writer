import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const base=path.dirname(fileURLToPath(import.meta.url));
const inside=(root,file)=>file.startsWith(root+path.sep);
export function createRunner(stage){
 const directory=path.resolve(stage);
 if(!inside(base,directory))throw Error('Command logs must stay inside this campaign');
 const commands=path.join(directory,'commands');fs.mkdirSync(commands,{recursive:true});
 const index=path.join(commands,'index.jsonl');
 function run(executable,args,label,{timeout=180000}={}){
  if(!/^[A-Za-z0-9_-]+$/.test(label))throw Error('Use an explicit command label');
  const stem=new Date().toISOString().replace(/[:.]/g,'-')+'-'+crypto.randomUUID()+'-'+label;
  const prefix=path.join(commands,stem),started=Date.now();
  const r=spawnSync(executable,args,{encoding:'buffer',windowsHide:true,timeout,maxBuffer:64*1024*1024});
  fs.writeFileSync(prefix+'.stdout.raw.txt',r.stdout??Buffer.alloc(0),{flag:'wx'});
  fs.writeFileSync(prefix+'.stderr.raw.txt',r.stderr??Buffer.alloc(0),{flag:'wx'});
  const record={label,executable,argv:args,cwd:process.cwd(),started_at:new Date(started).toISOString(),elapsed_ms:Date.now()-started,exit_code:r.status,signal:r.signal,error:r.error?.message,files:{stdout:prefix+'.stdout.raw.txt',stderr:prefix+'.stderr.raw.txt',metadata:prefix+'.json'}};
  fs.writeFileSync(prefix+'.json',JSON.stringify(record,null,2)+'\n',{flag:'wx'});
  fs.appendFileSync(index,JSON.stringify(record)+'\n');
  return {...record,stdout:(r.stdout??Buffer.alloc(0)).toString('utf8'),stderr:(r.stderr??Buffer.alloc(0)).toString('utf8')};
 }
 function last(label){
  const rows=fs.existsSync(index)?fs.readFileSync(index,'utf8').split(/\r?\n/).filter(Boolean).map(JSON.parse):[];
  const row=rows.findLast(x=>x.label===label);
  if(!row)throw Error(`No exact command label: ${label}`);
  return {...row,stdout:fs.readFileSync(row.files.stdout,'utf8'),stderr:fs.readFileSync(row.files.stderr,'utf8')};
 }
 function json(label){const r=last(label);if(r.exit_code!==0)throw Error(`Command ${label} exited ${r.exit_code}; see ${r.files.metadata}`);return JSON.parse(r.stdout.replace(/^\uFEFF/,''));}
 return {run,last,json,index};
}
