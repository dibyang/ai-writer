import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';
export const base='D:/work/other/ai-writer/acceptance/20261018-governance-b';
export const project=base+'/works/铜桥来信';
export const sha=x=>crypto.createHash('sha256').update(x).digest('hex');
export const hash=f=>sha(fs.readFileSync(f));
export const read=f=>JSON.parse(fs.readFileSync(f,'utf8'));
export function put(f,x){fs.mkdirSync(path.dirname(f),{recursive:true});fs.writeFileSync(f,typeof x==='string'||Buffer.isBuffer(x)?x:JSON.stringify(x,null,2)+'\n',{flag:'wx',encoding:'utf8'});return f;}
export const input=(name,x)=>put(base+'/native-one-inputs/'+name+'.json',x);
export const rev=(p=project)=>read(p+'/.writer/state.json').revision;
export function cli(label,args,{p=project,allow=false,brief=false}={}){
 const a=[base+'/capture.mjs','native-one-'+label,'node','bin/ai-writer.mjs',...args];
 if(p)a.push('--project',p);
 const r=spawnSync(process.execPath,a,{encoding:'utf8',windowsHide:true,maxBuffer:16*1024*1024});
 process.stdout.write(r.stdout||'');process.stderr.write(r.stderr||'');
 const dir=base+'/commands/native-one-'+label;
 const stdout=fs.readFileSync(dir+'/stdout.raw.txt','utf8'),stderr=fs.readFileSync(dir+'/stderr.raw.txt','utf8');
 let data;try{data=JSON.parse(stdout)}catch{try{data=JSON.parse(stderr)}catch{data={stdout,stderr}}}
 console.log(JSON.stringify({label,result:brief?{keys:Object.keys(data),ok:data.ok,revision:data.revision}:data}));
 if(r.status!==0&&!allow)throw Error('CLI failed '+label+' exit '+r.status);
 return data;
}
export function evidence(quote){return {quote,local_source:'研究/测试授权原话.md',source_sha256:hash(project+'/研究/测试授权原话.md'),locator:'本独立验证用户指令；合成测试授权，无外部作者消息ID',recorded_by:'独立 Codex CLI 验证会话 native-one'};}
