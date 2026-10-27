import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {base,main,j,sha,state,save,author,cli} from './e1-ops.mjs';
const sources=j(path.join(base,'e-proposal.json')).proposals.flatMap(p=>p.source_strategy.changes);
const [action,indexArg]=process.argv.slice(2),index=Number(indexArg),s=sources[index-1];
assert(s);const id='S'+String(index).padStart(2,'0'),label='e1-'+id.toLowerCase();
if(action==='freeze-old'){
 assert.equal(sha(fs.readFileSync(path.join(main,s.ref))),s.sha256);
 const f=save('e1-inputs/'+id+'-freeze-old.json',{expected_revision:state().revision,operation_id:'E1_'+id+'_FREEZE_OLD',ref:s.ref,version_id:'E1_'+id+'_OLD',previous:null});
 cli(label+'-freeze-old',['source','freeze'],{input:f});
}
if(action==='impact-old'){
 const f=save('e1-inputs/'+id+'-impact-old.json',{version_id:'E1_'+id+'_OLD',from:s.publish_from,mode:'baseline'});
 cli(label+'-impact-old',['source','impact'],{input:f});
}
if(action==='impact-baseline'){
 const f=save('e1-inputs/'+id+'-impact-baseline.json',{version_id:'E1_'+id+'_OLD',from:1,mode:'baseline'});
 cli(label+'-impact-baseline',['source','impact'],{input:f,brief:true});
}
