import fs from 'node:fs';
import {project,stage,runner,hash} from './run-cli.mjs';
const e=runner.json('export-final'),s=runner.json('status-final'),c=runner.json('check-final'),d=runner.json('doctor-final');
const expected=Array.from({length:72},(_,i)=>i+1),errors=[];
if(JSON.stringify(e.included_units)!==JSON.stringify(expected))errors.push('included_units not exactly 1-72');
if(e.excluded_drafts.length||e.warnings.length)errors.push('export has exclusions/warnings');
if(c.rolling_review.pending_windows.length||c.findings.length)errors.push('check not clear');
if(!d.ok||d.errors.length||d.warnings.length)errors.push('doctor not clear');
const manuscript=stage+'/export/manuscript.md',body=fs.readFileSync(manuscript,'utf8');
let exactBodies=0;
for(const u of e.units){if(hash(project+'/'+u.draft)!==u.sha256)errors.push('source hash '+u.unit);const t=fs.readFileSync(project+'/'+u.draft,'utf8').trim();if(body.indexOf(t)!==-1&&body.indexOf(t)===body.lastIndexOf(t))exactBodies++;else errors.push('exact body containment '+u.unit);}
if(hash(manuscript)!==e.sha256)errors.push('export hash');
const result={scope:'byte/hash/heading coverage only; not a full narrative reading of 1-72',included_units:e.included_units,exact_source_bodies_once:exactBodies,export_revision:e.revision,manuscript_sha256:hash(manuscript),manifest_sha256:hash(stage+'/export/manifest.json'),status_label:runner.last('status-final').label,status_revision:s.revision,pending_windows:c.rolling_review.pending_windows,errors};
fs.writeFileSync(stage+'/export-verification.json',JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));if(errors.length)process.exitCode=1;
