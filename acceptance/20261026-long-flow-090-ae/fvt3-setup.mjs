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
const e=read('fvt2-entry-audit.json'), c=read('fvr1-private-ownership.json');
for(const area of ['main','workspace']) {
 const b=fs.readFileSync(path.join(e[area],'.writer/state.json'));
 assert.equal(sha(b),e[`${area}_state_sha256`]);
 fs.writeFileSync(path.join(a,`fvt3-entry-${area}-state.json`),b,{flag:'wx'});
}
for(const r of e.all66_body_rows) assert.equal(sha(fs.readFileSync(path.join(e.workspace,r.draft))),r.sha256);
const prior=read('fvt2-reading-manifest.json');
assert.deepEqual(prior.completed_chapters,[37,38,39,40,41]);
assert.equal(prior.actual_complete_reading_pages,39);
Object.assign(e,{at:new Date().toISOString(),requested_reading_from:42,requested_reading_through:66,reading_range_rows:e.all66_body_rows.filter(r=>r.unit>=42),previous_complete_reading:{run:'final-tail-resume',units:[37,38,39,40,41],pages:39,result:'exit1 capacity; not normal stop'},previous_incomplete:{unit:42,pages:[1,2,3,4,5,6],excluded_from_complete_coverage:true},planned_reading_pages:e.all66_body_rows.filter(r=>r.unit>=42).reduce((n,r)=>n+r.pages,0)});
save('fvt3-entry-audit.json',e);
save('fvt3-resume-private-input.json',{id:c.id,token:c.token});
for(const f of ['cli','read']) {
 let t=fs.readFileSync(path.join(a,`fvt2-${f}.mjs`),'utf8').replaceAll('fvt2-','fvt3-');
 if(f==='read')t=t.replace('unit>=36','unit>=42');
 fs.writeFileSync(path.join(a,`fvt3-${f}.mjs`),t,{flag:'wx'});
}
let n=fs.readFileSync(path.join(a,'fvt2-save-note.mjs'),'utf8').replaceAll('fvt2','fvt3').replace('37+old.completed_chapters.length','42+old.completed_chapters.length').replace('unit>=37','unit>=42').replaceAll('workspace37—66','workspace42—66容量恢复').replace('planned_from:37','planned_from:42').replaceAll('planned_pages:281','planned_pages:242').replace('extra_boundary_reference:{unit:36,pages:[6,7],counts_towards281:false}','prior_run_coverage:{complete_units:[37,38,39,40,41],pages:39,incomplete42pages6_excluded:true,capacity_failure_preserved:true}');
fs.writeFileSync(path.join(a,'fvt3-save-note.mjs'),n,{flag:'wx'});
save('fvt3-recovery-events.json',{at:new Date().toISOString(),previous:{run:'final-tail-resume',started:'2026-10-26T12:55:12.811Z',observed_by_root:{exit:1,elapsed_ms:777023,error:'Selected model is at capacity'},complete_units:[37,38,39,40,41],complete_pages:39,partial_unit42_pages:[1,2,3,4,5,6],extra36_pages:[6,7],original_results_untouched:true},current:{native_id:process.env.CODEX_THREAD_ID,planned_units:[42,66],planned_pages:e.planned_reading_pages,unit42_restart_at_page1:true},auxiliary_failures:[{kind:'functions exec tool discovery',error:"TypeError: Cannot read properties of undefined (reading name)",effect:'No filesystem or product calls occurred; direct FastCtx calls used instead.'}]});
console.log(JSON.stringify({ok:true,native_id:process.env.CODEX_THREAD_ID,session_id:c.id,main_revision:397,workspace_revision:464,planned_chapters:e.reading_range_rows.length,planned_pages:e.planned_reading_pages}));
