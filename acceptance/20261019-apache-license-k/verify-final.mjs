import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {identifyBuild} from '../../lib/tool-build.mjs';
const here=import.meta.dirname,root=path.resolve(here,'../..');
const json=ref=>JSON.parse(fs.readFileSync(path.join(here,ref)));
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const read=ref=>fs.readFileSync(path.join(root,ref));
const official=fs.readFileSync(path.join(here,'apache-license-2.0.txt'));
const baseline=json('baseline.json');assert.equal(sha(official),baseline.license_sha256);
assert.deepEqual(read('LICENSE.md'),official);assert.deepEqual(read('vendor/story-gate-studio/LICENSE.md'),official);
for(const ref of ['package.json','vendor/story-gate-studio/package.json','vendor/story-gate-studio/.codex-plugin/plugin.json'])assert.equal(JSON.parse(read(ref)).license,'Apache-2.0',ref);
const transition=JSON.parse(read('docs/license-transition.json')),original=JSON.parse(read('docs/source-manifest.json'));
assert.equal(sha(read('docs/source-manifest.json')),transition.historical_import_manifest_sha256);
for(const row of original.files){const change=transition.modified_imports.find(x=>x.file===row.file);if(change)assert.equal(change.import_sha256,row.sha256);assert.equal(sha(read(row.file)),change?.current_sha256??row.sha256,row.file);}
const oldSource=path.join(root,'acceptance/20261019-webnovel-reference-j/sources/package-0.8.0-v2');assert.equal(identifyBuild(oldSource).observed_content_id,'3593faa0ea76085a63d788109f3ffbb1bbdf89565f7a012bde32cce437eaf40c');
const build=identifyBuild(root),frozen=json('source-build.json');assert.equal(build.ok,true);assert.equal(build.tool_version,'0.8.1');assert.equal(build.files.length,65);assert.equal(build.observed_content_id,frozen.observed_content_id);assert.equal(identifyBuild(path.join(here,'source-0.8.1')).observed_content_id,build.observed_content_id);
const update=json('update-verification.json');assert.equal(update.ok,true);assert.equal(update.final_state_sha256,sha(fs.readFileSync(path.join(here,'update-work/.writer/state.json'))));
const engine=json('commands/engine-package/stdout.raw.txt');assert.equal(engine.verdict,'pass');
for(const ref of ['LICENSE.md','NOTICE'])assert.deepEqual(fs.readFileSync(path.join(here,'engine-package',ref)),read('vendor/story-gate-studio/'+ref));
const reports={};for(const label of ['licensing-targeted','final-regression','engine-regression','final-doctor','engine-package']){const meta=json('commands/'+label+'/result.json');assert.equal(meta.exit_code,0,label);reports[label]={exit_code:0,elapsed_ms:meta.elapsed_ms};}
function testCounts(label,expected){const text=fs.readFileSync(path.join(here,'commands',label,'stdout.raw.txt'),'utf8'),value={};for(const key of ['tests','pass','fail','skipped']){const m=text.match(new RegExp('(?:#|ℹ) '+key+' (\\d+)'));assert.ok(m,label+key);value[key]=Number(m[1]);}assert.equal(value.fail,0);assert.equal(value.tests,expected);return value;}
const regression=testCounts('final-regression',165),engineRegression=testCounts('engine-regression',29);assert.equal(regression.pass,164);assert.equal(regression.skipped,1);assert.equal(engineRegression.pass,29);
for(const label of ['prior-h-seal','prior-j-seal'])assert.equal(json('commands/'+label+'/result.json').exit_code,0,label);
const docs=['README.md','docs/attribution.md','docs/quickstart.md','docs/user-guide.md','docs/sources.md','docs/authoring-governance-design.md','docs/authoring-governance-status.md','docs/verification.md'];let links=0;
for(const ref of docs)for(const match of read(ref).toString('utf8').matchAll(/\]\(([^)]+)\)/g)){const target=match[1].replace(/^<|>$/g,'');if(/^(https?:|#)/.test(target))continue;assert.ok(fs.existsSync(path.resolve(path.dirname(path.join(root,ref)),target.split('#')[0])),ref+': '+target);links++;}
const diff=spawnSync('git',['-c','core.whitespace=cr-at-eol','diff','--check'],{cwd:root,encoding:'utf8',windowsHide:true,maxBuffer:2**20});assert.equal(diff.status,0,diff.stdout+diff.stderr);
fs.writeFileSync(path.join(here,'verification.json'),JSON.stringify({ok:true,at:new Date().toISOString(),tool_version:'0.8.1',license:'Apache-2.0',official_license_sha256:sha(official),content_id:build.observed_content_id,resources:build.files.length,modified_imports:transition.modified_imports.length,regression,engine_regression:engineRegression,commands:reports,update_proof:'update-verification.json',engine_package_includes_license_and_notice:true,original_third_party_files_unchanged:true,prior_H_J_seals_verified:true,local_links_checked:links,existing_works_modified:false,scope:'Local license/package/CLI verification, not a new novel-scale or human literary acceptance',git_committed:false,pushed:false},null,2)+'\n',{flag:'wx'});console.log(JSON.stringify({ok:true,regression,engineRegression,resources:65}));
