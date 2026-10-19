import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {buildRelease} from '../scripts/build-release.mjs';
import {ROOT} from './protection-fixture.mjs';

test('发行包包含隐藏技能和完整许可，排除作品及证据，重建一致且不覆盖',t=>{
  fs.mkdirSync(path.join(ROOT,'.tmp'),{recursive:true});const dir=fs.mkdtempSync(path.join(ROOT,'.tmp/release-'));
  t.after(async()=>{assert.equal(path.dirname(fs.realpathSync(dir)),fs.realpathSync(path.join(ROOT,'.tmp')));await fs.promises.rm(dir,{recursive:true,force:true,maxRetries:12,retryDelay:150});});
  const out=path.join(dir,'first'),a=buildRelease({out}),b=buildRelease({out:path.join(dir,'second')});
  assert.equal(a.archive_sha256,b.archive_sha256);assert.throws(()=>buildRelease({out}),/already exists/);
  const folder=path.join(out,'ai-writer-0.8.0'),manifest=JSON.parse(fs.readFileSync(path.join(folder,'RELEASE-MANIFEST.json')));
  for(const row of manifest.files){assert.ok(!/(^|\/)(?:works|acceptance|\.git|\.idea|\.tmp|\.writer)(\/|$)/.test(row.file),row.file);assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(folder,row.file))).digest('hex'),row.sha256);}
  for(const ref of ['.agents/skills/writer-project/SKILL.md','NOTICE','LICENSE.md','SECURITY.md','docs/quickstart.md','vendor/story-gate-studio/NOTICE'])assert.ok(fs.existsSync(path.join(folder,ref)),ref);
  const d=spawnSync(process.execPath,[path.join(folder,'bin/ai-writer.mjs'),'doctor'],{cwd:folder,encoding:'utf8',windowsHide:true});assert.equal(d.status,0,d.stderr);assert.equal(JSON.parse(d.stdout).resource_profile??manifest.resource_profile,'apache-2.0-v1');
});
