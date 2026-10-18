import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { runner, readState, write, sha } from './cli-support.mjs';
const r = runner(process.argv[2]), seed = path.join(r.dest, 'seed'); r.setup(seed); const outcomes = [];
const progress = path.join(r.dest, 'progress.jsonl'); fs.writeFileSync(progress, '', { flag: 'wx' });
function clone(name) { const root = path.join(r.dest, 'cases', name, 'work'); assert.equal(fs.existsSync(root), false); fs.mkdirSync(path.dirname(root), { recursive: true }); fs.cpSync(seed, root, { recursive: true, errorOnExist: true }); return root; }
function ready(name) { const root = clone(name), before = fs.readFileSync(path.join(root, '.writer/state.json')), b = r.begin(root); r.edit(b, name); const prepared = r.prepare(root, b); return { root, before, b, prepared }; }
function finish(row) { outcomes.push(row); fs.appendFileSync(progress, JSON.stringify({ completed_cases: outcomes.length, ...row }) + '\n'); }
function recover(context, direction) {
  const { root, b } = context, tx = r.run(root, ['revision', 'list']).transactions.find(x => !['completed', 'rolled-back'].includes(x.status)); assert.ok(tx);
  const input = { transaction_id: tx.id, token: b.token, direction };
  const lockFile = path.join(root, '.writer/write.lock'); if (fs.existsSync(lockFile)) { input.lock_sha256 = sha(fs.readFileSync(lockFile)); input.author_evidence = r.evidence(root); }
  const result = r.run(root, ['revision', 'recover'], input); assert.equal(r.run(root, ['check']).ok, true);
  if (direction === 'rollback') assert.deepEqual(fs.readFileSync(path.join(root, '.writer/state.json')), context.before); else assert.equal(readState(root).revision, JSON.parse(context.before).revision + 1);
  assert.equal(r.run(root, ['revision', 'recover'], { transaction_id: tx.id, token: b.token, direction }).unchanged, true);
  return result;
}
let boundaries = null;
for (const direction of ['complete', 'rollback']) {
  for (let after = 1; boundaries === null || after <= boundaries; after++) {
    const c = ready(`${direction}-${after}`); boundaries ??= c.prepared.changes.length; assert.equal(c.prepared.changes.length, boundaries);
    r.commit(c.root, c.b, 91, { AI_WRITER_TEST_FAULT: '1', AI_WRITER_TEST_STOP_AFTER: String(after) });
    assert.equal(r.run(c.root, ['status'], null, 2).code, 'TRANSACTION_PENDING'); const result = recover(c, direction); finish({ scenario: 'each-published-file-boundary', after, file: c.prepared.changes[after - 1].file, direction, result });
  }
}
for (const direction of ['complete', 'rollback']) {
  const c = ready(`prepared-${direction}`); r.commit(c.root, c.b, 93, { AI_WRITER_TEST_FAULT: '1', AI_WRITER_TEST_STOP_PHASE: 'transaction-prepared' }); assert.equal(r.run(c.root, ['status'], null, 2).code, 'TRANSACTION_PENDING'); finish({ scenario: 'durable-plan-before-first-publish', direction, result: recover(c, direction) });
}
for (const target of ['first', 'state']) for (const direction of ['complete', 'rollback']) {
  const c = ready(`rename-${target}-${direction}`), file = target === 'state' ? '.writer/state.json' : c.prepared.changes[0].file;
  const failure = r.commit(c.root, c.b, 2, { AI_WRITER_TEST_FAULT: '1', AI_WRITER_TEST_RENAME_TARGET: file, AI_WRITER_TEST_RENAME_ERROR: 'ENOSPC' }); assert.equal(failure.code, 'ENOSPC');
  assert.equal(r.run(c.root, ['status'], null, 2).code, 'TRANSACTION_PENDING'); finish({ scenario: 'injected-rename-error-not-real-disk-exhaustion', target, file, direction, result: recover(c, direction) });
}
{
  const c = ready('backups-before-manifest'); r.commit(c.root, c.b, 94, { AI_WRITER_TEST_FAULT: '1', AI_WRITER_TEST_STOP_PHASE: 'transaction-backups' });
  assert.deepEqual(fs.readFileSync(path.join(c.root, '.writer/state.json')), c.before); assert.equal(r.run(c.root, ['revision', 'list']).transactions.length, 0);
  r.run(c.root, ['revision', 'unlock'], { id: c.b.id, token: c.b.token, lock_sha256: sha(fs.readFileSync(path.join(c.root, '.writer/write.lock'))), author_evidence: r.evidence(c.root), reason: '进程在事务清单前中断，明确恢复原会话' });
  const result = r.commit(c.root, c.b); assert.equal(r.run(c.root, ['check']).ok, true); finish({ scenario: 'orphan-backups-before-authority', result });
}
const result = r.summary({ published_file_boundaries: boundaries, cases: outcomes.length, outcomes, nature: 'mechanical real-CLI/process fault matrix; no literary acceptance' });
console.log(JSON.stringify({ ok: true, calls: result.calls, cases: result.cases, published_file_boundaries: boundaries }));
