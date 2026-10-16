import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const base='acceptance/20261016-hundred',stage=`${base}/final-review`,work=`${base}/works/潮汐信号`;
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const start=read(`${base}/checkpoints/session-13/files/.writer/state.json`),current=read(`${work}/.writer/state.json`);
const rows=fs.readFileSync(`${stage}/reading.jsonl`,'utf8').split(/\r?\n/).filter(Boolean).map(JSON.parse);
const complete=[],partial=[],changedSinceStart=[],missing=[],empty=[];
for(const u of start.units){
 const file=path.join(work,u.draft);if(!fs.existsSync(file)){missing.push(u.unit);continue;}
 const hash=sha(file),lines=fs.readFileSync(file,'utf8').split(/\r?\n/);if(lines.at(-1)==='')lines.pop();
 if(hash!==u.sha256)changedSinceStart.push(u.unit);
 const cover=Array(lines.length).fill(false);
 for(const r of rows.filter(r=>r.path===u.draft&&r.sha256===hash&&r.total_lines===lines.length)){
  if(r.from>r.to){empty.push({unit:u.unit,from:r.from,to:r.to});continue;}
  for(let n=Math.max(1,r.from);n<=Math.min(r.to,lines.length);n++)cover[n-1]=true;
 }
 if(cover.every(Boolean))complete.push(u.unit);else if(cover.some(Boolean))partial.push({unit:u.unit,covered:cover.filter(Boolean).length,total:lines.length});
}
console.log(JSON.stringify({at:new Date().toISOString(),scope:'Read-only index coverage monitor; completed native return and semantic checks remain separate final proofs',registered:current.units.length,revision:current.revision,covered_current_body_versions:complete.length,complete_units:complete,partial,changed_since_start:changedSinceStart,missing,empty_ranges_not_counted:empty.length,last_ranges:rows.filter(r=>r.path?.startsWith('正文/')).slice(-4).map(({path,from,to,total_lines})=>({path,from,to,total_lines}))}));
