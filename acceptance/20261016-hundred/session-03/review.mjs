import fs from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';
import {createRunner} from '../command-runner.mjs';
const stage='acceptance/20261016-hundred/session-03',project='acceptance/20261016-hundred/works/潮汐信号';
const r=createRunner(stage),to=Number(process.argv[2]),from=to-5;
const sha=f=>crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const sources={};
for(let n=from;n<=to;n++){const file=fs.readdirSync(project+'/正文').find(x=>x.startsWith(String(n).padStart(4,'0')+'-'));const rel='正文/'+file; sources[rel]=sha(project+'/'+rel);fs.appendFileSync(stage+'/reading.jsonl',JSON.stringify({path:path.resolve(project,rel).replaceAll('\\','/'),sha256:sources[rel],range:'full',purpose:`第${to}章后${from}—${to}完整滚动连读`,read_method:'model full text inspection via FastCtx before this hash registration',logged_at:new Date().toISOString()})+'\n');}
const body=fs.readFileSync(`${stage}/review-${to}-body.md`,'utf8');
const report=`审查/${String(from).padStart(4,'0')}-${String(to).padStart(4,'0')}-20261016-知情连读.md`;
fs.writeFileSync(project+'/'+report,body+'\n\n## 本次绑定的正文SHA-256\n\n'+Object.entries(sources).map(([f,h])=>`- ${f}: ${h}`).join('\n')+'\n');
const input={from,to,kind:'model-self-review',report,source_hashes:sources};
fs.writeFileSync(`${stage}/review-${to}.json`,JSON.stringify(input,null,2)+'\n');
const result=r.run(process.execPath,['bin/ai-writer.mjs','review','--project',project,'--input',`${stage}/review-${to}.json`],`review-${to}`);console.log(result.stdout);console.error(result.stderr);if(result.exit_code!==0)process.exitCode=result.exit_code??1;
const c=r.run(process.execPath,['bin/ai-writer.mjs','check','--project',project],`check-review-${to}`);console.log(c.stdout);console.error(c.stderr);
