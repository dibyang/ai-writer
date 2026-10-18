import {base,read,input,rev,cli} from './native-one-helper.mjs';
import {planUnits,prepare} from './native-one-drafting.mjs';
planUnits([1,2,3]);
const x=read(base+'/native-one-inputs/workflow-trial.json');x.expected_revision=rev();x.operation_id='native-one-trial-six-ready';
cli('workflow-trial-ready',['workflow','set','--input',input('workflow-trial-ready',x)]);
prepare(1);
