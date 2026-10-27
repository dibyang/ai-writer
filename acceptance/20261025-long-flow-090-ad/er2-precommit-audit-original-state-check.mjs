import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';
import {base,project,j,sha,write,state} from './ef-lib.mjs';
const priv=j(path.join(base,'e-revision-private.json')),root=priv.workspace,coord=path.dirname(root),b=j(path.join(coord,'base.json')),s=state(root),m=state();
const mismatches=[];for(const[ref,h]of Object.entries(b.files)){const p=path.join(project,ref);if(!fs.existsSync(p)||sha(fs.readFileSync(p))!==h)mismatches.push(ref);}
assert.deepEqual(mismatches,[]);assert.equal(m.revision,321);assert.equal(m.units.length,60);assert.equal(sha(fs.readFileSync(path.join(project,'.writer/state.json'))),'1d8eb476bed70f6eae0ec90984fce3b09f3a3f2acc6b45aa1881f71c40dc3fc6');
assert.equal(s.units.length,60);assert.equal(s.revision,344);assert.deepEqual(s.units.slice(0,47),m.units.slice(0,47));
assert.deepEqual(s.source_versions,m.source_versions);assert.deepEqual(s.source_ranges.slice(0,19),m.source_ranges.slice(0,19));
assert.deepEqual(s.review_workflow.issues,m.review_workflow.issues);assert.deepEqual(s.committed_revisions,m.committed_revisions);
const objects=Object.values(s.source_versions).map(v=>{assert.equal(sha(fs.readFileSync(path.join(root,v.object_ref))),v.sha256);assert.equal(sha(fs.readFileSync(path.join(project,v.object_ref))),v.sha256);return {version_id:v.id,ref:v.ref,object_ref:v.object_ref,sha256:v.sha256};});
const immutable=[];for(const[id,v]of Object.entries(m.snapshot.ledger))if(v.type==='observation'){const a=s.snapshot.ledger[id];assert(a);for(const k of ['type','statement','author_truth'])assert.deepEqual(a[k],v[k]);immutable.push(id);}
assert.deepEqual(s.snapshot.ledger.O_BOX_PAINT,m.snapshot.ledger.O_BOX_PAINT);
const bodies=[],changed=[],afterHits=[];
const suspect=/原68|灯68|六十八|料十二|料12|净58|净付58|实收58|未收58|原58|重收58|收回2|收2|找2|找两元|五十八/;
for(const u of s.units){const bytes=fs.readFileSync(path.join(root,u.draft));assert.equal(sha(bytes),u.sha256);const old=m.units[u.unit-1];if(old.sha256!==u.sha256)changed.push(u.unit);if(u.unit<48)continue;
 const jbytes=fs.readFileSync(path.join(root,u.journal));assert.equal(sha(jbytes),u.journal_sha256);const patch=JSON.parse(jbytes).patch;
 for(const p of patch){const val=p.after??p.append;if(val!==undefined&&suspect.test(JSON.stringify(val)))afterHits.push({unit:u.unit,at:p.at,value:val});}
 for(const[ref,h]of Object.entries(u.source_hashes)){const v=Object.values(s.source_versions).find(v=>v.ref===ref&&v.sha256===h);assert.equal(sha(fs.readFileSync(path.join(root,v?v.object_ref:ref))),h);}
 bodies.push({unit:u.unit,draft:u.draft,sha256:u.sha256,old_sha256:old.sha256,summary:u.summary,journal:u.journal,journal_sha256:u.journal_sha256,source_bindings:u.source_bindings,source_hashes:u.source_hashes});
}
assert.deepEqual(changed,[48,54,55,56,60]);assert.deepEqual(afterHits,[]);
const selected={};for(const[id,v]of Object.entries(s.snapshot.ledger))if(/LAMP|CABINET|AD_FEE55|SAND/.test(id))selected[id]=v;
const proof={ok:true,at:new Date().toISOString(),revision_id:priv.id,main_revision:m.revision,main_sha256:sha(fs.readFileSync(path.join(project,'.writer/state.json'))),main_baseline_files:Object.keys(b.files).length,main_baseline_mismatches:mismatches,candidate_revision:s.revision,candidate_sha256:sha(fs.readFileSync(path.join(root,'.writer/state.json'))),changed_body_units:changed,unchanged_body_units:s.units.filter(u=>!changed.includes(u.unit)).map(u=>u.unit),prefix_units_1_47_exact:true,source_versions_exact_main_baseline:true,original_19_ranges_exact:true,immutable,immutable_observation_fields_exact:true,old_issues_exact:true,old_committed_revisions_exact:true,original_commit_count:m.committed_revisions.length,main_pending:m.impact_pending.length,candidate_pending:s.impact_pending.length,source_versions:objects,main_ranges:m.source_ranges,candidate_ranges:s.source_ranges,body_and_tracking:bodies,current_selected_ledger:selected,new_journal_after_old_controlled_value_hits:afterHits,scope:'Read-only byte/structure audit plus separately recorded model semantic review; old historical journal before values and archived reports are intentionally preserved.'};
write(path.join(base,'er2-precommit-proof.json'),proof);
console.log(JSON.stringify({ok:true,main_r:m.revision,candidate_r:s.revision,baseline_files:proof.main_baseline_files,changed,objects:objects.length,prefix_ranges:19,immutable,old_issues:Object.keys(m.review_workflow.issues).length,old_commits:m.committed_revisions.length,main_pending:proof.main_pending,candidate_pending:proof.candidate_pending}));
