import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { ROOT, KINDS, initProject, savePlan, context, record, rewind, check, exportWork, safe, main } from '../lib/workspace.mjs';

function sandbox(t) {
  const base = path.join(ROOT, '.tmp'); fs.mkdirSync(base, { recursive: true });
  const dir = fs.mkdtempSync(path.join(base, 'test-'));
  t.after(async () => {
    const resolved = fs.realpathSync(dir);
    assert.equal(path.dirname(resolved), fs.realpathSync(base)); await fs.promises.rm(resolved, { recursive: true, force: true, maxRetries: 12, retryDelay: 150 });
  });
  return dir;
}
function write(root, ref, value) {
  const file = path.join(root, ref); fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, typeof value === 'string' ? value : JSON.stringify(value, null, 2), 'utf8');
}
function work(t, kind = 'novel') { const dir = sandbox(t), root = path.join(dir, '作品'); initProject(root, kind, '测试作品', { legacy: true }); return { dir, root }; }
function plan(root, unit = 1, kind = 'novel') {
  if (kind === 'history') write(root, '研究/fixture.json', { status: 'verified', claims: [{ type: 'direct', statement: '仅用于结构测试的虚构材料', boundary: '不是史料，不能进入实际历史正文', source_dependency: '单一测试夹具，不是独立互证', sources: [{ title: '测试夹具', locator: '第1行', excerpt: 'fixture', checked_at: '2026-10-15' }] }] });
  savePlan(root, { unit, title: `单元${unit}`, goal: '主角确认信件是否送达', change: '收件人身份出现疑点', beats: ['找到寄件记录', '发现编号重复'], research_refs: kind === 'history' ? ['研究/fixture.json'] : [] });
  return context(root, unit);
}
function input(root, packet) {
  const draft = `正文/${String(packet.unit).padStart(4, '0')}.md`;
  write(root, draft, `# 单元${packet.unit}\n\n门铃响了。阿禾把信封放在桌上，却没有松手。\n`);
  return { unit: packet.unit, expected_revision: packet.revision, source_hashes: packet.source_hashes,
    draft, summary: '阿禾找到寄件记录，并发现编号重复。', snapshot: { characters: { 阿禾: '值班室；怀疑记录有误' }, threads: ['编号为何重复'], timeline: [`第${packet.unit}夜：查收信件`] } };
}

