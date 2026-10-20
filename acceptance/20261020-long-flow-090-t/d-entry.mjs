import {run,save,state,sha,read} from './common.mjs';
for(const [label,args] of [['d-entry-status',['status']],['d-entry-workflow',['workflow','show']],['d-entry-identify',['tool','identify']],['d-entry-revisions',['revision','list']],['d-entry-updates',['tool','updates']]]){const result=run(label,args);save(label+'.json',result);console.log(label,JSON.stringify(result));}
save('d-entry-state-binding.json',{sha256:sha(read('.writer/state.json')),revision:state().revision,units:state().units.length});
