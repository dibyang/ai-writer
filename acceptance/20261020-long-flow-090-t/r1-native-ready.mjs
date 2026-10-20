import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {base,read,state,save,sha} from './common.mjs';
const j=ref=>JSON.parse(fs.readFileSync(path.join(base,ref),'utf8')),b=j('r1-session.json'),checks=j('r1-ready-checks.json'),old=j('r1-before.json'),s=JSON.parse(fs.readFileSync(path.join(b.workspace,'.writer/state.json'))),diff=j('r1-real-differences.json');
assert.equal(sha(read('.writer/state.json')),checks.main.state_sha256);
assert.equal(sha(fs.readFileSync(path.join(b.workspace,'.writer/state.json'))),checks.candidate.state_sha256);
for(const f of [...old.bodies,...old.parts])assert.equal(sha(read(f.ref)),f.sha256);
const finalRead=j('r1-final-read-after.json');for(const f of finalRead.files)assert.equal(sha(fs.readFileSync(f.path)),f.sha256);
const report='审查/T-R1-0015-0024.md',handoff='交接/T-R1-待父审计.md';
const proof=ref=>({ref,sha256:sha(fs.readFileSync(path.join(base,ref)))});
save('r1-native-ready.json',{
 status:'native-r-ready-for-independent-father-audit',session:checks.session,workspace:b.workspace,
 original_baseline:'r1-before.json; original session base preserved, no transfer/new revision',
 main:{...checks.main,body_hashes:old.bodies,c25_parts:old.parts,unchanged:true},
 candidate:{...checks.candidate,unit_hashes:s.units.map(u=>({unit:u.unit,draft:u.draft,sha256:u.sha256})),tool_entry:path.join(base,'scenario/雨棚后的灯/.writer/tool/bin/ai-writer.mjs'),identify_ref:'r1-ready-tool-identify-main-retry1.json'},
 actual_reading:{initial_restore:'r1-resumed-initial-read-after.json',per_unit:[21,22,23,24].map(n=>`r1-candidate-${n}-read-after.json`),final_order:'15 -> 24',final_ranges:finalRead.actual_ranges,final_before:'r1-final-read-before.json',final_after:'r1-final-read-after.json',c25_ranges:{'分段/0025/part-01.md':'1—58 EOF','分段/0025/part-02.md':'1—60 EOF'},qualification:'Actual informed model full text self-review, not blind/human/author acceptance'},
 changes:{body:diff.body,text_edits:diff.text_edits,registration_content:diff.replay,unit_summary:diff.unit_summary,final_snapshot_diff:proof('r1-semantic-diff.json'),snapshot_difference_count:86,real_differences:proof('r1-real-differences.json'),expected_categories:['Controlled ordinary author fact changes: cloth due14:55/He14:50, Xu reported14:57, cart deposit/refund60 in two actual notes50+10','Actual H1: delete advance telephone knowledge of He accompaniment, learn on sight; no invented earlier commitment','R-M20: existing registration ordering correction only, morning tell Xu before home cleanup/lunch','Evidence SHA and exact changed quotes rebound to actual candidate bytes; historical knowledge times retained'],disposition:'Actual differences supplied for father audit; no blanket approval generated'},
 protected_observations:j('r1-final-audit.json').protected_observations,
 mechanical_evidence:{ref:'r1-final-audit.json',ledger_quote_line_sha_checked:228,body_exact_edits:22,limitations:'Byte/binding checks do not replace literary reading'},
 review:{...checks.review,report,report_sha256:sha(fs.readFileSync(path.join(b.workspace,report)))},
 handoff:{report:handoff,sha256:sha(fs.readFileSync(path.join(b.workspace,handoff)))},
 c25_impact:'Both existing parts actual reread and unchanged; no direct numeric/H1 wording needs editing. Two baskets/empty former cart space and waiting for Tao remain consistent. Future continuation must inherit60 refund/He own decision/Xu not refund witness/new100 unpaid; install and payment not yet written.',
 help_issue:'Father confirmed help with project is a real product issue, repaired main product only. Active R remains gen4/e25 old entry; do not claim fixed here. Father installs new package only after revision commit, future C usesgen5.',
 preserved_failure:checks.additional_check_failure,
 pending:['Independent father audit of every actual body/registration difference and protected observations','Father prepares and commits this same revision only after audit','Father restores writing workflow then installs new tool package','Future C refreshes source and continues25; current two parts are not altered'],
 performed:{prepare:false,commit:false,transfer:false,new_revision:false,main_body_write:false,main_state_write:false,c25_write:false,tool_update:false,agents:false,network:false,git_commit:false,git_push:false},
 native_exit:'R work ends normally after this checkpoint; session remains editing and occupied for father audit, candidate is not published'
});
console.log(JSON.stringify({ok:true,ready:path.join(base,'r1-native-ready.json'),id:b.id,candidate_revision:s.revision,main_revision:state().revision,session_status:checks.session.status}));
