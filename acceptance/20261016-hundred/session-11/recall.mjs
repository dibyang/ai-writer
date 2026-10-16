import fs from 'node:fs';
import path from 'node:path';
import {cli,runner,save,hash,project,stage} from './run-cli.mjs';
const ids=process.argv.slice(2);
for(const id of ids){
 const r=cli(['recall','--query',id,'--limit','20'],'recall-'+id);
 if(r.exit_code!==0){console.log(r.stdout,r.stderr);process.exitCode=1;continue;}
 const j=JSON.parse(r.stdout);save('recall-'+id+'.json',j);
 const exact=j.matches.find(m=>m.id===id);console.log(JSON.stringify({query:id,total:j.total,omitted:j.omitted,exact:exact?{id:exact.id,statement:exact.entry.statement,status:exact.entry.status,due_unit:exact.entry.due_unit,evidence:exact.entry.evidence}:null},null,2));
}
