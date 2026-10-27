import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const x=path.dirname(fileURLToPath(import.meta.url)),p=path.join(x,'scenario/东岸末班船-再扩展验证');
const j=f=>JSON.parse(fs.readFileSync(path.join(x,f),'utf8'));
const sha=v=>crypto.createHash('sha256').update(v).digest('hex');
assert.equal(j('commands/codex-e-first/result.json').exit_code,0);
assert.equal(j('cli-logs/e-begin/result.json').exit_code,0);
const handle=j('cli-logs/e-begin/stdout.raw.txt');assert(handle.ok&&handle.id&&handle.token&&handle.owner);
assert.deepEqual(handle.scope,{from:13,through:36});
const workspace=path.resolve(handle.workspace);assert(workspace.startsWith(path.resolve(x)+path.sep));
const old=j('pre-revision36-state.json'),before=j('pre-revision36.json');
const mainRaw=fs.readFileSync(path.join(p,'.writer/state.json')),main=JSON.parse(mainRaw);
const candidateRaw=fs.readFileSync(path.join(workspace,'.writer/state.json')),candidate=JSON.parse(candidateRaw);
assert.equal(main.units.length,36);assert.equal(candidate.units.length,18);
assert.equal(main.revision,handle.base_revision);
assert.deepEqual(main.units,old.units);assert.deepEqual(main.snapshot,old.snapshot);
assert.equal(main.governance.stage,'revision');assert(main.governance.authorization.allowed_actions.includes('revise'));
assert.deepEqual(main.governance.authorization.revise_range,{from:13,to:36});
assert.equal(main.governance.authorization.draft_range,null);
assert.deepEqual(candidate.units.slice(0,12),old.units.slice(0,12));
for(const u of old.units)assert.equal(sha(fs.readFileSync(path.join(p,u.draft))),u.sha256);
for(const u of candidate.units)assert.equal(sha(fs.readFileSync(path.join(workspace,u.draft))),u.sha256);
for(const [id,o] of Object.entries(old.snapshot.ledger).filter(([,v])=>v.type==='observation'&&(v.introduced_unit??1)<=18)){
  for(const key of ['type','statement','author_truth'])assert.deepEqual(candidate.snapshot.ledger[id]?.[key],o[key]);
}
const versions=[];
for(const [id,v] of Object.entries(old.source_versions??{})){
  assert.deepEqual(main.source_versions[id],v);assert.deepEqual(candidate.source_versions[id],v);
  const local=path.join(workspace,v.object_ref),actual=fs.existsSync(local)?local:path.join(p,v.object_ref);
  assert.equal(sha(fs.readFileSync(actual)),v.sha256);assert.equal(sha(fs.readFileSync(path.join(p,v.object_ref))),v.sha256);
  versions.push({id,sha256:v.sha256,resolved_in_candidate:fs.existsSync(local)});
}
assert.deepEqual(main.source_ranges,old.source_ranges);
for(const r of old.source_ranges??[]){
  const found=candidate.source_ranges.find(v=>v.ref===r.ref&&v.version_id===r.version_id&&v.from===r.from&&v.to===r.to);assert.deepEqual(found,r);
}
const differences=old.units.map(u=>{const raw=fs.readFileSync(path.join(workspace,u.draft));return{unit:u.unit,draft:u.draft,before_sha256:u.sha256,candidate_sha256:sha(raw),changed:sha(raw)!==u.sha256};});
assert(differences.some(v=>v.changed));assert(!differences.some(v=>v.unit<=12&&v.changed));
assert(fs.existsSync(path.join(x,'交接-E首停.md')));
const archive=path.join(x,'originals/e-first-stop-candidate');assert(!fs.existsSync(archive));
const archived=[];
for(const ref of new Set(['.writer/state.json',...old.units.map(u=>u.draft)])){
  const raw=fs.readFileSync(path.join(workspace,ref)),to=path.join(archive,ref);fs.mkdirSync(path.dirname(to),{recursive:true});fs.writeFileSync(to,raw,{flag:'wx'});archived.push({file:ref,bytes:raw.length,sha256:sha(raw)});
}
for(const d of differences)assert.equal(archived.find(v=>v.file===d.draft)?.sha256,d.candidate_sha256);
assert.deepEqual(fs.readFileSync(path.join(p,'.writer/state.json')),mainRaw);
assert.deepEqual(fs.readFileSync(path.join(workspace,'.writer/state.json')),candidateRaw);
fs.writeFileSync(path.join(x,'parent-e-first-stop-main-state.json'),mainRaw,{flag:'wx'});
fs.writeFileSync(path.join(x,'parent-e-first-stop-candidate-state.json'),candidateRaw,{flag:'wx'});
const out={ok:true,at:new Date().toISOString(),scope:'actual E first stop only; main36 intact/candidate18, no commit or full-tail completion claimed',handle_ref:'cli-logs/e-begin/stdout.raw.txt',id:handle.id,owner:handle.owner,workspace,base_revision:handle.base_revision,main_revision:main.revision,candidate_revision:candidate.revision,main_state_sha256:sha(mainRaw),candidate_state_sha256:sha(candidateRaw),main_units:36,candidate_units:18,protected_prefix:12,main_36_complete_units_and_snapshot_unchanged:true,source_versions:versions,source_ranges:old.source_ranges,differences,archive,archived,pre_revision_manifest:'pre-revision36.json',pre_revision_body_han:before.body_han};
fs.writeFileSync(path.join(x,'e-first-verification.json'),JSON.stringify(out,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({ok:true,main_units:36,candidate_units:18,id:handle.id,source_versions:versions.map(v=>v.id),changed_candidate_units:differences.filter(v=>v.changed).map(v=>v.unit)}));
