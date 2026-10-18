// Audit read: print whole requested manuscripts, freeze exact bytes once per hash.
// This does not assert model understanding or produce readings.json entries.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const [label,...units]=process.argv.slice(2);
if(!/^[a-z][a-z0-9-]+$/.test(label)||!units.length)throw Error('label unit...');
const base=path.resolve('acceptance/20261019-new-user-g/native-a-v2');
const project=path.resolve('acceptance/20261019-new-user-g/作品/雾港 来信');
fs.mkdirSync(path.join(base,'read-versions'),{recursive:true});
fs.mkdirSync(path.join(base,'read-outputs'),{recursive:true});
const files=fs.readdirSync(path.join(project,'正文')).sort();
const rows=[]; const parts=[];
for(const unitText of units){
 const unit=Number(unitText);if(!Number.isInteger(unit)||unit<1||unit>3)throw Error('Only authorized manuscripts 1–3');
 const matches=files.filter(f=>f.startsWith(String(unit).padStart(4,'0')+'-'));
 if(matches.length!==1)throw Error('Expected exactly one manuscript');
 const relative='正文/'+matches[0];const file=path.join(project,relative),bytes=fs.readFileSync(file),text=bytes.toString('utf8');
 const sha=crypto.createHash('sha256').update(bytes).digest('hex');
 const lines=text.split(/\r?\n/);if(lines.at(-1)==='')lines.pop();
 const version=path.join(base,'read-versions',sha+'.md');
 if(!fs.existsSync(version))fs.writeFileSync(version,bytes,{flag:'wx'});
 const row={unit,file,relative,sha256:sha,range:{from_line:1,to_line:lines.length,complete_file:true},body_han:(text.split(/\r?\n/).slice(1).join('\n').match(/\p{Script=Han}/gu)||[]).length,read_version:version};
 rows.push(row);
 parts.push(JSON.stringify(row),...lines.map((line,i)=>`${i+1}\t${line}`));
}
const output=parts.join('\n')+'\n';
fs.writeFileSync(path.join(base,'read-outputs',label+'.txt'),output,{flag:'wx'});
fs.writeFileSync(path.join(base,'read-outputs',label+'.manifest.json'),JSON.stringify({label,created_at:new Date().toISOString(),files:rows},null,2)+'\n',{flag:'wx'});
process.stdout.write(output);
