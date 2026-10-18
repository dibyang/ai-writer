import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

// One-shot acceptance evidence aggregation. Never imports product code or writes a work.
const base = path.resolve('acceptance/20261018-governance-a');
const out = path.join(base, 'native-recover');
const sha = value => crypto.createHash('sha256').update(value).digest('hex');
const readJson = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const sixRoot = path.join(base, 'works/纸灯札记');
const finalRoot = path.join(out, '最终微型作品');
const labels = [
  'six-main-status', 'six-copy-status', 'six-main-discussion', 'six-copy-discussion',
  'six-main-decisions', 'six-copy-decisions',
  'six-main-draft-context', 'six-main-record-template', 'six-main-record',
  'six-copy-draft-context', 'six-copy-record-template', 'six-copy-record',
  'six-main-identify', 'six-copy-identify', 'six-main-compare', 'six-copy-compare', 'six-main-check',
  'final-init', 'final-initial-status', 'final-workflow-trial', 'final-decision-location',
  'final-decision-ending-prop', 'final-plan', 'final-draft-context', 'final-record-template',
  'final-record', 'final-check', 'final-workflow-paused', 'final-paused-status',
  'final-suggested-workflow-show', 'final-discussion-denied', 'final-copy-paused-status',
  'final-main-identify', 'final-copy-identify', 'final-main-compare', 'final-copy-compare',
  'final-copy-suggested-workflow-show'
].map(label => `native-two-${label}`);
const commandRows = labels.map(label => {
  const dir = path.join(base, 'commands', label);
  const result = readJson(path.join(dir, 'result.json'));
  const stdout = fs.readFileSync(path.join(dir, 'stdout.raw.txt'));
  const stderr = fs.readFileSync(path.join(dir, 'stderr.raw.txt'));
  const parsed = JSON.parse((stderr.length ? stderr : stdout).toString('utf8'));
  return { label, ...result, output_ok: parsed.ok ?? null, error_code: parsed.code ?? null,
    stdout_bytes: stdout.length, stdout_sha256: sha(stdout), stderr_bytes: stderr.length,
    stderr_sha256: sha(stderr), evidence_dir: `commands/${label}` };
});
const outputOf = label => readJson(path.join(base, 'commands', `native-two-${label}`, 'stdout.raw.txt'));
function manifestAudit(root) {
  const manifest = readJson(path.join(root, '.writer/tool/build-manifest.json'));
  const rows = manifest.files.map(entry => {
    const prefix = entry.group === 'runtime' ? '.writer/tool' : entry.group === 'skills' ? '.agents/skills' : '';
    const file = path.join(root, prefix, entry.file);
    const bytes = fs.readFileSync(file);
    return { ...entry, actual_sha256: sha(bytes), actual_bytes: bytes.length,
      matches: sha(bytes) === entry.sha256 && bytes.length === entry.bytes };
  });
  return { profile: manifest.profile, version: manifest.tool_version, build_id: manifest.build_id,
    supported_state_schemas: manifest.supported_state_schemas, files: rows,
    matched: rows.filter(row => row.matches).length, total: rows.length };
}
function evidenceAudit(root) {
  const state = readJson(path.join(root, '.writer/state.json'));
  return state.governance_events.map(ref => {
    const bytes = fs.readFileSync(path.join(root, ref.ref));
    const event = JSON.parse(bytes);
    const evidence = event.evidence;
    const local = fs.readFileSync(path.join(root, evidence.local_source));
    const frozen = fs.readFileSync(path.join(root, evidence.frozen_ref));
    return { ref: ref.ref, event_kind: event.kind, payload: event.payload, evidence,
      event_hash_matches: sha(bytes) === ref.sha256,
      local_hash_matches: sha(local) === evidence.source_sha256,
      frozen_hash_matches: sha(frozen) === evidence.source_sha256,
      local_equals_frozen: local.equals(frozen),
      quote_in_local: local.toString('utf8').includes(evidence.quote),
      quote_in_frozen: frozen.toString('utf8').includes(evidence.quote) };
  });
}
const sixState = readJson(path.join(sixRoot, '.writer/state.json'));
const reviewFiles = ['7b581b86-ff60-4b42-bae1-0dd11abbc45c.json', 'abfa9f5c-583b-44b3-8cc5-90570eb86e6f.json'];
const reviewAudit = reviewFiles.map(name => {
  const review = readJson(path.join(sixRoot, '.writer/reviews', name));
  return { ...review, report_hash_matches: sha(fs.readFileSync(path.join(sixRoot, review.report))) === review.report_sha256,
    units_match: review.units.every(unit => sha(fs.readFileSync(path.join(sixRoot, unit.draft))) === unit.sha256) };
});
const journalAudit = sixState.units.map(unit => ({ unit: unit.unit, journal: unit.journal,
  matches: sha(fs.readFileSync(path.join(sixRoot, unit.journal))) === unit.journal_sha256 }));
