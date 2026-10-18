import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { ROOT, main, initProject, savePlan, record, rewind, check, exportWork, enableLong } from '../lib/workspace.mjs';

const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const write = (root, ref, value) => { const file = path.join(root, ref); fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, typeof value === 'string' ? value : JSON.stringify(value, null, 2), 'utf8'); return file; };
function work(t, kind = 'novel') {
  fs.mkdirSync(path.join(ROOT, '.tmp'), { recursive: true });
  const base = fs.mkdtempSync(path.join(ROOT, '.tmp/usability-test-')), root = path.join(base, '中文 空格作品');
  t.after(() => { assert.ok(fs.realpathSync(base).startsWith(fs.realpathSync(path.join(ROOT, '.tmp')) + path.sep)); fs.rmSync(base, { recursive: true, force: true }); });
  initProject(root, kind, '用法验证', { legacy: true });
  return { base, root };
}
function append(root, unit) {
  savePlan(root, { unit, title: '核对', goal: '核对材料', change: '确认数量', beats: ['核对'] });
  const draft = `正文/${String(unit).padStart(4, '0')}.md`;
  const input = main(['record-template', '--project', root, '--unit', String(unit), '--draft', draft]);
  write(root, draft, `# 第${unit}章\n\n小林核对了第${unit}张收据。\n`);
  input.summary = `核对第${unit}张收据`; input.snapshot.timeline.push(input.summary); record(root, input);
  return draft;
}
function cli(args, cwd = ROOT, script = path.join(ROOT, 'bin/ai-writer.mjs')) {
  const run = spawnSync(process.execPath, [script, ...args], { cwd, encoding: 'utf8' });
  assert.equal(run.error, undefined);
  return run;
}

test('未登记、同编号替代和回退保留稿都可见；导出清单列出排除且不混入正文', t => {
  const { base, root } = work(t); append(root, 1); const second = append(root, 2);
  write(root, '正文/0002-替代.md', '替代文本不能偷偷合并。');
  write(root, '正文/备选/0003-草稿.txt', '未完成登记的新稿。');
  rewind(root, 2, 2);
  const status = main(['status', '--project', root]);
  assert.equal(status.draft_inventory.registered_count, 1);
  assert.equal(status.draft_inventory.unregistered.length, 3);
  assert.ok(status.draft_inventory.unregistered.some(row => row.draft === second));
  const report = check(root); assert.equal(report.ok, true);
  assert.equal(report.findings.filter(row => row.code === 'UNREGISTERED_DRAFT').length, 3);
  const output = path.join(base, '交付'), exp = exportWork(root, output);
  assert.deepEqual(exp.included_units, [1]); assert.equal(exp.excluded_drafts.length, 3);
  const saved = JSON.parse(fs.readFileSync(path.join(output, 'manifest.json'), 'utf8'));
  assert.deepEqual(saved.excluded_drafts, exp.excluded_drafts);
  assert.doesNotMatch(fs.readFileSync(path.join(output, 'manuscript.md'), 'utf8'), /替代文本|第2张|未完成登记/);
  assert.ok(fs.existsSync(path.join(root, second)));
});

test('独立作品帮助、所有用户指南链接及新工具可离开主项目使用', t => {
  const { root } = work(t); const script = path.join(root, '.writer/tool/bin/ai-writer.mjs');
  for (const command of ['init', 'plan', 'record', 'style-scan', 'import-relink']) {
    const run = cli([command, '--help'], root, script); assert.equal(run.status, 0, run.stderr); assert.match(run.stdout, /ai-writer/);
  }
  const contextualHelp = cli(['record', '--project', root, '--help'], root, script); assert.equal(contextualHelp.status, 0, contextualHelp.stderr);
  const targetedDoctor = cli(['doctor', '--project', root], ROOT); assert.equal(targetedDoctor.status, 0, targetedDoctor.stderr);
  assert.equal(JSON.parse(targetedDoctor.stdout).tool_root, path.join(root, '.writer/tool'));
  const status = cli(['status'], root, script); assert.equal(status.status, 0); assert.equal(JSON.parse(status.stdout).next_unit, 1);
  const doctor = cli(['doctor'], root, script); assert.equal(doctor.status, 0, doctor.stderr);
  for (const name of fs.readdirSync(path.join(root, 'docs'))) {
    const file = path.join(root, 'docs', name), body = fs.readFileSync(file, 'utf8');
    for (const match of body.matchAll(/\]\(([^)]+)\)/g)) {
      if (/^(?:https?:|#)/.test(match[1])) continue;
      assert.ok(fs.existsSync(path.resolve(path.dirname(file), match[1])), `${name}: ${match[1]}`);
    }
  }
  const child = path.join(root, '子作品');
  const nestedInit = cli(['init', '--path', child, '--kind', 'essay', '--title', '子作品'], root, script);
  assert.equal(nestedInit.status, 0, nestedInit.stderr);
  assert.ok(fs.existsSync(path.join(child, 'docs/deslop.md')));
});

