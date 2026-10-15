import fs from 'node:fs';
import path from 'node:path';
import { performance } from 'node:perf_hooks';
import crypto from 'node:crypto';
import { ROOT, initProject, enableLong, savePlan, context, record, rewind, check, exportWork, main } from '../lib/workspace.mjs';

// Synthetic capacity measurement only; it does not evaluate prose continuity.
const count = Number(process.argv[2] ?? 100);
const label = process.argv[3] ?? '';
if (label && !/^[a-z0-9-]+$/.test(label)) throw new Error('invalid measurement label');
if (!Number.isSafeInteger(count) || count < 10 || count > 1000) throw new Error('count must be 10–1000');
fs.mkdirSync(path.join(ROOT, '.tmp'), { recursive: true });
const base = fs.mkdtempSync(path.join(ROOT, '.tmp/capacity-'));
const results = [];
for (const mode of ['legacy', 'long']) {
  const root = path.join(base, mode); initProject(root, 'novel', '合成容量夹具');
  if (mode === 'long') {
    enableLong(root, 0);
    const file = path.join(base, 'volume.json');
    fs.writeFileSync(file, JSON.stringify({ id: 'V1', title: '夹具卷', start: 1, end: count + 1, promises: [], constraints: [], reserved: [], arcs: [{ id: 'A1', start: 1, end: count + 1, goal: '容量测量', payoff: '结构验证' }] }));
    main(['volume', '--project', root, '--input', file]);
  }
  const started = performance.now(), timeline = [];
  for (let unit = 1; unit <= count; unit++) {
    savePlan(root, { unit, title: `夹具${unit}`, goal: '核查', change: '增加一条事件', cast: ['阿禾'], beats: ['核查信件'] });
    const packet = context(root, unit), draft = `正文/${String(unit).padStart(4, '0')}.md`;
    fs.writeFileSync(path.join(root, draft), `# 结构夹具${unit}\n\n阿禾在值班室核对信件。此文字不是文学创作样稿。\n`, 'utf8');
    const event = `第${unit}日：阿禾在值班室整理旧信，与值班员核对寄件时间、收件地址、编号和保管交接，尚未找到寄件人。`; timeline.push(event);
    record(root, { unit, expected_revision: packet.revision, source_hashes: packet.source_hashes, draft, summary: '整理信件，保留调查边界。',
      ...(mode === 'long' ? { changes: { characters: { 阿禾: '值班室；调查中' }, timeline_append: [event] } } : { snapshot: { characters: { 阿禾: '值班室；调查中' }, threads: [], timeline: [...timeline] } }) });
    if (unit % 10 === 0) console.log(JSON.stringify({ mode, completed: unit, total: count, elapsed_s: Math.round((performance.now() - started) / 1000) }));
  }
  const elapsed = performance.now() - started, state = JSON.parse(fs.readFileSync(path.join(root, '.writer/state.json')));
  const stateBytes = fs.statSync(path.join(root, '.writer/state.json')).size;
  const journalBytes = state.units.reduce((sum, row) => sum + (row.journal ? fs.statSync(path.join(root, row.journal)).size : 0), 0);
  savePlan(root, { unit: count + 1, title: '恢复入口', goal: '核查', change: '继续', beats: ['恢复'] });
  const packet = context(root, count + 1);
  const report = check(root), exported = exportWork(root, path.join(base, `${mode}-export`));
  rewind(root, count - 4, state.revision);
  const restored = main(['status', '--project', root, '--view', 'full']);
  if (!report.ok || exported.units.length !== count || restored.snapshot.timeline.length !== count - 5) throw new Error('capacity roundtrip failed');
  results.push({ mode, units: count, state_bytes: stateBytes, journal_bytes: journalBytes, total_tracking_bytes: stateBytes + journalBytes,
    next_context_chars: JSON.stringify(packet).length, elapsed_ms: Math.round(elapsed), exported_units: exported.units.length, rewind_next_unit: restored.next_unit });
}
const output = { nature: 'synthetic-capacity-only', root: base, results,
  tool_sha256: Object.fromEntries(['lib/workspace.mjs', 'lib/journal.mjs', 'lib/longform.mjs', 'scripts/benchmark-long.mjs'].map(ref => [ref, crypto.createHash('sha256').update(fs.readFileSync(path.join(ROOT, ref))).digest('hex')])),
  tracking_reduction_percent: +(100 * (1 - results[1].total_tracking_bytes / results[0].total_tracking_bytes)).toFixed(2) };
const destination = path.join(ROOT, `acceptance/20261015-long/capacity-${count}${label ? `-${label}` : ''}.json`);
fs.writeFileSync(destination, JSON.stringify(output, null, 2) + '\n', { flag: 'wx', encoding: 'utf8' });
console.log(JSON.stringify(output));
