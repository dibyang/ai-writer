import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
const dir = path.dirname(fileURLToPath(import.meta.url));
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const finalPhase = process.argv[2] ?? 'session-f';
if (!['session-f', 'repair-final'].includes(finalPhase)) throw Error('Unknown final phase');
const phases = ['session-a', 'session-b', 'session-c', 'revision-a', 'session-d', 'session-e', 'revision-b', 'session-f', ...(finalPhase === 'repair-final' ? ['repair-final'] : [])];
const rows = phases.map(phase => {
  const audit = read(path.join(dir, 'audits', `${phase}.json`));
  const process = read(path.join(dir, phase, 'process-result.json'));
  const events = fs.readFileSync(path.join(dir, phase, 'events.jsonl'), 'utf8').trim().split(/\r?\n/).map(JSON.parse);
  return { phase, thread_id: audit.thread_id, exit_code: process.exit_code, elapsed_s: process.elapsed_s,
    revision: audit.revision, units: audit.units, han: audit.han, check_count: audit.check_count,
    evidence_count: audit.evidence_count, checks_ok: audit.ok, rolling_review: audit.rolling_review,
    state_bytes: fs.statSync(path.join(dir, 'checkpoints', phase, 'files/.writer/state.json')).size,
    state_sha256: hash(path.join(dir, 'checkpoints', phase, 'files/.writer/state.json')),
    export_sha256: audit.export_sha256, usage_as_reported: events.find(e => e.type === 'turn.completed')?.usage,
    process_result_sha256: hash(path.join(dir, phase, 'process-result.json')),
    event_log_sha256: hash(path.join(dir, phase, 'events.jsonl')),
    audit_sha256: hash(path.join(dir, 'audits', `${phase}.json`)) };
});
const final = read(path.join(dir, 'audits', `${finalPhase}.json`));
const output = { scope: 'native-Codex-artifact-and-model-reading-evidence-not-human-or-market-acceptance',
  phases: rows, fresh_native_sessions: new Set(rows.map(x => x.thread_id)).size,
  sequential_native_elapsed_s: rows.reduce((n, x) => n + x.elapsed_s, 0),
  final: { chapters: final.units, han: final.han, min_chapter_han: Math.min(...final.drafts.map(x => x.han)),
    max_chapter_han: Math.max(...final.drafts.map(x => x.han)), revision: final.revision,
    draft_rows: final.drafts, evidence: final.evidence_count },
  expected_fresh_native_sessions: phases.length,
  assertions: { all_native_sessions_unique: new Set(rows.map(x => x.thread_id)).size === phases.length,
    all_processes_completed: rows.every(x => x.exit_code === 0), all_artifact_audits_passed: rows.every(x => x.checks_ok),
    twenty_four_longer_chapters: final.units === 24 && final.drafts.every(x => x.han >= 1500 && x.han <= 2000) } };
output.ok = Object.values(output.assertions).every(Boolean);
fs.writeFileSync(path.join(dir, finalPhase === 'repair-final' ? 'campaign-summary-final.json' : 'campaign-summary.json'), JSON.stringify(output, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({ ok: output.ok, sessions: output.fresh_native_sessions, elapsed_s: output.sequential_native_elapsed_s, final: output.final }));
process.exitCode = output.ok ? 0 : 1;
