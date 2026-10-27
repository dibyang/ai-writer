import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {main} from '../lib/workspace.mjs';
import {fixture,workflow,begin,state,ROOT} from './protection-fixture.mjs';
const cli=(root,args)=>spawnSync(process.execPath,[path.join(ROOT,'bin/ai-writer.mjs'),...args,'--project',root],{encoding:'utf8'});

test('当前主稿漂移的恢复指引先列独立修订，不推荐被保护规则拒绝的主稿rewind',t=>{
  const {root}=fixture(t,2),file=path.join(root,'正文/0001.md');fs.appendFileSync(file,'\n锁外增加一个核对动作。\n');
  const before=fs.readFileSync(path.join(root,'.writer/state.json')),r=cli(root,['context','--unit','3']);assert.equal(r.status,2);const error=JSON.parse(r.stderr);
  assert.equal(error.code,'CONTEXT_CHANGED');assert.equal(error.recovery.from,1);assert.match(error.next_command,/revision list/,JSON.stringify(error,null,2));assert.equal(error.recovery.mode,'revision-workspace-required');assert.equal(error.recovery.through,2);assert.doesNotMatch(error.next_command,/rewind/);assert.match(error.next_action,/独立修订区/);assert.match(error.next_action,/adopt_existing_changes/);
  const status=main(['status','--project',root]);assert.equal(status.next.command,error.next_command);assert.match(status.next.action,/独立修订区/);
  const list=cli(root,['revision','list']);assert.equal(list.status,0);assert.deepEqual(fs.readFileSync(path.join(root,'.writer/state.json')),before);
  const out=cli(root,['export','--out',path.join(root,'..','blocked-export')]);assert.equal(out.status,2);assert.equal(JSON.parse(out.stderr).next_command,error.next_command);
});

test('独立修订区内漂移继续指向所属分支回退，主稿和状态不被诊断改写',t=>{
  const {root}=fixture(t,2);workflow(root,true);const branch=begin(root),before=fs.readFileSync(path.join(root,'.writer/state.json'));fs.appendFileSync(path.join(branch.workspace,'正文/0002.md'),'\n候选修改。\n');
  const r=cli(branch.workspace,['export','--out',path.join(root,'..','blocked-branch-export')]);assert.equal(r.status,2);const error=JSON.parse(r.stderr);assert.equal(error.code,'CONTEXT_CHANGED');assert.equal(error.recovery.mode,'rewind-in-workspace');assert.match(error.next_command,/rewind/);assert.ok(error.next_command.includes(branch.workspace));assert.equal(error.recovery.from,2);assert.deepEqual(fs.readFileSync(path.join(root,'.writer/state.json')),before);assert.equal(state(root).units.length,2);
});

test('缺细纲时给可执行的帮助入口，不让新用户读取一个尚不存在的输入文件',t=>{
  const {root}=fixture(t,0),before=fs.readFileSync(path.join(root,'.writer/state.json'));const r=cli(root,['context','--unit','1']);assert.equal(r.status,2);const error=JSON.parse(r.stderr);assert.equal(error.code,'PLAN_REQUIRED');assert.match(error.next_command,/plan.*--help/,JSON.stringify(error,null,2));assert.doesNotMatch(error.next_command,/plan-input\.json/);assert.equal(cli(root,['plan','--help']).status,0);assert.deepEqual(fs.readFileSync(path.join(root,'.writer/state.json')),before);
});
