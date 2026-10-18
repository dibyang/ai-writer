import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { root, batch, stage, work, load, state, sha, put } from './helpers.mjs';
const canonical=x=>Array.isArray(x)?x.map(canonical):x&&typeof x==='object'?Object.fromEntries(Object.keys(x).sort().map(k=>[k,canonical(x[k])])):x;
const content=s=>{const x=structuredClone(s);for(const e of Object.values(x.ledger))delete e.evidence;return x;};
const old=load(path.join(stage,'before/work/.writer/state.json')),current=state();
const cb=sha(JSON.stringify(canonical(content(old.snapshot)))),ca=sha(JSON.stringify(canonical(content(current.snapshot))));
assert.equal(cb,ca);
const equivalence={basis:'Deep strict field equality; canonical hash recursively sorts object keys and preserves array order; original JSON.stringify hashes remain as observed serialization hashes',before_canonical_sha256:cb,after_canonical_sha256:ca,canonical_hashes_equal:true,ledger:Object.entries(old.snapshot.ledger).map(([id,e])=>{const {evidence,...b}=e,{evidence:ignored,...a}=current.snapshot.ledger[id];const before=sha(JSON.stringify(canonical(b))),after=sha(JSON.stringify(canonical(a)));assert.equal(before,after);return {id,before_canonical_sha256:before,after_canonical_sha256:after,equal:true};})};
put(path.join(stage,'fact-equivalence.json'),equivalence);
for(const name of ['verification.json','handoff.json']){
 const file=path.join(stage,name),bytes=fs.readFileSync(file);put(path.join(stage,'delivery-draft',name),bytes.toString('utf8'));
 const value=JSON.parse(bytes);value.facts.canonical_equivalence=equivalence;
 fs.writeFileSync(file,JSON.stringify(value,null,2)+'\n');
}
const commandIndex=load(path.join(stage,'command-index.json'));
let evidence='';
for(const c of commandIndex.commands)for(const name of ['stdout.raw.txt','stderr.raw.txt','result.json'])evidence+=fs.readFileSync(c.files[name].path,'utf8');
evidence+=fs.readFileSync(path.join(stage,'before/work/.writer/state.json'),'utf8');
const reportFile=path.join(stage,'report.md'),report=fs.readFileSync(reportFile,'utf8');
const reportHashes=[...new Set(report.match(/\b[a-f0-9]{64}\b/g)??[])];
const absent=reportHashes.filter(h=>!evidence.includes(h));assert.deepEqual(absent,[]);
const broken=[];
for(const m of report.matchAll(/\]\(([^)]+)\)/g)){if(!m[1].startsWith('http')&&!fs.existsSync(path.resolve(stage,m[1])))broken.push(m[1]);}
assert.deepEqual(broken,[]);
const files=['report.md','handoff.json','verification.json','command-index.json','fact-equivalence.json','reading-coverage.json'];
const outputs=Object.fromEntries(files.map(name=>{const b=fs.readFileSync(path.join(stage,name));return [name,{bytes:b.length,sha256:sha(b)}];}));
const git=spawnSync('git',['status','--short'],{cwd:root,encoding:'utf8',windowsHide:true});
put(path.join(stage,'auxiliary-final-git-status.stdout.txt'),git.stdout);
put(path.join(stage,'auxiliary-final-git-status.stderr.txt'),git.stderr);
put(path.join(stage,'auxiliary-final-git-status.result.json'),{exe:'git',args:['status','--short'],cwd:root,exit_code:git.status,nature:'read-only workspace status; not a commit or staging operation'});
assert.equal(git.status,0);
assert.equal(sha(fs.readFileSync(path.join(work,'.writer/state.json'))),'51abac397d9928eaa2df460646d67128ac956ed9cc0f427bf20711840220c523');
put(path.join(stage,'delivery-integrity.json'),{generated_at:new Date().toISOString(),outputs,report_hashes_checked:reportHashes.length,all_report_hashes_found_in_actual_capture_or_old_state:true,broken_links:broken,required_outputs_present:true,state_unchanged_since_pause:true,no_additional_product_calls:true,product_command_count:32});
console.log(JSON.stringify({canonical_fact_hash:ca,artifacts:outputs,report_hashes_checked:reportHashes.length,broken_links:broken,state_revision:current.revision,stage:current.governance.stage},null,2));
