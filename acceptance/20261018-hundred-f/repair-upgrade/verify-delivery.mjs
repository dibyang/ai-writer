import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {BASE,ROOT,session,sha,readJSON} from '../session-support.mjs';
const s=session('repair-upgrade'), stage=s.stage, b=readJSON(path.join(stage,'baseline.json')),handoff=readJSON(path.join(stage,'handoff.json'));
let body=0,custom=0;
for(const row of b.body){assert.ok(fs.readFileSync(path.join(stage,'baseline/bodies',row.path)).equals(fs.readFileSync(path.join(s.project,'正文',row.path))));body++;}
for(const row of b.custom){assert.ok(fs.readFileSync(path.join(stage,'baseline/custom',row.path)).equals(fs.readFileSync(path.join(s.project,row.path))));custom++;}
for(const row of b.main)assert.equal(sha(fs.readFileSync(path.join(ROOT,row.path))),row.sha256);
for(const [root,rows] of Object.entries(b.sources))for(const row of rows)assert.equal(sha(fs.readFileSync(path.join(BASE,'sources',root,row.path))),row.sha256);
for(const row of readJSON(path.join(stage,'artifact-index.json')))assert.equal(sha(fs.readFileSync(path.join(stage,row.path))),row.sha256);
assert.equal(sha(fs.readFileSync(path.join(s.project,'.writer/state.json'))),handoff.state_sha256);
assert.deepEqual(s.state().units,readJSON(path.join(stage,'baseline/units.json')));assert.deepEqual(s.state().snapshot,readJSON(path.join(stage,'baseline/snapshot.json')));
s.write('driver-final.snapshot.mjs',fs.readFileSync(path.join(BASE,'repair-upgrade-run.mjs')));
const result={ok:true,checked_at:new Date().toISOString(),body_files_byte_equal:body,custom_files_byte_equal:custom,main_tracked_files_unchanged:b.main.length,frozen_sources_unchanged:true,artifacts_sha_match:true,final_state_sha_match:true,state_sha256:handoff.state_sha256,revision:handoff.revision,generation:handoff.generation,formal_acceptance:false};s.write('delivery-verification.json',result);console.log(JSON.stringify(result));
