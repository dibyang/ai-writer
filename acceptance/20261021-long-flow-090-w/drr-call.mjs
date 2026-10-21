import fs from 'node:fs';import path from 'node:path';import {spawn} from 'node:child_process';import {fileURLToPath} from 'node:url';
const W=path.dirname(fileURLToPath(import.meta.url)),s=JSON.parse(fs.readFileSync(path.join(W,'d-active-revision.json'))),[label,target,...args]=process.argv.slice(2);
if(!label?.startsWith('drr-')||!['C','P'].includes(target)||!args.length)throw Error('drr-call unique-label C|P command args');
if(args.includes('--project')||args.includes('--revision-token'))throw Error('target is explicit through wrapper helper');
const cli=[...args,'--project',target==='C'?s.workspace:s.main_project,...(target==='C'?['--revision-token',s.token]:[])];
const child=spawn(process.execPath,[path.join(W,'w-writer.mjs'),label,...cli],{cwd:path.resolve(W,'../..'),windowsHide:true,stdio:'inherit'});child.on('error',e=>{process.stderr.write(e.stack+'\n');process.exitCode=1;});child.on('close',code=>{process.exitCode=code??1;});
