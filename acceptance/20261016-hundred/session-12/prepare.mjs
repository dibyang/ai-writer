import fs from 'node:fs';
import {runner,cli,project,stage,hash} from './workflow.mjs';
const unit=Number(process.argv[2]);
const plan=JSON.parse(fs.readFileSync(stage+`/plan-${unit}.json`,'utf8'));
for(const [label,args] of [[`outline-${unit}`,['outline','--unit',String(unit)]],[`plan-${unit}-cli`,['plan','--input',stage+`/plan-${unit}.json`]],[`context-${unit}-cli`,['context','--unit',String(unit),'--max-chars','1200000']],[`template-${unit}-cli`,['record-template','--unit',String(unit),'--draft',plan.draft]]]){
 const r=cli(label,args);console.log(JSON.stringify({label,exit_code:r.exit_code,files:r.files}));if(r.exit_code!==0){console.log(r.stdout);console.error(r.stderr);process.exit(r.exit_code??1);}
 if(label===`context-${unit}-cli`){const x=runner.json(label);fs.writeFileSync(stage+`/context-${unit}.json`,JSON.stringify(x,null,2)+'\n');console.log('CONTEXT_KEYS '+JSON.stringify(Object.keys(x)));}
 if(label===`template-${unit}-cli`){const x=runner.json(label);fs.writeFileSync(stage+`/record-${unit}-before.json`,JSON.stringify(x,null,2)+'\n',{flag:'wx'});console.log('TEMPLATE '+JSON.stringify(x));}
}
