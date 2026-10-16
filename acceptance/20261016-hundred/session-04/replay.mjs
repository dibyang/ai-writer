import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';
import {createRunner} from '../command-runner.mjs';
import {replaySnapshots,changesBetween} from '../rebuild-utils.mjs';
const S='acceptance/20261016-hundred/session-04',P='acceptance/20261016-hundred/works/潮汐信号',R=S+'/revision-r1';
const r=createRunner(S),hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const write=(p,x)=>fs.writeFileSync(p,typeof x==='string'?x:JSON.stringify(x,null,2)+'\n',{encoding:'utf8',flag:'wx'});
function cli(label,args){const z=r.run(process.execPath,['bin/ai-writer.mjs',...args,'--project',P],label);if(z.exit_code!==0)throw Error(z.stdout+z.stderr);return r.json(label);}
const[mode,arg]=process.argv.slice(2),n=Number(arg);
if(mode==='freeze'){
 fs.mkdirSync(R,{recursive:true});fs.mkdirSync(R+'/before',{recursive:true});
 const state=JSON.parse(fs.readFileSync(P+'/.writer/state.json','utf8'));
 write(R+'/before/state.json',state);
 const snaps=replaySnapshots(P,state);const rows=[];
 for(let u=43;u<=48;u++){
  const unit=state.units.find(x=>x.unit===u);const draft=unit.draft;
  fs.copyFileSync(P+'/'+draft,R+'/before/'+path.basename(draft),fs.constants.COPYFILE_EXCL);
  rows.push({unit:u,draft,sha256:hash(P+'/'+draft),journal:unit.journal});
  const desired=structuredClone(snaps[u]);
  const knowledge='；第43章新增历史知情：第21日晚，沈在何询问前亲告自己明日下午为客户先留一小时核听；何只获时间和工作种类，不获价款、客户音档或内容。';
  desired.characters['何映']+=knowledge;desired.ledger.T_KEEPER_SHARE.character_known['何映']+=knowledge;
  write(R+`/desired-${u}.json`,desired);
  for(const stem of ['plan','context','template','changes','record']){const p=S+`/${stem}-${u}.json`;if(fs.existsSync(p))fs.copyFileSync(p,R+'/before/'+path.basename(p),fs.constants.COPYFILE_EXCL);}
 }
 write(R+'/before/manifest.json',{revision:state.revision,state_sha256:hash(P+'/.writer/state.json'),drafts:rows,reason:'第43章何提前知道沈明日下午客户预留，缺少告知动作；最早43，44消费43正文及状态，后续逐章消费状态/前章，故正式回退43—48。'});
 console.log(JSON.stringify({revision:state.revision,snapshots_verified:true,drafts:rows},null,2));
}else if(mode==='prepare'){
 const plan=JSON.parse(fs.readFileSync(S+`/plan-${n}.json`,'utf8'));
 console.log(JSON.stringify(cli(`r1-plan-${n}`,['plan','--input',S+`/plan-${n}.json`])));
 const c=cli(`r1-context-${n}`,['context','--unit',String(n),'--max-chars','1500000']);write(R+`/context-${n}.json`,c);
 const draft=`正文/${String(n).padStart(4,'0')}-${plan.title}.md`;
 const t=cli(`r1-template-${n}`,['record-template','--unit',String(n),'--draft',draft]);write(R+`/template-${n}.json`,t);
 console.log(JSON.stringify({unit:n,revision:c.revision,source_hashes:c.source_hashes,cast_current:Object.fromEntries(Object.entries(c.snapshot.characters).map(([k,v])=>[k,v.split('；截至第')[0].split('；保留至')[0]])),omitted_ids:c.continuity.recall.omitted_ids},null,2));
 console.log('FULL REPLAY TEXT '+draft+' SHA256 '+hash(P+'/'+draft)+'\n'+fs.readFileSync(P+'/'+draft,'utf8')+'\nEND FULL REPLAY TEXT');
}else if(mode==='record'){
 const t=JSON.parse(fs.readFileSync(R+`/template-${n}.json`,'utf8'));
 const before=JSON.parse(fs.readFileSync(P+'/.writer/state.json','utf8')).snapshot;
 const desired=JSON.parse(fs.readFileSync(R+`/desired-${n}.json`,'utf8'));
 t.summary=JSON.parse(fs.readFileSync(S+`/changes-${n}.json`,'utf8')).summary+(n===43?' 第21日晚沈在何问前已明确告知次日下午为客户预留一小时核听，何知情来源补足。':'');
 t.changes=changesBetween(before,desired,n);
 write(R+`/record-${n}.json`,t);
 console.log(JSON.stringify(cli(`r1-record-${n}`,['record','--input',R+`/record-${n}.json`])));
 console.log(JSON.stringify(cli(`r1-check-${n}`,['check'])));
}else throw Error('Unknown mode');
