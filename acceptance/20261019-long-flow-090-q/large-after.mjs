import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import assert from 'node:assert/strict';import {spawnSync} from 'node:child_process';import {fileURLToPath} from 'node:url';
const base=path.dirname(fileURLToPath(import.meta.url)),root=path.resolve(base,'../..'),source=JSON.parse(fs.readFileSync(path.join(base,'zip-verification.json'))).extracted,cli=path.join(source,'bin/ai-writer.mjs'),work=path.join(base,'large-registration-after'),capture=path.join(base,'run.mjs');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
function input(name,value){const file=path.join(base,'large-'+name+'.json');fs.writeFileSync(file,JSON.stringify(value,null,2)+'\n',{flag:'wx'});return file;}
function run(name,args,expected=0){const label='large-after-'+name,r=spawnSync(process.execPath,[capture,label,process.execPath,cli,...args],{cwd:root,encoding:'utf8',windowsHide:true,timeout:120000});assert.equal(r.status,expected,r.stdout+'\n'+r.stderr);return JSON.parse(fs.readFileSync(path.join(base,'commands',label,expected?'stderr.raw.txt':'stdout.raw.txt')));}
run('init',['init','--path',work,'--kind','novel','--title','容量流程验证']);
for(const name of ['作品定位','文风','权威规则'])fs.writeFileSync(path.join(work,'设定',name+'.md'),'# Synthetic size probe\n'+name+'\n'+'x'.repeat(350000));
const author='仅对此独立容量样例授权试写并登记一个单元。';fs.writeFileSync(path.join(work,'研究/容量范围.md'),author+'\n');
const s=()=>JSON.parse(fs.readFileSync(path.join(work,'.writer/state.json'))),evidence={local_source:'研究/容量范围.md',source_sha256:sha(fs.readFileSync(path.join(work,'研究/容量范围.md'))),quote:author,locator:'synthetic-capacity-probe',recorded_by:'Codex Q'};
const workflow=run('workflow-show',['workflow','show','--project',work]).workflow;workflow.stage='trial';workflow.task='容量样例一单元';workflow.authorization={allowed_actions:['discuss','plan','draft'],draft_range:{from:1,to:1},revise_range:null,stop_conditions:['一单元后停止']};
run('workflow',['workflow','set','--project',work,'--input',input('workflow',{expected_revision:s().revision,operation_id:'q-capacity-workflow',author_evidence:evidence,workflow})]);
run('plan',['plan','--project',work,'--input',input('plan',{unit:1,title:'归还',goal:'归还杯子',change:'杯子回到桌上',beats:['归还杯子']})]);
const blocked=run('default-budget',['context','--project',work,'--unit','1'],2);assert.equal(blocked.code,'CONTEXT_BUDGET_EXCEEDED');
const full=run('expanded',['context','--project',work,'--unit','1','--max-chars','2000000','--out','.writer/drafts/large-context.json']);assert.ok(JSON.stringify(full).length>1000000);
const t=run('template',['record-template','--project',work,'--unit','1','--draft','正文/0001.md','--out','.writer/drafts/record.json']);delete t.output;
fs.writeFileSync(path.join(work,t.draft),'# 归还\n\n林照把杯子放回桌上。\n');t.summary='林照把杯子放回桌上。';
const before=fs.readFileSync(path.join(work,'.writer/state.json'));
const bad={...t,source_hashes:{...t.source_hashes,'设定/文风.md':'0'.repeat(64)}};const refused=run('stale-source',['record','--project',work,'--input',input('bad-record',bad)],2);assert.match(refused.error,/上下文来源已变化/);assert.deepEqual(fs.readFileSync(path.join(work,'.writer/state.json')),before);
const ref=input('record',t);assert.equal(run('preview',['record-preview','--project',work,'--input',ref]).ok,true);assert.equal(run('record',['record','--project',work,'--input',ref]).ok,true);assert.equal(run('check',['check','--project',work]).ok,true);assert.equal(run('doctor',['doctor','--project',work]).ok,true);
fs.writeFileSync(path.join(base,'large-registration-after.json'),JSON.stringify({ok:true,entry:cli,schema:s().schema_version,context_chars:JSON.stringify(full).length,template_after_expansion:true,stale_source_refused:true,recorded_units:s().units.length,scope:'Generated size-only fixture, not literary material.'},null,2)+'\n',{flag:'wx'});console.log('Final extracted package: large context, template, stale-source refusal, preview, record, check and doctor passed');
