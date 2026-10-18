import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
const base = path.dirname(fileURLToPath(import.meta.url)), label = process.argv[2];
if (!/^[a-z][a-z0-9-]*$/.test(label ?? '')) throw Error('unique label required');
const dest = path.join(base, 'sources', label); if (fs.existsSync(dest)) throw Error('Never overwrite snapshots'); fs.mkdirSync(dest, { recursive: true });
const files = []; const sha = x => crypto.createHash('sha256').update(x).digest('hex');
function visit(ref) { const file = path.resolve(ref), stat = fs.lstatSync(file); if (stat.isSymbolicLink()) throw Error(`No links: ${ref}`); if (stat.isDirectory()) { for (const name of fs.readdirSync(file).sort()) visit(`${ref}/${name}`); } else if (stat.isFile()) { const bytes = fs.readFileSync(file), target = path.join(dest, ref); fs.mkdirSync(path.dirname(target), { recursive: true }); fs.writeFileSync(target, bytes, { flag: 'wx' }); files.push({ file: ref, bytes: bytes.length, sha256: sha(bytes) }); } }
for (const ref of ['package.json', 'README.md', 'AGENTS.md', '.gitattributes', 'bin', 'lib', 'tests', 'scripts', 'docs', '.agents/skills']) visit(ref);
fs.writeFileSync(path.join(dest, 'source-manifest.json'), JSON.stringify({ label, at: new Date().toISOString(), files }, null, 2) + '\n', { flag: 'wx' }); console.log(JSON.stringify({ label, files: files.length, directory: dest }));
