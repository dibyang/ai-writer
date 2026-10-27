import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const x=path.dirname(fileURLToPath(import.meta.url)),p=path.join(x,'scenario/东岸末班船-再扩展验证');
const sha=v=>crypto.createHash('sha256').update(v).digest('hex');
const j=f=>JSON.parse(fs.readFileSync(path.join(x,f),'utf8'));
const raw=fs.readFileSync(path.join(p,'.writer/state.json')),current=JSON.parse(raw);
assert.equal(current.units.length,36);assert.equal(current.governance.stage,'paused');
const controllerRef=fs.existsSync(path.join(x,'creation-controller-after-capacity.result.json'))?'creation-controller-after-capacity.result.json':'creation-controller.result.json';
assert(j(controllerRef).ok);
const histories=[['baseline-state.json',24],['parent-a-first-stop-state.json',25],['parent-before-b-state.json',27],['parent-b-first-stop-state.json',28],['parent-before-c-state.json',30],['parent-c-first-stop-state.json',31],['parent-before-d-state.json',33],['parent-d-first-stop-state.json',34]];
if(fs.existsSync(path.join(x,'parent-b-capacity-stop-state.json')))histories.push(['parent-b-capacity-stop-state.json',28]);
const results=[];
for(const [ref,count] of histories){
  const s=j(ref);assert.equal(s.units.length,count);
  assert.deepEqual(current.units.slice(0,count),s.units,ref+' full registered unit prefix drifted');
  for(const u of s.units)assert.equal(sha(fs.readFileSync(path.join(p,u.draft))),u.sha256);
  results.push({ref,revision:s.revision,registered_prefix:count,all_full_units_and_body_bytes_preserved:true});
}
const archives=[];
for(const letter of ['a','b','c','d']){
  const manifest=j(`parent-${letter}-first-stop-archive.json`);
  for(const f of manifest.files){
    assert.equal(sha(fs.readFileSync(path.join(manifest.archive,f.file))),f.sha256);
    assert.equal(sha(fs.readFileSync(path.join(p,f.file))),f.sha256,'Original first-stop file overwritten: '+f.file);
  }
  archives.push({letter,kind:'bodies-and-parts',files:manifest.files.length,archive_and_original_bytes_preserved:true});
  if(letter==='a')continue;
  const source=j('source-stop-'+letter+'.json');
  for(const f of source.files)assert.equal(sha(fs.readFileSync(path.join(source.archive,f.file))),f.sha256);
  archives.push({letter,kind:'sources-and-templates',files:source.files.length,archive_bytes_preserved:true,live_source_changes:'May legitimately differ after a new workflow or plan; exact stop bytes retained rather than refreshing old hashes.'});
}
if(fs.existsSync(path.join(x,'capacity-stop-b.json'))){
  const stop=j('capacity-stop-b.json');
  for(const f of stop.files){
    assert.equal(sha(fs.readFileSync(path.join(stop.archive,f.file))),f.sha256);
    if(f.file.startsWith('正文/')||f.file.startsWith('分段/'))assert.equal(sha(fs.readFileSync(path.join(p,f.file))),f.sha256,'Capacity-stop body/part overwritten: '+f.file);
  }
  archives.push({letter:'b',kind:'actual-capacity-interruption',files:stop.files.length,actual_failed_exit_code:stop.actual_exit_code,archive_and_original_body_part_bytes_preserved:true});
}
assert.deepEqual(fs.readFileSync(path.join(p,'.writer/state.json')),raw);
fs.writeFileSync(path.join(x,'pre-revision36-state.json'),raw,{flag:'wx'});
const proof={ok:true,at:new Date().toISOString(),scope:'creation-only prefix and raw stop preservation before any controlled revision; not literary acceptance',controller_completion:controllerRef,registered_units:36,revision:current.revision,state_sha256:sha(raw),histories:results,archives};
fs.writeFileSync(path.join(x,'creation-transition-verification.json'),JSON.stringify(proof,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({ok:true,registered_units:36,revision:current.revision,histories:results.length,archive_groups:archives.length}));
