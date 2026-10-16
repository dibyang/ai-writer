import {createRunner} from '../command-runner.mjs';
const runner=createRunner('acceptance/20261016-hundred/session-07');
const [label,...args]=process.argv.slice(2);
const r=runner.run(process.execPath,['bin/ai-writer.mjs',...args],label);
process.stdout.write(r.stdout);process.stderr.write(r.stderr);
process.exitCode=r.exit_code??1;
