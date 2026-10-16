import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';
import {createRunner} from '../command-runner.mjs';
const S='acceptance/20261016-hundred/session-04',P='acceptance/20261016-hundred/works/潮汐信号';
const r=createRunner(S);const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const write=(p,x)=>fs.writeFileSync(p,typeof x==='string'?x:JSON.stringify(x,null,2)+'\n',{encoding:'utf8',flag:'wx'});
function cli(label,args){let z=r.run(process.execPath,['bin/ai-writer.mjs',...args,'--project',P],label);if(z.exit_code!==0){console.error(z.stdout,z.stderr);throw Error('CLI failed '+label);}return r.json(label);}
const [mode,num,...rest]=process.argv.slice(2);const n=Number(num);
if(mode==='prepare'){
 const input=`${S}/plan-${n}.json`;const plan=JSON.parse(fs.readFileSync(input,'utf8'));
 const a=cli(`plan-${n}`,['plan','--input',input]);
 const c=cli(`context-${n}`,['context','--unit',String(n),'--max-chars','1500000']);write(`${S}/context-${n}.json`,c);
 const draft=`正文/${String(n).padStart(4,'0')}-${plan.title}.md`;
 const t=cli(`template-${n}`,['record-template','--unit',String(n),'--draft',draft]);write(`${S}/template-${n}.json`,t);
 console.log(JSON.stringify({plan:a,context_keys:Object.keys(c),template:t},null,2));
}else if(mode==='context-view'){
 const c=JSON.parse(fs.readFileSync(`${S}/context-${n}.json`,'utf8'));
 const slim=(v)=>typeof v==='string'?v.split('；截至第')[0].split('；保留至')[0].split('；历史有效知情')[0]:Array.isArray(v)?v.map(slim):v&&typeof v==='object'?Object.fromEntries(Object.entries(v).map(([k,x])=>[k,slim(x)])):v;
 console.log(JSON.stringify(slim({unit:c.unit,revision:c.revision,plan:c.plan,outline:c.outline,snapshot:{characters:c.snapshot?.characters},continuity:{...c.continuity,author:Object.fromEntries(Object.entries(c.continuity?.author??{}).map(([id,v])=>[id,{type:v.type,statement:v.statement,truth:v.truth,status:v.status,due_unit:v.due_unit,custody:v.custody}]))},source_hashes:c.source_hashes}),null,2));
}else if(mode==='log'){
 const list=JSON.parse(fs.readFileSync(`${S}/${num}`,'utf8'));
 for(const x of list){let file=path.resolve(P,x.path);let b=fs.readFileSync(file);fs.appendFileSync(`${S}/reading.jsonl`,JSON.stringify({at:new Date().toISOString(),path:file,sha256:hash(file),range:`full:1-${b.toString('utf8').split(/\r?\n/).length}`,purpose:x.purpose,method:'FastCtx complete text read by model; hash receipt after read'})+'\n','utf8');}
 console.log('Logged actual completed reads:',list.length);
}else if(mode==='finish'){
 const raw=JSON.parse(fs.readFileSync(`${S}/template-${n}.json`,'utf8'));
 const template=raw.template??raw;
 const x=JSON.parse(fs.readFileSync(`${S}/changes-${n}.json`,'utf8'));
 const state=JSON.parse(fs.readFileSync(`${P}/.writer/state.json`,'utf8'));
 const snap=state.snapshot??state.current??state;
 // Old fields are preserved in the official record input, never written into state here.
 for(const [name,v] of Object.entries(x.changes.characters??{}))if(snap.characters?.[name])x.changes.characters[name]=v+`；截至第${n-1}章的历史状态（按原章时点，非当前位置）：`+snap.characters[name];
 for(const [id,v]of Object.entries(x.changes.ledger??{}))for(const [name,knowledge] of Object.entries(v.character_known??{})){
  const old=snap.ledger?.[id]?.character_known?.[name];if(old)v.character_known[name]=knowledge+`；截至第${n-1}章的有效旧知情（按原章时点）：`+old;
 }
 template.summary=x.summary;template.changes=x.changes;
 write(`${S}/record-${n}.json`,template);
 const out=cli(`record-${n}`,['record','--input',`${S}/record-${n}.json`]);console.log(JSON.stringify(out));
 console.log(JSON.stringify(cli(`check-${n}`,['check'])));
}else if(mode==='read-window'){
 const end=Number(rest[0]);const entries=[];
 for(let u=n;u<=end;u++){
  const name=fs.readdirSync(`${P}/正文`).find(f=>f.startsWith(String(u).padStart(4,'0')+'-'));
  const rel='正文/'+name;const file=`${P}/${rel}`;
  console.log(`\nFULL TEXT ${rel} SHA256 ${hash(file)}\n`+fs.readFileSync(file,'utf8')+'\nEND FULL TEXT '+rel);
  entries.push({path:rel,purpose:`${n}-${end}六章窗口逐章全文连读`,sha256:hash(file)});
 }
 write(`${S}/window-${n}-${end}${rest[1]?'-'+rest[1]:''}-read.json`,entries);
}else if(mode==='review'){
 const end=Number(rest[0]);const entries=JSON.parse(fs.readFileSync(`${S}/window-${n}-${end}-read.json`,'utf8'));
 const report=`审查/${String(n).padStart(4,'0')}-${String(end).padStart(4,'0')}-session04模型知情连读.md`;
 for(const x of entries)if(hash(`${P}/${x.path}`)!==x.sha256)throw Error('Read version changed '+x.path);
 const body=fs.readFileSync(`${S}/review-${n}-${end}.md`,'utf8');
 write(`${P}/${report}`,body+'\n\n实际全文范围与哈希：\n\n'+entries.map(x=>`- ${x.path} | ${x.sha256} | 全文`).join('\n')+'\n');
 const input={from:n,to:end,kind:'model-self-review',report,source_hashes:Object.fromEntries(entries.map(x=>[x.path,x.sha256]))};write(`${S}/review-input-${n}-${end}.json`,input);
 console.log(JSON.stringify(cli(`review-${n}-${end}`,['review','--input',`${S}/review-input-${n}-${end}.json`])));
 console.log(JSON.stringify(cli(`check-review-${end}`,['check'])));
}else if(mode==='metrics'){
 const files=fs.readdirSync(`${P}/正文`).filter(x=>/^00(4[3-8])-/.test(x));
 console.log(JSON.stringify(files.map(f=>{const text=fs.readFileSync(`${P}/正文/${f}`,'utf8');const body=text.split(/\r?\n/).filter(l=>!/^\s*#/.test(l)).join('\n');return {file:f,Han:[...body.matchAll(/\p{Script=Han}/gu)].length,sha256:hash(`${P}/正文/${f}`)};}),null,2));
}else if(mode==='hashes'){
 console.log(JSON.stringify(JSON.parse(fs.readFileSync(`${S}/${num}`,'utf8')).map(x=>({...x,sha256:hash(path.resolve(P,x.path))})),null,2));
}else throw Error('Unknown workflow operation');
