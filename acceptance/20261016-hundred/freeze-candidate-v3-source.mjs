import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const base='acceptance/20261016-hundred',read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const origin=read(`${base}/candidate-v3-origin.json`),sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const files=origin.files.map(row=>{
 assert.equal(sha(row.file),row.sha256,'Main source changed while isolating candidate: '+row.file);
 return {...row,before_sha256:row.sha256,sha256:sha(path.join(origin.target,row.file))};
});
const changed=files.filter(r=>r.sha256!==r.before_sha256);
assert.deepEqual(changed.map(r=>r.file).sort(),['lib/longform.mjs','tests/longform.test.mjs']);
for(const row of read(`${base}/source-baseline-v2.json`).files)assert.equal(sha(row.file),row.sha256,'Active v2 baseline must remain intact');
const tests=read(`${base}/candidate-v3-validation/result.json`);assert(tests.ok&&tests.results.every(r=>r.exit_code===0));
const result={at:new Date().toISOString(),scope:'Source identity for isolated recall candidate; main remains v2',origin:'candidate-v3-origin.json',main_matches_origin:true,active_v2_matches:true,changed,files};
fs.writeFileSync(`${base}/candidate-v3-source.json`,JSON.stringify(result,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({ok:true,files:files.length,changed:changed.map(r=>r.file),main_unchanged:true}));
