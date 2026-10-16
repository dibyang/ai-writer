import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {createRunner} from '../command-runner.mjs';
import {replaySnapshots,changesBetween} from '../rebuild-utils.mjs';
export const stage=path.resolve('acceptance/20261016-hundred/revision-c');
export const work=path.resolve('acceptance/20261016-hundred/works/潮汐信号');
export const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
export const read=f=>JSON.parse(fs.readFileSync(f,'utf8'));
export const write=(f,x)=>{fs.mkdirSync(path.dirname(f),{recursive:true});fs.writeFileSync(f,JSON.stringify(x,null,2)+'\n');};
export const runner=createRunner(stage);
export function cli(label,args){const r=runner.run(process.execPath,['bin/ai-writer.mjs',...args,'--project',work],label+'-cli');process.stdout.write(JSON.stringify({label:r.label,exit_code:r.exit_code,elapsed_ms:r.elapsed_ms,stderr:r.stderr,metadata:r.files.metadata})+'\n');return r;}
export function manifest(root){const out={};function walk(d){for(const e of fs.readdirSync(d,{withFileTypes:true})){const p=path.join(d,e.name);if(e.isDirectory())walk(p);else if(e.isFile())out[path.relative(root,p).replaceAll('\\','/')]=hash(fs.readFileSync(p));else throw Error('Nonregular entry '+p);}}walk(root);return out;}
const action=process.argv[2];
if(action==='freeze-before'){
 if(fs.existsSync(path.join(stage,'before/work')))throw Error('Before already exists');
 const s=read(path.join(work,'.writer/state.json'));if(s.revision!==275||s.units.length!==90)throw Error('Unexpected authority');
 fs.cpSync(work,path.join(stage,'before/work'),{recursive:true,errorOnExist:true,force:false});
 const original=manifest(work),copy=manifest(path.join(stage,'before/work'));if(JSON.stringify(original)!==JSON.stringify(copy))throw Error('Copy mismatch');
 write(path.join(stage,'before/manifest.json'),original);
 write(path.join(stage,'started.json'),{started_at:new Date().toISOString(),revision:s.revision,units:s.units.length,state_sha256:original['.writer/state.json'],files:Object.keys(original).length});
 const snapshots=replaySnapshots(work,s);write(path.join(stage,'original-snapshots.json'),snapshots);
 write(path.join(stage,'authority-inventory.json'),{revision:s.revision,keys:Object.keys(s),baseline:s.baseline,units:s.units,volumes:s.volumes,review_keys:Object.keys(s).filter(x=>/review/.test(x)),observations:Object.values(s.snapshot.ledger).filter(x=>x.type==='observation'),characters:s.snapshot.characters,threads:s.snapshot.threads,ledger:s.snapshot.ledger});
 process.stdout.write(JSON.stringify({revision:s.revision,units:s.units.length,files:Object.keys(original).length,snapshots:snapshots.length,state_sha256:original['.writer/state.json']})+'\n');
}
if(action==='probe'){
 const before=hash(fs.readFileSync(path.join(work,'.writer/state.json')));
 const r=cli('recall-exact-T_PAGE_PAIR',['recall','--query','T_PAGE_PAIR','--limit','1']);
 const data=runner.json('recall-exact-T_PAGE_PAIR-cli');
 const after=hash(fs.readFileSync(path.join(work,'.writer/state.json')));write(path.join(stage,'recall-probe.json'),{before,after,unchanged:before===after,data});process.stdout.write(r.stdout);
}
if(action==='read-log'){
 const [rel,start,end,purpose]=process.argv.slice(3);const file=path.join(work,rel);const b=fs.readFileSync(file);const lines=b.toString('utf8').split(/\r?\n/);const entry={at:new Date().toISOString(),file:rel,sha256:hash(b),from:Number(start),to:Number(end),total_lines:lines.length,coverage:Number(start)===1&&Number(end)>=lines.length-1?'full':'range',purpose};fs.appendFileSync(path.join(stage,'reading.jsonl'),JSON.stringify(entry)+'\n');process.stdout.write(JSON.stringify(entry)+'\n');
}
if(action==='mark-read'){
 const [purpose,...items]=process.argv.slice(3);const s=read(path.join(stage,'before/work/.writer/state.json'));
 for(const item of items){const rel=/^\d+$/.test(item)?s.units.find(x=>x.unit===Number(item)).draft:item;const b=fs.readFileSync(path.join(work,rel));const lines=b.toString('utf8').split(/\r?\n/);const entry={at:new Date().toISOString(),file:rel,sha256:hash(b),from:1,to:lines.length,total_lines:lines.length,coverage:'full',purpose,method:'model-read-complete-tool-output-before-explicit-mark'};fs.appendFileSync(path.join(stage,'reading.jsonl'),JSON.stringify(entry)+'\n');}console.log(JSON.stringify({marked:items,purpose}));
}
if(action==='prepare-readings'){
 const s=read(path.join(work,'.writer/state.json'));const sourceSet=new Map();for(const u of s.units)for(const f of Object.keys(u.source_hashes))if(!f.startsWith('正文/')&&!f.startsWith('.writer/')&&!f.startsWith('大纲/单元/')){if(!sourceSet.has(f))sourceSet.set(f,[]);sourceSet.get(f).push(u.unit);}
 write(path.join(stage,'consumed-source-scope.json'),Object.fromEntries([...sourceSet].map(([f,units])=>[f,{units,sha256:hash(fs.readFileSync(path.join(work,f)))}])));
 for(let n=41;n<=90;n+=10){let text='';for(let i=n;i<Math.min(n+10,91);i++){const f='大纲/单元/'+String(i).padStart(4,'0')+'.json';const b=fs.readFileSync(path.join(work,f));text+='\n## '+f+' SHA256 '+hash(b)+'\n\n'+b.toString('utf8');}fs.writeFileSync(path.join(stage,`plans-${n}-${n+9}.md`),text);}
 const ids=Object.entries(s.snapshot.ledger).filter(([id,v])=>/ROOM_VISIT|DOOR_RECEIPT|PHOTO_WAIT|POST_WAIT|ROUTE_COMMON|CHAIR|KEEPER_SHARE|PAID_WORK/.test(id));write(path.join(stage,'current-relevant-ledger.json'),Object.fromEntries(ids));
 write(path.join(stage,'state-overview.json'),{revision:s.revision,units:s.units.length,characters:s.snapshot.characters,threads:s.snapshot.threads,ledger_index:Object.entries(s.snapshot.ledger).map(([id,v])=>({id,type:v.type,status:v.status,introduced_unit:v.introduced_unit,due_unit:v.due_unit,statement:v.statement})),timeline_tail:s.snapshot.timeline.slice(-15)});
 console.log(JSON.stringify({sources:Object.keys(Object.fromEntries(sourceSet)),relevant_ids:ids.map(x=>x[0])}));
}
