import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
const dir = path.dirname(fileURLToPath(import.meta.url)), root = path.resolve(dir, '../..');
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const candidate = read(path.join(dir, 'candidate-verified.json'));
const audit = read(path.join(dir, 'audits/repair-final.json'));
const summary = read(path.join(dir, 'campaign-summary-final.json'));
const validation = read(path.join(dir, 'validation-verified.json'));
const work = path.join(dir, 'works/潮汐信号');
const checks = [];
function check(name, ok) { checks.push({ name, ok: Boolean(ok) }); }
for (const row of candidate.files) check(`candidate:${row.file}`, hash(path.join(root, row.file)) === row.sha256);
for (const row of audit.drafts) check(`draft:${row.unit}`, hash(path.join(work, row.draft)) === row.sha256);
check('current-state', hash(path.join(work, '.writer/state.json')) === summary.phases.at(-1).state_sha256);
check('export', hash(path.join(dir, 'repair-final/export/manuscript.md')) === audit.export_sha256);
check('export-unchanged-by-knowledge-repair', audit.export_sha256 === hash(path.join(dir, 'session-f/export/manuscript.md')));
check('verified-regression', validation.commands.every(x => x.exit_code === 0) && !validation.changed_since_candidate.length);
check('verified-candidate-manifest', hash(path.join(dir, 'candidate-verified.json')) === validation.candidate_manifest_sha256);
for (const match of fs.readFileSync(path.join(dir, 'README.md'), 'utf8').matchAll(/\]\(([^)]+)\)/g)) {
  if (/^(?:https?:|#)/.test(match[1])) continue;
  check(`delivery-link:${match[1]}`, fs.existsSync(path.resolve(dir, match[1])));
}
const result = { ok: checks.every(x => x.ok), revision: audit.revision, checks, failures: checks.filter(x => !x.ok) };
fs.writeFileSync(path.join(dir, 'delivery-check.json'), JSON.stringify(result, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({ ok: result.ok, checks: checks.length, failures: result.failures }));
process.exitCode = result.ok ? 0 : 1;
