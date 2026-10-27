import path from 'node:path';import {base,j,readFilePages} from './ef-lib.mjs';
const [label,ref,a,b]=process.argv.slice(2),r=j(path.join(base,'e-revision-private.json'));let f=ref;
if(/^\d+$/.test(ref))f=j(path.join(base,'ef-main-business-baseline.json')).bodies.find(v=>v.unit===Number(ref)).draft;
readFilePages(label,path.join(r.workspace,f),Number(a??1),b?Number(b):undefined);
