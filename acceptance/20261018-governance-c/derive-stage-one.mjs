import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {BASE,sha,write} from './cli-support.mjs';
const handoff=JSON.parse(fs.readFileSync(path.join(BASE,'native-create-review/handoff.json'))),records=[];
for(const label of fs.readdirSync(path.join(BASE,'commands')).filter(x=>x.startsWith('native-one-'))){const dir=path.join(BASE,'commands',label),meta=JSON.parse(fs.readFileSync(path.join(dir,'result.json'))),file=path.join(dir,'after-state.json');if(!fs.existsSync(file))continue;const bytes=fs.readFileSync(file),s=JSON.parse(bytes);if(s.revision===handoff.revision&&s.units.length===6){assert.equal(sha(bytes),meta.after_state_sha256);records.push({label,meta,bytes,state:s});}}
records.sort((a,b)=>a.meta.started_at.localeCompare(b.meta.started_at));const last=records.at(-1);assert.ok(last);assert.equal(last.state.schema_version,5);assert.ok(Object.values(last.state.review_workflow.issues).every(i=>i.status==='open'));
write(path.join(BASE,'parent-audit/stage-one-state.raw.json'),last.bytes);
write(path.join(BASE,'parent-audit/stage-one-lineage.json'),{scope:'Derived copy from already completed immutable capture, not current live work; no old evidence overwritten',project:handoff.project,revision:last.state.revision,source:`commands/${last.label}/after-state.json`,state_sha256:sha(last.bytes),guard:last.meta.build_before?.runtime_guard_id??null,units:last.state.units.map(u=>({unit:u.unit,draft:u.draft,sha256:u.sha256,tool_build_id:u.tool_build_id}))});
console.log(JSON.stringify({ok:true,revision:last.state.revision,units:last.state.units.length,source:last.label}));
