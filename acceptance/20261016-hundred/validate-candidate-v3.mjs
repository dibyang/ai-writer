import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRunner} from './command-runner.mjs';
const base=path.dirname(fileURLToPath(import.meta.url)),stage=path.join(base,'candidate-v3-validation');
const runner=createRunner(stage);process.chdir(path.join(base,'candidate-v3-recall'));
const results=[];
for(const [label,command]of[['npm-test','npm test'],['npm-doctor','npm run doctor']]){
 const result=runner.run('cmd.exe',['/d','/s','/c',command],label);
 results.push({command,exit_code:result.exit_code,files:result.files});console.log(JSON.stringify(results.at(-1)));
}
fs.writeFileSync(path.join(stage,'result.json'),JSON.stringify({at:new Date().toISOString(),scope:'Isolated candidate, not integrated or final product acceptance',results,ok:results.every(r=>r.exit_code===0)},null,2)+'\n',{flag:'wx'});
if(results.some(r=>r.exit_code!==0))process.exitCode=1;
