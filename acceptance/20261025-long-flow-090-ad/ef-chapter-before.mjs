import path from 'node:path';import {base,j,cli} from './ef-lib.mjs';
const n=Number(process.argv[2]),r=j(path.join(base,'e-revision-private.json')),root=r.workspace,token=r.token,u=j(path.join(base,'ef-main-business-baseline.json')).bodies.find(v=>v.unit===n);
const c=cli(`ef-context-${n}`,['context','--purpose','revision','--unit',String(n),'--max-chars','200000','--out',`.writer/drafts/ef-context-${n}.json`],{root,token,show:false});
console.log({kind:'context',unit:n,keys:Object.keys(c)});
const t=cli(`ef-template-${n}`,['record-template','--unit',String(n),'--draft',u.draft,'--out',`.writer/drafts/ef-template-${n}.json`],{root,token,show:false});
console.log({kind:'template',unit:n,keys:Object.keys(t)});
const p=cli(`ef-replay-input-${n}`,['revision','replay-input','--unit',String(n),'--out',`.writer/drafts/ef-replay-${n}.json`],{root,token,show:false});console.log(JSON.stringify({kind:'replay',unit:n,result:p}));
