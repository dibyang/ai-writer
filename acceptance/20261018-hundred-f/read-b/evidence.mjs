import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
const out=path.dirname(fileURLToPath(import.meta.url)), base=path.dirname(out), work=path.join(base,'work');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const write=(name,x)=>fs.writeFileSync(path.join(out,name),JSON.stringify(x,null,2)+'\n',{flag:'wx'});
function walk(root,rel=''){return fs.readdirSync(path.join(root,rel),{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(root,path.posix.join(rel,e.name)):[path.posix.join(rel,e.name)]).sort();}
function inventory(root,files){return files.map(file=>{const b=fs.readFileSync(path.join(root,file));return {file,bytes:b.length,sha256:sha(b)};});}
const mode=process.argv[2];
if(mode==='baseline'){
 const files=walk(work);write('baseline-inventory.json',{created_at:new Date().toISOString(),work,files:inventory(work,files)});
 const chapters=inventory(work,files.filter(f=>/^正文\//.test(f))).map(r=>{const s=fs.readFileSync(path.join(work,r.file),'utf8');let lines=s.split(/\r?\n/);if(lines.at(-1)==='')lines.pop();return {...r,unit:Number(path.basename(r.file).slice(0,4)),line_count:lines.length,max_line_chars:Math.max(...lines.map(s=>s.length)),han_characters:(s.match(/\p{Script=Han}/gu)||[]).length};});write('chapter-inventory.json',{chapters});
 fs.copyFileSync(path.join(work,'.writer/state.json'),path.join(out,'baseline-state.json'),fs.constants.COPYFILE_EXCL);
 console.log(JSON.stringify({files:files.length,chapters:chapters.length,state_sha256:sha(fs.readFileSync(path.join(work,'.writer/state.json')))}));
}
if(mode==='audit'){
 const inv=JSON.parse(fs.readFileSync(path.join(out,'chapter-inventory.json'))).chapters.filter(r=>r.unit>=21&&r.unit<=50).map(r=>({...r,line_count:fs.readFileSync(path.join(work,r.file),'utf8').split(/\r?\n/).length}));
 const events=fs.readFileSync(path.join(out,'events.jsonl'),'utf8').trim().split(/\r?\n/).map(x=>JSON.parse(x));
 const calls=events.filter(e=>e.type==='item.completed'&&e.item?.type==='mcp_tool_call'&&e.item.tool==='read');
 fs.mkdirSync(path.join(out,'read-raw'),{recursive:true});fs.mkdirSync(path.join(out,'versions'),{recursive:true});
 const rows=inv.map(row=>{const full=path.join(work,row.file),b=fs.readFileSync(full);if(sha(b)!==row.sha256)throw Error('Body drift');
  const lines=b.toString('utf8').split(/\r?\n/);let shown=new Set(),reads=[];
  for(const e of calls){let a=e.item.arguments;if(typeof a==='string'){try{a=JSON.parse(a)}catch{continue}}if(!a?.file_path||path.resolve(a.file_path)!==path.resolve(full))continue;
   const raw=e.item.result?.content?.filter(c=>c.type==='text').map(c=>c.text).join('\n')??'';
   const matched=[],mismatches=[];for(const l of raw.split(/\r?\n/)){const m=l.match(/^(\d+)\t(.*)$/);if(!m)continue;const n=Number(m[1]);if(lines[n-1]===m[2]){shown.add(n);matched.push(n)}else mismatches.push(n);}
   const name=`${String(row.unit).padStart(4,'0')}-${e.item.id}.fastctx.txt`;const rawPath=path.join(out,'read-raw',name);if(fs.existsSync(rawPath)){if(sha(fs.readFileSync(rawPath))!==sha(raw))throw Error('Raw changed');}else fs.writeFileSync(rawPath,raw,{flag:'wx'});reads.push({event_id:e.item.id,arguments:a,raw:'read-raw/'+name,raw_sha256:sha(raw),shown_lines:matched.length,first:matched[0],last:matched.at(-1),complete:/\(Complete:/.test(raw),mismatches});
  }
  const version='versions/'+row.sha256+'.md';if(fs.existsSync(path.join(out,version))){if(sha(fs.readFileSync(path.join(out,version)))!==sha(b))throw Error('Version changed');}else fs.writeFileSync(path.join(out,version),b,{flag:'wx'});
  const missing=lines.map((_,i)=>i+1).filter(n=>!shown.has(n));return {...row,absolute_path:full,coverage:[[1,row.line_count]],reads,missing_lines:missing,complete:missing.length===0&&reads.length>0&&reads.every(r=>r.mismatches.length===0),version};
 });write('read-tool-evidence-v2.json',{phase:'F-B',correction:'Include terminal empty line exactly as FastCtx displays it; initial audit preserved in read-tool-evidence.json. No source bytes or tool output changed.',basis:'Actual completed FastCtx MCP events, exact displayed lines compared with preserved original bytes; proves exposure only.',ok:rows.every(r=>r.complete),rows});console.log(JSON.stringify({ok:rows.every(r=>r.complete),chapters:rows.length,uncovered:rows.filter(r=>!r.complete).map(r=>r.unit)}));
}
if(mode==='readings'){
 const evidence=JSON.parse(fs.readFileSync(path.join(out,'read-tool-evidence-v2.json')));if(!evidence.ok)throw Error('Incomplete evidence');
 const notes=['21-25','26-30','31-35','36-40','41-45','46-50'].flatMap(r=>JSON.parse(fs.readFileSync(path.join(out,'notes-'+r+'.json'))));
 const chapters=notes.map(n=>{const r=evidence.rows.find(r=>r.unit===n.unit),s=fs.readFileSync(path.join(out,r.version),'utf8');if(!s.includes(n.quote))throw Error('Quote not in unit '+n.unit);for(const i of n.issues??[])if(!s.includes(i.quote))throw Error('Issue quote not in unit');return {...n,path:r.file,absolute_path:r.absolute_path,sha256:r.sha256,bytes:r.bytes,line_count:r.line_count,coverage:r.coverage,max_line_chars:r.max_line_chars,han_characters:r.han_characters,read_method:'FastCtx original full read, Complete. Additional 48 excerpt Partial was continued at 51 to Complete.',tool_evidence:r.reads,version:r.version};});
 const totals={chapters:chapters.length,boundary_reread:5,new_coverage:25,lines:chapters.reduce((s,r)=>s+r.line_count,0),han_characters_including_titles:chapters.reduce((s,r)=>s+r.han_characters,0),max_line_chars:Math.max(...chapters.map(r=>r.max_line_chars))};
 write('readings.json',{phase:'F-B',nature:'Informed model sequential full reading; not blind reading, human review, market validation or whole-book literary acceptance.',work,ordered_units:chapters.map(r=>r.unit),chapters,totals});console.log(JSON.stringify(totals));
}
if(mode==='final'){
 const baseline=JSON.parse(fs.readFileSync(path.join(out,'baseline-inventory.json')));const now=inventory(work,walk(work));const map=new Map(now.map(x=>[x.file,x]));const changed=baseline.files.filter(r=>!map.has(r.file)||map.get(r.file).sha256!==r.sha256);const before=new Set(baseline.files.map(r=>r.file));const added=now.filter(r=>!before.has(r.file));
 const orig=JSON.parse(fs.readFileSync(path.join(base,'original-inventory.json')));const sourceChanged=orig.files.filter(r=>{const p=path.join(orig.source,r.file);return !fs.existsSync(p)||sha(fs.readFileSync(p))!==r.sha256});
 const frozen=inventory(path.join(base,'sources/package'),walk(path.join(base,'sources/package')));
 const commands=fs.readdirSync(path.join(base,'commands')).filter(x=>x.startsWith('f-b-')).sort().map(label=>({label,...JSON.parse(fs.readFileSync(path.join(base,'commands',label,'result.json')))}));write('command-index.json',{commands});
 write('final-verification.json',{at:new Date().toISOString(),work,all_work_bytes_unchanged:changed.length===0&&added.length===0,changed,added,body_count:now.filter(r=>r.file.startsWith('正文/')).length,original_source:orig.source,original_files:orig.files.length,original_source_unchanged:sourceChanged.length===0,source_changed:sourceChanged,frozen_package:frozen,state_sha256:sha(fs.readFileSync(path.join(work,'.writer/state.json'))),commands:commands.length});console.log(JSON.stringify({changed:changed.map(r=>r.file),added:added.map(r=>r.file),original_changed:sourceChanged.length,commands:commands.length}));
}
