import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
export const root = process.cwd();
export const batch = path.join(root, 'acceptance/20261018-governance-c');
export const stage = path.join(batch, 'native-revise-apply');
export const work = path.join(batch, 'native-create-review/work');
export const sha = x => crypto.createHash('sha256').update(x).digest('hex');
export const load = p => JSON.parse(fs.readFileSync(p, 'utf8'));
export const put = (p, x) => { fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, typeof x === 'string' ? x : JSON.stringify(x, null, 2) + '\n', { flag: 'wx' }); };
export const state = (p = work) => load(path.join(p, '.writer/state.json'));
export function inventory(p) {
  const out = {};
  function visit(rel) { for (const ent of fs.readdirSync(path.join(p, rel), { withFileTypes: true })) { const ref = rel ? `${rel}/${ent.name}` : ent.name; if (ent.isDirectory()) visit(ref); else { const bytes = fs.readFileSync(path.join(p, ref)); out[ref] = { bytes: bytes.length, sha256: sha(bytes) }; } } }
  visit(''); return out;
}
export function cli(label, args, project = work, expected = 0) {
  if (!label.startsWith('native-two-')) throw Error('wrong label');
  const full = ['bin/ai-writer.mjs', ...args, ...(project ? ['--project', project] : [])];
  const r = spawnSync(process.execPath, [path.join(batch, 'capture.mjs'), label, process.execPath, ...full], { cwd: root, windowsHide: true, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 });
  const dir = path.join(batch, 'commands', label);
  const stdout = fs.readFileSync(path.join(dir, 'stdout.raw.txt'), 'utf8');
  const stderr = fs.readFileSync(path.join(dir, 'stderr.raw.txt'), 'utf8');
  console.log(label, 'exit', r.status, stdout.length > 8500 ? stdout.slice(0, 8500) + '\n[console abbreviated; complete raw bytes in capture]' : stdout, stderr);
  if (r.status !== expected) throw Error(`${label}: expected ${expected}, got ${r.status}`);
  try { return JSON.parse(stdout); } catch { return stdout; }
}
export function input(name, data) { const p = path.join(stage, 'inputs', name + '.json'); put(p, data); return p; }
