import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const base=path.dirname(fileURLToPath(import.meta.url));
const [label,phase,count,first='1',last=count,project]=process.argv.slice(2);
assert.match(label??'',/^[a-z][a-z0-9-]*$/);assert(['before','after'].includes(phase));
assert(project&&path.isAbsolute(project),'Pass the actual revision workspace returned by the product');
const root=path.resolve(project);assert(root.startsWith(path.resolve(base)+path.sep),'Candidate must be inside X');
assert(Number(first)>=1&&Number(last)>=Number(first)&&Number(last)<=Number(count));
const sha=v=>crypto.createHash('sha256').update(v).digest('hex');
const raw=fs.readFileSync(path.join(root,'.writer/state.json')),s=JSON.parse(raw);
assert.equal(s.units.length,Number(count));
const units=s.units.filter(u=>u.unit>=Number(first)&&u.unit<=Number(last)).map(u=>{
  const file=path.join(root,u.draft),v=fs.readFileSync(file),lines=v.toString('utf8').split(/\r?\n/);
  if(lines.at(-1)==='')lines.pop();assert.equal(sha(v),u.sha256);
  return{unit:u.unit,draft:u.draft,file,sha256:u.sha256,bytes:v.length,lines:lines.length};
});
assert.equal(units.length,Number(last)-Number(first)+1);
const result={marker:'CURRENT_FULL_READ_'+phase.toUpperCase(),label,phase,at:new Date().toISOString(),project_root:root,state_sha256:sha(raw),units_raw_sha256:sha(JSON.stringify(s.units)),snapshot_sha256:sha(JSON.stringify(s.snapshot)),units};
const dir=path.join(base,'read-boundaries');fs.mkdirSync(dir,{recursive:true});
fs.writeFileSync(path.join(dir,label+'-'+phase+'.json'),JSON.stringify(result,null,2)+'\n',{flag:'wx'});
if(phase==='after'){
  const before=JSON.parse(fs.readFileSync(path.join(dir,label+'-before.json'),'utf8'));
  for(const k of ['project_root','state_sha256','units_raw_sha256','snapshot_sha256','units'])assert.deepEqual(result[k],before[k]);
}
console.log(JSON.stringify(result));
