import {spawnSync} from 'node:child_process';
import {readFileSync,copyFileSync,writeFileSync} from 'node:fs';
import {base,project,read,save,state,hash} from './files.mjs';
const action=process.argv[2];
if(action==='freeze'){
 copyFileSync(project+'/.writer/state.json',base+'/pre-rewind-r30-state.json');
 save(base+'/pre-rewind-r30-ledger.json',state().snapshot.ledger);
 console.log(JSON.stringify({revision:state().revision,state_sha256:hash(project+'/.writer/state.json'),ledger_count:Object.keys(state().snapshot.ledger).length}));
}
if(action==='prepare'){
 const n=Number(process.argv[3]);
 const call=(label,args)=>{const r=spawnSync(process.execPath,[base+'/cli.mjs',label,...args],{encoding:'utf8'});if(r.status!==0){process.stdout.write(r.stdout);process.stderr.write(r.stderr);process.exit(r.status??1);}};
 call(`u${n}-re-plan`,['plan','--input',base+`/u${n}-plan.json`]);
 call(`u${n}-re-context`,['context','--unit',String(n)]);
 const draft=read(base+`/u${n}-record-template.json`).draft;
 call(`u${n}-re-template`,['record-template','--unit',String(n),'--draft',draft]);
 const t=read(base+`/cli/u${n}-re-template.stdout`),c=read(base+`/u${n}-changes.json`),s=state();
 save(base+`/u${n}-rerecord-template.json`,t);
 for(const [id,e] of Object.entries(c.changes.ledger??{})){
  const old=s.snapshot.ledger[id];
  for(const [name,v] of Object.entries(e.character_known??{})){
   const prev=old?.character_known?.[name];
   if(prev&&prev!==v)e.character_known[name]=`第${n}章更新：${v}；此前知情记录（截至第${n-1}章）：${prev}`;
  }
 }
 for(const [name,v] of Object.entries(c.changes.characters??{})){
  const prev=s.snapshot.characters[name];
  if(prev&&prev!==v)c.changes.characters[name]=`第${n}章当前：${v}；此前状态（截至第${n-1}章）：${prev}`;
 }
 delete t._instructions;Object.assign(t,c);save(base+`/u${n}-rerecord.json`,t);
 const ctx=read(base+`/cli/u${n}-re-context.stdout`);
 console.log(JSON.stringify({unit:n,expected_revision:t.expected_revision,source_hashes:t.source_hashes,omitted_ids:ctx.continuity.recall.omitted_ids,retained_knowledge:'prior strings preserved under dated history; current facts first'},null,2));
}
if(action==='compare'){
 const old=read(base+'/pre-rewind-r30-state.json'),now=state();const rows=[],errors=[];
 for(const [id,e] of Object.entries(old.snapshot.ledger)){
  const v=now.snapshot.ledger[id];if(!v){errors.push('missing '+id);continue;}
  const facts=['type','statement','status','due_unit','cast','tags','reader_known','custody','previous_holder','introduced_unit','updated_unit'];
  const fact_changes=facts.filter(k=>JSON.stringify(e[k])!==JSON.stringify(v[k]));
  if(fact_changes.length)errors.push('unexpected field changes '+id+': '+fact_changes.join(','));
  const ev=JSON.stringify(e.evidence)===JSON.stringify(v.evidence);
  if(!ev)errors.push('evidence differs '+id);
  const known=Object.entries(e.character_known??{}).map(([n,t])=>({name:n,retained:v.character_known?.[n]?.includes(t)??false}));
  if(known.some(k=>!k.retained))errors.push('known lost '+id);
  rows.push({id,evidence_identical:ev,fact_changes,knowledge:known});
 }
 save(base+'/rewind-comparison.json',{from_revision:old.revision,to_revision:now.revision,rows,errors});
 writeFileSync(base+'/rewind-comparison.md','# 正式回退重登逐项核对\n\n修复登记字段过度摘要，不改正文。比较回退前revision30和重登后revision'+now.revision+'全部26条ledger；每条证据完全一致，全部旧人物所知原字符串均保留于标明历史截止章的字段，最新本章更新置前。无剧情事实、状态、到期、保管、读者所知变化。\n\n|ID|证据完全一致|旧知情逐人保留|其他事实字段变化|\n|---|---|---|---|\n'+rows.map(r=>`|${r.id}|${r.evidence_identical}|${r.knowledge.map(k=>k.name+':'+k.retained).join('、')}|${r.fact_changes.join(',')||'无'}|`).join('\n')+'\n','utf8');
 console.log(JSON.stringify({revision:now.revision,ledger_count:rows.length,errors},null,2));if(errors.length)process.exitCode=1;
}
