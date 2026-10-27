import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import assert from 'node:assert/strict';import {fileURLToPath} from 'node:url';
import {publicJsonObjects} from './public-read-outputs.mjs';
const here=path.dirname(fileURLToPath(import.meta.url)),[run,rootArg]=process.argv.slice(2),root=rootArg?path.resolve(rootArg):JSON.parse(fs.readFileSync(path.join(here,'project.json'))).project;
const rel=path.relative(here,root);assert(rel&&!rel.startsWith('..')&&!path.isAbsolute(rel));assert(/^[a-z][a-z0-9-]*$/.test(run??''));
const sha=b=>crypto.createHash('sha256').update(b).digest('hex'),key=p=>process.platform==='win32'?path.resolve(p).toLowerCase():path.resolve(p);
const state=JSON.parse(fs.readFileSync(path.join(root,'.writer/state.json'))),expected=new Map(state.units.map(u=>{const file=path.join(root,u.draft),b=fs.readFileSync(file);assert.equal(sha(b),u.sha256,u.draft);return[key(file),{unit:u.unit,sha256:u.sha256,text:b.toString('utf8'),returned:new Set()}];}));
const lines=fs.readFileSync(path.join(here,'native',run,'events.public.jsonl'),'utf8').split(/\r?\n/).filter(Boolean);
for(const line of lines){let e;try{e=JSON.parse(line);}catch{continue;}const i=e.item;if(e.type!=='item.completed'||i?.type!=='command_execution'||i.exit_code!==0)continue;for(const p of publicJsonObjects(i.aggregated_output)){if(typeof p.file!=='string'||!Number.isInteger(p.page))continue;
 const x=expected.get(key(p.file));if(!x||p.sha256!==x.sha256)continue;const pages=Math.max(1,Math.ceil(x.text.length/1800));
 if(p.pages===pages&&p.total_chars===x.text.length&&p.from===(p.page-1)*1800&&p.to===Math.min(p.page*1800,x.text.length)&&p.text===x.text.slice((p.page-1)*1800,p.page*1800))x.returned.add(p.page);
}}
const units=[...expected.values()].map(x=>({unit:x.unit,returned:x.returned.size,pages:Math.max(1,Math.ceil(x.text.length/1800))})),complete=units.filter(x=>x.returned===x.pages).map(x=>x.unit);
console.log(JSON.stringify({at:new Date().toISOString(),run,project:root,registered_units:state.units.length,complete_units:complete,partial_units:units.filter(x=>x.returned>0&&x.returned<x.pages),returned_current_body_pages:units.reduce((n,x)=>n+x.returned,0),expected_current_body_pages:units.reduce((n,x)=>n+x.pages,0),scope:'Unique exact current-body page returns for live progress; final immutable coverage receipts are separate.'}));
