import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const base = 'acceptance/20261018-governance-b', rows = JSON.parse(fs.readFileSync(`${base}/fixtures/tool-0.4/source-manifest.json`)), target = 'tests/fixtures/tool-0.4';
if (fs.existsSync(target)) throw Error('Do not overwrite fixture');
for (const row of rows) { const bytes = fs.readFileSync(`${base}/fixtures/tool-0.4/${row.file}`), sha = crypto.createHash('sha256').update(bytes).digest('hex'); if (sha !== row.sha256) throw Error('Old source drift'); const out = path.join(target, row.file); fs.mkdirSync(path.dirname(out), { recursive: true }); fs.writeFileSync(out, bytes, { flag: 'wx' }); }
const head = JSON.parse(fs.readFileSync(`${base}/environment.json`)).head; fs.writeFileSync(`${target}/source-manifest.json`, JSON.stringify({ source_commit: head, files: rows }, null, 2) + '\n', { flag: 'wx' }); console.log(JSON.stringify({ ok: true, files: rows.length, source_commit: head, target }));
