import fs from 'node:fs';import assert from 'node:assert/strict';
import {session,sha} from '../session-support.mjs';
const root=session('draft-e'),r=JSON.parse(fs.readFileSync(new URL('revision-local.json',import.meta.url))),s=session('draft-e',{project:r.workspace,token:r.token});
for(const n of ['0102-球没有进的时候.md','0103-这笔没有接下的钱.md'])assert.equal(sha(fs.readFileSync(root.project+'/正文/'+n)),sha(fs.readFileSync(s.project+'/正文/'+n)));
console.log(s.run('rewind-local-102',['rewind','--from','102','--expected-revision',String(s.state().revision)]).value);
for(const [label,args] of [['fix-outline-102',['outline','--unit','102']],['fix-context-102',['context','--unit','102','--purpose','revision','--max-chars','160000']],['replay-input-102',['revision','replay-input','--unit','102','--out','.writer/drafts/f-e-replay-102.json']]]){const v=s.run(label,args);console.log(v.label,v.value?.ok??'template');}
