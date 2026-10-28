import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {isDeepStrictEqual as equal} from 'node:util';
import {applyDelta} from './work/.writer/tool/lib/journal.mjs';
const base=path.dirname(fileURLToPath(import.meta.url)), main=path.join(base,'work');
const recovery=JSON.parse(fs.readFileSync(path.join(base,'session-d-recovery.json'))), root=recovery.workspace;
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const bytes=(r,p)=>fs.readFileSync(path.join(r,p));
const json=(r,p)=>JSON.parse(bytes(r,p));
const save=(r,p,v)=>{fs.mkdirSync(path.dirname(path.join(r,p)),{recursive:true});fs.writeFileSync(path.join(r,p),JSON.stringify(v,null,2)+'\n',{flag:'wx'});};
const state=r=>json(r,'.writer/state.json');
const patch=(r,row)=>{const b=bytes(r,row.journal);if(sha(b)!==row.journal_sha256)throw Error('journal SHA mismatch');return JSON.parse(b).patch;};
function snapshot(r,s,n){let out=structuredClone(s.snapshot);for(const row of [...s.units].reverse()){if(row.unit<=n)break;out=applyDelta(out,patch(r,row),true,false);}return out;}
const mode=process.argv[2];
if(mode==='start'){
 const m=state(main),c=state(root),status=json(base,'commands/e-002-status-at113/stdout.raw.txt'),resume=json(base,'commands/e-001-resume/stdout.raw.txt');
 if(c.revision!==477||c.units.length!==112||c.units.at(-1).unit!==112||status.next_unit!==113||resume.id!=='dd6f0f3b-1f02-4db2-be4e-34fe7fe658c7'||resume.base_revision!==473)throw Error('STOP: unexpected recovery state');
 for(const n of [110,111,112])if(c.units[n-1].replay_review?.base?.session_id!==resume.id)throw Error('STOP: 110-112 not replay recorded');
 const rows=m.units.map(row=>({unit:row.unit,draft:row.draft,main_sha256:sha(bytes(main,row.draft)),candidate_sha256:sha(bytes(root,row.draft)),journal:row.journal,journal_sha256:row.journal_sha256}));
 save(base,'session-e-start.json',{created_at:new Date().toISOString(),id:resume.id,base_revision:resume.base_revision,main_state_sha256:sha(bytes(main,'.writer/state.json')),candidate_state_sha256:sha(bytes(root,'.writer/state.json')),candidate_units:c.units,main_units:m.units,rows});
 save(root,'研究/AL-e-reading-manifest.json',{reviewer:'本轮Codex知情语义自检，非盲读',complete_read_units:[27,95,105,110,111,112,113,114,115,116,117,118],rows:rows.filter(x=>[27,95,105,110,111,112,113,114,115,116,117,118].includes(x.unit)),note:'只列真实完整实读；其他章字节核验不能作为实读。'});
 console.log(JSON.stringify({ok:true,main_revision:m.revision,candidate_revision:c.revision,registered:c.units.length,next:status.next_unit,hash_rows:rows.length}));
}else if(mode==='input'){
 const n=Number(process.argv[3]),label=process.argv[4],raw=bytes(base,`commands/${label}/stdout.raw.txt`),v=JSON.parse(raw),m=state(main),row=m.units[n-1],body=bytes(root,v.draft),report=`审查/AL-e-${n}-replay-review.md`;
 if(v.unit!==n||sha(body)!==v._replay.draft_sha256||v._replay.old_unit_sha256!==row.sha256||v.summary!==row.summary)throw Error('input identity drift');
 if(!fs.existsSync(path.join(root,report)))throw Error('semantic report required');
 const before=snapshot(main,m,n-1),after=applyDelta(before,patch(main,row));
 const quotes=[];for(const [id,entry] of Object.entries(v.changes.ledger??{}))for(const e of entry.evidence??[]){const source=m.units[e.unit-1].draft,sourceBytes=bytes(root,source),text=sourceBytes.toString('utf8'),at=text.indexOf(e.quote);if(at<0)throw Error(`missing quote ${id}`);const old=after.ledger[id].evidence.find(x=>x.unit===e.unit&&x.quote===e.quote);if(!old)throw Error('old evidence not found');quotes.push({id,unit:e.unit,draft:source,quote:e.quote,current_line:text.slice(0,at).split('\n').length,current_sha256:sha(sourceBytes),old_evidence:old});}
 save(root,`研究/AL-e-${n}-evidence-comparison.json`,{unit:n,old_summary:row.summary,current_reviewed_summary:v.summary,old_journal:row.journal,old_journal_sha256:row.journal_sha256,old_patch:patch(main,row),old_before:Object.fromEntries(Object.keys(v.changes.ledger??{}).map(k=>[k,before.ledger[k]??null])),old_after:Object.fromEntries(Object.keys(v.changes.ledger??{}).map(k=>[k,after.ledger[k]])),current_replay_changes:v.changes,quotes});
 fs.mkdirSync(path.join(root,'.writer/drafts'),{recursive:true});fs.writeFileSync(path.join(root,`.writer/drafts/AL-e-replay${n}-raw.json`),raw,{flag:'wx'});
 v.replay_review={reviewer:'AL-session-e-Codex-informed-semantic-review',report,draft_sha256:sha(body),checked_fields:['summary','characters','timeline','ledger','evidence','downstream']};
 save(root,`.writer/drafts/AL-e-record${n}.json`,v);
 console.log(JSON.stringify({ok:true,unit:n,draft_sha256:sha(body),quotes:quotes.length,report_sha256:sha(bytes(root,report)),summary_kept:true,changes_kept:true,source_hashes_modified:false}));
}else if(mode==='review-data'){
 const v=json(root,'研究/AL-e-115-evidence-comparison.json'),s=JSON.stringify(v.old_patch,null,2),wrapped=s.split('\n').flatMap(line=>{const chars=Array.from(line),out=[];for(let i=0;i<chars.length;i+=100)out.push(chars.slice(i,i+100).join(''));return out;}).join('\n');
 fs.writeFileSync(path.join(root,'研究/AL-e-115-old-patch-reading.txt'),wrapped+'\n',{flag:'wx'});
 const manifest=json(root,'研究/AL-e-reading-manifest.json'),initial=json(base,'session-e-start.json');manifest.complete_read_units=[27,95,100,105,109,110,111,112,113,114,115,116,117,118];manifest.rows=initial.rows.filter(x=>manifest.complete_read_units.includes(x.unit));manifest.additional_read_note='100及109在113/114报告之后、115报告完成前实际完整回读。';
 fs.writeFileSync(path.join(root,'研究/AL-e-reading-manifest.json'),JSON.stringify(manifest,null,2)+'\n');
 console.log(JSON.stringify({ok:true,read_units:manifest.complete_read_units,old_patch_operations:v.old_patch.length,wrapped_lines:wrapped.split('\n').length}));
}else if(mode==='review-input'){
 const s=state(root),rows=s.units.filter(x=>x.unit>=110&&x.unit<=115);
 if(rows.length!==6||s.units.length!==115)throw Error('review scope not recorded');
 save(root,'.writer/drafts/AL-e-review110-115.json',{from:110,to:115,kind:'model-self-review',report:'审查/AL-e-110-115-rolling-review.md',source_hashes:Object.fromEntries(rows.map(x=>[x.draft,sha(bytes(root,x.draft))]))});
 console.log(JSON.stringify({ok:true,from:110,to:115}));
}else if(mode==='finish'){
 const initial=json(base,'session-e-start.json'),m=state(main),c=state(root),rows=initial.rows.map(row=>({...row,main_final_sha256:sha(bytes(main,row.draft)),candidate_final_sha256:sha(bytes(root,row.draft))}));
 if(sha(bytes(main,'.writer/state.json'))!==initial.main_state_sha256||!equal(m.units,initial.main_units))throw Error('main changed');
 if(c.units.length!==115||c.units.at(-1).unit!==115||!equal(c.units.slice(0,112),initial.candidate_units))throw Error('candidate registration unexpected');
 if(rows.some(x=>x.main_sha256!==x.main_final_sha256||x.candidate_sha256!==x.candidate_final_sha256))throw Error('body bytes changed');
 const old110=m.units[109].sha256,old112=m.units[111].sha256,normalize=x=>JSON.parse(JSON.stringify(x).replaceAll(c.units[109].sha256,old110).replaceAll(c.units[111].sha256,old112));
 const registered=[];for(const n of [113,114,115]){const old=m.units[n-1],now=c.units[n-1],v=json(root,`.writer/drafts/AL-e-record${n}.json`);if(now.summary!==old.summary||!equal(normalize(patch(root,now)),patch(main,old)))throw Error(`journal semantics changed ${n}`);registered.push({unit:n,draft:now.draft,sha256:now.sha256,journal_sha256:now.journal_sha256,replay_review:now.replay_review,checked_fields:v.replay_review.checked_fields});}
 const snapshot_matches=equal(normalize(c.snapshot),snapshot(main,m,115));if(!snapshot_matches)throw Error('candidate snapshot differs from old115 beyond two hashes');
 const commands=fs.readdirSync(path.join(base,'commands')).filter(x=>x.startsWith('e-')).sort().map(label=>{const dir=`commands/${label}`,v=json(base,`${dir}/result.json`);if(v.input&&sha(bytes(base,`${dir}/input.raw.json`))!==v.input.sha256)throw Error('capture input mismatch');return{label,exit_code:v.exit_code,stderr_bytes:bytes(base,`${dir}/stderr.raw.txt`).length,runtime_files_stable:v.runtime_files_stable,input_sha256:v.input?.sha256??null,before:v.before_state_sha256,after:v.after_state_sha256};});
 save(base,'session-e-audit.json',{ok:true,scope:'mechanical-byte-and-journal-audit-not-literary-acceptance',id:initial.id,base_revision:473,main_revision:m.revision,candidate_revision:c.revision,registered_units:115,next_unit:116,main_state_sha256:sha(bytes(main,'.writer/state.json')),candidate_state_sha256:sha(bytes(root,'.writer/state.json')),main_unchanged:true,prior112_rows_unchanged:true,all118_body_bytes_unchanged:true,snapshot_matches_old115_after_normalizing_only_two_D_evidence_hashes:snapshot_matches,registered,tail:rows.filter(x=>x.unit>=116),rows,commands});
 console.log(JSON.stringify({ok:true,registered:registered.map(x=>({unit:x.unit,sha256:x.sha256})),next:116,commands:commands.length,candidate_revision:c.revision}));
}else throw Error('start | input N label | finish');
