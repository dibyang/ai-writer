import fs from 'node:fs';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';
const stage='acceptance/20261016-expanded/session-e',work='acceptance/20261016-expanded/works/潮汐信号';
const [label,start,end,report]=process.argv.slice(2),from=Number(start),to=Number(end);
const state=JSON.parse(fs.readFileSync(`${work}/.writer/state.json`));
const files=fs.readdirSync(`${work}/正文`).filter(f=>/^\d{4}-.*\.md$/.test(f)).sort();
const hashes={};for(const f of files){const n=Number(f.slice(0,4));if(n>=from&&n<=to) hashes['正文/'+f]=crypto.createHash('sha256').update(fs.readFileSync(`${work}/正文/${f}`)).digest('hex');}
if(Object.keys(hashes).length!==to-from+1)throw new Error('review range gap');
const foot='\n## 当前实读正文哈希\n\n|文件|SHA-256|\n|---|---|\n'+Object.entries(hashes).map(([f,h])=>`|${f}|${h}|`).join('\n')+'\n';
fs.appendFileSync(`${work}/${report}`,foot);
const input={from,to,kind:'model-self-review',report,source_hashes:hashes};
fs.writeFileSync(`${stage}/${label}-review-input.json`,JSON.stringify(input,null,2)+'\n');
const r=spawnSync(process.execPath,[`${stage}/cli.mjs`,label+'-review','review','--input',`${stage}/${label}-review-input.json`],{encoding:'utf8'});process.stdout.write(r.stdout);process.stderr.write(r.stderr);process.exitCode=r.status;
