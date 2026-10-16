import {createRunner} from '../command-runner.mjs';
const r=createRunner('acceptance/20261016-hundred/session-10');
const [label,executable,...args]=process.argv.slice(2);
if(!label||!executable)throw Error('label executable args required');
const out=r.run(executable,args,label);
process.stdout.write(out.stdout);process.stderr.write(out.stderr);
console.log('\nRUNNER '+JSON.stringify({label,exit_code:out.exit_code,elapsed_ms:out.elapsed_ms,files:out.files}));
process.exitCode=out.exit_code??1;
