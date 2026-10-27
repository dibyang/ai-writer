import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import crypto from 'node:crypto';import {spawnSync} from 'node:child_process';import {fileURLToPath} from 'node:url';
const A=path.dirname(fileURLToPath(import.meta.url)),build=JSON.parse(fs.readFileSync(path.join(A,'local-checks/final-candidate-build/stdout.txt'))),out=path.join(A,'extracted-final-candidate'),sha=b=>crypto.createHash('sha256').update(b).digest('hex');
assert(!fs.existsSync(out));assert.equal(sha(fs.readFileSync(build.archive)),build.archive_sha256);assert.equal(path.dirname(out),A);
const quote=x=>"'"+x.replaceAll("'","''")+"'";
const command=`$ErrorActionPreference='Stop'; Expand-Archive -LiteralPath ${quote(build.archive)} -DestinationPath ${quote(out)}`;
const result=spawnSync('powershell.exe',['-NoProfile','-NonInteractive','-Command',command],{encoding:'utf8',windowsHide:true,timeout:60000});
if(result.stdout)process.stdout.write(result.stdout);if(result.stderr)process.stderr.write(result.stderr);assert.equal(result.error,undefined);assert.equal(result.status,0);assert.equal(sha(fs.readFileSync(build.archive)),build.archive_sha256);
console.log(JSON.stringify({ok:true,archive:build.archive,archive_sha256:build.archive_sha256,extracted_to:out,scope:'Fresh extraction; archive unchanged; full inventory is checked separately.'}));
