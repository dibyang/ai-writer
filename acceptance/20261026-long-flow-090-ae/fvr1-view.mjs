import fs from'node:fs';import path from'node:path';import{fileURLToPath}from'node:url';
const a=path.dirname(fileURLToPath(import.meta.url)),[kind,unitArg]=process.argv.slice(2),unit=Number(unitArg),read=f=>JSON.parse(fs.readFileSync(f,'utf8'));
if(kind==='replay'){
  const c=read(path.join(a,'fvr1-private-ownership.json')),x=read(path.join(c.workspace,`.writer/drafts/fvr1-replay-u${unit}-original.json`)),b=read(path.join(a,'fvr1-baseline.json')).units.find(x=>x.unit===unit);
  console.log(JSON.stringify({unit:x.unit,expected_revision:x.expected_revision,draft:x.draft,identity:x._replay,source_changes:Object.entries(x.source_hashes).filter(([k,v])=>v!==b.source_hashes[k]).map(([ref,current_sha256])=>({ref,old_sha256:b.source_hashes[ref],current_sha256})),source_bindings:x.source_bindings,summary:x.summary,changes:x.changes},null,2));
}else if(kind==='preview'){
  const x=read(path.join(a,'cli-logs',`fvr1-preview-u${unit}`,'stdout.txt'));
  const{changes,...rest}=x;
  console.log(JSON.stringify({...rest,changes_count:changes?.length,change_paths:changes?.map(x=>x.at.join('/'))},null,2));
}else throw Error('Explicit replay or preview view');