for (const kind of KINDS) test(`${kind}: 初始化→细纲→上下文→登记→校验→导出，保持中文与哈希`, t => {
  const { dir, root } = work(t, kind), packet = plan(root, 1, kind), item = input(root, packet);
  const result = record(root, item); assert.equal(result.revision, 1); assert.equal(result.status, 'draft-recorded');
  assert.equal(check(root).ok, true); assert.equal(check(root).literary_quality, 'unreviewed');
  const exp = exportWork(root, path.join(dir, '导出')); assert.equal(exp.status, 'draft-export');
  const content = fs.readFileSync(path.join(dir, '导出/manuscript.md'));
  assert.match(content.toString('utf8'), /阿禾/); assert.equal(exp.sha256, crypto.createHash('sha256').update(content).digest('hex'));
  assert.equal(exp.revision, 1); assert.deepEqual(exp.units[0].source_hashes, packet.source_hashes);
  assert.deepEqual(record(root, item), { ok: true, unchanged: true, revision: 1, unit: 1 });
});
test('旧稿修订使后续追踪失效，回退保留正文及完整备份，再顺序恢复', t => {
  const { root } = work(t); record(root, input(root, plan(root)));
  record(root, input(root, plan(root, 2)));
  write(root, '正文/0001.md', '# 修订\n\n信件还未寄出。\n');
  assert.equal(check(root).ok, false); assert.throws(() => context(root, 3), /失效/);
  const result = rewind(root, 1, 2); assert.equal(result.invalidated.length, 2);
  assert.equal(fs.existsSync(path.join(root, '正文/0002.md')), true);
  assert.equal(JSON.parse(fs.readFileSync(path.join(root, result.backup))).units.length, 2);
  assert.deepEqual(main(['status', '--project', root]).snapshot.characters, {});
  const packet = plan(root); record(root, input(root, packet)); assert.equal(check(root).ok, true);
});
test('任一已读规则变化拒绝过期 context，不写入状态', t => {
  const { root } = work(t), packet = plan(root), item = input(root, packet);
  const before = fs.readFileSync(path.join(root, '.writer/state.json'));
  write(root, '设定/文风.md', '# 新声音\n从容而温暖。');
  assert.throws(() => record(root, item), /来源已变化/);
  assert.deepEqual(fs.readFileSync(path.join(root, '.writer/state.json')), before);
  assert.equal(fs.existsSync(path.join(root, '.writer/write.lock')), false);
});
test('登记后研究卡变化阻止续写和导出，并定位最早受影响单元', t => {
  const { root, dir } = work(t, 'history'); record(root, input(root, plan(root, 1, 'history')));
  // A normal state revision must not invalidate its own input state hash.
  assert.deepEqual(main(['status', '--project', root]).changed_sources, []);
  const card = JSON.parse(fs.readFileSync(path.join(root, '研究/fixture.json'), 'utf8'));
  card.claims[0].statement = '原核验结论已更正'; write(root, '研究/fixture.json', card);
  const before = fs.readFileSync(path.join(root, '.writer/state.json'));
  const status = main(['status', '--project', root]);
  assert.deepEqual(status.changed_sources, [{ unit: 1, ref: '研究/fixture.json' }]);
  assert.equal(check(root).ok, false);
  assert.throws(() => context(root, 2), /来源已变化/);
  assert.throws(() => exportWork(root, path.join(dir, 'export')), /来源已变化/);
  assert.deepEqual(fs.readFileSync(path.join(root, '.writer/state.json')), before);
  rewind(root, 1, 1); record(root, input(root, context(root, 1)));
  assert.equal(check(root).ok, true);
});
test('登记模板携带真实来源哈希及完整快照，未填摘要不能推进状态', t => {
  const { root } = work(t); record(root, input(root, plan(root)));
  const packet = plan(root, 2);
  const template = main(['record-template', '--project', root, '--unit', '2', '--draft', '正文/0002.md']);
  assert.deepEqual(template.source_hashes, packet.source_hashes);
  assert.deepEqual(template.snapshot, main(['status', '--project', root]).snapshot);
  assert.equal(template.expected_revision, 1);
  write(root, template.draft, '# 第二章\n\n她找到了信。');
  assert.throws(() => record(root, template), /summary/);
  template.summary = '她找到了信。'; template.snapshot.threads = [];
  record(root, template); assert.equal(check(root).ok, true);
});
test('依赖检查只检查已消费文件，缺失来源给出受影响单元', t => {
  const { root } = work(t); record(root, input(root, plan(root)));
  write(root, '研究/未来资料.md', '不在已登记细纲里');
  assert.equal(check(root).ok, true);
  fs.unlinkSync(path.join(root, '设定/权威规则.md'));
  assert.deepEqual(main(['status', '--project', root]).changed_sources, [{ unit: 1, ref: '设定/权威规则.md' }]);
  assert.equal(check(root).findings.some(f => f.code === 'CONTEXT_SOURCE_CHANGED' && f.ref === '设定/权威规则.md'), true);
});
test('模板保留写前来源证据，写作中规则变化拒绝登记', t => {
  const { root } = work(t); plan(root);
  const template = main(['record-template', '--project', root, '--unit', '1', '--draft', '正文/0001.md']);
  write(root, template.draft, '# 第一章\n\n她收起了信。'); template.summary = '她收起了信。';
  write(root, '设定/文风.md', '# 更换后的声音');
  assert.throws(() => record(root, template), /来源已变化/);
});
test('缺失或伪造来源哈希、跳号和过期修订号被拒绝', t => {
  const { root } = work(t), item = input(root, plan(root));
  assert.throws(() => record(root, { ...item, source_hashes: {} }), /缺项/);
  assert.throws(() => record(root, { ...item, unit: 3 }), /顺序/);
  assert.throws(() => record(root, { ...item, expected_revision: 9 }), /修订号/);
  assert.equal(main(['status', '--project', root]).next_unit, 2 - 1);
});
test('写入锁保护并发，持锁失败不会删除其他任务的锁', t => {
  const { root } = work(t); write(root, '.writer/write.lock', 'other writer');
  assert.throws(() => savePlan(root, { unit: 1 }), /正在写入/);
  assert.equal(fs.readFileSync(path.join(root, '.writer/write.lock'), 'utf8'), 'other writer');
});
test('初始化与导出不覆盖已有文件', t => {
  const { dir, root } = work(t); const before = fs.readFileSync(path.join(root, 'writer.json'));
  assert.throws(() => initProject(root, 'novel', '其他书'), /不覆盖/);
  assert.deepEqual(fs.readFileSync(path.join(root, 'writer.json')), before);
  record(root, input(root, plan(root))); const output = path.join(dir, 'output'); fs.mkdirSync(output);
  assert.throws(() => exportWork(root, output), /不覆盖/);
  assert.throws(() => exportWork(root, path.join(root, 'export')), /作品目录外/);
});
test('路径穿越、绝对路径、ADS、控制字符被拒绝', t => {
  const { root } = work(t);
  for (const ref of ['../外部.md', '/tmp/file', 'C:/file', '正文\\x.md', '正文/x:secret.md', '正文/a\0.md', '正文/../x.md', '正文/a./x.md']) assert.throws(() => safe(root, ref), /非法/);
});
test('符号链接不允许作为作品输入', t => {
  const { dir, root } = work(t); const target = path.join(dir, 'outside'); fs.mkdirSync(target);
  try { fs.symlinkSync(target, path.join(root, '研究/link'), 'junction'); }
  catch (e) { if (e.code === 'EPERM') { t.skip('当前环境不允许创建链接'); return; } throw e; }
  assert.throws(() => safe(root, '研究/link/file.md'), /符号链接/);
});
test('历史散文缺研究引用或事实卡未核验时阻断', t => {
  const { root } = work(t, 'history');
  assert.throws(() => savePlan(root, { unit: 1, title: '测试', goal: '说明', change: '理解', beats: ['说明'] }), /事实卡/);
  plan(root, 1, 'history'); write(root, '研究/fixture.json', { status: 'draft', claims: [] });
  assert.throws(() => context(root, 1), /尚未核验/);
});
test('历史事实卡必须说明史源依赖，不能把重复转录当互证', t => {
  const { root } = work(t, 'history'); plan(root, 1, 'history');
  const card = JSON.parse(fs.readFileSync(path.join(root, '研究/fixture.json'), 'utf8'));
  delete card.claims[0].source_dependency; write(root, '研究/fixture.json', card);
  assert.throws(() => context(root, 1), /source_dependency/);
});
test('历史史源的HTTPS链接不误报本地路径，真实盘符仍提示', t => {
  for (const [source, warning] of [['https://example.invalid/source', false], ['D:/private/source.md', true], ['D:\\private\\source.md', true]]) {
    const { root } = work(t, 'history'), item = input(root, plan(root, 1, 'history'));
    write(root, item.draft, `# 结构测试\n\n史源说明：[已核卷篇](${source})\n`); record(root, item);
    assert.equal(check(root).findings.some(f => f.code === 'INTERNAL_REFERENCE'), warning, source);
  }
});
test('上下文预算溢出不静默截断', t => {
  const { root } = work(t); plan(root); write(root, '设定/文风.md', '从容'.repeat(2000));
  assert.throws(() => context(root, 1, 1000), /不会静默截断/);
});
test('正文占位符阻止导出，机械通过不升级文学结论', t => {
  const { dir, root } = work(t), item = input(root, plan(root)); write(root, item.draft, '# 草稿\n\n[待补充]\n');
  record(root, item); assert.equal(check(root).ok, false);
  assert.throws(() => exportWork(root, path.join(dir, 'export')), /机械检查/);
});
test('独立作品随附的工具与技能离开主项目仍可使用', t => {
  const { root } = work(t); const script = path.join(root, '.writer/tool/bin/ai-writer.mjs');
  const result = spawnSync(process.execPath, [script, 'doctor'], { cwd: root, encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr); assert.equal(JSON.parse(result.stdout).skills, 7);
  const help = spawnSync(process.execPath, [script, '--help'], { cwd: root, encoding: 'utf8' });
  assert.match(help.stdout, /ai-writer/); assert.equal(help.status, 0);
});
test('长篇追踪超过正文的1MiB限额后仍可恢复、续写和导出', t => {
  const { root, dir } = work(t), timeline = [];
  for (let unit = 1; unit <= 100; unit++) {
    const item = input(root, plan(root, unit));
    timeline.push(`第${unit}日：阿禾在值班室整理旧信，与值班员核对寄件时间、收件地址、编号和保管交接，尚未找到寄件人。`);
    item.snapshot.timeline = [...timeline]; record(root, item);
  }
  const bytes = fs.statSync(path.join(root, '.writer/state.json')).size;
  assert.ok(bytes > 1024 * 1024); t.diagnostic(`合成100单元追踪文件：${bytes} bytes；不代表文学连续性验收`);
  assert.equal(main(['status', '--project', root]).next_unit, 101);
  assert.equal(plan(root, 101).unit, 101);
  assert.equal(check(root).ok, true);
  assert.equal(exportWork(root, path.join(dir, 'export')).units.length, 100);
});
test('CLI 拒绝拼错、重复及缺值参数', () => {
  for (const args of [['unknown'], ['doctor', '--force', 'yes'], ['init', '--path'], ['status', '--project', 'a', '--project', 'b']]) assert.throws(() => main(args));
});
test('完整来源快照哈希与许可证存在，参考原文不作为运行依赖', () => {
  const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'docs/source-manifest.json'), 'utf8'));
  for (const item of manifest.files) assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(ROOT, item.file))).digest('hex'), item.sha256, item.file);
  assert.match(fs.readFileSync(path.join(ROOT, 'vendor/oh-story-reference/LICENSE'), 'utf8'), /MIT/);
});
