import fs from 'node:fs';import path from 'node:path';import {U,W,write,json,hash,run} from './final-b-run.mjs';
const s=json(path.join(U,'final-b-revision-session.json'));const B=s.workspace;
function call(label,args,project=W){const log=console.log;console.log=()=>{};let result;try{result=JSON.parse(run(label,args,project));}finally{console.log=log;}return result;}
const list=call('31-resume-main-list',['revision','list']);
const status=call('32-resume-branch-status',['status'],B);
const doctor=call('33-resume-branch-doctor',['doctor'],B);
const identify=call('34-resume-branch-identify',['tool','identify'],B);
const baseline=json(path.join(U,'final-b-main-revision-baseline.json'));const main=json(path.join(W,'.writer/state.json'));const branch=json(path.join(B,'.writer/state.json'));
const units=baseline.units.map(u=>({...u,main_actual:hash(path.join(W,u.draft)),branch_actual:hash(path.join(B,u.draft))}));
const reports=branch.units.flatMap(u=>['draft_review','replay_review'].filter(k=>u[k]).map(k=>({unit:u.unit,kind:k,path:u[k].report,expected_sha256:u[k].report_sha256,actual_sha256:hash(path.join(B,u[k].report)),frozen_ref:u[k].frozen_ref,frozen_actual_sha256:hash(path.join(B,u[k].frozen_ref))})));
const stateMatch=hash(path.join(W,'.writer/state.json'))===baseline.state_sha256;
const branchState=hash(path.join(B,'.writer/state.json'));
const oldAudit=json(path.join(U,'final-b-stop-audit-v2.json'));
const inspection={main_revision:main.revision,branch_revision:branch.revision,main_state_sha256:hash(path.join(W,'.writer/state.json')),branch_state_sha256:branchState,state_matches_baseline:stateMatch,branch_matches_stop:branchState===oldAudit.branch_state_sha256,units,reports,list,status:{next_unit:status.next_unit,stale_units:status.stale_units,changed_sources:status.changed_sources},doctor,identify:{ok:identify.ok,content_id:identify.observed_content_id,runtime_id:identify.runtime_id,revision_context:identify.revision_context,missing:identify.missing,mismatches:identify.mismatches}};
write(path.join(U,'final-b-resume-inspection.json'),inspection);
if(!stateMatch||branchState!==oldAudit.branch_state_sha256||units.some(u=>u.main_actual!==u.sha256)||reports.some(r=>r.actual_sha256!==r.expected_sha256||r.frozen_actual_sha256!==r.expected_sha256)||list.sessions.length!==1||list.sessions[0].id!==s.id||list.transactions.length||!doctor.ok||!identify.ok||identify.observed_content_id!=='ff6cde0f1be3459f7d8a4249e3dd8ee3eec39d468df48f9c2f11308e5bd6641b'||status.next_unit!==3)throw Error('Resume inspection blocked; preserve and inspect');
console.log(JSON.stringify({main_revision:main.revision,branch_revision:branch.revision,next_unit:status.next_unit,main_unchanged:stateMatch,branch_unchanged:true,reports:reports.length,doctor_ok:doctor.ok,identify:inspection.identify,list},null,2));
