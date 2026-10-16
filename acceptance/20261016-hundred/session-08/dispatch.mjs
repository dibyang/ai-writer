import {runner,stage} from './run-cli.mjs';
const [label,mode,...args]=process.argv.slice(2);
const r=runner.run(process.execPath,mode==='script'?args:[stage+'/run-cli.mjs',mode,...args],label);
process.stdout.write(r.stdout);process.stderr.write(r.stderr);process.exitCode=r.exit_code??1;
