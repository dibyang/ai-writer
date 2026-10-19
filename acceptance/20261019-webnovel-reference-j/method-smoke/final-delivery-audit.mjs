import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
const phase = path.dirname(fileURLToPath(import.meta.url));
const work = path.join(phase, 'work');
const repo = path.resolve(phase, '../../..');
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const json = name => JSON.parse(fs.readFileSync(path.join(phase, name), 'utf8'));
const baseline = json('boundary-before.json');
const prefix = 'acceptance/20261019-webnovel-reference-j/sources/package-0.7.7/';
const frozen = Object.entries(baseline.files).filter(([name]) => name.startsWith(prefix));
for (const [name, info] of frozen) assert.equal(hash(path.join(repo, name)), info.sha256, name);
const denied = json('denial-work-after.json');
for (const [name, sha256] of Object.entries(denied)) assert.equal(hash(path.join(work, name)), sha256, name);
assert.deepEqual(fs.readdirSync(path.join(work, '正文')), []);
const verification = json('verification.json');
assert.equal(hash(path.join(work, '.writer/state.json')), verification.state_sha256);
assert.equal(hash(path.join(phase, verification.review.file)), verification.review.sha256);
const files = {};
for (const name of ['REPORT.md', 'HANDOFF.md', 'commands.md', 'methods-read.json', 'sample-originals.json', 'verification.json', 'denial-comparison.json', 'boundary-comparison.json', 'audit-failure-note.md', 'verification-attempt-1-reproduced.json', 'verification-attempt-2-result.json', verification.review.file]) {
  const file = path.join(phase, name);
  files[name] = { bytes: fs.statSync(file).size, sha256: hash(file) };
  if (name.endsWith('.md')) {
    const content = fs.readFileSync(file, 'utf8');
    for (const match of content.matchAll(/\]\(([^)]+)\)/g)) assert.ok(fs.existsSync(path.resolve(path.dirname(file), match[1])), `${name}: broken link ${match[1]}`);
  }
}
const result = { at: new Date().toISOString(), ok: true, scope: 'Final delivery bytes and local links only', frozen_package_files_unchanged: frozen.length, original_work_files_since_denial_unchanged: Object.keys(denied).length, review_bytes_unchanged: true, body_file_count: 0, state_sha256: verification.state_sha256, revision: 3, note: 'Only the research-sample review was added to work after denial. Shared workspace differences remain recorded, not cleared.', files };
fs.writeFileSync(path.join(phase, 'final-delivery.json'), JSON.stringify(result, null, 2) + '\n', { flag: 'wx' });
process.stdout.write(JSON.stringify({ ok: true, final_artifacts_checked: Object.keys(files).length, frozen_files_unchanged: frozen.length, denial_baseline_files_unchanged: Object.keys(denied).length, body_file_count: 0, revision: 3 }, null, 2) + '\n');
