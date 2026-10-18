import fs from 'node:fs';import {session,sha} from '../session-support.mjs';
const r=JSON.parse(fs.readFileSync(new URL('revision-local.json',import.meta.url))),s=session('draft-e',{project:r.workspace,token:r.token});
console.log(s.run('replay-input-102-after-read',['revision','replay-input','--unit','102','--out','.writer/drafts/f-e-replay-102-current.json']).value?.ok??'template');
const t=JSON.parse(fs.readFileSync(s.project+'/.writer/drafts/f-e-replay-102-current.json'));
t.replay_review={reviewer:'actual-Codex-draft-e-informed-self-review',report:'审查/F-E-102重登核查.md',draft_sha256:sha(fs.readFileSync(s.project+'/'+t.draft)),checked_fields:['summary','characters','timeline','ledger','evidence','downstream']};
s.write('replay-record-102-current.json',t);const p=s.run('replay-preview-102-current',['record-preview'],{input:t});console.log({ok:p.value.ok,findings:p.value.findings});
console.log(s.run('replay-record-102-current',['record'],{input:t}).value);
for(const [label,args] of [['fix-outline-103',['outline','--unit','103']],['fix-context-103',['context','--unit','103','--purpose','revision','--max-chars','160000']],['replay-input-103',['revision','replay-input','--unit','103','--out','.writer/drafts/f-e-replay-103.json']]]){const q=s.run(label,args);console.log(q.label,q.value?.ok??'template');}
