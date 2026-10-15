// This file records this recheck only; it does not import or modify project tools.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const out = path.dirname(fileURLToPath(import.meta.url));
const acceptance = path.dirname(out);
const root = path.resolve(acceptance, '../..');
const names = ['末班寄存柜', '留一把椅子', '字散开以后', '导入恢复'];
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const relative = file => path.relative(root, file).split(path.sep).join('/');
const readJSON = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const writeJSON = (file, data) => fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n', { flag: 'wx', encoding: 'utf8' });
function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name, 'en')).flatMap(entry => {
    const file = path.join(dir, entry.name);
    if (entry.isSymbolicLink()) throw new Error(`Refusing symlink: ${file}`);
    return entry.isDirectory() ? walk(file) : [file];
  });
}
function snapshot() {
  const dirs = [...names.map(name => path.join(acceptance, 'works', name)), path.join(acceptance, 'import-source')];
  return Object.fromEntries(dirs.flatMap(walk).map(file => {
    const stat = fs.statSync(file);
    return [relative(file), { sha256: sha(fs.readFileSync(file)), bytes: stat.size, mtime_ms: stat.mtimeMs }];
  }));
}
function candidateAudit() {
  const candidateFile = path.join(acceptance, 'candidate-validation-v2.json');
  const candidate = readJSON(candidateFile);
  const records = [];
  for (const entry of candidate.files) {
    for (const name of ['ROOT', ...names]) {
      const file = name === 'ROOT' ? path.join(root, entry.file) : entry.file.startsWith('.agents/')
        ? path.join(acceptance, 'works', name, entry.file)
        : path.join(acceptance, 'works', name, '.writer/tool', entry.file);
      const actual = fs.existsSync(file) ? sha(fs.readFileSync(file)) : null;
      records.push({ project: name, file: relative(file), expected_sha256: entry.sha256, actual_sha256: actual, match: actual === entry.sha256 });
    }
  }
  const runtime = names.map(name => ({ project: name, files: walk(path.join(acceptance, 'works', name, '.writer/tool')).map(relative) }));
  return { candidate: relative(candidateFile), candidate_sha256: sha(fs.readFileSync(candidateFile)), records, runtime, ok: records.every(r => r.match) };
}
async function cli(name, tag, command, args = []) {
  if (!names.includes(name)) throw new Error('Unexpected work');
  const project = path.join(acceptance, 'works', name);
  const entry = path.join(project, '.writer/tool/bin/ai-writer.mjs');
  const argv = [entry, command, ...(command === 'doctor' ? [] : ['--project', project]), ...args];
  const logs = path.join(out, 'commands');
  fs.mkdirSync(logs, { recursive: true });
  const prefix = path.join(logs, `${name}--${tag}`);
  const stdoutFd = fs.openSync(prefix + '.stdout.txt', 'wx');
  const stderrFd = fs.openSync(prefix + '.stderr.txt', 'wx');
  const start = new Date();
  const result = await new Promise(resolve => {
    const child = spawn(process.execPath, argv, { cwd: root, windowsHide: true, stdio: ['ignore', stdoutFd, stderrFd] });
    let error = null;
    child.on('error', e => { error = e.message; });
    child.on('close', (code, signal) => resolve({ exit_code: code, signal, error }));
  });
  fs.closeSync(stdoutFd); fs.closeSync(stderrFd);
  const stdout = fs.readFileSync(prefix + '.stdout.txt', 'utf8');
  const stderr = fs.readFileSync(prefix + '.stderr.txt', 'utf8');
  let data = null;
  try { data = JSON.parse(stdout); } catch { /* raw output retained */ }
  const meta = { executable: process.execPath, argv, cwd: root, started_at: start.toISOString(), elapsed_ms: Date.now() - start.getTime(), ...result,
    stdout_file: relative(prefix + '.stdout.txt'), stdout_sha256: sha(stdout), stderr_file: relative(prefix + '.stderr.txt'), stderr_sha256: sha(stderr) };
  writeJSON(prefix + '.meta.json', meta);
  const display = command === 'export' && data ? { ok: data.ok, output: data.output, revision: data.revision, status: data.status, sha256: data.sha256, units: data.units?.map(unit => unit.unit) } : data;
  console.log(JSON.stringify({ project: name, tag, ...result, data: display, ...(stderr ? { stderr } : {}) }));
  return { ...meta, data };
}
const [mode, ...args] = process.argv.slice(2);
if (mode === 'initial') {
  writeJSON(path.join(out, 'protected-before.json'), { at: new Date().toISOString(), files: snapshot() });
  const candidate = candidateAudit();
  writeJSON(path.join(out, 'candidate-hashes.json'), candidate);
  console.log(JSON.stringify({ phase: 'baseline', protected_files: Object.keys(readJSON(path.join(out, 'protected-before.json')).files).length, candidate_hashes: candidate.records.length, candidate_ok: candidate.ok, mismatches: candidate.records.filter(r => !r.match) }));
  for (const name of names) {
    for (const command of ['doctor', 'status', 'check']) await cli(name, command, command);
  }
  await cli('导入恢复', 'import-status', 'import-status');
} else if (mode === 'cli') {
  await cli(args[0], args[1], args[2], args.slice(3));
} else if (mode === 'sources') {
  const historyRoot = path.join(acceptance, 'works', '字散开以后');
  const historyState = readJSON(path.join(historyRoot, '.writer/state.json'));
  const card = '研究/活版.json';
  const cardHash = sha(fs.readFileSync(path.join(historyRoot, card)));
  const history = {
    revision: historyState.revision,
    research_card: card,
    actual_card_sha256: cardHash,
    units: historyState.units.map(unit => ({
      unit: unit.unit, draft: unit.draft,
      registered_draft_sha256: unit.sha256,
      actual_draft_sha256: sha(fs.readFileSync(path.join(historyRoot, unit.draft))),
      card_registered_sha256: unit.source_hashes?.[card] ?? null,
      card_matches_registration: unit.source_hashes?.[card] === cardHash,
      registered_source_files: Object.keys(unit.source_hashes ?? {}),
      unit_keys: Object.keys(unit)
    }))
  };
  const importRoot = path.join(acceptance, 'works', '导入恢复');
  const index = readJSON(path.join(importRoot, '.writer/import.json'));
  const state = readJSON(path.join(importRoot, '.writer/state.json'));
  const imported = index.sources.map(source => {
    const unit = state.units.find(unit => unit.unit === source.unit);
    const original = sha(fs.readFileSync(source.original));
    const copy = sha(fs.readFileSync(path.join(importRoot, source.copy)));
    const draft = unit ? sha(fs.readFileSync(path.join(importRoot, unit.draft))) : null;
    return { unit: source.unit, original: relative(source.original), copy: source.copy, expected_sha256: source.sha256,
      original_sha256: original, copy_sha256: copy, registered_draft: unit?.draft, registered_draft_sha256: unit?.sha256,
      actual_draft_sha256: draft, all_match: [original, copy, unit?.sha256, draft].every(hash => hash === source.sha256) };
  });
  const result = { history, import: { indexed: imported.length, registered_units: state.units.map(unit => unit.unit), sources: imported } };
  writeJSON(path.join(out, 'source-chain-audit.json'), result);
  console.log(JSON.stringify(result));
} else if (mode === 'export') {
  for (const name of names) {
    const target = path.join(out, 'exports', name);
    if (fs.existsSync(target)) throw new Error(`Existing export left untouched: ${target}`);
    await cli(name, 'export', 'export', ['--out', target]);
  }
} else if (mode === 'verify-exports') {
  const results = names.map(name => {
    const project = path.join(acceptance, 'works', name);
    const dir = path.join(out, 'exports', name);
    const state = readJSON(path.join(project, '.writer/state.json'));
    const config = readJSON(path.join(project, 'writer.json'));
    const status = readJSON(path.join(out, 'commands', `${name}--status.stdout.txt`));
    const manifest = readJSON(path.join(dir, 'manifest.json'));
    const manuscript = fs.readFileSync(path.join(dir, 'manuscript.md'));
    const actualHash = sha(manuscript);
    const expectedUnits = state.units.map(unit => ({ unit: unit.unit, draft: unit.draft, sha256: unit.sha256, source_hashes: unit.source_hashes }));
    const draftHashes = state.units.map(unit => ({ unit: unit.unit, draft: unit.draft, expected_sha256: unit.sha256, actual_sha256: sha(fs.readFileSync(path.join(project, unit.draft))) }));
    const reconstructed = state.units.map(unit => fs.readFileSync(path.join(project, unit.draft), 'utf8').trim()).join('\n\n---\n\n') + '\n';
    const checks = {
      revision_matches_state_and_status: manifest.revision === state.revision && manifest.revision === status.revision,
      units_match_state_including_source_hashes: JSON.stringify(manifest.units) === JSON.stringify(expectedUnits),
      units_contiguous: expectedUnits.every((unit, i) => unit.unit === i + 1),
      next_unit_matches_status: status.next_unit === expectedUnits.length + 1,
      draft_hashes_match: draftHashes.every(unit => unit.expected_sha256 === unit.actual_sha256),
      manuscript_hash_matches_manifest: actualHash === manifest.sha256,
      manuscript_equals_registered_drafts_in_order: manuscript.equals(Buffer.from(reconstructed, 'utf8')),
      title_and_kind_match_config: manifest.title === config.title && manifest.kind === config.kind,
      draft_export_and_quality_required: manifest.status === 'draft-export' && manifest.quality_review === 'required'
    };
    return { project: name, directory: relative(dir), revision: manifest.revision, units: manifest.units.map(unit => unit.unit), manuscript_bytes: manuscript.length,
      manuscript_sha256: actualHash, manifest_sha256: sha(fs.readFileSync(path.join(dir, 'manifest.json'))), draft_hashes: draftHashes, checks, ok: Object.values(checks).every(Boolean) };
  });
  const metaFiles = walk(path.join(out, 'commands')).filter(file => file.endsWith('.meta.json'));
  const commands = metaFiles.map(file => {
    const meta = readJSON(file);
    const stdout = fs.readFileSync(path.join(root, meta.stdout_file));
    const stderr = fs.readFileSync(path.join(root, meta.stderr_file));
    const data = JSON.parse(stdout.toString('utf8'));
    return { file: relative(file), exit_code: meta.exit_code, ok: data.ok === true, stdout_hash_matches: sha(stdout) === meta.stdout_sha256, stderr_hash_matches: sha(stderr) === meta.stderr_sha256, stderr_bytes: stderr.length };
  });
  const result = { exports: results, commands, ok: results.every(result => result.ok) && commands.every(command => command.exit_code === 0 && command.ok && command.stdout_hash_matches && command.stderr_hash_matches) };
  writeJSON(path.join(out, 'export-verification.json'), result);
  console.log(JSON.stringify({ ok: result.ok, exports: results, command_count: commands.length, unsuccessful_commands: commands.filter(command => command.exit_code !== 0 || !command.ok || !command.stdout_hash_matches || !command.stderr_hash_matches), nonempty_stderr: commands.filter(command => command.stderr_bytes) }));
} else if (mode === 'after' || mode === 'after-final') {
  const suffix = mode === 'after-final' ? '-final' : '';
  const before = readJSON(path.join(out, 'protected-before.json')).files;
  const after = snapshot();
  writeJSON(path.join(out, `protected-after${suffix}.json`), { at: new Date().toISOString(), files: after });
  const changes = [...new Set([...Object.keys(before), ...Object.keys(after)])].filter(file => JSON.stringify(before[file]) !== JSON.stringify(after[file])).map(file => ({ file, before: before[file] ?? null, after: after[file] ?? null }));
  const candidate = candidateAudit();
  writeJSON(path.join(out, `candidate-hashes-after${suffix}.json`), candidate);
  const result = { before_files: Object.keys(before).length, after_files: Object.keys(after).length, changed_count: changes.length, changes, candidate_ok: candidate.ok, candidate_manifest_unchanged: candidate.candidate_sha256 === readJSON(path.join(out, 'candidate-hashes.json')).candidate_sha256 };
  writeJSON(path.join(out, `protected-comparison${suffix}.json`), result);
  console.log(JSON.stringify(result));
} else if (mode === 'report') {
  const beforeDoc = readJSON(path.join(out, 'protected-before.json'));
  const afterDoc = readJSON(path.join(out, 'protected-after-final.json'));
  const comparison = readJSON(path.join(out, 'protected-comparison-final.json'));
  const firstComparison = readJSON(path.join(out, 'protected-comparison.json'));
  const exports = readJSON(path.join(out, 'export-verification.json'));
  const candidate = readJSON(path.join(out, 'candidate-hashes-after-final.json'));
  const rows = names.map(name => {
    const status = readJSON(path.join(out, 'commands', `${name}--status.stdout.txt`));
    const check = readJSON(path.join(out, 'commands', `${name}--check.stdout.txt`));
    const entry = exports.exports.find(entry => entry.project === name);
    return `| ${name} | ${status.kind} | ${status.revision} | ${entry.units[0]}–${entry.units.at(-1)} | ${status.next_unit} | ${check.rolling_review.valid}/${check.rolling_review.stale} |`;
  });
  const drafts = Object.keys(beforeDoc.files).filter(file => /\/正文\/[^/]+\.md$/.test(file));
  const states = Object.keys(beforeDoc.files).filter(file => /\/\.writer\/state\.json$/.test(file));
  const unchanged = file => JSON.stringify(beforeDoc.files[file]) === JSON.stringify(afterDoc.files[file]);
  const changedExisting = Object.keys(beforeDoc.files).filter(file => !unchanged(file));
  const added = comparison.changes.filter(change => !change.before && change.after);
  if (!exports.ok || !candidate.ok || changedExisting.length || !drafts.every(unchanged) || !states.every(unchanged)) throw new Error('Report guard failed; retain evidence and investigate');
  const text = [
    '# 最终候选恢复与交付复核', '',
    `本次由当前 Codex 会话实际执行，检查区间（UTC）：${beforeDoc.at} 至 ${afterDoc.at}。随附工具、恢复及新导出复核通过，最终文件基线一致；以下保留过期审查记录和检查期间观察到的短暂目录差异。`, '',
    '实际调用四个作品各自的 `.writer/tool/bin/ai-writer.mjs`，共 19 次：doctor/status/check 各 4 次、recall 2 次、import-status 1 次、export 4 次。全部退出码 0、ok=true，stderr 为空；doctor 不带 --project，其余调用均显式指定作品目录，status 全部为默认 compact。原始 stdout/stderr、命令参数及退出码见 [commands](commands/)。', '',
    '| 作品目录 | 文体 | revision | 已登记/导出单元 | next_unit | 有效/过期审查记录 |',
    '| --- | --- | ---: | --- | ---: | --- |', ...rows, '',
    '四个 status 的 stale_units、changed_sources 均为空；check 的 findings、pending_windows 均为空。剧本仍有 1 份过期审查记录，不计为有效覆盖，本轮未重审或重登。check 仅为 mechanical-only，literary_quality=unreviewed，审查数量仅代表覆盖。doctor 均报告 7 个技能入口、engine=optional-in-workspace-copy；本轮未验证内置引擎。', '',
    '恢复回读：', '',
    '- 小说：recall 木箱定位 P001；实读 [第4章](../works/末班寄存柜/正文/0004-钥匙还在他手里.md)第25–27行与[第6章](../works/末班寄存柜/正文/0006-再盛半碗.md)第3–23、37行。箱已从郑来顺交回何素琴，现留旧站寄存室值班桌靠墙端；电话许可后局部开箱核对，合盖重拴灰带。周桂枝上午九点到站核验签领仅为预约，整箱尚未交还，原簿领物栏仍空，与 P001 当前 custody/未交还边界一致。',
    '- 剧本：recall 07 定位 P07；实读[第2场](../works/留一把椅子/正文/0002.md)第5–49行。方叔松手后小许接椅入储物间，叠椅旁贴号朝外，库门已锁，与 custody 一致。下周五八点半摆椅及老梁日后能来仍是未来事项，不能写成已经到场。',
    '- 导入：import-status 返回 total=2、registered_units=[1,2]、baseline_registered_through=2；未读/未登记范围、changed_copies、changed_originals 均为空。原文件、冻结副本、登记正文及 import.json 的两条哈希逐项一致；作品当前另有已登记第3章，导出1–3。本轮没有重新全文阅读或新写第3章；登记覆盖本身不是阅读质量证明。',
    '- 历史散文：实际查看两份已存单元纲及 [研究/活版.json](../works/字散开以后/研究/活版.json)。两章 research_refs 均指向该卡，已登记 source_hashes 与当前卡哈希一致；卡内为两项 direct、一项 inference，均依赖《梦溪笔谈》同一活版条，网页与摘录不算独立互证。只核对引用链和登记，卡内 verified 是既有标记，本轮未访问史源或新增史学核验。', '',
    '交付与保护：', '',
    `- 对照 candidate-validation-v2.json：每个作品 5 个运行文件、7 个技能入口及长篇参考各 1 个，共 52 项随附文件全部匹配；根目录对应 13 项也匹配，共 ${candidate.records.length} 项。检查前后均一致，候选清单自身哈希未变。见 [candidate-hashes.json](candidate-hashes.json)、[candidate-hashes-after-final.json](candidate-hashes-after-final.json)。`,
    '- 四次 export 均使用全新目录 `exports/作品目录名`，未覆盖既有导出。独立复算合订稿 SHA-256，核对 manifest 与当前 state/status 的 revision、全部单元顺序与范围、正文及 source_hashes，并验证合订内容等于已登记正文按序拼接；全部一致。均为 draft-export，quality_review=required。',
    `- 原始保护基线始终保留：检查前 ${comparison.before_files} 个作品/导入源文件全部保持 SHA-256、大小、mtime 不变，包括 ${drafts.length} 个正文与 ${states.length} 份 state；旧导出也未变。最终仍为 ${comparison.after_files} 个文件，差异 ${comparison.changed_count} 项，见 [protected-comparison-final.json](protected-comparison-final.json)。首次比较曾观察到 ${firstComparison.changed_count} 项新增：${firstComparison.changes.map(change => change.file).join('；')}；最终回查已不存在。写入与移除来源均未确认，本轮未操作该文件，也未重设基线；首次差异保留于 [protected-comparison.json](protected-comparison.json)。`, '',
    '| 新导出合订稿 | 实际 SHA-256 |', '| --- | --- |',
    ...exports.exports.map(entry => `| [${entry.project}](exports/${entry.project}/manuscript.md) | ${entry.manuscript_sha256} |`), '',
    '详细交付核对见 [export-verification.json](export-verification.json)；导入原文/冻结副本及事实卡登记哈希见 [source-chain-audit.json](source-chain-audit.json)。', '',
    '报告辅助脚本曾两次因模板字符串转义错误在解析阶段退出，另一次机械替换被拒且未写入；错误输出整理保留于 [report-helper-errors.json](report-helper-errors.json)。仅修正本目录新建辅助脚本后重新执行收尾，未改变原始保护基线，也未更新登记哈希绕过保护；这与上列19次成功的随附工具调用分开记录。', '',
    '本轮没有创作新正文、修改工具/技能/原有稿件或状态，没有另派代理、提交、推送或发布。只新增本目录的复核记录与草稿导出；检查期间的短暂目录差异已单列说明。该结果仅为最终候选的 Codex 恢复、工具和交付复核，不是重新创作、真人盲读、市场验证或整部长篇验收。', ''
  ].join('\n');
  fs.writeFileSync(path.join(out, 'result.md'), text, { flag: 'wx', encoding: 'utf8' });
  console.log(JSON.stringify({ report: relative(path.join(out, 'result.md')), commands: exports.commands.length, unchanged_existing_files: comparison.before_files, unchanged_drafts: drafts.length, unchanged_states: states.length, added_files: added.map(change => change.file) }));
} else throw new Error('Use initial, cli, sources, export, verify-exports, after, after-final, or report');
