import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {createRunner} from '../command-runner.mjs';
export const stage='acceptance/20261016-hundred/session-08';
export const project='acceptance/20261016-hundred/works/潮汐信号';
export const runner=createRunner(stage);
export const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
export function cli(args,label){let r=runner.run(process.execPath,['bin/ai-writer.mjs',...args,'--project',project],label);process.stdout.write(r.stdout);process.stderr.write(r.stderr);if(r.exit_code!==0)process.exitCode=r.exit_code;return r;}
export function read(p,purpose){const t=fs.readFileSync(p,'utf8');process.stdout.write('\nFILE '+p+'\n'+t+'\nEND FILE\n');fs.appendFileSync(path.join(stage,'reading.jsonl'),JSON.stringify({path:p,sha256:hash(p),purpose,range:'full',read_at:new Date().toISOString(),method:'full UTF-8 emitted and read by current model'})+'\n');return t;}
if(process.argv[2]==='cli')cli(process.argv.slice(4),process.argv[3]);
if(process.argv[2]==='read')for(const p of process.argv.slice(4))read(p,process.argv[3]);
if(process.argv[2]==='inventory'){
 const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(x=>x.isDirectory()?(x.name==='.writer'?[]:walk(path.join(d,x.name))):[path.join(d,x.name)]);
 process.stdout.write(JSON.stringify(walk(project),null,2)+'\n');
}
