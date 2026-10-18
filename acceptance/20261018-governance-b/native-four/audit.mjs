import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const stage=path.resolve('acceptance/20261018-governance-b/native-four'),base=path.dirname(stage),root=path.join(base,'scale-hundred/work');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const write=(name,v)=>fs.writeFileSync(path.join(stage,name+'.json'),JSON.stringify(v,null,2)+'\n',{flag:'wx'});
const s=read(path.join(root,'.writer/state.json')),orig=read(path.join(stage,'baseline-state.json'));
const mode=process.argv[2];
if(mode==='pause-input') {
 const e=read(path.join(stage,'stage.json')).author_evidence;
 write('pause',{expected_revision:s.revision,operation_id:'native-four-pause-after-equivalence',author_evidence:e,workflow:{...s.governance,stage:'paused',task:'暂停：第100章等价验证完成；不写第101章，现有101细纲和卷纲仅诊断占位',authorization:{allowed_actions:['discuss','plan'],draft_range:null,revise_range:null,stop_conditions:['不写101或任何新正文','新增创作、事实变更或其他范围须真实作者另行授权']}}});
} else if(mode==='post-commit'||mode==='post-pause') {
 const hand=read(path.join(base,'scale-hundred/handoff-v2.json'));
 const bodies=hand.before_bodies.map(x=>({...x,final_sha256:sha(fs.readFileSync(path.join(root,x.draft)))}));
 const dependency=u=>sha(JSON.stringify({source_hashes:u.source_hashes,source_bindings:u.source_bindings??{},decision_bindings:u.decision_bindings??[]}));
 const records=fs.readdirSync(path.join(root,'.writer/reviews')).filter(x=>x.endsWith('.json')).map(file=>{const r=read(path.join(root,'.writer/reviews',file));const reasons=[];
  if(Object.values(s.impact_pending??{}).some(x=>x.from<=r.to&&x.through>=r.from))reasons.push('impact-pending');
  if(!fs.existsSync(path.join(root,r.report))||sha(fs.readFileSync(path.join(root,r.report)))!==r.report_sha256)reasons.push('report-hash');
  for(const u of r.units){if(s.units[u.unit-1]?.sha256!==u.sha256||!fs.existsSync(path.join(root,u.draft))||sha(fs.readFileSync(path.join(root,u.draft)))!==u.sha256)reasons.push('body-'+u.unit);if(r.dependencies&&r.dependencies[u.unit]!==dependency(s.units[u.unit-1]))reasons.push('dependency-'+u.unit);}
  if(!r.dependencies&&(s.committed_revisions??[]).some(binding=>{const c=read(path.join(root,binding.ref));return c.scope.from<=r.to&&c.scope.through>=r.from;}))reasons.push('legacy-report-overlaps-committed-range');
  return {file,report:r.report,from:r.from,to:r.to,kind:r.kind,valid:reasons.length===0,reasons};
 });
 const valid=records.filter(x=>x.valid),stale=records.filter(x=>!x.valid);
 for(const r of stale)r.covered_by=valid.filter(v=>v.from<=r.from&&v.to>=r.to).map(v=>v.report);
 const output={revision:s.revision,schema:s.schema_version,state_sha256:sha(fs.readFileSync(path.join(root,'.writer/state.json'))),snapshot_sha256:sha(JSON.stringify(s.snapshot)),original_snapshot_sha256:hand.original_snapshot_sha256,snapshot_equal:JSON.stringify(s.snapshot)===JSON.stringify(orig.snapshot),prefix99_equal:JSON.stringify(s.units.slice(0,99))===JSON.stringify(orig.units.slice(0,99)),body_count:bodies.length,body_mismatches:bodies.filter(x=>x.sha256!==x.final_sha256),bodies,source_ranges:s.source_ranges,impact_pending:s.impact_pending,unit100_binding:s.units.at(-1).source_bindings,workflow:s.governance,rolling:{valid:valid.length,stale:stale.length,stale_with_current_coverage:stale.filter(x=>x.covered_by.length).length,stale_without_current_coverage:stale.filter(x=>!x.covered_by.length).length},new_model_report:records.find(x=>x.report==='审查/native-four-0095-0100-真实模型连读.md'),uncovered_stale_reports:stale.filter(x=>!x.covered_by.length),records};
 write(mode,output);console.log(JSON.stringify({...output,bodies:undefined,records:undefined},null,2));
 if(!output.snapshot_equal||!output.prefix99_equal||output.body_mismatches.length)throw Error('equivalence');
}else throw Error(mode);
