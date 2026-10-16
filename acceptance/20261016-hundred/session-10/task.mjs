import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {createRunner} from '../command-runner.mjs';
import {replaySnapshots,changesBetween} from '../rebuild-utils.mjs';
const stage='acceptance/20261016-hundred/session-10', work='acceptance/20261016-hundred/works/潮汐信号';
const r=createRunner(stage), sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const read=p=>fs.readFileSync(p,'utf8');
const json=p=>JSON.parse(read(p));
const save=(p,x)=>{fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,typeof x==='string'?x:JSON.stringify(x,null,2)+'\n','utf8');};
const state=()=>json(work+'/.writer/state.json');
const cli=(label,...args)=>{const o=r.run(process.execPath,['bin/ai-writer.mjs',...args,'--project',work],label);console.log(args[0]==='context'||args[0]==='record-template'?JSON.stringify({label,bytes:o.stdout.length,files:o.files}):o.stdout);if(o.exit_code!==0){console.error(o.stderr);throw Error(label+' exit '+o.exit_code);}return args.includes('--help')?o.stdout:JSON.parse(o.stdout);};
const [action,...args]=process.argv.slice(2);
if(action==='initial'){
 save(stage+'/started.json',{started_at:r.last('bootstrap-node').started_at,now:new Date().toISOString()});
 cli('check-initial','check');cli('outline-initial','outline','--unit','79');
 for(const c of ['plan','context','record-template','record','rewind','review','recall','export','doctor'])cli('help-'+c,c,'--help');
 const s=state();console.log(JSON.stringify({keys:Object.keys(s),units:s.units.slice(-6),characters:s.snapshot.characters,ledger:s.snapshot.ledger,files:fs.readdirSync(work+'/设定'),outlines:fs.readdirSync(work+'/大纲')},null,2));
}
if(action==='read'||action==='read-unit'){
 const paths=action==='read-unit'?args.map(n=>state().units.find(u=>u.unit===Number(n)).draft):args;
 for(const rel of paths){const p=path.resolve(work,rel),b=fs.readFileSync(p);console.log('\nFILE '+rel+' SHA256 '+sha(b)+'\n'+b.toString('utf8'));fs.appendFileSync(stage+'/reading.jsonl',JSON.stringify({at:new Date().toISOString(),path:p,sha256:sha(b),range:'full',purpose:'recovery / continuity / self-review',bytes:b.length})+'\n');}
}
if(action==='inspect75'){
 const s=state(),ss=replaySnapshots(work,s);save(stage+'/knowledge-repair/replayed-before.json',ss.slice(74).map((snapshot,i)=>({unit:i+74,snapshot})));
 for(let n=74;n<=78;n++){const sn=ss[n];console.log(JSON.stringify({unit:n,邹秀琴:sn.characters.邹秀琴,route:sn.ledger.T_ROUTE_TRIAL_73?.character_known,other:Object.fromEntries(Object.entries(sn.ledger).filter(([id,v])=>JSON.stringify(v.character_known??{}).includes('两车')||Object.hasOwn(v.character_known??{},'邹秀琴')).map(([id,v])=>[id,v.character_known.邹秀琴]))},null,2));}
 for(const u of s.units.slice(-4)){const j=json(work+'/'+u.journal);console.log(JSON.stringify({journal:u.journal,sha256:sha(fs.readFileSync(work+'/'+u.journal)),keys:Object.keys(j),patch:j.patch?.filter?.(p=>JSON.stringify(p).includes('邹'))},null,2));}
}
if(action==='inventory'){
 const s=json(stage+'/knowledge-repair/before/work/.writer/state.json');const current=v=>v.split('；')[0];console.log(JSON.stringify({units:s.units.slice(-9).map(u=>({unit:u.unit,draft:u.draft,sha256:u.sha256,journal:u.journal})),characters:Object.fromEntries(Object.entries(s.snapshot.characters).map(([k,v])=>[k,current(v)])),ledger:Object.fromEntries(Object.entries(s.snapshot.ledger).filter(([id,v])=>v.status!=='resolved').map(([id,v])=>[id,{type:v.type,statement:v.statement,status:v.status,due_unit:v.due_unit,custody:v.custody,character_known:Object.fromEntries(Object.entries(v.character_known??{}).map(([k,v])=>[k,v.split('；历史')[0].split('；保留')[0].split('；截至')[0]])),evidence:(v.evidence??[]).map(e=>({unit:e.unit,quote:e.quote}))}]))},null,2));
}
if(action==='freeze'){
 const dest=stage+'/knowledge-repair/'+args[0]+'/work';if(fs.existsSync(dest))throw Error('freeze exists');fs.cpSync(work,dest,{recursive:true});
 const list=[];function walk(d){for(const e of fs.readdirSync(d,{withFileTypes:true})){const p=path.join(d,e.name);if(e.isDirectory())walk(p);else list.push({path:path.relative(dest,p).replaceAll('\\','/'),sha256:sha(fs.readFileSync(p)),bytes:fs.statSync(p).size});}}walk(dest);save(stage+'/knowledge-repair/'+args[0]+'/sha256.json',list);console.log({files:list.length,state:sha(fs.readFileSync(work+'/.writer/state.json'))});
}
if(action==='cli')cli(args[0],...args.slice(1));
if(action==='review'){
 const [from,to,report,label]=args,s=state(),source_hashes=Object.fromEntries(s.units.filter(u=>u.unit>=Number(from)&&u.unit<=Number(to)).map(u=>[u.draft,sha(fs.readFileSync(work+'/'+u.draft))]));
 const input={from:Number(from),to:Number(to),kind:'model-self-review',report,source_hashes};save(stage+'/'+label+'.json',input);cli(label,'review','--input',stage+'/'+label+'.json');
}
if(action==='ledger-page'){
 const s=state(),entries=Object.entries(s.snapshot.ledger).filter(([id,v])=>v.status!=='resolved'),start=Number(args[0]??0),count=Number(args[1]??15);
 const projected=entries.slice(start,start+count).map(([id,v])=>({id,type:v.type,statement:v.statement,status:v.status,due_unit:v.due_unit,reader_known:v.reader_known,custody:v.custody,character_known:v.type==='thread'?Object.fromEntries(Object.entries(v.character_known??{}).map(([k,v])=>[k,v.split('；历史')[0].split('；保留')[0].split('；截至')[0]])):undefined,evidence_units:[...new Set((v.evidence??[]).map(e=>e.unit))]}));
 console.log(JSON.stringify({start,total:entries.length,entries:projected},null,2));fs.appendFileSync(stage+'/reading.jsonl',JSON.stringify({at:new Date().toISOString(),path:path.resolve(work+'/.writer/state.json'),sha256:sha(fs.readFileSync(work+'/.writer/state.json')),range:'ledger unresolved projection '+start+'..'+(start+projected.length-1),purpose:'read current statements/custody; full knowledge for threads, evidence chapter index only'})+'\n');
}
if(action==='repair-finish'){
 cli('status-repaired78','status');cli('check-repaired78','check');cli('doctor-repaired78','doctor');cli('export-repaired78','export','--out',stage+'/knowledge-repair/export');
}
if(action==='recall'){
 for(const id of args){const out=r.run(process.execPath,['bin/ai-writer.mjs','recall','--project',work,'--query',id,'--limit','100'],'recall-'+id);if(out.exit_code!==0)throw Error(out.stderr);const data=JSON.parse(out.stdout),entry=data.matches.find(x=>x.kind==='ledger'&&x.id===id);if(!entry)throw Error('Exact ID absent:'+id);save(stage+'/recall/'+id+'.json',data);console.log(JSON.stringify({id,entry:entry.entry},null,2));}
}
if(action==='recall-locate'){
 for(const id of args){const out=r.run(process.execPath,['bin/ai-writer.mjs','recall','--project',work,'--query',id,'--limit','100'],'locate-'+id);if(out.exit_code!==0){console.log(out.stdout);console.error(out.stderr);throw Error('recall failed');}const data=JSON.parse(out.stdout),exact=data.matches.find(x=>x.kind==='ledger'&&x.id===id);if(!exact)throw Error('Exact ID absent:'+id);save(stage+'/recall/'+id+'.json',data);console.log(JSON.stringify({id,statement:exact.entry.statement,status:exact.entry.status,due_unit:exact.entry.due_unit,evidence:exact.entry.evidence},null,2));}
}
if(action==='prepare'){
 const n=Number(args[0]),plan=json(stage+'/plan-'+n+'.json'),draft='正文/'+String(n).padStart(4,'0')+'-'+plan.title+'.md';
 cli('outline-'+n,'outline','--unit',String(n));cli('plan-'+n,'plan','--input',stage+'/plan-'+n+'.json');
 const ctx=cli('context-'+n,'context','--unit',String(n),'--max-chars','160000');save(stage+'/context-'+n+'.json',ctx);
 const template=cli('template-'+n,'record-template','--unit',String(n),'--draft',draft);save(stage+'/template-'+n+'.json',template);
 console.log(JSON.stringify({unit:n,draft,template,context_keys:Object.keys(ctx),omitted:ctx.omitted_ids??ctx.long_form?.omitted_ids},null,2));
}
if(action==='record-new'){
 const n=Number(args[0]),template=json(stage+'/template-'+n+'.json'),data=json(stage+'/changes-'+n+'.json'),s=state();
 for(const [name,text] of Object.entries(data.changes.characters??{}))if(s.snapshot.characters[name])data.changes.characters[name]=text+'；历史有效信息（以下按原章时点，不作当前状态）：'+s.snapshot.characters[name];
 for(const [id,delta] of Object.entries(data.changes.ledger??{}))for(const [name,text] of Object.entries(delta.character_known??{})){const old=s.snapshot.ledger[id]?.character_known?.[name];if(old)delta.character_known[name]=text+'；历史有效信息（以下按原章时点，不作当前状态）：'+old;}
 const input={...template,...data};save(stage+'/input-'+n+'.json',input);cli('record-'+n,'record','--input',stage+'/input-'+n+'.json');cli('check-'+n,'check');
}
if(action==='count'){
 const n=Number(args[0]),plan=json(stage+'/plan-'+n+'.json'),p=work+'/正文/'+String(n).padStart(4,'0')+'-'+plan.title+'.md',b=fs.readFileSync(p),text=String(b).replace(/^#[^\n]*(?:\r?\n|$)/gm,'');console.log({unit:n,han:(text.match(/\p{Script=Han}/gu)??[]).length,sha256:sha(b),bytes:b.length,elapsed_s:((Date.now()-Date.parse(json(stage+'/started.json').started_at))/1000).toFixed(1)});
}
if(action==='context-view'){
 const ctx=json(stage+'/context-'+args[0]+'.json');console.log(JSON.stringify({revision:ctx.revision,continuity:ctx.continuity,previous_ending:ctx.previous_ending},null,2));
}
if(action==='prepare-repair'){
 const s=state(),ss=replaySnapshots(work,s);const diffs=[];
 for(let n=75;n<=78;n++){
  const sn=ss[n],old=sn.characters.邹秀琴;
  sn.characters.邹秀琴=old.replace('仅听现场两车试意向前段，未见自己离后搬箱/司机完整46/48约定。','当场交代本人9:00—9:40浮动来货；已离场，未得知其后才形成的两次试行及46/48日期安排，也未见离场后搬箱。');
  const entry=sn.ledger.T_ROUTE_TRIAL_73,prev=entry.character_known.邹秀琴;
  entry.character_known.邹秀琴=prev.replace('离开早，不知其后箱内实物和完整两车约。','已离场，未见其后箱内实物，未得知离场后才定的两次试行及46/48日期安排。');
  diffs.push({unit:n,characters:{before:old,after:sn.characters.邹秀琴},ledger:{id:'T_ROUTE_TRIAL_73',before:prev,after:entry.character_known.邹秀琴}});
 }
 save(stage+'/knowledge-repair/desired-snapshots.json',ss.slice(74).map((snapshot,i)=>({unit:i+74,snapshot})));
 save(stage+'/knowledge-repair/differences.json',diffs);
 for(const u of s.units.slice(-4)){const j=json(work+'/'+u.journal);console.log(JSON.stringify({unit:u.unit,journal:u.journal,keys:Object.keys(j),knowledgePatch:j.patch.filter(p=>p.at?.[0]==='characters'&&p.at?.[1]==='邹秀琴'||p.at?.[1]==='T_ROUTE_TRIAL_73'&&p.at?.at(-1)==='邹秀琴')},null,2));}
 console.log('Earliest error:75; only two textual knowledge replacements per snapshot; drafts unchanged.');
}
if(action==='repair-unit'){
 const n=Number(args[0]),frozen=json(stage+'/knowledge-repair/before/work/.writer/state.json'),u=frozen.units.find(u=>u.unit===n);
 const plan=work+'/大纲/单元/'+String(n).padStart(4,'0')+'.json';
 cli('repair-plan-'+n,'plan','--input',plan);
 const ctx=cli('repair-context-'+n,'context','--unit',String(n),'--max-chars','160000');save(stage+'/knowledge-repair/context-'+n+'.json',ctx);
 const template=cli('repair-template-'+n,'record-template','--unit',String(n),'--draft',u.draft);save(stage+'/knowledge-repair/template-'+n+'.json',template);
 const desired=json(stage+'/knowledge-repair/desired-snapshots.json').find(x=>x.unit===n).snapshot;
 const input={...template,summary:u.summary,changes:changesBetween(state().snapshot,desired,n)};
 save(stage+'/knowledge-repair/input-'+n+'.json',input);
 cli('repair-record-'+n,'record','--input',stage+'/knowledge-repair/input-'+n+'.json');cli('repair-check-'+n,'check');
}
if(action==='repair-verify'){
 const before=json(stage+'/knowledge-repair/before/work/.writer/state.json'),after=state();
 const want=json(stage+'/knowledge-repair/desired-snapshots.json'),ss=replaySnapshots(work,after);
 const checks={drafts:before.units.every(u=>sha(fs.readFileSync(work+'/'+u.draft))===u.sha256),first74:JSON.stringify(before.units.slice(0,74))===JSON.stringify(after.units.slice(0,74)),snapshots:want.every(x=>JSON.stringify(ss[x.unit])===JSON.stringify(x.snapshot)),ids:Object.keys(before.snapshot.ledger).join()===Object.keys(after.snapshot.ledger).join(),metadata:Object.entries(before.snapshot.ledger).every(([id,v])=>['type','introduced_unit','due_unit'].every(k=>JSON.stringify(v[k])===JSON.stringify(after.snapshot.ledger[id][k]))),evidence:Object.entries(before.snapshot.ledger).every(([id,v])=>JSON.stringify(v.evidence)===JSON.stringify(after.snapshot.ledger[id].evidence)),timeline:JSON.stringify(before.snapshot.timeline)===JSON.stringify(after.snapshot.timeline),threads:JSON.stringify(before.snapshot.threads)===JSON.stringify(after.snapshot.threads)};
 save(stage+'/knowledge-repair/invariants.json',checks);console.log(checks);if(Object.values(checks).some(x=>!x))throw Error('repair invariant mismatch');
}
