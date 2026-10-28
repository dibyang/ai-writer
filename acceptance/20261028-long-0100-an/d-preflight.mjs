import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const root=path.dirname(fileURLToPath(import.meta.url)), dir=path.join(root,'session-d');
fs.mkdirSync(dir,{recursive:true});
const read=r=>JSON.parse(fs.readFileSync(path.join(root,r))), sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const put=(r,v)=>fs.writeFileSync(path.join(dir,r),JSON.stringify(v,null,2)+'\n',{flag:'wx'});
const c=read('session-c/checkpoint.json'), recovery=read('session-b/owner-recovery.json'), ca=read('session-c-final-audit.json');
assert.equal(c.id,recovery.id);assert.equal(c.workspace,recovery.workspace);
const files=[['main-state','work/.writer/state.json',c.main_state_sha256],['candidate-state',path.relative(root,path.join(c.workspace,'.writer/state.json')),c.candidate_state_sha256],['base',path.relative(root,path.join(path.dirname(c.workspace),'base.json')),c.base_sha256],['base-state',path.relative(root,path.join(path.dirname(c.workspace),'base-state.json')),c.base_state_sha256],['session',path.relative(root,path.join(path.dirname(c.workspace),'session.json')),c.session_sha256]];
const observations=files.map(([name,file,expected])=>{const b=fs.readFileSync(path.join(root,file));assert.equal(sha(b),expected,name);fs.writeFileSync(path.join(dir,'initial-'+name+'.json'),b,{flag:'wx'});return {name,file,sha256:sha(b)};});
for(const d of ca.drafts){assert.equal(sha(fs.readFileSync(path.join(root,'work',d.draft))),d.main_sha256);assert.equal(sha(fs.readFileSync(path.join(c.workspace,d.draft))),d.candidate_sha256);}
const audits={};
for(const s of ['b','c']){
 const audit=read('session-'+s+'-final-audit.json');
 const captures=fs.readdirSync(path.join(root,'commands')).filter(x=>x.startsWith(s+'-')).map(label=>{
  const base=path.join(root,'commands',label), result=path.join(base,'result.json');
  if(!fs.existsSync(result))return {label,incomplete:true,files:fs.readdirSync(base)};
  const meta=JSON.parse(fs.readFileSync(result)), hashes={};
  for(const f of fs.readdirSync(base))hashes[f]=sha(fs.readFileSync(path.join(base,f)));
  assert.equal(hashes['before-state.json'],meta.before_state_sha256);assert.equal(hashes['after-state.json'],meta.after_state_sha256);
  if(meta.input)assert.equal(hashes['input.raw.json'],meta.input.sha256);
  const stdout=fs.readFileSync(path.join(base,'stdout.raw.txt'),'utf8'),stderr=fs.readFileSync(path.join(base,'stderr.raw.txt'),'utf8');
  let data;try{data=JSON.parse(stdout)}catch{data={raw_text:stdout}};
  return {label,meta,hashes,stdout:data,stderr};
 });
 put(s+'-all-captures.json',captures);
 const bytes=fs.readFileSync(path.join(root,'session-'+s+'.jsonl')), lines=bytes.toString('utf8').trimEnd().split(/\r?\n/), events=[],invalid=[];
 lines.forEach((line,i)=>{try{const event=JSON.parse(line);events.push({line:i+1,event});}catch(e){invalid.push({line:i+1,error:e.message,bytes:Buffer.byteLength(line)});}});
 put(s+'-all-events.json',{sha256:sha(bytes),line_count:lines.length,invalid,events});
 const index=events.map(({line,event:e})=>({line,type:e.type,item_type:e.item?.type,id:e.item?.id,exit:e.item?.exit_code,command:e.item?.command,text:e.item?.type==='agent_message'?e.item.text:undefined}));
 put(s+'-event-index.json',index);
 audits[s]={audit_sha256:sha(fs.readFileSync(path.join(root,'session-'+s+'-final-audit.json'))),audit_summary:Object.fromEntries(Object.entries(audit).filter(([k])=>!['drafts','commands','checkpoint'].includes(k))),captures:captures.map(x=>({label:x.label,exit:x.meta?.exit_code,incomplete:x.incomplete,stderr_bytes:x.stderr===undefined?null:Buffer.byteLength(x.stderr)})),log:{sha256:sha(bytes),line_count:lines.length,valid:events.length,invalid,thread:events[0]?.event},event_index:index};
}
put('preflight.json',{at:new Date().toISOString(),thread:process.env.CODEX_THREAD_ID??null,id:c.id,observations,drafts_verified:ca.drafts.length,audits});
console.log(JSON.stringify({observations,drafts_verified:ca.drafts.length,thread:process.env.CODEX_THREAD_ID??null,audits},null,2));
