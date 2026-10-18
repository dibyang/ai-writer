import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
const base = path.resolve('acceptance/20261018-governance-a');
const report = fs.readFileSync(path.join(base, 'README.md'), 'utf8');
const links = [...report.matchAll(/\]\(([^)]+)\)/g)].map(x => x[1]);
for (const ref of links) {
  if (ref === 'evidence-manifest.json') continue; // Created by the final, non-overwriting seal step.
  assert.ok(fs.existsSync(path.resolve(base, ref)), `Missing report link: ${ref}`);
}
assert.equal(JSON.parse(fs.readFileSync(path.join(base, 'final-verification.json'))).ok, true);
assert.equal(execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(), '36bd9c27797a43dd958e74b4e4b8f5b9713e140a');
assert.equal(execFileSync('git', ['diff', '--cached', '--name-only'], { encoding: 'utf8' }).trim(), '');
execFileSync('git', ['diff', '--check'], { encoding: 'utf8' });
console.log(JSON.stringify({ ok: true, report_links: links.length, head_unchanged: true, staged_files: 0, diff_check: true }));
console.log(execFileSync('git', ['status', '--short'], { encoding: 'utf8' }));
