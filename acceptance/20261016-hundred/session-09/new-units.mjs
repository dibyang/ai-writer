import fs from 'node:fs';
import path from 'node:path';
import {stage,work,runner,cli} from './run-cli.mjs';
import {read,save,state,must,sha,logReading} from './ops.mjs';
const action=process.argv[2],n=Number(process.argv[3]);
if(action==='recall'){
 for(const id of process.argv.slice(3)){
  const r=must(cli(['recall','--query',id],`recall-${id}`));
  const exact=r.matches.find(m=>m.kind==='ledger'&&m.id===id);
  console.log(JSON.stringify({query:id,total:r.total,omitted:r.omitted,exact:exact?{id:exact.id,statement:exact.entry.statement,status:exact.entry.status,due_unit:exact.entry.due_unit,custody:exact.entry.custody,reader_known:exact.entry.reader_known,evidence:exact.entry.evidence}:null}));
 }
}
if(action==='prepare'){
 const p=path.join(stage,`new-inputs/${n}-plan.json`);
 must(cli(['plan','--input',p],`plan-${n}`));
 const outline=must(cli(['outline','--unit',String(n)],`outline-${n}`));save(path.join(stage,`new-inputs/${n}-outline.json`),outline);
 const context=must(cli(['context','--unit',String(n),'--max-chars','160000'],`context-${n}`));save(path.join(stage,`new-inputs/${n}-context.json`),context);
 const draft=`正文/${String(n).padStart(4,'0')}-${read(p).title}.md`;
 const template=must(cli(['record-template','--unit',String(n),'--draft',draft],`template-${n}`));save(path.join(stage,`new-inputs/${n}-template.json`),template);
 console.log(JSON.stringify({unit:n,draft,expected_revision:template.expected_revision,source_hashes:template.source_hashes,context_keys:Object.keys(context),outline},null,2));
}
if(action==='record'){
 const t=read(path.join(stage,`new-inputs/${n}-template.json`)),data=read(path.join(stage,`new-inputs/${n}-changes.json`)),s=state();
 const changes=structuredClone(data.changes);
 for(const [name,value] of Object.entries(changes.characters??{})){
  const old=s.snapshot.characters[name];
  changes.characters[name]=`第${n}章当前：${value}`+(old?`；保留有效历史（下列为原章时点，非当前位置）：${old}`:'');
 }
 for(const [id,e] of Object.entries(changes.ledger??{})){
  for(const [name,value] of Object.entries(e.character_known??{})){
   const old=s.snapshot.ledger[id]?.character_known?.[name];
   e.character_known[name]=`第${n}章：${value}`+(old?`；历史有效信息（保留原章次，非当前状态）：${old}`:'');
  }
  if(e.custody&&s.snapshot.ledger[id]?.custody&&e.custody.holder!==s.snapshot.ledger[id].custody.holder)e.previous_holder=s.snapshot.ledger[id].custody.holder;
 }
 const prose=fs.readFileSync(path.join(work,t.draft),'utf8').split(/\r?\n/).filter(l=>!/^\s*#{1,6}\s/.test(l)).join('\n');
 const han=(prose.match(/\p{Script=Han}/gu)||[]).length;
 if(han<2400||han>3200)throw Error(`Han range: ${n} ${han}`);
 const input={...t,summary:data.summary,changes};const p=path.join(stage,`new-inputs/${n}-record.json`);save(p,input);
 const r=must(cli(['record','--input',p],`record-${n}`));
 const after=state();save(path.join(stage,`new-inputs/${n}-state-after.json`),after);
 logReading(t.draft,'新章完成后完整实读与逐段知情自检，再填真实summary/changes并CLI登记',{unit:n});
 const check=must(cli(['check'],`check-${n}`));
 console.log(JSON.stringify({record:r,han,state_sha256:sha(path.join(work,'.writer/state.json')),check_findings:check.findings,pending_windows:check.rolling_review.pending_windows}));
}
if(action==='han'){
 const t=read(path.join(stage,`new-inputs/${n}-template.json`)),text=fs.readFileSync(path.join(work,t.draft),'utf8');
 console.log(JSON.stringify({unit:n,han:(text.split(/\r?\n/).filter(l=>!/^\s*#{1,6}\s/.test(l)).join('\n').match(/\p{Script=Han}/gu)||[]).length,sha256:sha(path.join(work,t.draft))}));
}
