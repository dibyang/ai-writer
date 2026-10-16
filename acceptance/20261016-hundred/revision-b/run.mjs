import {createRunner} from '../command-runner.mjs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const stage=path.dirname(fileURLToPath(import.meta.url));
const [label,...args]=process.argv.slice(2);
const result=createRunner(stage).run(process.execPath,args,label,{timeout:180000});
process.stdout.write(result.stdout);process.stderr.write(result.stderr);
process.stderr.write(`\n[runner ${label}: exit=${result.exit_code}; metadata=${result.files.metadata}]\n`);
process.exitCode=result.exit_code??1;
