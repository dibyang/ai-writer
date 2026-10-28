import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import assert from 'node:assert/strict';import {fileURLToPath} from 'node:url';
const base=path.dirname(fileURLToPath(import.meta.url)),root=path.join(base,'work'),sha=b=>crypto.createHash('sha256').update(b).digest('hex'),read=p=>JSON.parse(fs.readFileSync(p));
const priorManifest=fs.readFileSync(path.resolve(base,'../20261027-long-0100-al/seal-files.json'));
assert.equal(sha(priorManifest),read(path.join(base,'bootstrap-verification.json')).source_manifest_sha256);
const prior=JSON.parse(priorManifest).filter(r=>r.file.startsWith('work/')),changed=[],missing=[];
for(const r of prior){const target=path.resolve(base,r.file);assert(target.startsWith(root+path.sep));if(!fs.existsSync(target)){missing.push(r.file);continue;}const b=fs.readFileSync(target);if(b.length!==r.bytes||sha(b)!==r.sha256)changed.push(r.file);}
assert.deepEqual(missing,[]);assert.deepEqual(changed,['work/.writer/state.json']);
const state=read(path.join(root,'.writer/state.json')),old=read(path.join(base,'commands/a-001-status/before-state.json'));
assert.equal(state.revision,480);assert.equal(state.units.length,120);assert.deepEqual(state.units.slice(0,118),old.units);
for(const [id,e] of Object.entries(old.snapshot.ledger))if(e.type==='observation')assert.deepEqual(state.snapshot.ledger[id],e);
const commands=fs.readdirSync(path.join(base,'commands')).sort().map(label=>{
 const p=path.join(base,'commands',label),m=read(path.join(p,'result.json'));
 const before=fs.readFileSync(path.join(p,'before-state.json')),after=fs.readFileSync(path.join(p,'after-state.json'));
 assert.equal(sha(before),m.before_state_sha256);assert.equal(sha(after),m.after_state_sha256);assert.equal(m.runtime_files_stable,true);
 if(m.input)assert.equal(sha(fs.readFileSync(path.join(p,'input.raw.json'))),m.input.sha256);
 return {label,exit_code:m.exit_code,stderr_bytes:fs.statSync(path.join(p,'stderr.raw.txt')).size,stdout_bytes:fs.statSync(path.join(p,'stdout.raw.txt')).size,before_sha256:m.before_state_sha256,after_sha256:m.after_state_sha256,input_sha256:m.input?.sha256??null,elapsed_ms:m.elapsed_ms,runtime_stable:m.runtime_files_stable};
});
for(let i=1;i<commands.length;i++)assert.equal(commands[i].before_sha256,commands[i-1].after_sha256);
assert.equal(commands.at(-1).after_sha256,sha(fs.readFileSync(path.join(root,'.writer/state.json'))));
const units=state.units.map(u=>{const bytes=fs.readFileSync(path.join(root,u.draft));assert.equal(sha(bytes),u.sha256??u.draft_sha256);const body=bytes.toString('utf8').replace(/^#.*\r?\n/u,'');return {unit:u.unit,draft:u.draft,sha256:sha(bytes),han:(body.match(/\p{Script=Han}/gu)||[]).length};});
assert(units.slice(-2).every(u=>u.han>=4200));
const reading=[103,109,114,115,116,117,118,119,120].map(n=>units.find(u=>u.unit===n));
const review=read(path.join(root,'.writer/reviews/66f775cb-71ea-4f7e-880f-68e0b3f2bcad.json'));
const auth=fs.readFileSync(path.join(root,'研究/AN轮真实用户授权.md'));
for(const n of [119,120]){
 const a=read(path.join(root,`研究/AN-a-record${n}.json`)),p=read(path.join(base,`commands/a-${n===119?'016-preview119':'021-preview120'}/stdout.raw.txt`));
 assert.equal(p.ok,true);assert.deepEqual(p.findings,[]);assert.equal(p.source_hashes,'matched-current-context');
 assert.equal(a.draft_review.draft_sha256,units.find(u=>u.unit===n).sha256);assert.equal(a.draft_review.report_sha256,sha(fs.readFileSync(path.join(root,a.draft_review.report))));
 const snap=read(path.join(base,`commands/a-${n===119?'017-record119':'022-record120'}/before-state.json`)).snapshot;
 for(const name of ['沈禾','顾遥'])assert(a.changes.characters[name].endsWith(snap.characters[name]));
}
const quoteEvidence=read(path.join(root,'研究/AN-a-workflow-draft.json')).author_evidence;assert.equal(sha(auth),quoteEvidence.source_sha256);assert(auth.toString('utf8').includes(quoteEvidence.quote));
const out={ok:true,revision:state.revision,units:units.length,next_unit:121,state_sha256:sha(fs.readFileSync(path.join(root,'.writer/state.json'))),baseline_files_checked:prior.length,baseline_files_unchanged:prior.length-1,baseline_files_changed:changed,baseline_missing:missing,old_118_unit_records_unchanged:true,all_120_draft_hashes_matched:true,all_old_observations_unchanged:true,character_history_suffix_preserved:true,author_source_sha256:sha(auth),reading,commands,product_failures:commands.filter(c=>c.exit_code!==0),review_ref:'.writer/reviews/66f775cb-71ea-4f7e-880f-68e0b3f2bcad.json',review_record_sha256:sha(fs.readFileSync(path.join(root,'.writer/reviews/66f775cb-71ea-4f7e-880f-68e0b3f2bcad.json'))),new_units:units.slice(-2),scope:'AN copied inventory compared with AL seal manifest; did not enumerate or write actual works or Git; old seal manifest read only',literary_acceptance:false};
fs.writeFileSync(path.join(base,'session-a-final-audit.json'),JSON.stringify(out,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify({ok:out.ok,revision:out.revision,baseline_files_checked:out.baseline_files_checked,changed,new_units:out.new_units,product_failures:out.product_failures.map(x=>({label:x.label,exit:x.exit_code}))}));
