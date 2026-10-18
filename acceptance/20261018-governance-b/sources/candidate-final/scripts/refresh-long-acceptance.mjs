import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { ROOT, main } from '../lib/workspace.mjs';

// Explicit acceptance-only refresh after the first writer process has stopped.
const campaign = path.join(ROOT, 'acceptance/20261015-long');
const result = JSON.parse(fs.readFileSync(path.join(campaign, 'novel-stage-a/process-result.json'), 'utf8'));
if (result.exit_code !== 0) throw new Error('stage A has not completed successfully');
const work = path.join(campaign, 'works/末班寄存柜');
if (fs.existsSync(path.join(work, '.writer/write.lock'))) throw new Error('work is locked');
const batch = crypto.randomUUID(), backup = path.join(campaign, 'tool-backups', batch);
const sha = file => fs.existsSync(file) ? crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex') : null;
const sources = ['bin/ai-writer.mjs', 'lib/workspace.mjs', 'lib/journal.mjs', 'lib/longform.mjs', 'package.json'];
const mappings = sources.map(ref => ({ source: ref, target: `.writer/tool/${ref}` }));
for (const skill of ['writer-project', 'writer-novel', 'writer-screenplay', 'writer-history', 'writer-essay', 'writer-review', 'writer-research']) {
  const ref = `.agents/skills/${skill}/SKILL.md`; mappings.push({ source: ref, target: ref });
}
mappings.push({ source: '.agents/skills/writer-project/references/long-form.md', target: '.agents/skills/writer-project/references/long-form.md' });
const stateBefore = sha(path.join(work, '.writer/state.json'));
const files = [];
for (const { source, target } of mappings) {
  const input = path.join(ROOT, source), output = path.join(work, target), saved = path.join(backup, target);
  const before = sha(output), after = sha(input);
  if (before !== after) {
    if (before) { fs.mkdirSync(path.dirname(saved), { recursive: true }); fs.copyFileSync(output, saved, fs.constants.COPYFILE_EXCL); }
    fs.mkdirSync(path.dirname(output), { recursive: true }); fs.copyFileSync(input, output);
  }
  files.push({ source, target, before, after, changed: before !== after });
}
if (sha(path.join(work, '.writer/state.json')) !== stateBefore) throw new Error('state unexpectedly changed');
const verification = main(['check', '--project', work]);
const manifest = { work, backup, state_before_and_after: stateBefore, files, verification };
fs.writeFileSync(path.join(campaign, `tool-refresh-${batch}.json`), JSON.stringify(manifest, null, 2) + '\n', { flag: 'wx', encoding: 'utf8' });
console.log(JSON.stringify({ ok: verification.ok, changed: files.filter(x => x.changed).length, backup, state_unchanged: true }));
