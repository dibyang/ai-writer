import fs from'node:fs';import path from'node:path';import{A,P,j,state,cli,sha,put}from'./fr-lib.mjs';
const session=j(path.join(A,'fr-distance-session.json')),root=session.workspace,token=session.token;
cli('fr-distance-rewind',['rewind','--from','21','--expected-revision',String(state(root).revision)],{root,token,show:false});
cli('fr-distance-u21-context',['context','--purpose','revision','--unit','21','--max-chars','1200000'],{root,token,show:false});
const old=state().units.find(x=>x.unit===21);
cli('fr-distance-u21-template',['record-template','--unit','21','--draft',old.draft],{root,token,show:false});
const f=path.join(root,old.draft),body=fs.readFileSync(f,'utf8');if(body.split('送过去只隔两条街').length!==2)throw Error('Expected single 21 anchor');
put(path.join(A,'fr-distance-before21.md'),body);
console.log(JSON.stringify({workspace:root,unit:21,draft:old.draft,old_sha256:sha(fs.readFileSync(f)),branch_revision:state(root).revision,context_ref:'cli-logs/fr-distance-u21-context/stdout.txt',template_ref:'cli-logs/fr-distance-u21-template/stdout.txt'},null,2));
