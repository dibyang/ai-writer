import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, initProject, main, savePlan, record, exportWork } from '../lib/workspace.mjs';

function base(t) {
  fs.mkdirSync(path.join(ROOT, '.tmp'), { recursive: true });
  const dir = fs.mkdtempSync(path.join(ROOT, '.tmp/rename-test-'));
  t.after(() => { assert.ok(fs.realpathSync(dir).startsWith(fs.realpathSync(path.join(ROOT, '.tmp')) + path.sep)); fs.rmSync(dir, { recursive: true, force: true }); });
  return dir;
}
const temporary = () => Object.assign(new Error('injected temporary rename denial'), { code: 'EPERM' });

test('Windows 初始化目录短暂拒绝后可有界重试完成，正文配置不丢失', { skip: process.platform !== 'win32' }, t => {
  const dir = base(t), target = path.join(dir, '作品'), original = fs.renameSync;
  let attempts = 0;
  const mock = t.mock.method(fs, 'renameSync', (from, to) => {
    if (path.basename(from).startsWith('.ai-writer-init-')) { attempts++; if (attempts <= 2) throw temporary(); }
    return original(from, to);
  });
  try { initProject(target, 'novel', '重试'); } finally { mock.mock.restore(); }
  assert.ok(attempts >= 3 && attempts <= 6);
  assert.equal(JSON.parse(fs.readFileSync(path.join(target, 'writer.json'), 'utf8')).title, '重试');
  assert.equal(main(['doctor', '--project', target]).ok, true);
});

test('Windows 持续拒绝最多尝试六次，仍报错且不留下半成品目标', { skip: process.platform !== 'win32' }, t => {
  const dir = base(t), target = path.join(dir, '作品'), original = fs.renameSync;
  let attempts = 0;
  const mock = t.mock.method(fs, 'renameSync', (from, to) => {
    if (path.basename(from).startsWith('.ai-writer-init-')) { attempts++; throw temporary(); }
    return original(from, to);
  });
  try { assert.throws(() => initProject(target, 'novel', '拒绝'), error => error.code === 'EPERM'); } finally { mock.mock.restore(); }
  assert.equal(attempts, 6); assert.equal(fs.existsSync(target), false);
  assert.equal(fs.readdirSync(dir).some(name => name.startsWith('.ai-writer-init-')), false);
});

test('Windows 重试期间目标被创建时停止，保留竞争方文件不覆盖', { skip: process.platform !== 'win32' }, t => {
  const dir = base(t), target = path.join(dir, '作品'), original = fs.renameSync;
  let attempts = 0;
  const mock = t.mock.method(fs, 'renameSync', (from, to) => {
    if (path.basename(from).startsWith('.ai-writer-init-')) {
      attempts++; fs.mkdirSync(target); fs.writeFileSync(path.join(target, '保留.txt'), '其他任务的内容'); throw temporary();
    }
    return original(from, to);
  });
  try { assert.throws(() => initProject(target, 'novel', '不能覆盖'), /不覆盖/); } finally { mock.mock.restore(); }
  assert.equal(attempts, 1); assert.equal(fs.readFileSync(path.join(target, '保留.txt'), 'utf8'), '其他任务的内容');
  assert.equal(fs.existsSync(path.join(target, 'writer.json')), false);
});

test('Windows 导出目录也处理短暂重命名拒绝，不更改正文或状态', { skip: process.platform !== 'win32' }, t => {
  const dir = base(t), root = path.join(dir, '作品'), output = path.join(dir, '交付');
  initProject(root, 'novel', '导出');
  savePlan(root, { unit: 1, title: '核对', goal: '核对', change: '确认', beats: ['核对'] });
  const input = main(['record-template', '--project', root, '--unit', '1', '--draft', '正文/0001.md']);
  fs.writeFileSync(path.join(root, input.draft), '# 核对\n\n小林收好了收据。\n'); input.summary = '收好收据'; record(root, input);
  const state = fs.readFileSync(path.join(root, '.writer/state.json')), original = fs.renameSync;
  let attempts = 0;
  const mock = t.mock.method(fs, 'renameSync', (from, to) => {
    if (path.basename(from).startsWith('.ai-writer-export-')) { attempts++; if (attempts <= 2) throw temporary(); }
    return original(from, to);
  });
  try { exportWork(root, output); } finally { mock.mock.restore(); }
  assert.ok(attempts >= 3 && attempts <= 6);
  assert.ok(fs.existsSync(path.join(output, 'manifest.json')));
  assert.deepEqual(fs.readFileSync(path.join(root, '.writer/state.json')), state);
});
