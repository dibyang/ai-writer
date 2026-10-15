import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
const project = new URL('../works/停电以后/', import.meta.url);
const hash = b => createHash('sha256').update(b).digest('hex');
const read = ref => readFileSync(new URL(ref, project));
const state = JSON.parse(read('.writer/state.json').toString('utf8'));
const han = s => (s.match(/\p{Script=Han}/gu) || []).length;
const nonwhite = s => [...s.replace(/\s/gu, '')].length;
const units = state.units.map(u => {
  const bytes = read(u.draft), text = bytes.toString('utf8');
  let dialogue = '', action = '', cues = 0;
  for (const block of text.trim().split(/\r?\n\s*\r?\n/u)) {
    if (/^场\s+\d/u.test(block) || block === '（全剧终）') continue;
    const lines = block.split(/\r?\n/u);
    if (['陈良', '许青'].includes(lines[0])) { dialogue += lines.slice(1).join('\n'); cues++; }
    else action += block;
  }
  if (hash(bytes) !== u.sha256) throw new Error(`draft mismatch: ${u.draft}`);
  return { unit: u.unit, draft: u.draft, sha256: hash(bytes), body_han: han(dialogue) + han(action), dialogue_han: han(dialogue), action_han: han(action), dialogue_cues: cues, file_nonwhite_chars: nonwhite(text) };
});
if (units.map(u => u.unit).join(',') !== '1,2,3') throw new Error('Expected exactly units 1,2,3');
const refs = [...new Set(['writer.json', '.writer/state.json', ...state.units.flatMap(u => [u.draft, ...Object.keys(u.source_hashes)])])].sort();
const source_hashes = Object.fromEntries(refs.map(ref => [ref, hash(read(ref))]));
const totals = Object.fromEntries(['body_han', 'dialogue_han', 'action_han', 'dialogue_cues', 'file_nonwhite_chars'].map(key => [key, units.reduce((sum, u) => sum + u[key], 0)]));
const evidence = { generated: new Date().toISOString(), project: fileURLToPath(project), revision: state.revision, count_method: 'body_han counts Script=Han only in spoken lines and action paragraphs; excludes scene headings, role cues, end marker, punctuation, digits and whitespace. file_nonwhite_chars includes all file content except whitespace.', units, totals, source_hashes };
writeFileSync(new URL('final-evidence.json', import.meta.url), JSON.stringify(evidence, null, 2) + '\n', { encoding: 'utf8' });
process.stdout.write(JSON.stringify({ revision: evidence.revision, units, totals, source_hashes }, null, 2) + '\n');
