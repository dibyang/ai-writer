import test from 'node:test';
import assert from 'node:assert/strict';
import {fixture,state,file,workflow,call,begin,rewindBranch} from './protection-fixture.mjs';
import {main} from '../lib/workspace.mjs';

test('后章只更新一人的知识时，重登最小差量保留前章已修的其他知识与原观察',t=>{
  const {root}=fixture(t,0);
  function plan(n){call(root,'plan',null,{unit:n,title:'消息',goal:'传话',change:'获知',beats:['传话'],cast:['林照','周伯','许舟'],setting_refs:[],research_refs:[]});return main(['record-template','--project',root,'--unit',String(n),'--draft',`正文/000${n}.md`]);}
  const first=plan(1);file(root,first.draft,'# 会面\n\n林照与周伯在门廊见面，约好由林照转告许舟。\n');first.summary='约好转告';first.changes.characters={林照:'在门廊',周伯:'在门廊',许舟:'尚未听见'};first.changes.ledger={K:{type:'observation',statement:'两人在门廊约好由林照转告许舟。',status:'active',cast:['林照','周伯','许舟'],reader_known:'已约好传话',character_known:{林照:'已见面',周伯:'已见面',许舟:'尚未听见'},evidence:[{unit:1,quote:'林照与周伯在门廊见面，约好由林照转告许舟。'}]}};call(root,'record',null,first);
  const second=plan(2);file(root,second.draft,'# 转述\n\n许舟听林照讲明门廊的约定。\n');second.summary='许舟获转述';second.changes.characters={许舟:'已听到约定'};second.changes.ledger={K:{character_known:{许舟:'已获林照转述'},evidence:[{unit:2,quote:'许舟听林照讲明门廊的约定。'}]}};call(root,'record',null,second);
  workflow(root,true);const branch=begin(root);rewindBranch(branch);
  const report='审查/接口验证.md';file(branch.workspace,report,'# 合成接口测试\n仅核结构化差量，不冒充模型阅读或文学判断。\n');
  function replay(n){return main(['revision','replay-input','--project',branch.workspace,'--unit',String(n),'--revision-token',branch.token]);}
  function record(input){input.replay_review={reviewer:'synthetic-interface-test',report,draft_sha256:input._replay.draft_sha256,checked_fields:['summary','characters','timeline','ledger','evidence','downstream']};call(branch.workspace,'record',null,input,branch.token);}
  const one=replay(1);one.changes.ledger.K.character_known.林照='已见面，知道应由自己转告许舟';one.changes.ledger.K.character_known.周伯='已见面，知道林照会转告许舟';record(one);
  const two=replay(2);assert.deepEqual(two.changes.ledger.K.character_known,{许舟:'已获林照转述'});assert.equal(Object.hasOwn(two.changes.ledger.K,'statement'),false);assert.equal(Object.hasOwn(two.changes.ledger.K,'type'),false);record(two);
  const final=state(branch.workspace).snapshot.ledger.K;assert.equal(final.character_known.林照,'已见面，知道应由自己转告许舟');assert.equal(final.character_known.周伯,'已见面，知道林照会转告许舟');assert.equal(final.character_known.许舟,'已获林照转述');assert.equal(final.statement,first.changes.ledger.K.statement);
});
