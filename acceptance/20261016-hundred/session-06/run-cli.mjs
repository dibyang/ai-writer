import fs from 'node:fs';
import {createRunner} from '../command-runner.mjs';
const runner=createRunner('acceptance/20261016-hundred/session-06');
const [label,executable,...args]=process.argv.slice(2);
if(!label||!executable)throw Error('Usage: node run-cli.mjs label executable ...args');
const r=runner.run(executable,args,label);
process.stdout.write(JSON.stringify({label:r.label,exit_code:r.exit_code,files:r.files})+'\n');
process.stdout.write(r.stdout);process.stderr.write(r.stderr);
process.exitCode=r.exit_code??1;
