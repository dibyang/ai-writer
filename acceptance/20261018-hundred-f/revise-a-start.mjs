import fs from 'node:fs';
import path from 'node:path';
import {session,sha} from './session-support.mjs';
const s=session('revise-a');
s.write('started-at.json',{at:new Date().toISOString(),phase:'revise-a'});
s.write('root-initial-state.bin',fs.readFileSync(path.join(s.project,'.writer/state.json')));
const st=s.state();
s.write('root-body-baseline.json',st.units.map(u=>({unit:u.unit,draft:u.draft,sha256:sha(fs.readFileSync(path.join(s.project,u.draft)))})));
for(const [label,args] of [['doctor',['doctor']],['status',['status']],['check',['check']],['workflow',['workflow','show']],['revisions',['revision','list']]]){
 const r=s.run('restore-'+label,args,{entry:'embedded'});s.write('initial-'+label+'.json',r.value);
 console.log(JSON.stringify({label,result:r.value}));
}
