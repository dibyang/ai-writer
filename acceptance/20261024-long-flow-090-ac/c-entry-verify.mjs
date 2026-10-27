import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const base=path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/,'$1'));
const checkpoint=JSON.parse(fs.readFileSync(path.join(base,'checkpoint-c-entry.json')));
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const stateBytes=fs.readFileSync(path.join(checkpoint.project,'.writer/state.json'));
const state=JSON.parse(stateBytes), failures=[];
for(const [ref,expected] of Object.entries(checkpoint.files)){
 const b=fs.readFileSync(path.join(checkpoint.project,ref));
 if(b.length!==expected.bytes||sha(b)!==expected.sha256)failures.push(ref);
}
const status=JSON.parse(fs.readFileSync(path.join(base,'cli-logs/c01-status/stdout.txt')));
const doctor=JSON.parse(fs.readFileSync(path.join(base,'cli-logs/c03-doctor/stdout.txt')));
const result={at:new Date().toISOString(),files_checked:Object.keys(checkpoint.files).length,failures,state_sha256:sha(stateBytes),expected_state_sha256:checkpoint.state_sha256,state_matches:sha(stateBytes)===checkpoint.state_sha256,revision:state.revision,registered_units:status.draft_inventory.registered_count,generation:status.tool_control.generation,content_id:doctor.build.observed_content_id,errors:doctor.errors,warnings:doctor.warnings,thread_id:process.env.CODEX_THREAD_ID??process.env.THREAD_ID??null,session_id:process.env.CODEX_SESSION_ID??process.env.SESSION_ID??null};
fs.mkdirSync(path.join(base,'c-inputs'),{recursive:true});
fs.writeFileSync(path.join(base,'c-inputs/entry-verification.json'),JSON.stringify(result,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify(result,null,2));
if(failures.length||!result.state_matches)process.exitCode=1;
