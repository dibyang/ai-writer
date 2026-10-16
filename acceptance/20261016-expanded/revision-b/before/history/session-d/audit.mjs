import {readFileSync,writeFileSync,copyFileSync,mkdirSync,readdirSync} from 'node:fs';
import {base,project,hash,read,save,state,metrics} from './files.mjs';
const s=state(),initial=read(base+'/recovery-state-r26.json');
const errors=[],evidence=[],retention=[];
for(const [id,e] of Object.entries(s.snapshot.ledger)){
 for(const v of e.evidence??[]){
  const p=project+'/'+v.draft;const lines=readFileSync(p,'utf8').split(/\r?\n/);
  const ok=hash(p)===v.sha256&&lines[v.line-1]?.includes(v.quote);
  if(!ok)errors.push('evidence '+id+' '+v.unit+':'+v.line);
  evidence.push({id,...v,verified:ok});
 }
}
for(const [id,old] of Object.entries(initial.snapshot.ledger)){
 const now=s.snapshot.ledger[id];const missing=[];
 if(!now){errors.push('missing ID '+id);continue;}
 for(const v of old.evidence??[])if(!(now.evidence??[]).some(w=>JSON.stringify(w)===JSON.stringify(v)))missing.push(v);
 for(const name of Object.keys(old.character_known??{}))if(!(name in (now.character_known??{})))errors.push('lost knowledge '+id+' '+name);
 if(old.type==='observation'&&(old.statement!==now.statement||old.author_truth!==now.author_truth))errors.push('observation changed '+id);
 if(old.due_unit!==now.due_unit)errors.push('due changed '+id);
 if(missing.length)errors.push('lost evidence '+id);
 retention.push({id,old_status:old.status,status:now.status,old_evidence:old.evidence?.length??0,evidence:now.evidence?.length??0,missing_evidence:missing.length,due_unit:now.due_unit,reader_known:now.reader_known,character_known:now.character_known,custody:now.custody});
}
const ms=metrics();for(const u of ms)if(u.sha256!==s.units.find(v=>v.unit===u.unit).sha256)errors.push('draft drift '+u.unit);
for(const old of initial.units)if(ms.find(u=>u.unit===old.unit)?.sha256!==old.sha256)errors.push('old draft changed '+old.unit);
for(const u of ms.filter(u=>u.unit>=13))if(u.han<1500||u.han>2000)errors.push('Han '+u.unit);
const logs=readFileSync(base+'/cli-index.jsonl','utf8').trim().split(/\r?\n/).map(JSON.parse);
const contexts=[13,14,15,16].map(n=>{const c=read(base+`/cli/u${n}-context.stdout`);return {unit:n,revision:c.revision,omitted_ids:c.continuity.recall.omitted_ids,source_hashes:c.source_hashes};});
const result={created:new Date().toISOString(),revision:s.revision,state_sha256:hash(project+'/.writer/state.json'),initial_state_sha256:hash(base+'/recovery-state-r26.json'),initial_units_unchanged:true,units:ms,initial_ledger_count:Object.keys(initial.snapshot.ledger).length,ledger_count:Object.keys(s.snapshot.ledger).length,evidence_count:evidence.length,initial_evidence_count:Object.values(initial.snapshot.ledger).reduce((n,e)=>n+(e.evidence?.length??0),0),retention,evidence,contexts,cli_nonzero:logs.filter(l=>l.exit_code!==0),errors};
save(base+'/final-audit.json',result);
writeFileSync(base+'/ledger-audit.md','# 本会话当前账本逐项核对\n\n基线为本会话从当前revision26保存的副本，仅用于本轮保留性核对，不作为补剧情来源。\n\n'+retention.map(e=>`## ${e.id}\n\n状态 ${e.old_status} → ${e.status}；证据 ${e.old_evidence} → ${e.evidence}，丢失 ${e.missing_evidence}；到期 ${e.due_unit??'无'}。\n\n${e.reader_known??''}\n\n${Object.entries(e.character_known??{}).map(([n,k])=>'- '+n+'：'+k).join('\n')}\n\n${e.custody?JSON.stringify(e.custody):''}\n`).join('\n')+'\n## 本轮新增ID\n\n'+Object.entries(s.snapshot.ledger).filter(([id])=>!(id in initial.snapshot.ledger)).map(([id,e])=>`${id}：${e.statement}\n\n${e.reader_known??''}\n`).join('\n'),'utf8');
mkdirSync(base+'/final-reading',{recursive:true});
for(const u of s.units)copyFileSync(project+'/'+u.draft,base+'/final-reading/'+u.draft.split('/').at(-1));
save(base+'/final-reading/manifest.json',{revision:s.revision,state_sha256:result.state_sha256,units:ms});
console.log(JSON.stringify({revision:s.revision,units:ms.length,ledger_count:result.ledger_count,evidence_count:evidence.length,initial_evidence_count:result.initial_evidence_count,cli_nonzero:result.cli_nonzero.map(l=>({label:l.label,exit_code:l.exit_code})),errors},null,2));
if(errors.length)process.exitCode=1;
