import fs from 'node:fs';
import {createRunner} from '../command-runner.mjs';
const stage='acceptance/20261016-hundred/session-13',project='acceptance/20261016-hundred/works/潮汐信号',n=+process.argv[2],draft=process.argv[3],r=createRunner(stage);
for(const [label,a]of [['plan-'+n+'-cli',['plan','--input',stage+'/plan-'+n+'.json']],['context-'+n,['context','--unit',String(n),'--max-chars','230000']],['template-'+n,['record-template','--unit',String(n),'--draft',draft]]]){
 const x=r.run('node',['bin/ai-writer.mjs',...a,'--project',project],label);console.log(JSON.stringify({label,exit_code:x.exit_code,files:x.files}));if(x.exit_code!==0){console.log(x.stdout);console.error(x.stderr);process.exit(1);}
}
const c=r.json('context-'+n),t=r.json('template-'+n);fs.writeFileSync(stage+'/template-'+n+'-before.json',JSON.stringify(t,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({unit:n,revision:c.revision,source_hashes:c.source_hashes,outline:c.outline,continuity_keys:Object.keys(c.continuity),selected_ids:c.continuity?.ledger?.map?.(x=>x.id),selection:c.continuity?.selection},null,2));
