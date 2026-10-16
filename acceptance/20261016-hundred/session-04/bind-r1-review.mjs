import fs from 'node:fs';import crypto from 'node:crypto';import path from 'node:path';import {createRunner} from '../command-runner.mjs';
const S='acceptance/20261016-hundred/session-04',P='acceptance/20261016-hundred/works/潮汐信号';
const r=createRunner(S),hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const[from,to,...lists]=process.argv.slice(2);const phase=lists[0]==='r2'?lists.shift():'r1';const R=S+'/revision-'+phase;const entries=lists.flatMap(p=>JSON.parse(fs.readFileSync(S+'/'+p,'utf8')));
if(entries.length!==Number(to)-Number(from)+1)throw Error('Incomplete actual read list');
const sources=Object.fromEntries(entries.map(x=>[x.path,x.sha256]));
for(const x of entries){if(hash(P+'/'+x.path)!==x.sha256)throw Error('Read hash drift');fs.appendFileSync(S+'/reading.jsonl',JSON.stringify({at:new Date().toISOString(),path:path.resolve(P,x.path),sha256:x.sha256,range:`full:1-${fs.readFileSync(P+'/'+x.path,'utf8').split(/\r?\n/).length}`,purpose:`${phase}正式回退后${from}-${to}全文六章连读`,method:'Logged CLI complete text explicitly read by model; no hash scan claimed as reading'})+'\n','utf8');}
const report=`审查/${String(from).padStart(4,'0')}-${String(to).padStart(4,'0')}-session04-${phase}模型知情连读.md`;
fs.writeFileSync(P+'/'+report,fs.readFileSync(R+`/review-${from}-${to}.md`,'utf8')+'\n\n实际全文文件及SHA-256：\n\n'+entries.map(x=>`- ${x.path} | ${x.sha256} | 全文`).join('\n')+'\n',{encoding:'utf8',flag:'wx'});
const input={from:Number(from),to:Number(to),kind:'model-self-review',report,source_hashes:sources};const file=R+`/review-input-${from}-${to}.json`;fs.writeFileSync(file,JSON.stringify(input,null,2)+'\n',{encoding:'utf8',flag:'wx'});
const result=r.run(process.execPath,['bin/ai-writer.mjs','review','--project',P,'--input',file],`${phase}-review-${from}-${to}`);process.stdout.write(result.stdout);process.stderr.write(result.stderr);process.exitCode=result.exit_code??1;
