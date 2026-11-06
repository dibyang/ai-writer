import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { inventoryProject } from '../lib/project-backup.mjs';

test('全树清点包含隐藏文件、未登记稿及空目录，记录内容哈希', t => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'writer-inventory-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  fs.mkdirSync(path.join(root, '.writer'));
  fs.mkdirSync(path.join(root, '空目录'));
  fs.writeFileSync(path.join(root, '.writer', 'state.json'), '{}');
  fs.writeFileSync(path.join(root, '未登记.md'), '未登记正文');
  const result = inventoryProject(root);
  assert.equal(result.file_count, 2);
  assert.ok(result.entries.some(row => row.path === '空目录' && row.type === 'directory'));
  assert.ok(result.entries.some(row => row.path === '.writer/state.json' && row.sha256 === crypto.createHash('sha256').update('{}').digest('hex')));
  assert.equal(result.bytes, Buffer.byteLength('{}未登记正文'));
});

test('清点拒绝硬链接，不把它当独立普通文件', t => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'writer-inventory-link-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const original = path.join(root, 'one'); fs.writeFileSync(original, 'data');
  try { fs.linkSync(original, path.join(root, 'two')); }
  catch (error) { if (['EPERM', 'EACCES', 'ENOTSUP'].includes(error.code)) return t.skip(`硬链接不可用：${error.code}`); throw error; }
  assert.throws(() => inventoryProject(root), { code: 'BACKUP_UNSAFE_PATH' });
});
