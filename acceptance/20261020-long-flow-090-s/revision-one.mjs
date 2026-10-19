import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {base,work,read,state,input,run,evidence,sha} from './common.mjs';
const [phase,nText]=process.argv.slice(2),n=Number(nText),pad=String(n).padStart(4,'0'),s=p=>JSON.parse(fs.readFileSync(path.join(p,'.writer/state.json'))),j=file=>JSON.parse(fs.readFileSync(path.join(base,file))),auth=()=>({...evidence(),quote:'发现问题直接修复'});
const session=()=>j('r1-session.json'),call=(label,args,p=work,token)=>run(label,[...args,...(token?['--revision-token',token]:[])],0,p);
function reviewInput(p,impact,report){assert.ok(fs.existsSync(path.join(p,report)),'Actual reader report required');return {expected_revision:s(p).revision,author_evidence:auth(),impact,review:{report,report_sha256:sha(fs.readFileSync(path.join(p,report))),readings:impact.required_readings,conclusion:'见绑定报告；由原生Codex实读并说明原契约、新候选和旧文影响，不是脚本语义验收',unresolved:[]}};}
if(phase==='init'){
  assert.equal(state().units.length,9);const workflow=call('r1-workflow-show',['workflow','show']).workflow;fs.writeFileSync(path.join(base,'r1-workflow-before.json'),JSON.stringify(workflow,null,2)+'\n',{flag:'wx'});
  call('r1-workflow-set',['workflow','set','--input',input('r1-workflow',{expected_revision:state().revision,operation_id:'s-r1-auth',author_evidence:auth(),workflow:{...workflow,stage:'revision',task:'修复第四章空间词，澄清已消费第三卷契约，修复第八章冗余说明，完整复核4—9尾段',authorization:{allowed_actions:['discuss','plan','revise'],draft_range:null,revise_range:{from:4,to:9},stop_conditions:['完整4—9重登和实际尾段复核后提交','不直接改主稿或覆写旧哈希']}}})]);
  fs.writeFileSync(path.join(base,'volume-3-inherited.json'),read('大纲/分卷/V3.json'),{flag:'wx'});
  call('r1-freeze-old',['source','freeze','--input',input('r1-freeze-old',{expected_revision:state().revision,operation_id:'s-r1-freeze-old',ref:'大纲/分卷/V3.json',version_id:'S_V3_ORIGINAL'})]);
  call('r1-impact-baseline',['source','impact','--input',input('r1-impact-baseline',{version_id:'S_V3_ORIGINAL',from:7,mode:'baseline'})]);
}else if(phase==='baseline'){
  const analysis=j('commands/r1-impact-baseline/stdout.raw.txt').impact;
  call('r1-publish-baseline',['source','publish','--input',input('r1-publish-baseline',{...reviewInput(work,analysis,'审查/S-R1-原卷契约影响.md'),operation_id:'s-r1-publish-baseline'})]);
  call('r1-bind-old',['source','bind','--input',input('r1-bind-old',{expected_revision:state().revision,operation_id:'s-r1-bind-old',author_evidence:auth(),version_id:'S_V3_ORIGINAL',from:7,through:9})]);
  call('r1-freeze-new',['source','freeze','--input',input('r1-freeze-new',{expected_revision:state().revision,operation_id:'s-r1-freeze-new',ref:'大纲/分卷/V3.json',file:'研究/S-V3候选.json',version_id:'S_V3_CLARIFIED',previous:'S_V3_ORIGINAL'})]);
  call('r1-impact-historical',['source','impact','--input',input('r1-impact-historical',{version_id:'S_V3_CLARIFIED',from:7,mode:'historical'})]);
}else if(phase==='stage'){
  const analysis=j('commands/r1-impact-historical/stdout.raw.txt').impact;
  const pending=call('r1-stage',['source','stage','--input',input('r1-stage',{...reviewInput(work,analysis,'审查/S-R1-新卷契约影响.md'),operation_id:'s-r1-stage'})]);
  fs.writeFileSync(path.join(base,'r1-stage.json'),JSON.stringify(pending,null,2)+'\n',{flag:'wx'});
  const b=call('r1-begin',['revision','begin','--input',input('r1-begin',{expected_revision:state().revision,owner:'Codex-S-volume-and-dialogue',from:4,through:9})]);fs.writeFileSync(path.join(base,'r1-session.json'),JSON.stringify(b,null,2)+'\n',{flag:'wx'});
  call('r1-rewind',['rewind','--from','4','--expected-revision',String(s(b.workspace).revision)],b.workspace,b.token);
  call('r1-publish-historical',['source','publish','--input',input('r1-publish-historical',{expected_revision:s(b.workspace).revision,operation_id:'s-r1-publish-historical',author_evidence:auth(),impact_id:pending.impact_id})],b.workspace,b.token);
}else if(phase==='resume'){
  const b=session();call('r1-native-resume',['revision','resume','--input',input('r1-native-resume',{id:b.id,token:b.token})]);
}else if(phase==='template'){
  const b=session();assert.equal(s(b.workspace).units.length,n-1);call('r1-replay-template-'+n,['revision','replay-input','--unit',nText,'--out',`.writer/drafts/s-r1-replay-${n}.json`],b.workspace,b.token);
}else if(phase==='record'){
  const b=session(),p=b.workspace,draft=`正文/${pad}.md`,report=`审查/S-R1-重登-${pad}.md`,file=path.join(p,`.writer/drafts/s-r1-replay-${n}.json`),value=JSON.parse(fs.readFileSync(file)),details=path.join(p,`交接/S-R1-登记-${pad}.json`);
  assert.ok(fs.existsSync(path.join(p,report)));if(fs.existsSync(details))Object.assign(value,JSON.parse(fs.readFileSync(details)));
  value.replay_review={reviewer:'S native Codex informed actual reread',report,draft_sha256:sha(fs.readFileSync(path.join(p,draft))),checked_fields:['summary','characters','timeline','ledger','evidence','downstream']};
  const ref=input('r1-reviewed-'+n,value);call('r1-preview-'+n,['record-preview','--input',ref],p,b.token);call('r1-record-'+n,['record','--input',ref],p,b.token);
}else if(phase==='finish'){
  const b=session(),p=b.workspace;assert.equal(s(p).units.length,9);const report='审查/S-R1-0004-0009.md';assert.ok(fs.existsSync(path.join(p,report)));
  call('r1-review',['review','--input',input('r1-review',{from:4,to:9,kind:'model-self-review',report,source_hashes:Object.fromEntries(s(p).units.filter(u=>u.unit>=4).map(u=>[u.draft,sha(fs.readFileSync(path.join(p,u.draft)))]))})],p,b.token);
  call('r1-prepare',['revision','prepare','--input',input('r1-prepare',{id:b.id,token:b.token})]);call('r1-commit',['revision','commit','--input',input('r1-commit',{id:b.id,token:b.token})]);
  call('r1-restore-workflow',['workflow','set','--input',input('r1-restore-workflow',{expected_revision:state().revision,operation_id:'s-r1-restore-workflow',author_evidence:auth(),workflow:j('r1-workflow-before.json')})]);
  const before=read('.writer/state.json'),old=input('r1-old-nine',j('inputs/record-9.json')),refused=run('r1-old-nine-refused',['record','--input',old],2);assert.match(refused.error,/追踪修订号已变化/);assert.deepEqual(read('.writer/state.json'),before);call('r1-final-check',['check']);
}else throw Error('init | baseline | stage | resume | template N | record N | finish');
console.log(JSON.stringify({ok:true,phase,unit:n||null,main_revision:state().revision,main_registered:state().units.length}));
