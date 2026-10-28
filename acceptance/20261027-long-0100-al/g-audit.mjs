import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {isDeepStrictEqual as eq} from 'node:util';
import {fileURLToPath} from 'node:url';
import {applyDelta} from './work/.writer/tool/lib/journal.mjs';
const base=path.dirname(fileURLToPath(import.meta.url)),root=path.join(base,'work');
const read=(r,p)=>fs.readFileSync(path.join(r,p)),j=(r,p)=>JSON.parse(read(r,p)),sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const rec=j(base,'session-d-recovery.json'),croot=rec.workspace,m=j(root,'.writer/state.json'),c=j(croot,'.writer/state.json');
const save=(p,v)=>fs.writeFileSync(path.join(base,p),JSON.stringify(v,null,2)+'\n',{flag:'wx'});
const journal=(r,row)=>{assert.equal(sha(read(r,row.journal)),row.journal_sha256);return j(r,row.journal).patch;};
const mode=process.argv[2];
if(mode==='start'){
 const s=j(root,`.writer/revisions/${rec.id}/session.json`),b=j(root,`.writer/revisions/${rec.id}/base.json`),f=j(base,'session-f-start.json'),oldAudit=j(base,'session-f-stopped-audit.json');
 assert.equal(rec.id,'dd6f0f3b-1f02-4db2-be4e-34fe7fe658c7');assert.equal(s.id,rec.id);assert.equal(s.project_id,'cd8e8d32-f685-41b1-8f52-5447fe29d399');assert.equal(s.status,'editing');assert.equal(b.revision,473);
 assert.equal(sha(read(root,`.writer/revisions/${rec.id}/base.json`)),'407040ab54b5715c83e042afe6712135f880dd4a6c1340ec95d27d7fc78e0bf5');
 assert.equal(sha(read(root,'.writer/state.json')),'d0584647414d9bbc4c4fb3d0b8575fae7fcb46fab612120e2d2e3840d714205a');assert.equal(m.revision,473);assert.equal(m.units.length,118);assert.equal(c.revision,482);assert.equal(c.units.length,117);
 assert.equal(sha(read(croot,'.writer/state.json')),'5f7ba7a6d5364068eee85fb3b469238082197b21cecaf70d06005d5a7be49e58');assert.equal(j(base,'commands/g-002-candidate-status/stdout.raw.txt').next_unit,118);
 const rows=m.units.map(row=>{const a=sha(read(root,row.draft)),b=sha(read(croot,row.draft));assert.equal(a,f.main_files[row.draft]);assert.equal(b,f.branch_files[row.draft]);assert.equal(a,row.sha256);return {unit:row.unit,draft:row.draft,main:a,candidate:b};});
 const manifest=Object.entries(b.files);assert.equal(manifest.length,1321);for(const [ref,hash]of manifest)assert.equal(sha(read(root,ref)),hash,`baseline changed: ${ref}`);
 assert.equal(read(croot,m.units[109].draft).toString(),read(root,m.units[109].draft).toString().replace('她原想接问像哪个同学','她原想接着问像哪个同学'));
 assert.equal(read(croot,m.units[111].draft).toString(),read(root,m.units[111].draft).toString().replace('那七八分钟没让沈觉得特别长。','沈没觉得那七八分钟特别长。'));
 const hashes=new Map([[m.units[109].sha256,c.units[109].sha256],[m.units[111].sha256,c.units[111].sha256]]);
 function reanchor(x){if(Array.isArray(x))return x.map(reanchor);if(x&&typeof x==='object')return Object.fromEntries(Object.entries(x).map(([k,v])=>[k,k==='sha256'&&hashes.has(v)?hashes.get(v):reanchor(v)]));return x;}
 const original=journal(root,m.units[117]),preview=j(base,'commands/f-010-preview118/stdout.raw.txt'),mapped=reanchor(original),actual=preview.changes;
 assert(eq(original,oldAudit.original_patch));assert.equal(preview.ok,true);assert.equal(preview.writes,false);assert(eq(preview.findings,[]));assert.equal(preview.source_hashes,'matched-current-context');
 const key=x=>JSON.stringify(x.at),map=new Map(mapped.map(x=>[key(x),x]));assert.equal(mapped.length,26);assert.equal(actual.length,26);assert.equal(map.size,26);assert.equal(new Set(actual.map(key)).size,26);
 assert(actual.every(x=>eq(x,map.get(key(x)))));
 for(const list of [mapped,actual])for(let i=0;i<list.length;i++)for(let k=i+1;k<list.length;k++){const a=list[i].at,b=list[k].at;assert(!a.slice(0,Math.min(a.length,b.length)).every((v,n)=>v===b[n]),'ancestor overlap');}
 const left=applyDelta(c.snapshot,mapped),right=applyDelta(c.snapshot,actual);assert(eq(left,right));assert(!eq(mapped,actual));
 const oldBefore=applyDelta(m.snapshot,original,true);assert(eq(reanchor(oldBefore),c.snapshot));assert(eq(left,reanchor(m.snapshot)));
 const cross=[];for(const n of [116,117]){assert(eq(reanchor(journal(root,m.units[n-1])),journal(croot,c.units[n-1])));cross.push({unit:n,old_journal:m.units[n-1].journal_sha256,current_journal:c.units[n-1].journal_sha256,reanchored_equal:true});}
 const quotes=[];for(const n of [116,117,118]){const input=j(croot,`.writer/drafts/AL-f-record${n}.json`);for(const [id,item]of Object.entries(input.changes.ledger??{}))for(const e of item.evidence??[]){const row=m.units[e.unit-1],text=read(croot,row.draft).toString('utf8'),at=text.indexOf(e.quote);assert(at>=0,`quote missing ${n}/${id}`);quotes.push({review_unit:n,id,unit:e.unit,quote:e.quote,line:text.slice(0,at).split('\n').length,sha256:sha(read(croot,row.draft))});}}
 const out={ok:true,created_at:new Date().toISOString(),id:rec.id,main_revision:m.revision,candidate_revision:c.revision,next:118,main_state_sha256:sha(read(root,'.writer/state.json')),candidate_state_sha256:sha(read(croot,'.writer/state.json')),operations:26,equal_by_path:true,distinct_nonoverlapping_paths:true,order_sensitive_equal:false,equal_result:true,result_sha256:sha(JSON.stringify(left)),old_before_equals_current_candidate_after_only_110_112_evidence_hash_reanchor:true,result_equals_reanchored_original_118_snapshot:true,original_order:mapped.map(key),preview_order:actual.map(key),source_sha256:{local_journal:sha(read(root,'.writer/tool/lib/journal.mjs')),old_audit:sha(read(base,'session-f-stopped-audit.json')),old_checker:sha(read(base,'f-order-independent-check.mjs')),old_preview:sha(read(base,'commands/f-010-preview118/stdout.raw.txt'))},cross_chapter_reanchors:cross,quotes,rows,prior_units:c.units};
 assert.equal(out.result_sha256,j(base,'f-order-independent-check.json').result_sha256);save('session-g-start-audit.json',out);console.log(JSON.stringify({ok:true,operations:26,equal_result:true,result_sha256:out.result_sha256,quotes:quotes.length}));
}
if(mode==='preflight'){
 const b=j(root,`.writer/revisions/${rec.id}/base.json`),f=j(croot,'.writer/drafts/AL-f-record118.json'),p=j(base,'commands/g-003-preview118-original-reviewed/stdout.raw.txt');
 const rows=Object.entries(b.files);assert.equal(rows.length,1321);for(const [ref,hash]of rows)assert.equal(sha(read(root,ref)),hash,`baseline changed ${ref}`);
 for(const [ref,hash]of Object.entries(f.source_hashes))assert.equal(sha(read(croot,ref)),hash,`source changed ${ref}`);
 assert.equal(read(croot,m.units[109].draft).toString(),read(root,m.units[109].draft).toString().replace('她原想接问像哪个同学','她原想接着问像哪个同学'));
 assert.equal(read(croot,m.units[111].draft).toString(),read(root,m.units[111].draft).toString().replace('那七八分钟没让沈觉得特别长。','沈没觉得那七八分钟特别长。'));
 assert(p.ok&&!p.writes&&eq(p.findings,[]));assert(eq(p.changes,j(base,'commands/f-010-preview118/stdout.raw.txt').changes));
 assert.equal(sha(read(croot,f.replay_review.report)),'1184c90de137fc599d5fb0427adc3e36c6122bb5740f072ec5830bcbf67a0c6a');
 const detail=[];for(const n of [116,117]){const old=journal(root,m.units[n-1]),now=journal(croot,c.units[n-1]),diff=[];function visit(a,b,p=[]){if(eq(a,b))return;if(a&&b&&typeof a==='object'&&typeof b==='object'){for(const k of new Set([...Object.keys(a),...Object.keys(b)]))visit(a[k],b[k],[...p,k]);}else diff.push({path:p,before:a,after:b});}visit(old,now);assert(diff.every(x=>x.path.at(-1)==='sha256'&&[109,111].some(i=>x.before===m.units[i].sha256&&x.after===c.units[i].sha256)));detail.push({unit:n,changes:diff});}
 save('session-g-preflight.json',{ok:true,baseline_files:rows.length,main_state_sha256:sha(read(root,'.writer/state.json')),candidate_state_sha256:sha(read(croot,'.writer/state.json')),old_118_input_valid:true,all_source_hashes_matched:true,old_report_sha256:sha(read(croot,f.replay_review.report)),g_preview_matches_f_preview:true,exact_only_two_prose_changes:true,cross_chapter_reanchor_detail:detail,script_sha256:sha(fs.readFileSync(fileURLToPath(import.meta.url)))});console.log(JSON.stringify({ok:true,baseline_files:rows.length,old_input_valid:true,reanchor_detail:detail}));
}
