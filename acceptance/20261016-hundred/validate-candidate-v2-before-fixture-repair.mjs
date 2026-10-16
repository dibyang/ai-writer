import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRunner} from './command-runner.mjs';
const base=path.dirname(fileURLToPath(import.meta.url)),mode=process.argv[2],stage=path.join(base,'candidate-v2-validation');
const runner=createRunner(stage);process.chdir(path.join(base,'candidate-v2'));
if(mode==='before'){
 const r=runner.run(process.execPath,['--test','tests/recovery-guidance.test.mjs'],'before-fix-regression');
 if(r.exit_code===0)throw Error('Expected old implementation to fail new regression');
 fs.writeFileSync(path.join(stage,'before.json'),JSON.stringify({expected_failure:true,exit_code:r.exit_code,files:r.files},null,2)+'\n',{flag:'wx'});console.log(JSON.stringify({expected_failure:true,exit_code:r.exit_code}));
}else if(mode==='after'){
 const results=[];for(const [label,command]of[['npm-test','npm test'],['npm-doctor','npm run doctor']]){const r=runner.run('cmd.exe',['/d','/s','/c',command],label);results.push({command,exit_code:r.exit_code,files:r.files});console.log(JSON.stringify(results.at(-1)));}
 fs.writeFileSync(path.join(stage,'after.json'),JSON.stringify({results,ok:results.every(x=>x.exit_code===0)},null,2)+'\n',{flag:'wx'});if(results.some(x=>x.exit_code!==0))process.exitCode=1;
}else throw Error('Use before or after');
