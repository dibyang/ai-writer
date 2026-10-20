import {run,save} from './common.mjs';
const [label,...args]=process.argv.slice(2);
const result=run(label,args);
save(label+'.json',result);
console.log(JSON.stringify(result,null,2));
