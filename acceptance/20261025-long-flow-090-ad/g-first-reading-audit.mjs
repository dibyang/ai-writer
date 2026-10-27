import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const A=path.dirname(fileURLToPath(import.meta.url));
const P=JSON.parse(fs.readFileSync(path.join(A,'project.json'))).project;
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const read=f=>JSON.parse(fs.readFileSync(path.join(A,f)));
const expected='e32b720575c7697c507bbc9e069700aac4e1263c829c8421272cf20a6011a4c2';
const stateBytes=fs.readFileSync(path.join(P,'.writer/state.json')),state=JSON.parse(stateBytes);
assert.equal(sha(stateBytes),expected);assert.equal(state.revision,339);assert.equal(state.units.length,60);assert.equal(state.tool_control.generation,8);
const entry=read('cli-logs/g-entry-status/before-state.json');assert.deepEqual(state,entry);
const launch=read('native/g-first/launch.json');
const nativeEvents=fs.readFileSync(path.join(A,'native/g-first/events.public.jsonl'),'utf8').split('\n').filter(Boolean).map(x=>{try{return JSON.parse(x);}catch{return null;}});
const thread=nativeEvents.find(e=>e?.type==='thread.started');assert(thread?.thread_id);
const manifest=read('g-first-current-manifest.json');
const chapters=[];let lastEnd=0;
for(const meta of manifest.units){
  const u=state.units.find(u=>u.unit===meta.unit);assert.equal(u.draft,meta.draft);assert.equal(u.sha256,meta.sha256);
  const bytes=fs.readFileSync(path.join(P,u.draft)),body=bytes.toString('utf8');assert.equal(sha(bytes),u.sha256);
  const pages=[];let first=Infinity,last=0;
  for(let n=1;n<=Math.ceil(body.length/1800);n++){
    const label=`g-u${String(u.unit).padStart(2,'0')}-p${n}`,rel=`read-pages/${label}.json`,r=read(rel),mtime=fs.statSync(path.join(A,rel)).mtimeMs;
    assert.equal(r.page,n);assert.equal(r.pages,meta.pages);assert.equal(r.total_chars,body.length);assert.equal(r.sha256,u.sha256);assert.equal(r.text,body.slice((n-1)*1800,n*1800));
    const {output_sha256,...result}=r;assert.equal(sha(JSON.stringify(result,null,2)+'\n'),output_sha256);
    pages.push({label,page:n,from:r.from,to:r.to,output_sha256,evidence:rel,evidence_sha256:sha(fs.readFileSync(path.join(A,rel)))});
    first=Math.min(first,mtime);last=Math.max(last,mtime);
  }
  assert(first>=lastEnd,`Chapter overlap ${u.unit}`);lastEnd=last;
  const note=`g-first-notes/${String(u.unit).padStart(2,'0')}.md`;assert(fs.statSync(path.join(A,note)).size>0);
  chapters.push({...meta,complete:true,pages,notes:note,notes_sha256:sha(fs.readFileSync(path.join(A,note)))});
}
const kinds=['status','check','doctor','sources','revisions','issues'];
const commands=kinds.map(kind=>{const label=`g-first-final-${kind}`,r=read(`cli-logs/${label}/result.json`);assert.equal(r.exit_code,0);assert.equal(r.before_state_sha256,expected);assert.equal(r.after_state_sha256,expected);return {label,result:r,stdout_sha256:sha(fs.readFileSync(path.join(A,`cli-logs/${label}/stdout.txt`))),stderr_sha256:sha(fs.readFileSync(path.join(A,`cli-logs/${label}/stderr.txt`)))};});
const status=read('cli-logs/g-first-final-status/stdout.txt'),check=read('cli-logs/g-first-final-check/stdout.txt'),doctor=read('cli-logs/g-first-final-doctor/stdout.txt'),sources=read('cli-logs/g-first-final-sources/stdout.txt'),revisions=read('cli-logs/g-first-final-revisions/stdout.txt'),issues=read('cli-logs/g-first-final-issues/stdout.txt');
assert.equal(doctor.build.observed_content_id,'91a5eb61844e85102cd61fede4ddba142191a879e1722e92e42db323cf09612c');assert.equal(doctor.build.runtime_id,'819a50b3d460176db6d36a05e1cb2f161a34ac61ee2a5705bb81bc9d032ae652');
assert.deepEqual(status.changed_sources,[]);assert.deepEqual(status.impact_pending,[]);assert.deepEqual(status.stale_units,[]);assert(!revisions.sessions.some(x=>x.status!=='committed'));assert(!revisions.transactions.some(x=>x.status!=='completed'));assert.equal(sources.impact_pending.length,0);
assert.equal(Object.keys(sources.versions).length,32);assert.equal(sources.ranges.length,31);
const issueSummary=issues.issues.map(x=>({id:x.id,type:x.type,status:x.status,effective_status:x.effective_status,evidence_units:x.evidence.map(e=>e.unit),application_commit:x.application?.commit_id??null}));
assert.equal(issueSummary.find(x=>x.id==='I_AD_F21_DISTANCE').status,'adopted');assert.equal(issueSummary.find(x=>x.id==='I_AD_F49_BOOK_RECALL').status,'retained');assert.equal(issueSummary.filter(x=>x.type==='optional_style').length,13);
const originalIssues=read('cli-logs/g-entry-issues/stdout.txt');assert.deepEqual(issues,originalIssues);
const boundUnits=state.units.filter(u=>Object.keys(u.source_bindings??{}).length>0).length;
const result={at:new Date().toISOString(),native_thread_id:thread.thread_id,launch_started_at:launch.started_at,elapsed_ms:Date.now()-Date.parse(launch.started_at),native_exit_and_same_id_resume:'Pending root observation after this native run exits; not claimed completed here',project:P,main_revision:339,state_sha256:expected,registered_units:60,generation:8,content_id:doctor.build.observed_content_id,runtime_id:doctor.build.runtime_id,read_scope:{from:1,through:30,complete_chapters:30,pages:chapters.reduce((n,u)=>n+u.pages.length,0),utf16_chars:chapters.reduce((n,u)=>n+u.chars,0),page_size:1800,max_pages_per_batch:2,serial_chapter_mtime_check:true,model_full_returns_checked:true,body_truncation_batches:[],unread:[31,60]},restoration:read('reading-resume-g-entry-native-verification.json'),invariants:{whole_state_byte_unchanged:true,all_60_unit_and_body_records_unchanged:true,baseline_snapshot_sources_ranges_bindings_issues_commits_unchanged:true,source_versions:32,source_ranges:31,bound_units:boundUnits,no_active_revision:true,no_pending_transaction:true,no_pending_source_impact:true,legacy_editing_entry:sources.pending_edits,unregistered_drafts_preserved:status.draft_inventory.unregistered.length},final_mechanical:{check_ok:check.ok,scope:check.scope,literary_quality:check.literary_quality,doctor_ok:doctor.ok,doctor_warnings:doctor.warnings,rolling_review:check.rolling_review},issues:issueSummary,chapters,commands,semantic_limits:'Informed model self-reading, not human/blind/market/author finalization. No main review registration, revision, apply, verify, export or workflow change. Current chapter30 actually includes a complete further formal course; earlier handoff locating it only in31 requires root correction after evidence check.'};
assert.equal(result.read_scope.pages,143);assert.equal(chapters.length,30);
fs.writeFileSync(path.join(A,'g-first-reading.json'),JSON.stringify(result,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({ok:true,native_thread_id:thread.thread_id,revision:339,state_sha256:expected,generation:8,read_scope:result.read_scope,invariants:result.invariants,issue_counts:issues.counts,elapsed_ms:result.elapsed_ms}));
