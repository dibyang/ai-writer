// Enumerate inputs explicitly: Node 20 on Windows does not expand shell globs.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const [suite,...options]=process.argv.slice(2);
const target={workspace:['tests',/\.test\.mjs$/],engine:['vendor/story-gate-studio/tests',/\.test\.js$/]}[suite];
if(!target)throw Error('Expected workspace or engine test suite');
const [folder,pattern]=target;
const files=fs.readdirSync(path.join(root,folder),{withFileTypes:true}).filter(x=>x.isFile()&&pattern.test(x.name)).map(x=>path.join(root,folder,x.name)).sort();
if(!files.length)throw Error('No test inputs found');
const result=spawnSync(process.execPath,['--test',...options,...files],{cwd:root,stdio:'inherit',windowsHide:true});
if(result.error)throw result.error;
process.exitCode=result.status??1;
