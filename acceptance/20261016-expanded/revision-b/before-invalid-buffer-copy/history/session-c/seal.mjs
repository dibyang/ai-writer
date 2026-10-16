import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const b='acceptance/20261016-expanded/session-c',p='acceptance/20261016-expanded/works/潮汐信号';
const sha=x=>crypto.createHash('sha256').update(x).digest('hex');
const files={};
function walk(d){for(const e of fs.readdirSync(d,{withFileTypes:true})){const q=path.posix.join(d,e.name);if(e.isDirectory())walk(q);else if(e.isFile()&&q!==b+'/artifact-manifest.json'){const raw=fs.readFileSync(q);files[q]={bytes:raw.length,sha256:sha(raw)};}}}
walk(b);
const s=JSON.parse(fs.readFileSync(p+'/.writer/state.json','utf8'));
const reviewRecords=[];
for(const label of ['u09','final']){const out=JSON.parse(fs.readFileSync(`${b}/cli/${label==='u09'?'u09-review':'final-review'}.stdout`,'utf8'));const q=p+'/'+out.ref;reviewRecords.push({path:q,sha256:sha(fs.readFileSync(q)),record:JSON.parse(fs.readFileSync(q,'utf8'))});}
const cliStdout=Object.keys(files).filter(q=>q.startsWith(b+'/cli/')&&q.endsWith('.stdout')).length;
const cliStderr=Object.keys(files).filter(q=>q.startsWith(b+'/cli/')&&q.endsWith('.stderr')).length;
if(cliStdout!==56||cliStderr!==56)throw new Error('raw log count');
const output={revision:s.revision,state_sha256:sha(fs.readFileSync(p+'/.writer/state.json')),work_tool_cli_sha256:sha(fs.readFileSync(p+'/.writer/tool/bin/ai-writer.mjs')),new_review_records:reviewRecords,cli_stdout_count:cliStdout,cli_stderr_count:cliStderr,files};
fs.writeFileSync(b+'/artifact-manifest.json',JSON.stringify(output,null,2)+'\n');
console.log(JSON.stringify({ok:true,revision:s.revision,state_sha256:output.state_sha256,artifact_count:Object.keys(files).length,raw_stdout:cliStdout,raw_stderr:cliStderr,result_sha256:files[b+'/result.md'].sha256,new_review_records:reviewRecords.map(x=>({path:x.path,keys:Object.keys(x.record)}))},null,2));
