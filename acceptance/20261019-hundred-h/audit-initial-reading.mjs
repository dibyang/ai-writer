import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';

const base=path.dirname(fileURLToPath(import.meta.url));
const json=ref=>JSON.parse(fs.readFileSync(path.join(base,ref)));
const hash=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const baseline=json('baseline-state.bin');
assert.equal(baseline.units.length,106);
const ranges=[['read-a-recover',1,27],['read-b',23,54],['read-c',50,81],['read-d',77,106]];
const coverage=new Map(),processes=[],threadIds=new Set();
for(const [phase,from,to] of ranges){
  const parent=json(phase+'/parent-verification-v1.json');
  const proc=json(phase+'/process-result.json');
  const proof=json(parent.reading_proof);
  assert.equal(proc.exit_code,0,phase);
  assert.equal(hash(fs.readFileSync(path.join(base,phase,'request.raw.md'))),proc.request_sha256);
  assert.equal(parent.ok,true);assert.equal(proof.ok,true);
  assert.equal(parent.from,from);assert.equal(parent.to,to);
  assert.equal(parent.units_unchanged,106);assert.equal(parent.snapshot_unchanged,true);
  assert.equal(parent.source_versions_and_ranges_unchanged,true);
  assert.equal(proof.rows.length,to-from+1);
  const events=fs.readFileSync(path.join(base,phase,'events.jsonl'),'utf8').trim().split(/\r?\n/).map(line=>JSON.parse(line));
  const thread=events.find(event=>event.type==='thread.started')?.thread_id;
  assert.ok(thread,'Missing real thread.started '+phase);assert.ok(!threadIds.has(thread),'Duplicate model thread');threadIds.add(thread);
  for(const row of proof.rows){
    assert.ok(row.unit>=from&&row.unit<=to);assert.equal(row.full_matching_line_coverage,true);
    assert.deepEqual(row.missing_lines,[]);assert.equal(row.sha256,baseline.units[row.unit-1].sha256);
    assert.ok(row.reads.some(read=>read.full_file_in_event));
    const item=coverage.get(row.unit)??{unit:row.unit,sha256:row.sha256,phases:[]};
    assert.ok(!item.phases.includes(phase));item.phases.push(phase);coverage.set(row.unit,item);
  }
  processes.push({phase,from,to,thread_id:thread,exit_code:proc.exit_code,elapsed_s:proc.elapsed_s,request_sha256:proc.request_sha256,parent_proof:phase+'/parent-verification-v1.json',actual_text_proof:parent.reading_proof,installed_version:parent.installed_version,generation:parent.generation});
}
assert.equal(coverage.size,106);for(let unit=1;unit<=106;unit++)assert.ok(coverage.has(unit));
const interrupted=json('read-a-update/process-result.json');assert.equal(interrupted.exit_code,1);
const result={ok:true,created_at:new Date().toISOString(),unique_original_chapters:coverage.size,successful_independent_model_processes:processes.length,successful_phase_chapter_exposures:processes.reduce((sum,item)=>sum+item.to-item.from+1,0),processes,coverage:[...coverage.values()].sort((a,b)=>a.unit-b.unit),interrupted_attempt:{phase:'read-a-update',exit_code:1,reason:'Selected model is at capacity; original logs retained, excluded from successful stages'},scope:'Exact current baseline text was displayed in full to four independent successful Codex CLI processes. These byte/line and process checks do not establish comprehension, literary quality, human blind reading, market validation, or completion of later draft/revision stages.'};
fs.writeFileSync(path.join(base,'initial-reading-coverage.json'),JSON.stringify(result,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({ok:true,unique_chapters:106,independent_processes:4,phase_chapter_exposures:result.successful_phase_chapter_exposures}));
