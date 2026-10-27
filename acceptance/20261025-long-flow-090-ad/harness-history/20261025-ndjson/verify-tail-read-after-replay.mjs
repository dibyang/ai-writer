import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import assert from 'node:assert/strict';import {fileURLToPath} from 'node:url';
const here=path.dirname(fileURLToPath(import.meta.url)),[label,beginLabel,run,lastRecordLabel,fromArg,toArg]=process.argv.slice(2);
assert(/^[a-z][a-z0-9-]*$/.test(label??''));
const j=p=>JSON.parse(fs.readFileSync(p)),sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const session=j(path.join(here,'cli-logs',beginLabel,'stdout.txt')),root=path.resolve(session.workspace);
const rel=path.relative(here,root);assert(rel&&!rel.startsWith('..')&&!path.isAbsolute(rel));
const state=j(path.join(root,'.writer/state.json')),from=Number(fromArg),to=Number(toArg);
assert(Number.isSafeInteger(from)&&Number.isSafeInteger(to)&&from>0&&to>=from&&to<=state.units.length);
const events=fs.readFileSync(path.join(here,'native',run,'events.public.jsonl'),'utf8').split(/\r?\n/).filter(Boolean).map(JSON.parse);
const completed=events.flatMap((e,index)=>e.type==='item.completed'&&e.item?.type==='command_execution'&&e.item.exit_code===0?[{index,item:e.item}]:[]);
const records=completed.filter(x=>x.item.command.includes(lastRecordLabel));assert.equal(records.length,1,'Select the unique public command containing the final record label');
const boundary=records[0],pages=[];
for(const x of completed.filter(x=>x.index>boundary.index)){
 let p;try{p=JSON.parse(x.item.aggregated_output);}catch{continue;}
 if(typeof p.file==='string'&&typeof p.text==='string'&&typeof p.sha256==='string'&&Number.isInteger(p.page)&&Number.isInteger(p.pages))pages.push({...p,event_id:x.item.id,event_index:x.index});
}
const key=s=>process.platform==='win32'?path.resolve(s).toLowerCase():path.resolve(s);const files=[];
for(const u of state.units.filter(x=>x.unit>=from&&x.unit<=to)){
 const file=path.join(root,u.draft),b=fs.readFileSync(file),text=b.toString('utf8');assert.equal(sha(b),u.sha256);
 const count=Math.max(1,Math.ceil(text.length/1800)),proof=[];
 for(let n=1;n<=count;n++){
  const p=pages.find(p=>key(p.file)===key(file)&&p.sha256===u.sha256&&p.page===n&&p.pages===count&&p.total_chars===text.length&&p.from===(n-1)*1800&&p.to===Math.min(n*1800,text.length)&&p.text===text.slice((n-1)*1800,n*1800));
  assert(p,`Missing post-final-record current page ${u.unit} ${n}/${count}`);proof.push({page:n,event_id:p.event_id,event_index:p.event_index});
 }
 files.push({unit:u.unit,draft:u.draft,sha256:u.sha256,pages:count,returns:proof});
}
const result={ok:true,at:new Date().toISOString(),run,from,to,root,final_record:{label:lastRecordLabel,event_id:boundary.item.id,event_index:boundary.index},files,pages:files.reduce((n,x)=>n+x.pages,0),scope:'Exact current candidate page returns after the public successful final replay record command. Does not certify cognitive reading or literary quality.'};
fs.writeFileSync(path.join(here,'post-replay-reading-'+label+'.json'),JSON.stringify(result,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify({ok:true,label,from,to,pages:result.pages}));
