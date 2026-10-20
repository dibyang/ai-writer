import path from 'node:path';import {U,json,run} from './final-b-run.mjs';
const s=json(path.join(U,'final-b-revision-session.json'));
run('38-record-replay-third',['record','--input','.writer/drafts/final-b-resume-replay-3-valid.json','--revision-token',s.token],s.workspace);
const log=console.log;console.log=()=>{};let review;try{review=JSON.parse(run('39-final-tail-review-template',['review-template','--from','2','--to','3','--out','.writer/drafts/final-b-resume-tail-review-before.json','--revision-token',s.token],s.workspace));}finally{console.log=log;}console.log(JSON.stringify(review,null,2));
