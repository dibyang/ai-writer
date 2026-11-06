import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { RUNTIME_FILES, runtimeFilesFor, identifyBuild, packageFiles } from '../lib/tool-build.mjs';
import { ROOT } from './protection-fixture.mjs';

test('旧版运行文件清单保持历史前缀，调用方不能修改基线', () => {
  for (const [minor, length] of [[1, 3], [2, 5], [3, 7], [4, 9], [5, 11], [6, 12], [7, 14], [8, 14], [9, 14], [10, 14], [11, 14]]) {
    assert.deepEqual(runtimeFilesFor({ version: `0.${minor}.0` }), RUNTIME_FILES.slice(0, length));
  }
  runtimeFilesFor('0.11.0').pop();
  assert.equal(runtimeFilesFor('0.11.0').length, 14);
});

test('0.12 包缺少新增模块时不能伪装为完整来源', t => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ai-writer-012-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  for (const name of ['lib', 'bin', 'docs', 'vendor', '.agents', 'examples', 'LICENSE.md', 'NOTICE', 'package.json']) {
    fs.cpSync(path.join(ROOT, name), path.join(dir, name), { recursive: true });
  }
  for (const file of RUNTIME_FILES.slice(14)) fs.rmSync(path.join(dir, file), { force: true });
  const pkgPath = path.join(dir, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8')); pkg.version = '0.12.0';
  fs.writeFileSync(pkgPath, JSON.stringify(pkg));
  const build = identifyBuild(dir);
  assert.equal(build.ok, false);
  for (const file of RUNTIME_FILES.slice(14)) assert.ok(build.missing.some(row => row.file === file), file);
  assert.throws(() => packageFiles(dir), { code: 'TOOL_SOURCE_INVALID' });
});

test('未知未来版本不沿用旧清单', () => {
  assert.deepEqual(runtimeFilesFor('0.12.0'), RUNTIME_FILES);
  assert.deepEqual(runtimeFilesFor('0.12.0').slice(14), [
    'lib/task-preparation.mjs', 'lib/project-backup.mjs', 'lib/upgrade-preparation.mjs', 'lib/backup-posix.py',
  ]);
  for (const version of ['0.13.0', '1.0.0', 'invalid']) {
    assert.throws(() => runtimeFilesFor(version), { code: 'BUILD_UNSUPPORTED_VERSION' });
  }
});
