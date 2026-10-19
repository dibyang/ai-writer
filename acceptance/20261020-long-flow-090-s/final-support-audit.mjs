import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const base=path.dirname(fileURLToPath(import.meta.url)), work=path.join(base,'scenario/雨棚后的灯');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const read=f=>fs.readFileSync(path.join(base,f));
const json=f=>JSON.parse(read(f));
const state=JSON.parse(fs.readFileSync(path.join(work,'.writer/state.json')));
const write=(f,v)=>fs.writeFileSync(path.join(base,f),JSON.stringify(v,null,2)+'\n',{flag:'wx'});
assert.equal(state.revision,53);assert.equal(state.units.length,18);assert.equal(state.tool_control.generation,3);
const binding=json('final-read-binding.json');
for(const f of binding.files)assert.equal(sha(fs.readFileSync(path.join(work,f.file))),f.sha256_before);
const directories={4:'0004-r1',7:'0007',8:'0008-r1',9:'0009',10:'0010-r2',11:'0011',12:'0012',13:'0013',14:'0014',15:'0015-r5',16:'0016-r6',17:'0017-r6',18:'0018-r6'};
const segments=state.units.map(u=>{
  if(!directories[u.unit])return {unit:u.unit,source:'registered正文 only; no current 分段 mapping asserted',body_sha256:u.sha256};
  const dir='分段/'+directories[u.unit],files=fs.readdirSync(path.join(work,dir)).filter(x=>/^part-\d+\.md$/.test(x)).sort();
  const contents=files.map(f=>fs.readFileSync(path.join(work,dir,f),'utf8'));
  assert.equal(sha(contents.join('\n\n')),u.sha256,'Assembly mismatch '+u.unit);
  assert.equal(files.length,[7,13].includes(u.unit)?5:3);
  let offset=1;
  const parts=files.map((f,i)=>{const lines=contents[i].split('\n').length;const row={file:dir+'/'+f,sha256:sha(contents[i]),body_from:offset,body_to:offset+lines-1};offset+=lines+1;return row;});
  return {unit:u.unit,directory:dir,body_sha256:u.sha256,exact_assembly:true,parts};
});
const planValues=json('plans.json');
const plans=Array.from({length:18},(_,i)=>{
  const file='大纲/单元/'+String(i+1).padStart(4,'0')+'.json',bytes=fs.readFileSync(path.join(work,file)),p=JSON.parse(bytes),ref=planValues.find(x=>x.unit===i+1);
  if(ref)for(const key of ['title','goal','change','beats'])assert.deepEqual(p[key],ref[key],`${file}:${key}`);
  assert.equal(state.units[i].source_hashes[file],sha(bytes));
  return {unit:i+1,file,sha256:sha(bytes),source_bound:true,goal:p.goal,change:p.change,beats:p.beats,forbidden:p.forbidden};
});
let evidenceCount=0;const evidenceErrors=[];
for(const [id,item]of Object.entries(state.snapshot.ledger))for(const e of item.evidence||[]){
  evidenceCount++;
  const bytes=fs.readFileSync(path.join(work,e.draft)),text=bytes.toString('utf8');
  if(sha(bytes)!==e.sha256||!text.includes(e.quote)||!text.split(/\r?\n/)[e.line-1]?.includes(e.quote))evidenceErrors.push({id,e});
}
assert.deepEqual(evidenceErrors,[]);
const old=json('commands/r6-begin/before-state.json');
const stripEvidence=s=>{const copy=structuredClone(s);for(const row of Object.values(copy.ledger))for(const e of row.evidence||[])delete e.sha256;return copy;};
assert.deepEqual(stripEvidence(state.snapshot),stripEvidence(old.snapshot));
const immutable=Object.entries(old.snapshot.ledger).map(([id,v])=>{for(const k of ['type','statement','author_truth'])assert.deepEqual(state.snapshot.ledger[id][k],v[k]);return id;});
const metadata=['codex-a-native','codex-a-resume','codex-c-first','codex-c-resume','codex-c-resume-after-r4'].map(label=>({label,...json('commands/'+label+'/result.json')}));
const firstThread=label=>JSON.parse(read('commands/'+label+'/stdout.raw.txt').toString('utf8').split('\n')[0]).thread_id;
assert.equal(firstThread('codex-a-native'),metadata[1].args.at(-2));
assert.equal(firstThread('codex-c-first'),metadata[3].args.at(-2));
assert.equal(metadata[3].args.at(-2),metadata[4].args.at(-2));
const processPairs=[[metadata[0],metadata[1]],[metadata[2],metadata[3]],[metadata[3],metadata[4]]].map(([a,b])=>{
  const end=new Date(Date.parse(a.started_at)+a.elapsed_ms).toISOString();
  assert.equal(a.exit_code,0);assert.equal(b.exit_code,0);assert.ok(Date.parse(end)<Date.parse(b.started_at));
  return {first:a.label,resume:b.label,exit_code:a.exit_code,ended_at:end,resumed_at:b.started_at,thread_id:b.args.at(-2),result_files:['commands/'+a.label+'/result.json','commands/'+b.label+'/result.json']};
});
const cNative='C:/Users/admin/.codex/sessions/2026/10/20/rollout-2026-10-20T02-04-25-01a15556-0cb4-7823-a277-367ce8b8f139.jsonl';
const cBytes=fs.readFileSync(cNative),cRows=cBytes.toString('utf8').split('\n').filter(Boolean).map((s,i)=>({line:i+1,item:JSON.parse(s)}));
const cLocators=[410,417,422,427,479,521,543,1001,1059].map(line=>{const r=cRows[line-1];assert.equal(r.line,line);const x=r.item.payload;return {native_line:line,timestamp:r.item.timestamp,call_id:x.call_id,name:x.name,namespace:x.namespace,record_sha256:sha(JSON.stringify(r.item)),purpose:({410:'fresh13 context/template acquisition',417:'fresh13 context read 1',422:'fresh13 context read 2',427:'fresh13 template read',479:'pre-continuation recovery report',521:'first13 continuation composition',543:'write13 continuation parts',1001:'fresh15 context/template acquisition after R4',1059:'pre15 recovery report'})[line]};});
assert.ok(cLocators.find(x=>x.native_line===427).timestamp<cLocators.find(x=>x.native_line===521).timestamp);
for(const f of ['c-context-13-after-update','c-template-13-after-update','c-after-r4-context-15','c-after-r4-template-15'])assert.equal(json('commands/'+f+'/result.json').exit_code,0);
const forbiddens=[];
for(const u of state.units){const t=fs.readFileSync(path.join(work,u.draft),'utf8');if(/SHA-?256|哈希|generation|snapshot|ledger|record-template|ACTION_OUT_OF_SCOPE|T_CURTAIN_RETURN|O_SHORT_DRAFT/.test(t))forbiddens.push(u.draft);}
assert.deepEqual(forbiddens,[]);
write('final-support-verification.json',{ok:true,revision:53,registered:18,plans,segments,evidence_count:evidenceCount,evidence_errors:evidenceErrors,body_hashes_match_read_binding:true,r6_snapshot_equal_except_evidence_sha256:true,immutable_ids_unchanged_since_pre_r6:immutable,process_pairs:processPairs,c_native_log:{file:cNative,sha256:sha(cBytes),locators:cLocators},forbidden_tool_terms_found:forbiddens,note:'Mechanical source, byte, process and quotation checks only. Literary conclusions depend on actual manuscript reading.'});
const native='C:/Users/admin/.codex/sessions/2026/10/20/rollout-2026-10-20T04-16-29-01a155ce-f6b7-78d2-b851-f8432b026c95.jsonl';
const raw=fs.readFileSync(native,'utf8').split('\n');const events=raw.filter(Boolean).map((s,i)=>({raw:s,line:i+1,item:JSON.parse(s)}));
const outMap=new Map(events.filter(r=>r.item.type==='response_item'&&r.item.payload?.type==='function_call_output').map(r=>[r.item.payload.call_id,r]));
const support=[];const records=[];
for(const r of events){const p=r.item.payload;if(r.item.type!=='response_item'||p?.type!=='function_call'||p.namespace!=='mcp__fastctx'||p.name!=='read')continue;const args=JSON.parse(p.arguments);if(!path.resolve(args.file_path).startsWith(base)||/[/\\]正文[/\\]\d{4}\.md$/.test(args.file_path))continue;const o=outMap.get(p.call_id);if(!o)continue;const blocks=o.item.payload.output;const t=typeof blocks==='string'?blocks:blocks.map(b=>b.text||'').join('\n');const numbers=[...t.matchAll(/(?:^|\n)(\d+)\t/g)].map(m=>Number(m[1]));if(!numbers.length)continue;support.push({file:args.file_path,actual_from:Math.min(...numbers),actual_to:Math.max(...numbers),complete:t.includes('(Complete:'),native_call_line:r.line,native_output_line:o.line,call_id:p.call_id});records.push(r,o);}
const unique=[...new Map(records.map(r=>[r.line,r])).values()].sort((a,b)=>a.line-b.line);const saved=unique.map(r=>r.raw).join('\n')+'\n';fs.writeFileSync(path.join(base,'final-support-tool-log.jsonl'),saved,{flag:'wx'});
write('final-support-read-binding.json',{native_log:native,saved_tool_log:'final-support-tool-log.jsonl',saved_tool_log_sha256:sha(saved),reads:support,note:'These are only the actual supplementary file ranges rendered to this client. Partial supplementary reads are not claimed as complete files; only the main manuscript has full18 coverage.'});
console.log(JSON.stringify({ok:true,plans:plans.length,segments:segments.filter(s=>s.exact_assembly).length,evidence_count:evidenceCount,supplementary_reads:support.length,process_pairs:processPairs.length}));
