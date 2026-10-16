import fs from 'node:fs';
import path from 'node:path';
import {runner,cli,save,hash,stage,project} from './run-cli.mjs';
const [mode,...args]=process.argv.slice(2);
if(mode==='boot'){
 for(const cmd of ['plan','context','record-template','recall','review','export','doctor']){const r=cli([cmd,'--help'],`help-${cmd}`);console.log(r.stdout);if(r.stderr)console.error(r.stderr);}
 for(const [label,a] of [['check-initial',['check']],['outline-85',['outline','--unit','85']]]){const r=cli(a,label);console.log(label+'\n'+r.stdout);}
 const r=runner.run('git',['status','--short'],'git-status-initial');console.log(r.stdout);
 save('started.json',{started_at:'2026-10-16T11:20:29.717Z',project});
}
if(mode==='readlog'){
 const purpose=args.shift();for(const f of args){const p=path.join(project,f);fs.appendFileSync(path.join(stage,'reading.jsonl'),JSON.stringify({path:p.replaceAll('\\','/'),sha256:hash(p),range:'full',purpose,read_at:new Date().toISOString(),method:'FastCtx full text displayed and read by model; hash recorded after reading'})+'\n');}
}
if(mode==='inventory'){
 for(const dir of ['设定','大纲','正文'])console.log(dir,fs.readdirSync(path.join(project,dir)).filter(f=>dir!=='正文'||/^00(7[2-9]|8[0-4])/.test(f)));
 const s=JSON.parse(fs.readFileSync(path.join(project,'.writer/state.json'),'utf8'));
 console.log(JSON.stringify({keys:Object.keys(s),current:s.current},null,2));
}
if(mode==='ledger'){
 const s=JSON.parse(fs.readFileSync(path.join(project,'.writer/state.json'),'utf8'));
 console.log(JSON.stringify({keys:Object.keys(s.snapshot),characters:s.snapshot.characters,threads:s.snapshot.threads,timeline_tail:s.snapshot.timeline.slice(-5),ledger:Object.fromEntries(Object.entries(s.snapshot.ledger).filter(([id,v])=>!['resolved','intentional-open'].includes(v.status))),other_ids:Object.entries(s.snapshot.ledger).filter(([id,v])=>['resolved','intentional-open'].includes(v.status)).map(([id,v])=>({id,status:v.status,statement:v.statement}))},null,2));
}
if(mode==='clock'){console.log(JSON.stringify({now:new Date().toISOString(),elapsed_s:Math.round((Date.now()-Date.parse('2026-10-16T11:20:29.717Z'))/1000)}));}
if(mode==='ledger-index'){
 const s=JSON.parse(fs.readFileSync(path.join(project,'.writer/state.json'),'utf8'));
 const rows=Object.entries(s.snapshot.ledger).filter(([id,v])=>!['resolved','intentional-open'].includes(v.status)).map(([id,v])=>({id,type:v.type,status:v.status,due_unit:v.due_unit,statement:v.statement,author_truth:v.author_truth,reader_known:v.reader_known,custody:v.custody,known_first_current:Object.fromEntries(Object.entries(v.character_known??{}).map(([k,x])=>[k,x.split(/；历史有效信息|；保留有效历史|；截至第/)[0]])),evidence_units:[...new Set(v.evidence.map(e=>e.unit))]}));
 save('ledger-recovery-index.json',{state_sha256:hash(path.join(project,'.writer/state.json')),rows});console.log(JSON.stringify(rows,null,2));
}
