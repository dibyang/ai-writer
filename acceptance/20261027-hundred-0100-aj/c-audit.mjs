import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const base = 'D:/work/other/ai-writer/acceptance/20261027-hundred-0100-aj';
const main = path.join(base, 'work');
const id = '5ec86233-b90a-4dca-aca0-b4268ab2547b';
const branch = path.join(main, '.writer/revisions', id);
const work = path.join(branch, 'workspace');
const bytes = p => fs.readFileSync(p);
const sha = p => crypto.createHash('sha256').update(bytes(p)).digest('hex');
const json = p => JSON.parse(bytes(p));
const save = (p,v) => fs.writeFileSync(p, JSON.stringify(v,null,2)+'\n',{flag:'wx'});
function drafts(root) {
  const rows=[];
  function walk(dir) { for (const e of fs.readdirSync(dir,{withFileTypes:true})) { const p=path.join(dir,e.name); if(e.isDirectory())walk(p); else if(e.isFile()&&e.name.endsWith('.md'))rows.push({draft:path.relative(root,p).replaceAll('\\','/'),sha256:sha(p)}); } }
  walk(path.join(root,'正文')); return rows.sort((a,b)=>a.draft.localeCompare(b.draft));
}
function quotes(value, unit, result=[]) {
  if(Array.isArray(value))for(const v of value)quotes(v,unit,result);
  else if(value&&typeof value==='object'){if(value.unit===unit&&typeof value.quote==='string')result.push(value.quote);for(const v of Object.values(value))quotes(v,unit,result);}
  return [...new Set(result)];
}
const mode=process.argv[2];
if(mode==='initial') {
  const s=json(path.join(work,'.writer/state.json')), m=json(path.join(main,'.writer/state.json'));
  assert.equal(s.revision,461);assert.equal(s.units.length,108);assert.equal(s.units.at(-1).unit,108);
  const rows={};for(const unit of [109,110]) { const row=m.units.find(x=>x.unit===unit); rows[unit]={row,journal:json(path.join(main,row.journal)),quotes:quotes(m,unit)}; }
  const d110=rows[110].row.draft;
  const before=bytes(path.join(work,d110));
  assert.equal(crypto.createHash('sha256').update(before).digest('hex'),'09f98055cf78cb404189c6be9439d3198df216b0bd4522fe509ba643cb075da0');
  const old='沈把手机从桌面收进包';assert.equal(before.toString('utf8').split(old).length,2);
  assert(rows[110].quotes.every(q=>!q.includes(old)&&!q.includes('沈把手机')&&!old.includes(q)));
  fs.writeFileSync(path.join(base,'c-before-110.md'),before,{flag:'wx'});
  save(path.join(base,'c-original-records.json'),rows);
  save(path.join(base,'c-initial-audit.json'),{id,main_state_sha256:sha(path.join(main,'.writer/state.json')),candidate_state_sha256:sha(path.join(work,'.writer/state.json')),base_sha256:sha(path.join(branch,'base.json')),session_sha256:sha(path.join(branch,'session.json')),resume_sha256:sha(path.join(base,'revision-resume-input.json')),main_drafts:drafts(main),candidate_drafts:drafts(work),unit110_quote_count:rows[110].quotes.length,unit110_selected_text_not_quoted:true});
  console.log('Initial checkpoint, 112 main and candidate draft hashes, original journals and quote exclusion saved.');
} else if(mode==='input') {
  const unit=Number(process.argv[3]);assert([109,110].includes(unit));
  const value=json(path.join(work,`.writer/drafts/c-replay${unit}-generated.json`));
  const report=`审查/c-${unit}-replay-review.md`;
  const draftHash=sha(path.join(work,value.draft));assert.equal(draftHash,value._replay.draft_sha256);
  assert(bytes(path.join(work,report)).toString('utf8').trim().length>100);
  value.replay_review={reviewer:'Codex session C / model-informed-review',report,draft_sha256:draftHash,checked_fields:['summary','characters','timeline','ledger','evidence','downstream']};
  value.draft_review={reviewer:'Codex session C / model-informed-review',report,draft_sha256:draftHash,report_sha256:sha(path.join(work,report))};
  delete value.output;
  save(path.join(work,`.writer/drafts/c-replay${unit}-reviewed.json`),value);
  const before=json(path.join(base,'c-original-records.json'))[unit];
  const draft=bytes(path.join(work,value.draft)).toString('utf8');
  const ledgerQuotes=quotes(before.journal,unit);
  assert(ledgerQuotes.every(q=>draft.includes(q)));
  save(path.join(base,`c-${unit}-input-audit.json`),{unit,draft_sha256:draftHash,input_sha256:sha(path.join(work,`.writer/drafts/c-replay${unit}-reviewed.json`)),report_sha256:value.draft_review.report_sha256,all_original_journal_quotes_preserved:ledgerQuotes.length,historical_issue_quotes_not_treated_as_current_ledger:true,summary:value.summary,changes:value.changes});
  console.log(JSON.stringify({unit,draft_sha256:draftHash,original_ledger_quotes:ledgerQuotes.length,report_sha256:value.draft_review.report_sha256}));
} else if(mode==='final') {
  const initial=json(path.join(base,'c-initial-audit.json')), s=json(path.join(work,'.writer/state.json'));
  assert.equal(s.revision,463);assert.equal(s.units.length,110);assert.equal(s.units.at(-1).unit,110);
  for(const [p,expected] of [[path.join(main,'.writer/state.json'),initial.main_state_sha256],[path.join(branch,'base.json'),initial.base_sha256],[path.join(branch,'session.json'),initial.session_sha256],[path.join(base,'revision-resume-input.json'),initial.resume_sha256]])assert.equal(sha(p),expected);
  assert.deepEqual(drafts(main),initial.main_drafts);
  const current=drafts(work), changes=current.filter((r,i)=>r.sha256!==initial.candidate_drafts[i].sha256);assert.equal(changes.length,1);assert(changes[0].draft.includes('/0110-'));
  const before=bytes(path.join(base,'c-before-110.md')).toString('utf8'), after=bytes(path.join(work,changes[0].draft)).toString('utf8');
  assert.equal(after,before.replace('沈把手机从桌面收进包','沈将手机从桌面收进包'));
  const registered=[];
  const original=json(path.join(base,'c-original-records.json'));
  const normalizeEvidence=v=>{if(Array.isArray(v))return v.map(normalizeEvidence);if(v&&typeof v==='object'){const out=Object.fromEntries(Object.entries(v).map(([k,x])=>[k,normalizeEvidence(x)]));if(typeof v.quote==='string'&&[109,110].includes(v.unit)){out.draft='<current-path>';out.sha256='<current-draft-hash>';}return out;}return v;};
  for(const unit of [109,110]) {
    const row=s.units.find(x=>x.unit===unit), j=json(path.join(work,row.journal));
    assert.equal(row.sha256,sha(path.join(work,row.draft)));
    assert.equal(row.summary,original[unit].row.summary);
    assert.deepEqual(normalizeEvidence(j),normalizeEvidence(original[unit].journal));
    const reviewed=json(path.join(work,`.writer/drafts/c-replay${unit}-reviewed.json`));
    const context=json(path.join(base,'commands',unit===109?'c-context-109-expanded':'c-context-110-before-edit','stdout.raw.txt'));
    assert.deepEqual(reviewed.source_hashes,context.source_hashes);
    for(const kind of ['replay_review','draft_review']) {const r=row[kind];assert.equal(r.draft_sha256,row.sha256);assert.equal(sha(path.join(work,r.report)),r.report_sha256);assert.equal(sha(path.join(work,r.frozen_ref)),r.report_sha256);}
    registered.push({unit,row,journal_sha256:sha(path.join(work,row.journal)),journal:j,original_semantics_preserved:true,reports_frozen_bytes_verified:true,source_hashes_match_pre_edit_context:true});
  }
  const commands=fs.readdirSync(path.join(base,'commands')).filter(x=>x.startsWith('c-')).sort().map(label=>{const r=json(path.join(base,'commands',label,'result.json'));return {label,exit_code:r.exit_code,stderr_bytes:bytes(path.join(base,'commands',label,'stderr.raw.txt')).length,runtime_files_stable:r.runtime_files_stable,before_state_sha256:r.before_state_sha256,after_state_sha256:r.after_state_sha256};});
  save(path.join(base,'c-final-verification.json'),{id,base_revision:459,candidate_revision:s.revision,registered_through:110,next_unit:111,main_state_unchanged:true,main_112_drafts_unchanged:true,candidate_only_changed_this_session:changes,session_base_resume_unchanged:true,candidate_state_sha256:sha(path.join(work,'.writer/state.json')),original_candidate_state_sha256:initial.candidate_state_sha256,registered,commands,remaining_drafts:current.filter(x=>/\/011[12]-/.test(x.draft))});
  console.log(JSON.stringify({revision:s.revision,next_unit:111,main_unchanged:true,changed:changes,commands}));
} else throw Error('Unknown mode');
