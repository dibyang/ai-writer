import fs from 'node:fs';import {runner,cli,stage,project,hash} from './workflow.mjs';
const dir=stage+'/repair-95';const input=JSON.parse(fs.readFileSync(dir+'/template-replay.json'));const payload=JSON.parse(fs.readFileSync(dir+'/changes-before.json'));const state=JSON.parse(fs.readFileSync(project+'/.writer/state.json'));const snap=state.snapshot;
input.summary=payload.summary;input.changes=payload.changes;
input.changes.ledger.P_QIU_SINGLE_27.reader_known='27首锚及92当前实见确认保留，95何已由沈实际转述获单页区别/现存/撤回，不是92现场见证，未看原纸或照片、无取看权；中间入册日仍未知，31盒本批未开。';
input.changes.ledger.P_QIU_SINGLE_27.character_known['沈禾']='第95章：本章实际向何转述92所见的27原单页/31两页区别和现位置，何没看原纸或照片不去取看；自己亲见92取收与未拍、中间日未知的旧知保留。';
const past=(n,o)=>o?n+'；历史有效信息（以下按原章时点，不作当前状态）：'+o:n;
for(const[n,v]of Object.entries(input.changes.characters))input.changes.characters[n]=past(v,snap.characters[n]);
for(const[id,x]of Object.entries(input.changes.ledger))for(const[n,v]of Object.entries(x.character_known??{}))x.character_known[n]=past(v,snap.ledger[id]?.character_known?.[n]);
fs.writeFileSync(dir+'/record-replay.json',JSON.stringify(input,null,2)+'\n',{flag:'wx'});
const r=cli('record-95-replay-cli',['record','--input',dir+'/record-replay.json']);console.log(r.stdout);console.error(r.stderr);if(r.exit_code!==0)process.exit(r.exit_code??1);
const after=JSON.parse(fs.readFileSync(project+'/.writer/state.json'));const before=JSON.parse(fs.readFileSync(dir+'/state-before.json'));
const identity=e=>[e.unit,e.quote,e.sha256,e.draft].join('\u0000');const changes=[];
for(const[id,x]of Object.entries(before.snapshot.ledger)){
 const y=after.snapshot.ledger[id];if(!y)throw Error('Lost ID '+id);if(x.due_unit!==y.due_unit)throw Error('Changed due '+id);
 for(const e of x.evidence??[])if(!(y.evidence??[]).some(z=>identity(e)===identity(z)))throw Error('Lost evidence '+id+' '+identity(e));
 if(JSON.stringify(x)!==JSON.stringify(y))changes.push(id);
}
const proof={revision:after.revision,changed_ledger_ids:changes,ids_before:Object.keys(before.snapshot.ledger).length,ids_after:Object.keys(after.snapshot.ledger).length,all_original_evidence_preserved_by_unit_quote_version:true,due_unchanged:true,draft_unchanged:hash(project+'/正文/0095-先写今天这一页.md')===hash(dir+'/draft-95-before.md'),state_sha256:hash(project+'/.writer/state.json')};fs.writeFileSync(dir+'/verification.json',JSON.stringify(proof,null,2)+'\n');console.log(JSON.stringify(proof));
const c=cli('check-95-replay-cli',['check']);console.log(c.stdout);console.error(c.stderr);process.exitCode=c.exit_code??1;
