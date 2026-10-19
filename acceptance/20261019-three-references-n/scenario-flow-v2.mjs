import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import assert from 'node:assert/strict';import {spawnSync} from 'node:child_process';import {fileURLToPath} from 'node:url';
const base=path.dirname(fileURLToPath(import.meta.url)),repo=path.resolve(base,'../..'),work=path.join(base,'scenario-v2/归梯样例'),stage=process.argv[2];
const cli=path.join(repo,'.tmp/参考吸收 N 最终解压/ai-writer-0.8.0/bin/ai-writer.mjs');
const write=(ref,value)=>{const f=path.join(work,ref);fs.mkdirSync(path.dirname(f),{recursive:true});fs.writeFileSync(f,typeof value==='string'?value:JSON.stringify(value,null,2)+'\n',{flag:'wx'});return f;};
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
function run(label,args,expected=0){label='final-'+label;const r=spawnSync(process.execPath,[path.join(base,'capture.mjs'),label,process.execPath,cli,...args],{encoding:'utf8',windowsHide:true,maxBuffer:16*1024*1024,timeout:120000});if(r.status!==expected)throw Error(`${label}: ${r.status} ${r.stdout} ${r.stderr}`);return JSON.parse(fs.readFileSync(path.join(base,'commands',label,expected?'stderr.raw.txt':'stdout.raw.txt'),'utf8'));}
const auth='合成测试指令：仅在本轮隔离样例中规划并试写一章日常小说《归梯》，按需要分段展开再合章回对；本章解决借物归还，保持合作关系，不造阴谋或强悬念。登记和自检完成后暂停。此为工具验证样例，不是作者真实作品或定稿。';
function authorize(paused=false){const current=run(paused?'flow-pause-show':'flow-workflow-show',['workflow','show','--project',work]);const workflow=current.workflow;workflow.stage=paused?'paused':'trial';workflow.task=paused?'样例已完成，暂停正文':'合成样例：仅试写第一章并复核登记';workflow.authorization={allowed_actions:paused?['discuss','plan']:['discuss','plan','draft'],draft_range:paused?null:{from:1,to:1},revise_range:null,stop_conditions:['第一章完成后暂停']};const input=write(`.writer/workflow-${paused?'paused':'trial'}.json`,{expected_revision:current.revision,operation_id:paused?'n-pause':'n-trial',workflow,author_evidence:{quote:auth,local_source:'.writer/synthetic-author.txt',source_sha256:sha(auth),locator:'合成验证指令全文，不代表真人作者选择',recorded_by:'Codex test fixture'}});run(paused?'flow-pause-set':'flow-workflow-set',['workflow','set','--project',work,'--input',input]);}
if(stage==='init'){
 run('flow-init',['init','--path',work,'--kind','novel','--title','归梯']);write('.writer/synthetic-author.txt',auth);authorize();
 write('设定/样例边界.md','林岚归还社区活动室木梯，老周值班。踏板已有裂缝，双方共同检查并写清现状。结尾完成归还，不设幕后阴谋，不把协作变成敌对。\n');
 const input=write('.writer/plan.json',{unit:1,title:'归梯',goal:'把借出的木梯归还并确认交接责任',change:'双方从各自防责变成愿意一起核实，归还完成',cast:['林岚','老周'],beats:['送梯并核对借条，发现裂踏板登记含混','共同检查现状，说明各自顾虑并把裂处写入记录','复核单据后完成签还并留下复印件，平静结束'],forbidden:['不造阴谋或强悬念','不把合作改成敌对','本章须完成归还，不为续写取消结果'],setting_refs:['设定/样例边界.md']});run('flow-plan',['plan','--project',work,'--input',input]);
 const packet=run('flow-context',['context','--project',work,'--unit','1','--max-chars','100000']);
 const err=run('flow-budget-blocked',['context','--project',work,'--unit','1','--max-chars','1000','--out','.writer/drafts/blocked.json'],2);assert.equal(err.code,'CONTEXT_BUDGET_EXCEEDED');assert.equal(err.context_budget.required_chars,JSON.stringify(packet).length);assert.equal(fs.existsSync(path.join(work,'.writer/drafts/blocked.json')),false);
 run('flow-template',['record-template','--project',work,'--unit','1','--draft','正文/0001-归梯.md']);
 console.log(JSON.stringify({ok:true,stage,work,context_chars:JSON.stringify(packet).length,read_skill:'current packaged writer-novel/references/chapter-delivery.md'}));
}else if(stage==='finish'){
 const tx=JSON.parse(fs.readFileSync(path.join(base,'commands/final-flow-template/stdout.raw.txt')));tx.summary='林岚与老周核对旧梯裂踏板和借条，补写共同检查记录、签还并各留一份，完成归还。';tx.changes={characters:{林岚:'木梯已归还，持交接单复印件，与老周愿意共同核实',老周:'活动室值班，收回木梯并把裂踏板标为待修'},threads:[],timeline_append:['当日下午：核对木梯现状、补写裂处、签还并留复印件'],ledger:{}};
 const input=write('.writer/record.json',tx);run('flow-preview',['record-preview','--project',work,'--input',input]);run('flow-record',['record','--project',work,'--input',input]);
 run('flow-check',['check','--project',work]);const rt=run('flow-review-template',['review-template','--project',work,'--from','1','--to','1']);write('.writer/review-template.json',rt);
 console.log(JSON.stringify({ok:true,stage,work,next:'Fill actual model reading report and review input; then seal stage.'}));
}else if(stage==='seal'){
 run('flow-review',['review','--project',work,'--input',path.join(work,'.writer/review.json')]);authorize(true);const blocked=run('flow-paused-context',['context','--project',work,'--unit','2'],2);assert.equal(blocked.code,'ACTION_OUT_OF_SCOPE');run('flow-status',['status','--project',work]);run('flow-export',['export','--project',work,'--out',path.join(base,'scenario-v2/导出')]);run('flow-final-check',['check','--project',work]);console.log(JSON.stringify({ok:true,stage,work}));
}else throw Error('init|finish|seal');
