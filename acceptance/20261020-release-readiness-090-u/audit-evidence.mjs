import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';
const base=path.resolve('acceptance/20261020-release-readiness-090-u'),dir=path.join(base,'commands'),sha=b=>crypto.createHash('sha256').update(b).digest('hex'),commands=[],incomplete=[],native=[];
for(const name of fs.readdirSync(dir).sort()){
  const folder=path.join(dir,name);if(!fs.statSync(folder).isDirectory())continue;
  const resultFile=path.join(folder,'result.json');if(!fs.existsSync(resultFile)){incomplete.push({name,files:fs.readdirSync(folder).sort()});continue;}
  const result=JSON.parse(fs.readFileSync(resultFile)),out=fs.readFileSync(path.join(folder,'stdout.raw.txt')),err=fs.readFileSync(path.join(folder,'stderr.raw.txt'));
  commands.push({name,exit_code:result.exit_code,error:result.error??null,elapsed_ms:result.elapsed_ms,stdout_bytes:out.length,stderr_bytes:err.length,stdout_sha256:sha(out),stderr_sha256:sha(err),before_state_sha256:result.before_state_sha256??null,after_state_sha256:result.after_state_sha256??null});
  if(!name.includes('codex-'))continue;
  const parseErrors=[],events=out.toString('utf8').split(/\r?\n/).filter(Boolean).flatMap((line,i)=>{try{return[JSON.parse(line)];}catch(e){parseErrors.push({line:i+1,error:e.message});return[];}}),failed=[],notices=[],writes=[],preliminaryReads=[];
  for(const e of events){const x=e.item;if(!x)continue;
    if(x.type==='error')notices.push({id:x.id,type:e.type,message:x.message});
    if(e.type!=='item.completed')continue;
    if(x.type==='command_execution'&&x.exit_code!==0)failed.push({id:x.id,type:x.type,exit_code:x.exit_code,command:x.command,output_sha256:sha(Buffer.from(x.aggregated_output??''))});
    if(x.type==='mcp_tool_call'&&(x.error||x.status==='failed'))failed.push({id:x.id,type:x.type,server:x.server,tool:x.tool,error:x.error,status:x.status});
    if(x.type==='file_change'){writes.push(...(x.changes??[]).map(c=>({id:x.id,path:c.path,kind:c.kind,status:x.status})));if(x.status==='failed')failed.push({id:x.id,type:x.type,status:x.status});}
    if(x.type==='mcp_tool_call'&&x.tool==='read'&&x.arguments?.file_path?.replaceAll('\\','/').includes('/scenario/东岸末班船/'))preliminaryReads.push(x.arguments.file_path);
  }
  const thread=events.find(e=>e.type==='thread.started')?.thread_id??null;
  native.push({name,exit_code:result.exit_code,thread_id:thread,events:events.length,parse_errors:parseErrors,failures:failed,startup_notices:notices,file_changes:writes,observed_preliminary_work_reads:preliminaryReads});
}
const result={generated_at:new Date().toISOString(),scope:'captured-command-and-native-event-inventory-not-literary-acceptance',commands,nonzero:commands.filter(c=>c.exit_code!==0),incomplete_command_directories:incomplete,native,unique_native_thread_ids:[...new Set(native.map(n=>n.thread_id).filter(Boolean))]};
const target=path.join(base,'command-native-audit.json');fs.writeFileSync(target,JSON.stringify(result,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify({commands:commands.length,nonzero:result.nonzero.map(c=>({name:c.name,exit_code:c.exit_code})),incomplete:incomplete.map(x=>x.name),native:native.map(n=>({name:n.name,exit_code:n.exit_code,thread_id:n.thread_id,events:n.events,failures:n.failures.length,notices:n.startup_notices.length,changes:n.file_changes.length})),unique_threads:result.unique_native_thread_ids.length}));
