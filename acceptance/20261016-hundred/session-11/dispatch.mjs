import {runner} from './run-cli.mjs';
const [label,file,...args]=process.argv.slice(2);
const r=runner.run(process.execPath,[file,...args],label);
process.stdout.write(r.stdout);process.stderr.write(r.stderr);process.exitCode=r.exit_code??1;
