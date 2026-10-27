import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';
const here=path.dirname(fileURLToPath(import.meta.url)),projectFile=path.join(here,'project.json'),out={at:new Date().toISOString()};
if(fs.existsSync(projectFile)){
  const root=JSON.parse(fs.readFileSync(projectFile)).project,s=JSON.parse(fs.readFileSync(path.join(root,'.writer/state.json')));
  const count=text=>(text.split(/\r?\n/).filter(l=>!/^#{1,6}\s/.test(l)).join('\n').match(/\p{Script=Han}/gu)||[]).length;
  out.project={revision:s.revision,units:s.units.length,generation:s.tool_control.generation,new_units:s.units.filter(u=>u.unit>36).map(u=>({unit:u.unit,draft:u.draft,han:count(fs.readFileSync(path.join(root,u.draft),'utf8'))}))};
  const next=s.units.length+1,partsRoot=path.join(root,'分段'),directories=[];
  if(fs.existsSync(partsRoot))for(const item of fs.readdirSync(partsRoot,{withFileTypes:true})){
    if(!item.isDirectory()||!item.name.includes(String(next).padStart(4,'0')))continue;
    const files=[];function walk(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){const file=path.join(dir,entry.name);if(entry.isDirectory())walk(file);else if(entry.isFile()&&entry.name.endsWith('.md'))files.push(file);}}walk(path.join(partsRoot,item.name));
    directories.push({path:'分段/'+item.name,parts:files.length,han:files.reduce((n,file)=>n+count(fs.readFileSync(file,'utf8')),0)});
  }
  if(directories.length)out.partial={unit:next,directories,note:'Saved fragment totals per directory; unregistered and not literary completion'};
}
const native=path.join(here,'native');out.runs=[];if(fs.existsSync(native))for(const label of fs.readdirSync(native)){const dir=path.join(native,label),result=path.join(dir,'result.json'),events=path.join(dir,'events.public.jsonl'),run={label};if(fs.existsSync(result)){const r=JSON.parse(fs.readFileSync(result));Object.assign(run,{done:true,exit:r.exit_code,thread:r.thread_id,elapsed_ms:r.elapsed_ms,error:r.error});}else{const launch=JSON.parse(fs.readFileSync(path.join(dir,'launch.json')));Object.assign(run,{done:false,elapsed_ms:Date.now()-Date.parse(launch.started_at)});}if(fs.existsSync(events)){const rows=fs.readFileSync(events,'utf8').split(/\r?\n/).filter(Boolean).flatMap(t=>{try{return [JSON.parse(t)];}catch{return [];}});run.public_events=rows.length;run.thread??=rows.find(r=>r.type==='thread.started')?.thread_id??null;run.latest_type=rows.at(-1)?.type;const message=rows.filter(r=>r.item?.type==='agent_message').at(-1)?.item?.text;run.latest_message=message?.slice(-1400);const e=rows.filter(r=>r.type==='error'||r.type==='turn.failed').at(-1);if(e)run.last_error=e;}out.runs.push(run);}const reads=path.join(here,'read-pages');out.read_pages=fs.existsSync(reads)?fs.readdirSync(reads).length:0;fs.appendFileSync(path.join(here,'progress.jsonl'),JSON.stringify(out)+'\n');console.log(JSON.stringify(out,null,2));
