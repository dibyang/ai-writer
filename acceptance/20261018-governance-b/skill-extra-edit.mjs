import fs from 'node:fs';
import crypto from 'node:crypto';
const file = '.agents/skills/writer-project/SKILL.md', before = fs.readFileSync(file), sha = b => crypto.createHash('sha256').update(b).digest('hex');
if (sha(before) !== 'df123cc981aefc6a6e5a197ef41fcea15fe594a36510bfc2e5fb197fed9e46b5') throw Error('Concurrent skill change');
const from = '正文与来源漂移一起核查最早影响点。', to = `${from} schema 4 若主稿已被锁外编辑，先核实并按真实授权 adopt_existing_changes 建立保守修订，分别保留现有字节和原追踪；不追认旧输入或修改期望哈希，详见专项手册。`;
const source = before.toString('utf8'); if (source.split(from).length !== 2) throw Error('Expected one phrase');
const next = Buffer.from(source.replace(from, to)); fs.writeFileSync('acceptance/20261018-governance-b/skill-extra-edit.json', JSON.stringify({ file, before_sha256: sha(before), after_sha256: sha(next) }, null, 2) + '\n', { flag: 'wx' }); fs.writeFileSync(file, next); console.log(JSON.stringify({ ok: true, file, sha256: sha(next) }));
