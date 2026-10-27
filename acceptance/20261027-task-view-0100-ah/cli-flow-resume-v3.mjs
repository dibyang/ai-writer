import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import assert from 'node:assert/strict';import {spawnSync} from 'node:child_process';import {fileURLToPath} from 'node:url';
const base=path.dirname(fileURLToPath(import.meta.url)),repo=path.resolve(base,'../..'),pkg=path.join(repo,'.tmp/task-view-ah-extracted/ai-writer-0.10.0'),cli=path.join(pkg,'bin/ai-writer.mjs'),oldCli=path.join(repo,'.tmp/version0100-ag-extracted/ai-writer-0.10.0/bin/ai-writer.mjs');
const root=path.join(base,'scenario/任务恢复验证'),hash=b=>crypto.createHash('sha256').update(b).digest('hex');let seq=0;
const readState=p=>JSON.parse(fs.readFileSync(path.join(p,'.writer/state.json')));
function write(p,ref,v){const f=path.join(p,ref);fs.mkdirSync(path.dirname(f),{recursive:true});fs.writeFileSync(f,typeof v==='string'?v:JSON.stringify(v,null,2)+'\n');return f;}
function input(label,v){label='r3-'+label;const f=path.join(base,'inputs',label+'.json');assert.ok(!fs.existsSync(f));return write(base,'inputs/'+label+'.json',v);}
function run(label,args,{entry=cli,expected=0,env={}}={}){label='r3-'+label;const r=spawnSync(process.execPath,[path.join(base,'capture.mjs'),label,process.execPath,entry,...args],{encoding:'utf8',windowsHide:true,env:{...process.env,...env}});assert.equal(r.status,expected,r.stderr||r.stdout);if(expected===91)return null;const f=path.join(base,'commands',label,expected===2?'stderr.raw.txt':'stdout.raw.txt');return JSON.parse(fs.readFileSync(f,'utf8'));}
function tree(p){const out={};function walk(dir,rel=''){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const r=rel?rel+'/'+e.name:e.name;if(e.isDirectory())walk(path.join(dir,e.name),r);else out[r]=hash(fs.readFileSync(path.join(dir,e.name)));}}walk(p);return out;}
function task(label,p=root){const before=tree(p),v=run(label,['status','--project',p,'--view','task']);assert.equal(v.read_only,true);assert.deepEqual(tree(p),before);return v;}
const quote='合成流程验证：仅本独立副本可写1至2章、修订并重登1至2章，以及在故障注入后继续原事务；不代表真实作品授权或文学验收。';
const evidence={local_source:'研究/测试授权.md',source_sha256:hash(quote),quote,locator:'第1行合成测试约定',recorded_by:'AH synthetic CLI fixture'};
function workflow(label,stage,actions,draft_range,revise_range){const w=run(label+'-show',['workflow','show','--project',root]).workflow;w.stage=stage;w.task='独立任务视图验证';w.authorization={allowed_actions:actions,draft_range,revise_range,stop_conditions:['只做本测试范围']};return run(label,['workflow','set','--project',root,'--input',input(label,{expected_revision:readState(root).revision,operation_id:'ah-'+(++seq),workflow:w,author_evidence:evidence})]);}
const readSaved=label=>JSON.parse(fs.readFileSync(path.join(base,'commands',label,'stdout.raw.txt')));
const b=readSaved('r2-revision-begin'),baselineMain=readSaved('r2-baseline-main-status'),mainTask=readSaved('r2-main-candidate-task'),baselineCandidate=readSaved('r2-baseline-candidate-status'),candidateTask=readSaved('r2-candidate-resume-task');
for(const n of [1,2]){
  run('revision-context-'+n,['context','--project',b.workspace,'--unit',String(n)]);
  const old=readSaved('record-'+n);write(b.workspace,old.draft,`# 第${n}章\n\n阿禾逐项核对借书簿上的书名，合上簿子。\n`);
  const r=run('replay-'+n,['revision','replay-input','--project',b.workspace,'--unit',String(n),'--revision-token',b.token]);
  const report='审查/重登合成-'+n+'.md';write(b.workspace,report,'# 合成流程核对\n\n仅测试字段绑定：摘要、人物、时间线、账本、引文和下游保持本合成场景一致；不代表文学验收。\n');r.replay_review={reviewer:'synthetic fixture',report,draft_sha256:r._replay.draft_sha256,checked_fields:['summary','characters','timeline','ledger','evidence','downstream']};r.summary+='（合成修订核对）';const f=input('replay-record-'+n,r);
  run('replay-preview-'+n,['record-preview','--project',b.workspace,'--input',f,'--revision-token',b.token]);run('replay-record-'+n,['record','--project',b.workspace,'--input',f,'--revision-token',b.token]);
}
assert.equal(task('revision-finish-task',b.workspace).next.code,'review-revision');const s=readState(b.workspace);
write(b.workspace,'审查/合成流程.md','# 合成接口测试\n\n两章均为合成段落，仅验证文件、版本和恢复流程，不构成模型文学审稿或真人验收。\n');
run('review',['review','--project',b.workspace,'--revision-token',b.token,'--input',input('review',{from:1,to:2,kind:'model-self-review',report:'审查/合成流程.md',source_hashes:Object.fromEntries(s.units.map(u=>[u.draft,u.sha256]))})]);
run('prepare',['revision','prepare','--project',root,'--input',input('prepare',{id:b.id,token:b.token})]);
run('commit-interrupted',['revision','commit','--project',root,'--input',input('commit',{id:b.id,token:b.token})],{expected:91,env:{AI_WRITER_TEST_FAULT:'1',AI_WRITER_TEST_STOP_AFTER:'1'}});
run('ordinary-status-blocked',['status','--project',root],{expected:2});assert.equal(task('recovery-task').recovery_only,true);
const tx=run('revisions-for-recovery',['revision','list','--project',root]).transactions.find(x=>x.status==='applying');
run('recover',['revision','recover','--project',root,'--input',input('recover',{transaction_id:tx.id,token:b.token,direction:'complete',lock_sha256:hash(fs.readFileSync(path.join(root,'.writer/write.lock'))),author_evidence:evidence})]);
assert.equal(task('closed-candidate-task',b.workspace).next.code,'closed-candidate');assert.equal(run('check',['check','--project',root]).ok,true);
run('export',['export','--project',root,'--out',path.join(base,'draft-export')]);
const result={ok:true,registered_units:readState(root).units.length,read_only_tasks:true,stale_input_rejected:true,pause_rejected:true,revision_interruption_recovered:true,closed_candidate_redirected:true,existing_works_modified:false,
 comparison:{baseline_main_next:baselineMain.next,task_main_next:mainTask.next,baseline_candidate_next:baselineCandidate.next,task_candidate_next:candidateTask.next,task_template_command:candidateTask.input_template_command,write_command_reduction_claimed:false,thirty_percent_goal:'not established; this batch adds navigation, not automatic multi-step execution'},scope:'Synthetic actual CLI workflow, not literary acceptance'};
write(base,'cli-verification.json',result);console.log(JSON.stringify(result));
