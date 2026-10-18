import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
const label = process.argv[2]; if (!/^[a-z0-9-]+$/.test(label ?? '')) throw Error('unique label');
const base = path.resolve('acceptance/20261018-governance-a'), dir = path.join(base, label), work = path.join(dir, '作品'); fs.mkdirSync(dir, { recursive: false });
function run(name, args) { const p = spawnSync(process.execPath, [path.join(base, 'capture.mjs'), `${label}-${name}`, process.execPath, 'bin/ai-writer.mjs', ...args], { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 }); if (p.status !== 0) throw Error(p.stderr); const file = path.join(base, 'commands', `${label}-${name}`, 'stdout.raw.txt'); return JSON.parse(fs.readFileSync(file)); }
run('init', ['init', '--path', work, '--kind', 'essay', '--title', '暂停全部动作测试']);
const author = '合成异常场景：暂停所有创作动作，仅允许查看状态。'; const file = path.join(work, '研究/作者要求.md'); fs.writeFileSync(file, author);
const old = run('show', ['workflow', 'show', '--project', work]); old.workflow.stage = 'paused'; old.workflow.task = '暂停所有创作动作，仅允许查看状态'; old.workflow.authorization = { allowed_actions: [], draft_range: null, revise_range: null, stop_conditions: [] };
const input = path.join(dir, 'input.json'); fs.writeFileSync(input, JSON.stringify({ expected_revision: old.revision, operation_id: 'pause-all', author_evidence: { quote: author, local_source: '研究/作者要求.md', source_sha256: crypto.createHash('sha256').update(author).digest('hex'), locator: '合成测试第1行', recorded_by: 'probe' }, workflow: old.workflow }));
run('set', ['workflow', 'set', '--project', work, '--input', input]);
const status = run('status', ['status', '--project', work]);
const result = { next: status.next, points_to_disallowed_discussion: status.next.command.includes('discussion') };
fs.writeFileSync(path.join(dir, 'result.json'), JSON.stringify(result, null, 2) + '\n', { flag: 'wx' }); console.log(JSON.stringify(result));
