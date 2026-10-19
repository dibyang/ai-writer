import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fixture,workflow,begin} from './protection-fixture.mjs';

test('随附帮助和诊断定位当前包技能，根作者定制保留，修订区仍指向父包',t=>{
  const {root}=fixture(t,1),entry=path.join(root,'.writer/tool/bin/ai-writer.mjs'),custom=path.join(root,'.agents/skills/writer-project/SKILL.md');
  fs.appendFileSync(custom,'\n## 作者本地约定\n先讨论本书人物，不自动替换这份技能。\n');const customBytes=fs.readFileSync(custom);
  workflow(root,true);const branch=begin(root),before=fs.readFileSync(path.join(root,'.writer/state.json'));
  const run=args=>{const r=spawnSync(process.execPath,[entry,...args],{encoding:'utf8',cwd:root});assert.equal(r.status,0,r.stderr);return JSON.parse(r.stdout);};
  for(const project of [root,branch.workspace]){
    const d=run(['doctor','--project',project]);assert.equal(d.ok,true,JSON.stringify(d));
    assert.equal(d.skill_root,path.join(root,'.writer/tool/.agents/skills'));
    assert.equal(d.project_skill_root,path.join(root,'.agents/skills'));
    assert.equal(d.content_root,path.join(root,'.writer/tool'));
    assert.ok(fs.existsSync(path.join(d.skill_root,'writer-project/SKILL.md')));
    assert.notDeepEqual(fs.readFileSync(path.join(d.skill_root,'writer-project/SKILL.md')),customBytes);
    assert.match(d.resource_note,/作者/);assert.match(d.resource_note,/定制/);
  }
  const h=run(['--help']).help;assert.ok(h.includes(path.join(root,'.writer/tool/.agents/skills/writer-project/SKILL.md')),h);assert.match(h,/作者/);
  assert.deepEqual(fs.readFileSync(custom),customBytes);assert.deepEqual(fs.readFileSync(path.join(root,'.writer/state.json')),before);
});
