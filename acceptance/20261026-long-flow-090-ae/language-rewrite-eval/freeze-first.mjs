import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const dir=path.dirname(fileURLToPath(import.meta.url)),ae=path.dirname(dir);
const j=f=>JSON.parse(fs.readFileSync(f));
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const run=path.join(ae,'native','language-rewrite-first');
const result=j(path.join(run,'result.json'));
assert.equal(result.exit_code,0);assert(result.thread_id);assert.equal(result.resumed_from,null);
const files={};
for(const rel of ['cases.json','first-review.md','first-drafts.json','first-manifest.json','first-handoff.md']){
  const bytes=fs.readFileSync(path.join(dir,rel));assert(bytes.length>0);files[rel]={sha256:sha(bytes),bytes:bytes.length};
}
const inputs=j(path.join(dir,'cases.json'));
assert.equal(inputs.cases.length,8);
const checkpoint={ok:true,at:new Date().toISOString(),thread_id:result.thread_id,native_exit_code:result.exit_code,native_elapsed_ms:result.elapsed_ms,files,native_result_sha256:sha(fs.readFileSync(path.join(run,'result.json'))),public_events_sha256:sha(fs.readFileSync(path.join(run,'events.public.jsonl'))),scope:'First-stop byte checkpoint only; semantic review and same-session reread remain required.',acceptance_complete:false};
fs.writeFileSync(path.join(dir,'first-root-checkpoint.json'),JSON.stringify(checkpoint,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify(checkpoint));
