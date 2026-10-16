import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {createRunner} from '../command-runner.mjs';
export const stage='acceptance/20261016-hundred/session-11';
export const project='acceptance/20261016-hundred/works/潮汐信号';
export const runner=createRunner(stage);
export const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
export function cli(args,label){return runner.run(process.execPath,['bin/ai-writer.mjs',...args,'--project',project],label);}
export function save(name,data){fs.writeFileSync(path.join(stage,name),JSON.stringify(data,null,2)+'\n','utf8');}
if(process.argv[1]&&path.resolve(process.argv[1])===path.resolve(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/,'$1'))){
 const [label,command,...args]=process.argv.slice(2);
 const r=cli([command,...args],label);process.stdout.write(r.stdout);process.stderr.write(r.stderr);process.exitCode=r.exit_code??1;
}
