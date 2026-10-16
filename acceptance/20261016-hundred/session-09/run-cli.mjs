import fs from 'node:fs';
import path from 'node:path';
import {createRunner} from '../command-runner.mjs';
export const stage='acceptance/20261016-hundred/session-09';
export const work='acceptance/20261016-hundred/works/潮汐信号';
export const runner=createRunner(stage);
export function cli(args,label){return runner.run(process.execPath,['bin/ai-writer.mjs',...args,'--project',work],label);}
if(process.argv[1]===path.resolve('acceptance/20261016-hundred/session-09/run-cli.mjs')){
 const [label,executable,...args]=process.argv.slice(2);
 const r=runner.run(executable==='node'?process.execPath:executable,args,label);
 process.stdout.write(r.stdout);process.stderr.write(r.stderr);process.exitCode=r.exit_code??1;
}
