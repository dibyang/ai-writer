import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync, execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

// Isolated usability probes: no existing manuscript or product file is modified.
const output = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(output, '../..');
const resultFile = path.join(output, 'results.json');
if (fs.existsSync(resultFile)) throw new Error('Results already exist; preserve the previous review.');
fs.mkdirSync(path.join(root, '.tmp'), { recursive: true });
const sandbox = fs.mkdtempSync(path.join(root, '.tmp/usability-'));
const tool = path.join(root, 'bin/ai-writer.mjs');
const cases = [];
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const tracked = ['bin/ai-writer.mjs', 'lib/workspace.mjs', 'lib/longform.mjs', 'lib/journal.mjs', 'README.md', 'docs/workflow.md', 'docs/long-form.md', '.agents/skills/writer-project/SKILL.md'];
const before = Object.fromEntries(tracked.map(file => [file, hash(path.join(root, file))]));
function run(id, args, options = {}) {
  const cwd = options.cwd ?? root;
  const script = options.tool ?? tool;
  const result = spawnSync(process.execPath, [script, ...args], { cwd, encoding: 'utf8', timeout: 30000, maxBuffer: 4 * 1024 * 1024 });
  if (result.error) throw result.error;
  let parsed = null;
  try { parsed = JSON.parse(result.stdout.trim() || result.stderr); } catch {}
  const row = { id, cwd, command: [process.execPath, script, ...args], exit_code: result.status, stdout: result.stdout, stderr: result.stderr, parsed };
  cases.push(row);
  console.log(`${id}: exit ${result.status}`);
  return row;
}
function must(row) {
  if (row.exit_code !== 0) throw new Error(`Probe setup failed at ${row.id}: ${row.stderr}`);
  return row.parsed;
}
function writeJson(file, value, bom = false) {
  fs.writeFileSync(file, `${bom ? '\uFEFF' : ''}${JSON.stringify(value, null, 2)}\n`, 'utf8');
}
function savePlan(project, unit, bom = false) {
  const input = path.join(sandbox, `plan-${path.basename(project)}-${unit}.json`);
  writeJson(input, { unit, title: `探针${unit}`, goal: '验证文件流程', change: '记录实际操作结果', beats: ['打开柜门并登记'], cast: [] }, bom);
  return run(`plan-${path.basename(project)}-${unit}${bom ? '-bom' : ''}`, ['plan', '--project', project, '--input', input]);
}
function register(project, unit) {
  const draft = `正文/${String(unit).padStart(4, '0')}-探针.md`;
  const template = must(run(`template-${unit}`, ['record-template', '--project', project, '--unit', String(unit), '--draft', draft]));
  fs.writeFileSync(path.join(project, draft), `# 探针${unit}\n\n第${unit}次操作：小林打开柜门，核对了登记册。\n`, 'utf8');
  template.summary = `完成第${unit}次操作核对。`;
  template.snapshot.timeline.push(`第${unit}次操作已完成`);
  const input = path.join(sandbox, `record-${unit}.json`);
  writeJson(input, template);
  must(run(`record-${unit}`, ['record', '--project', project, '--input', input]));
}

run('global-help', ['--help']);
run('init-help', ['init', '--help']);
run('record-help', ['record', '--help']);
run('wrong-project', ['status', '--project', path.join(sandbox, '不存在')]);
const project = path.join(sandbox, '中文 空格作品');
must(run('init', ['init', '--path', project, '--kind', 'novel', '--title', '易用性探针']));
run('empty-status', ['status', '--project', project]);
run('empty-context', ['context', '--project', project, '--unit', '1']);
run('empty-export', ['export', '--project', project, '--out', path.join(sandbox, 'empty-export')]);
must(savePlan(project, 1, true));
must(run('context-bom-plan', ['context', '--project', project, '--unit', '1']));
register(project, 1);
must(savePlan(project, 2));
const pendingFile = path.join(project, '正文/0002-尚未登记.md');
fs.writeFileSync(pendingFile, '# 未登记探针\n\n第二次操作还未更新追踪。\n', 'utf8');
run('unregistered-status', ['status', '--project', project]);
run('unregistered-check', ['check', '--project', project]);
run('unregistered-export', ['export', '--project', project, '--out', path.join(sandbox, 'unregistered-export')]);
register(project, 2);
const embedded = path.join(project, '.writer/tool/bin/ai-writer.mjs');
run('embedded-help', ['--help'], { cwd: project, tool: embedded });
run('embedded-doctor', ['doctor'], { cwd: project, tool: embedded });
run('embedded-status-without-project', ['status'], { cwd: project, tool: embedded });
const embeddedDocs = Object.fromEntries(['docs/workflow.md', 'docs/long-form.md', '.agents/skills/writer-project/references/long-form.md'].map(ref => [ref, fs.existsSync(path.join(project, ref))]));
const styleFile = path.join(project, '设定/文风.md');
const originalStyle = fs.readFileSync(styleFile);
fs.appendFileSync(styleFile, '\n从下一章起减少重复解释。\n');
run('style-changed-status', ['status', '--project', project]);
run('style-changed-context', ['context', '--project', project, '--unit', '3']);
fs.writeFileSync(styleFile, originalStyle);
must(run('rewind', ['rewind', '--project', project, '--from', '2', '--expected-revision', '2']));
run('rewound-status', ['status', '--project', project]);
run('rewound-check', ['check', '--project', project]);
const retainedDrafts = fs.readdirSync(path.join(project, '正文'));

const importProject = path.join(sandbox, '导入作品');
must(run('import-init', ['init', '--path', importProject, '--kind', 'novel', '--title', '导入探针']));
must(run('long-enable', ['long-enable', '--project', importProject, '--expected-revision', '0']));
const source = path.join(sandbox, '旧稿.md');
fs.writeFileSync(source, '# 原稿探针\n\n小林关上柜门。\n', 'utf8');
const importInput = path.join(sandbox, 'import-input.json');
writeJson(importInput, { rights: '本次审查自行生成的测试文本', files: [source] });
must(run('import-index', ['import-index', '--project', importProject, '--input', importInput]));
const relocated = path.join(sandbox, '已移动的旧稿.md');
fs.renameSync(source, relocated);
run('relocated-import-status', ['import-status', '--project', importProject]);
run('relocated-import-next', ['import-next', '--project', importProject]);
const frozenManifest = JSON.parse(fs.readFileSync(path.join(importProject, '.writer/import.json'), 'utf8'));
const frozenIntact = frozenManifest.sources.every(row => hash(path.join(importProject, row.copy)) === row.sha256);
fs.copyFileSync(relocated, source, fs.constants.COPYFILE_EXCL);
must(run('restored-import-next', ['import-next', '--project', importProject]));
const malformed = path.join(sandbox, 'malformed.json');
fs.writeFileSync(malformed, '{"unit":1,}', 'utf8');
run('malformed-json', ['plan', '--project', project, '--input', malformed]);
const after = Object.fromEntries(tracked.map(file => [file, hash(path.join(root, file))]));
const report = { reviewed_commit: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim(), node: process.version, platform: process.platform, executed_at: new Date().toISOString(), sandbox, cases, observations: { embeddedDocs, retainedDrafts, frozenIntact }, product_hashes_before: before, product_hashes_after: after, product_unchanged: JSON.stringify(before) === JSON.stringify(after) };
fs.writeFileSync(resultFile, JSON.stringify(report, null, 2) + '\n', { flag: 'wx', encoding: 'utf8' });
console.log(JSON.stringify({ cases: cases.length, product_unchanged: report.product_unchanged, embeddedDocs, frozenIntact, resultFile }, null, 2));
