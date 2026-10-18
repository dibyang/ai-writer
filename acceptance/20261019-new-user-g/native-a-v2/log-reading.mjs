// Run only AFTER the model has read all output and written its own report.
import fs from 'node:fs';
import path from 'node:path';
const [label,report]=process.argv.slice(2);
const base=path.resolve('acceptance/20261019-new-user-g/native-a-v2');
if(!fs.existsSync(report))throw Error('Report missing');
const manifest=JSON.parse(fs.readFileSync(path.join(base,'read-outputs',label+'.manifest.json'),'utf8'));
const file=path.join(base,'readings.json');
const all=fs.existsSync(file)?JSON.parse(fs.readFileSync(file,'utf8')):{schema_version:1,reader:'same Codex primary agent; informed self-review; no human or isolated blind reader',note:'Entries declare reading; original full command outputs and frozen bytes provide an audit comparison, not independent proof of understanding.',readings:[]};
if(all.readings.some(x=>x.read_id===label))throw Error('duplicate read');
all.readings.push({read_id:label,output_at:manifest.created_at,logged_after_report_at:new Date().toISOString(),files:manifest.files,report:path.resolve(report),raw_output:path.join(base,'read-outputs',label+'.txt'),purpose:label.startsWith('self')?'complete single-chapter self-review':'complete consecutive 1–3 reread'});
fs.writeFileSync(file,JSON.stringify(all,null,2)+'\n');
console.log(JSON.stringify({read_id:label,files:manifest.files.length,report:path.resolve(report)}));
