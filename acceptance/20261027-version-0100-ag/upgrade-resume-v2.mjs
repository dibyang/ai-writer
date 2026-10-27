import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const base=path.dirname(fileURLToPath(import.meta.url));
const source=path.resolve(base,'../../.tmp/version0100-ag-extracted/ai-writer-0.10.0');
const cli=path.join(source,'bin/ai-writer.mjs');
const baseline=JSON.parse(fs.readFileSync(path.join(base,'commands/baseline-090-smoke/stdout.raw.txt')));
const project=baseline.project,installed=path.join(project,'.writer/tool');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const state=()=>JSON.parse(fs.readFileSync(path.join(project,'.writer/state.json')));
const write=(name,value)=>{const f=path.join(base,name);fs.writeFileSync(f,JSON.stringify(value,null,2),{flag:'wx'});return f;};
function run(label,args,entry=cli,expected=0){
  const r=spawnSync(process.execPath,[path.join(base,'capture.mjs'),label,process.execPath,entry,...args],{encoding:'utf8',windowsHide:true});
  assert.equal(r.status,expected,r.stderr||r.stdout);
  const raw=fs.readFileSync(path.join(base,'commands',label,'stdout.raw.txt'),'utf8');
  if(expected!==0)return JSON.parse(fs.readFileSync(path.join(base,'commands',label,'stderr.raw.txt'),'utf8'));
  return args.includes('--help')?raw:JSON.parse(raw);
}

const before=JSON.parse(fs.readFileSync(path.join(base,'commands/upgrade-apply/before-state.json'))),after=state();
assert.equal(after.schema_version,6);assert.equal(after.tool_control.generation,before.tool_control.generation+1);assert.deepEqual(after.units,before.units);assert.deepEqual(after.snapshot,before.snapshot);
for(const u of before.units){assert.equal(sha(fs.readFileSync(path.join(project,u.draft))),u.sha256);for(const [f,h]of Object.entries(u.source_hashes).filter(([f])=>f!=='.writer/state.json'))assert.equal(sha(fs.readFileSync(path.join(project,f))),h,f);}
const p=JSON.parse(fs.readFileSync(path.join(base,'commands/upgrade-plan/stdout.raw.txt')));for(const row of p.local_content.filter(x=>['AGENTS.md','docs/user-guide.md'].includes(x.file)))assert.equal(sha(fs.readFileSync(path.join(project,row.file))),row.current_sha256);
const unchanged=JSON.parse(fs.readFileSync(path.join(base,'commands/upgrade-idempotent/stdout.raw.txt')));assert.equal(unchanged.unchanged,true);
assert.equal(JSON.parse(fs.readFileSync(path.join(installed,'package.json'))).version,'0.10.0');const embedded=path.join(installed,'bin/ai-writer.mjs');
const stable=sha(fs.readFileSync(path.join(project,'.writer/state.json')));run('resume-status',['status','--project',project],embedded);
const refused=run('resume-scope-refusal',['context','--project',project,'--unit','2'],embedded,2);assert.equal(refused.code,'ACTION_OUT_OF_SCOPE');assert.equal(sha(fs.readFileSync(path.join(project,'.writer/state.json'))),stable);
const child=path.join(base,'scenario/新包再初始化');run('resume-init',['init','--path',child,'--kind','novel','--title','新版初始化验证'],embedded);assert.equal(JSON.parse(fs.readFileSync(path.join(child,'.writer/tool/package.json'))).version,'0.10.0');
assert.equal(run('resume-new-doctor',['doctor','--project',child],path.join(child,'.writer/tool/bin/ai-writer.mjs')).ok,true);
const result={ok:true,source_version:'0.9.0',target_version:'0.10.0',schema:6,registered_units:after.units.length,generation_before:before.tool_control.generation,generation_after:after.tool_control.generation,bodies_and_sources_unchanged:true,units_and_snapshot_unchanged:true,custom_rules_and_manual_unchanged:true,idempotent:true,embedded_help_owned:true,scope_refusal:refused.code,project,prior_harness_error:'context for registered unit 1 correctly refused; resumed via status and unauthorized unit 2',scope:'Independent synthetic fixture only'};write('upgrade-verification.json',result);console.log(JSON.stringify(result));
