import path from 'node:path';import {base,j,state,cli} from './ef-lib.mjs';
const list=j(path.join(base,'e-preflight.json')).source_version_plan;
for(let i=0;i<list.length;i++){const x=list[i];cli('ef-freeze-old-'+(i+1),['source','freeze'],{input:{expected_revision:state().revision,operation_id:'AD_E_FREEZE_OLD_'+(i+1),ref:x.ref,file:x.ref,version_id:x.suggested_old_version_id,previous:null}});}
cli('ef-impact-baseline-1',['source','impact'],{input:{version_id:list[0].suggested_old_version_id,from:1,mode:'baseline'},show:false});
console.log(JSON.stringify(j(path.join(base,'cli-logs/ef-impact-baseline-1/stdout.txt')),null,2));
