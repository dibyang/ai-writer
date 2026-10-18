import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { ROOT } from '../lib/workspace.mjs';

// Inspect source as data. Never execute imported hooks, scrapers or Python modules.
const source = path.join(ROOT, '.tmp/oh-story-full-20261015');
const expected = '6d72f70e5fe3de110b457fd6bc81ede6ea614702';
const commit = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: source, encoding: 'utf8' }).trim();
if (commit !== expected) throw new Error('reference commit differs');
const inventory = JSON.parse(fs.readFileSync(path.join(ROOT, 'acceptance/20261015-long/reference-inventory.json'), 'utf8'));
const entries = inventory.inventory.filter(row => /^skills\/[^/]+\/SKILL\.md$/.test(row.ref)).map(row => row.ref);
const related = [
  'LICENSE', 'README.md', 'docs/architecture.md', 'docs/keep-ai-novel-consistent-over-100-chapters.md',
  ...['tracking-transaction.md', 'workflow-volume.md', 'workflow-daily.md', 'style-resolution.md', 'author-memory.md', 'benchmark-recall.md'].map(x => `skills/story-long-write/references/${x}`),
  ...['outline_view.py', 'tracking_commit.py', 'build_writer_prompt.py'].map(x => `skills/story-long-write/scripts/${x}`)
];
const retained = [];
for (const ref of [...entries, ...related]) {
  const row = inventory.inventory.find(x => x.ref === ref), input = path.join(source, ref);
  if (fs.lstatSync(input).isSymbolicLink()) throw new Error('symlink reference refused');
  const bytes = fs.readFileSync(input), sha256 = crypto.createHash('sha256').update(bytes).digest('hex');
  if (row.sha256 !== sha256) throw new Error(`reference changed: ${ref}`);
  const file = `vendor/oh-story-reference-20261015/${ref}`, output = path.join(ROOT, file);
  fs.mkdirSync(path.dirname(output), { recursive: true });
  if (fs.existsSync(output)) { if (!fs.readFileSync(output).equals(bytes)) throw new Error(`retained snapshot differs: ${ref}`); }
  else fs.writeFileSync(output, bytes, { flag: 'wx' });
  retained.push({ upstream_ref: ref, file, bytes: bytes.length, sha256 });
}
const copies = new Map();
for (const row of inventory.inventory) { const list = copies.get(row.sha256) ?? []; list.push(row.ref); copies.set(row.sha256, list); }
const duplicateGroups = [...copies.values()].filter(x => x.length > 1);
const families = {};
for (const row of inventory.inventory) {
  const [top, name, bucket] = row.ref.split('/');
  const key = top === 'skills' ? `${top}/${name}/${bucket === 'references' || bucket === 'scripts' ? bucket : 'entry'}` : top;
  families[key] ??= { files: 0, bytes: 0 }; families[key].files++; families[key].bytes += row.bytes;
}
const manifest = { upstream: inventory.upstream, commit, license: 'MIT', source_inventory: 'acceptance/20261015-long/reference-inventory.json',
  inventory_sha256: crypto.createHash('sha256').update(fs.readFileSync(path.join(ROOT, 'acceptance/20261015-long/reference-inventory.json'))).digest('hex'),
  review_depth: { all_tracked_files: 'path-size-hash inventory, no claim of line-by-line review', skill_entrypoints: '13 read in full',
    scripts: { outline_view: 'full 287 lines', tracking_commit: 'function index and transaction/write ordering lines 1095-1299', build_writer_prompt: 'contract and selection code lines 1-220' } },
  retained, families, duplicate_groups: duplicateGroups };
fs.writeFileSync(path.join(ROOT, 'docs/oh-story-audit-manifest.json'), JSON.stringify(manifest, null, 2) + '\n', 'utf8');
console.log(JSON.stringify({ commit, inventory: inventory.files, skills: entries.length, retained: retained.length, families: Object.keys(families).length, duplicate_groups: duplicateGroups.length }));
