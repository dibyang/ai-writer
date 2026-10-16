import fs from 'node:fs';import crypto from 'node:crypto';import assert from 'node:assert/strict';
import {createRunner} from '../command-runner.mjs';
const stage='acceptance/20261016-hundred/session-05',project='acceptance/20261016-hundred/works/潮汐信号',runner=createRunner(stage);
const hash=f=>crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const result=JSON.parse(fs.readFileSync(stage+'/result.json','utf8'));
assert.equal(result.revision,runner.json('status-final').revision);
assert.equal(result.final_state_sha256,hash(project+'/.writer/state.json'));
assert.equal(result.export.manuscript_sha256,hash(stage+'/export/manuscript.md'));
assert.equal(result.export.manifest_sha256,hash(stage+'/export/manifest.json'));
assert.deepEqual(result.checks.check.rolling_review.pending_windows,[]);
assert.deepEqual(result.preservation.failures,[]);assert.equal(result.chapters.length,6);assert.equal(result.total_han,15124);
for(const c of result.chapters)assert.equal(c.sha256,hash(project+'/'+c.draft));
const rows=fs.readFileSync(runner.index,'utf8').trim().split(/\r?\n/).map(JSON.parse);
for(const row of rows){assert.deepEqual(JSON.parse(fs.readFileSync(row.files.metadata,'utf8')),row);assert(fs.existsSync(row.files.stdout)&&fs.existsSync(row.files.stderr));assert(Array.isArray(row.argv));}
const failed=rows.filter(r=>r.exit_code!==0);assert.equal(failed.length,1);assert.equal(failed[0].label,'evidence-finalize');assert(fs.readFileSync(failed[0].files.stderr,'utf8').includes('ReferenceError: preservation is not defined'));
assert.equal(runner.json('evidence-finalize-retry1').ok,true);
const verification={ok:true,revision:result.revision,chapters:[49,50,51,52,53,54],han:result.chapters.map(c=>c.han),total_han:result.total_han,export_units:54,pending_windows:[],state_sha256:result.final_state_sha256,command_records_checked:rows.length,retained_auxiliary_failures:failed.length,product_cli_failures:0,hashes:Object.fromEntries(['result.md','result.json','recovery.md','reading.jsonl','preservation-audit.json','export/manifest.json','export/manuscript.md'].map(f=>[f,hash(stage+'/'+f)])),boundary:'Hash/log/schema equality checks only; model semantic reads are separately recorded.'};
fs.writeFileSync(stage+'/delivery-verification.json',JSON.stringify(verification,null,2)+'\n');console.log(JSON.stringify(verification,null,2));
