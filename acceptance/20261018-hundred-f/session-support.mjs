import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
export const BASE=path.dirname(fileURLToPath(import.meta.url));
export const ROOT=path.resolve(BASE,'../..');
export const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
export const readJSON=f=>JSON.parse(fs.readFileSync(f));
export function session(phase,{project=path.join(BASE,'work'),token=null}={}){
 assert.ok(/^[a-z][a-z0-9-]*$/.test(phase));const stage=path.join(BASE,phase);fs.mkdirSync(stage,{recursive:true});
 const work=fs.realpathSync(path.join(BASE,'work')),actual=fs.realpathSync(project);assert.ok(actual===work||actual.startsWith(work+path.sep),'Project must stay in this F work or its revision workspace');
 const prefix=phase==='read-c'?'f-c':phase==='read-d'?'f-d':'f-'+phase;
 const commandRoot=path.join(BASE,'commands');fs.mkdirSync(commandRoot,{recursive:true});let sequence=fs.readdirSync(commandRoot).filter(n=>n.startsWith(prefix+'-')).length;
 function write(ref,value){assert.ok(typeof ref==='string'&&!path.isAbsolute(ref)&&ref.split(/[\\/]/).every(x=>x&&x!=='.'&&x!=='..'));const file=path.join(stage,ref);fs.mkdirSync(path.dirname(file),{recursive:true});const bytes=Buffer.isBuffer(value)||typeof value==='string'?value:JSON.stringify(value,null,2)+'\n';fs.writeFileSync(file,bytes,{flag:'wx'});return file;}
 function run(label,args,{input,expected=0,env={},entry='main'}={}){
   assert.ok(/^[a-z][a-z0-9-]*$/.test(label));assert.ok(Array.isArray(args)&&args.every(x=>typeof x==='string'));assert.ok(!args.includes('--project')&&!args.includes('--input'),'Project and input are supplied by this recorder');
   const name=prefix+'-'+String(++sequence).padStart(4,'0')+'-'+label;assert.ok(!fs.existsSync(path.join(commandRoot,name)));
   const argv=[...args,'--project',actual];if(input!==undefined)argv.push('--input',write('inputs/'+name+'.json',input));if(token&&!argv.includes('--revision-token'))argv.push('--revision-token',token);
   const cli=entry==='main'?path.join(ROOT,'bin/ai-writer.mjs'):entry==='embedded'?path.join(actual,'.writer/tool/bin/ai-writer.mjs'):null;assert.ok(cli,'Entry must be main or embedded');
   const r=spawnSync(process.execPath,[path.join(BASE,'capture.mjs'),name,process.execPath,cli,...argv],{cwd:ROOT,encoding:'utf8',windowsHide:true,timeout:180000,maxBuffer:8*1024*1024,env:{...process.env,...env}});
   const dir=path.join(commandRoot,name),meta=readJSON(path.join(dir,'result.json')),stdout=fs.readFileSync(path.join(dir,'stdout.raw.txt'),'utf8'),stderr=fs.readFileSync(path.join(dir,'stderr.raw.txt'),'utf8');let value=null;try{value=JSON.parse(stdout.trim()||stderr.trim());}catch{}
   assert.equal(meta.exit_code,expected,JSON.stringify({name,expected,actual:meta.exit_code,code:value?.code,error:r.error?.message,stderr:stderr.slice(0,800)}));return {label:name,value,meta,dir};
 }
 return {phase,stage,project:actual,write,run,state:()=>readJSON(path.join(actual,'.writer/state.json')),evidence:()=>{const local_source='研究/F轮用户授权与执行范围.md',bytes=fs.readFileSync(path.join(actual,local_source)),quote='继续通过 Codex 做百章规模的长篇实跑验证，重点覆盖工具更新后的多轮跨会话恢复、跨卷伏笔回收和多处旧章修改后的连续性，发现问题直接修复，保留完整验证记录，暂不修改现有作品。';assert.ok(bytes.toString('utf8').includes(quote));return {local_source,source_sha256:sha(bytes),quote,locator:'用户原话段，F轮隔离验证范围',recorded_by:'actual-Codex-'+phase};}};
}
