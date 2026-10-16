import path from 'node:path';
import {runner,stage} from './stage.mjs';
const [from,to]=process.argv.slice(2).map(Number);
for(let n=from;n<=to;n++){
 for(const action of ['prepare','commit']){
  const r=runner.run(process.execPath,[path.join(stage,'rebuild.mjs'),action,String(n),'repair1'],`repair1-helper-${action}-${n}`);
  if(r.exit_code!==0){console.log(JSON.stringify({unit:n,action,exit_code:r.exit_code,stdout:r.stdout,stderr:r.stderr}));process.exit(1);}
  const v=JSON.parse(r.stdout);
  console.log(JSON.stringify(action==='prepare'?{unit:n,action,expected_revision:v.expected_revision,source_count:Object.keys(v.source_hashes).length}:{...v,pass:'repair1'}));
 }
}
