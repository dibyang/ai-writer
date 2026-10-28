import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const root=path.dirname(fileURLToPath(import.meta.url));
const read=r=>JSON.parse(fs.readFileSync(path.join(root,r)));
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const recovery=read('session-b/owner-recovery.json'), audit=read('session-b-final-audit.json');
const dir=path.join(root,'session-c');fs.mkdirSync(dir,{recursive:true});
const put=(name,data)=>fs.writeFileSync(path.join(dir,name),JSON.stringify(data,null,2)+'\n',{flag:'wx'});
const observations=[];
for(const [name,file,expected] of [
 ['main-state','work/.writer/state.json',audit.checkpoint.main_state_sha256],
 ['candidate-state',path.relative(root,path.join(recovery.workspace,'.writer/state.json')),audit.checkpoint.candidate_state_sha256],
 ['base',path.relative(root,path.join(path.dirname(recovery.workspace),'base.json')),audit.checkpoint.base_sha256],
 ['base-state',path.relative(root,path.join(path.dirname(recovery.workspace),'base-state.json')),audit.checkpoint.base_state_sha256],
 ['session',path.relative(root,path.join(path.dirname(recovery.workspace),'session.json')),audit.checkpoint.session_sha256]]) {
 const bytes=fs.readFileSync(path.join(root,file));assert.equal(sha(bytes),expected,name);
 fs.writeFileSync(path.join(dir,'initial-'+name+'.json'),bytes,{flag:'wx'});
 observations.push({name,file,sha256:sha(bytes)});
}
for(const d of audit.drafts){assert.equal(sha(fs.readFileSync(path.join(root,'work',d.draft))),d.main_sha256);assert.equal(sha(fs.readFileSync(path.join(recovery.workspace,d.draft))),d.candidate_sha256);}
const bbytes=fs.readFileSync(path.join(root,'session-b.jsonl')),lines=bbytes.toString('utf8').trimEnd().split(/\r?\n/);
const valid=[],invalid=[];for(let i=0;i<lines.length;i++){try{const j=JSON.parse(lines[i]);valid.push({line:i+1,event:j});}catch(e){invalid.push({line:i+1,bytes:Buffer.byteLength(lines[i]),error:e.message});}}
put('b-last-events.json',{source_sha256:sha(bbytes),line_count:lines.length,invalid_lines:invalid,last_valid_events:valid.slice(-6),report_exists:fs.existsSync(path.join(root,'session-b-report.md'))});
const main=read('work/.writer/state.json'),candidate=JSON.parse(fs.readFileSync(path.join(recovery.workspace,'.writer/state.json'))),session=JSON.parse(fs.readFileSync(path.join(path.dirname(recovery.workspace),'session.json')));
put('preflight.json',{at:new Date().toISOString(),thread:process.env.CODEX_THREAD_ID??null,observations,drafts_verified:audit.drafts.length,b_jsonl:{line_count:lines.length,invalid_lines:invalid,last_valid:valid.slice(-3).map(x=>({line:x.line,type:x.event.type,item_type:x.event.item?.type,item_id:x.event.item?.id,text:x.event.item?.text??null}))},native:{main:{revision:main.revision,units:main.units.length},candidate:{revision:candidate.revision,units:candidate.units.length,governance:candidate.governance},session}});
console.log(JSON.stringify({observations,drafts_verified:audit.drafts.length,b_jsonl:{line_count:lines.length,invalid_lines:invalid,last_valid:valid.slice(-3).map(x=>({line:x.line,type:x.event.type,item_type:x.event.item?.type,item_id:x.event.item?.id,text:x.event.item?.text??null}))},main_keys:Object.keys(main),candidate:{revision:candidate.revision,units:candidate.units.length,governance:candidate.governance},session}));
