import path from 'node:path';
import {phase,project,branch,root,json,state,put,bundle,run} from './session.mjs';
const s=state(branch);
bundle('effective-frozen-inputs',branch,Object.values(s.source_versions).map(v=>v.object_ref));
put(path.join(phase,'ledger-before.json'),s.snapshot);
const old=state(project);
put(path.join(phase,'original-units-4-6.json'),old.units.filter(u=>u.unit>=4));
for(const n of [4,5,6]){
 const f=path.join(root,`commands/native-one-rev-record-${n}/input.raw.json`);
 put(path.join(phase,`original-record-${n}.json`),json(f));
}
run('chapter4-context',['context','--unit','4','--purpose','revision'],branch);
run('chapter4-template',['record-template','--unit','4','--draft','正文/0004-柳婆的抽屉.md'],branch);
