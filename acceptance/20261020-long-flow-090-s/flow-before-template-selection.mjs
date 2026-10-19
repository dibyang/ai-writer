import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {base,work,read,json,state,input,run,sha} from './common.mjs';
const [action,nText]=process.argv.slice(2),n=Number(nText),pad=String(n).padStart(4,'0');
if(action==='prepare'){
  assert.equal(state().units.length,n-1);assert.ok(n>=7&&n<=18);
  const plan=JSON.parse(fs.readFileSync(path.join(base,'plans.json'))).find(p=>p.unit===n);
  run('plan-'+n,['plan','--input',input('plan-'+n,{...plan,arc_id:'A'+Math.ceil(n/3),setting_refs:['设定/S轮续篇骨架.md'],research_refs:[],forbidden:['不逆改三格原观察','不将原片写成第六晚已播','不把旧片全史判已核完']})]);
  run('context-'+n,['context','--unit',nText,'--max-chars','180000','--out',`.writer/drafts/s-context-${n}.json`]);
  run('template-'+n,['record-template','--unit',nText,'--draft',`正文/${pad}.md`,'--out',`.writer/drafts/s-record-${n}.json`]);
}else if(action==='record'){
  assert.equal(state().units.length,n-1);const draft=`正文/${pad}.md`,body=read(draft).toString('utf8'),details=json(`交接/登记-${pad}.json`),template=json(`.writer/drafts/s-record-${n}.json`);
  const chars=[...body.replace(/^#.*$/gm,'').matchAll(/\p{Script=Han}/gu)].length;assert.ok(chars>=(n===7||n===13?7500:3500),`Chapter ${n} too short: ${chars}`);
  const segments=fs.readdirSync(path.join(work,'分段',pad)).filter(x=>/^part-\d+\.md$/.test(x)).sort().map(x=>read(`分段/${pad}/${x}`).toString('utf8'));
  assert.equal(body,segments.join('\n\n'),'Final chapter must equal ordered segments; preserve originals if editing');
  const value={...template,...details};assert.equal(run('preview-'+n,['record-preview','--input',input('preview-'+n,value)]).ok,true);run('record-'+n,['record','--input',input('record-'+n,value)]);run('check-'+n,['check']);
  fs.writeFileSync(path.join(base,`chapter-${n}-metrics.json`),JSON.stringify({unit:n,han:chars,bytes:Buffer.byteLength(body),sha256:sha(read(draft)),segments:segments.length},null,2)+'\n',{flag:'wx'});
}else if(action==='review'){
  const from=Math.max(1,n-5),hashes=Object.fromEntries(state().units.filter(u=>u.unit>=from&&u.unit<=n).map(u=>[u.draft,sha(read(u.draft))]));
  run('review-'+n,['review','--input',input('review-'+n,{from,to:n,kind:'model-self-review',report:`审查/S-${String(from).padStart(4,'0')}-${pad}.md`,source_hashes:hashes})]);
}else throw Error('prepare N | record N | review N');
console.log(JSON.stringify({ok:true,action,unit:n,revision:state().revision,registered:state().units.length}));
