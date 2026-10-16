import {createRunner} from '../command-runner.mjs';
const runner=createRunner('acceptance/20261016-hundred/session-04');
const [label,executable,...args]=process.argv.slice(2);
if(!label||!executable)throw Error('Usage: run-cli.mjs label executable args...');
const result=runner.run(executable,args,label);
process.stdout.write(result.stdout);process.stderr.write(result.stderr);
process.exitCode=result.exit_code??1;
