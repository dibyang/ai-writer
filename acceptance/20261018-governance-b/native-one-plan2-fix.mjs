import {base,read,input,cli} from './native-one-helper.mjs';
import {prepare} from './native-one-drafting.mjs';
const x=read(base+'/native-one-inputs/plan-2.json');x.recall_ids=['OBJ_COPPER','THREAD_LETTER'];
cli('plan-2-ready',['plan','--input',input('plan-2-ready',x)]);prepare(2,'-ready');
