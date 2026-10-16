import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {isDeepStrictEqual as same} from 'node:util';
import {stage,work,runner,cli} from './run-cli.mjs';
import {replaySnapshots,changesBetween} from '../rebuild-utils.mjs';
export const sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
export const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
export const save=(p,v)=>{fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,JSON.stringify(v,null,2)+'\n');};
export const state=()=>read(path.join(work,'.writer/state.json'));
export function must(r){if(r.exit_code!==0)throw Error(`${r.label}: ${r.exit_code}: ${r.stderr}`);return JSON.parse(r.stdout);}
export function logReading(relative,purpose,{root=work,range='full',unit}={}){
 const p=path.resolve(root,relative),data=fs.readFileSync(p,'utf8');
 fs.appendFileSync(path.join(stage,'reading.jsonl'),JSON.stringify({at:new Date().toISOString(),path:p,sha256:sha(p),range,lines:data.split(/\r?\n/).length,unit,purpose,method:'model actually read full text through FastCtx; hash calculated separately after reading; no concurrent writer'})+'\n');
}
function files(root){return fs.readdirSync(root,{withFileTypes:true}).flatMap(e=>e.isDirectory()?files(path.join(root,e.name)):[path.join(root,e.name)]);}
export function freeze(name){
 const target=path.join(stage,'metadata-repair',name),dest=path.join(target,'work');
 if(fs.existsSync(target))throw Error(`Freeze already exists: ${target}`);
 fs.mkdirSync(target,{recursive:true});fs.cpSync(work,dest,{recursive:true,errorOnExist:true});
 const manifest=files(work).map(p=>({path:path.relative(work,p).replaceAll('\\','/'),sha256:sha(p)}));
 for(const e of manifest)if(sha(path.join(dest,e.path))!==e.sha256)throw Error(`Copy mismatch: ${e.path}`);
 const s=state();const journals=s.units.map(u=>({unit:u.unit,path:u.journal,source_sha256:sha(path.join(work,u.journal)),copy_sha256:sha(path.join(dest,u.journal))}));
 if(journals.some(j=>j.source_sha256!==j.copy_sha256))throw Error('Active journal copy mismatch');
 save(path.join(target,'sha256.json'),{captured_at:new Date().toISOString(),revision:s.revision,state_sha256:sha(path.join(work,'.writer/state.json')),file_count:manifest.length,active_journals:journals,files:manifest});
 return {revision:s.revision,files:manifest.length,active_journals:journals.length,all_hashes_equal:true};
}
const action=process.argv[2];
if(action==='log-initial'){
 for(const p of ['writer.json','设定/作品定位.md','设定/文风.md','设定/权威规则.md','设定/角色卡.md','设定/续部人物与场所.md','大纲/全书大纲.md','大纲/续部总纲.md'])logReading(p,'恢复当前有效设定与计划边界');
 const s=state();for(const u of s.units.filter(u=>[32,33,67,68,69,70,71,72].includes(u.unit)))logReading(u.draft,'完整实读恢复与术语核查',{unit:u.unit});
 for(const p of ['ledger-current-view.json','tracking-diff-view.json'])logReading(p,'只读重放当前有效state/journal所得字段视图；已完整阅读',{root:stage});
 console.log(JSON.stringify({logged:true,elapsed_s:(Date.now()-Date.parse(read(path.join(stage,'start.json')).started_at))/1000}));
}
if(action==='freeze-before')console.log(JSON.stringify(freeze('before')));
if(action==='prepare-repair'){
 const original=read(path.join(stage,'replayed-initial.json'));
 const diffs=[];const desired=structuredClone(original.snapshots);
 for(let n=32;n<desired.length;n++){
  const s=desired[n];
  for(let i=0;i<s.timeline.length;i++)if(s.timeline[i].includes('换缺轮椅')){const before=s.timeline[i];s.timeline[i]=before.replace('换缺轮椅','换轮缘缺角的五脚椅');diffs.push({unit:n,field:`timeline.${i}`,before,after:s.timeline[i]});}
  const room=s.ledger?.O_ROOM_TONE;if(room?.statement.includes('无人动缺轮椅')){const before=room.statement;room.statement=before.replace('无人动缺轮椅','无人移动那把轮缘缺角的五脚椅');diffs.push({unit:n,field:'ledger.O_ROOM_TONE.statement',before,after:room.statement});}
  const t=s.ledger?.T_SOUND_CONTEXT;
  if(t?.reader_known?.includes('缺轮')){const before=t.reader_known;t.reader_known=before.replaceAll('缺轮','轮缘缺角');diffs.push({unit:n,field:'ledger.T_SOUND_CONTEXT.reader_known',before,after:t.reader_known});}
  if(t?.character_known?.顾遥?.includes('缺轮')){const before=t.character_known.顾遥;t.character_known.顾遥=before.replaceAll('缺轮','轮缘缺角');diffs.push({unit:n,field:'ledger.T_SOUND_CONTEXT.character_known.顾遥',before,after:t.character_known.顾遥});}
 }
 save(path.join(stage,'metadata-repair','desired-snapshots.json'),{original_revision:original.revision,snapshots:desired});
 save(path.join(stage,'metadata-repair','field-changes.json'),diffs);
 console.log(JSON.stringify({earliest:32,changed_snapshot_fields:diffs.length,units_unchanged_1_31:desired.slice(0,32).every((s,i)=>same(s,original.snapshots[i])),reader_72_already_current:desired[72].ledger.T_SOUND_CONTEXT.reader_known}));
}
if(action==='rewind'){
 const before=read(path.join(stage,'metadata-repair/before/sha256.json'));
 if(sha(path.join(work,'.writer/state.json'))!==before.state_sha256)throw Error('Authority changed after freeze');
 const r=must(cli(['rewind','--from','32','--expected-revision',String(state().revision)],'repair-rewind-32'));
 save(path.join(stage,'metadata-repair/rewind-result.json'),r);console.log(JSON.stringify(r));
}
if(action==='repair-template'){
 const n=Number(process.argv[3]),s=state(),old=read(path.join(stage,'replayed-initial.json')).units.find(u=>u.unit===n);
 if(s.units.length!==n-1)throw Error('Unexpected next unit');
 must(cli(['plan','--input',path.join(work,`大纲/单元/${String(n).padStart(4,'0')}.json`)],`repair-plan-${n}`));
 const context=must(cli(['context','--unit',String(n),'--max-chars','120000'],`repair-context-${n}`));
 save(path.join(stage,`metadata-repair/inputs/${n}-context.json`),context);
 const template=must(cli(['record-template','--unit',String(n),'--draft',old.draft],`repair-template-${n}`));
 save(path.join(stage,`metadata-repair/inputs/${n}-template.json`),template);
 console.log(JSON.stringify({unit:n,revision:template.revision,source_hashes:template.source_hashes,context_revision:context.revision,template_keys:Object.keys(template)}));
}
if(action==='repair-record'){
 const n=Number(process.argv[3]),s=state(),original=read(path.join(stage,'replayed-initial.json')),old=original.units.find(u=>u.unit===n);
 const desired=read(path.join(stage,'metadata-repair/desired-snapshots.json')).snapshots;
 const template=read(path.join(stage,`metadata-repair/inputs/${n}-template.json`));
 const input={...template,summary:old.summary,changes:changesBetween(s.snapshot,desired[n],n)};
 const p=path.join(stage,`metadata-repair/inputs/${n}-record.json`);save(p,input);
 const r=must(cli(['record','--input',p],`repair-record-${n}`));
 const after=state();save(path.join(stage,`metadata-repair/snapshots/${n}.json`),after);
 const comparable=s=>{const v=structuredClone(s);for(const e of Object.values(v.ledger??{})){delete e.updated_unit;for(const a of e.evidence??[]){delete a.sha256;delete a.line;}}return v;};
 if(!same(comparable(after.snapshot),comparable(desired[n])))throw Error(`Replayed semantic snapshot differs at ${n}`);
 logReading(old.draft,'逐章完整实读后正式CLI重登；未改正文（72口语除外）',{unit:n});
 const check=must(cli(['check'],`repair-check-${n}`));
 console.log(JSON.stringify({unit:n,revision:after.revision,record:r,check_findings:check.findings.filter(x=>x.code!=='UNREGISTERED_DRAFT'),unregistered_warnings:check.findings.filter(x=>x.code==='UNREGISTERED_DRAFT').length,pending_windows:check.rolling_review?.pending_windows}));
}
if(action==='freeze-after')console.log(JSON.stringify(freeze('after')));
if(action==='review'){
 const to=Number(process.argv[3]),from=Math.max(1,to-5),s=state(),units=s.units.filter(u=>u.unit>=from&&u.unit<=to);
 if(units.length!==to-from+1)throw Error('Review range is not registered');
 const notes=fs.readFileSync(path.join(stage,`reviews/${to}.md`),'utf8');
 const report=`审查/session09-${from}-${to}-知情自检.md`;
 const source_hashes=Object.fromEntries(units.map(u=>[u.draft,sha(path.join(work,u.draft))]));
 fs.mkdirSync(path.join(work,'审查'),{recursive:true});
 fs.writeFileSync(path.join(work,report),`# 第${from}—${to}章连续阅读\n\n审查性质：本会话同一模型知情自检，非真人、非盲读。实际完整阅读本窗口全部正文；CLI只能证明版本覆盖。\n\n${notes}\n\n## 版本绑定\n\n${Object.entries(source_hashes).map(([p,h])=>`- ${p} SHA-256 ${h}`).join('\n')}\n\n## 真人语言别扭句\n\n已用当面说话、动宾拆分、具体落地、逐句复读改口四项核查。\n\n### 真人语言硬问题\n\n没有\n\n未覆盖真人阅读、市场验证和正式发布验收。\n`);
 const input={from,to,kind:'model-self-review',report,source_hashes};
 const p=path.join(stage,`review-inputs/${to}.json`);save(p,input);
 const r=must(cli(['review','--input',p],`review-${to}`));
 for(const u of units)logReading(u.draft,`第${from}—${to}章完整连续阅读与模型知情自检`,{unit:u.unit});
 logReading(report,'完整阅读并登记本模型知情报告');
 console.log(JSON.stringify({review:r,report,report_sha256:sha(path.join(work,report)),revision:state().revision}));
}
