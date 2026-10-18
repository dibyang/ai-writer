import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const root=process.cwd(),dest=path.join(root,'acceptance/20261018-governance-c/skill-edits'),sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const allowed=['.agents/skills/writer-project/SKILL.md','.agents/skills/writer-project/references/long-form.md','.agents/skills/writer-review/SKILL.md'];
const rows=JSON.parse(fs.readFileSync(path.join(dest,'manifest.json')));assert.deepEqual(rows.map(r=>r.ref),allowed);
for(const r of rows){assert.equal(sha(fs.readFileSync(path.join(root,r.ref))),r.before_sha256);assert.equal(sha(fs.readFileSync(path.join(dest,r.draft))),r.after_sha256);}
for(const r of rows)fs.writeFileSync(path.join(root,r.ref),fs.readFileSync(path.join(dest,r.draft)));
fs.writeFileSync(path.join(dest,'applied.json'),JSON.stringify({ok:true,files:rows.map(r=>({ref:r.ref,sha256:sha(fs.readFileSync(path.join(root,r.ref)))}))},null,2)+'\n',{flag:'wx'});console.log(JSON.stringify({ok:true,files:3}));
