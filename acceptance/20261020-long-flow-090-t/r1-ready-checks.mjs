import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {base,read,state,save,run,sha} from './common.mjs';
const j=ref=>JSON.parse(fs.readFileSync(path.join(base,ref),'utf8')),b=j('r1-session.json'),cp=j('checkpoint-r-first.json');
assert.equal(sha(read('.writer/state.json')),cp.main.state_sha256);
save('r1-ready-main-status.json',run('r1-ready-main-status',['status']));
save('r1-ready-candidate-status.json',run('r1-ready-candidate-status',['status','--revision-token',b.token],0,b.workspace));
save('r1-ready-candidate-identify.json',run('r1-ready-candidate-identify',['tool','identify','--revision-token',b.token],0,b.workspace));
const list=run('r1-ready-main-list',['revision','list']);save('r1-ready-main-list.json',list);
const active=list.sessions.find(s=>s.id===b.id);assert.equal(active.status,'editing');assert.equal(active.base_sha256,cp.candidate.base_sha256);
assert.equal(sha(read('.writer/state.json')),cp.main.state_sha256);
const s=JSON.parse(fs.readFileSync(path.join(b.workspace,'.writer/state.json')));assert.equal(s.units.length,24);assert.equal(s.tool_control.generation,4);
function diff(a,c,at=[]){if(JSON.stringify(a)===JSON.stringify(c))return [];if(a&&c&&typeof a==='object'&&typeof c==='object'&&Array.isArray(a)===Array.isArray(c))return [...new Set([...Object.keys(a),...Object.keys(c)])].flatMap(k=>diff(a[k],c[k],[...at,k]));return [{at,before:a,after:c}];}
const replayDiffs=[];
for(let n=15;n<=24;n++){const before=JSON.parse(fs.readFileSync(path.join(b.workspace,`.writer/drafts/t-r1-replay-${n}.json`))),after=j(`inputs/r1-reviewed-${n}.json`),fields=diff({summary:before.summary,changes:before.changes},{summary:after.summary,changes:after.changes});if(fields.length)replayDiffs.push({unit:n,fields,patches:`r1-record-edits-${n}.json`});}
const old=j('r1-before.json');
const unitSummaryDiffs=old.units.map(u=>({unit:u.unit,before:u.summary,after:s.units.find(v=>v.unit===u.unit).summary})).filter(u=>u.before!==u.after);
save('r1-real-differences.json',{scope:'Only actual differences. Snapshot diff is separate. Replay differences compare original restored summary/changes against reviewed input; source/revision/review bindings are intentionally outside this content diff.',body:j('r1-final-audit.json').candidate.body_diffs,text_edits:j('r1-text-edits.json'),unit_summary:unitSummaryDiffs,replay:replayDiffs,snapshot_diff_ref:'r1-semantic-diff.json',snapshot_difference_count:j('r1-semantic-diff.json').snapshot.length,disposition:'Native R preparation complete; independent father audit, prepare and commit still pending.'});
save('r1-ready-checks.json',{session:{id:b.id,status:active.status,base_revision:b.base_revision,base_sha256:active.base_sha256,token_local_path:path.join(base,'r1-session.json')},main:{revision:state().revision,units:state().units.length,state_sha256:sha(read('.writer/state.json'))},candidate:{revision:s.revision,units:s.units.length,state_sha256:sha(fs.readFileSync(path.join(b.workspace,'.writer/state.json'))),generation:s.tool_control.generation,source_binding:s.source_binding,source_versions:s.source_versions,source_ranges:s.source_ranges,tool_control:s.tool_control},review:j('commands/r1-review/stdout.raw.txt'),real_differences_sha256:sha(fs.readFileSync(path.join(base,'r1-real-differences.json')))});
console.log(JSON.stringify({ok:true,id:b.id,status:active.status,candidate_revision:s.revision,snapshot_differences:j('r1-semantic-diff.json').snapshot.length,replay_changed_units:replayDiffs.map(x=>x.unit),summary_changed_units:unitSummaryDiffs.map(x=>x.unit)}));
