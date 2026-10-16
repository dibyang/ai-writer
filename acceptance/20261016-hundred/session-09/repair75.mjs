import fs from 'node:fs';
import path from 'node:path';
import {isDeepStrictEqual as same} from 'node:util';
import {stage,work,cli} from './run-cli.mjs';
import {sha,save,state,must,logReading} from './ops.mjs';
import {replaySnapshots,changesBetween} from '../rebuild-utils.mjs';
const root=path.join(stage,'continuity-repair');
const all=p=>fs.readdirSync(p,{withFileTypes:true}).flatMap(e=>e.isDirectory()?all(path.join(p,e.name)):[path.join(p,e.name)]);
const action=process.argv[2];
if(action==='freeze'){
 if(fs.existsSync(path.join(root,'before')))throw Error('Before already exists');
 const s=state(),snapshots=replaySnapshots(work,s);fs.mkdirSync(root,{recursive:true});
 save(path.join(root,'replayed-before.json'),{revision:s.revision,units:s.units,snapshots});
 const dest=path.join(root,'before/work');fs.cpSync(work,dest,{recursive:true,errorOnExist:true});
 fs.cpSync(path.join(stage,'new-inputs'),path.join(root,'before/inputs'),{recursive:true,errorOnExist:true});
 const files=all(work).map(p=>({path:path.relative(work,p).replaceAll('\\','/'),sha256:sha(p)}));
 for(const e of files)if(sha(path.join(dest,e.path))!==e.sha256)throw Error(`Copy mismatch ${e.path}`);
 const journals=s.units.map(u=>({unit:u.unit,path:u.journal,source_sha256:sha(path.join(work,u.journal)),copy_sha256:sha(path.join(dest,u.journal))}));
 if(journals.some(x=>x.source_sha256!==x.copy_sha256))throw Error('Journal mismatch');
 save(path.join(root,'before/sha256.json'),{captured_at:new Date().toISOString(),revision:s.revision,state_sha256:sha(path.join(work,'.writer/state.json')),files,active_journals:journals});
 save(path.join(root,'scope.json'),{earliest_unit:75,before_revision:s.revision,affected:[75,76,77,78],source_consumption:[{unit:76,source:s.units[74].draft},{unit:77,source:s.units[75].draft},{unit:78,source:s.units[76].draft}],change:{draft:s.units[74].draft,before:'沟口今天没有昨天那团软纸',after:'沟口今天没有前日那团软纸',reason:'75的45日所指为71第43日软纸，73第44日转述未使软纸重现；不改71初始观察，不改变实际清走的时点或人物知识。'},authority:'read-only replay for per-unit desired snapshots; all writes through native CLI'});
 console.log(JSON.stringify({revision:s.revision,files:files.length,journals:journals.length,verified:true}));
}
if(action==='rewind75'){
 const before=JSON.parse(fs.readFileSync(path.join(root,'before/sha256.json'),'utf8'));
 if(sha(path.join(work,'.writer/state.json'))!==before.state_sha256)throw Error('Authority drift');
 const r=must(cli(['rewind','--from','75','--expected-revision',String(state().revision)],'continuity-rewind-75'));
 save(path.join(root,'rewind.json'),r);console.log(JSON.stringify(r));
}
if(action==='prepare75'){
 const n=Number(process.argv[3]),s=state(),old=JSON.parse(fs.readFileSync(path.join(root,'replayed-before.json'),'utf8')).units.find(u=>u.unit===n);
 if(s.units.length!==n-1)throw Error('Unexpected range');
 must(cli(['plan','--input',path.join(work,`大纲/单元/${String(n).padStart(4,'0')}.json`)],`continuity-plan-${n}`));
 const context=must(cli(['context','--unit',String(n),'--max-chars','160000'],`continuity-context-${n}`));save(path.join(root,`inputs/${n}-context.json`),context);
 const template=must(cli(['record-template','--unit',String(n),'--draft',old.draft],`continuity-template-${n}`));save(path.join(root,`inputs/${n}-template.json`),template);
 console.log(JSON.stringify({unit:n,expected_revision:template.expected_revision,source_hashes:template.source_hashes}));
}
if(action==='record75'){
 const n=Number(process.argv[3]),s=state(),old=JSON.parse(fs.readFileSync(path.join(root,'replayed-before.json'),'utf8')),u=old.units.find(u=>u.unit===n);
 const t=JSON.parse(fs.readFileSync(path.join(root,`inputs/${n}-template.json`),'utf8'));
 const input={...t,summary:u.summary,changes:changesBetween(s.snapshot,old.snapshots[n],n)};save(path.join(root,`inputs/${n}-record.json`),input);
 const r=must(cli(['record','--input',path.join(root,`inputs/${n}-record.json`)],`continuity-record-${n}`));
 const after=state();save(path.join(root,`snapshots/${n}.json`),after);
 const normal=v=>{v=structuredClone(v);for(const e of Object.values(v.ledger)){delete e.updated_unit;for(const a of e.evidence??[]){delete a.sha256;delete a.line;}}return v;};
 if(!same(normal(after.snapshot),normal(old.snapshots[n])))throw Error('Semantic snapshot mismatch');
 logReading(u.draft,'第75章日期词纠错：正式回退后完整实读逐章重登',{unit:n});
 const check=must(cli(['check'],`continuity-check-${n}`));console.log(JSON.stringify({unit:n,revision:after.revision,record:r,findings:check.findings,pending_windows:check.rolling_review.pending_windows}));
}
