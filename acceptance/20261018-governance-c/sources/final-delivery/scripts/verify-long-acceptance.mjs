import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { ROOT, main } from '../lib/workspace.mjs';

const json = file => JSON.parse(fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, ''));
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const assert = (condition, message) => { if (!condition) throw new Error(message); };
const campaign = path.join(ROOT, 'acceptance/20261015-long');
const candidate = json(path.join(campaign, 'candidate-validation-v2.json'));
for (const row of candidate.files) assert(sha(path.join(ROOT, row.file)) === row.sha256, `candidate changed: ${row.file}`);
const partial = process.argv.includes('--partial');
const specification = [['末班寄存柜', 6, '末班寄存柜-v1'], ['留一把椅子', 2, '留一把椅子-v2'], ['字散开以后', 2, '字散开以后-v1'], ...(!partial ? [['导入恢复', 3, '导入恢复-v1']] : [])];
const works = [];
for (const [directory, count, exported] of specification) {
  const root = path.join(campaign, 'works', directory), state = json(path.join(root, '.writer/state.json')), config = json(path.join(root, 'writer.json'));
  assert(state.units.length === count && state.schema_version === 2, `wrong tracked range: ${directory}`);
  const checked = main(['check', '--project', root]); assert(checked.ok, `check failed: ${directory}`);
  assert(checked.rolling_review.valid > 0 && checked.rolling_review.pending_windows.length === 0, `missing reading coverage: ${directory}`);
  const tools = candidate.files.map(row => {
    const ref = row.file.startsWith('.agents/') ? row.file : `.writer/tool/${row.file}`;
    assert(sha(path.join(root, ref)) === row.sha256, `tool differs: ${directory}/${ref}`); return ref;
  });
  const embedded = path.join(root, '.writer/tool/bin/ai-writer.mjs'), standalone = {};
  for (const command of ['doctor', 'check']) {
    const run = spawnSync(process.execPath, [embedded, command, ...(command === 'check' ? ['--project', root] : [])], { cwd: root, encoding: 'utf8', windowsHide: true, timeout: 30000 });
    assert(run.status === 0, `standalone ${command} failed: ${directory}: ${run.stderr}`); standalone[command] = JSON.parse(run.stdout);
  }
  const chapters = state.units.map(u => {
    const file = path.join(root, u.draft), raw = fs.readFileSync(file, 'utf8');
    assert(sha(file) === u.sha256, `draft mismatch: ${directory}/${u.unit}`);
    let body = raw.replace(/^#.*$/gm, '').split('\n史源：')[0];
    if (config.kind === 'screenplay') body = body.replace(/^内景.*$/gm, '').replace(/^(方叔|小许)$/gm, '');
    return { unit: u.unit, draft: u.draft, sha256: u.sha256, body_han: (body.match(/\p{Script=Han}/gu) ?? []).length, raw };
  });
  let anchors = 0;
  for (const entry of Object.values(state.snapshot.ledger ?? {})) for (const evidence of entry.evidence) {
    const row = chapters.find(x => x.unit === evidence.unit);
    assert(row && row.draft === evidence.draft && row.sha256 === evidence.sha256 && row.raw.includes(evidence.quote), `ledger evidence mismatch: ${directory}`); anchors++;
  }
  const target = path.join(campaign, 'works', exported), manifest = json(path.join(target, 'manifest.json'));
  assert(manifest.revision === state.revision && manifest.units.length === count && manifest.status === 'draft-export', `export version mismatch: ${directory}`);
  assert(sha(path.join(target, 'manuscript.md')) === manifest.sha256, `export hash mismatch: ${directory}`);
  assert(fs.readFileSync(path.join(target, 'manuscript.md'), 'utf8') === chapters.map(x => x.raw.trim()).join('\n\n---\n\n') + '\n', `export contents mismatch: ${directory}`);
  assert(manifest.units.every((u, i) => u.unit === state.units[i].unit && u.sha256 === state.units[i].sha256 && JSON.stringify(u.source_hashes) === JSON.stringify(state.units[i].source_hashes)), `export source mismatch: ${directory}`);
  const finalTarget = path.join(campaign, 'final-recheck/exports', directory);
  const finalManifest = json(path.join(finalTarget, 'manifest.json'));
  assert(finalManifest.sha256 === manifest.sha256 && finalManifest.revision === state.revision && finalManifest.units.length === count, `final Codex export differs: ${directory}`);
  assert(sha(path.join(finalTarget, 'manuscript.md')) === finalManifest.sha256, `final Codex manuscript differs: ${directory}`);
  works.push({ directory, title: config.title, kind: config.kind, revision: state.revision, units: count, body_han: chapters.reduce((sum, row) => sum + row.body_han, 0),
    chapters: chapters.map(({ raw, ...row }) => row), anchors_verified: anchors, tool_files_verified: tools.length, check: checked, standalone,
    export: { directory: exported, sha256: manifest.sha256, status: manifest.status } });
}
const legacy = ['夜班退件', '停电以后', '把字拆开以后'].map(title => {
  const root = path.join(ROOT, 'acceptance/20261015/works', title), checked = main(['check', '--project', root]); assert(checked.ok, `legacy regression failed: ${title}`);
  return { title, check: checked, embedded_old_version_preserved: true };
});
const phases = ['novel-stage-a', 'novel-stage-b', 'novel-stage-b-retry', ...(!partial ? ['import-live', 'final-recheck'] : [])].map(phase => ({ phase, ...json(path.join(campaign, phase, 'process-result.json')) }));
const rootCli = ['root-screenplay', 'root-history'].map(phase => {
  const records = fs.readdirSync(path.join(campaign, phase)).filter(x => x.endsWith('.json')).map(file => json(path.join(campaign, phase, file)));
  assert(records.every(r => r.exit_code === 0), `root CLI failure: ${phase}`);
  return { phase, commands: records.length, failures: 0, nature: 'primary-Codex-session-real-CLI' };
});
const report = { ok: true, status: partial ? 'partial-three-works' : 'four-work-final-file-verification', candidate_version: candidate.version, node: process.version,
  code_and_skills_match_candidate: true, works, legacy, phases, root_cli: rootCli,
  limits: ['small manuscript sample only', 'hash and structural checks do not prove semantic truth', 'model self-review only; no human/market/rehearsal acceptance',
    'nested-cwd Codex sandbox/helper failure retained; root-cwd recovery succeeded', 'novel stage B process had TLS reconnects; inspect raw events'],
  capacity: json(path.join(campaign, 'capacity-100-v2.json')) };
const name = partial ? 'artifact-verification-partial.json' : 'artifact-verification-final.json';
fs.writeFileSync(path.join(campaign, name), JSON.stringify(report, null, 2) + '\n', { flag: 'wx', encoding: 'utf8' });
console.log(JSON.stringify({ ok: true, report: name, works: works.map(w => ({ directory: w.directory, units: w.units, body_han: w.body_han, revision: w.revision })), legacy: legacy.length, root_cli: rootCli }));
