import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const a=path.dirname(fileURLToPath(import.meta.url));
const read=n=>JSON.parse(fs.readFileSync(path.join(a,n),'utf8'));
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const save=(n,x)=>fs.writeFileSync(path.join(a,n),JSON.stringify(x,null,2)+'\n',{flag:'wx'});
assert.equal(process.env.CODEX_THREAD_ID,'01a176d2-2255-7e80-9c37-d825387a4fef');
const e=read('fvt3-entry-audit.json'),c=read('fvr1-private-ownership.json');
assert.equal(c.id,'de25fce4-4446-4b5a-9038-9af130f3b456');
for(const area of ['main','workspace']) {
 const b=fs.readFileSync(path.join(e[area],'.writer/state.json'));
 assert.equal(sha(b),e[`${area}_state_sha256`]);
 fs.writeFileSync(path.join(a,`fvt4-entry-${area}-state.json`),b,{flag:'wx'});
}
for(const r of e.all66_body_rows)assert.equal(sha(fs.readFileSync(path.join(e.workspace,r.draft))),r.sha256);
const p2=read('fvt2-reading-manifest.json'),p3=read('fvt3-reading-manifest.json');
assert.deepEqual(p2.completed_chapters,[37,38,39,40,41]);assert.equal(p2.actual_complete_reading_pages,39);
assert.deepEqual(p3.completed_chapters,Array.from({length:18},(_,i)=>42+i));assert.equal(p3.actual_complete_reading_pages,156);
const prior=[{run:'final-tail-resume',units:p2.completed_chapters,pages:39,exit:1,elapsed_ms:777023,error:'Selected model is at capacity',partial:{unit:42,pages:[1,2,3,4,5,6],excluded:true}},{run:'final-tail-recovery',units:p3.completed_chapters,pages:156,exit:1,elapsed_ms:1488579,error:'Selected model is at capacity',partial:{unit:60,pages:[1,2],excluded:true}}];
Object.assign(e,{at:new Date().toISOString(),requested_reading_from:60,requested_reading_through:66,reading_range_rows:e.all66_body_rows.filter(r=>r.unit>=60),previous_complete_reading:prior,previous_incomplete:{unit:60,pages:[1,2],excluded_from_complete_coverage:true},planned_reading_pages:e.all66_body_rows.filter(r=>r.unit>=60).reduce((n,r)=>n+r.pages,0)});
assert.equal(e.planned_reading_pages,86);save('fvt4-entry-audit.json',e);
save('fvt4-resume-private-input.json',{id:c.id,token:c.token});
for(const f of ['cli','read']) {
 let t=fs.readFileSync(path.join(a,`fvt3-${f}.mjs`),'utf8').replaceAll('fvt3-','fvt4-');
 if(f==='read')t=t.replace('unit>=42','unit>=60');
 fs.writeFileSync(path.join(a,`fvt4-${f}.mjs`),t,{flag:'wx'});
}
let n=fs.readFileSync(path.join(a,'fvt3-save-note.mjs'),'utf8').replaceAll('fvt3','fvt4').replace('42+old.completed_chapters.length','60+old.completed_chapters.length').replace('unit>=42','unit>=60').replaceAll('workspace42—66容量恢复','workspace60—66二次容量恢复').replace('planned_from:42','planned_from:60').replaceAll('planned_pages:242','planned_pages:86').replace('prior_run_coverage:{complete_units:[37,38,39,40,41],pages:39,incomplete42pages6_excluded:true,capacity_failure_preserved:true}','prior_run_coverage:entry.previous_complete_reading').replace("unfixed_confirmed_issue:'ROOT-FVT1-18-DIRECTION-REVIEW.md'","unfixed_confirmed_issues:['ROOT-FVT1-18-DIRECTION-REVIEW.md','ROOT-FVT3-51-SHOE-REVIEW.md'],root_pending_issue:'59 原8册',partial60_old_pages_excluded:true").replace('第18背对左右错误已由根确认、尚未修','第18背对左右错误和第51照片所见错误已由根确认、尚未修；第59“原8册”待根裁定');
fs.writeFileSync(path.join(a,'fvt4-save-note.mjs'),n,{flag:'wx'});
fs.mkdirSync(path.join(a,'fvt4-notes'),{recursive:true});
save('fvt4-recovery-events.json',{at:new Date().toISOString(),prior_native_failures:prior,original_results_untouched:true,current:{native_id:process.env.CODEX_THREAD_ID,session_id:c.id,planned_units:[60,66],planned_pages:86,unit60_restart_at_page1:true},auxiliary_failures:[],no_exit_claim_for_current_run:true});
console.log(JSON.stringify({ok:true,native_id:process.env.CODEX_THREAD_ID,session_id:c.id,main_revision:397,workspace_revision:464,planned_chapters:e.reading_range_rows.length,planned_pages:86,previous_complete_pages:195}));
