import fs from 'node:fs';import path from 'node:path';import {isDeepStrictEqual as same} from 'node:util';
import {stage,work,read,write,hash,runner,cli,manifest} from './phase.mjs';
const action=process.argv[2],sf=path.join(work,'.writer/state.json');
if(action==='prepare'){
 const s=read(sf);if(s.revision!==326||s.units.length!==90)throw Error('Unexpected correction base');
 const root=path.join(stage,'candidate-r326');if(fs.existsSync(root))throw Error('Candidate archive exists');
 fs.cpSync(work,path.join(root,'work'),{recursive:true,errorOnExist:true,force:false});
 const live=manifest(work);if(!same(live,manifest(path.join(root,'work'))))throw Error('Candidate freeze mismatch');write(path.join(root,'manifest.json'),live);
 for(const name of ['inputs','templates','contexts','transitions','reviews','desired-snapshots.json','desired-field-edits.json','snapshot-rules.json','actual-snapshots.json','actual-desired-differences.json','final-structural-audit.json','final-checks.json','final-transitions.json','final-reviews.json','final-focused-ledger.json','export-result.json'])fs.cpSync(path.join(stage,name),path.join(root,'aux',name),{recursive:true,errorOnExist:true,force:false});
 const desired=read(path.join(stage,'desired-snapshots.json')),changes=[];
 for(let n=80;n<=90;n++){
  const v=desired[n].ledger.T_SHOP_SEAT_TRIAL_76,before=v.reader_known;
  if(!before.includes('不称沈连续亲验三小时'))throw Error('Correction exact sentence absent '+n);
  v.reader_known=before.replace('不称沈连续亲验三小时','不称沈完整亲验三晨各75分钟');changes.push({unit:n,path:'snapshot.ledger.T_SHOP_SEAT_TRIAL_76.reader_known',before,after:v.reader_known,basis:'76原约9:30—10:45，80仅46局部与48后段亲见、47及46其余为当事人口述'});
 }
 write(path.join(stage,'desired-snapshots.json'),desired);write(path.join(stage,'late-duration-correction.json'),changes);
 const r=cli('correction-rewind-from80',['rewind','--from','80','--expected-revision','326']);if(r.exit_code)throw Error(r.stderr);
 const a=read(sf);if(!same(a.units,s.units.slice(0,79)))throw Error('Correction prefix79 changed');
 write(path.join(stage,'correction-rewind-verification.json'),{before_revision:326,after_revision:a.revision,from:80,prefix79_registration_equal:true,state_before:live['.writer/state.json'],state_after:hash(fs.readFileSync(sf)),candidate_archive:'candidate-r326/work'});console.log(JSON.stringify({rewound_from:80,revision:a.revision}));
}
if(action==='batch'){
 const from=Number(process.argv[3]),to=Number(process.argv[4]),notes=process.argv[5];if(!notes)throw Error('Notes required');
 function run(file,args,label){const r=runner.run(process.execPath,[path.join(stage,file),...args],label);if(r.exit_code)throw Error(r.stderr||r.stdout);return r;}
 // These body bytes were just read in full in this session during the first rebuild.
 // Reuse the actual reading entries explicitly; do not invent a second full reading.
 const readings=fs.readFileSync(path.join(stage,'reading.jsonl'),'utf8').trim().split(/\r?\n/).map(JSON.parse),old=read(path.join(stage,'before/work/.writer/state.json'));
 const bindings=[];for(let n=Math.min(from,to-5);n<=to;n++){const u=old.units[n-1],sha=hash(fs.readFileSync(path.join(work,u.draft))),entry=readings.findLast(x=>x.file===u.draft&&x.sha256===sha&&x.coverage==='full'&&x.purpose?.startsWith('rebuild-'));if(!entry)throw Error('Actual current-byte full reading absent '+n);bindings.push({unit:n,file:u.draft,sha256:sha,reused_actual_read_at:entry.at,purpose:entry.purpose,additional_full_read_claimed:false});}write(path.join(stage,`correction-reading-bindings/${to}.json`),bindings);
 for(let n=from;n<=to;n++){run('manage.mjs',['input',String(n)],`correction-input-${n}-helper`);run('manage.mjs',['record',String(n)],`correction-record-${n}-helper`);console.log(JSON.stringify({recorded:n,correction_done:n-79,total:11}));}
 if(to%3===0){run('review.mjs',[String(to),notes,'final'],`correction-review-${to}-helper`);console.log(JSON.stringify({review:[to-5,to]}));}
}
