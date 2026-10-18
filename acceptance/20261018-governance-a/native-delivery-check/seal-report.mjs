import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const repo = process.cwd();
const base = path.resolve('acceptance/20261018-governance-a/native-delivery-check');
const commands = path.resolve('acceptance/20261018-governance-a/commands');
const sha = b => crypto.createHash('sha256').update(b).digest('hex');
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const local = name => read(path.join(base, name));
const save = (name, data) => fs.writeFileSync(path.join(base, name), JSON.stringify(data, null, 2) + '\n', { flag: 'wx' });
const output = label => {
  const dir = path.join(commands, 'native-five-' + label);
  const stdout = fs.readFileSync(path.join(dir, 'stdout.raw.txt'), 'utf8');
  const stderr = fs.readFileSync(path.join(dir, 'stderr.raw.txt'), 'utf8');
  return JSON.parse(stdout.trim() || stderr.trim());
};
const result = label => read(path.join(commands, 'native-five-' + label, 'result.json'));
const expectedNegatives = new Map([
  ['native-five-fixture-main-doctor', { category: 'doctor-incompatibility', exit: 1, code: null, snapshot: 'fixture-doctor' }],
  ['native-five-fixture-old-status', { category: 'old-parser-refusal', exit: 2, code: 'COMMAND_FAILED', snapshot: 'fixture-old-status' }],
  ['native-five-invalid-prototype', { category: 'invalid-id-refusal', exit: 2, code: 'INVALID_INPUT', snapshot: 'invalid-id' }],
  ['native-five-structure-unit2-refusal', { category: 'authorization-refusal', exit: 2, code: 'ACTION_OUT_OF_SCOPE', snapshot: 'structure-draft' }],
  ['native-five-paused-discussion-refusal', { category: 'authorization-refusal', exit: 2, code: 'ACTION_OUT_OF_SCOPE', snapshot: 'paused-discussion' }]
]);
const entries = [];
const unexpected = [];
for (const label of fs.readdirSync(commands).filter(x => x.startsWith('native-five-')).sort()) {
  const dir = path.join(commands, label);
  const r = read(path.join(dir, 'result.json'));
  const bytes = fs.readFileSync(path.join(dir, 'stdout.raw.txt'));
  const parsed = output(label.slice('native-five-'.length));
  const e = expectedNegatives.get(label);
  const good = !r.error && !r.signal && r.exit_code === (e?.exit ?? 0) && (!e?.code || parsed.code === e.code);
  const entry = { label, ...r, category: e?.category ?? 'success', expected_exit: e?.exit ?? 0, matched_expectation: good, product_code: parsed.code ?? null, stdout_sha256: sha(bytes), stderr_sha256: sha(fs.readFileSync(path.join(dir, 'stderr.raw.txt'))), evidence: path.relative(base, dir).replaceAll('\\', '/') };
  entries.push(entry);
  if (!good) unexpected.push(entry);
}
assert.equal(entries.length, 34);
assert.equal(unexpected.length, 0);
const negativeHashes = [];
for (const [label, spec] of expectedNegatives) {
  const before = local(spec.snapshot + '-before.json');
  const after = local(spec.snapshot + '-after.json');
  assert.deepEqual(before.roots, after.roots);
  const entry = entries.find(x => x.label === label);
  assert.equal(entry.before_state_sha256, entry.after_state_sha256);
  negativeHashes.push({ label, category: spec.category, exit_code: entry.exit_code, product_code: entry.product_code, before_manifest: spec.snapshot + '-before.json', after_manifest: spec.snapshot + '-after.json', all_files_unchanged: true, before_tree_digest: before.roots[0].digest, after_tree_digest: after.roots[0].digest, file_count: before.roots[0].count, before_state_sha256: entry.before_state_sha256, after_state_sha256: entry.after_state_sha256, manuscripts_before: Object.fromEntries(Object.entries(before.roots[0].files).filter(([p]) => p.startsWith('正文/'))), manuscripts_after: Object.fromEntries(Object.entries(after.roots[0].files).filter(([p]) => p.startsWith('正文/'))) });
}
save('negative-request-hashes.json', negativeHashes);
const before = local('protected-before.json');
const after = local('protected-final.json');
const drift = [];
for (const a of before.roots) {
  const b = after.roots.find(x => x.root === a.root);
  for (const file of new Set([...Object.keys(a.files), ...Object.keys(b.files)])) if (JSON.stringify(a.files[file]) !== JSON.stringify(b.files[file])) drift.push({ root: a.root, file, before: a.files[file] ?? null, after: b.files[file] ?? null });
}
const projectRoots = Object.keys(before.roots[0].files).filter(x => x.startsWith('acceptance/20261018-governance-a/') && x.endsWith('/.writer/state.json')).map(x => x.slice(0, -'/.writer/state.json'.length));
const workspaces = projectRoots.map(prefix => ({ path: prefix, files: Object.keys(before.roots[0].files).filter(x => x.startsWith(prefix + '/')).length, unchanged: !drift.some(x => x.root === repo && x.file.startsWith(prefix + '/')) }));
assert.ok(workspaces.every(x => x.unchanged));
const realNovel = { path: before.roots[1].root, files: before.roots[1].count, unchanged: before.roots[1].digest === after.roots[1].digest };
assert.ok(realNovel.unchanged);
const productDrift = drift.filter(x => x.root === repo && /^(bin\/|lib\/|docs\/|\.agents\/|package\.json$|tests\/fixtures\/)/.test(x.file));
assert.equal(productDrift.length, 0);
const protectedResult = { before: 'protected-before.json', after: 'protected-final.json', observed_until: after.at, entire_workspace_unchanged: drift.length === 0, drift_count: drift.length, added: drift.filter(x => !x.before).length, removed: drift.filter(x => !x.after).length, modified: drift.filter(x => x.before && x.after).map(x => ({ root: x.root, file: x.file, before: x.before, after: x.after })), product_runtime_docs_skills_fixture_files_unchanged: true, real_novel: realNovel, existing_acceptance_workspaces: workspaces, differences: drift, attribution: 'These paths were not written by this Codex session. Other activity is inferred from observed filesystem changes; exact actor is not established. No files were restored, removed or updated.' };
save('protected-final-comparison.json', protectedResult);
const main = output('main-identify');
const copy = output('copy-identify');
const compare = output('copy-main-compare');
assert.equal(copy.observed_content_id, main.observed_content_id);
assert.equal(copy.runtime_id, main.runtime_id);
assert.equal(compare.same_content, true);
assert.deepEqual(compare.differences, []);
const oldCopies = ['old-one-compare', 'old-two-compare', 'old-three-compare', 'old-four-compare'].map(label => {
  const d = output(label);
  assert.equal(d.read_only, true);
  return { command: 'native-five-' + label, path: d.left.tool_root, same_version: d.same_version, same_content: d.same_content, observed_content_id: d.left.observed_content_id, runtime_id: d.left.runtime_id, differences: d.differences, updated: false };
});
const initial = output('initial-status');
const afterInvalid = output('after-invalid-status');
assert.deepEqual(initial.governance.authorization.allowed_actions, ['discuss', 'plan']);
assert.equal(afterInvalid.revision, 0);
const invalidInput = local('inputs/workflow-invalid-prototype.json');
const trialInput = local('inputs/workflow-trial.json');
assert.equal(invalidInput.operation_id, 'prototype');
assert.deepEqual({ ...invalidInput, operation_id: trialInput.operation_id }, trialInput);
const structure = local('inputs/workflow-structure.json');
const paused = local('inputs/workflow-paused.json');
assert.deepEqual(trialInput.workflow.planning.structure, structure.workflow.planning.structure);
assert.deepEqual(structure.workflow.planning.structure, paused.workflow.planning.structure);
const context = output('context-1');
const template = output('record-template-1');
const recordInput = local('inputs/record-1.json');
assert.deepEqual(context.source_hashes, template.source_hashes);
assert.deepEqual(template.source_hashes, recordInput.source_hashes);
const finalStatus = output('copy-status');
assert.equal(finalStatus.governance.stage, 'paused');
assert.equal(finalStatus.revision, 6);
assert.deepEqual(finalStatus.governance.authorization.allowed_actions, []);
assert.equal(finalStatus.governance.authorization.draft_range, null);
assert.equal(finalStatus.governance.authorization.revise_range, null);
assert.equal(finalStatus.current.ledger_count, 0);
const status = output('paused-status');
const suggestion = [...status.next.command.matchAll(/'([^']*)'|(\S+)/g)].map(m => m[1] ?? m[2]);
assert.deepEqual(suggestion.slice(1), result('paused-suggested-show').argv);
const pausedRefusal = output('paused-discussion-refusal');
assert.ok(pausedRefusal.next_action.includes('仅可只读查看任务'));
const guide = fs.readFileSync('docs/user-guide.md', 'utf8');
const faq = guide.split(/\r?\n/).map((text, i) => ({ line: i + 1, text })).filter(x => x.text.startsWith('| ACTION_OUT_OF_SCOPE |') || x.text.startsWith('| doctor 报随附协议'));
assert.equal(faq.length, 2);
assert.ok(faq[0].text.includes('全部暂停时仅用 workflow show'));
const docCheck = { guide_sha256: sha(Buffer.from(guide)), faq, paused_status_suggestion: status.next.command, executed_argv: result('paused-suggested-show').argv, exact_suggestion_executed: true, paused_refusal_next_action: pausedRefusal.next_action, consistent: true };
save('documentation-check.json', docCheck);
const infrastructureErrors = [{ command: 'node acceptance/20261018-governance-a/native-delivery-check/audit.mjs compare paused-readonly-before work-final', exit_code: 1, code: 'EEXIST', message: 'Audit helper refused to overwrite paused-readonly-before-comparison.json, already created for the earlier before/after pair.', category: 'acceptance-helper-error', product_error: false, recovery: 'Kept original comparison unchanged; compared work-final against paused-readonly-before using the unique work-final-comparison.json. The hashes are equal.', retried_product_commands: 0 }, { command: 'node acceptance/20261018-governance-a/native-delivery-check/seal-report.mjs', exit_code: 1, code: 'SyntaxError', message: 'Unexpected end of JSON input at seal-report.mjs:27:23; negative product JSON is in stderr, stdout is empty.', category: 'acceptance-helper-error', product_error: false, recovery: 'Updated this stage report helper to parse stdout when nonempty, otherwise stderr. No product commands rerun and no raw evidence changed.', helper_reruns: 1 }, { category: 'workspace-drift-observed', product_error: false, evidence: 'protected-final-comparison.json', exit_code: 1, note: 'Global inventory comparisons correctly returned nonzero because unrelated files changed or appeared; targeted protected works and current product files are unchanged.' }];
save('infrastructure-errors.json', infrastructureErrors);
const copyEvidence = local('copy-evidence.json');
assert.equal(sha(fs.readFileSync(copyEvidence.source)), copyEvidence.source_sha256);
assert.equal(sha(fs.readFileSync(copyEvidence.target)), copyEvidence.target_sha256);
const summary = { stage: 'native-delivery-check', status: 'specified-cli-scenarios-passed-with-workspace-drift-disclosed', product_scenarios_passed: true, product_command_count: entries.length, success_count: entries.filter(x => x.exit_code === 0).length, expected_nonzero_count: expectedNegatives.size, unexpected_product_errors: unexpected, product_retries: 0, infrastructure_errors: infrastructureErrors, build: { tool_version: main.tool_version, observed_content_id: main.observed_content_id, runtime_id: main.runtime_id, new_copy_matches_main: true, main_profile: main.profile, copy_profile: copy.profile }, fixture: { files: local('fixture-doctor-before.json').roots[0].count, doctor_exit: result('fixture-main-doctor').exit_code, check_exit: result('fixture-main-check').exit_code, old_status_exit: result('fixture-old-status').exit_code, diagnostic: output('fixture-main-doctor').errors, integrity_ok: output('fixture-main-doctor').build.ok, missing: output('fixture-main-doctor').build.missing, mismatches: output('fixture-main-doctor').build.mismatches, supported_schemas: output('fixture-main-doctor').build.supported_state_schemas, all_three_requests_unchanged: true }, workflow: { final_stage: finalStatus.governance.stage, revision: finalStatus.revision, registered_count: finalStatus.draft_inventory.registered_count, next_unit: finalStatus.next_unit, authorization: finalStatus.governance.authorization, structure: finalStatus.governance.planning.structure, initial_discussion_only: true, invalid_input_differs_only_by_operation_id: true, invalid_id_did_not_change_revision: true, trial_limit_review_hint: output('after-record-status').next.action, suggestion_executed: true }, decisions: { at_unit_1: output('decision-current').decisions, ledger_count: finalStatus.current.ledger_count, note: 'Location confirmed only for unit 1. Default next_unit=2 view omits the out-of-range location decision; its unit-1 confirmation remains. Gifts stay candidate and ledger is empty.' }, replay: copyEvidence, source_hashes_from_new_cli_only: true, documentation: docCheck, negative_requests: negativeHashes, old_copies: oldCopies, protection: { entire_workspace_unchanged: false, observed_until: after.at, drift_count: drift.length, added: protectedResult.added, removed: protectedResult.removed, modified: protectedResult.modified.map(x => x.file), product_files_unchanged: true, real_novel: realNovel, prior_acceptance_workspaces_unchanged: workspaces.length, full_evidence: 'protected-final-comparison.json' }, boundaries: ['Only this stage and native-five command evidence were written by this session.', 'No source code edits, direct state edits, network, subagents, tool upgrades, commits, pushes or publication.', 'No new literature, blind reading, literary pass, Linux validation or formal release acceptance.', 'No npm regression/engine expansion: this stage made no source changes and follows the requested CLI scope.'], evidence: { commands: 'commands-index.json', negatives: 'negative-request-hashes.json', copy: 'copy-evidence.json', docs: 'documentation-check.json', infrastructure: 'infrastructure-errors.json', protection: 'protected-final-comparison.json' } };
save('commands-index.json', entries);
save('summary.json', summary);
const negativeRows = negativeHashes.map(x => `| ${x.category} | ${x.label} | ${x.exit_code} | ${x.product_code ?? 'ok=false + 协议错误说明'} | ${x.file_count} 文件不变 |`).join('\n');
const oldRows = oldCopies.map(x => `| ${path.relative(repo, x.path).replaceAll('\\', '/')} | ${x.observed_content_id} | ${x.runtime_id} | ${x.differences.map(d => d.group + ':' + d.file).join('<br>')} |`).join('\n');
const report = `# 最终 A：协议诊断与完整流程复验\n\n指定 CLI 场景全部符合预期。${entries.length} 条产品命令中，${summary.success_count} 条退出 0，5 条预期非零；意外产品错误 0，产品重试 0。工作区整体未变的附加审计未通过：观察到本会话操作范围外的文件变化，详见下文。此结论仅覆盖本阶段指定流程，不表示正式发布验收。\n\n## 构建与入口\n\n主项目和新随附工具均为 ${main.tool_version}，observed_content_id 为 \`${main.observed_content_id}\`，runtime_id 为 \`${main.runtime_id}\`。两次 identify 和 compare 结果一致，differences=[]。main/workspace-copy profile 不同；轻量副本的引擎省略按文档保留。新随附 doctor、status 均实际退出 0。所有产品调用均由 capture.mjs 以 native-five 唯一标签保存原始 stdout/stderr、输入、退出码和可用的 state 前后哈希，见 [命令索引](commands-index.json)。退出码以捕获的子进程 result.json 为准。\n\n## 协议诊断与负向请求\n\n迁移夹具保持原样：完整实际 0.3 工具 build.ok=true，missing=[]、mismatches=[]，支持 schema [1,2]，其 state 已为 3。主 doctor 明确提示“${output('fixture-main-doctor').errors[0]}”。新主 check 成功；旧 parser 报“追踪状态损坏”并退出 2，属于旧协议拒绝，未把它归成文件损坏或意外产品失败。三次请求的 71 个夹具文件各有完整前后盘点，均未变。\n\n| 分类 | 命令标签 | 实际退出 | 代码/诊断 | 前后盘点 |\n| --- | --- | ---: | --- | --- |\n${negativeRows}\n\n非法请求与正式 trial 输入仅 operation_id 不同，完整证据与其他 workflow 字段均合法。prototype 请求返回 INVALID_INPUT；state 仍为 revision 0，随后 status 读取成功。每个负向请求的 state、正文与全目录哈希见 [负向哈希证据](negative-request-hashes.json) 及对应 before/after.json。\n\n## 新作品完整流程\n\n正式 init 后，初始 direction 仅允许 discuss/plan，两个范围为 null。原话存于新作品研究/本轮作者原话.txt，哈希 ${trialInput.author_evidence.source_sha256}；正式 workflow/decision 使用该真实来源，不编造消息 ID。合法 trial 1–1 有明确复盘条件；旧渡口在第1章范围 confirmed，纸签和铜铃单独为 candidate，adopted_items=[]。计划选择未塞入事实 ledger。\n\n正式 plan → context → record-template 后，完整阅读原章第1–18行，再复制 1217 字节至新作品。源/目标 SHA-256 均为 \`${copyEvidence.source_sha256}\`。原稿未改；只复制正文，未复制旧 state 或旧 source_hashes。record 输入使用本新 CLI context/template 的真实 revision 3 和来源哈希，填写实际摘要、两个人物状态及已发生时间线，ledger={}；record 成功到 revision 4，check 通过，registered_count=1。重放新增文学字数为 0。详见 [复制证据](copy-evidence.json)。\n\n登记末章后 status 实际提示“${output('after-record-status').next.action}”。随后 structure 正式登记到 revision 5，动作 discuss/plan、两个范围 null，远期结构 deferred 及原因完整保留。正式 discussion 成功；本轮讨论实录见 [总纲讨论](structure-discussion.md)。unit2 draft 在检查细纲前即以 ACTION_OUT_OF_SCOPE 拒绝，全部文件未变。\n\n正式 paused 到 revision 6，动作列表为空，两个范围 null，deferred 保留。实际执行 status 返回的完整 workflow show 建议，成功且只读；再请求 discussion 以 ACTION_OUT_OF_SCOPE 拒绝，next_action 明确“${pausedRefusal.next_action}”。整个暂停后检查段的 73 个新作品文件，包括 state 和正文，前后完全一致。原章仍是唯一登记章，next_unit=2 仅为顺序，不授予继续写作权限。\n\n手册 FAQ 第 ${faq[0].line} 行的全部暂停指引，以及第 ${faq[1].line} 行的 doctor 协议不匹配指引，均与本次实际结果一致，见 [文档核对](documentation-check.json)。\n\n## 旧副本只读比较\n\n下列既有副本均显示版本号相同、公共内容不同，仅记录差异，未更新。地点确认生效范围为第1章，因此默认 next_unit=2 的视图不显示该确认项；unit1 的正式 decision current 证据仍保留。\n\n| 旧工具路径 | observed_content_id | runtime_id | 相对主项目差异 |\n| --- | --- | --- | --- |\n${oldRows}\n\n## 保护边界与审计异常\n\n真实小说 ${realNovel.path} 的 ${realNovel.files} 个文件未变。主项目中盘点到的 ${workspaces.length} 个既有验收作品/夹具目录全部未变，覆盖原有正文、state、随附工具和迁移夹具。本轮 bin/lib/docs/技能、package.json 与原始 tests/fixtures 的文件也未变。详见 [完整最终盘点对照](protected-final-comparison.json)。\n\n整体工作区在 ${after.at} 的快照相对起始快照有 ${drift.length} 项差异：新增 ${protectedResult.added}，删除 ${protectedResult.removed}，修改 ${protectedResult.modified.length}。既有变化文件为 ${protectedResult.modified.map(x => '\`' + x.file + '\`').join('、')}，其他变化主要在 .tmp 和本阶段之外的验收归档/命令目录。这些不是本会话执行的写入；仅能判断存在其他活动，未确定具体操作者。不覆盖、不清理、不回滚它们，也不声称整个工作区静止或干净。原始两次盘点及中间比较报告全部保留。\n\n另有 1 次验收辅助命令失误：重复使用 paused-readonly-before 作为比较输出名，被 wx 保护以 EEXIST 拒绝；旧证据未覆盖。随后用唯一 work-final-comparison.json 保存等价比较，结果无差异。全局盘点比较的非零退出是上述漂移诊断。两类均独立记录于 [审计异常](infrastructure-errors.json)，未归为产品失败、未隐藏重试。\n\n本会话只写本阶段目录和 native-five 命令证据；未改源码、未直接编辑 state、未升级旧工具、未联网、未启用子代理、未提交推送。未扩充文学创作、真人盲读、完整回归或正式发布验收。新作品停在 paused，按要求完成后停止。\n`;
fs.writeFileSync(path.join(base, 'report.md'), report, { flag: 'wx' });
console.log(JSON.stringify({ report: path.join(base, 'report.md'), product_commands: entries.length, successful: summary.success_count, expected_nonzero: 5, unexpected_product_errors: 0, drift: { total: drift.length, added: protectedResult.added, removed: protectedResult.removed, modified: protectedResult.modified.map(x => x.file) }, protected_workspaces: workspaces.length, final_stage: 'paused', new_literary_characters: 0 }));
