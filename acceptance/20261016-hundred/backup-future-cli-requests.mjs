import fs from 'node:fs';
import crypto from 'node:crypto';
const base='acceptance/20261016-hundred',rows=[];
for(const n of [10,11,12,13]){
 const phase=`session-${n}`,dir=`${base}/${phase}`,source=`${dir}/request.md`,backup=`${dir}/request-before-cli-notes.md`;
 if(fs.existsSync(`${dir}/events.jsonl`)||fs.existsSync(backup))throw Error('Preserve started or already backed-up phase '+phase);
 const bytes=fs.readFileSync(source);fs.writeFileSync(backup,bytes,{flag:'wx'});
 rows.push({phase,source,backup,sha256:crypto.createHash('sha256').update(bytes).digest('hex')});
}
fs.writeFileSync(`${base}/future-cli-request-backups.json`,JSON.stringify({at:new Date().toISOString(),scope:'Exact unstarted requests before adding observed CLI-use lessons',rows},null,2)+'\n',{flag:'wx'});console.log(JSON.stringify({backed_up:rows.length}));
