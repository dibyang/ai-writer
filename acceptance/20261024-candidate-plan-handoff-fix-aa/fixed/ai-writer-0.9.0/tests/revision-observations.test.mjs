import test from 'node:test';
import assert from 'node:assert/strict';
import {fixture,file,state,workflow,call,begin,rewindBranch,review,prepare,commit} from './protection-fixture.mjs';
import {main} from '../lib/workspace.mjs';

function observed(t, withTruth=true) {
  const {root}=fixture(t,0);
  call(root,'plan',null,{unit:1,title:'纸字',goal:'保留原字',change:'看到青字',beats:['看见原字'],cast:['林'],setting_refs:[],research_refs:[]});
  const value=main(['record-template','--project',root,'--unit','1','--draft','正文/0001.md']);
  file(root,value.draft,'# 纸字\n\n林看见纸上写着青。\n');value.summary='看到青字';value.changes.characters={林:'见过原字'};
  value.changes.ledger={OBS:{type:'observation',statement:'纸上写着青。',...(withTruth?{author_truth:'原字青，未改写。'}:{}),status:'active',cast:['林'],reader_known:'青字',character_known:{林:'看见青'},evidence:[{unit:1,quote:'林看见纸上写着青。'}]}};
  call(root,'record',null,value);workflow(root,true);const baseline=structuredClone(state(root));const branch=begin(root);rewindBranch(branch);return{root,branch,baseline};
}
function replay(branch, change) {
  const value=main(['revision','replay-input','--project',branch.workspace,'--unit','1','--revision-token',branch.token]);change(value);
  const report='审查/合成接口复核.md';file(branch.workspace,report,'# 合成接口测试\n仅核观察不可变边界，不冒充模型实读或文学验收。\n');
  value.replay_review={reviewer:'synthetic-immutable-observation-test',report,draft_sha256:value._replay.draft_sha256,checked_fields:['summary','characters','timeline','ledger','evidence','downstream']};
  call(branch.workspace,'record',null,value,branch.token);review(branch);
}
for(const [label,change,withTruth] of [
  ['原字',v=>{v.changes.ledger.OBS.statement='纸上写着赤。';},true],
  ['作者真相',v=>{v.changes.ledger.OBS.author_truth='原字赤。';},true],
  ['观察类型',v=>{v.changes.ledger.OBS.type='fact';},true],
  ['整条观察',v=>{delete v.changes.ledger.OBS;},true],
  ['给原来未填的真相补值',v=>{v.changes.ledger.OBS.author_truth='补入作者结论。';},false]
])test(`从首次观察之前回退，完整重登也不能逆改${label}`,t=>{
  const {root,branch,baseline}=observed(t,withTruth);replay(branch,change);
  assert.throws(()=>prepare(root,branch),error=>error.code==='IMMUTABLE_OBSERVATION_CHANGED'&&error.ledger_id==='OBS');
  assert.deepEqual(state(root),baseline);assert.equal(call(root,'revision','list').sessions.find(s=>s.id===branch.id).status,'editing');
});
test('旧观察保留时可更新读者知情并另建解释，再正常提交',t=>{
  const {root,branch,baseline}=observed(t);
  replay(branch,v=>{v.changes.ledger.OBS.reader_known='青字不变，含义待核';v.changes.ledger.OBS.character_known={林:'看见青字，但尚未弄清含义'};v.changes.ledger.EXPLANATION={type:'fact',statement:'林对青字的解释尚未核实',status:'pending',cast:['林'],reader_known:'解释待核',evidence:[{unit:1,quote:'林看见纸上写着青。'}]};});
  prepare(root,branch);commit(root,branch);const current=state(root).snapshot.ledger;
  for(const key of ['type','statement','author_truth'])assert.deepEqual(current.OBS[key],baseline.snapshot.ledger.OBS[key]);
  assert.equal(current.OBS.reader_known,'青字不变，含义待核');assert.equal(current.EXPLANATION.status,'pending');
});
