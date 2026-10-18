import {run,state,read,put,stage,hundred} from './harness.mjs';import path from 'node:path';
const b=read(path.join(stage,'hundred-session.json')),p=b.workspace,t=['--revision-token',b.token];
run('hundred-rewind',['rewind','--from','100','--expected-revision',String(state(p).revision),...t],p);
put(path.join(stage,'samples-state-99.json'),state(p));
for(let i=1;i<=3;i++){
 const x=run('hundred-template-'+i,['record-template','--unit','100','--draft',state(hundred).units.at(-1).draft,...t],p);
 put(path.join(stage,'samples/template-'+i+'.json'),x);
}
for(let i=1;i<=3;i++){
 const x=run('hundred-replay-'+i,['revision','replay-input','--unit','100',...t],p);
 put(path.join(stage,'samples/replay-'+i+'.json'),x);
}
put(path.join(stage,'samples-state-after.json'),state(p));
console.log(JSON.stringify(read(path.join(stage,'samples/replay-1.json'))));
