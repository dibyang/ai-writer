import fs from 'node:fs';
import crypto from 'node:crypto';
const stage='acceptance/20261016-expanded/session-e',work='acceptance/20261016-expanded/works/潮汐信号';
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const manifest=JSON.parse(fs.readFileSync(`${stage}/export/manifest.json`)),s=JSON.parse(fs.readFileSync(`${work}/.writer/state.json`));
const text=fs.readFileSync(`${stage}/export/manuscript.md`,'utf8'),expected=Array.from({length:20},(_,i)=>i+1),findings=[],rows=[];let cursor=0,residue='';
if(JSON.stringify(manifest.included_units)!==JSON.stringify(expected))findings.push('included-units');
if(manifest.excluded_drafts.length||manifest.warnings.length)findings.push('exclusions-or-warnings');
for(const e of manifest.units){const raw=fs.readFileSync(`${work}/${e.draft}`),body=raw.toString('utf8').trim(),pos=text.indexOf(body,cursor);if(pos<0){findings.push('missing:'+e.unit);continue;}residue+=text.slice(cursor,pos);cursor=pos+body.length;const copies=text.split(body).length-1;const actual=hash(raw);rows.push({unit:e.unit,sha256:actual,manifest_hash_matches:actual===e.sha256,exact_body_occurrences:copies,position:pos});if(actual!==e.sha256||copies!==1)findings.push('hash-or-copies:'+e.unit);}
residue+=text.slice(cursor);
if(!/^[\s*_-]*$/u.test(residue))findings.push('unexpected-extra-content');
const allSources={};for(const u of s.units)for(const [f,h] of Object.entries(u.source_hashes))if(f!=='.writer/state.json'){const actual=hash(fs.readFileSync(`${work}/${f}`));allSources[f]={sha256:actual,all_consumed_hashes_match:(allSources[f]?.all_consumed_hashes_match??true)&&h===actual};}
for(const [f,v] of Object.entries(allSources))if(!v.all_consumed_hashes_match)findings.push('source-drift:'+f);
fs.writeFileSync(`${stage}/source-hashes.json`,JSON.stringify({state_sha256:hash(fs.readFileSync(`${work}/.writer/state.json`)),sources:allSources},null,2)+'\n');
const result={revision:s.revision,included_units:manifest.included_units,excluded_drafts:manifest.excluded_drafts,warnings:manifest.warnings,manuscript_sha256:hash(Buffer.from(text)),manifest_sha256:hash(fs.readFileSync(`${stage}/export/manifest.json`)),chapter_headings:(text.match(/^# 第[^\n]+章 /gmu)||[]).length,rows,findings};
fs.writeFileSync(`${stage}/export-verification.json`,JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));
