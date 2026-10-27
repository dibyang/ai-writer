import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import assert from 'node:assert/strict';import {fileURLToPath} from 'node:url';
const here=path.dirname(fileURLToPath(import.meta.url)),j=p=>JSON.parse(fs.readFileSync(p)),sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const root=j(path.join(here,'project.json')).project,before=j(path.join(here,'checkpoint-e-entry-state.json')),currentBytes=fs.readFileSync(path.join(root,'.writer/state.json')),state=JSON.parse(currentBytes),active=j(path.join(here,'active-tool.json'));
assert.equal(before.units.length,48);assert.equal(state.units.length,48);assert.equal(state.tool_control.generation,active.generation);
const prefix=[];for(let n=1;n<=34;n++){const a=before.units[n-1],b=state.units[n-1];assert.deepEqual(b,a,`unaffected prefix unit ${n}`);assert.equal(sha(fs.readFileSync(path.join(root,b.draft))),a.sha256);prefix.push(n);}
const observations=[];for(const [id,a] of Object.entries(before.snapshot.ledger))if(a.type==='observation'){
 const b=state.snapshot.ledger[id];assert(b,id);for(const key of ['type','statement','author_truth'])assert.deepEqual(b[key],a[key],`${id}.${key}`);observations.push(id);
}
assert(observations.includes('O_BOX_PAINT'));
const issueView=j(path.join(here,'cli-logs/root-final-issues/stdout.txt')),issueProof=[];
for(const [id,old]of Object.entries(before.review_workflow.issues))if(old.application&&old.status==='verified'){
 const now=state.review_workflow.issues[id],effective=issueView.issues.find(x=>x.id===id);assert(now&&effective,id);assert.deepEqual(now.application,old.application,`${id} original application`);assert.deepEqual(now.origin,old.origin,`${id} original evidence origin`);assert.equal(effective.effective_status,'verified',id);assert.notEqual(now.verification?.review_ref,old.verification?.review_ref,`${id} current re-verification report`);issueProof.push({id,original_commit_id:old.application.commit_id,current_verification_report:now.verification.review_ref,original_application_unchanged:true});
}
assert.equal(issueProof.length,6);
const changedRequired=[35,36,40,41,44,45,47],selected=[];
for(const n of changedRequired){const a=before.units[n-1],b=state.units[n-1];assert.notEqual(b.sha256,a.sha256,`controlled actual change ${n}`);selected.push({unit:n,before_sha256:a.sha256,after_sha256:b.sha256,draft:b.draft});}
const units=[];for(const u of state.units){const bytes=fs.readFileSync(path.join(root,u.draft));assert.equal(sha(bytes),u.sha256);const text=bytes.toString('utf8'),body=text.replace(/^# .*(?:\r?\n|$)/,'');const han=(body.match(/\p{Script=Han}/gu)||[]).length;if(u.unit>=37)assert(han>=([40,44,48].includes(u.unit)?14000:10000),`length ${u.unit}: ${han}`);units.push({unit:u.unit,draft:u.draft,sha256:u.sha256,han});}
const result={ok:true,at:new Date().toISOString(),project:root,revision:state.revision,state_sha256:sha(currentBytes),generation:state.tool_control.generation,prefix_1_through_34_units_and_body_bytes_unchanged:prefix,immutable_observations:observations,original_review_applications:issueProof,controlled_actual_changed_units:selected,units,total_han:units.reduce((n,u)=>n+u.han,0),new_37_through_48_han:units.filter(u=>u.unit>=37).reduce((n,u)=>n+u.han,0),limit:'Mechanical integrity and scope proof only. Actual current text, causality, knowledge, source impact and review-issue conclusions require the native E/F reading records; this script does not judge literary quality or human acceptance.'};
fs.writeFileSync(path.join(here,'final-continuity-integrity.json'),JSON.stringify(result,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify({ok:true,revision:state.revision,units:units.length,total_han:result.total_han,new_han:result.new_37_through_48_han,prefix:prefix.length,observations}));
