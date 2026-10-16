import {runner,project} from './run-cli.mjs';
for(const id of process.argv.slice(2)){
 const r=runner.run(process.execPath,['bin/ai-writer.mjs','recall','--project',project,'--query',id,'--limit','5'],'recall-'+id);
 if(r.exit_code!==0){console.log(r.stderr||r.stdout);process.exitCode=r.exit_code;continue;}
 const x=JSON.parse(r.stdout);console.log('RECALL',id,JSON.stringify(x).length);
 // Exact raw output remains in commands; display structural fields and evidence without repeating historical knowledge strings.
 const visit=v=>{if(Array.isArray(v)){for(const a of v)visit(a);}else if(v&&typeof v==='object'){if(v.id===id&&v.entry){const e=v.entry;console.log(JSON.stringify({...e,character_known:Object.fromEntries(Object.entries(e.character_known??{}).map(([n,t])=>[n,t.split('；')[0]]))}));}else for(const a of Object.values(v))visit(a);}};visit(x);
}
