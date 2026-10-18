import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const stage=path.resolve('acceptance/20261018-governance-b/native-four'),base=path.dirname(stage),root=path.join(base,'scale-hundred/work');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const write=(name,v)=>fs.writeFileSync(path.join(stage,name+'.json'),JSON.stringify(v,null,2)+'\n',{flag:'wx'});
const mode=process.argv[2];
if(mode==='session') {
 const session=read(path.join(base,'commands/native-four-13-begin/stdout.raw.txt'));
 if(!session.ok)throw Error('begin failed');
 write('session',session);write('prepare',{id:session.id,token:session.token});write('commit',{id:session.id,token:session.token});
 const s=read(path.join(root,'.writer/state.json'));write('new-base-state',s);
 console.log(JSON.stringify({base_revision:s.revision,parent_facts_sha256:sha(JSON.stringify(s.snapshot)),report_in_branch:fs.existsSync(path.join(session.workspace,'审查/native-four-规则同字节历史影响.md'))}));
} else {
 const branch=read(path.join(stage,'session.json'));
 const s=read(path.join(branch.workspace,'.writer/state.json'));
 if(mode==='publish') {
  const id=read(path.join(base,'commands/native-four-10-stage/stdout.raw.txt')).impact_id;
  const e=read(path.join(stage,'stage.json')).author_evidence;
  write('publish',{expected_revision:s.revision,operation_id:'native-four-branch-publish-100',author_evidence:e,impact_id:id});
 } else if(mode==='record') {
  const template=read(path.join(base,'commands/native-four-17-template/stdout.raw.txt'));
  console.log(JSON.stringify({template_keys:Object.keys(template),current_revision:s.revision}));
  const old=read(path.join(base,'commands/hundred-rebuild-v2-6-record/input.raw.json'));
  const orig=read(path.join(stage,'baseline-state.json'));
  const journal=read(path.join(root,orig.units.at(-1).journal));
  const body=fs.readFileSync(path.join(branch.workspace,orig.units.at(-1).draft),'utf8');
  const evidence=Object.entries(old.changes.ledger).flatMap(([id,v])=>v.evidence.map(e=>({id,...e,present:body.includes(e.quote)})));
  if(evidence.some(x=>x.unit!==100||!x.present))throw Error('evidence mismatch');
  const v={journal_patch_keys:Object.keys(journal.patch),old_changes_sha256:sha(JSON.stringify(old.changes)),original_patch_sha256:sha(JSON.stringify(journal.patch)),evidence,summary_equal_original:old.summary===orig.units.at(-1).summary};
  write('record-fact-verification',v);
  const input=template.template??template;
  if(input.unit!==100||input.expected_revision!==s.revision)throw Error('unexpected template');
  write('record',{...input,summary:old.summary,changes:old.changes});
  console.log(JSON.stringify(v));
 } else if(mode==='verify') {
  const orig=read(path.join(stage,'baseline-state.json'));
  const hand=read(path.join(base,'scale-hundred/handoff-v2.json'));
  const bodies=hand.before_bodies.map(x=>({...x,current_sha256:sha(fs.readFileSync(path.join(branch.workspace,x.draft)))}));
  const result={snapshot_equal:JSON.stringify(s.snapshot)===JSON.stringify(orig.snapshot),snapshot_sha256:sha(JSON.stringify(s.snapshot)),prefix99_equal:JSON.stringify(s.units.slice(0,99))===JSON.stringify(orig.units.slice(0,99)),bodies_equal:bodies.every(x=>x.sha256===x.current_sha256),unit100:s.units.at(-1),revision:s.revision};
  write('branch-equivalence',result);console.log(JSON.stringify({...result,unit100:{unit:result.unit100.unit,source_bindings:result.unit100.source_bindings}}));
  if(!result.snapshot_equal||!result.prefix99_equal||!result.bodies_equal)throw Error('equivalence failed');
 } else throw Error(mode);
}
