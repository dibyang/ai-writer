import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const x=path.dirname(fileURLToPath(import.meta.url)),p=path.join(x,'scenario/东岸末班船-再扩展验证');
const sha=v=>crypto.createHash('sha256').update(v).digest('hex');
const raw=fs.readFileSync(path.join(p,'.writer/state.json')),s=JSON.parse(raw);
assert.equal(s.units.length,36);assert.equal(s.governance.stage,'paused');
assert.deepEqual(s.governance.authorization.allowed_actions,['discuss']);
assert.equal(s.governance.authorization.draft_range,null);assert.equal(s.governance.authorization.revise_range,null);
assert.deepEqual(raw,fs.readFileSync(path.join(x,'pre-revision36-state.json')));
const archive=path.join(x,'originals/e-main36'),selected=new Set(['.writer/state.json','writer.json']);
assert(!fs.existsSync(archive));
for(const u of s.units){selected.add(u.draft);for(const ref of Object.keys(u.source_hashes??{}))selected.add(ref);if(u.draft_review?.frozen_ref)selected.add(u.draft_review.frozen_ref);}
for(const v of Object.values(s.source_versions??{}))selected.add(v.object_ref);
const all=[];
function walk(dir,ref=''){
  for(const n of fs.readdirSync(dir).sort()){
    const file=path.join(dir,n),r=ref?ref+'/'+n:n,stat=fs.lstatSync(file);assert(!stat.isSymbolicLink());
    if(stat.isDirectory())walk(file,r);
    else{
      assert(stat.isFile());const v=fs.readFileSync(file);all.push({file:r,bytes:v.length,sha256:sha(v)});
      if(['设定','大纲','研究'].some(prefix=>r.startsWith(prefix+'/')))selected.add(r);
    }
  }
}
walk(p);
const archived=[];
for(const ref of [...selected].sort()){
  assert(!path.isAbsolute(ref));
  const from=path.resolve(p,ref);assert(from.startsWith(path.resolve(p)+path.sep));
  const v=fs.readFileSync(from),dest=path.join(archive,ref);
  fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,v,{flag:'wx'});
  archived.push({file:ref,bytes:v.length,sha256:sha(v)});
}
const units=s.units.map(u=>{
  const v=fs.readFileSync(path.join(p,u.draft));assert.equal(sha(v),u.sha256);
  return{unit:u.unit,draft:u.draft,sha256:u.sha256,body_han:[...v.toString('utf8').replace(/^#{1,6}.*$/gm,'').matchAll(/\p{Script=Han}/gu)].length};
});
const observations=Object.fromEntries(Object.entries(s.snapshot.ledger).filter(([,v])=>v.type==='observation').map(([id,v])=>[id,Object.fromEntries(['type','statement','author_truth'].map(k=>[k,v[k]]))]));
assert.deepEqual(fs.readFileSync(path.join(p,'.writer/state.json')),raw);
const proof={ok:true,at:new Date().toISOString(),scope:'actual current36 bytes archived before choosing or performing controlled revisions',revision:s.revision,state_sha256:sha(raw),units,body_han:units.reduce((n,u)=>n+u.body_han,0),observations,archive,archived_files:archived,all_project_files:all,external_sources:archived.filter(f=>!f.file.startsWith('正文/')&&f.file!=='.writer/state.json')};
fs.writeFileSync(path.join(x,'pre-revision36.json'),JSON.stringify(proof,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({ok:true,revision:s.revision,units:36,body_han:proof.body_han,archived_files:archived.length,all_project_files:all.length}));
