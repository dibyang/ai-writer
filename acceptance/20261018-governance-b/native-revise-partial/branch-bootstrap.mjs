import fs from 'node:fs';
import path from 'node:path';
import { project, phase, state, output, input, run, json, put, sha, fingerprints, bundle } from './session.mjs';
const session = json(path.join(phase, 'revision-session.json'));
const p = session.workspace, token = session.token;
const isolation = state().units.map(u => {
  const a = path.join(project, u.draft), b = path.join(p, u.draft), sa = fs.statSync(a), sb = fs.statSync(b);
  return { unit: u.unit, draft: u.draft, parent_sha256: sha(fs.readFileSync(a)), branch_sha256: sha(fs.readFileSync(b)), parent_file_id: String(sa.ino), branch_file_id: String(sb.ino), parent_nlink: sa.nlink, branch_nlink: sb.nlink, separate_file_ids: sa.ino !== sb.ino };
});
put(path.join(phase, 'copy-isolation-before.json'), { base_revision: session.base_revision, parent_revision: state().revision, branch_revision: state(p).revision, parent_state_sha256: fingerprints().state_sha256, branch_state_sha256: fingerprints(p).state_sha256, bodies: isolation, branch_has_nested_revisions: fs.existsSync(path.join(p, '.writer/revisions')), branch_has_tool: fs.existsSync(path.join(p, '.writer/tool')) });
bundle('branch-before-rewind-six', p, state(p).units.map(u => u.draft));
run('branch-rewind', ['rewind', '--from', '1', '--expected-revision', String(state(p).revision)], p, token);
const r = run('branch-publish-staged-rules', ['source', 'publish', '--input', input('branch-publish-staged-rules', { expected_revision: state(p).revision, operation_id: 'native-two-branch-publish-staged-rules', author_evidence: json(path.join(phase, 'author-evidence.json')), impact_id: output('stage-rules-historical-prefix').impact_id })], p, token);
put(path.join(phase, 'branch-after-rule-publish.json'), { publish: r, fingerprints: fingerprints(p), main: fingerprints() });
