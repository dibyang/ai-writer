import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { ROOT, main, safe } from '../lib/workspace.mjs';
const campaign = path.join(ROOT, 'acceptance/20261015-long');
for (const phase of ['novel-stage-a', 'novel-stage-b-retry', 'import-live']) {
  const result = JSON.parse(fs.readFileSync(path.join(campaign, phase, 'process-result.json'), 'utf8'));
  if (result.exit_code !== 0) throw new Error(`unfinished phase ${phase}`);
}
const candidate = JSON.parse(fs.readFileSync(path.join(campaign, 'candidate-validation-v2.json'), 'utf8'));
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
for (const row of candidate.files) if (sha(path.join(ROOT, row.file)) !== row.sha256) throw new Error('candidate changed');
const batch = crypto.randomUUID(), changes = [];
for (const directory of ['末班寄存柜', '留一把椅子', '字散开以后', '导入恢复']) {
  const work = path.join(campaign, 'works', directory);
  if (fs.existsSync(safe(work, '.writer/write.lock'))) throw new Error('work locked');
  const beforeState = sha(safe(work, '.writer/state.json'));
  for (const row of candidate.files) {
    const ref = row.file.startsWith('.agents/') ? row.file : `.writer/tool/${row.file}`;
    const output = safe(work, ref), before = sha(output);
    if (before === row.sha256) continue;
    const backup = path.join(campaign, 'tool-backups', batch, directory, ref); fs.mkdirSync(path.dirname(backup), { recursive: true });
    fs.copyFileSync(output, backup, fs.constants.COPYFILE_EXCL); fs.copyFileSync(path.join(ROOT, row.file), output);
    changes.push({ directory, file: ref, before, after: sha(output), backup });
  }
  if (sha(safe(work, '.writer/state.json')) !== beforeState) throw new Error('state unexpectedly changed');
  if (!main(['check', '--project', work]).ok) throw new Error(`final check failed: ${directory}`);
}
fs.writeFileSync(path.join(campaign, `final-tool-refresh-${batch}.json`), JSON.stringify({ candidate: 'candidate-validation-v2.json', state_unchanged: true, changes }, null, 2) + '\n', { flag: 'wx', encoding: 'utf8' });
console.log(JSON.stringify({ ok: true, batch, changed_files: changes.length, state_unchanged: true }));
