import fs from 'node:fs';import path from 'node:path';import {stage,project,hash,save,runner} from './run-cli.mjs';
const r=JSON.parse(fs.readFileSync(`${stage}/result.json`,'utf8'));const d=JSON.parse(fs.readFileSync(`${stage}/delivery-files.json`,'utf8'));const errors=[];
for(const f of d.files)if(hash(f.path)!==f.sha256)errors.push('Delivery hash changed: '+f.path);
for(const c of r.chapters){if(!c.journal||!c.journal_sha256||hash(path.join(project,c.journal))!==c.journal_sha256)errors.push('Missing/changed journal hash for '+c.unit);if(hash(path.join(project,c.draft))!==c.sha256)errors.push('Draft drift '+c.unit);}
if(hash(`${project}/.writer/state.json`)!==r.state_hash_after)errors.push('Final state changed');
const logs=fs.readFileSync(`${stage}/reading.jsonl`,'utf8').split(/\r?\n/).filter(Boolean).map(JSON.parse);
for(const x of logs)if(x.range!=='full'||!x.purpose||hash(x.path)!==x.sha256)errors.push('Reading log drift/coverage metadata '+x.path);
const final=runner.last('status-final');if(final.label!=='status-final'||final.argv[1]!=='status'||final.executable!==process.execPath)errors.push('Wrong exact final status');
if(JSON.stringify(r.export.included_units)!==JSON.stringify(Array.from({length:90},(_,i)=>i+1)))errors.push('Wrong export chapters');
const result={ok:errors.length===0,scope:'delivery hashes, journal paths, reading-log metadata consistency; not literary acceptance',errors,journals:r.chapters.map(c=>({unit:c.unit,path:c.journal,sha256:c.journal_sha256})),reading_rows:logs.length,reading_unique_path_versions:new Set(logs.map(x=>x.path+'\0'+x.sha256)).size,delivery_files:d.files.length,final_state_sha256:r.state_hash_after,verified_at:new Date().toISOString(),elapsed_s:Math.round((Date.now()-Date.parse(r.started_at))/1000)};
save('delivery-verification.json',result);console.log(JSON.stringify(result,null,2));if(errors.length)process.exitCode=1;
