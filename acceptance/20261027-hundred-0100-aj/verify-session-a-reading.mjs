import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
const base=path.dirname(fileURLToPath(import.meta.url)),root=path.join(base,'work'),state=JSON.parse(fs.readFileSync(path.join(root,'.writer/state.json'))),events=fs.readFileSync(path.join(base,'session-a.jsonl'),'utf8').split('\n').filter(Boolean).map(x=>JSON.parse(x));
const wanted=[81,84,89,95,104,105,106,107,108,109,110,111,112],rows=[];
for(const unit of wanted){
  const row=state.units[unit-1],file=path.resolve(root,row.draft),body=fs.readFileSync(file),expected=body.toString('utf8').replace(/^\uFEFF/,'').split(/\r?\n/),matches=events.filter(e=>e.type==='item.completed'&&e.item?.type==='mcp_tool_call'&&e.item?.tool==='read'&&path.resolve(e.item.arguments?.file_path??'.')===file);
  let proof=null;
  for(const e of matches){const output=e.item.result?.content?.filter(x=>x.type==='text').map(x=>x.text).join('\n')??'',lines=[...output.matchAll(/^(\d+)\t(.*)$/gm)];if(output.includes('Complete:')&&lines.length===expected.length&&lines.every(x=>expected[Number(x[1])-1]===x[2])){proof={event_id:e.item.id,lines:lines.length};break;}}
  if(!proof)throw Error('Missing full matching read for chapter '+unit);const actual=crypto.createHash('sha256').update(body).digest('hex');if(actual!==row.sha256)throw Error('Body changed: '+unit);rows.push({unit,draft:row.draft,sha256:actual,...proof});
}
const start=events.find(e=>e.type==='thread.started'),end=events.find(e=>e.type==='turn.completed');if(!start||!end)throw Error('Codex session did not finish normally');const out={ok:true,thread_id:start.thread_id,units:wanted,reads:rows,all_source_lines_exposed:true,note:'Full-line exposure checked against current registered bytes; not a claim of comprehension or literary quality.'};fs.writeFileSync(path.join(base,'session-a-reading-verification.json'),JSON.stringify(out,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify({ok:true,thread_id:start.thread_id,units:wanted.length}));
