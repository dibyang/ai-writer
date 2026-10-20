import fs from 'node:fs';import path from 'node:path';import {spawnSync} from 'node:child_process';import {U,W,write,hash} from './final-b-run.mjs';
function walk(d){return fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(d,e.name)):[path.join(d,e.name)]);}
const repo=path.resolve(U,'../..');const tracked=spawnSync('git',['ls-files','-z'],{cwd:repo,encoding:'utf8'});if(tracked.status)throw Error('git ls-files');
const protectedFiles=walk(U).filter(f=>!f.startsWith(W+path.sep)&&!path.relative(U,f).split(path.sep)[0].startsWith('final-b-')).concat(tracked.stdout.split('\0').filter(Boolean).map(f=>path.join(repo,f)));
const P=path.join(repo,'.tmp/U 最终交付验收包解压/ai-writer-0.9.0');protectedFiles.push(...walk(P));
write(path.join(U,'final-b-scope-baseline.json'),{at:new Date().toISOString(),note:'read-only boundaries observed before chapter writing; initial state already separately captured in 01-status',files:[...new Set(protectedFiles)].map(f=>({path:f,sha256:hash(f)}))});
console.log(protectedFiles.length);
