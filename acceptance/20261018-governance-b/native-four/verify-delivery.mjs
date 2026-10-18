import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const stage=path.resolve('acceptance/20261018-governance-b/native-four');
const read=p=>JSON.parse(fs.readFileSync(path.join(stage,p),'utf8'));
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const summary=read('summary.json'),handoff=read('handoff.json'),root=handoff.root;
const stateBytes=fs.readFileSync(path.join(root,'.writer/state.json'));
const state=JSON.parse(stateBytes);
const checks={
 delivery_files_present:['report.md','summary.json','handoff.json','final-body-hashes.json'].every(p=>fs.existsSync(path.join(stage,p))),
 final_state_matches_handoff:sha(stateBytes)===handoff.final_state_sha256,
 final_fact_hash_matches_original:sha(JSON.stringify(state.snapshot))===handoff.original_fact_hash,
 summary_and_handoff_body_hashes_equal:JSON.stringify(summary.equivalence.final_body_hashes)===JSON.stringify(handoff.final_body_hashes),
 all_100_body_hashes_current:handoff.final_body_hashes.length===100&&handoff.final_body_hashes.every(x=>sha(fs.readFileSync(path.join(root,x.draft)))===x.sha256),
 paused_without_draft_authorization:state.governance.stage==='paused'&&state.governance.authorization.draft_range===null&&!state.governance.authorization.allowed_actions.includes('draft'),
 only100_reregistered:JSON.stringify(summary.scope.reregistered_units)==='[100]',
 no_new_body:state.units.length===100,
 source_version_is_byte_equivalent:state.source_versions.HUNDRED_RULES_BASE.sha256===state.source_versions.HUNDRED_RULES_NATIVE_FOUR_100.sha256,
 new_model_report_valid_after_pause:summary.review.pause_did_not_invalidate_new_report,
 all31_product_calls_captured:summary.calls.length===31&&new Set(summary.calls.map(x=>x.label)).size===31,
 original_copy_files_unchanged_except_state:read('copy-manifest-final-audit.json').changed.every(x=>x.file==='.writer/state.json'),
 supplemental_export100_original_hashes:handoff.final_body_hashes.every(x=>sha(fs.readFileSync(path.join(stage,'export-byte-preserved',x.draft)))===x.sha256)
};
const result={ok:Object.values(checks).every(Boolean),checks,final_revision:state.revision,final_state_sha256:sha(stateBytes),report_sha256:sha(fs.readFileSync(path.join(stage,'report.md'))),summary_sha256:sha(fs.readFileSync(path.join(stage,'summary.json'))),handoff_sha256:sha(fs.readFileSync(path.join(stage,'handoff.json'))),boundary:'Artifact/structure verification only; not literary acceptance'};
fs.writeFileSync(path.join(stage,'delivery-verification.json'),JSON.stringify(result,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify(result,null,2));if(!result.ok)process.exitCode=1;
