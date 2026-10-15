import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { ROOT, main, initProject, savePlan, context, record, rewind, check, enableLong } from '../lib/workspace.mjs';
import { delta, applyDelta } from '../lib/journal.mjs';

const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const write = (root, ref, value) => { fs.mkdirSync(path.dirname(path.join(root, ref)), { recursive: true }); fs.writeFileSync(path.join(root, ref), typeof value === 'string' ? value : JSON.stringify(value, null, 2), 'utf8'); };
function work(t, end = 12) {
  fs.mkdirSync(path.join(ROOT, '.tmp'), { recursive: true });
  const base = fs.mkdtempSync(path.join(ROOT, '.tmp/long-')), root = path.join(base, '作品');
  t.after(() => { assert.ok(fs.realpathSync(base).startsWith(fs.realpathSync(path.join(ROOT, '.tmp')) + path.sep)); fs.rmSync(base, { recursive: true, force: true }); });
  initProject(root, 'novel', '长篇测试'); enableLong(root, 0);
  const volume = { id: 'V1', title: '查信', start: 1, end, promises: ['追查错信'], constraints: ['观察先于解释'], reserved: ['寄件人身份'], arcs: [{ id: 'A1', start: 1, end, goal: '查信', payoff: '确认编号重复', forbidden: ['直接揭示寄件人'] }] };
  write(base, '卷.json', volume); main(['volume', '--project', root, '--input', path.join(base, '卷.json')]);
  return { base, root, volume };
}
function append(root, unit, changes = {}, extra = {}) {
  savePlan(root, { unit, title: '核查', goal: '检查错信', change: '确定时间', cast: ['阿禾'], beats: ['拆开信封'], ...extra });
  const draft = `正文/${String(unit).padStart(4, '0')}.md`;
  write(root, draft, `# 第${unit}章\n\n阿禾看见信封有一道裂口。她把信交给老陈，老陈锁进铁柜。\n`);
  const input = main(['record-template', '--project', root, '--unit', String(unit), '--draft', draft]);
  input.summary = '阿禾确认裂口，将信交给老陈保管。'; input.changes = { characters: { 阿禾: '值班室；尚不知寄件人' }, timeline_append: [`第${unit}晚：交信`], ...changes };
  record(root, input); return input;
}
const observed = { type: 'observation', statement: '信封有一道裂口', status: 'pending', cast: ['阿禾'], tags: ['裂口'], author_truth: '裂口的成因尚待核实', reader_known: '看见裂口', character_known: { 阿禾: '看见裂口' }, due_unit: 5, evidence: [{ unit: 1, quote: '阿禾看见信封有一道裂口。' }] };

