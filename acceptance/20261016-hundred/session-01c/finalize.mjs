import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const stage=import.meta.dirname,project=path.resolve(stage,'../works/潮汐信号');
const sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const write=(p,v)=>fs.writeFileSync(p,JSON.stringify(v,null,2)+'\n','utf8');
const state=JSON.parse(fs.readFileSync(path.join(project,'.writer/state.json'),'utf8'));
const [mode,target]=process.argv.slice(2);
if(mode==='audit'){
 const initialFile=fs.readdirSync(path.join(stage,'commands')).find(n=>n.endsWith('-status-full-current.stdout.txt'));
 const initial=JSON.parse(fs.readFileSync(path.join(stage,'commands',initialFile),'utf8')).snapshot;
 const current=state.snapshot, findings=[];
 const checks={old_ledger_ids:[],old_due:[],old_statements:[],old_author_truth:[],old_evidence:[],old_character_known:[],old_custody:[],old_hot_characters:[]};
 const push=(k,id,ok)=>{checks[k].push({id,ok});if(!ok)findings.push(`${k}:${id}`);};
 const evKey=e=>JSON.stringify([e.unit,e.draft,e.sha256,e.line,e.quote]);
 for(const [id,v]of Object.entries(initial.ledger)){
  const n=current.ledger[id];push('old_ledger_ids',id,!!n);if(!n)continue;
  push('old_statements',id,n.statement===v.statement);
  if('due_unit'in v)push('old_due',id,n.due_unit===v.due_unit);
  if('author_truth'in v)push('old_author_truth',id,n.author_truth===v.author_truth);
  if(v.custody)push('old_custody',id,JSON.stringify(n.custody)===JSON.stringify(v.custody));
  const keys=new Set((n.evidence??[]).map(evKey));for(const e of v.evidence??[])push('old_evidence',`${id}:${e.unit}:${e.line}`,keys.has(evKey(e)));
  for(const [name,t]of Object.entries(v.character_known??{}))push('old_character_known',`${id}:${name}`,typeof n.character_known?.[name]==='string'&&n.character_known[name].includes(t));
 }
 for(const [name,t]of Object.entries(initial.characters))push('old_hot_characters',name,typeof current.characters[name]==='string'&&current.characters[name].includes(t));
 const baseline=JSON.parse(fs.readFileSync(path.join(stage,'baseline-hashes.json'),'utf8'));
 const original_sources=Object.entries(baseline.source_hashes).map(([ref,h])=>({ref,expected:h,current:sha(path.join(project,ref)),unchanged:sha(path.join(project,ref))===h}));
 for(const s of original_sources)if(!s.unchanged)findings.push('changed-original:'+s.ref);
 const chapters=[];for(let u=25;u<=30;u++){
  const n=fs.readdirSync(path.join(project,'正文')).find(x=>x.startsWith(String(u).padStart(4,'0')+'-'));
  const ref='正文/'+n,t=fs.readFileSync(path.join(project,ref),'utf8').replace(/^#.*\r?\n/gm,'');
  const input=JSON.parse(fs.readFileSync(path.join(stage,`unit-${u}-record.json`),'utf8'));
  const han=(t.match(/\p{Script=Han}/gu)||[]).length;
  chapters.push({unit:u,draft:ref,han,sha256:sha(path.join(project,ref)),expected_revision:input.expected_revision,recorded_revision:u===30?75:input.expected_revision+1,pre_state_sha256:input.source_hashes['.writer/state.json'],source_hashes:input.source_hashes});
  if(han<2400||han>3200)findings.push('han:'+u);
 }
 const cross_ids=['T_PUBLIC_USE','T_KEEPER_SHARE','T_PAID_WORK','T_RETURN_MONTH','T_ROUTE_COMMON','T_VOICE_CONSENT'];
 const cross_volume=cross_ids.map(id=>({id,status:current.ledger[id].status,due_unit:current.ledger[id].due_unit,introduced_unit:current.ledger[id].introduced_unit,updated_unit:current.ledger[id].updated_unit,evidence_units:[...new Set(current.ledger[id].evidence.map(e=>e.unit))]}));
 const rewindBefore=JSON.parse(fs.readFileSync(path.join(stage,'rewind30-before/state.json'),'utf8')).snapshot;
 const replay30={ids_retained:Object.keys(rewindBefore.ledger).every(id=>id in current.ledger),due_retained:Object.entries(rewindBefore.ledger).every(([id,e])=>!('due_unit'in e)||e.due_unit===current.ledger[id].due_unit),knowledge_retained:Object.entries(rewindBefore.ledger).every(([id,e])=>Object.entries(e.character_known??{}).every(([n,t])=>current.ledger[id].character_known?.[n]===t)),custody_retained:Object.entries(rewindBefore.ledger).every(([id,e])=>!e.custody||JSON.stringify(e.custody)===JSON.stringify(current.ledger[id].custody))};
 if(Object.values(replay30).some(x=>!x))findings.push('rewind-replay-preservation');
 const result={at:new Date().toISOString(),scope:'mechanical invariants only; not semantic proof',revision:state.revision,state_sha256:sha(path.join(project,'.writer/state.json')),initial_ledger_count:Object.keys(initial.ledger).length,current_ledger_count:Object.keys(current.ledger).length,checks_summary:Object.fromEntries(Object.entries(checks).map(([k,v])=>[k,{checked:v.length,pass:v.filter(x=>x.ok).length}])),checks,original_sources,chapters,han_total:chapters.reduce((a,c)=>a+c.han,0),cross_volume,rewind30_replay:replay30,custody:Object.fromEntries(Object.entries(current.ledger).filter(([,v])=>v.custody).map(([id,v])=>[id,v.custody])),findings};
 write(path.join(stage,target??'audit.json'),result);console.log(JSON.stringify({revision:result.revision,old_ledger:result.initial_ledger_count,current_ledger:result.current_ledger_count,checks:result.checks_summary,han:chapters.map(c=>[c.unit,c.han]),han_total:result.han_total,rewind30_replay:replay30,findings}));if(findings.length)process.exitCode=1;
}
if(mode==='extra-reading'){
 const refs=['大纲/续部总纲.md','设定/续部人物与场所.md','大纲/分卷/V5.json','正文/0003-蓝棉绳.md','正文/0015-他说多的那一句.md','正文/0023-留一顿饭的时间.md','正文/0024-接下去的人.md'];
 const rows=refs.map(ref=>({path:path.join(project,ref).replaceAll('\\','/'),sha256:sha(path.join(project,ref)),range:`1-${fs.readFileSync(path.join(project,ref),'utf8').split('\n').length}`,purpose:ref.startsWith('正文/')?'recall后全文回读：私约、公开前再问、授权及原物现行归宿':'新续部来源全文读取',method:'model full text read via FastCtx; hash binds version',logged_at:new Date().toISOString()}));
 const preserved=path.join(stage,'rewind30-before/正文/0030-桌子这一头.md');rows.push({path:path.join(project,'正文/0030-桌子这一头.md').replaceAll('\\','/'),sha256:sha(preserved),range:'1-84',purpose:'末次连读修前30全文，发现昨天/前天时间错误，正式回退前版本',version_preserved_as:preserved.replaceAll('\\','/'),method:'model full text read before rewind; preserved identical bytes bind that reading',logged_at:new Date().toISOString()});
 for(const row of rows)fs.appendFileSync(path.join(stage,'reading.jsonl'),JSON.stringify(row)+'\n','utf8');console.log('logged='+rows.length);
}
