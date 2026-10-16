import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

// Mechanical return/line coverage proof only. Attention and literary judgment
// require the actual model notes and the parent's semantic review as well.
const base=path.resolve('acceptance/20261016-hundred');
const phase=path.join(base,'final-review');
const frozen=path.join(base,'checkpoints/final-review/files');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const output=path.join(base,'final-reading-proof.json');
assert(!fs.existsSync(output),'Preserve the original proof');
assert.equal(read(path.join(phase,'process-result.json')).exit_code,0);
const audit=read(path.join(base,'audits/final-review.json'));
assert(audit.ok&&audit.units===100,'Final independent audit must complete first');
const state=read(path.join(frozen,'.writer/state.json'));
assert.equal(state.units.length,100);
const rows=fs.readFileSync(path.join(phase,'reading.jsonl'),'utf8').split(/\r?\n/).filter(Boolean).map(JSON.parse);
const commandRows=fs.readFileSync(path.join(phase,'commands/index.jsonl'),'utf8').split(/\r?\n/).filter(Boolean).map(JSON.parse);
const events=fs.readFileSync(path.join(phase,'events.jsonl'),'utf8').split(/\r?\n/).filter(Boolean).map(JSON.parse);
const returns=events.filter(e=>e.type==='item.completed'&&e.item?.type==='command_execution'&&e.item.exit_code===0&&e.item.status==='completed').map(e=>e.item);
const oldVersions=[],emptyRanges=[],proof=[];
for(const unit of state.units){
  const file=path.join(frozen,unit.draft);
  assert.equal(hash(file),unit.sha256,unit.draft);
  const lines=fs.readFileSync(file,'utf8').split(/\r?\n/);if(lines.at(-1)==='')lines.pop();
  const covered=Array(lines.length).fill(false),chunks=[];
  for(const row of rows.filter(r=>r.path===unit.draft)){
    if(row.sha256!==unit.sha256){oldVersions.push({unit:unit.unit,sha256:row.sha256,from:row.from,to:row.to});continue;}
    assert.equal(row.total_lines,lines.length,`${unit.unit}: total lines`);
    const meta=read(row.raw_command);
    assert.equal(meta.exit_code,0);
    assert.equal(path.resolve(meta.files.stdout),path.resolve(row.raw_stdout));
    assert.equal(path.resolve(meta.files.stderr),path.resolve(row.raw_stderr));
    assert.deepEqual(meta.argv,row.argv);
    const raw=fs.readFileSync(row.raw_stdout,'utf8').replace(/^\uFEFF/,'');
    const first=JSON.parse(raw.split(/\r?\n/)[0]);
    for(const key of ['path','sha256','from','to','total_lines'])assert.equal(first[key],row[key],`${unit.unit}/${key}`);
    let seen=returns.find(e=>e.aggregated_output?.includes(row.raw_command)&&e.aggregated_output.includes(raw.trimEnd()));
    let visibility={mode:'direct',returned_command_metadata:row.raw_command};
    if(!seen){
      // ops chapter captures each child read, then prints complete child stdout.
      // Only its outer metadata marker appears in the native return. Bind the
      // explicit chapter argv, nested time interval, child bytes, and complete
      // parent stdout; merely finding a quotation somewhere is insufficient.
      const parents=commandRows.filter(p=>p.exit_code===0&&p.argv?.[1]==='chapter'&&Number(p.argv[2])===unit.unit&&path.resolve(p.argv[0])===path.resolve(meta.argv[0]));
      for(const parent of parents){
        const ps=Date.parse(parent.started_at),cs=Date.parse(meta.started_at);
        if(!(cs>=ps&&cs+meta.elapsed_ms<=ps+parent.elapsed_ms))continue;
        const parentRaw=fs.readFileSync(parent.files.stdout,'utf8').replace(/^\uFEFF/,'');
        if(!parentRaw.includes(raw))continue;
        const returned=returns.find(e=>e.aggregated_output?.includes(parent.files.metadata)&&e.aggregated_output.includes(parentRaw.trimEnd()));
        if(!returned)continue;
        seen=returned;visibility={mode:'complete-chapter-parent',returned_command_metadata:parent.files.metadata,parent_stdout:parent.files.stdout,parent_stdout_sha256:hash(parent.files.stdout),child_metadata:row.raw_command};break;
      }
    }
    assert(seen,`${unit.unit}: complete raw chunk absent from completed native tool return`);
    if(row.from>row.to){
      assert(row.from>lines.length&&row.to===lines.length,'Invalid inverted range');
      emptyRanges.push({unit:unit.unit,from:row.from,to:row.to,raw_command:row.raw_command});continue;
    }
    assert(Number.isInteger(row.from)&&row.from>=1&&Number.isInteger(row.to)&&row.to<=lines.length);
    const expected=lines.slice(row.from-1,row.to).map((text,i)=>`${row.from+i}\t${text}`).join('\n');
    assert(raw.includes(expected+'\n'),`${unit.unit}: returned text differs from frozen final body`);
    for(let n=row.from;n<=row.to;n++)covered[n-1]=true;
    chunks.push({from:row.from,to:row.to,raw_command:row.raw_command,raw_stdout:row.raw_stdout,raw_stdout_sha256:hash(row.raw_stdout),native_item_id:seen.id,visibility});
  }
  const missing=covered.flatMap((yes,i)=>yes?[]:[i+1]);
  assert.equal(missing.length,0,`${unit.unit}: final version lines not returned: ${missing.join(',')}`);
  proof.push({unit:unit.unit,draft:unit.draft,sha256:unit.sha256,lines:lines.length,chunks});
}
const result={at:new Date().toISOString(),ok:true,scope:'All final chapter lines match frozen bodies and actual completed native tool returns; empty ranges and old SHA versions do not count. This is mechanical visibility coverage, not proof of attention, literary judgment, or human reading.',revision:state.revision,units:100,state_sha256:hash(path.join(frozen,'.writer/state.json')),audit_sha256:hash(path.join(base,'audits/final-review.json')),reading_jsonl_sha256:hash(path.join(phase,'reading.jsonl')),events_sha256:hash(path.join(phase,'events.jsonl')),ignored_empty_ranges:emptyRanges,ignored_old_version_ranges:oldVersions,chapters:proof};
fs.writeFileSync(output,JSON.stringify(result,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({ok:true,units:100,revision:state.revision,lines:proof.reduce((a,r)=>a+r.lines,0),nonempty_chunks:proof.reduce((a,r)=>a+r.chunks.length,0),ignored_empty_ranges:emptyRanges.length,ignored_old_version_ranges:oldVersions.length}));
