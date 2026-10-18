import fs from 'node:fs';
import path from 'node:path';
import {session} from '../session-support.mjs';
const s=session('draft-f');
const mode=process.argv[2];
if(mode==='start'){
 s.write('initial-state.json',s.state());
 s.write('started-at.json',{started_at:new Date().toISOString(),pid:process.pid,kind:'actual single Codex process; helper pid is not Codex identity'});
 for(const [label,args] of [['doctor',['doctor']],['status',['status']],['workflow',['workflow','show']],['discussion',['context','--purpose','discussion']],['identify',['tool','identify']],['check',['check']]]){
  const r=s.run('start-'+label,args,{entry:'embedded'});s.write('start-'+label+'.json',r.value);console.log(JSON.stringify({label,value:r.value}));
 }
}else{
 const spec=JSON.parse(fs.readFileSync(path.join(s.stage,mode),'utf8'));
 const r=s.run(spec.label,spec.args,{entry:'embedded',...(spec.input===undefined?{}:{input:spec.input}),...(spec.expected===undefined?{}:{expected:spec.expected})});
 console.log(JSON.stringify(r.value,null,2));
}
