import fs from 'node:fs';
import path from 'node:path';
const base='acceptance/20261016-hundred',label=process.argv[2],completedOnly=process.argv[3]==='--completed-only';
if(!/^[a-z0-9-]+$/.test(label??''))throw Error('Unique output label required');
const rows=[];
for(const phase of fs.readdirSync(base).filter(n=>/^(session-\d+[a-z]?|revision-[a-z][a-z0-9-]*)$/.test(n))){
 if(completedOnly){const result=path.join(base,phase,'process-result.json');if(!fs.existsSync(result)||JSON.parse(fs.readFileSync(result)).exit_code!==0)continue;}
 const index=path.join(base,phase,'commands/index.jsonl');if(!fs.existsSync(index))continue;
 for(const line of fs.readFileSync(index,'utf8').split(/\r?\n/).filter(Boolean)){
  const r=JSON.parse(line),command=r.argv?.[1];if(!['context','record-template'].includes(command))continue;
  const bytes=fs.readFileSync(r.exit_code===0?r.files.stdout:r.files.stderr),raw=bytes.toString('utf8');
  let parsed;try{parsed=JSON.parse(raw)}catch{}
  rows.push({phase,label:r.label,command,unit:r.argv.includes('--unit')?Number(r.argv[r.argv.indexOf('--unit')+1]):null,exit_code:r.exit_code,elapsed_ms:r.elapsed_ms,output_bytes:bytes.length,output_chars:raw.length,code:parsed?.code??null,error:parsed?.error??null,raw_path:r.exit_code===0?r.files.stdout:r.files.stderr});
 }
}
const successful=rows.filter(r=>r.exit_code===0),contexts=successful.filter(r=>r.command==='context');
const result={scope:'observed CLI outputs from shared command indexes only; not all commands, not a performance benchmark',completed_only:completedOnly,at:new Date().toISOString(),indexed_phases:[...new Set(rows.map(r=>r.phase))],count:rows.length,successful:successful.length,largest_context:contexts.toSorted((a,b)=>b.output_bytes-a.output_bytes)[0]??null,rows};
fs.mkdirSync(`${base}/scale-observations`,{recursive:true});fs.writeFileSync(`${base}/scale-observations/${label}.json`,JSON.stringify(result,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify({label,count:rows.length,successful:successful.length,largest_context:result.largest_context}));
