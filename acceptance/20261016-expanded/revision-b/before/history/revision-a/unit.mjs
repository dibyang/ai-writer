import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {isDeepStrictEqual} from 'node:util';
import {stage,work,read,write,transform,terms,hash} from './revise.mjs';
const root='D:/work/other/ai-writer';
const [action,num]=process.argv.slice(2);const u=Number(num),n=String(u).padStart(4,'0');
if(!Number.isInteger(u)||u<1||u>12)throw new Error('unit 1..12 only');
function cli(suffix,args){const label=`u${n}-${suffix}`;const r=spawnSync(process.execPath,[path.join(stage,'run-cli.mjs'),label,...args],{cwd:root,encoding:'utf8',maxBuffer:64*1024*1024});if(r.status!==0){process.stdout.write(r.stdout);process.stderr.write(r.stderr);throw new Error(`CLI failed ${label}`);}return JSON.parse(fs.readFileSync(path.join(stage,'cli',label+'.stdout'),'utf8'));}
const before=read(path.join(stage,'before/work/.writer/state.json'));
const row=before.units.find(r=>r.unit===u);const draft=terms(row.draft);
if(action==='prepare'){
 const state=read(path.join(work,'.writer/state.json'));if(state.units.length!==u-1)throw new Error('out of order');
 cli('plan',['plan','--input',path.join(stage,`plans/${n}.json`)]);
 const c=cli('context',['context','--unit',String(u)]);
 const t=cli('template',['record-template','--unit',String(u),'--draft',draft]);
 write(path.join(stage,`templates/${n}.json`),t);
 write(path.join(stage,`contexts/${n}-read.json`),{unit:u,revision:c.revision,snapshot:c.snapshot,recent:c.recent,author:Object.fromEntries(Object.entries(c.continuity?.author??{}).map(([id,e])=>[id,{...e,evidence:e.evidence?.map(x=>({unit:x.unit,quote:x.quote}))}])),reader:c.continuity?.reader,characters:c.continuity?.characters,recall:c.continuity?.recall,settings_refs:c.settings?.map(x=>x.ref),source_hashes:c.source_hashes});
 const orig=u<=4?`session-a/inputs/record-${u}.json`:`${u<=8?'session-b':'session-c'}/record-${n}.json`;
 const old=read(path.join(stage,'before/original-inputs',orig));
 const input={...t,summary:terms(old.summary),changes:transform(old.changes)};
 if(u===6){const e=input.changes.ledger.T_EAST;e.statement=e.statement.replace('、甚至位置相同','，顺着现路牌能问到四号泊位');e.character_known['沈禾']='旧名带西而现路朝东，想到候船处可能搬过；暂信今客运码头接续旧西埠、能问到四号泊位，仍知残页无日期，决定实走核对。';e.evidence=e.evidence.map(x=>({...x,quote:x.quote.replace('也许地方都不用另找。','顺着路牌就能问到四号泊位。')}));}
 // Preserve stable T_EAST ID; it is a historical identifier, not a current place name.
 if(input.changes.ledger?.T_EAST?.reader_known)input.changes.ledger.T_EAST.reader_known=input.changes.ledger.T_EAST.reader_known.replace('第8章现厅六号与旧牌不能数字直配','第8章现厅六号是寄存编号，不能用来定位旧牌四号泊位');
 const body=fs.readFileSync(path.join(work,draft),'utf8');
 const evidence=[];for(const [id,item]of Object.entries(input.changes.ledger??{}))for(const e of item.evidence??[]){if(e.unit!==u||!body.includes(e.quote))throw new Error(`evidence not in current unit: ${id} ${JSON.stringify(e)}`);evidence.push({id,unit:u,quote:e.quote,line:body.slice(0,body.indexOf(e.quote)).split('\n').length});}
 const originalSnapshot=read(path.join(stage,'before-snapshots.json')).find(x=>x.unit===u).snapshot;
 const prev=u===1?before.baseline:read(path.join(stage,'before-snapshots.json')).find(x=>x.unit===u-1).snapshot;
 const addedEvidence={};for(const[id,e]of Object.entries(originalSnapshot.ledger??{})){const a=(prev.ledger?.[id]?.evidence??[]).length;const b=e.evidence.slice(a).map(x=>terms(x.quote));if(b.length)addedEvidence[id]=b;}
 const counts=Object.fromEntries(Object.entries(addedEvidence).map(([id,a])=>[id,{old:a.length,new:evidence.filter(e=>e.id===id).length}]));
 if(Object.values(counts).some(x=>x.old!==x.new))throw new Error('evidence count loss '+JSON.stringify(counts));
 write(path.join(stage,`records/${n}.json`),input);
 write(path.join(stage,`unit-audits/${n}-before-record.json`),{unit:u,context_revision:c.revision,template_revision:t.expected_revision,context_source_hashes_match:isDeepStrictEqual(c.source_hashes,t.source_hashes),original_ledger_fields:Object.fromEntries(Object.entries(old.changes.ledger??{}).map(([id,v])=>[id,Object.keys(v)])),new_ledger_fields:Object.fromEntries(Object.entries(input.changes.ledger??{}).map(([id,v])=>[id,Object.keys(v)])),evidence_counts:counts,evidence,body_sha256:hash(body),han_chars:(body.replace(/^#.*(?:\r?\n|$)/,'').match(/\p{Script=Han}/gu)??[]).length});
 console.log(JSON.stringify({unit:u,revision:c.revision,context_keys:Object.keys(c),omitted_ids:c.omitted_ids??c.ledger?.omitted_ids,template:t.expected_revision,evidence_counts:counts,input:path.join(stage,`records/${n}.json`)}));
}else if(action==='record'){
 const audit=read(path.join(stage,`unit-audits/${n}-before-record.json`));if(!audit.context_source_hashes_match)throw new Error('context/template mismatch');
 const body=fs.readFileSync(path.join(work,draft));if(hash(body)!==audit.body_sha256)throw new Error('body changed after inspection');
 const result=cli('record',['record','--input',path.join(stage,`records/${n}.json`)]);
 const actual=read(path.join(work,'.writer/state.json'));write(path.join(stage,`snapshots/${n}.json`),actual.snapshot);
 console.log(JSON.stringify(result));
}else throw new Error('prepare or record');
