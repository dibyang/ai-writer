import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {session,BASE,ROOT,readJSON,sha} from '../session-support.mjs';
export const s=session('final-recover');
export const h=readJSON(path.join(BASE,'revise-d/handoff.json'));
export const save=(n,v)=>s.write(n,v);
export const run=(label,args,options={})=>{const r=s.run(label,args,{entry:'embedded',...options});save(label+'.json',r.value);console.log(JSON.stringify({label,exit:r.meta.exit_code,ok:r.value?.ok,code:r.value?.code,revision:r.value?.revision,status:r.value?.status}));return r.value;};
if(process.argv[2]==='start'){
 save('started-at.json',{at:new Date().toISOString(),workflow:'0.7.2 protection only; no source changes, no seal'});
 save('initial-state.bin',fs.readFileSync(path.join(s.project,'.writer/state.json')));
 for(const [n,a] of [['initial-status',['status']],['initial-revisions',['revision','list']],['initial-doctor',['doctor']],['initial-identify',['tool','identify']]])run(n,a);
 console.log(JSON.stringify({stateKeys:Object.keys(s.state()),unit:s.state().units?.[0],handoffKeys:Object.keys(h)}));
}
