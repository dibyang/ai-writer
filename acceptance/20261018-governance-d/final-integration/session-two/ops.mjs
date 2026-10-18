import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';
export const root='D:/work/other/ai-writer';
export const base=root+'/acceptance/20261018-governance-d';
export const dir=base+'/final-integration/session-two';
export const work=base+'/final-integration/work';
export const bundled=work+'/.writer/tool/bin/ai-writer.mjs';
export const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
export const hash=f=>fs.existsSync(f)?sha(fs.readFileSync(f)):null;
export const read=f=>JSON.parse(fs.readFileSync(f,'utf8'));
export function save(f,v){fs.mkdirSync(path.dirname(f),{recursive:true});fs.writeFileSync(f,typeof v==='string'?v:JSON.stringify(v,null,2)+'\n',{flag:'wx'});return f;}
export const state=(p=work)=>read(p+'/.writer/state.json');
export function run(label,args,{entry=bundled,project=work,expected=0}={}){
 const r=spawnSync(process.execPath,[base+'/capture.mjs','native-d-two-'+label,process.execPath,entry,...args,'--project',project],{cwd:root,windowsHide:true,encoding:'utf8',timeout:55000,maxBuffer:8*1024*1024});
 const p=base+'/commands/native-d-two-'+label;
 const m=read(p+'/result.json');
 console.log(JSON.stringify({label,exit:m.exit_code,state_changed:m.before_state_sha256!==m.after_state_sha256,elapsed_ms:m.elapsed_ms}));
 let output;try{output=read(p+'/stdout.raw.txt');}catch{output=fs.readFileSync(p+'/stdout.raw.txt','utf8');}
 if(m.exit_code!==expected){console.log(fs.readFileSync(p+'/stderr.raw.txt','utf8'));throw Error('Unexpected CLI exit '+label);}
 return output;
}
export function input(name,v){return save(dir+'/'+name+'.json',v);}
export function evidence(ref,quote){return {quote,local_source:ref,source_sha256:hash(work+'/'+ref),locator:ref+':5; synthetic acceptance original quote, no message ID',recorded_by:'native-d-two Codex; synthetic acceptance recorder'};}
export function snapshot(name){const s=state();save(dir+'/'+name+'-state.json',fs.readFileSync(work+'/.writer/state.json','utf8'));const out={schema:s.schema_version,revision:s.revision,tool:s.tool,snapshot_sha256:sha(JSON.stringify(s.snapshot)),units_sha256:sha(JSON.stringify(s.units)),bodies:Object.fromEntries(fs.readdirSync(work+'/正文').map(n=>['正文/'+n,hash(work+'/正文/'+n)])),customizations:Object.fromEntries(['AGENTS.md','docs/quickstart.md','.agents/skills/writer-project/SKILL.md'].map(r=>[r,hash(work+'/'+r)]))};save(dir+'/'+name+'-invariants.json',out);return out;}
