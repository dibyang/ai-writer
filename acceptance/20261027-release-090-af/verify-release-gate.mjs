import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const base=path.dirname(fileURLToPath(import.meta.url));
const read=f=>JSON.parse(fs.readFileSync(path.join(base,f),'utf8'));
const commit='01df489d9d83e0e4bbd14d13b49c3b2f3492caae';
const ci=read('ci-release-gate.json').data,jobs=read('ci-six-jobs-complete.json').jobs;
assert.equal(ci.head_sha,commit);assert.equal(ci.conclusion,'success');assert.equal(jobs.length,6);
assert.deepEqual(jobs.map(x=>x.name).sort(),['macos-latest','ubuntu-latest','windows-latest'].flatMap(os=>[20,24].map(n=>`workspace (${os}, ${n})`)).sort());
for(const j of jobs){assert.equal(j.conclusion,'success');for(const n of ['Run npm test','Run npm run doctor','Run npm run test:engine'])assert.equal(j.steps.find(s=>s.name===n)?.conclusion,'success');}
const checks={};
for(const label of ['final-build-corrected','final-package-corrected-tests','final-package-doctor','final-package-engine','final-package-smoke']){const r=read(`commands/${label}/result.json`);assert.equal(r.exit_code,0,label);checks[label]={exit_code:r.exit_code,elapsed_ms:r.elapsed_ms};}
const stdout=label=>fs.readFileSync(path.join(base,`commands/${label}/stdout.raw.txt`),'utf8');
assert.match(stdout('final-package-corrected-tests'),/(?:#|ℹ) fail 0/);
assert.match(stdout('final-package-engine'),/(?:#|ℹ) pass 29/);
const smoke=JSON.parse(stdout('final-package-smoke'));assert.equal(smoke.ok,true);assert.equal(smoke.mechanical.ok,true);
const payload=read('package-payload-verification.json');assert.equal(payload.ok,true);assert.equal(payload.source.source_commit,commit);assert.equal(payload.source.dirty,false);
const result={ok:true,at:new Date().toISOString(),commit,ci_url:ci.html_url,jobs:jobs.map(j=>({name:j.name,id:j.id,conclusion:j.conclusion})),checks,payload,zip_sha256:payload.zip_sha256,scope:'Final package regression and synthetic actual CLI flow. Full historical evidence retained locally; no existing author works modified.'};
fs.writeFileSync(path.join(base,'final-verification.json'),JSON.stringify(result,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify(result));
