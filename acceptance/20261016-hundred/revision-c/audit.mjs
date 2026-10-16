import fs from 'node:fs';
import path from 'node:path';
import {isDeepStrictEqual as same} from 'node:util';
import {stage,work,hash,read,write,manifest} from './phase.mjs';
import {replaySnapshots} from '../rebuild-utils.mjs';

const state=read(path.join(work,'.writer/state.json'));
const old=read(path.join(stage,'before/work/.writer/state.json'));
const desired=read(path.join(stage,'desired-snapshots.json'));
const original=read(path.join(stage,'original-snapshots.json'));
const actual=replaySnapshots(work,state);
const differences=[];
function diff(a,b,p,out){
 if(same(a,b))return;
 if(a&&b&&typeof a==='object'&&typeof b==='object'&&!Array.isArray(a)&&!Array.isArray(b)){
  for(const k of new Set([...Object.keys(a),...Object.keys(b)]))diff(a[k],b[k],p+'.'+k,out);
 }else out.push({path:p,expected:a,actual:b});
}
for(let n=0;n<=90;n++){
 const rows=[];diff(desired[n],actual[n],'snapshot',rows);
 if(rows.length)differences.push({unit:n,rows});
}
write(path.join(stage,'actual-desired-differences.json'),differences);
write(path.join(stage,'actual-snapshots.json'),actual);
// The only material added beyond the desired replay is the two explicitly submitted
// old-unit anchors attached at 90 to support the late reader/author scope note.
for(const d of differences){
 if(d.unit!==90)throw Error('Unexpected snapshot divergence '+d.unit);
 for(const row of d.rows){
  if(!['snapshot.ledger.T_PAGE_PAIR.evidence','snapshot.ledger.T_VOICE_CONSENT.evidence'].includes(row.path))throw Error('Unexpected field divergence '+row.path);
  if(!same(row.actual.slice(0,-1),row.expected)||row.actual.length!==row.expected.length+1)throw Error('Prior evidence changed '+row.path);
  const anchor=row.actual.at(-1);
  if(anchor.unit!==27||anchor.line!==93||anchor.quote!=='沈禾将有邱当面改词的这一页留给她，只带走自己的笔记'||anchor.sha256!==hash(fs.readFileSync(path.join(work,anchor.draft))))throw Error('Unexpected added late anchor');
 }
}
if(differences.length!==1||differences[0].rows.length!==2)throw Error('Expected exactly two added late anchors');
const readings=fs.readFileSync(path.join(stage,'reading.jsonl'),'utf8').trim().split(/\r?\n/).map(JSON.parse);
const counts=state.units.filter(u=>u.unit>=25).map(u=>{
 const b=fs.readFileSync(path.join(work,u.draft));
 return {unit:u.unit,draft:u.draft,sha256:hash(b),han:[...b.toString('utf8').replace(/^#.*(?:\r?\n|$)/,'').matchAll(/\p{Script=Han}/gu)].length};
});
const immutable=[];const evidence=[];
for(let n=0;n<=90;n++){
 for(const [id,v]of Object.entries(original[n].ledger??{})){
  const a=actual[n].ledger[id];if(!a)throw Error('Missing ledger '+n+':'+id);
  for(const k of ['type','introduced_unit','due_unit'])if(!same(v[k],a[k]))immutable.push({unit:n,id,field:k,before:v[k],after:a[k]});
  if(v.type==='observation')for(const k of ['statement','author_truth'])if(!same(v[k],a[k])||Object.hasOwn(v,k)!==Object.hasOwn(a,k))immutable.push({unit:n,id,field:k,before:v[k],after:a[k]});
  if(n!==90)continue;
  for(let i=0;i<(v.evidence??[]).length;i++){
   const before=v.evidence[i],after=a.evidence[i];
   if(!after||before.unit!==after.unit||before.draft!==after.draft||before.line!==after.line)throw Error('Evidence identity changed '+id+':'+i);
   const b=fs.readFileSync(path.join(work,after.draft));const lines=b.toString('utf8').split(/\r?\n/);
   if(after.source_sha256!==undefined&&after.source_sha256!==hash(b))throw Error('Evidence SHA mismatch '+id+':'+i);
   if(after.sha256!==undefined&&after.sha256!==hash(b))throw Error('Evidence SHA mismatch '+id+':'+i);
   if(!lines[after.line-1]?.includes(after.quote))throw Error('Evidence original context mismatch '+id+':'+i);
   evidence.push({id,index:i,unit:before.unit,draft:before.draft,line:before.line,before:before.quote,after:after.quote,changed:before.quote!==after.quote,body_sha256:hash(b),anchor:after});
  }
 }
}
const transitions=state.units.filter(u=>u.unit>=41).map(u=>{
 const n=u.unit,input=read(path.join(stage,`inputs/${n}.json`));
 const before=read(path.join(stage,`transitions/${n}-before.json`)),after=read(path.join(stage,`transitions/${n}-after.json`));
 if(input.expected_revision!==before.revision||after.revision!==before.revision+1)throw Error('Revision transition '+n);
 if(input.source_hashes['.writer/state.json']!==before.state_sha256)throw Error('Context state hash mismatch '+n);
 const template=read(path.join(stage,`templates/${n}.json`));if(!same(template.source_hashes,input.source_hashes)||template.expected_revision!==input.expected_revision)throw Error('Fresh template source dictionary mismatch '+n);
 for(const[f,h]of Object.entries(input.source_hashes))if(f!=='.writer/state.json'&&hash(fs.readFileSync(path.join(work,f)))!==h)throw Error('Consumed source bytes mismatch '+n+':'+f);
 if(!same(input.source_hashes,u.source_hashes))throw Error('Source keys/values changed '+n);
 if(!same(after.record,u))throw Error('Record changed after capture '+n);
 if(hash(fs.readFileSync(path.join(work,u.draft)))!==before.body_sha256)throw Error('Body changed after record '+n);
 if(!readings.some(r=>r.file===u.draft&&r.sha256===before.body_sha256&&r.coverage==='full'&&r.purpose===`rebuild-units-${n-(n-1)%3}-${n-(n-1)%3+2}`)){
  if(!readings.some(r=>r.file===u.draft&&r.sha256===before.body_sha256&&r.coverage==='full'&&r.purpose?.startsWith('rebuild-')))throw Error('Current full read absent '+n);
 }
 return {unit:n,expected_revision:input.expected_revision,revision:after.revision,source_hash_count:Object.keys(input.source_hashes).length,source_keys:Object.keys(input.source_hashes),body_sha256:before.body_sha256,input_sha256:hash(fs.readFileSync(path.join(stage,`inputs/${n}.json`))),before_state_sha256:before.state_sha256,after_state_sha256:after.state_sha256};
});
const reviews=[];
for(let n=42;n<=90;n+=3){const x=read(path.join(stage,`reviews/${n}.json`)),keys=Object.keys(x.source_hashes).sort(),expected=state.units.slice(n-6,n).map(u=>u.draft).sort();if(!same(keys,expected)||keys.length!==6)throw Error('Incomplete review '+n);for(const[f,h]of Object.entries(x.source_hashes))if(hash(fs.readFileSync(path.join(work,f)))!==h)throw Error('Review hash '+n);reviews.push({from:x.from,to:x.to,report:x.report,source_count:6,sha256:hash(fs.readFileSync(path.join(work,x.report)))});}
const beforeManifest=read(path.join(stage,'before/manifest.json')),current=manifest(work);
const changedFiles=Object.keys(beforeManifest).filter(f=>current[f]!==beforeManifest[f]);
const deletedFiles=Object.keys(beforeManifest).filter(f=>!Object.hasOwn(current,f));
const addedFiles=Object.keys(current).filter(f=>!Object.hasOwn(beforeManifest,f));
const allowedChanged=new Set(['.writer/state.json',...read(path.join(stage,'file-edits.json')).map(x=>x.file)]);
const fileEdits=read(path.join(stage,'file-edits.json'));
for(const f of new Set(fileEdits.map(x=>x.file))){
 const text=fs.readFileSync(path.join(stage,'before/work',f),'utf8'),newline=text.includes('\r\n')?'\r\n':'\n',lines=text.split(/\r?\n/);
 for(const edit of fileEdits.filter(x=>x.file===f)){if(lines[edit.line-1]!==edit.before)throw Error('Edit original line mismatch '+f+':'+edit.line);lines[edit.line-1]=edit.after;}
 if(hash(Buffer.from(lines.join(newline)))!==current[f])throw Error('Unlisted byte edit '+f);
}
if(changedFiles.some(f=>!allowedChanged.has(f))||deletedFiles.length)throw Error('Unintended changed/deleted work file');
if(addedFiles.some(f=>!/^\.writer\/(?:journal|reviews)\//.test(f)&&!/^\.writer\/rewind-/.test(f)&&!/^审查\/revision-c-(?:final-)?\d+-\d+\.md$/.test(f)))throw Error('Unintended new work file');
const audit={revision:state.revision,units:state.units.length,prefix40_registration_equal:same(state.units.slice(0,40),old.units.slice(0,40)),prefix40_snapshots_equal:actual.slice(0,41).every((v,i)=>same(v,original[i])),baseline_equal:same(state.baseline,old.baseline),observations:Object.values(state.snapshot.ledger).filter(v=>v.type==='observation').length,immutable_differences:immutable,difference_units:differences.map(x=>x.unit),differences_count:differences.reduce((a,x)=>a+x.rows.length,0),evidence_count:evidence.length,replaced_quotes:evidence.filter(x=>x.changed).length,counts:{min:Math.min(...counts.map(x=>x.han)),max:Math.max(...counts.map(x=>x.han)),chapters:counts.length,valid:counts.every(x=>x.han>=2400&&x.han<=3200)},transitions:transitions.length,reviews:reviews.length,changed_files:changedFiles,added_files:addedFiles,deleted_files:deletedFiles,tool_hashes:{main:hash(fs.readFileSync('lib/longform.mjs')),builtin:hash(fs.readFileSync(path.join(work,'.writer/tool/lib/longform.mjs')))},state_keys:Object.keys(state),unit_keys:Object.keys(state.units[89]),evidence_keys:Object.keys(evidence[0]?.anchor??{}),review_state_keys:Object.keys(state).filter(k=>/review/.test(k))};
audit.protected_snapshot24={character_position_texts:Object.keys(original[24].characters).length,ledger_knowledge_texts:Object.values(original[24].ledger).reduce((n,v)=>n+Object.keys(v.character_known??{}).length,0),evidence_anchors:Object.values(original[24].ledger).reduce((n,v)=>n+(v.evidence??[]).length,0),timeline_entries:original[24].timeline.length,identical_to_original:true};
audit.protected_snapshot24.total_knowledge_texts=audit.protected_snapshot24.character_position_texts+audit.protected_snapshot24.ledger_knowledge_texts;
write(path.join(stage,'final-structural-audit.json'),audit);write(path.join(stage,'final-evidence-audit.json'),evidence);write(path.join(stage,'final-transitions.json'),transitions);write(path.join(stage,'final-reviews.json'),reviews);write(path.join(stage,'han-counts-final.json'),counts);
console.log(JSON.stringify({revision:audit.revision,units:audit.units,prefix40_registration_equal:audit.prefix40_registration_equal,observations:audit.observations,immutable_differences:audit.immutable_differences,original_evidence:audit.evidence_count,replaced_quotes:audit.replaced_quotes,protected_snapshot24:audit.protected_snapshot24,counts:audit.counts,transitions:audit.transitions,reviews:audit.reviews,changed_files:audit.changed_files.length,added_files:audit.added_files.length,deleted_files:audit.deleted_files.length,expected_extra_anchors:2,tool_hashes:audit.tool_hashes},null,2));
if(immutable.length||!audit.prefix40_registration_equal||!audit.prefix40_snapshots_equal||!audit.baseline_equal||!audit.counts.valid||state.units.length!==90||audit.tool_hashes.main!==audit.tool_hashes.builtin)throw Error('Final structural invariant failed');
