import fs from 'node:fs';import {runner,cli,stage} from './workflow.mjs';
for(const [label,args,file] of [['context-95-replay-cli',['context','--unit','95','--max-chars','1200000'],'context'],['template-95-replay-cli',['record-template','--unit','95','--draft','正文/0095-先写今天这一页.md'],'template']]){
const r=cli(label,args);console.log(JSON.stringify({label,exit_code:r.exit_code,files:r.files}));if(r.exit_code!==0){console.log(r.stdout);process.exit(r.exit_code??1);}fs.writeFileSync(stage+'/repair-95/'+file+'-replay.json',JSON.stringify(runner.json(label),null,2)+'\n',{flag:'wx'});
}
console.log(JSON.stringify(runner.json('template-95-replay-cli')));
