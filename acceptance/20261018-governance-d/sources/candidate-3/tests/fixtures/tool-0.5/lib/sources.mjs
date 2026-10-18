import fs from 'node:fs';
import crypto from 'node:crypto';
import { isDeepStrictEqual as same } from 'node:util';
import { cleanKeys } from './journal.mjs';
import { userError } from './help.mjs';

export const initialSources = () => ({ source_versions: {}, source_ranges: [], source_events: [], source_operations: {}, impact_pending: {}, committed_revisions: [] });
export function createSources(api) {
  const { project, safe, json, text, hash, atomic, withLock, string, integer, object, stateLimit, gate, writeEvidence, revisionInfo } = api;
  const fail = (code, message, extra = {}) => { throw userError(message, { code, ...extra }); };
  const validId = id => typeof id === 'string' && /^[A-Za-z0-9][A-Za-z0-9_-]{0,99}$/.test(id) && !['constructor', 'prototype', '__proto__'].includes(id);
  function keys(value, allowed) { cleanKeys(value); if (!object(value) || Object.keys(value).some(k => !allowed.includes(k))) fail('SOURCE_INPUT_INVALID', '来源输入含未知字段或不是对象'); }
  function enabled(p) { if (p.state.schema_version !== 4) fail('PROTECTION_REQUIRED', '本操作需要 schema 4；先 protection preview，再按作者授权显式 enable，不自动升级现有作品'); }
  function logical(p, ref) {
    safe(p.root, ref);
    if (!/^(设定|研究|大纲)\/.+\.(md|txt|json)$/.test(ref)) fail('SOURCE_REF_INVALID', '版本来源限设定/研究/大纲中的 UTF-8 md/txt/json；配置、正文和状态继续原哈希保护');
    return ref;
  }
  function frozen(p, version) {
    if (!validId(version?.id) || !/^\.writer\/objects\/[a-f0-9]{64}\.source$/.test(version.object_ref ?? '') || !/^[a-f0-9]{64}$/.test(version.sha256 ?? '')) fail('SOURCE_CORRUPT', '来源版本索引损坏');
    logical(p, version.ref);
    const file = safe(p.root, version.object_ref);
    if (!fs.existsSync(file) || hash(fs.readFileSync(file)) !== version.sha256) fail('SOURCE_CORRUPT', `冻结来源缺失或字节变化：${version.id}`);
    text(file); return file;
  }
  function version(p, id) { if (!Object.hasOwn(p.state.source_versions ?? {}, id)) fail('SOURCE_VERSION_NOT_FOUND', `找不到版本：${id}`); const v = p.state.source_versions[id]; frozen(p, v); return v; }
  function resolve(p, ref, unit) {
    assertReference(p, ref);
    if (p.state.schema_version !== 4) return { ref, file: safe(p.root, ref), binding: null };
    const ranges = p.state.source_ranges.filter(r => r.ref === ref && r.from <= unit && (r.to === null || unit <= r.to));
    if (ranges.length > 1) fail('SOURCE_CORRUPT', '来源生效区间重叠');
    if (!ranges.length) return { ref, file: safe(p.root, ref), binding: null };
    const v = version(p, ranges[0].version_id);
    return { ref, file: frozen(p, v), binding: { version_id: v.id, object_ref: v.object_ref, sha256: v.sha256 } };
  }
  function consumedFile(p, row, ref, expected) {
    const binding = row.source_bindings?.[ref]; if (!binding) return safe(p.root, ref);
    if (p.state.schema_version !== 4) fail('SOURCE_CORRUPT', '旧协议不应包含版本消费绑定');
    const v = version(p, binding.version_id);
    if (v.ref !== ref || binding.object_ref !== v.object_ref || binding.sha256 !== v.sha256 || expected !== v.sha256) fail('SOURCE_CORRUPT', '消费绑定与原 source_hashes 不等价，禁止追认当前来源');
    return frozen(p, v);
  }
  function validate(p) {
    if (p.state.schema_version !== 4) return;
    for (const key of ['source_versions', 'source_operations', 'impact_pending']) if (!object(p.state[key])) fail('SOURCE_CORRUPT', `缺少 ${key}`);
    for (const key of ['source_ranges', 'source_events', 'committed_revisions']) if (!Array.isArray(p.state[key])) fail('SOURCE_CORRUPT', `缺少 ${key}`);
    for (const [id, v] of Object.entries(p.state.source_versions)) { if (id !== v.id) fail('SOURCE_CORRUPT', '版本 ID 不符'); frozen(p, v); }
    for (const r of p.state.source_ranges) {
      const v = version(p, r.version_id); if (r.ref !== v.ref) fail('SOURCE_CORRUPT', '来源区间对象不符'); integer(r.from, 'from'); if (r.to !== null) integer(r.to, 'to', r.from);
      if (p.state.source_ranges.some(other => other !== r && other.ref === r.ref && (r.to === null || other.from <= r.to) && (other.to === null || r.from <= other.to))) fail('SOURCE_CORRUPT', '来源区间重叠');
    }
    const current = { source_versions: p.state.source_versions, source_ranges: p.state.source_ranges, impact_pending: p.state.impact_pending };
    if (p.state.source_binding) {
      const saved = readEvent(p, p.state.source_binding); if (!same(saved.current, current)) fail('SOURCE_CORRUPT', '来源当前索引与不可变事件不符');
    } else if (Object.keys(current.source_versions).length || current.source_ranges.length || Object.keys(current.impact_pending).length) fail('SOURCE_CORRUPT', '来源索引缺少事件');
    for (const binding of p.state.source_events) readEvent(p, binding);
    for (const row of p.state.units) {
      for (const ref of Object.keys(row.source_hashes ?? {})) assertReference(p, ref);
      for (const [ref, binding] of Object.entries(row.source_bindings ?? {})) { if (!binding || !Object.hasOwn(row.source_hashes, ref)) fail('SOURCE_CORRUPT', '消费来源缺少原哈希'); consumedFile(p, row, ref, row.source_hashes[ref]); }
      if (row.tool_build_id !== undefined && (!/^[a-f0-9]{64}$/.test(row.tool_build_id) || !row.authorization?.event)) fail('SOURCE_CORRUPT', '新登记缺少有效的运行构建或历史授权引用');
      if (row.authorization?.event) {
        const event = readEvent(p, row.authorization.event), a = event.payload?.authorization, action = row.authorization.action;
        const range = action === 'draft' ? a?.draft_range : action === 'revise' ? a?.revise_range : null;
        if (event.payload?.stage !== row.authorization.stage || !a?.allowed_actions?.includes(action) || !range || row.unit < range.from || row.unit > range.to) fail('SOURCE_CORRUPT', '登记的历史授权与当时动作/单元范围不符');
      }
      if (row.decision_bindings !== undefined && !Array.isArray(row.decision_bindings)) fail('SOURCE_CORRUPT', '作者决策消费引用不是数组');
      const selected = new Set();
      for (const b of row.decision_bindings ?? []) {
        if (!validId(b.id) || selected.has(b.id)) fail('SOURCE_CORRUPT', '作者决策消费ID损坏或重复');
        const event = readEvent(p, { ref: b.event_ref, sha256: b.event_sha256 }), d = event.payload;
        if (event.kind !== 'decision' || d?.id !== b.id || d.status !== 'confirmed' || row.unit < d.effective_range.from || (d.effective_range.to !== null && row.unit > d.effective_range.to)) fail('SOURCE_CORRUPT', '消费决策与当时确认及生效范围不符');
        selected.add(b.id);
      }
    }
    const commits = new Set();
    for (const binding of p.state.committed_revisions) {
      const c = readEvent(p, binding);
      if (!c.id || commits.has(c.id) || c.nature !== 'revision-commit-not-literary-acceptance' || !/^[a-f0-9]{64}$/.test(c.branch_head_sha256 ?? '')) fail('SOURCE_CORRUPT', '修订提交清单损坏或重复');
      integer(c.base_revision, 'base_revision', 0); integer(c.scope?.from, 'scope.from'); integer(c.scope?.through, 'scope.through', c.scope.from); commits.add(c.id);
    }
  }
  function assertReference(p, ref) {
    if (p.state.schema_version === 4 && /^\.writer\/(?:revisions|transactions|lock-recoveries)(?:\/|$)|^\.writer\/(?:revision-workspace\.json|write\.lock)$/i.test(ref)) fail('REVISION_PRIVATE_REFERENCE', '内部修订/事务路径不能成为正式消费来源；材料移至作品研究或设定目录，禁止发布分支路径');
  }
  function readEvent(p, binding) {
    if (!/^\.writer\/objects\/[a-f0-9-]+\.json$/.test(binding?.ref ?? '') || !/^[a-f0-9]{64}$/.test(binding.sha256 ?? '')) fail('SOURCE_CORRUPT', '来源事件引用损坏');
    const file = safe(p.root, binding.ref); if (hash(fs.readFileSync(file)) !== binding.sha256) fail('SOURCE_CORRUPT', '来源事件已变化'); const event = json(file);
    if (event.evidence) {
      const e = event.evidence;
      if (!/^\.writer\/objects\/[a-f0-9]{64}\.txt$/.test(e.frozen_ref ?? '') || hash(fs.readFileSync(safe(p.root, e.frozen_ref))) !== e.source_sha256 || !text(safe(p.root, e.frozen_ref)).includes(e.quote)) fail('SOURCE_CORRUPT', '来源发布的作者证据损坏');
    }
    for (const a of [event.result?.analysis, ...Object.values(event.current?.impact_pending ?? {}).map(x => x.analysis)].filter(Boolean)) {
      if (a.review && (hash(fs.readFileSync(safe(p.root, a.review.frozen_report))) !== a.review.report_sha256)) fail('SOURCE_CORRUPT', '冻结影响报告缺失或变化');
    }
    return event;
  }
  function put(p, bytes, extension = 'source') {
    const ref = `.writer/objects/${hash(bytes)}.${extension}`; fs.mkdirSync(safe(p.root, '.writer/objects'), { recursive: true }); const file = safe(p.root, ref);
    if (fs.existsSync(file)) { if (hash(fs.readFileSync(file)) !== hash(bytes)) fail('SOURCE_CORRUPT', '不可变对象已变化'); }
    else fs.writeFileSync(file, bytes, { flag: 'wx' }); return ref;
  }
  function mutate(root, input, action, fn) {
    cleanKeys(input);
    return withLock(root, () => {
      const p = project(root); enabled(p);
      if (!validId(input.operation_id)) fail('SOURCE_INPUT_INVALID', 'operation_id 无效或为保留键');
      const fingerprint = hash(JSON.stringify(input)), old = Object.hasOwn(p.state.source_operations, input.operation_id) ? p.state.source_operations[input.operation_id] : null;
      if (old) { if (old.input_sha256 !== fingerprint) fail('OPERATION_CONFLICT', '同一 operation_id 不能用于另一输入'); return { ...old.result, unchanged: true }; }
      integer(input.expected_revision, 'expected_revision', 0); if (input.expected_revision !== p.state.revision) fail('REVISION_CHANGED', '业务修订号已变化，重新读取影响预览');
      const result = fn(p), evidence = input.author_evidence ? writeEvidence(p, input.author_evidence) : null;
      const event = { action, at: new Date().toISOString(), evidence, input: structuredClone(input), result,
        current: { source_versions: p.state.source_versions, source_ranges: p.state.source_ranges, impact_pending: p.state.impact_pending } };
      const ref = `.writer/objects/${crypto.randomUUID()}.json`; fs.mkdirSync(safe(root, '.writer/objects'), { recursive: true }); atomic(safe(root, ref), event);
      const binding = { ref, sha256: hash(fs.readFileSync(safe(root, ref))) }; p.state.source_events.push(binding); p.state.source_binding = binding; p.state.revision++;
      const output = { ok: true, ...result, revision: p.state.revision, event: binding }; p.state.source_operations[input.operation_id] = { input_sha256: fingerprint, result: output };
      cleanKeys(p.state); atomic(safe(root, '.writer/state.json'), p.state, stateLimit); return output;
    });
  }
  function freeze(root, input) {
    keys(input, ['expected_revision', 'operation_id', 'ref', 'file', 'version_id', 'previous']);
    return mutate(root, input, 'freeze', p => {
      gate(p, 'plan'); logical(p, input.ref); if (!validId(input.version_id) || Object.hasOwn(p.state.source_versions, input.version_id)) fail('SOURCE_INPUT_INVALID', 'version_id 无效或已存在');
      if (input.previous && version(p, input.previous).ref !== input.ref) fail('SOURCE_INPUT_INVALID', '前版必须属于同一逻辑来源');
      const file = safe(root, input.file ?? input.ref); text(file); const bytes = fs.readFileSync(file);
      const v = { id: input.version_id, ref: input.ref, object_ref: put(p, bytes), sha256: hash(bytes), previous: input.previous ?? null, format: input.ref.split('.').at(-1) };
      p.state.source_versions[v.id] = v; return { version: v, status: 'proposal-only-not-published' };
    });
  }
  function impactFor(p, input) {
    enabled(p); const v = version(p, input.version_id); integer(input.from, 'from');
    if (!['baseline', 'future', 'historical'].includes(input.mode)) fail('SOURCE_INPUT_INVALID', 'mode 仅 baseline/future/historical');
    if (input.mode === 'future' && input.from <= p.state.units.length) fail('SOURCE_RANGE_INVALID', 'future 只能从尚未登记的单元生效');
    if (input.mode === 'historical' && input.from > p.state.units.length) fail('SOURCE_RANGE_INVALID', 'historical 必须涉及已登记单元');
    const direct = p.state.units.filter(u => Object.hasOwn(u.source_hashes, v.ref));
    const earliest = direct.length ? Math.min(input.from, ...direct.map(u => u.unit)) : input.from;
    const reviewFrom = input.mode === 'historical' ? Math.max(1, input.from - 1) : earliest;
    const required = { [v.object_ref]: v.sha256 };
    // Dependencies are observable; semantic/indirect boundaries remain conservative.
    for (const u of p.state.units.filter(u => u.unit >= reviewFrom)) required[u.draft] = u.sha256;
    for (const u of direct) { const binding = u.source_bindings?.[v.ref]; if (binding) required[binding.object_ref] = binding.sha256; }
    return { schema_version: 1, revision: p.state.revision, state_sha256: hash(fs.readFileSync(safe(p.root, '.writer/state.json'))), version_id: v.id, ref: v.ref, from: input.from, mode: input.mode,
      candidate_sha256: v.sha256, direct_consumers: direct.map(u => ({ unit: u.unit, consumed_sha256: u.source_hashes[v.ref], bound: Boolean(u.source_bindings?.[v.ref]), affected_by_publication: u.unit >= input.from })),
      revision_from: input.from, review_from: reviewFrom, retained_prefix_consumers: direct.filter(u => u.unit < input.from).map(u => u.unit),
      replaced_ranges: p.state.source_ranges.filter(r => r.ref === v.ref && (r.to === null || r.to >= input.from)),
      possible_indirect_from: input.mode === 'historical' ? input.from : direct.length ? earliest : null, possible_indirect_through: direct.length ? p.state.units.length : null,
      possible_indirect_impact: 'unknown-requires-reading', required_readings: required,
      note: '仅计算可观察消费关系；模型需实读候选、旧输入与相关正文。脚本不证明语义无影响。' };
  }
  function impact(root, input) { keys(input, ['version_id', 'from', 'mode']); return { ok: true, impact: impactFor(project(root), input) }; }
  function reviewed(p, input) {
    const actual = impactFor(p, input.impact ?? {});
    if (!same(actual, input.impact)) fail('IMPACT_STALE', '影响预览已变化或不完整，重新 source impact 后实读');
    keys(input.review, ['report', 'report_sha256', 'readings', 'conclusion', 'unresolved']);
    string(input.review.conclusion, 'review.conclusion'); if (!Array.isArray(input.review.unresolved) || input.review.unresolved.length) fail('IMPACT_UNRESOLVED', '尚有未解决风险，不能发布；先实读并走历史修订');
    const report = safe(p.root, input.review.report); string(text(report), 'review.report');
    if (!input.review.report.startsWith('审查/') || hash(fs.readFileSync(report)) !== input.review.report_sha256 || !same(input.review.readings, actual.required_readings)) fail('IMPACT_REVIEW_INVALID', '报告、哈希或实际声明的阅读范围不完整');
    for (const [ref, expected] of Object.entries(actual.required_readings)) if (hash(fs.readFileSync(safe(p.root, ref))) !== expected) fail('IMPACT_STALE', '所读版本已变化');
    if (!input.author_evidence) fail('AUTHOR_EVIDENCE_REQUIRED', '发布/执行影响需作者授权原话');
    return { ...actual, review: { ...input.review, frozen_report: put(p, fs.readFileSync(report), 'txt') } };
  }
  function bindRows(p, v, from, through) {
    integer(from, 'from'); integer(through, 'through', from); const rows = p.state.units.filter(u => u.unit >= from && u.unit <= through && Object.hasOwn(u.source_hashes, v.ref));
    if (!rows.length) fail('SOURCE_BIND_EMPTY', '范围内没有实际消费者');
    for (const row of rows) if (row.source_hashes[v.ref] !== v.sha256) fail('SOURCE_BIND_MISMATCH', `旧单元 ${row.unit} 的消费哈希不符；找回真实旧字节或走修订，不追认当前来源`);
    for (const row of rows) { row.source_bindings ??= {}; row.source_bindings[v.ref] = { version_id: v.id, object_ref: v.object_ref, sha256: v.sha256 }; }
    return rows.map(u => u.unit);
  }
  function bind(root, input) {
    keys(input, ['expected_revision', 'operation_id', 'author_evidence', 'version_id', 'from', 'through']);
    return mutate(root, input, 'bind', p => { gate(p, 'plan'); if (!input.author_evidence) fail('AUTHOR_EVIDENCE_REQUIRED', '历史绑定需明确作者授权'); return { bound_units: bindRows(p, version(p, input.version_id), input.from, input.through), original_hashes_preserved: true }; });
  }
  function publishRange(p, v, from) {
    p.state.source_ranges = p.state.source_ranges.filter(r => r.ref !== v.ref || r.from < from).map(r => r.ref === v.ref && (r.to === null || r.to >= from) ? { ...r, to: from - 1 } : r);
    p.state.source_ranges.push({ ref: v.ref, version_id: v.id, from, to: null });
  }
  function publish(root, input) {
    keys(input, ['expected_revision', 'operation_id', 'author_evidence', 'impact', 'review', 'impact_id']);
    return mutate(root, input, 'publish', p => {
      if (input.impact_id) {
        const info = revisionInfo(p.root), pending = p.state.impact_pending[input.impact_id];
        if (!info || !pending) fail('REVISION_REQUIRED', '历史版本只能在对应独立修订区中发布');
        gate(p, 'revise', pending.from, pending.through);
        if (p.state.units.length >= pending.from || info.scope.from > pending.from || !input.author_evidence) fail('REVISION_REPLAY_REQUIRED', '先在修订区 rewind 最早影响单元，重新登记至原末章；发布需授权');
        publishRange(p, version(p, pending.version_id), pending.requested_from); delete p.state.impact_pending[input.impact_id];
        return { published: pending.version_id, from: pending.requested_from, pending_resolution: 'branch-only-until-transaction-commit' };
      }
      gate(p, 'plan'); const analysis = reviewed(p, input), v = version(p, analysis.version_id);
      if (analysis.mode === 'historical') fail('REVISION_REQUIRED', '历史变更先 source stage，再在独立修订区 replay 和提交');
      if (analysis.mode === 'baseline') {
        if (analysis.from !== 1 || p.state.source_ranges.some(r => r.ref === v.ref)) fail('SOURCE_RANGE_INVALID', 'baseline 只用于首次从第 1 单元固定原输入；其他旧消费者用 bind');
        if (analysis.direct_consumers.length) bindRows(p, v, 1, p.state.units.length);
      } else {
        if (analysis.direct_consumers.some(u => !u.bound)) fail('SOURCE_UNBOUND_CONSUMERS', '旧消费者尚未固定真实旧版本；先以匹配原哈希的版本 bind，不忽略旧保护');
        if (analysis.direct_consumers.some(u => !resolve(p, v.ref, u.unit).binding)) fail('SOURCE_BASELINE_REQUIRED', '历史消费虽已补绑，仍需 baseline 发布原输入区间，再安排未来版本，避免历史回放读取新入口');
        if (p.state.source_ranges.some(r => r.ref === v.ref && r.from >= analysis.from && !(r.from === analysis.from && v.previous === r.version_id))) fail('SOURCE_RANGE_INVALID', '未来发布须推进生效起点；同起点未消费版本的显式替换须 previous 指向原版本');
      }
      publishRange(p, v, analysis.from); return { published: v.id, from: analysis.from, analysis, original_hashes_preserved: true };
    });
  }
  function stage(root, input) {
    keys(input, ['expected_revision', 'operation_id', 'author_evidence', 'impact', 'review']);
    return mutate(root, input, 'stage-impact', p => {
      if (revisionInfo(p.root)) fail('REVISION_REQUIRED', '先在主作品选择执行历史变更，再建立修订会话');
      const analysis = reviewed(p, input); if (analysis.mode !== 'historical') fail('SOURCE_INPUT_INVALID', 'stage 只接受历史变更');
      const from = analysis.revision_from, through = p.state.units.length;
      gate(p, 'revise', from, through); const impactId = crypto.randomUUID();
      p.state.impact_pending[impactId] = { id: impactId, version_id: analysis.version_id, from, through, requested_from: analysis.from, analysis };
      return { impact_id: impactId, blocked_range: { from, through }, note: '持久阻断已启用；需独立修订、逐章重登及实读复核后事务提交' };
    });
  }
  function cancel(root, input) {
    keys(input, ['expected_revision', 'operation_id', 'author_evidence', 'impact_id', 'reason']);
    return mutate(root, input, 'cancel-impact', p => { gate(p, 'plan'); string(input.reason, 'reason'); if (!input.author_evidence || !Object.hasOwn(p.state.impact_pending, input.impact_id)) fail('SOURCE_INPUT_INVALID', '取消需现有待处理 ID 和授权'); delete p.state.impact_pending[input.impact_id]; return { cancelled: input.impact_id, reason: input.reason }; });
  }
  function pending(p) { return Object.values(p.state.impact_pending ?? {}); }
  function pendingSummary(p) { return pending(p).map(({ id, version_id, from, through, requested_from }) => ({ id, version_id, from, through, requested_from, analysis_binding: p.state.source_binding ?? null })); }
  function guardPending(p) { if (pending(p).length) fail('IMPACT_PENDING', '历史设定影响待修订；普通续写、登记和导出暂停，先 revision begin。讨论可查看阻断。', { impacts: pending(p).map(({ id, from, through }) => ({ id, from, through })) }); }
  function list(root, unit) {
    const p = project(root); enabled(p); unit ??= p.state.units.length + 1;
    integer(unit, 'unit');
    const differences = [...new Set(p.state.source_ranges.map(r => r.ref))].flatMap(ref => {
      const selected = resolve(p, ref, unit), live = safe(root, ref); const sha = fs.existsSync(live) ? hash(fs.readFileSync(live)) : null;
      if (!selected.binding || sha === selected.binding.sha256) return [];
      const matches = p.state.source_ranges.filter(r => r.ref === ref && version(p, r.version_id).sha256 === sha);
      return [{ ref, live_sha256: sha, selected_version: selected.binding.version_id, status: matches.length ? 'matches-published-version' : sha === null ? 'editing-entry-missing' : 'editing-entry-only-not-published', matched_published_ranges: matches }];
    });
    return { ok: true, revision: p.state.revision, unit, versions: p.state.source_versions, ranges: p.state.source_ranges, impact_pending: pending(p),
      entry_differences: differences, pending_edits: differences.filter(x => x.status !== 'matches-published-version') };
  }
  return { validate, enabled, resolve, consumedFile, freeze, impact, publish, bind, stage, cancel, pending, pendingSummary, guardPending, list, initial: initialSources };
}
