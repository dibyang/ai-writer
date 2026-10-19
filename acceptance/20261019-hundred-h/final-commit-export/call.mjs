import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import assert from 'node:assert/strict';
const H=path.resolve('acceptance/20261019-hundred-h'),W=path.join(H,'work'),[suffix,origin,...args]=process.argv.slice(2),label='final-commit-'+suffix;
assert.match(label,/^final-commit-[a-z0-9-]+$/);assert.ok(origin==='work'||/^v[456]$/.test(origin));
const root=origin==='work'?path.join(W,'.writer/tool'):path.join(H,'sources/package-'+origin),help=args.includes('--help')||args[0]==='help';
const commandArgs=[path.join(H,'capture.mjs'),label,'node',path.join(root,'bin/ai-writer.mjs'),...args,...(help?[]:['--project',W])];
const r=spawnSync(process.execPath,commandArgs,{encoding:'utf8',windowsHide:true,maxBuffer:8*1024*1024});
const dir=path.join(H,'commands',label),meta=JSON.parse(fs.readFileSync(path.join(dir,'result.json'))),raw=fs.readFileSync(path.join(dir,'stdout.raw.txt'),'utf8');
console.log(JSON.stringify({label,exit_code:meta.exit_code,elapsed_ms:meta.elapsed_ms,before:meta.before_state_sha256,after:meta.after_state_sha256}));
if(help)console.log(raw);else if(raw.trim()){
 const d=JSON.parse(raw);const summary={keys:Object.keys(d)};
 for(const k of ['ok','read_only','can_update','revision','schema_version','generation','status','transaction_id','unchanged','source_content_id','backups_preserved','tool_version','tool_root','skill_root','content_root','project_skill_root','observed_content_id','runtime_id','same_content','differences','blockers','plan_sha256','request','errors','warnings','findings','next','task','stage','allowed_actions','draft_range','revise_range','draft_inventory','rolling_review','purpose','current_task','authorization','governance','tool_control','stale_units','changed_sources','impact_pending','included_units','excluded_drafts','out','manifest'])if(k in d)summary[k]=d[k];
 if(d.files)summary.files_count=d.files.length;if(d.units)summary.units=Array.isArray(d.units)?d.units.length:d.units;
 if(summary.tool_control)summary.tool_control={generation:d.tool_control.generation,installed:d.tool_control.installed};
 console.log(JSON.stringify(summary));
}else console.log('No stdout');
if(meta.exit_code!==0)console.log(fs.readFileSync(path.join(dir,'stderr.raw.txt'),'utf8'));process.exitCode=r.status??1;
