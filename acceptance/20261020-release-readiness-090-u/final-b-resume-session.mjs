import fs from 'node:fs';import path from 'node:path';import {spawnSync} from 'node:child_process';import {U,W,write,json,hash,run} from './final-b-run.mjs';
const s=json(path.join(U,'final-b-revision-session.json'));
const input=path.join(U,'final-b-resume-session-input.json');write(input,{id:s.id,token:s.token});run('35-resume-original-session',['revision','resume','--input',input]);
function walk(d){return fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(d,e.name)):[path.join(d,e.name)]);}
const root=path.resolve(U,'../..');const git=spawnSync('git',['ls-files','-z'],{cwd:root,encoding:'utf8'});if(git.status)throw Error('git ls-files');
const files=walk(U).filter(f=>!f.startsWith(W+path.sep)&&!path.relative(U,f).startsWith('commands'+path.sep)).concat(git.stdout.split('\0').filter(Boolean).map(p=>path.join(root,p)));
files.push(...walk(path.join(W,'分段')),...walk(path.join(W,'.writer/tool')));
write(path.join(U,'final-b-resume-protected-before.json'),{note:'Existing records, products, tool and historical segments are fixed; outer live runner commands directory excluded as dynamic telemetry. New files are permitted. Main managed publication files separately bound to revision baseline.',files:[...new Set(files)].map(p=>({path:p,sha256:hash(p)}))});
