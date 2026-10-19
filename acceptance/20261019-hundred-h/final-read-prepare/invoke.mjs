import fs from 'node:fs';import path from 'node:path';import {spawnSync} from 'node:child_process';import {fileURLToPath} from 'node:url';
const dir=path.dirname(fileURLToPath(import.meta.url)),H=path.dirname(dir),hand=JSON.parse(fs.readFileSync(path.join(H,'revise-d/handoff.json')));
const [label,action]=process.argv.slice(2);if(!/^final-read-[a-z0-9-]+$/.test(label??''))throw Error('Unique lowercase final-read label required');
let args;if(action==='review')args=['review','--input',path.join(dir,'review-72-112.json'),'--revision-token',hand.token,'--project',hand.workspace];
else if(action==='prepare')args=['revision','prepare','--input',path.join(dir,'resume.json'),'--project',path.join(H,'work')];else throw Error('This phase only invokes review or prepare');
const result=spawnSync(process.execPath,[path.join(H,'capture.mjs'),label,process.execPath,path.join(H,'work/.writer/tool/bin/ai-writer.mjs'),...args],{encoding:'utf8',windowsHide:true});
if(result.status!==0)process.stderr.write(result.stderr??'');
const meta=JSON.parse(fs.readFileSync(path.join(H,'commands',label,'result.json')));console.log(JSON.stringify({label,exit_code:result.status,before_state_sha256:meta.before_state_sha256,after_state_sha256:meta.after_state_sha256,elapsed_ms:meta.elapsed_ms}));process.exitCode=result.status??1;
