import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import assert from 'node:assert/strict';
const A=path.resolve('acceptance/20261026-long-flow-090-ae'),read=f=>JSON.parse(fs.readFileSync(f,'utf8')),sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const c=read(path.join(A,'b-complete.json')),cp=read(c.checkpoint.manifest.path),P=c.project;
for(const [ref,m] of Object.entries(cp.files)){const b=fs.readFileSync(path.join(P,ref));assert.equal(b.length,m.bytes,ref);assert.equal(sha(b),m.sha256,ref);}
for(const m of [c.handoff,c.checkpoint.manifest,c.checkpoint.state,...c.commands.flatMap(x=>[x.result_file,x.stdout,x.stderr])]){const b=fs.readFileSync(m.path);assert.equal(b.length,m.bytes);assert.equal(sha(b),m.sha256,m.path);}
assert.equal(c.main.state_sha256,cp.state_sha256);assert.equal(sha(fs.readFileSync(path.join(P,'.writer/state.json'))),cp.state_sha256);
const result={ok:true,at:new Date().toISOString(),main:66,revision:367,checkpoint_files_verified:Object.keys(cp.files).length,raw_command_streams_verified:c.commands.length*2,handoff_sha256:c.handoff.sha256,b_complete_sha256:sha(fs.readFileSync(path.join(A,'b-complete.json'))),project_unchanged_since_checkpoint:true,scope:'Local final deliverable byte verification only; does not assert native process exit or root approval.'};
fs.writeFileSync(path.join(A,'b-delivery-final-integrity.json'),JSON.stringify(result,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify(result));
