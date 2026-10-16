import {createRunner} from '../command-runner.mjs';
const r=createRunner('acceptance/20261016-hundred/session-04');
for(const id of process.argv.slice(2)){
 const out=r.json('recall-'+id);const x=out.matches.find(x=>x.id===id)?.entry;
 console.log(JSON.stringify({id,...x,character_known:Object.fromEntries(Object.entries(x?.character_known??{}).map(([k,v])=>[k,v.split('；保留至')[0].split('；截至第')[0].split('；历史有效知情')[0]]))}));
}
