import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {project,revision,read,write,sha,files,cli} from './session-tools.mjs';
const beforeDir=path.join(revision,'before'), before=read(path.join(beforeDir,'.writer/state.json'));
const state=read(path.join(project,'.writer/state.json'));
const manifest=read(path.join(beforeDir,'manifest.json'));
for(const f of manifest)assert.equal(sha(path.join(beforeDir,f.path)),f.sha256,`backup drift ${f.path}`);
assert.deepEqual(state.units[0],before.units[0]);
assert.deepEqual(state.snapshot.ledger.O_KEY,before.snapshot.ledger.O_KEY);
const rewindState=read(path.join(revision,'chapters/02/state-before.json'));
assert.equal(rewindState.revision,12); assert.equal(rewindState.units.length,1);
assert(!rewindState.snapshot.ledger.O_LABEL);
write(path.join(revision,'after-rewind/state.json'),rewindState);
const oldPattern=/七号|7号柜|七號/;
const textDiff=[];
for(const u of state.units){
  const rel=u.draft, original=fs.readFileSync(path.join(beforeDir,rel),'utf8'), current=fs.readFileSync(path.join(project,rel),'utf8');
  let expected=original;
  if([2,5,6,7].includes(u.unit))expected=expected.replaceAll('七号','九号');
  if(u.unit===6)expected=expected.replace('铜钥匙也仍在她内袋里。','铜钥匙也仍在林岚包内袋里。');
  assert.equal(current,expected,`unexpected prose change ${u.unit}`);
  assert(!oldPattern.test(current)); assert.equal(sha(path.join(project,rel)),u.sha256);
  assert.equal(sha(path.join(project,u.journal)),u.journal_sha256);
  textDiff.push({unit:u.unit,draft:rel,changed:original!==current,before_sha256:sha(path.join(beforeDir,rel)),after_sha256:u.sha256});
}
assert.deepEqual(state.units.map(u=>u.unit),[1,2,3,4,5,6,7,8]);
let evidenceCount=0;
for(const [id,item] of Object.entries(state.snapshot.ledger))for(const e of item.evidence){
  const draft=path.join(project,e.draft), text=fs.readFileSync(draft,'utf8');
  assert.equal(sha(draft),e.sha256,`evidence hash ${id}`);
  assert(text.split(/\r?\n/)[e.line-1].includes(e.quote),`evidence line ${id}`); evidenceCount++;
}
assert(!oldPattern.test(JSON.stringify(state)));
const consumed=new Set(state.units.flatMap(u=>Object.keys(u.source_hashes)).filter(p=>p.startsWith('大纲/')||p.startsWith('设定/')));
for(const rel of consumed)assert(!oldPattern.test(fs.readFileSync(path.join(project,rel),'utf8')),`old label in ${rel}`);
for(const f of manifest.filter(f=>f.path.startsWith('大纲/')||f.path.startsWith('设定/')||f.path.startsWith('审查/')||f.path.startsWith('.writer/journal/')||f.path.startsWith('.writer/reviews/')||f.path.startsWith('.writer/record-')||['writer.json','AGENTS.md'].includes(f.path))){
  if(['大纲/单元/0002.json','大纲/单元/0003.json','大纲/单元/0006.json'].includes(f.path)){
    assert.equal(fs.readFileSync(path.join(project,f.path),'utf8'),fs.readFileSync(path.join(beforeDir,f.path),'utf8').replaceAll('七号','九号'));
  }else assert.equal(sha(path.join(project,f.path)),f.sha256,`protected file changed ${f.path}`);
}
assert.equal(state.snapshot.ledger.O_LABEL.introduced_unit,2);
assert.equal(state.snapshot.ledger.O_LABEL.statement,'牛皮封套内窄纸签分两行写着九号柜、副页待核；无日期、无签名。');
assert.equal(state.snapshot.ledger.O_LABEL.author_truth,state.snapshot.ledger.O_LABEL.statement);
assert.equal(state.snapshot.ledger.P_KEY.custody.holder,'陆衡');
assert.equal(state.snapshot.ledger.P_ENVELOPE.custody.holder,'许澄');
assert.equal(state.snapshot.ledger.T_COPY.status,'partial'); assert.equal(state.snapshot.ledger.T_COPY.due_unit,6);
const stages=Array.from({length:7},(_,i)=>read(path.join(revision,`chapters/${String(i+2).padStart(2,'0')}/state-after.json`)));
for(const s of stages){
  const n=s.units.length;
  assert.equal(s.snapshot.ledger.P_KEY.custody.holder,n<7?'林岚':'陆衡');
  assert.equal(s.snapshot.ledger.P_ENVELOPE.custody.holder,n<4?'林岚':n===4?'陆衡':'许澄');
  if(n<5)assert.match(s.snapshot.ledger.O_LABEL.character_known.陆衡,/不知/);
  else assert.match(s.snapshot.ledger.O_LABEL.character_known.陆衡,/第5章.*首次听.*九号柜/);
  assert.equal(s.snapshot.ledger.T_COPY.due_unit,6);
}
for(let n=2;n<=8;n++){
  const id=String(n).padStart(2,'0'), t=read(path.join(revision,`chapters/${id}/template.json`)), input=read(path.join(revision,`chapters/${id}/record-input.json`)), ctx=read(path.join(revision,`chapters/${id}/context.json`));
  assert.deepEqual(t.source_hashes,input.source_hashes); assert.deepEqual(t.source_hashes,ctx.source_hashes); assert.equal(t.expected_revision,n+10);
  assert.equal(t.source_hashes['.writer/state.json'],sha(path.join(revision,`chapters/${id}/state-before.json`)));
  if(n>=6)assert(ctx.continuity.recall.selected.T_COPY.includes('due'));
}
function reviewRecords(base,s){return files(path.join(base,'.writer/reviews')).map(p=>{const r=read(p);const reasons=[];
  if(!fs.existsSync(path.join(base,r.report))||sha(path.join(base,r.report))!==r.report_sha256)reasons.push('report hash');
  for(const u of r.units)if(s.units[u.unit-1]?.sha256!==u.sha256)reasons.push(`unit ${u.unit} unregistered or hash differs`);
  return {ref:path.relative(base,p).replaceAll('\\','/'),from:r.from,to:r.to,report:r.report,valid:!reasons.length,reasons};});}
const reviews={before:reviewRecords(beforeDir,before),after_rewind:reviewRecords(beforeDir,rewindState),current:reviewRecords(project,state)};
const audit={scope:'mechanical-only; semantic review is in the version-bound model-self-review report',revision:state.revision,state_sha256:sha(path.join(project,'.writer/state.json')),backup_verified_files:manifest.length,first_unit_index_unchanged:true,O_KEY_unchanged:true,O_LABEL_absent_after_rewind:true,O_LABEL_reintroduced_unit:2,actual_text_changes:textDiff,consumed_plan_and_setting_files:[...consumed],current_old_label_hits:0,evidence_verified:evidenceCount,holder_chain_verified:true,fresh_templates_verified:7,reviews};
write(path.join(revision,'audit.json'),audit);
write(path.join(revision,'final/state.json'),state);
console.log(JSON.stringify(audit,null,2));
