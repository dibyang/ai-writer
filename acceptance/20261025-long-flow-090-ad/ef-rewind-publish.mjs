import path from 'node:path';import {base,j,state,evidence,cli} from './ef-lib.mjs';
const r=j(path.join(base,'e-revision-private.json')),root=r.workspace,token=r.token;
cli('ef-candidate-rewind-48',['rewind','--from','48','--expected-revision',String(state(root).revision)],{root,token,show:false});
console.log({rewound_units:state(root).units.length,revision:state(root).revision});
for(let i=1;i<=6;i++){const o=j(path.join(base,'cli-logs',`ef-stage-${i}`,'stdout.txt'));const p=cli(`ef-candidate-source-publish-${i}`,['source','publish'],{root,token,input:{expected_revision:state(root).revision,operation_id:`AD_E_CANDIDATE_PUBLISH_S0${i}`,author_evidence:evidence,impact_id:o.impact_id},show:false});console.log({i,revision:state(root).revision,published:p.published,keys:Object.keys(p)});}
cli('ef-candidate-status-post-publish',['status'],{root,token,show:false});
