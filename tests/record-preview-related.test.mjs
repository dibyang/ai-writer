import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fixture,state,file,call} from './protection-fixture.mjs';
import {main} from '../lib/workspace.mjs';

function setup(t,extra=0){
  const {root}=fixture(t,0);
  call(root,'plan',null,{unit:1,title:'会面',goal:'见面',change:'取得讲述',beats:['到门廊'],cast:['林照','周伯','陈阿姨'],setting_refs:[],research_refs:[]});
  const first=main(['record-template','--project',root,'--unit','1','--draft','正文/0001.md']);
  file(root,first.draft,'# 会面\n\n林照和周伯到了门廊，陈阿姨开门。林照答应送周伯回家。\n');first.summary='会面结束，回程尚未进行';
  first.changes.characters={林照:'在门廊',周伯:'在门廊',陈阿姨:'在家接待'};
  const entry=(known,cast=['林照','周伯'])=>({type:'thread',statement:'合成接口用例中的有限约定',status:'resolved',cast,character_known:known,evidence:[{unit:1,quote:'林照和周伯到了门廊，陈阿姨开门。'}]});
  first.changes.ledger={T_VISIT:entry({林照:'已会面，仍负回程责任',周伯:'尚未回家'}),T_HISTORY:entry({林照:'第一日曾在门廊会面，作为有日期的历史说明保留'}),T_OUTSIDER:entry({陈阿姨:'仍在自家'},['陈阿姨']),T_RETURN:{...entry({林照:'答应送回',周伯:'等待回程'}),status:'active',due_unit:2}};
  for(let i=0;i<extra;i++)first.changes.ledger['T_MORE_'+String(i).padStart(2,'0')]=entry({林照:'明确日期的历史说明，不应被脚本判为错误'});
  call(root,'record',null,first);
  call(root,'plan',null,{unit:2,title:'回程',goal:'送回',change:'回到家',beats:['送回家'],cast:['林照','周伯'],setting_refs:[],research_refs:[]});
  const next=main(['record-template','--project',root,'--unit','2','--draft','正文/0002.md']);file(root,next.draft,'# 回程\n\n林照送周伯上楼，余款交回。\n');next.summary='送周伯回家，未显式更新关联会面条目';next.changes.characters={林照:'已送回',周伯:'已回家'};next.changes.ledger={T_RETURN:{status:'resolved',character_known:{林照:'已送回家',周伯:'已回家'},evidence:[{unit:2,quote:'林照送周伯上楼，余款交回。'}]}};
  return {root,next};
}
test('回程预览提示同角色未变知情条目，历史说明也只作候选，不自动判错或改状态',t=>{
  const {root,next}=setup(t),before=fs.readFileSync(path.join(root,'.writer/state.json')),snapshot=structuredClone(state(root).snapshot);
  const preview=call(root,'record-preview',null,next),hint=preview.related_unchanged_ledger;
  assert.equal(preview.ok,true);assert.equal(hint.semantic_judgment,'not-performed');assert.deepEqual(new Set(hint.candidates.map(x=>x.id)),new Set(['T_VISIT','T_HISTORY']));assert.equal(hint.omitted_count,0);assert.deepEqual(preview.findings,[]);
  assert.deepEqual(fs.readFileSync(path.join(root,'.writer/state.json')),before);assert.deepEqual(state(root).snapshot,snapshot);
  const bad={...next,source_hashes:{...next.source_hashes,'设定/文风.md':'0'.repeat(64)}};assert.equal(call(root,'record-preview',null,bad).ok,false);assert.deepEqual(fs.readFileSync(path.join(root,'.writer/state.json')),before);
  // A candidate is not a semantic gate; legitimate historical descriptions may be retained.
  call(root,'record',null,next);assert.equal(state(root).snapshot.ledger.T_VISIT.character_known.周伯,'尚未回家');assert.equal(state(root).snapshot.ledger.T_RETURN.status,'resolved');
});
test('大量关联条目预览有上限和遗漏计数，无关联变更不产生候选',t=>{
  const {root,next}=setup(t,12),before=fs.readFileSync(path.join(root,'.writer/state.json')),hint=call(root,'record-preview',null,next).related_unchanged_ledger;
  assert.equal(hint.candidate_count,14);assert.equal(hint.candidates.length,8);assert.equal(hint.omitted_count,6);assert.ok(hint.candidates.every(x=>x.characters.includes('林照')));assert.deepEqual(fs.readFileSync(path.join(root,'.writer/state.json')),before);
  const unchanged={...next,changes:{characters:{},timeline_append:[],ledger:{}}};assert.equal(call(root,'record-preview',null,unchanged).related_unchanged_ledger.candidate_count,0);assert.deepEqual(fs.readFileSync(path.join(root,'.writer/state.json')),before);
});
