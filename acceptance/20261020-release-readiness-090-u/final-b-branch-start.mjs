import fs from 'node:fs';import path from 'node:path';import {U,W,write,json,hash,run} from './final-b-run.mjs';
const q=json(path.join(U,'final-b-revision-session.json'));const B=q.workspace;
const baseline=json(path.join(U,'final-b-main-revision-baseline.json'));for(const u of baseline.units){if(hash(path.join(W,u.draft))!==u.sha256||hash(path.join(B,u.draft))!==u.sha256)throw Error('body baseline differs');}
if(hash(path.join(W,'.writer/state.json'))!==baseline.state_sha256)throw Error('main state drift');
run('22-branch-status',['status'],B);
run('23-branch-identify',['tool','identify'],B);
run('24-branch-rewind',['rewind','--from','2','--expected-revision',String(q.base_revision),'--revision-token',q.token],B);
const files=[];for(const u of baseline.units){if(u.unit<2)continue;const f=path.join(B,u.draft);const bytes=fs.readFileSync(f);const saved=path.join(U,'final-b-revision-before',u.draft);fs.mkdirSync(path.dirname(saved),{recursive:true});if(fs.existsSync(saved))throw Error('snapshot exists');fs.writeFileSync(saved,bytes);let text=bytes.toString('utf8');const occurrences=[...text.matchAll(/三十元/g)].length;if(occurrences!==(u.unit===2?2:1))throw Error('unexpected ordinary price locations');text=text.replaceAll('三十元','三十五元');fs.writeFileSync(f,text,'utf8');files.push({unit:u.unit,draft:u.draft,before_sha256:u.sha256,after_sha256:hash(f),replacements:occurrences,backup:saved});}
write(path.join(U,'final-b-revision-edits.json'),{scope:{from:2,through:3},files,note:'只在本ID独立区替换实际普通报价句；主稿、原片段和来源不改。'});
if(hash(path.join(W,'.writer/state.json'))!==baseline.state_sha256)throw Error('main state changed');for(const u of baseline.units)if(hash(path.join(W,u.draft))!==u.sha256)throw Error('main body changed');
run('25-branch-replay-2',['revision','replay-input','--unit','2','--revision-token',q.token,'--out','.writer/drafts/final-b-replay-2-before.json'],B);
