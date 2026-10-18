import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { safe } from '../../lib/workspace.mjs';
const base = path.dirname(fileURLToPath(import.meta.url)), origin = path.resolve('acceptance/20261016-hundred/works/潮汐信号'), target = path.join(base, 'scale-hundred/work');
if (fs.existsSync(target)) throw Error('Do not overwrite hundred-copy');
const sha = b => crypto.createHash('sha256').update(b).digest('hex'), state = JSON.parse(fs.readFileSync(safe(origin, '.writer/state.json'))), refs = new Set(['writer.json', '.writer/state.json']);
assert.equal(state.units.length, 100); const exact = new Map();
for (const row of state.units) {
  refs.add(row.draft); assert.equal(sha(fs.readFileSync(safe(origin, row.draft))), row.sha256);
  if (row.journal) { refs.add(row.journal); assert.equal(sha(fs.readFileSync(safe(origin, row.journal))), row.journal_sha256); }
  for (const [ref, expected] of Object.entries(row.source_hashes)) {
    refs.add(ref); if (ref === '.writer/state.json') continue;
    assert.equal(sha(fs.readFileSync(safe(origin, ref))), expected, `Original live input drift: ${ref}`); exact.set(ref, expected);
  }
}
function add(ref) { const file = safe(origin, ref); if (!fs.existsSync(file)) return; const stat = fs.lstatSync(file); if (stat.isDirectory()) { for (const name of fs.readdirSync(file).sort()) add(`${ref}/${name}`); } else { assert.equal(stat.isFile(), true); refs.add(ref); } }
for (const ref of ['AGENTS.md', 'README.md', 'LICENSE.md', 'docs', 'examples', '.agents/skills', '.writer/tool', '.writer/import.json', '.writer/import-locations.json', '.writer/import-source', '.writer/reviews']) add(ref);
const reviewDir = safe(origin, '.writer/reviews'); if (fs.existsSync(reviewDir)) for (const name of fs.readdirSync(reviewDir).filter(x => x.endsWith('.json'))) add(JSON.parse(fs.readFileSync(safe(origin, `.writer/reviews/${name}`))).report);
for (const ref of ['vendor/oh-story-reference/LICENSE', 'vendor/oh-story-reference-20261015/LICENSE', 'vendor/oh-story-deslop-reference/LICENSE', 'vendor/oh-story-deslop-reference/how-to-remove-ai-flavor-from-web-fiction.md']) add(ref);
const files = []; fs.mkdirSync(target, { recursive: true });
for (const ref of [...refs].sort()) { const bytes = fs.readFileSync(safe(origin, ref)), out = path.join(target, ref); fs.mkdirSync(path.dirname(out), { recursive: true }); fs.writeFileSync(out, bytes, { flag: 'wx' }); const digest = sha(bytes); assert.equal(sha(fs.readFileSync(safe(origin, ref))), digest, 'Original changed while copying'); files.push({ file: ref, bytes: bytes.length, sha256: digest }); }
const record = { scope: 'Explicit current-work/journal/input/review/tool file copy from sealed original; excludes rewind histories and other acceptance material; not new writing', origin, target,
  original_schema: state.schema_version, original_revision: state.revision, units: state.units.length, state_sha256: sha(fs.readFileSync(safe(origin, '.writer/state.json'))), files, file_count: files.length, bytes: files.reduce((n, x) => n + x.bytes, 0), consumed_live_inputs_verified: exact.size };
fs.writeFileSync(path.join(base, 'scale-hundred/copy-manifest.json'), JSON.stringify(record, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({ ok: true, units: record.units, schema: record.original_schema, revision: record.original_revision, copied_files: record.file_count, bytes: record.bytes, consumed_live_inputs_verified: exact.size }));
