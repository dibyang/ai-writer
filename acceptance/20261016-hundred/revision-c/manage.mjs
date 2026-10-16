import fs from 'node:fs';import path from 'node:path';import {isDeepStrictEqual as same} from 'node:util';
import {stage,work,read,write,hash,runner,cli} from './phase.mjs';import {changesBetween} from '../rebuild-utils.mjs';
const action=process.argv[2],statefile=path.join(work,'.writer/state.json');
if(action==='drift'){
 const results=[];for(const[label,args]of [['drift-status',['status']],['drift-context91',['context','--unit','91']],['drift-blocked-export',['export','--out',path.join(stage,'blocked-export')]]]){const before=hash(fs.readFileSync(statefile));const r=cli(label,args);const after=hash(fs.readFileSync(statefile));results.push({label,exit_code:r.exit_code,before,after,unchanged:before===after,stdout:r.stdout,stderr:r.stderr});console.log(r.stdout||r.stderr);}write(path.join(stage,'drift-evidence.json'),{results,blocked_export_exists:fs.existsSync(path.join(stage,'blocked-export'))});
}
if(action==='preflight'){
 const desired=read(path.join(stage,'desired-snapshots.json'));const old=read(path.join(stage,'before/work/.writer/state.json'));
 const counts=old.units.filter(u=>u.unit>=25).map(u=>{const text=fs.readFileSync(path.join(work,u.draft),'utf8').replace(/^#.*(?:\r?\n|$)/,'');return {unit:u.unit,draft:u.draft,sha256:hash(fs.readFileSync(path.join(work,u.draft))),han:[...text.matchAll(/\p{Script=Han}/gu)].length};});if(counts.some(x=>x.han<2400||x.han>3200))throw Error('Han count outside bounds');
 for(let n=41;n<=90;n++)changesBetween(desired[n-1],desired[n],n);
 const residuals=[];function walk(v,p,n){if(typeof v==='string'&&/(?:八十|(?<!\d)80(?!\d)|第四遍|10:30|十点半|全时窗)/.test(v))residuals.push({unit:n,path:p,value:v});else if(v&&typeof v==='object')for(const[k,x]of Object.entries(v))if(k!=='evidence')walk(x,p+'.'+k,n);}walk(desired[90],'snapshot',90);
 write(path.join(stage,'han-counts-before-rebuild.json'),counts);write(path.join(stage,'residuals.json'),residuals);
 const summaries=old.units.filter(u=>u.unit>=41&&/80|八十|第四遍|10:30|十点半|全时窗/.test(u.summary)).map(u=>({unit:u.unit,summary:u.summary}));write(path.join(stage,'summary-candidates.json'),summaries);
 console.log(JSON.stringify({count_bounds:[Math.min(...counts.map(x=>x.han)),Math.max(...counts.map(x=>x.han))],deltas:50,summaries,residuals:residuals.length,tool_hashes:{main:hash(fs.readFileSync('lib/longform.mjs')),builtin:hash(fs.readFileSync(path.join(work,'.writer/tool/lib/longform.mjs')))}}));
}
if(action==='rewind'){
 const old=read(path.join(stage,'before/work/.writer/state.json'));const s=read(statefile);if(s.revision!==275||s.units.length!==90)throw Error('Unexpected state');const r=cli('rewind-from41',['rewind','--from','41','--expected-revision','275']);if(r.exit_code)throw Error(r.stderr);const after=read(statefile);if(!same(after.units,old.units.slice(0,40)))throw Error('Prefix records changed');write(path.join(stage,'rewind-verification.json'),{before_sha256:hash(fs.readFileSync(path.join(stage,'before/work/.writer/state.json'))),after_sha256:hash(fs.readFileSync(statefile)),revision:after.revision,units:after.units.length,prefix_records_equal:true,retained_body_count:fs.readdirSync(path.join(work,'正文')).length});console.log(r.stdout);
}
if(action==='input'){
 const n=Number(process.argv[3]),s=read(statefile),old=read(path.join(stage,'before/work/.writer/state.json')),desired=read(path.join(stage,'desired-snapshots.json'));if(s.units.length!==n-1)throw Error('Wrong next unit');
 const c=cli(`context-${n}`,['context','--unit',String(n),'--max-chars','350000']);if(c.exit_code)throw Error(c.stderr);const context=runner.json(`context-${n}-cli`);write(path.join(stage,`contexts/${n}.json`),context);
 const t=cli(`template-${n}`,['record-template','--unit',String(n),'--draft',old.units[n-1].draft]);if(t.exit_code)throw Error(t.stderr);const template=runner.json(`template-${n}-cli`);write(path.join(stage,`templates/${n}.json`),template);
 const input=structuredClone(template);input.summary=read(path.join(stage,'desired-summaries.json'))[n-1].summary;input.changes=changesBetween(s.snapshot,desired[n],n);
 if(n===90)for(const id of ['T_PAGE_PAIR','T_VOICE_CONSENT']){const delta=input.changes.ledger[id];if(!delta)throw Error('Missing late scope delta');delta.evidence.push({unit:27,quote:'沈禾将有邱当面改词的这一页留给她，只带走自己的笔记'});}
 write(path.join(stage,`inputs/${n}.json`),input);write(path.join(stage,`transitions/${n}-before.json`),{unit:n,revision:s.revision,state_sha256:hash(fs.readFileSync(statefile)),snapshot:s.snapshot,body_sha256:hash(fs.readFileSync(path.join(work,input.draft))),source_hashes:input.source_hashes,input_sha256:hash(fs.readFileSync(path.join(stage,`inputs/${n}.json`)))});
 console.log(JSON.stringify({unit:n,expected_revision:input.expected_revision,keys:Object.keys(input),changes:{characters:Object.keys(input.changes.characters??{}),ledger:Object.keys(input.changes.ledger??{}),timeline_append:input.changes.timeline_append}}));
}
if(action==='record'){
 const n=Number(process.argv[3]);const input=read(path.join(stage,`inputs/${n}.json`));const log=fs.readFileSync(path.join(stage,'reading.jsonl'),'utf8').trim().split(/\r?\n/).map(JSON.parse);const bodySHA=hash(fs.readFileSync(path.join(work,input.draft)));if(!log.some(x=>x.file===input.draft&&x.sha256===bodySHA&&x.coverage==='full'))throw Error('No actual full read for current bytes');
 const r=cli(`record-${n}`,['record','--input',path.join(stage,`inputs/${n}.json`)]);if(r.exit_code)throw Error(r.stderr);const s=read(statefile);write(path.join(stage,`transitions/${n}-after.json`),{unit:n,revision:s.revision,state_sha256:hash(fs.readFileSync(statefile)),snapshot:s.snapshot,record:s.units.at(-1)});console.log(r.stdout);
}
