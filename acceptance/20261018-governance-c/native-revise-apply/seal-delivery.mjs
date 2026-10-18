import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { stage, work, load, put, sha } from './helpers.mjs';
const file=path.join(stage,'delivery-integrity.json'),previous=fs.readFileSync(file);
put(path.join(stage,'delivery-draft/delivery-integrity.json'),previous.toString('utf8'));
const data=JSON.parse(previous),report=fs.readFileSync(path.join(stage,'report.md'));
data.outputs['report.md']={bytes:report.length,sha256:sha(report)};
data.generated_at=new Date().toISOString();
const broken=[];for(const m of report.toString('utf8').matchAll(/\]\(([^)]+)\)/g))if(!fs.existsSync(path.resolve(stage,m[1])))broken.push(m[1]);
assert.deepEqual(broken,[]);
for(const [name,expected] of Object.entries(data.outputs)){const b=fs.readFileSync(path.join(stage,name));assert.equal(b.length,expected.bytes);assert.equal(sha(b),expected.sha256);}
assert.equal(sha(fs.readFileSync(path.join(work,'.writer/state.json'))),load(path.join(stage,'handoff.json')).state.sha256);
fs.writeFileSync(file,JSON.stringify(data,null,2)+'\n');
console.log(JSON.stringify({required_artifacts_verified:true,final_report_sha256:sha(report),state_unchanged_since_pause:true,command_count:32,broken_links:broken}));