test('独立作品保留来源、原文与许可，缺失许可时诊断明确报错', t => {
  const { root } = work(t);
  for (const ref of ['LICENSE.md', 'docs/source-manifest.json', 'docs/oh-story-audit-manifest.json', 'docs/usability-sources.json']) assert.equal(sha(path.join(root, ref)), sha(path.join(ROOT, ref)));
  const provenance = JSON.parse(fs.readFileSync(path.join(root, 'docs/usability-sources.json'), 'utf8'));
  for (const row of provenance.files) assert.equal(sha(path.join(root, row.file)), row.sha256);
  const license = 'vendor/oh-story-deslop-reference/LICENSE';
  fs.unlinkSync(path.join(root, license));
  assert.ok(main(['doctor','--project',root]).warnings.some(message=>message.includes(license)));
  fs.unlinkSync(path.join(root,'.writer/tool',license));
  const report = main(['doctor', '--project', root]);
  assert.equal(report.ok, false); assert.ok(report.errors.some(message => message.includes(license)));
});

test('缺作品、缺章纲、无效JSON与空导出提供定位及下一步；错误参数仍拒绝', t => {
  const { base, root } = work(t);
  const missing = cli(['status', '--project', path.join(base, '不存在')]);
  assert.equal(missing.status, 2); assert.equal(JSON.parse(missing.stderr).code, 'PROJECT_NOT_FOUND');
  const noPlan = cli(['context', '--project', root, '--unit', '1']);
  assert.equal(noPlan.status, 2); const detail = JSON.parse(noPlan.stderr);
  assert.equal(detail.code, 'PLAN_REQUIRED'); assert.match(detail.next_command, /plan/); assert.ok(detail.file.endsWith('0001.json'));
  const input = write(base, '坏输入.json', '{"unit":1,}');
  const malformed = JSON.parse(cli(['plan', '--project', root, '--input', input]).stderr);
  assert.equal(malformed.code, 'INVALID_JSON'); assert.equal(malformed.file, input); assert.ok(malformed.next_action);
  const empty = JSON.parse(cli(['export', '--project', root, '--out', path.join(base, '导出')]).stderr);
  assert.equal(empty.code, 'EXPORT_NOT_READY'); assert.match(empty.next_command, /check/);
  assert.equal(cli(['record', '--help', '--force']).status, 2);
  assert.equal(cli(['record', '--help', '--help']).status, 2);
  assert.doesNotMatch(main(['init', '--help']).help, /可省略 --project/);
  assert.match(main(['init', '--help']).help, /不接受 --project/);
  assert.match(main(['doctor', '--help']).help, /默认检查当前工具/);
  assert.throws(() => main(['status']), /project/);
});

function importing(t) {
  const { base, root } = work(t); enableLong(root, 0);
  const volume = { id: 'V1', title: '旧稿', start: 1, end: 3, promises: ['核对'], constraints: [], reserved: [], arcs: [{ id: 'A1', start: 1, end: 3, goal: '核对', payoff: '确认', forbidden: [] }] };
  main(['volume', '--project', root, '--input', write(base, '卷.json', volume)]);
  const first = write(base, '原稿1.md', '第一张收据在柜里。'), second = write(base, '原稿2.md', '第二张收据在桌上。');
  main(['import-index', '--project', root, '--input', write(base, '导入.json', { rights: '测试自有文本', files: [first, second] })]);
  const imported = main(['import-next', '--project', root]);
  savePlan(root, { unit: 1, title: '第一张', goal: '核对', change: '确认', beats: ['看收据'] });
  const tx = main(['record-template', '--project', root, '--unit', '1', '--draft', imported.draft]); tx.summary = '收据在柜里'; record(root, tx);
  return { base, root, first, second };
}

test('已部分登记的旧稿可按相同哈希重定位，原状态与冻结清单及旧上下文保持有效', t => {
  const { base, root, first, second } = importing(t);
  const next = main(['import-next', '--project', root]);
  savePlan(root, { unit: 2, title: '第二张', goal: '核对', change: '确认', beats: ['看收据'] });
  const tx = main(['record-template', '--project', root, '--unit', '2', '--draft', next.draft]); tx.summary = '第二张在桌上';
  const state = sha(path.join(root, '.writer/state.json')), manifest = sha(path.join(root, '.writer/import.json'));
  const movedFirst = path.join(base, '新1.md'), movedSecond = path.join(base, '新2.md');
  fs.renameSync(first, movedFirst); fs.renameSync(second, movedSecond);
  const blocked = main(['import-status', '--project', root]);
  assert.equal(blocked.ok, false); assert.equal(blocked.can_continue, false); assert.equal(blocked.blockers[0].path, second);
  assert.throws(() => main(['import-next', '--project', root]), /已变化或缺失/);
  const input = write(base, '映射.json', { files: [{ unit: 1, path: movedFirst }, { unit: 2, path: movedSecond }] });
  const result = main(['import-relink', '--project', root, '--input', input, '--expected-revision', '2']);
  assert.equal(result.location_revision, 1); assert.equal(result.relocated.length, 2);
  assert.equal(sha(path.join(root, '.writer/state.json')), state); assert.equal(sha(path.join(root, '.writer/import.json')), manifest);
  assert.equal(main(['import-status', '--project', root]).can_continue, true);
  assert.equal(main(['import-next', '--project', root]).draft, next.draft);
  assert.equal(main(['import-relink', '--project', root, '--input', input, '--expected-revision', '2']).unchanged, true);
  record(root, tx); assert.equal(check(root).ok, true);
  const complete = main(['import-status', '--project', root]); assert.equal(complete.phase, 'complete'); assert.equal(complete.can_continue, false); assert.equal(complete.ok, true);
  const log = JSON.parse(fs.readFileSync(path.join(root, '.writer/import-locations.json'), 'utf8'));
  assert.equal(log.history.length, 1); assert.equal(log.history[0].changes.length, 2);
});