const ledgerAudit = sixState.snapshot.ledger.O_LAMP.evidence.map(evidence => {
  const bytes = fs.readFileSync(path.join(sixRoot, evidence.draft));
  const line = bytes.toString('utf8').split(/\r?\n/)[evidence.line - 1];
  return { ...evidence, hash_matches: sha(bytes) === evidence.sha256, line_quote_matches: line.includes(evidence.quote) };
});
const finalState = readJson(path.join(finalRoot, '.writer/state.json'));
const suggested = ['final-paused-status', 'final-copy-paused-status'].map((label, index) => {
  const status = outputOf(label);
  const actual = commandRows.find(row => row.label === `native-two-${index ? 'final-copy-suggested-workflow-show' : 'final-suggested-workflow-show'}`);
  const tokens = [...status.next.command.matchAll(/'([^']*)'|(\S+)/g)].map(match => match[1] ?? match[2]);
  return { status_label: label, suggested_command: status.next.command,
    actual_label: actual.label, actual_argv: [actual.exe, ...actual.argv],
    exact_argv_match: JSON.stringify(tokens) === JSON.stringify([actual.exe, ...actual.argv]),
    read_only_workflow_show: actual.argv[1] === 'workflow' && actual.argv[2] === 'show', exit_code: actual.exit_code };
});
const sixBefore = readJson(path.join(out, 'six-before.json'));
const sixAfter = readJson(path.join(out, 'six-after-all.json'));
const finalBefore = readJson(path.join(out, 'final-paused-before-readonly.json'));
const finalAfter = readJson(path.join(out, 'final-after-readonly.json'));
const error = JSON.parse(fs.readFileSync(path.join(base, 'commands/native-two-final-discussion-denied/stderr.raw.txt'), 'utf8'));
const observation = {
  schema_version: 1, session: 'native-two-independent-recover', generated_at: new Date().toISOString(),
  nature: 'CLI real-run plus informed model reread; not human blind reading or release acceptance',
  overall: 'required flows completed; one misleading paused error next_action remains',
  commands: { total: commandRows.length, successful: commandRows.filter(row => row.exit_code === 0).length,
    expected_refusals: commandRows.filter(row => row.exit_code === 2 && row.error_code === 'ACTION_OUT_OF_SCOPE').length,
    rows: commandRows },
  six: { root: sixRoot, revision: sixState.revision, schema: sixState.schema_version,
    registered_units: sixState.units.map(unit => unit.unit), next_unit: outputOf('six-main-status').next_unit,
    governance: sixState.governance, decisions: sixState.decisions, evidence_audit: evidenceAudit(sixRoot),
    journal_audit: journalAudit, ledger_audit: ledgerAudit, reviews: reviewAudit,
    before_state_sha256: sixBefore.state.sha256, after_state_sha256: sixAfter.state.sha256,
    before_inventory_sha256: sixBefore.inventory_sha256, after_inventory_sha256: sixAfter.inventory_sha256,
    before_draft_inventory_sha256: sixBefore.draft_inventory_sha256,
    after_draft_inventory_sha256: sixAfter.draft_inventory_sha256,
    all_102_files_unchanged: sixAfter.all_bytes_unchanged,
    chapter7_draft_or_plan_created: false, model_review: 'six-model-reread.md' },
  final: { root: finalRoot, revision: finalState.revision, schema: finalState.schema_version,
    registered_units: finalState.units.map(unit => unit.unit), next_unit: outputOf('final-paused-status').next_unit,
    governance: finalState.governance, decisions: finalState.decisions,
    evidence_audit: evidenceAudit(finalRoot), body: readJson(path.join(out, 'final-draft-final-count.json')),
    changes_protocol: true, long_form: finalState.long_form === true,
    final_status_suggestions: suggested,
    paused_before_state_sha256: finalBefore.state.sha256, after_readonly_state_sha256: finalAfter.state.sha256,
    paused_before_inventory_sha256: finalBefore.inventory_sha256, after_readonly_inventory_sha256: finalAfter.inventory_sha256,
    before_draft_inventory_sha256: finalBefore.draft_inventory_sha256,
    after_draft_inventory_sha256: finalAfter.draft_inventory_sha256,
    all_74_files_unchanged_after_pause: finalAfter.all_bytes_unchanged,
    draft2_or_plan2_created: false },
  builds: { six: readJson(path.join(out, 'six-build-summary.json')),
    final: readJson(path.join(out, 'final-build-summary.json')),
    six_initialization_manifest_audit: manifestAudit(sixRoot),
    final_initialization_manifest_audit: manifestAudit(finalRoot),
    main_managed_content_unchanged_between_identifications:
      outputOf('six-main-identify').observed_content_id === outputOf('final-main-identify').observed_content_id,
    full_engine: 'intentional profile omission; not tested and not a missing-product finding',
    updates_performed: false },
  findings: [{ id: 'F1', severity: 'usability', state: 'unfixed',
    issue: 'paused discussion is correctly rejected, but next_action still recommends discussion/planning',
    evidence_label: 'native-two-final-discussion-denied', error_code: error.code, actual_next_action: error.next_action,
    authorization: error.scope.authorization,
    expected: 'Keep paused; recommend executable read-only workflow show or wait for explicit new author instruction.' }],
  limits: ['No product source edits, migrations, tool updates, commits or pushes by this session',
    'No prior native-create request/final/events or other tests expected answers read',
    'No human blind reading, author finalization, market test, publish or release acceptance',
    'No full engine, long-form enablement, concurrent writer crash recovery, tool update or schema migration tested',
    'Mechanical check remains literary_quality=unreviewed; final chapter rolling reviews valid=0 is not a literary pass',
    'The supplied capture wrapper changed from the initially observed 22-line form to a 37-line form during the run; this session did not edit it. Early raw results and independent snapshots are preserved.']
};
fs.writeFileSync(path.join(out, 'observations.json'), JSON.stringify(observation, null, 2) + '\n', { flag: 'wx' });
const wrapper = fs.readFileSync(path.join(base, 'capture.mjs'));
fs.writeFileSync(path.join(out, 'capture-observed.mjs.txt'), wrapper, { flag: 'wx' });
fs.writeFileSync(path.join(out, 'capture-observed.json'), JSON.stringify({sha256:sha(wrapper), bytes:wrapper.length,
  note:'Final observed wrapper bytes; initial wrapper read had 22 lines, current has 37. No edit by this session.'}, null, 2)+'\n', {flag:'wx'});
console.log(JSON.stringify({ commands: observation.commands.total, successful: observation.commands.successful,
  expected_refusals: observation.commands.expected_refusals,
  six_unchanged: observation.six.all_102_files_unchanged,
  final_unchanged_after_pause: observation.final.all_74_files_unchanged_after_pause,
  manifest_matches: [observation.builds.six_initialization_manifest_audit.matched, observation.builds.final_initialization_manifest_audit.matched],
  suggestion_checks: suggested.map(item => item.exact_argv_match), findings: observation.findings.length }, null, 2));
