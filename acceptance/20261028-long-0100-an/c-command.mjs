import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const root=path.dirname(fileURLToPath(import.meta.url));
const [label,target,...request]=process.argv.slice(2);
if(!/^c-\d{3}-[a-z0-9-]+$/.test(label??''))throw Error('Unique C label required');
if(!['candidate','main'].includes(target))throw Error('Explicit project required');
if(!['context','record-preview','record','check','status','revision','source','recall'].includes(request[0]))throw Error('Outside C scope');
if(request.some(x=>['prepare','commit','begin','rewind','transfer','recover'].includes(x)))throw Error('Forbidden at C checkpoint');
const recovery=JSON.parse(fs.readFileSync(path.join(root,'session-b/owner-recovery.json')));
const cli=path.join(root,'work/.writer/tool/bin/ai-writer.mjs');
const args=[...request,'--project',target==='main'?recovery.parent:recovery.workspace];
if(target==='candidate')args.push('--revision-token',recovery.token);
const r=spawnSync(process.execPath,[path.join(root,'capture.mjs'),label,process.execPath,cli,...args],{cwd:root,encoding:'utf8',windowsHide:true,timeout:1200000,maxBuffer:64*1024*1024});
const ref=path.join(root,'commands',label,'result.json');
if(fs.existsSync(ref)){const m=JSON.parse(fs.readFileSync(ref));console.log(JSON.stringify({label,exit_code:m.exit_code,elapsed_ms:m.elapsed_ms,before_state_sha256:m.before_state_sha256,after_state_sha256:m.after_state_sha256,runtime_files_stable:m.runtime_files_stable}));}
else console.error(r.stderr||r.error?.message||r.stdout);
process.exitCode=r.status??1;
