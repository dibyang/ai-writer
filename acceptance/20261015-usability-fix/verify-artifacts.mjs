import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const directory = path.dirname(fileURLToPath(import.meta.url)), root = path.resolve(directory, '../..');
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const resultPath = path.join(directory, 'artifact-verification.json');
if (fs.existsSync(resultPath)) throw new Error('Preserve previous verification.');
const failures = [], works = [], phases = [];
const verify = (condition, message) => { if (!condition) failures.push(message); };
const candidate = JSON.parse(fs.readFileSync(path.join(directory, 'candidate-v5.json'), 'utf8'));
for (const row of candidate.files) verify(hash(path.join(root, row.file)) === row.sha256, `Candidate changed: ${row.file}`);
for (const name of ['novel-a', 'novel-b', 'genres', 'final-recheck']) {
  const record = JSON.parse(fs.readFileSync(path.join(directory, name, 'process-result.json'), 'utf8'));
  phases.push({ phase: name, exit_code: record.exit_code, elapsed_s: record.elapsed_s, command_events: record.commands, events: record.events });
  verify(record.exit_code === 0, `Process failed: ${name}`);
}
const names = ['雨后失物', '借一把椅子', '字放回格子里'];
for (const name of names) {
  const work = path.join(directory, 'works', name), state = JSON.parse(fs.readFileSync(path.join(work, '.writer/state.json'), 'utf8'));
  const modules = ['bin/ai-writer.mjs', 'lib/workspace.mjs', 'lib/journal.mjs', 'lib/longform.mjs', 'lib/help.mjs', 'lib/style.mjs', 'package.json'];
  for (const ref of modules) verify(hash(path.join(root, ref)) === hash(path.join(work, '.writer/tool', ref)), `${name}: stale tool ${ref}`);
  for (const row of candidate.files.filter(row => row.file.startsWith('.agents/skills/'))) verify(hash(path.join(work, row.file)) === row.sha256, `${name}: stale skill ${row.file}`);
  for (const ref of ['quickstart.md', 'user-guide.md', 'workflow.md', 'long-form.md', 'deslop.md', 'attribution.md']) verify(hash(path.join(root, 'docs', ref)) === hash(path.join(work, 'docs', ref)), `${name}: stale guide ${ref}`);
  for (const ref of ['LICENSE.md', 'docs/source-manifest.json', 'docs/oh-story-audit-manifest.json', 'docs/usability-sources.json', 'vendor/oh-story-reference/LICENSE', 'vendor/oh-story-reference-20261015/LICENSE', 'vendor/oh-story-deslop-reference/LICENSE', 'vendor/oh-story-deslop-reference/how-to-remove-ai-flavor-from-web-fiction.md']) verify(hash(path.join(root, ref)) === hash(path.join(work, ref)), `${name}: stale attribution ${ref}`);
  for (const unit of state.units) verify(hash(path.join(work, unit.draft)) === unit.sha256, `${name}: changed registered manuscript ${unit.unit}`);
  const cliResults = [];
  for (const args of [['doctor', '--project', work], ['status', '--project', work], ['check', '--project', work], ['record', '--project', work, '--help']]) {
    const run = spawnSync(process.execPath, [path.join(work, '.writer/tool/bin/ai-writer.mjs'), ...args], { cwd: root, encoding: 'utf8', timeout: 30000 });
    verify(run.status === 0, `${name}: ${args[0]} exit ${run.status}: ${run.stderr}`);
    let parsed = null; try { parsed = JSON.parse(run.stdout); } catch {}
    cliResults.push({ args, exit_code: run.status, output: parsed ?? run.stdout, stderr: run.stderr });
  }
  verify(state.units.length === (name === '雨后失物' ? 3 : 1), `${name}: unexpected registered scope`);
  works.push({ name, revision: state.revision, units: state.units.length, draft_hashes: state.units.map(unit => ({ unit: unit.unit, draft: unit.draft, sha256: unit.sha256 })), cli: cliResults });
}
const exports = [];
function findExports(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) findExports(file);
    else if (entry.name === 'manifest.json' && fs.existsSync(path.join(dir, 'manuscript.md'))) {
      const manifest = JSON.parse(fs.readFileSync(file, 'utf8'));
      if (!Array.isArray(manifest.units) || !manifest.sha256) continue;
      verify(hash(path.join(dir, 'manuscript.md')) === manifest.sha256, `Export hash: ${file}`);
      const latest = works.find(work => JSON.parse(fs.readFileSync(path.join(directory, 'works', work.name, 'writer.json'), 'utf8')).title === manifest.title);
      if (latest && manifest.revision === latest.revision) for (const unit of manifest.units) verify(latest.draft_hashes.find(row => row.unit === unit.unit)?.sha256 === unit.sha256, `Export source mismatch: ${file}`);
      exports.push({ directory: path.relative(root, dir), title: manifest.title, revision: manifest.revision, units: manifest.units.length, excluded: manifest.excluded_drafts?.length ?? null, sha256: manifest.sha256 });
    }
  }
}
for (const phase of ['novel-a', 'novel-b', 'genres', 'final-runtime', 'final-recheck']) findExports(path.join(directory, phase));
for (const work of works) verify(exports.some(exp => exp.title === work.name && exp.revision === work.revision && exp.units === work.units), `${work.name}: missing final matching export`);
const relocation = JSON.parse(fs.readFileSync(path.join(directory, 'relocation-preparation.json'), 'utf8'));
verify(hash(path.join(directory, 'works/雨后失物/.writer/import.json')) === relocation.import_manifest_sha256, 'Frozen import manifest changed during relocation');
for (const row of relocation.files) verify(hash(path.join(root, row.after)) === row.sha256, `Original input changed: ${row.after}`);
const provenance = JSON.parse(fs.readFileSync(path.join(root, 'docs/usability-sources.json'), 'utf8'));
for (const row of provenance.files) verify(hash(path.join(root, row.file)) === row.sha256, `Reference source hash: ${row.file}`);
const result = { ok: !failures.length, failures, candidate_files: candidate.files.length, phases, works, exports };
fs.writeFileSync(resultPath, JSON.stringify(result, null, 2) + '\n', { flag: 'wx', encoding: 'utf8' });
console.log(JSON.stringify({ ok: result.ok, failures, phases, works: works.map(({ name, revision, units }) => ({ name, revision, units })), exports }, null, 2));
process.exitCode = failures.length ? 1 : 0;
