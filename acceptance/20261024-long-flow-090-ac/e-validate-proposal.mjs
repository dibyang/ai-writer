import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const base=path.dirname(fileURLToPath(import.meta.url));
const read=f=>fs.readFileSync(path.join(base,f));
const json=f=>JSON.parse(read(f));
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const p=json('e-proposal.json'),a=json('e-preflight-audit.json');
assert.equal(p.proposals.length,3);assert.equal(new Set(p.proposals.map(i=>i.id)).size,3);
assert.deepEqual(p.proposals.map(i=>i.unit),[35,40,44]);
assert.equal(p.reading.main_range.pages,114);assert.equal(p.reading.earlier_pages,19);
assert.equal(p.issues.verified.length,6);assert.equal(p.issues.open_optional.length,13);
const refs=[];
for(const item of p.proposals){
 assert.equal(sha(fs.readFileSync(path.join(p.project,item.path))),item.current_sha256);
 for(const q of [...item.original_quotes,...item.downstream.flatMap(d=>d.quotes)]){
  const b=fs.readFileSync(path.join(p.project,q.path));assert.equal(sha(b),q.sha256);
  assert.equal(b.toString('utf8').split('\n')[q.line-1],q.verbatim);
 }
 for(const s of [...item.source_strategy.changes,...(item.source_strategy.source_evidence||[])]){
  assert.equal(sha(fs.readFileSync(path.join(p.project,s.ref))),s.sha256);
  for(const c of s.direct_consumers)assert.equal(c.consumed_sha256,s.sha256);
  refs.push(s.ref);
 }
}
const now={};
function walk(dir){for(const d of fs.readdirSync(dir,{withFileTypes:true})){const f=path.join(dir,d.name);if(d.isDirectory())walk(f);else if(d.isFile()){const b=fs.readFileSync(f);now[path.relative(p.project,f).replaceAll('\\','/')]={bytes:b.length,sha256:sha(b)};}else throw Error('Nonregular file '+f);}}
walk(p.project);
const changed=[...new Set([...Object.keys(a.inventory),...Object.keys(now)])].filter(f=>JSON.stringify(a.inventory[f])!==JSON.stringify(now[f]));
assert.deepEqual(changed,[]);assert.equal(sha(fs.readFileSync(path.join(p.project,'.writer/state.json'))),p.baseline.state_sha256);
const files=['E受控修订提案.md','e-proposal.json','交接-E提案.md','e-final-readonly-proof.json'];
const result={at:new Date().toISOString(),scope:'delivery-integrity-only-not-revision-acceptance',ok:true,proposals:3,full_main_pages:114,earlier_pages:19,verified_issues:6,open_issues:13,source_refs_checked:[...new Set(refs)],project_inventory_files:Object.keys(now).length,project_changed:changed,files:files.map(f=>({path:f,bytes:read(f).length,sha256:sha(read(f))}))};
fs.writeFileSync(path.join(base,'e-delivery-verification.json'),JSON.stringify(result,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify(result,null,2));
