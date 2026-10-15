import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
const project = new URL('../works/停电以后/', import.meta.url);
const out = new URL('../exports/停电以后-v1/', import.meta.url);
const hash = b => createHash('sha256').update(b).digest('hex');
const json = url => JSON.parse(readFileSync(url, 'utf8'));
const manifest = json(new URL('manifest.json', out));
const state = json(new URL('.writer/state.json', project));
const evidence = json(new URL('final-evidence.json', import.meta.url));
const manuscript = readFileSync(new URL('manuscript.md', out));
assert.equal(hash(manuscript), manifest.sha256);
assert.equal(manifest.kind, 'screenplay');
assert.equal(manifest.revision, state.revision);
assert.equal(manifest.revision, evidence.revision);
assert.equal(manifest.status, 'draft-export');
assert.equal(manifest.quality_review, 'required');
assert.deepEqual(manifest.units.map(u => u.unit), [1, 2, 3]);
const parts = manuscript.toString('utf8').trim().split('\n\n---\n\n');
assert.equal(parts.length, 3);
for (const [i, unit] of manifest.units.entries()) {
  const bytes = readFileSync(new URL(unit.draft, project));
  assert.equal(hash(bytes), unit.sha256);
  assert.equal(unit.sha256, state.units[i].sha256);
  assert.equal(parts[i].trim(), bytes.toString('utf8').trim());
  for (const [ref, sha] of Object.entries(unit.source_hashes)) {
    if (ref === '.writer/state.json') continue; // historical consumed state, not current state
    assert.equal(hash(readFileSync(new URL(ref, project))), sha, `source drift: ${ref}`);
  }
}
for (const [ref, sha] of Object.entries(evidence.source_hashes)) assert.equal(hash(readFileSync(new URL(ref, project))), sha);
for (const [source, target] of [['../works/停电以后/审查/全剧-20261015.md', '自检报告.md'], ['final-evidence.json', 'final-evidence.json'], ['observations.md', 'observations.md']]) {
  assert.equal(hash(readFileSync(new URL(source, import.meta.url))), hash(readFileSync(new URL(target, out))));
}
const report = readFileSync(new URL('自检报告.md', out), 'utf8');
for (const [ref, sha] of Object.entries(evidence.source_hashes)) assert.ok(report.includes(ref) && report.includes(sha), `report does not bind source: ${ref}`);
const logs = readdirSync(new URL('./', import.meta.url)).filter(n => /^\d{2}-.+\.json$/u.test(n)).sort().map(n => ({ file: n, ...json(new URL(n, import.meta.url)) }));
assert.equal(logs.length, 37);
assert.ok(logs.every(log => log.exit_code === 0));
const artifacts = Object.fromEntries(readdirSync(out).filter(n => n !== 'delivery-verification.json').sort().map(n => [n, hash(readFileSync(new URL(n, out)))]));
const result = { ok: true, checked: new Date().toISOString(), revision: state.revision, units: 3, cli_calls: logs.length, cli_exit_codes: [...new Set(logs.map(log => log.exit_code))], manuscript_sha256: manifest.sha256, exact_unit_order_and_content: true, consumed_sources_current_except_historical_state: true, report_binds_all_current_sources: true, companion_copies_identical: true, totals: evidence.totals, artifact_sha256: artifacts, scope: 'mechanical consistency only; manual informed review is a separate report; no rehearsal or filming' };
writeFileSync(new URL('delivery-verification.json', import.meta.url), JSON.stringify(result, null, 2) + '\n', 'utf8');
writeFileSync(new URL('delivery-verification.json', out), JSON.stringify(result, null, 2) + '\n', 'utf8');
process.stdout.write(JSON.stringify(result, null, 2) + '\n');
