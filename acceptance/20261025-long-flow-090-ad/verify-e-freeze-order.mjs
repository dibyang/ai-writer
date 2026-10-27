import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import assert from 'node:assert/strict';import {fileURLToPath} from 'node:url';
const here=path.dirname(fileURLToPath(import.meta.url)),j=p=>JSON.parse(fs.readFileSync(p)),sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const at=label=>path.join(here,'cli-logs',label),workflow=j(path.join(at('ef-workflow-corrected'),'result.json')),failed=j(path.join(at('ef-workflow-set'),'result.json')),rows=[];
assert.equal(workflow.exit_code,0);assert.equal(failed.exit_code,2);assert.equal(failed.before_state_sha256,failed.after_state_sha256);
for(let n=1;n<=6;n++){
 const label='ef-freeze-old-'+n,dir=at(label),r=j(path.join(dir,'result.json')),before=j(path.join(dir,'before-state.json')),after=j(path.join(dir,'after-state.json')),out=j(path.join(dir,'stdout.txt'));
 assert.equal(r.exit_code,0);assert.equal(r.args[0],'source');assert.equal(r.args[1],'freeze');assert(before.governance.authorization.allowed_actions.includes('plan'));
 for(const field of ['units','snapshot','governance','source_ranges','impact_pending'])assert.deepEqual(after[field],before[field],`${label}: ${field}`);
 assert.equal(after.revision,before.revision+1);assert.equal(Object.keys(after.source_versions).length,Object.keys(before.source_versions).length+1);
 for(const [id,v] of Object.entries(before.source_versions))assert.deepEqual(after.source_versions[id],v,id);
 const v=out.version;assert.equal(after.source_versions[v.id].sha256,v.sha256);assert.equal(v.previous,null);
 const root=j(path.join(here,'project.json')).project;assert.equal(sha(fs.readFileSync(path.join(root,v.object_ref))),v.sha256);
 const consumers=before.units.filter(u=>Object.hasOwn(u.source_hashes,v.ref));assert(consumers.length);for(const u of consumers)assert.equal(u.source_hashes[v.ref],v.sha256);
 assert(Date.parse(r.started_at)<Date.parse(workflow.started_at));
 rows.push({label,revision_before:before.revision,revision_after:after.revision,old_stage:before.governance.stage,plan_was_authorized:true,proposal_only:true,version_id:v.id,ref:v.ref,sha256:v.sha256,consumers:consumers.map(u=>u.unit),units_snapshot_governance_ranges_pending_unchanged:true});
}
const mutations=[];
for(const label of fs.readdirSync(path.join(here,'cli-logs')).filter(n=>n.startsWith('ef-'))){
 const file=path.join(at(label),'result.json');if(!fs.existsSync(file))continue;const r=j(file);
 if(r.exit_code!==0)continue;
 if(r.args[0]==='source'&&['publish','stage'].includes(r.args[1])||r.args[0]==='revision'&&r.args[1]==='begin'){
  assert(Date.parse(r.started_at)>=Date.parse(workflow.started_at),label);mutations.push(label);
 }
}
assert(mutations.length>=19);
const result={ok:true,at:new Date().toISOString(),planned_order_passed:false,actual_sequence:'new workflow rejected; six authorized old-byte proposal freezes; corrected revision workflow; full reading; baseline publications; historical stages; independent revision',failed_workflow_state_unchanged:true,freezes:rows,later_publications_stages_and_begin_after_corrected_workflow:mutations,decision:'Root accepts the correctly frozen original-byte proposals for continued validation. Keep the controller ordering deviation; do not claim the planned setup order passed. No source hash, baseline, or old record is rewritten to hide it.',scope:'Existing stage allowed plan; freeze is proposal-only. This does not retrospectively authorize a body edit or version publication under the old range.'};
fs.writeFileSync(path.join(here,'e-freeze-order-root-verification.json'),JSON.stringify(result,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify({ok:true,planned_order_passed:false,proposal_freezes_verified:rows.length,later_mutations_after_corrected_workflow:mutations.length}));
