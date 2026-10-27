import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const A=path.dirname(fileURLToPath(import.meta.url));
const [label,...args]=process.argv.slice(2);
const r=spawnSync(process.execPath,[path.join(A,'cli.mjs'),label,...args],{encoding:'utf8',maxBuffer:32e6,windowsHide:true});
const folder=path.join(A,'cli-logs',label);
const result=JSON.parse(fs.readFileSync(path.join(folder,'result.json')));
let output;try{output=JSON.parse(r.stdout);}catch{output={stdout:r.stdout};}
const redact=v=>Array.isArray(v)?v.map(redact):v&&typeof v==='object'?Object.fromEntries(Object.entries(v).map(([k,x])=>[k,/token/i.test(k)?'[LOCAL ONLY]':redact(x)])):v;
console.log(JSON.stringify({label,exit_code:result.exit_code,before:result.before_state_sha256,after:result.after_state_sha256,stdout_file:path.join(folder,'stdout.txt'),stderr_file:path.join(folder,'stderr.txt'),keys:Object.keys(output),summary:JSON.stringify(output).length<14000?redact(output):undefined},null,2));
process.exitCode=r.status??1;
