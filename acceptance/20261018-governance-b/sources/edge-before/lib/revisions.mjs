import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { isDeepStrictEqual as same } from 'node:util';
import { cleanKeys } from './journal.mjs';
import { initialSources } from './sources.mjs';
import { userError } from './help.mjs';

const ACTIVE = ['open', 'editing', 'prepared', 'interrupted', 'conflicted'];
const UUID = /^[a-f0-9]{8}-[a-f0-9-]{27}$/;
const TREES = ['正文', '设定', '大纲', '研究', '审查', '参考拆解', '.writer/objects', '.writer/journal', '.writer/reviews', '.writer/import-source'];
const SINGLE = ['writer.json', '.writer/state.json', '.writer/import.json', '.writer/import-locations.json'];
export function createRevisions(api) {
  const { project, safe, json, text, hash, atomic, withLock, fresh, string, integer, stateLimit, gate, writeEvidence, journal, runtimeFiles, toolRoot, getToken, reviewStatus } = api;
  const fail = (code, message, extra = {}) => { throw userError(message, { code, ...extra }); };
  const encoded = value => Buffer.from(JSON.stringify(value, null, 2) + '\n');
  const runtime = () => hash(JSON.stringify(runtimeFiles.map(ref => [ref, hash(fs.readFileSync(path.join(toolRoot, ref)))])));
  const loadedBuild = runtime();
  function keys(input, allowed) { cleanKeys(input); if (!input || typeof input !== 'object' || Array.isArray(input) || Object.keys(input).some(k => !allowed.includes(k))) fail('REVISION_INPUT_INVALID', '修订输入含未知字段或不是对象'); }
  function bytes(root, ref) { const file = safe(root, ref); if (!fs.existsSync(file)) return null; const stat = fs.statSync(file); if (!stat.isFile() || stat.size > stateLimit) fail('REVISION_UNSAFE_FILE', `修订文件非普通文件或过大：${ref}`); return fs.readFileSync(file); }
  function digest(root, ref) { const b = bytes(root, ref); return b === null ? null : hash(b); }
  function storeBytes(root, ref, value, exclusive = false) {
    const file = safe(root, ref); fs.mkdirSync(path.dirname(file), { recursive: true });
    const temp = exclusive ? file : `${file}.${crypto.randomUUID()}.tmp`; let fd;
    try { fd = fs.openSync(temp, 'wx'); fs.writeFileSync(fd, value); fs.fsyncSync(fd); fs.closeSync(fd); fd = undefined; if (!exclusive) fs.renameSync(temp, file); }
    finally { if (fd !== undefined) fs.closeSync(fd); if (!exclusive && fs.existsSync(temp)) fs.unlinkSync(temp); }
  }
  function metadata(root, ref, value, exclusive = false) { storeBytes(root, ref, encoded(value), exclusive); }
  function marker(root) {
    const ref = '.writer/revision-workspace.json'; if (!fs.existsSync(safe(root, ref))) return null;
    const data = json(safe(root, ref)); if (!UUID.test(data.id ?? '') || !path.isAbsolute(data.parent ?? '')) fail('REVISION_CORRUPT', '独立修订区标记损坏');
    const parent = fs.realpathSync(data.parent), expected = safe(parent, `.writer/revisions/${data.id}/workspace`);
    if (fs.realpathSync(root) !== fs.realpathSync(expected)) fail('REVISION_CORRUPT', '修订区位置与会话不符');
    return { ...data, parent };
  }
  function session(root, id) {
    if (!UUID.test(id ?? '')) fail('REVISION_INPUT_INVALID', '会话 ID 无效');
    const ref = `.writer/revisions/${id}/session.json`, s = json(safe(root, ref));
    if (s.id !== id || ![...ACTIVE, 'committed', 'aborted'].includes(s.status) || !/^[a-f0-9]{64}$/.test(s.token_sha256 ?? '')) fail('REVISION_CORRUPT', '修订会话元数据损坏');
    const baseRef = `.writer/revisions/${id}/base.json`; if (digest(root, baseRef) !== s.base_sha256) fail('REVISION_CORRUPT', '修订基线清单损坏');
    return s;
  }
  function sessions(root) {
    const dir = safe(root, '.writer/revisions'); if (!fs.existsSync(dir)) return [];
    return fs.readdirSync(dir).filter(id => UUID.test(id) && fs.existsSync(safe(root, `.writer/revisions/${id}/session.json`))).map(id => session(root, id));
  }
  function saveSession(root, s) { metadata(root, `.writer/revisions/${s.id}/session.json`, s); }
  function owner(s, token) { if (typeof token !== 'string' || hash(token) !== s.token_sha256) fail('REVISION_OWNER_REQUIRED', '需要该修订会话的所有者令牌；不会按 PID 或超时抢占'); }
  function info(root) { const m = marker(root); if (!m) return null; const s = session(m.parent, m.id); return { id: s.id, scope: s.scope, status: s.status, parent: m.parent, owner: s.owner }; }
  function transactions(root) {
    const dir = safe(root, '.writer/transactions'); if (!fs.existsSync(dir)) return [];
    return fs.readdirSync(dir).filter(id => UUID.test(id) && fs.existsSync(safe(root, `.writer/transactions/${id}/transaction.json`))).map(id => {
      const tx = json(safe(root, `.writer/transactions/${id}/transaction.json`), stateLimit);
      if (tx.id !== id || !['prepared', 'applying', 'conflicted', 'completed', 'rolled-back'].includes(tx.status)) fail('TRANSACTION_CORRUPT', '事务状态损坏，保留现场'); return tx;
    });
  }
  function assertReady(root) {
    const parent = marker(root)?.parent ?? root, pending = transactions(parent).filter(t => !['completed', 'rolled-back'].includes(t.status));
    if (pending.length) fail('TRANSACTION_PENDING', '存在未完成修订事务，普通读写暂停；先 revision list，再显式 revision recover。', { transactions: pending.map(t => ({ id: t.id, session_id: t.session_id, status: t.status })) });
  }
  function guardWrite(root) {
    if (runtime() !== loadedBuild) fail('TOOL_BUILD_CHANGED', '本进程加载后工具模块已改变；重新启动新命令，不使用旧进程写入');
    assertReady(root); const m = marker(root);
    if (m) {
      const s = session(m.parent, m.id); owner(s, getToken());
      if (!['open', 'editing'].includes(s.status)) fail('REVISION_NOT_EDITING', '会话不处于可编辑状态；prepared 需先 resume，冲突须保留原候选并新建基线');
      if (s.build_id !== loadedBuild) fail('TOOL_BUILD_CHANGED', '修订会话绑定的工具构建不同；保留候选，不能直接提交');
      s.status = 'editing'; saveSession(m.parent, s); return;
    }
    const active = sessions(root).filter(s => ACTIVE.includes(s.status));
    if (active.length) fail('REVISION_OCCUPIED', '作品有活跃修订会话；在独立区操作，或由所有者显式结束，不允许旁路写入', { sessions: active.map(s => ({ id: s.id, owner: s.owner, scope: s.scope, status: s.status })) });
  }
  function inventory(root, extra = []) {
    const result = {};
    function visit(ref) {
      const file = safe(root, ref); if (!fs.existsSync(file)) return;
      if (fs.statSync(file).isDirectory()) { for (const name of fs.readdirSync(file).sort()) visit(`${ref}/${name}`); }
      else result[ref] = digest(root, ref);
    }
    for (const ref of [...TREES, ...SINGLE, ...extra]) visit(ref);
    return Object.fromEntries(Object.entries(result).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0));
  }
  function extras(p) { return [...new Set(p.state.units.flatMap(u => Object.keys(u.source_hashes ?? {})))].filter(ref => ref !== '.writer/state.json'); }
  function toolFiles(root) { return [...runtimeFiles.map(ref => `.writer/tool/${ref}`), '.writer/tool/build-manifest.json'].filter(ref => fs.existsSync(safe(root, ref))); }
  function baseline(root, s) { const base = json(safe(root, `.writer/revisions/${s.id}/base.json`), stateLimit); if (base.project_id !== s.project_id || base.build_id !== s.build_id) fail('REVISION_CORRUPT', '基线身份不符'); return base; }
  function parentUnchanged(root, s, base) {
    const p = project(root); if (p.state.revision !== base.revision || p.state.project_id !== base.project_id || runtime() !== base.build_id || !same(inventory(root, base.extra), base.files)) {
      s.status = 'conflicted'; saveSession(root, s); fail('BASELINE_CONFLICT', '主作品业务或相关文件/工具已变化；保留本分支和新主稿，须实读新基线后另建会话，不自动合并');
    }
    return p;
  }
  function preview(root) { const p = project(root); return { ok: true, schema_version: p.state.schema_version, target_schema: 4, already_enabled: p.state.schema_version === 4, revision: p.state.revision,
    note: 'schema 4 阻止旧 0.4 工具忽略版本/会话保护；仅显式 enable 会升级状态，保留事实和备份，不更新随附工具' }; }
  function enable(root, input) {
    keys(input, ['expected_revision', 'author_evidence']);
    return withLock(root, () => {
      const p = project(root); if (p.state.schema_version === 4) return { ok: true, unchanged: true, revision: p.state.revision };
      if (p.state.schema_version !== 3) fail('GOVERNANCE_REQUIRED', '先通过 governance preview/migrate 启用阶段和作者决策，再启用本批保护');
      integer(input.expected_revision, 'expected_revision', 0); if (input.expected_revision !== p.state.revision) fail('REVISION_CHANGED', '业务修订号已变化'); fresh(p); gate(p, 'plan');
      const evidence = writeEvidence(p, input.author_evidence), backup = `.writer/pre-protection-${p.state.revision}-${crypto.randomUUID()}.json`;
      storeBytes(root, backup, fs.readFileSync(safe(root, '.writer/state.json')), true);
      const ref = `.writer/objects/${crypto.randomUUID()}.json`; atomic(safe(root, ref), { kind: 'protection-enable', payload: { from_schema: 3, to_schema: 4 }, evidence });
      p.state.governance_events.push({ ref, sha256: digest(root, ref) }); Object.assign(p.state, initialSources(), { schema_version: 4, revision: p.state.revision + 1 });
      journal.verify(root, p.state); atomic(safe(root, '.writer/state.json'), p.state, stateLimit);
      return { ok: true, schema_version: 4, revision: p.state.revision, backup, facts_unchanged: true };
    });
  }
  function begin(root, input) {
    keys(input, ['expected_revision', 'owner', 'from', 'through', 'parallel_candidate']);
    return withLock(root, () => {
      if (marker(root)) fail('REVISION_INPUT_INVALID', '不能在独立区内再嵌套修订区');
      const p = project(root); if (p.state.schema_version !== 4) fail('PROTECTION_REQUIRED', '先显式启用 schema 4 保护');
      integer(input.expected_revision, 'expected_revision', 0); if (p.state.revision !== input.expected_revision) fail('REVISION_CHANGED', '业务修订号已变化');
      integer(input.from, 'from'); const through = input.through ?? p.state.units.length;
      if (through !== p.state.units.length || input.from > through) fail('REVISION_SCOPE_INVALID', '首版保守核查从最早影响章至当前末章；through 必须等于当前末章');
      gate(p, 'revise', input.from, through); fresh(p, { allowImpact: true }); string(input.owner, 'owner', 300);
      if (input.parallel_candidate !== undefined && typeof input.parallel_candidate !== 'boolean') fail('REVISION_INPUT_INVALID', 'parallel_candidate 必须是布尔值');
      const active = sessions(root).filter(s => ACTIVE.includes(s.status)); if (active.length && input.parallel_candidate !== true) fail('REVISION_OCCUPIED', '已有活跃会话；仅显式 parallel_candidate 可另建候选，不抢占', { sessions: active.map(s => ({ id: s.id, owner: s.owner, scope: s.scope })) });
      const impactFrom = Math.min(...Object.values(p.state.impact_pending).map(x => x.from)); if (Number.isFinite(impactFrom) && input.from > impactFrom) fail('REVISION_SCOPE_INVALID', '范围未覆盖最早待处理影响');
      const id = crypto.randomUUID(), token = crypto.randomBytes(32).toString('hex'), directory = `.writer/revisions/${id}`, extra = [...extras(p), ...toolFiles(root)];
      const base = { project_id: p.state.project_id, revision: p.state.revision, build_id: loadedBuild, scope: { from: input.from, through }, extra, files: inventory(root, extra) };
      const workspaceRef = `${directory}/workspace`; fs.mkdirSync(safe(root, workspaceRef), { recursive: true });
      // Explicit managed trees and actual input dependencies only; never copy other branches, transactions or the embedded runtime.
      for (const ref of Object.keys(base.files).filter(ref => !ref.startsWith('.writer/tool/'))) storeBytes(root, `${workspaceRef}/${ref}`, bytes(root, ref), true);
      metadata(root, `${workspaceRef}/.writer/revision-workspace.json`, { id, parent: fs.realpathSync(root), project_id: p.state.project_id }, true);
      metadata(root, `${directory}/base.json`, base, true); storeBytes(root, `${directory}/base-state.json`, bytes(root, '.writer/state.json'), true);
      const s = { id, owner: input.owner, token_sha256: hash(token), project_id: p.state.project_id, build_id: loadedBuild, scope: base.scope, status: 'open', base_sha256: digest(root, `${directory}/base.json`), created_at: new Date().toISOString() };
      if (!same(inventory(root, extra), base.files)) fail('BASELINE_CONFLICT', '复制期间主文件变化，候选保留为未登记孤儿，不继续');
      saveSession(root, s); return { ok: true, id, token, owner: s.owner, scope: s.scope, workspace: safe(root, workspaceRef), base_revision: base.revision,
        note: '令牌用于防误操作，不能对同用户文件访问提供强隔离；在独立区实读、修改、rewind 和顺序重登，再 prepare/commit' };
    }, { coordination: true });
  }
  function getOwned(root, input) { const s = session(root, input.id); owner(s, input.token); return s; }
  function resume(root, input) {
    keys(input, ['id', 'token']); return withLock(root, () => { assertReady(root); const s = getOwned(root, input);
      if (!['open', 'editing', 'prepared', 'interrupted'].includes(s.status)) fail('REVISION_NOT_EDITING', '冲突或终态不能原地重置基线，原候选保留');
      s.status = 'editing'; delete s.prepared_sha256; saveSession(root, s); const base = baseline(root, s);
      return { ok: true, id: s.id, status: s.status, workspace: safe(root, `.writer/revisions/${s.id}/workspace`), base_revision: base.revision, scope: s.scope, note: '仅恢复原分支，不刷新基线或授权；提交仍须 CAS' };
    }, { coordination: true });
  }
  function abort(root, input) {
    keys(input, ['id', 'token', 'reason']); return withLock(root, () => { assertReady(root); const s = getOwned(root, input); string(input.reason, 'reason');
      if (s.status === 'committed') fail('REVISION_COMMITTED', '已提交只能新建逆向修订，不能回填旧 state');
      s.status = 'aborted'; s.reason = input.reason; saveSession(root, s); return { ok: true, id: s.id, status: s.status, candidate_preserved: true };
    }, { coordination: true });
  }
  function transfer(root, input) {
    keys(input, ['id', 'expected_session_sha256', 'owner', 'author_evidence', 'reason']);
    return withLock(root, () => { assertReady(root); const s = session(root, input.id); if (!ACTIVE.includes(s.status)) fail('REVISION_NOT_EDITING', '终态不能移交');
      if (digest(root, `.writer/revisions/${s.id}/session.json`) !== input.expected_session_sha256) fail('REVISION_CHANGED', '会话元数据已变化');
      string(input.owner, 'owner', 300); string(input.reason, 'reason'); const p = project(root), evidence = writeEvidence(p, input.author_evidence), token = crypto.randomBytes(32).toString('hex');
      const ref = `.writer/revisions/${s.id}/transfer-${crypto.randomUUID()}.json`; metadata(root, ref, { previous_owner: s.owner, owner: input.owner, reason: input.reason, evidence }, true);
      s.owner = input.owner; s.token_sha256 = hash(token); s.transfer = ref; if (s.status === 'prepared') { s.status = 'editing'; delete s.prepared_sha256; } saveSession(root, s);
      return { ok: true, id: s.id, token, owner: s.owner, candidate_preserved: true, base_unchanged: true };
    }, { coordination: true });
  }
  function prepare(root, input) {
    keys(input, ['id', 'token']); return withLock(root, () => {
      assertReady(root); const s = getOwned(root, input); if (!['open', 'editing'].includes(s.status)) fail('REVISION_NOT_EDITING', 'prepare 需要可编辑会话；已准备者可 commit 或先 resume');
      const base = baseline(root, s), main = parentUnchanged(root, s, base), workspace = safe(root, `.writer/revisions/${s.id}/workspace`), p = project(workspace);
      if (info(workspace)?.id !== s.id || p.state.project_id !== base.project_id) fail('REVISION_CORRUPT', '候选身份不符');
      fresh(p); gate(main, 'revise', s.scope.from, s.scope.through);
      const old = json(safe(root, `.writer/revisions/${s.id}/base-state.json`), stateLimit);
      if (p.state.units.length !== old.units.length || p.state.revision_scope || !same(p.state.units.slice(0, s.scope.from - 1), old.units.slice(0, s.scope.from - 1))) fail('REVISION_REPLAY_REQUIRED', '必须顺序重登原末章，保留范围前的登记与来源，不发布半份追踪');
      if (!same(p.state.governance, old.governance) || !same(p.state.decisions, old.decisions) || !same(p.config, main.config)) fail('REVISION_SCOPE_INVALID', '本批修订区不能更改作品配置、阶段授权或作者决策；应在主作品先登记范围');
      if (p.state.units.some((u, i) => u.draft !== old.units[i].draft)) fail('REVISION_SCOPE_INVALID', '本批须保留原章节相对路径，不自动改名或合并');
      const reviews = reviewStatus(p); if (!reviews.current_records.some(r => r.from <= s.scope.from && r.to >= s.scope.through && r.revision_session === s.id)) fail('REVISION_REVIEW_REQUIRED', '需在独立区按最终字节实读整个修订尾段，并用 review 登记一次完整模型复核');
      const target = structuredClone(p.state), branchHead = digest(workspace, '.writer/state.json');
      const commitId = crypto.randomUUID(), ref = `.writer/objects/${commitId}.json`;
      const record = { id: commitId, session_id: s.id, base_revision: base.revision, branch_revision: p.state.revision, branch_head_sha256: branchHead, scope: s.scope, build_id: loadedBuild, nature: 'revision-commit-not-literary-acceptance' };
      metadata(workspace, ref, record, true); target.revision = base.revision + 1; target.committed_revisions.push({ ref, sha256: digest(workspace, ref) });
      const tree = inventory(workspace, base.extra.filter(x => !x.startsWith('.writer/tool/'))), changes = [];
      for (const [file, nextHash] of Object.entries(tree)) {
        if (file === '.writer/state.json') continue;
        if (fs.statSync(safe(workspace, file)).nlink !== 1) fail('REVISION_UNSAFE_FILE', '候选不能使用硬链接');
        const before = base.files[file] ?? null; if (before === nextHash) continue;
        if (before && /^\.writer\/(objects|journal|reviews)\//.test(file)) fail('IMMUTABLE_OBJECT_CHANGED', `不可覆盖既有不可变对象：${file}`);
        if (file.startsWith('正文/') && !old.units.slice(s.scope.from - 1).some(u => u.draft === file)) fail('REVISION_SCOPE_INVALID', '正文改动超出声明尾段或含未登记新稿');
        changes.push({ file, before, after: nextHash });
      }
      for (const file of Object.keys(base.files).filter(x => !x.startsWith('.writer/tool/'))) if (!Object.hasOwn(tree, file)) fail('REVISION_DELETE_UNSUPPORTED', `本批不发布删除，请保留并明确处置：${file}`);
      changes.push({ file: '.writer/state.json', before: base.files['.writer/state.json'], after: hash(encoded(target)) });
      parentUnchanged(root, s, base);
      const prepared = { session_id: s.id, project_id: s.project_id, base_revision: base.revision, branch_head_sha256: branchHead, tree, changes, target_state: target, commit: record };
      metadata(root, `.writer/revisions/${s.id}/prepared.json`, prepared); s.prepared_sha256 = digest(root, `.writer/revisions/${s.id}/prepared.json`); s.status = 'prepared'; saveSession(root, s);
      return { ok: true, id: s.id, status: s.status, base_revision: base.revision, target_revision: target.revision, changes, ready: 'mechanical-and-process-only-not-literary-pass' };
    }, { coordination: true });
  }
  function txFile(tx) { return `.writer/transactions/${tx.id}/transaction.json`; }
  function saveTx(root, tx) { metadata(root, txFile(tx), tx); }
  function validateTx(root, tx) {
    if (tx.schema_version !== 1 || !UUID.test(tx.id ?? '') || !UUID.test(tx.session_id ?? '') || !Array.isArray(tx.plan) || hash(JSON.stringify(tx.plan)) !== tx.plan_sha256) fail('TRANSACTION_CORRUPT', '事务清单损坏');
    const seen = new Set();
    for (const [i, row] of tx.plan.entries()) {
      if (seen.has(row.file) || (row.file !== '.writer/state.json' && !TREES.some(prefix => row.file.startsWith(`${prefix}/`)))) fail('TRANSACTION_CORRUPT', '事务目标重复或越界'); seen.add(row.file); safe(root, row.file);
      for (const side of ['old', 'new']) {
        if (side === 'old' && row.before === null) continue;
        const expectedRef = `.writer/transactions/${tx.id}/${side}/${i}.bin`;
        if (row[`${side}_ref`] !== expectedRef || digest(root, expectedRef) !== (side === 'old' ? row.before : row.after)) fail('TRANSACTION_CORRUPT', '事务备份对象损坏');
      }
    }
    if (tx.plan.at(-1)?.file !== '.writer/state.json') fail('TRANSACTION_CORRUPT', '事务必须最后替换 state');
  }
  function apply(root, tx, direction) {
    validateTx(root, tx); const conflicts = [];
    for (const row of tx.plan) { const actual = digest(root, row.file); if (actual !== row.before && actual !== row.after) {
      const current = bytes(root, row.file), ref = current === null ? null : `.writer/transactions/${tx.id}/external/${crypto.randomUUID()}.bin`;
      if (ref) storeBytes(root, ref, current, true); conflicts.push({ file: row.file, before: row.before, after: row.after, external_sha256: actual, external_ref: ref });
    } }
    if (conflicts.length) { tx.status = 'conflicted'; tx.conflicts = conflicts; saveTx(root, tx); fail('TRANSACTION_EXTERNAL_CONFLICT', '发现第三方字节，未开始本次恢复；旧、新、外部版本已保留，禁止用备份覆盖', { conflicts }); }
    tx.status = 'applying'; saveTx(root, tx); let applied = 0;
    // Both directions publish their state last; ordinary reads remain gated throughout.
    for (const row of tx.plan) {
      const desired = direction === 'complete' ? row.after : row.before, actual = digest(root, row.file);
      if (actual !== row.before && actual !== row.after) fail('TRANSACTION_EXTERNAL_CONFLICT', '替换前文件再次变化，保留现场');
      if (actual !== desired) {
        if (desired === null) fs.unlinkSync(safe(root, row.file));
        else storeBytes(root, row.file, bytes(root, direction === 'complete' ? row.new_ref : row.old_ref));
      }
      applied++;
      if (process.env.AI_WRITER_TEST_FAULT === '1' && Number(process.env.AI_WRITER_TEST_STOP_AFTER) === applied) process.exit(91);
    }
    tx.status = direction === 'complete' ? 'completed' : 'rolled-back'; tx.recovered_direction = direction; saveTx(root, tx);
    const s = session(root, tx.session_id); s.status = direction === 'complete' ? 'committed' : 'interrupted'; s.transaction_id = tx.id; delete s.prepared_sha256; saveSession(root, s);
    return { ok: true, transaction_id: tx.id, status: tx.status, session_id: s.id, revision: json(safe(root, '.writer/state.json'), stateLimit).revision, backups_preserved: true };
  }
  function commit(root, input) {
    keys(input, ['id', 'token']); return withLock(root, () => {
      assertReady(root); const s = getOwned(root, input);
      if (s.status === 'committed') return { ok: true, unchanged: true, id: s.id, transaction_id: s.transaction_id };
      if (s.status !== 'prepared') fail('REVISION_NOT_PREPARED', '先 prepare；修改 prepared 候选需 resume 后重新准备');
      const base = baseline(root, s); parentUnchanged(root, s, base);
      const ref = `.writer/revisions/${s.id}/prepared.json`; if (digest(root, ref) !== s.prepared_sha256) fail('REVISION_CORRUPT', '准备清单已变化');
      const prepared = json(safe(root, ref), stateLimit), workspace = safe(root, `.writer/revisions/${s.id}/workspace`);
      if (!same(inventory(workspace, base.extra.filter(x => !x.startsWith('.writer/tool/'))), prepared.tree)) fail('REVISION_CANDIDATE_CHANGED', 'prepare 后候选字节变化，先 resume 并重做实读/准备');
      fresh(project(workspace)); gate(project(root), 'revise', s.scope.from, s.scope.through);
      const tx = { schema_version: 1, id: crypto.randomUUID(), session_id: s.id, status: 'prepared', plan: [] };
      for (const [i, change] of prepared.changes.entries()) {
        const oldRef = `.writer/transactions/${tx.id}/old/${i}.bin`, newRef = `.writer/transactions/${tx.id}/new/${i}.bin`;
        if (digest(root, change.file) !== change.before) fail('BASELINE_CONFLICT', '事务准备期间主目标变化');
        if (change.before !== null) storeBytes(root, oldRef, bytes(root, change.file), true);
        const next = change.file === '.writer/state.json' ? encoded(prepared.target_state) : bytes(workspace, change.file);
        if (hash(next) !== change.after) fail('REVISION_CANDIDATE_CHANGED', '事务准备期间候选变化'); storeBytes(root, newRef, next, true);
        tx.plan.push({ ...change, old_ref: change.before === null ? null : oldRef, new_ref: newRef });
      }
      tx.plan_sha256 = hash(JSON.stringify(tx.plan)); parentUnchanged(root, s, base); saveTx(root, tx); return apply(root, tx, 'complete');
    }, { coordination: true });
  }
  function recover(root, input) {
    keys(input, ['transaction_id', 'token', 'direction', 'lock_sha256', 'author_evidence']);
    if (!UUID.test(input.transaction_id ?? '') || !['complete', 'rollback'].includes(input.direction)) fail('REVISION_INPUT_INVALID', '恢复需有效事务 ID 与 complete/rollback');
    const tx = json(safe(root, `.writer/transactions/${input.transaction_id}/transaction.json`), stateLimit); validateTx(root, tx); owner(session(root, tx.session_id), input.token);
    if (['completed', 'rolled-back'].includes(tx.status)) {
      if ((tx.status === 'completed') !== (input.direction === 'complete')) fail('TRANSACTION_TERMINAL', '终态不能反向回填；已提交撤销须新建修订');
      return { ok: true, unchanged: true, transaction_id: tx.id, status: tx.status };
    }
    const lockRef = '.writer/write.lock';
    if (fs.existsSync(safe(root, lockRef))) {
      if (digest(root, lockRef) !== input.lock_sha256 || !input.author_evidence) fail('RECOVERY_LOCK_AUTH_REQUIRED', '遗留锁不自动删除；需核对实际 lock_sha256 并提供作者明确恢复授权');
      const lock = json(safe(root, lockRef)); let alive = true; try { process.kill(lock.pid, 0); } catch (e) { if (e.code === 'ESRCH') alive = false; }
      if (alive) fail('RECOVERY_OWNER_ALIVE', '原锁进程仍可见，不抢占正在运行的写入');
      // Validate the author proof without changing the interrupted work before owning its lock.
      const proof = input.author_evidence, file = safe(root, proof.local_source);
      if (hash(fs.readFileSync(file)) !== proof.source_sha256 || !text(file).includes(proof.quote)) fail('AUTHOR_EVIDENCE_MISMATCH', '恢复原话与本地来源不符');
      fs.unlinkSync(safe(root, lockRef));
    }
    return withLock(root, () => {
      const current = json(safe(root, txFile(tx)), stateLimit); owner(session(root, current.session_id), input.token); validateTx(root, current);
      if (input.author_evidence) metadata(root, `.writer/transactions/${tx.id}/recovery-${crypto.randomUUID()}.json`, { direction: input.direction, evidence: input.author_evidence, lock_sha256: input.lock_sha256 ?? null }, true);
      return apply(root, current, input.direction);
    }, { coordination: true });
  }
  function list(root) { const parent = marker(root)?.parent ?? root; return { ok: true, sessions: sessions(parent).map(({ token_sha256, ...s }) => ({ ...s, session_sha256: digest(parent, `.writer/revisions/${s.id}/session.json`) })), transactions: transactions(parent).map(t => ({ id: t.id, session_id: t.session_id, status: t.status })), note: '令牌不在列表中返回；无自动超时抢占、合并、覆盖或清理' }; }
  return { assertReady, guardWrite, info, preview, enable, begin, resume, abort, transfer, prepare, commit, recover, list, loadedBuild };
}
