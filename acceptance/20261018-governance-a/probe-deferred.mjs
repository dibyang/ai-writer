import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
const label = process.argv[2]; if (!/^[a-z0-9-]+$/.test(label ?? '')) throw Error('unique label');
const base = path.resolve('acceptance/20261018-governance-a'), dir = path.join(base, label), work = path.join(dir, '作品'); fs.mkdirSync(dir, { recursive: false });
function run(name, args) { const r = spawnSync(process.execPath, [path.join(base, 'capture.mjs'), `${label}-${name}`, process.execPath, 'bin/ai-writer.mjs', ...args], { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 }); const output = path.join(base, 'commands', `${label}-${name}`, r.status === 2 ? 'stderr.raw.txt' : 'stdout.raw.txt'); return { exit_code: r.status, value: JSON.parse(fs.readFileSync(output)) }; }
run('init', ['init', '--path', work, '--kind', 'novel', '--title', '暂缓规划转阶段测试']);
const quote = '合成验收：有限试写一章，远期骨架暂缓，完成后转为总纲讨论。'; fs.writeFileSync(path.join(work, '研究/作者要求.md'), quote);
const evidence = { quote, local_source: '研究/作者要求.md', source_sha256: crypto.createHash('sha256').update(quote).digest('hex'), locator: '合成夹具第1行', recorded_by: 'probe' };
const initial = run('show', ['workflow', 'show', '--project', work]).value;
const trial = initial.workflow; trial.stage = 'trial'; trial.task = '有限试写后复盘'; trial.authorization = { allowed_actions: ['discuss', 'plan', 'draft'], draft_range: { from: 1, to: 1 }, revise_range: null, stop_conditions: ['完成后复盘'] }; trial.planning.structure = { status: 'deferred', refs: [], unresolved_ids: ['远期'], reason: '作者允许有限试写后再补骨架' };
const t = path.join(dir, 'trial.json'); fs.writeFileSync(t, JSON.stringify({ expected_revision: initial.revision, operation_id: 'deferred-trial', author_evidence: evidence, workflow: trial }));
const r = run('trial', ['workflow', 'set', '--project', work, '--input', t]); if (r.exit_code !== 0) throw Error('trial setup failed');
trial.stage = 'structure'; trial.task = '暂停正文，讨论总纲'; trial.authorization = { allowed_actions: ['discuss', 'plan'], draft_range: null, revise_range: null, stop_conditions: [] };
const p = path.join(dir, 'pause.json'); fs.writeFileSync(p, JSON.stringify({ expected_revision: r.value.revision, operation_id: 'deferred-pause', author_evidence: evidence, workflow: trial }));
const result = run('pause', ['workflow', 'set', '--project', work, '--input', p]); fs.writeFileSync(path.join(dir, 'result.json'), JSON.stringify(result, null, 2) + '\n', { flag: 'wx' }); console.log(JSON.stringify(result));
