import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
export const phase = path.dirname(fileURLToPath(import.meta.url));
export const root = path.dirname(phase);
export const project = path.join(root, 'works/铜桥来信');
export const sha = b => crypto.createHash('sha256').update(b).digest('hex');
export const read = f => fs.readFileSync(f, 'utf8');
export const json = f => JSON.parse(read(f));
export function put(f, x) { fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, Buffer.isBuffer(x) || typeof x === 'string' ? x : JSON.stringify(x, null, 2) + '\n', { flag: 'wx' }); }
export const state = (p = project) => json(path.join(p, '.writer/state.json'));
export const output = label => json(path.join(root, 'commands', 'native-two-' + label, 'stdout.raw.txt'));
export function run(label, args, p = project, token) {
  const argv = [path.join(root, 'capture.mjs'), 'native-two-' + label, 'node', 'bin/ai-writer.mjs', ...args, '--project', p, ...(token ? ['--revision-token', token] : [])];
  const result = spawnSync('node', argv, { cwd: 'D:/work/other/ai-writer', encoding: 'utf8', windowsHide: true, maxBuffer: 64 * 1024 * 1024 });
  process.stdout.write(result.stdout); process.stderr.write(result.stderr);
  if (result.status !== 0) throw Error('CLI exit ' + result.status + ': ' + label);
  return output(label);
}
export function input(name, x) { const f = path.join(phase, 'inputs', name + '.json'); put(f, x); return f; }
export function fingerprints(p = project) {
  const s = state(p);
  return { revision: s.revision, state_sha256: sha(fs.readFileSync(path.join(p, '.writer/state.json'))), schema_version: s.schema_version,
    units: s.units.map(u => ({ unit: u.unit, draft: u.draft, actual_sha256: sha(fs.readFileSync(path.join(p, u.draft))), registered_sha256: u.sha256, source_hashes: u.source_hashes, source_bindings: u.source_bindings })) };
}
export function bundle(name, p, refs) {
  let out = '# 实际文件阅读副本\n\n';
  for (const ref of [...new Set(refs)]) { const b = fs.readFileSync(path.join(p, ref)); out += `## ${ref}\n\nSHA256=${sha(b)}\n\n${b.toString('utf8')}\n\n`; }
  put(path.join(phase, 'readings', name + '.md'), out);
}
if (process.argv[2] === 'snapshot-start') {
  const s = state();
  put(path.join(phase, 'parent-before-body-fingerprints.json'), fingerprints());
  put(path.join(phase, 'parent-start-state.raw.json'), fs.readFileSync(path.join(project, '.writer/state.json')));
  put(path.join(phase, 'parent-start-tracking.json'), { units: s.units, snapshot: s.snapshot, sources: s.sources, governance: s.governance });
  bundle('parent-six-original', project, s.units.map(u => u.draft));
  for (const u of s.units) put(path.join(phase, 'original', u.draft), fs.readFileSync(path.join(project, u.draft)));
  const h = json(path.join(root, 'handoff.json'));
  const refs = [...new Set(s.units.flatMap(u => Object.keys(u.source_hashes)).filter(r => !['writer.json', '.writer/state.json'].includes(r) && !r.startsWith('正文/')))];
  bundle('old-consumed-inputs', project, [...refs, '研究/测试授权原话.md', '审查/独立修订1-6-复核.md', '审查/规则v2-第7章起-影响实读.md', ...Object.values(h.versions).map(v => v.object_ref)]);
  console.log(JSON.stringify({ phase, revision: s.revision, units: s.units.length }));
}
