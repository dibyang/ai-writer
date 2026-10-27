import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const base=path.dirname(fileURLToPath(import.meta.url));
const project=JSON.parse(fs.readFileSync(path.join(base,'project.json'))).project;
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const read=n=>JSON.parse(fs.readFileSync(path.join(base,n)));
const s=JSON.parse(fs.readFileSync(path.join(project,'.writer/state.json'))),cp=read('checkpoint-d-entry.json');
assert.equal(s.revision,285);assert.equal(s.units.length,57);assert.equal(sha(fs.readFileSync(path.join(project,'.writer/state.json'))),cp.state_sha256);
const checks=Object.entries(cp.files).map(([ref,v])=>({ref,match:sha(fs.readFileSync(path.join(project,ref)))===v.sha256}));
assert(checks.every(x=>x.match));
const status=read('cli-logs/d-entry-status/stdout.txt'),check=read('cli-logs/d-entry-check/stdout.txt'),doctor=read('cli-logs/d-entry-doctor/stdout.txt'),discussion=read('cli-logs/d-entry-discussion/stdout.txt');
assert(status.ok&&check.ok&&doctor.ok&&discussion.ok);assert.equal(s.tool_control.generation,7);assert.equal(doctor.build.observed_content_id,cp.content_id);
assert.equal(status.changed_sources.length+status.stale_units.length+status.impact_pending.length,0);
assert(status.revisions.sessions.every(x=>x.status==='committed'));
const previous=read('cli-logs/ccr-final-check/stdout.txt');
assert.deepEqual(check.draft_inventory,previous.draft_inventory);
const failures=[{kind:'read-input',target:'大纲/单元/0058.json',reason:'not created yet; no mutation'},{kind:'auxiliary-query',error:'TypeError x.files.slice is not a function',reason:'checkpoint files is a keyed object; corrected here using Object.entries; state untouched'},{kind:'auxiliary-query',error:'SyntaxError Unexpected token }',reason:'one extra inline brace; corrected by saved script; state untouched'}];
const out={ok:true,at:new Date().toISOString(),revision:s.revision,units:s.units.length,state_sha256:cp.state_sha256,generation:7,content_id:cp.content_id,runtime_id:doctor.build.runtime_id,checked_files:checks.length,mismatches:checks.filter(x=>!x.match),changed_sources:status.changed_sources,stale_units:status.stale_units,impact_pending:status.impact_pending,revisions:status.revisions.sessions.map(x=>({id:x.id,status:x.status})),transactions:status.revisions.transactions,inventory:check.draft_inventory,unknown_inventory:[],failures};
fs.writeFileSync(path.join(base,'d-entry-audit.json'),JSON.stringify(out,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({ok:true,files:checks.length,revision:s.revision,units:s.units.length,transactions:status.revisions.transactions,inventory_unchanged:true},null,2));
for(const [n,needles] of [[51,['大白纸','细枝，左边空着']],[52,['女人的旧照片和新拍背面','旧照片']],[35,['十四','十八']]]){
 const u=s.units[n-1],t=fs.readFileSync(path.join(project,u.draft),'utf8');
 console.log(JSON.stringify({unit:n,draft:u.draft,pages:Math.ceil(t.length/1800),locations:needles.map(k=>({phrase:k,page:t.indexOf(k)<0?null:Math.floor(t.indexOf(k)/1800)+1}))}));
}
