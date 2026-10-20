import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {base,work,read,state,save,input,run,evidence,sha} from './common.mjs';
const [phase,nText]=process.argv.slice(2),n=Number(nText);
const j=ref=>JSON.parse(fs.readFileSync(path.join(base,ref),'utf8'));
const bs=p=>JSON.parse(fs.readFileSync(path.join(p,'.writer/state.json'),'utf8'));
const session=()=>j('r1-session.json');
const call=(label,args,p=work,token)=>run(label,[...args,...(token?['--revision-token',token]:[])],0,p);
function diff(a,b,at=[]){if(JSON.stringify(a)===JSON.stringify(b))return[];if(a&&b&&typeof a==='object'&&typeof b==='object'&&Array.isArray(a)===Array.isArray(b))return [...new Set([...Object.keys(a),...Object.keys(b)])].flatMap(k=>diff(a[k],b[k],[...at,k]));return [{at,before:a,after:b}];}
if(phase==='begin'){
  assert.equal(j('commands/codex-c-first/result.json').exit_code,0);assert.equal(state().units.length,24);
  save('r1-before.json',{revision:state().revision,state_sha256:sha(read('.writer/state.json')),snapshot:state().snapshot,units:state().units,bodies:state().units.map(u=>({unit:u.unit,ref:u.draft,sha256:sha(read(u.draft))})),parts:[1,2].map(i=>{const ref=`分段/0025/part-0${i}.md`;return {ref,sha256:sha(read(ref))};})});
  const w=call('r1-workflow-show',['workflow','show']).workflow;save('r1-workflow-before.json',w);
  call('r1-workflow-set',['workflow','set','--input',input('r1-workflow',{expected_revision:state().revision,operation_id:'t-r1-controlled-three-points',author_evidence:{...evidence(),quote:'发现问题直接修复'},workflow:{...w,stage:'revision',task:'T测试副本内多点旧章受控改稿，验证15—24完整尾段连续性与25中断来源保护',authorization:{allowed_actions:['discuss','plan','revise'],draft_range:null,revise_range:{from:15,to:24},stop_conditions:['三个普通事实按已核选项修订，不改原始observation','逐章实读重登15—24，完整尾段复核','主稿保持到父会话核差异后正式提交，不写25']}}})]);
  const b=call('r1-begin',['revision','begin','--input',input('r1-begin',{expected_revision:state().revision,owner:'Codex-T-controlled-multipoint-revision',from:15,through:24})]);save('r1-session.json',b);
  call('r1-rewind',['rewind','--from','15','--expected-revision',String(bs(b.workspace).revision)],b.workspace,b.token);
}else if(phase==='template'){
  const b=session();assert.equal(bs(b.workspace).units.length,n-1);call('r1-template-'+n,['revision','replay-input','--unit',nText,'--out',`.writer/drafts/t-r1-replay-${n}.json`],b.workspace,b.token);
}else if(phase==='preview'){
  const b=session(),v=JSON.parse(fs.readFileSync(path.join(b.workspace,`.writer/drafts/t-r1-replay-${n}.json`),'utf8'));
  for(const patch of j(`r1-record-edits-${n}.json`)){assert.ok(['summary','changes'].includes(patch.at[0]));assert.ok(patch.at.every(k=>!['__proto__','prototype','constructor'].includes(k)));let t=v;for(const k of patch.at.slice(0,-1))t=t[k];const k=patch.at.at(-1);if(Object.hasOwn(patch,'value'))t[k]=patch.value;else{assert.equal(typeof t[k],'string');assert.equal(t[k].split(patch.old).length-1,1,patch.old);t[k]=t[k].replace(patch.old,patch.new);}}
  const checked=j(`r1-read-review-${n}.json`),body=fs.readFileSync(path.join(b.workspace,v.draft)),report=fs.readFileSync(path.join(b.workspace,checked.report),'utf8');assert.ok(report.includes(sha(body)),'report must bind actual current candidate body');assert.deepEqual([...checked.checked_fields].sort(),['summary','characters','timeline','ledger','evidence','downstream'].sort());
  v.replay_review={reviewer:'T native Codex actual full candidate read; model self review',report:checked.report,draft_sha256:sha(body),checked_fields:checked.checked_fields};
  call('r1-preview-'+n,['record-preview','--input',input('r1-reviewed-'+n,v)],b.workspace,b.token);
}else if(phase==='record'){
  const b=session();call('r1-record-'+n,['record','--input',path.join(base,'inputs',`r1-reviewed-${n}.json`)],b.workspace,b.token);
}else if(phase==='diff'){
  const b=session(),s=bs(b.workspace);save('r1-semantic-diff.json',{main_unchanged:sha(read('.writer/state.json'))===j('commands/r1-begin/result.json').after_state_sha256,snapshot:diff(j('r1-before.json').snapshot,s.snapshot),units:s.units.map(u=>({unit:u.unit,sha256:u.sha256,summary:u.summary})),candidate_revision:s.revision});
}else if(phase==='review'){
  const b=session(),s=bs(b.workspace);assert.equal(s.units.length,24);const report='审查/T-R1-0015-0024.md';assert.ok(fs.existsSync(path.join(b.workspace,report)));call('r1-review',['review','--input',input('r1-review',{from:15,to:24,kind:'model-self-review',report,source_hashes:Object.fromEntries(s.units.filter(u=>u.unit>=15).map(u=>[u.draft,sha(fs.readFileSync(path.join(b.workspace,u.draft)))]))})],b.workspace,b.token);
}else throw Error('begin | template N | preview N | record N | diff | review');
console.log(JSON.stringify({ok:true,phase,unit:n||null,main_revision:state().revision}));
