import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';
const base=path.dirname(new URL(import.meta.url).pathname.replace(/^\/(?=[A-Za-z]:)/,'')),root=JSON.parse(fs.readFileSync(path.join(base,'project.json'))).project,s=JSON.parse(fs.readFileSync(path.join(root,'.writer/state.json'))),mode=process.argv[2],sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const emit=x=>console.log(JSON.stringify(x,null,2));
if(mode==='tracking'){
 const units=s.units.filter(u=>u.unit>=Number(process.argv[3]??48)&&u.unit<=Number(process.argv[4]??60));
 const rx=/砂纸|六十八|净68|找32|三十二|五十八|净58|料十二|料12|工四十六|工46/;
 for(const u of units){const j=JSON.parse(fs.readFileSync(path.join(root,u.journal)));emit({unit:u.unit,summary:u.summary,journal:u.journal,journal_sha256:u.journal_sha256,patch:j.patch.filter(p=>rx.test(JSON.stringify(p))),downstream:j.downstream,keys:Object.keys(j)});}
}else if(mode==='sources'){
 const refs=new Set(s.units.filter(u=>u.unit>=48).flatMap(u=>Object.keys(u.source_hashes)).filter(r=>/^(设定|大纲|研究)\//.test(r)));
 const all=[...refs].map(ref=>({ref,live_sha256:sha(fs.readFileSync(path.join(root,ref))),consumers:s.units.filter(u=>u.source_hashes[ref]).map(u=>({unit:u.unit,sha256:u.source_hashes[ref],binding:u.source_bindings?.[ref]??null})),versions:Object.values(s.source_versions).filter(v=>v.ref===ref)}));
 const f=path.join(base,'epr-source-consumers.json');if(!fs.existsSync(f))fs.writeFileSync(f,JSON.stringify(all,null,2)+'\n',{flag:'wx'});
 emit(all.map(x=>({ref:x.ref,live_sha256:x.live_sha256,consumer_units:x.consumers.map(u=>u.unit),consumed_sha256:[...new Set(x.consumers.map(u=>u.sha256))],versions:x.versions.map(v=>v.id)})));
}else if(mode==='ledger'){
 const rx=new RegExp(process.argv[3]??'砂纸|工料|柜门|新灯|68|五十八');emit(Object.entries(s.snapshot.ledger).filter(([id,v])=>rx.test(id+' '+JSON.stringify(v))).map(([id,v])=>({id,...v})));
}else if(mode==='issues'){
 emit({keys:Object.keys(s.review_workflow),issues:Object.entries(s.review_workflow.issues).map(([id,v])=>({id,status:v.status,type:v.type,target_units:v.target_units,application_commit_id:v.application?.commit_id,application_transaction_id:v.application?.transaction_id,verification_ref:v.verification?.review_ref,evidence_units:[...new Set(v.evidence.map(e=>e.unit))],history_count:v.history?.length,origin:v.origin}))});
}else if(mode==='observations'){
 emit(Object.entries(s.snapshot.ledger).filter(([id,v])=>v.type==='observation').map(([id,v])=>({id,type:v.type,statement:v.statement,author_truth:v.author_truth})));
}else if(mode==='source-text-hits'){
 const refs=[...new Set(s.units.filter(u=>u.unit>=48).flatMap(u=>Object.keys(u.source_hashes)).filter(r=>/^(设定|大纲|研究)\//.test(r)))];
 const rx=/砂纸|六十八|68|五十八|58|料十二|料12|六十|60找|净58/;for(const ref of refs){const bound=s.units.find(u=>u.unit>=48&&u.source_hashes[ref]);const binding=bound.source_bindings?.[ref];const selected=binding?.object_ref??ref;const body=fs.readFileSync(path.join(root,selected),'utf8');const lines=body.split(/\r?\n/);const hits=lines.flatMap((t,i)=>rx.test(t)?[{line:i+1,text:t}]:[]);if(hits.length)emit({ref,selected,sha256:sha(fs.readFileSync(path.join(root,selected))),hits});}
}else if(mode==='locate'){
 const rx=new RegExp(process.argv[3]);for(const u of s.units){const body=fs.readFileSync(path.join(root,u.draft),'utf8');const matches=[...body.matchAll(new RegExp(rx.source,'g'))].map(m=>({page:Math.floor(m.index/1800)+1,from:m.index,text:body.slice(Math.max(0,m.index-90),m.index+150)}));if(matches.length)emit({unit:u.unit,draft:u.draft,sha256:u.sha256,matches});}
}else if(mode==='summary'){
 const a=JSON.parse(fs.readFileSync(path.join(base,'cli-logs/epr-entry-status/stdout.txt'))),c=JSON.parse(fs.readFileSync(path.join(base,'cli-logs/epr-entry-check/stdout.txt')));emit({status:{ok:a.ok,revision:a.revision,next_unit:a.next_unit,changed_sources:a.changed_sources,stale_units:a.stale_units,impact_pending:a.impact_pending,revisions:a.revisions.sessions.map(x=>({id:x.id,status:x.status})),transactions:a.revisions.transactions,tool_control:{generation:a.tool_control.generation,installed:a.tool_control.installed}},check_keys:Object.keys(c),check:{ok:c.ok,errors:c.errors,warnings:c.warnings,draft_inventory:c.draft_inventory,rolling_review:c.rolling_review}});
}else throw Error('unknown mode');
