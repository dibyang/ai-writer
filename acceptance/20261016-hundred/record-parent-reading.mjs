import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const [phase,...texts]=process.argv.slice(2),base='acceptance/20261016-hundred';
const audit=JSON.parse(fs.readFileSync(`${base}/audits/${phase}.json`));
const rows=texts.map(text=>{const unit=Number(text),item=audit.drafts.find(r=>r.unit===unit);if(!item)throw Error('No unit '+text);const file=`${base}/checkpoints/${phase}/files/${item.draft}`,bytes=fs.readFileSync(file),sha256=crypto.createHash('sha256').update(bytes).digest('hex');if(sha256!==item.sha256)throw Error('Frozen body drift');return{at:new Date().toISOString(),reader:'parent',phase,unit,path:path.resolve(file),sha256,range:'full file as returned by FastCtx read',purpose:'targeted semantic continuity review; hash records identity, not proof of reading'};});
fs.writeFileSync(`${base}/${phase}/parent-reading-followup.jsonl`,rows.map(r=>JSON.stringify(r)).join('\n')+'\n',{flag:'wx'});console.log(JSON.stringify({phase,recorded:rows.length}));
