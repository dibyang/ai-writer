import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const here=path.dirname(fileURLToPath(import.meta.url));
const base=path.dirname(here);
const [label,...rawArgs]=process.argv.slice(2);
const branch=rawArgs.includes('--in-branch'),token=rawArgs.includes('--with-token');
const args=rawArgs.filter(x=>x!=='--in-branch'&&x!=='--with-token');
if(branch||token){
 const local=JSON.parse(fs.readFileSync(path.join(here,'session-local.json'),'utf8'));
 if(branch)args.push('--project',local.workspace);
 if(token)args.push('--revision-token',local.token);
}
if(!label?.startsWith('c-')) throw Error('C labels only');
const r=spawnSync(process.execPath,[path.join(base,'capture.mjs'),label,process.execPath,path.resolve('bin/ai-writer.mjs'),...args],{encoding:'utf8',windowsHide:true});
const dir=path.join(base,'commands',label);
if(fs.existsSync(path.join(dir,'stdout.raw.txt'))){
 let out=fs.readFileSync(path.join(dir,'stdout.raw.txt'),'utf8');
 out=out.replace(/("(?:token|revision_token)"\s*:\s*")[^"]+/g,'$1[LOCAL HANDOFF ONLY]');
 console.log(out);
}
if(fs.existsSync(path.join(dir,'stderr.raw.txt'))) process.stderr.write(fs.readFileSync(path.join(dir,'stderr.raw.txt')));
if(r.error) console.error(r.error.message);
process.exitCode=r.status??1;
