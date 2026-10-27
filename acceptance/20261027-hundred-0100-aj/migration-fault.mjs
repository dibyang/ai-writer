import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const base=path.dirname(fileURLToPath(import.meta.url)),root=path.join(base,'work'),entry=path.resolve(base,'../../bin/ai-writer.mjs');
const r=spawnSync(process.execPath,[path.join(base,'capture.mjs'),'migration-interrupted',process.execPath,entry,'draft','relocate','--project',root,'--input',path.join(base,'migration-input.json')],{encoding:'utf8',env:{...process.env,AI_WRITER_TEST_FAULT:'1',AI_WRITER_TEST_RELOCATE_STOP_AFTER:'56'},windowsHide:true,maxBuffer:1024*1024});
console.log(r.stdout);console.error(r.stderr);if(r.status!==94)throw Error('Unexpected migration fault exit '+r.status);console.log('Expected interruption after 56 of 112');
