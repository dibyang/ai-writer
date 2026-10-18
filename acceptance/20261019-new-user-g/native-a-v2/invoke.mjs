// Readable wrapper: every product operation still runs through capture.mjs + real CLI.
import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
const [label,...args]=process.argv.slice(2);
const base=path.resolve('acceptance/20261019-new-user-g');
const r=spawnSync(process.execPath,[path.join(base,'capture.mjs'),label,'node','bin/ai-writer.mjs',...args],{encoding:'utf8',windowsHide:true});
const dir=path.join(base,'commands',label);
if(!fs.existsSync(path.join(dir,'result.json'))){process.stderr.write(r.stderr||r.stdout||'recorder did not create result');process.exit(90);}
const meta=JSON.parse(fs.readFileSync(path.join(dir,'result.json'),'utf8'));
console.log(JSON.stringify({label,exit_code:meta.exit_code,runtime_files_stable:meta.runtime_files_stable}));
process.stdout.write(fs.readFileSync(path.join(dir,'stdout.raw.txt')));
process.stderr.write(fs.readFileSync(path.join(dir,'stderr.raw.txt')));
process.exitCode=meta.exit_code??91;
