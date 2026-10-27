import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import assert from 'node:assert/strict';import {fileURLToPath} from 'node:url';
const here=path.dirname(fileURLToPath(import.meta.url)),j=p=>JSON.parse(fs.readFileSync(p)),sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const preflightFile=path.join(here,'e-preflight.json'),p=j(preflightFile),run=j(path.join(here,'native/e-preflight/result.json'));
assert.equal(run.exit_code,0);assert.equal(run.thread_id,p.native_thread_id);assert.equal(p.status,'preflight-complete-await-root-review-no-implementation');
const root=j(path.join(here,'project.json')).project,stateBytes=fs.readFileSync(path.join(root,'.writer/state.json')),state=JSON.parse(stateBytes),cp=j(path.join(here,'checkpoint-e-preflight-entry.json'));
assert.equal(sha(stateBytes),p.entry.state_sha256);assert.equal(sha(stateBytes),p.exit.state_sha256);assert.equal(sha(stateBytes),cp.state_sha256);assert.equal(state.revision,296);assert.equal(state.units.length,60);
assert(p.exit.all_17859_files_identical&&p.exit.full_project_inventory.ok);assert.equal(p.exit.full_project_inventory.entry_files,17859);assert.equal(p.exit.full_project_inventory.exit_files,17859);assert.deepEqual(p.exit.full_project_inventory.changes,[]);assert.deepEqual(p.exit.full_project_inventory.added,[]);
for(const [ref,row] of Object.entries(cp.files)){const b=fs.readFileSync(path.join(root,ref));assert.equal(b.length,row.bytes,ref);assert.equal(sha(b),row.sha256,ref);}
for(const u of state.units)assert.equal(sha(fs.readFileSync(path.join(root,u.draft))),u.sha256,u.draft);
const scopes=[['大纲/单元/0056.json',56],['大纲/单元/0058.json',58],['大纲/单元/0059.json',59],['大纲/单元/0060.json',60],['研究/AD-D滚动写前核对.md',58],['研究/AD-DR-60写前核对.md',60]];
assert.equal(p.source_version_plan.length,scopes.length);const sources=[];
for(const [ref,from] of scopes){
 const proposed=p.source_version_plan.find(x=>x.ref===ref);assert(proposed,ref);const oldHash=sha(fs.readFileSync(path.join(root,ref)));assert.equal(oldHash,proposed.old_sha256,ref);
 assert(!Object.values(state.source_versions).some(x=>x.ref===ref),ref);
 const consumers=state.units.filter(u=>Object.hasOwn(u.source_hashes,ref));assert(consumers.length,ref);for(const u of consumers)assert.equal(u.source_hashes[ref],oldHash,`${ref}: ${u.unit}`);
 sources.push({ref,old_sha256:oldHash,historical_from:from,consumers:consumers.map(x=>x.unit)});
}
for(const v of Object.values(state.source_versions))assert.equal(sha(fs.readFileSync(path.join(root,v.object_ref))),v.sha256,v.id);
assert.deepEqual(p.candidates.map(x=>x.id),['E_SANDPAPER48','E_LAMP54','E_CABINET55']);
const result={ok:true,at:new Date().toISOString(),scope:'Root verification of preflight artifacts and unchanged current main; selection rationale is e-root-review.md, not new human quotations.',preflight_sha256:sha(fs.readFileSync(preflightFile)),handoff_sha256:sha(fs.readFileSync(path.join(here,'交接-E预读.md'))),native_thread_id:run.thread_id,native_exit_code:run.exit_code,state_sha256:sha(stateBytes),revision:state.revision,registered_units:60,checkpoint_files_checked:Object.keys(cp.files).length,baseline_source_versions:Object.keys(state.source_versions).length,baseline_source_ranges:state.source_ranges.length,baseline_source_registry_sha256:sha(Buffer.from(JSON.stringify({versions:state.source_versions,ranges:state.source_ranges}))),sources,accepted_controller_candidates:p.candidates.map(x=>({id:x.id,earliest_affected_unit:x.earliest_affected_unit,new_value:x.new_value})),controlled_body_changes:[48,54,55,56,60],revision_range:{from:48,through:60},real_revision_stop_units:[51,56]};
fs.writeFileSync(path.join(here,'e-root-review.json'),JSON.stringify(result,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify(result,null,2));
