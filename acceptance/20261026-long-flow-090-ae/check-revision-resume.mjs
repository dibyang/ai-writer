import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const here=path.dirname(fileURLToPath(import.meta.url));
const [label,checkpointName]=process.argv.slice(2);
assert(/^[a-z][a-z0-9-]*$/.test(label??''));
assert(/^checkpoint-[a-z0-9-]+\.json$/.test(checkpointName??''));
const checkpointPath=path.join(here,checkpointName),cp=JSON.parse(fs.readFileSync(checkpointPath));
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const inside=p=>{const rel=path.relative(here,path.resolve(p));assert(rel&&!rel.startsWith('..')&&!path.isAbsolute(rel));};
inside(cp.project);inside(cp.main);assert.notEqual(path.resolve(cp.project),path.resolve(cp.main));
const bytes=fs.readFileSync(path.join(cp.project,'.writer/state.json')),mainBytes=fs.readFileSync(path.join(cp.main,'.writer/state.json'));
assert.equal(sha(bytes),cp.state_sha256);assert.equal(sha(mainBytes),cp.main_state_sha256);
const state=JSON.parse(bytes),main=JSON.parse(mainBytes);
assert.equal(state.units.length,cp.registered_units);assert.equal(state.revision,cp.revision);assert.equal(main.revision,cp.main_revision);
let verified=0;
for(const [ref,item] of Object.entries(cp.files)){
 const absolute=path.resolve(cp.project,ref),rel=path.relative(cp.project,absolute);assert(rel&&!rel.startsWith('..')&&!path.isAbsolute(rel));
 const st=fs.lstatSync(absolute);assert(st.isFile()&&!st.isSymbolicLink());const b=fs.readFileSync(absolute);
 assert.equal(b.length,item.bytes,ref);assert.equal(sha(b),item.sha256,ref);verified++;
}
const receipt={ok:true,at:new Date().toISOString(),label,checkpoint:checkpointName,checkpoint_sha256:sha(fs.readFileSync(checkpointPath)),project:cp.project,main:cp.main,revision:state.revision,main_revision:main.revision,registered_units:state.units.length,state_sha256:sha(bytes),main_state_sha256:sha(mainBytes),verified_files:verified,note:'Read-only byte restoration check before any candidate mutation. Native resume identity is separately checked against public launch/events.'};
fs.writeFileSync(path.join(here,`revision-resume-${label}-verification.json`),JSON.stringify(receipt,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify(receipt));
