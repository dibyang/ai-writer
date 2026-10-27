import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const base='D:/work/other/ai-writer/acceptance/20261027-hundred-0100-aj';
const main=path.join(base,'work'), id='5ec86233-b90a-4dca-aca0-b4268ab2547b';
const branch=path.join(main,'.writer/revisions',id), work=path.join(branch,'workspace');
const bytes=p=>fs.readFileSync(p), json=p=>JSON.parse(bytes(p));
const sha=p=>crypto.createHash('sha256').update(bytes(p)).digest('hex');
const save=(p,v)=>fs.writeFileSync(p,JSON.stringify(v,null,2)+'\n',{flag:'wx'});
function drafts(root){const rows=[];function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory())walk(p);else if(e.isFile()&&e.name.endsWith('.md'))rows.push({draft:path.relative(root,p).replaceAll('\\','/'),sha256:sha(p)});}}walk(path.join(root,'正文'));return rows.sort((a,b)=>a.draft.localeCompare(b.draft));}
function quotes(v,u,out=[]){if(Array.isArray(v))for(const x of v)quotes(x,u,out);else if(v&&typeof v==='object'){if(v.unit===u&&typeof v.quote==='string')out.push(v.quote);for(const x of Object.values(v))quotes(x,u,out);}return [...new Set(out)];}
const mode=process.argv[2];
if(mode==='initial'){
 const s=json(path.join(work,'.writer/state.json')),m=json(path.join(main,'.writer/state.json'));
 assert.equal(s.revision,463);assert.equal(s.units.length,110);assert.equal(s.units.at(-1).unit,110);assert.equal(m.revision,459);
 const rows={};for(const u of [111,112]){const row=m.units.find(x=>x.unit===u);assert.equal(sha(path.join(work,row.draft)),row.sha256);rows[u]={row,journal:json(path.join(main,row.journal))};}
 save(path.join(base,'d-original-records.json'),rows);
 save(path.join(base,'d-initial-audit.json'),{id,main_state_sha256:sha(path.join(main,'.writer/state.json')),candidate_state_sha256:sha(path.join(work,'.writer/state.json')),base_sha256:sha(path.join(branch,'base.json')),session_sha256:sha(path.join(branch,'session.json')),resume_sha256:sha(path.join(base,'revision-resume-input.json')),main_drafts:drafts(main),candidate_drafts:drafts(work)});
 console.log('Verified original 463 / registered 110 / next 111; saved both 112-draft manifests and original 111/112 journals.');
}else if(mode==='input'){
 const unit=Number(process.argv[3]);assert([111,112].includes(unit));
 const v=json(path.join(work,`.writer/drafts/d-${unit}-generated.json`)), report=`审查/d-${unit}-replay-review.md`;
 const hash=sha(path.join(work,v.draft));assert.equal(hash,v._replay.draft_sha256);
 const original=json(path.join(base,'d-original-records.json'))[unit];assert.equal(hash,original.row.sha256);
 const context=json(path.join(base,'commands',unit===111?'d-05-context-111':'d-09-context-112','stdout.raw.txt'));assert.deepEqual(v.source_hashes,context.source_hashes);
 const qs=quotes(original.journal,unit),body=bytes(path.join(work,v.draft)).toString('utf8');assert(qs.every(q=>body.includes(q)));assert(bytes(path.join(work,report)).toString('utf8').includes(hash));
 v.replay_review={reviewer:'Codex session D / model-informed-review',report,draft_sha256:hash,checked_fields:['summary','characters','timeline','ledger','evidence','downstream']};
 v.draft_review={reviewer:'Codex session D / model-informed-review',report,draft_sha256:hash,report_sha256:sha(path.join(work,report))};delete v.output;
 save(path.join(work,`.writer/drafts/d-${unit}-reviewed.json`),v);
 save(path.join(base,`d-${unit}-input-audit.json`),{unit,draft_sha256:hash,unchanged_from_original:true,source_hashes_equal_current_context:true,original_journal_quotes:qs,all_quotes_present:true,report_sha256:v.draft_review.report_sha256,input_sha256:sha(path.join(work,`.writer/drafts/d-${unit}-reviewed.json`))});
 console.log(JSON.stringify({unit,hash,quotes:qs.length,report_sha256:v.draft_review.report_sha256}));
}else if(mode==='precommit'){
 const first=json(path.join(base,'d-initial-audit.json')),s=json(path.join(work,'.writer/state.json'));
 assert.equal(s.units.length,112);assert.equal(s.units.at(-1).unit,112);assert.deepEqual(drafts(work),first.candidate_drafts);assert.deepEqual(drafts(main),first.main_drafts);assert.equal(sha(path.join(main,'.writer/state.json')),first.main_state_sha256);
 assert.equal(sha(path.join(branch,'session.json')),first.session_sha256);assert.equal(sha(path.join(branch,'base.json')),first.base_sha256);assert.equal(sha(path.join(base,'revision-resume-input.json')),first.resume_sha256);
 const candidate=drafts(work),changes=candidate.filter((r,i)=>r.sha256!==first.main_drafts[i].sha256);assert.equal(changes.length,2);
 for(const [u,oldText,newText] of [[108,'小包里放手机和钥匙','将手机和钥匙放进小包'],[110,'沈把手机从桌面收进包','沈将手机从桌面收进包']]){const r=s.units.find(x=>x.unit===u),original=bytes(path.join(main,r.draft)).toString('utf8');assert.equal(original.split(oldText).length,2);assert.equal(bytes(path.join(work,r.draft)).toString('utf8'),original.replace(oldText,newText));}
 const norm=v=>{if(Array.isArray(v))return v.map(norm);if(v&&typeof v==='object'){const out=Object.fromEntries(Object.entries(v).map(([k,x])=>[k,norm(x)]));if(typeof v.quote==='string'&&[111,112].includes(v.unit))out.draft='<current-path>';return out;}return v;};
 const orig=json(path.join(base,'d-original-records.json')),rows=[];
 for(const u of [111,112]){const row=s.units.find(x=>x.unit===u);assert.equal(row.summary,orig[u].row.summary);assert.deepEqual(norm(json(path.join(work,row.journal))),norm(orig[u].journal));assert.equal(sha(path.join(work,row.draft)),orig[u].row.sha256);rows.push({unit:u,draft_sha256:row.sha256,journal_sha256:sha(path.join(work,row.journal)),summary_and_journal_semantics_equal_original:true});}
 const review=json(path.join(work,'.writer/drafts/d-103-112-review-reviewed.json'));for(const [ref,hash] of Object.entries(review.source_hashes))assert.equal(sha(path.join(work,ref)),hash);assert.equal(review.chapter_functions.length,10);
 save(path.join(base,'d-precommit-verification.json'),{candidate_revision:s.revision,main_state_unchanged:true,candidate_112_drafts_unchanged_this_session:true,only_two_controlled_differences:changes,original_id_base_owner_credentials_unchanged:true,recorded:rows,rolling_report_sha256:sha(path.join(work,review.report))});
 console.log('Precommit: main unchanged, candidate 112 bodies unchanged in D; only original 108/110 test replacements vs main; 111/112 summary and journals equivalent.');
}else if(mode==='final'){
 const first=json(path.join(base,'d-initial-audit.json')),s=json(path.join(work,'.writer/state.json')),m=json(path.join(main,'.writer/state.json'));
 assert.equal(s.units.length,112);assert.equal(s.units.at(-1).unit,112);assert.deepEqual(drafts(work),first.candidate_drafts);
 assert.equal(s.revision,466);assert.equal(m.revision,460);assert.deepEqual(drafts(main),drafts(work));
 const session=json(path.join(branch,'session.json'));assert.equal(session.status,'committed');assert.equal(session.id,id);assert.equal(session.owner,'AJ-独立验证');
 const prepared=json(path.join(base,'commands/d-16-prepare-original/stdout.raw.txt'));assert.equal(prepared.ok,true);for(const change of prepared.changes)assert.equal(sha(path.join(main,change.file)),change.after);
 const reviewRef='.writer/reviews/c2fbc636-b166-4935-9227-5b404ba3867d.json',review=json(path.join(main,reviewRef));assert.equal(review.from,103);assert.equal(review.to,112);assert.equal(review.kind,'model-self-review');assert.equal(sha(path.join(main,review.report)),review.report_sha256);assert.equal(sha(path.join(main,review.frozen_report)),review.report_sha256);for(const r of review.units){assert.equal(sha(path.join(main,r.draft)),r.sha256);assert.equal(sha(path.join(main,r.frozen_ref)),r.sha256);}
 assert.equal(sha(path.join(branch,'base.json')),first.base_sha256);assert.equal(sha(path.join(base,'revision-resume-input.json')),first.resume_sha256);
 const originals=json(path.join(base,'d-original-records.json')), registered=[];
 for(const u of [111,112]){const r=s.units.find(x=>x.unit===u);assert.equal(r.sha256,originals[u].row.sha256);assert.equal(sha(path.join(work,r.draft)),r.sha256);for(const k of ['replay_review','draft_review']){const rv=r[k];assert.equal(rv.draft_sha256,r.sha256);assert.equal(sha(path.join(work,rv.report)),rv.report_sha256);assert.equal(sha(path.join(work,rv.frozen_ref)),rv.report_sha256);}registered.push({unit:u,row:r,journal_sha256:sha(path.join(work,r.journal))});}
 const commands=fs.readdirSync(path.join(base,'commands')).filter(x=>x.startsWith('d-')).sort().map(label=>{const r=json(path.join(base,'commands',label,'result.json'));return {label,exit_code:r.exit_code,stderr_bytes:bytes(path.join(base,'commands',label,'stderr.raw.txt')).length,runtime_files_stable:r.runtime_files_stable,before_state_sha256:r.before_state_sha256,after_state_sha256:r.after_state_sha256};});
 const changes=drafts(main).filter((r,i)=>r.sha256!==first.main_drafts[i].sha256);
 assert.equal(changes.length,2);assert(commands.every(r=>r.exit_code===0&&r.stderr_bytes===0&&r.runtime_files_stable===true));
 save(path.join(base,'d-final-verification.json'),{id,candidate_revision:s.revision,main_revision:m.revision,next_unit:113,next_unit_is_not_authorization:true,candidate_state_sha256:sha(path.join(work,'.writer/state.json')),main_state_sha256:sha(path.join(main,'.writer/state.json')),candidate_drafts_unchanged_this_session:true,main_draft_changes:changes,all_prepared_files_match_after_commit:true,main_candidate_112_bodies_equal:true,base_resume_unchanged:true,session:{id:session.id,owner:session.owner,status:session.status,sha256:sha(path.join(branch,'session.json'))},rolling_review:{ref:reviewRef,sha256:sha(path.join(main,reviewRef)),report_sha256:review.report_sha256,all_10_frozen_bodies_and_report_verified:true},registered,commands});
 console.log(JSON.stringify({candidate_revision:s.revision,main_revision:m.revision,changes,commands}));
}else throw Error('Unknown mode');
