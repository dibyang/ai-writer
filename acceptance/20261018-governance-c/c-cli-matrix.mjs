import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {runner,readState,write,sha} from './cli-support.mjs';
const r=runner(process.argv[2]);
const fields=['goal','obstacle','choice','consequence','relationship_change'];
const next=root=>({expected_revision:readState(root).revision,operation_id:`c-${r.rows.length}`});
function table(root,report,issues){
  const s=readState(root),input=r.run(root,['review-template','--from','1','--to','2']);
  write(path.join(root,report),'# 合成CLI结构演练\n\n不是实际模型阅读、文学判断或历史核验。\n');
  input.report=report;input.chapter_functions=input.chapter_functions.map(row=>({unit:row.unit,...Object.fromEntries(fields.map(k=>[k,{status:'unknown',reason:'本夹具只验证接口，不提供真实文学判断'}]))}));
  input.comparison.limits='合成接口不证明文学质量、重复已消除或史实正确';
  input.issues=issues?['CHECK','STYLE','WAIT'].map((key,i)=>({id:`I_${key}`,type:i===1?'optional_style':'readability',severity:i===1?'suggestion':'minor',confidence:'medium',statement:'合成流程意见，不是实际读稿发现',suggestion:'只验证取舍和版本绑定',evidence:[{unit:i===2?2:1,quote:'本页只演练合成输入的字段边界。'}]})):[];
  return r.run(root,['review'],input);
}
const outcomes=[];
for(const kind of ['novel','screenplay','history','essay']){
  const root=path.join(r.dest,kind,'work');r.run(null,['init','--path',root,'--kind',kind,'--title',`${kind}接口夹具`]);r.authorFile(root);r.workflow(root,false,1,2);
  if(kind==='history')write(path.join(root,'研究/card.json'),{status:'verified',claims:[{type:'direct',statement:'合成输入包含字段',boundary:'仅为接口夹具，不是历史断言',source_dependency:'自包含合成字段，无外部史源',sources:[{title:'合成JSON',locator:'本夹具',excerpt:'字段',checked_at:'2026-10-18'}]}]});
  for(let n=1;n<=2;n++){
    r.run(root,['plan'],{unit:n,title:`接口${n}`,goal:'验证字段',change:'推进合成输入',beats:['核字段'],cast:[],setting_refs:[],research_refs:kind==='history'?['研究/card.json']:[]});
    const draft=`正文/000${n}.md`,input=r.run(root,['record-template','--unit',String(n),'--draft',draft]);write(path.join(root,draft),`# 合成接口${n}\n\n本页只演练合成输入的字段边界。\n`);input.summary=`接口步骤${n}`;input.changes.timeline_append=[`合成步骤${n}`];r.run(root,['record-preview'],input);r.run(root,['record'],input);
  }
  const before=structuredClone(readState(root).snapshot);table(root,'审查/原始结构接口.md',true);
  const denied={...next(root),id:'I_CHECK',disposition:'adopted',reason:'仅试写不能借意见获得修订权',decision_actor:'agent-within-authorized-scope',authorization:readState(root).governance_binding};assert.equal(r.run(root,['review-issues','resolve'],denied,2).code,'ACTION_OUT_OF_SCOPE');
  r.workflow(root,true,1,2);
  for(const [id,disposition]of [['I_CHECK','adopted'],['I_STYLE','retained'],['I_WAIT','deferred']])r.run(root,['review-issues','resolve'],{...next(root),id,disposition,reason:'合成处置，不冒充作者逐条决定',decision_actor:'agent-within-authorized-scope',authorization:readState(root).governance_binding});
  const b=r.begin(root);r.run(b.workspace,['rewind','--from','1','--expected-revision',String(readState(b.workspace).revision),'--revision-token',b.token]);fs.appendFileSync(path.join(b.workspace,'正文/0001.md'),'\n新增接口字节，不承担历史叙事。\n');
  for(let n=1;n<=2;n++){
    const input=r.run(b.workspace,['revision','replay-input','--unit',String(n),'--revision-token',b.token]);assert.equal(r.run(b.workspace,['record-preview','--revision-token',b.token],input,1).ok,false);
    const report=`审查/重登核对${n}.md`;write(path.join(b.workspace,report),'# 合成重登核对\n只演练版本绑定，不是模型阅读。\n');input.replay_review={reviewer:'mechanical-fixture-not-model-reading',report,draft_sha256:input._replay.draft_sha256,checked_fields:['summary','characters','timeline','ledger','evidence','downstream']};
    r.run(b.workspace,['record-preview','--revision-token',b.token],input);r.run(b.workspace,['record','--revision-token',b.token],input);
  }
  r.review(b);r.prepare(root,b);r.commit(root,b);assert.deepEqual(readState(root).snapshot,before);
  const s=readState(root),commit=JSON.parse(fs.readFileSync(path.join(root,s.committed_revisions.at(-1).ref)));
  r.run(root,['review-issues','apply'],{...next(root),id:'I_CHECK',commit_id:commit.id,reason:'实际事务字节变化已绑定'});const final=table(root,'审查/新版结构接口.md',false);
  r.run(root,['review-issues','verify'],{...next(root),id:'I_CHECK',review_ref:final.ref,reviewer:'mechanical-fixture-not-model-reading',conclusion:'resolved',reason:'仅验证状态流，不作语义修复声明'});
  const list=r.run(root,['review-issues','list']);assert.equal(list.counts.verified,1);assert.equal(list.counts.retained,1);assert.equal(list.counts.deferred,1);
  r.run(root,['review-issues','verify'],{...next(root),id:'I_STYLE',review_ref:final.ref,reviewer:'fixture',conclusion:'resolved',reason:'保留不算修复'},2);
  assert.equal(r.run(root,['check']).ok,true);assert.equal(r.run(root,['doctor']).ok,true);const exported=r.run(root,['export','--out',path.join(r.dest,kind,'export')]);assert.equal(exported.included_units.length,2);
  outcomes.push({kind,states:list.counts,state_sha256:sha(fs.readFileSync(path.join(root,'.writer/state.json'))),scope:'real CLI; synthetic fields, no model reading or historical acceptance'});
}
const summary=r.summary({outcomes,protocol:5});console.log(JSON.stringify({ok:true,calls:summary.calls,kinds:outcomes.length,scope:'mechanical-only'}));
