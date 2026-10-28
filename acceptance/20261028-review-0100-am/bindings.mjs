import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const out=path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/,'$1'));
const work=path.resolve(out,'../20261027-long-0100-al/work');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const s=JSON.parse(fs.readFileSync(path.join(work,'.writer/state.json')));
const read=p=>fs.readFileSync(path.join(work,p));
const j=p=>JSON.parse(read(p));
const issues=JSON.parse(fs.readFileSync(path.join(out,'issues.stdout.json'))).issues;
const windows=[[97,102],[100,105],[103,108],[106,111],[109,114]];
const records=[];
for(const name of fs.readdirSync(path.join(work,'.writer/reviews')).filter(x=>x.endsWith('.json'))){
 const ref=`.writer/reviews/${name}`;const expected=s.review_workflow.reports[ref]??null;
 const r=j(ref);
 if(!(r.to>=97&&r.from<=114))continue;
 const dep=u=>sha(JSON.stringify({source_hashes:u.source_hashes,source_bindings:u.source_bindings??{},decision_bindings:u.decision_bindings??[]}));
 records.push({ref,sha256:sha(read(ref)),expected,from:r.from,to:r.to,report:r.report,frozen_report:r.frozen_report,report_sha256:r.report_sha256,report_hash_matched:sha(read(r.frozen_report??r.report))===r.report_sha256,current_report_hash_matched:sha(read(r.report))===r.report_sha256,units:r.units.map(u=>({unit:u.unit,old_sha256:u.sha256,current_sha256:s.units.find(x=>x.unit===u.unit).sha256,dependency_matched:r.dependencies? r.dependencies[u.unit]===dep(s.units[u.unit-1]):null})),comparison:r.comparison});
}
fs.writeFileSync(path.join(out,'window-bindings.json'),JSON.stringify(records,null,2)+'\n');
let evidence='';const binding=[];
for(const issue of issues){
 evidence+=`\n## ${issue.id}\n`;
 const r=j(issue.origin.review_ref);
 const entries=[];
 for(const e of issue.evidence){
  const old=r.units.find(u=>u.unit===e.unit&&u.sha256===e.sha256);
  const frozen=old?.frozen_ref??`.writer/objects/${e.sha256}.review-body`;
  const oldText=read(frozen).toString('utf8');const lines=oldText.split(/\r?\n/);
  const current=s.units.find(u=>u.unit===e.unit);const curText=read(current.draft).toString('utf8');
  const at=lines[e.line-1]??'';
  entries.push({evidence:e,frozen,old_hash_matched:sha(read(frozen))===e.sha256,quote_at_line:at.includes(e.quote),current_draft:current.draft,current_hash:sha(read(current.draft)),current_matches_application:issue.application.after_units.find(u=>u.unit===e.unit)?.sha256===sha(read(current.draft))});
  evidence+=`\nold chapter ${e.unit}, ${frozen}, SHA ${e.sha256}\n`+lines.slice(Math.max(0,e.line-4),e.line+3).map((t,i)=>`${Math.max(1,e.line-3)+i}\t${t}`).join('\n')+'\n';
 }
 binding.push({id:issue.id,entries,origin:issue.origin,verification_ref:issue.verification.review_ref,history:issue.history.map(x=>({ref:x.ref,hash_matched:sha(read(x.ref))===x.sha256,event:j(x.ref)}))});
}
fs.writeFileSync(path.join(out,'original-evidence.md'),evidence);
fs.writeFileSync(path.join(out,'issue-bindings.json'),JSON.stringify(binding,null,2)+'\n');
const readUnits=[36,71,72,73,75,79,81,83,...Array.from({length:18},(_,i)=>97+i)];
fs.writeFileSync(path.join(out,'reading-manifest.json'),JSON.stringify(readUnits.map(n=>{const u=s.units.find(x=>x.unit===n);return {unit:n,draft:u.draft,sha256:sha(read(u.draft)),registered_sha256:u.sha256,summary:u.summary,reading:n>=97||[72,79,83].includes(n)?'full':'targeted-excerpts'};}),null,2)+'\n');
console.log(JSON.stringify(records.map(x=>({ref:x.ref,from:x.from,to:x.to,report:x.frozen_report??x.report})),null,2));
