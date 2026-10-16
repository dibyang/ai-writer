import fs from 'node:fs';import {runner,cli,stage} from './workflow.mjs';
for(const [label,args,file] of [['context-96-after-replay-cli',['context','--unit','96','--max-chars','1200000'],'context-96'],['template-96-after-replay-cli',['record-template','--unit','96','--draft','正文/0096-听完以后出门.md'],'record-96-before']]){
 const r=cli(label,args);console.log(JSON.stringify({label,exit_code:r.exit_code,files:r.files}));if(r.exit_code!==0){console.log(r.stdout);process.exit(r.exit_code??1);}fs.writeFileSync(stage+'/'+file+'.json',JSON.stringify(runner.json(label),null,2)+'\n');
}
console.log(JSON.stringify(runner.json('template-96-after-replay-cli')));
