import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {base,work,read,state,input,run,evidence,sha} from './common.mjs';
const [phase,nText]=process.argv.slice(2),n=Number(nText),pad=String(n).padStart(4,'0'),j=ref=>JSON.parse(fs.readFileSync(path.join(base,ref))),s=p=>JSON.parse(fs.readFileSync(path.join(p,'.writer/state.json'))),auth=()=>({...evidence(),quote:'发现问题直接修复'}),call=(label,args,p=work,token)=>run(label,[...args,...(token?['--revision-token',token]:[])],0,p);
if(phase==='begin'){
  assert.equal(state().units.length,12);const w=call('r2-workflow-show',['workflow','show']).workflow;fs.writeFileSync(path.join(base,'r2-workflow-before.json'),JSON.stringify(w,null,2)+'\n',{flag:'wx'});
  call('r2-workflow-set',['workflow','set','--input',input('r2-workflow',{expected_revision:state().revision,operation_id:'s-r2-auth',author_evidence:auth(),workflow:{...w,stage:'revision',task:'核第十章电话知情及指代，修B-DATA-01关联条目过期知识，完整10—12重登并连读7—12',authorization:{allowed_actions:['discuss','plan','revise'],draft_range:null,revise_range:{from:10,to:12},stop_conditions:['完整尾段核查后提交，不直接改主稿']}}})]);
  const b=call('r2-begin',['revision','begin','--input',input('r2-begin',{expected_revision:state().revision,owner:'Codex-S-phone-knowledge',from:10,through:12})]);fs.writeFileSync(path.join(base,'r2-session.json'),JSON.stringify(b,null,2)+'\n',{flag:'wx'});
  call('r2-resume',['revision','resume','--input',input('r2-resume',{id:b.id,token:b.token})]);call('r2-rewind',['rewind','--from','10','--expected-revision',String(s(b.workspace).revision)],b.workspace,b.token);
}else if(phase==='template'){
  const b=j('r2-session.json');assert.equal(s(b.workspace).units.length,n-1);call('r2-template-'+n,['revision','replay-input','--unit',nText,'--out',`.writer/drafts/s-r2-replay-${n}.json`],b.workspace,b.token);
}else if(phase==='record'){
  const b=j('r2-session.json'),p=b.workspace,value=JSON.parse(fs.readFileSync(path.join(p,`.writer/drafts/s-r2-replay-${n}.json`))),over=path.join(p,`交接/S-R2-登记-${pad}.json`),report=`审查/S-R2-重登-${pad}.md`;if(fs.existsSync(over))Object.assign(value,JSON.parse(fs.readFileSync(over)));assert.ok(fs.existsSync(path.join(p,report)));
  value.replay_review={reviewer:'S native Codex actual informed reread',report,draft_sha256:sha(fs.readFileSync(path.join(p,`正文/${pad}.md`))),checked_fields:['summary','characters','timeline','ledger','evidence','downstream']};const file=input('r2-reviewed-'+n,value);call('r2-preview-'+n,['record-preview','--input',file],p,b.token);call('r2-record-'+n,['record','--input',file],p,b.token);
}else if(phase==='finish'){
  const b=j('r2-session.json'),p=b.workspace;assert.equal(s(p).units.length,12);const report='审查/S-R2-0007-0012.md';assert.ok(fs.existsSync(path.join(p,report)));
  call('r2-review',['review','--input',input('r2-review',{from:7,to:12,kind:'model-self-review',report,source_hashes:Object.fromEntries(s(p).units.filter(u=>u.unit>=7).map(u=>[u.draft,sha(fs.readFileSync(path.join(p,u.draft)))]))})],p,b.token);
  call('r2-prepare',['revision','prepare','--input',input('r2-prepare',{id:b.id,token:b.token})]);call('r2-commit',['revision','commit','--input',input('r2-commit',{id:b.id,token:b.token})]);
  call('r2-restore',['workflow','set','--input',input('r2-restore',{expected_revision:state().revision,operation_id:'s-r2-restore',author_evidence:auth(),workflow:j('r2-workflow-before.json')})]);
  const before=read('.writer/state.json'),error=run('r2-old-twelve-refused',['record','--input',input('r2-old-twelve',j('inputs/record-12.json'))],2);assert.match(error.error,/追踪修订号已变化/);assert.deepEqual(read('.writer/state.json'),before);call('r2-final-check',['check']);
}else throw Error('begin | template N | record N | finish');
console.log(JSON.stringify({ok:true,phase,unit:n||null,main_revision:state().revision,registered:state().units.length}));
