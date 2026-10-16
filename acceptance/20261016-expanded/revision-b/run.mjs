import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';
export const root='D:/work/other/ai-writer';
export const stage=root+'/acceptance/20261016-expanded/revision-b';
export const project=root+'/acceptance/20261016-expanded/works/潮汐信号';
export const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
export const json=p=>JSON.parse(fs.readFileSync(p,'utf8').replace(/^\uFEFF/,''));
export function write(p,v){fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,typeof v==='string'||Buffer.isBuffer(v)?v:JSON.stringify(v,null,2)+'\n');}
export function walk(p){return fs.readdirSync(p,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(p,e.name)):[path.join(p,e.name)]);}
export function run(args,label){
 fs.mkdirSync(stage+'/logs',{recursive:true});
 const seq=fs.readdirSync(stage+'/logs').filter(x=>x.endsWith('.meta.json')).length+1;
 const prefix=stage+'/logs/'+String(seq).padStart(3,'0')+'-'+label;
 const argv=[root+'/bin/ai-writer.mjs',...args];
 const started=new Date().toISOString();
 const r=spawnSync(process.execPath,argv,{cwd:root,encoding:'buffer',maxBuffer:32*1024*1024});
 fs.writeFileSync(prefix+'.stdout',r.stdout??Buffer.alloc(0));fs.writeFileSync(prefix+'.stderr',r.stderr??Buffer.alloc(0));
 write(prefix+'.meta.json',{executable:process.execPath,argv,cwd:root,started,finished:new Date().toISOString(),exit_code:r.status,signal:r.signal,error:r.error?String(r.error):null});
 if(r.status!==0)throw new Error('CLI failed '+prefix+' exit='+r.status+' '+r.stderr?.toString());
 if(args.includes('--help'))return r.stdout.toString();
 return JSON.parse(r.stdout.toString());
}
if(process.argv[2]==='init'){
 if(fs.existsSync(stage+'/before/manifest.json'))throw new Error('Snapshot exists');
 const files=walk(project);const entries=[];
 for(const f of files){const rel=path.relative(project,f).replaceAll('\\','/');const b=fs.readFileSync(f);write(stage+'/before/work/'+rel,b);entries.push({path:rel,sha256:hash(b),bytes:b.length});}
 const history=walk(root+'/acceptance/20261016-expanded').filter(f=>!f.replaceAll('\\','/').startsWith(stage+'/')&&!f.replaceAll('\\','/').startsWith(project+'/'));
 for(const f of history){const rel=path.relative(root+'/acceptance/20261016-expanded',f).replaceAll('\\','/');const dest=stage+'/before/history/'+rel;fs.mkdirSync(path.dirname(dest),{recursive:true});fs.copyFileSync(f,dest);}
 write(stage+'/before/manifest.json',{created:new Date().toISOString(),project,files:entries,history_files:history.length});
 write(stage+'/logs/initial-tool-error.json',{kind:'orchestration-error',code:'tools.mcp__fastctx__read is not a function',argv:null,exit_code:null,note:'初次组合调用在构造 Promise 数组时失败；非 CLI 失败。初次 git status 和 status 另行持久化复跑。'});
 console.log(JSON.stringify(run(['status','--project',project,'--view','full'],'initial-status'),(k,v)=>k==='snapshot'?undefined:v,2));
}
