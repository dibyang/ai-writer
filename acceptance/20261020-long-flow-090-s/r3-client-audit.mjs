import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {base,work,sha,state} from './common.mjs';

const phase=process.argv[2];
const readJson=f=>JSON.parse(fs.readFileSync(f));
const session=readJson(path.join(base,'r3-session.json'));
const original=readJson(path.join(base,'r3-client-before.json'));
const before=readJson(path.join(base,'r3-before.json'));
const candidate=session.workspace;
const hash=(p,r)=>sha(fs.readFileSync(path.join(p,r)));
const save=(name,value)=>fs.writeFileSync(path.join(base,name),JSON.stringify(value,null,2)+'\n',{flag:'wx'});
const stable=v=>JSON.stringify(v,(_,x)=>x&&typeof x==='object'&&!Array.isArray(x)?Object.fromEntries(Object.entries(x).sort(([a],[b])=>a.localeCompare(b))):x);

function capture(){
  const s=readJson(path.join(candidate,'.writer/state.json'));
  const refs=new Set([...Object.keys(original.candidate_dependencies),...before.bodies.map(u=>u.draft)]);
  for(const f of fs.readdirSync(path.join(candidate,'.writer/objects')))if(f.endsWith('.source'))refs.add('.writer/objects/'+f);
  return {at:new Date().toISOString(),revision:s.revision,state_sha256:hash(candidate,'.writer/state.json'),snapshot_sha256:sha(stable(s.snapshot)),bodies:s.units.filter(u=>u.unit>=7&&u.unit<=12).map(u=>({unit:u.unit,draft:u.draft,sha256:hash(candidate,u.draft)})),dependencies:Object.fromEntries([...refs].sort().map(r=>[r,hash(candidate,r)]))};
}

if(phase==='reread-before'){
  const s=readJson(path.join(candidate,'.writer/state.json'));
  assert.equal(s.units.length,12);assert.deepEqual(s.snapshot,before.snapshot);
  for(const row of before.bodies)assert.equal(hash(candidate,row.draft),row.sha256);
  for(const n of [11,12]){
    const template=readJson(path.join(candidate,`.writer/drafts/s-r3-replay-${n}.json`));
    const reviewed=readJson(path.join(base,`inputs/r3-reviewed-${n}.json`));
    assert.deepEqual(reviewed.changes,template.changes);assert.equal(reviewed.summary,template.summary);
    const old=readJson(path.join(base,`inputs/r2-reviewed-${n}${n===12?'-retry1':''}.json`));
    assert.equal(reviewed.summary,old.summary);
    const comparable=structuredClone(old.changes);
    if(n===11)delete comparable.ledger.T_SHORT_ACCOUNT.status;
    assert.equal(stable(reviewed.changes),stable(comparable));
  }
  const result=capture();save('r3-client-reread-before.json',result);console.log(JSON.stringify({ok:true,phase,revision:result.revision,bodies:result.bodies,dependency_count:Object.keys(result.dependencies).length}));
}else if(phase==='reread-after'){
  const start=readJson(path.join(base,'r3-client-reread-before.json')),end=capture();
  for(const key of ['revision','state_sha256','snapshot_sha256','bodies','dependencies'])assert.deepEqual(end[key],start[key]);
  save('r3-client-reread-after.json',{...end,read_window_stable:true});console.log(JSON.stringify({ok:true,phase,read_window_stable:true,revision:end.revision,dependencies:Object.keys(end.dependencies).length}));
}else if(phase==='final'){
  const s=state();assert.equal(s.units.length,12);assert.equal(s.tool_control.generation,3);assert.deepEqual(s.snapshot,before.snapshot);
  const oldAssets=Object.entries(original.main_assets).map(([ref,expected])=>({ref,expected,actual:hash(work,ref)}));
  const changed=oldAssets.filter(v=>v.expected!==v.actual);assert.deepEqual(changed,[]);
  for(const [ref,expected] of Object.entries(original.old_inputs))assert.equal(hash(base,ref),expected);
  for(const row of before.bodies)assert.equal(hash(work,row.draft),row.sha256);
  const oldLedger=before.snapshot.ledger;
  const evidenceCount=Object.values(s.snapshot.ledger).reduce((n,e)=>n+e.evidence.length,0);
  for(const [id,e] of Object.entries(oldLedger))for(const key of ['type','statement','author_truth','evidence'])assert.deepEqual(s.snapshot.ledger[id][key],e[key]);
  const inputThirteen=Object.entries(original.old_inputs).filter(([r])=>/13/.test(r));
  const reports=[11,12].map(n=>`审查/S-R3-重登-${String(n).padStart(4,'0')}.md`).concat('审查/S-R3-0007-0012.md');
  for(const ref of reports)assert.equal(hash(work,ref),hash(candidate,ref));
  const oldTemplates13={'.writer/drafts/s-context-13.json':'903c89d0286a1e138708afb123a9fd07fe06c98bed6793252694cd531670eb4c','.writer/drafts/s-record-13.json':'d99f99329a40951fd75d5c8844582ad5eb41b959928639208d81f4f007ca1c1d'};
  for(const [ref,h] of Object.entries(oldTemplates13))assert.equal(hash(work,ref),h);
  for(const ref of ['正文/0013.md','分段/0013/part-03.md','分段/0013/part-04.md','分段/0013/part-05.md'])assert.equal(fs.existsSync(path.join(work,ref)),false);
  const result={ok:true,at:new Date().toISOString(),revision:s.revision,main_state_sha256:hash(work,'.writer/state.json'),generation:s.tool_control.generation,source_content_id:s.tool_control.installed.source_content_id,snapshot_equal:true,all_12_bodies_equal:true,unchanged_prior_asset_count:oldAssets.length,changed_prior_assets:changed,old_inputs_unchanged:Object.keys(original.old_inputs).length,old_thirteen_inputs:inputThirteen.map(([r,h])=>({ref:r,sha256:h})),old_templates13_unchanged:oldTemplates13,no_new_thirteen_body_or_parts:true,ledger_entries:Object.keys(s.snapshot.ledger).length,evidence_count:evidenceCount,ledger_immutable_and_evidence_equal:true,reports:reports.map(ref=>({ref,sha256:hash(work,ref)})),parts13:['分段/0013/part-01.md','分段/0013/part-02.md'].map(ref=>({ref,sha256:hash(work,ref)})),scope:'Mechanical asset and transaction verification only; manuscript reading is documented separately, not literary acceptance.'};
  save('r3-client-final-verification.json',result);console.log(JSON.stringify(result,null,2));
}else throw Error('reread-before | reread-after | final');
