import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { ROOT, main } from '../lib/workspace.mjs';

const base = path.join(ROOT, 'acceptance/20261015');
const hash = data => crypto.createHash('sha256').update(data).digest('hex');
const read = file => fs.readFileSync(file, 'utf8');
const json = file => JSON.parse(read(file));
const cases = [['夜班退件', 'novel', 2], ['停电以后', 'screenplay', 3], ['把字拆开以后', 'history', 2]];
const artifacts = [];
for (const [name, kind, units] of cases) {
  const project = path.join(base, 'works', name), output = path.join(base, 'exports', `${name}-v1`);
  try {
    const status = main(['status', '--project', project]);
    const check = main(['check', '--project', project]);
    const state = json(path.join(project, '.writer/state.json'));
    const manifest = json(path.join(output, 'manifest.json'));
    const manuscript = fs.readFileSync(path.join(output, 'manuscript.md'));
    const drafts = state.units.map(u => {
      const bytes = fs.readFileSync(path.join(project, u.draft));
      return { unit: u.unit, draft: u.draft, sha256: hash(bytes), han_chars: (bytes.toString('utf8').match(/\p{Script=Han}/gu) ?? []).length };
    });
    const reconstructed = state.units.map(u => read(path.join(project, u.draft)).trim()).join('\n\n---\n\n') + '\n';
    const reports = fs.readdirSync(path.join(project, '审查')).filter(n => n.endsWith('.md')).map(n => {
      const file = path.join(project, '审查', n), content = read(file);
      return { file: path.relative(ROOT, file).replaceAll('\\', '/'), sha256: hash(Buffer.from(content)),
        binds_all_final_drafts: drafts.every(d => content.includes(d.sha256)) };
    });
    const bundleMatches = hash(fs.readFileSync(path.join(project, '.writer/tool/lib/workspace.mjs'))) === hash(fs.readFileSync(path.join(ROOT, 'lib/workspace.mjs')));
    const integrity = status.kind === kind && state.units.length === units && manifest.kind === kind &&
      manifest.title === status.title && manifest.units.length === units && check.ok &&
      !status.stale_units.length && !status.changed_sources.length && manuscript.toString('utf8') === reconstructed &&
      hash(manuscript) === manifest.sha256 && manifest.revision === state.revision &&
      drafts.every((d, i) => d.sha256 === state.units[i].sha256 && d.sha256 === manifest.units[i]?.sha256 &&
        JSON.stringify(manifest.units[i]?.source_hashes) === JSON.stringify(state.units[i].source_hashes)) &&
      reports.some(r => r.binds_all_final_drafts) && bundleMatches;
    artifacts.push({ name, kind, ok: integrity, status, check, drafts, reports, bundle_matches_current_tool: bundleMatches,
      manuscript_sha256: hash(manuscript), export_manifest_sha256: hash(fs.readFileSync(path.join(output, 'manifest.json'))) });
  } catch (error) { artifacts.push({ name, kind, ok: false, error: error.message }); }
}
const implementationFiles = ['lib/workspace.mjs', 'bin/ai-writer.mjs', 'package.json', 'scripts/codex-acceptance.mjs',
  'scripts/verify-acceptance.mjs', 'tests/workspace.test.mjs', 'docs/source-manifest.json',
  ...['writer-project', 'writer-review', 'writer-novel', 'writer-screenplay', 'writer-history'].map(n => `.agents/skills/${n}/SKILL.md`)];
const result = { ok: artifacts.every(a => a.ok), checked_at: new Date().toISOString(),
  scope: 'artifact-integrity-only', literary_quality: 'requires-reading', human_acceptance: 'not-run',
  implementation_sha256: Object.fromEntries(implementationFiles.map(ref => [ref, hash(fs.readFileSync(path.join(ROOT, ref)))])), artifacts };
fs.writeFileSync(path.join(base, 'artifact-verification.json'), JSON.stringify(result, null, 2) + '\n', 'utf8');
console.log(JSON.stringify(result, null, 2));
process.exitCode = result.ok ? 0 : 1;
