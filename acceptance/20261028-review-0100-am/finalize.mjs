import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const out=path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/,'$1'));
const work=path.resolve(out,'../20261027-long-0100-al/work');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const s=JSON.parse(fs.readFileSync(path.join(work,'.writer/state.json')));
const manifest=JSON.parse(fs.readFileSync(path.join(out,'reading-manifest.json')));
const table=['|章|阅读|正文路径|SHA256|','|---|---|---|---|',...manifest.map(x=>`|${x.unit}|${x.reading==='full'?'全文':'定点'}|${x.draft}|${x.sha256}|`)].join('\n');
const report=path.join(out,'report.md');
fs.writeFileSync(report,fs.readFileSync(report,'utf8').replace('<!-- READING_TABLE -->',table));
const changes=[];
for(const [n,old] of [[108,'54d12e377d34feaf26afa3c58482d9dcc2997f59a073039f4dac1e557e164b12'],[110,'09f98055cf78cb404189c6be9439d3198df216b0bd4522fe509ba643cb075da0'],[112,'3a6b74df44cfe9747e0b60e7351195a9364beeb31b5c76578c8ba2543f8a7c84']]){
 const a=fs.readFileSync(path.join(work,`.writer/objects/${old}.review-body`),'utf8').split(/\r?\n/);
 const b=fs.readFileSync(path.join(work,s.units[n-1].draft),'utf8').split(/\r?\n/);
 changes.push({unit:n,old_sha256:old,current_sha256:s.units[n-1].sha256,changes:b.flatMap((l,i)=>l===a[i]?[]:[{line:i+1,old:a[i],current:l}])});
}
fs.writeFileSync(path.join(out,'changed-context-lines.json'),JSON.stringify(changes,null,2)+'\n');
const bindings=JSON.parse(fs.readFileSync(path.join(out,'issue-bindings.json')));
const rows=bindings.flatMap(i=>i.entries);
const failures=rows.filter(x=>!x.old_hash_matched||!x.quote_at_line);
const hashFailures=manifest.filter(x=>x.sha256!==x.registered_sha256||sha(fs.readFileSync(path.join(work,x.draft)))!==x.sha256);
const originalReports=bindings.map(i=>{const r=JSON.parse(fs.readFileSync(path.join(work,i.origin.review_ref)));return {id:i.id,record_sha256_matched:sha(fs.readFileSync(path.join(work,i.origin.review_ref)))===i.origin.review_sha256,report:r.frozen_report??r.report,report_sha256:r.report_sha256,report_sha256_matched:sha(fs.readFileSync(path.join(work,r.frozen_report??r.report)))===r.report_sha256};});
const checks={issue_original_evidence_count:rows.length,original_evidence_failures:failures,original_reports:originalReports,reading_files:manifest.length,full_read_chapters:manifest.filter(x=>x.reading==='full').map(x=>x.unit),current_reading_hash_failures:hashFailures,state_sha256:sha(fs.readFileSync(path.join(work,'.writer/state.json'))),report_sha256:sha(fs.readFileSync(report)),revision:s.revision,registered:s.units.length,report_only_no_product_registration:true};
fs.writeFileSync(path.join(out,'report-verification.json'),JSON.stringify(checks,null,2)+'\n');
console.log(JSON.stringify(checks,null,2));
