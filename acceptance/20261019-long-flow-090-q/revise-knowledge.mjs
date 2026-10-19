import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import assert from 'node:assert/strict';import {spawnSync} from 'node:child_process';import {fileURLToPath} from 'node:url';
const base=path.dirname(fileURLToPath(import.meta.url)),{root,work,evidence}=JSON.parse(fs.readFileSync(path.join(base,'scenario-config.json'))),cli=path.join(JSON.parse(fs.readFileSync(path.join(base,'zip-verification.json'))).extracted,'bin/ai-writer.mjs'),capture=path.join(base,'run.mjs'),phase=process.argv[2];
const state=p=>JSON.parse(fs.readFileSync(path.join(p,'.writer/state.json'))),sha=b=>crypto.createHash('sha256').update(b).digest('hex');
function input(name,value){const file=path.join(base,'inputs',name+'.json');fs.writeFileSync(file,JSON.stringify(value,null,2)+'\n',{flag:'wx'});return file;}
function run(label,p,args,token){const r=spawnSync(process.execPath,[capture,label,process.execPath,cli,...args,'--project',p,...(token?['--revision-token',token]:[])],{cwd:root,encoding:'utf8',windowsHide:true,timeout:120000});assert.equal(r.status,0,r.stdout+'\n'+r.stderr);return JSON.parse(fs.readFileSync(path.join(base,'commands',label,'stdout.raw.txt')));}
const author_evidence={...evidence,quote:'允许修复该验证作品及工具在实跑中暴露的问题',recorded_by:'Codex Q agent-within-authorized-scope'};
if(phase==='begin'){
  assert.equal(state(work).units.length,5);fs.writeFileSync(path.join(base,'knowledge-before-state.json'),fs.readFileSync(path.join(work,'.writer/state.json')),{flag:'wx'});
  const workflow=run('know-workflow-show',work,['workflow','show']).workflow;fs.writeFileSync(path.join(base,'knowledge-before-workflow.json'),JSON.stringify(workflow,null,2)+'\n',{flag:'wx'});
  const revised={...workflow,stage:'revision',task:'只纠正第四至第五章登记的关联观察/物件当前知识，完整实读尾段，不改正文',authorization:{...workflow.authorization,allowed_actions:['discuss','plan','revise'],draft_range:null,revise_range:{from:4,to:5}}};
  run('know-workflow-set',work,['workflow','set','--input',input('know-workflow',{expected_revision:state(work).revision,operation_id:'q-knowledge-auth',author_evidence,workflow:revised})]);
  const b=run('know-begin',work,['revision','begin','--input',input('know-begin',{expected_revision:state(work).revision,owner:'Codex-Q-associated-knowledge',from:4,through:5})]);fs.writeFileSync(path.join(base,'knowledge-session.json'),JSON.stringify(b,null,2)+'\n',{flag:'wx'});
  run('know-resume',work,['revision','resume','--input',input('know-resume',{id:b.id,token:b.token})]);
  run('know-rewind',b.workspace,['rewind','--from','4','--expected-revision',String(state(b.workspace).revision)],b.token);
  console.log(JSON.stringify({workspace:b.workspace,read_required:['正文/0004.md','正文/0005.md'],expected_body_change:false}));
}else if(phase==='complete'){
  const b=JSON.parse(fs.readFileSync(path.join(base,'knowledge-session.json'))),report='审查/0004-0005-知识重登复核.md';assert.ok(fs.existsSync(path.join(b.workspace,report)));
  for(const n of [4,5]){
    const t=run('know-replay-'+n,b.workspace,['revision','replay-input','--unit',String(n),'--out',`.writer/drafts/knowledge-${n}.json`],b.token);delete t.output;
    const common={林照:'第一晚见三格模糊字迹，第四日亲听书写者解释为拟去地点；未独立辨清每一笔或核明全部历史。',周伯:'第四日当面认读并说明拟去的校门、雨棚、渡口，部分日期记不准；未提供完整旧片来历。'};
    const known=n===4?{...common,何岚:'第四日送货离场，没有听到三格说明，返店仅问看清没有。',许舟:'第四日送货离场，只听说认出几个，尚未知具体用途。'}:{...common,何岚:'第五日看林照便笺并听当面转述，知三格为拟去的三处，不是三次已完成；未亲见第四日认字，第二处雨棚具体位置仍不敢确认。',许舟:'第五日看林照便笺并听转述，知道三格用途、小勾属林照自己所画；未亲见第四日认字。'};
    t.changes.ledger.O_GRID={reader_known:'第一晚的三格、位置及模糊字迹观察不变；第四日新增书写者认读解释，见F_GRID_READING。用途不倒填成第一晚已知，全部旧放映日期仍未核。',character_known:known,evidence:[{unit:n,quote:n===4?'三处地方。不是三部片子，也不是谁交了三回钱。':'你们昨天没在，这些是我现在转给你们听的。'}]};
    if(n===5)t.changes.ledger.O_PROGRAM={character_known:{林照:'第五日仍保管原节目单，自己已当面核用途并向何岚许舟转述，原纸不等于自己的便笺。',何岚:'第五日听林照转述，知道所借原纸三格已有用途解释；没有亲眼辨认原纸。',许舟:'第二日只见过缠绳纸袋；第五日听林照转述三格已核用途，没有亲看原纸背面。'},evidence:[{unit:5,quote:'昨天那三个格子，还没讲给你们听。'}]};
    const draft=`正文/${String(n).padStart(4,'0')}.md`;t.replay_review={reviewer:'current Codex informed full tail reading',report,draft_sha256:sha(fs.readFileSync(path.join(b.workspace,draft))),checked_fields:['summary','characters','timeline','ledger','evidence','downstream']};
    const file=input('know-record-'+n,t);assert.equal(run('know-preview-'+n,b.workspace,['record-preview','--input',file],b.token).ok,true);run('know-record-'+n,b.workspace,['record','--input',file],b.token);
  }
  const source_hashes=Object.fromEntries([4,5].map(n=>{const ref=`正文/${String(n).padStart(4,'0')}.md`;return [ref,sha(fs.readFileSync(path.join(b.workspace,ref)))];}));
  run('know-review',b.workspace,['review','--input',input('know-review',{from:4,to:5,kind:'model-self-review',report,source_hashes})],b.token);
  run('know-prepare',work,['revision','prepare','--input',input('know-prepare',{id:b.id,token:b.token})]);run('know-commit',work,['revision','commit','--input',input('know-commit',{id:b.id,token:b.token})]);
  const workflow=JSON.parse(fs.readFileSync(path.join(base,'knowledge-before-workflow.json')));run('know-restore-trial',work,['workflow','set','--input',input('know-restore',{expected_revision:state(work).revision,operation_id:'q-knowledge-restore',author_evidence,workflow})]);
  const before=JSON.parse(fs.readFileSync(path.join(base,'knowledge-before-state.json'))),after=state(work);
  for(let i=0;i<5;i++)assert.equal(after.units[i].sha256,before.units[i].sha256,'Prose changed at unit '+(i+1));
  assert.equal(after.snapshot.ledger.O_GRID.statement,before.snapshot.ledger.O_GRID.statement);assert.match(after.snapshot.ledger.O_GRID.character_known.许舟,/第五日/);
  run('context-6-after-knowledge',work,['context','--unit','6','--max-chars','100000','--out','.writer/drafts/context-6-after-knowledge.json']);run('template-6-after-knowledge',work,['record-template','--unit','6','--draft','正文/0006.md','--out','.writer/drafts/record-6-after-knowledge.json']);
  assert.equal(run('check-after-knowledge',work,['check']).ok,true);console.log(JSON.stringify({ok:true,phase,revision:after.revision,prose_unchanged:true,observation_statement_unchanged:true}));
}else throw Error('begin | complete');
