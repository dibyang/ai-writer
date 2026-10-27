import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {isDeepStrictEqual} from 'node:util';
import {fileURLToPath} from 'node:url';
import {publicJsonObjects} from './public-read-outputs.mjs';

const here=path.dirname(fileURLToPath(import.meta.url));
const [label,run,cliLabel,fromArg,toArg,rootArg,commandNeedle]=process.argv.slice(2);
for(const value of [label,run,cliLabel])assert(/^[a-z][a-z0-9-]*$/.test(value??''));
const j=p=>JSON.parse(fs.readFileSync(p));
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const root=path.resolve(rootArg??j(path.join(here,'project.json')).project);
const relative=path.relative(fs.realpathSync(here),fs.realpathSync(root));
assert(relative&&!relative.startsWith('..')&&!path.isAbsolute(relative));
const stateBytes=fs.readFileSync(path.join(root,'.writer/state.json'));
const state=JSON.parse(stateBytes),from=Number(fromArg),to=Number(toArg);
assert(Number.isSafeInteger(from)&&Number.isSafeInteger(to)&&from>0&&to>=from&&to<=state.units.length);
const logDir=path.join(here,'cli-logs',cliLabel),log=j(path.join(logDir,'result.json'));
assert.equal(log.exit_code,0);
const stdout=fs.readFileSync(path.join(logDir,'stdout.txt'),'utf8');
const result=JSON.parse(stdout);
const rows=fs.readFileSync(path.join(here,'native',run,'events.public.jsonl'),'utf8').split(/\r?\n/).filter(Boolean).map(JSON.parse);
const completed=rows.flatMap((e,index)=>e.type==='item.completed'&&e.item?.type==='command_execution'&&e.item.exit_code===0?[{index,item:e.item}]:[]);
// a-date62-cli returns a bounded public summary; the full raw streams remain in
// cli-logs. Accept only that inspected wrapper protocol when explicitly named.
const wrapped=['a-date62-cli.mjs','r1-product.mjs'].includes(commandNeedle);
const redact=v=>Array.isArray(v)?v.map(redact):v&&typeof v==='object'?Object.fromEntries(Object.entries(v).map(([k,x])=>[k,/token/i.test(k)?'[LOCAL ONLY]':redact(x)])):v;
const expectedSummary=commandNeedle==='r1-product.mjs'
 ? {label:cliLabel,product_exit:0,before:log.before_state_sha256,after:log.after_state_sha256,keys:Object.keys(result),summary:JSON.stringify(result).length<4500?redact(result):undefined,stdout:`cli-logs/${cliLabel}/stdout.txt`,stderr:`cli-logs/${cliLabel}/stderr.txt`}
 : {label:cliLabel,exit_code:0,ok:result.ok,revision:result.revision,workspace:root,stdout_ref:path.join(logDir,'stdout.txt'),stderr_ref:path.join(logDir,'stderr.txt')};
for(const k of Object.keys(expectedSummary))if(expectedSummary[k]===undefined)delete expectedSummary[k];
const anchors=completed.filter(x=>{
 if(wrapped)return x.item.command.includes(commandNeedle)&&x.item.command.includes(cliLabel)&&publicJsonObjects(x.item.aggregated_output).some(p=>isDeepStrictEqual(p,expectedSummary));
 return (x.item.command.includes(cliLabel)||(commandNeedle&&x.item.command.includes(commandNeedle)))&&publicJsonObjects(x.item.aggregated_output).some(p=>isDeepStrictEqual(p,result));
});
assert.equal(anchors.length,1,'The boundary needs one actual successful public command with its exact captured CLI result');
const anchor=anchors[0],returns=[];
for(const x of completed.filter(x=>x.index>anchor.index))for(const p of publicJsonObjects(x.item.aggregated_output))if(typeof p.file==='string'&&typeof p.text==='string')returns.push({...p,event_id:x.item.id,event_index:x.index});
const key=p=>process.platform==='win32'?path.resolve(p).toLowerCase():path.resolve(p);
let cursor=0;
const files=[];
for(const u of state.units.filter(u=>u.unit>=from&&u.unit<=to)){
 const file=path.join(root,u.draft),bytes=fs.readFileSync(file),text=bytes.toString('utf8');
 assert.equal(sha(bytes),u.sha256);
 const count=Math.max(1,Math.ceil(text.length/1800)),proof=[];
 let end=cursor;
 for(let n=1;n<=count;n++){
  const index=returns.findIndex((p,i)=>i>=cursor&&key(p.file)===key(file)&&p.sha256===u.sha256&&p.page===n&&p.pages===count&&p.total_chars===text.length&&p.from===(n-1)*1800&&p.to===Math.min(n*1800,text.length)&&p.text===text.slice((n-1)*1800,n*1800));
  assert(index>=0,`Missing current page after boundary and preceding whole chapters: ${u.unit}/${n}`);
  const p=returns[index];end=Math.max(end,index+1);
  proof.push({page:n,event_id:p.event_id,event_index:p.event_index});
 }
 cursor=end;files.push({unit:u.unit,draft:u.draft,sha256:u.sha256,pages:count,returns:proof});
}
assert.equal(sha(fs.readFileSync(path.join(root,'.writer/state.json'))),sha(stateBytes),'State changed during audit');
const out={ok:true,at:new Date().toISOString(),run,project:root,selected_revision:state.revision,state_sha256:sha(stateBytes),boundary:{cli_label:cliLabel,args:log.args,event_id:anchor.item.id,event_index:anchor.index,stdout_sha256:sha(stdout),public_return:wrapped?'exact inspected wrapper summary and retained raw CLI result':'exact raw CLI result',wrapper_source_sha256:wrapped?sha(fs.readFileSync(path.join(here,commandNeedle))):null},from,to,files,pages:files.reduce((n,f)=>n+f.pages,0),scope:'Exact current-body public page returns after the selected actual command; each chapter completes before selected returns of the next. No cognitive, human or literary certification.'};
fs.writeFileSync(path.join(here,`reading-after-${label}-verification.json`),JSON.stringify(out,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({ok:true,label,from,to,pages:out.pages,boundary_event:anchor.index}));
