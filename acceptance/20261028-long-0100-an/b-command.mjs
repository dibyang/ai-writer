import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const root=path.dirname(fileURLToPath(import.meta.url));
const [label,...request]=process.argv.slice(2);
if(!/^b-\d{3}-[a-z0-9-]+$/.test(label??'')) throw Error('Unique B label required');
if(!['rewind','context','record-preview','record','check','status','revision','source','review-template','review'].includes(request[0])) throw Error('Command outside B scope');
if(request.includes('prepare')||request.includes('commit')||request.includes('begin')||request.includes('resume')) throw Error('Forbidden at B checkpoint');
const session=JSON.parse(fs.readFileSync(path.join(root,'commands/b-004-revision-begin/stdout.raw.txt')));
if(!session.ok || session.base_revision!==481) throw Error('Bad begin receipt');
const cli=path.join(root,'work/.writer/tool/bin/ai-writer.mjs');
const args=[...request,'--project',session.workspace,'--revision-token',session.token];
const result=spawnSync(process.execPath,[path.join(root,'capture.mjs'),label,process.execPath,cli,...args],{cwd:root,encoding:'utf8',windowsHide:true,timeout:1200000,maxBuffer:64*1024*1024});
const metaRef=path.join(root,'commands',label,'result.json');
if(fs.existsSync(metaRef)) {const m=JSON.parse(fs.readFileSync(metaRef));console.log(JSON.stringify({label,exit_code:m.exit_code,elapsed_ms:m.elapsed_ms,before_state_sha256:m.before_state_sha256,after_state_sha256:m.after_state_sha256,runtime_files_stable:m.runtime_files_stable}));}
else console.error(result.stderr || result.error?.message || result.stdout);
process.exitCode=result.status??1;
