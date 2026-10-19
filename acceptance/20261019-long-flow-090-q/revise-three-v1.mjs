import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import assert from 'node:assert/strict';import {spawnSync} from 'node:child_process';import {fileURLToPath} from 'node:url';
const base=path.dirname(fileURLToPath(import.meta.url)),config=JSON.parse(fs.readFileSync(path.join(base,'scenario-config.json'))),{root,work}=config,source=JSON.parse(fs.readFileSync(path.join(base,'zip-verification.json'))).extracted,cli=path.join(source,'bin/ai-writer.mjs'),capture=path.join(base,'run.mjs'),phase=process.argv[2];
const sha=b=>crypto.createHash('sha256').update(b).digest('hex'),readState=p=>JSON.parse(fs.readFileSync(path.join(p,'.writer/state.json')));
function input(name,value){const dir=path.join(base,'inputs');fs.mkdirSync(dir,{recursive:true});const file=path.join(dir,name+'.json');fs.writeFileSync(file,JSON.stringify(value,null,2)+'\n',{flag:'wx'});return file;}
function run(label,p,args,token,expected=0){const r=spawnSync(process.execPath,[capture,label,process.execPath,cli,...args,'--project',p,...(token?['--revision-token',token]:[])],{cwd:root,encoding:'utf8',windowsHide:true,timeout:120000});assert.equal(r.status,expected,r.stdout+'\n'+r.stderr);return JSON.parse(fs.readFileSync(path.join(base,'commands',label,expected?'stderr.raw.txt':'stdout.raw.txt')));}
const evidence={...config.evidence,quote:'允许修复该验证作品及工具在实跑中暴露的问题',recorded_by:'Codex Q agent-within-authorized-scope'};
if(phase==='begin'){
  assert.equal(readState(work).units.length,3);const workflow=run('rev3-workflow-show',work,['workflow','show']).workflow;
  fs.writeFileSync(path.join(base,'workflow-before-rev3.json'),JSON.stringify(workflow,null,2)+'\n',{flag:'wx'});
  const revised={...workflow,stage:'revision',task:'只修第三章时间回指和何岚获知过程，核查第三章完整尾段；未登记第四章暂存',authorization:{...workflow.authorization,allowed_actions:['discuss','plan','revise'],draft_range:null,revise_range:{from:3,to:3}}};
  run('rev3-workflow-set',work,['workflow','set','--input',input('rev3-workflow',{expected_revision:readState(work).revision,operation_id:'q-rev3-auth',author_evidence:evidence,workflow:revised})]);
  const b=run('rev3-begin',work,['revision','begin','--input',input('rev3-begin',{expected_revision:readState(work).revision,owner:'Codex-Q-third-chapter-fix',from:3,through:3})]);
  fs.writeFileSync(path.join(base,'rev3-session.json'),JSON.stringify(b,null,2)+'\n',{flag:'wx'});
  run('rev3-list',work,['revision','list']);
  run('rev3-resume',work,['revision','resume','--input',input('rev3-resume',{id:b.id,token:b.token})]);
  run('rev3-rewind',b.workspace,['rewind','--from','3','--expected-revision',String(readState(b.workspace).revision)],b.token);
  const f=path.join(b.workspace,'正文/0003.md'),old=fs.readFileSync(f,'utf8');fs.writeFileSync(path.join(base,'chapter-3-before.md'),old,{flag:'wx'});
  assert.ok(old.includes('想起昨晚何岚说的'));assert.ok(old.includes('你昨天说过的，别到时候忘了。'));
  const changed=old.replace('想起昨晚何岚说的','想起头一晚何岚说的').replace('何岚把借来的两张凳子靠墙排好，手指点了点最外面那个位置：“周伯要来，这儿能伸腿。你昨天说过的，别到时候忘了。”','林照走到柜台边，把约在店里核字的时间告诉何岚。何岚把借来的两张凳子靠墙排好，手指点了点最外面那个位置：“周伯要来，这儿能伸腿。等人来了再搬，可来不及。”');
  fs.writeFileSync(f,changed);
  run('rev3-replay-template',b.workspace,['revision','replay-input','--unit','3','--out','.writer/drafts/replay-3.json'],b.token);
  console.log(JSON.stringify({phase,workspace:b.workspace,read_required:'正文/0003.md and unchanged chapters 1-2 continuity references; write real review before complete'}));
}else if(phase==='complete'){
  const b=JSON.parse(fs.readFileSync(path.join(base,'rev3-session.json'))),draft='正文/0003.md',report='审查/0003-重登复核.md';assert.ok(fs.existsSync(path.join(b.workspace,report)),'Review after actual read required');
  const replay=JSON.parse(fs.readFileSync(path.join(b.workspace,'.writer/drafts/replay-3.json')));
  replay.changes.characters.何岚+='；经林照当面告知，已知周伯第四日下午来店核字。';
  replay.changes.ledger.T_GRID.character_known={...replay.changes.ledger.T_GRID.character_known,何岚:'第三日下午获林照当面告知：周伯第四日下午来店核字，尚未知道三格用途。'};
  replay.changes.ledger.T_GRID.evidence.push({unit:3,quote:'把约在店里核字的时间告诉何岚。'});
  replay.replay_review={reviewer:'current Codex informed full reread',report,draft_sha256:sha(fs.readFileSync(path.join(b.workspace,draft))),checked_fields:['summary','characters','timeline','ledger','evidence','downstream']};
  const ref=input('rev3-replay-reviewed',replay);assert.equal(run('rev3-preview',b.workspace,['record-preview','--input',ref],b.token).ok,true);
  run('rev3-record',b.workspace,['record','--input',ref],b.token);
  run('rev3-review',b.workspace,['review','--input',input('rev3-review',{from:3,to:3,kind:'model-self-review',report,source_hashes:{[draft]:sha(fs.readFileSync(path.join(b.workspace,draft)))}})],b.token);
  run('rev3-prepare',work,['revision','prepare','--input',input('rev3-prepare',{id:b.id,token:b.token})]);
  run('rev3-commit',work,['revision','commit','--input',input('rev3-commit',{id:b.id,token:b.token})]);
  const original=JSON.parse(fs.readFileSync(path.join(base,'workflow-before-rev3.json')));
  original.planning={positioning:{status:'draft',refs:['设定/作品定位.md'],unresolved_ids:[]},structure:{status:'draft',refs:['设定/全书大纲.md'],unresolved_ids:[]},volume:{status:'draft',refs:['大纲/分卷/V1.json','大纲/分卷/V2.json','大纲/分卷/V3.json','大纲/分卷/V4.json'],unresolved_ids:[]},outline:{status:'draft',refs:['大纲/单元/0001.json','大纲/单元/0002.json','大纲/单元/0003.json','大纲/单元/0004.json'],unresolved_ids:[]}};
  run('rev3-restore-trial',work,['workflow','set','--input',input('rev3-restore',{expected_revision:readState(work).revision,operation_id:'q-restore-trial-after-rev3',author_evidence:evidence,workflow:original})]);
  const old=JSON.parse(fs.readFileSync(path.join(work,'.writer/drafts/record-4-current.json'))),before=fs.readFileSync(path.join(work,'.writer/state.json'));
  const refused=run('rev3-old-fourth-refused',work,['record','--input',input('rev3-stale-fourth',{...old,summary:'旧模板机械拒绝探针；该输入不应登记。'})],null,2);assert.match(refused.error,/追踪修订号已变化/);assert.deepEqual(fs.readFileSync(path.join(work,'.writer/state.json')),before);
  run('context-4-after-revision',work,['context','--unit','4','--max-chars','100000','--out','.writer/drafts/context-4-after-revision.json']);
  run('template-4-after-revision',work,['record-template','--unit','4','--draft','正文/0004.md','--out','.writer/drafts/record-4-after-revision.json']);
  assert.equal(run('check-after-rev3',work,['check']).ok,true);
  console.log(JSON.stringify({phase,revision:readState(work).revision,units:readState(work).units.length}));
}else throw Error('begin | complete');
