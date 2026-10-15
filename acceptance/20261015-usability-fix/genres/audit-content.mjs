import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
const base='acceptance/20261015-usability-fix';
const evidence=`${base}/genres`;
const sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const load=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const write=(p,v)=>fs.writeFileSync(p,typeof v==='string'?v:JSON.stringify(v,null,2)+'\n',{flag:'wx'});
const manifest=load(`${evidence}/baseline-manifest.json`);
const result={scope:'内容机械保护核对；不替代实读和文体判断',checks:[],works:[]};
const check=(label,fn)=>{fn();result.checks.push({label,ok:true});};
for(const c of manifest.copies){
 const p=c.draft.slice(0,c.draft.indexOf('/正文/'));
 const before=fs.readFileSync(c.backup,'utf8');
 const after=fs.readFileSync(c.draft,'utf8');
 const b=before.split(/\r?\n/),a=after.split(/\r?\n/);
 check(`${c.kind}:input/backup/baseline-record exact bytes`,()=>{
   assert.equal(sha(c.input),c.input_sha256);assert.equal(sha(c.backup),c.input_sha256);
   const record=load(`${evidence}/cli/${c.kind==='screenplay'?'009-record-screenplay-baseline':'010-record-history-baseline'}.json`);
   assert.equal(JSON.parse(record.stdout).sha256,c.input_sha256);
 });
 if(c.kind==='screenplay'){
   const oldLines=b.map(s=>s.match(/^(许安|方姐).*?：“(.*)”$/)).filter(Boolean).map(m=>({role:m[1],text:m[2]}));
   const newLines=a.flatMap((s,i)=>['许安','方姐'].includes(s)?[{role:s,text:a[i+1]}]:[]);
   check('screenplay:all 7 dialogue blocks exact, with roles and order',()=>{assert.equal(oldLines.length,7);assert.deepEqual(newLines,oldLines);});
   check('screenplay:all original scene/prop handling lines preserved',()=>{for(const i of [2,4,14,18])assert(a.includes(b[i]));});
   const tokens=s=>s.match(/[零一二三四五六七八九十百千两\d]+[把点晚]/g);
   check('screenplay:quantity/time tokens identical in order',()=>assert.deepEqual(tokens(after),tokens(before)));
   check('screenplay:retained breath and no added dialogue',()=>assert(a.includes('方姐深吸一口气。')));
   result.screenplay_dialogue=newLines;result.screenplay_quantity_time_tokens=tokens(after);
 }else{
   const quotes=s=>[...s.matchAll(/“([^”]*)”/g)].map(m=>m[1]);
   check('history:all quoted strings unchanged in order',()=>assert.deepEqual(quotes(after),quotes(before)));
   check('history:block quotation byte content preserved',()=>assert.deepEqual(a.filter(s=>s.startsWith('> ')),b.filter(s=>s.startsWith('> '))));
   check('history:entire numeric opening and evidence-boundary paragraph preserved',()=>{assert(a.includes(b[2]));assert(a.includes(b[8]));});
   check('history:classification procedure unchanged',()=>assert(a.includes(b[6].split('。')[0]+'。')));
   check('history:small printing limitation unchanged',()=>assert(a.includes(b[10].slice(0,b[10].indexOf('读到这里')))));
   check('history:fact card bytes identical including all excerpts/boundaries/dependencies',()=>assert.equal(sha(`${p}/研究/history-facts.json`),sha(`${base}/fixtures/history-facts.json`)));
   check('history:three supplied claims read-copy present',()=>assert.equal(load(`${p}/研究/history-facts.json`).claims.length,3));
   result.history_quotes=quotes(after);result.fact_card_sha256=sha(`${p}/研究/history-facts.json`);
 }
 const afterHash=sha(c.draft),afterFile=`${p}/审查/去味-0001-${afterHash.slice(0,8)}-after.md`;
 fs.copyFileSync(c.draft,afterFile,fs.constants.COPYFILE_EXCL);
 const diff=spawnSync('git',['diff','--no-index','--text','--',c.backup,afterFile],{encoding:'utf8'});
 if(![0,1].includes(diff.status))throw new Error(diff.stderr);
 write(`${p}/审查/去味-0001-实际差异.diff`,diff.stdout);
 const hashes={kind:c.kind,before:{path:c.backup,sha256:sha(c.backup)},after:{path:afterFile,sha256:afterHash},current_draft:{path:c.draft,sha256:afterHash},baseline_revision:1,rewound_revision:2};
 write(`${p}/审查/去味-0001-前后哈希.json`,hashes);
 result.works.push(hashes);
}
write(`${evidence}/content-preservation.json`,result);
console.log(JSON.stringify(result,null,2));
