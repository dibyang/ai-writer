import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import assert from 'node:assert/strict';import {fileURLToPath} from 'node:url';
const here=path.dirname(fileURLToPath(import.meta.url)),sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const cli=[],native=[];
for(const label of fs.readdirSync(path.join(here,'cli-logs')).sort()){
 const dir=path.join(here,'cli-logs',label),file=path.join(dir,'result.json');if(!fs.existsSync(file))continue;
 const r=JSON.parse(fs.readFileSync(file));let code=null;
 for(const stream of ['stdout.txt','stderr.txt']){const out=path.join(dir,stream);if(fs.existsSync(out)){try{const o=JSON.parse(fs.readFileSync(out,'utf8'));code=o.error?.code??(typeof o.code==='string'?o.code:code);}catch{}}}
 cli.push({label,command:r.args?.[0],action:r.args?.[1],exit_code:r.exit_code,error_code:code,started_at:r.started_at,elapsed_ms:r.elapsed_ms,package_content_id:r.package_content_id,state_unchanged:r.before_state_sha256===r.after_state_sha256,result_sha256:sha(fs.readFileSync(file))});
}
for(const label of fs.readdirSync(path.join(here,'native')).sort()){
 const dir=path.join(here,'native',label),file=path.join(dir,'result.json');assert(fs.existsSync(file),`native still running: ${label}`);
 const r=JSON.parse(fs.readFileSync(file)),events=path.join(dir,'events.public.jsonl'),failed=[];let completed=0;
 if(fs.existsSync(events))for(const line of fs.readFileSync(events,'utf8').split(/\r?\n/).filter(Boolean)){
  const e=JSON.parse(line),i=e.item;if(e.type!=='item.completed'||i?.type!=='command_execution')continue;completed++;
  if(i.exit_code!==0)failed.push({item_id:i.id,exit_code:i.exit_code,status:i.status,note:'See exact command and output in referenced public event. CLI nested product exit code may differ from outer PowerShell exit.'});
 }
 native.push({label,thread_id:r.thread_id??null,exit_code:r.exit_code,elapsed_ms:r.elapsed_ms,completed_commands:completed,failed_commands:failed,events_ref:`native/${label}/events.public.jsonl`,events_sha256:fs.existsSync(events)?sha(fs.readFileSync(events)):null,result_sha256:sha(fs.readFileSync(file))});
}
const result={schema:'ac-command-audit-v1',at:new Date().toISOString(),cli_count:cli.length,cli_failures:cli.filter(x=>x.exit_code!==0),cli,native,note:'Mechanical inventory of preserved CLI and native public events. Nonzero includes expected safety refusals, operator/auxiliary mistakes and startup/environment failures; classification and fixes are in each handoff/controller record. Root orchestration tool errors outside native events are documented separately, not claimed exhaustively reconstructed here.'};
fs.writeFileSync(path.join(here,'command-audit-final.json'),JSON.stringify(result,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({ok:true,cli:cli.length,cli_nonzero:result.cli_failures.length,native:native.length,native_nonzero:native.filter(x=>x.exit_code!==0).length,failed_native_commands:native.reduce((n,x)=>n+x.failed_commands.length,0)}));
