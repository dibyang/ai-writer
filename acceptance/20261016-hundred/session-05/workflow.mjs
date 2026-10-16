import fs from 'node:fs';
import {createRunner} from '../command-runner.mjs';
const stage='acceptance/20261016-hundred/session-05',project='acceptance/20261016-hundred/works/潮汐信号';
const runner=createRunner(stage);
const cli=(label,args)=>{const r=runner.run(process.execPath,['bin/ai-writer.mjs',...args,'--project',project],label);if(r.exit_code!==0){console.error(r.stdout,r.stderr);throw Error('CLI failed; '+r.files.metadata);}return JSON.parse(r.stdout.replace(/^\uFEFF/,''));};
const [op,...args]=process.argv.slice(2);
if(op==='recall'){
 for(const id of args){const r=cli('recall-'+id,['recall','--query',id,'--limit','100']);fs.writeFileSync(stage+'/recall-'+id+'.json',JSON.stringify(r,null,2)+'\n');console.log(JSON.stringify({id,total:r.total,omitted:r.omitted,matches:r.matches.map(m=>({id:m.id,kind:m.kind,evidence:m.entry?.evidence}))}));}
}else if(op==='prepare'){
 const n=Number(args[0]);const p=JSON.parse(fs.readFileSync(stage+'/plan-'+n+'.json','utf8'));
 console.log(JSON.stringify({plan:cli('plan-'+n,['plan','--input',stage+'/plan-'+n+'.json'])}));
 const c=cli('context-'+n,['context','--unit',String(n),'--max-chars','1500000']);fs.writeFileSync(stage+'/context-'+n+'.json',JSON.stringify(c,null,2)+'\n');
 const t=cli('template-'+n,['record-template','--unit',String(n),'--draft','正文/'+String(n).padStart(4,'0')+'-'+p.title+'.md']);fs.writeFileSync(stage+'/template-'+n+'.json',JSON.stringify(t,null,2)+'\n');
 const cv={revision:c.revision,unit:c.unit,plan:c.plan,outline:c.outline,source_hashes:c.source_hashes,continuity_keys:Object.keys(c.continuity??{}),omitted_ids:c.continuity?.selection?.omitted_ids??c.continuity?.ledger_selection?.omitted_ids};
 fs.writeFileSync(stage+'/context-view-'+n+'.json',JSON.stringify(cv,null,2)+'\n');
 console.log(JSON.stringify(cv,null,2));
}else if(op==='record'){
 const n=Number(args[0]);const t=JSON.parse(fs.readFileSync(stage+'/template-'+n+'.json','utf8'));const edit=JSON.parse(fs.readFileSync(stage+'/changes-'+n+'.json','utf8'));
 const state=JSON.parse(fs.readFileSync(project+'/.writer/state.json','utf8'));const s=state.snapshot??state.current??state;
 const changes={...edit.changes};
 if(edit.character_updates){changes.characters={};for(const [name,now]of Object.entries(edit.character_updates))changes.characters[name]=`第${n}章当前：${now}；保留的有效历史（以下均为原章时点，不作当前位置）：${s.characters?.[name]??'此前无登记，首次现场登场。'}`;}
 if(edit.ledger_updates){changes.ledger={};for(const[id,update]of Object.entries(edit.ledger_updates)){const {knowledge,...fields}=update;changes.ledger[id]={...fields};if(knowledge){changes.ledger[id].character_known={};for(const[name,now]of Object.entries(knowledge)){const old=s.ledger?.[id]?.character_known?.[name];changes.ledger[id].character_known[name]=`第${n}章：${now}`+(old?`；历史有效信息（原章时点）：${old}`:'');}}}}
 const input={...t,summary:edit.summary,changes};fs.writeFileSync(stage+'/record-'+n+'.json',JSON.stringify(input,null,2)+'\n');console.log(JSON.stringify(cli('record-'+n,['record','--input',stage+'/record-'+n+'.json'])));console.log(JSON.stringify(cli('check-'+n,['check'])));
}else throw Error('Unknown operation');
