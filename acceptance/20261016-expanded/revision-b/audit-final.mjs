import fs from 'node:fs';
import assert from 'node:assert/strict';
import path from 'node:path';
import {json,write,walk,stage,project,root,hash} from './run.mjs';
const old=json(stage+'/before/work/.writer/state.json'),now=json(project+'/.writer/state.json');
const oldSnaps=json(stage+'/before/replayed-snapshots.json');
const cleanEvidence=e=>({unit:e.unit,quote:e.quote});
function replay(s,base){let snap=structuredClone(s.baseline),all=[structuredClone(snap)];for(const u of s.units){const j=base+'/'+u.journal;assert.equal(hash(fs.readFileSync(j)),u.journal_sha256);for(const p of json(j).patch){let v=snap;for(const k of p.at.slice(0,-1)){v[k]??={};v=v[k];}const k=p.at.at(-1);if(p.append){assert.equal(v[k]?.length??0,p.length);v[k]??=[];v[k].push(...structuredClone(p.append));}else if(p.has)v[k]=structuredClone(p.after);else delete v[k];}all.push(structuredClone(snap));}assert.deepEqual(snap,s.snapshot);return all;}
const snaps=replay(now,project);write(stage+'/after/replayed-snapshots.json',snaps);
const expected=json(stage+'/expected/snapshots.json');
const sem=s=>{const t=structuredClone(s);for(const v of Object.values(t.ledger??{})){delete v.introduced_unit;delete v.updated_unit;v.evidence=v.evidence.map(cleanEvidence);}return t;};
for(let n=7;n<=20;n++){assert.deepEqual(sem(snaps[n]),sem(expected[n]));write(stage+'/after/snapshots/'+String(n).padStart(4,'0')+'.json',snaps[n]);}
assert.deepEqual(now.units.slice(0,6),old.units.slice(0,6));assert.deepEqual(snaps[6],oldSnaps[6]);
let anchors=0,retained=0;const removed=[],added=[],anchorRows=[];
const key=e=>e.unit+'|'+e.quote;
for(const[id,v]of Object.entries(now.snapshot.ledger)){
 for(const e of v.evidence){const text=fs.readFileSync(project+'/'+e.draft,'utf8');assert.equal(hash(fs.readFileSync(project+'/'+e.draft)),e.sha256);assert(text.split(/\r?\n/)[e.line-1]?.includes(e.quote),id+' '+key(e));anchors++;anchorRows.push({id,...e});}
 const prev=old.snapshot.ledger[id],nk=new Set(v.evidence.map(key)),ok=new Set(prev.evidence.map(key));
 for(const e of prev.evidence)if(nk.has(key(e)))retained++;else removed.push({id,...e});
 for(const e of v.evidence)if(!ok.has(key(e)))added.push({id,...e});
 assert.equal(v.status,prev.status,id+' status');assert.equal(v.due_unit,prev.due_unit,id+' due');assert.deepEqual(v.custody,prev.custody,id+' custody');assert.equal(v.type,prev.type,id+' type');
 if(v.type==='observation')assert.equal(v.statement,prev.statement,id+' immutable observation');
}
assert.deepEqual(Object.keys(now.snapshot.ledger),Object.keys(old.snapshot.ledger));
assert.equal(removed.length,2);assert(removed.some(x=>x.id==='T_EAST'&&x.unit===7));assert(removed.some(x=>x.id==='O_PLATE'&&x.unit===11));
const sourceRows=[];
for(let n=7;n<=20;n++){
 const u=now.units[n-1],t=json(stage+'/templates/'+n+'.json'),c=json(stage+'/contexts/'+n+'.json');
 assert.equal(t.expected_revision,45+n-7);assert.deepEqual(t.source_hashes,c.source_hashes);assert.deepEqual(u.source_hashes,t.source_hashes);
 const pre={...now,revision:t.expected_revision,snapshot:snaps[n-1],units:now.units.slice(0,n-1)};
 const realStateHash=hash(Buffer.from(JSON.stringify(pre,null,2)+'\n'));
 assert.equal(realStateHash,t.source_hashes['.writer/state.json'],'pre-state source '+n);
 for(const[p,h]of Object.entries(t.source_hashes))if(p!=='.writer/state.json')assert.equal(hash(fs.readFileSync(project+'/'+p)),h,'source '+n+' '+p);
 sourceRows.push({unit:n,expected_revision:t.expected_revision,context_revision:c.revision,pre_state_sha256:realStateHash,source_hashes:t.source_hashes,recall:c.continuity.recall});
}
const protectedRows=[];
for(const e of json(stage+'/before/manifest.json').files){if(e.path.startsWith('.writer/journal/')||e.path.startsWith('.writer/reviews/')||e.path.startsWith('设定/')||e.path==='大纲/全书大纲.md'||e.path.startsWith('大纲/分卷/')||e.path.startsWith('审查/')||e.path.startsWith('.writer/rewind-')){assert.equal(hash(fs.readFileSync(project+'/'+e.path)),e.sha256,e.path);protectedRows.push(e);}}
let history=0;const externalAppends=[];for(const f of walk(stage+'/before/history')){const rel=path.relative(stage+'/before/history',f),a=fs.readFileSync(f),b=fs.readFileSync(root+'/acceptance/20261016-expanded/'+rel);if(hash(a)===hash(b))history++;else{assert(b.subarray(0,a.length).equals(a),'External history rewritten '+rel);externalAppends.push({path:rel,before_sha256:hash(a),after_sha256:hash(b),before_bytes:a.length,after_bytes:b.length,note:'作品外文件由其他写入者追加，本轮未写；原始字节完整保留'});}}
const chapterRows=now.units.map((u,i)=>{const bytes=fs.readFileSync(project+'/'+u.draft),text=bytes.toString('utf8'),han=(text.replace(/^#.*\r?\n/,'').match(/\p{Script=Han}/gu)??[]).length;assert(han>=1500&&han<=2000);assert.equal(hash(bytes),u.sha256);return {unit:u.unit,draft:u.draft,han,before:old.units[i].sha256,after:u.sha256,body_changed:old.units[i].sha256!==u.sha256,record_unchanged:JSON.stringify(u)===JSON.stringify(old.units[i])};});
assert.deepEqual(chapterRows.filter(r=>r.body_changed).map(r=>r.unit),[7,8,11,14,20]);
const flatten=(v,p='',out={})=>{if(v&&typeof v==='object'&&!Array.isArray(v)){for(const[k,x]of Object.entries(v))flatten(x,p?p+'.'+k:k,out);}else out[p]=v;return out;};
const diffs=[];for(const[id,v]of Object.entries(now.snapshot.ledger)){const a=flatten(sem({ledger:{[id]:old.snapshot.ledger[id]}}).ledger[id]),b=flatten(sem({ledger:{[id]:v}}).ledger[id]);diffs.push({id,changes:[...new Set([...Object.keys(a),...Object.keys(b)])].filter(k=>JSON.stringify(a[k])!==JSON.stringify(b[k])).map(k=>({field:k,before:a[k],after:b[k]})),old_evidence:old.snapshot.ledger[id].evidence.length,new_evidence:v.evidence.length});}
const knowledge=[11,12,13,14].map(n=>({unit:n,character:snaps[n].characters.顾遥,O_PLATE:snaps[n].ledger.O_PLATE.character_known.顾遥,P_BOX:snaps[n].ledger.P_BOX.character_known.顾遥,plate_evidence:snaps[n].ledger.O_PLATE.evidence.filter(e=>e.unit>=11),journal:now.units[n-1].journal,journal_sha256:now.units[n-1].journal_sha256}));
for(const k of knowledge.slice(0,3)){assert(!k.character.includes('第14章'));assert(!k.O_PLATE.includes('第14章'));assert(!k.P_BOX.includes('第14章'));assert(k.O_PLATE.includes('尚不知道'));}
assert(knowledge[3].O_PLATE.startsWith('第14章唐16:54离店'));assert(!now.snapshot.characters.顾遥.includes('依第11章全口述'));
const result={revision:now.revision,units:now.units.length,rewind_from:7,replayed:20,first_six_unchanged:true,anchors,retained,removed,added,history_files_unchanged:history,externalAppends,protected_files:protectedRows.length,chapterRows,knowledge,sourceRows,ledger_diffs:diffs,pending:Object.entries(now.snapshot.ledger).filter(([,v])=>['pending','partial','intentional-open'].includes(v.status)).map(([id,v])=>({id,status:v.status,due_unit:v.due_unit,reader_known:v.reader_known}))};
write(stage+'/audit.json',result);write(stage+'/after/evidence-anchors.json',anchorRows);
write(stage+'/knowledge-migration.md','# 顾遥知情迁移：新 journal 实际重放\n\n'+knowledge.map(k=>'## 第'+k.unit+'章\n\n角色短状态：'+k.character+'\n\nO_PLATE.character_known：'+k.O_PLATE+'\n\nP_BOX.character_known：'+k.P_BOX+'\n\nJournal：'+k.journal+'\nSHA-256：'+k.journal_sha256+'\n\n本阶段牌面证据：\n'+k.plate_evidence.map(e=>'- 第'+e.unit+'章 L'+e.line+'：'+e.quote+'（'+e.sha256+'）').join('\n')).join('\n\n'));
write(stage+'/ledger-semantic-diff.md','# 全账本语义差异（36 项）\n\n稳定 ID、类型、状态、到期数、custody 和所有 observation.statement 均逐项相等。证据锚点的 hash/line 随现稿重绑另见 after/evidence-anchors.json。\n\n| ID | 语义变化字段 | 证据数 修前→修后 |\n|---|---|---|\n'+diffs.map(d=>'| '+d.id+' | '+(d.changes.map(x=>x.field).join('、')||'无')+' | '+d.old_evidence+' → '+d.new_evidence+' |').join('\n')+'\n\n'+diffs.filter(d=>d.changes.length).map(d=>'## '+d.id+'\n\n'+d.changes.map(x=>'### '+x.field+'\n\n修前：'+JSON.stringify(x.before)+'\n\n修后：'+JSON.stringify(x.after)).join('\n\n')).join('\n\n'));
write(stage+'/chapter-diff.md','# 逐章差异与哈希\n\n| 章 | 正文汉字 | 正文变化 | 登记 | 修前 SHA-256 | 修后 SHA-256 |\n|---|---:|---|---|---|---|\n'+chapterRows.map(r=>'| '+r.unit+' | '+r.han+' | '+(r.body_changed?'有':'无')+' | '+(r.unit<7?'原登记完整保留':'新 context/template 重登')+' | '+r.before+' | '+r.after+' |').join('\n'));
console.log(JSON.stringify({revision:now.revision,units:20,anchors,retained,removed:removed.map(x=>({id:x.id,unit:x.unit,quote:x.quote})),added:added.length,history_files_unchanged:history,protected_files:protectedRows.length,body_changed:chapterRows.filter(x=>x.body_changed).map(x=>x.unit),all_pre_state_source_hashes_verified:true,recall_omitted:sourceRows.map(x=>({unit:x.unit,recall:x.recall}))},null,2));
