import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {main} from '../lib/workspace.mjs';
import {identifyBuild,packageFiles,attributionFiles,writeBuildManifest} from '../lib/tool-build.mjs';
import {fixture,ROOT} from './protection-fixture.mjs';

test('Apache许可和NOTICE随初始化及二次初始化完整携带，缺失被诊断',t=>{
  const {root,dir}=fixture(t,0);
  const refs=['LICENSE.md','NOTICE','docs/license-transition.json'];
  assert.equal(JSON.parse(fs.readFileSync(path.join(ROOT,'package.json'))).license,'Apache-2.0');
  for(const ref of refs) for(const prefix of ['', '.writer/tool/'])
    assert.deepEqual(fs.readFileSync(path.join(root,prefix,ref)),fs.readFileSync(path.join(ROOT,ref)),prefix+ref);
  assert.equal(fs.existsSync(path.join(root,'.writer/tool/vendor/story-gate-studio')),false);
  const nested=path.join(dir,'nested');
  const run=spawnSync(process.execPath,[path.join(root,'.writer/tool/bin/ai-writer.mjs'),'init','--path',nested,'--kind','essay','--title','许可随行'],{cwd:ROOT,encoding:'utf8',windowsHide:true});
  assert.equal(run.status,0,run.stderr);
  for(const ref of refs) assert.deepEqual(fs.readFileSync(path.join(nested,'.writer/tool',ref)),fs.readFileSync(path.join(ROOT,ref)),ref);
  const before=fs.readFileSync(path.join(root,'.writer/state.json'));
  fs.unlinkSync(path.join(root,'.writer/tool/NOTICE'));
  const broken=main(['doctor','--project',root]);assert.equal(broken.ok,false);
  assert.ok(broken.errors.some(message=>message.includes('NOTICE')));
  assert.deepEqual(fs.readFileSync(path.join(root,'.writer/state.json')),before);
});

test('新版识别器保留旧0.7与0.8.0资源形状，不反向要求新增NOTICE',t=>{
  const {root}=fixture(t,0),tool=path.join(root,'.writer/tool');
  for(const ref of ['NOTICE','docs/license-transition.json']) fs.unlinkSync(path.join(tool,ref));
  for(const version of ['0.7.6','0.8.0']){
    fs.unlinkSync(path.join(tool,'build-manifest.json'));
    const pkg=JSON.parse(fs.readFileSync(path.join(tool,'package.json')));pkg.version=version;
    fs.writeFileSync(path.join(tool,'package.json'),JSON.stringify(pkg,null,2)+'\n');
    writeBuildManifest(tool);
    const build=packageFiles(tool);assert.equal(build.ok,true);
    assert.equal(build.files.some(row=>row.file==='NOTICE'),false);
    assert.equal(main(['doctor','--project',root]).ok,true);
  }
  assert.ok(attributionFiles('0.8.1').includes('NOTICE'));
  assert.ok(attributionFiles('0.8.10').includes('NOTICE'));
  fs.unlinkSync(path.join(tool,'build-manifest.json'));
  const pkg=JSON.parse(fs.readFileSync(path.join(tool,'package.json')));pkg.version='0.8.1';
  fs.writeFileSync(path.join(tool,'package.json'),JSON.stringify(pkg,null,2)+'\n');
  assert.equal(identifyBuild(tool).ok,false);
});
