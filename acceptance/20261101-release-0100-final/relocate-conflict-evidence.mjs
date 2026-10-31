import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
const base=path.dirname(fileURLToPath(import.meta.url));
const work=path.resolve(base,'work');
const target=path.resolve(base,'revision-evidence');
const conflict=path.join(work,'.writer/revisions/d876dad2-e1f8-4907-8a66-e5a6ace00ead/conflict-70a4ef2a-44a0-4f2c-95ef-dac5e830af21.json');
if(fs.existsSync(target))throw Error('Evidence directory exists');
const rows=JSON.parse(fs.readFileSync(conflict,'utf8')).changes;
if(rows.length!==13)throw Error('Unexpected conflict count');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const planned=rows.map(row=>{
  if(row.expected_sha256!==null||!/^研究\/0100实跑[^/\\]+$/.test(row.file))throw Error('Unexpected conflict path: '+row.file);
  const source=path.resolve(work,row.file),destination=path.resolve(target,path.basename(row.file));
  if(!source.startsWith(work+path.sep)||!destination.startsWith(target+path.sep)||fs.lstatSync(source).isSymbolicLink())throw Error('Unsafe evidence path');
  if(sha(fs.readFileSync(source))!==row.actual_sha256)throw Error('Evidence changed: '+row.file);
  return {source,destination,file:row.file,sha256:row.actual_sha256};
});
if(new Set(planned.map(x=>x.destination.toLowerCase())).size!==planned.length)throw Error('Duplicate destination');
fs.mkdirSync(target);
for(const row of planned){fs.renameSync(row.source,row.destination);if(sha(fs.readFileSync(row.destination))!==row.sha256)throw Error('Moved evidence mismatch: '+row.file);}
fs.writeFileSync(path.join(target,'manifest.json'),JSON.stringify(planned.map(({file,sha256,destination})=>({file,sha256,saved_as:path.basename(destination)})),null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({ok:true,files:planned.length,destination:target}));
