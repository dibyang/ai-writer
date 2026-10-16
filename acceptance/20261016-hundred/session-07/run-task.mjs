import {createRunner} from '../command-runner.mjs';
const [label,file,...args]=process.argv.slice(2);
const r=createRunner('acceptance/20261016-hundred/session-07').run(process.execPath,[file,...args],label);
process.stdout.write(r.stdout);process.stderr.write(r.stderr);process.exitCode=r.exit_code??1;
