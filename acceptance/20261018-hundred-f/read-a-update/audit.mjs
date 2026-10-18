import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
const stage=path.dirname(fileURLToPath(import.meta.url)),base=path.dirname(stage),work=path.join(base,'work'),sha=x=>crypto.createHash('sha256').update(x).digest('hex');
const write=(name,x)=>fs.writeFileSync(path.join(stage,name),JSON.stringify(x,null,2)+'\n',{flag:'wx'});
const mode=process.argv[2];
if(mode==='reading-evidence'){
 const events=fs.readFileSync(path.join(stage,'events.jsonl'),'utf8').split(/\r?\n/).filter(Boolean).map(x=>JSON.parse(x));
 const readings=JSON.parse(fs.readFileSync(path.join(stage,'readings.json')));fs.mkdirSync(path.join(stage,'read-raw'),{recursive:true});const evidence=[];
 for(const n of readings.chapters){
  const event=events.find(e=>e.type==='item.completed'&&e.item?.type==='mcp_tool_call'&&e.item.tool==='read'&&e.item.arguments?.file_path===n.absolute_path&&e.item.result?.content?.some(c=>c.text?.includes('(Complete: reached end of file;')));
  if(!event)throw Error('missing real tool event '+n.unit);
  const raw=event.item.result.content.filter(c=>c.type==='text').map(c=>c.text).join('\n'),cover=raw.match(/Complete: reached end of file; lines (\d+)-(\d+) of (\d+) shown/);
  const actual=fs.readFileSync(n.absolute_path,'utf8').split(/\r?\n/),shown=raw.split('\n').filter(l=>/^\d+\t/.test(l));
  const mismatches=shown.flatMap(l=>{const m=l.match(/^(\d+)\t(.*)$/);return actual[Number(m[1])-1]===m[2]?[]:[Number(m[1])];});
  if(!cover||Number(cover[1])!==1||Number(cover[2])!==actual.length||Number(cover[3])!==actual.length||shown.length!==actual.length||mismatches.length||raw.includes('[line truncated'))throw Error('incomplete '+n.unit);
  const rel='read-raw/'+String(n.unit).padStart(4,'0')+'.fastctx.txt';fs.writeFileSync(path.join(stage,rel),raw,{flag:'wx'});
  n.tool_evidence={event_item_id:event.item.id,raw:rel,raw_sha256:sha(raw),result:'Complete',shown_line_count:shown.length,source_line_mismatches:mismatches};
  n.han_characters=(actual.join('\n').match(/\p{Script=Han}/gu)??[]).length;
  evidence.push({unit:n.unit,...n.tool_evidence});
 }
 readings.totals={chapters:readings.chapters.length,lines:readings.chapters.reduce((s,n)=>s+n.line_count,0),han_characters_including_titles:readings.chapters.reduce((s,n)=>s+n.han_characters,0),max_line_chars:Math.max(...readings.chapters.map(n=>n.max_line_chars))};
 fs.writeFileSync(path.join(stage,'readings.json'),JSON.stringify(readings,null,2)+'\n');write('read-tool-evidence.json',{audit:'verifies saved actual FastCtx results against exact current bytes; does not replace model reading',records:evidence,totals:readings.totals});console.log(JSON.stringify(readings.totals));
}
if(mode==='final-audit'){
 const before=JSON.parse(fs.readFileSync(path.join(stage,'before-update-state.json'))),current=JSON.parse(fs.readFileSync(path.join(work,'.writer/state.json'))),baseline=JSON.parse(fs.readFileSync(path.join(stage,'baseline-inventory.json'))),readings=JSON.parse(fs.readFileSync(path.join(stage,'readings.json'))),plan=JSON.parse(fs.readFileSync(path.join(base,'commands/f-a-006-plan/stdout.raw.txt')));
 const source=plan.source.files.map(r=>{const rel=r.group==='skills'?'.agents/skills/'+r.file:r.file;return {path:rel,expected:r.sha256,actual:sha(fs.readFileSync(path.join(base,'sources/package',rel)))}});
 const rootChanges=Object.keys(baseline.files).filter(f=>!fs.existsSync(path.join(work,f))||sha(fs.readFileSync(path.join(work,f)))!==baseline.files[f]);
 const unitsources=s=>s.units.map(u=>({unit:u.unit,source_hashes:u.source_hashes}));
 const unit_hash_checks=readings.chapters.map(n=>({unit:n.unit,read_sha256:n.sha256,current_sha256:sha(fs.readFileSync(n.absolute_path)),baseline_sha256:baseline.files[n.path]}));
 const commands=fs.readdirSync(path.join(base,'commands')).filter(x=>x.startsWith('f-a-')).sort().map(label=>{const dir=path.join(base,'commands',label),r=JSON.parse(fs.readFileSync(path.join(dir,'result.json')));return {label,...r,stdout_sha256:sha(fs.readFileSync(path.join(dir,'stdout.raw.txt'))),stderr_sha256:sha(fs.readFileSync(path.join(dir,'stderr.raw.txt')))}});
 const inv=JSON.parse(fs.readFileSync(path.join(base,'original-inventory.json')));const volumeIndex=fs.readdirSync(path.join(work,'大纲/分卷')).map(f=>{const v=JSON.parse(fs.readFileSync(path.join(work,'大纲/分卷',f)));return {path:'大纲/分卷/'+f,id:v.id,title:v.title,from:v.start,to:v.end,arcs:v.arcs}}).sort((a,b)=>a.from-b.from);
 const result={at:new Date().toISOString(),process_thread_id:'01a14e81-acf0-7d03-b2b4-87b03a688edd',evidence_log_created_at:fs.statSync(path.join(stage,'events.jsonl')).birthtime.toISOString(),phase_elapsed_ms_from_log_creation:Date.now()-fs.statSync(path.join(stage,'events.jsonl')).birthtimeMs,product_first_command_at:commands[0].started_at,revision:current.revision,schema:current.schema_version,generation:current.tool_control.generation,build_id:current.tool_control.installed.source_content_id,runtime_id:current.tool_control.installed.runtime_id,body_count:fs.readdirSync(path.join(work,'正文')).filter(x=>x.endsWith('.md')).length,state_changed_keys:Object.keys({...before,...current}).filter(k=>JSON.stringify(before[k])!==JSON.stringify(current[k])),units_unchanged:JSON.stringify(before.units)===JSON.stringify(current.units),snapshot_unchanged:JSON.stringify(before.snapshot)===JSON.stringify(current.snapshot),unit_source_hashes_unchanged:JSON.stringify(unitsources(before))===JSON.stringify(unitsources(current)),unit_source_hashes_count:unitsources(current).filter(x=>x.source_hashes).length,root_file_changes:rootChanges,source_file_count:source.length,source_mismatches:source.filter(x=>x.actual!==x.expected),read_sha_mismatches:unit_hash_checks.filter(x=>new Set([x.read_sha256,x.current_sha256,x.baseline_sha256]).size!==1),readings_totals:readings.totals,environment_overrides:[],environment_note:'本阶段未设置环境覆盖；继承本进程环境，未枚举或导出秘密环境变量。',commands_count:commands.length,failed_commands:commands.filter(x=>x.exit_code!==0).map(x=>({label:x.label,exit_code:x.exit_code})),registered_new_review:false,review_registration_reason:'本阶段仅保存campaign报告与实读断点；不为已有rolling_review绿灯重复登记，保留仅revision/tool_control变化的更新对照。未创建chapter_functions或声称旧报告为本次阅读。',original_inventory_keys:Object.keys(inv),volume_index:volumeIndex};
 write('command-index.json',commands);write('final-audit.json',result);write('final-source-inventory.json',source);console.log(JSON.stringify({...result,volume_index:undefined}));
}
if(mode==='delivery-check'){
 const h=JSON.parse(fs.readFileSync(path.join(stage,'handoff.json'))),r=JSON.parse(fs.readFileSync(path.join(stage,'readings.json'))),old=JSON.parse(fs.readFileSync(path.join(stage,'baseline-inventory.json'))),source=JSON.parse(fs.readFileSync(path.join(stage,'final-source-inventory.json'))),state=fs.readFileSync(path.join(work,'.writer/state.json'));
 const rootDrift=Object.entries(old.files).filter(([f,hash])=>!fs.existsSync(path.join(work,f))||sha(fs.readFileSync(path.join(work,f)))!==hash).map(([f])=>f);
 const sourceDrift=source.filter(x=>sha(fs.readFileSync(path.join(base,'sources/package',x.path)))!==x.expected).map(x=>x.path);
 const required=['handoff.md','handoff.json','review.md','readings.json','read-tool-evidence.json','final-audit.json','final-verification-state.json','before-update-state.json','after-update-state.json','failures.json','command-index.json','engineering-report.json'];
 const result={completed_at:new Date().toISOString(),elapsed_ms:Date.now()-fs.statSync(path.join(stage,'events.jsonl')).birthtimeMs,state_matches_handoff:sha(state)===h.state_sha256,root_drift:rootDrift,frozen_source_drift:sourceDrift,read_units:r.ordered_units,full_read_count:r.chapters.length,missing_files:required.filter(f=>!fs.existsSync(path.join(stage,f))),raw_read_count:fs.readdirSync(path.join(stage,'read-raw')).length,checkpoint_count:fs.readdirSync(path.join(stage,'checkpoints')).length,check_evidence:'../commands/f-a-018-final-check/stdout.raw.txt',new_review_registered:false};
 result.ok=result.state_matches_handoff&&!rootDrift.length&&!sourceDrift.length&&!result.missing_files.length&&result.full_read_count===25&&result.raw_read_count===25&&result.checkpoint_count===25;
 write('delivery-verification.json',result);console.log(JSON.stringify(result));if(!result.ok)process.exitCode=1;
}
