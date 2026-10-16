import fs from 'node:fs';import path from 'node:path';import {stage,project,hash,save,cli,runner} from './run-cli.mjs';
const exportDir=`${stage}/export`,m=JSON.parse(fs.readFileSync(`${exportDir}/manifest.json`,'utf8')),e=runner.json('export-final');
const expected=Array.from({length:90},(_,i)=>i+1);const failures=[];
if(JSON.stringify(m.included_units)!==JSON.stringify(expected)||JSON.stringify(e.included_units)!==JSON.stringify(expected))failures.push('Included units not exactly 1-90');
if(m.excluded_drafts.length||m.warnings.length||e.excluded_drafts.length||e.warnings.length)failures.push('Export excludes or warns');
const book=fs.readFileSync(`${exportDir}/manuscript.md`,'utf8');
const headings=book.split(/\r?\n/).filter(l=>/^#{1,6}\s+第.+章\s/.test(l));
if(headings.length!==90)failures.push('Manuscript does not contain 90 chapter headings');
if(hash(`${exportDir}/manuscript.md`)!==e.sha256)failures.push('Manuscript hash differs from real export result');
for(const u of m.units){if(hash(path.join(project,u.draft))!==u.sha256)failures.push(`Source hash mismatch ${u.unit}`);}
for(const [label,args]of [['status-final',['status']],['check-final',['check']],['doctor-final',['doctor']]]){const r=cli(args,label);if(r.exit_code!==0){console.log(r.stdout,r.stderr);process.exit(r.exit_code??1);}}
const g=runner.run('git',['status','--short'],'git-status-final');
const sr=runner.last('status-final');if(sr.label!=='status-final'||sr.executable!==process.execPath||sr.argv[0]!=='bin/ai-writer.mjs'||sr.argv[1]!=='status')failures.push('Exact status label/CLI argv invalid');
const s=runner.json('status-final'),c=runner.json('check-final'),d=runner.json('doctor-final');
if(s.revision!==275||s.next_unit!==91||s.stale_units.length||s.changed_sources.length||s.draft_inventory.unregistered.length||c.rolling_review.pending_windows.length||c.findings.length||d.errors.length||d.warnings.length)failures.push('Final CLI gate incomplete');
const verification={scope:'export-structure-and-hashes-only-not-full-manuscript-reading',included_units:m.included_units,count:m.included_units.length,chapter_headings_count:headings.length,first_heading:headings[0],last_heading:headings.at(-1),manuscript_sha256:hash(`${exportDir}/manuscript.md`),manifest_sha256:hash(`${exportDir}/manifest.json`),source_hashes_verified:m.units.length,excluded_drafts:e.excluded_drafts,warnings:e.warnings,failures,status:s,check:c,doctor:d,git_status:g.stdout,status_row_verified:{label:sr.label,executable:sr.executable,argv:sr.argv},verified_at:new Date().toISOString()};
save('export-verification.json',verification);
console.log(JSON.stringify({...verification,status:{revision:s.revision,next_unit:s.next_unit,registered:s.draft_inventory.registered_count,stale:s.stale_units,changed:s.changed_sources},elapsed_s:Math.round((Date.now()-Date.parse('2026-10-16T11:20:29.717Z'))/1000)},null,2));
if(failures.length)process.exitCode=1;
