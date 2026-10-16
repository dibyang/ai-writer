import fs from 'node:fs';
import {spawnSync} from 'node:child_process';
const stage='acceptance/20261016-expanded/session-e';
const work='acceptance/20261016-expanded/works/潮汐信号';
const [action,num,suffix]=process.argv.slice(2),n=Number(num),prefix=String(n)+(suffix?'-'+suffix:'');
function cli(label,args){const r=spawnSync(process.execPath,[`${stage}/cli.mjs`,label,...args],{encoding:'utf8',maxBuffer:32*1024*1024});if(r.status!==0){process.stdout.write(r.stdout);process.stderr.write(r.stderr);process.exit(r.status??1);}return JSON.parse(r.stdout);}
if(action==='prepare'){
 const p=JSON.parse(fs.readFileSync(`${stage}/${n}-plan.json`));
 console.log(JSON.stringify(cli(`${prefix}-plan`,['plan','--input',`${stage}/${n}-plan.json`])));
 const c=cli(`${prefix}-context`,['context','--unit',String(n),'--max-chars','60000']);
 fs.writeFileSync(`${stage}/${n}-context.json`,JSON.stringify(c,null,2)+'\n');
 const t=cli(`${prefix}-template`,['record-template','--unit',String(n),'--draft',`正文/${String(n).padStart(4,'0')}-${p.title}.md`]);
 fs.writeFileSync(`${stage}/${n}-template.json`,JSON.stringify(t,null,2)+'\n');
 console.log(JSON.stringify({context_keys:Object.keys(c),template:t}));
}else if(action==='record'){
 const raw=fs.readFileSync(`${work}/.writer/state.json`);fs.writeFileSync(`${stage}/${n}-before-record-state.json`,raw);
 const s=JSON.parse(raw),t=JSON.parse(fs.readFileSync(`${stage}/${n}-template.json`));
 const u=JSON.parse(fs.readFileSync(`${stage}/${n}-changes.json`));
 const input=t.template??t;input.summary=u.summary;input.changes=u.changes;
 for(const [name,txt] of Object.entries(input.changes.characters??{})) input.changes.characters[name]=txt+'；此前已知与经历：'+(s.snapshot.characters[name]??'');
 for(const [id,v] of Object.entries(input.changes.ledger??{})) for(const [name,txt] of Object.entries(v.character_known??{})){const old=s.snapshot.ledger[id]?.character_known?.[name];if(old)v.character_known[name]=txt+'；此前知情保留：'+old;}
 fs.writeFileSync(`${stage}/${n}-record.json`,JSON.stringify(input,null,2)+'\n');
 console.log(JSON.stringify(cli(`${prefix}-record`,['record','--input',`${stage}/${n}-record.json`])));
 console.log(JSON.stringify(cli(`${prefix}-check`,['check'])));
}else throw new Error('unknown action');
