import fs from 'node:fs';
import crypto from 'node:crypto';
import { isDeepStrictEqual } from 'node:util';
import { cleanKeys } from './journal.mjs';
import { userError } from './help.mjs';

export const STAGES = ['direction', 'structure', 'volume', 'outline', 'trial', 'drafting', 'revision', 'paused'];
const ACTIONS = ['discuss', 'plan', 'draft', 'revise'];
const ID = /^[A-Za-z0-9][A-Za-z0-9_-]{0,99}$/;
export function initialGovernance() {
  return { stage: 'direction', task: '完善作品定位和故事骨架，明确本轮允许的创作范围',
    authorization: { allowed_actions: ['discuss', 'plan'], draft_range: null, revise_range: null, stop_conditions: [] },
    planning: Object.fromEntries(['positioning', 'structure', 'volume', 'outline'].map(key => [key, { status: 'missing', refs: [], unresolved_ids: [] }])) };
}

export function createGovernance(api) {
  const { project, safe, json, text, hash, atomic, withLock, fresh, string, strings, integer, object, stateLimit, journal } = api;
  const reject = (code, message, details = {}) => { throw userError(message, { code, ...details }); };
  const same = isDeepStrictEqual;
  function keys(value, allowed, name) {
    if (!object(value) || Object.keys(value).some(key => !allowed.includes(key))) reject('INVALID_INPUT', `${name} 含未知字段或不是对象`);
    cleanKeys(value);
  }
  function range(value, name) {
    if (value === null) return null;
    keys(value, ['from', 'to'], name); integer(value.from, `${name}.from`); integer(value.to, `${name}.to`, value.from); return value;
  }
  function workflowData(p, value) {
    keys(value, ['stage', 'task', 'authorization', 'planning'], 'workflow');
    if (!STAGES.includes(value.stage)) reject('INVALID_INPUT', 'stage 无效');
    string(value.task, 'task', 2000);
    const a = value.authorization; keys(a, ['allowed_actions', 'draft_range', 'revise_range', 'stop_conditions'], 'authorization');
    strings(a.allowed_actions, 'allowed_actions');
    if (a.allowed_actions.some(x => !ACTIONS.includes(x)) || new Set(a.allowed_actions).size !== a.allowed_actions.length) reject('INVALID_INPUT', 'allowed_actions 无效或重复');
    range(a.draft_range, 'draft_range'); range(a.revise_range, 'revise_range'); strings(a.stop_conditions, 'stop_conditions');
    if (a.allowed_actions.includes('draft') !== (a.draft_range !== null) || a.allowed_actions.includes('revise') !== (a.revise_range !== null)) reject('INVALID_INPUT', 'draft/revise 动作与非空范围必须对应；空范围不代表无限授权');
    const levels = ['positioning', 'structure', 'volume', 'outline']; keys(value.planning, levels, 'planning');
    for (const level of levels) {
      const entry = value.planning[level]; keys(entry, ['status', 'refs', 'unresolved_ids', 'reason'], `planning.${level}`);
      if (!['missing', 'draft', 'adopted', 'deferred'].includes(entry.status)) reject('INVALID_INPUT', 'planning.status 无效');
      strings(entry.refs, 'planning.refs'); strings(entry.unresolved_ids, 'planning.unresolved_ids');
      for (const ref of entry.refs) text(safe(p.root, ref));
      if (entry.status === 'adopted' && !entry.refs.length) reject('INVALID_INPUT', '采纳的规划需有可读来源；存在文件不等于采纳');
      if (entry.status === 'deferred') { string(entry.reason, 'deferred.reason'); if (value.stage !== 'trial' || !a.draft_range || !a.stop_conditions.length) reject('PLANNING_REQUIRED', '暂缓规划须有有限试写范围和复盘条件'); }
    }
    if (value.stage === 'trial' && (!a.draft_range || !a.stop_conditions.length)) reject('PLANNING_REQUIRED', '试写须有有限范围和复盘条件');
    if (['direction', 'structure', 'volume', 'outline', 'paused'].includes(value.stage) && a.allowed_actions.includes('draft')) reject('INVALID_INPUT', '规划或暂停阶段不能同时允许新正文；切至 trial/drafting 后明确范围');
    return structuredClone(value);
  }
  function requireEnabled(p) { if (p.state.schema_version !== 3) reject('GOVERNANCE_REQUIRED', '此作品尚未启用创作治理；先只读 governance preview，再按授权迁移；不会自动迁移'); }
  function readObject(p, ref, expected) {
    if (!/^\.writer\/objects\/[a-f0-9-]+\.json$/.test(ref ?? '') || !/^[a-f0-9]{64}$/.test(expected ?? '')) reject('GOVERNANCE_CORRUPT', '治理事件引用损坏');
    const file = safe(p.root, ref);
    if (!fs.existsSync(file) || hash(fs.readFileSync(file)) !== expected) reject('GOVERNANCE_CORRUPT', '治理事件缺失或哈希变化，保留现场');
    return json(file);
  }
  function validate(p) {
    if (p.state.schema_version !== 3) return;
    string(p.state.project_id, 'project_id', 100); workflowData(p, p.state.governance);
    if (!object(p.state.decisions) || !object(p.state.operations) || !Array.isArray(p.state.governance_events)) reject('GOVERNANCE_CORRUPT', '治理索引损坏');
    for (const row of p.state.governance_events) {
      const event = readObject(p, row.ref, row.sha256);
      if (event.evidence) {
        const file = safe(p.root, event.evidence.frozen_ref);
        if (!/^\.writer\/objects\/[a-f0-9]{64}\.txt$/.test(event.evidence.frozen_ref) || !fs.existsSync(file) || hash(fs.readFileSync(file)) !== event.evidence.source_sha256) reject('GOVERNANCE_CORRUPT', '作者原话证据缺失或变化');
        if (!text(file).includes(event.evidence.quote)) reject('GOVERNANCE_CORRUPT', '原话与冻结来源不符');
      }
    }
    if (p.state.governance_binding) {
      const event = readObject(p, p.state.governance_binding.ref, p.state.governance_binding.sha256);
      if (!same(event.payload, p.state.governance)) reject('GOVERNANCE_CORRUPT', '当前阶段与已登记事件不一致');
    }
    for (const [id, d] of Object.entries(p.state.decisions)) {
      if (!ID.test(id) || d.id !== id) reject('GOVERNANCE_CORRUPT', '决策 ID 损坏');
      const event = readObject(p, d.event_ref, d.event_sha256);
      const { event_ref, event_sha256, ...payload } = d;
      if (!same(event.payload, payload)) reject('GOVERNANCE_CORRUPT', '当前决策与事件不一致');
    }
  }
  function view(p, unit = p.state.units.length + 1) {
    if (p.state.schema_version !== 3) return { enabled: false, status: 'not-enabled', note: '旧协议未记录本轮授权；不能据历史正文推断无限续写授权' };
    const current = [], candidates = [], history = [];
    for (const d of Object.values(p.state.decisions)) {
      if (['superseded', 'withdrawn'].includes(d.status)) history.push(d);
      else if (d.effective_range.from <= unit && (d.effective_range.to === null || unit <= d.effective_range.to)) (d.status === 'confirmed' ? current : candidates).push(d);
    }
    return { enabled: true, ...p.state.governance, decisions: { current, candidates, history_count: history.length },
      note: '作者计划与正文事实分开；未逐项采纳的候选及附带细节不构成定案。登记原话不是作者身份认证。' };
  }
  function gate(p, action, from, to = from) {
    if (p.state.schema_version !== 3) return;
    const a = p.state.governance.authorization, r = action === 'draft' ? a.draft_range : action === 'revise' ? a.revise_range : null;
    if (!a.allowed_actions.includes(action) || (['draft', 'revise'].includes(action) && (!r || from < r.from || to > r.to))) reject('ACTION_OUT_OF_SCOPE', `本轮任务“${p.state.governance.task}”不允许 ${action}${from ? ` ${from}–${to}` : ''}；不得自行扩大作者授权`, { next_action: '按当前任务继续讨论/规划；只有作者另有明确指令时才更新范围。', scope: view(p) });
  }
  function unitAction(p, unit) { return p.state.revision_scope && unit <= p.state.revision_scope.through ? 'revise' : 'draft'; }
  function writeEvidence(p, input) {
    keys(input, ['quote', 'local_source', 'source_sha256', 'locator', 'recorded_by'], 'author_evidence');
    string(input.quote, 'quote', 10000); string(input.locator, 'locator', 1000); string(input.recorded_by, 'recorded_by', 300);
    if (!/^[a-f0-9]{64}$/.test(input.source_sha256 ?? '')) reject('INVALID_INPUT', '作者证据必须含实际来源 SHA256');
    const file = safe(p.root, input.local_source), bytes = fs.readFileSync(file), body = text(file);
    if (hash(bytes) !== input.source_sha256 || !body.includes(input.quote)) reject('AUTHOR_EVIDENCE_MISMATCH', '原话或哈希与本地作者来源不符；不伪造会话定位');
    const ref = `.writer/objects/${input.source_sha256}.txt`, frozen = safe(p.root, ref);
    fs.mkdirSync(safe(p.root, '.writer/objects'), { recursive: true });
    if (fs.existsSync(frozen)) { if (hash(fs.readFileSync(frozen)) !== input.source_sha256) reject('GOVERNANCE_CORRUPT', '既有原话对象损坏'); }
    else fs.writeFileSync(frozen, bytes, { flag: 'wx' });
    return { ...input, frozen_ref: ref };
  }
  function mutate(root, input, kind, build) {
    cleanKeys(input);
    return withLock(root, () => {
      const p = project(root); requireEnabled(p);
      if (!ID.test(input.operation_id ?? '')) reject('INVALID_INPUT', 'operation_id 须为稳定字母数字 ID');
      const fingerprint = hash(JSON.stringify(input)), old = p.state.operations[input.operation_id];
      if (old) { if (old.input_sha256 !== fingerprint) reject('OPERATION_CONFLICT', '同一 operation_id 不能用于不同输入'); return { ...old.result, unchanged: true }; }
      integer(input.expected_revision, 'expected_revision', 0);
      if (input.expected_revision !== p.state.revision) reject('REVISION_CHANGED', '追踪修订号已变化，先恢复当前任务与决定');
      const payload = build(p), evidence = writeEvidence(p, input.author_evidence);
      const event = { kind, at: new Date().toISOString(), operation_id: input.operation_id, base_revision: p.state.revision, payload, evidence };
      const ref = `.writer/objects/${crypto.randomUUID()}.json`; atomic(safe(p.root, ref), event);
      const binding = { ref, sha256: hash(fs.readFileSync(safe(p.root, ref))) };
      if (kind === 'workflow') { p.state.governance = payload; p.state.governance_binding = binding; }
      else {
        if (payload.supersedes) p.state.decisions[payload.supersedes] = { ...p.state.decisions[payload.supersedes], status: 'superseded' };
        // A replaced record gets its own immutable event rather than mutating its old binding.
        if (payload.supersedes) {
          const replaced = p.state.decisions[payload.supersedes], { event_ref, event_sha256, ...previous } = replaced;
          const prevRef = `.writer/objects/${crypto.randomUUID()}.json`; atomic(safe(p.root, prevRef), { ...event, kind: 'decision-superseded', payload: previous });
          replaced.event_ref = prevRef; replaced.event_sha256 = hash(fs.readFileSync(safe(p.root, prevRef)));
          p.state.governance_events.push({ ref: prevRef, sha256: replaced.event_sha256 });
        }
        p.state.decisions[payload.id] = { ...payload, event_ref: ref, event_sha256: binding.sha256 };
      }
      p.state.governance_events.push(binding); p.state.revision++;
      const result = { ok: true, revision: p.state.revision, operation_id: input.operation_id, event: binding, ...(kind === 'decision' ? { decision_id: payload.id } : {}) };
      p.state.operations[input.operation_id] = { input_sha256: fingerprint, result };
      atomic(safe(p.root, '.writer/state.json'), p.state, stateLimit); return result;
    });
  }
  function setWorkflow(root, input) {
    keys(input, ['expected_revision', 'operation_id', 'author_evidence', 'workflow'], 'workflow input');
    return mutate(root, input, 'workflow', p => workflowData(p, input.workflow));
  }
  function decision(root, input) {
    keys(input, ['expected_revision', 'operation_id', 'author_evidence', 'decision'], 'decision input');
    return mutate(root, input, 'decision', p => {
      const d = input.decision; keys(d, ['id', 'topic', 'status', 'options', 'adopted_items', 'excluded_items', 'unresolved_items', 'effective_range', 'supersedes'], 'decision');
      if (!ID.test(d.id ?? '')) reject('INVALID_INPUT', '决策 ID 无效'); string(d.topic, 'topic', 1000);
      if (!['candidate', 'confirmed', 'withdrawn'].includes(d.status)) reject('INVALID_INPUT', 'status 只接受 candidate/confirmed/withdrawn');
      for (const key of ['options', 'adopted_items', 'excluded_items', 'unresolved_items']) strings(d[key], key);
      keys(d.effective_range, ['from', 'to'], 'effective_range'); integer(d.effective_range.from, 'effective_range.from');
      if (d.effective_range.to !== null) integer(d.effective_range.to, 'effective_range.to', d.effective_range.from);
      if (d.status === 'confirmed' && !d.adopted_items.length) reject('INVALID_INPUT', '确认决策需逐项列出 adopted_items；不自动采纳整份方案');
      if (d.status !== 'confirmed' && d.adopted_items.length) reject('INVALID_INPUT', '候选/撤回不能包含当前采纳项');
      if (d.adopted_items.some(x => d.excluded_items.includes(x) || d.unresolved_items.includes(x))) reject('DECISION_CONFLICT', '同一项不能同时已选、排除或未决');
      const old = p.state.decisions[d.id];
      if (d.supersedes) {
        if (old || d.supersedes === d.id || !ID.test(d.supersedes) || p.state.decisions[d.supersedes]?.status !== 'confirmed' || d.status !== 'confirmed') reject('DECISION_CONFLICT', '取代须以新 ID 指向一条当前确认记录；不能循环、悬空或取代候选');
        const replaced = p.state.decisions[d.supersedes];
        if (replaced.topic !== d.topic || !same(replaced.effective_range, d.effective_range)) reject('DECISION_CONFLICT', '最小首批仅支持同主题、同生效范围的整项取代；跨范围版本发布尚未实现');
      } else if (old && (old.topic !== d.topic || ['superseded', 'withdrawn'].includes(old.status) || (old.status === 'confirmed' && d.status === 'confirmed' && !same({ ...d, status: undefined }, { ...(({ event_ref, event_sha256, ...x }) => x)(old), status: undefined })))) reject('DECISION_CONFLICT', '已确认项改变须使用新 ID 与 supersedes；不覆盖历史选择');
      if (d.status === 'confirmed') for (const other of Object.values(p.state.decisions)) {
        if (other.id !== d.id && other.id !== d.supersedes && other.topic === d.topic && other.status === 'confirmed' && (d.effective_range.to === null || other.effective_range.from <= d.effective_range.to) && (other.effective_range.to === null || d.effective_range.from <= other.effective_range.to)) reject('DECISION_CONFLICT', '同一主题的确认范围重叠');
      }
      return structuredClone(d);
    });
  }
  function preview(root) {
    const p = project(root);
    return { ok: true, schema_version: p.state.schema_version, target_schema: 3, revision: p.state.revision, units: p.state.units.length,
      already_enabled: p.state.schema_version === 3, requires: '显式授权；备份后保持原事实并迁移差量链。旧工具将拒绝 schema 3；本批不提供随附工具自动更新。', default_workflow: initialGovernance() };
  }
  function migrate(root, input) {
    keys(input, ['expected_revision', 'operation_id', 'author_evidence'], 'migrate input');
    return withLock(root, () => {
      const p = project(root); integer(input.expected_revision, 'expected_revision', 0);
      if (p.state.schema_version === 3) {
        const op = p.state.operations[input.operation_id];
        if (op?.input_sha256 === hash(JSON.stringify(input))) return { ...op.result, unchanged: true };
        reject('GOVERNANCE_ALREADY_ENABLED', '已启用治理；不会重新迁移或替换旧记录');
      }
      if (p.state.revision !== input.expected_revision) reject('REVISION_CHANGED', '追踪修订号已变化');
      if (!ID.test(input.operation_id ?? '')) reject('INVALID_INPUT', 'operation_id 无效'); fresh(p);
      // Prepare the delta chain in memory; main state is replaced exactly once.
      const before = structuredClone(p.state), next = structuredClone(before);
      if (next.schema_version === 1) {
        next.baseline = next.units[0]?.before ?? structuredClone(next.snapshot);
        let current = next.baseline; const rows = [];
        for (const row of next.units) { if (!same(current, row.before)) reject('GOVERNANCE_CORRUPT', '旧事实快照链不连续'); rows.push(journal.store(p.root, row)); current = row.after; }
        if (!same(current, next.snapshot)) reject('GOVERNANCE_CORRUPT', '旧事实终态不一致'); next.units = rows;
      }
      const evidence = writeEvidence(p, input.author_evidence), event = { kind: 'governance-migrate', payload: initialGovernance(), evidence, at: new Date().toISOString() };
      const ref = `.writer/objects/${crypto.randomUUID()}.json`; atomic(safe(p.root, ref), event);
      const binding = { ref, sha256: hash(fs.readFileSync(safe(p.root, ref))) };
      const backup = `.writer/pre-governance-${before.revision}-${crypto.randomUUID()}.json`; fs.writeFileSync(safe(p.root, backup), JSON.stringify(before, null, 2) + '\n', { flag: 'wx' });
      Object.assign(next, { schema_version: 3, long_form: before.schema_version === 2, project_id: crypto.randomUUID(), revision: before.revision + 1, governance: event.payload, governance_binding: binding, governance_events: [binding], decisions: {}, operations: {} });
      journal.verify(p.root, next);
      const result = { ok: true, schema_version: 3, revision: next.revision, backup, units: next.units.length, facts_unchanged: true };
      next.operations[input.operation_id] = { input_sha256: hash(JSON.stringify(input)), result };
      atomic(safe(p.root, '.writer/state.json'), next, stateLimit); return result;
    });
  }
  return { validate, view, gate, unitAction, setWorkflow, decision, preview, migrate, requireEnabled };
}