test('重定位整批拒绝不同内容、重复单元、未知单元与过期修订号，不留下部分定位', t => {
  const { base, root, first } = importing(t), good = write(base, '相同.md', fs.readFileSync(first, 'utf8')), bad = write(base, '不同.md', '改变的版本');
  const run = (files, revision = 2) => main(['import-relink', '--project', root, '--input', write(base, '映射.json', { files }), '--expected-revision', String(revision)]);
  assert.throws(() => run([{ unit: 1, path: good }, { unit: 2, path: bad }]), /哈希不同/);
  assert.throws(() => run([{ unit: 1, path: good }, { unit: 1, path: good }]), /重复/);
  assert.throws(() => run([{ unit: 9, path: good }]), /不存在/);
  assert.throws(() => run([{ unit: 1, path: good }], 1), /修订号/);
  assert.equal(fs.existsSync(path.join(root, '.writer/import-locations.json')), false);
  assert.equal(main(['status', '--project', root]).revision, 2);
});

test('重定位后新路径漂移继续阻断，不把定位记录当成内容豁免', t => {
  const { base, root, second } = importing(t), same = write(base, '相同2.md', fs.readFileSync(second, 'utf8'));
  main(['import-relink', '--project', root, '--input', write(base, '映射.json', { files: [{ unit: 2, path: same }] }), '--expected-revision', '2']);
  fs.appendFileSync(same, '新增内容');
  assert.equal(main(['import-status', '--project', root]).can_continue, false);
  assert.throws(() => main(['import-next', '--project', root]), /已变化或缺失/);
});

test('去味扫描只提供候选，保留正常对比句与原稿；报告绑定哈希且不覆盖', t => {
  const { root } = work(t), draft = '正文/0001.md';
  write(root, draft, '# 核对\n\n这不是松木，而是杉木。\n\n他深吸一口气，潜入水中。\n\n> 史料引用：不是甲而是乙。\n');
  const before = sha(path.join(root, draft)), state = sha(path.join(root, '.writer/state.json'));
  const scan = main(['style-scan', '--project', root, '--draft', draft, '--out', '审查/scan.json']);
  assert.equal(scan.source_sha256, before); assert.equal(scan.quality_verdict, 'requires-contextual-reading');
  assert.equal(scan.candidate_count, 2); assert.ok(scan.candidates.every(row => row.advisory === true));
  assert.equal(scan.skipped_quote_or_code_lines, 1); assert.ok(scan.manual_review.length > 0);
  assert.equal(sha(path.join(root, draft)), before); assert.equal(sha(path.join(root, '.writer/state.json')), state);
  const reportHash = sha(path.join(root, '审查/scan.json'));
  assert.throws(() => main(['style-scan', '--project', root, '--draft', draft, '--out', '审查/scan.json']), /EEXIST/);
  assert.equal(sha(path.join(root, '审查/scan.json')), reportHash);
  assert.throws(() => main(['style-scan', '--project', root, '--draft', '../外部.md']), /draft/);
});

test('去味零命中不产生文学通过结论，历史扫描也不改事实限定与引文', t => {
  const { root } = work(t, 'history'), draft = '正文/0001.md';
  write(root, draft, '# 史料\n\n现存材料不足以确认具体日期，不能由此推出私人动机。\n\n> 原文：缓缓开口。\n');
  const before = sha(path.join(root, draft));
  const scan = main(['style-scan', '--project', root, '--draft', draft]);
  assert.equal(scan.candidate_count, 0); assert.equal(scan.kind, 'history'); assert.equal(scan.quality_verdict, 'requires-contextual-reading');
  assert.equal(sha(path.join(root, draft)), before);
});

test('段落节奏扫描按空行分段，不把编辑器换行当成四个段落', t => {
  const { root } = work(t), draft = '正文/段落.md', line = '他在柜前核对每一张收据，按照收到的顺序排好，随后记下了各张收据的编号。';
  write(root, draft, Array(4).fill(line).join('\n'));
  assert.equal(main(['style-scan', '--project', root, '--draft', draft]).candidates.filter(row => row.category === 'uniform-rhythm').length, 0);
  write(root, draft, Array(4).fill(line).join('\n\n'));
  assert.equal(main(['style-scan', '--project', root, '--draft', draft]).candidates.filter(row => row.category === 'uniform-rhythm').length, 1);
});
