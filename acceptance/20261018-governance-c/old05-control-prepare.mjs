import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {BASE,sha,write} from './cli-support.mjs';
import {safe} from '../../lib/workspace.mjs';
const copy=JSON.parse(fs.readFileSync(path.join(BASE,'scale-hundred/copy-manifest.json'))),root=path.join(BASE,'scale-hundred/old05-control');
assert.equal(fs.existsSync(root),false);fs.mkdirSync(root,{recursive:true});
for(const row of copy.files){const bytes=fs.readFileSync(safe(copy.origin,row.file));assert.equal(sha(bytes),row.sha256,row.file);const target=path.join(root,row.file);fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,bytes,{flag:'wx'});}
const original=JSON.parse(fs.readFileSync(path.join(root,'.writer/state.json'))),last=original.units[99],exe=path.join(BASE,'fixtures/tool-0.5/bin/ai-writer.mjs'),rows=[];
function run(label,args){const cap=spawnSync(process.execPath,[path.join(BASE,'capture.mjs'),label,process.execPath,exe,...args,'--project',root],{encoding:'utf8',windowsHide:true,maxBuffer:8*1024*1024});const meta=JSON.parse(fs.readFileSync(path.join(BASE,'commands',label,'result.json')));assert.equal(meta.exit_code,0,cap.stderr);rows.push({label,elapsed_ms:meta.elapsed_ms,guard:meta.build_before?.runtime_guard_id});return JSON.parse(fs.readFileSync(path.join(BASE,'commands',label,'stdout.raw.txt')));}
run('old05-control-rewind',['rewind','--from','100','--expected-revision',String(original.revision)]);
const samples=[];for(let i=1;i<=3;i++){const t=run(`old05-control-template-${i}`,['record-template','--unit','100','--draft',last.draft]);samples.push({sample:i,elapsed_ms:rows.at(-1).elapsed_ms,input_bytes:Buffer.byteLength(JSON.stringify(t)),summary_chars:t.summary.length,character_updates:Object.keys(t.changes.characters).length,timeline_entries:t.changes.timeline_append.length,ledger_updates:Object.keys(t.changes.ledger).length});}
assert.equal(JSON.parse(fs.readFileSync(path.join(root,'.writer/state.json'))).units.length,99);
for(const u of original.units)assert.equal(sha(fs.readFileSync(path.join(root,u.draft))),u.sha256);
write(path.join(BASE,'scale-hundred/old05-comparison.json'),{scope:'Actual frozen 0.5 runtime on independent schema2 control, same original book and unit100, real rewind to99; not original work and not literary reading',root,source_commit:'832581720f4d6d6c99780390812218e215167822',copied_files:copy.file_count,copied_bytes:copy.bytes,original_state_sha256:copy.state_sha256,all_100_bodies_unchanged:true,samples,rows,caveat:'Old record-template already auto-fills paths/hashes and uses changes. Do not count those as new C gains; C only additionally restores prior semantic input for actual rereview. Fresh-process costs are observational, not manual-time or speedup evidence.'});
console.log(JSON.stringify({ok:true,calls:rows.length,samples:samples.length,body_changes:0,scope:'old workflow control only'}));
