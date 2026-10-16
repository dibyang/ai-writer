import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRunner} from '../command-runner.mjs';
const stage=path.dirname(fileURLToPath(import.meta.url));
const runner=createRunner(stage);
const args=process.argv.slice(2);
const label=args.shift();
const result=runner.run(process.execPath,[path.join(stage,'ops.mjs'),...args],`outer-${label}`);
process.stdout.write(result.stdout);
process.stderr.write(result.stderr);
if(args[0]==='read' && result.exit_code===0){
 const info=JSON.parse(result.stdout.split('\n')[0]);
 if(info.from<=info.to)fs.appendFileSync(path.join(stage,'reading.jsonl'),JSON.stringify({...info,raw_command:result.files.metadata,raw_stdout:result.files.stdout,raw_stderr:result.files.stderr,argv:result.argv,returned_at:new Date().toISOString(),scope:'returned-to-current-model; visibility verified from tool response, not semantic proof by script'})+'\n');
}
process.stdout.write(`\n[command-record ${result.files.metadata}; exit=${result.exit_code}]\n`);
process.exitCode=result.exit_code??1;
