import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const A=path.dirname(fileURLToPath(import.meta.url)),j=p=>JSON.parse(fs.readFileSync(p));
for(const label of process.argv.slice(2)){
 const D=path.join(A,'native',label),launch=j(path.join(D,'launch.json')),file=path.join(D,'events.public.jsonl');
 const rows=fs.readFileSync(file,'utf8').split(/\r?\n/).filter(Boolean).flatMap(s=>{try{return[JSON.parse(s)];}catch{return[];}});
 const last=rows.filter(e=>e.type==='item.completed'&&e.item?.type==='agent_message').at(-1);
 const error=rows.filter(e=>e.type==='error'||e.item?.type==='error').at(-1);
 console.log(JSON.stringify({label,started_at:launch.started_at,last_output_at:fs.statSync(file).mtime.toISOString(),events:rows.length,last_event_type:rows.at(-1)?.type,last_item_type:rows.at(-1)?.item?.type,latest_error:error?.message??error?.item?.message??null,result:fs.existsSync(path.join(D,'result.json'))?j(path.join(D,'result.json')):null,latest_message:last?.item?.text??null}));
}
const P=j(path.join(A,'project.json')).project;
for(const root of [P,path.join(P,'.writer/revisions/31fd2de1-685b-40ca-bec9-012e23ecf4bf/workspace')]){
 const file=path.join(root,'.writer/state.json');if(!fs.existsSync(file))continue;const s=j(file);
 console.log(JSON.stringify({root,units:s.units.length,revision:s.revision,generation:s.tool_control?.generation,pending:Object.keys(s.impact_pending??{}).length}));
}
