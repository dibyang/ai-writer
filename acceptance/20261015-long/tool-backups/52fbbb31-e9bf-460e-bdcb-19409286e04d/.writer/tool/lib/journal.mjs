import fs from 'node:fs';
import crypto from 'node:crypto';

const equal = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const mapping = x => x !== null && typeof x === 'object' && !Array.isArray(x);
export function cleanKeys(value) {
  if (value && typeof value === 'object') for (const [key, child] of Object.entries(value)) {
    if (['__proto__', 'prototype', 'constructor'].includes(key)) throw new Error(`不允许保留字段：${key}`);
    cleanKeys(child);
  }
}
// Reversible deltas keep append-only timelines from duplicating the whole past.
export function delta(before, after, at = []) {
  cleanKeys(before); cleanKeys(after);
  if (equal(before, after)) return [];
  if (Array.isArray(before) && Array.isArray(after) && after.length >= before.length && before.every((x, i) => equal(x, after[i]))) {
    return [{ at, append: after.slice(before.length), length: before.length }];
  }
  if (mapping(before) && mapping(after)) {
    return [...new Set([...Object.keys(before), ...Object.keys(after)])].flatMap(key => {
      if (Object.hasOwn(before, key) && Object.hasOwn(after, key)) return delta(before[key], after[key], [...at, key]);
      return [{ at: [...at, key], had: Object.hasOwn(before, key), has: Object.hasOwn(after, key),
        ...(Object.hasOwn(before, key) ? { before: before[key] } : {}), ...(Object.hasOwn(after, key) ? { after: after[key] } : {}) }];
    });
  }
  return [{ at, had: true, has: true, before, after }];
}
export function applyDelta(value, operations, reverse = false) {
  let result = structuredClone(value);
  cleanKeys(operations);
  for (const op of reverse ? [...operations].reverse() : operations) {
    if (!Array.isArray(op.at) || op.at.some(x => typeof x !== 'string' || ['__proto__', 'prototype', 'constructor'].includes(x))) throw new Error('差量路径损坏');
    let parent = result;
    for (const key of op.at.slice(0, -1)) {
      if (!mapping(parent) || !Object.hasOwn(parent, key)) throw new Error('差量父路径损坏');
      parent = parent[key];
    }
    const key = op.at.at(-1), current = op.at.length ? parent[key] : result;
    if (Object.hasOwn(op, 'append')) {
      const expected = reverse ? op.length + op.append.length : op.length;
      if (!Array.isArray(current) || current.length !== expected || (reverse && !equal(current.slice(op.length), op.append))) throw new Error('差量数组基线不一致');
      const next = reverse ? current.slice(0, op.length) : [...current, ...op.append];
      if (op.at.length) parent[key] = next; else result = next;
    } else {
      const exists = reverse ? op.has : op.had, expected = reverse ? op.after : op.before;
      if ((op.at.length && Object.hasOwn(parent, key) !== exists) || (exists && !equal(current, expected))) throw new Error('差量对象基线不一致');
      const keep = reverse ? op.had : op.has, next = structuredClone(reverse ? op.before : op.after);
      if (!op.at.length) result = next;
      else if (keep) parent[key] = next;
      else delete parent[key];
    }
  }
  return result;
}
export function createJournal({ safe, json, hash, atomic, stateLimit }) {
  function read(root, row) {
    if (!/^\.writer\/journal\/[a-f0-9-]+\.json$/.test(row.journal ?? '')) throw new Error('差量记录路径损坏');
    const file = safe(root, row.journal);
    if (!fs.existsSync(file) || hash(fs.readFileSync(file)) !== row.journal_sha256) throw new Error(`差量记录缺失或哈希变化：单元 ${row.unit}`);
    const saved = json(file);
    if (saved.schema_version !== 1 || !Array.isArray(saved.patch)) throw new Error('差量记录版本损坏');
    return saved.patch;
  }
  function store(root, row) {
    const ref = `.writer/journal/${crypto.randomUUID()}.json`;
    const dir = safe(root, '.writer/journal'); fs.mkdirSync(dir, { recursive: true });
    atomic(safe(root, ref), { schema_version: 1, patch: delta(row.before, row.after) });
    const { before, after, ...metadata } = row;
    return { ...metadata, journal: ref, journal_sha256: hash(fs.readFileSync(safe(root, ref))) };
  }
  function migrate(root, p) {
    if (p.state.schema_version === 2) return { ok: true, unchanged: true, revision: p.state.revision };
    const backup = `.writer/pre-long-${p.state.revision}-${crypto.randomUUID()}.json`;
    fs.writeFileSync(safe(root, backup), JSON.stringify(p.state, null, 2) + '\n', { flag: 'wx', encoding: 'utf8' });
    const state = { ...p.state, schema_version: 2, revision: p.state.revision + 1,
      baseline: p.state.units[0]?.before ?? structuredClone(p.state.snapshot), units: [] };
    let current = state.baseline;
    for (const row of p.state.units) {
      if (!equal(current, row.before)) throw new Error('旧快照链不一致，保留备份且不迁移');
      state.units.push(store(root, row)); current = row.after;
    }
    if (!equal(current, p.state.snapshot)) throw new Error('旧快照终态不一致，保留备份且不迁移');
    atomic(safe(root, '.writer/state.json'), state, stateLimit);
    return { ok: true, schema_version: 2, revision: state.revision, backup, units: state.units.length };
  }
  function restore(root, state, from) {
    let snapshot = state.snapshot;
    for (const row of [...state.units].reverse()) {
      if (row.unit < from) break;
      snapshot = applyDelta(snapshot, read(root, row), true);
    }
    return snapshot;
  }
  function verify(root, state) {
    let snapshot = state.baseline;
    for (const row of state.units) snapshot = applyDelta(snapshot, read(root, row));
    if (!equal(snapshot, state.snapshot)) throw new Error('差量链与当前快照不一致');
  }
  return { read, store, migrate, restore, verify };
}
