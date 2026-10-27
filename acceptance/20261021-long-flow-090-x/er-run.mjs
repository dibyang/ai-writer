import fs from 'node:fs';import path from 'node:path';import {spawnSync} from 'node:child_process';import {fileURLToPath} from 'node:url';
const X=path.dirname(fileURLToPath(import.meta.url));
const h=JSON.parse(fs.readFileSync(path.join(X,'cli-logs/e-begin/stdout.raw.txt'),'utf8'));
const [label,...args]=process.argv.slice(2);if(!/^er-/.test(label??''))throw Error('unique er label required');
const r=spawnSync(process.execPath,[path.join(X,'x-writer.mjs'),label,...args,'--project',h.workspace,'--revision-token',h.token],{stdio:'inherit',windowsHide:true});
process.exitCode=r.status??1;
