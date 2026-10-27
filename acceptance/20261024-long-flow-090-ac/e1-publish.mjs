import path from 'node:path';import {base,j,state,save,author,cli} from './e1-ops.mjs';
const root=j(path.join(base,'e1-private/ownership.json')).workspace;
const i=Number(process.argv[2]),id='S'+String(i).padStart(2,'0'),label='e1-'+id.toLowerCase();
const impact_id=j(path.join(base,'cli-logs',label+'-stage','stdout.txt')).impact_id;
const input=save('e1-inputs/'+id+'-candidate-publish.json',{expected_revision:state(root).revision,operation_id:'E1_'+id+'_CANDIDATE_PUBLISH',author_evidence:author(),impact_id});
cli(label+'-candidate-publish',['source','publish'],{root,input,token:true,brief:true});
