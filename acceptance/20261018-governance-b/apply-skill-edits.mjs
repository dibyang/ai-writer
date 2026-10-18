import fs from 'node:fs';
import crypto from 'node:crypto';
const edits = JSON.parse(fs.readFileSync('acceptance/20261018-governance-b/skill-edits.json'));
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
for (const e of edits) if (sha(e.ref) !== e.before_sha256 || sha(e.staged) !== e.after_sha256) throw Error(`Concurrent skill edit: ${e.ref}`);
for (const e of edits) fs.copyFileSync(e.staged, e.ref);
console.log(JSON.stringify({ ok: true, files: edits.map(e => ({ file: e.ref, sha256: sha(e.ref) })) }));
