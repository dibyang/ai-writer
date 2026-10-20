import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import assert from 'node:assert/strict';
const base=path.resolve('acceptance/20261020-release-readiness-090-u'),root=path.join(base,'scenario-final/东岸末班船');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const b=fs.readFileSync(path.join(root,'.writer/state.json')),s=JSON.parse(b);
const write=(name,value)=>fs.writeFileSync(path.join(base,name),JSON.stringify(value,null,2)+'\n',{flag:'wx'});
write('final-f-current-tracking.json',s.snapshot);
write('final-f-current-units.json',s.units);
write('final-f-state-structure.json',{state_sha256:sha(b),keys:Object.keys(s),review:s.reviews,workflow:s.workflow});
const files=[];function walk(p){for(const d of fs.readdirSync(p,{withFileTypes:true})){const f=path.join(p,d.name);if(d.isDirectory())walk(f);else if(d.isFile()){const q=fs.readFileSync(f);files.push({path:path.relative(root,f).replaceAll('\\','/'),sha256:sha(q),bytes:q.length});}}}
walk(root);write('final-f-entry-file-inventory.json',files);
console.log(JSON.stringify({revision:s.revision,state_sha256:sha(b),keys:Object.keys(s),units:s.units.map(u=>({unit:u.unit,draft:u.draft,keys:Object.keys(u)})),snapshot_keys:Object.keys(s.snapshot),records:files.filter(f=>/commits\/|journal\/|审查\//.test(f.path)).map(f=>f.path)},null,2));
const identify=JSON.parse(fs.readFileSync(path.join(base,'final-f-commands/05-identify/stdout.txt'))),zip=JSON.parse(fs.readFileSync(path.join(base,'zip-delivery-verification.json')));
assert.equal(identify.observed_content_id,zip.content_id);assert.equal(identify.missing.length,0);assert.equal(identify.mismatches.length,0);
write('final-f-build-verification.json',{ok:true,revision:s.revision,zip_content_id:zip.content_id,observed_content_id:identify.observed_content_id,generation:s.tool_control?.generation??s.tool?.generation,installed:s.tool_control?.installed??s.tool?.installed??null,entry:path.join(root,'.writer/tool/bin/ai-writer.mjs')});
