import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import assert from 'node:assert/strict';import {isDeepStrictEqual} from 'node:util';import {fileURLToPath} from 'node:url';
const here=path.dirname(fileURLToPath(import.meta.url)),j=p=>JSON.parse(fs.readFileSync(p)),sha=b=>crypto.createHash('sha256').update(b).digest('hex'),root=j(path.join(here,'project.json')).project;
const original=j(path.join(here,'checkpoint-e-entry-state.json')),publishedBytes=fs.readFileSync(path.join(here,'checkpoint-f-entry-state.json')),published=JSON.parse(publishedBytes),currentBytes=fs.readFileSync(path.join(root,'.writer/state.json')),review=j(path.join(here,'e-root-review.json'));
assert.equal(sha(currentBytes),sha(publishedBytes),'F first phase must keep the E published main unchanged');assert.equal(published.units.length,60);assert.equal(published.revision,322);
assert.deepEqual(published.units.slice(0,47),original.units.slice(0,47));
const changed=[],lengths=[];let bodyHan=0;
for(let n=1;n<=60;n++){
 const u=published.units[n-1],old=original.units[n-1];assert.equal(u.unit,n);assert.equal(u.draft,old.draft);
 const bytes=fs.readFileSync(path.join(root,u.draft));assert.equal(sha(bytes),u.sha256,u.draft);if(u.sha256!==old.sha256)changed.push(n);
 const text=bytes.toString('utf8').split(/\r?\n/).filter(l=>!/^#{1,6}\s/.test(l)).join('\n'),han=(text.match(/\p{Script=Han}/gu)||[]).length;
 lengths.push({unit:n,draft:u.draft,sha256:u.sha256,han});bodyHan+=han;if(n>=49)assert(han>=([52,56,60].includes(n)?16000:12000),String(n));
}
assert.deepEqual(changed,[48,54,55,56,60]);assert.deepEqual(published.snapshot.ledger.O_BOX_PAINT,original.snapshot.ledger.O_BOX_PAINT);
for(const [id,v] of Object.entries(original.source_versions))assert.deepEqual(published.source_versions[id],v,id);
for(const range of original.source_ranges)assert(published.source_ranges.some(r=>isDeepStrictEqual(r,range)),range.ref);
for(const v of Object.values(published.source_versions))assert.equal(sha(fs.readFileSync(path.join(root,v.object_ref))),v.sha256,v.id);
const sources=[];
for(const [index,s] of review.sources.entries()){
 const prefix='AD_E_S'+String(index+1).padStart(2,'0'),old=published.source_versions[prefix+'_OLD'],fresh=published.source_versions[prefix+'_NEW'];
 assert(old&&fresh,s.ref);assert.equal(old.ref,s.ref);assert.equal(old.sha256,s.old_sha256);assert.equal(fresh.ref,s.ref);assert.equal(fresh.previous,old.id);
 assert.equal(sha(fs.readFileSync(path.join(root,s.ref))),s.old_sha256,'Original editing entry retained: '+s.ref);
 const ranges=published.source_ranges.filter(r=>r.ref===s.ref);assert.equal(ranges.length,2);assert(ranges.some(r=>r.version_id===old.id&&r.from===1&&r.to===s.historical_from-1));assert(ranges.some(r=>r.version_id===fresh.id&&r.from===s.historical_from&&r.to===null));
 for(const n of s.consumers){const before=original.units[n-1],after=published.units[n-1];assert.equal(before.source_hashes[s.ref],old.sha256);assert.equal(after.source_hashes[s.ref],fresh.sha256);assert.equal(after.source_bindings[s.ref].version_id,fresh.id);}
 sources.push({ref:s.ref,old_version:old.id,new_version:fresh.id,historical_from:s.historical_from,original_consumers:s.consumers,new_sha256:fresh.sha256});
}
let bound=0;for(const u of published.units)for(const [ref,b] of Object.entries(u.source_bindings??{})){
 const v=published.source_versions[b.version_id];assert(v,ref);assert.equal(b.object_ref,v.object_ref);assert.equal(b.sha256,v.sha256);assert.equal(u.source_hashes[ref],v.sha256);
 const ranges=published.source_ranges.filter(r=>r.ref===ref&&r.from<=u.unit&&(r.to===null||u.unit<=r.to));assert.equal(ranges.length,1,ref+' '+u.unit);assert.equal(ranges[0].version_id,v.id);bound++;
}
let applications=0;for(const [id,old] of Object.entries(original.review_workflow.issues)){const now=published.review_workflow.issues[id];assert(now,id);assert.deepEqual(now.application,old.application,id);if(old.application)applications++;}
assert.equal(applications,8);assert.equal(Object.keys(published.review_workflow.issues).length,21);
assert.deepEqual(published.committed_revisions.slice(0,original.committed_revisions.length),original.committed_revisions);assert.equal(published.committed_revisions.length,original.committed_revisions.length+1);
assert.equal(Object.keys(published.impact_pending).length,0);assert.equal(Object.keys(published.source_versions).length,32);assert.equal(published.source_ranges.length,31);
const result={ok:true,at:new Date().toISOString(),project:root,revision:published.revision,registered_units:60,state_sha256:sha(publishedBytes),prefix_1_through_47_units_and_body_unchanged:true,changed_body_units:changed,all_body_hashes_match:true,total_body_han:bodyHan,new_49_through_60_han:lengths.filter(x=>x.unit>=49).reduce((n,x)=>n+x.han,0),chapter_lengths:lengths,immutable_observation_unchanged:true,old_source_versions_retained:Object.keys(original.source_versions).length,old_source_ranges_retained:original.source_ranges.length,current_source_versions:32,current_source_ranges:31,bound_consumptions_verified:bound,sources,original_applications_unchanged:applications,old_commit_bindings_unchanged:original.committed_revisions.length,impact_pending:0,scope:'Independent structural and hash verification of the E-published version before F. Text semantics remain in actual model-reading reports; not a generic automated literary judgment.'};
fs.writeFileSync(path.join(here,'e-published-integrity-root-verification.json'),JSON.stringify(result,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify({ok:true,revision:322,changed_body_units:changed,total_body_han:bodyHan,new_49_through_60_han:result.new_49_through_60_han,bound_consumptions_verified:bound,source_versions:32,original_applications_unchanged:applications}));
