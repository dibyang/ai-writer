import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {buildRelease,releaseProvenance} from '../scripts/build-release.mjs';
import {ROOT} from './protection-fixture.mjs';

test('Git查询临时中断可有界重试，持续失败保留具体命令与错误且不伪造来源',()=>{
  const ok={status:0,stdout:'',stderr:''};let statusCalls=0;
  const run=args=>args[0]==='status'?(++statusCalls===1?{status:null,error:{code:'ETIMEDOUT'},stderr:''}:{...ok,stdout:'?? new-source.mjs\n'}):{...ok,stdout:args[1]==='HEAD'?'a'.repeat(40)+'\n':ROOT+'\n'};
  assert.deepEqual(releaseProvenance(ROOT,run),{source_commit:'a'.repeat(40),dirty:true});assert.equal(statusCalls,2);
  let failedCalls=0;const failed=args=>args[0]==='status'?(failedCalls++,{status:null,error:{code:'ETIMEDOUT'},stderr:'bounded test timeout'}):{...ok,stdout:args[1]==='HEAD'?'a'.repeat(40)+'\n':ROOT+'\n'};
  assert.throws(()=>releaseProvenance(ROOT,failed),/git status.*ETIMEDOUT.*bounded test timeout/);assert.equal(failedCalls,2);
  let deniedCalls=0;const denied=args=>args[0]==='status'?(deniedCalls++,{status:128,stderr:'access denied'}):{...ok,stdout:args[1]==='HEAD'?'a'.repeat(40)+'\n':ROOT+'\n'};
  assert.throws(()=>releaseProvenance(ROOT,denied),/status=128.*access denied/);assert.equal(deniedCalls,1);
});

test('发行包包含隐藏技能和完整许可，排除作品及证据，重建一致且不覆盖',t=>{
  fs.mkdirSync(path.join(ROOT,'.tmp'),{recursive:true});const dir=fs.mkdtempSync(path.join(ROOT,'.tmp/release-'));
  t.after(async()=>{assert.equal(path.dirname(fs.realpathSync(dir)),fs.realpathSync(path.join(ROOT,'.tmp')));await fs.promises.rm(dir,{recursive:true,force:true,maxRetries:12,retryDelay:150});});
  const out=path.join(dir,'first'),a=buildRelease({out}),b=buildRelease({out:path.join(dir,'second')});
  assert.equal(a.archive_sha256,b.archive_sha256,JSON.stringify({first:a.source_provenance,second:b.source_provenance}));assert.throws(()=>buildRelease({out}),/already exists/);
  const version=JSON.parse(fs.readFileSync(path.join(ROOT,'package.json'))).version;
  assert.equal(a.version,version);assert.equal(path.basename(a.archive),'ai-writer-'+version+'.zip');
  const folder=path.join(out,'ai-writer-'+version),manifest=JSON.parse(fs.readFileSync(path.join(folder,'RELEASE-MANIFEST.json')));
  assert.equal(manifest.version,version);assert.equal(JSON.parse(fs.readFileSync(path.join(folder,'package.json'))).version,version);
  for(const row of manifest.files){assert.ok(!/(^|\/)(?:works|acceptance|\.git|\.idea|\.tmp|\.writer)(\/|$)/.test(row.file),row.file);assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(folder,row.file))).digest('hex'),row.sha256);}
  for(const ref of ['.agents/skills/writer-project/SKILL.md','NOTICE','LICENSE.md','SECURITY.md','docs/quickstart.md','vendor/story-gate-studio/NOTICE'])assert.ok(fs.existsSync(path.join(folder,ref)),ref);
  const d=spawnSync(process.execPath,[path.join(folder,'bin/ai-writer.mjs'),'doctor'],{cwd:folder,encoding:'utf8',windowsHide:true});assert.equal(d.status,0,d.stderr);assert.equal(JSON.parse(d.stdout).resource_profile??manifest.resource_profile,'apache-2.0-v1');
});

test('发行版本拒绝未来协议、路径字符和未知资源配置，拒绝时不创建产物',t=>{
  fs.mkdirSync(path.join(ROOT,'.tmp'),{recursive:true});const dir=fs.mkdtempSync(path.join(ROOT,'.tmp/release-version-'));
  t.after(async()=>{assert.equal(path.dirname(fs.realpathSync(dir)),fs.realpathSync(path.join(ROOT,'.tmp')));await fs.promises.rm(dir,{recursive:true,force:true,maxRetries:12,retryDelay:150});});
  const out=path.join(dir,'output');
  for(const [version,resourceProfile] of [['0.10.0','apache-2.0-v1'],['0.9.0/../../escape','apache-2.0-v1'],['0.9.0-rc.1','apache-2.0-v1'],['0.9.0','unknown']]){
    fs.writeFileSync(path.join(dir,'package.json'),JSON.stringify({version,aiWriter:{resourceProfile}}));
    assert.throws(()=>buildRelease({root:dir,out}),/Expected a supported/);assert.equal(fs.existsSync(out),false);
  }
});
