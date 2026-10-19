import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const base=path.dirname(fileURLToPath(import.meta.url));
const read=ref=>JSON.parse(fs.readFileSync(path.join(base,ref),'utf8'));
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const commit='27a20edd7db6234a6651d647d5c626808e45cd24';
const ci=read('ci-release-gate.json').data,jobs=read('ci-09.json').data.jobs;
assert.equal(ci.head_sha,commit);assert.equal(ci.conclusion,'success');assert.equal(jobs.length,4);
assert.deepEqual(jobs.map(x=>x.name).sort(),['workspace (ubuntu-latest, 20)','workspace (ubuntu-latest, 24)','workspace (windows-latest, 20)','workspace (windows-latest, 24)']);
for(const job of jobs){assert.equal(job.conclusion,'success');for(const name of ['Run npm test','Run npm run doctor','Run npm run test:engine'])assert.equal(job.steps.find(x=>x.name===name)?.conclusion,'success');}
const dir=path.join(base,'delivery-v2'),manifest=read('delivery-v2/release-manifest.json');
assert.deepEqual(manifest.source_provenance,{source_commit:commit,dirty:false});
for(const line of fs.readFileSync(path.join(dir,'SHA256SUMS.txt'),'utf8').trim().split('\n')){const [expected,file]=line.split(/  /);assert.equal(sha(fs.readFileSync(path.join(dir,file))),expected);}
const checks={};
for(const label of ['final-build-v2','final-zip-verify-v2','final-package-tests-v2','final-package-doctor-v2','final-package-engine-v2','final-package-smoke-v2']){const r=read(`commands/${label}/result.json`);assert.equal(r.exit_code,0,label);checks[label]=r;}
const stdout=label=>fs.readFileSync(path.join(base,`commands/${label}/stdout.raw.txt`),'utf8');
assert.match(stdout('final-package-tests-v2'),/(?:ℹ|#) fail 0/);
assert.match(stdout('final-package-engine-v2'),/(?:ℹ|#) pass 29/);
const smokeText=stdout('final-package-smoke-v2'),smoke=JSON.parse(smokeText.slice(smokeText.indexOf('{\n')));
assert.equal(smoke.ok,true);assert.equal(smoke.mechanical.ok,true);
const smokeSnapshot=path.join(base,'smoke-final');assert.ok(!fs.existsSync(smokeSnapshot));fs.cpSync(path.dirname(smoke.project),smokeSnapshot,{recursive:true,errorOnExist:true,force:false});
const receipt={ok:true,at:new Date().toISOString(),commit,ci_run:ci.html_url,ci_jobs:jobs.map(x=>({id:x.id,name:x.name,conclusion:x.conclusion})),source_provenance:manifest.source_provenance,content_id:manifest.content_id,zip_sha256:sha(fs.readFileSync(path.join(dir,'ai-writer-0.8.0.zip'))),files:manifest.files.length+1,checks,scope:'Final ZIP actual CLI and regression; existing historical hundred-chapter evidence remains bound to its original builds. No author works modified.'};
fs.writeFileSync(path.join(base,'final-verification.json'),JSON.stringify(receipt,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify(receipt));
