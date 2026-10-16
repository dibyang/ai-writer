import {createRunner} from '../command-runner.mjs';
const r=createRunner('acceptance/20261016-hundred/session-03');
const [label,file,...args]=process.argv.slice(2);
const x=r.run(process.execPath,['acceptance/20261016-hundred/session-03/'+file,...args],label);
process.stdout.write(x.stdout);process.stderr.write(x.stderr);process.exitCode=x.exit_code??1;
