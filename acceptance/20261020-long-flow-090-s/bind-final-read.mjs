import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';

const base = path.dirname(fileURLToPath(import.meta.url));
const before = JSON.parse(fs.readFileSync(path.join(base, 'final-read-before.json'), 'utf8'));
const work = before.project;
const native = 'C:/Users/admin/.codex/sessions/2026/10/20/rollout-2026-10-20T04-16-29-01a155ce-f6b7-78d2-b851-f8432b026c95.jsonl';
const sha = data => crypto.createHash('sha256').update(data).digest('hex');
const nativeBytes = fs.readFileSync(native);
const sourceLines = nativeBytes.toString('utf8').split('\n');
const rows = sourceLines.filter(Boolean).map((raw, index) => ({raw, line:index+1, item:JSON.parse(raw)}));
const outputs = new Map(rows.filter(r => r.item.type === 'response_item' && r.item.payload?.type === 'function_call_output').map(r => [r.item.payload.call_id, r]));
const calls = rows.filter(r => r.item.type === 'response_item' && r.item.payload?.type === 'function_call' && r.item.payload.namespace === 'mcp__fastctx' && r.item.payload.name === 'read');
const selected = new Map();
const assets = before.files.map(asset => {
  const absolute = path.resolve(work, asset.file);
  const reads = calls.filter(r => path.resolve(JSON.parse(r.item.payload.arguments).file_path) === absolute).map(call => {
    const out = outputs.get(call.item.payload.call_id);
    assert.ok(out, 'Native output missing');
    const content = out.item.payload.output;
    const text = typeof content === 'string' ? content : content.map(block => block.text || '').join('\n');
    const numbers = [...text.matchAll(/(?:^|\n)(\d+)\t/g)].map(m => Number(m[1]));
    assert.ok(numbers.length, 'No rendered original lines');
    selected.set(call.line, call.raw); selected.set(out.line, out.raw);
    return {tool:'mcp__fastctx.read', call_id:call.item.payload.call_id, arguments:JSON.parse(call.item.payload.arguments), actual_from:Math.min(...numbers), actual_to:Math.max(...numbers), result_complete:text.includes('(Complete:'), result_partial:text.includes('(Partial:'), native_call_line:call.line, native_output_line:out.line, rendered_output_sha256:sha(text), timestamp:call.item.timestamp};
  });
  assert.ok(reads.length, 'Not read: '+asset.file);
  const seen = new Set();
  for (const read of reads) for (let line=read.actual_from;line<=read.actual_to;line++) seen.add(line);
  for(let line=1;line<=asset.lines;line++) assert.ok(seen.has(line), `Unread line ${asset.file}:${line}`);
  const bytes = fs.readFileSync(absolute);
  assert.equal(sha(bytes), asset.sha256, 'Body changed: '+asset.file);
  const prose = bytes.toString('utf8').replace(/^#[^\n]*(?:\r?\n|$)/,'');
  return {...asset, han_including_title:asset.han, body_han:(prose.match(/\p{Script=Han}/gu)||[]).length, sha256_before:asset.sha256, sha256_after:sha(bytes), read_ranges:reads, full_original_read:true};
});
const after = {at:new Date().toISOString(), state_sha256:sha(fs.readFileSync(path.join(work,'.writer/state.json'))), files:assets.map(a=>({file:a.file,sha256:a.sha256_after}))};
assert.equal(before.state_sha256,after.state_sha256,'State changed during read');
const extracted=[...selected].sort((a,b)=>a[0]-b[0]);
const nativeToExtracted = new Map(extracted.map(([line],i)=>[line,i+1]));
const evidenceFile='final-read-tool-log.jsonl';
const evidenceBytes=Buffer.from(extracted.map(([,raw])=>raw).join('\n')+'\n');
for(const a of assets)for(const r of a.read_ranges){r.saved_call_line=nativeToExtracted.get(r.native_call_line);r.saved_output_line=nativeToExtracted.get(r.native_output_line);}
const binding={ok:true,nature:'informed-model-self-review; not human blind reading, market validation or hundred-chapter literary acceptance',session_id:'01a155ce-f6b7-78d2-b851-f8432b026c95',project:work,revision_at_read:53,tool_generation:3,tool_content_id:'730a9e3eaffd691e1ef902722513ba548821ce9f077b35a4ff43bb52e0dbfecc',before_file:'final-read-before.json',after_file:'final-read-after.json',state_sha256_before:before.state_sha256,state_sha256_after:after.state_sha256,all_18_bodies_unchanged:true,full_original_read_units:assets.map(a=>a.unit),total_original_lines:assets.reduce((n,a)=>n+a.lines,0),body_han:assets.reduce((n,a)=>n+a.body_han,0),native_log:{file:native,snapshot_sha256:sha(nativeBytes),snapshot_bytes:nativeBytes.length,note:'Live native log may append after this snapshot. Exact selected call/output records are preserved verbatim in the S evidence file, with original and saved line locators.'},saved_tool_log:{file:evidenceFile,sha256:sha(evidenceBytes),records:extracted.length},files:assets,limits:['Only正文/0001.md through 正文/0018.md are claimed as a full continuous manuscript read.','Supplementary ledger, inputs and reports are cited by actual read ranges; no claim of reading every backup or every old split draft.','Hash and segment checks establish byte identity, not literary quality.']};
for(const [name,value] of [['final-read-after.json',after],['final-read-binding.json',binding]]) fs.writeFileSync(path.join(base,name),JSON.stringify(value,null,2)+'\n',{flag:'wx'});
fs.writeFileSync(path.join(base,evidenceFile),evidenceBytes,{flag:'wx'});
console.log(JSON.stringify({ok:true,units:assets.length,lines:binding.total_original_lines,body_han:binding.body_han,records:extracted.length,unchanged:true}));
