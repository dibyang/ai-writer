import fs from 'node:fs';
import {session} from '../session-support.mjs';
const s=session('draft-e');
for(const [label,args] of [['doctor',['doctor']],['status',['status']],['workflow',['workflow','show']],['discussion',['context','--purpose','discussion']],['identify',['tool','identify']],['check',['check']]]){
 const r=s.run('initial-'+label,args,{entry:'embedded'}); console.log(JSON.stringify({label:r.label,value:r.value}));
}
s.write('initial-state.json',s.state());
for(const [f,omit] of [['repair-upgrade/results.json',['verification']],['read-d/scenario-plan.json',['chains']],['reading-audit/read-d.json',['files']]]){
 const j=JSON.parse(fs.readFileSync(new URL('../'+f,import.meta.url))); console.log(f,JSON.stringify(Object.fromEntries(Object.entries(j).filter(([k])=>!omit.includes(k)))));
}
