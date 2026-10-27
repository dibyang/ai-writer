import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const base=path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/,'$1'));
const checkpoint=JSON.parse(fs.readFileSync(path.join(base,'checkpoint-f-entry.json'),'utf8'));
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const raw=fs.readFileSync(path.join(checkpoint.project,'.writer/state.json'));
const state=JSON.parse(raw);
const differences=[];
for(const [ref,expected] of Object.entries(checkpoint.files)){
 const file=path.join(checkpoint.project,ref);
 if(!fs.existsSync(file)){differences.push({ref,reason:'missing'});continue;}
 const b=fs.readFileSync(file);
 if(b.length!==expected.bytes||sha(b)!==expected.sha256)differences.push({ref,reason:'bytes-or-sha'});
}
const status=JSON.parse(fs.readFileSync(path.join(base,'cli-logs/ffirst-entry-status/stdout.txt')));
const check=JSON.parse(fs.readFileSync(path.join(base,'cli-logs/ffirst-entry-1/stdout.txt')));
const doctor=JSON.parse(fs.readFileSync(path.join(base,'cli-logs/ffirst-entry-2/stdout.txt')));
const active=JSON.parse(fs.readFileSync(path.join(base,'active-tool.json')));
const summary={at:new Date().toISOString(),checkpoint:Object.fromEntries(Object.entries(checkpoint).filter(([k])=>k!=='files')),state_sha256:sha(raw),revision:state.revision,units:state.units.length,compared_files:Object.keys(checkpoint.files).length,differences,status:{ok:status.ok,stale_units:status.stale_units,changed_sources:status.changed_sources,impact_pending:status.impact_pending,active_sessions:status.revisions.sessions.filter(x=>x.status!=='committed'&&x.status!=='abandoned'),pending_transactions:status.revisions.transactions.filter(x=>x.status!=='completed'&&x.status!=='rolled-back'),review_counts:status.review_workflow.counts},check:{ok:check.ok,warnings:check.findings.length,rolling_review:check.rolling_review},doctor:{ok:doctor.ok,generation:active.generation,content_id:doctor.build.observed_content_id,runtime_id:doctor.build.runtime_id,errors:doctor.errors},chapters:state.units.filter(x=>x.unit<=24).map(u=>{const b=fs.readFileSync(path.join(checkpoint.project,u.draft));assert.equal(sha(b),u.sha256);return {unit:u.unit,draft:u.draft,sha256:u.sha256,bytes:b.length,pages:Math.ceil(b.toString('utf8').length/1800)};})};
assert.equal(summary.state_sha256,checkpoint.state_sha256);assert.equal(differences.length,0);assert.equal(summary.units,48);assert(status.ok&&check.ok&&doctor.ok);assert.equal(summary.status.active_sessions.length,0);assert.equal(summary.status.pending_transactions.length,0);assert.equal(summary.doctor.content_id,active.content_id);
const out=process.argv[2]??'ffirst-entry-audit.json';assert(!out.includes('/')&&!out.includes('\\'));fs.writeFileSync(path.join(base,out),JSON.stringify(summary,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify(summary,null,2));
