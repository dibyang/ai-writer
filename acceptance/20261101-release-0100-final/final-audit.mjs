import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
const base=path.dirname(fileURLToPath(import.meta.url));
const root=path.join(base,'work');
const baseline=path.resolve(base,'../20261028-long-0100-ao/work');
const state=JSON.parse(fs.readFileSync(path.join(root,'.writer/state.json'),'utf8'));
const initial=JSON.parse(fs.readFileSync(path.join(baseline,'.writer/state.json'),'utf8'));
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const files=state.units.map(u=>{
  const file=path.resolve(root,u.draft);
  if(!file.startsWith(root+path.sep))throw Error('Unsafe chapter path');
  const bytes=fs.readFileSync(file);
  return {unit:u.unit,path:u.draft,registered:u.sha256,actual:sha(bytes),chars:bytes.toString('utf8').length};
});
const result={revision:state.revision,unit_count:state.units.length,baseline_revision:initial.revision,baseline_units:initial.units.length,
  registered_mismatches:files.filter(x=>x.registered!==x.actual),
  initial_1_121_mismatches:files.slice(0,121).filter((x,i)=>x.actual!==initial.units[i]?.sha256),
  chapter122_before:initial.units[121]?.sha256,tail:files.slice(-2)};
result.ok=result.revision===496&&result.unit_count===123&&result.baseline_revision===489&&result.baseline_units===122&&!result.registered_mismatches.length&&!result.initial_1_121_mismatches.length&&result.chapter122_before!==result.tail[0].actual;
fs.writeFileSync(path.join(base,'final-audit.json'),JSON.stringify(result,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify(result));
if(!result.ok)process.exitCode=1;
