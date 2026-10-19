import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {currentProtocol} from '../lib/tool-build.mjs';
import {fixture,ROOT} from './protection-fixture.mjs';

test('0.9沿用受管资源协议，旧0.7和0.8兼容；随附诊断不回退到根作者资源',t=>{
  for(const version of ['0.7.6','0.8.0','0.9.0'])assert.equal(currentProtocol(version),true);
  for(const version of ['0.6.0','0.10.0','1.0.0'])assert.equal(currentProtocol(version),false);
  const {root}=fixture(t,0),entry=path.join(root,'.writer/tool/bin/ai-writer.mjs');
  fs.unlinkSync(path.join(root,'docs/user-guide.md'));
  const run=(args,tool=entry)=>{const r=spawnSync(process.execPath,[tool,...args],{cwd:root,encoding:'utf8',windowsHide:true});return {r,value:args.includes('doctor')?JSON.parse(r.stdout):r.stdout};};
  const d=run(['doctor']);assert.equal(d.r.status,0,d.r.stderr);assert.equal(d.value.content_root,path.join(root,'.writer/tool'));assert.equal(d.value.skill_root,path.join(root,'.writer/tool/.agents/skills'));
  const h=run(['--help']);assert.equal(h.r.status,0);assert.ok(h.value.includes(path.join(root,'.writer/tool/docs/user-guide.md')));
  fs.unlinkSync(path.join(root,'.writer/tool/lib/tool-update.mjs'));
  const broken=run(['doctor','--project',root],path.join(ROOT,'bin/ai-writer.mjs'));assert.equal(broken.r.status,1);assert.ok(broken.value.errors.includes('缺少工具模块 tool-update.mjs'),JSON.stringify(broken.value));
});