test('差量追加、替换、删除可双向还原；时间线追加存储量不随历史长度增长', () => {
  const before = { characters: { 甲: '东门', 乙: '西门' }, timeline: Array.from({ length: 5000 }, (_, i) => `第${i}夜`), ledger: {} };
  const after = { characters: { 甲: '南门', 丙: '北门' }, timeline: [...before.timeline, '新的一夜'], ledger: { F1: { state: 'pending' } } };
  const patch = delta(before, after);
  assert.deepEqual(applyDelta(before, patch), after); assert.deepEqual(applyDelta(after, patch, true), before);
  assert.ok(JSON.stringify(patch).length < 1000);
  assert.throws(() => applyDelta({ a: [] }, [{ at: ['a'], length: 3, append: ['x'] }]), /基线/);
  assert.throws(() => delta({}, JSON.parse('{"__proto__":{"polluted":true}}')), /保留字段/);
});
test('长篇差量登记幂等、回退保留正文并恢复完整旧状态', t => {
  const { root } = work(t); const first = append(root, 1, { ledger: { O1: observed } });
  const saved = main(['status', '--project', root, '--view', 'full']).snapshot;
  const second = append(root, 2, { ledger: { O1: { status: 'partial', evidence: [{ unit: 2, quote: '老陈锁进铁柜。' }] } } });
  assert.equal(record(root, second).unchanged, true);
  assert.equal(check(root).ok, true); rewind(root, 2, 3);
  assert.deepEqual(main(['status', '--project', root, '--view', 'full']).snapshot, saved);
  assert.equal(fs.existsSync(path.join(root, second.draft)), true);
  const state = JSON.parse(fs.readFileSync(path.join(root, '.writer/state.json')));
  assert.equal(state.schema_version, 2); assert.equal('before' in state.units[0], false);
  assert.equal(first.changes.ledger.O1.statement, observed.statement);
});
test('不可变观察、未来证据、编造引文与省略本章证据均拒绝，不推进状态', t => {
  const { root } = work(t); append(root, 1, { ledger: { O1: observed } });
  savePlan(root, { unit: 2, title: '修正', goal: '核对', change: '改变解释', beats: ['核对'] });
  write(root, '正文/0002.md', '老陈锁进铁柜。');
  for (const entry of [
    { statement: '信封完好', evidence: [{ unit: 2, quote: '老陈锁进铁柜。' }] },
    { status: 'resolved', evidence: [{ unit: 3, quote: '老陈锁进铁柜。' }] },
    { status: 'resolved', evidence: [{ unit: 2, quote: '信封变成蓝色' }] },
    { status: 'resolved', evidence: [{ unit: 1, quote: '阿禾看见信封有一道裂口。' }] }
  ]) {
    const tx = main(['record-template', '--project', root, '--unit', '2', '--draft', '正文/0002.md']); tx.summary = '尝试更新'; tx.changes.ledger = { O1: entry };
    assert.throws(() => record(root, tx)); assert.equal(main(['status', '--project', root, '--view', 'full']).next_unit, 2);
  }
});
test('召回保留到期线索、明确列出省略项，人物知识不注入作者秘密', t => {
  const { root } = work(t); append(root, 1, { ledger: { O1: { ...observed, cast: [], author_truth: '寄件人是老陈', character_known: { 阿禾: '只看到裂口' } } } });
  for (let n = 2; n <= 4; n++) append(root, n);
  savePlan(root, { unit: 5, title: '核对', goal: '查信', change: '有进展', cast: ['阿禾'], beats: ['开柜'] });
  const packet = context(root, 5);
  assert.ok(packet.continuity.recall.selected.O1.includes('due'));
  assert.equal(packet.continuity.characters.阿禾.O1, '只看到裂口');
  assert.equal(JSON.stringify(packet.continuity.characters).includes('寄件人是老陈'), false);
  assert.equal(packet.continuity.author.O1.truth, '寄件人是老陈');
  assert.throws(() => context(root, 5, 1000), /预算/);
  const found = main(['recall', '--project', root, '--query', '裂口']); assert.equal(found.matches[0].id, 'O1');
});
test('显式召回不存在的 ID、错误剧情单元及重叠卷纲拒绝', t => {
  const { base, root, volume } = work(t);
  savePlan(root, { unit: 1, title: '查信', goal: '核对', change: '查到', beats: ['核对'], recall_ids: ['missing'] });
  assert.throws(() => context(root, 1), /找不到/);
  savePlan(root, { unit: 1, title: '查信', goal: '核对', change: '查到', beats: ['核对'], arc_id: 'A2' });
  assert.throws(() => context(root, 1), /arc_id/);
  write(base, '重叠.json', { ...volume, id: 'V2' });
  assert.throws(() => main(['volume', '--project', root, '--input', path.join(base, '重叠.json')]), /重叠/);
});
test('已消费卷纲不能静默改写；外部改写使上下文与导出失效', t => {
  const { base, root, volume } = work(t); append(root, 1);
  write(base, '修改.json', { ...volume, promises: ['改变承诺'] });
  assert.throws(() => main(['volume', '--project', root, '--input', path.join(base, '修改.json')]), /已用于正文/);
  write(root, '大纲/分卷/V1.json', { ...volume, promises: ['改变承诺'] });
  assert.equal(check(root).ok, false); assert.throws(() => context(root, 2), /来源已变化/);
});
test('journal 被篡改或丢失拒绝恢复，不猜状态', t => {
  const { root } = work(t); append(root, 1);
  const state = JSON.parse(fs.readFileSync(path.join(root, '.writer/state.json'))), file = path.join(root, state.units[0].journal);
  fs.appendFileSync(file, ' '); assert.throws(() => check(root), /哈希变化/);
  fs.unlinkSync(file); assert.throws(() => rewind(root, 1, 2), /缺失/);
});
test('旧作品显式备份迁移，回退后能恢复旧格式章节之前的状态', t => {
  const { base } = work(t), root = path.join(base, '旧书'); initProject(root, 'novel', '旧书');
  savePlan(root, { unit: 1, title: '旧章', goal: '核对', change: '查到', beats: ['查信'] });
  const packet = context(root, 1); write(root, '正文/旧章.md', '信到了。');
  record(root, { unit: 1, draft: '正文/旧章.md', summary: '信到了。', expected_revision: 0, source_hashes: packet.source_hashes, snapshot: { characters: { 甲: '拿到信' }, threads: [], timeline: ['信到了'] } });
  const before = fs.readFileSync(path.join(root, '.writer/state.json'));
  const result = enableLong(root, 1); assert.deepEqual(fs.readFileSync(path.join(root, result.backup)), before);
  assert.equal(check(root).ok, true); rewind(root, 1, 2);
  assert.deepEqual(main(['status', '--project', root, '--view', 'full']).snapshot, { characters: {}, threads: [], timeline: [] });
});
test('滚动审查绑定实际正文和报告版本，回退/重写后旧报告失效', t => {
  const { root, base } = work(t); for (let n = 1; n <= 3; n++) append(root, n);
  assert.deepEqual(check(root).rolling_review.pending_windows, [{ from: 1, to: 3 }]);
  write(root, '审查/连读.md', '模型自检：通读三章，交接连续，仍需作者判断。');
  const sources = Object.fromEntries([1, 2, 3].map(n => { const ref = `正文/${String(n).padStart(4, '0')}.md`; return [ref, sha(fs.readFileSync(path.join(root, ref)))]; }));
  write(base, 'review.json', { from: 1, to: 3, kind: 'model-self-review', report: '审查/连读.md', source_hashes: sources });
  main(['review', '--project', root, '--input', path.join(base, 'review.json')]);
  assert.deepEqual(check(root).rolling_review.pending_windows, []);
  fs.appendFileSync(path.join(root, '审查/连读.md'), '\n修订报告');
  assert.equal(check(root).rolling_review.stale, 1);
});
test('旧稿导入断点续跑、冻结副本不覆盖、源漂移阻断与逐章阅读边界', t => {
  const { root, base } = work(t);
  const sources = [1, 2].map(n => { const ref = `源${n}.md`; write(base, ref, `# 第${n}章\n\n信封有裂口。`); return path.join(base, ref); });
  write(base, 'import.json', { rights: '本测试自有原创夹具', files: sources });
  const cli = (cmd, args = []) => main([cmd, '--project', root, ...args]);
  cli('import-index', ['--input', path.join(base, 'import.json')]);
  const first = cli('import-next'); assert.equal(first.unit, 1); assert.equal(cli('import-next').unit, 1);
  assert.deepEqual(cli('import-status').unread_or_unregistered, [1, 2]);
  savePlan(root, { unit: 1, title: '信封', goal: '看信', change: '发现裂口', beats: ['看信'] });
  const tx = cli('record-template', ['--unit', '1', '--draft', first.draft]); tx.summary = '发现信封裂口。'; record(root, tx);
  assert.deepEqual(cli('import-status').registered_units, [1]);
  fs.appendFileSync(sources[1], '\n原稿更新'); assert.throws(() => cli('import-next'), /原文件已变化/);
  assert.equal(cli('import-status').changed_originals[0], 2);
  assert.throws(() => cli('import-index', ['--input', path.join(base, 'import.json')]), /空作品/);
  rewind(root, 1, 2);
  write(root, first.draft, '修订后的信封仍有裂口。');
  const revised = cli('record-template', ['--unit', '1', '--draft', first.draft]); revised.summary = '修订第一章，保留裂口观察。'; record(root, revised);
  assert.deepEqual(cli('import-status').registered_units, [1]);
  assert.deepEqual(cli('import-status').unchanged_baseline_units, []);
  assert.equal(cli('import-status').baseline_registered_through, 1);
});
test('独立作品工具复制全部长篇模块，单独进程可以召回与校验', t => {
  const { root } = work(t); append(root, 1, { ledger: { O1: observed } });
  const tool = path.join(root, '.writer/tool/bin/ai-writer.mjs');
  for (const args of [['check'], ['recall', '--query', '裂口']]) {
    const run = spawnSync(process.execPath, [tool, ...args, '--project', root], { cwd: root, encoding: 'utf8' });
    assert.equal(run.status, 0, run.stderr); assert.equal(JSON.parse(run.stdout).ok, true);
  }
});
test('可选召回有界，显式/到期/置顶不被容量裁掉，物证保管状态进入上下文', t => {
  const { root } = work(t), ledger = {};
  for (let n = 0; n < 18; n++) ledger[`F${n}`] = { type: 'thread', statement: `裂口问题${n}`, status: 'pending', cast: ['阿禾'], evidence: [{ unit: 1, quote: '阿禾看见信封有一道裂口。' }] };
  ledger.P1 = { type: 'object', statement: '信封', status: 'active', cast: ['老陈'], pinned: true, custody: { holder: '老陈', location: '铁柜', condition: '裂口' }, evidence: [{ unit: 1, quote: '老陈锁进铁柜。' }] };
  append(root, 1, { ledger });
  savePlan(root, { unit: 2, title: '核查', goal: '查信', change: '确认', cast: ['阿禾'], recall_ids: ['F17'], beats: ['检查'] });
  const packet = context(root, 2);
  assert.equal(Object.keys(packet.continuity.author).length, 14);
  assert.equal(packet.continuity.author.P1.custody.holder, '老陈');
  assert.ok(packet.continuity.recall.selected.F17.includes('explicit'));
  assert.equal(packet.continuity.recall.omitted_ids.length, 5);
});
test('物证交接拒绝错认原保管人，知识增量保留另一人物，完整快照不能删掉账本', t => {
  const { root } = work(t);
  append(root, 1, { ledger: { P1: { type: 'object', statement: '信封', status: 'active', cast: ['阿禾'], custody: { holder: '阿禾', location: '桌面', condition: '裂口' }, character_known: { 阿禾: '见裂口', 老陈: '只知道有信' }, evidence: [{ unit: 1, quote: '阿禾看见信封有一道裂口。' }] } } });
  savePlan(root, { unit: 2, title: '交接', goal: '存信', change: '换手', cast: ['老陈'], beats: ['锁柜'] });
  write(root, '正文/0002.md', '老陈锁进铁柜。');
  const tx = main(['record-template', '--project', root, '--unit', '2', '--draft', '正文/0002.md']); tx.summary = '老陈锁柜';
  tx.changes.ledger.P1 = { custody: { holder: '老陈', location: '铁柜', condition: '裂口' }, previous_holder: '错误人名', character_known: { 老陈: '见到裂口' }, evidence: [{ unit: 2, quote: '老陈锁进铁柜。' }] };
  assert.throws(() => record(root, tx), /previous_holder/); tx.changes.ledger.P1.previous_holder = '阿禾'; record(root, tx);
  const snapshot = main(['status', '--project', root, '--view', 'full']).snapshot; assert.equal(snapshot.ledger.P1.character_known.阿禾, '见裂口');
  savePlan(root, { unit: 3, title: '核对', goal: '查信', change: '确认', beats: ['检查'] }); write(root, '正文/0003.md', '她回来了。');
  const third = main(['record-template', '--project', root, '--unit', '3', '--draft', '正文/0003.md']); delete third.changes; third.summary = '她回来'; third.snapshot = { characters: {}, threads: [], timeline: [] };
  assert.throws(() => record(root, third), /ledger/);
});
test('新增参考快照与清单绑定固定提交和MIT许可，原文不进入运行依赖', () => {
  const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'docs/oh-story-audit-manifest.json'), 'utf8'));
  assert.equal(manifest.commit, '6d72f70e5fe3de110b457fd6bc81ede6ea614702');
  assert.equal(sha(fs.readFileSync(path.join(ROOT, manifest.source_inventory))), manifest.inventory_sha256);
  for (const row of manifest.retained) assert.equal(sha(fs.readFileSync(path.join(ROOT, row.file))), row.sha256);
  assert.match(fs.readFileSync(path.join(ROOT, 'vendor/oh-story-reference-20261015/LICENSE'), 'utf8'), /MIT License/);
});
test('长篇恢复入口默认精简，完整快照只在显式查看时返回', t => {
  const { root } = work(t); append(root, 1, { ledger: { O1: observed } });
  const brief = main(['status', '--project', root]);
  assert.equal(brief.view, 'compact'); assert.equal('snapshot' in brief, false);
  assert.equal(brief.current.ledger_count, 1); assert.equal(brief.next_unit, 2);
  const full = main(['status', '--project', root, '--view', 'full']); assert.equal(full.snapshot.ledger.O1.statement, observed.statement);
});
test('旧稿角色键顺序变化不应使迁移后的差量链失效', t => {
  const { base } = work(t), root = path.join(base, '键序旧书'); initProject(root, 'novel', '键序旧书');
  for (const unit of [1, 2]) {
    savePlan(root, { unit, title: '收到信', goal: '核查', change: '继续', beats: ['核查'] });
    const packet = context(root, unit), draft = `正文/000${unit}.md`; write(root, draft, `第${unit}天收信。`);
    record(root, { unit, draft, summary: '收到信，位置未变。', expected_revision: packet.revision, source_hashes: packet.source_hashes,
      snapshot: { characters: unit === 1 ? { 甲: '东门', 乙: '西门' } : { 乙: '西门', 甲: '东门' }, threads: [], timeline: [`第${unit}天收信`] } });
  }
  enableLong(root, 2); assert.equal(check(root).ok, true);
  rewind(root, 2, 3); assert.deepEqual(main(['status', '--project', root, '--view', 'full']).snapshot.characters, { 甲: '东门', 乙: '西门' });
});
