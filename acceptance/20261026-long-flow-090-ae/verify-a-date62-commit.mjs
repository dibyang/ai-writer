import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const A=path.dirname(fileURLToPath(import.meta.url)),j=p=>JSON.parse(fs.readFileSync(p));
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const P=j(path.join(A,'project.json')).project;
const before=j(path.join(A,'cli-logs/a-resume-63-record/after-state.json'));
const bytes=fs.readFileSync(path.join(P,'.writer/state.json')),state=JSON.parse(bytes);
assert.equal(before.units.length,63);assert.equal(state.units.length,63);
const commit=j(path.join(A,'cli-logs/a-date62-commit/stdout.txt'));
const transaction=j(path.join(P,'.writer/transactions',commit.transaction_id,'transaction.json'));
assert.equal(transaction.status,'completed');
const changes=[];
for(const old of before.units){
 const current=state.units.find(u=>u.unit===old.unit),backup=transaction.plan.find(p=>p.file===old.draft&&p.before===old.sha256&&p.old_ref);
 const oldBytes=fs.readFileSync(path.join(P,backup?.old_ref??old.draft)),newBytes=fs.readFileSync(path.join(P,current.draft));
 assert.equal(sha(oldBytes),old.sha256);assert.equal(sha(newBytes),current.sha256);
 if(old.sha256!==current.sha256)changes.push(old.unit);
 if(old.unit===62){const text=oldBytes.toString('utf8');assert.equal(text.split('前天给朋友指').length,2);assert.equal(newBytes.toString('utf8'),text.replace('前天给朋友指','前几天给朋友指'));}
}
assert.deepEqual(changes,[62]);
assert.equal(j(path.join(A,'cli-logs/a-date62-commit/result.json')).exit_code,0);
assert.equal(commit.ok,true);assert.equal(commit.status,'completed');assert.equal(commit.revision,360);assert.equal(commit.backups_preserved,true);
const tail=j(path.join(A,'reading-after-a-date62-tail-verification.json'));
assert.equal(tail.pages,27);assert.equal(tail.from,62);assert.equal(tail.to,63);
for(const f of tail.files)assert.equal(state.units.find(u=>u.unit===f.unit).sha256,f.sha256);
const checks=[];
for(const name of ['status','check','doctor','source-list','revision-list','review-issues-list']){
 const label='a-complete-'+name,log=j(path.join(A,'cli-logs',label,'result.json'));
 assert.equal(log.exit_code,0,label);assert.equal(log.before_state_sha256,sha(bytes),label);assert.equal(log.after_state_sha256,sha(bytes),label);
 checks.push({label,exit_code:log.exit_code,stdout_sha256:sha(fs.readFileSync(path.join(A,'cli-logs',label,'stdout.txt'))),stderr_sha256:sha(fs.readFileSync(path.join(A,'cli-logs',label,'stderr.txt')))});
}
assert.equal(sha(fs.readFileSync(path.join(P,'.writer/state.json'))),sha(bytes));
const out={ok:true,at:new Date().toISOString(),units:63,revision:state.revision,state_sha256:sha(bytes),body_changed_units:changes,body_change:'One occurrence: 前天给朋友指 -> 前几天给朋友指',other_62_bytes_unchanged:true,other_62_to_63_source_metadata:'Replayed through official revision; unchanged63 body is allowed to carry updated source dependencies',commit,tail_proof:'reading-after-a-date62-tail-verification.json',checks,scope:'Mechanical exact edit, official successful commit, matching post-replay current-body returns and read-only final commands. No human or literary certification.'};
fs.writeFileSync(path.join(A,'a-date62-root-commit-verification.json'),JSON.stringify(out,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({ok:true,revision:state.revision,changed_bodies:changes,tail_pages:27,read_only_checks:checks.length}));
