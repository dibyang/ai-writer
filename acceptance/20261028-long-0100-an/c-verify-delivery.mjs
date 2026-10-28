import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const root=path.dirname(fileURLToPath(import.meta.url));
const read=r=>JSON.parse(fs.readFileSync(path.join(root,r)));
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const c=read('session-c/checkpoint.json'),audit=read('session-c-final-audit.json');
assert.deepEqual(c,audit.checkpoint);
for(const [file,expected] of [[path.join(c.parent,'.writer/state.json'),c.main_state_sha256],[path.join(c.workspace,'.writer/state.json'),c.candidate_state_sha256],[path.join(path.dirname(c.workspace),'base.json'),c.base_sha256],[path.join(path.dirname(c.workspace),'base-state.json'),c.base_state_sha256],[path.join(path.dirname(c.workspace),'session.json'),c.session_sha256]])assert.equal(sha(fs.readFileSync(file)),expected);
assert.equal(sha(fs.readFileSync(path.join(root,'session-b.jsonl'))),read('session-c/b-last-events.json').source_sha256);
assert.equal(fs.existsSync(path.join(root,'session-b-report.md')),false);
const report=fs.readFileSync(path.join(root,'session-c-report.md'),'utf8');assert(report.includes(c.candidate_state_sha256)&&report.includes('next120'));
const first=fs.readFileSync(path.join(root,'session-c.jsonl'),'utf8').split(/\r?\n/)[0];assert.equal(JSON.parse(first).thread_id,c.thread);
const files=[];function walk(dir){for(const e of fs.readdirSync(path.join(root,dir),{withFileTypes:true})){const ref=dir+'/'+e.name;if(e.isDirectory())walk(ref);else{const b=fs.readFileSync(path.join(root,ref));files.push({ref,bytes:b.length,sha256:sha(b)});}}}
walk('session-c');
for(const ref of fs.readdirSync(root).filter(x=>/^c-.*\.mjs$/.test(x)||['session-c-report.md','session-c-final-audit.json'].includes(x))){const b=fs.readFileSync(path.join(root,ref));files.push({ref,bytes:b.length,sha256:sha(b)});}
for(const x of audit.commands){for(const f of ['result.json','stdout.raw.txt','stderr.raw.txt','before-state.json','after-state.json']){const ref='commands/'+x.label+'/'+f,b=fs.readFileSync(path.join(root,ref));files.push({ref,bytes:b.length,sha256:sha(b)});}if(x.input_sha256){const ref='commands/'+x.label+'/input.raw.json',b=fs.readFileSync(path.join(root,ref));assert.equal(sha(b),x.input_sha256);files.push({ref,bytes:b.length,sha256:sha(b)});}}
for(const ref of [path.relative(root,path.join(c.workspace,'.writer/drafts/AN-c-replay-0119-raw.json')),path.relative(root,path.join(c.workspace,audit.report.ref))]){const b=fs.readFileSync(path.join(root,ref));files.push({ref,bytes:b.length,sha256:sha(b)});}
const result={at:new Date().toISOString(),status:'handoff-records-verified-not-literary-acceptance',id:c.id,next_replay_unit:120,main_base_candidate_session_match_checkpoint:true,b_log_unchanged:true,b_report_absent:true,c_log_exists_and_first_thread_matches:true,active_logs_not_sealed:['session-c.jsonl','session-c.stderr.txt'],product_command_count:audit.commands.length,product_failures:0,capture_prelaunch_failures:1,auxiliary_failures:'session-c/auxiliary-failures.md',frozen_review_errata:'session-c/119-review-errata.md',file_count:files.length,files};
fs.writeFileSync(path.join(root,'session-c/delivery-verification.json'),JSON.stringify(result,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({status:result.status,next_replay_unit:120,file_count:files.length,report_sha256:sha(Buffer.from(report)),b_log_unchanged:true,main_base_candidate_session_match_checkpoint:true}));
