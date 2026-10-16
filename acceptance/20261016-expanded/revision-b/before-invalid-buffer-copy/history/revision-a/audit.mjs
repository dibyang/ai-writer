import fs from 'node:fs';
import path from 'node:path';
import {isDeepStrictEqual} from 'node:util';
import {stage,work,read,write,transform,terms,hash} from './revise.mjs';
import {applyDelta} from '../../../lib/journal.mjs';
const state=read(path.join(work,'.writer/state.json'));
const old=read(path.join(stage,'before/work/.writer/state.json'));
const oldSnapshots=read(path.join(stage,'before-snapshots.json'));
const failures=[];
function assert(ok,what){if(!ok)failures.push(what);}
function diffs(a,b,p=[]){if(isDeepStrictEqual(a,b))return [];if(a&&b&&typeof a==='object'&&typeof b==='object'&&!Array.isArray(a)&&!Array.isArray(b))return [...new Set([...Object.keys(a),...Object.keys(b)])].sort().flatMap(k=>diffs(a[k],b[k],[...p,k]));if(Array.isArray(a)&&Array.isArray(b)&&a.length===b.length)return a.flatMap((x,i)=>diffs(x,b[i],[...p,String(i)]));return [{path:p.join('.'),before:a,after:b}];}
function category(d){
 if(/^ledger\.[^.]+\.evidence\.\d+\.(sha256|line|draft)$/.test(d.path))return '哈希或行号或路径机械变化';
 if(typeof d.before==='string'&&typeof d.after==='string'&&terms(d.before)===d.after)return '授权标识修改';
 if(/^ledger\.T_EAST\.(statement|reader_known|character_known\.沈禾|evidence\.0\.quote)$/.test(d.path))return '授权地点因果同步';
 return '需要解释的其他变化';
}
assert(state.units.length===12&&state.units.every((r,i)=>r.unit===i+1),'exact units 1..12');
assert(state.revision===26,'expected final actual revision 26 after real rewind and 12 records');
const units=[],sourceChecks=[],evidenceChecks=[],unitComparisons=[],preserved=[];
let replay=structuredClone(state.baseline);
for(const r of state.units){
 const n=String(r.unit).padStart(4,'0');const body=fs.readFileSync(path.join(work,r.draft),'utf8');
 const sourceHash=hash(body),han=(body.replace(/^#.*(?:\r?\n|$)/,'').match(/\p{Script=Han}/gu)??[]).length;
 assert(r.sha256===sourceHash,'body sha '+r.unit);assert(han>=1500&&han<=2000,'Han count '+r.unit+' '+han);
 assert(!/东埠|六码头|红棉绳/.test(body),'old targeted noun in body '+r.unit);
 const beforeRow=old.units[r.unit-1];const byteSame=fs.readFileSync(path.join(stage,'before/work',beforeRow.draft)).equals(Buffer.from(body));
 units.push({unit:r.unit,draft:r.draft,sha256:sourceHash,han,bytes_preserved:byteSame});
 const input=read(path.join(stage,`records/${n}.json`)),template=read(path.join(stage,`templates/${n}.json`)),context=JSON.parse(fs.readFileSync(path.join(stage,`cli/u${n}-context.stdout`),'utf8'));
 assert(input.expected_revision===14+r.unit-1,'fresh revision '+r.unit);
 assert(isDeepStrictEqual(input.source_hashes,context.source_hashes)&&isDeepStrictEqual(input.source_hashes,template.source_hashes),'fresh sources '+r.unit);
 const prior={...state,revision:14+r.unit-1,snapshot:r.unit===1?state.baseline:read(path.join(stage,`snapshots/${String(r.unit-1).padStart(4,'0')}.json`)),units:state.units.slice(0,r.unit-1)};
 for(const[ref,expected]of Object.entries(r.source_hashes)){
  const data=ref==='.writer/state.json'?Buffer.from(JSON.stringify(prior,null,2)+'\n'):fs.readFileSync(path.join(work,ref));
  const actual=hash(data);sourceChecks.push({unit:r.unit,ref,expected,actual,ok:actual===expected,verification:ref==='.writer/state.json'?'reconstructed predecessor bytes against consumed SHA-256':'current source bytes'});assert(actual===expected,'source '+r.unit+' '+ref);
 }
 const jbuf=fs.readFileSync(path.join(work,r.journal));assert(hash(jbuf)===r.journal_sha256,'journal hash '+r.unit);
 replay=applyDelta(replay,JSON.parse(jbuf).patch);assert(isDeepStrictEqual(replay,read(path.join(stage,`snapshots/${n}.json`))),'replay snapshot '+r.unit);
 const comparison=diffs(oldSnapshots[r.unit-1].snapshot,replay).map(d=>({...d,category:category(d)}));
 assert(!comparison.some(x=>x.category==='需要解释的其他变化'),'unexplained snapshot diff '+r.unit);
 const a=read(path.join(stage,`unit-audits/${n}-before-record.json`));
 assert(isDeepStrictEqual(Object.keys(a.original_ledger_fields).sort(),Object.keys(a.new_ledger_fields).sort()),'ledger update IDs '+r.unit);
 for(const id of Object.keys(a.original_ledger_fields))assert(isDeepStrictEqual(a.original_ledger_fields[id].sort(),a.new_ledger_fields[id].sort()),'ledger update fields '+r.unit+' '+id);
 assert((context.continuity?.recall?.omitted_ids??[]).length===0,'context omitted IDs '+r.unit);
 unitComparisons.push({unit:r.unit,old_evidence_counts:a.evidence_counts,original_ledger_fields:a.original_ledger_fields,new_ledger_fields:a.new_ledger_fields,differences:comparison,omitted_ids:context.continuity?.recall?.omitted_ids??[]});
}
assert(isDeepStrictEqual(replay,state.snapshot),'journal final snapshot');
for(const[id,item]of Object.entries(state.snapshot.ledger))for(const e of item.evidence??[]){
 const body=fs.readFileSync(path.join(work,e.draft),'utf8');const actual=hash(body),line=body.slice(0,body.indexOf(e.quote)).split('\n').length;
 const ok=body.includes(e.quote)&&e.sha256===actual&&line===e.line&&state.units[e.unit-1].draft===e.draft;
 evidenceChecks.push({id,...e,actual_sha256:actual,actual_line:line,ok});assert(ok,'evidence '+id+' '+e.unit+' '+e.quote);
}
for(const e of read(path.join(stage,'before-manifest.json')).entries){
 const backup=path.join(stage,e.backup);assert(hash(fs.readFileSync(backup))===e.sha256,'backup '+e.backup);
 if(e.backup.startsWith('before/work/.writer/journal/')||e.backup.startsWith('before/work/.writer/reviews/')||e.backup.startsWith('before/work/审查/')||e.backup.startsWith('before/work/.writer/tool/')){
  const current=path.join(work,e.backup.slice('before/work/'.length));const ok=fs.existsSync(current)&&hash(fs.readFileSync(current))===e.sha256;
  preserved.push({path:e.backup.slice('before/work/'.length),sha256:e.sha256,ok});assert(ok,'historical preservation '+e.backup);
 }
}
assert(isDeepStrictEqual(units.filter(x=>x.bytes_preserved).map(x=>x.unit),[1,4,12]),'unchanged units 1 4 12');
assert(state.snapshot.ledger.T_SIGNAL.status==='partial'&&state.snapshot.ledger.T_SIGNAL.due_unit===12,'T_SIGNAL remains partial due12');
assert(state.snapshot.ledger.T_LAMP.status==='pending'&&state.snapshot.ledger.T_LAMP.due_unit===9,'T_LAMP remains pending due9');
assert(state.snapshot.ledger.T_PRIVATE.status==='intentional-open'&&!Object.hasOwn(state.snapshot.ledger.T_PRIVATE,'author_truth'),'T_PRIVATE open without truth');
assert(diffs(transform(old.snapshot.ledger.T_PRIVATE),state.snapshot.ledger.T_PRIVATE).filter(d=>!/^evidence\.\d+\.(sha256|line|draft)$/.test(d.path)).length===0,'T_PRIVATE full semantic and all evidence preservation excluding mechanical anchors');
assert(!/东埠|六码头|红棉绳|正文\/0003-红/.test(JSON.stringify(state)),'old noun or old path in current state');
assert(fs.readdirSync(path.join(work,'正文')).filter(x=>/\.(md|txt)$/.test(x)).length===12,'no duplicate drafts');
const finalDiffs=diffs(old.snapshot,state.snapshot).map(d=>({...d,category:category(d)}));
const ledgerTable=Object.keys(old.snapshot.ledger).sort().map(id=>{const b=old.snapshot.ledger[id],a=state.snapshot.ledger[id];const changes=finalDiffs.filter(d=>d.path.startsWith(`ledger.${id}.`));return {id,type:a.type,status:a.status,due_unit:a.due_unit??null,old_evidence:b.evidence.length,new_evidence:a.evidence.length,semantic_changes:changes.filter(x=>x.category!=='哈希或行号或路径机械变化'),mechanical_changes:changes.filter(x=>x.category==='哈希或行号或路径机械变化').length};});
const result={ok:!failures.length,revision:state.revision,units,ledger_count:ledgerTable.length,evidence_count:evidenceChecks.length,source_count:sourceChecks.length,source_checks:sourceChecks,evidence_checks:evidenceChecks,unit_comparisons:unitComparisons,ledger_table:ledgerTable,final_differences:finalDiffs,preserved,failures};
write(path.join(stage,'audit.json'),result);
let md='# 全账本语义差异与逐章证据核对\n\n比较按字段和值进行，不使用对象键顺序判断差异。历史正文/输入/journal/review/报告均保留；新引文由真实 record 绑定最终正文哈希和行号。\n\n|ID|类型|终态/到期|原/新证据数|授权语义变化|机械变化字段数|其他变化|\n|---|---|---|---|---|---|---|\n';
for(const e of ledgerTable)md+=`|${e.id}|${e.type}|${e.status}/${e.due_unit??'无'}|${e.old_evidence}/${e.new_evidence}|${e.semantic_changes.length?e.semantic_changes.map(d=>d.path.replace('ledger.'+e.id+'.','')).join('；'):'无'}|${e.mechanical_changes}|${e.semantic_changes.some(x=>x.category==='需要解释的其他变化')?'见异常':'无'}|\n`;
md+='\nT_EAST 保留稳定 ID，现行含义为西埠地点接续的未证猜想。其 statement 删除“甚至位置相同”，改为沿现路牌问四号泊位；第6章的引文与人物所知同步；后续 reader_known 区分现六号寄存与旧四号泊位。这些属于授权后的因果同步。现行向东路牌、六号寄存、六处泊位示意数量与东侧发现标签均保留。\n\n';
md+='|章|原/新正文汉字|本章账本更新ID与原字段|原/新新增证据数|上下文遗漏|\n|---|---|---|---|---|\n';
for(const u of unitComparisons){const oldBody=fs.readFileSync(path.join(stage,'before/work',old.units[u.unit-1].draft),'utf8');const oldHan=(oldBody.replace(/^#.*(?:\r?\n|$)/,'').match(/\p{Script=Han}/gu)??[]).length;md+=`|${u.unit}|${oldHan}/${units[u.unit-1].han}|${Object.entries(u.original_ledger_fields).map(([id,v])=>id+': '+v.join(', ')).join('<br>')}|${Object.entries(u.old_evidence_counts).map(([id,v])=>`${id} ${v.old}/${v.new}`).join('；')}|${u.omitted_ids.length?u.omitted_ids.join(','):'无'}|\n`;}
md+='\n## 非机械差异原值与新值\n\n';for(const d of finalDiffs.filter(d=>d.category!=='哈希或行号或路径机械变化'))md+=`- ${d.category}：\`${d.path}\`\n  - 原：${JSON.stringify(d.before)}\n  - 新：${JSON.stringify(d.after)}\n`;
md+=`\n## 核验\n\n来源 ${sourceChecks.length} 项，引文 ${evidenceChecks.length} 条；原备份685文件重新核哈希。state来源按消费时前一状态重建字节核验其SHA-256，其余来源核对当前文件。T_PRIVATE 全字段和4条证据保留，第4章以后罗敬与顾遥的私因未知边界沿原登记延续；没有添加author_truth。\n\n异常：${failures.length?failures.join('；'):'无'}。详细机械差异及逐章快照比较见 audit.json。\n`;
fs.writeFileSync(path.join(stage,'ledger-diff.md'),md);
console.log(JSON.stringify({ok:result.ok,revision:state.revision,han:units.map(x=>x.han),ledger:ledgerTable.length,evidence:evidenceChecks.length,sources:sourceChecks.length,failures,unexplained:finalDiffs.filter(x=>x.category==='需要解释的其他变化')},null,2));
if(failures.length)process.exitCode=1;
